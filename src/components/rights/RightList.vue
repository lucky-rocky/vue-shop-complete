<template>
  <div class="rightList">
    <!-- 头部导航 -->
    <el-header class="users_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- 卡片 表格部分 -->
    <el-card class="box-card">
      <template>
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="index" label="#" width="50px"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">一级</el-tag>
              <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
              <el-tag v-else-if="scope.row.level==='2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{ date: '', name: '', address: '' }]
    }
  },
  async created() {
    const {
      data,
      meta: { msg, status }
    } = await this.$axios.get('rights/list')
    // console.log(res)
    if (status !== 200) {
      return this.$message.error(msg)
    }
    this.$message.success(msg)
    for (let i = 0, len = data.length; i < len; i++) {
      data[i].index = i + 1
    }
    this.tableData = data
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
</style>
