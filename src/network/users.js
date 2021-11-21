import {request} from './axios'

export function getUsersList(params) {
  return request({
    url: '/users',
    params
  })
}

export function changeUserStatus(uid, ustatus) {
  return request({
    method: 'put',
    url: `/users/${uid}/state/${ustatus}`
    
  })
}

export function addUserReq(data) {
  return request({
    method: 'post',
    url: '/users',
    data
  })
}

export function getUserPro(id) {
  return request({
    url: '/users/' + id
    
  })
}

export function editUserPro(user) {
  return request({
    method: 'put',
    url: 'users/' + user.id,
    data: {
      email: user.email,
      mobile: user.mobile
    }
  })
}
export function delUserReq(id) {
  return request({
    method: 'delete',
    url: 'users/' + id
    
  })
}
