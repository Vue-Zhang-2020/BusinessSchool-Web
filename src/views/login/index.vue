<template>
  <div class="login-container">
    <div class="login-top-box">
      <img src="../../assets/icon.png" width="126" height="32" alt="">
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="login_left">
        <img class="login_left_img" width="383" height="543" src="../../assets/login/login.png" alt="">
      </div>
      <div class="login_right">
        <span class="pass_login">密码登录</span>
        <div class="h_line"></div>

        <el-form-item style="margin-top: 22px" prop="username">
          <el-input
            id="account"
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item style="margin-top: 32px" prop="password">
          <el-input
            id="psw"
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-checkbox class="login_check">
          <span>记住密码</span>
        </el-checkbox>
        <p class="login_toast">{{loginResponse}}</p>
        <el-button
          id="login_btn"
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;background:#222446;border: none"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <!-- <el-button @click="test">测试</el-button> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {Message} from 'element-ui'
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("请输入有效的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码必须大于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      loginResponse: ''
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    goRegister () {
      localStorage.setItem("hasLogin", true);
      this.$router.push('/register')
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    test() {
      this.$axios.post(this.$global.sApi + '/test3', JSON.stringify({'id': 11})).then(res => {console.log('success')}).catch(err => {console.log(err)})
    },
    // login() {
    //   sessionStorage.setItem('role', '2')
    //   Cookies.set('token', '9172731y28ihasdiasni')
    //   sessionStorage.setItem('token', '9172731y28ihasdiasni')
    //   this.$router.push({ path: '/' })
    // },
    handleLogin() {
      let that = this;
      this.loading = true;
      //数据格式验证
      this.$refs.loginForm.validate(valid => {
        // 格式通过 进行登录逻辑请求
        if (valid) {
          this.$store.dispatch('Login', this.loginForm).then(response => {
            sessionStorage.setItem('token', response.data[0].api_token)
            sessionStorage.setItem('roles', response.data[0].power)
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.$message({
              message: '服务器繁忙，登录失败',
              type: 'error'
            })
            this.loading = false
          })
        } else { 
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.info {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: gainsboro;
}
$bg: #F2F3F7 !important;
$light_gray: #000000;
$cursor: #000000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    width: 100%;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px !important;
    width: 100% !important;

    input {
      background: #ffffff !important;
      -webkit-appearance: none;
      border-radius: 2px !important;
      border: 1px solid #EBEBEB !important;
      padding: 12px 5px 12px 15px !important;
      color: $light_gray !important;
      height: 40px !important;
      caret-color: $cursor !important;
    }
  }

  .login-top-box {
    width: 100%;
    padding: 16px 22px;
    margin-bottom: 48px;
    background-color: #ffffff;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #F2F3F7;
    border-radius: 5px;
    color: #454545;
  }
}

$bg: #F2F3F7 !important;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 910px;
    max-width: 100%;
    margin: 48px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08); 
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .login_left {
    width: 383px;
    height: 543px;
    float: left;
  }

  .login_right {
    width: 542px;
    height: 543px;
    float: left;
    padding: 95px 92px 92px 112px;
    background-color: #ffffff;
  }

  .pass_login {
    font-size: 18px;
    color: rgba(0,0,0,0.85);
    margin-left: 36px;
    padding-bottom: 16px;
    border-bottom: 2px solid #132343;
  }

  .h_line {
    width: 100%;
    height: 1px;
    margin-top: 17px;
    background-color: #EFEFEF;
  }

  .login_check span {
    font-size: 12px;
    color: rgba(0,0,0,0.85);
  }

  .login_toast {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 36px;
    font-size: 16px;
    color: #E23628;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 30px;
    top: 0px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
