<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleClick">折叠/展开</div>
    <el-menu background-color="#333744" 
              text-color="#fff" 
              active-text-color="#409eff" 
              unique-opened 
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              :default-active = "activeMenuItem">
      <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="activeItem('/'+subItem.path)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{subItem.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { getMenus } from 'network/home'
export default {
  name: 'LeftAside',
  data() {
    return {
      menusList: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeMenuItem: ''
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getMenus()
    this.activeMenuItem = window.sessionStorage.getItem('activePath')
    
  },
  activated() {
    // console.log(this.$route.path)
  },
  methods:{
    getMenus(){
      getMenus().then(res => {
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menusList = res.data
        // console.log('menus', this.menusList)


      })
    },
    toggleClick() {
      this.isCollapse = !this.isCollapse
    },
    activeItem(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activeMenuItem = activePath
    }

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-aside {
  background-color: #333744;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>