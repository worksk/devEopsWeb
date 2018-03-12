<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group name="breadcrumb" v-for="item in levelList" :key="item.path">
      <el-breadcrumb-item :key="item.parent.path">
        <span>{{item.parent.meta.title}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item :key="item.path">
        <span>{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
    export default {
        create(){
          this.getBreadcrumb()
        },
        data(){
          return {
            levelList: null
          }
        },
        watch: {
          $route() {
            this.getBreadcrumb()
          }
        },
        methods: {
          getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name)
            this.levelList = matched
          }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
  }
</style>

