import axiosService from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

/* 创建axios实例 */
const axios = axiosService.create({
  baseURL: '/', /* 在config/dev.evn.js、prod.evn.js里面进行配置 */
  timeout: 60000 /* 设置超时时间为5s */
});


/* request拦截器 ==> 对请求参数进行处理 */
axios.interceptors.request.use(config => {
  console.log(`请求携带Token：${store.getters.token}`)
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return config
}, error => {
  Message.error('请求失败')
  Promise.reject(error)
})

/* response拦截器 ==> 对响应做处理 */
axios.interceptors.response.use(
  response => {
    // console.log(response.data.code)
    if (response.data.status == '200') {
      return response
    } else {
      Message.error(response.data.msg)
      return Promise.reject(response.data.msg)
    }
  }, error => {
    /* 判断error的status代码，并将对应的信息告知用户 */
    let text = ''
    let err = JSON.parse(JSON.stringify(error))
    if (err.response) {
      switch (error.response.status) {
        case 400:
          text = '请求错误(400)'
          break
        case 401:
          text = '请求超时(401)'
          // return this.$router.replace('/Login')
          break
        case 403:
          text = '拒绝访问(403)'
          break
        case 404:
          text = '请求出错(404)'
          break
        case 408:
          text = '请求超时(408)'
          break
        case 500:
          text = '服务器错误(500)'
          break
        case 501:
          text = '服务未实现(501)'
          break
        case 502:
          text = '网络错误(502)'
          break
        case 503:
          text = '服务不可用(503)'
          break
        case 504:
          text = '网络超时(504)'
          break
        case 505:
          text = 'HTTP版本不受支持(505)'
          break
        default:
          text = '网络连接出错'
      }
    } else {
      text = '连接服务器失败,请退出重试!'
    }
    Message.error(text)
    return Promise.reject(error)
  }
)

/* 将写好的axios实例暴露出去 */
export default axios