<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="9">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
          <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="usersList" stripe border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStatsChange(scope.row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" circle @click="editUserS(scope.row.id)"></el-button>
          <el-button icon="el-icon-delete" type="danger" circle @click="delUserS(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button icon="el-icon-setting" type="warning" circle @click="setRoles(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户 -->
    <add-user :dialogVisible.sync="dialogVisible" @dialogVisibleChange="dialogVisibleChange" @addUserSuccess="addUserSuccess"></add-user>
    <!-- 编辑用户 -->
    <el-dialog title="添加用户" :visible.sync="editdialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="resetFormVaild">
      <el-form ref="editFormRef" :model="EditForm" :rules="addFormRules">
        <el-form-item label="用户名">
          <el-input v-model="EditForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="EditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserC">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog title="分配用户角色" :visible.sync="RolesdialogVisible" width="30%">
      <div>
        <p>用户名: {{ userInfo.username }}</p>
        <p>角色: {{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesById">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUsersList, changeUserStatus, getUserPro, editUserPro, delUserReq } from 'network/users'
import { _getRolesList, _allotUserRolesReq } from 'network/roles.js'
import { userAddFormRulesMixin } from 'common/mixin'
import AddUser from './AddUser.vue'

export default {
  mixins: [userAddFormRulesMixin],
  components: { AddUser },
  name: 'UserCard',
  data() {
    return {
      queryInfo: {
        query: '',
        //当前页
        pagenum: 1,
        //每页显示条数
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      RolesdialogVisible: false,
      EditForm: {},
      //要分配角色的用户信息
      userInfo: {},
      rolesList: [],
      selectRoleId: '',
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getUsersList()
  },
  methods: {
    //请求相关
    getUsersList() {
      getUsersList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.usersList = res.data.users
        this.total = res.data.total
        // console.log(this.usersList, this.total)
      })
    },
    //根据 ID 查询用户信息
    getUserPro(id) {
      getUserPro(id).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('查询不到该用户')
        }
        this.EditForm = res.data
      })
    },
    //提交用户修改资料的请求
    editUserPro() {
      editUserPro(this.EditForm).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('用户资料修改失败')
        this.$message.success('用户资料修改成功')
        this.getUsersList()
        this.dialogVisibleChange()
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUsersList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUsersList()
    },
    //修改用户状态
    userStatsChange(sta) {
      changeUserStatus(sta.id, sta.mg_state).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          sta.mg_state = !sta.mg_state
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('用户状态更新成功')
      })
    },
    //添加用户
    addUser() {
      this.dialogVisible = true
    },
    //关闭弹窗
    dialogVisibleChange() {
      this.dialogVisible = false
      this.editdialogVisible = false
    },
    //添加用户成功刷新列表
    addUserSuccess() {
      this.getUsersList()
    },
    //打开编辑用户
    editUserS(id) {
      this.editdialogVisible = true
      this.getUserPro(id)
    },
    //重置表单校验
    resetFormVaild() {
      this.$refs.editFormRef.resetFields()
    },
    //提交修改资料
    editUserC() {
      console.log()
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return
        this.editUserPro()
      })
    },
    //根据id删除用户
    delUserS(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delUserReq(id).then((res) => {
            if (res.meta.status !== 200) this.$message.error('删除失败')

            this.$message.success('删除成功')
            this.getUsersList()
          })
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!',
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //点击分配用户角色
    setRoles(userInfo) {
      this.selectRoleId = ''

      this.userInfo = userInfo
      _getRolesList().then((res) => {
        if (res.meta.status !== 200) this.$message.error('获取角色列表失败')
        this.rolesList = res.data
      })
      this.RolesdialogVisible = true
    },
    //点击提交分配用户角色
    setRolesById() {
      console.log(this.selectRoleId)
      _allotUserRolesReq(this.userInfo.id, this.selectRoleId).then((res) => {
        if (res.meta.status !== 200) this.$message.error('用户角色设置失败')
        this.$message.success('用户角色设置成功')
        this.getUsersList()
        this.RolesdialogVisible = false
      })
    },
  },

  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-table,
.el-pagination {
  margin-top: 15px;
}
</style>