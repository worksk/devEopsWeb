import request from '@/utils/request'

/*
* API_MODULE: Meta
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MetaList(group_id){
  return request({
    url: '/api-ops/v1/meta/'+'?group='+group_id,
    method: 'GET' 
  })
}

export function fetch_MetaListByPage(pagination){
  return request({
    url: '/api-ops/v1/meta/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function create_Meta(data){
  return request({
    url: '/api-ops/v1/meta/create/',
    method: 'POST',
    data: data
  })
}

export function update_Meta(data){
  return request({
    url: '/api-ops/v1/meta/'+data.uuid+'/update/',
    method: 'PUT',
    data: data
  })
}

export function delete_Meta(data){
  return request({
    url: '/api-ops/v1/meta/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}

export function checkFile_Meta(id){
  return request({
    url: '/api-ops/v1/meta/'+id+'/check/',
    method: 'GET'
  })
}

export function uploadFile_Meta(id,data){
  return request({
    url: '/api-ops/v1/meta/'+ id + '/opsdir/',
    method: 'PUT',
    data: data
  })
}


/*
* API_MODULE: Mission
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MissionList(group_id){
  return request({
    url: '/api-ops/v1/mission/'+'?group='+group_id,
    method: 'GET'
  })
}

export function fetch_MissionListByPage(pagination){
  return request({
    url: '/api-ops/v1/mission/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_MissionListByUser(){
  return request({
    url: '/api-ops/v1/mission/byuser/',
    method: 'GET' 
  })
}

export function create_Mission(data){
  return request({
    url: '/api-ops/v1/mission/create/',
    method: 'POST',
    data: data
  })
}

export function update_Mission(data){
  return request({
    url: '/api-ops/v1/mission/'+data.uuid+'/update/',
    method: 'PUT',
    data: data
  })
}

export function delete_Mission(data){
  return request({
    url: '/api-ops/v1/mission/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}