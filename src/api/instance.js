import request from '@/utils/request'

const api = {
  processInstanceList: '/activiti/act/process/instances',
  instanceOverview: '/activiti/act/process/instanceOverview',
  processHistoryByProcessInstanceId:
    '/activiti/act/process/processHistoryByProcessInstanceId',
  suspendProcess: '/activiti/act/driver/suspendProcessByProcessInstanceId',
  deleteProcessInstance: '/activiti/act/driver/deleteProcessByProcInsId',
  showFlowChart: '/activiti/act/process/history/processImg',
}

export default api

export function instanceOverview() {
  return request({
    url: api.instanceOverview,
    method: 'get',
  })
}

export function getProcessInstanceList(parameter) {
  return request({
    url: api.processInstanceList,
    method: 'get',
    params: parameter,
  })
}

export function processHistoryByProcessInstanceId(parameter) {
  return request({
    url: api.processHistoryByProcessInstanceId,
    method: 'get',
    params: parameter,
  })
}

export function suspendProcess(parameter) {
  return request({
    url: api.suspendProcess,
    method: 'delete',
    params: parameter,
  })
}

export function deleteProcessInstance(parameter) {
  return request({
    url: api.deleteProcessInstance,
    method: 'delete',
    data: parameter,
  })
}

export function showFlowChart(parameter) {
  return request({
    url: api.showFlowChart,
    method: 'get',
    params: parameter,
  })
}
