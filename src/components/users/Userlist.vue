<template>
  <div class="userlist">
    <el-container>
      <!-- 头部导航 -->
      <el-header class="users_header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="el-breadcrumb-item">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item class="el-breadcrumb-item">用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!-- 用户列表 -->
      <el-main class="users_main">
        <el-card class="box-card">
          <!-- 搜索 -->
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-input
                  class="search"
                  placeholder="请输入搜索内容"
                  v-model="query"
                  clearable
                  @clear="search()"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <el-button icon="el-icon-search" class="searchBtn" type="info" @click="search"></el-button>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content bg-purple">
                <!-- 添加用户,打开弹框 -->
                <el-button type="primary" @click="addHandel">添加用户</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" class="users_table">
              <el-table-column prop="index" label="#" width="40"></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="mobile" label="电话"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column prop="mg_state" label="状态">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="stateChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop label="操作" width="180px">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top-start"
                    :enterable="false"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editHandle(scope.row.id)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteHandle(scope.row.id)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="角色分配"
                    placement="top-end"
                    :enterable="false"
                  >
                    <el-button
                      type="warning"
                      icon="el-icon-setting"
                      size="mini"
                      @click="settingHandle(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalnum"
              :page-sizes="[1, 2, 5, 7, 9]"
              :page-size="paginationData.pagesize"
              :current-page.sync="paginationData.pagenum"
              @size-change="sizeChange"
              @current-change="pageChange"
              :disabled="isDisabled"
            ></el-pagination>
          </div>
        </el-card>
      </el-main>
      <!-- 新增和编辑弹窗 -->
      <template>
        <el-dialog
          :title="isEdit?'编辑用户':'添加用户'"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
          @close="dialogClose"
        >
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username" :disabled="isEdit">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!isEdit">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addAndEditUser(addForm.id)">确 定</el-button>
          </span>
        </el-dialog>
      </template>

      <!-- 分配角色dialog -->
      <template>
        <el-dialog
          title="分配角色"
          :visible.sync="settingDialogVisible"
          width="50%"
          :before-close="handleClose"
        >
          <div>当前的用户:{{settingShowInfo.username}}</div>
          <div>当前的角色:{{settingShowInfo.role_name}}</div>
          <div>
            分配新角色:
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="settingDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="settingRoles(value)">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'userlist',
  data() {
    /* 自定义手机号码验证规则 */
    var validateMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      value: '',
      settingDialogVisible: false,
      isEdit: false,
      dialogVisible: false,
      totalnum: 1,
      query: '',
      isDisabled: false,
      paginationData: {
        pagesize: 1,
        pagenum: 1
      },
      tableData: [],
      addForm: { username: '', password: '', email: '', mobile: '' },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      roleList: [],
      settingShowInfo: {}
    }
  },
  methods: {
    sizeChange(v) {
      this.paginationData.pagesize = v
      this.queryUserlist()
    },
    pageChange(v) {
      this.paginationData.pagenum = v
      this.queryUserlist()
    },
    /* 查询用户列表 */
    async queryUserlist() {
      const { data, meta } = await this.$axios.get('/users', {
        params: {
          query: this.query,
          ...this.paginationData
        }
      })
      //   console.log(data)
      if (meta.status !== 200) {
        return this.$message.error('查询错误')
      }
      if (meta.status === 200) {
        this.totalnum = data.total
        for (let i = 0, len = data.users.length; i < len; i++) {
          data.users[i].index = i + 1
        }
        this.paginationData.pagenum = data.pagenum
        this.tableData = data.users
      }
    },
    /* 搜索按钮 */
    search() {
      this.isDisabled = false
      this.paginationData.pagenum = 1
      this.queryUserlist()
    },
    /* 监听状态改变 */
    async stateChange({ id, mg_state: mgState }) {
      //   console.log(mgState)
      const {
        meta: { msg, status }
      } = await this.$axios.put(`users/${id}/state/${mgState}`)
      //   console.log(data)
      if (status !== 200) {
        mgState = !mgState
        return this.$message.error(msg)
      }
      this.$message.success(msg)
    },
    /* 弹窗关闭之前回调 */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /* 对话框关闭的回调 */
    dialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    /* 添加新用户或者编辑后提交 */
    addAndEditUser(v) {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          return this.$message.error('填写信息存在不合法,请重新输入')
        }
        // 添加用户执行代码
        if (!this.isEdit) {
          // this.dialogVisible = false
          // 验证成功后,发送请求
          const {
            meta: { msg, status }
          } = await this.$axios.post('/users', this.addForm)
          // console.log(res)
          if (status !== 201) return this.$message.error(msg)
          this.$message.success(msg)
          this.dialogVisible = false
          this.queryUserlist()
        } else {
          const { email, mobile } = this.addForm
          const {
            meta: { msg, status }
          } = await this.$axios.put(`users/${v}`, { email, mobile })
          // console.log(res)
          if (status !== 200) return this.$message.error(msg)
          this.$message.success(msg)
          this.dialogVisible = false
          this.queryUserlist()
        }
      })
    },
    /* 打开添加框 */
    addHandel() {
      this.isEdit = false
      this.dialogVisible = true
    },
    /* 打开编辑框 */
    async editHandle(id) {
      this.isEdit = true
      this.dialogVisible = true
      //   console.log(id)
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get(`users/${id}`)
      if (status !== 200) return this.$message.error(msg)
      //   console.log(res)
      this.$message.success(msg)
      this.addForm = data
    },
    /* 删除事件处理函数 */
    async deleteHandle(id) {
      //   const res = await this.$axios.delete(`users/${id}`)
      const resConfirm = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //   console.log(resConfirm)
      if (resConfirm !== 'confirm') {
        return this.$message('取消删除')
      }
      const {
        meta: { msg, status }
      } = await this.$axios.delete(`users/${id}`)
      //   console.log(status)
      if (status !== 200) return this.$message.error(msg)
      this.$message.success(msg)
      // console.log(this.totalnum % this.paginationData.pagesize)
      // console.log(this.paginationData.pagenum > 1)
      if (
        this.totalnum % this.paginationData.pagesize < 2 &&
        this.paginationData.pagenum > 1
      ) {
        this.paginationData.pagenum -= 1
        // console.log(this.paginationData.pagenum)
      }
      if (
        this.totalnum % this.paginationData.pagesize === 0 &&
        this.paginationData.pagenum > 1
      ) {
        this.paginationData.pagenum += 1
      }
      // console.log(this.paginationData.pagenum)
      this.queryUserlist()
    },
    /* 打开分配角色弹框 */
    async settingHandle(v) {
      this.settingShowInfo = v
      // console.log(this.settingShowInfo)
      this.settingDialogVisible = true
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('roles')
      // console.log(res)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.roleList = data
      // console.log(this.roleList)
    },
    /* 分配角色 */
    async settingRoles(v) {
      const userId = this.settingShowInfo.id
      // v为角色id
      // console.log(v)
      const {
        meta: { msg, status }
      } = await this.$axios.put(`users/${userId}/role`, {
        rid: v
      })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.$message.success(msg)
      this.settingDialogVisible = false
      this.queryUserlist()
    }
  },
  watch: {
    query(n) {
      if (!n) return (this.isDisabled = false)
      this.isDisabled = true
    }
  },
  mounted() {
    this.queryUserlist()
  }
}
</script>

<style lang="less" scoped>
.userlist {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  /* 头部导航 */
  .users_header {
    height: 35px !important;
    background-color: #ff330044;
    .el-breadcrumb-item {
      font-size: 16px;
      line-height: 30px;
    }
  }
  .users_main {
    padding: 15px 0 0 10px;
  }
  /* 表格 */
  .users_table {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
