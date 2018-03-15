<template>
  <div class="manager-group-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="group">
          <span>{{ group.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="UUID">
        <template slot-scope="group">
          <span>{{ group.row.uuid| uuidFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="155px" align="center" label="应用系统名称">
        <template slot-scope="group">
          <span>{{ group.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="360px" align="center" label="应用系统信息">
        <template slot-scope="group">
          <span>{{ group.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态" class-name="status-col" >
        <template slot-scope="group">
          <el-tag :type="group.row.status | statusFilter">{{ optionState[group.row.status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="group">
          <el-button type="primary" @click="handleImage(group.row)" size="mini" :disabled="btnStatus">架构图</el-button>
          <el-button type="warning" @click="handleUpdate(group.row)" size="mini" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" @click="handleDelete(group.row)" size="mini" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="应用组ID" prop="id">
          <el-input v-model="temp.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用组名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="应用组信息" prop="info">
          <el-input type="textarea" v-model="temp.info"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" placeholder="请选择应用组状态">
            <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理用户" prop="users">
          <el-transfer v-model="temp.users" :data="users" placeholder="请选择管理用户" filterable>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogImgVisible" width="80%" top="2vh">
      <img :src="temp.framework" style="width:100%;height:100%;">
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_GroupList,update_Group,delete_Group,create_Group,fetch_UserList,fetch_HostList } from '@/api/manager'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogImgVisible: false,
        dialogStatus: '',
        btnStatus: false,
        users:[],
        // header:{'authorization':'JWT '+this.$store.getters.token},
        textMap: {
          update: '编辑',
          create: '新建',
          img: '图片'
        },
        temp: {
          name: '',
          status: 0,
          info: '',
          users: []
        },
        rules: {
          name: [{ required: true, message: '应用组名称是必填的', trigger: 'change' }],
          info: [{ required: true, message: '应用组信息是必填的', trigger: 'change' }],
          status: [{ required: true, message: '应用组状态是必填的', trigger: 'change' }]
        },
        optionState:[
          {
            value: 0,
            label: '禁用中'
          }, {
            value: 1,
            label: '使用中'
          }, {
            value: 2,
            label: '暂停中'
          }]
      }
    },
    created(){
      this.getList()
      this.getUserList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: 'danger',
          1: 'success',
          2: 'info'
        }
        return statusMap[status]
      },
      uuidFilter(uuid) {
        const ary = uuid.split('-')
        return ary[0] + '-' + ary[1] + '-'+ ary[2]
      }
    },
    methods:{
      getList(){
        this.listLoading = true
        fetch_GroupList().then(response =>{
          this.list=response.data
          this.listLoading = false
        })
      },
      getUserList(){
        fetch_UserList().then(response=>{
          this.users = []
          for (const user of response.data){
            this.users.push({
              key: user.id,
              label: user.username,
              disabled: false
            })
          }
        })
      },
      deleteConfirm() {
        this.$confirm('此操作将删除应用组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Group(this.temp).then((response) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          })
        })
      },
      handleImage(row){
        this.temp = Object.assign({},row)
        this.dialogImgVisible = true
        this.dialogStatus = 'img'
      },
      handleDelete(row){
        this.temp = Object.assign({},row)
        this.btnStatus=true
        this.deleteConfirm()
        this.btnStatus=false
      },
      handleUpdate(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleCreate(){
        this.temp = Object.assign({}, {})
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Group(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              console.log(error)
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            const tempData = Object.assign({}, this.temp)
            update_Group(tempData).then((response) => {
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              console.log(error)
            })
          }
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-group-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
