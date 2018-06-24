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
          <el-col :span="7">
            实例名称： <el-input style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="根据实例名称模糊搜索"></el-input>
          </el-col>
          <el-col :span="7">
            实例状态：
            <el-select v-model="search_obj.status" placeholder="请选择应用组状态" style="width: 200px;" disabled="">
              <option key=1>正常</option>
              <option key=0>停止</option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <el-switch
              style="margin-top:10px"
              v-model="search_obj.is_master"
              active-text="Slave节点"
              active-value=False
              inactive-text="Master节点"
              inactive-value=True>
            </el-switch>
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="float:right;" @click="searchDBUser" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="user">
          <span>{{ user.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="用户名称">
        <template slot-scope="user">
          <span>{{ user.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="状态">
        <template slot-scope="user">
          <el-tag :type="user.row._status | statusFilter">{{ optionState[user.row._status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="用户信息">
        <template slot-scope="user">
          <span>{{ user.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="角色名称">
        <template slot-scope="user">
          <span>{{ user.row.rolename }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="user">
          <el-button type="warning" size="medium" disabled="">编辑</el-button>
          <el-button type="danger" size="medium" disabled="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDBVisible" width="60%" top="2vh">
      <el-form ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        
        <el-form-item label="实例名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例的名称" placement="bottom" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="实例端口" prop="port" size="medium">
          <el-tooltip content="请输入该实例连接端口" placement="bottom" effect="light">
            <el-input v-model="commit_obj.port"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="" prop="is_master">
            <el-switch
              style="margin-top:10px"
              v-model="commit_obj.is_master"
              active-text="Slave节点"
              active-value=False
              inactive-text="Master节点"
              inactive-value=True>
            </el-switch>
        </el-form-item>

        <el-form-item label="状态" prop="_status" size="medium">
          <el-tooltip content="请输入该机器目前的状态" placement="top" effect="light">
            <el-select v-model="commit_obj._status" placeholder="请选择主机状态">
              <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="超管账户" prop="admin_user" size="medium">
          <el-tooltip content="请输入超管账户" placement="bottom" effect="light">
            <el-input v-model="commit_obj.admin_user"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="超管密码" prop="passwd" size="medium">
          <el-tooltip content="请输入超管账户密码" placement="bottom" effect="light">
            <el-input type="password" v-model="commit_obj.passwd"></el-input>
          </el-tooltip>
        </el-form-item>
  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDBVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" @click="createInstance" type="primary" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateInstance" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_DBUserListByPage,create_DBUser,update_DBUser,delete_DBUser } from '@/api/db';
  export default {
      data(){
        return{
          list: null,
          listLoading: true, 
          btnStatus: false,
          dialogDBVisible: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            update: '编辑数据库用户',
            create: '新建数据库用户',
          },
          dialogStatus:'',
          detailSearch: false,
          commit_obj: {},
          search_obj: {},
          optionState: [
            {
              value: 0,
              label: '错误'
            }, {
              value: 1,
              label: '正常'
            }]
        }
      },
      created(){
        this.init()
      },
      filters:{
        statusFilter(_status) {
          const statusMap = {
            0: 'danger',
            1: 'success',
            2: 'info'
          }
          return statusMap[_status]
        },
      },
      methods:{
        init(){
          this.reset_search()
          this.init_user()
        },
        init_user(){
          fetch_DBUserListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
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
        searchDBUser(){
          this.init_instance()
        },
        handleCreate(row){

        },
        createInstance(){
        },
        updateInstance(){
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
