<template>
  <div class="manager-mission-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" @clear="clearGroup" filterable clearable style="width: 400px;">
          <el-option
            v-for="item in group_options"
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
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
        <el-col :span="7" :offset="1">
          信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据任务信息模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-switch
            style="margin-top:7px"
            v-model="search_obj.need_validate"
            active-text="需要验证"
            active-value=True
            inactive-text="不需要验证"
            inactive-value=False>
          </el-switch>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchMission" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="mission">
          <span>{{ mission.row.uuid }}</span>
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

      <el-table-column width="70px" align="center" label="次数">
        <template slot-scope="mission">
          <span>{{ mission.row.counts }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="580px" align="center" label="信息">
        <template slot-scope="mission">
          <span>{{ mission.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width" fixed="right">
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
        <el-form ref="missionForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_meta" filterable>
          <el-option
            v-for="item in group_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-transfer v-model="commit_obj.metas" :data="metas" placeholder="请选择任务内的元操作" filterable>
        </el-transfer>

        <el-input placeholder="更新vote预发布代码" v-model="commit_obj.info">
          <template slot="prepend">信息: </template>
        </el-input>

        <el-checkbox v-model="commit_obj.need_validate">是否需要管理员验证</el-checkbox>

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
        detailSearch: false,
        textMap:{
          create: '新建任务',
          update: '修改任务'
        },
        pagination: {
          page: 1,
          count: 0
        },
        commit_obj: {
        },
        search_obj: {
        },
        group_options:[],
      }
    },
    components: {
    },
    created(){
      this.init()
      this.init_group()
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
        fetch_MissionListByPage(this.pagination,this.search_obj).then(response=>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      init_group(){
        fetch_GroupList(this.search_obj).then(response=>{
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
      init_meta(value){
        fetch_MetaList({'group':value}).then(response=>{
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
      reset_commit(){
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      searchMission(){
        this.init()
      },
      changeGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init()
      },
      clearGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
        this.init_group()
      },
      handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
      },
      handleCreate(){
        this.dialogStatus = 'create'
        this.metas = []
        this.commit_obj()
        this.init_group()
        this.dialogMissionVisible = true
        this.$nextTick(() => {
          this.$refs['missionForm'].clearValidate()
        })
      },
      handleUpdate(row){
        this.commit_obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogMissionVisible = true
        this.init_group()
        this.init_meta(this.commit_obj.group)
        this.$nextTick(() => {
          this.$refs['missionForm'].clearValidate()
        })
      },
      createMission(){
        this.$refs['missionForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Mission(this.commit_obj).then(() => {
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
            update_Mission(this.commit_obj).then(() => {
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
        this.commit_obj = Object.assign({},row)
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
          delete_Mission(this.commit_obj).then((response) => {
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
