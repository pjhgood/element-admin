<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { countCityTotalDurgConsumeptionSort } from '@/api/charts'

const animationDuration = 6000

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
      chartData: [],
      xAxisData: [],
      seriesData: []
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
      countCityTotalDurgConsumeptionSort(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.seriesData = []
          this.xAxisData = []
          this.chartData.forEach((element, index) => {
            this.xAxisData.push(element.city)
            this.seriesData.push(element.value)
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
              color: '#fff'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          max: 100,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
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
                //                     var colorlist = ['#DA251D','#E67716','#FBC300','#11440f','#32585a','#00ff77'];
                if (params.value > 0 && params.value < 10) {
                  return 'rgb(91,155,213)'
                } else if (params.value >= 10 && params.value < 20) {
                  return 'rgb(112,173,11)'
                } else if (params.value >= 20 && params.value < 30) {
                  return 'rgb(255,192,0)'
                } else if (params.value >= 30 && params.value < 40) {
                  return 'rgb(237,125,49)'
                } else if (params.value >= 40) {
                  return 'rgb(192,0,0)'
                }
              }
            }
          },
          markLine: {
            symbol: 'none',
            itemStyle: {
              normal: {
                color: 'red',
                label: {
                  show: true
                }
              }
            },
            data: [{ yAxis: 65.4, name: '平均值' }]
            // data: [
            //   { name: '随便起个名字就行',
            //     yAxis: 65.4, // 这里设置的是平行于X轴的辅助线
            //     label: {
            //       show: true,
            //       position: 'end', // 文字显示位置，可以设置start、middle、end
            //       formatter: '想要显示的文字'
            //     }
            //   }
            // ]
          }
        }]
      })
    }
  }
}
</script>
