import { defaultsRouterMap, devEopsRouterMap } from '@/router'
import { isAdmin } from "@/api/login";
import store from '@/store'
function reflushRouter(devEopsRouterMap, isadmin){
  if(isadmin === true){
    return devEopsRouterMap
  }else{
    return []
  }
}

const permission = {
  state: {
    routers: []
  },
  mutations: {
    SET_ROUTERS: (state,routers)=>{
      state.routers = defaultsRouterMap.concat(routers)
    }
  },
  actions: {
    generateRouter({commit}){
      if(state.isadmin){
        commit('SET_ROUTERS',devEopsRouterMap)
        resolve()
      }else{
        commit('SET_ROUTERS',[])
        resolve()
      }
    }
  }
}

export default permission
