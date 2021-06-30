<template>
  <div ref="homePage" :class="className" :style="{minHeight:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import JSON from './henan.json'
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
      default: '620px'
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
      seriesData: [],
      screenHeight: window.innerHeight
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart()
    // })
    // window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    // window.removeEventListener('resize', this.onResize)
  },
  methods: {
    getData() {
      countCityTotalDurgConsumeptionSort(this.formData).then(res => {
        if (res.code === 200) {
          this.chartData = res.data
          this.seriesData = []
          this.chartData.forEach((element, index) => {
            var itemData = {
              name: element.city,
              value: element.value
            }
            this.seriesData.push(itemData)
          })
          this.$nextTick(() => {
            this.initChart()
          })
        }
      })
    },
    // onResize() {
    //   this.screenHeight = window.innerHeight
    //   this.$refs.homePage.style.height = (this.screenHeight) + 'px'
    // },
    initChart() {
      this.chart = echarts.init(this.$el)
      echarts.registerMap('河南', JSON)
      this.chart.setOption({
        tooltip: { // 鼠标一上去的信息框
          trigger: 'item'
        },
        // visualMap: {
        //   type: 'piecewise',
        //   text: ['高', '低'],
        //   pieces: [{									// 颜色区间
        //     max: 10,
        //     label: '10',
        //     color: 'rgb(112,173,11)'
        //   },
        //   {
        //     min: 10,
        //     max: 20,
        //     label: '10-20',
        //     color: 'rgb(91,155,213)'
        //   },

        //   {
        //     min: 20,
        //     max: 30,
        //     label: '20-30',
        //     color: 'rgb(255,192,0)'
        //   },
        //   {
        //     min: 30,
        //     max: 40,
        //     label: '30-40',
        //     color: 'rgb(237,125,49)'
        //   },
        //   {
        //     min: 40,
        //     label: '>40',
        //     color: 'rgb(192,0,0)'
        //   }
        //   ],
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        // 地图配置
        geo: {
          map: '河南', // 地图类型
          zoom: 1.2, // 当前视角的缩放比例。(理解为地图放大缩小)
          roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          label: { // 文本设置（Echarts其他图表都有这样的设置，值得多看）
            normal: { // 文字颜色
              show: false, // 是否显示文字
              color: '#eee'
            },
            emphasis: { // hover各省时的文字颜色
              show: false,
              color: '#eee'
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#416cbb', // 地图区域的颜色。
              borderColor: '#fff', // 图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
              shadowColor: '#41587f', // 阴影颜色。
              shadowBlur: 10, // 图形阴影的模糊大小。
              opacity: 0.75// 图形透明度

            },
            emphasis: {
              areaColor: '#fdd145'
            }
          }
        },
        series: [
          {
            name: '苹果',
            type: 'map',
            mapType: 'china',
            geoIndex: 0, // 理解就是多个组件都能用option里配置的geo地图，类似于坐标轴里的yAxisIndex:numder,也就是说你可以配置多个geo，也可以多个组件共用geo
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: this.seriesData,
            tooltip: {
              // 利用formatter来自定义tooltip展示的数据
              formatter: function(params, ticket, callback) {
                if (params.value) {
                  return params.name + '：' + params.value
                } else {
                  callback()
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
