<template>
  <div class="manager-group-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="100px" align="center" label="ID">
        <template slot-scope="group">
          <span>{{group.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="350px" align="center" label="UUID">
        <template slot-scope="group">
          <span>{{group.row.uuid}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="应用系统名称">
        <template slot-scope="group">
          <span>{{ group.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="320px" align="center" label="应用系统信息">
        <template slot-scope="group">
          <span>{{group.row.info}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态" class-name="status-col" >
        <template slot-scope="group">
          <el-tag :type="group.row.status | statusFilter">{{group.row.status_label}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="group">
          <el-button type="primary" @click="handleUpdate(group.row)" size="mini">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>


    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:40px;'>
        <el-form-item label="应用组ID" prop="title">
          <el-input v-model="temp.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用组名称" prop="title">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="应用组信息" prop="title">
          <el-input type="textarea" rows="5" v-model="temp.info"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" placeholder="请选择应用组状态">
            <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_GroupList } from '@/api/manager'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        temp: {
          name: '',
          status: 0,
          info: ''
        },
        optionState:[
          {
            value: '0',
            label: '禁用中'
          }, {
            value: '1',
            label: '使用中'
          }, {
            value: '2',
            label: '暂停中'
          }],
      }
    },
    created(){
      this.getList()
    },
    filters:{
      statusFilter(status) {
        const statusMap = {
          0: 'danger',
          1: 'success',
          2: 'info'
        }
        return statusMap[status]
      }
    },
    methods:{
      getList(){
        this.listLoading = true
        fetch_GroupList().then(response =>{
          this.list=response.data
          this.listLoading = false
        })
      },
      handleUpdate(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleCreate(){
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            update_Group(tempData).then(() => {
              // for (const v of this.list) {
              //   if (v.id === this.temp.id) {
              //     const index = this.list.indexOf(v)
              //     this.list.splice(index, 1, this.temp)
              //     break
              //   }
              // }
              // this.dialogFormVisible = false
              // this.$notify({
              //   title: '成功',
              //   message: '更新成功',
              //   type: 'success',
              //   duration: 2000
              // })
            })
          }
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-group-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  input,textarea{
    font-family: Arial;
  }
</style>
