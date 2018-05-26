import request from '@/utils/request'
/*
* API_MODULE: WORK
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_WorkListByPage(pagination){
    return request({
      url: '/api-work/v1/codework/bypage/'+'?page='+pagination.page,
      method: 'GET'
    })
  }

  export function create_Work(data){
    return request({
      url: '/api-work/v1/codework/create/',
      method: 'POST',
      data: data
    })
  }

  export function check_Work(uuid){
    return request({
      url: '/api-work/v1/codework/'+uuid+'/check/',
      method: 'PUT',
      data: {'status':2}
    })
  }

  export function run_Work(uuid){
    return request({
      url: '/api-work/v1/codework/'+uuid+'/run/',
      method: 'PUT',
      data: {'status':4}
    })
  }

  export function upload_Work(uuid,data){
    return request({
      url: '/api-work/v1/codework/'+uuid+'/upload/',
      method: 'PUT',
      data: {"files":data}
    })
  }