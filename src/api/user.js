import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login/adminLogin',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/login/logout',
    method: 'get'
  })
}
