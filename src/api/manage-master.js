import request from '@/utils/request'

export function getList(data) {
    return request({
      url: '/admin/masterManage/page',
      method: 'post',
      data
    })
}

export function updateRole(data) {
  return request({
    url: '/admin/masterManage',
    method: 'put',
    data
  })
}
