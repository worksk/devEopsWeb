<template>
  <div class="manager-permission-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-switch
        v-model="detailSearch"
        inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
        <el-col :span="7" :offset="1">
          权限： <el-input size="medium" style="width: 200px;" v-model="search_obj.permission" class="filter-item" placeholder="模糊查找权限"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          组名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="模糊查找权限组名称"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchGroup" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="120px" align="center" label="ID">
        <template slot-scope="group">
          <span>{{ group.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="名称">
        <template slot-scope="group">
          <span>{{ group.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="1000px" align="center" label="名称">
        <div slot-scope="group">
          <template v-for="permission in group.row.permissions">
              <el-tag>{{ permissions_tag[permission] }}</el-tag>
          </template>
          <!--<el-tag>...</el-tag>-->
        </div>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="group">
          <el-button type="primary" size="medium" @click="handleUpdate(group.row)" :disabled="btnStatus">编辑</el-button>
          <!--<el-button type="warning" @click="" size="mini" :disabled="btnStatus">编辑</el-button>-->
          <!--<el-button type="danger" @click="handleStatus(user.row)" size="mini" :disabled="btnStatus">改变状态</el-button>-->
          <!--<el-button type="primary" @click="handleDetail(user.row)" size="mini" :disabled="btnStatus">操作详情</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">-->
      <!---->
    <!--</el-dialog>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">
      <el-form ref="groupForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="权限组名称" prop="name">
          <el-tooltip content="请输入您的权限组名称，如:新媒体云服务平台开发组" placement="top" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属用户组" prop="users">
          <el-transfer v-model="commit_obj.permissions" :data="permissions" placeholder="请选择权限" filterable>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createGroup" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateGroup" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_PmnGroupListByPage,fetch_Permission,create_PmnGroup,update_PmnGroup } from '@/api/auth'
  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        btnStatus: false,
        permissions: [],
        permissions_tag: [],
        dialogStatus:'',
        pagination: {
          page: 1,
          count: 0
        },
        detailSearch: false,
        commit_obj: {
        },
        search_obj:{
        },
        dialogStatus: '',
        textMap: {
          create: '创建权限组',
          update: '修改权限组'
        },
        dialogGroupVisible: false
      }
    },
    created() {
      this.init_permission()
      this.init()
    },
    filters: {},
    methods: {
      init() {
        this.listLoading = true
        fetch_PmnGroupListByPage(this.pagination,this.search_obj).then(response => {
          this.pagination.count = response.data.count
          this.list = response.data.results
          this.listLoading = false
        })
      },
      init_permission(){
        fetch_Permission().then(response => {
          this.permissions_tag = []
          for (const per of response.data) {
            this.permissions_tag[per.id] = per.name
          }
          this.permissions = []
          for (const per of response.data) {
            this.permissions.push({
              key: per.id,
              label: per.name,
              disabled: false
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      reset_commit(){
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      searchGroup(){
        this.init()
      },
      handleCreate() {
        this.reset_commit()
        this.dialogStatus = 'create'
        this.dialogGroupVisible = true
        this.$nextTick(() => {
          this.$refs['groupForm'].clearValidate()
        })
      },
      createGroup(){
        this.$refs['groupForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_PmnGroup(this.commit_obj).then(() => {
              this.init()
              this.dialogGroupVisible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogGroupVisible = false
              console.log(error)
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.dialogGroupVisible = true
        this.commit_obj = Object.assign({}, row)
      },
      updateGroup() {
        this.$refs['groupForm'].validate((valid) => {
          if (valid) {
            this.btnStatus = true
            update_PmnGroup(this.commit_obj).then(() => {
              this.init()
              this.dialogGroupVisible = false
              this.$message({
                showClose: true,
                message: '更新权限组成功',
                type: 'success'
              })
              this.btnStatus = false
            }).catch((error) => {
              this.btnStatus = false
              this.dialogGroupVisible = false
              console.log(error)
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-permission-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
