<template>
  <div :class="className" :style="{height:height,width:width}" />
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
    initChart() {
      this.chart = echarts.init(this.$el)
      echarts.registerMap('河南', JSON)
      this.chart.setOption({
        // title: {
        //     text: '',
        //     top: '3%',
        //     left: '5%',
        //     textStyle: {
        //         fontSize: 18,
        //         fontWeight: 300,
        //         color: '#b6d7ff'
        //     }
        // },
        // tooltip: {
        //     padding: 0,
        //     backgroundColor: 'transparent',
        //     formatter: params => {
        //         // params.data
        //         return `<span>${params.data.value}</span>`;
        //     }
        // },
        // legend: {
        //     orient: 'vertical',
        //     top: '9%',
        //     left: '5%',
        //     icon: 'circle',
        //     data: [],
        //     selectedMode: 'single',
        //     selected: {},
        //     itemWidth: 12,
        //     itemHeight: 12,
        //     itemGap: 30,
        //     inactiveColor: '#b6d7ff',
        //     textStyle: {
        //         color: '#ec808d',
        //         fontSize: 14,
        //         fontWeight: 300,
        //         padding: [0, 0, 0, 15]
        //     }
        // },
        // visualMap: {
        //     min: 0,
        //     max: 500,
        //     show: false,
        //     splitNumber: 5,
        //     inRange: {
        //         color: ['#FACD91', '#74DFB2', '#81D3F8', '#768FDE', '#e9969f'].reverse()
        //     },
        //     textStyle: {
        //         color: '#fff'
        //     }
        // },
        // geo: {
        //     map: '河南',
        //     label: {
        //         normal: {
        //             show: true,
        //             color: '#000'
        //         },
        //         emphasis: {
        //             show: true,
        //             color: '#fff'
        //         }
        //     },
        //     show:true,
        //     roam: false,
        //     itemStyle: {
        //     normal: {
        //         color:function(params){  //根据不同数据显示不同颜色的标记
        //             if (params.value >= 0 && params.value< 50) {
        //                 return 'rgb(91,155,213)';
        //             } else if (params.value >= 50 && params.value< 100) {
        //                 return 'rgb(112,173,11)';
        //             } else if (params.value >= 100 && params.value< 150) {
        //                 return 'rgb(255,192,0)';
        //             } else if (params.value >= 150 && params.value < 200) {
        //                 return 'rgb(237,125,49)';
        //             } else if (params.value >= 200) {
        //                 return 'rgb(192,0,0)';
        //             }
        //         }
        //     },
        //     emphasis: {
        //         areaColor: '#feb6aa' // hover效果
        //     }
        //   },
        //   left: '5%',
        //   right: '5%',
        //   top: '5%',
        //   bottom: '5%'
        // },
        // series: [{
        //     name: '',
        //     type: 'map',
        //     geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
        //     data: this.seriesData
        // }]
        tooltip: { // 鼠标一上去的信息框
          trigger: 'item'
        },

        // visualMap: { // visualMap 是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
        //   show: true, // 是否显示组件
        //   max: 60, // 指定 visualMapContinuous 组件的允许的最大值
        //   left: '5%',
        //   top: 'bottom',
        //   bottom: '5%',
        //   text: ['高', '低'], // 两端的文本，如 ['High', 'Low']
        //   calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
        //   inRange: { // 定义 在选中范围中 的视觉元素。
        //     color: ['rgb(91,155,213)', 'rgb(112,173,11)', 'rgb(255,192,0)', 'rgb(237,125,49)', 'rgb(192,0,0)'] // 图元的颜色。
        //   },
        //   textStyle: { // 设置文字颜色（Demo左下组件）
        //     color: '#eee'
        //   }
        // },
        visualMap: {
          type: 'piecewise',
          text: ['高', '低'],
          pieces: [{									// 颜色区间
            max: 10,
            label: '10',
            color: 'rgb(91,155,213)'
          },
          {
            min: 10,
            max: 20,
            label: '10-20',
            color: 'rgb(112,173,11)'
          },

          {
            min: 20,
            max: 30,
            label: '20-30',
            color: 'rgb(255,192,0)'
          },
          {
            min: 30,
            max: 40,
            label: '30-40',
            color: 'rgb(237,125,49)'
          },
          {
            min: 40,
            label: '>40',
            color: 'rgb(192,0,0)'
          }
          ],
          textStyle: {
            color: '#fff'
          }
        },
        // 地图配置
        geo: {
          map: '河南', // 地图类型
          zoom: 1.24, // 当前视角的缩放比例。(理解为地图放大缩小)
          roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          label: { // 文本设置（Echarts其他图表都有这样的设置，值得多看）
            normal: { // 文字颜色
              show: true, // 是否显示文字
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
