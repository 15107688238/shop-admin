import {request} from './axios'

export function getMenus(){
  return request({
    url: 'menus'
  })
}