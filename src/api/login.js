import request from '@/utils/request'

/*
* API_MODULE: LOGIN
* API_USE: FETCH
* */
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

/*
* API_MODULE: USERINFO
* API_USE: FETCH
* */
export function fetch_UserInfo(){
  return request({
    url: '/api-auth/userinfo/',
    method: 'GET'
  })
}
