<template>
  <div class="manager-key-container">
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
          密钥名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="模糊查找密钥名称"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          应用组名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.group_name" class="filter-item" placeholder="模糊查找应用组下密钥"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" @click="searchKey" icon="el-icon-search" :disabled="btnStatus" style="float:right;">搜索</el-button>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="key">
          <span>{{ key.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="260px" align="center" label="名称">
        <template slot-scope="key">
          <span>{{ key.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="260px" align="center" label="所属应用组">
        <template slot-scope="key">
          <span>{{ key.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="公钥">
        <template slot-scope="key">
          <el-button type="primary" v-clipboard:copy='key.row.pub_key' v-clipboard:success='clipboardSuccess'>复制</el-button>
        </template>
      </el-table-column>

      <el-table-column width="520px" align="center" label="创建密钥时间">
        <template slot-scope="key">
          <span>{{ key.row.fetch_time | filter_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="key">
          <!-- <el-button type="primary" @click="handleUpdate(key.row)" size="mini" :disabled="btnStatus">编辑</el-button> -->
          <el-button type="danger"  size="medium" @click="handleDelete(key.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogKeyVisible" width="60%" top="2vh">
      <el-form ref="keyForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="ID" prop="id">
          <el-input v-model="commit_obj.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="密钥名称" prop="name">
          <el-input v-model="commit_obj.name"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogKeyVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_KeyListByPage,create_Key,update_Key,delete_Key } from '@/api/auth'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        btnStatus:false,
        dialogKeyVisible: false,
        dialogStatus:'',
        detailSearch: false,
        commit_obj: {
        },
        search_obj: {

        },
        pagination: {
          page: 1,
          count: 0
        },
        textMap:{
          update: '编辑密钥',
          create: '新建密钥',
          delete: '删除密钥'
        }
      }
    },
    created(){
      this.init()
    },
    filters: {
      filter_time(data){
        const ary = data.split('T')
        const bry = ary[1].split('.')
        return ary[0] + ' ' + bry[0]
      }
    },
    methods: {
      init(){
        this.listLoading = true
        fetch_KeyListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list = response.data.results
          this.listLoading = false
        })
      },
      clipboardSuccess() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },
      reset_commit(){
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      searchKey(){
        this.init()
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      handleCreate(row){
        this.reset_commit()
        this.dialogStatus = 'create'
        this.dialogKeyVisible = true
        this.$nextTick(() => {
          this.$refs['keyForm'].clearValidate()
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      handleUpdate(row){
        this.commit_obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogKeyVisible = true
        this.$nextTick(() => {
          this.$refs['keyForm'].clearValidate()
        })
      },
      createData(){
        this.$refs['keyForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Key(this.commit_obj).then(() => {
              this.init()
              this.dialogKeyVisible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogKeyVisible = false
            })
          }
        })
      },
      updateData(){
        this.$refs['keyForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_Key(this.commit_obj).then(() => {
              this.init()
              this.dialogKeyVisible = false
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogKeyVisible = false
            })
          }
        })
      },
      handleDelete(row){
        this.commit_obj = Object.assign({},row)
        this.btnStatus=true
        this.deleteConfirm()
        this.btnStatus=false
      },
      deleteConfirm() {
        this.$confirm('此操作将删除密钥, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Key(this.commit_obj).then((response) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          })
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-key-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
