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
        <template slot-scope="work">
          <span>{{ work.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="UUID">
        <template slot-scope="work">
          <span>{{ work.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="应用组">
        <template slot-scope="work">
          <span>{{ work.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="信息">
        <template slot-scope="work">
          <span>{{ work.row.mission_info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="370" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="work">
          <el-button size="mini" v-if="work.row.status==2" type="danger" @click="handleRun(work.row)" :disabled="btnStatus">执行</el-button>
          <el-button size="mini" v-else-if="work.row.status==3" type="primary" disabled>执行完毕</el-button>
          <el-button size="mini" v-else-if="work.row.status==1" type="primary" @click="uploadWork(work.row)" :disabled="btnStatus">上传文件</el-button>
          <el-button size="mini" v-else-if="work.row.status==0" type="warning" @click="examWork(work.row)" :disabled="btnStatus">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogWorkVisible" width="50%" top="20vh">
      <el-form ref="workForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        
        <el-select v-model="temp.mission" placeholder="请选择执行的任务" filterable>
          <el-option v-for="option in optionMission" :key="option.label" :label="option.label" :value="option.value"></el-option>
        </el-select>

        <el-input placeholder="重大BUG发版" v-model="temp.info">
          <template slot="prepend">执行原因: </template>
        </el-input>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWorkVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createWork" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="70%"
      title="执行任务"
      :visible.sync="dialogXtermVisible">
      <xterm :work_id="work_id"></xterm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogXtermVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import { fetch_MissionListByUser } from '@/api/ops';
    import { fetch_WorkListByPage,create_Work,status_Work } from '@/api/work';
    import Xterm from '@/components/Xterm/index';
    export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogStatus:'',
          dialogWorkVisible: false,
          dialogXtermVisible: false,
          mission_item: null,
          work_id: null,
          textMap:{
            create: '新建工单',
            update: '修改工单'
          },
          pagination: {
            page: 1,
            count: 0
          },
          temp: {
          },
          optionMission: []
        }
      },
      components: {
        Xterm
      },
      created(){
        this.init()
      },
      methods: {
        init(){
          this.list = null
          this.listLoading = true
          fetch_WorkListByPage(this.pagination).then(response =>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        fetch_Mission(){
          this.optionMission = []
          fetch_MissionListByUser().then(response=>{
            for (const mission of response.data){
              this.optionMission.push({
                value: mission.id,
                label: mission.info,
                disabled: false
              })
            }       
          })
        },
        handleCreate(){
          this.dialogStatus = 'create'
          this.dialogWorkVisible = true
          this.fetch_Mission()
        },
        createWork(){
          this.$refs['workForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_Work(this.temp).then(() => {
                this.init()
                this.dialogWorkVisible = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogWorkVisible = false
                console.log(error)
              })
            }
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
        },
        examWork(row){
          status_Work(row.id).then((response)=>{
            this.init()
          })
        },
        handleRun(row){
          this.$confirm('此操作将执行该并对业务系统造成影响, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.work_id = row.id
            this.dialogXtermVisible = true
          }).catch(()=>{
            this.meta_id = null
            this.dialogXtermVisible = false
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
