<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片区域 -->
    <user-card></user-card>
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import UserCard from './childC/UserCard.vue'
export default {
  components: { Breadcrumb, UserCard },
  name: 'User',
  data() {
    return {}
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