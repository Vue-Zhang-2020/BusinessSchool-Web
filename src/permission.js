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
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    // else if (to.path === '/home' || to.path === '/teaching/manager' || to.path === '/student/data' || to.path === '/unit/coop'
    //         || to.path === '/bus/business' || to.path === '/system/settings') {
    //   console.log('商管院路由监听')
    //   store.dispatch('GetTRole').then(() => { // 拉取用户信息
    //     router.addRoutes(store.getters.routers)//添加后台路由表
    //     next({ ...to, replace: true })
    //   }).catch(e => {
    //     store.dispatch('FedLogOut').then(() => {
    //       Message.error('验证失败,请重新登录'+e.message)
    //       next({ path: '/login' })
    //     })
    //   })
    //   next()
    // } 
    else {
      if (store.getters.name.length == 0) {
        store.dispatch('GetInfoss').then(() => { // 拉取用户信息
          router.addRoutes(store.getters.routers)//添加后台路由表
          next({ ...to, replace: true })
        }).catch(e => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录'+e.message)
            next({ path: '/login' })
          })
          // router.addRoutes(store.getters.routers)//添加后台路由表
          // next({ ...to, replace: true })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasLogin = localStorage.getItem('hasLogin')
//   if (hasLogin) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       next()
//       NProgress.done()
//     }
//     if (to.path === '/user/user') {
//       let id = JSON.parse(localStorage.getItem('userInfo')).id
//       console.log(id)
//       if (id > 2) {
//         next({ path: '/task' })
//         window.alert('permission denied')
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })
