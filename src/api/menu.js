import request from '@/utils/request'

const api = {
  menuTree: '/uaa/menu/tree',
  menuResource: '/uaa/resource/page',
  saveMenu: '/uaa/menu/save',
  updateMenu: '/uaa/menu/update',
  deleteMenu: '/uaa/menu/deleteMenu',
  saveResource: '/uaa/resource/save',
  updateResource: '/uaa/resource/update',
  deleteResource: '/uaa/resource/deleteResource',
}

export default api

export function getMenuTree() {
  return request({
    url: api.menuTree,
    method: 'get',
  })
}

export function getMenuResource(parameter) {
  return request({
    url: api.menuResource,
    method: 'post',
    data: parameter,
  })
}

export function saveMenu(parameter) {
  return request({
    url: api.saveMenu,
    method: 'post',
    data: parameter,
  })
}

export function updateMenu(parameter) {
  return request({
    url: api.updateMenu,
    method: 'put',
    data: parameter,
  })
}

export function deleteMenu(parameter) {
  return request({
    url: api.deleteMenu,
    method: 'delete',
    data: parameter,
  })
}

export function saveResource(parameter) {
  return request({
    url: api.saveResource,
    method: 'post',
    data: parameter,
  })
}

export function updateResource(parameter) {
  return request({
    url: api.updateResource,
    method: 'put',
    data: parameter,
  })
}

export function deleteResource(parameter) {
  return request({
    url: api.deleteResource,
    method: 'delete',
    params: parameter,
  })
}
