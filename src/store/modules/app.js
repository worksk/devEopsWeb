import Cookies from 'js-cookie'

const app ={
  state: {
    topsidebar:{
      opened: 1
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state =>{
      if(state.topsidebar.opened){
        Cookies.set('topSidebarStatus',1)
      }else{
        Cookies.set('topSidebarStatus',0)
      }
      state.topsidebar.opened = !state.topsidebar.opened
    }
  },
  actions: {
    toggle_sidebar({commit}){
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
