import request from '@/utils/request'

const api = {
  clientList: '/authorization/client/listPage',
  operateTenant: '/authorization/tenant/tenant',
}
export function getClientPageList(parameter) {
  return request({
    url: api.clientList,
    method: 'post',
    data: parameter,
  })
}

export function saveTenant(parameter) {
  return request({
    url: api.operateTenant,
    method: 'post',
    data: parameter,
  })
}

export function updateTenant(parameter) {
  return request({
    url: api.operateTenant,
    method: 'put',
    data: parameter,
  })
}

export function deleteTenant(parameter) {
  return request({
    url: api.operateTenant,
    method: 'delete',
    data: parameter,
  })
}
