<template>
  <div class="goods">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
      </el-card>
    </el-header>
  </div>
</template>

<script>
export default {}
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
      margin: 10px 0 0;
      padding: 15px 0px;
  }
}
</style>
