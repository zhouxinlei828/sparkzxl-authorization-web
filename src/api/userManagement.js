import request from '@/utils/request'
const api = {
  userPage: '/uaa/user/listPage',
  userList: '/uaa/user/list',
  exportExcelUser: '/uaa/user/exportUserData',
  saveUser: '/uaa/user/saveAuthUser',
  updateUser: '/uaa/user/updateAuthUser',
  deleteUser: '/uaa/user/delete',
  importUserData: '/uaa/user/importUserData',
}
export function getList(data) {
  return request({
    url: '/userManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/userManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/userManagement/doDelete',
    method: 'post',
    data,
  })
}

export function getUserPage(parameter) {
  return request({
    url: api.userPage,
    method: 'post',
    data: parameter,
  })
}
