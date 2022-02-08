import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import config from './config'
import { ResponseCode } from '@/enums/Resonponse'
import { message } from 'ant-design-vue'
import { getPiniaToken, clearPiniaStore } from '@/utils/auth'
import router from '@/router'
import { RouteLocationRaw } from 'vue-router'

const service: AxiosInstance = axios.create(config)

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getPiniaToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 默认设置接口请求超时时间为30秒，如果是下载接口，超时时间设为5分钟
    if (config.responseType === 'blob') {
      config.timeout = 5 * 60 * 1000
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log('res', res)
    console.log('router', router)
    const contentType = res.headers['content-type']
    if (contentType.indexOf('application/octet-stream') !== -1) {
      const data = res.data
      res.data = {
        code: ResponseCode.Success,
        message: 'ok',
        data,
      }
      return res
    }
    if (res.data.code !== ResponseCode.Success) {
      if (res.data.code === ResponseCode.InvalidToken) {
        // 清空localstorage & 跳登录页
        const { fullPath } = router.currentRoute.value
        const to: RouteLocationRaw = {
          path: '/login',
        }
        if (fullPath) {
          to.query = {
            redirect: fullPath,
          }
        }
        clearPiniaStore()
        router.push(to)
      } else {
        if (res.data instanceof Blob) {
          // 解决blob下载异常的提示
          const reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
          reader.onload = function () {
            const data = JSON.parse(reader.result as string)
            message.error(data.msg)
          }
        } else {
          res.data.msg ? message.error(res.data.msg) : message.error('请求数据异常～')
        }
      }
      return Promise.reject(res)
    }
    return res
  },
  (error: AxiosError) => {
    // 网络层面错误，如接口地址写错了会走到这里
    message.error(error.response?.statusText || error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
