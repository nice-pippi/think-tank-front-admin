import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/applicationMasterManage/page',
    method: 'post',
    data
  })
}

export function allow(id) {
  return request({
    url: '/admin/applicationMasterManage/allow/' + id,
    method: 'put'
  })
}

export function reject(id) {
  return request({
    url: '/admin/applicationMasterManage/reject/'+id,
    method: 'put'
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/applicationMasterManage/'+id,
    method: 'delete'
  })
}
