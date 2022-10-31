<template>
    <div class="container">
        <el-form :model="form" :rules="rules" ref="userForm" status-icon  label-width="80px" class="form1" :hide-required-asterisk="true">
            <h1 style="margin-left:170px;padding-top: 15px;">注册</h1>
            <el-form-item label="账号" prop="username" style="padding-top: 30px;padding-left: 30px;">
                <el-input autocomplete="off" v-model="form.username" style="width:250px" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="padding-left: 30px;">
                <el-input type="password" v-model="form.password" autocomplete="off" style="width:250px" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkpassword" style="padding-left: 30px;">
                <el-input type="password" v-model="form.checkpassword" autocomplete="off" style="width:250px" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register" style="margin-left:60px">注册</el-button>
                <el-button type="success" @click="$router.push('/login')">去登录</el-button>
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
.form1 {
    position: absolute;
    top:35%;
    left: 40%;
    width: 420px;
    height: 360px;
    background-color: rgba(222, 225, 230,.7);
    border-radius: 30px;
}
</style>
<script>
export default {
    data(){
        const checkrepeat = (rule, value, callback) => {
            this.axios.post('/checkRepeat',this.form)
            .then(res => {
                if(res.data){
                    callback(new Error('用户名已存在'))
                }else{
                    callback()
                }
            })
        }
        const checkIssame = (rule, value, callback) => {
            if(this.form.password != this.form.checkpassword){
                callback(new Error('两次输入的密码不一致'))
            }else{
                callback()
            }
        }
        return {
           form : {
              username : '',
              password : '',
              checkpassword : ''
           },
           rules :{
              username: [
                {required : true, message :'请输入用户名' ,trigger:'blur'},
                { validator: checkrepeat, trigger: "blur" }
              ],
              password: [
                {required :true, message : '请输入密码', trigger:'blur'} 
              ],
              checkpassword : [
                {required : true, message : '请确认密码', trigger: 'blur'},
                { validator: checkIssame, trigger: "blur" }
              ]
           }
        }
    },
    methods: {
        register(){
            this.$refs['userForm'].validate((valid) => {
                if(valid){
                    this.axios.post('/register',this.form)
                    .then(res => {
                        if(res.code == 200){
                            this.$message.success('注册成功')
                            this.form.username = ''
                            this.form.password = ''
                            this.form.checkpassword = ''
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