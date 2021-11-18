<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="机构列表" name="listPage"></el-tab-pane>
      <el-tab-pane :label="isAdd ? `机构添加` : `机构修改`" name="formPage">
        <el-form
          :model="formData"
          size="small"
          ref="formData"
          label-width="120px"
        >
          <el-row>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="机构名称"
                prop="name"
                :rules="
                  $filter_rules({
                    required: true,
                    maxLength: 50,
                    trigger: 'blur',
                  })
                "
              >
                <el-input v-model.trim="formData.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="机构简称"
                prop="sampleName"
                :rules="
                  $filter_rules({
                    required: true,
                    maxLength: 8,
                    trigger: 'blur',
                  })
                "
              >
                <el-input v-model.trim="formData.sampleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="机构代码"
                prop="code"
                :rules="
                  $filter_rules({
                    required: true,
                    trigger: 'blur',
                    pattern: /^[0-9]*$/,
                    message:'请输入数字!'
                  })
                "
              >
                <el-input v-model="formData.code" :maxLength="2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="归属区域"
                prop="area"
                :rules="$filter_rules({ required: true, trigger: 'blur' })"
              >
                <treeSelect
                  title="区域"
                  :model.sync="formData.area"
                  name="area"
                ></treeSelect>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="机构类型"
                prop="orgType.value"
                :rules="$filter_rules({ required: true, trigger: 'blur' })"
              >
                <select-from-enum
                  :model.sync="formData.orgType.value"
                  :clearable="true"
                  :model-val="true"
                  :className="'w100'"
                  type="sys.OrgType"
                ></select-from-enum>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="地址" prop="address">
                <el-input v-model.trim="formData.address"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="法人" prop="legalPerson">
                <el-input v-model.trim="formData.legalPerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="机构负责人" prop="principal">
                <el-input v-model.trim="formData.principal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="统一信用代码"
                prop="uscCode"
                :rules="
                  $filter_rules({
                    required: true,
                    maxLength: 50,
                    trigger: 'blur',
                  })
                "
              >
                <el-input v-model.trim="formData.uscCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="执业类别" prop="practiceCategory">
                <el-input v-model.trim="formData.practiceCategory"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="logo">
                <SimpleUpload :model.sync="formData.logoPath"></SimpleUpload>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="有效期" prop="expireDate">
                <el-date-picker
                  v-model.trim="formData.expireDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="联系电话"
                prop="phone"
                :rules="$filter_rules({ type: 'mobile' })"
              >
                <el-input v-model.trim="formData.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item label="传真" prop="fax">
                <el-input v-model.trim="formData.fax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 12, offset: 6 }">
              <el-form-item
                label="邮件"
                prop="email"
                :rules="$filter_rules({ type: 'email' })"
              >
                <el-input v-model.trim="formData.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="save('formData')"
              :loading="saveLoading"
              ><i class="fa fa-save"></i> 保存
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              class="save-btn"
              @click="activeName = 'listPage'"
              ><i class="el-icon-arrow-left"></i> 返回
            </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/api/index.js";
import treeSelect from "@/components/common/TreeSelect.vue";
import SimpleUpload from "@/components/common/SimpleUpload";
import commonNum from "../../../utils/commonNum";

export default {
  name: "Form",
  components: { treeSelect, SimpleUpload },
  data() {
    /* const validatePass = (rule, value, callback) => {
      if (this.option) {
        callback(new Error('请选择列表中已有的选项'))
      } else {
        callback()
      }
    } */
    return {
      activeName: "formPage",
      formData: {
        id: "",
        name: "",
        sampleName: "",
        area: "",
        address: "",
        orgType: {
          value: "",
        },
        legalPerson: "",
        principal: "",
        uscCode: "",
        practiceCategory: "",
        expireDate: "",
        fax: "",
        email: "",
        logoPath: {},
      },
      isAdd: true,
      token: commonNum.createUUId(),
      saveLoading: false,
    };
  },
  methods: {
    save: function (form) {
      this.formData.districtCode = this.formData.area.code
      this.$refs[form].validate((validate) => {
        if (validate) {
          let promiseArr = [];
          this.imageZip(promiseArr);
          Promise.all(promiseArr).then((res) => {
            var headers = {};
            if (this.isAdd) {
              headers = { headers: { avoidDuplicateSubmitToken: this.token } };
            }
            this.saveLoading = true;
            this.$post(api.org, this.formData, headers)
              .then((res) => {
                if (this.isAdd) {
                  this.$message.success("新增成功！");
                } else {
                  this.$message.success("修改成功！");
                }
                this.saveLoading = false;
                this.activeName = "listPage";
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
                this.token = commonNum.createUUId();
                this.saveLoading = false;
              });
          });
        }
      });
    },
    imageZip: function (promiseArr) {
      let that = this;
      if (
        this.formData.logoPath &&
        !this.formData.logoPath.url &&
        this.formData.logoPath.raw
      ) {
        let p = new Promise((resolve, reject) => {
          let file = this.formData.logoPath.raw;
          let fileType = file.type.substring(
            file.type.lastIndexOf("/") + 1,
            file.type.length
          );
          lrz(file, { width: 1280 }).then(function (rst) {
            // let img = {'imageType': fileType, 'image': rst.base64};
            that.formData.logoPath.imageType = fileType;
            that.formData.logoPath.image = rst.base64;
            resolve();
          });
        });
        promiseArr.push(p);
      } else {
        that.formData.logoPath = null;
      }
    },
  },
  created() {
    let queryId = this.$route.query.id;
    if (queryId) {
      this.isAdd = false;
      this.formData.id = queryId;
      this.$get(api.org + "/" + queryId)
        .then((res) => {
          if (res.status == "200") {
            this.formData = res.data;
          }
        })
        .catch((err) => {});
    }
  },
  watch: {
    activeName: function (newVal, oldVal) {
      this.token = commonNum.createUUId();
      if (newVal == "listPage") {
        this.$router.push({ path: "/system/org-management/list" });
      }
    },
    "formData.area": function (newVal, oldVal) {
      // console.log("newVal", newVal);
    },
  },
};
</script>

<style scoped>
</style>