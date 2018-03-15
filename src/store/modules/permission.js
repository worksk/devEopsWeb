import { defaultsRouterMap, devEopsRouterMap } from '@/router'
import { isAdmin } from "@/api/login";
import store from '@/store'
import getters from "../getters";

const permission = {
  state: {
    routers: []
  },
  mutations: {
    SET_ROUTERS: (state,routers)=>{
      state.routers = routers
    }
  },
  actions: {
    GenerateRouter({commit}){
      return new Promise((resolve) => {
        if(store.getters.isadmin){
          commit('SET_ROUTERS',devEopsRouterMap)
          resolve()
        }else{
          commit('SET_ROUTERS',[])
          resolve()
        }
      })
    }
  }
}

export default permission
