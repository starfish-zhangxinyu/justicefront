<template>
  <div>
    <CaseDetail :case-id="caseId"></CaseDetail>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="委托鉴定事项" name="entrustMatterTab">
        <el-table
          border
          size="small"
          :data="entrustMatterTable"
          style="width: 100%"
        >
          <el-table-column
            prop="entrustingMatter.name"
            label="委托事项"
          ></el-table-column>
          <el-table-column
            prop="entrustingSubMatterName"
            label="细项"
          ></el-table-column>
          <el-table-column
            prop="entrustingMatterTargetList"
            label="被鉴定对象/样本"
          >
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.entrustingMatterTargetList"
                :key="index"
              >
                {{ index == 0 ? null : "，" }}{{ item.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column
            prop="entrustingMatter.standardList"
            label="检验标准"
          >
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.entrustingMatterStandardList"
                :key="index"
              >
                {{ index == 0 ? null : "，" }}{{ item.standard.name }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="收费项目" name="payItemTab">
        <el-table
          :span-method="arraySpanMethod"
          border
          size="small"
          :data="payItemTable"
          style="width: 100%"
        >
          <el-table-column prop="chargingItem.name" label="收费项目">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItem">{{
                scope.row.chargingItem.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fiCaseChargeType" label="收费类别">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItem.chargingType">{{
                scope.row.chargingItem.chargingType.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="unitPrice.yuanFmt" label="单价">
            <template slot-scope="scope">
              <span v-if="scope.row.unitPrice">{{
                parseInt(scope.row.unitPrice.cent) / 100
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="金额">
            <template slot-scope="scope">
              <span v-if="scope.row.unitPrice.yuanFmt">{{
                (scope.row.quantity * parseInt(scope.row.unitPrice.cent)) / 100
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.amount.yuanFmt"
            label="收费确认金额"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.caseCharge.chargeSource.label"
            label="收入来源"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.caseCharge.revenueType.label"
            label="收入类型"
          ></el-table-column>
          <el-table-column label="收费确认日期">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.confirmDate
                "
              >
                {{
                  $divideDate(scope.row.fiCaseChargeItem.caseCharge.confirmDate)
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="缴费方">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.paymentUnit
                "
              >
                {{
                  scope.row.fiCaseChargeItem.caseCharge.paymentUnit.name
                }}</span
              >
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.payer
                "
              >
                {{ scope.row.fiCaseChargeItem.caseCharge.payer }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.createBy
                "
              >
                {{
                  scope.row.fiCaseChargeItem.caseCharge.createBy.hrStaff.name
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.createDate
                "
              >
                {{
                  $divideDate(scope.row.fiCaseChargeItem.caseCharge.createDate)
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: 20px">
      <el-col :span="2" :offset="11">
        <el-button
          type="success"
          size="mini"
          class="save-btn"
          @click="refuse"
          :v-if="queryStatus"
          ><i class="fa fa-save"></i>
          不予受理
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" class="save-btn" @click="confirm"
          ><i></i>确认通过
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CaseDetail from "../../components/common/CaseDetail";
import api from "../../api/index";

export default {
  name: "FinancialConfirmation",
  components: { CaseDetail: CaseDetail },
  data() {
    return {
      caseId: "",
      activeName: "entrustMatterTab",
      entrustMatterTable: null,
      payItemTable: null,
      queryStatus: null,
      spanArr: [],
    };
  },
  methods: {
    transform(arr) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].standard.name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    divideDate(date) {
      var arr = date.split(" ");
      return arr[0];
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      var exceptColArr = [6, 7, 8, 9, 10, 11, 12];
      if (exceptColArr.indexOf(columnIndex) == -1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    //不予受理
    refuse() {
      this.$get(
        api.confirmFinancial +
          "/confirm?caseId=" +
          this.$route.query.caseId +
          "&procInsId=" +
          this.$route.query.procInsId +
          "&taskId=" +
          this.$route.query.taskId +
          "&approved=0"
      )
        .then((res) => {
          if (res.status == 200) {
            /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
            this.$router.go(-1); //为了保持筛选状态
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //确认通过
    confirm() {
      this.$get(
        api.confirmFinancial +
          "/confirm?caseId=" +
          this.$route.query.caseId +
          "&procInsId=" +
          this.$route.query.procInsId +
          "&taskId=" +
          this.$route.query.taskId +
          "&approved=1"
      )
        .then((res) => {
          if (res.status == 200) {
            /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
            this.$router.go(-1); //为了保持筛选状态
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    activeName: {
      handler(newVal, oldVal) {
        if (newVal == "entrustMatterTab") {
          if (!this.entrustMatterTable) {
            this.$get(
              "/api/ca-case/v1/cases/entrusting-matter/" +
                this.$route.query.caseId
            )
              .then((res) => {
                if (res.status == 200) {
                  this.entrustMatterTable = res.data;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          if (!this.payItemTable) {
            this.$get(
              "/api/ca-charging-item/v1/ca-charging-items?caseId=" +
                this.$route.query.caseId
            )
              .then((res) => {
                if (res.status == 200) {
                  this.payItemTable = [];
                  var tempItemList = [];
                  res.data.forEach((v) => {
                    if (
                      v.fiCaseChargeItemList &&
                      v.fiCaseChargeItemList.length > 0
                    ) {
                      v.fiCaseChargeItemList.forEach((v1) => {
                        if (v1.amount) {
                          var data = JSON.parse(JSON.stringify(v));
                          data.fiCaseChargeItem = v1;
                          this.payItemTable.push(data);
                        } else {
                          var data = JSON.parse(JSON.stringify(v));
                          this.payItemTable.push(data);
                        }
                      });
                    } else {
                      this.payItemTable.push(v);
                    }
                  });
                  if (tempItemList.length > 0) {
                    tempItemList.forEach((v) => {
                      var flag = true;
                      this.payItemTable.forEach((v1) => {
                        if ((v1.chargingItem.id = v.chargeItem.id)) {
                          flag = false;
                        }
                      });
                      if (flag) {
                        this.payItemTable.push(v);
                      }
                    });
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      },
      immediate: true,
    },
    payItemTable: {
      handler(newVal, oldVal) {
        if (this.payItemTable) {
          this.getSpanArr(this.payItemTable);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "财务确认");
    this.caseId = this.$route.query.caseId;
    this.queryStatus = this.$route.query.status;
    this.$get(
      "/api/ca-case/v1/cases/entrusting-matter/" + this.$route.query.caseId
    )
      .then((res) => {
        if (res.status == 200) {
          this.entrustMatterTable = res.data;
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