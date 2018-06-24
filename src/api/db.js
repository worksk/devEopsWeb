import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: DB Instance
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_DBInstanceList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/instance/'+st,
    method: 'GET'
  })
}

export function fetch_DBInstanceListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/instance/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_DBInstance(obj){
  return request({
    url: '/api-db/v1/instance/create/',
    method: 'POST',
    data: obj
  })
}

export function update_DBInstance(obj){
  return request({
    url: '/api-db/v1/instance/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_DBInstance(obj){
  return request({
    url: '/api-db/v1/instance/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}


/*
* API_MODULE: DB Role
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_DBRoleList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/role/'+st,
    method: 'GET'
  })
}

export function fetch_DBRoleListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/role/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_DBRole(obj){
  return request({
    url: '/api-db/v1/role/create/',
    method: 'POST',
    data: obj
  })
}

export function update_DBRole(obj){
  return request({
    url: '/api-db/v1/role/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_DBRole(obj){
  return request({
    url: '/api-db/v1/role/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}



/*
* API_MODULE: DB USER
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_DBUserList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/user/'+st,
    method: 'GET'
  })
}

export function fetch_DBUserListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-db/v1/user/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_DBUser(obj){
  return request({
    url: '/api-db/v1/user/create/',
    method: 'POST',
    data: obj
  })
}

export function update_DBUser(obj){
  return request({
    url: '/api-db/v1/user/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_DBUser(obj){
  return request({
    url: '/api-db/v1/user/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}