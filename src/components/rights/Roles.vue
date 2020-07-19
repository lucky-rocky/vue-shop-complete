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
      <el-button type="primary" class="addRole">添加角色</el-button>
      <template>
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="index" label="#" width="50px"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="level" label="操作">
            <!-- <template slot-scope="scope">{{scope}}</template> -->
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
                <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
              </el-tooltip>
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
    } = await this.$axios.get('roles')
    console.log(data)
    if (status !== 200) {
      return this.$message.error(msg)
    }
    this.$message.success(msg)
    for (let i = 0, len = data.length; i < len; i++) {
      data[i].index = i + 1
    }
    this.tableData = data
  },
  methods: {
    editHandle(v) {},
    deleteHandle(v) {}
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
</style>
