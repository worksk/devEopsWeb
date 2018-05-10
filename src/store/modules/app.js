import Cookies from 'js-cookie'

const app ={
  state: {
    topsidebar:{
      opened: !+Cookies.get('topSidebarStatus')
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if(state.topsidebar.opened){
        Cookies.set('topSidebarStatus',1)
      }else{
        Cookies.set('topSidebarStatus',0)
      }
      state.topsidebar.opened = !state.topsidebar.opened
    }
  },
  actions: {
    ToggleSidebar({commit}){
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
