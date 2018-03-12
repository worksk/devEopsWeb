<template>
  <div class="manager-group-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="检索条件">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button>
    </div>

    <el-table element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="150px" :label="标题">
        <template slot-scope="scope">
          <span class="link-type">超级</span>
          <el-tag>123</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="作者">
        <template slot-scope="scope">
          <span>Yo</span>
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
  export default {
    data(){
      return {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-group-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
