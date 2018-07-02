<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件" disabled="">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" disabled>搜索</el-button>
   </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column width="260px" align="center" label="Aliyun">
        <template slot-scope="rds">
          <span>{{ rds.row.recognition_id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="状态">
        <template slot-scope="rds">
          <el-tag :type="rds.row.status | statusFilter">{{ rds.row.status }}</el-tag>
        </template>
      </el-table-column>

     <el-table-column width="370px" align="center" label="实例名称">
        <template slot-scope="rds">
          <span>{{ rds.row.instancename }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="数据库版本">
        <template slot-scope="rds">
          <span>{{ rds.row.version }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="过期时间">
        <template slot-scope="rds">
          <span style="color:#FF0000">{{ rds.row.expired }}天</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="rds">
          <el-button type="primary" disabled="">详细</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetch_ExpiredAliyunRDSList } from '@/api/dashboard';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          pagination: {
            page: 1,
            count: 0
          }
        }
      },
      created(){
        this.init()
      },
      filters:{
        statusFilter(status) {
          const statusMap = {
            'Running': 'success',
            'Stopped': 'danger',
          }
          return statusMap[status]
        }
      },
      methods:{
        init(){
          fetch_ExpiredAliyunRDSList(this.pagination).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
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
