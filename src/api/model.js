import request from '@/utils/request'

const api = {
  modelList: '/activiti/modeler/page',
  createModel: '/activiti/modeler/save',
  deleteModel: '/activiti/modeler/delete',
  publishProcess: '/activiti/modeler/publish',
  revokePublish: '/activiti/modeler/backout',
  processDetailList: '/activiti/process/detail/list',
  processAction: '/activiti/process/rule/action',
  saveProcessTaskRule: '/activiti/process/rule/save',
  getProcessTaskRule: '/activiti/process/rule/get',
  deleteProcessTaskRule: '/activiti/process/rule/delete',
}

export default api

export function getModelList(parameter) {
  return request({
    url: api.modelList,
    method: 'get',
    params: parameter,
  })
}

export function createModel(parameter) {
  return request({
    url: api.createModel,
    method: 'post',
    data: parameter,
  })
}

export function deleteModel(parameter) {
  return request({
    url: api.deleteModel,
    method: 'delete',
    data: parameter,
  })
}

export function publishProcess(parameter) {
  return request({
    url: api.publishProcess,
    method: 'patch',
    params: parameter,
  })
}

export function revokePublish(parameter) {
  return request({
    url: api.revokePublish,
    method: 'delete',
    params: parameter,
  })
}

export function getProcessDetailList(parameter) {
  return request({
    url: api.processDetailList,
    method: 'get',
    params: parameter,
  })
}

export function getProcessAction() {
  return request({
    url: api.processAction,
    method: 'get',
  })
}

export function saveProcessTaskRule(parameter) {
  return request({
    url: api.saveProcessTaskRule,
    method: 'post',
    data: parameter,
  })
}

export function getProcessTaskRule(parameter) {
  return request({
    url: api.getProcessTaskRule,
    method: 'get',
    params: parameter,
  })
}

export function deleteProcessTaskRule(parameter) {
  return request({
    url: api.deleteProcessTaskRule,
    method: 'delete',
    params: parameter,
  })
}
