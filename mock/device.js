import Mock from 'mockjs'

const List = []
const count = 100

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
  let order = 1
  if (property.indexOf('-') > 0) {
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
    url: '/api/v1/goods',
    type: 'get',
    response: config => {
      const { name, status, category, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        if (status && item.status !== status) return false
        if (category && item.category !== parseInt(category)) return false
        return true
      })

      mockList = mockList.sort(compare(sort))

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]
