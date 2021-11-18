<template>
  <div id="FiOtherChargeCaseList">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="110px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :model-id="true"
                :clearable="true"
                :org-id="orgId"
                className="multiple-select"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号">
              <el-input
                v-model="searchForm.caseNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="流水号">
              <el-input
                v-model="searchForm.serialNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位类型">
              <select-from-dict
                :model.sync="searchForm.entrustingUnitTypeId"
                data_type="ex_unit_type"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                @keyup="search"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托方">
              <select-from-table
                :model.sync="searchForm.entrustingUnitId"
                port="allEntrustingUnit"
                :model-id="true"
                className="multiple-select"
                allow-create
                :clearable="true"
                :filterable="true"
                :org-id="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="收入类型">
              <select-from-dict
                :model.sync="searchForm.revenueTypeId"
                data_type="revenue_type"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                @keyup="search"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="确认日期">
              <DataPicker
                :startValue.sync="searchForm.confirmedDateStart"
                :endValue.sync="searchForm.confirmedDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
                valueFormat2="yyyy/MM/dd 23:59:59"
                :isValueFormat2="true"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="确认金额">
              <el-col :span="11">
                <el-input
                  v-model="searchForm.confirmAmountFrom"
                  @keyup.enter.native="search"
                ></el-input>
              </el-col>
              <el-col :span="2" style="text-align: center">
                <span style="color: #606266; text-align: center">至</span>
              </el-col>
              <el-col :span="11">
                <el-input
                  v-model="searchForm.confirmAmountTo"
                  @keyup.enter.native="search"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="备注">
              <el-input
                v-model="searchForm.remarks"
                @keyup.enter.native="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 1, offset: 21 }">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="color: white"
              @click="search"
              >查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      fit
      border
      :summary-method="getSummaries"
      show-summary
      :data="tableData"
      size="mini"
      style="width: 100%"
    >
      <el-table-column width="250px" prop="caseNo" label="案件编号">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ path: '/case/case-detail', query: { id: scope.row.id } }"
            style="text-decoration: none"
          >
            <el-link type="primary" style="font-size: 12px"
              >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        width="110px"
        label="流水号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="professionCategory.name"
        label="专业类别"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="entrustInfo.entrustingUnit.name"
        label="委托方"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.entrustInfo.entrustingUnit &&
            scope.row.entrustInfo.entrustingUnit.name
              ? scope.row.entrustInfo.entrustingUnit.name
              : scope.row.entrustInfo.entrustingParty
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="entrustInfo.contact.name"
        label="联系人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="entrustInfo.authenticatedTarget"
        label="鉴定对象"
      ></el-table-column>
      <el-table-column prop="createDate" width="100px" label="登记日期">
        <template slot-scope="scope">
          <span>{{ $divideDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="acceptDate" width="100px" label="受理日期">
        <template slot-scope="scope">
          <span v-if="scope.row.acceptDate">{{
            $divideDate(scope.row.acceptDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="entrustingDate" width="100px" label="委托日期">
        <template slot-scope="scope">
          <span v-if="scope.row.entrustingDate">{{
            $divideDate(scope.row.entrustingDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="happenDate" width="100px" label="案发日期">
        <template slot-scope="scope">
          <span v-if="scope.row.happenDate">{{
            $divideDate(scope.row.happenDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reportOutDate" width="100px" label="出案日期">
        <template slot-scope="scope">
          <span v-if="scope.row.reportOutDate">{{
            $divideDate(scope.row.reportOutDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="giveDate" width="100px" label="发放日期">
        <template slot-scope="scope">
          <span v-if="scope.row.giveInfo && scope.row.giveInfo.giveDate">{{
            $divideDate(scope.row.giveInfo.giveDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createBy.hrStaff.name"
        label="登记人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="assist.participant.hrStaff.name"
        label="鉴定助理"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth1.participant.hrStaff.name"
        label="第一鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth2.participant.hrStaff.name"
        label="第二鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth3.participant.hrStaff.name"
        label="第三鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="authorizedSignatory.participant.hrStaff.name"
        label="授权签字人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="sales.participant.hrStaff.name"
        label="市场人员"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="financeInfo.amount.yuanFmt"
        label="合同金额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="fiCaseChargeList"
        label="付款方"
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.fiCaseChargeList.length > 0 &&
              scope.row.fiCaseChargeList[0].paymentUnit
            "
            >{{ scope.row.fiCaseChargeList[0].paymentUnit.name }}</span
          >
          <span
            v-if="
              scope.row.fiCaseChargeList.length > 0 &&
              scope.row.fiCaseChargeList[0].payer
            "
            >{{ scope.row.fiCaseChargeList[0].payer }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="fiCaseChargeList[0].chargeSource.label"
        label="收费来源"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="financeInfo.amountReceivedDate"
        label="收费确认日期"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.financeInfo.amountReceivedDate">{{
            $divideDate(scope.row.financeInfo.amountReceivedDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="financeInfo.amountRefund.yuanFmt"
        label="退费金额"
      ></el-table-column>
      <el-table-column
        prop="financeInfo.discount.yuanFmt"
        label="减免金额"
      ></el-table-column>
      <el-table-column
        prop="financeInfo.actualReceivable.yuanFmt"
        label="实收金额"
      ></el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchData"
        :org-id="orgId"
        port="otherChargeCaseList"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
import { mapState } from "vuex";

export default {
  name: "FiOtherChargeCaseList",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      searchForm: { entrustingUnit: {}, otherChargeId: this.$route.query.id },
      tableData: [],
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      searchData: { otherChargeId: this.$route.query.id },
      tablesort: [], //从后台获取的数据
    };
  },
  methods: {
    search() {
      let data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.confirmAmountFrom) {
        data.confirmAmountFrom = data.confirmAmountFrom * 100;
      }
      if (data.confirmAmountTo) {
        data.confirmAmountTo = data.confirmAmountTo * 100;
      }
      this.searchData = data;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index >= 23) {
          var property = "";
          if (column.property) {
            property = column.property.replace("yuanFmt", "cent");
          }
          const values = data.map((item) => {
            var value = item;
            var propertyList = property.split(".");
            propertyList.forEach((v) => {
              value = value[v];
            });
            return Number(value);
          });
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index] / 100;
          }
        }
      });
      return sums;
    },
  },
  watch: {
    orgId: function () {
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState("login", ["orgId"]),
  },
  created() {},
};
</script>

<style scoped lang="less">
.el-table {
  overflow: auto;
}
.el-table__header-wrapper,
.el-table__body-wrapper,
.el-table__footer-wrapper {
  overflow: visible;
}
.el-table__body-wrapper {
  overflow-x: visible !important;
}
.el-table::after {
  position: relative;
}
</style>