import {request} from './axios'

export function _getrightsList(type) {
  return request({
    url: 'rights/'+type
  })
}