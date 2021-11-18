<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="专业类别列表" name="list"></el-tab-pane>
    <el-tab-pane :label="isAdd ? '专业类别添加' : '专业类别修改'" name="form">
      <el-form
        :model="addForm"
        size="small"
        ref="majorForm"
        :rules="rule"
        label-width="150px"
      >
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="类别名称" prop="name">
              <el-input v-model.trim="addForm.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item label="专业类别类型" prop="type">
              <select-from-enum
                className="w100"
                :model.sync="addForm.type"
                :clearable="true"
                type="base.ProfessionType"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="类别代码" prop="typeNo">
              <el-input v-model="addForm.typeNo" :maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="归属部门" prop="office.name">
              <select-department
                data_type="person"
                :model.sync="addForm.office"
                className="multiple-select"
              ></select-department>
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item label="排列顺序" prop="sort">
              <el-input v-model.number="addForm.sort"></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item label="备注">
              <el-input v-model="addForm.remark" type="textarea"></el-input>
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
            @click="save('majorForm')"
            ><i class="fa fa-save"></i> 保存
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="mini"
            class="save-btn"
            @click="activeName = 'list'"
            ><i class="el-icon-arrow-left"></i> 返回
          </el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";

export default {
  name: "Form",
  data() {
    var nameDistinct = (rule, value, callback) => {
      if (this.isAdd && this.addForm.type) {
        this.$get(api.profession + "/distinct/name", {
          name: value,
          type: this.addForm.type.label,
        })
          .then((res) => {
            if (!res.data) {
              callback(new Error("所选专业类别下已存在'" + value + "'！"));
            } else {
              callback();
            }
          })
          .catch((err) => {
            callback(new Error("服务器错误！"));
          });
      } else {
        callback();
      }
    };
    return {
      activeName: "",
      isAdd: null,
      addForm: { office: {} },
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { min: 1, max: 60, message: "最多输入60个字符!", trigger: "blur" },
          { validator: nameDistinct, trigger: "blur" },
        ],
        type: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        typeNo: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        "office.name": [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            var data = JSON.parse(JSON.stringify(this.addForm));
            this.$post(api.profession, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                  this.$router
                    .push({ path: "/auth/professioncategories/list" })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            var data = JSON.parse(JSON.stringify(this.addForm));
            delete data.createBy;
            delete data.updateBy;
            this.$put(api.profession + "/" + this.addForm.id, data).then(
              (res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.$router
                    .push({ path: "/auth/professioncategories/list" })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              }
            );
          }
        }
      });
    },
  },
  created() {
    this.activeName = "form";
    if (this.$route.query.id) {
      this.isAdd = false;
      this.$get(api.profession + "/" + this.$route.query.id).then((res) => {
        var data = JSON.parse(JSON.stringify(res.data));
        this.addForm = data;
      });
    } else {
      this.isAdd = true;
    }
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.$router
          .push({ path: "/auth/professioncategories/list" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped></style>
