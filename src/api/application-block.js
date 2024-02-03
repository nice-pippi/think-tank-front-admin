import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/applicationBlockManage/page',
    method: 'post',
    data
  })
}

export function allow(id) {
  return request({
    url: '/admin/applicationBlockManage/allow/' + id,
    method: 'put'
  })
}

export function reject(id) {
  return request({
    url: '/admin/applicationBlockManage/reject/'+id,
    method: 'put'
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/applicationBlockManage/'+id,
    method: 'delete'
  })
}
