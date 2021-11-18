<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                :org-id="orgId"
              ></select-from-table>
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
                :org-id="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-button-group style="float: right">
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
            <el-form-item label="鉴定助理">
              <select-qualification
                dataScope="caseData"
                profession_category="ALL"
                qualification_type="ASSIST"
                :filterable="true"
                className="multiple-select"
                :model.sync="searchForm.assistId"
                :org-id="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="收费状态" prop="chargeStatus">
              <el-select
                v-model="searchForm.chargeStatus"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="未收费" value="0"></el-option>
                <el-option label="部分收费" value="1"></el-option>
                <el-option label="全部收费" value="2"></el-option>
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
            <el-form-item label="被鉴定对象">
              <el-input v-model="searchForm.authenticatedTarget"></el-input>
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
            <el-form-item label="异动后总金额">
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
        v-if="hasPermission('auth:amountChange:export')"
        @click="exportExcel()"
        >导出列表</el-button
      >
      <!--            <el-button type="primary" size="small" v-if="hasPermission('auth:amountChange:export')" @click="cancelChange()">取消异动</el-button>-->
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
        width="100px"
        show-overflow-tooltip
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
      <el-table-column prop="reason" show-overflow-tooltip label="异动原因">
      </el-table-column>
      <el-table-column
        prop="amountChangeBefore.yuanFmt"
        show-overflow-tooltip
        label="异动前金额"
      >
      </el-table-column>
      <el-table-column
        prop="amountChangeAfter.yuanFmt"
        show-overflow-tooltip
        label="异动后金额"
      >
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
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="audit(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="flowCaseChangeList"
        :org-id="orgId"
      >
      </pagination>
    </div>
    <el-dialog
      title="审批意见"
      :visible.sync="auditResultDialog"
      :append-to-body="true"
    >
      <el-row>
        <el-col :span="5" :offset="1">异动原因：</el-col>
        <span v-if="caseChangeAmount.reason">{{
          caseChangeAmount.reason
        }}</span>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-table
          :data="caseChangeAmount.amountChangeDetailListBefore"
          border
          fit
          :header-cell-style="{ 'text-align': 'center' }"
          size="mini"
        >
          <el-table-column label="变更前的收费项目">
            <el-table-column
              prop="chargingItem.name"
              label="收费项目"
            ></el-table-column>
            <el-table-column
              prop="chargingItem.chargingType.name"
              label="收费类型"
            ></el-table-column>
            <el-table-column
              prop="unitPrice.yuanFmt"
              label="单价"
            ></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-table
          :data="caseChangeAmount.amountChangeDetailListAfter"
          border
          fit
          :header-cell-style="{ 'text-align': 'center' }"
          size="mini"
        >
          <el-table-column label="变更后的收费项目">
            <el-table-column
              prop="chargingItem.name"
              label="收费项目"
            ></el-table-column>
            <el-table-column
              prop="chargingItem.chargingType.name"
              label="收费类型"
            ></el-table-column>
            <el-table-column
              prop="unitPrice.yuanFmt"
              label="单价"
            ></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-col :span="8">
          <span>异动前金额：</span>
          <span v-if="caseChangeAmount.amountChangeBefore">{{
            caseChangeAmount.amountChangeBefore.yuanFmt
          }}</span>
        </el-col>
        <el-col :span="8">
          <span>异动后金额：</span>
          <span v-if="caseChangeAmount.amountChangeAfter">{{
            caseChangeAmount.amountChangeAfter.yuanFmt
          }}</span>
        </el-col>
        <el-col :span="8">
          <span>审批状态：</span>
          <span v-if="caseChangeAmount.status">{{
            caseChangeAmount.status.label
          }}</span>
        </el-col>
      </el-row>
      <el-row> </el-row>
      <!--            <el-form :model="auditResultForm"-->
      <!--                     v-if="caseChangeAmount.status.value == 'APPLYING'"-->
      <!--                     ref="auditResultForm"-->
      <!--                     :inline="true"-->
      <!--                     style="margin-top: 2%">-->
      <!--                <el-row>-->
      <!--                    <el-col :span="12">-->
      <!--                        <el-form-item label="审批结果" prop="approved"-->
      <!--                                      :rules="$filter_rules({required: true, trigger: 'change'})">-->
      <!--                            <el-select v-model="auditResultForm.approved"-->
      <!--                                       size="mini"-->
      <!--                                       :clearable="true">-->
      <!--                                <el-option value="true" label="是">是</el-option>-->
      <!--                                <el-option value="false" label="否">否</el-option>-->
      <!--                            </el-select>-->
      <!--                        </el-form-item>-->
      <!--                    </el-col>-->
      <!--                    <el-col :span="12">-->
      <!--                        <el-form-item label="审批建议" prop="comment" :rules="$filter_rules({required: true})">-->
      <!--                            <el-input v-model="auditResultForm.comment" size="mini"></el-input>-->
      <!--                        </el-form-item>-->
      <!--                    </el-col>-->
      <!--                </el-row>-->
      <!--            </el-form>-->
      <div slot="footer" class="dialog-footer" style="margin-left: 20px">
        <el-button @click="auditResultDialog = false" size="mini"
          >取 消</el-button
        >
        <!--                <el-button type="primary" @click="confirmApply" size="mini"-->
        <!--                           v-if="caseChangeAmount.status.value == 'APPLYING'">确 定-->
        <!--                </el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/index";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import SelectClient from "../../components/common/SelectClient";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";
export default {
  components: {
    "select-qualification": SelectFromQualification,
    "select-client": SelectClient,
  },
  name: "CostChangeList",
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
      page: {
        pageSizes: [10, 30, 50, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
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
      caseChangeAmount: { status: {} },
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
      this.auditResultDialog = true;
      if (this.$refs.auditResultForm) {
        this.$refs.auditResultForm.resetFields();
      }
      this.$get(api.caseChangeAmount, { procInsId: row.procInsId })
        .then((res) => {
          this.caseChangeAmount = res.data;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    confirmApply() {
      this.$refs["auditResultForm"].validate((valid) => {
        if (valid) {
          this.caseChangeAmount.auditResult = this.auditResultForm;
          this.$put(api.caseChangeAmountAudit, this.caseChangeAmount)
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
        .get(api.flowCaseChangeList + "/export", {
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
          link.setAttribute("download", "费用异动列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
    cancelChange() {
      var cancelSearchData = null;
      var idList = [];
      if (this.selectRows.length > 0) {
        if (this.selectRows.length > 1) {
          this.$message.error("您只能选择一条费用异动记录！");
          return;
        }
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList.push(data.id);
        }
        cancelSearchData = { idList: idList, type: "AMOUNT_CHANGE" };
      } else {
        this.$message.error("请选择需要取消的费用异动记录！");
        return;
      }
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
          console.log(err);
        });
    },
  },
  watch: {
    orgId: function (newVal, oldVal) {
      this.searchForm = { entrustingUnit: {} };
      this.init();
    },
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "费用异动列表");
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
};
</script>

<style scoped>
</style>