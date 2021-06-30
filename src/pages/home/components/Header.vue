<template>
  <div class="header-title">
    <div class="header-width" />
    <div class="flex-box">
      <div>
        <img src="data:image/png;base64,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" alt="">
      </div>
      <div>
        <h2 class="title-left-title-font">禁毒总队城市污水毒情监测平台</h2>
      </div>
      <div>
        <img src="data:image/png;base64,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" alt="">
      </div>
    </div>
    <div class="flex-box header-right">
      <div class="title-date">
        <span>{{ formatDateTime }}</span>
      </div>
      <screenfull id="screenfull" class="full-icon" />
    </div>
    <div class="header-width" />
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
export default {
  components: {
    Screenfull
  },
  data() {
    return {
      formatDateTime: '' // 当前日期时间
    }
  },
  mounted() {
    // 页面加载完后显示当前时间
    this.dealWithTime(new Date())
    // 定时刷新时间
    this.timer = setInterval(() => {
      this.dealWithTime(new Date()) // 修改数据date
    }, 500)
  },
  methods: {
    dealWithTime(data) { // 获取当前时间
      const Y = data.getFullYear()
      const M = data.getMonth() + 1
      const D = data.getDate()
      let H = data.getHours()
      let Min = data.getMinutes()
      let S = data.getSeconds()
      let W = data.getDay()
      H = H < 10 ? '0' + H : H
      Min = Min < 10 ? '0' + Min : Min
      S = S < 10 ? '0' + S : S
      switch (W) {
        case 0:
          W = '日'
          break
        case 1:
          W = '一'
          break
        case 2:
          W = '二'
          break
        case 3:
          W = '三'
          break
        case 4:
          W = '四'
          break
        case 5:
          W = '五'
          break
        case 6:
          W = '六'
          break
        default:
          break
      }
      this.formatDateTime = Y + '年' + M + '月' + D + '日 ' + ' 周' + W + H + ':' + Min + ':' + S
    }
  }
}
</script>

<style lang="scss">
.header-title{
  width:100%;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-content: center;
  background: #000c3b;
  padding:10px 0;
  .flex-box{
    display: flex;
    align-items: center;
    .title-left-title-font {
      float: left;
      margin: 0 10px;
      font-size:25px;
      line-height: 50px;
      width:350px;
      background: -webkit-linear-gradient(top, #fff, #65c4f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .title-date{
    padding: 0 20px;
    color: #5b8bb6;
    background: linear-gradient(to bottom, #043768, #000c3b,#043768);
    -webkit-box-shadow: inset 0 0 30px #07417a;
    box-shadow: inset 0 0 30px #07417a;
    border: solid 2px #032d60;
    border-radius: 10px;
    box-shadow: 4px 2px 6px #033579, -4px -2px 6px #033579, 0px 0px 12px 5px #033579 inset;
    font-family: "\5FAE\8F6F\96C5\9ED1";
    font-size: 16px;
    max-height: 100px;
    line-height: 38px;
    max-width: 355px;
    margin: 5px auto;
  }
  .full-icon{
    margin-left:30px;
  }
  .header-width{
     width:400px;
  }
  .header-right{
    position: absolute;
    right:10px
  }
}
</style>
