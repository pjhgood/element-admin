<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '../../home/components/mixins/resize'
import { oneSewageCheckPointEveryDurgConsumeptionTotalIndex } from '@/api/charts'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    textColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      chart: null,
      chartData: [],
      xAxisData: [],
      seriesData: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getData() {
      oneSewageCheckPointEveryDurgConsumeptionTotalIndex(this.formData).then(res => {
        if (res.code === 200) {
          // this.chartData = res.data
          this.seriesData = res.data.data
          this.xAxisData = []
          this.seriesData.forEach((element, index) => {
            this.xAxisData.push(index + 1)
          })
          this.$nextTick(() => {
            this.initChart()
          })
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              // x轴的文字改为竖版显示
              var str = value.split('')
              return str.join('\n')
            }
          },
          axisLine: {
            lineStyle: {
              color: this.textColor
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: this.textColor
            }
          }
        }],
        series: [{
          data: this.seriesData,
          type: 'bar',
          showBackground: true,
          barMaxWidth: '30%',
          itemStyle: {
            normal: {
              color: function(params) {
                if (params.value > 0 && params.value < 50) {
                  return 'rgb(112,173,11)'
                } else if (params.value >= 50 && params.value < 100) {
                  return 'rgb(91,155,213)'
                } else if (params.value >= 100 && params.value < 150) {
                  return 'rgb(255,192,0)'
                } else if (params.value >= 150 && params.value < 200) {
                  return 'rgb(237,125,49)'
                } else if (params.value >= 200) {
                  return 'rgb(192,0,0)'
                }
              }
            }
          }
        }]
      })
    }
  }
}
</script>
