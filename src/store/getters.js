const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  status: state => state.user.status,
  isadmin: state => state.user.isadmin,
  islogin: state => state.user.islogin,
  routers: state => state.permission.routers,
  topsidebar: state => state.app.topsidebar
}

export default getters
