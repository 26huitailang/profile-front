import request from '@/utils/request'

const apiV1Devices = '/api/v1/devices'
const apiV1DeviceDetail = '/api/v1/device'

export function fetchList(params) {
  return request({
    url: apiV1Devices,
    method: 'get',
    params
  })
}

export function create(params) {
  return request({
    url: apiV1DeviceDetail,
    method: 'post',
    data: params
  })
}

export function edit(id, params) {
  return request({
    url: apiV1Devices + `/${id}`,
    method: 'put',
    data: params
  })
}

export function del(params) {
  return request({
    url: apiV1Devices,
    method: 'delete',
    data: params
  })
}
