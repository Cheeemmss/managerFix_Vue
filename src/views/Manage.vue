<template>
<el-container>
  <el-aside  style="min-height:100vh;box-shadow: 2px 0 6px rgb(0 21 41 / 35%);" :width="menuwidth +'px'">
  <Aside :isCollapse="isCollapse" :menuwidth="menuwidth"></Aside>
  </el-aside>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; border-bottom:2px solid #ccc" >
    <Header :collapseBtnClass="collapseBtnClass" :isCollapse="isCollapse" :collapse="collapse"></Header>
    </el-header>

    <el-main>
        <!-- 当前页的子路由会显示在这里 -->
        <router-view></router-view>
    </el-main>

  </el-container>

</el-container>
</template>

<style>
  .el-header {
    /* background-color: #B3C0D1; */
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }

</style>

<script>
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'

  export default {
    data() {
        return {           
            // 侧边栏
            collapseBtnClass: "el-icon-s-fold",
            isCollapse: false,
            menuwidth: 200,
        };
    },
    components :{
        Aside,
        Header
    },
    methods: {
      collapse() {
            this.isCollapse = !this.isCollapse;
            if (this.isCollapse) { //展开
                this.menuwidth = 65;
                this.collapseBtnClass = "el-icon-s-unfold";
            }
            else {
                this.menuwidth = 200;
                this.collapseBtnClass = "el-icon-s-fold";
            }
        }
    },
}
</script>
