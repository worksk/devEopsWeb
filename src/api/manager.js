import request from '@/utils/request'

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

export function fetch_GroupListByPage(){
  return request({
    url: '/api-manager/v1/group/bypage/',
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
* API_USE: FETCH,DATA
* */
export function fetch_PositionList(){
  return request({
    url: '/api-manager/v1/position/',
    method: 'GET'
  })
}

export function create_Position(data){
  return request({
    url: '/api-manager/v1/position/create/',
    method: 'POST',
    data: data
  })
}

/*
* API_MODULE: SYSTYPE
* API_USE: FETCH,CREATE
* */
export function fetch_SystypeList(){
  return request({
    url: '/api-manager/v1/systype/',
    method: 'GET'
  })
}

export function create_Systype(data){
  return request({
    url: '/api-manager/v1/systype/create/',
    method: 'POST',
    data: data
  })
}

/*
* API_MODULE: HOST
* API_USE: FETCH,CREATE,UPDATE,DELETE,PASSWD,DETAIL
* */
export function fetch_HostList(){
  return request({
    url: '/api-manager/v1/host/',
    method: 'GET'
  })
}

export function fetch_HostListByPage(pagination){
  return request({
    url: '/api-manager/v1/host/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_HostPasswd(id){
  return request({
    url: '/api-manager/v1/host/'+id+'/passwd/',
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
  console.log(data)
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

export function detail_Host(id){
  return request({
    url: '/api-manager/v1/host/'+id+'/detail/',
    method: 'GET'
  })
}
