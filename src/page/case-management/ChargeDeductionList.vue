<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form
        :model="searchForm"
        size="small"
        label-width="100px"
        ref="searchForm"
      >
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" prop="professionCategoryId">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :model-id="true"
                :clearable="true"
                className="multiple-select"
                :orgId="orgId"
              />
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
                :orgId="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件状态">
              <select-from-enum
                :model.sync="searchForm.caseStatus"
                :clearable="true"
                type="ca.CaseStatus"
                :modelVal="true"
                className="multiple-select"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" class="margin0">
              <el-input v-model="searchForm.caseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="第一鉴定人" class="margin0">
              <select-qualification
                dataScope="caseData"
                profession_category="ALL"
                qualification_type="AUTH"
                :filterable="true"
                className="multiple-select"
                :model.sync="searchForm.firstAuthId"
                :orgId="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-button-group style="float: right" class="clearfix">
            <el-button
              size="small"
              class="el-icon-more"
              @click="moreSearchDialog = true"
              >更多</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="el-icon-search"
              >查询</el-button
            >
          </el-button-group>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible="moreSearchDialog" @close="moreSearchDialog = false">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="收费状态">
              <el-select
                v-model="searchForm.chargeStatus"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="未收费" value="0"></el-option>
                <el-option label="部分收费" value="1"></el-option>
                <el-option label="已收全" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="被鉴定对象">
              <el-input v-model="searchForm.authenticatedTarget"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定助理">
              <select-qualification
                profession_category="ALL"
                dataScope="caseData"
                qualification_type="ASSIST"
                :filterable="true"
                className="multiple-select"
                :model.sync="searchForm.assistId"
                :orgId="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="结算状态">
              <el-select
                v-model="searchForm.settleStatus"
                :clearable="true"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option value="Y" label="已结算"></el-option>
                <el-option value="N" label="未结算"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="申请时间">
              <DataPicker
                :startValue.sync="searchForm.applyDateBegin"
                :endValue.sync="searchForm.applyDateEnd"
                valueFormat="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="金额">
              <el-col :span="11">
                <el-form-item class="margin0">
                  <el-input v-model="searchForm.amountFrom"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center"
                >-</el-col
              >
              <el-col :span="11">
                <el-form-item class="margin0">
                  <el-input v-model="searchForm.amountTo"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="申请状态">
              <select-from-enum
                :model.sync="searchForm.applyStatus"
                :clearable="true"
                className="multiple-select"
                type="flow.FlowCaseStatus"
                list-type="discount"
                :modelVal="true"
              ></select-from-enum>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moreSearchDialog = false">取消</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </el-dialog>
    <el-button-group style="margin-bottom: 10px">
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:discount:export')"
        @click="exportExcel()"
        >导出列表</el-button
      >
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:discount:cancel')"
        @click="cancelDiscount()"
        >取消费用减免</el-button
      >
    </el-button-group>
    <el-table
      :data="tableData"
      fit
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      size="small"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column fixed width="55" type="selection"></el-table-column>
      <el-table-column
        prop="caseDto.entrustInfo.entrustingUnit.name"
        show-overflow-tooltip
        label="委托方"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.caseDto.entrustInfo.entrustingUnit &&
            scope.row.caseDto.entrustInfo.entrustingUnit.name != null &&
            scope.row.caseDto.entrustInfo.entrustingUnit.name != ""
              ? scope.row.caseDto.entrustInfo.entrustingUnit.name
              : scope.row.caseDto.entrustInfo.entrustingParty
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="caseDto.caseNo" label="案件编号" width="250px">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{
              path: '/case/case-detail',
              query: { id: scope.row.caseDto.id },
            }"
            style="text-decoration: none"
          >
            <el-link
              type="primary"
              style="font-size: 12px"
              >{{ scope.row.caseDto.caseNo ? scope.row.caseDto.caseNo : "无" }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="caseDto.entrustInfo.authenticatedTarget"
        show-overflow-tooltip
        label="鉴定对象"
      >
      </el-table-column>
      <el-table-column
        prop="caseDto.professionCategory.name"
        show-overflow-tooltip
        width="100px"
        label="专业类别"
      >
      </el-table-column>
      <el-table-column
        prop="caseDto.assist.participant.hrStaff.name"
        show-overflow-tooltip
        label="鉴定助理"
      >
      </el-table-column>
      <el-table-column
        prop="caseDto.auth1.participant.hrStaff.name"
        show-overflow-tooltip
        label="第一鉴定人"
      >
      </el-table-column>
      <el-table-column
        prop="caseDto.caseStatus.label"
        show-overflow-tooltip
        label="案件状态"
      >
      </el-table-column>
      <el-table-column
        prop="caseDto.chargeStatus"
        show-overflow-tooltip
        label="收费状态"
      >
        <template slot-scope="scope">
          {{
            scope.row.caseDto.chargeStatus == 0
              ? "未收费"
              : scope.row.caseDto.chargeStatus == 1
              ? "部分收费"
              : "已收全"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="settleStatus"
        show-overflow-tooltip
        label="结算状态"
      >
      </el-table-column>
      <el-table-column prop="reason" show-overflow-tooltip label="减免原因">
      </el-table-column>
      <el-table-column
        prop="status.label"
        show-overflow-tooltip
        label="申请状态"
      >
      </el-table-column>
      <el-table-column prop="createDate" show-overflow-tooltip label="申请时间">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{
            $divideDate(scope.row.createDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="audit(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        ref="pagination"
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="flowCaseDeductionList"
        :orgId="orgId"
      >
      </pagination>
    </div>
    <el-dialog
      title="费用减免申请"
      :visible.sync="auditResultDialog"
      :append-to-body="true"
    >
      <el-row>
        <el-col :span="8" :offset="1">
          <span>减免原因： </span>
          <span v-if="caseDeductionAmount.reason">{{
            caseDeductionAmount.reason
          }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-table
          :data="caseDeductionAmount.flowRefundDiscountItemList"
          size="mini"
          :summary-method="getSummaries"
          show-summary
          border
          fit
        >
          <el-table-column
            prop="fiCaseChargeSumByItem.chargingItem.name"
            label="收费项目"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeSumByItem.chargingItem.chargingType.name"
            label="收费类型"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeSumByItem.amount.yuanFmt"
            label="合同金额"
          ></el-table-column>
          <el-table-column
            label="退费金额"
            prop="fiCaseChargeSumByItem.refund.yuanFmt"
          ></el-table-column>
          <el-table-column
            label="待收金额"
            prop="fiCaseChargeSumByItem.notReceived.yuanFmt"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeSumByItem.actualReceivable.yuanFmt"
            label="实收金额"
          ></el-table-column>
          <!--<el-table-column label="已减免金额" prop="fiCaseChargeSumByItem.discount.yuanFmt"></el-table-column>-->
          <el-table-column
            prop="amount.yuanFmt"
            label="减免金额"
          ></el-table-column>
          <el-table-column
            label="减免后待收金额"
            prop="fiCaseChargeSumByItem.newNotReceived"
            min-width="100%"
          >
            <template slot-scope="scope">
              <span v-if="caseDeductionAmount.status.value == 'APPLYING'">
                {{
                  scope.row.amount.yuanFmt
                    ? (scope.row.fiCaseChargeSumByItem.notReceived.cent -
                        scope.row.amount.cent) /
                      100
                    : null
                }}
              </span>
              <span v-else>
                {{
                  scope.row.amount.yuanFmt
                    ? scope.row.fiCaseChargeSumByItem.notReceived.yuanFmt
                    : null
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-col :span="8" :offset="1">
          <span>审批状态： </span>
          <span v-if="caseDeductionAmount.status">{{
            caseDeductionAmount.status.label
          }}</span>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="margin-left: 20px">
        <el-button @click="auditResultDialog = false" size="mini"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/index";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import SelectClient from "../../components/common/SelectClient";
import commonNum from "../../utils/commonNum";
import { mapState } from "vuex";

export default {
  components: {
    "select-qualification": SelectFromQualification,
    "select-client": SelectClient,
  },
  name: "ChargeDeductionList",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      innerPanClass: {
        sm: { span: 24 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      moreSearchDialog: false,
      page: { current: 1, pageSize: 30, total: 0 },
      tableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: { entrustingUnit: {} },

      //选择框相关
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},

      auditResultForm: {},
      auditResultDialog: false,
      caseDeductionAmount: { status: {} },
    };
  },
  inject: ["hasPermission"],
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  watch: {
    orgId: function (newVal, oldVal) {
      // this.init()
      //清空表单
      this.searchForm = { entrustingUnit: {} };
    },
  },
  methods: {
    search() {
      this.moreSearchDialog = false;
      let dates = this.searchForm.applyDates;
      if (dates) {
        this.searchForm.applyDateBegin = dates[0];
        this.searchForm.applyDateEnd = dates[1];
      }
      this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
      delete this.searchdata.applyDates;
    },
    handleCheckBox(rows) {
      //rows是数组，返回是当前页已选是数据 [ { .. } , { ... }, .. ]
      var curpage = this.page.current; //当前页码，具体由自己写的组件取值
      this.selectData[curpage] = [];
      if (rows.length > 0) {
        rows.forEach((item) => {
          if (item && item.id !== undefined) {
            //确保返回的已选数据有效，至于是否用id判断由具体的数据决定
            this.selectData[curpage].push(item);
          }
        });
      }
      this.handleSelectDataLength(); //该方法是计算一共选择的数据条数
    },
    handleSelectDataLength() {
      this.selectDataLength = 0;
      this.selectRows = [];
      for (let key in this.selectData) {
        if (this.selectData.hasOwnProperty(key)) {
          //避免原型属性影响
          this.selectDataLength += this.selectData[key].length / 1;
          //“length/1” 除以1，转化为数值，避免字符串的影响
          this.selectData[key].forEach((item) => {
            this.selectRows.push(item); //将所有选择的行数据，存到selectRows数组中
          });
        }
      }
    },
    audit(row) {
      this.auditResultDialog = true;
      if (this.$refs.auditResultForm) {
        this.$refs.auditResultForm.resetFields();
      }
      this.$get(api.caseChargeFlow + "/get", {
        procInsId: row.procInsId,
        caseId: row.caseDto.id,
      })
        .then((res) => {
          this.caseDeductionAmount = res.data;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    confirmApply() {
      this.$refs["auditResultForm"].validate((valid) => {
        if (valid) {
          this.caseDeductionAmount.auditResult = this.auditResultForm;
          this.caseDeductionAmount.flowRefundDiscountItemList.forEach(
            (item) => {
              item.chargingItem = item.fiCaseChargeSumByItem.chargingItem;
            }
          );
          this.$put(api.caseChangeAmountAudit, this.caseDeductionAmount)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "成功",
                  type: "success",
                });
                this.auditResultDialog = false;
                this.search();
              }
            })
            .catch((res) => {
              console.log(res);
              this.$message({
                message: res.errMsg,
                type: "error",
              });
            });
        }
      });
    },
    exportExcel() {
      var exportExcelSearchData = null;
      var idList = "";
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList = idList + data.id + ",";
        }
        exportExcelSearchData = { idList: idList };
      } else {
        exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      }
      this.$axios
        .get(api.flowCaseDeductionList + "/export", {
          params: exportExcelSearchData,
          responseType: "blob",
        })
        .then((res) => {
          let {
            data: { data },
          } = res;
          if (!data) return;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "费用减免列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
    cancelDiscount() {
      var cancelSearchData = null;
      var idList = [];
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList.push(data.id);
        }
        cancelSearchData = { idList: idList, type: "DISCOUNT" };
      } else {
        this.$message.error("请选择需要取消费用减免记录！");
        return;
      }
      this.$confirm("确定取消费用减免?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$put(api.CancelCaseChange, cancelSearchData)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "取消成功！",
                  type: "success",
                });
                this.search();
              }
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getSummaries: function (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        var property = "";
        if (column.property) {
          property = column.property.replace("yuanFmt", "cent");
        }
        const values = data.map((item) => {
          var value = item;
          if (property == "fiCaseChargeSumByItem.newNotReceived") {
            if (this.caseDeductionAmount.status.value == "APPLYING") {
              value =
                value.fiCaseChargeSumByItem.notReceived.cent -
                value.amount.cent;
            } else {
              value = value.fiCaseChargeSumByItem.notReceived.cent;
            }
          } else {
            var propertyList = property.split(".");
            propertyList.forEach((v) => {
              value = value[v];
            });
          }
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
      });
      return sums;
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "费用减免列表");
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
};
</script>

<style scoped>
</style>