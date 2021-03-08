import request from '@/utils/request'

const api = {
  orgList: '/authorization/org/orgs',
  operateOrg: '/authorization/org/org',
  deleteOrg: '/authorization/org/org/batch',
}

export default api

export function getOrgList(parameter) {
  return request({
    url: api.orgList,
    method: 'get',
    params: parameter,
  })
}

export function saveOrg(parameter) {
  return request({
    url: api.operateOrg,
    method: 'post',
    data: parameter,
  })
}

export function updateOrg(parameter) {
  return request({
    url: api.operateOrg,
    method: 'put',
    data: parameter,
  })
}
export function deleteOrg(parameter) {
  return request({
    url: api.deleteOrg,
    method: 'delete',
    data: parameter,
  })
}
