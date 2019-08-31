import axios from '@/utils/axios.js'

// 所有权限列表
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 左侧菜单权限
export const leftMenuRight = () => {
  return axios({
    url: 'menus'
  })
}
