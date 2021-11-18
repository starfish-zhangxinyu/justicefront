<template>
  <div id="case-quantity-detail">
    <!-- <el-button type="primary" size="mini" style="margin-bottom: 10px" @click="goBack">
            <i class="fa fa-sign-out"></i>返回
        </el-button> -->
    <el-button
      type="primary"
      size="mini"
      style="margin-bottom: 10px"
      @click="exportList()"
    >
      <i class="fa fa-sign-out"></i>导出
    </el-button>

    <div class="el-table-self" style="width: 100%">
      <el-table
        class="table-fixed"
        fit
        border
        size="mini"
        @sort-change="sortChange"
        :data="tableData"
        :max-height="tableHeight"
        :sort.sync="tablesort"
        :row-class-name="tableRowClassName"
        show-summary
        :summary-method="getSummaries"
        style="width: 100%"
      >
        <el-table-column
          prop="serialNumber"
          sortable="custom"
          label="流水号"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="caseNo"
          sortable="custom"
          label="案件编号"
          width="210"
        >
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
          prop="entrustInfo.entrustingUnit.name"
          label="委托方"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.entrustInfo.entrustingUnit &&
              scope.row.entrustInfo.entrustingUnit.name != null &&
              scope.row.entrustInfo.entrustingUnit.name != ""
                ? scope.row.entrustInfo.entrustingUnit.name
                : scope.row.entrustInfo.entrustingParty
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="entrustInfo.contact.name"
          label="委托方联系人"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="entrustInfo.authenticatedTarget"
          label="鉴定对象"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="professionCategory.name"
          label="专业类别"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="entrustingDate"
          sortable="custom"
          width="100"
          label="委托日期"
        >
        </el-table-column>
        <el-table-column
          prop="acceptDate"
          sortable="custom"
          width="100"
          label="受理日期"
        >
        </el-table-column>
        <el-table-column
          prop="issuerDate"
          width="100"
          sortable="custom"
          label="签发日期"
        >
        </el-table-column>
        <el-table-column
          prop="reportOutDate"
          width="100"
          sortable="custom"
          label="出案日期"
        >
        </el-table-column>
        <el-table-column
          prop="giveDate"
          width="100"
          sortable="custom"
          label="发放日期"
        >
        </el-table-column>
        <el-table-column prop="archiveDate" width="100" label="归档日期">
        </el-table-column>
        <el-table-column
          prop="saleStaff.participant.label"
          label="市场人员"
          width="100"
        />
        <el-table-column
          prop="assist.participant.label"
          label="鉴定助理"
          width="100"
        />
        <el-table-column
          prop="auth1.participant.label"
          label="第一鉴定人"
          width="100"
        />
        <el-table-column
          prop="auth2.participant.label"
          label="第二鉴定人"
          width="100"
        />
        <el-table-column
          prop="auth3.participant.label"
          label="第三鉴定人"
          width="100"
        />
        <el-table-column
          prop="reviewer.participant.label"
          label="复核人"
          width="100"
        />
        <el-table-column
          prop="authorizedSignatory.participant.label"
          label="授权签字人"
          width="100"
        />
        <el-table-column
          prop="issuer.participant.label"
          label="签发人"
          width="100"
        />
        <el-table-column
          prop="labStaff.participant.label"
          label="实验人员"
          width="100"
        />
        <el-table-column
          width="100"
          prop="financeInfo.amountReceivable.yuanFmt"
          label="应收金额"
        >
        </el-table-column>
        <!-- <el-table-column
          width="100"
          prop="financeInfo.amountReceived.yuanFmt"
          label="已收金额"
        >
        </el-table-column> -->
        <el-table-column
          width="100"
          prop="financeInfo.actualReceivable.yuanFmt"
          label="实收金额"
        >
        </el-table-column>
        <el-table-column
          width="100"
          prop="financeInfo.amountReceivedDate"
          label="收费确认日期"
        >
        </el-table-column>
        <el-table-column
          width="100"
          prop="financeInfo.notReceived.yuanFmt"
          label="待收金额"
        >
        </el-table-column>
        <el-table-column
          width="100"
          prop="financeInfo.invoiceAmount.yuanFmt"
          label="开票金额"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="caseQuantityDetail"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import { mapState } from "vuex";
import commonNum from "../../utils/commonNum";

export default {
  name: "CaseQuantityDetail",
  data() {
    return {
      tableData: [],
      tablesort: null,
      searchdata: {},
      tableHeight: "600px",
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
    };
  },
  methods: {
    /* goBack() {
      this.$router.go(-1);
    }, */
    getSummaries({ columns, data }) {
      const sums = [];
      if (data.length != 0) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].property != undefined) {
            let t = columns[i].property.split(".");
            if (t.length == 1) {
              if (data[data.length - 1] != null) {
                sums[i] = data[data.length - 1][t[0]];
              }
            } else if (t.length == 2) {
              if (data[data.length - 1][t[0]] != null) {
                sums[i] = data[data.length - 1][t[0]][t[1]];
              } else {
                sums[i] = "";
              }
            } else if (t.length == 3) {
              if (
                data[data.length - 1][t[0]] != null &&
                data[data.length - 1][t[0]][t[1]] != null
              ) {
                sums[i] = data[data.length - 1][t[0]][t[1]][t[2]];
              } else {
                sums[i] = "";
              }
            }
          }
        }
      }
      sums[0] = "合计";
      this.sums = sums;
      return sums;
    },
    tableRowClassName(row, index) {
      if (row.row.id == null) {
        return "hidden-row";
      }
      return "";
    },
    exportList() {
      this.$postFormData2(api.caseDetailExport, { id: this.$route.query.id })
        .then((res) => {
          this.download(
            res.data,
            res.headers["content-disposition"].split("=")[1]
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    download(data, name) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "案件量统计详情.xls");
      document.body.appendChild(link);
      link.click();
    },
    sortChange(obj) {
      this.tablesort = JSON.parse(JSON.stringify(obj));
      if (obj.order == "ascending") {
        this.tablesort.order = "ASC";
      } else if (obj.order == "descending") {
        this.tablesort.order = "DESC";
      } else {
        this.tablesort = null;
        return;
      }
      var prop = this.tablesort.prop;
      if (prop == "caseNo") {
        this.tablesort.prop = "cc.case_no";
      } else if (prop == "serialNumber") {
        this.tablesort.prop = "cc.serial_number";
      } else if (prop == "entrustingDate") {
        this.tablesort.prop = "cc.entrusting_date";
      } else if (prop == "acceptDate") {
        this.tablesort.prop = "cc.accept_date";
      } else if (prop == "reportOutDate") {
        this.tablesort.prop = "cc.report_out_date";
      } else if (prop == "giveDate") {
        this.tablesort.prop = "cgi.give_date";
      } else if (prop == "archiveDate") {
        this.tablesort.prop = "ca.archive_date";
      } else if (prop == "createDate") {
        this.tablesort.prop = "cc.create_date";
      } else if (prop == "issuerDate") {
        this.tablesort.prop = "cc.issue_date";
      }
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
  created() {
    this.$store.dispatch("login/headerTitleChange", "案件量统计详情");
    this.searchdata = { id: this.$route.query.id };
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
};
</script>

<style lang="less">
.el-table .hidden-row {
  display: none;
}
</style>
