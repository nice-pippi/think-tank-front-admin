import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/userManage/page',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/admin/userManage/updateStatus',
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/admin/userManage/updatePassword',
    method: 'put',
    data
  })
}

export function prohibit(data) {
    return request({
      url: '/admin/userManage/prohibit',
      method: 'put',
      data
    })
}

export function deleteById(id) {
  return request({
    url: '/admin/userManage/'+id,
    method: 'delete'
  })
}
