import request from '@/utils/request'

const host = '10.100.100.246:9999'
export function fetch_GroupList(){
  return request({
    url: '/api-manager/v1/group',
    method: 'GET'
  })
}
