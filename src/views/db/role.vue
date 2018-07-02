<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">

          <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" filterable clearable style="width: 400px;">
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>


          <el-switch
            v-model="detailSearch"
            inactive-text="详细检索">
          </el-switch>
          <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
          <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:5px;">
          <el-col :span="7" :offset="1">
            应用组名称： <el-input style="width: 200px;" v-model="search_obj.group" class="filter-item" placeholder="根据应用组信息模糊搜索"></el-input>
          </el-col>
          <el-col :span="7">
            角色名称： <el-input style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="根据角色名称模糊搜索"></el-input>
          </el-col>
      </el-row>
      <!-- <el-row v-show="detailSearch" style="margin-bottom:20px;">
          <el-col :span="4" :offset="1">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Select"
              active-value=True
              inactive-text="未拥有Select"
              v-model="search_obj.select"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Update"
              active-value=True
              v-model="search_obj.can_update"
              inactive-text="未拥有Update"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Delete"
              active-value=True
              v-model="search_obj.can_delete"
              inactive-text="未拥有Delete"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Insert"
              active-value=Trye
              v-model="search_obj.insert"
              inactive-text="未拥有Insert"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Create"
              active-value=True
              v-model="search_obj.create"
              inactive-text="未拥有Create"
              inactive-value=False>
            </el-switch>
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="float:right;" @click="searchDBRole" :disabled="btnStatus">搜索</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
          <el-col :span="4" :offset="1">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Drop"
              active-value=True
              inactive-text="未拥有Drop"
              v-model="search_obj.drop"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              active-text="拥有Alter"
              active-value=True
              v-model="search_obj.alter"
              inactive-text="未拥有Alter"
              inactive-value=False>
            </el-switch>
          </el-col>
      </el-row> -->
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="role">
          <span>{{ role.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="角色名称">
        <template slot-scope="role">
          <span>{{ role.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="详细信息">
        <template slot-scope="role">
          <span>{{ role.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="应用组">
        <template slot-scope="role">
          <span>{{ role.row.groupname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="实例名称">
        <template slot-scope="role">
          <span>{{ role.row.instance_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="所属应用组">
        <template slot-scope="role">
          <span>{{ role.row.groupname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="权限">
        <div slot-scope="role">
          <template v-for="permission in role.row.permissions">
              <el-tag>{{ permission | permission_Filter }}</el-tag>
          </template>
          <!--<el-tag>...</el-tag>-->
        </div>
      </el-table-column>

      <el-table-column align="center" label="操作" width="350px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="role">
          <el-button type="warning" size="medium" @click="handleUpdate(role.row)">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(role.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRoleVisible" width="60%" top="2vh">
      <el-form ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        
        <el-form-item label="角色名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例的名称" placement="bottom" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="角色信息" prop="info" size="medium">
          <el-tooltip content="请输入该角色" placement="bottom" effect="light">
            <el-input v-model="commit_obj.info"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="实例" prop="instance" size="medium">
          <el-tooltip content="请输入当前角色属于哪个角色" placement="top" effect="light">
            <el-select v-model="commit_obj.instance" placeholder="请选择实例">
              <el-option v-for="instance in instances" :key="instance.label" :label="instance.label" :value="instance.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="权限" size="medium">
          <el-transfer v-model="commit_obj.permissions" :data="permissions" placeholder="请选择任务内的元操作" filterable>
          </el-transfer>
        </el-form-item>
  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" @click="createRole" type="primary" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateRole" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_DBRoleListByPage,create_DBRole,update_DBRole,delete_DBRole,fetch_DBInstanceList } from '@/api/db';
  import { fetch_GroupList } from '@/api/manager';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogRoleVisible: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            update: '编辑数据库角色',
            create: '新建数据库角色',
          },
          dialogStatus:'',
          permissions:[
            {key: 1,label: 'select'},
            {key: 2,label: 'update'},
            {key: 3,label: 'delete'},
            {key: 4,label: 'insert'},
            {key: 5,label: 'create'},
            {key: 6,label: 'drop'},
            {key: 7,label: 'alter'}
          ],
          instances:[],
          groups:[],
          detailSearch: false,
          commit_obj: {},
          search_obj: {}
        }
      },
      created(){
        this.init()
      },
      filters:{
        permission_Filter(value){
          let permissions = {
            1:'select',
            2:'update',
            3:'delete',
            4:'insert',
            5:'create',
            6:'drop',
            7:'alter'
          }
          return permissions[value]
        }
      },
      methods:{
        init(){
          this.reset_search()
          this.init_role()
          this.init_instance()
          this.init_group()
        },
        init_role(){
          fetch_DBRoleListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        init_group(){
          fetch_GroupList().then((response)=>{
            this.groups = []
            for (const group of response.data){
              this.groups.push({
                value: group.uuid,
                key: group.uuid,
                label: group.name,
                disabled: false
              })
            }
          })
        },
        init_instance(){
          fetch_DBInstanceList().then((response)=>{
            this.instances = []
            for (const instance of response.data){
              this.instances.push({
                value: instance.id,
                key: instance.id,
                label: instance.name,
                disabled: false
              })
            }
          })
        },
        reset_search(){
          this.search_obj = {}
        },
        reset_commit(){
          this.commit_obj = {}
        },
        resetSearch(){
          this.init()
        },
        searchDBRole(){
          this.init_role()
        },
        changeGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init_role()
        },
        handleCreate(row){
          this.reset_commit()
          this.dialogStatus = 'create'
          this.dialogRoleVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleUpdate(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'update'
          this.dialogRoleVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleDelete(row){
          this.commit_obj = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        },
        deleteConfirm() {
          this.$confirm('此操作将删除角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            delete_DBRole(this.commit_obj).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
            })
          })
        },
        createRole(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_DBRole(this.commit_obj).then(() => {
                this.init()
                this.dialogRoleVisible = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogRoleVisible = false
              })
            }
          })
        },
        updateRole(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_DBRole(this.commit_obj).then(() => {
                this.init()
                this.dialogRoleVisible = false
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogRoleVisible = false
              })
            }
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-host-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
