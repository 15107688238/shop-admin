import {request} from './axios'

export function _getGoodsCateList(params) {
  return request({
    url: 'categories',
    params
  })
}
export function _addGoodsCate(data) {
  return request({
    method: 'post',
    url: 'categories',
    data
  })
}