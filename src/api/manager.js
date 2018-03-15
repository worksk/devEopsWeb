import request from '@/utils/request'

const host = '10.100.100.246:9999'
export function fetch_GroupList(){
  return request({
    url: '/api-manager/v1/group/',
    method: 'GET'
  })
}

export function fetch_UserList(){
  return request({
    url: '/api-auth/v1/user/',
    method: 'GET'
  })
}

export function fetch_HostList(id){
  return request({
    url: '/api-manager/v1/hostbygroup/'+'0'+'/',
    method: 'GET'
  })
}

export function create_Group(data){
  return request({
    url: 'api-manager/v1/group/create/',
    method: 'POST',
    data:data
  })
}
export function update_Group(data){
  return request({
    url: 'api-manager/v1/group/'+data.id+'/update/',
    method: 'PUT',
    data:data
  })
}

export function delete_Group(data){
  return request({
    url: 'api-manager/v1/group/'+data.id+'/delete/',
    method: 'DELETE',
    data:data
  })
}
