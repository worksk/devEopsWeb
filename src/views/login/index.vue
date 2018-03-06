<template>
    <div class="login-container">
      <el-form class="login-form" autoComplete="on" :model="loginForm" ref="loginForm" label-position="left">
        <div class="title-container">
          <h3 class="title">devEops<b>Beta</b></h3>
        </div>
        <el-form-item prop="username">
          <el-row>
            <el-col :offset="1" :span="1">
              <awesome awesclass="user"></awesome>
            </el-col>
            <el-col :span="20">
              <el-input name="username" type="text" v-model="loginForm.username" placeholder="username"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-row>
            <el-col :offset="1" :span="1">
              <awesome awesclass="lock"></awesome>
            </el-col>
            <el-col :span="19">
              <el-input name="password" :type="passwordType" v-model="loginForm.password" placeholder="password" />
            </el-col>
            <el-col :span="1">
              <awesome awesclass="eye" @click.native="showPasswd"></awesome>
              <!-- @click.middle="show_1()" @keyup.up="show_2()"-->
            </el-col>
          </el-row>
        </el-form-item>
        <!--<el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登陆</el-button>-->
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="userLogin">登陆</el-button>
      </el-form>
      <!--<el-footer>123</el-footer>-->
    </div>
</template>

<script>
  import axios from 'axios'
  import Awesome from "@/components/Awesome/index";
    export default {
      components: {Awesome},
      name: "login",
      component: {
        Awesome
      },
        data (){
          return {
              loginForm: {
                username: '',
                password: ''
              },
              passwordType: 'password',
              loading: false
          }
        },
        methods: {
          showPasswd() {
            if (this.passwordType === 'password') {
              this.passwordType = '';
            } else {
              this.passwordType = 'password';
            }
          },
          userLogin(){
            this.loading = true
            this.$store.dispatch('LoginByUsername',this.loginForm).then(()=>{
              this.loading = false
              this.$router.push({path: '/404' })
            }).catch(()=>{
              this.loading = false
            })
          }
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;
      input {
        background: transparent;
        border: 0px;
         -webkit-appearance: none;
        border-radius: 0px;
      //  padding: 12px 5px 12px 15px;
        color: $light_gray;
        font-size: 20px;
        height: 47px;
        &:-webkit-autofill {
           -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      color: #454545;
      svg{
        font-size: 20px;
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 300px; ////////
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
