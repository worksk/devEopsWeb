import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: Meta
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MetaList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ops/v1/meta/' + st,
    method: 'GET' 
  })
}

export function fetch_MetaListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ops/v1/meta/bypage/'+st+'&page='+pagination.page,
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
export function fetch_MissionList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ops/v1/mission/'+st,
    method: 'GET'
  })
}

export function fetch_MissionListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ops/v1/mission/bypage/'+st+'&page='+pagination.page,
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