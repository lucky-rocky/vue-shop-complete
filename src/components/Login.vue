<template>
  <div id="app">
    <el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
      <el-form-item>
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      ruleForm: {
        password: '',
        username: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
