import {request} from './axios'

export function _getRolesList() {
  return request({
    url: 'roles'
  })
}

export function _getRole(id) {
  return request({
    url: 'roles/'+ id
  })
}

export function _delRoles(role, id) {
  return request({
    method: 'delete',
    url: 'roles/'+ role.id + '/rights/' + id
  })
}

export function _allotRolesReq(role, rids) {
  return request({
    method: 'post',
    url: 'roles/'+ role.id + '/rights',
    data: {
      rids
    }
  })
}

export function _allotUserRolesReq(id, rid) {
  return request({
    method: 'put',
    url: 'users/' +id + '/role',
    data: {
      rid
    }
  })
}

export function _addRolesReq(data) {
  return request({
    method: 'post',
    url: 'roles',
    data
  })
}

export function _editRoleReq(id,data) {
  return request({
    method: 'put',
    url: 'roles/' +id,
    data
    
  })
}

export function _delRole(id) {
  return request({
    method: 'delete',
    url: `roles/${id}`
  })
}
