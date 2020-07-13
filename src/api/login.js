import request from '@/utils/request'

export function login(usernumber, userpass) {
  return request({
    url: '/scadmin',
    method: 'post',
    data: {
      usernumber,
      userpass
    }
  })
}

export function getInfo() {
  return request({
    url: '/scrouter?pow=1',
    method: 'get'
  })
}

export function getTRole() {
  return request({
    url: '/scrouter?pow=1',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
