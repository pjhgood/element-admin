<template>
  <!-- 污水监测记录 -->
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
            type="daterange"
            size="mini"
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
    <div class="table-btn">
      <el-button type="primary" size="mini" icon="el-icon-add" @click="handleAddOrEdit(null)">新增污水监测记录</el-button>
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
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleAddOrEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
      width="850px"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="form" :model="editForm.dcRecord" :rules="rules" inline label-width="140px" class="demo-form-inline">
          <el-form-item label="采样点：" prop="checkPointIdStr">
            <el-select v-model="editForm.dcRecord.checkPointIdStr" clearable size="mini" style="width:250px" placeholder="请选择采样点">
              <el-option
                v-for="item in checkPointsOptions"
                :key="item.idStr"
                :label="item.gatherPoint"
                :value="item.idStr"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="采样时间" prop="createDate">
            <el-date-picker
              v-model="editForm.dcRecord.createDate"
              size="mini"
              type="date"
              style="width:250px"
              placeholder="请选择采样时间"
            />
          </el-form-item>
          <el-form-item label="总毒品消费指数：">
            <el-input v-model.trim="editForm.dcRecord.totalConsumptionIndex" size="mini" clearable placeholder="总毒品消费指数（毫克/千人·天）" style="width:250px" />
          </el-form-item>
        </el-form>
        <table style="width:800px" border="1">
          <tr>
            <td>&nbsp;</td>
            <th>吗啡</th>
            <th>O6-甲乙酰吗啡</th>
            <th>甲基苯丙胺</th>
            <th>苯丙胺</th>
            <th>MDMA</th>
            <th>MDA</th>
            <th>氯胺酮</th>
          </tr>
          <tr>
            <td>直接检测浓度</td>
            <td><el-input v-model.trim="editForm.dcRecord.morphine" size="mini" :disabled="templateField.indexOf('morphine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.o6Methacetylmorphine" size="mini" :disabled="templateField.indexOf('o6Methacetylmorphine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.methylamphetamine" size="mini" :disabled="templateField.indexOf('methylamphetamine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.benzedrine" size="mini" :disabled="templateField.indexOf('benzedrine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.mdma" size="mini" :disabled="templateField.indexOf('mdma')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.mda" size="mini" :disabled="templateField.indexOf('mda')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.ketamine" size="mini" :disabled="templateField.indexOf('ketamine')===-1" clearable /></td>
          </tr>
          <tr>
            <td>毒品消费指数</td>
            <td><el-input v-model.trim="editForm.ciRecord.morphine" size="mini" clearable :disabled="templateField.indexOf('morphine')===-1" /></td>
            <td><el-input v-model.trim="editForm.ciRecord.o6Methacetylmorphine" size="mini" :disabled="templateField.indexOf('o6Methacetylmorphine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.methylamphetamine" size="mini" :disabled="templateField.indexOf('methylamphetamine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.benzedrine" size="mini" :disabled="templateField.indexOf('benzedrine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.mdma" size="mini" :disabled="templateField.indexOf('mdma')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.mda" size="mini" :disabled="templateField.indexOf('mda')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.ketamine" size="mini" :disabled="templateField.indexOf('ketamine')===-1" clearable /></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <th>去甲氯胺酮</th>
            <th>可卡因</th>
            <th>可待因</th>
            <th>苯甲酰爱康宁</th>
            <th>美沙酮</th>
            <th>可替宁</th>
            <th>甲卡西酮</th>
          </tr>
          <tr>
            <td>直接检测浓度</td>
            <td><el-input v-model.trim="editForm.dcRecord.norketamine" size="mini" :disabled="templateField.indexOf('norketamine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.cocaine" size="mini" :disabled="templateField.indexOf('cocaine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.codeine" size="mini" :disabled="templateField.indexOf('codeine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.benzoylecgonine" size="mini" :disabled="templateField.indexOf('benzoylecgonine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.adanon" size="mini" :disabled="templateField.indexOf('adanon')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.cotinine" size="mini" :disabled="templateField.indexOf('cotinine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.dcRecord.methcathinone" size="mini" :disabled="templateField.indexOf('methcathinone')===-1" clearable /></td>
          </tr>
          <tr>
            <td>毒品消费指数</td>
            <td><el-input v-model.trim="editForm.ciRecord.norketamine" size="mini" :disabled="templateField.indexOf('norketamine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.cocaine" size="mini" :disabled="templateField.indexOf('cocaine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.codeine" size="mini" :disabled="templateField.indexOf('codeine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.benzoylecgonine" size="mini" :disabled="templateField.indexOf('benzoylecgonine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.adanon" size="mini" :disabled="templateField.indexOf('adanon')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.cotinine" size="mini" :disabled="templateField.indexOf('cotinine')===-1" clearable /></td>
            <td><el-input v-model.trim="editForm.ciRecord.methcathinone" size="mini" :disabled="templateField.indexOf('methcathinone')===-1" clearable /></td>
          </tr>
        </table>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitAddOrEdit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import { getServiceArea } from '@/utils/auth'
import {
  sewageDCICheckResList,
  removeDCICheckRes,
  updateDCICheckRes,
  saveSewageDCICheckRes,
  allCheckPoints,
  publicSqlFieldConfig,
  findDCICheckRes
} from '@/api/sewageCheckPoint'
export default {
  name: 'SewageMonitoringRecords',
  components: { },
  data() {
    return {
      loading: false,
      editForm: {
        ciRecord: {
          adanon: null,
          benzedrine: null,
          createDate: null,
          benzoylecgonine: null,
          checkPointIdStr: null,
          cocaine: null,
          codeine: null,
          cotinine: null,
          id: null,
          ketamine: null,
          mda: null,
          mdma: null,
          methcathinone: null,
          methylamphetamine: null,
          morphine: null,
          norketamine: null,
          o6Methacetylmorphine: null,
          totalConsumptionIndex: null
        },
        dcRecord:	{
          adanon: null,
          benzedrine: null,
          createDate: null,
          benzoylecgonine: null,
          checkPointIdStr: null,
          cocaine: null,
          codeine: null,
          cotinine: null,
          id: null,
          ketamine: null,
          mda: null,
          mdma: null,
          methcathinone: null,
          methylamphetamine: null,
          morphine: null,
          norketamine: null,
          o6Methacetylmorphine: null,
          totalConsumptionIndex: null
        }
      },
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
      dialogVisible: false,
      rules: {
        checkPointIdStr: [{ required: true, message: '请输入采样点', trigger: 'change' }],
        createDate: [{ required: true, message: '请选择采样时间', trigger: 'change' }]
      },
      checkPointsOptions: [],
      templateField: [],
      templateCode: ''
    }
  },
  watch: {

  },
  created() {
    this.templateCode = getServiceArea()
    this.getSqlFieldConfig()
    this.getAllCheckPoints()
    this.getList()
  },
  destroyed() {

  },
  mounted() {
    // 筛选出河南省选项
    this.options = regionData.filter(p => { return p.label === '河南省' })
  },
  methods: {
    getAllCheckPoints() {
      allCheckPoints().then(res => {
        if (res.code === 200) {
          this.checkPointsOptions = res.data
        }
      })
    },
    getSqlFieldConfig() {
      publicSqlFieldConfig(this.templateCode).then(res => {
        if (res.code === 200) {
          var fieldData = res.data.fields
          fieldData.forEach(element => {
            this.templateField.push(element.fieldCode)
          })
        }
      })
    },
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
      sewageDCICheckResList(this.seachForm).then(res => {
        this.tableData = []
        if (res.code === 200) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        }
        this.loading = false
      })
    },
    submitAddOrEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editForm.ciRecord.createDate = this.editForm.dcRecord.createDate
          this.editForm.ciRecord.checkPointIdStr = this.editForm.dcRecord.checkPointIdStr
          this.editForm.ciRecord.totalConsumptionIndex = this.editForm.dcRecord.totalConsumptionIndex
          if (this.title === '编辑污水监测记录') {
            this.editForm.ciRecord.id = this.editForm.dcRecord.id
            this.editForm.ciRecord.idStr = this.editForm.dcRecord.idStr
            updateDCICheckRes(this.editForm).then(result => {
              if (result.code === 200) {
                this.getList()
                this.handleClose()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: result.msg
                })
              }
            })
          } else {
            saveSewageDCICheckRes(this.editForm).then(result => {
              if (result.code === 200) {
                this.getList()
                this.handleClose()
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: result.msg
                })
              }
            })
          }
        }
      })
    },
    changeCurrent(e) {
      this.seachForm.pageNo = e
      this.getList()
    },
    handleAddOrEdit(row) {
      if (row) {
        findDCICheckRes(row.idStr).then(res => {
          if (res.code === 200) {
            if (res.data.ciRecord) {
              this.editForm.ciRecord = res.data.ciRecord
            }
            if (res.data.dcRecord) {
              this.editForm.dcRecord = res.data.dcRecord
            }
          }
        })
        this.title = '编辑污水监测记录'
      } else {
        this.title = '新增污水监测记录'
      }
      this.dialogVisible = true
    },
    handleClose() {
      var data = {
        adanon: null,
        benzedrine: null,
        createDate: null,
        benzoylecgonine: null,
        checkPointIdStr: null,
        cocaine: null,
        codeine: null,
        cotinine: null,
        id: null,
        ketamine: null,
        mda: null,
        mdma: null,
        methcathinone: null,
        methylamphetamine: null,
        morphine: null,
        norketamine: null,
        o6Methacetylmorphine: null,
        totalConsumptionIndex: null
      }
      this.editForm.ciRecord = JSON.parse(JSON.stringify(data))
      this.editForm.dcRecord = JSON.parse(JSON.stringify(data))
      this.dialogVisible = false
    },
    handleDelete(row) {
      this.$confirm('是否确认删除该条数据？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        removeDCICheckRes(row.idStr).then(result => {
          if (result.code === 200) {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              type: 'error',
              message: result.msg
            })
          }
        })
      })
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
    .table-btn{
      margin-bottom:10px;
    }
    .tag-box{
      margin-bottom:2px;
    }
    table
    {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
      }
      table td, table th
      {
        border: 1px solid #cad9ea;
        color: #666;
        height: 30px;
      }
      table th
      {
        background-color: #CCE8EB;
        width: 100px;
      }
      ::v-deep .el-input.is-disabled .el-input__inner{
        background: #eee;
      }
  }
</style>
