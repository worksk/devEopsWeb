<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
          <el-switch
            v-model="detailSearch"
            inactive-text="详细检索">
          </el-switch>
          <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
          <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
          <el-col :span="4" :offset="1">
            <el-switch
              style="margin-top:10px"
              v-model="search_obj.update"
              active-text="拥有Update"
              active-value=True
              inactive-text="未拥有Update"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              v-model="search_obj.delete"
              active-text="拥有Delete"
              active-value=True
              inactive-text="未拥有Delete"
              inactive-value=False>
            </el-switch>
          </el-col>

          <el-col :span="4">
            <el-switch
              style="margin-top:10px"
              v-model="search_obj.drop"
              active-text="拥有Drop"
              active-value=True
              inactive-text="未拥有Drop"
              inactive-value=False>
            </el-switch>
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="float:right;" @click="searchDBRole" :disabled="btnStatus">搜索</el-button>
      </el-row>
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

      <el-table-column width="200px" align="center" label="应用组">
        <template slot-scope="role">
          <span>{{ role.row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="权限">
        <div slot-scope="role">
          <template v-for="permission in role.row.permissions">
              <el-tag>{{ permission }}</el-tag>
          </template>
          <!--<el-tag>...</el-tag>-->
        </div>
      </el-table-column>

      <el-table-column align="center" label="操作" width="350px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="role">
          <el-button type="warning" size="medium" disabled="">编辑</el-button>
          <el-button type="danger" size="medium" disabled="">删除</el-button>
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

        <el-form-item label="实例" prop="instance" size="medium">
          <el-tooltip content="请输入当前角色属于哪个实例" placement="top" effect="light">
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
            update: '编辑数据库实例',
            create: '新建数据库实例',
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
          detailSearch: false,
          commit_obj: {},
          search_obj: {}
        }
      },
      created(){
        this.init()
      },
      filters:{
      },
      methods:{
        init(){
          this.reset_search()
          this.init_role()
          this.init_instance()
        },
        init_role(){
          fetch_DBRoleListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
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
        handleCreate(row){
          this.reset_commit()
          this.dialogStatus = 'create'
          this.dialogRoleVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        rebuild_commit(){
          for(let permission in this.commit_obj.permissions){
            let tmp = this.permissions[permission]
            Object.assign(this.commit_obj,{tmp:"True"})
          }
        },
        createRole(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              this.rebuild_commit()
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
