import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    name: '@word(5, 15)',
    'status|1': ['using', 'stack'],
    'category|1': [1, 2],
    price: '@float(1, 20000, 2, 2)',
    buyAt: '@date',
    dayPrice: '@float(1, 50, 2, 2)',
    info: '@cparagraph(1, 3)'
  }]
})

export default [
  {
    url: '/api/v1/goods',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
