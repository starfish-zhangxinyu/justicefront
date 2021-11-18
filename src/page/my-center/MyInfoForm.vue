<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="个人信息" name="MyInfoForm">
      <el-form
        :model="personalForm"
        ref="personalForm"
        size="small"
        label-width="100px"
      >
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="归属部门" prop="office">
              <select-department
                data_type="person"
                :model.sync="personalForm.office"
                className="multiple-select"
              ></select-department>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="姓名" prop="hrStaff.name">
              <el-input
                v-if="personalForm.hrStaff"
                v-model="personalForm.hrStaff.name"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="personalForm.loginName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="手机" prop="mobile" :rules="required">
              <el-input v-model.trim="personalForm.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="personalForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="开启提示音">
              <el-switch v-model="isSound" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <el-form-item label="头像">
              <SimpleUpload
                :model.sync="personalForm.userAvatar"
              ></SimpleUpload>
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
            @click="save('personalForm')"
            ><i class="fa fa-save"></i>
            保存
          </el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="修改密码" name="MyPwdForm" />
    <el-tab-pane label="电子签名" name="MySignatureForm" />
  </el-tabs>
</template>

<script>
import SimpleUpload from "../../components/common/SimpleUpload";
import api from "../../api/index.js";

export default {
  components: { SimpleUpload: SimpleUpload },
  name: "MyInfoForm",
  data() {
    return {
      activeName: "MyInfoForm",
      personalForm: {
        office: {},
        hrStaff: {},
        userAvatar: {},
      },
      isSound: false,
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.personalForm));
          let imageArrPromise = [];
          this.imageLrz(
            data.userAvatar,
            this.personalForm.userAvatar,
            imageArrPromise
          );
          Promise.all(imageArrPromise).then((res) => {
            this.$post(api.myInfo, data)
              .then((res) => {
                window.localStorage.setItem("isSound", this.isSound);
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                }
              })
              .catch((err) => {
                console.log("err");
                this.$message.error(err.errMsg);
              });
          });
        }
      });
    },
    imageLrz(data1, data2, imageArrPromise) {
      if (data2 && !data2.url && data2.raw) {
        let p = new Promise((resolve, reject) => {
          let file = data2.raw;
          let fileType = file.type.substring(
            file.type.lastIndexOf("/") + 1,
            file.type.length
          );
          lrz(file, { width: 1280 }).then(function (rst) {
            // let img = {'imageType': fileType, 'image': rst.base64};
            data1.imageType = fileType;
            data1.image = rst.base64;
            resolve();
          });
        });
        imageArrPromise.push(p);
      }
    },
  },
  created() {
    if (window.localStorage.getItem("isSound")) {
      window.localStorage.getItem("isSound") == "true"
        ? (this.isSound = true)
        : (this.isSound = false);
    }
    this.$get(api.myInfo).then((res) => {
      var data = JSON.parse(JSON.stringify(res.data));
      this.personalForm = res.data;
    });
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "MyPwdForm") {
        this.$router.push({ path: "/myCenter/MyPwdForm" }).catch((err) => {
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
</style>
