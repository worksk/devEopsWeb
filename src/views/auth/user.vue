<template>
  <div class="manager-user-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-switch
        v-model="detailSearch"
        inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
      </el-row>
      <el-row style="margin-bottom:5px;" v-show="detailSearch">
         <el-col :span="7" :offset="1">
          联系方式： <el-input size="medium" style="width: 200px;" v-model="search_obj.phone" class="filter-item" placeholder="根据电话号码模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          姓名： <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="根据姓名模糊搜索"></el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          用户名： <el-input size="medium" style="width: 200px;" v-model="search_obj.username" class="filter-item" placeholder="根据用户名模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchUser" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
         <el-col :span="7" :offset="1">
          电子邮箱： <el-input size="medium" style="width: 200px;" v-model="search_obj.email" class="filter-item" placeholder="根据邮箱精准搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-switch
            style="margin-top:7px"
            v-model="search_obj.is_active"
            active-text="可使用"
            active-value=True
            inactive-text="禁用"
            inactive-value=False>
          </el-switch>
        </el-col>
      </el-row>
      <!--<el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>-->
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="100px" align="center" label="ID">
        <template slot-scope="user">
          <span>{{ user.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="user">
          <el-tag :type="user.row.is_active | statusFilter">{{ activeState(user.row.is_active) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="用户名">
        <template slot-scope="user">
          <span>{{ user.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="名称">
        <template slot-scope="user">
          <span>{{ user.row.full_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="user">
          <span>{{ user.row.email8531 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="应用组关联">
        <template slot-scope="user">
          <span>{{ user.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="上次登陆">
        <template slot-scope="user">
          <span>{{ user.row.last_login |timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="500px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="user">
          <el-button type="primary" size="medium" @click="handleGroup(user.row)" :disabled="btnStatus">管理组</el-button>
          <!-- <el-button type="warning" size="medium" @click="" :disabled="btnStatus">编辑</el-button> -->
          <el-button type="danger" size="medium" @click="handleStatus(user.row)" :disabled="btnStatus">改变状态</el-button>
          <el-button type="primary" size="medium" @click="handleDetail(user.row)" :disabled="btnStatus">操作详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">
      <el-form ref="userGrpForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="所属用户组" prop="users">
          <el-transfer v-model="commit_obj.groups" :data="groups" placeholder="请选择所属用户组" filterable>
          </el-transfer>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="updateGroup" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_UserListByPage,update_User,fetch_PmnGroupList } from '@/api/auth'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        btnStatus:false,
        dialogStatus: '',
        detailSearch: false,
        search_obj:{},
        commit_obj:{},
        pagination: {
          page: 1,
          count: 0
        },
        groups: [
        ],
        dialogStatus:'',
        textMap:{
          group: '管理组',
          update: '编辑用户',
          create: '新建用户'
        },
        dialogGroupVisible: false
      }
    },
    created(){
      this.init()
    },
    filters: {
      statusFilter(is_active) {
        if(is_active){
          return 'success'
        }else{
          return 'danger'
        }
      },
      timeFilter(last_login){
        if(last_login){
          const date = last_login.split('T')
          const time = date[1].split('.')
          return date[0]+' '+time[0]
        }else{
          return ''
        }
      }
    },
    methods: {
      init(){
        this.listLoading = true
        fetch_UserListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      init_pmngroup(){
        fetch_PmnGroupList().then(response=>{
          this.groups = []
          for (const group of response.data){
            this.groups.push({
              key: group.id,
              label: group.name,
              disabled: false
            })
          }
        })
      },
      reset_commit(){
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      searchUser(){
        this.init()
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      activeState(is_active){
        if(is_active){
          return '可使用'
        }else{
          return '已禁用'
        }
      },
      handleGroup(row){
        this.dialogStatus = 'group'
        this.dialogGroupVisible = true
        this.commit_obj = Object.assign({},row)
        this.init_pmngroup()
      },
      handleStatus(row){
        this.commit_obj = Object.assign({},row)
        this.$confirm('此操作将修改该用户状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.commit_obj.is_active = !this.commit_obj.is_active
          update_User(this.commit_obj).then((response) => {
            this.$message({
              showClose: true,
              message: '状态修改成功',
              type: 'success'
            })
            this.init()
          })
        })
      },
      handleDetail(row){
        return
      },
      updateGroup(){
        this.$refs['userGrpForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_User(this.commit_obj).then(() => {
              this.init()
              this.dialogGroupVisible = false
              this.$message({
                showClose: true,
                message: '更新组成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogGroupVisible = false
            })
          }
        })

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-user-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
