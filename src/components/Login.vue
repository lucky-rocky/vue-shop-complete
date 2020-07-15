<template>
  <div id="app">
    <el-card class="box-card login-container">
      <!-- logo -->
      <div class="login-avatar">
        <img src="../assets/不知火.jpg" />
      </div>
      <el-form ref="form" label-width="0px" id="login-form">
        <!-- 用户名 -->
        <el-form-item class="user">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="pwd">
          <el-input type="password" placeholder="请输入密码" v-model="form.password" @blur="sub_handle"></el-input>
        </el-form-item>
        <!-- 按钮部分 -->
        <el-form-item class="button">
          <el-button type="info" class="resetbtn" @click="reset_handle">重置</el-button>
          <el-button type="primary" class="loginbtn" @click="sub_handle">登录</el-button>
        </el-form-item>
        <el-form-item class="login-msg">
          <el-button :plain="true" @click="open2">成功</el-button>
          <el-button :plain="true" @click="open4">错误</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      msg: '',
      form: {
        password: '',
        username: ''
      }
    }
  },
  methods: {
    reset_handle() {
      this.form.password = ''
      this.form.username = ''
    },
    async sub_handle() {
      const data = await axios.post('/login', this.form)
      const { msg, status } = data.meta
      const { token } = data.data
      if (status !== 200) {
        this.msg = msg
        this.open4()
      } else {
        this.msg = msg
        this.open2()
        localStorage.setItem('token', token)
        location.hash = '#/users'
      }
      this.reset_handle()
    },
    open2() {
      this.$message({
        showClose: true,
        message: this.msg,
        type: 'success'
      })
    },
    open4() {
      this.$message({
        showClose: true,
        message: this.msg,
        type: 'error'
      })
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  position: relative;
  width: 100%;
  height: 100%;
}
.login-container {
  position: absolute;
  width: 400px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  overflow: visible;
  .login-avatar {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    padding: 10px;
    height: 100px;
    width: 100px;
    border-radius: 10px;
    background: skyblue;
    img {
      width: 100px;
      height: 100px;
    }
  }
  #login-form {
    margin-top: 65px;
    .button {
      .resetbtn {
        float: right;
      }
      .loginbtn {
        float: right;
        margin: 0 20px;
      }
    }
  }
  .login-msg {
    display: none;
  }
}
</style>
