<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { countUrbanSewageSamplingAndMonitoring } from '@/api/charts'

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
      seriesData: [],
      legendData: [],
      colors: ['rgb(192,0,0)', 'rgb(237,125,49)', 'rgb(255,192,0)', 'rgb(91,155,213)', 'rgb(112,173,11)']
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
      countUrbanSewageSamplingAndMonitoring(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.seriesData = []
          this.chartData.forEach((element, index) => {
            for (const key in element) {
              if (Object.hasOwnProperty.call(element, key)) {
                const item = element[key]
                this.legendData.push(key)
                var itemData = {
                  name: key,
                  type: 'line',
                  stack: '总量',
                  areaStyle: {
                    color: this.colors[index % 5]
                  },
                  lineStyle: {
                    color: this.colors[index % 5]
                  },
                  emphasis: {
                    focus: 'series'
                  },
                  data: item
                }
                this.seriesData.push(itemData)
              }
            }
          })
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
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        // legend: {
        //   textStyle: {
        //     color: '#fff'
        //   },
        //   data: this.legendData
        // },
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: this.seriesData
      })
    }
  }
}
</script>
