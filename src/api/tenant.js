import request from '@/utils/request'

const api = {
  tenantList: '/authorization/tenant/tenants',
  operateTenant: '/authorization/tenant/tenant',
}
export function getTenantPageList(parameter) {
  return request({
    url: api.tenantList,
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
