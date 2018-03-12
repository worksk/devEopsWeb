const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  name: state => state.user.name,
  status: state => state.user.status,
  isadmin: state => state.user.isadmin,
  islogin: state => state.user.islogin,
  routers: state => state.permission.routers,
  topsidebar: state => state.app.topsidebar,
  visitedviews: state => state.tagsview.visitedviews,
  cacheviews: state => state.tagsview.cacheviews
}

export default getters
