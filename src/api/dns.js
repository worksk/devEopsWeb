import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: DNS
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_DNSList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-dns/v1/dns/'+st,
    method: 'GET'
  })
}

export function fetch_DNSListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-dns/v1/dns/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_DNS(obj){
  return request({
    url: '/api-dns/v1/dns/create/',
    method: 'POST',
    data: obj
  })
}

export function update_DNS(obj){
  return request({
    url: '/api-dns/v1/dns/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_DNS(obj){
  return request({
    url: '/api-dns/v1/dns/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}