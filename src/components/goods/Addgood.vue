<template>
  <div id="addGood">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- card -->
    <el-card>
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon center></el-alert>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
#addGood {
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
}
.el-card {
  margin: 20px 10px 0;
  padding: 10px 0px 50px;
}
.el-alert {
    font-size: 16px;
}
</style>
