// import { store } from '@/store'
// import { useMenusStore } from '@/pinia/modules/menus'
// import { MenuRaw } from '@/router/menus'
import { AxiosResponse } from 'axios'
import { RouteRecordRaw } from 'vue-router'

// @TODO: children使用动态属性
export interface NestedObj<T> {
  [k: string]: any
  children: Array<NestedObj<T>>
}

// @TODO: 添加children参数
/**
 * 多维嵌套对象数组展平为一维对象数组
 * @param array
 */
export function flatObjectArray<T>(array: Array<NestedObj<T>>): Array<NestedObj<T>> {
  const res: Array<NestedObj<T>> = []
  function recursive(target: Array<NestedObj<T>>) {
    target.forEach((item: NestedObj<T>) => {
      res.push(item)
      // eslint-disable-next-line no-prototype-builtins
      if (item.hasOwnProperty('children') && item.children.length) {
        recursive(item.children)
      }
    })
  }
  recursive(array)
  return res
}

/**
 * 把双引号转义成反斜杠加双引号，即 `"` 转义成 `\"`
 * @param str
 */
export function escapeQuote(str: string): string {
  return str.replace(/"/g, '\\"')
}

/**
 * 移除字符串中的反斜杠 `\`
 * @param str
 */
export function removeBackslash(str: string): string {
  return str.replace(/\\/g, '')
}

/**
 * 获取权限菜路由中的第一个路由path
 */
export function getFirstRoutePath(): string {
  // const menusStore = useMenusStore()
  // console.log(1, 'menusStore', menusStore, menusStore.menus)
  // const menus = menusStore.menus
  // if (!menus.length) {
  //   return ''
  // }
  // const recursive = (m: MenuRaw[]): string => {
  //   const first = m[0]
  //   const children = first.children
  //   if (children.length) {
  //     return recursive(children)
  //   } else {
  //     return first.path
  //   }
  // }
  // return recursive(menus)
  return '/system/menu'
}

/**
 * 下载文件
 * @param blob 要下载为文件的blob对象
 * @param filename 要下载的文件名称
 */
export function downloadFile(blob: Blob, filename: string) {
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * 封装根据axios response下载流文件的过程
 * @param response
 */
export function downloadFileFromResponse(response: AxiosResponse) {
  const blob = response.data.data
  console.log('blob:', typeof blob, blob)
  const headers = response.headers
  // 研发环境和线上环境返回的头大小写不一样...
  const disposition = headers['Content-disposition'] || headers['content-disposition'] || ''
  // const disposition = headers["Content-disposition"] || "";
  let filename = disposition.split('Filename=')[1] || disposition.split('filename=')[1]
  filename = decodeURI(escape(filename))
  console.log('disposition,filename', disposition, filename)
  downloadFile(blob, filename)
}

export function downloadFileFromUrl(url: string, filename: string) {
  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: 'cors',
  })
    .then((res) => res.blob())
    .then((blob) => {
      downloadFile(blob, filename)
    })
}

/**
 * blob对象转换为json
 * @param blob 要转换的
 */
export function blob2Json(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(blob)
    reader.onload = (e: any) => {
      console.log(e)
      resolve(JSON.parse(e.target.result as string))
    }
  })
}

/**
 * 求数字数组中的中位数算法
 * @param arr
 */
export function median(arr: number[]): number {
  arr.sort()
  if (arr.length % 2 === 0) {
    return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
  } else {
    return arr[Math.floor(arr.length / 2)]
  }
}

/**
 * 深拷贝，直接简单用了
 */
export function cloneDeep(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 复制到剪贴板
 * @param value 要复制的字符串
 */
export function copyToClipboard(value: string): Promise<boolean> {
  const input = document.createElement('textarea')
  input.style.position = 'absolute'
  input.style.top = '9999px'
  document.body.appendChild(input)
  input.value = value
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  return Promise.resolve(true)
}

/**
 * Ant Modal组件，在非开发环境下关闭时，偶尔会出现其透明遮罩层 .ant-modal-wrap 没有被正确的隐藏
 * 这可能是一个bug
 * 这里先粗暴的通过操作dom解决一下
 */
export function forceCloseModalWrap(selectorIndex = 0) {
  const selectors = ['.ant-modal-wrap', '.ant-image-preview-wrap']
  ;[].forEach.call(document.querySelectorAll(selectors[selectorIndex]), (item) => {
    ;(item as HTMLElement).style.display = 'none'
  })
}

export function generateRoute(menuList: Recordable[]) {
  const routes: RouteRecordRaw[] = []
  const deepList = (list: Recordable[]) => {
    while (list.length) {
      const item = list.pop() as Recordable
      if (item.action) {
        routes.push({
          name: item.component,
          path: item.path,
          meta: {
            title: item.menuName,
          },
          component: item.component,
        })
      }
      if (item.children && !item.action) {
        deepList(item.children)
      }
    }
  }
  deepList(menuList)
  return routes
}
