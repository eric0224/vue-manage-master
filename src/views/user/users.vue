<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="usersobj.query"
        class="input-with-select"
        style="margin-right:10px;width:300px"
        @input.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="addusersdialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="getUserState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" plain icon="el-icon-edit" @click="showedituser(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" plain icon="el-icon-share" @click="showallotrole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" plain icon="el-icon-delete" @click="showdeluser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersobj.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="usersobj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addusersdialogFormVisible">
      <el-form :model="adduserform" label-width="80px" :rules="adduserrole" ref="adduserform">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduserform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduserform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduserform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="adduserform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addusersdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addusersBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editusersdialogFormVisible">
      <el-form :model="edituserform" label-width="80px" :rules="edituserrole" ref="edituserform">
        <el-form-item label="用户名" prop="username">
          <span>{{edituserform.username}}</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituserform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="edituserform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editusersdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editusersBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="allotroledialogFormVisible">
      <el-form :model="allotroleform" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <span>{{allotroleform.username}}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="allotroleform.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotroledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotroleBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  userDataList,
  addUsers,
  editUserState,
  getUserById,
  editUserSub,
  allotUserRole,
  delOneUser
} from '@/api/users_index.js'
import { roleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 用户数据列表
      total: 0,
      usersobj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],

      // 添加用户
      addusersdialogFormVisible: false,
      adduserform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      adduserrole: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },

      //   编辑用户
      editusersdialogFormVisible: false,
      edituserform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      edituserrole: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },

      //   分配角色
      allotroledialogFormVisible: false,
      allotroleform: {
        id: '',
        rid: '',
        username: ''
      },
      roleList: []
    }
  },
  methods: {
    init () {
      // 用户数据列表
      userDataList(this.usersobj)
        .then(res => {
          //   console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 分页
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      this.usersobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`)
      this.usersobj.pagenum = val
      this.init()
    },

    // 添加用户
    addusersBtn () {
      this.$refs.adduserform.validate(valid => {
        if (valid) {
          addUsers(this.adduserform)
            .then(res => {
              //   console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.init()
                this.addusersdialogFormVisible = false
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

    // 修改用户状态
    getUserState (uId, type) {
      editUserState(uId, type)
        .then(res => {
          //   console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 编辑用户
    showedituser (id) {
      this.editusersdialogFormVisible = true
      getUserById(id)
        .then(res => {
          //   console.log(res)
          this.edituserform = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    editusersBtn () {
      this.$refs.edituserform.validate(valid => {
        if (valid) {
          editUserSub(this.edituserform)
            .then(res => {
              //   console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.init()
                this.editusersdialogFormVisible = false
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

    // 分配角色
    showallotrole (row) {
      this.allotroledialogFormVisible = true
      //   console.log(row)
      this.allotroleform.id = row.id
      this.allotroleform.rid = row.rid
      this.allotroleform.username = row.username
    },
    allotroleBtn () {
      allotUserRole(this.allotroleform)
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.allotroledialogFormVisible = false
            this.init()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除用户
    showdeluser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOneUser(id)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.usersobj.pagenum = Math.ceil((this.total - 1) / this.usersobj.pagesize) < this.usersobj.pagenum ? --this.usersobj.pagenum : this.usersobj.pagenum
              this.init()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  },
  mounted () {
    this.init()

    // 角色列表
    roleList()
      .then(res => {
        // console.log(res)
        this.roleList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>
