import axios from '@/utils/axios.js'

// 角色列表
export const roleList = () => {
  return axios({
    url: 'roles'
  })
}
