<template>
  <div class="dashboard-editor-container">
    <router-view></router-view>
    <el-row>
      <el-col>
        456
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
