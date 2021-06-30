<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons') // echarts theme
import { countCityEveryDurgConsumeptionIndex } from '@/api/charts'

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
      legendData: [],
      drugData: ['吗啡', 'O6-甲乙酰吗啡', '甲基苯丙胺', '苯丙胺', 'MDMA', 'MDA', '氯胺酮', '去甲氯胺酮', '可卡因', '可待因', '苯甲酰爱康宁', '美沙酮', '可替宁', '甲卡西酮'],
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
      countCityEveryDurgConsumeptionIndex(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.seriesData = []
          this.drugData = []
          this.chartData.forEach((element, index) => {
            var datas = []
            this.drugData.push(element.drugName)
            if (index === 0) {
              for (const key in element.cityIndexs) {
                if (Object.hasOwnProperty.call(element.cityIndexs, key)) {
                  this.legendData.push(key)
                }
              }
            }
            for (const key in element.cityIndexs) {
              if (Object.hasOwnProperty.call(element.cityIndexs, key)) {
                const item = element.cityIndexs[key]
                datas.push(item)
              }
            }
            var itemData = {
              name: element.drugName,
              type: 'bar',
              stack: 'total',
              label: {
                // show: true
              },
              itemStyle: {
                normal: { color: this.colors[(index)] }
              },
              emphasis: {
                focus: 'series'
              },
              data: datas
            }
            this.seriesData.push(itemData)
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
          axisPointer: { // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          bottom: '2%',
          data: this.drugData
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.legendData,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: this.seriesData
      })
    }
  }
}
</script>
