import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/reportPortManage/page',
    method: 'post',
    data
  })
}

export function prohibit(id) {
  return request({
    url: '/admin/reportPortManage/prohibit/' + id,
    method: 'put'
  })
}

export function reject(id) {
  return request({
    url: '/admin/reportPortManage/reject/' + id,
    method: 'put'
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/reportPortManage/' + id,
    method: 'delete'
  })
}