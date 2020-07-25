<template>
  <div id="orders">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- 卡片 -->
    <el-card>
      <!-- 上面搜索框 -->
      <el-row>
        <el-input placeholder="请输入内容" v-model="queryData.query" clearable @clear="getOrdersList">
          <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
      </el-row>
      <!-- 表格 -->
      <template>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="index" label="#" width="40"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
          <el-table-column prop="isPay" label="是否付款">
            <!-- <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.pay_status==='0'">{{scope.row.isPay}}</el-tag>
              <el-tag type="success" v-else>{{scope.row.isPay}}</el-tag>
            </template>-->
            <template v-slot="scope">
              <el-tag
                :type="scope.row.pay_status==='0'?'danger':'success'"
              >{{scope.row.pay_status==='0'?'未付款':'已付款'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.row.order_id)"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-map-location"
                size="mini"
                @click="handlekuaidi(scope.row.order_id)"
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
      <!-- duihuakuang -->
      <el-dialog title="修改地址" :visible.sync="dialogVisible" width="40%" @close="handleClose">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省市区/县" prop="addr">
            <div class="block cascader">
              <el-cascader
                v-model="selectedKeys"
                :options="options"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="详细地址" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 快递信息弹框 -->
      <el-dialog title="快递信息" :visible.sync="kuaidiVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in kuaidiData"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="kuaidiVisible = false">取 消</el-button>
          <el-button type="primary" @click="kuaidiVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      tableData: [],
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      dialogVisible: false,
      selectedKeys: [],
      options: regionData,
      props: { expandTrigger: 'hover' },
      ruleForm: { name: '' },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        addr: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      kuaidiData: [],
      kuaidiVisible: false
    }
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      // console.log(this.queryData.query)
      const {
        data,
        meta: { msg, status }
      } = await this.$axios.get('orders', { params: this.queryData })
      if (status !== 200) {
        return this.$message.error(msg)
      }
      this.$message.success(msg)
      data.goods.forEach((item, i) => {
        item.index = i + 1
        item.isPay = item.pay_status === '0' ? '未付款' : '已付款'
        item.orderTime = this.$format(item.create_time, 'yyyy-MM-dd hh:mm:ss')
      })
      this.tableData = data.goods
      this.total = data.total
      this.queryData.pagenum = data.pagenum - 0
    },
    handleSizeChange(v) {
      this.queryData.pagesize = v
      this.getOrdersList()
    },
    handleCurrentChange(v) {
      console.log(v)
      this.queryData.pagenum = v
      this.getOrdersList()
    },
    handleEdit(id) {
      this.dialogVisible = true
      // console.log(id)
    },
    handleChange() {},

    // 关闭地址选择的弹窗回调=>清空表单
    handleClose() {
      this.selectedKeys = []
      this.$refs.ruleForm.resetFields()
    },

    async handlekuaidi(id) {
      this.kuaidiVisible = true
      console.log(id)
      const res = await this.$axios.get('/kuaidi/804909574412544580')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.$message.success(res.meta.message)
      this.kuaidiData = res.data
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>

<style lang="less" scoped>
#orders {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  overflow: auto;
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
    padding: 10px 0px 40px;
  }
  .el-table {
    margin-top: 10px;
    font-size: 12px;
  }
  .el-input {
    width: 400px;
  }

  .el-cascader {
    width: 90% !important;
  }
}
</style>
