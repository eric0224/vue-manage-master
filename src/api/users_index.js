import axios from '@/utils/axios.js'

// 用户数据列表
export const userDataList = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户
export const addUsers = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 修改用户状态
export const editUserState = (uId, type) => {
  return axios({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}

// 根据 ID 查询用户信息
export const getUserById = (Id) => {
  return axios({
    url: `users/${Id}`
  })
}

// 编辑用户提交
export const editUserSub = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 分配用户角色
export const allotUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data
  })
}

// 删除单个用户
export const delOneUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
