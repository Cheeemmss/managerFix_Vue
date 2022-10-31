<template>
<div> 
    <div style="flex: 1;font-size: 1;float: left;font-size: 20px;">
    <span v-bind:class="collapseBtnClass" style="cursor: pointer;" @click="collapse"></span>
    </div>

    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px;float: left;line-height: 60px;margin-left: 15px;">
        <el-breadcrumb-item :to="{ path: '/userInfo' }">ManagerFix</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
    </el-breadcrumb>

     <el-avatar :size="30" :src="user.avatarUrl" style="position: absolute;top:15px;right: 100px;margin-right: 30px;"></el-avatar>
     <span>{{user.nickname}}</span>
      <el-dropdown style="margin-left:5px">
        <i class="el-icon-setting" style="margin-right: 15px;font-size: 20px;"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><span @click="$router.push('/userInfo')" style="display:inline-block;width:100%;height:100%">个人信息</span></el-dropdown-item>
          <el-dropdown-item><span  @click="logout">退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
</div>

</template>
<style>
a{
    text-decoration: none;
    color: black;
}
</style>
<script>
export default {
    data(){
        return {
            user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
        }
    },
    props :{
        collapseBtnClass : String,
        isCollapse : Boolean,       
        collapse: {
            type: Function,
            default: () => {},
        },
    },
    mounted(){
        this.$bus.$on('updateAvatar', (data)=>{
             this.user.avatarUrl = data.avatarUrl
             this.user.nickname = data.nickname
          })
    },
    beforeDestroy(){
          this.$bus.$off('updateAvatar')
    },
    //computed中currentPathName中得到的值发送变化时 会执行该函数
    computed:{
        currentPathName(){
            return this.$store.state.currentPathName
        }
    },
    methods:{
        logout(){
            this.$router.push('/login')
            localStorage.removeItem('user')
            this.$message.success('退出成功')
        }
    }
}
</script>