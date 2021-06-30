<template>
  <!-- 一点一档监控 -->
  <div class="main-box">
    <div class="seach-box">
      <el-form :inline="true" :model="seachForm" class="demo-form-inline">
        <el-form-item label="采样点名称">
          <el-input v-model="seachForm.gatherPoint" size="mini" clearable placeholder="采样点名称" />
        </el-form-item>
        <el-form-item label="采样点类型">
          <el-select v-model="seachForm.gatherPointType" size="mini" clearable placeholder="采样点类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="行政区域">
          <el-cascader
            v-model="selectedAddress"
            clearable
            size="mini"
            :options="options"
            :props="SetKesDept"
            placeholder="行政区域"
          />
        </el-form-item>
        <el-form-item label="采样时间">
          <el-date-picker
            v-model="monitoringTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column
          type="index"
          label="采样点编号"
          width="100"
        />
        <el-table-column
          prop="gatherPoint"
          label="采样点"
        />
        <el-table-column
          prop="province"
          label="省"
        />
        <el-table-column
          prop="city"
          label="城市"
        />
        <el-table-column
          prop="areaCountry"
          label="区县"
        />
        <el-table-column
          prop="gatherPointType"
          label="采样点类型"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.gatherPointType===1">污水厂</div>
            <div v-if="scope.row.gatherPointType===2">小区</div>
            <div v-if="scope.row.gatherPointType===3">娱乐场所</div>
            <div v-if="scope.row.gatherPointType===4">其他</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="gatherPoint"
          label="累计检测次数"
        />
        <el-table-column
          prop="gatherPoint"
          label="最近采样时间"
        />
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-view" @click="handleAddOrEdit(scope.row)">数据</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="10"
          :total="totalCount"
          :current-page.sync="seachForm.pageNo"
          @current-change="changeCurrent"
        />
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="form" :model="editForm" :rules="rules" label-width="120px" class="demo-form-inline">
          <el-form-item label="采样点名称：" prop="gatherPoint">
            <el-input v-model="editForm.gatherPoint" size="mini" clearable style="width:300px" placeholder="采样点名称" />
          </el-form-item>
          <el-form-item label="采样点类型：" prop="gatherPointType">
            <el-select v-model="editForm.gatherPointType" size="mini" clearable style="width:300px" placeholder="采样点类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="行政区域：" required>
            <el-cascader
              v-model="editAddress"
              clearable
              size="mini"
              style="width:300px"
              :options="options"
              :props="SetKesDept"
              placeholder="行政区域"
            />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import {
  sewageCheckPointList,
  deleteSewageCheckPoint,
  updateSewageCheckPoint,
  saveSewageCheckPoint
} from '@/api/sewageCheckPoint'
export default {
  name: 'OnePointOneMonitor',
  components: { },
  data() {
    return {
      loading: false,
      editForm: {
        id: '',
        areaCountry: '',
        city: '',
        gatherPoint: '',
        gatherPointType: null,
        province: ''
      },
      editAddress: [],
      monitoringTime: [],
      selectedAddress: [],
      SetKesDept: {
        value: 'label',
        label: 'label',
        children: 'children',
        checkStrictly: true
      },
      seachForm: {
        areaCountry: '',
        checkDateEnd: '',
        checkDateStart: '',
        city: '',
        gatherPoint: '',
        gatherPointType: null,
        pageNo: 1,
        pageSize: 10,
        province: ''
      },
      typeOptions: [
        {
          value: 1,
          label: '污水厂'
        },
        {
          value: 2,
          label: '小区'
        },
        {
          value: 3,
          label: '娱乐场所'
        },
        {
          value: 4,
          label: '其他'
        }
      ],
      options: [],
      totalCount: 0,
      tableData: [],
      title: '',
      dialogVisible: false
    }
  },
  watch: {

  },
  created() {
    this.getList()
  },
  destroyed() {

  },
  mounted() {
    // 筛选出河南省选项
    this.options = regionData.filter(p => { return p.label === '河南省' })
  },
  methods: {
    search() {
      this.seachForm.pageNo = 1
      this.getList()
    },
    getList() {
      this.seachForm.province = ''
      this.seachForm.city = ''
      this.seachForm.areaCountry = ''
      this.seachForm.checkDateStart = ''
      this.seachForm.checkDateEnd = ''
      if (this.selectedAddress.length > 0) {
        this.seachForm.province = this.selectedAddress[0]
        if (this.selectedAddress.length > 1) {
          this.seachForm.city = this.selectedAddress[1]
        }
        if (this.selectedAddress.length > 2) {
          this.seachForm.areaCountry = this.selectedAddress[2]
        }
      }
      if (this.monitoringTime && this.monitoringTime.length > 0) {
        this.seachForm.checkDateStart = this.monitoringTime[0]
        this.seachForm.checkDateEnd = this.monitoringTime[1]
      }
      this.loading = true
      sewageCheckPointList(this.seachForm).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        }
        this.loading = false
      })
    },
    changeCurrent(e) {
      this.seachForm.pageNo = e
      this.getList()
    },
    handleAddOrEdit(row) {
      this.title = '一点一档记录详情'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleClose() {
      this.editAddress = []
      for (const key in this.editForm) {
        if (Object.hasOwnProperty.call(this.editForm, key)) {
          this.editForm[key] = null
        }
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-box{
    padding:10px;
    background: #fff;
    height:100%;
    .pagination-wrap{
      text-align: center;
      margin-top:10px;
    }
  }
</style>
