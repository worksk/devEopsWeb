<template>
  <div class="manager-mission-container">
    <div class="filter-container">
      <el-date-picker
        v-model="select_time"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件" disabled>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" disabled>搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <!-- <el-table-column width="60px" align="center" label="ID">
        <template slot-scope="work">
          <span>{{ work.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="180px" align="center" label="UUID">
        <template slot-scope="work">
          <span>{{ work.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="关联任务内容">
        <template slot-scope="work">
          <span>{{ work.row.mission_info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="提交用户">
        <template slot-scope="work">
          <span>{{ work.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="280px" align="center" label="工单信息">
        <template slot-scope="work">
          <span>{{ work.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="work">
          <span>{{ work.row.create_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="完成时间">
        <template slot-scope="work">
          <span>{{ work.row.finish_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="work">
          <el-button size="mini" v-if="work.row.status==2" type="danger" @click="handleRun(work.row)" :disabled="btnStatus">执行</el-button>
          <el-button size="mini" v-else-if="work.row.status==4" type="warning" disabled>执行中</el-button>
          <el-button size="mini" v-else-if="work.row.status==3" type="primary" disabled>执行完毕</el-button>
          <el-button size="mini" v-else-if="work.row.status==1" type="primary" @click="uploadWork(work.row)" :disabled="btnStatus">上传文件</el-button>
          <el-button size="mini" v-else-if="work.row.status==0" type="warning" @click="checkWork(work.row)" :disabled="btnStatus">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogWorkVisible" width="60%" top="20vh">
      <el-form ref="workForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-select v-model="temp.mission" placeholder="请选择执行的任务" filterable>
              <el-option v-for="option in optionMission" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input placeholder="重大BUG发版" v-model="temp.info" label="123">
              <template slot="prepend">执行原因: </template>
            </el-input>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWorkVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createWork" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="70%"
      title="执行任务"
      :visible.sync="dialogXtermVisible"
      :before-close="handleClose">
      <xterm :work_uuid="work_uuid"></xterm>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="closeXterm" :disabled="btnStatus">关闭</el-button>
      </div> -->
    </el-dialog>

  </div>
</template>

<script>
    import { fetch_MissionListByUser } from '@/api/ops';
    import { fetch_WorkListByPage,create_Work,check_Work,run_Work } from '@/api/work';
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
          select_time: '',
          work_uuid: null,
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
      filters: {
        timeFilter(last_login){
          console.log(last_login)
          if(last_login){
            const date = last_login.split('T')
            const time = date[1].split('.')
            return date[0]+' '+time[0]
          }else{
            return ''
          }
        }
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
        checkWork(row){
          check_Work(row.uuid).then((response)=>{
            this.init()
          })
        },
        handleRun(row){
          run_Work(row.uuid).then((response)=>{
            this.$confirm('此操作将执行该并对业务系统造成影响, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              this.work_uuid = row.uuid
              this.dialogXtermVisible = true
            }).catch(()=>{
              this.meta_id = null
              this.dialogXtermVisible = false
            })
          })
        },
        closeXterm(){ 
          this.dialogXtermVisible = false
          this.init()
        },
        handleClose(done) {
        this.$confirm('您确定的工单已经执行完毕了吗？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
