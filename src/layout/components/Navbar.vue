<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="right-title">
      <img class="" src="data:image/png;base64,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" alt="">
      <span>万孚云剑智能毒检城市污水毒情监测平台</span>
    </div>

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">

        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="全局字号" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template> -->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <!-- <div>
          <h2 class="user-name">{{ userName }}，你好!</h2>
          <span>{{ formatDateTime }}</span>
          <div style="width:200px;height:30px">
            <iframe
              id="tianqi"
              scrolling="no"
              frameborder="0"
              allowtransparency="true"
              src="http://i.tianqi.com/index.php?c=code&a=getcode&id=34&h=25&w=280"
            ></iframe>
          </div>
        </div> -->
        <div class="avatar-wrapper">
          <img src="http://dearus.cn/qypolice/static/img/default-avatar.442b08d.png" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link> -->
          <router-link to="/">
            <el-dropdown-item>监控大屏</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { removeToken } from '@/utils/auth'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    ErrorLog,
    // Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      formatDateTime: '' // 当前日期时间
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
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
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      removeToken()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
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

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .right-title{
    float: left;
    font-size: 20px;
    line-height: 50px;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    img{
        width: 40px;
        height: 26px;
        margin-right: 5px;
    }
  }
}
</style>
