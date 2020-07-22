<template>
  <div class="params">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- card -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
        class="alert"
      ></el-alert>
      <!-- 级联 -->
      <div class="block cascader">
        <span class="demonstration">选择商品分类:&nbsp;&nbsp;</span>
        <el-cascader
          v-model="selectedKeys"
          :options="options"
          :props="props"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- 标签页 -->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-row>
              <el-button
                type="primary"
                size="small"
                class="btnParams"
                :disabled="isDisabled"
                @click="addHandle"
              >添加参数</el-button>
            </el-row>
            <template>
              <el-table :data="tableData1" style="width: 100%" border>
                <el-table-column type="expand" width="40px">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item,index) in scope.row.attr_vals"
                      :key="index"
                      class="tag"
                      closable
                      @close="handleClose(scope.row,index)"
                    >{{item}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="index" label="#" width="50px"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      size="small"
                      type="primary"
                      @click="editHandle(scope.row.attr_id)"
                    >修改</el-button>
                    <el-button
                      icon="el-icon-delete"
                      size="small"
                      type="danger"
                      @click="deleteHandle(scope.row.attr_id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="second">
            <el-row>
              <el-button
                type="primary"
                size="small"
                class="btnParams"
                :disabled="isDisabled"
                @click="addHandle"
              >添加属性</el-button>
            </el-row>
            <template>
              <el-table :data="tableData2" style="width: 100%" border>
                <el-table-column type="expand" width="40px">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item,index) in scope.row.attr_vals"
                      :key="index"
                      class="tag"
                      closable
                      @close="handleClose(scope.row,index)"
                    >{{item}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="index" label="#" width="50px"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      size="small"
                      type="primary"
                      @click="editHandle(scope.row.attr_id)"
                    >修改</el-button>
                    <el-button icon="el-icon-delete" size="small" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
    <!-- 对话弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleDialogClose"
      @close="handleClearClose"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="label" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      options: [],
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedKeys: [],
      // 标签页参数
      activeName: 'first',
      tableData1: [],
      isDisabled: true,
      tableData2: [],
      // 弹框
      dialogVisible: false,
      isEdit: false,
      addForm: { attr_name: '' },
      rules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editId: ''
    }
  },
  methods: {
    async getCateList() {
      // 获取级联选择器数据源
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('categories')
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.options = data
    },
    // 级联改变回调
    handleChange() {
      //   console.log(val)
      if (this.cateId) {
        this.isDisabled = false
        this.getParamsList()
      } else {
        // 切换到非三级分类清空
        this.isDisabled = true
        this.tableData1 = []
        this.tableData2 = []
        this.selectedKeys = []
      }
    },
    // 点击标签页回调
    handleClick(tab, event) {
      //   console.log(tab, event)
    },
    // 获取参数
    async getParamsList() {
      // console.log(this.selectedKeys)
      if (!this.cateId) return
      this.isDisabled = false
      // 静态参数
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      // console.log(data)
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].index = i + 1
        data[i].attr_vals =
          data[i].attr_vals.length > 0 ? data[i].attr_vals.split(',') : []
        // 给每个对象加自己的inputVisible  inputValue
        data[i].inputVisible = false
        data[i].inputValue = ''
      }
      this.tableData2 = data

      // 动态参数
      const res = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: 'many'
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      for (let j = 0, len = res.data.length; j < len; j++) {
        res.data[j].index = j + 1
        res.data[j].attr_vals =
          res.data[j].attr_vals.length > 0
            ? res.data[j].attr_vals.split(',')
            : []
        // 给每个对象加自己的inputVisible  inputValue
        res.data[j].inputVisible = false
        res.data[j].inputValue = ''
      }
      // console.log(res.data)
      this.tableData1 = res.data
    },

    // 关闭tag的回调
    async handleClose(v, i) {
      v.attr_vals.splice(i, 1)
      this.editAxios(v)
    },

    // new tag 部分
    showInput(v) {
      // console.log(v)
      v.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // tag页签的input增加
    async handleInputConfirm(v) {
      // console.log(this.inputValue)
      // console.log(v)
      v.inputVisible = false
      if (!v.inputValue.trim()) {
        v.inputValue = ''
        return
      }
      v.attr_vals.push(v.inputValue)
      this.editAxios(v)
      v.inputValue = ''
    },

    // 发送编辑请求 传入当前行数据
    async editAxios(v) {
      const str = v.attr_vals.join(',')
      // console.log(v.attr_vals)
      // console.log(this.cateId)
      // 发起axios 编辑请求
      const {
        meta: { msg, status }
      } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${v.attr_id}`,
        {
          attr_name: v.attr_name,
          attr_sel: v.attr_sel,
          attr_vals: str
        }
      )
      // console.log(status)
      if (status !== 200) {
        return this.$message.error(msg)
      }
    },

    // 对话框关闭询问回调
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    // 对话框关闭清除表单
    handleClearClose() {
      this.$refs.addForm.resetFields()
    },

    // 打开添加对话框
    addHandle() {
      this.dialogVisible = true
      this.isEdit = false
    },

    // 打开编辑对话框
    async editHandle(id) {
      this.dialogVisible = true
      this.isEdit = true
      // 实现默认展示
      const attrSel = this.activeName === 'first' ? 'many' : 'only'
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: attrSel
        }
      })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      // 展示参数名
      this.addForm.attr_name = data.attr_name
      // 存储属性id将来提交用到的编辑id
      this.editId = data.attr_id
    },

    // 对话框提交
    dialogSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 判断isEdit 执行编辑或者添加
        // 编辑操作
        if (this.isEdit) {
          const {
            meta: { msg, status }
          } = await this.$axios.put(
            `categories/${this.cateId}/attributes/${this.editId}`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName === 'first' ? 'many' : 'only'
            }
          )
          if (status !== 200) {
            return this.$message.error(msg)
          }
          this.$message.success(msg)
          this.dialogVisible = false
          this.getParamsList()
          return
        }

        // 添加操作
        const attrSel = this.activeName === 'first' ? 'many' : 'only'
        const {
          meta: { msg, status }
        } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
          attr_sel: attrSel,
          attr_name: this.addForm.attr_name
        })
        if (status !== 201) {
          return this.$message.error(msg)
        }
        this.$message.success(msg)
        this.dialogVisible = false
        this.getParamsList()
      })
    },

    // 删除参数
    async deleteHandle(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      // 发起删除请求
      const {
        meta: { msg, status }
      } = await this.$axios.delete(`categories/${this.cateId}/attributes/${id}`)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.$message.success(msg)
      this.getParamsList()
    }
  },
  computed: {
    // 分类id
    cateId() {
      if (this.selectedKeys.length !== 3) return
      return this.selectedKeys[this.selectedKeys.length - 1]
    },
    // 标题
    title() {
      // 动态 静态 添加 编辑 四种情况下组合弹框标题
      const str1 = this.activeName === 'first' ? '动态参数' : '静态属性'
      const str2 = this.isEdit ? '修改' : '添加'
      return str2 + str1
    },
    // 表单label
    label() {
      return this.activeName === 'first' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.params {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  /* 头部导航 */
  .goods_header {
    height: 35px !important;
    background-color: #ff330044;
    .el-breadcrumb-item {
      font-size: 16px;
      line-height: 30px;
    }
  }
  .el-card {
    margin: 20px 10px 0;
    padding: 15px 0px 50px;
  }
  .alert {
    margin-top: -10px;
    margin-bottom: 15px;
  }
  .cascader {
    margin: 20px 0;
  }
  .btnParams {
    margin-bottom: 10px !important;
  }
  .tag {
    margin: 5px 5px 0 0;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
