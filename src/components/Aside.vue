<template>
    <el-menu :default-openeds="[]" style="min-height: 100%; overflow-x: hidden;"
                                   background-color="rgb(48,65,86)"
                                   text-color="#fff"
                                   :collapse-transition="false"
                                   :collapse="isCollapse"
                                   router
                                   >
      <div style="height: 60px;line-height: 60px;text-align: center;font-size: 24px;color: #fff;">
      <img src="../assets/logo.png" alt="managerFix" style="height:40px;margin-top: 8px;">
      <span v-show="!isCollapse">ManagerFix</span>
      </div>
      <!-- <el-submenu index="1">
        <template slot="title"><i class="el-icon-house"></i><span>Home</span></template>
           <el-menu-item index="/home">主页</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i><span>系统管理</span></template>
          <el-menu-item index="/user">用户管理</el-menu-item>
          <el-menu-item index="/userInfo">用户信息</el-menu-item>
          <el-menu-item index="/role">角色管理</el-menu-item>
          <el-menu-item index="/menu">菜单管理</el-menu-item>
      </el-submenu> -->

      <!-- 动态菜单 -->
      <template v-for="menu in menus">
          <el-submenu :index="String(menu.id)">
            <template slot="title"><i :class="menu.icon"></i><span>{{ menu.name }}</span></template>
            <template v-for=" subMenu in  menu.childrenMenu">
                <el-menu-item :index="subMenu.path"><i :class="subMenu.icon"></i><span>{{ subMenu.name }}</span></el-menu-item>
            </template>
          </el-submenu>
      </template>

    </el-menu>

</template>
<style>
</style>
<script>
export default {
  data() {
    return {
      menus : JSON.parse(localStorage.getItem('user')).menuList
    }
  },
  props: {
    isCollapse : Boolean,
    menuwidth : Number,  
  },
  created(){
    // console.log(this.menus);
  }
}
</script>