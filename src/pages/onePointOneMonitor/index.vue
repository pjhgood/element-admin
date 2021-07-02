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
        <!-- <el-form-item label="采样时间">
          <el-date-picker
            v-model="monitoringTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item> -->
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
      top="10px"
      width="90%"
      :before-close="handleClose"
    >
      <span>
        <div>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="8" :lg="8">
              <div class="chart-wrapper">
                <div class="data-title">
                  <b class="data-title-left">[</b>
                  <span>各类毒品占比</span>
                  <b class="data-title-right">]</b>
                </div>
                <pie-chart :form-data="formData" :height="'230px'" />
              </div>

            </el-col>
            <el-col :xs="24" :sm="8" :lg="8">
              <div class="chart-wrapper">
                <div class="data-title">
                  <b class="data-title-left">[</b>
                  <span>各毒品消费指数</span>
                  <b class="data-title-right">]</b>
                </div>
                <cross-chart :form-data="formData" :height="'230px'" />
              </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8">
              <div class="chart-wrapper">
                <div class="data-title">
                  <b class="data-title-left">[</b>
                  <span>毒品消费总量</span>
                  <b class="data-title-right">]</b>
                </div>
                <cross-chart :form-data="formData" :height="'230px'" />
              </div>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            border
            height="500"
            :data="tableData"
            style="width: 100%;margin-top:10px"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{textAlign: 'center'}"
          >
            <el-table-column
              type="index"
              label="编号"
              width="50"
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
              prop="createDate"
              label="采样时间"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.createDate.split(" ")[0] }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalConsumptionIndex"
              label="直接检测浓度"
            >
              <template slot-scope="scope">
                <div v-if="templateField.indexOf('morphine')!==-1" class="tag-box"><el-tag effect="dark">吗啡：{{ scope.row.morphine }}</el-tag></div>
                <div v-if="templateField.indexOf('o6Methacetylmorphine')!==-1" class="tag-box"><el-tag effect="dark" type="success">O6-甲乙酰吗啡：{{ scope.row.o6Methacetylmorphine }}</el-tag></div>
                <div v-if="templateField.indexOf('methylamphetamine')!==-1" class="tag-box"><el-tag effect="dark" type="info">甲基苯丙胺：{{ scope.row.methylamphetamine }}</el-tag></div>
                <div v-if="templateField.indexOf('benzedrine')!==-1" class="tag-box"><el-tag effect="dark" type="warning">苯丙胺：{{ scope.row.benzedrine }}</el-tag></div>
                <div v-if="templateField.indexOf('mdma')!==-1" class="tag-box"><el-tag effect="dark" type="danger">MDMA：{{ scope.row.mdma }}</el-tag></div>
                <div v-if="templateField.indexOf('mda')!==-1" class="tag-box"><el-tag effect="dark">MDA：{{ scope.row.mda }}</el-tag></div>
                <div v-if="templateField.indexOf('ketamine')!==-1" class="tag-box"><el-tag effect="dark" type="success">氯胺酮：{{ scope.row.ketamine }}</el-tag></div>
                <div v-if="templateField.indexOf('norketamine')!==-1" class="tag-box"><el-tag effect="dark" type="info">去甲氯胺酮：{{ scope.row.norketamine }}</el-tag></div>
                <div v-if="templateField.indexOf('cocaine')!==-1" class="tag-box"><el-tag effect="dark" type="warning">可卡因：{{ scope.row.cocaine }}</el-tag></div>
                <div v-if="templateField.indexOf('codeine')!==-1" class="tag-box"><el-tag effect="dark" type="danger">可待因：{{ scope.row.codeine }}</el-tag></div>
                <div v-if="templateField.indexOf('benzoylecgonine')!==-1" class="tag-box"><el-tag effect="dark">苯甲酰爱康宁：{{ scope.row.benzoylecgonine }}</el-tag></div>
                <div v-if="templateField.indexOf('adanon')!==-1" class="tag-box"><el-tag effect="dark" type="success">美沙酮：{{ scope.row.adanon }}</el-tag></div>
                <div v-if="templateField.indexOf('cotinine')!==-1" class="tag-box"><el-tag effect="dark" type="info">可替宁：{{ scope.row.cotinine }}</el-tag></div>
                <div v-if="templateField.indexOf('methcathinone')!==-1" class="tag-box"><el-tag effect="dark" type="warning">甲卡西酮：{{ scope.row.methcathinone }}</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalConsumptionIndex"
              label="毒品消费指数"
            >
              <template slot-scope="scope">
                <div v-if="templateField.indexOf('morphine')!==-1" class="tag-box"><el-tag effect="dark">吗啡：{{ scope.row.ciRecord.morphine }}</el-tag></div>
                <div v-if="templateField.indexOf('o6Methacetylmorphine')!==-1" class="tag-box"><el-tag effect="dark" type="success">O6-甲乙酰吗啡：{{ scope.row.ciRecord.o6Methacetylmorphine }}</el-tag></div>
                <div v-if="templateField.indexOf('methylamphetamine')!==-1" class="tag-box"><el-tag effect="dark" type="info">甲基苯丙胺：{{ scope.row.ciRecord.methylamphetamine }}</el-tag></div>
                <div v-if="templateField.indexOf('benzedrine')!==-1" class="tag-box"><el-tag effect="dark" type="warning">苯丙胺：{{ scope.row.ciRecord.benzedrine }}</el-tag></div>
                <div v-if="templateField.indexOf('mdma')!==-1" class="tag-box"><el-tag effect="dark" type="danger">MDMA：{{ scope.row.ciRecord.mdma }}</el-tag></div>
                <div v-if="templateField.indexOf('mda')!==-1" class="tag-box"><el-tag effect="dark">MDA：{{ scope.row.ciRecord.mda }}</el-tag></div>
                <div v-if="templateField.indexOf('ketamine')!==-1" class="tag-box"><el-tag effect="dark" type="success">氯胺酮：{{ scope.row.ciRecord.ketamine }}</el-tag></div>
                <div v-if="templateField.indexOf('norketamine')!==-1" class="tag-box"><el-tag effect="dark" type="info">去甲氯胺酮：{{ scope.row.ciRecord.norketamine }}</el-tag></div>
                <div v-if="templateField.indexOf('cocaine')!==-1" class="tag-box"><el-tag effect="dark" type="warning">可卡因：{{ scope.row.ciRecord.cocaine }}</el-tag></div>
                <div v-if="templateField.indexOf('codeine')!==-1" class="tag-box"><el-tag effect="dark" type="danger">可待因：{{ scope.row.ciRecord.codeine }}</el-tag></div>
                <div v-if="templateField.indexOf('benzoylecgonine')!==-1" class="tag-box"><el-tag effect="dark">苯甲酰爱康宁：{{ scope.row.ciRecord.benzoylecgonine }}</el-tag></div>
                <div v-if="templateField.indexOf('adanon')!==-1" class="tag-box"><el-tag effect="dark" type="success">美沙酮：{{ scope.row.ciRecord.adanon }}</el-tag></div>
                <div v-if="templateField.indexOf('cotinine')!==-1" class="tag-box"><el-tag effect="dark" type="info">可替宁：{{ scope.row.ciRecord.cotinine }}</el-tag></div>
                <div v-if="templateField.indexOf('methcathinone')!==-1" class="tag-box"><el-tag effect="dark" type="warning">甲卡西酮：{{ scope.row.ciRecord.methcathinone }}</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalConsumptionIndex"
              label="总毒品消费指数"
            />
          </el-table>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getServiceArea } from '@/utils/auth'
import { regionData } from 'element-china-area-data'
import PieChart from '@/pages/home/components/PieChart'
import CrossChart from '@/pages/home/components/CrossChart'
import {
  oneSewageCheckPointoneDocList,
  oneSewageCheckPointOneDocRecordList
} from '@/api/sewageCheckPoint'
export default {
  name: 'OnePointOneMonitor',
  components: { PieChart, CrossChart },
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
      // monitoringTime: [],
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
      dialogVisible: false,
      formData: {
        checkDateStart: '',
        checkDateEnd: '',
        templateCode: ''
      },
      templateCode: ''
    }
  },
  watch: {

  },
  created() {
    this.getList()
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
      // if (this.monitoringTime && this.monitoringTime.length > 0) {
      //   this.seachForm.checkDateStart = this.monitoringTime[0]
      //   this.seachForm.checkDateEnd = this.monitoringTime[1]
      // }
      this.loading = true
      oneSewageCheckPointoneDocList(this.seachForm).then(res => {
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
  .dialog-footer{
    display: flex;
    justify-content: center;
  }
  .el-dialog__body{
    padding:10px 20px
  }
  .chart-wrapper {
     padding: 0;
      height: 50%;
      // margin: 20px 10px 0px 10px;
      border: 2px solid #032d60;
      background: #032d60;
      -webkit-box-shadow: #07417a 0px 0px 10px;
      box-shadow: inset 0 0 30px #07417a;
      position: relative;
      .data-title {
        position: absolute;
        top: -0.7em;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        background-color: #032d60;
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
</style>
