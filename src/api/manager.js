import request from '@/utils/request'

const host = '10.100.100.246:9999'

/*
* API_MODULE: GROUP
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_GroupList(){
  return request({
    url: '/api-manager/v1/group/',
    method: 'GET'
  })
}

export function create_Group(data){
  return request({
    url: '/api-manager/v1/group/create/',
    method: 'POST',
    data:data
  })
}
export function update_Group(data){
  return request({
    url: '/api-manager/v1/group/'+data.id+'/update/',
    method: 'PUT',
    data:data
  })
}

export function delete_Group(data){
  return request({
    url: '/api-manager/v1/group/'+data.id+'/delete/',
    method: 'DELETE',
    data:data
  })
}

/*
* API_MODULE: POSITION
* API_USE: FETCH
* */
export function fetch_PositionList(){
  return request({
    url: '/api-manager/v1/position/',
    method: 'GET'
  })
}

/*
* API_MODULE: SYSTYPE
* API_USE: FETCH
* */
export function fetch_SystypeList(){
  return request({
    url: '/api-manager/v1/systype/',
    method: 'GET'
  })
}

/*
* API_MODULE: HOST
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_HostList(id){
  return request({
    url: '/api-manager/v1/hostbygroup/'+'0'+'/',
    method: 'GET'
  })
}

export function create_Host(data){
  return request({
    url: '/api-manager/v1/host/create/',
    method: 'POST',
    data:data
  })
}

export function update_Host(data){
  return request({
    url: '/api-manager/v1/host/'+data.id+'/update/',
    method: 'PUT',
    data:data
  })
}

export function delete_Host(data){
  return request({
    url: '/api-manager/v1/host/'+data.id+'/delete/',
    method: 'DELETE',
    data:data
  })
}
