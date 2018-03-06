<template>
  <div style="width:100%;height:100%;">
    <div class="page-404">
      <div class="pic-404">
        <img class="pic-404__parxent" :src="img_404" alt="404">
      </div>
    </div>
  </div>
</template>

<script>
  import img_404 from '@/assets/404.png'
    export default {
      name: "page_404",
      data() {
          return {
            img_404,
          }
      }
    }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .pic-404{
    text-align: center;
  }
</style>
