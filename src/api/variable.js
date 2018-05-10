import request from '@/utils/request'

/*
* API_MODULE: VARIABLE
* API_USE: FETCH,CREATE,DELETE
* */
export function fetch_VariableList(group_id){
  return request({
    url: '/api-var/v1/group/?group='+group_id,
    method: 'GET'
  })
}

export function create_Variable(data){
    return request({
      url: '/api-var/v1/group/create/',
      method: 'POST',
      data:data
    })
}

export function delete_Variable(data){
    return request({
        url: '/api-var/v1/group/'+data.id+'/delete/',
        method: 'DELETE',
        data:data
      })
}