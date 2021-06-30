<template>
  <!-- 用户管理 -->
  <div class="main-box">
    <!-- <div class="seach-box">
      <el-form :inline="true" :model="seachForm" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="seachForm.gatherPoint" clearable size="mini" placeholder="用户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="table-btn">
      <el-button type="primary" size="mini" icon="el-icon-add" @click="handleAddOrEdit(null,0)">新增用户</el-button>
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
          prop="nickname"
          label="姓名"
        />
        <el-table-column
          prop="username"
          label="登录名"
        />
        <el-table-column
          prop="organName"
          label="所属部门"
        />
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-view" @click="handleAddOrEdit(scope.row,1)">查看</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleAddOrEdit(scope.row,0)">修改</el-button>
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
        <el-form ref="form" inline :model="editForm" :rules="rules" label-width="120px" class="demo-form-inline">
          <el-form-item label="登录名：" prop="username">
            <el-input v-model="editForm.username" :disabled="isReadonly" size="mini" clearable style="width:300px" placeholder="登录名" />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="editForm.password" :disabled="isReadonly" size="mini" clearable style="width:300px" placeholder="密码" />
          </el-form-item>
          <!-- <el-form-item label="确认密码：" prop="password">
            <el-input v-model="editForm.password" style="width:300px" clearable placeholder="确认密码"></el-input>
          </el-form-item> -->
          <el-form-item label="姓名：" prop="nickname">
            <el-input v-model="editForm.nickname" :disabled="isReadonly" size="mini" clearable style="width:300px" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="所属部门：" prop="organName">
            <el-input v-model="editForm.organName" :disabled="isReadonly" size="mini" clearable style="width:300px" placeholder="所属部门" />
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
import {
  getAllUserByPage,
  deleteUser,
  createNewUser,
  updateUser
} from '@/api/userManagement'
import md5 from 'js-md5'
export default {
  name: 'UserManagement',
  components: { },
  data() {
    return {
      loading: false,
      editForm: {
        id: '',
        username: '',
        password: '',
        nickname: '',
        organName: ''
      },
      seachForm: {
        pageNo: 1,
        pageSize: 10,
        organName: ''
      },
      totalCount: 0,
      tableData: [],
      title: '',
      dialogVisible: false,
      rules: {
        username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        organName: [{ required: true, message: '请输入所属部门', trigger: 'blur' }]
      },
      isReadonly: false
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

  },
  methods: {
    search() {
      this.seachForm.pageNo = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getAllUserByPage(this.seachForm).then(res => {
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
          var form = JSON.parse(JSON.stringify(this.editForm))
          form.password = md5(this.editForm.password)
          if (this.editForm.idStr) {
            updateUser(form).then(res => {
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
                  message: res.msg
                })
              }
            })
          } else {
            createNewUser(form).then(res => {
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
                  message: res.msg
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
    handleAddOrEdit(row, isReadonly) {
      this.isReadonly = false
      if (row) {
        this.editForm = JSON.parse(JSON.stringify(row))
        if (isReadonly) {
          this.title = '查看用户'
          this.isReadonly = true
        } else {
          this.title = '编辑用户'
        }
      } else {
        this.title = '新增用户'
      }
      this.dialogVisible = true
    },
    handleClose() {
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
        deleteUser(row.idStr).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
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
