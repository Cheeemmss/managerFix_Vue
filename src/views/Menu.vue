<template>
    <div>
      <!-- <el-input v-model="input_name" placeholder="请输入菜单名" style="width: 200px;"></el-input> -->
      <!-- <el-button style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" style="margin-left: 5px;" icon="el-icon-refresh-left" @click="resetClick">重置搜索条件</el-button> -->
      <div>
        <el-button style="margin-top: 15px;" type="primary" icon="el-icon-circle-plus-outline" @click="toAdd"
        :disabled="!ButtonIsAvailable('btn.menu.add')">添加菜单</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>  -->
      </div>

      <el-table :data="tableData" :stripe="true" :border="true" style="margin-top:10px" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
        :tree-props="{children: 'childrenMenu', hasChildren: 'hasChildren'}">
        <!-- <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
        >
        </el-table-column> -->
        <el-table-column prop="id" label="ID" width="160">
        </el-table-column>
        <el-table-column prop="name" label="名称" >
        </el-table-column>
        <el-table-column prop="path" label="路径" >
        </el-table-column>
        <el-table-column prop="pagePath" label="Vue页面名" >
        </el-table-column>
        <el-table-column prop="icon" label="图标" >
            <template slot-scope="scope">
                <i :class="scope.row.icon" style="font-size: 20px;"></i>
            </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" >
        </el-table-column>
        <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button
          v-if="scope.row.menuType != 2"
          :disabled="!ButtonIsAvailable('btn.menu.edit')"
          size="small"
          type="success"
          icon="el-icon-edit"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
          v-if="scope.row.menuType != 2"
          :disabled="scope.row.childrenMenu.length != 0 || !ButtonIsAvailable('btn.menu.add')"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button 
          v-if="scope.row.pid == null"
          :disabled="!ButtonIsAvailable('btn.menu.delete')"
          type="warning"
          size="small"
          icon="el-icon-circle-plus-outline"
          @click="toAddChildMenu(scope.$index, scope.row)"
          >添加子菜单</el-button>
        </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination style="margin-top: 12px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination> -->

      <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="500px">
        <el-form  :model="form" ref="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="路径" :label-width="formLabelWidth">
            <el-input v-model="form.path" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="页面名" :label-width="formLabelWidth">
            <el-input v-model="form.pagePath" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-select v-model="form.icon" placeholder="请选择" style="width:100%">
                <el-option
                v-for="item in options"
                :key="item.name"
                :label="item.name"
                :value="item.value">
                <i :class="item.value"></i> {{ item.name }}
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMenu('form')" >确 定</el-button>
        </div>
      </el-dialog>
      
      <el-dialog title="子菜单信息" :visible.sync="saveChildDialogFormVisible" width="500px">
        <el-form  :model="childFrom" ref="childFrom">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="childFrom.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="路径" :label-width="formLabelWidth">
            <el-input v-model="childFrom.path" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="页面名" :label-width="formLabelWidth">
            <el-input v-model="childFrom.pagePath" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-select v-model="childFrom.icon" placeholder="请选择" style="width:100%">
                <el-option
                v-for="item in options"
                :key="item.name"
                :label="item.name"
                :value="item.value">
                <i :class="item.value"></i> {{ item.name }}
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="childFrom.description" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveChildMenu('childFrom')" >确 定</el-button>
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
            saveChildDialogFormVisible : false,
            // TreeDialogFormVisible : false,
            form: {
                name : '',
                path : '',
                icon : '',
                description : ''
            },
            childFrom:  {
                name : '',
                path : '',
                icon : '',
                description : '',
                pid : ''
            },
            //表格
            multipleSelection: [],
            options :[]
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.axios.get("menu/menuTree", {
                params: {
                    // pageNo: this.pageNo,
                    // pageSize: this.pageSize,
                    // name: this.input_name,
                    userId : null
                }
            }).then(res => {
                // this.total = res.data.total;
                this.tableData = res.data;
            })
            this.getIcons()
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
        saveMenu(index,row) {
            this.axios.post("/menu/save", this.form)
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
            this.$confirm(`你确定要删除菜单 ${row.name} 吗?`, "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete(`/menu/${row.id}`)
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
                this.$confirm(`你确定要删除所选菜单吗?`, "批量删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let ids = this.multipleSelection.map(role => role.id);
                    this.axios.delete("/menu/batch", {
                        data: ids
                    })
                    .then(res => {
                    res.data ? this.$message.success("删除成功") : this.$message.error("删除失败");
                    this.load();
                    });
                }).catch(() => { });
            }
            else {
                this.$message.error("你尚未选择任何菜单");
            }
        },
        getRowKey(row) {
            return row.id;
        },
        toAddChildMenu(index,row){
            this.childFrom = {}
            this.saveChildDialogFormVisible = true
            this.childFrom.pid = row.id
        },
        saveChildMenu(){
            this.axios.post("/menu/save", this.childFrom)
                        .then(res => {
                        if (res.data) {
                            this.$message.success("保存成功");
                            this.saveChildDialogFormVisible = false;
                        }
                        else {
                            this.$message.error("保存失败");
                        }
                        this.load();
                    });
        },
        getIcons(){
            this.axios.get('menu/icons')
            .then(res => {
                if(res.code == 200){
                    this.options = res.data
                }
            })
        }     
    },
    
}
</script>