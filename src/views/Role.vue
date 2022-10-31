<template>
    <div>
      <el-input v-model="input_name" placeholder="请输入角色" style="width: 200px;"></el-input>
      <el-button style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" style="margin-left: 5px;" icon="el-icon-refresh-left" @click="resetClick">重置搜索条件</el-button>
      <div>
        <el-button style="margin-top: 15px;" type="primary" icon="el-icon-circle-plus-outline" @click="toAdd"
        :disabled="!ButtonIsAvailable('btn.role.add')">添加角色</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteBatch"
        :disabled="!ButtonIsAvailable('btn.role.deleteBatch')">批量删除</el-button> 
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
        <el-table-column prop="name" label="名称" >
        </el-table-column>
        <el-table-column prop="description" label="描述" >
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
          :disabled="!ButtonIsAvailable('btn.role.edit')"
          size="small"
          type="success"
          icon="el-icon-edit"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
          :disabled="!ButtonIsAvailable('btn.role.delete')"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
          :disabled="!ButtonIsAvailable('btn.role.allocate')" 
          type="warning"
          size="small"
          icon="el-icon-menu"
          @click="handleAllocationMenu(scope.$index, scope.row)"
          >分配菜单</el-button>
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

      <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="500px">
        <el-form  :model="form" ref="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole('form')" >确 定</el-button>
        </div>
      </el-dialog>
    
    <el-dialog title="菜单分配" :visible.sync="TreeDialogFormVisible" width="300px"> 
        <el-tree
        :data="menuTree"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="expanded"
        :props="defaultProps"
        :check-strictly="nodeFlag">
        </el-tree>
         <!-- check-strictly 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="TreeDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleMenu()" >确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<style>

</style>
<script>
export default {
    data(){
        return {
            formLabelWidth: "60px",
            //页码 
            pageSize: 4,
            pageNo: 1,
            total: 0,
            tableData: [],
            //搜索
            input_name: "",
            //表单
            dialogFormVisible: false,
            TreeDialogFormVisible : false,
            form: {
                name : '',
                description : ''
            },
            //role树
            menuTree: [],
            defaultProps: {
                label: 'name',
                children: 'childrenMenu'
            },
            nodeFlag : false,
            //表格
            multipleSelection: [],
            expanded :[],
            // checked :[],
            roleId :'',
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.axios.get("role/page", {
                params: {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    name: this.input_name,
                }
            }).then(res => {
                this.total = res.data.total;
                this.tableData = res.data.records;
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
            this.load();
        },
        toAdd() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        saveRole() {
            this.axios.post("/role/save", this.form)
                        .then(res => {
                        if (res.data) {
                            this.$message.success("保存成功");
                            this.dialogFormVisible = false;
                        }
                        else {
                            this.$message.error("保存失败");
                        }
                        this.load();
                    });
        },
        handleEdit(index, row) {
            //做了一个深拷贝 防止没点确定数据就双向绑定上去了
            this.form = JSON.parse(JSON.stringify(row));
            this.dialogFormVisible = true;
        },
        handleDelete(index, row) {
            this.$confirm(`你确定要删除角色 ${row.name} 吗?`, "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete(`/role/${row.id}`)
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
                this.$confirm(`你确定要删除所选角色吗?`, "批量删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let ids = this.multipleSelection.map(role => role.id);
                    this.axios.delete("/role/batch", {
                        data: ids
                    })
                    .then(res => {
                    res.data ? this.$message.success("删除成功") : this.$message.error("删除失败");
                    this.load();
                    });
                }).catch(() => { });
            }
            else {
                this.$message.error("你尚未选择任何角色");
            }
        },
        getRowKey(row) {
            return row.id;
        },
        handleAllocationMenu(index,row){
           this.TreeDialogFormVisible = true
           this.roleId = row.id
           //请求所有菜单节点数据树
           this.axios.get('/menu/menuTree',
           {
                params : {
                    userId : null
                }
           })
           .then(res => {
                if(res.code == 200){
                   this.menuTree = res.data
                   //默认展开的节点
                   this.expanded = this.menuTree.map(m => m.id)
                }
           })
            //请求当前角色拥有那些被分配了哪些菜单(menuId[])
           this.nodeFlag = true //为了是解除父子节点的关联（意思就是点击勾选父节点的时候下边的所有子节点都不会选中。）
           this.axios.get('role/roleMenu/'+ this.roleId)
           .then(res => {           
                if(res.code == 200){
                    let menuIds = res.data.map( m => m.menuId)
                    this.$refs.tree.setCheckedKeys(menuIds);
                   // 恢复默认值 保证菜单的正常使用
                    this.nodeFlag = false;
                }
           })

        },
        getCheckedKeys() {
            return this.$refs.tree.getCheckedKeys()
        },
        getHalfCheckedKeys(){
            return this.$refs.tree.getHalfCheckedKeys()
        },
        saveRoleMenu(){
           this.axios.post('role/allocationMenu/' + this.roleId, this.getCheckedKeys().concat(this.getHalfCheckedKeys()))
           .then(res => {
              if(res.code == 200){
                  this.$message.success('保存成功')  
              }else{
                  this.$message.error('保存失败')
              }
              this.TreeDialogFormVisible = false;
           })
        }
    },
    
}
</script>