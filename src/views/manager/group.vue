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

      <el-table-column width="200px" align="center" label="应用系统名称">
        <template slot-scope="group">
          <span>{{ group.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态" class-name="status-col" >
        <template slot-scope="group">
          <el-tag :type="group.row._status | statusFilter">{{ optionState[group.row._status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="360px" align="center" label="应用系统信息">
        <template slot-scope="group">
          <span>{{ group.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="337" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="group">
          <el-button type="primary" @click="handleImage(group.row)" size="mini" :disabled="btnStatus">架构图</el-button>
          <el-button type="warning" @click="handleUpdate(group.row)" size="mini" :disabled="btnStatus">编辑</el-button>
          <el-button type="warning" @click="handlePermission(group.row)" size="mini" :disabled="btnStatus">权限组</el-button>
          <el-button type="danger" @click="handleDelete(group.row)" size="mini" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="应用组UUID" prop="id">
          <el-input v-model="temp.uuid" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用组名称" prop="name">
          <el-tooltip content="请输入您的业务系统名称，如:[预发布]新媒体云服务平台" placement="top" effect="light">
            <el-input v-model="temp.name"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="应用组信息" prop="info">
          <el-tooltip content="请简要描述您业务系统的作用和所属" placement="top" effect="light">
            <el-input type="textarea" v-model="temp.info"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="状态" prop="_status">
          <el-select v-model="temp._status" placeholder="请选择应用组状态">
            <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理用户" prop="users">
            <el-transfer v-model="temp.users" :data="users" placeholder="请选择管理用户" filterable>
            </el-transfer>
        </el-form-item>
        <el-form-item label="添加密钥对" prop="key">
          <el-select v-model="temp.key" placeholder="请选择密钥对">
            <el-option v-for="key in this.keys" :key="key.label" :label="key.label" :value="key.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加跳板机" prop="key">
          <el-select v-model="temp.jumper" placeholder="请选择密钥对">
            <el-option v-for="jumper in this.jumpers" :key="jumper.label" :label="jumper.label" :value="jumper.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="修改架构图片" prop="framework">
          <el-upload
            action="string"
            :http-request="uploadFramework"
            :limit="5"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible" width="60%" top="2vh">
      <el-form ref="permissionForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="所属权限组" prop="pmn_groups">
          <el-transfer v-model="temp.pmn_groups" :data="pmn_groups" placeholder="请选择所属用户组" filterable>
          </el-transfer>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="updatePermission" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogImgVisible" width="80%" top="2vh">
      <img :src="temp._framework" style="width:100%;height:100%;">
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_GroupListByPage,update_Group,delete_Group,create_Group,framework_Group } from '@/api/manager'
  import { fetch_OpsUserList,fetch_PmnGroupList,fetch_KeyList,fetch_JumperList } from '@/api/auth'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogImgVisible: false,
        dialogPermissionVisible:false,
        dialogKeyVisible:false,
        dialogStatus: '',
        btnStatus: false,
        keys: [],
        jumpers: [],
        pmn_groups:[],
        users:[],
        pagination: {
          page: 1,
          count: 0
        },
        // header:{'authorization':'JWT '+this.$store.getters.token},
        textMap: {
          update: '编辑应用组',
          create: '新建应用组',
          img: '应用组架构图',
          permission: '权限组修改',
          key: '选择密钥对'
        },
        temp: {
          name: '',
          _status: 0,
          info: '',
          users: [],
          _framework: '',
          pmn_groups: []
        },
        rules: {
          name: [{ required: true, message: '应用组名称是必填的', trigger: 'change' }],
          info: [{ required: true, message: '应用组信息是必填的', trigger: 'change' }],
          _status: [{ required: true, message: '应用组状态是必填的', trigger: 'change' }]
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
          }, {
            value: 3,
            label: '不可达'
          }]
      }
    },
    created(){
      this.getList()
    },
    filters: {
      statusFilter(_status) {
        const statusMap = {
          0: 'danger',
          1: 'success',
          2: 'warning',
          3: 'info'
        }
        return statusMap[_status]
      },
      uuidFilter(uuid) {
        const ary = uuid.split('-')
        return ary[0] + '-' + ary[1] + '-'+ ary[2]
      }
    },
    methods:{
      uploadFramework(item){
        const formData=new FormData()
        formData.append('_framework',item.file)
        console.log('上传的文件名称',item.file.name)
        console.log('更新的组ID',this.temp.id)
        framework_Group(this.temp.id,formData).then(response=>{
          console.log('上传完文件后返回的文件新的URI',response)
          this.temp._framework = response.data._framework
        }).catch((error)=>{
          this.temp._framework = ''
        })
      },
      resetTemp(){
        this.temp = {
          name: '',
          _status: 0,
          info: '',
          users: [],
          _framework: '',
          pmn_groups: []
        }
      },
      getJumperList(){
        fetch_JumperList().then(response=>{
          this.jumpers = []
          for (const jumper of response.data){
            this.jumpers.push({
              value: jumper.id,
              label: jumper.name
            })
          }
        })
      },
      getKeyList(){
        fetch_KeyList().then(response=>{
          this.keys = []
          for (const key of response.data){
            this.keys.push({
              value: key.id,
              label: key.name
            })
          }
        })
      },
      getList(){
        this.listLoading = true
        fetch_GroupListByPage(this.pagination).then(response =>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.getList()
      },
      getUserList(){
        fetch_OpsUserList().then(response=>{
          this.users = []
          for (const user of response.data){
            this.users.push({
              key: user.id,
              label: user.full_name,
              disabled: false
            })
          }
        })
      },
      getPermissionList(){
        fetch_PmnGroupList().then(response => {
          this.pmn_groups = []
          for (const pmn of response.data){
            this.pmn_groups.push({
              key: pmn.id,
              label: pmn.name,
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
        this.getKeyList()
        this.getJumperList()
        this.getPermissionList()
        this.getUserList()
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handlePermission(row){
        this.getPermissionList()
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'permission'
        this.dialogPermissionVisible = true
        this.$nextTick(() =>{
          this.$refs['permissionForm'].clearValidate()
        })
      },
      updatePermission(){
        this.$refs['permissionForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_Group(this.temp).then(() => {
              this.dialogPermissionVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.dialogPermissionVisible = false
              this.btnStatus=false
            })
          }
        })

      },
      handleCreate(){
        this.getPermissionList()
        this.getUserList()
        this.getKeyList()
        this.getJumperList()
        this.resetTemp()
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
              this.dialogFormVisible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.getList()
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogFormVisible = false
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
              this.dialogFormVisible = false
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
