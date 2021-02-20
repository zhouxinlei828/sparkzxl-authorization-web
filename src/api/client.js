import request from '@/utils/request'

const api = {
  clientList: '/authorization/client/listPage',
  saveClient: '/authorization/client/saveClient',
  updateClient: '/authorization/client/updateClient',
  deleteClient: '/authorization/client/deleteClient',
}
export function getClientPageList(parameter) {
  return request({
    url: api.clientList,
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
