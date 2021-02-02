import request from '@/utils/request'

const api = {
  modelList: '/activiti/modeler/model/list',
  createModel: '/activiti/modeler/model',
  deleteModel: '/activiti/modeler/deleteProcessInstance',
  publishProcess: '/activiti/modeler/publish',
  revokePublish: '/activiti/modeler/revokePublish',
  processDetailList: '/activiti/process/detail/processDetail',
  processAction: '/activiti/process/rule/action',
  operateProcessTaskRule: '/activiti/process/rule/processTaskRule',
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
    params: parameter,
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
    url: api.operateProcessTaskRule,
    method: 'post',
    data: parameter,
  })
}

export function getProcessTaskRule(parameter) {
  return request({
    url: api.operateProcessTaskRule,
    method: 'get',
    params: parameter,
  })
}

export function deleteProcessTaskRule(parameter) {
  return request({
    url: api.operateProcessTaskRule,
    method: 'delete',
    params: parameter,
  })
}
