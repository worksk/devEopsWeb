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
    url: '/api-manager/v1/group/'+data.uuid+'/update/',
    method: 'PUT',
    data:data
  })
}

export function delete_Group(data){
  return request({
    url: '/api-manager/v1/group/'+data.uuid+'/delete/',
    method: 'DELETE',
    data:data
  })
}

export function framework_Group(id,data){
  return request({
    url: '/api-manager/v1/group/'+ id + '/framework/',
    method: 'PUT',
    data: data
  })
}

export function selectHost_Group(uuid,data){
  return request({
    url: '/api-manager/v1/group/'+ uuid + '/selecthost/',
    method: 'PUT',
    data: data
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
export function fetch_HostList(group_id){
  return request({
    url: '/api-manager/v1/host/'+'?groups='+group_id,
    method: 'GET'
  })
}

export function fetch_HostListByPage(pagination,group_id){
  if(group_id!=0){
    return request({
      url: '/api-manager/v1/host/bypage/'+'?page='+pagination.page+'&groups='+group_id,
      method: 'GET'
    })
  }else{
    return request({
      url: '/api-manager/v1/host/bypage/'+'?page='+pagination.page,
      method: 'GET'
    })
  }
}

export function fetch_HostPasswd(uuid){
  return request({
    url: '/api-manager/v1/host/'+uuid+'/passwd/',
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
    url: '/api-manager/v1/host/'+data.uuid+'/update/',
    method: 'PUT',
    data:data
  })
}

export function delete_Host(data){
  return request({
    url: '/api-manager/v1/host/'+data.uuid+'/delete/',
    method: 'DELETE',
    data:data
  })
}

export function detail_Host(uuid){
  return request({
    url: '/api-manager/v1/host/'+uuid+'/detail/',
    method: 'GET'
  })
}
