import request from '@/utils/request'

const apiV1Goods = '/api/v1/goods'

export function fetchList(params) {
  return request({
    url: apiV1Goods,
    method: 'get',
    params
  })
}

export function edit(params) {
  return request({
    url: apiV1Goods,
    method: 'put',
    body: params
  })
}

export function del(params) {
  return request({
    url: apiV1Goods,
    method: 'delete',
    params: params
  })
}
