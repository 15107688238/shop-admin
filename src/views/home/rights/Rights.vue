<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { _getrightsList } from 'network/rights'

import Breadcrumb from 'components/content/Breadcrumb'

export default {
  name: 'Rights',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      rightsList: [],
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getrightsList('list')
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    getrightsList(type) {
      _getrightsList(type).then((res) => {
        if (res.meta.status !== 200) this.$message.error('获取权限列表失败')
        this.rightsList = res.data
        console.log(this.rightsList)
      })
    },
  },
}
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>