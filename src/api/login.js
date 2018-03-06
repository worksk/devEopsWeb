import request from '@/utils/request'
import service from "../utils/request";

const host = '10.100.100.246:9999'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return service.post('/api-login/',data)
  return request({
    url: '/api-login/',
    method: 'POST',
    data
  })

  // axios.post("10.100.100.246:9999/api-login/", {
  //   username: 'username',
  //   password: 'password'
  // })
  //   .then(function (response) {
  //     console.log(response);
  //   })
  //   .catch(function (response) {
  //     console.log(response);
  //   })
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

