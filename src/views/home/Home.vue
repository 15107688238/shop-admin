<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <left-aside></left-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftAside from './childComps/LeftAside.vue'
export default {
  name: 'Home',
  components: {LeftAside},
  data() {
    return {}
  },
  methods: {
    logoutClick() {
      window.sessionStorage.clear
      this.$router.push('/login')
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div img {
  width: 60px;
  height: 60px;
  /* border-radius: 50%; */
}
.el-header > div span {
  margin-left: 15px;
}

.el-main {
  background-color: #eaedf1;
}
</style>