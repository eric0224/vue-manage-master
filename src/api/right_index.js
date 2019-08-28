import axios from '@/utils/axios.js'

// 所有权限列表
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
