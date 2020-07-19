import axios from 'axios'
import Vue from 'vue'

// 拦截器
axios.interceptors.request.use(config => {
  config.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  config.timeout = 4000
  config.timeoutErrorMessage = '请求超时'
  const token = localStorage.getItem('token')
  if (!token && config.url !== '/login') {
    Vue.prototype.$message.error('请重新登录')
    location.hash = '/login'
  }
  config.headers.Authorization = token
  return config
})
axios.interceptors.response.use(res => {
  const data = res.data
  return data
})

Vue.prototype.$axios = axios
