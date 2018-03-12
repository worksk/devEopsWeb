import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken } from "@/utils/auth"

function hasPermission(roles,permissionRoles){
  return true
}
router.beforeEach((to,from,next)=>{
  if(getToken()){//登陆
    if(to.path === '/login'){
      next('/dashboard')
    }else{
      if(!store.getters.islogin){
        store.dispatch('UserInfo').then(()=>{ //判断用戶权限
          store.dispatch('GenerateRouter').then(()=>{
            router.addRoutes(store.getters.routers)
            next({...to})
          })
        }).catch(()=>{
          store.dispatch('FedLogOut').then(()=>{
            next('/login')
          })
        })
      }else{
        next()
      }
    }
  }else{//未登陆
    if(to.path=='/login'){
      next()
    }else{
      Message.error('请重新登陆')
      next('/login')
    }
  }

})
