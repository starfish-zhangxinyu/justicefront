<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="个人信息" name="MyInfoForm" />
    <el-tab-pane label="修改密码" name="MyPwdForm">
      <el-form
        :model="passwordForm"
        ref="passwordForm"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-row>
          <el-col :lg="{ span: 8, offset: 4 }">
            <el-form-item label="旧密码" prop="password">
              <el-input
                v-model="passwordForm.password"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :lg="{ span: 8, offset: 4 }">
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                placeholder="新密码至少为6位！数字、大小写字母、特殊字符组合有利于提高密码强度"
                @input="checkStrong($event)"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="display: inline-block">
              <div class="input_span">
                <span id="one"></span>
                <span id="two"></span>
                <span id="three"></span>
              </div>
              <div id="font">
                <span>弱</span>
                <span>中</span>
                <span>强</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 8, offset: 4 }">
            <el-form-item label="确认新密码" prop="checkNewPassword">
              <el-input
                v-model="passwordForm.checkNewPassword"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="2" :offset="11">
          <el-button
            type="success"
            size="mini"
            class="save-btn"
            @click="save('passwordForm')"
            ><i class="fa fa-save"></i> 保存
          </el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="电子签名" name="MySignatureForm" />
  </el-tabs>
</template>

<script>
import api from "../../api/index.js";

export default {
  name: "MyPwdForm",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (
        this.passwordForm.newPassword != undefined &&
        value !== this.passwordForm.newPassword
      ) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatepass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      }
      if (this.score < 50) {
        callback(new Error("密码强度至少为中级"));
      } else {
        callback();
      }
    };
    return {
      activeName: "MyPwdForm",
      passwordForm: {},
      score: 0,
      rules: {
        password: [{ required: true, message: "请输入密码" }],
        newPassword: [{ required: true,validator: validatepass1, trigger: "blur" }],
        checkNewPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            password: this.passwordForm.password,
            newPassword: this.passwordForm.newPassword,
          };
          this.$post(api.myPassword, data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
              }
              this.$post(api.logout).then((res) => {
                this.$router.push({ path: "/login" }).catch((err) => {
                  console.log(err);
                });
              });
            })
            .catch((err) => {
              console.log("err");
              this.$message.error(err.errMsg);
            });
        }
      });
    },
    scorePassword(pass) {
      var score = 0;
      if (!pass) return score;

      // award every unique letter until 5 repetitions
      var letters = new Object();
      for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
      }

      // bonus points for mixing it up
      var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
      };

      var variationCount = 0;
      for (var check in variations) {
        variationCount += variations[check] == true ? 1 : 0;
      }
      score += (variationCount - 1) * 10;
      return parseInt(score);
    },
    checkStrong(pass) {
      this.score = this.scorePassword(pass);
      if (this.score < 50) {
        document.getElementById("one").style.background = "red";
      } else {
        document.getElementById("one").style.background = "#eee";
      }
      if (this.score >= 50 && this.score <= 80) {
        document.getElementById("two").style.background = "orange";
      } else {
        document.getElementById("two").style.background = "#eee";
      }
      if (this.score > 80) {
        document.getElementById("three").style.background = "#00D1B2";
      } else {
        document.getElementById("three").style.background = "#eee";
      }
    }
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "MyInfoForm") {
        this.$router.push({ path: "/myCenter/MyInfoForm" }).catch((err) => {
          console.log(err);
        });
      }
      if (newval == "MySignatureForm") {
        this.$router
          .push({ path: "/myCenter/MySignatureForm" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
.input_span span {
  display: inline-block;
  width: 85px;
  height: 10px;
  background: #eee;
  line-height: 10px;
}
#font{
  font-size: 14px;
}
#font span:nth-child(1) {
  color: red;
  margin-left: 40px;
}
#font span:nth-child(2) {
  color: orange;
  margin: 0 60px;
  text-align: center;
}
#font span:nth-child(3) {
  color: #00d1b2;
  text-align: center;
}
</style>
