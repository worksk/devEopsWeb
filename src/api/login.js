import request from '@/utils/request'

const host = '10.100.100.246:9999'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/api-auth/login/',
    method: 'POST',
    data
  })
}

export function isAdmin(){
  return request({
    url: '/api-auth/isadmin/',
    method: 'POST',
  })
}
//
// export function logout() {
//   return request({
//     url: '/login/logout',
//     method: 'post'
//   })
// }
//
// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

