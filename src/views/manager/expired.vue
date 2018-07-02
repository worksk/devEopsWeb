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
        <template slot-scope="host">
          <span>{{ host.row.recognition_id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="状态">
        <template slot-scope="host">
          <el-tag :type="host.row.status | statusFilter">{{ host.row.status }}</el-tag>
        </template>
      </el-table-column>

     <el-table-column width="320px" align="center" label="实例名称">
        <template slot-scope="host">
          <span>{{ host.row.instancename }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="VPC私网地址">
        <template slot-scope="host">
          <span>{{ host.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="过期时间">
        <template slot-scope="host">
          <span style="color:#FF0000">{{ host.row.expired }}天</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="host">
          <el-button type="primary" size="mini" @click="handleDetail(host.row)" :disabled="btnStatus">详细</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog title="阿里云机器详情" :visible.sync="dialogDetailVisible" width="40%" top="2vh">
        <template v-for="detail in details">
          <el-tag :hit="true">{{ detail }}</el-tag>
        </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { detail_HostByAliID } from '@/api/manager';
  import { fetch_ExpiredAliyunECSList } from '@/api/dashboard';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDetailVisible: false,
          details: [],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
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
          fetch_ExpiredAliyunECSList(this.pagination).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
        },
        filterDetail(data){
          const list=[]
          if(data.type=='aliyun'){
            list.push('地区 : ' + data.RegionId)
            list.push('过期时间 : ' + data.ExpiredTime)
            list.push('私网地址 : ' + data.VpcAttributes.PrivateIpAddress.IpAddress[0])
            list.push('实例名称 : ' + data.InstanceName)
            list.push('CPU核数 : ' + data.Cpu)
            list.push('内存大小MB : ' + data.Memory)
            list.push('带宽大小 : ' + data.InternetMaxBandwidthIn)
          }else{
            list.push('使用内存MB : ' + data.privateMemory +'/'+ data.memoryMB)
            list.push('电源状态 : ' + data.powerState)
            list.push('CPU核数 : ' + data.numCpu)
            list.push('CPU使用 : ' + data.overallCpuUsage +'MHz')
            list.push('私网地址 : ' + data.ipAddress)
            list.push('存储使用B : ' + data.committed)
          }
          return list
        },
        handleDetail(row){
          this.temp = Object.assign({},row)
          this.dialogStatus = 'detail'
          detail_HostByAliID(row.recognition_id).then((response) =>{
            this.details = this.filterDetail(response.data)
            this.dialogDetailVisible = true
          }).catch((error) => {
            this.$message({
              type: 'error',
              message: '获取详细信息失败!'
            })
            this.dialogDetailVisible = false
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
