<template>
    <el-menu mode="vertical" :default-active="$route.path" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="routers"></sidebar-item>
    </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from '@/components/SidebarItem/index'
  export default {
    name:'Sidebar',
    components: { SidebarItem },
    computed:{
      ...mapGetters([
        'routers',
        'topsidebar'
      ])
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
