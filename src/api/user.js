import request from '@/utils/request'

const api = {
  userPage: '/authorization/user/listPage',
  userList: '/authorization/user/list',
  exportExcelUser: '/authorization/user/exportUserData',
  saveUser: '/authorization/user/saveAuthUser',
  updateUser: '/authorization/user/updateAuthUser',
  deleteUser: '/authorization/user/delete',
  importUserData: '/authorization/user/importUserData',
}

export default api

export function getUserPage(parameter) {
  return request({
    url: api.userPage,
    method: 'post',
    data: parameter,
  })
}

export function getUserList(parameter) {
  return request({
    url: api.userList,
    method: 'post',
    data: parameter,
  })
}

export function exportExcelUserData(parameter) {
  return request({
    url: api.exportExcelUser,
    method: 'get',
    responseType: 'blob',
    params: parameter,
  })
}
export function saveUser(parameter) {
  return request({
    url: api.saveUser,
    method: 'post',
    data: parameter,
  })
}

export function updateUser(parameter) {
  return request({
    url: api.updateUser,
    method: 'post',
    data: parameter,
  })
}

export function deleteUser(parameter) {
  return request({
    url: api.deleteUser,
    method: 'delete',
    params: parameter,
  })
}

export function importUserData(parameter) {
  return request({
    url: api.importUserData,
    method: 'post',
    data: parameter,
  })
}
