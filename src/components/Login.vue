<template>
  <div id="app">
    <el-card class="box-card login-container">
      <!-- logo -->
      <div class="login-avatar">
        <img src="../assets/不知火.jpg" />
      </div>
      <el-form ref="formRef" label-width="0px" id="login-form" :rules="rules" :model="form">
        <!-- 用户名 -->
        <el-form-item class="user" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="pwd" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮部分 -->
        <el-form-item class="button">
          <el-button type="info" class="resetbtn" @click="reset_handle">重置</el-button>
          <el-button type="primary" class="loginbtn" @click="sub_handle">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        password: '123456',
        username: 'admin'
      },
      rules: {
        username: [
          { required: true, message: '请输入3-10位用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入6-15位用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset_handle() {
      this.$refs.formRef.resetFields()
    },
    async sub_handle() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return valid
        if (valid) {
          // 验证成功发送请求
          const data = await this.$axios.post('/login', this.form)
          const { msg, status } = data.meta
          const { token } = data.data
          if (status !== 200) {
            return this.$message.error(msg)
          }
          if (status === 200) {
            this.$message.success(msg)
            localStorage.setItem('token', token)
            this.$router.push('/home')
          }
        }
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
