import request from '@/utils/request'

export function getBigTypeList() {
  return request({
    url: '/block/getBlockBigTypeList',
    method: 'get'
  })
}

export function getSmallTypeList() {
  return request({
    url: '/block/getBlockSmallTypeList',
    method: 'get'
  })
}

export function getBlockInfo(id) {
  return request({
    url: '/block/' + id,
    method: 'get'
  })
}

export function getBlockClassify() {
  return request({
    url: '/block/getBlockClassify',
    method: 'get'
  })
}



