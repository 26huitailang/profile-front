import Mock from 'mockjs'

const List = []
const count = 21

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@word(2, 20)',
    'status|1': ['using', 'stack'],
    'category|1': [1, 2],
    price: '@float(1, 20000, 2, 2)',
    buyAt: '@date',
    info: '@cparagraph(0, 4)'
  }))
}

function compare(property) {
  if (!property) {
    property = '+id'
  }
  let order = 1
  if (property.slice(0, 1) === '-') {
    order = -1
  }
  property = property.slice(1)

  if (order === 1) {
    return function sortAsc(x, y) {
      const a = x[property]
      const b = y[property]
      if (a < b) return -1
      if (a > b) return 1
      return 0
    }
  }
  return function sortDesc(x, y) {
    const a = x[property]
    const b = y[property]
    if (a < b) return 1
    if (a > b) return -1
    return 0
  }
}

export default [
  {
    url: '/api/v1/devices',
    type: 'get',
    response: config => {
      const { name, status, category, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        if (status && item.status !== status) return false
        if (category && item.category !== parseInt(category)) return false
        return true
      })
      if (sort) {
        mockList = mockList.sort(compare(sort))
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/api/v1/device', // 新增
    type: 'post',
    response: config => {
      const data = config.body
      data.id = Mock.mock('@increment')
      List.push(data)
      return {
        code: 20000,
        data: data
      }
    }
  },
  {
    url: '/api/v1/devices',
    type: 'delete',
    response: config => {
      const ids = config.body.ids
      let i = List.length
      while (i--) {
        if (ids.indexOf(List[i].id) >= 0) {
          List.splice(i, 1)
        }
      }
      return {
        code: 20000
      }
    }
  },
  {
    url: '/api/v1/devices/([0-9]+)',
    type: 'put',
    response: config => {
      const data = config.body
      for (let i = 0; i < List.length; i++) {
        if (List[i].id === data.id) {
          List[i] = data
        }
      }
      return {
        code: 20000,
        message: '更新成功'
      }
    }
  }
]
