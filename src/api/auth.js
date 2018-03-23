import request from '@/utils/request'
/*
* API_MODULE: USER
* API_USE: FETCH
* */
export function fetch_UserList(){
  return request({
    url: '/api-auth/v1/user/',
    method: 'GET'
  })
}

export function update_User(data){
  return request({
    url: '/api-auth/v1/user/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

export function fetch_PmnGroupList(){
  return request({
    url: '/api-auth/v1/group/',
    method: 'GET'
  })
}

export function create_PmnGroup(data){
  return request({
    url: '/api-auth/v1/group/create/',
    method: 'POST',
    data: data
  })
}

export function update_PmnGroup(data){
  return request({
    url: '/api-auth/v1/group/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

export function fetch_Permission(){
  return request({
    url: '/api-auth/v1/permission/',
    method: 'GET'
  })
}
