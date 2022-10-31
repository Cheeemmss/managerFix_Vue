<template>
    <div>
      <el-input v-model="input_name" placeholder="请输入姓名" style="width: 200px;"></el-input>
      <el-input v-model="input_email" placeholder="请输入邮箱" suffix-icon="el-icon-message" style="width: 200px;margin-left: 5px;"></el-input>
      <el-input v-model="input_address" placeholder="请输入地址" suffix-icon="el-icon-position" style="width: 200px;margin-left: 5px;"></el-input>
      <el-button style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" style="margin-left: 5px;" icon="el-icon-refresh-left" @click="resetClick">重置搜索条件</el-button>
      <div>
        <el-button style="margin-top: 15px;" type="primary" icon="el-icon-circle-plus-outline" @click="toAdd"
        :disabled="!ButtonIsAvailable('btn.user.add')"
       >
            添加用户</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteBatch"
        :disabled="!ButtonIsAvailable('btn.user.deleteBatch')">批量删除</el-button>
        <el-button style="margin-top: 15px;" type="primary" icon="el-icon-top" @click="exp">导出</el-button>    
        <el-upload 
            action="http://localhost:8080/user/import"
            :show-file-list="false"
             accept=".xlsx"
            :on-success="handleImportSucces"
            :on-error="handleImportFailed"
            style="display:inline-block;margin-left: 5px;">
            <el-button style="" type="primary" icon="el-icon-bottom">导入</el-button>
        </el-upload>
      </div>

      <el-table :data="tableData" :stripe="true" :border="true" style="margin-top:10px" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey">
        <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="160">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="160">
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="160">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180">
        </el-table-column>
        <el-table-column prop="roleList" label="角色" width="180">        
            <template slot-scope="scope">
                <div>
                  <ul>
                    <li v-for="item in scope.row.roleList">
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </template>
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
          :disabled="!ButtonIsAvailable('btn.user.edit')"
          size="small"
          type="success"
          icon="el-icon-edit"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
          :disabled="!ButtonIsAvailable('btn.user.delete')"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
          :disabled="!ButtonIsAvailable('btn.user.delete')"
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleAllocate(scope.$index, scope.row)">分配角色</el-button>
        </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin-top: 12px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

      <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="500px">
        <el-form :rules="rules" :model="form" ref="form">
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser('form')" >确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="分配角色" :visible.sync="AllocatedialogFormVisible" width="500px">
        <el-tree :data="roles" 
        :props="defaultProps"
        show-checkbox
        ref="roles"
        node-key="id">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AllocatedialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUserRole()" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<style>

</style>
<script>
import validates from '../utils/validates'
import tableListDatas from '@/utils/tableListDatas'
export default {
    data(){
        const validatephone = validates.validatephone;
        const validateemail = validates.validateemail;
        return {
            formLabelWidth: "60px",
            //页码 
            pageSize: 4,
            pageNo: 1,
            total: 0,
            tableData: [],
            //搜索
            input_name: "",
            input_email: "",
            input_address: "",
            //表单
            rules: {
                phone: [{ validator: validatephone, trigger: "blur" },],
                email: [{ validator: validateemail, trigger: "blur" }]
            },
            dialogFormVisible: false,
            AllocatedialogFormVisible: false,
            form: {},
            //表格
            multipleSelection: [],
            defaultProps:{
               label : 'name'
            },
            roles:[],
            currentUser:{}
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.axios.get("/page", {
                params: {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    username: this.input_name,
                    email: this.input_email,
                    address: this.input_address
                }
            }).then(res => {
                this.total = res.total;
                this.tableData = res.records;
            });
        },
        handleCurrentChange(pageNo) {
            this.pageNo = pageNo;
            this.load();
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.load();
        },
        search() {
            this.load();
        },
        resetClick() {
            this.input_name = "",
                this.input_email = "",
                this.input_address = "",
                this.load();
        },
        toAdd() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        saveUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post("/user", this.form)
                        .then(res => {
                        if (res) {
                            this.$message.success("保存成功");
                            this.dialogFormVisible = false;
                        }
                        else {
                            this.$message.error("保存失败");
                        }
                        this.load();
                    });
                }
                else {
                    return false;
                }
            });
        },
        handleEdit(index, row) {
            //做了一个深拷贝 防止没点确定数据就双向绑定上去了
            this.form = JSON.parse(JSON.stringify(row));
            this.dialogFormVisible = true;
        },
        handleDelete(index, row) {
            this.$confirm(`你确定要删除用户 ${row.username} 吗?`, "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete(`/user/${row.id}`)
                    .then(res => {
                    res ? this.$message.success("删除成功") : this.$message.error("删除失败");
                    this.load();
                });
            }).catch(() => { });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteBatch() {
            if (this.multipleSelection.length != 0) {
                this.$confirm(`你确定要删除所选用户吗?`, "批量删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let ids = this.multipleSelection.map(user => user.id);
                    this.axios.delete("/user/batch", {
                        data: ids
                    })
                    .then(res => {
                    res ? this.$message.success("删除成功") : this.$message.error("删除失败");
                    this.load();
                    });
                }).catch(() => { });
            }
            else {
                this.$message.error("你尚未选择任何用户");
            }
        },
        getRowKey(row) {
            return row.id;
        },
        exp() {
            if (this.multipleSelection.length != 0) {
                this.axios.post("/user/export", this.multipleSelection.map(user => user.id), { responseType: "blob" })
                    .then((res) => {
                    let blob = new Blob([res.data]);
                    let downloadElement = document.createElement("a");
                    let href = window.URL.createObjectURL(blob); // 创建下载的链接
                    downloadElement.href = href;
                    let fileName = decodeURI(res.headers["content-disposition"].split("attachment;filename=")[1]);
                    downloadElement.download = fileName; // 下载后文件名用的是后端响应过来的 响应头中的名字
                    document.body.appendChild(downloadElement);
                    downloadElement.click();
                    document.body.removeChild(downloadElement); // 下载完成移除元素
                    window.URL.revokeObjectURL(href); // 释放掉blob对象          
                });
            }
            else {
                this.$message.error("请选择要导出的用户");
            }
        },
        handleImportSucces() {
            this.$message.success("导入成功");
            this.load();
        },
        handleImportFailed() {
            this.$message.success("导入成功");
        },
        handleAllocate(index,row){
            this.AllocatedialogFormVisible = true
            //1.请求所有的角色数据
            this.axios.get('/role/page?pageNo=1&pageSize=10',)
            .then(res => {
                if(res.code == 200){
                   this.roles = res.data.records
                } 
            })
            //2.回显已被分配的角色
            this.axios.get('/role/'+row.id)
            .then(res => {
                if(res.code == 200){
                    this.$refs.roles.setCheckedKeys(res.data);  
                }
            })
            //3.指定当前修改的用户为该行的用户
            this.currentUser.id = row.id
        },
        getCheckedKeys() {
            return this.$refs.roles.getCheckedKeys()
        },
        saveUserRole(){
            this.axios.post('/role/allocateRole/'+this.currentUser.id,this.getCheckedKeys())
            .then(res => {
                if(res.code == 200){
                    this.$message.success('分配成功')
                    this.AllocatedialogFormVisible = false
                    this.load()
                }
            })
        }
    },
}
</script>