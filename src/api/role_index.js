import axios from '@/utils/axios.js'

// 角色列表
export const roleList = () => {
  return axios({
    url: 'roles'
  })
}

// 添加角色
export const addRole = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 根据 ID 查询角色
export const getRoleById = (id) => {
  return axios({
    url: `roles/${id}`
  })
}

// 编辑提交角色
export const getEditRoleById = (data) => {
  return axios({
    url: `roles/${data.roleId}`,
    method: 'put',
    data
  })
}

// 删除角色
export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}

// 角色授权
export const roleRight = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 删除角色指定权限
export const delOneRoleRight = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
