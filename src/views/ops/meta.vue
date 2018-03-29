<template>
  <div class="manager-meta-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <!--<el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>-->
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
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
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

  </div>
</template>

<script>
  import { fetch_MetaList } from '@/api/ops';
  import Xterm from '@/components/Xterm/index';
  export default {
    data(){
      return{
        list: null,
        listLoading: true,
        btnStatus: false,
        dialogXtermVisible:false,
        meta_id: null
      }
    },
    components: {
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
        fetch_MetaList().then(response =>{
          this.list=response.data
          this.listLoading = false
        })
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-host-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
