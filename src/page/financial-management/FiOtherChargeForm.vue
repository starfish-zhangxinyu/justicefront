<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="其他业务收入列表" name="list"></el-tab-pane>
    <el-tab-pane
      :label="isAdd ? '其他业务收入添加' : '其他业务收入修改'"
      name="form"
    >
      <el-form :model="addForm" size="small" ref="addForm" label-width="150px">
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="确认日期" prop="confirmDate">
              <el-date-picker
                class="w100"
                v-model="addForm.confirmDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="来源方式" prop="chargeSource">
              <select-from-dict
                data_type="charge_source"
                className="w100"
                :model.sync="addForm.chargeSource"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="付款方" prop="payment">
              <el-radio v-model="payment" :disabled="disabled" label="0"
                >单位</el-radio
              >
              <el-radio v-model="payment" :disabled="disabled" label="1"
                >个人</el-radio
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="付款单位"
              prop="paymentUnit"
              v-if="payment != '1'"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-table
                :model.sync="addForm.paymentUnit"
                port="entrustingUnitNor"
                :clearable="true"
                :filterable="true"
                :disabled="disabled"
                className="multiple-select"
              />
            </el-form-item>
            <el-form-item
              label="付款人"
              prop="payer"
              v-if="payment == '1'"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-input v-model="addForm.payer" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="专业类别"
              prop="professionCategoryIds"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-table
                :model.sync="addForm.professionCategoryIds"
                port="profession"
                :multiple="true"
                :model-id="true"
                className="multiple-select"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="来源类别" prop="sourceCategory">
              <select-from-dict
                data_type="source_category_type"
                className="w100"
                :model.sync="addForm.sourceCategory"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="收入类型"
              prop="revenueType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                :model.sync="addForm.revenueType"
                className="w100"
                data_type="revenue_type"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="确认费用"
              prop="amount"
              :rules="$filter_rules({ required: true, type: 'number' })"
            >
              <el-input-number
                :precision="2"
                size="mini"
                v-model="addForm.amount"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="addForm.remarks" type="textarea"></el-input>
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
            @click="save('addForm')"
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
import api from "../../api/index";

export default {
  name: "Form",
  data() {
    return {
      isAdd: null,
      activeName: "",
      payment: "0", //判断付款方是单位还是个人，默认单位
      addForm: { professionCategoryIds: [] }, //新增其他业务收入
      disabled: false,
    };
  },
  methods: {
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      if (data.amount) {
        data.amount = { cent: (data.amount * 100).toFixed(0) };
      }
      if (this.payment == "0") {
        data.payer = "";
      } else {
        data.paymentUnit = { id: "" };
      }
      if (data.paymentUnit == "") {
        data.paymentUnit = { id: "" };
      }
      var professionCategoryId = "";
      for (let i = 0; i < data.professionCategoryIds.length; i++) {
        professionCategoryId =
          professionCategoryId + data.professionCategoryIds[i] + ",";
      }
      professionCategoryId = professionCategoryId.substr(
        0,
        professionCategoryId.length - 1
      );
      data.professionCategoryId = professionCategoryId;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            var flag = true;
            var p1 = new Promise((resolve, reject) => {
              if (this.payment != "0") {
                //付款方为个人时需判断这个人是否已存在，并给出提示
                this.$get(api.otherCharge, { entrustingUnitId: data.payer })
                  .then((res) => {
                    if (res.status == 200) {
                      if (
                        res.data &&
                        res.data.list &&
                        res.data.list.length > 0
                      ) {
                        flag = false;
                        this.$confirmBox("该付款人已存在，是否继续保存？")
                          .then((res) => {
                            flag = true;
                            resolve();
                          })
                          .catch((err) => {
                            resolve();
                          });
                      } else {
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  })
                  .catch((err) => {
                    this.$message.error(err.errMsg);
                  });
              } else {
                resolve();
              }
            });
            Promise.all([p1]).then(() => {
              if (flag) {
                this.$post(api.otherCharge, data)
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "新增成功！",
                        type: "success",
                      });
                      this.$router
                        .push({
                          path: "/fi/financial-management/fiOtherChargeList",
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                      this.$refs[formName].resetFields();
                    }
                  })
                  .catch((err) => {
                    this.$message.error(err.errMsg);
                  });
              }
            });
          } else {
            this.$put(api.otherCharge + "/" + data.id, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.$router
                    .push({
                      path: "/fi/financial-management/fiOtherChargeList",
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                this.$message.error(
                  err.errMsg.replace("{professionCategory}", err.extraInfo)
                );
              });
          }
        }
      });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.$router
          .push({ path: "/fi/financial-management/fiOtherChargeList" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  created() {
    this.activeName = "form";
    if (this.$route.query.id) {
      this.isAdd = false;
      this.$get(api.otherCharge + "/" + this.$route.query.id).then((res) => {
        var data = JSON.parse(JSON.stringify(res.data));
        data.amount = data.amount.cent / 100;
        data.professionCategoryIds = data.professionCategoryId.split(",");
        this.addForm = data;
        if (data.payer != undefined && data.payer != "") {
          this.payment = "1";
        }
        if (data.caseIds && data.caseIds.length > 0) {
          this.disabled = true;
        }
      });
    } else {
      this.isAdd = true;
    }
  },
};
</script>

<style scoped>
</style>