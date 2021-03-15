import request from '@/utils/request'

const api = {
  processInstanceList: '/activiti/instance/page',
  instanceOverview: '/activiti/instance/overview',
  historyList: '/activiti/instance/historyList',
  suspendProcess: '/activiti/drive/suspend',
  deleteProcessInstance: '/activiti/drive/process/delete',
  showFlowChart: '/activiti/instance/flowChart',
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

export function historyList(parameter) {
  return request({
    url: api.historyList,
    method: 'get',
    params: parameter,
  })
}

export function suspendProcess(parameter) {
  return request({
    url: api.suspendProcess,
    method: 'post',
    data: parameter,
  })
}

export function deleteProcessInstance(parameter) {
  return request({
    url: api.deleteProcessInstance,
    method: 'post',
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
