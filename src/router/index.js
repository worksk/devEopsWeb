import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_route')
import layout from '@/views/layout'
Vue.use(Router)

export const defaultsRouterMap = [
  {
      path: '/login',
      name: 'login',
      component: _import('login/index'),
      hidden: true
  },{
    path: '/404',
    name: '404',
    component: _import('error/404'),
    hidden: true
  },{
    path: '',
    component: layout,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard',icon:'dashboard',noCache: true}
    }]
  }
]

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: defaultsRouterMap
})


export const devEopsRouterMap = [
  {
    path: '/123',
    component: layout,
    children: [{
      path: 'zzc',
      component: _import('dashboard/index'),
      name: 'zzc',
      meta: { title: 'zzc',icon:'dashboard',noCache: true}
    },{
      path: 'ddr',
      component: _import('dashboard/index'),
      name: 'ddr',
      meta: { title: 'zzc',icon:'dashboard',noCache: true}
    }]
  }
]
