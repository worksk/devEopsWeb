import request from '@/utils/request'

/*
* API_MODULE: Meta
* API_USE: FETCH
* */
export function fetch_MetaList(){
  return request({
    url: '/api-ops/v1/meta/',
    method: 'GET'
  })
}

export function fetch_MetaListByPage(pagination){
  return request({
    url: '/api-ops/v1/meta/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}
