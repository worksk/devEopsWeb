<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:5px;">
        <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" filterable clearable>
          <el-option
            v-for="item in groups"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-switch
          v-model="detailSearch"
          inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:5px;">
        <el-input style="width: 200px;" v-model="search_obj.dig" class="filter-item" placeholder="外网解析"></el-input>
        <el-input style="width: 200px;" v-model="search_obj.inner_dig" class="filter-item" placeholder="内网解析"></el-input>
        <el-input style="width: 200px;" v-model="search_obj.dns_name" class="filter-item" placeholder="域名名称"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchDNS" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="dns">
          <span>{{ dns.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="域名全称">
        <template slot-scope="dns">
          <span>{{ dns.row.dns_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="关联应用组名称">
        <template slot-scope="dns">
          <span>{{ dns.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="内网解析">
        <template slot-scope="dns">
          <span>{{ dns.row.inner_dig }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="外网解析">
        <template slot-scope="dns">
          <span>{{ dns.row.dig }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="dns">
          <el-button type="warning" size="medium" @click="handleUpdate(dns.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(dns.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDNSVisible" width="60%" top="2vh">
      <el-form ref="dnsForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="分域名" prop="name">
          <el-tooltip content="请输入该域名的内容 如果op.8531.cn 请输入op" placement="top" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="公网解析" prop="dig">
          <el-tooltip content="请输入该域名的公网解析" placement="top" effect="light">
            <el-input v-model="commit_obj.dig"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="私网解析" prop="inner_dig">
          <el-tooltip content="请输入该域名的私网解析" placement="top" effect="light">
            <el-input v-model="commit_obj.inner_dig"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属应用组" prop="group">
          <el-select v-model="commit_obj.group" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in groups"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级域名层级" prop="level">
          <el-select v-model="search_obj.level" placeholder="请选择" @change="changeLevel">
            <el-option
              v-for="item in levelOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级域名" prop="father">
          <el-select v-model="commit_obj.father" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in fatherDNS"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDNSVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDNS" :disabled="btnStatus">创建</el-button>
        <el-button v-else type="primary" @click="updateDNS" :disabled="btnStatus">更新</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetch_DNSListByPage,fetch_DNSList,create_DNS,update_DNS,delete_DNS } from "@/api/dns";
  import { fetch_GroupList } from '@/api/manager';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDNSVisible: false,
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            update: '编辑DNS',
            create: '新建DNS',
          },
          dialogStatus:'',
          level: 0,
          groups: [],
          levelOptions:[
            {
              value: 1,
              label: '一级域名'
            }, {
              value: 2,
              label: '二级域名'
            }, {
              value: 3,
              label: '三级域名'
            }
          ],
          fatherDNS:[
          ],
          search_obj:{
          },
          commit_obj: {
          },
          detailSearch: null
        }
      },
      created(){
        this.init()
        this.getGroupList()
      },
      methods:{
        handleChange(val) {
          if(val.length==0){
            this.reset_search()
            this.init()
          }
        },
        reset_search(){
          let group_ip = this.search_obj.group
          this.search_obj = {'group':group_ip}
        },
        reset_commit(){
          this.commit_obj = {}
        },
        init(){
          fetch_DNSListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
          this.listLoading = false
        },
        handleCurrentChange(val) {
          this.pagination.page = val
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        getGroupList(){
          fetch_GroupList().then((response)=>{
            this.groups = []
            for (const group of response.data){
              this.groups.push({
                value: group.id,
                key: group.id,
                label: group.name,
                disabled: false
              })
            }
          })
        },
        changeGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init()
        },
        searchDNS(){
          this.init()
        },
        changeLevel(){
          fetch_DNSList(this.search_obj).then((response)=>{
            this.fatherDNS = []
            for(const dns of response.data){
              this.fatherDNS.push({
                value: dns.id,
                key: dns.id,
                label: dns.dns_name,
                disabled: false
              })
            }
          })
        },
        handleCreate(){
          this.reset_search()
          this.reset_commit()
          this.dialogStatus = "create"
          this.getGroupList()
          this.dialogDNSVisible = true
        },
        createDNS(){
          this.$refs['dnsForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_DNS(this.commit_obj).then(() => {
                this.init()
                this.dialogDNSVisible = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDNSVisible = false
              })
            }
          })
        },
        handleUpdate(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogDNSVisible = true
          this.search_obj.level = row._level-1
          this.changeLevel()
          this.getGroupList()
        },
        updateDNS(){
          this.$refs['dnsForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_DNS(this.commit_obj).then(() => {
                this.init()
                this.dialogDNSVisible = false
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDNSVisible = false
              })
            }
          })
        },
        handleDelete(row){
          this.commit_obj = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        },
        deleteConfirm() {
          this.$confirm('此操作将删除该域名记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            delete_DNS(this.commit_obj).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
            })
          })
        },
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
