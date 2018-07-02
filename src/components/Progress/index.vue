<template>
  <div>
    <el-progress type="circle" :percentage="centage" :status="status"></el-progress>
  </div>
</template>

<script>
  export default {
    name: 'YoProgress',
    props: {
      work_uuid:{
        type: String,
        default: 0
      }
    },
    data() {
      return {
        ws: null,
        centage: 0,
        status: ''
      }
    },
    created(){
      this.initWebSocket()
    },
    destroyed(){
      this.websocketclose()
      console.log('destory')
    },
    methods:{
      initWebSocket(){ //初始化weosocket 
        this.websock = new WebSocket('ws://10.100.100.246:8888/ansible/'+this.work_uuid+'/')
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonmessage(e){
        console.log(e)
        if(this.centage+12<100&&e.data=='OK'){
          this.centage = this.centage+12
        }else{
          this.status = 'exception'
        }
      },
      websocketclose(e){ 
        this.centage = 100
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
