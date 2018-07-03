import request from '@/utils/request'

/*
* API_MODULE: EXPIRED
* API_USE: FETCH
* API_ARGV: ECS RDS MANAGER
* */
export function fetch_ExpiredAliyunECSList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/ecs/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_ExpiredAliyunRDSList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/rds/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_SystemStatus(){
  return request({
    url: '/api-dashboard/v1/systype/',
    method: 'GET'
  })
}

export function fetch_GroupStatus(){
  return request({
    url: '/api-dashboard/v1/group/',
    method: 'GET'
  })
}