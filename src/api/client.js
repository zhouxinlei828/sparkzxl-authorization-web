import request from '@/utils/request'

const api = {
  applicationList: '/authorization/application/listPage',
  saveClient: '/authorization/client/saveClient',
  updateClient: '/authorization/client/updateClient',
  deleteClient: '/authorization/client/deleteClient',
}
export function getApplicationPageList(parameter) {
  return request({
    url: api.applicationList,
    method: 'post',
    data: parameter,
  })
}

export function saveClient(parameter) {
  return request({
    url: api.saveClient,
    method: 'post',
    data: parameter,
  })
}

export function updateClient(parameter) {
  return request({
    url: api.updateClient,
    method: 'put',
    data: parameter,
  })
}

export function deleteClient(parameter) {
  return request({
    url: api.deleteClient,
    method: 'delete',
    data: parameter,
  })
}
