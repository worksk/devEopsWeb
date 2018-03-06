const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  status: state => state.user.status,
  roles: state => state.user.roles
}

export default getters
