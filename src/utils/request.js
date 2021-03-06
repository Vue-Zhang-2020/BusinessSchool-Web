import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// 创建axios实例
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
const service = axios.create({
  baseURL: '/', // api的base_url
  // baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非401权限不足，非20001 表示登录错误,50000以上全是错误代码
     */
    const res = response.data
    if (response.data.status == '200') {
      return response.data
    } else {
      Message.error(response.data.msg)
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
