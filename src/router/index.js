import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_route')

Vue.use(Router)

export const defaultsRouterMap = [
    {
        path: '/404',
        name: '404',
        component: _import('error/404'),
        hidden: true,
        meta: {
          roles: ['all']
        }
    },{
        path: '/login',
        name: 'login',
        component: _import('login/index'),
        hidden: true,
        meta: {
          roles: ['all']
        }
    }
]

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: defaultsRouterMap
})


export const devEopsRouterMap = [
  {

  }
]
