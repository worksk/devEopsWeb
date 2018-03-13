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

export function userInfo(){
  return request({
    url: '/api-auth/userinfo',
    method: 'GET'
  })
}
