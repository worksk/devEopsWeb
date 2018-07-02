<template>
  <div class="manager-meta-container">
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
        <el-col :span="5" :offset="1">
          模块： <el-input size="medium" style="width: 200px;" v-model="search_obj.username" class="filter-item" placeholder="根据使用模块模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          参数： <el-input size="medium" style="width: 200px;" v-model="search_obj.phone" class="filter-item" placeholder="根据使用参数模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          主机： <el-input size="medium" style="width: 250px;" v-model="search_obj.name" class="filter-item" placeholder="根据主机连接IP或主机名模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchMeta" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
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
    
    <el-form ref="metaForm" :model="commit_obj" label-position="left" label-width="100px">
      <el-dialog
        width="70%"
        :title="textMap[dialogStatus]+'Step1'"
        :visible.sync="dialogMetaVisible">

            <el-table :data="commit_obj.contents" border fit highlight-current-row
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
        <el-input placeholder="拷贝代码" v-model="commit_obj.info">
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
        <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_host" filterable>
          <el-option
            v-for="item in group_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-transfer v-model="commit_obj.hosts" :data="hosts" placeholder="请选择应用主机IP" filterable>
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
  import { fetch_MetaListByPage,create_Meta,update_Meta,delete_Meta,checkFile_Meta } from '@/api/ops';
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
        detailSearch: false,
        group_options:[],
        hosts:[],
        dialogMetaVisible:false,
        dialogAssetVisible:false,
        dialogCreateContentVisible:false,
        dialogFileVisible:false,
        meta_id: null,
        content: {
          need_file:false
        },
        commit_obj: {},
        search_obj: {}
      }
    },
    components: {
      Xterm
    },
    created(){
      this.init()
      this.init_group()
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
        fetch_MetaListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
      },
      init_host(value){
        fetch_HostList({groups:value}).then(response=>{
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
      init_group(){
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
      searchMeta(){
        this.init()
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      reset_content(){
        this.content = {
          need_file: false
        }
      },
      reset_commit(){
        this.commit_obj = {contents:[]}
      },
      reset_search(){
        this.search_obj = {}
      },
      resetSearch(){
        this.reset_search()
        this.init()
        this.init_group()
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
      handleCreate(){
        this.reset_commit()
        this.dialogStatus = 'create'
        this.dialogMetaVisible = true
        this.$nextTick(() => {
          this.$refs['metaForm'].clearValidate()
        })
      },
      handleUpdate(row){
        this.commit_obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogMetaVisible = true
        this.init_host(this.commit_obj.group)
        this.$nextTick(() => {
          this.$refs['metaForm'].clearValidate()
        })
      },
      handleDelete(row){
        this.commit_obj = Object.assign({},row)
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
          delete_Meta(this.commit_obj).then((response) => {
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
        this.reset_content()
      },
      handleAsset(){
        this.init_group()
        this.dialogMetaVisible = false
        this.dialogAssetVisible = true
      },
      handleAssetBack(){
        this.dialogStatus = 'create'
        this.dialogAssetVisible = false
        this.dialogMetaVisible = true
      },
      sortContents(){
        this.commit_obj.contents.sort(function(a,b){
          return a.sort - b.sort
        })
      },
      handleUp(row){
        if(row.sort==1){// 如果要處理的條目已經是最上面一層
          return
        }
        if(this.commit_obj.contents.length>1){ // 如果要處理的條目確實需要上升=
          for(var i=0; i<this.commit_obj.contents.length; i++) {
            if(this.commit_obj.contents[i].sort == row.sort -1){
              row.sort--
              this.commit_obj.contents[i].sort++
            }
          }
        }
        this.sortContents()
      },
      handleDown(row){
        if(row.sort == this.commit_obj.contents.length){ // 如果要處理的條目已經是最下面一層
          return
        }
        if(this.commit_obj.contents.length>1){
          for(var i=0;i<this.commit_obj.contents.length;i++){
            if(this.commit_obj.contents[i].sort == row.sort +1){
              row.sort++
              this.commit_obj.contents[i].sort--
            }
          }
        }
        this.sortContents()
      },
      handleContentDelete(row){
        for(var i=0;i<this.commit_obj.contents.length;i++){
          if(this.commit_obj.contents[i].sort == row.sort){
            this.commit_obj.contents.splice(i,1)
          }
        }
      },
      createContent(){
        this.content.sort = this.commit_obj.contents.length+1
        this.commit_obj.contents.push(this.content)
        this.sortContents()
        this.dialogCreateContentVisible=false
      },
      createMeta(){
        this.$refs['metaForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Meta(this.commit_obj).then(() => {
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
            update_Meta(this.commit_obj).then(() => {
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
