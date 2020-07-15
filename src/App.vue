<template>
  <div id="app">
    <login></login>
  </div>
</template>

<script>
import login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    login
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  p {
    background: pink;
  }
}
</style>
