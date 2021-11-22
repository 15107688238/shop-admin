<template>
  <div>
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="{ tborder: index1 == 0, bborder: 1, vcenter: 1 }">
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="{ tborder: index2 !== 0, vcenter: 1 }">
                  <el-col :span="6">
                    <el-tag type="success" closable>{{ item2.authName }} </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-row v-for="item3 in item2.children" :key="item3.id">
                      <el-col :span="6">
                        <el-tag type="warning" closable @close="delRelesById(scope.row, item3.id)">{{ item3.authName }} </el-tag>
                      </el-col>
                      <el-col :span="18"></el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoles(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="rolesShowDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesdialogVisible" width="50%" @close="addRolesDislogClose">
      <el-form ref="addRolesformRef" :model="addRolesform" label-width="80px" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesdialogVisible" width="50%">
      <el-form ref="editRolesformRef" :model="editRolesform" label-width="80px" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限diolog -->
    <el-dialog title="提示" :visible.sync="RolesdialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsTree" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defauleKeys" ref="rolesTreeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { _getRolesList, _delRoles, _allotRolesReq, _addRolesReq, _getRole, _editRoleReq, _delRole } from 'network/roles.js'
import { _getrightsList } from 'network/rights'
import { rolesFormRulesMixin } from 'common/mixin'

import Breadcrumb from 'components/content/Breadcrumb.vue'
export default {
  mixins: [rolesFormRulesMixin],
  components: { Breadcrumb },
  name: 'Roles',
  data() {
    return {
      //角色权限列表
      rolesList: [],
      //权限列表树
      rightsTree: [],
      //默认权限id
      defauleKeys: [],
      //添加角色dialog显示和隐藏
      addRolesdialogVisible: false,
      //编辑角色dialog显示和隐藏
      editRolesdialogVisible: false,
      //分配dialog的显示和隐藏
      RolesdialogVisible: false,
      // 树形控件属性绑定
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      //当前选中角色
      checkRole: '',
      // 添加角色表单
      addRolesform: {
        roleName: '',
        roleDesc: '',
      },
      // 编辑角色表单
      editRolesform: {
        roleName: '',
        roleDesc: '',
      },
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this._getRolesList()
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    //网络请求相关
    //--请求获取权限列表
    _getRolesList() {
      _getRolesList().then((res) => {
        if (res.meta.status !== 200) this.$message.error('获取角色列表失败')
        this.rolesList = res.data
      })
    },
    //--请求根据id删除权限
    _delRoles(role, id) {
      _delRoles(role, id).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) this.$message.error('取消权限失败')
        this.$message.success('取消权限成功')
        role.children = res.data
      })
    },
    //--根据id删除权限
    delRelesById(role, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // console.log(role, id)
          this._delRoles(role, id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //点击显示dialog//请求权限列表树树
    rolesShowDialog(role) {
      this.checkRole = role
      this.defauleKeys = []
      _getrightsList('tree').then((res) => {
        if (res.meta.status !== 200) this.$message.error('获取权限列表失败')
        this.rightsTree = res.data
        this.saveRightsid(role, this.defauleKeys)
        this.RolesdialogVisible = true
        console.log(res)
      })
    },
    //点击分配权限
    allotRoles() {
      const arr1 = [...this.$refs.rolesTreeRef.getHalfCheckedKeys(), ...this.$refs.rolesTreeRef.getCheckedKeys()]
      const str1 = arr1.join(',')
      _allotRolesReq(this.checkRole, str1).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('角色权限分配失败')
          this.RolesdialogVisible = false
        }
        this.$message.success('角色权限分配成功')
        this._getRolesList()
        this.RolesdialogVisible = false
      })
    },
    //点击保存添加角色
    saveAddRoles() {
      this.$refs.addRolesformRef.validate((valid) => {
        if (!valid) return
        _addRolesReq(this.addRolesform).then((res) => {
          if (res.meta.status !== 201) this.$message.error('添加角色失败')
          this.$message.success('添加角色成功')
          this._getRolesList()
          this.addRolesdialogVisible = false
        })
      })
    },
    //点击保存编辑角色
    saveEditRoles() {
      _editRoleReq(this.checkRole, this.editRolesform).then((res) => {
        if (res.meta.status !== 200) this.$message.error('编辑角色失败')
        this.$message.success('编辑角色成功')
        this._getRolesList()
        this.editRolesdialogVisible = false
      })
    },
    //点击删除角色
    delRole(role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          _delRole(role.id).then((res) => {
            console.log(role.id)
            if (res.meta.status !== 200) return this.$message.error('删除角色失败')
            this.$message({
              type: 'success',
              message: '删除角色成功!',
            })
            this._getRolesList()

          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /////////////////////////
    //递归函数获取三级节点id
    saveRightsid(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.saveRightsid(item, arr)
      })
    },
    //点击显示添加角色dialog
    addRoles() {
      this.addRolesdialogVisible = true
    },
    //监听添加角色对话框关闭
    addRolesDislogClose() {
      this.$refs.addRolesformRef.resetFields()
    },
    //点击显示编辑角色dialog
    editRoles(role) {
      this.checkRole = ''
      this.editRolesform.roleName = ''
      this.editRolesform.roleDesc = ''
      _getRole(role.id).then((res) => {
        if (res.meta.status !== 200) this.$message.error('获取角色信息失败')
        // console.log(res)
        this.checkRole = res.data.roleId
        this.editRolesform.roleName = res.data.roleName
        this.editRolesform.roleDesc = res.data.roleDesc
      })
      this.editRolesdialogVisible = true
    },
    //监听编辑角色对话框关闭
  },
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-tag {
  margin: 5px;
  /* box-sizing: content-box; */
}
.bborder {
  border-bottom: 1px solid #ccc;
}
.tborder {
  border-top: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>