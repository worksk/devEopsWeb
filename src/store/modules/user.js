// import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { loginByUsername,isAdmin } from "@/api/login";
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    isadmin: false,
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ADMIN: (state, isadmin) =>{
      state.isadmin = isadmin
    }
  },

  actions: {
    // 判断用户是否是管理级别
    IsAdmin({commit}){
      return new Promise((resolve,reject)=>{
        isAdmin().then(response =>{
          commit('SET_ADMIN',response.data.isadmin)
        }).catch(error =>{
          reject(error)
        })
      })
    },

    // 用户名登录
    LoginByUsername({ commit }, userForm) {
      const username = userForm.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userForm.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ADMIN', false)
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
