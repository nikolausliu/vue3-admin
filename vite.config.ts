import { ConfigEnv, UserConfig, loadEnv, ProxyOptions } from 'vite'
import styleImport from 'vite-plugin-style-import'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const resolve = (dir: string) => path.resolve(__dirname, '.', dir)

/**
 * 创建proxyTable
 * 首先在 .env.xxx 文件中使用 VITE_PROXY 环境变量定义不同环境的代理列表，代理规则如下：
 * 1.多个代理之间用 `|` 分割
 * 2.代理的 path 和 target 用 `,` 分割
 * 3.分隔符两侧允许多个空格
 * 4.整个 VITE_PROXY 变量不允许换行(当然了,这是.env里定义变量的基本规则)
 * @example
 * 比如,我们要定义这样一个代理
 * proxy: {'/api': {target: 'https://example.com', changeOrigin: true}, '/test': {target: 'https://example.com', changeOrigin: true}}
 * 则可以如下定义VITE_PROXY变量
 * 【good】 VITE_PROXY = /api,https://example.com|/test,https://example.com
 * 【good:分隔符两侧加入了空格】 VITE_PROXY = /api , https://example.com | /test , https://example.com
 * 【good:分隔符两侧任意多的空格都是允许的】 VITE_PROXY = /api,  https://example.com| /test,   https://example.com
 */
const createProxy = (mode: string) => {
  // VITE_PROXY = /api , https://example.com | /test , https://example.com  转换成 [['/api', 'https://example.com'], ['/test', 'https://example.com']]
  const proxyList = (loadEnv(mode, '.').VITE_PROXY as string)
    .split('|')
    .map((item) => item.split(',').map((v) => v.trim()))
  // 转换成 proxy: {'/api': {target: 'https://example.com', changeOrigin: true}, '/test': {target: 'https://example.com', changeOrigin: true}}
  const proxy = proxyList.reduce((prev, cur) => {
    prev[cur[0]] = {
      target: cur[1],
      changeOrigin: true,
    }
    return prev
  }, {}) as Record<string, ProxyOptions>
  return proxy
}

export default ({ mode }: ConfigEnv): UserConfig => {
  return {
    base: './',
    css: {
      preprocessorOptions: {
        less: {
          // @vue/cli中可以使用 style-resources-loader 来注入全局变量，vite目前只找到这种注入方法
          // 下面这个链接讨论了modifyVars.hack究竟是干什么的
          // https://stackoverflow.com/questions/60809336/customizing-ant-designs-theme-what-exactly-is-that-hack-key-in-the-modifyva
          modifyVars: {
            hack: `true; @import "${resolve('src/styles/antd.less')}";`,
            hack2: `true; @import "${resolve('src/styles/variables.less')}";`,
            hack3: `true; @import "${resolve('src/styles/transition/index.less')}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [
      vue(),
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`
            },
          },
        ],
      }),
    ],
    server: {
      proxy: createProxy(mode),
      port: 8000,
    },
  }
}
