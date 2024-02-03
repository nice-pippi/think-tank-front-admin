import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/reportCommentManage/page',
    method: 'post',
    data
  })
}

export function prohibit(id) {
  return request({
    url: '/admin/reportCommentManage/prohibit/' + id,
    method: 'put'
  })
}

export function reject(id) {
  return request({
    url: '/admin/reportCommentManage/reject/' + id,
    method: 'put'
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/reportCommentManage/' + id,
    method: 'delete'
  })
}