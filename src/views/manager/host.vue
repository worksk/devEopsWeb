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
          <span>{{ host.row.uuid| uuidFilter }}</span>
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

      <el-table-column width="140px" align="center" label="连接IP">
        <template slot-scope="host">
          <span>{{ host.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="业务IP">
        <template slot-scope="host">
          <span>{{ host.row.service_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态" class-name="status-col" >
        <template slot-scope="host">
          <el-tag :type="host.row.status | statusFilter">{{ optionState[host.row.status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="host">
          <el-button type="primary" size="mini" @click="handleDetail(host.row)" :disabled="btnStatus">详细</el-button>
          <el-button type="warning" size="mini" @click="handleUpdate(host.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(host.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetailVisible" width="60%" top="2vh">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="2vh">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="主机UUID" prop="uuid">
          <el-input v-model="temp.uuid" disabled></el-input>
        </el-form-item>

        <el-form-item label="主机信息" prop="info">
          <el-tooltip content="请输入该主机设计的服务内容" placement="bottom" effect="light">
            <el-input v-model="temp.info"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接IP" prop="connect_ip">
          <el-tooltip content="请输入管理该机器的IP地址" placement="bottom" effect="light">
            <el-input type="textarea" v-model="temp.connect_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-tooltip content="请输入管理该机器通过的SSH端口" placement="bottom" effect="light">
            <el-input type="textarea" v-model="temp.sshport"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="服务IP" prop="service_ip">
          <el-tooltip content="请输入该机器对外提供服务的IP地址" placement="bottom" effect="light">
            <el-input type="textarea" v-model="temp.service_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-tooltip content="请输入该机器目前的状态" placement="top" effect="light">
            <el-select v-model="temp.status" placeholder="请选择主机状态">
              <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="位置" prop="detail.position">
          <el-tooltip content="请输入该主机目前在什么位置" placement="top" effect="light">
            <el-select v-model="temp.detail.position" placeholder="请选择主机位置">
              <el-option v-for="option in position" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="系统类型" prop="detail.systemtype">
          <el-tooltip content="请输入该主机的操作系统" placement="top" effect="light">
            <el-select v-model="temp.detail.systemtype" placeholder="操作系统">
              <el-option v-for="option in systemtype" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_HostList,fetch_PositionList,fetch_SystypeList,delete_Host } from '@/api/manager'
    export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus:false,
          dialogDetailVisible:false,
          dialogFormVisible:false,
          systemtype:[],
          position:[],
          systype:[],
          postype:[],
          textMap:{
            detail: '主机详情',
            update: '编辑主机',
            create: '新建主机'
          },
          dialogStatus:'',
          temp: {
            detail:{
              position: 0,
              systemtype: 0
            }
          },
          optionState:[
            {
              value: 0,
              label: '错误'
            }, {
              value: 1,
              label: '正常'
            }, {
              value: 2,
              label: '不可达'
            }]
        }
      },
      created(){
        this.init()
        this.getList()
      },
      filters:{
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
        getList(){
          this.listLoading = true
          fetch_HostList(0).then(response =>{
            this.list=response.data
            this.listLoading = false
          })
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
        handleDetail(row){
          this.temp = Object.assign({},row)
          this.dialogStatus = 'detail'
          this.dialogDetailVisible = true
        },
        handleCreate(row){
          this.temp = Object.assign({}, {})
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
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
        handleDelete(row){
          this.temp = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-host-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
