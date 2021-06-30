<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons') // echarts theme
import { countYearEveryDurgConsumeptionChart } from '@/api/charts'

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
    }
  },
  data() {
    return {
      chart: null,
      chartData: null
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart()
    // })
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
      countYearEveryDurgConsumeptionChart(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.$nextTick(() => {
            this.initChart()
          })
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: '2%',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '毒品种类',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'

              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                formatter: '{per|{d}%}\n{a|{b}}\n{hr|}', // 百分比之后换行显示文字
                rich: {
                  a: {
                    color: '#FFF', // 文字颜色
                    fontSize: 11, // 文字大小
                    lineHeight: 20, // 间距
                    align: 'center' // 文字居中
                  },
                  per: {
                    color: '#FFF', // 百分比文字颜色
                    align: 'center',
                    fontSize: 14
                  }
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#fff' // 指向线颜色
                },
                smooth: 0.1, // 线的拐弯程度
                length: 18 // 第一条线长度
              }
            },
            data: this.chartData
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
</style>
