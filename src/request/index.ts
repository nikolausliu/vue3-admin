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
    if (res.data.code !== ResponseCode.SUCCESS) {
      if (res.data.code === ResponseCode.AUTH_ERROR) {
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
        res.data.msg ? message.error(res.data.msg) : message.error('请求数据异常～')
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
