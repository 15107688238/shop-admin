import {request} from './axios'

export function _getRolesList() {
  return request({
    url: 'roles'
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

