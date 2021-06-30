<template>
  <!-- 污水监测点管理 -->
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
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-btn">
      <el-button type="primary" size="mini" icon="el-icon-add" @click="handleAddOrEdit(null)">新增采样点</el-button>
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
      width="500px"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="form" :model="editForm" :rules="rules" label-width="120px" class="demo-form-inline">
          <el-form-item label="采样点名称：" prop="gatherPoint">
            <el-input v-model="editForm.gatherPoint" clearable size="mini" style="width:300px" placeholder="采样点名称" />
          </el-form-item>
          <el-form-item label="采样点类型：" prop="gatherPointType">
            <el-select v-model="editForm.gatherPointType" clearable size="mini" style="width:300px" placeholder="采样点类型">
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
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitAddOrEdit">确 定</el-button>
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
  name: 'WastewaterMonitoring',
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
        gatherPoint: [{ required: true, message: '请输入采样点名称', trigger: 'blur' }],
        gatherPointType: [{ required: true, message: '请选择采样点类型', trigger: 'change' }]
      }
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
      if (this.selectedAddress.length > 0) {
        this.seachForm.province = this.selectedAddress[0]
        if (this.selectedAddress.length > 1) {
          this.seachForm.city = this.selectedAddress[1]
        }
        if (this.selectedAddress.length > 2) {
          this.seachForm.areaCountry = this.selectedAddress[2]
        }
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
    submitAddOrEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.editAddress.length > 0) {
            this.editForm.province = this.editAddress[0]
            this.editForm.city = this.editAddress[1]
            this.editForm.areaCountry = this.editAddress[2]
          } else {
            this.$message({
              type: 'error',
              message: '请选择行政区域'
            })
            return
          }
          if (this.editForm.idStr) {
            updateSewageCheckPoint(this.editForm).then(res => {
              if (res.code === 200) {
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
            saveSewageCheckPoint(this.editForm).then(res => {
              if (res.code === 200) {
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
        this.title = '编辑采样点'
        this.editForm = JSON.parse(JSON.stringify(row))
        if (row.province && row.city && row.areaCountry) {
          this.editAddress.push(row.province, row.city, row.areaCountry)
        }
      } else {
        this.title = '新增采样点'
      }
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
    },
    handleDelete(row) {
      this.$confirm('是否确认删除该条数据？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteSewageCheckPoint(row.idStr).then(res => {
          if (res.code === 200) {
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
  }
</style>
