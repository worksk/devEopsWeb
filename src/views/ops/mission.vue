<template>
  <div class="manager-mission-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="mission">
          <span>{{ mission.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="是否需要验证执行">
        <template slot-scope="mission">
          <span>{{ mission.row.need_validate | NeedValidate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="应用组">
        <template slot-scope="mission">
          <span>{{ mission.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="信息">
        <template slot-scope="mission">
          <span>{{ mission.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="mission">
          <el-button type="warning" size="mini" @click="handleUpdate(mission.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(mission.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMissionVisible" width="60%" top="20vh">
        <el-form ref="missionForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-select v-model="temp.group" placeholder="请选择" @change="fetch_Meta" filterable>
          <el-option
            v-for="item in group_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-transfer v-model="temp.metas" :data="metas" placeholder="请选择任务内的元操作" filterable>
        </el-transfer>

        <el-input placeholder="更新vote预发布代码" v-model="temp.info">
          <template slot="prepend">信息: </template>
        </el-input>

        <el-checkbox v-model="temp.need_validate">是否需要管理员验证</el-checkbox>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMissionVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createMission" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateMission" :disabled="btnStatus">提交</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import { fetch_MissionListByPage,create_Mission,update_Mission,delete_Mission,fetch_MetaList } from '@/api/ops';
  import { fetch_GroupList } from '@/api/manager';
  export default {
    data(){
      return{
        list: null,
        listLoading: true,
        btnStatus: false,
        dialogStatus:'',
        dialogMissionVisible: false,
        metas:[],
        textMap:{
          create: '新建任务',
          update: '修改任务'
        },
        pagination: {
          page: 1,
          count: 0
        },
        temp: {
          group: null,
          metas:[],
          info: "",
          need_validate: true,
        },
        group_options:[],
      }
    },
    components: {
    },
    created(){
      this.init()
    },
    filters:{
      NeedValidate(value){
        if(value){
          return '需要'
        }else{
          return '不需要'
        }
      }
    },
    methods:{
      init(){
        this.listLoading = true
        fetch_MissionListByPage(this.pagination).then(response=>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      resetTemp(){
        this.temp = {
          group: null,
          metas:[],
          info: "",
          need_validate: true
        }
      },
      handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
      },
      handleCreate(){
        this.dialogStatus = 'create'
        this.metas = []
        this.resetTemp()
        this.fetch_Group()
        this.dialogMissionVisible = true
        this.$nextTick(() => {
          this.$refs['missionForm'].clearValidate()
        })
      },
      handleUpdate(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogMissionVisible = true
        this.fetch_Group()
        this.fetch_Meta(this.temp.group)
        this.$nextTick(() => {
          this.$refs['missionForm'].clearValidate()
        })
      },
      fetch_Group(){
        fetch_GroupList().then(response=>{
          this.group_options = []
          for (const group of response.data){
            this.group_options.push({
              value: group.id,
              label: group.name,
              disabled: false
            })
          }
        })
      },
      fetch_Meta(value){
        console.log(value)
        // this.temp.metas = []
        fetch_MetaList(value).then(response=>{
          this.metas = []
          for (const meta of response.data){
            this.metas.push({
              key: meta.id,
              label: meta.info,
              disabled: false
            })
          }
        })
      },
      createMission(){
        this.$refs['missionForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Mission(this.temp).then(() => {
              this.init()
              this.dialogMissionVisible = false
              this.$message({
                showClose: true,
                message: '创建任务成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogMissionVisible = false
            })
          }
        })
      },
      updateMission(){
        this.$refs['missionForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            console.log(this.temp.need_validate)
            update_Mission(this.temp).then(() => {
              this.init()
              this.dialogMissionVisible = false
              this.$message({
                showClose: true,
                message: '更新任务成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogMissionVisible = false
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
        this.$confirm('此操作将删除任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Mission(this.temp).then((response) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-mission-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
