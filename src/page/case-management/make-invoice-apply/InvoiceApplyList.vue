<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号">
              <el-input v-model="searchForm.caseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="申请开票人">
              <el-input v-model="searchForm.applyDrawer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="申请时间">
              <DataPicker
                :startValue.sync="searchForm.applyDateBegin"
                :endValue.sync="searchForm.applyDateEnd"
                valueFormat="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="申请状态" class="margin0">
              <select-from-enum
                :model.sync="searchForm.applyStatus"
                :clearable="true"
                className="multiple-select w100"
                type="flow.FlowCaseStatus"
                :modelVal="true"
              />
            </el-form-item>
          </el-col>
          <el-button
            type="primary"
            size="small"
            @click="search"
            style="float: right"
            class="el-icon-search"
            >查询</el-button
          >
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="applyTableData"
      fit
      border
      size="small"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column fixed width="55" type="selection" />
      <el-table-column
        prop="caseNo"
        label="案件编号"
        show-overflow-tooltip
        width="310px"
      >
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
      <el-table-column
        prop="applyDrawer"
        label="申请开票人"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status.label"
        label="申请状态"
        show-overflow-tooltip
      />
      <el-table-column show-overflow-tooltip prop="createDate" label="申请时间">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{
            $divideDate(scope.row.createDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="auditFlowInvoice(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="applyTableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        :org-id="orgId"
        port="invoicesApplyList"
      />
    </div>
    <el-dialog
      title="开票申请详情"
      :visible.sync="registerInvoiceDetailDia"
      :append-to-body="true"
    >
      <el-table :data="tableData" border size="small" style="width: 100%">
        <el-table-column prop="entrustInfo.entrustingUnit.name" label="委托方">
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
          prop="professionCategory.name"
          label="专业类别"
        ></el-table-column>
        <el-table-column prop="caseNo" label="案件编号"></el-table-column>
        <el-table-column prop="financeInfo.amount" label="合同金额">
          <template slot-scope="scope">
            <span v-if="scope.row.financeInfo.amount">{{
              scope.row.financeInfo.amount.cent / 100
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form
        :model="makeInvoiceForm"
        label-position="right"
        ref="makeInvoiceForm"
      >
        <el-row style="margin-top: 2%">
          <el-col :span="8"
            >发票类型：
            <span v-if="makeInvoiceForm.invoiceType">{{
              makeInvoiceForm.invoiceType
            }}</span>
          </el-col>
          <el-col :span="8"
            >开票日期：
            <span v-if="makeInvoiceForm.makeOutDate">{{
              $divideDate(makeInvoiceForm.makeOutDate)
            }}</span>
          </el-col>
          <el-col :span="8"
            >领票日期：
            <span v-if="makeInvoiceForm.receiveDate">{{
              $divideDate(makeInvoiceForm.receiveDate)
            }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 2%">
          <el-col :span="8"
            >申请开票人：
            <span v-if="makeInvoiceForm.applyDrawer">{{
              makeInvoiceForm.applyDrawer
            }}</span>
          </el-col>
          <el-col :span="8"
            >开票人：
            <span v-if="makeInvoiceForm.drawer">{{
              makeInvoiceForm.drawer
            }}</span>
          </el-col>
          <el-col :span="8"
            >递送方式：
            <span v-if="makeInvoiceForm.giveType">{{
              makeInvoiceForm.giveType
            }}</span>
          </el-col>
        </el-row>
        <div class="portlet" style="margin-top: 2%">
          <div class="portlet-header">
            <span>开票信息</span>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="makeInvoiceForm.invoiceList"
              border
              size="small"
              style="width: 100%"
            >
              <el-table-column
                prop="invoiceCode"
                label="发票代码"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.invoiceCode">{{
                    scope.row.invoiceCode
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceNo" label="发票号" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.invoiceNo">{{
                    scope.row.invoiceNo
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceAmount"
                label="开票金额"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.invoiceAmount">{{
                    scope.row.invoiceAmount
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="开票抬头" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.title">{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="taxpayerNo"
                label="纳税人识别号"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.taxpayerNo">{{
                    scope.row.taxpayerNo
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单位地址" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.address">{{ scope.row.address }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="phoneNo" label="电话号码" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.phoneNo">{{ scope.row.phoneNo }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="bank" label="开户银行" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.bank">{{ scope.row.bank }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="bankAccount"
                label="银行账号"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.bankAccount">{{
                    scope.row.bankAccount
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceReceiver"
                label="领票人"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.invoiceReceiver">{{
                    scope.row.invoiceReceiver
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.remarks">{{ scope.row.remarks }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      imageDialog = true;
                      imgs = scope.row.images;
                    "
                    >图片
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      title="开票申请详情"
      :visible.sync="batchInvoiceDetailDia"
      :append-to-body="true"
    >
      <el-form
        :model="makeInvoiceBatchForm"
        label-position="right"
        ref="makeInvoiceBatchForm"
      >
        <el-table
          :data="makeInvoiceBatchForm.invoiceList"
          ref="invoiceList"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column
            prop="invoiceStatus"
            width="120px"
            label="发票申请状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceStatus">{{
                scope.row.invoiceStatus
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="caseDto.caseNo"
            width="250px"
            label="案件编号"
          ></el-table-column>
          <el-table-column
            prop="caseDto.entrustInfo.entrustingUnit.name"
            label="委托方"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.caseDto.entrustInfo.entrustingUnit &&
                scope.row.caseDto.entrustInfo.entrustingUnit.name
                  ? scope.row.caseDto.entrustInfo.entrustingUnit.name
                  : scope.row.caseDto.entrustInfo.entrustingParty
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="caseDto.caseNo"
            width="250px"
            label="案件编号"
          ></el-table-column>
          <el-table-column
            prop="invoiceAmount.cent"
            width="100px"
            label="开票金额"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceAmount">{{
                scope.row.invoiceAmount.cent / 100
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceType.label"
            width="120px"
            label="发票类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceType.label">{{
                scope.row.invoiceType.label
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceCode" width="150px" label="发票代码">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceCode">{{
                scope.row.invoiceCode
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceNo" width="150px" label="发票号">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceNo">{{ scope.row.invoiceNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyDrawer" width="150px" label="申请开票人">
            <template slot-scope="scope">
              <span v-if="scope.row.applyDrawer">{{
                scope.row.applyDrawer
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="drawer" width="150px" label="开票人">
            <template slot-scope="scope">
              <span v-if="scope.row.drawer">{{ scope.row.drawer }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceReceiver" width="150px" label="领票人">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceReceiver">{{
                scope.row.invoiceReceiver
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="title" width="150px" label="开票抬头">
            <template slot-scope="scope">
              <span v-if="scope.row.title">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taxpayerNo" width="150px" label="纳税人识别号">
            <template slot-scope="scope">
              <span v-if="scope.row.taxpayerNo">{{
                scope.row.taxpayerNo
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="150px" label="单位地址">
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phoneNo" width="150px" label="电话号码">
            <template slot-scope="scope">
              <span v-if="scope.row.phoneNo">{{ scope.row.phoneNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bank" width="150px" label="开户银行">
            <template slot-scope="scope">
              <span v-if="scope.row.bank">{{ scope.row.bank }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bankAccount" width="150px" label="银行账号">
            <template slot-scope="scope">
              <span v-if="scope.row.bankAccount">{{
                scope.row.bankAccount
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="makeOutDate" width="150px" label="开票日期">
            <template slot-scope="scope">
              <span v-if="scope.row.makeOutDate">{{
                $divideDate(scope.row.makeOutDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveDate" width="150px" label="领票日期">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveDate">{{
                $divideDate(scope.row.receiveDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="giveType.label" width="120px" label="递送方式">
            <template slot-scope="scope">
              <span v-if="scope.row.giveType.label">{{
                scope.row.giveType.label
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" width="150px" label="备注">
            <template slot-scope="scope">
              <span v-if="scope.row.remarks">{{ scope.row.remarks }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="
                  imageDialog = true;
                  imgs = scope.row.images;
                "
                >图片
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
    <el-dialog
      title="图片"
      :visible.sync="imageDialog"
      width="30%"
      append-to-body
    >
      <span v-for="(image,index) in imgs" :key="index">
        <el-image
          style="width: 146px; height: 146px"
          :src="image.url"
          fit="fill"
        >
        </el-image>
        &nbsp;&nbsp;
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageDialog = false">取 消</el-button>
        <el-button type="primary" @click="imageDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/index";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";
export default {
  name: "InvoiceApplyList",
  data() {
    return {
      tableHeight: "600px",
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      page: { current: 1, pageSize: 30, total: 0 },
      tableData: [],
      applyTableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: {},
      registerInvoiceDetailDia: false,
      makeInvoiceForm: {
        invoiceList: [{}],
        invoiceType: "",
        makeOutDate: "",
        receiveDate: "",
        applyDrawer: "",
        giveType: "",
        drawer: "",
      }, //开票登记表单
      batchInvoiceDetailDia: false,
      makeInvoiceBatchForm: { invoiceList: [] }, //批量开票表单
      imageDialog: false,
      imgs: [],
    };
  },
  methods: {
    search() {
      let dates = this.searchForm.applyDates;
      if (dates) {
        this.searchForm.applyDateBegin = dates[0];
        this.searchForm.applyDateEnd = dates[1];
      }
      this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
      delete this.searchdata.applyDates;
    },
    auditFlowInvoice(row) {
      var caseIds = row.caseId;
      if (row.makeInvoiceType == "REGISTER") {
        this.makeInvoiceForm = {
          invoiceList: [{}],
          invoiceType: "",
          makeOutDate: "",
          receiveDate: "",
          applyDrawer: "",
          giveType: "",
          drawer: "",
        };
        var idList = caseIds.split(",");
        this.$post(api.finance + "/byCaseIds", idList)
          .then((res) => {
            this.tableData = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
        this.$get(
          api.invoicesApply + "/register-apply-info?procInsId=" + row.procInsId
        )
          .then((res) => {
            if (res.status == 200) {
              var data = res.data;
              this.makeInvoiceForm.invoiceType =
                data.flowInvoiceDtoList[0].invoiceType.label;
              this.makeInvoiceForm.makeOutDate =
                data.flowInvoiceDtoList[0].makeOutDate;
              this.makeInvoiceForm.receiveDate =
                data.flowInvoiceDtoList[0].receiveDate;
              this.makeInvoiceForm.drawer = data.flowInvoiceDtoList[0].drawer;
              this.makeInvoiceForm.applyDrawer =
                data.flowInvoiceDtoList[0].applyDrawer;
              this.makeInvoiceForm.giveType =
                data.flowInvoiceDtoList[0].giveType.label;
              data.flowInvoiceDtoList.forEach((item) => {
                item.invoiceAmount = parseFloat(item.invoiceAmount.cent / 100);
              });
              this.makeInvoiceForm.invoiceList = data.flowInvoiceDtoList;
              this.registerInvoiceDetailDia = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.makeInvoiceType == "BATCH") {
        this.makeInvoiceBatchForm = { invoiceList: [] };
        this.$get(
          api.invoicesApply +
            "/batch-apply-info?procInsId=" +
            row.procInsId +
            "&isList=Y"
        )
          .then((res) => {
            if (res.status == 200) {
              var applyInfo = res.data;
              var invoiceInfos = applyInfo.flowInvoiceDtoList;
              invoiceInfos.forEach((v, i) => {
                if (applyInfo.status.value == "PASS") {
                  if (v.invoiceStatus == "1") {
                    v.invoiceStatus = "审批不通过";
                  } else {
                    v.invoiceStatus = "审批通过";
                  }
                } else if (applyInfo.status.value == "APPLYING") {
                  if (v.invoiceStatus == "1") {
                    v.invoiceStatus = "审批不通过";
                  } else {
                    v.invoiceStatus = "申请中";
                  }
                } else if (applyInfo.status.value == "REFUSE") {
                  v.invoiceStatus = "审批不通过";
                }
                v.invoiceAmount = {
                  cent:
                    v.caseDto.financeInfo.amountReceivable.cent -
                    v.caseDto.financeInfo.invoiceAmount.cent,
                };
                this.makeInvoiceBatchForm.invoiceList.push(v);
              });
              this.batchInvoiceDetailDia = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  watch: {
    orgId: function () {
      this.searchForm = {};
    },
  },
  computed: {
    ...mapState("login", ["orgId"]),
  },
  created() {
    this.tableHeight = window.innerHeight - commonNum.tableBottom + 42 + "px";
    this.$store.dispatch("login/headerTitleChange", "发票申请列表");
  },
};
</script>

<style scoped>
</style>