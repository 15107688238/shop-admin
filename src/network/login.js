import {request} from './axios'

export function loginReq(username, password){
  return request({
    method: 'post',
    url: '/login',
    data: {
      username,
      password
    }
  })
}