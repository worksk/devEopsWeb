<template>
  <div class="manager-jumper-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件" disabled="">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" disabled="">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="jumper">
          <span>{{ jumper.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="连接地址">
        <template slot-scope="jumper">
          <span>{{ jumper.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="连接端口">
        <template slot-scope="jumper">
          <span>{{ jumper.row.sshport }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="jumper">
          <el-tag :type="jumper.row.status | statusFilter">{{ optionState[jumper.row.status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="名称">
        <template slot-scope="jumper">
          <span>{{ jumper.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="信息">
        <template slot-scope="jumper">
          <span>{{ jumper.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="jumper">
          <el-button type="primary" size="medium" @click="handleStatus(jumper.row)" :disabled="btnStatus">刷新</el-button>
          <el-button type="warning" size="medium" @click="handleUpdate(jumper.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger"  size="medium" @click="handleDelete(jumper.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogJumperVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="jumperForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="连接地址" prop="connect_ip">
          <el-input v-model="temp.connect_ip"></el-input>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-input v-model="temp.sshport"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>

        <el-form-item label="信息" prop="info">
          <el-input type="textarea" v-model="temp.info"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogJumperVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_JumperListByPage,create_Jumper,update_Jumper,delete_Jumper,status_Jumper } from '@/api/auth'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        btnStatus:false,
        dialogJumperVisible: false,
        dialogStatus:'',
        temp: {
          id: '',
          connect_ip: '',
          sshport: '',
          name: '',
          info: ''
        },
        pagination: {
          page: 1,
          count: 0
        },
        optionState: [
          {
            value: 0,
            label: '不可达'
          }, {
            value: 1,
            label: '正常'
          }],
        textMap:{
          update: '编辑跳板机',
          create: '新建跳板机',
          delete: '删除跳板机'
        },
        rules: {
          connect_ip: [
            { required: true, message: '连接IP是您操作跳板机的重要信息', trigger: 'change' },
            { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, message: '您输入的IP地址有误',trigger:'blur'}
          ],
          sshport: [{ required: true, message: '连接端口是您管理主机的重要信息', trigger: 'change' }]
        }
      }
    },
    created(){
      this.init()
    },
    filters:{
      statusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'success'
        }
        return statusMap[status]
      }
    },
    methods: {
      init(){
        this.listLoading = true
        fetch_JumperListByPage(this.pagination).then(response =>{
          this.pagination.count = response.data.count
          this.list = response.data.results
          this.listLoading = false
        })
      },
      resetTemp(){
        this.temp = {
          id: '',
          connect_ip: '',
          sshport: '',
          name: '',
          info: ''
        }
      },
      handleStatus(row){
        status_Jumper(row).then(()=>{
          this.$message({
            showClose: true,
            message: '刷新成功',
            type: 'success'
          })
        }).catch((error)=>{
          this.$message({
            showClose: true,
            message: '刷新失败',
            type: 'success'
          })
          console.log(error)
        })
      },
      handleCreate(row){
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogJumperVisible = true
        this.$nextTick(() => {
          this.$refs['jumperForm'].clearValidate()
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      handleUpdate(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogJumperVisible = true
        this.$nextTick(() => {
          this.$refs['jumperForm'].clearValidate()
        })
      },
      createData(){
        this.$refs['jumperForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Jumper(this.temp).then(() => {
              this.init()
              this.dialogJumperVisible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogJumperVisible = false
              console.log(error)
            })
          }
        })
      },
      updateData(){
        this.$refs['jumperForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_Jumper(this.temp).then(() => {
              this.init()
              this.dialogJumperVisible = false
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogJumperVisible = false
              console.log(error)
            })
          }
        })
      },
      handleDelete(row){
        this.temp = Object.assign({},row)
        this.btnStatus=true
        this.deleteConfirm()
        this.btnStatus=false
      },
      deleteConfirm() {
        this.$confirm('此操作将删除跳板机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Jumper(this.temp).then((response) => {
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
  .manager-jumper-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
