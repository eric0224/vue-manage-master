<template>
  <div class="role">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button
      type="success"
      round
      plain
      style="margin-left:10px"
      @click="addroledialogFormVisible=true"
    >添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :gutter="20"
            v-for="frist in scope.row.children"
            :key="frist.id"
            style="margin-bottom:15px"
          >
            <el-col :span="4">
              <el-tag closable @close="cnt=0;deloneroleright(scope.row,frist.id)">{{frist.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row
                :gutter="20"
                v-for="second in frist.children"
                :key="second.id"
                style="margin-bottom:10px"
              >
                <el-col :span="4">
                  <el-tag closable type="success" @close="cnt=0;deloneroleright(scope.row,second.id)">{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    v-for="three in second.children"
                    :key="three.id"
                    type="info"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="cnt=0;deloneroleright(scope.row,three.id)"
                  >{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :span="24" v-show="scope.row.children.length===0">此角色暂时没有分配权限</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              @click="showeditdialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button
              type="success"
              plain
              icon="el-icon-share"
              @click="showroleright(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
            <el-button type="danger" plain icon="el-icon-delete" @click="delrole(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addroledialogFormVisible">
      <el-form :model="addroleform" ref="addroleform" :rules="addrole">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="addroleform.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="addroleform.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addroledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addroleBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editroledialogFormVisible">
      <el-form :model="editroleform" ref="editroleform" :rules="editrole">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="editroleform.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="editroleform.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editroledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editroleBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="rolerightdialogFormVisible">
      <el-tree
        ref="tree"
        :data="rolerightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolerightdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolerightBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  roleList,
  addRole,
  getRoleById,
  getEditRoleById,
  delRoleById,
  roleRight,
  delOneRoleRight
} from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      cnt: 0,
      rolerightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkArr: [],
      rolerightdialogFormVisible: false,
      rolerightform: {
        roleId: '',
        rids: ''
      },

      editroledialogFormVisible: false,
      editroleform: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editrole: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      },
      addroledialogFormVisible: false,
      roleList: [],
      addroleform: {
        roleName: '',
        roleDesc: ''
      },
      addrole: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   删除角色指定权限
    async deloneroleright (row, rightId) {
      const res = await delOneRoleRight(row.id, rightId)
      //   console.log(res)
      if (res.data.meta.status === 200) {
        if (this.cnt === 0) {
          this.$message.success(res.data.meta.msg)
          this.cnt++
        }
        row.children = res.data.data
        row.children.forEach((v1) => {
          if (v1.children.length === 0) {
            this.deloneroleright(row, v1.id)
          } else {
            v1.children.forEach((v2) => {
              if (v2.children.length === 0) {
                this.deloneroleright(row, v2.id)
              }
            })
          }
        })
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    //   角色授权
    showroleright (row) {
      this.rolerightdialogFormVisible = true
      this.rolerightform.roleId = row.id
      this.rolerightList = [...this.rolerightList]
      this.checkArr.length = 0
      row.children.forEach(frist => {
        if (frist.children.length > 0) {
          frist.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.checkArr.push(third.id)
              })
            }
          })
        }
      })
      console.log(this.checkArr)
    },
    async rolerightBtn () {
      let arr = this.$refs.tree.getHalfCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys()
      let temp = arr.concat(arr1)
      //   console.log(temp)
      //   console.log(this.$refs.tree.getHalfCheckedKeys())
      //   console.log(this.$refs.tree.getCheckedKeys())
      this.rolerightform.rids = temp.join(',')
      const res = await roleRight(this.rolerightform.roleId, this.rolerightform.rids)
      //   console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.init()
        this.rolerightdialogFormVisible = false
      }
    },
    //   删除角色
    async delrole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRoleById(id).then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.init()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //   编辑角色
    async showeditdialog (id) {
      this.editroledialogFormVisible = true
      const res = await getRoleById(id)
      //   console.log(res)
      if (res.data.meta.status === 200) {
        this.editroleform = res.data.data
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    editroleBtn () {
      this.$refs.editroleform.validate(valid => {
        if (valid) {
          //   console.log(this.editroleform)
          getEditRoleById(this.editroleform)
            .then(res => {
              //   console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.editroledialogFormVisible = false
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    //   添加角色
    addroleBtn () {
      this.$refs.addroleform.validate(valid => {
        if (valid) {
          //   console.log(this.addroleform)
          addRole(this.addroleform)
            .then(res => {
              //   console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.addroledialogFormVisible = false
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },

    init () {
      roleList().then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
    }
  },
  mounted () {
    this.init()
    getAllRightList('tree')
      .then(res => {
        if (res.data.meta.status === 200) {
          this.rolerightList = res.data.data
        }
      })
      //   console.log(res)
  }
}
</script>

<style lang="less" scoped>
</style>
