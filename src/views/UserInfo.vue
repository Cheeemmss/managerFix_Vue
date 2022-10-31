<template>
    <div>
        <el-card class="userInfo">
        <el-form :rules="rules" :model="form" ref="form">
            <el-upload
                style="text-align: center;margin-bottom: 10px;"
                class="avatar-uploader"
                action="http://localhost:8080/file/avatar"
                :data="unP"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                >
                <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input v-model="form.nickname" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-button type="primary" plain style="margin-left:140px" @click="saveUser('form')">确定</el-button>
        </el-form>
        </el-card>
    </div>
</template>
<style>
.userInfo{
    position: absolute;
    top: 150px;
    left: 600px;
    width: 400px;
    height: 550px;
    margin: auto;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }


</style>
<script>
import validates from '../utils/validates'

export default {
    created(){
      this.getUser()
    },
    data(){
        const validatephone = validates.validatephone;
        const validateemail = validates.validateemail;
        return {
            formLabelWidth: "60px",
            //表单
            rules: {
                phone: [{ validator: validatephone, trigger: "blur" },],
                email: [{ validator: validateemail, trigger: "blur" }]
            },
            form: {},
            user : JSON.parse(localStorage.getItem('user')),
            unP : {
                username : JSON.parse(localStorage.getItem('user')).username
            }
        }
    },
    methods :{
        getUser(){
            this.axios.get(`/user/${this.user.username}`)
            .then(res => {
            if(res.code == 200){
                this.form = res.data
                }
            })
        },
        saveUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post("/user", this.form)
                        .then(res => {
                        if (res) {
                            this.$message.success("保存成功");
                            this.dialogFormVisible = false;
                            let user = JSON.parse(localStorage.getItem('user'));
                            //偷懒
                            user.nickname = this.form.nickname
                            localStorage.setItem('user',JSON.stringify(user))
                            this.$bus.$emit('updateAvatar',user)
                        }
                        else {
                            this.$message.error("保存失败");
                        }
                    });
                }
                else {
                    return false
                }
            });
        },
        handleAvatarSuccess(res){
             this.form.avatarUrl = res
             //Header里面的头像和昵称都是 登录的时候初始设到localStrage里面的 
             let user = JSON.parse(localStorage.getItem('user'));
             user.avatarUrl = this.form.avatarUrl
             localStorage.setItem('user',JSON.stringify(user))
             this.$bus.$emit('updateAvatar',user) //用全局事件总线做
             this.$message.success('头像上传成功')
             //笨办法 但是有效果...
            // location.reload()
      }
    }
}
</script>