import { loginByUsername,userInfo } from "@/api/login";
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    isadmin: false,
    islogin: false
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
    SET_ISADMIN: (state, isadmin) => {
      state.islogin = true
      state.isadmin = isadmin
    },
    SET_LOGIN: (state, islogin) =>{
      state.islogin = islogin
    },
    SET_USERNAME: (state, username) =>{
      state.username = username
    },
    SET_NAME: (state, name) =>{
      state.name = name
    }
  },

  actions: {
    UserInfo({commit}){
      return new Promise((resolve,reject)=>{
        userInfo().then(response =>{
          commit('SET_ISADMIN',response.data.isadmin)
          commit('SET_USERNAME',response.data.username)
          commit('SET_NAME',response.data.name)
          resolve()
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
      return new Promise((resolve) => {

        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ISADMIN', false)
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
          commit('SET_TOKEN', '')
          commit('SET_ISADMIN', false)
          removeToken()
          resolve()
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
