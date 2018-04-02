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
      <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="meta">
          <span>{{ meta.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="UUID">
        <template slot-scope="meta">
          <span>{{ meta.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="所属应用组">
        <template slot-scope="meta">
          <span>{{ meta.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="信息">
        <template slot-scope="meta">
          <span>{{ meta.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="370" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="meta">
          <el-button type="warning" size="mini" @click="handleRun(meta.row)" :disabled="btnStatus">执行</el-button>
          <!--<el-button type="warning" size="mini" @click="handleUpdate(meta.row)" :disabled="btnStatus">编辑</el-button>-->
          <!--<el-button type="danger" size="mini" @click="handleDelete(meta.row)" :disabled="btnStatus">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

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
        :title="textMap[dialogStatus]"
        :visible.sync="dialogCreateVisible">

            <el-table :data="temp.contents" border fit highlight-current-row
                      style="width: 100%"
                      :default-sort="{prop: 'sort', order: 'ascending'}">
              <el-table-column width="130px" align="center" label="名称">
                <template slot-scope="content">
                  <span>{{ content.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column width="100px" align="center" label="模块">
                <template slot-scope="content">
                  <span>{{ content.row.module }}</span>
                </template>
              </el-table-column>

              <el-table-column width="100px" align="center" label="参数">
                <template slot-scope="content">
                  <span>{{ content.row.args }}</span>
                </template>
              </el-table-column>

              <el-table-column width="100px" align="center" label="排序" prop="sort">
                <template slot-scope="content">
                  <span>{{ content.row.sort }}</span>
                </template>
              </el-table-column>

              <el-table-column width="200px" align="center" label="参数">
                <template slot-scope="content">
                  <el-button type="primary" size="mini" @click="handleUp(content.row)" :disabled="btnStatus">上升</el-button>
                  <el-button type="primary" size="mini" @click="handleDown(content.row)" :disabled="btnStatus">下降</el-button>
                </template>
              </el-table-column>

            </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAsset" :disabled="btnStatus">下一步</el-button>
          <el-button @click="dialogCreateVisible = false" :disabled="btnStatus">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        width="70%"
        :title="textMap[dialogStatus]"
        :visible.sync="dialogAssetVisible">
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleAssetBack" :disabled="btnStatus">上一步</el-button>
          <el-button @click="createMeta" :disabled="btnStatus">提交</el-button>
        </div>
      </el-dialog>
    </el-form>

  </div>
</template>

<script>
  import { fetch_MetaListByPage } from '@/api/ops';
  import Xterm from '@/components/Xterm/index';
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    data(){
      return{
        list: null,
        listLoading: true,
        btnStatus: false,
        dialogStatus:'',
        textMap:{
          create: '新建元操作',
          asset: '确定操作范围',
        },
        pagination: {
          page: 1,
          count: 0
        },
        dialogXtermVisible:false,
        dialogCreateVisible:false,
        dialogAssetVisible:false,
        meta_id: null,
        temp: {
          contents: [
            {
              "id": 1,
              "name": "li",
              "module": "shell",
              "args": "ls -lh",
              "sort": 2
            },
            {
              "id": 2,
              "name": "zi",
              "module": "shell",
              "args": "touch /ddddr",
              "sort": 1
            }
          ]
        }
      }
    },
    components: {
      ElRow,
      Xterm
    },
    created(){
      this.init()
    },
    filters:{
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
          this.dialogXtermVisible = true
        }).catch(()=>{
          this.meta_id = null
          this.dialogXtermVisible = false
        })
      },
      resetTemp(){
        this.temp={
          contents: [
            {
              "id": 1,
              "name": "li",
              "module": "shell",
              "args": "ls -lh",
              "sort": 2
            },
            {
              "id": 2,
              "name": "zi",
              "module": "shell",
              "args": "touch /ddddr",
              "sort": 1
            }
          ]
        }
      },
      handleCreate(){
        this.resetTemp()
        console.log(this.temp)
        this.dialogStatus = 'create'
        this.dialogCreateVisible = true
        this.$nextTick(() => {
          this.$refs['metaForm'].clearValidate()
        })
      },
      handleAsset(){
        this.dialogStatus = 'asset'
        this.dialogCreateVisible = false
        this.dialogAssetVisible = true
      },
      handleAssetBack(){
        this.dialogStatus = 'create'
        this.dialogAssetVisible = false
        this.dialogCreateVisible = true
      },
      handleUp(row){
        if(this.temp.contents.length>1){
          for(var i=1; i<this.temp.contents.length; i++) {
            if(row.sort == this.temp.contents[i].sort){ // 如果匹配的話
              console.log(this.temp.contents[i-1].name,this.temp.contents[i-1].sort)
              console.log(this.temp.contents[i-1].name,this.temp.contents[i].sort)
              this.temp.contents[i].sort = this.temp.contents[i].sort -1
              this.temp.contents[i-1].sort = this.temp.contents[i-1].sort +1
              console.log(this.temp.contents[i-1].name,this.temp.contents[i-1].sort)
              console.log(this.temp.contents[i].name,this.temp.contents[i].sort)

            }
          }
        }
      },
      handleDown(row){

      },
      createMeta(){

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
