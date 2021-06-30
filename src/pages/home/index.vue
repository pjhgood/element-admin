<template>
  <div class="dashboard-editor-container" :style="{minHeight:bodyHeight}">
    <div ref="header">
      <Header />
    </div>
    <el-row :gutter="0">
      <el-col :xs="24" :sm="6" :lg="6">
        <div class="chart-wrapper">
          <span class="topL" />
          <span class="topR" />
          <span class="bottomL" />
          <span class="bottomR" />
          <div class="data-title">
            <b class="data-title-left">[</b>
            <span>各类毒品占比</span>
            <b class="data-title-right">]</b>
          </div>
          <pie-chart :form-data="formData" :height="(screenHeight/2-12) + 'px'" />
        </div>

        <div class="chart-wrapper">
          <span class="topL" />
          <span class="topR" />
          <span class="bottomL" />
          <span class="bottomR" />
          <div class="data-title">
            <b class="data-title-left">[</b>
            <span>城市污水采样检测趋势</span>
            <b class="data-title-right">]</b>
          </div>
          <cross-chart :form-data="formData" :height="(screenHeight/2-12) + 'px'" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <span class="topL" />
          <span class="topR" />
          <span class="bottomL" />
          <span class="bottomR" />
          <div class="data-title">
            <b class="data-title-left">[</b>
            <span>区域毒情热力图</span>
            <b class="data-title-right">]</b>
          </div>
          <map-chart2 :form-data="formData" :height="screenHeight + 'px'" />
          <map-chart class="mapChart" :form-data="formData" :height="screenHeight + 'px'" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="6" :lg="6">

        <div class="chart-wrapper">
          <span class="topL" />
          <span class="topR" />
          <span class="bottomL" />
          <span class="bottomR" />
          <div class="data-title">
            <b class="data-title-left">[</b>
            <span>城市毒品消费指数</span>
            <b class="data-title-right">]</b>
          </div>
          <stacked-bar-chart :form-data="formData" :height="(screenHeight/2-12) + 'px'" />
        </div>

        <div class="chart-wrapper">
          <span class="topL" />
          <span class="topR" />
          <span class="bottomL" />
          <span class="bottomR" />
          <div class="data-title">
            <b class="data-title-left">[</b>
            <span>城市毒品消费总量排名</span>
            <b class="data-title-right">]</b>
          </div>
          <bar-chart :form-data="formData" :height="(screenHeight/2-12) + 'px'" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CrossChart from './components/CrossChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import Header from './components/Header'
import StackedBarChart from './components/StackedBarChart'
import MapChart from './components/MapChart'
import MapChart2 from './components/MapChart2'
import { getServiceArea } from '@/utils/auth'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PieChart,
    BarChart,
    Header,
    StackedBarChart,
    MapChart,
    MapChart2,
    CrossChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      formData: {
        checkDateStart: '',
        checkDateEnd: '',
        templateCode: ''
      },
      templateCode: '',
      screenHeight: '',
      bodyHeight: 0
    }
  },
  created() {
    this.templateCode = getServiceArea()
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }

    this.formData.checkDateStart = year + '-' + '01' + '-' + '01'
    this.formData.checkDateEnd = year + '-' + month + '-' + day
    this.formData.templateCode = this.templateCode
  },
  mounted() {
    // var headerHeight = this.$refs.header.offsetHeight
    // 获取窗口高度
    if ((document.body) && (document.body.clientHeight)) {
      var bodyHeight = document.body.clientHeight
    }
    // this.screenHeight = bodyHeight - headerHeight - 48
    this.screenHeight = bodyHeight - 72 - 48
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    onResize() {
      // var headerHeight = this.$refs.header.offsetHeight
      // 获取窗口高度
      if ((document.body) && (document.body.clientHeight)) {
        this.bodyHeight = document.body.clientHeight
      }
      // this.screenHeight = this.bodyHeight - headerHeight - 48
      this.screenHeight = this.bodyHeight - 72 - 48
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px 10px 14px 10px;
  // min-height:100%;
  overflow-y: hidden;
  background-color: #000c3b;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
      padding: 0;
      height: 50%;
      margin: 20px 10px 0px 10px;
      border: 2px solid #032d60;
      -webkit-box-shadow: #07417a 0px 0px 10px;
      box-shadow: inset 0 0 30px #07417a;
      position: relative;
    .topL {
        width: 20px;
        height: 20px;
        border-top-width: 2px;
        border-top-color: #26c6f0;
        border-top-style: solid;
        border-left-width: 2px;
        border-left-color: #26c6f0;
        border-left-style: solid;
        position: absolute;
        top: -2px;
        left: -2px;
    }
    .topR {
        width: 20px;
        height: 20px;
        border-top-width: 2px;
        border-top-color: #26c6f0;
        border-top-style: solid;
        border-right-width: 2px;
        border-right-color: #26c6f0;
        border-right-style: solid;
        position: absolute;
        top: -2px;
        right: -2px;
    }
    .bottomL {
        width: 20px;
        height: 20px;
        border-bottom-width: 2px;
        border-bottom-color: #26c6f0;
        border-bottom-style: solid;
        border-left-width: 2px;
        border-left-color: #26c6f0;
        border-left-style: solid;
        position: absolute;
        bottom: -2px;
        left: -2px;
    }
    .bottomR {
        width: 20px;
        height: 20px;
        border-bottom-width: 2px;
        border-bottom-color: #26c6f0;
        border-bottom-style: solid;
        border-right-width: 2px;
        border-right-color: #26c6f0;
        border-right-style: solid;
        position: absolute;
        bottom: -2px;
        right: -2px;
    }
    .data-title {
        position: absolute;
        top: -0.7em;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        background-color: #000c3b;
        text-align: center;
        margin: 0 auto 0 auto;
        color: #83c7e3;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .data-title-left .data-title-right {
            color: #105eda;
            font-family: "\5FAE\8F6F\96C5\9ED1";
            font-size: 16px;
        }
        span{
          margin:0 15px;
          font-size: 1.2em;
          color: #83c7e3;
        }
    }
  }
  .mapChart{
    position:absolute;
    left:0px;
    top:-10px
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
