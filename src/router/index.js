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
  }
]

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: defaultsRouterMap
})


export const devEopsRouterMap = [
  {
    path:'',
    component: layout,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '仪表盘',icon:'dashboard',hidden:false}
    }]
  },{
    path: '/timeline',
    component: layout,
    meta:{title: '时间线',icon:'clock-o'},
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '概况',icon:'dashboard',hidden:false}
    },{
      path: 'record',
      component: _import('dashboard/index'),
      name: 'record',
      meta: { title: '记录',icon:'thumb-tack',hidden:false}
    },{
      path: 'plan',
      component: _import('dashboard/index'),
      name: 'plan',
      meta: { title: '计划',icon:'hourglass-half',hidden:false}
    }]
  },{
    path: '/manager',
    component: layout,
    meta:{title: '资产管理',icon:'truck'},
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '概况',icon:'dashboard',hidden:false}
    },{
      path: 'group',
      component: _import('dashboard/index'),
      name: 'group',
      meta: { title: '应用组',icon:'server',hidden:false}
    },{
      path: 'host',
      component: _import('dashboard/index'),
      name: 'host',
      meta: { title: '主机',icon:'laptop',hidden:false}
    },{
      path: 'storage',
      component: _import('dashboard/index'),
      name: 'storage',
      meta: { title: '存储',icon:'hdd-o',hidden:false}
    },{
      path: 'search',
      component: _import('dashboard/index'),
      name: 'search',
      meta: { title: '搜索',icon:'search',hidden:false}
    }]
  }
]
