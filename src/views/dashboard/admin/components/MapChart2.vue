<template>
  <!-- 区域毒情热力图 -->
  <div :id="id" class="o-echarts" />
</template>

<script>

import echarts from 'echarts'
import JSON from './henan.json'
import resize from './mixins/resize'
import { countCityTotalDurgConsumeptionSort } from '@/api/charts'

export default {
  name: 'EchartMap',
  mixins: [resize],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      id: 'echarts_' + new Date().getTime() + Math.floor(Math.random() * 1000),
      echartObj: null,
      radioList: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: ''
      },
      radioActive: 'A',
      option: {
        title: {
          text: '',
          top: '3%',
          left: '5%',
          textStyle: {
            fontSize: 18,
            fontWeight: 300,
            color: '#b6d7ff'
          }
        },
        tooltip: {
          padding: 0,
          backgroundColor: 'transparent',
          formatter: params => {
            // params.data
            return `<span>${params.data.value}</span>`
          }
        },
        legend: {
          orient: 'vertical',
          top: '9%',
          left: '5%',
          icon: 'circle',
          data: [],
          selectedMode: 'single',
          selected: {},
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          inactiveColor: '#b6d7ff',
          textStyle: {
            color: '#ec808d',
            fontSize: 14,
            fontWeight: 300,
            padding: [0, 0, 0, 15]
          }
        },
        visualMap: {
          min: 0,
          max: 500,
          show: false,
          splitNumber: 5,
          inRange: {
            color: ['#FACD91', '#74DFB2', '#81D3F8', '#768FDE', '#e9969f'].reverse()
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: '河南',
          label: {
            normal: {
              show: true,
              color: '#000'
            },
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          roam: false,
          itemStyle: {
            normal: {
              color: function(params) { // 根据不同数据显示不同颜色的标记
                if (params.value[2] >= 0 && params.value[2] < 50) {
                  return 'rgb(91,155,213)'
                } else if (params.value[2] >= 50 && params.value[2] < 100) {
                  return 'rgb(112.173,11)'
                } else if (params.value[2] >= 100 && params.value[2] < 150) {
                  return 'rgb(255.192,0)'
                } else if (params.value[2] >= 150 && params.value[2] < 200) {
                  return 'rgb(237,125,49)'
                } else if (params.value[2] >= 200) {
                  return 'rgb(192,0,0)'
                }
              }
            },
            emphasis: {
              areaColor: '#feb6aa' // hover效果
            }
          },
          left: '5%',
          right: '5%',
          top: '5%',
          bottom: '5%'
        },
        series: [{
          name: '年度总项目数据查询',
          type: 'map',
          geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
          data: []
        }]
      },
      seriesData: [],
      chartData: [],
      legendData: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.echartObj = echarts.init(document.getElementById(this.id))
    window.addEventListener('resize', () => {
      if (this.echartObj && this.echartObj.resize) {
        this.echartObj.resize()
      }
    })
  },
  methods: {
    getData() {
      countCityTotalDurgConsumeptionSort(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.seriesData = []
          this.chartData.forEach((element, index) => {
            this.legendData.push(element.city)
            var itemData = {
              name: element.city,
              value: element.value
            }
            this.seriesData.push(itemData)
          })
          this.$nextTick(() => {
            //   this.initChart()
            echarts.registerMap('河南', JSON)
            this.echartObj.setOption(this.getOptions(), true)
            this.echartObj.on('legendselectchanged', params => {
              this.radioActive = Object.keys(this.radioList).filter(item => this.radioList[item] === params.name)[0]
              this.echartObj.clear()
              this.echartObj.setOption(this.getOptions())
            })
          })
        }
      })
    },
    getOptions() {
      this.setOptions('legend', {
        data: Object.values(this.radioList),
        selected: (list => {
          const obj = {}
          Object.keys(list).map((item, index) => {
            obj[list[item]] = item === this.radioActive
          })
          return obj
        })(this.radioList)
      })
      this.setOptions('series', (() => {
        const arr = []
        Object.values(this.radioList)
          .map((item, index) => {
            arr[this.radioList[this.radioActive] === item ? 'unshift' : 'push']({
              name: item,
              type: 'map',
              geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
              data: this.seriesData
            })
          })
        return arr
      })())
      return this.option
    },
    setOptions(objKey, objVal) {
      if (this.option[objKey] && typeof this.option[objKey] === 'object' && !Array.isArray(this.option[objKey])) {
        this.option[objKey] = Object.assign(this.option[objKey], objVal)
      } else {
        this.option[objKey] = objVal
      }
      this.$set(this.option, objKey, this.option[objKey])
    }
  }
}
</script>

<style lang="scss">
    .o-echarts {
        min-width: 300px;
        min-height: 500px;
        width: 750px;
        height: 750px;
    }
</style>
