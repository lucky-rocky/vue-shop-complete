<template>
  <div class="goods">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-card class="box-card">
      <!-- 添加商品 -->
      <el-row>
        <el-button type="primary" class="addGood" @click="addCate">添加分类</el-button>
      </el-row>
      <!-- 表格主体 -->
      <template>
        <tree-table
          :data="tableData"
          :columns="columns"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
          :expand-type="false"
          :selection-type="false"
          class="trtable"
        >
          <!-- 是否有效 -->
          <template slot="isEffect" slot-scope="scope">
            <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color:red"></i>
            <i class="el-icon-success" v-else style="color:green"></i>
          </template>
          <!-- 排序 -->
          <template slot="sort" slot-scope="scope">
            <!-- 一级标签 -->
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <!-- 二级标签 -->
            <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <!-- 三级标签 -->
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
          <!-- 编辑和删除 -->
          <template slot="done" slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editHandle(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteHandle(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </tree-table>
      </template>
      <!-- 分页结构 -->
      <template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.pagenum"
            :page-sizes="[1, 2, 3, 6 , 12]"
            :page-size="queryData.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </template>
      <!-- 添加和编辑分类对话框 -->
      <template>
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="50%"
          :before-close="handleClose"
          @close="closeHandle"
        >
          <!-- 表单 -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="ruleForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" v-if="!isEdit">
              <el-cascader
                v-model="selectedKeys"
                :options="addCateCascaderList"
                :props="props"
                @change="handleChange"
                class="cascader"
                change-on-select
                clearable
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateHandle">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      tableData: [],
      queryData: {
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isEffect'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          prop: 'cat_id',
          type: 'template',
          template: 'done'
        }
      ],
      ruleForm: { cat_name: '' },
      rules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 级联选择器数据源
      addCateCascaderList: [],
      // 级联选择器的配置
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联被选中的父id数组
      selectedKeys: [],
      isEdit: false,
      editId: ''
    }
  },
  methods: {
    /* 关闭弹框之前的询问 */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /* 关闭弹窗触发 */
    closeHandle() {
      // 清空表单
      this.$refs.ruleForm.resetFields()
      // 清空keys
      this.selectedKeys = []
      this.ruleForm.cat_pid = 0
      this.ruleForm.cat_level = 0
    },
    // 获取商品分类
    async getGoodsList() {
      const {
        data,
        meta: { status }
      } = await this.$axios.get('/categories', {
        params: this.queryData
      })
      if (status !== 200) {
        return this.$message.error('cuowu')
      }
      //   console.log(data)
      this.tableData = data.result
      this.total = data.total
    },
    /* 每页数据条数改变的回调 */
    handleSizeChange(v) {
      this.queryData.pagesize = v
      this.getGoodsList()
    },
    /* 页码数改变的回调 */
    handleCurrentChange(v) {
      this.queryData.pagenum = v
      this.getGoodsList()
    },
    /* 点击打开添加商品分类弹框 */
    async addCate() {
      this.addCateDialogVisible = true
      this.isEdit = false
      // 获取级联选择器数据源
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('categories', { params: { type: 2 } })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.addCateCascaderList = data
    },
    /* 级联选择器改变事件的处理函数 */
    handleChange(value) {
      console.log(value)
      // 改变选择的id数组
      //   this.selectedKeys = value
      // console.log(this.selectedKeys)
    },
    // 添加商品分类
    addCateHandle() {
      // 先进行表单验证
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 判断是否为 编辑操作
        if (this.isEdit) {
          const {
            meta: { msg, status }
          } = await this.$axios.put(`categories/${this.editId}`, {
            cat_name: this.ruleForm.cat_name
          })
          if (status !== 200) {
            return this.$message.error(msg)
          }
          this.addCateDialogVisible = false
          this.$message.success(msg)
          this.getGoodsList()
          return true
        }
        // 添加操作
        const addInfo = {
          cat_pid:
            this.selectedKeys.length > 0
              ? this.selectedKeys[this.selectedKeys.length - 1]
              : 0,
          cat_name: this.ruleForm.cat_name,
          cat_level: this.selectedKeys.length
        }
        // 发起axios 请求
        const {
          meta: { msg, status }
        } = await this.$axios.post('categories', addInfo)
        if (status !== 201) {
          return this.$message.error(msg)
        }
        this.addCateDialogVisible = false
        this.$message.success(msg)
        this.getGoodsList()
      })
    },
    // 打开编辑对话框
    async editHandle(id) {
      this.addCateDialogVisible = true
      this.isEdit = true
      // 默认值展览
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get(`categories/${id}`)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.ruleForm.cat_name = data.cat_name
      this.editId = data.cat_id
    },
    // 删除分类
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
      if (resConfirm !== 'confirm') {
        return this.$message('取消删除')
      }
      const {
        meta: { msg, status }
      } = await this.$axios.delete(`categories/${id}`)
      if (status !== 200) return this.$message.error(msg)
      this.$message.success(msg)
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.goods {
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
    margin: 20px 0 0;
    padding: 15px 0px 50px;
  }
  .el-table {
    margin-top: 20px;
    font-size: 12px;
  }
  .trtable {
    margin-top: 10px;
  }
  .cascader {
    width: 100%;
  }
}
</style>
