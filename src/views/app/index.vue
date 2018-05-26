<template>
    <section class="app-main" style="min-height: 100%">
      <left-sidebar class="sidebar-container"></left-sidebar>
      <router-view></router-view>
    </section>
</template>

<script>
  import LeftSidebar from '@/views/sidebar/left/index'
  export default {
    name: 'AppMain',
    components: {
      LeftSidebar
    },
  }
</script>
