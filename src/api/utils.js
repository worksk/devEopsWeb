import request from '@/utils/request'

/*
* API_MODULE: FILE
* API_USE: FETCH,CREATE,DELETE
* */
export function fetch_FileList(){
  return request({
    url: '/api-utils/v1/file/',
    method: 'GET'
  })
}

export function fetch_FileListByPage(pagination){
  return request({
    url: '/api-utils/v1/file/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function create_File(data){
  return request({
    url: '/api-utils/v1/file/create/',
    method: 'POST',
    data: data
  })
}

export function delete_File(data){
  return request({
    url: '/api-utils/v1/file/'+data.id+'/delete/',
    method: 'DELETE',
    data: data
  })
}
