import axios from '@/utils/axios.js'

// 登录验证接口
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
