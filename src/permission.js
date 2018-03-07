import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken } from "@/utils/auth"

function hasPermission(roles,permissionRoles){
  return true
}

const WhiteList = ['/login','/authredirect']

router.beforeEach((to,from,next)=>{
  // console.log('to')
  // console.log(to)
  // console.log('from')
  // console.log(from)
  // console.log('next')
  // console.log(next)
  if(getToken()){//登陆完毕
    if(to.path === '/login'){//跳转到主页
      next({path:'/'})
    }else{//判断权限进行跳转
      if(store.getters.roles.length ===0){
        store.dispatch('isAdmin').then(()=>{
          store.dispatch('generateRouter').then(()=>{
            router.addRoutes(store.getters.router)
            next({...to,replace:true})
          })
        }).catch(()=>{
          store.dispatch('FedLogOut').then(()=>{
            Message.error('验证错误 请重新登陆')
            next({path:'/login'})
          })
        })
      }
    }
  }else{//未登陆
    next('/login')
  }
})
