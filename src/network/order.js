import {request} from 'network/axios'

export function _getOrderList(params) {
  return request({
    url: 'orders',
    params
  })
}

export function _getKuaiDi(id) {
  return request({
    url: '/kuaidi/' +id,
    
  })
}