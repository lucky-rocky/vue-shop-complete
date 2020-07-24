<template>
  <div class="goods">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-card class="box-card">
      <!-- 上面搜索框 -->
      <el-row>
        <el-input placeholder="请输入内容" v-model="queryData.query" clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <!-- 添加商品 -->
        <el-button type="primary" class="addGood" @click="toAddGood">添加商品</el-button>
      </el-row>
      <!-- 表格主体 -->
      <template>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="index" label="#" width="40"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="600"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="160px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="handleEdit(scope.row.goods_id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="handleDelete(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const {
        data,
        meta: { status }
      } = await this.$axios.get('/goods', {
        params: this.queryData
      })
      if (status !== 200) {
        return this.$message.error('cuowu')
      }
      // 对数据进行处理
      for (let i = 0, len = data.goods.length; i < len; i++) {
        data.goods[i].index = i + 1
        data.goods[i].add_time = this.$format(
          data.goods[i].add_time,
          'yyyy-MM-dd hh:mm:ss'
        )
      }
      this.tableData = data.goods
      //   console.log(this.tableData)
      this.total = data.total
      this.queryData.pagenum = data.pagenum - 0
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
    /* 点击添加商品,跳转到添加商品页面 */
    toAddGood() {
      this.$router.push('/addgood')
    },

    // 编辑
    async handleEdit(id) {
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get(`goods/${id}`)
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.$message.success(msg)
      console.log(data)
    },

    // 删除
    async handleDelete(id) {
      const {
        meta: { msg, status }
      } = await this.$axios.delete(`goods/${id}`)
      if (status !== 200) {
        return this.$message.error(msg)
      }
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
  .el-input {
    width: 400px;
  }
  .addGood {
    margin-left: 20px;
  }
  .el-table {
    margin-top: 20px;
    font-size: 12px;
  }
}
</style>
