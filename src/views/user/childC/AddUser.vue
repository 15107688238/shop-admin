<template>
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" 
                              :show-close="false" :close-on-click-modal="false" 
                              :close-on-press-escape="false"	@close="cleanForm">
    <el-form ref="AddFormRef" :model="AddForm" :rules="addFormRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="AddForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="AddForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="AddForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="AddForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleC">取 消</el-button>
      <el-button type="primary" @click="AddUserClick">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {userAddFormRulesMixin} from 'common/mixin'
import {addUserReq} from 'network/users'

export default {
  mixins: [userAddFormRulesMixin],
  name: 'AddUser',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    dialogVisibleC() {
      this.$emit('dialogVisibleChange')
    },
    cleanForm(){
      this.$refs.AddFormRef.resetFields()
    },
    AddUserClick() {
      this.$refs.AddFormRef.validate(valid => {
        if(!valid){
          return
        }
        console.log(this.AddForm);
        addUserReq(this.AddForm).then(res => {
          console.log(res)
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)

          this.$message.success(res.meta.msg)
          this.$emit('addUserSuccess')
          // this.cleanForm()
          this.dialogVisibleC()
        })

      })
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
}
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>