/* eslint-disable prefer-const */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = sessionStorage.getItem('token')
  if (token) {
    if (to.path === '/login') {
      next()
    } else {
      if (store.getters.name.length == 0) {
        store.dispatch('GetInfoss').then(() => { // 拉取用户信息
          router.addRoutes(store.getters.routers)//添加后台路由表
          next({ ...to, replace: true })
        }).catch(e => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录'+e.message)
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      NProgress.done()
      store.dispatch('FedLogOut').then(() => {
        Message.error('身份失效,请重新登录')
        next({ path: '/login' })
      })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})