import {
  request
} from './axios'

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

export function _getAttributeList(id, sels) {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel: sels
    }
  })
}

export function _addAttribute(id, data) {
  return request({
    method: 'post',
    url: 'categories/' + id + '/attributes',
    data
  })
}
export function _getAttributeById(id, attrId, sel) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    params: {
      attr_sel: sel
    }
  })
}

export function _editAttribute(id, attrId, data) {
  return request({
    method: 'put',
    url: 'categories/' + id + '/attributes/' + attrId,
    data
  

  })
}

export function _getGoodsList(params) {
  return request({
    url: 'goods',
    params
  })
}
export function _addGoods(data) {
  return request({
    method: 'post',
    url: 'goods',
    data
  })
}