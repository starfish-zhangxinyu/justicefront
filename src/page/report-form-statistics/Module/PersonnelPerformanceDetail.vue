<template>
  <div id="IncomeDetail">
    <el-page-header @back="goBack" content="人员绩效清单详情" />
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" label-width="30%">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :clearable="true"
                :className="'multiple-select w100'"
                :changeSelect="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" label-width="30%">
              <el-input
                :clearable="true"
                v-model="searchForm.caseNo"
                class="w100"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位" label-width="30%">
              <select-client
                :model.sync="searchForm.entrustingUnitId"
                :changeSelect="orgId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象" label-width="30%">
              <el-input
                :clearable="true"
                v-model.trim="searchForm.authenticatedTarget"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="收费确认日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.amountReceivedDate.from"
                :endValue.sync="searchForm.amountReceivedDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="发放日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.giveDate.from"
                :endValue.sync="searchForm.giveDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="结算状态" label-width="30%" class="margin0">
              <el-select
                v-model="searchForm.settleStatus"
                :clearable="true"
                class="w100"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="结算日期" label-width="30%" class="margin0">
              <DataPicker
                :startValue.sync="searchForm.settleDate.from"
                :endValue.sync="searchForm.settleDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定项目" label-width="30%">
              <select-from-table
                :model.sync="searchForm.authenticatedItemId"
                port="entrustingMatter"
                :model-id="true"
                :condition="professionCategoryCondition"
                className="multiple-select"
                :orgId="orgId"
                :clearable="true"
                :filterable="true"
              />
            </el-form-item>
          </el-col>
          <el-button
            style="float: right"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search()"
            >查询</el-button
          >
        </el-row>
      </el-form>
    </div>

    <el-button-group>
      <el-button
        v-if="hasPermission('auth:person-perfermance:settle')"
        type="primary"
        size="mini"
        style="margin-bottom: 10px"
        @click="openSettlementDia()"
        >结算</el-button
      >
      <el-button
        v-if="hasPermission('auth:person-perfermance:anti-settle')"
        type="primary"
        size="mini"
        style="margin-bottom: 10px"
        @click="unSettlement()"
        >反结算</el-button
      >
      <el-button
        v-if="hasPermission('auth:statistics:person:export')"
        type="primary"
        size="mini"
        style="margin-bottom: 10px"
        @click="exportList()"
      >
        <i class="fa fa-sign-out"></i>导出
      </el-button>
    </el-button-group>
    <el-table
      fit
      border
      size="mini"
      @select-all="selectChange"
      @select="selectChange"
      :data="tableData"
      style="width: 100%"
      :max-height="tableHeight"
      :row-class-name="tableRowClassName"
      show-summary
      :summary-method="getSummaries"
      ref="caseDetailTable"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column type="index" label="序号" />
      <el-table-column prop="settleStatus" label="结算状态"> </el-table-column>
      <el-table-column prop="settleDate" label="结算日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.settleDate && scope.row.settleDate.slice(0, 10)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="confirmDate" label="收费确认日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.amountReceivedDate &&
            scope.row.amountReceivedDate.slice(0, 10)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="giveDate" label="发放日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.giveDate && scope.row.giveDate.slice(0, 10)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="caseNo" label="案件编号">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ path: '/case/case-detail', query: { id: scope.row.caseId } }"
            style="text-decoration: none"
          >
            <el-link type="primary" style="font-size: 12px"
              >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="entrustingParty" label="委托单位" />
      <el-table-column prop="authenticatedTarget" label="鉴定对象" />
      <el-table-column prop="targetCnt" label="样本数量" />
      <el-table-column prop="sales" label="市场人员" />
      <el-table-column prop="assist" label="鉴定助理" />
      <el-table-column prop="auth1" label="第一鉴定人" />
      <el-table-column prop="auth2" label="第二鉴定人" />
      <el-table-column prop="auth3" label="第三鉴定人" />
      <el-table-column prop="auth4" label="第四鉴定人" />
      <el-table-column prop="auth5" label="第五鉴定人" />
      <el-table-column prop="reviewer" label="复核人" />
      <el-table-column prop="authorizedSignatory" label="授权签字人" />
      <el-table-column prop="issuer" label="签发人" />
      <el-table-column prop="labStaffs" label="实验人员" />
      <el-table-column prop="acceptStationName" label="受理点" />
      <el-table-column prop="amount.yuanFmt" label="合同金额" />
      <el-table-column prop="discount.yuanFmt" label="减免金额" />
      <el-table-column prop="amountRefund.yuanFmt" label="退费金额" />
      <el-table-column prop="amountReceivable.yuanFmt" label="应收金额" />
      <el-table-column
        v-for="(item, index) in realList"
        :key="index"
        width="90px"
        :prop="item.key"
        :label="item.name"
      />
      <!-- <el-table-column prop="amountReceived.yuanFmt" label="已收金额" /> -->
      <el-table-column prop="amountRealReceived.yuanFmt" label="实收金额" />
      <el-table-column
        v-for="(item, index) in receivedList"
        :key="index + 100"
        width="90px"
        :prop="item.key"
        :label="item.name"
      >
      </el-table-column>
      <el-table-column prop="taxes.yuanFmt" label="税费" />
      <el-table-column
        prop="amountRealReceivedExcludeTaxes.yuanFmt"
        label="税后金额"
      />
    </el-table>
    <pagination
      :pcurrent.sync="page.current"
      :page.sync="page"
      :data.sync="tableData"
      :search.sync="searchdata"
      :sort.sync="tablesort"
      port="personPerforApi"
      postType="post"
    />

    <el-dialog title="结算" :visible.sync="settlementDia" width="400px">
      <el-form :model="settlementForm" ref="settlementForm" label-width="100px">
        <el-form-item
          label="结算日期"
          prop="settleDate"
          :rules="$filter_rules({ required: true, trigger: 'blur' })"
        >
          <el-date-picker
            v-model="settlementForm.settleDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            class="w100"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="settlementDia = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="settlementFn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api";
import Select2 from "../../../components/common/Select2";
import { mapState } from "vuex";

let caseIds;

export default {
  name: "PersonnelPerformanceDetail",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      searchForm: {
        amountReceivedDate: {},
        giveDate: {},
        settleDate: {},
      },
      tableData: [],
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: {},
      options: [
        {
          value: "N",
          label: "未结算",
        },
        {
          value: "Y",
          label: "已结算",
        },
      ],
      receivableList: [], //待收
      receivedList: [], //实收
      realList: [], //应收
      selectList: [], //选中的条件
      settlementDia: false,
      settlementForm: { settleDate: "" },
      timer: null,
      selectRows: [],
      professionCategoryCondition: { professionCategoryId: "" },
    };
  },
  inject: ["hasPermission"],
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  watch: {
    orgId: function () {
      this.$router.go(-1);
    },
    "searchForm.professionCategoryId": function (newVal, oldVal) {
      this.professionCategoryCondition = { professionCategoryId: newVal };
    },
  },
  updated() {
    /* this.$nextTick(() => {
      this.tableData.forEach((outerItem) => {
        this.selectRows[this.page.current - 1] &&
          this.selectRows[this.page.current - 1].forEach((item) => {
            if (outerItem.caseId == item.caseId) {
              this.$refs.caseDetailTable.toggleRowSelection(outerItem, true);
            }
          });
      });
    }); */
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getSummaries({ columns, data }) {
      const sums = [];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].property != undefined) {
          let t = columns[i].property.split(".");
          if (t.length == 1) {
            if (data[data.length - 1] != null) {
              sums[i] = data[data.length - 1][t[0]];
              if (sums[i] == "合计") {
                sums[i] = "";
              }
            }
          } else if (t.length == 2) {
            if (data[data.length - 1] != null) {
              if (data[data.length - 1][t[0]] != null) {
                sums[i] = data[data.length - 1][t[0]][t[1]];
                if (sums[i] == "合计") {
                  sums[i] = "";
                }
              } else {
                sums[i] = "";
              }
            }
          } else if (t.length == 3) {
            if (
              data[data.length - 1] != null &&
              data[data.length - 1][t[0]] != null &&
              data[data.length - 1][t[0]][t[1]] != null
            ) {
              sums[i] = data[data.length - 1][t[0]][t[1]][t[2]];
              if (sums[i] == "合计") {
                sums[i] = "";
              }
            } else {
              sums[i] = "";
            }
            if (data[data.length - 1] != undefined) {
              if (t[0] == "amountReceivableList[0]") {
                sums[i] =
                  data[data.length - 1].amountReceivableList[0].amountReceivable.yuanFmt;
              }
              if (t[0] == "amountReceivableList[1]") {
                sums[i] =
                  data[data.length - 1].amountReceivableList[1].amountReceivable.yuanFmt;
              }
              if (t[0] == "amountReceivableList[2]") {
                sums[i] =
                  data[data.length - 1].amountReceivableList[2].amountReceivable.yuanFmt;
              }
              if (t[0] == "amountReceivableList[3]") {
                sums[i] =
                  data[data.length - 1].amountReceivableList[3].amountReceivable.yuanFmt;
              }
              if (t[0] == "amountReceivableList[4]") {
                sums[i] =
                  data[data.length - 1].amountReceivableList[3].amountReceivable.yuanFmt;
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
      if (row.row.caseId == null) {
        return "hidden-row";
      }
      return "";
    },
    //选中回调
    selectChange(list) {
      this.selectList = list;
      //要导出的案件
      this.selectRows[this.page.current - 1] = this.selectList;
    },
    //判断选中的列表里面有没有。。。
    findName(name) {
      let bFlog = false;
      this.selectList.forEach((item) => {
        if (item.settleStatus == name) {
          bFlog = true;
          return false;
        }
      });
      return bFlog;
    },
    //打开结算弹框
    openSettlementDia() {
      if (this.selectList && this.selectList.length > 0) {
        if (this.findName("已结算")) {
          this.$message.error("请选择未结算的案件!");
          return;
        }
        this.settlementDia = true;
        Object.assign(this.settlementForm, {
          settleDate: this.$thisDate(true),
        });
      } else {
        this.$message.error("请选择需要结算的案件!");
      }
    },
    //结算
    settlementFn() {
      this.$refs.settlementForm.validate((valid) => {
        if (valid) {
          let { role, id } = this.$route.query;
          let { settleDate } = this.settlementForm;
          let caseIds = this.selectList.map((v) => v.caseId);
          /* 用于删除合计行数据存在的id为null */
          if (caseIds.includes(null)) {
            caseIds = caseIds.slice(0, caseIds.length - 1);
          }
          this.$post(api.personPerforSettleApi, {
            caseIds: caseIds,
            role: role,
            settlerId: id,
            settleDate: settleDate,
          })
            .then((res) => {
              if (res.status == 200) {
                this.search();
                this.$message.success("操作成功");
                this.settlementDia = false;
                this.selectList = [];
                this.selectRows = [];
              }
            })
            .catch((err) => this.$message.error("系统错误"));
        }
      });
    },
    //反结算
    async unSettlement() {
      let { role, id } = this.$route.query;
      if (this.selectList && this.selectList.length > 0) {
        // if(this.findName('未结算')){
        //   this.$message.error("请选择已结算的列表!");
        //   return
        // };
        let caseIds = this.selectList.map((v) => v.caseId);
        /* 用于删除合计行数据存在的id为null */
        if (caseIds.includes(null)) {
          caseIds = caseIds.slice(0, caseIds.length - 1);
        }
        try {
          let res = await this.$post(api.personPerforUnSettleApi, {
            caseIds: caseIds,
            role: role,
            settlerId: id,
          });
          if (res.status == 200) {
            this.search();
            // this.$refs.caseDetailTable.clearSelection();
            this.$message.success("操作成功");
            this.selectRows = [];
            this.selectList = [];
          }
        } catch {
          this.$message.error("系统错误");
        }
      } else {
        this.$message.error("请选择需要反结算的案件!");
      }
    },
    //导出(防抖)
    exportList() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        //导出的案件id
        let idList = [];
        console.log("this.selectRows", this.selectRows);
        if (this.selectRows.length > 0) {
          idList = this.selectRows
            .reduce((previousValue, currentValue) => {
              return previousValue.concat(currentValue);
            }, [])
            .map((item) => item.caseId);
        } else {
          //全部导出
          idList = null;
        }
        try {
          let { data, headers } = await this.$postExportJson(
            api.personPerforDetailExportApi,
            {
              idList: idList,
              statId: this.$route.query.id,
              role: sessionStorage.getItem("personnelPerformanceDetailRole"),
            }
          );
          this.$downFile(
            data,
            decodeURI(headers["content-disposition"].split("filename=")[1]) ||
              "个人绩效统计.xls"
          );
        } catch (err) {
          console.log("导出失败原因", err);
          this.$message.error("导出失败");
        }
      }, 500);
    },
    search() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
      this.searchdata.role = sessionStorage.getItem(
        "personnelPerformanceDetailRole"
      );
      this.searchdata["entrustingUnitId"] =
        this.searchdata["entrustingUnitId"] &&
        this.searchdata["entrustingUnitId"].id;
    },
    initTable() {
      this.$get(api.chargeTypeApi)
        .then((res) => {
          if (res.status == "200") {
            let arr = [],
              arr2 = [],
              arr3 = [];
            var i = res.data.forEach((item, index) => {
              arr.push({
                key: `receivableCt${item.key.substring(2, 4)}.yuanFmt`,
                name: `待收${item.name}`,
              }); //应收金额
              arr2.push({
                key: `receivedCt${item.key.substring(2, 4)}.yuanFmt`,
                name: `实收${item.name}`,
              }); //实收金额
              arr3.push({
                key: `amountReceivableList[` + index + `].amountReceivable.yuanFmt`,
                name: `应收${item.name}`,
              }); //应收金额
            });
            this.receivableList = arr;
            this.receivedList = arr2;
            this.realList = arr3;
          }
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    let id = this.$route.query.id;
    this.searchdata = {
      statId: id,
      role: sessionStorage.getItem("personnelPerformanceDetailRole"),
    };
    this.searchForm.statId = id;
    this.initTable();
    this.tableHeight = window.innerHeight - 370 + "px";
  },
  components: { Select2 },
};
</script>
<style lang="less" scoped>
/deep/.el-page-header__left {
  display: none;
}
</style>
