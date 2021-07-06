import request from '@/utils/request'

// 各类毒品消费占比
export function countYearEveryDurgConsumeptionChart(data) {
  return request({
    url: '/sc/bigDisplay/countYearEveryDurgConsumeptionChart',
    method: 'post',
    data
  })
}

// 城市污水采样监测趋势
export function countUrbanSewageSamplingAndMonitoring(data) {
  return request({
    url: '/sc/bigDisplay/countUrbanSewageSamplingAndMonitoring',
    method: 'post',
    data
  })
}

// 城市毒品消费指数
export function countCityEveryDurgConsumeptionIndex(data) {
  return request({
    url: '/sc/bigDisplay/countCityEveryDurgConsumeptionIndex',
    method: 'post',
    data
  })
}

// 城市总毒品消费指数排名
export function countCityTotalDurgConsumeptionSort(data) {
  return request({
    url: '/sc/bigDisplay/countCityTotalDurgConsumeptionSort',
    method: 'post',
    data
  })
}

// 一点一档各类毒品消费总值
export function oneSewageCheckPointEveryDurgConsumeptionTotalIndex(data) {
  return request({
    url: '/sc/sewageCheckPoint/oneSewageCheckPointEveryDurgConsumeptionTotalIndex',
    method: 'post',
    data
  })
}

// 一点一档各类毒品消费指数
export function oneSewageCheckPointEveryDurgConsumeptionIndex(data) {
  return request({
    url: '/sc/sewageCheckPoint/oneSewageCheckPointEveryDurgConsumeptionIndex',
    method: 'post',
    data
  })
}
