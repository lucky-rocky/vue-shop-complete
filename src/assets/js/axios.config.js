import axios from 'axios'
import Vue from 'vue'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

// 拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // config.timeout = 4000
  // config.timeoutErrorMessage = '请求超时'
  const token = localStorage.getItem('token')
  if (!token && config.url !== '/login') {
    Vue.prototype.$message.error('请重新登录')
    location.hash = '/login'
  }
  config.headers.Authorization = token
  return config
})
axios.interceptors.response.use(res => {
  NProgress.done()
  const data = res.data
  return data
})

Vue.prototype.$axios = axios
