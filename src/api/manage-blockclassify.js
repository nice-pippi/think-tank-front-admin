import request from '@/utils/request'

export function addBlockBigType(data) {
  return request({
    url: '/admin/blockClassifyManage/addBlockBigType',
    method: 'post',
    data
  })
}

export function addBlockSmallType(data) {
  return request({
    url: '/admin/blockClassifyManage/addBlockSmallType',
    method: 'post',
    data
  })
}

export function deleteBlockBigType(id) {
  return request({
    url: '/admin/blockClassifyManage/deleteBlockBigType/' + id,
    method: 'delete'
  })
}

export function deleteBlockSmallType(id) {
  return request({
    url: '/admin/blockClassifyManage/deleteBlockSmallType/'+id,
    method: 'delete'
  })
}