<template>
    <div class="container">
        <el-form :model="form" :rules="rules" ref="userForm" status-icon  label-width="60px" class="form" :hide-required-asterisk="true">
            <h1 style="margin-left:170px;padding-top: 15px;">登录</h1>
            <el-form-item label="账号" prop="username" style="padding-top: 30px;padding-left: 30px;">
                <el-input autocomplete="off" v-model="form.username" style="width:250px" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="padding-left: 30px;">
                <el-input type="password" v-model="form.password" autocomplete="off" style="width:250px" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login" style="margin-left:60px">登录</el-button>
                <el-button type="success" @click="$router.push('/register')">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(to right, #f4791f, #659999); 
}
.form {
    position: absolute;
    top:35%;
    left: 40%;
    width: 400px;
    height: 300px;
    background-color: rgba(222, 225, 230,.7);
    border-radius: 30px;
}
</style>
<script>
import {setRoute} from '@/router/index'
export default {
    data(){
        return {
           form : {
              username : '',
              password : ''
           },
           rules :{
              username: [
                {required : true, message :'请输入用户名' ,trigger:'blur'}
              ],
              password: [
                {required :true, message : '请输入密码', trigger:'blur'} 
              ]
           }
        }
    },
    methods: {
        login(){
            this.$refs['userForm'].validate((valid) => {
                if(valid){
                    this.axios.post('/login',this.form)
                    .then(res => {
                        if(res.code==200){
                            console.log(res.data);
                            localStorage.setItem('user',JSON.stringify(res.data))
                            setRoute()
                            this.$router.push('/user')
                            this.$message.success('登录成功')
                        }else{
                            this.$message.error(res.msg)
                        }
                    })                    
                }else{
                    return false;
                }
            })
        }
    },
}
</script>