<template>
  <div class="manager-meta-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="meta">
          <span>{{ meta.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="300px" align="center" label="ID">
        <template slot-scope="meta">
          <span>{{ meta.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="所属应用组">
        <template slot-scope="meta">
          <span>{{ meta.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="700px" align="center" label="信息">
        <template slot-scope="meta">
          <span>{{ meta.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="meta">
          <el-button type="warning" @click="handleUpdate(meta.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" @click="handleDelete(meta.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog
      width="70%"
      title="上传文件"
      :visible.sync="dialogFileVisible">

      <el-upload
        action="string"
        :http-request="uploadFile"
        :limit="1"
        class="upload-demo">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="70%"
      title="执行元操作"
      :visible.sync="dialogXtermVisible">
      <xterm :meta_id="meta_id"></xterm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogXtermVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

    <el-form ref="metaForm" :model="temp" label-position="left" label-width="100px">
      <el-dialog
        width="70%"
        :title="textMap[dialogStatus]+'Step1'"
        :visible.sync="dialogMetaVisible">

            <el-table :data="temp.contents" border fit highlight-current-row
                      style="width: 100%"
                      :default-sort="{prop: 'sort', order: 'ascending'}">
              <el-table-column width="120px" align="center" label="名称">
                <template slot-scope="content">
                  <span>{{ content.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column width="130px" align="center" label="模块">
                <template slot-scope="content">
                  <span>{{ content.row.module }}</span>
                </template>
              </el-table-column>

              <el-table-column width="250px" align="center" label="参数">
                <template slot-scope="content">
                  <span>{{ content.row.args }}</span>
                </template>
              </el-table-column>

              <el-table-column width="120px" align="center" label="需要上传文件">
                <template slot-scope="content">
                  <span>{{ content.row.need_file | needFile }}</span>
                </template>
              </el-table-column>

              <el-table-column width="100px" align="center" label="排序" prop="sort">
                <template slot-scope="content">
                  <span>{{ content.row.sort }}</span>
                </template>
              </el-table-column>

              <el-table-column width="250px" align="center" label="排序工具">
                <template slot-scope="content">
                  <el-button type="primary" size="mini" @click="handleUp(content.row)" :disabled="btnStatus">上升</el-button>
                  <el-button type="primary" size="mini" @click="handleDown(content.row)" :disabled="btnStatus">下降</el-button>
                  <el-button type="primary" size="mini" @click="handleContentDelete(content.row)" :disabled="btnStatus">刪除</el-button>
                </template>
              </el-table-column>
            </el-table>
        <el-input placeholder="拷贝代码" v-model="temp.info">
          <template slot="prepend">信息: </template>
        </el-input>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="handleContentCreate" :disabled="btnStatus">新增操作</el-button>
          <el-button type="primary" @click="handleAsset" :disabled="btnStatus">下一步</el-button>
          <el-button @click="dialogMetaVisible = false" :disabled="btnStatus">取消</el-button>
        </div>

        <el-dialog
          width="30%"
          title="新增操作"
          :visible.sync="dialogCreateContentVisible"
          append-to-body>
            <div :model="content">
                <el-input placeholder="检出代码" v-model="content.name">
                  <template slot="prepend">名称:</template>
                </el-input>
                <el-input placeholder="copy" v-model="content.module">
                  <template slot="prepend">模块:  </template>
                </el-input>
                <el-input placeholder="src=/etc/hosts dest=/tmp/hosts" v-model="content.args">
                  <template slot="prepend">参数:  </template>
                </el-input>
                <el-checkbox v-model="content.need_file">是否需要上传文件</el-checkbox>
            </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createContent" :disabled="btnStatus">提交</el-button>
            <el-button @click="dialogCreateContentVisible = false" :disabled="btnStatus">取消</el-button>
          </div>
        </el-dialog>

      </el-dialog>

      <el-dialog
        width="40%"
        title="确定操作范围Step2"
        :visible.sync="dialogAssetVisible">
        <el-select v-model="temp.group" placeholder="请选择" @change="fetch_Host" filterable>
          <el-option
            v-for="item in group_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-transfer v-model="temp.hosts" :data="hosts" placeholder="请选择应用主机IP" filterable>
        </el-transfer>

        <div slot="footer" class="dialog-footer">
          <el-button @click="handleAssetBack" :disabled="btnStatus">上一步</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createMeta" :disabled="btnStatus">提交</el-button>
          <el-button v-else type="primary" @click="updateMeta" :disabled="btnStatus">提交</el-button>
        </div>
      </el-dialog>
    </el-form>

  </div>
</template>

<script>
  import { fetch_MetaListByPage,create_Meta,update_Meta,delete_Meta,checkFile_Meta,uploadFile_Meta } from '@/api/ops';
  import { fetch_GroupList,fetch_HostList } from '@/api/manager';
  import Xterm from '@/components/Xterm/index';
  export default {
    data(){
      return{
        list: null,
        listLoading: true,
        btnStatus: false,
        dialogStatus:'',
        textMap:{
          create: '新建元操作',
          update: '修改元操作'
        },
        pagination: {
          page: 1,
          count: 0
        },
        group_options:[],
        hosts:[],
        dialogXtermVisible:false,
        dialogMetaVisible:false,
        dialogAssetVisible:false,
        dialogCreateContentVisible:false,
        dialogFileVisible:false,
        meta_id: null,
        content: {
          need_file:false
        },
        temp: {
          contents: [],
          hosts: []
        }
      }
    },
    components: {
      Xterm
    },
    created(){
      this.init()
    },
    filters:{
      needFile(value){
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
        fetch_MetaListByPage(this.pagination).then(response =>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      handleRun(row){
        this.$confirm('此操作将执行该元操作并对业务系统造成影响, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.meta_id = row.id
          checkFile_Meta(row.id).then(response=>{
            if(response.data.length==0){
              this.dialogXtermVisible = true // 直接执行
            }else{
              this.dialogFileVisible = true
            }
          }).catch(error=>{
            this.$message({
              showClose: true,
              message: '确定元操作状态失败',
              type: 'error'
            })
          })
        }).catch(()=>{
          this.meta_id = null
          this.dialogXtermVisible = false
        })
      },
      resetContent(){
        this.content = {
          need_file:false
        }
      },
      resetTemp(){
        this.temp={
          contents: [],
          hosts:[]
        }
      },
      uploadFile(item){
        const formData=new FormData()
        formData.append('ops_dir',item.file)
        uploadFile_Meta(this.meta_id,formData).then(response=>{
          this.dialogXtermVisible = true
        }).catch((error)=>{
          this.$message({
            showClose: true,
            message: '上传文件失败'+error,
            type: 'success'
          })
        })
      },
      fetch_Host(value){
        fetch_HostList(value).then(response=>{
          this.hosts = []
          for (const host of response.data){
            this.hosts.push({
              key: host.id,
              label: host.hostname,
              disabled: false
            })
          }
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
      handleCreate(){
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogMetaVisible = true
        this.$nextTick(() => {
          this.$refs['metaForm'].clearValidate()
        })
      },
      handleUpdate(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogMetaVisible = true
        this.fetch_Host(this.temp.group)
        this.$nextTick(() => {
          this.$refs['metaForm'].clearValidate()
        })
      },
      handleDelete(row){
        this.temp = Object.assign({},row)
        this.btnStatus=true
        this.deleteConfirm()
        this.btnStatus=false
      },
      deleteConfirm() {
        this.$confirm('此操作将删除元操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Meta(this.temp).then((response) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          })
        })
      },
      handleContentCreate()
      {
        this.dialogCreateContentVisible = true
        this.resetContent()
      },
      handleAsset(){
        this.fetch_Group()
        this.dialogMetaVisible = false
        this.dialogAssetVisible = true
      },
      handleAssetBack(){
        this.dialogStatus = 'create'
        this.dialogAssetVisible = false
        this.dialogMetaVisible = true
      },
      sortContents(){
        this.temp.contents.sort(function(a,b){
          return a.sort - b.sort
        })
      },
      handleUp(row){
        if(row.sort==1){// 如果要處理的條目已經是最上面一層
          return
        }
        if(this.temp.contents.length>1){ // 如果要處理的條目確實需要上升=
          for(var i=0; i<this.temp.contents.length; i++) {
            if(this.temp.contents[i].sort == row.sort -1){
              row.sort--
              this.temp.contents[i].sort++
            }
          }
        }
        this.sortContents()
      },
      handleDown(row){
        if(row.sort == this.temp.contents.length){ // 如果要處理的條目已經是最下面一層
          return
        }
        if(this.temp.contents.length>1){
          for(var i=0;i<this.temp.contents.length;i++){
            if(this.temp.contents[i].sort == row.sort +1){
              row.sort++
              this.temp.contents[i].sort--
            }
          }
        }
        this.sortContents()
      },
      handleContentDelete(row){
        for(var i=0;i<this.temp.contents.length;i++){
          if(this.temp.contents[i].sort == row.sort){
            this.temp.contents.splice(i,1)
          }
        }
      },
      createContent(){
        this.content.sort = this.temp.contents.length+1
        this.temp.contents.push(this.content)
        this.sortContents()
        this.dialogCreateContentVisible=false
      },
      createMeta(){
        this.$refs['metaForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Meta(this.temp).then(() => {
              this.init()
              this.dialogAssetVisible = false
              this.$message({
                showClose: true,
                message: '创建元操作成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogAssetVisible = false
              console.log(error)
            })
          }
        })
      },
      updateMeta(){
        this.$refs['metaForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_Meta(this.temp).then(() => {
              this.init()
              this.dialogAssetVisible = false
              this.$message({
                showClose: true,
                message: '更新元操作成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogAssetVisible = false
              console.log(error)
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-meta-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
