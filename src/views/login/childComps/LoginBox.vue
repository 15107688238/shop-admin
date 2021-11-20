<template>
  <div class="login-box">
    <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>

      <el-form class="login_form" 
                :model="LoginForm"
                :rules="loginFormRules" 
                 ref="fromRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="LoginForm.password" type="password"></el-input>
        </el-form-item>  
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
  </div>

  
</template>

<script>
  import {loginReq} from 'network/login'
  export default {
  name: 'LoginBox',
  data() {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetClick() {
      
      this.$refs.fromRef.resetFields()
    },
    loginClick() {
      this.$refs.fromRef.validate( valid => {
        // console.log(valid)
        if( !valid ) return 

        loginReq(this.LoginForm.username, this.LoginForm.password).then(res => {
          // console.log(res)
          if( res.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          // 1. 将登录成功之后的 token,保存到客户端的 sessionStorage(会话机制/只在当前页面生效)中 localStorage(持久话机制/关闭页面也不会忘记数据)
        //   1.1 项目中除了登录之外的API接口,必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效, 所以将 token 保存在 sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })

      })
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
  
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
  
  }
  }
</script>
<style scoped>
/* @import url(); 引入css类 */
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
 .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
}
.avatar_box img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
.btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
</style>