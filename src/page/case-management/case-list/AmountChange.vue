<template>
  <div>
    <CaseDetail :case-id="caseId"></CaseDetail>
    <Portlet title="费用异动前">
      <template slot="body">
        <el-table
          :data="amountChangeDetailListBefore"
          fit
          stripe
          border
          size="mini"
          style="width: 100%"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column prop="chargingItem.name" label="收费项目">
          </el-table-column>
          <el-table-column
            prop="chargingItem.chargingType.name"
            label="收费类型"
          >
          </el-table-column>
          <el-table-column prop="unitPrice.yuanFmt" label="单价">
          </el-table-column>
          <el-table-column prop="quantity" label="数量"> </el-table-column>
          <el-table-column prop="total" label="金额">
            <template slot-scope="scope">
              {{ (scope.row.unitPrice.cent * scope.row.quantity) / 100 }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Portlet>
    <Portlet title="费用异动后">
      <template slot="body">
        <el-table
          :data="amountChangeDetailListAfter"
          fit
          stripe
          border
          size="mini"
          style="width: 100%"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column prop="chargingItem.name" label="收费项目">
          </el-table-column>
          <el-table-column
            prop="chargingItem.chargingType.name"
            label="收费类型"
          >
          </el-table-column>
          <el-table-column prop="unitPrice.yuanFmt" label="单价">
          </el-table-column>
          <el-table-column prop="quantity" label="数量"> </el-table-column>
          <el-table-column prop="total" label="金额">
            <template slot-scope="scope">
              {{ (scope.row.unitPrice.cent * scope.row.quantity) / 100 }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Portlet>
    <el-form
      ref="form"
      label-width="150px"
      size="small"
      :model="form"
      class="demo-ruleForm"
      label-position="right"
      style="margin-top: 20px"
    >
      <el-row>
        <el-col :lg="{ span: 12 }">
          <el-form-item label="异动原因">
            <span v-if="form.reason">{{ form.reason }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 12 }">
          <el-form-item
            label="审批结果"
            prop="auditResult.approved"
            :rules="$filter_rules({ required: true })"
          >
            <el-select
              v-model="form.auditResult.approved"
              placeholder="请选择"
              style="width: 100%"
              :clearable="true"
            >
              <el-option label="通过" value="true"></el-option>
              <el-option label="不通过" value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-top: 20px">
      <el-col :span="2" :offset="11">
        <el-button
          type="success"
          size="mini"
          class="save-btn"
          @click="save('form')"
          ><i class="fa fa-save"></i> 保存
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" class="save-btn" @click="goBack()"
          ><i class="el-icon-arrow-left"></i> 返回
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Portlet from "../../layout/Portlet";
import caseDetail from "../../../components/common/CaseDetail";
import api from "../../../api/index";

export default {
  name: "AmountChange",
  components: { Portlet: Portlet, CaseDetail: caseDetail },
  data() {
    return {
      caseId: "",
      taskId: "",
      procInsId: "",
      form: { auditResult: { approved: "" } },
      amountChangeDetailListAfter: [],
      amountChangeDetailListBefore: [],
    };
  },
  methods: {
    //表格合计
    getSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1 || index === 2) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property === "quantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        const value = data.map((item) =>
          Number((item.unitPrice.cent * item.quantity) / 100)
        );
        if (column.property === "total") {
          sums[index] = value.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      this.sums = sums;
      return sums;
    },
    goBack() {
      this.$router.go(-1);
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.form));
          data.procInsId = this.$route.query.procInsId;
          data.taskId = this.$route.query.taskId;
          this.$put(api.caseChange + "/audit", data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                });
              }
              this.$router.go(-1);
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        }
      });
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "费用异动审批");
    this.caseId = this.$route.query.caseId;
    this.taskId = this.$route.query.taskId;
    this.procInsId = this.$route.query.procInsId;
    var data = {
      caseId: this.caseId,
      procInsId: this.procInsId,
    };
    this.$get(api.caseChange + "/amount", data)
      .then((res) => {
        if (res.status == 200) {
          this.amountChangeDetailListAfter =
            res.data.amountChangeDetailListAfter;
          this.amountChangeDetailListBefore =
            res.data.amountChangeDetailListBefore;
          this.form = JSON.parse(JSON.stringify(res.data));
          this.form.auditResult = { approved: "" };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>