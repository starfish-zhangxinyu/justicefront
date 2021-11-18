<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" class="marBot0">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :model-id="true"
                :clearable="true"
                className="multiple-select w100"
                :org-id="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托方">
              <select-from-table
                :model.sync="searchForm.entrustingUnitId"
                port="allEntrustingUnit"
                :model-id="true"
                className="multiple-select w100"
                allow-create
                :clearable="true"
                :filterable="true"
                :org-id="orgId"
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
                className="multiple-select w100"
              />
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
                className="multiple-select w100"
                :model.sync="searchForm.firstAuthId"
                :org-id="orgId"
              />
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
                dataScope="caseData"
                profession_category="ALL"
                qualification_type="ASSIST"
                :filterable="true"
                className="multiple-select w100"
                :model.sync="searchForm.assistId"
                :org-id="orgId"
              />
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
            <el-form-item label="退案退费情况">
              <el-select
                v-model="searchForm.abortRefundName"
                placeholder="请选择"
                style="width: 100%"
                clearable
              >
                <el-option label="退费" value="REFUND" />
                <el-option label="退案" value="ABORT_CASE" />
                <el-option label="退案退费" value="ABORT_CASE_REFUND" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="申请状态">
              <select-from-enum
                :model.sync="searchForm.applyStatus"
                :clearable="true"
                className="multiple-select w100"
                type="flow.FlowCaseStatus"
                list-type="abort"
                :modelVal="true"
              />
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
        v-if="hasPermission('auth:refund:export')"
        @click="exportExcel()"
        >导出列表
      </el-button>
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:refund:cancel')"
        @click="cancelRefund()"
        >取消退费
      </el-button>
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:abort:case:cancel')"
        @click="cancelAbortCase()"
        >撤销退案
      </el-button>
    </el-button-group>

    <!-- <el-button type="primary" size="small"
                   v-if="hasPermission('auth:refund:export')"
                   @click="exportExcel()"
                   style="margin-bottom:10px;">导出列表
        </el-button>
        <el-button type="primary" size="small" v-if="hasPermission('auth:refund:cancel')" @click="cancelRefund()">取消退费
        </el-button>-->
    <el-table
      :data="tableData"
      fit
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      @sort-change="sortChange"
      size="small"
      :max-height="tableHeight"
      style="width: 100%"
      ref="table"
    >
      <el-table-column fixed width="55" type="selection" />
      <el-table-column
        prop="caseDto.entrustInfo.entrustingUnit.name"
        show-overflow-tooltip
        label="委托方"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.caseDto.entrustInfo.entrustingUnit &&
              scope.row.caseDto.entrustInfo.entrustingUnit.name != null &&
              scope.row.caseDto.entrustInfo.entrustingUnit.name != ""
                ? scope.row.caseDto.entrustInfo.entrustingUnit.name
                : scope.row.caseDto.entrustInfo.entrustingParty
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.serialNumber"
        label="流水号"
      />
      <el-table-column
        prop="caseDto.caseNo"
        label="案件编号"
        width="250px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ path: '/case/case-detail', query: { id: scope.row.caseDto.id } }"
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
      />
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.professionCategory.name"
        label="专业类别"
      />
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.assist.participant.hrStaff.name"
        label="鉴定助理"
      />
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.auth1.participant.hrStaff.name"
        label="第一鉴定人"
      />
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.caseStatus.label"
        label="案件状态"
      />
      <el-table-column
        show-overflow-tooltip
        prop="caseDto.chargeStatus"
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
        show-overflow-tooltip
        prop="settleStatus"
        label="结算状态"
      />
      <el-table-column
        show-overflow-tooltip
        prop="abortRefundName"
        label="退案退费情况"
      />
      <el-table-column
        show-overflow-tooltip
        prop="reason"
        label="退案退费原因"
      />
      <el-table-column
        show-overflow-tooltip
        prop="status.label"
        label="申请状态"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createDate"
        label="申请时间"
        sortable="custom"
      >
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
    <div class="pagination-footer" ref="paginationFooter">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="abortRefundListApi"
        :org-id="orgId"
      />
    </div>
    <RefundDetail ref="refundDetailRef" />
  </div>
</template>

<script>
import api from "@/api/index";
import SelectFromQualification from "@/components/common/SelectFromQualification";
import RefundDetail from "./Module/ListOfRefundsDtails";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";

export default {
  components: {
    "select-qualification": SelectFromQualification,
    RefundDetail,
  },
  name: "ListOfRefunds",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      innerPanClass: {
        sm: { span: 12 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      moreSearchDialog: false,
      page: { current: 1, pageSize: 30, total: 0 },
      tableData: [],
      tableHeight: "553px",
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
      this.$refs.refundDetailRef.init(row);
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
      this.$getFormData(api.abortRefundExportApi, exportExcelSearchData)
        .then((res) => {
          let { data } = res;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "退案退费列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
    cancelRefund() {
      var cancelSearchData = null;
      var idList = [];
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList.push(data.id);
        }
        cancelSearchData = { idList: idList, type: "REFUND" };
      } else {
        this.$message.error("请选择需要取消退费的记录！");
        return;
      }

      this.$confirm("确定取消退费?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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
      });
    },
    cancelAbortCase() {
      var cancelSearchData = null;
      var idList = [];
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList.push(data.id);
        }
        cancelSearchData = { idList: idList, type: "ABORT_CASE" };
      } else {
        this.$message.error("请选择需要取消退案的记录！");
        return;
      }

      this.$confirm("确定撤销退案?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$put(api.CancelCaseChange, cancelSearchData)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "撤销成功！",
                type: "success",
              });
              this.search();
            }
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      });
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
      if (prop == "caseDto.caseNo") {
        this.tablesort.prop = "cc.caseNo";
      } else if (prop == "createDate") {
        this.tablesort.prop = "fcc.create_date";
      }
    },
  },
  watch: {
    orgId: function (newVal, oldVal) {
      this.searchForm = { entrustingUnit: {} };
    },
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "退案退费列表");
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
};
</script>

<style scoped></style>