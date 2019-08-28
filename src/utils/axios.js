import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
//   console.log(config)
  let mytoken = localStorage.getItem('vue_manage_master_token')
  if (mytoken) {
    config.headers.Authorization = mytoken
  } else {
    this.$router.push({ name: 'login' })
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default axios
