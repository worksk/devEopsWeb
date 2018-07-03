<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.groups" placeholder="请选择" @change="changeGroup" @clear="clearGroup" filterable clearable style="width: 400px;">
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
        <el-button class="filter-item" @click="handleMultipleGroup()" style="margin-left: 10px;" type="primary" icon="el-icon-goods" :disabled="btnStatus">归类</el-button>
        <el-button class="filter-item" @click="handleExpired()" style="margin-left: 10px;" type="primary" icon="el-icon-time" :disabled="btnStatus">过期资源</el-button>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:5px;">
        <el-col :span="7" :offset="1">
          连接地址： <el-input size="medium" style="width: 200px;" v-model="search_obj.connect_ip" class="filter-item" placeholder="根据私网IP搜索"></el-input>
        </el-col>
        <el-col :span="7">
          主机名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.hostname" class="filter-item" placeholder="根据主机名模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          详细信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据主机用途模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHost" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
        <el-col :span="7" :offset="1">
          系统类型： <el-input size="medium" style="width: 200px;" v-model="search_obj.systype" class="filter-item" placeholder="根据操作系统类型模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          位置类型： <el-input size="medium" style="width: 200px;" v-model="search_obj.position" class="filter-item" placeholder="根据位置类型模糊搜索"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">

      <el-table-column
      type="selection"
      width="55px">
      </el-table-column>

      <el-table-column width="260px" align="center" label="Aliyun | VmWare">
        <template slot-scope="host">
          <span>{{ host.row.detail| uuidFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="主机名">
        <template slot-scope="host">
          <span>{{ host.row.hostname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="操作系统">
        <template slot-scope="host">
          <span>{{ systype[host.row.detail.systemtype] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="环境">
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

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="host">
          <el-button type="primary" size="medium" @click="handleQRCode(host.row)" :disabled="btnStatus">密码</el-button>
          <el-button type="primary" size="medium" @click="handleDetail(host.row)" :disabled="btnStatus">详细</el-button>
          <el-button type="warning" size="medium" @click="handleGroup(host.row)" :disabled="btnStatus">应用组</el-button>
          <el-button type="warning" size="medium" @click="handleUpdate(host.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(host.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogSelectHostVisible" width="20%" top="20vh">
      <el-select v-model="commit_obj.groups" placeholder="请选择" filterable clearable>
        <el-option
          v-for="item in groups"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectHostVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="selectGroup" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPasswdVisible" width="20%" top="20vh">
      <span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>
      <el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="document" 
        @click="UpdateQRCode">校验QR-Code
      </el-button>
        <el-button v-show="temp_passwd" type="primary" icon="document" v-clipboard:copy='temp_passwd' v-clipboard:success='clipboardSuccess' @click="dialogPasswdVisible = false">粘贴密码</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetailVisible" width="80%" top="2vh" :fullscreen="true">
      <div class="cpu">
        <IEcharts
          :option="monitor_obj.CPU"
          :loading="monitorLoading"
        />
      </div>
      <div class="memory">
        <IEcharts
          :option="monitor_obj.Memory"
          :loading="monitorLoading"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">
      <el-form ref="groupForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="所属权限组" prop="pmn_groups">
          <el-transfer v-model="commit_obj.groups" :data="groups" placeholder="请选择所属应用组" filterable>
          </el-transfer>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="updateGroups" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="主机信息" prop="detail.info">
          <el-tooltip content="请输入该主机涉及的服务内容" placement="bottom" effect="light">
            <el-input type="textarea" v-model="commit_obj.detail.info"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接IP" prop="connect_ip">
          <el-tooltip content="请输入管理该机器的IP地址" placement="bottom" effect="light">
            <el-input v-model="commit_obj.connect_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-tooltip content="请输入管理该机器通过的SSH端口" placement="bottom" effect="light">
            <el-input v-model="commit_obj.sshport"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="密码" prop="passwd">
          <el-tooltip content="请输入记录的密码" placement="bottom" effect="light">
            <el-input type="password" v-model="commit_obj.passwd"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="状态" prop="_status">
          <el-tooltip content="请输入该机器目前的状态" placement="top" effect="light">
            <el-select v-model="commit_obj._status" placeholder="请选择主机状态">
              <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="阿里云ID" prop="detail.aliyun_id">
          <el-tooltip content="请输入阿里云UUID" placement="bottom" effect="light">
            <el-input v-model="commit_obj.detail.aliyun_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="VMwareID" prop="detail.vmware_id">
          <el-tooltip content="请输入VMware-UUID" placement="bottom" effect="light">
            <el-input v-model="commit_obj.detail.vmware_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="主机名" prop="hostname">
          <el-tooltip content="请输入该机器主机名" placement="top" effect="light">
            <el-input v-model="commit_obj.hostname"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="位置" prop="detail.position">
          <el-tooltip content="请输入该主机目前在什么位置" placement="top" effect="light">
            <el-select v-model="commit_obj.detail.position" placeholder="请选择主机位置">
              <el-option v-for="option in position" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-tooltip>
          <el-button @click="handleposition" :disabled="btnStatus">新增位置类型</el-button>
        </el-form-item>

        <el-form-item label="系统类型" prop="detail.systemtype">
          <el-tooltip content="请输入该主机的操作系统" placement="top" effect="light">
            <el-select v-model="commit_obj.detail.systemtype" placeholder="操作系统">
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
  import IEcharts from 'vue-echarts-v3/src/lite.js';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/chart/line';
  import 'echarts/lib/component/title';
  import { fetch_HostListByPage,fetch_PositionList,fetch_SystypeList,delete_Host,create_Host,update_Host,create_Systype,create_Position,fetch_HostPasswd,detail_HostByUUID } from '@/api/manager';
  import { fetch_GroupList,selectHost_Group } from "@/api/manager";
  import { fetch_MonitorHostAliyunCPU,fetch_MonitorHostAliyunMemory } from '@/api/monitor';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          monitorLoading: true,
          btnStatus: false,
          dialogDetailVisible: false,
          dialogFormVisible: false,                                     
          dialogSystypeVisible: false,
          dialogPositionVisible: false,
          dialogPasswdVisible: false,
          dialogGroupVisible: false,
          dialogSelectHostVisible: false,
          detailSearch: false,
          systemtype: [],
          position: [],
          temp_passwd: '',
          systype_item: '',
          position_item: '',
          systype: [],
          postype: [],
          groups: [],
          details: [],
          multipleSelection: [],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            detail: '主机详情',
            update: '编辑主机',
            create: '新建主机',
            passwd: '粘贴密码',
            group: '修改应用组',
            selecthost: '批量归类主机'
          },
          dialogStatus:'',
          monitor_obj:{

          },
          search_obj:{
          },
          commit_obj: {
            detail:{
            }
          },
          optionState: [
            {
              value: -3,
              label: '关机'
            }, {
              value: -2,
              label: '暂停'
            },{
              value: 1,
              label: '正常'
            }],
          rules: {
            'detail.info':[{ required: true, message: '主机信息是必须的', trigger: 'change' }],
            connect_ip: [
              { required: true, message: '连接IP是您管理主机的重要信息', trigger: 'change' },
              { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, message: '您输入的IP地址有误',trigger:'blur'}
              ],
            sshport: [{ required: true, message: '连接端口是您管理主机的重要信息', trigger: 'change' }],
            _status: [{ required: true, message:'您未填写该主机目前的状态', trigger: 'blur'}],
            'detail.position': [{ required: true, message:'请填写该主机目前所在的位置', trigger: 'blur'}],
            'detail.systemtype': [{ required: true, message:'请填写该主机的操作系统类型', trigger: 'blur'}]
          }
        }
      },
      components: {
        IEcharts
      },
      created(){
        this.init()
      },
      filters:{
        statusFilter(_status) {
          const statusMap = {
            '-2': 'danger',
            '1': 'success',
            '-1': 'warning'
          }
          return statusMap[_status]
        },
        uuidFilter(detail) {
          if (detail.aliyun_id){
            return detail.aliyun_id
          }else if(detail.vmware_id){
            return detail.vmware_id
          }else{
            return 'None'
          }
        }
      },
      methods:{
        init(){
          this.list = null
          this.listLoading = true
          this.init_position()
          this.init_systype()
          this.init_hosts()
          this.init_groups()
        },
        init_hosts(){
          fetch_HostListByPage(this.pagination,this.search_obj).then(response =>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        init_position(){
          fetch_PositionList().then(response=>{
            this.postype = []
            for (const pos of response.data){
              this.postype[pos.id] = pos.name
            }
            this.position = response.data
          })
        },
        init_systype(){
          fetch_SystypeList().then(response=>{
            this.systype = []
            for (const sys of response.data){
              this.systype[sys.id] = sys.name
            }
            this.systemtype = response.data
          })
        },
        init_groups(){
          fetch_GroupList().then(response => {
            this.groups = []
            for (const group of response.data){
              this.groups.push({
                value: group.id,
                key: group.id,
                // value: group.uuid,
                // key: group.uuid,
                label: group.name,
                disabled: false
              })
            }
          })
        },
        init_detail_aliyun(obj){
          fetch_MonitorHostAliyunCPU(obj.uuid).then((response)=>{
            this.monitor_obj.CPU = response.data
            if(this.monitor_obj.CPU != null & this.monitor_obj.Memory != null){
              this.dialogDetailVisible = true
              this.monitorLoading = false
            }
          })
          fetch_MonitorHostAliyunMemory(obj.uuid).then((response)=>{
            this.monitor_obj.Memory = response.data
            if(this.monitor_obj.CPU != null & this.monitor_obj.Memory != null){
              this.dialogDetailVisible = true
              this.monitorLoading = false
            }
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init_hosts()
        },
        reset_commit(){
          this.commit_obj={
            detail:{
            }
          }
        },
        reset_search(){
          this.search_obj={

          }
        },
        changeGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init_hosts()
        },
        clearGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init_hosts()
        },
        searchHost(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init_hosts()
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        deleteConfirm() {
          this.$confirm('此操作将删除主机, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            delete_Host(this.commit_obj).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
            })
          })
        },
        handleDetail(row){
          this.dialogStatus = 'detail'
          this.init_detail_aliyun(row)
        },
        handleCreate(row){
          this.reset_commit()
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        resetSearch(){
          this.reset_search()
          this.init_hosts()
        },
        handleMultipleGroup(){
          if(this.multipleSelection.length == 0){
            this.$message({
              type: 'error',
              message: '您未选择任何归类主机'
            })
            return 
          }
          this.reset_commit()
          this.dialogSelectHostVisible = true
          this.dialogStatus = 'selecthost'
        },
        selectGroup(){
          let list = []
          for (const select of this.multipleSelection){
            list.push(select.id)
          }
          selectHost_Group(this.commit_obj,{'hosts':list}).then((response)=>{
            this.$message({
              showClose: true,
              message: '归类成功',
              type: 'success'
            })
            this.init_hosts()
          }).catch((error)=>{
            this.$message({
              showClose: true,
              message: '归类失败',
              type: 'danger'
            })
          })
          this.dialogSelectHostVisible = false
        },
        handleGroup(row) {
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'group'
          this.dialogGroupVisible = true
          this.$nextTick(() =>{
            this.$refs['groupForm'].clearValidate()
          })
        },
        handleUpdate(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleQRCode(row){
          this.dialogStatus = 'passwd'
          this.dialogPasswdVisible = true
          this.commit_obj.uuid = row.uuid
        },
        UpdateQRCode(){
          fetch_HostPasswd(this.commit_obj).then((response) => {
            this.$message({
              message: '校验成功',
              type: 'success',
              duration: 1500
            })
            this.temp_passwd = response.data[0].passwd
          })
        },
        clipboardSuccess() {
          this.reset_commit()
          this.temp_passwd=''
          this.dialogPasswdVisible = false
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1500
          })
        },
        handleDelete(row){
          this.commit_obj = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        },
        updateGroups(row){
          this.$refs['groupForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_Host(this.commit_obj).then(() => {
                this.dialogGroupVisible = false
                this.init()
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.dialogGroupVisible = false
                this.btnStatus=false
              })
            }
          })
        },
        createData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_Host(this.commit_obj).then(() => {
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
              })
            }
          })
        },
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_Host(this.commit_obj).then(() => {
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
              })
            }
          })
        },
        handleExpired(){
            this.$router.push({path:'/manager/expired'})
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
          cb(results)
        },
        querySystypeSearch(queryString, cb) {
          const restaurants = this.systemtype
          const results = queryString ? restaurants.filter(this.createSystypeFilter(queryString)) : restaurants
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
  .cpu {
    width: 700px;
    height: 400px;
  }
  .memory {
    width: 700px;
    height: 400px;
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
