<template>
  <div class="roles">
    <!-- 头部导航 -->
    <el-header class="users_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- 卡片 表格部分 -->
    <el-card class="box-card">
      <el-button type="primary" class="addRole" @click="addHandel">添加角色</el-button>
      <template>
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column type="expand" width="50px">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.roleName}}</span> -->
              <!-- 每个一级标题对应一行,在第二列中,每个二级标题对应一行,依次往下类推 -->
              <el-row v-for="(item,index) in scope.row.children" :key="index" class="firstrow">
                <el-col :span="6">
                  <!-- 一级标签 -->
                  <el-tag closable @close="closeTagHandle(scope.row.id,item.id)">{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row v-for="(item2,index2) in item.children" :key="index2" class="secrow">
                    <el-col :span="9">
                      <!-- 二级标签 -->
                      <el-tag
                        closable
                        type="success"
                        @close="closeTagHandle(scope.row.id,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="15">
                      <!-- 三级标签 -->
                      <el-tag
                        closable
                        v-for="(item3,index3) in item2.children"
                        :key="index3"
                        type="warning"
                        @close="closeTagHandle(scope.row.id,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="#" width="50px"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="level" label="操作">
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
                >编辑</el-button>
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
                >删除</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配权限"
                placement="top-end"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="settingHandle(scope.row)"
                >分配权限</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 新增和编辑弹窗 -->
    <template>
      <el-dialog
        :title="isEdit?'编辑角色':'添加角色'"
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAndEditRole(addForm.roleId)">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="settingDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-tree
        :data="settingRightsData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="treeCheckedId"
        :props="defaultProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settingRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      dialogVisible: false,
      tableData: [],
      addForm: { roleName: '', roleDesc: '' },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入用户密码', trigger: 'blur' }
        ]
      },
      settingDialogVisible: false,
      settingRightsData: [],
      /* 树形结构配置 */
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      treeCheckedId: [],
      roleId: ''
    }
  },
  methods: {
    /* 查询角色列表 */
    async queryRolelist() {
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('roles')
      // console.log(data)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      // this.$message.success(msg)
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].index = i + 1
      }
      this.tableData = data
      // console.log(data)
    },
    /* 关闭弹框时起效 清空树形id数组 */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
      this.treeCheckedId = []
    },
    /* 关闭弹窗重置表单 */
    dialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    /* 添加新用户或者编辑后提交 */
    addAndEditRole(v) {
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
          } = await this.$axios.post('/roles', this.addForm)
          // console.log(res)
          if (status !== 201) return this.$message.error(msg)
          this.$message.success(msg)
          this.dialogVisible = false
          this.queryRolelist()
        } else {
          // console.log(v)
          const { roleName, roleDesc } = this.addForm
          const {
            meta: { msg, status }
          } = await this.$axios.put(`roles/${v}`, { roleName, roleDesc })
          // console.log(res)
          if (status !== 200) return this.$message.error(msg)
          this.$message.success('编辑角色成功')
          this.dialogVisible = false
          this.queryRolelist()
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
      } = await this.$axios.get(`roles/${id}`)
      if (status !== 200) return this.$message.error(msg)
      //   console.log(res)
      this.$message.success(msg)
      this.addForm = data
      // console.log(this.addForm)
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
      } = await this.$axios.delete(`roles/${id}`)
      //   console.log(status)
      if (status !== 200) return this.$message.error(msg)
      this.$message.success(msg)
      this.queryRolelist()
    },
    /* 关闭标签的事件处理函数 */
    async closeTagHandle(roleId, rightId) {
      // console.log(roleId + '--------' + rightId)
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.delete(`roles/${roleId}/rights/${rightId}`)
      // console.log(res)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      // this.$message.error(msg)
      // 成功时,将数据响应到view
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        if (this.tableData[i].id === roleId) {
          this.tableData[i].children = data
        }
      }
    },
    /* 打开分配权限弹框 实现权限展示 */
    async settingHandle(role) {
      this.settingDialogVisible = true
      // console.log(role)
      // this.settingRightsData = role.children // 错误 应该展示所有权限
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('rights/tree')
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.settingRightsData = data
      /* 默认被选中的id数组,结构和数据都是要求id唯一 */
      // getIdArr()
      for (let i = 0, len = role.children.length; i < len; i++) {
        this.getIdArr(role.children[i], this.treeCheckedId)
      }
      // 获取到当前权限弹框的 角色id
      this.roleId = role.id
    },
    /* 递归 得到树形组件中的id数组 */
    getIdArr(obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id)
      }
      // 有children节点的情况下
      obj.children.forEach(item => this.getIdArr(item, arr))
      return arr
    },
    /* 实现授权 */
    async settingRights() {
      // 拿到所有选中和半选中的id 组成数组
      // console.log(this.$refs.treeRef.getCheckedNodes())
      const idArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = idArr.join(',')
      // console.log(this.roleId + '----' + idStr)
      const {
        meta: { msg, status }
      } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.$message.success(msg)
      // console.log(res)
      this.settingDialogVisible = false
      this.queryRolelist()
    }
  },
  created() {
    this.queryRolelist()
  }
}
</script>

<style lang="less" scoped>
.users_header {
  height: 35px !important;
  background-color: #ff330044;
  .el-breadcrumb-item {
    font-size: 16px;
    line-height: 30px;
  }
}
.addRole {
  margin-bottom: 20px !important;
}
.box-card {
  padding: 10px 10px 40px 10px;
}
.el-col {
  border-radius: 4px;
}
.el-row {
  display: flex;
  align-items: center;
  margin: 0px 5px;
  border-top: 1px solid #ccc;
}
.firstrow:last-child {
  border-bottom: 1px solid #ccc;
}
.secrow {
  border-top: 1px solid #ccc;
  padding: 10px 0;
  &:first-child {
    border: none;
  }
}
.el-tag {
  margin: 5px;
}
</style>
