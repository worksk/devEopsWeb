import request from '@/utils/request'
/*
* API_MODULE: DNS
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_DNSList(level){
  return request({
    url: '/api-dns/v1/dns/?level='+level,
    method: 'GET'
  })
}

export function fetch_DNSListByPage(pagination,level){
  if(level==0){
    level=""
  }
  return request({
    url: '/api-dns/v1/dns/bypage/'+'?page='+pagination.page+'&level='+level,
    method: 'GET'
  })
}

export function create_DNS(data){
  return request({
    url: '/api-dns/v1/dns/create/',
    method: 'POST',
    data: data
  })
}

export function update_DNS(data){
  return request({
    url: '/api-dns/v1/dns/'+data.uuid+'/update/',
    method: 'PUT',
    data: data
  })
}

export function delete_DNS(data){
  return request({
    url: '/api-dns/v1/dns/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}