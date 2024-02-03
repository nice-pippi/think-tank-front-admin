import request from '@/utils/request'

export function getList(data) {
    return request({
      url: '/admin/postManage/page',
      method: 'post',
        data
    })
}


export function deleteById(id) {
  return request({
    url: '/admin/postManage/'+id,
    method: 'delete'
  })
}




