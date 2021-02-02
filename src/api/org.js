import request from '@/utils/request'

const api = {
  orgList: '/uaa/org/orgs',
  operateOrg: '/uaa/org/org',
  deleteOrg: '/uaa/org/org/batch?ids=',
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
    url: api.deleteOrg.concat(parameter),
    method: 'delete',
  })
}
