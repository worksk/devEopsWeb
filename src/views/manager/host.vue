<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="host">
          <span>{{ host.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="UUID">
        <template slot-scope="host">
          <span>{{ host.row.detail| uuidFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="主机名">
        <template slot-scope="host">
          <span>{{ host.row.hostname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="操作系统">
        <template slot-scope="host">
          <span>{{ systype[host.row.detail.systemtype] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="环境">
        <template slot-scope="host">
          <span>{{ postype[host.row.detail.position] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="连接IP">
        <template slot-scope="host">
          <span>{{ host.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="115" align="center" label="状态" class-name="status-col" >
        <template slot-scope="host">
          <el-tag :type="host.row._status | statusFilter">{{ optionState[host.row._status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="业务IP">
        <template slot-scope="host">
          <span>{{ host.row.service_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="370" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="host">
          <el-button type="primary" size="mini" @click="handleCopy(host.row)" :disabled="btnStatus">密码</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(host.row)" :disabled="btnStatus">详细</el-button>
          <el-button type="warning" size="mini" @click="handleGroup(host.row)" :disabled="btnStatus">应用组</el-button>
          <el-button type="warning" size="mini" @click="handleUpdate(host.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(host.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPasswdVisible" width="20%" top="20vh">
      <span>我是想加一点验证码验证的 你懂吧</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="document" v-clipboard:copy='temp_passwd' v-clipboard:success='clipboardSuccess' @click="dialogPasswdVisible = false">copy</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetailVisible" width="40%" top="2vh">
        <template v-for="detail in details">
          <el-tag hit="true">{{ detail }}</el-tag>
        </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" :disabled="btnStatus">取消</el-button>
      </div>

    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">
      <el-form ref="groupForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="所属权限组" prop="pmn_groups">
          <el-transfer v-model="temp.groups" :data="groups" placeholder="请选择所属应用组" filterable>
          </el-transfer>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="updateGroups" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="主机信息" prop="detail.info">
          <el-tooltip content="请输入该主机涉及的服务内容" placement="bottom" effect="light">
            <el-input type="textarea" v-model="temp.detail.info"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接IP" prop="connect_ip">
          <el-tooltip content="请输入管理该机器的IP地址" placement="bottom" effect="light">
            <el-input v-model="temp.connect_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-tooltip content="请输入管理该机器通过的SSH端口" placement="bottom" effect="light">
            <el-input v-model="temp.sshport"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="服务IP" prop="service_ip">
          <el-tooltip content="请输入该机器对外提供服务的IP地址" placement="bottom" effect="light">
            <el-input v-model="temp.service_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="密码" prop="passwd">
          <el-tooltip content="请输入记录的密码" placement="bottom" effect="light">
            <el-input type="password" v-model="temp.passwd"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="状态" prop="_status">
          <el-tooltip content="请输入该机器目前的状态" placement="top" effect="light">
            <el-select v-model="temp._status" placeholder="请选择主机状态">
              <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="阿里云ID" prop="detail.aliyun_id">
          <el-tooltip content="请输入阿里云UUID" placement="bottom" effect="light">
            <el-input v-model="temp.detail.aliyun_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="VMwareID" prop="detail.vmware_id">
          <el-tooltip content="请输入VMware-UUID" placement="bottom" effect="light">
            <el-input v-model="temp.detail.vmware_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="主机名" prop="hostname">
          <el-tooltip content="请输入该机器主机名" placement="top" effect="light">
            <el-input v-model="temp.hostname"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="位置" prop="detail.position">
          <el-tooltip content="请输入该主机目前在什么位置" placement="top" effect="light">
            <el-select v-model="temp.detail.position" placeholder="请选择主机位置">
              <el-option v-for="option in position" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-tooltip>
          <el-button @click="handleposition" :disabled="btnStatus">新增位置类型</el-button>
        </el-form-item>

        <el-form-item label="系统类型" prop="detail.systemtype">
          <el-tooltip content="请输入该主机的操作系统" placement="top" effect="light">
            <el-select v-model="temp.detail.systemtype" placeholder="操作系统">
              <el-option v-for="option in systemtype" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-tooltip>
          <el-button @click="handlesystype" :disabled="btnStatus">新增系统类型</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>

      <el-dialog
        width="30%"
        title="新增系统类型"
        :visible.sync="dialogSystypeVisible"
        append-to-body>
        <el-form ref="systypeForm" :model="systype_item" label-position="left" label-width="100px">
          <el-autocomplete
            class="inline-input"
            v-model="systype_item"
            :fetch-suggestions="querySystypeSearch"
            placeholder="请输入内容"
            value-key="name"
          ></el-autocomplete>
          <el-button type="primary" @click="updateSystypeData" :disabled="btnStatus">提交</el-button>
          <el-button @click="dialogSystypeVisible = false" :disabled="btnStatus">取消</el-button>
        </el-form>
      </el-dialog>

      <el-dialog
        width="30%"
        title="新增位置类型"
        :visible.sync="dialogPositionVisible"
        append-to-body>
        <el-form ref="positionForm" :model="position_item" label-position="left" label-width="100px">
          <el-autocomplete
            class="inline-input"
            v-model="position_item"
            :fetch-suggestions="queryPositionSearch"
            placeholder="请输入内容"
            value-key="name"
          ></el-autocomplete>
          <el-button type="primary" @click="updatePositionData" :disabled="btnStatus">提交</el-button>
          <el-button @click="dialogPositionVisible = false" :disabled="btnStatus">取消</el-button>
        </el-form>
      </el-dialog>

    </el-dialog>

  </div>
</template>

<script>
  import { fetch_HostListByPage,fetch_PositionList,fetch_SystypeList,delete_Host,create_Host,update_Host,create_Systype,create_Position,fetch_HostPasswd,detail_Host } from '@/api/manager';
  import { fetch_GroupList } from "@/api/manager";

  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDetailVisible: false,
          dialogFormVisible: false,
          dialogSystypeVisible: false,
          dialogPositionVisible: false,
          dialogPasswdVisible: false,
          dialogGroupVisible: false,
          systemtype: [],
          position: [],
          temp_passwd: '',
          systype_item: '',
          position_item: '',
          systype: [],
          postype: [],
          groups: [],
          details: [],
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            detail: '主机详情',
            update: '编辑主机',
            create: '新建主机',
            passwd: '粘贴密码',
            group: '修改应用组'
          },
          dialogStatus:'',
          temp: {
            detail:{
            }
          },
          optionState: [
            {
              value: 0,
              label: '错误'
            }, {
              value: 1,
              label: '正常'
            }, {
              value: 2,
              label: '不可达'
            }],
          rules: {
            'detail.info':[{ required: true, message: '主机信息是必须的', trigger: 'change' }],
            connect_ip: [
              { required: true, message: '连接IP是您管理主机的重要信息', trigger: 'change' },
              { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, message: '您输入的IP地址有误',trigger:'blur'}
              ],
            service_ip:[{ pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, message: '您输入的IP地址有误',trigger:'blur'}],
            sshport: [{ required: true, message: '连接端口是您管理主机的重要信息', trigger: 'change' }],
            _status: [{ required: true, message:'您未填写该主机目前的状态', trigger: 'blur'}],
            'detail.position': [{ required: true, message:'请填写该主机目前所在的位置', trigger: 'blur'}],
            'detail.systemtype': [{ required: true, message:'请填写该主机的操作系统类型', trigger: 'blur'}]
          }
        }
      },
      created(){
        this.init()
        this.getList()
        this.getGroupList()
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
        uuidFilter(detail) {
          if (detail.aliyun_id){
            return detail.aliyun_id
          }else if(detail.vmware_id){
            const ary = detail.vmware_id.split('-')
            return ary[0] + '-' + ary[1] + '-'+ ary[2]
          }else{
            return 'None'
          }
        }
      },
      methods:{
        init(){
          fetch_PositionList().then(response=>{
            this.postype = []
            for (const pos of response.data){
              this.postype[pos.id] = pos.name
            }
            this.position = response.data
          })
          fetch_SystypeList().then(response=>{
            this.systype = []
            for (const sys of response.data){
              this.systype[sys.id] = sys.name
            }
            this.systemtype = response.data
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.getList()
        },
        getGroupList(){
          fetch_GroupList().then(response => {
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
        getList(){
          this.list = null
          this.listLoading = true
          fetch_HostListByPage(this.pagination).then(response =>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        resetTemp(){
          this.temp={
            detail:{
              position:'',
              systemtype:''
            },
            groups:[]
          }
        },
        deleteConfirm() {
          this.$confirm('此操作将删除主机, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            delete_Host(this.temp).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
              this.getList()
            })
          })
        },
        filterDetail(data){
          const list=[]
          if(data.type=='aliyun'){
            list.push('地区 : ' + data.RegionId)
            list.push('过期时间 : ' + data.ExpiredTime)
            list.push('私网地址 : ' + data.VpcAttributes.PrivateIpAddress.IpAddress[0])
            list.push('实例名称 : ' + data.InstanceName)
            list.push('CPU核数 : ' + data.Cpu)
            list.push('内存大小MB : ' + data.Memory)
            list.push('带宽大小 : ' + data.InternetMaxBandwidthIn)
          }else{
            list.push('使用内存MB : ' + data.privateMemory +'/'+ data.memoryMB)
            list.push('电源状态 : ' + data.powerState)
            list.push('CPU核数 : ' + data.numCpu)
            list.push('CPU使用 : ' + data.overallCpuUsage +'MHz')
            list.push('私网地址 : ' + data.ipAddress)
            list.push('存储使用B : ' + data.committed)
          }
          return list
        },
        handleDetail(row){
          this.temp = Object.assign({},row)
          this.dialogStatus = 'detail'
          detail_Host(row.id).then((response) =>{
            this.details = this.filterDetail(response.data)
            this.dialogDetailVisible = true
          }).catch((error) => {
            this.$message({
              type: 'error',
              message: '获取详细信息失败!'
            })
            console.log(error)
            this.dialogDetailVisible = false
          })
        },
        handleCreate(row){
          this.resetTemp()
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleGroup(row) {
          this.temp = Object.assign({}, row) // copy obj
          this.dialogStatus = 'group'
          this.dialogGroupVisible = true
          this.$nextTick(() =>{
            this.$refs['groupForm'].clearValidate()
          })
        },
        handleUpdate(row){
          this.temp = Object.assign({}, row) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleCopy(row){
          fetch_HostPasswd(row.id).then((response) => {
            this.dialogStatus = 'passwd'
            this.temp_passwd = response.data[0].passwd
            this.dialogPasswdVisible = true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '粘贴失败!'
            })
          })
        },
        clipboardSuccess() {
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1500
          })
        },
        handleDelete(row){
          this.temp = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        },
        updateGroups(row){
          this.$refs['groupForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_Host(this.temp).then(() => {
                this.dialogGroupVisible = false
                this.getList()
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.dialogGroupVisible = false
                this.btnStatus=false
                console.log(error)
              })
            }
          })
        },
        createData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_Host(this.temp).then(() => {
                // this.list.unshift(this.temp)
                this.getList()
                this.init()
                this.dialogFormVisible = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogFormVisible = false
                console.log(error)
              })
            }
          })
        },
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_Host(this.temp).then(() => {
                this.getList()
                this.init()
                this.dialogFormVisible = false
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogFormVisible = false
                console.log(error)
              })
            }
          })
        },
        updateSystypeData(){
          this.$refs['systypeForm'].validate((valid) =>{
            if(valid){
              this.btnStatus=true
              create_Systype({'name':this.systype_item}).then(()=>{
                this.init()
                this.dialogSystypeVisible = false
                this.$message({
                  showClose: true,
                  message: '新添系统类型',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.dialogSystypeVisible = false
                this.btnStatus=false
                console.log(error)
              })
            }
          })
        },
        updatePositionData(){
          this.$refs['positionForm'].validate((valid) =>{
            if(valid){
              this.btnStatus=true
              create_Position({'name':this.position_item}).then(()=>{
                this.init()
                this.dialogPositionVisible = false
                this.$message({
                  showClose: true,
                  message: '新添位置类型',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.dialogPositionVisible = false
                this.btnStatus=false
                console.log(error)
              })
            }
          })
        },
        handleposition(){
          this.dialogPositionVisible = true
          this.systype_item=''
        },
        handlesystype(){
          this.dialogSystypeVisible = true
          this.position_item=''
        },
        createSystypeFilter(queryString) {
          return (systemtype) => {
            return (systemtype.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        createPositionFilter(queryString) {
          return (position) => {
            return (position.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        queryPositionSearch(queryString,cb) {
          const restaurants = this.position
          const results = queryString ? restaurants.filter(this.createPositionFilter(queryString)) : restaurants
          // 调用 callback 返回建议列表的数据
          cb(results)
        },
        querySystypeSearch(queryString, cb) {
          const restaurants = this.systemtype
          const results = queryString ? restaurants.filter(this.createSystypeFilter(queryString)) : restaurants
          // 调用 callback 返回建议列表的数据
          cb(results)
        }
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
