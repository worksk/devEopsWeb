<template>
  <div class="app-wrapper">
       <!--:class="{hideSidebar:!sidebar.opened}">-->
    <left-sidebar class="sidebar-container"></left-sidebar>
    <div class="main-container">
      <!--<navbar></navbar>-->
      <!--<tags-view></tags-view>-->
      <!--<tags></tags>-->
      <!--<app></app>-->
      <h1>123</h1>
    </div>
  </div>
</template>

<script>
  // import Tags from '@/views/tags/index'
  import LeftSidebar from '@/views/sidebar/left/index'
  // import Navbar from '@/views/navbar/index'
  import App from '@/views/app/index'
  export default {
    name: "layout",
    components: {//Sidebar,Navbar,,Tags
      LeftSidebar, App
    },
    computed: {
      // sidebar() {
      //   return this.$store.state.app.sidebar
      // }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-wrapper {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
