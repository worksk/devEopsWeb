<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="host">
          <span>{{ host.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="UUID">
        <template slot-scope="host">
          <span>{{ host.row.uuid| uuidFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="group">
          <el-button type="primary" size="mini" :disabled="btnStatus">架构图</el-button>
          <el-button type="warning" size="mini" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="mini" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetch_HostList } from '@/api/manager'
    export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus:false,
          temp: {}
        }
      },
      created(){
        this.getList()
      },
      filters:{
        uuidFilter(uuid) {
          const ary = uuid.split('-')
          return ary[0] + '-' + ary[1] + '-'+ ary[2]
        }
      },
      methods:{
        getList(){
          this.listLoading = true
          fetch_HostList(0).then(response =>{
            this.list=response.data
            this.listLoading = false
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
</style>
