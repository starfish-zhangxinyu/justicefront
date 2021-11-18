<template>
  <el-container class="bg">
    <!-- new -->
    <div class="bg_mask">
      <div class="login_box">
        <div class="top">
          <div class="left">
            <img :src="photo" />
          </div>
          <div class="right">
            <div>{{ loginTitle["org.name"] }}</div>
            <div>
              司法鉴定管理系统
              <span>{{ loginTitle["sys.version"] }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="box">
            <el-row>
              <el-col :span="12" class="left">
                <img src="../assets/image/img_page@2x.png" alt />
              </el-col>
              <el-col :span="12" class="right">
                <div class="content">
                  <el-form
                    label-width="60px"
                    :model="userForm"
                    status-icon
                    ref="userForm"
                    class="login-ruleForm"
                    size="small"
                  >
                    <el-form-item
                      class="marBot12 inputSty"
                      :rules="{ required: true, message: '机构不能为空' }"
                      label="机构"
                      prop="orgId"
                      v-show="isShowOrg"
                    >
                      <el-select
                        ref="orgId"
                        class="w100"
                        v-model="userForm.orgId"
                        filterable
                        placeholder="请选择机构"
                      >
                        <el-option
                          v-for="item in orgs"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="账号"
                      class="marBot12 inputSty"
                      prop="loginName"
                      :rules="{
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        placeholder="请输入账号"
                        type="text"
                        v-model="userForm.loginName"
                        auto-complete="off"
                        @keyup.enter.native="submitForm('userForm')"
                      />
                    </el-form-item>
                    <el-form-item
                      label="密码"
                      class="marBot12 inputSty"
                      prop="password"
                      :rules="{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="userForm.password"
                        auto-complete="off"
                        @keyup.enter.native="submitForm('userForm')"
                      />
                    </el-form-item>

                    <el-form-item
                      class="marBot6 inputSty"
                      label="验证码"
                      prop="validateCode"
                      v-if="isShowValidate"
                    >
                      <el-row>
                        <el-col :span="9">
                          <el-input
                            class="pad0"
                            v-model="userForm.validateCode"
                            auto-complete="off"
                            size="mini"
                            @keyup.enter.native="submitForm('userForm')"
                          />
                        </el-col>
                        <el-col :span="15" class="code_right">
                          <img :src="imgsrc" style="vertical-align: middle" />
                          <el-tooltip
                            effect="dark"
                            content="看不清"
                            placement="top"
                          >
                            <span
                              style="font-size: 20px; cursor: pointer"
                              @click="getValidateCode"
                              class="el-icon-refresh-right"
                            />
                          </el-tooltip>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <div>
                      <el-checkbox class="marBot6" v-model="checked"
                        >记住我</el-checkbox
                      >
                      <div>
                        <button
                          type="button"
                          @click="submitForm('userForm')"
                          class="btn"
                        >
                          登录
                        </button>
                      </div>
                    </div>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box_mask1"></div>
          <div class="box_mask2"></div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import api from "../api/index.js";

export default {
  name: "Login",
  data() {
    return {
      noticeMsg: "",
      checked: false,
      userForm: { orgId: null, loginName: "", password: "" },
      isShowNotice: false,
      isShowValidate: false,
      imgsrc: "",
      baseURL: "",
      orgs: [],
      isShowOrg: true,
      loginTitle: {},
      photo: "",
    };
  },
  methods: {
    ...mapActions("login", ["changeLogin"]),
    validateCode() {
      this.$get(api.validate)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getValidateCode() {
      this.isShowValidate = true;
      let that = this;
      this.$axios
        .get(`/api/user/v1/validate?${new Date().getTime()}`, {
          responseType: "blob",
        })
        .then((res) => {
          // debugger;
          var reader = new FileReader();
          reader.readAsDataURL(res.data.data);
          reader.onload = function (e) {
            that.imgsrc = reader.result; //转为base64 格式的字符串
          };
        })
        .catch((err) => console.log(err));
    },
    submitForm(formName) {
      let that = this;
      let { $message } = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked) {
            window.localStorage.setItem("loginName", this.userForm.loginName);
          }
          var data = JSON.parse(JSON.stringify(this.userForm));
          data.orgId = that.handleOrg(data.orgId);
          this.$post(api.login, data, this.headers)
            .then((res) => {
              if (
                res.data.result == "SUCCESS" ||
                res.data.result == "CHANGE_PWD"
              ) {
                localStorage.token = res.headers["x-auth-token"];
                window.localStorage.setItem("orgId", that.userForm.orgId);
                if (res.data.result == "CHANGE_PWD") {
                  this.$router.replace("changepwd");
                } else {
                  this.$router.replace({ path: "/home" });
                }
                this.changeLogin(true);
              } else {
                if (res.data.result == "ORG_USER_ERROR") {
                  this.noticeMsg = "该机构下未查询到用户相关信息.";
                  $message.error("该机构下未查询到用户相关信息."); 
                } else if (res.data.result == "PWD_ERROR") {
                  this.noticeMsg = "用户或密码错误, 请重试.";
                  $message.error("用户或密码错误, 请重试.");
                } else if (res.data.result == "VALIDATE_CODE_ERROR") {
                  this.noticeMsg = "验证码错误,请刷新后重新登录.";
                  $message.error("验证码错误,请输入正确的验证码.");
                } else if (res.data.result == "LOCKED") {
                  this.noticeMsg = "该用户已被锁定，请联系管理员.";
                  $message.error("该用户已被锁定，请联系管理员.");
                }
                this.isShowNotice = true;
                localStorage.token = res.headers["x-auth-token"];
                if (res.data.failCnt >= 3) {
                  this.getValidateCode();
                }
              }
            })
            .catch((err) => {
              console.log(this.userForm);
              console.log(err);
            });
        } else {
          console.log("验证失败");
        }
      });
    },
    handleOrg(newVal) {
      for (let org of this.orgs) {
        if (org.id == newVal) {
          if (org.orgType.value == "PARENT") {
            return "";
          }
        }
      }
      return newVal;
    },
  },
  created() {
    let that = this;
    if (window.localStorage.getItem("loginName")) {
      this.userForm.loginName = window.localStorage.getItem("loginName");
      this.checked = true;
    }
    this.$get(api.org + "/list")
      .then((res) => {
        if (res.data) {
          this.orgs = res.data;
          if (res.data.length == 1) {
            that.userForm.orgId = res.data[0].id;
            that.isShowOrg = false;
          } else if (window.localStorage.getItem("orgId")) {
            for (let e of res.data) {
              if (window.localStorage.getItem("orgId") === e.id) {
                that.userForm.orgId = e.id;
              }
            }
          }
        }
      })
      .catch((err) => console.log(err));
    this.$get(api.getLoginInfoApi)
      .then((res) => {
        if (res.status === 200) {
          this.loginTitle = res.data;
        }
      })
      .catch((err) => console.log(err));

    //获取图片
    this.$get(api.org + "/img")
      .then((res) => {
        this.photo = res.data;
      })
      .catch((err) => console.log(err));
  },
  beforeCreate() {
    window.sessionStorage.removeItem("userMenus");
  },
  mounted() {},
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  background: url("../assets/image/header.png") no-repeat;
  background-size: cover;
  width: 100%;
  line-height: 60px;
}

.login-left {
  background: url("../assets/image/left-background.png") no-repeat;
  height: 870px;
  background-size: 100% 100%;
  overflow: hidden;
}

.left-img {
  width: 400px;
  margin: 0 auto;
  margin-top: 300px;
}

.login-right {
  background: url("../assets/image/right-background.png") no-repeat;
  background-size: 100% 100%;
  height: 870px;
  overflow: hidden;
}

.login-right .content {
  text-align: center;
  background-color: #62b7f0;
  width: 320px;
  margin: auto;
  padding: 20px 30px 15px;
  border-radius: 2px;
  margin-top: 300px;
}

.login-ruleForm {
  box-sizing: border-box;
}

.login-footer {
  height: 40px;
  background-color: #424242;
  color: #fff;
  font-size: 13px;
  line-height: 40px;
  text-align: center;

  a {
    text-decoration: none;
  }
}

.alert-danger {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
  font-size: 13px;
}

.alert {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.bg {
  background: #2098e9;
}
.bg_mask,
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
}
.bg_mask {
  background: url("../assets/image/bg_mask.png") no-repeat;
  z-index: 10;
  background-size: 100% 100%;
  overflow: scroll;
  display: flex;
  /*align-items: center;*/
  justify-content: center;
  padding-top: calc(40vh - 189px);
}
.login_box {
  width: 580px;
  /*position: fixed;*/
  left: calc(50% - 290px);
  top: calc(40% - 189px);
}
.login_box .content {
  width: 224px;
  margin: 40px auto 0;
}
.login_box .top {
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  height: 64px;
  margin-bottom: 20px;
}
.login_box .top .left {
  margin-right: 8px;
}
.login_box .top .left img {
  height: 64px;
  width: 64px;
}
.login_box .top .right div:nth-of-type(2) {
  font-size: 12px;
  letter-spacing: 11px;
}
.login_box .top .right div:nth-of-type(2) span {
  letter-spacing: 1px;
}
.bottom {
  position: relative;
}
.bottom > div {
  position: absolute;
  height: 300px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 11px -5px #000;
}
.bottom .box {
  width: 580px;
  top: 0;
  left: 0;
  z-index: 100;
}
.bottom .box_mask1,
.bottom .box_mask2 {
  opacity: 0.8;
}
.bottom .box_mask1 {
  width: 540px;
  top: 8px;
  left: 20px;
  z-index: 99;
}
.bottom .box_mask2 {
  width: 500px;
  top: 14px;
  left: 40px;
  z-index: 98;
}
.bottom .left img {
  width: 212px;
  height: 212px;
  margin: 40px 0 0 50px;
}
.bottom .right .btn {
  width: 100%;
  height: 36px;
  background: #2098e9;
  border-radius: 18px;
  box-shadow: 0px 0px 7px -5px #000;
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 2px;
  outline: none;
  cursor: pointer;
}
.code_right {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bg_wrap {
  width: 100px;
  zoom: 1;
  position: relative;
}
.bg_wrap::after {
  display: block;
  content: "";
  height: 0;
  clear: both;
}
</style>
