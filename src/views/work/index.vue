<template>
  <div class="manager-mission-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-date-picker
          v-model="select_time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectTime">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchCodeWork" :disabled="btnStatus">搜索</el-button>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-switch
          v-model="detailSearch"
          inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
        <el-row v-show="detailSearch" style="margin-bottom:5px;">
        <el-col :span="7" :offset="1">
          工单信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据工单信息模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          用户信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.user" class="filter-item" placeholder="根据用户信息模糊搜索"></el-input>
        </el-col>
      </el-row>
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
          <el-button size="mini" v-else-if="work.row.status==1" type="warning" @click="handleUploadWork(work.row)" :disabled="btnStatus">上传文件</el-button>
          <el-button size="mini" v-else-if="work.row.status==0" type="warning" @click="checkWork(work.row)" :disabled="btnStatus">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogWorkVisible" width="60%" top="20vh">
      <el-form ref="workForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-select v-model="commit_obj.mission" placeholder="请选择执行的任务" filterable>
              <el-option v-for="option in optionMission" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input placeholder="重大BUG发版" v-model="commit_obj.info" label="123">
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


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUploadVisible" width="60%" top="20vh">
      <el-table :data="upload_tb" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="200px" align="center" label="上传文件名">
        <template slot-scope="file">
          <span>{{ file.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="500px" align="center" label="UUID">
        <template slot-scope="file">
          <span>{{ file.row.uuid}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="上传">
        <template slot-scope="file">
          <el-button size="small" type="primary" @click="hanldUploadFile(file.row.name)">点击上传</el-button>
        </template>
      </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="uploadWork()" :disabled="btnStatus">提交</el-button>
      </div>

        <el-dialog
          width="20%"
          :title="temp_filename"
          :visible.sync="dialogFileVisible"
          append-to-body>
            <el-upload
              ref="uploadele"
              action="string"
              :limit="1"
              :http-request="httpFileUpload"
              class="upload-demo">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请根据文件名上传工单所需要文件</div>
            </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFileVisible = false" :disabled="btnStatus">关闭</el-button>
          </div>
        </el-dialog>

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
    import { fetch_WorkListByPage,create_Work,check_Work,run_Work,upload_Work } from '@/api/work';
    import { create_File } from '@/api/utils';
    import Xterm from '@/components/Xterm/index';
    export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogStatus:'',
          dialogUploadVisible: false,
          dialogWorkVisible: false,
          dialogXtermVisible: false,
          dialogFileVisible: false,
          upload_tb: [],
          temp_filename: null,
          mission_item: null,
          select_time: '',
          work_uuid: null,
          detailSearch: false,
          textMap:{
            create: '新建工单',
            update: '修改工单',
            upload: '上传任务所需文件'
          },
          pagination: {
            page: 1,
            count: 0
          },
          commit_obj: {
          },
          search_obj: {
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
        timeFilter(timeformat){
          if(timeformat){
            const date = timeformat.split('T')
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
          fetch_WorkListByPage(this.pagination,this.search_obj).then(response =>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        init_mission(){
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
        selectTime(){
          this.search_obj.time = this.select_time[0] + 'to' + this.select_time[1]
        },
        searchCodeWork(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init()
        },
        reset_commit(){
          this.commit_obj = {}
        },
        reset_search(){
          this.search_obj = {}
        },
        handleCreate(){
          this.dialogStatus = 'create'
          this.dialogWorkVisible = true
          this.init_mission()
        },
        createWork(){
          this.$refs['workForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_Work(this.commit_obj).then(() => {
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
        resetSearch(){
          this.reset_search()
          this.init()
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
        handleUploadWork(row){
          this.work_uuid = row.uuid
          this.upload_tb = []
          for(let file in row.files){
            this.upload_tb.push({'name':row.files[file],'uuid':''})
          }
          this.dialogStatus = 'upload'
          this.dialogUploadVisible = true
          this.btnStatus = false
        },
        hanldUploadFile(filename){
          if(this.temp_filename!=null){ //判断是否需要表单清空
            this.$refs.uploadele.clearFiles()
          }
          this.dialogFileVisible = true
          this.temp_filename = filename
        },
        httpFileUpload(item){
          let formData=new FormData()
          formData.append('file',item.file)
          formData.append('type',1)
          formData.append('name',this.temp_filename)
          create_File(formData).then(response=>{
            for(let tb in this.upload_tb){
              if(this.upload_tb[tb].name == this.temp_filename){
                this.upload_tb[tb].uuid = response.data.uuid
              }
            }
          })
        },
        uploadWork(){
          let uuid_list = []
          for(let tb in this.upload_tb){
            uuid_list.push(this.upload_tb[tb].uuid)
          }
          upload_Work(this.work_uuid,uuid_list).then((response)=>{
            this.$message({
              showClose: true,
              message: '上传文件成功',
              type: 'success'
            })
            this.dialogUploadVisible = false
            this.init()
          })
        },
        handleRun(row){
          console.log(this.select_time)
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
          this.init()
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
