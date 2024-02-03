import request from '@/utils/request'

export function getList(data) {
    return request({
      url: '/admin/blockManage/page',
      method: 'post',
        data
    })
}

export function addBlock(data) {
  return request({
    url: '/admin/blockManage',
    method: 'post',
    data
  })
}

export function updateBlock(data) {
  return request({
    url: '/block/',
    method: 'post',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/blockManage/'+id,
    method: 'delete'
  })
}

export function getAllBlockBySmallTypeId(id) {
  return request({
    url: '/block/getAllBlockBySmallTypeId/' + id,
    method: 'get'
  })
}




