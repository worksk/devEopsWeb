<template>
  <div class="dashboard-editor-container">
    <router-view></router-view>
    <el-card class="box-card">
      <el-row>
        <el-col :span="5" :offset="1">
          <div class="systype">
            <IEcharts
              :option="systype"
              :loading="loading"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>


    <el-row>
      <el-col :span="12" :offset="1">
        <el-card class="box-card">
          <!-- <echarts width="980px" height="550px" ref="groupsele"></echarts> -->
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
  </div>
</template>

<script>
// import echarts from 'echarts';
// import Echarts from '@/components/Echarts/index';
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import { fetch_SystemStatus } from '@/api/dashboard';
import { Trends,TimeLine,Pie } from '@/utils/charts';
export default {
  data () {
    return {
      loading: false,
      systype: {
        
      },
    }
  },
  components: {
    IEcharts
  },
  created(){
    this.init_systype()
  },
  methods:{
    init_systype(){
      fetch_SystemStatus().then((response)=>{
        this.systype = response.data
      })
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
  .systype {
    width: 700px;
    height: 400px;
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
