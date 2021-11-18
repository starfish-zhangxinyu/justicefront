<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="收费项目列表" name="list"></el-tab-pane>
    <el-tab-pane :label="isAdd ? '收费项目添加' : '收费项目修改'" name="form">
      <el-form
        :model="addForm"
        size="small"
        ref="payForm"
        :rules="rules"
        label-width="150px"
      >
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="收费项目名称" prop="name">
              <el-input v-model.trim="addForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="专业类别" prop="professionCategoryList">
              <select-from-table
                className="w100"
                :model.sync="addForm.professionCategoryList"
                :clearable="true"
                :multiple="true"
                port="profession"
              >
                <template>
                  <el-option
                    label="全部类别"
                    :value="{ id: 'ALL', name: '全部专业' }"
                  ></el-option>
                </template>
              </select-from-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="收费类型" prop="chargingType">
              <el-select
                v-model="addForm.chargingType"
                class="w100"
                placeholder="请选择"
                value-key="key"
              >
                <el-option
                  v-for="item in opt"
                  :key="item.key"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="价格限额下限" prop="minPrice">
              <el-input v-model="addForm.minPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="价格限额上限" prop="maxPrice">
              <el-input v-model.number="addForm.maxPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="addForm.price"></el-input>
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
            @click="save('payForm')"
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
    <!-- <el-tab-pane label="收费项目导入" name="import"></el-tab-pane>-->
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";

export default {
  name: "Form",
  data() {
    var validatePrice = (rule, value, callback) => {
      if (
        value &&
        this.addForm.minPrice &&
        parseInt(value) < parseInt(this.addForm.minPrice)
      ) {
        callback(new Error("价格上限需比价格下限大"));
      } else {
        callback();
      }
    };
    var validatelimitPrice = (rule, value, callback) => {
      if (
        (value &&
          this.addForm.minPrice &&
          this.addForm.maxPrice &&
          parseInt(value) < parseInt(this.addForm.minPrice)) ||
        parseInt(value) > parseInt(this.addForm.maxPrice)
      ) {
        callback(new Error("价格需在上下限之间！"));
      } else {
        callback();
      }
    };
    return {
      activeName: "",
      isAdd: true,
      addForm: { maxPrice: "", minPrice: "" },
      opt: [],
      // maxPrice: [{validator: validatePrice, trigger: 'blur'}],
      // limitPrice: [{validator: validatelimitPrice, trigger: 'blur'}]
      rules: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        professionCategoryList: [
          { required: true, message: "该输入项为必填项!", trigger: "change" },
        ],
        chargingType: [
          { required: true, message: "该输入项为必填项!", trigger: "change" },
        ],
        minPrice: [
          {
            type: "number",
            trigger: "blur",
            required: false,
            message: "下限必须为数字值",
            transform(value) {
              return _.toNumber(value);
            },
          },
          { validator: validatePrice, trigger: "blur" },
        ],
        maxPrice: [
          {
            type: "number",
            trigger: "blur",
            required: false,
            message: "上限必须为数字值",
            transform(value) {
              return _.toNumber(value);
            },
          },
          { validator: validatePrice, trigger: "blur" },
        ],
        price: [
          {
            type: "number",
            trigger: "blur",
            required: true,
            message: "单价必须为数字值",
            transform(value) {
              return _.toNumber(value);
            },
          },
          { validator: validatelimitPrice, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.addForm));
          data.price = { cent: data.price * 100 };
          if (data.minPrice && data.minPrice != "") {
            data.minPrice = { cent: data.minPrice * 100 };
          } else {
            data.minPrice = undefined;
          }
          if (data.maxPrice && data.maxPrice != "") {
            data.maxPrice = { cent: data.maxPrice * 100 };
          } else {
            data.maxPrice = undefined;
          }
          //增加
          if (this.isAdd) {
              this.$post(api.chargeItem, data).then((res) => {
                  if (res.status == 200) {
                      this.$message({
                          message: '新增成功！',
                          type: 'success'
                      });
                      this.$router.push({path: '/auth/chargingitems/list'}).catch(err => {
                          console.log(err)
                      });
                      this.$refs[formName].resetFields();
                  }
              }).catch((err) => {
                  console.log(err)
              })
          } else {
              this.$put(api.chargeItem + '/' + data.id, data).then((res) => {
                  if (res.status == 200) {
                      this.$message({
                          message: '修改成功！',
                          type: 'success'
                      });
                      this.$router.push({path: '/auth/chargingitems/list'}).catch(err => {
                          console.log(err)
                      });
                      this.$refs[formName].resetFields();
                  }
              })
          }
        } else {
          this.$message.error("请输入必填项");
        }
      });
    },
  },
  created() {
    this.activeName = "form";
    this.$get(api.chargingType)
      .then((res) => {
        this.opt = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    if (this.$route.query.id) {
      this.isAdd = false;
      this.$get(api.chargeItem + "/" + this.$route.query.id).then((res) => {
        var data = JSON.parse(JSON.stringify(res.data));

        data.price = data.price.cent / 100;
        if (data.minPrice) {
          data.minPrice = data.minPrice.cent / 100;
        }
        if (data.maxPrice) {
          data.maxPrice = data.maxPrice.cent / 100;
        }
        this.addForm = data;
        console.log("this.addForm", this.addForm);
      });
    } else {
      this.isAdd = true;
    }
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.$router.push({ path: "/auth/chargingitems/list" }).catch((err) => {
          console.log(err);
        });
      }
      if (newval == "import") {
        this.$router
          .push({ path: "/auth/chargingitems/import" })
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