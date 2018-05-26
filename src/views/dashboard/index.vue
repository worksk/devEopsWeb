<template>
  <div class="dashboard-editor-container">
    <router-view></router-view>
    <el-row>
      <el-col :span="16" :offset="1">
        <el-card class="box-card">
          <echarts width="980px" height="550px" ref="groupsele"></echarts>
        </el-card>
      </el-col>
        <el-col :span="6" :offset="1">
          <el-card class=box-card>
              <el-carousel height="300px">
                <el-carousel-item>
                  <h1>量化</h1>
                </el-carousel-item>
                <el-carousel-item>
                  <h1>可视化</h1>
                </el-carousel-item>
                <el-carousel-item>
                  <h1>自动化</h1>
                </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="1">
        <el-card class="box-card">
          <echarts width="980px" height="550px" ref="systemele"></echarts>
        </el-card>
      </el-col>
      <!-- <el-col :span="5" :offset="1">
        <el-card class="box-card">
          <echarts width="230px" height="300px" ref="wordele"></echarts>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts';
import Echarts from '@/components/Echarts/index';
import { fetch_ManagerStatus } from '@/api/dashboard';
import { Trends,TimeLine,Pie } from '@/utils/charts';
export default {
  data () {
    return {
      codeupdate: {},
      systemtype: {},
      position: {},
      groups: {},
      data: {},
      wordcloud: {}
    }
  },
  components: {
    Echarts
  },
  created(){
    // this.getManagerStatus()
    // this.wordcloud = Trends('尝试',[
    //   {name:'周一',value:'1000'},
    //   {name:'周二',value:'5'},
    //   {name:'周三',value:'300'},
    //   {name:'周四',value:'7'},
    //   {name:'周五',value:'4'},
    //   {name:'周六',value:'66'},
    //   {name:'周七',value:'3'}
    // ])
    // this.codeupdate = TimeLine('代码更新次数','代码更新次数',[
    //   {day:'周一',value:'1'},
    //   {day:'周二',value:'5'},
    //   {day:'周三',value:'3'},
    //   {day:'周四',value:'7'},
    //   {day:'周五',value:'4'},
    //   {day:'周六',value:'2'},
    //   {day:'周七',value:'3'}
    // ])
    this.getManagerStatus()
  },
  methods:{
    getManagerStatus(){
      fetch_ManagerStatus().then((response)=>{
        this.data=response.data
        this.draw()
      })
    },
    draw(){
      this.$refs.systemele.Reload(Pie('系统类型统计', this.data.systemtype))
      this.$refs.groupsele.Reload(Pie('应用组统计', this.data.groups))
      this.$refs.wordele.Reload(Trends('系统类型字符云', this.data.systemtype))
    }
  }
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
  .el-row{
    margin-bottom: 20px;
  }
  .el-carousel__item h1 {
    color: #475669;
    font-size: 50px;
    opacity: 0.75;
    text-align: center;
    line-height: 250px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
