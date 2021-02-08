import request from '@/utils/request'

const api = {
  stationList: '/authorization/station/stationList',
  stationPageList: '/authorization/station/stations',
  operateStation: '/authorization/station/station',
}

export default api

export function getStationList() {
  return request({
    url: api.stationList,
    method: 'get',
  })
}

export function getStationPageList(parameter) {
  return request({
    url: api.stationPageList,
    method: 'post',
    data: parameter,
  })
}

export function saveStation(parameter) {
  return request({
    url: api.operateStation,
    method: 'post',
    data: parameter,
  })
}

export function updateStation(parameter) {
  return request({
    url: api.operateStation,
    method: 'put',
    data: parameter,
  })
}

export function deleteStation(parameter) {
  return request({
    url: api.operateStation,
    method: 'delete',
    params: parameter,
  })
}
