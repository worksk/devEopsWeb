<template>
  <div class="manager-meta-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <!--<el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>-->
      <el-button class="filter-item" @click="dialogXtermVisible=true" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">超级</el-button>
    </div>
    <!--<el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row-->
              <!--style="width: 100%">-->

      <!--<el-table-column width="70px" align="center" label="ID">-->
        <!--<template slot-scope="host">-->
          <!--<span>{{ host.row.id }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="操作" width="370" class-name="small-padding fixed-width" fixed="right">-->
        <!--<template slot-scope="host">-->
          <!--<el-button type="warning" size="mini" @click="handleUpdate(host.row)" :disabled="btnStatus">编辑</el-button>-->
          <!--<el-button type="danger" size="mini" @click="handleDelete(host.row)" :disabled="btnStatus">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-dialog
      width="70%"
      title="新增位置类型"
      :visible.sync="dialogXtermVisible">
      <xterm></xterm>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_HostList,fetch_PositionList,fetch_SystypeList,delete_Host,create_Host,update_Host,create_Systype,create_Position,fetch_HostPasswd,detail_Host } from '@/api/manager';
  import { fetch_GroupList } from "@/api/manager";
  import Xterm from '@/components/Xterm/index';
  export default {
    data(){
      return{
        list: null,
        listLoading: true,
        btnStatus: false,
        dialogXtermVisible:false
      }
    },
    components: {
      Xterm
    },
    created(){
    },
    filters:{
    },
    methods:{
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
