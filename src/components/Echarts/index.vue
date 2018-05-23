<template>
  <div>
    <div ref="yocharts" :style="{'width':width,'height':height}"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'Echarts',
    props: {
      width: {
        type: String,
        default: '300px'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart:null
      }
    },
    mounted(){
      this.chart = this.$echarts.init(this.$refs.yocharts)
    },
    methods: {
      Reload(opts){
        this.chart.setOption(opts)
      }
    },
    destoryed(){
      this.chart = null
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
