<template>
    <div class="app-wrapper" :class="{hideSidebar:!topsidebar.opened}">
        <left-sidebar class="sidebar-container"></left-sidebar>
      <div class="main-container">
        <top-sidebar></top-sidebar>
        <!--<navbar></navbar>-->
        <!--<tags-view></tags-view>-->
        <!--<tags></tags>-->
          <app></app>
      </div>
  </div>
</template>

<script>
  // import Tags from '@/views/tags/index'
  import LeftSidebar from '@/views/sidebar/left/index'
  import TopSidebar from '@/views/sidebar/top/index'
  import App from '@/views/app/index'
  export default {
    name: "layout",
    components: {
      TopSidebar,LeftSidebar, App
    },
    computed: {
      topsidebar() {
        return this.$store.state.app.topsidebar
      }
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
