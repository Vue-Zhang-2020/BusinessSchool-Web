import _import from "@/utils/_import"
import Layout from '@/layout'
import Vue from 'vue'
import router from "../router"
export default function (routers) {
  return filterAsyncRouter(routers)
}
export const filterAsyncRouter = (routers) => {
  const accessedRouters = routers.filter(route => {
    delete route.id
    if (route.component) {
      if (route.component == 'Layout') {
        if (route.path == '/firm') {
          Vue.set(route, 'alwaysShow', true)
        }
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children) {
      if (route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
    }
    return true
  })
  return accessedRouters
}