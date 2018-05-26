<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="" :disabled="btnStatus">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="btnStatus">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="db">
          <span>{{ db.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="实例名称">
        <template slot-scope="db">
          <span>{{ db.row.host_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="Tags">
        <template slot-scope="db">
          <template v-for="tag in tagsFilter(db.row.host_tags)">
              <el-tag>{{ tag }}</el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="连接地址">
        <template slot-scope="db">
          <span>{{ db.row.host_ipaddr }}</span>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="状态">
        <template slot-scope="db">
          <el-tag :type="db.row.host_status | statusFilter">{{ optionState[db.row.host_status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="端口">
        <template slot-scope="db">
          <span>{{ db.row.host_port }}</span>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="用户">
        <template slot-scope="db">
          <span>超级</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="db">
          <el-button type="warning" size="medium" disabled="">编辑</el-button>
          <el-button type="danger" size="medium" disabled="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDBVisible" width="60%" top="2vh">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDBVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" :disabled="btnStatus">提交</el-button>
      </div>
      
    </el-dialog>

  </div>
</template>

<script>
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDBVisible: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          // pagination: {
          //   page: 1,
          //   count: 0
          // },
          textMap:{
            update: '编辑主机',
            create: '新建主机',
          },
          dialogStatus:'',
          temp: {
          },
          optionState: [
            {
              value: 0,
              label: '错误'
            }, {
              value: 1,
              label: '正常'
            }]
        }
      },
      created(){
        this.init()
      },
      filters:{
        statusFilter(_status) {
          const statusMap = {
            0: 'danger',
            1: 'success',
            2: 'info'
          }
          return statusMap[_status]
        },
      },
      methods:{
        tagsFilter(tags) {
          const ary = tags.split(':')
          return ary
        },
        init(){
          this.list=[
            {
              'id':'9749cb52-5edf-4227-8b4b-359c21adb15c',
              'host_name': '测试A',
              'host_tags': '超级:变色:龙',
              'host_ipaddr': '127.0.0.1',
              'host_status': 1,
              'host_port': 3306,
              'host_user': 1,
              'host_pass': ''  
            },{
              'id':'9749cb52-5edf-4227-8b4b-359c21adb15c',
              'host_name': '测试B',
              'host_tags': '123:456:789',
              'host_ipaddr': '111.0.256.1',
              'host_status': 1,
              'host_port': 7703,
              'host_user': 2,
              'host_pass': ''  
            }
          ]
          this.listLoading = false
        },
        // handleCurrentChange(val) {
        //   this.pagination.page = val
        //   this.getList(this.group_id)
        // },
        // handleSelectionChange(val) {
        //   this.multipleSelection = val;
        // },
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
