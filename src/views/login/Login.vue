<template>
  <div class="login-container">
    <login-box></login-box>
  </div>
</template>

<script>
  import LoginBox from './childComps/LoginBox.vue'
  export default {
  components: { LoginBox },
  name: 'Login',
  data() {
    return {
    
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
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
</style>