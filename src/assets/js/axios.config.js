const axios = require('axios')

// 拦截器
axios.interceptors.request.use(config => {
  config.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  config.timeout = 4000
  config.timeoutErrorMessage = '请求超时'
  return config
})
axios.interceptors.response.use(res => {
  const data = res.data
  return data
})
