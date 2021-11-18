<template>
  <div id="case-quantity">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="130px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="6">
            <el-form-item label="统计维度">
              <select-from-enum
                :model.sync="searchForm.caseStatisticalDimension"
                :className="'w100'"
                :modelVal="true"
                :multiple="true"
                :clearable="false"
                type="ca.StatisticalDimension"
                @options="options"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="6">
            <el-form-item label="专业类别">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :clearable="true"
                :className="'multiple-select w100'"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="6">
            <el-form-item label="委托单位">
              <select-client
                :className="'w100'"
                :model.sync="searchForm.entrustingUnit"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button-group style="float: right">
            <el-button plain size="mini" @click="openDia" icon="el-icon-more"
              >更多</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="search()"
              >查询</el-button
            >
          </el-button-group>
        </el-row>
      </el-form>
    </div>
    <el-button
      type="primary"
      size="mini"
      v-if="hasPermission('auth:statistics:caseCount:export')"
      @click="resultExport()"
    >
      <i class="fa fa-sign-out"></i>导出
    </el-button>
    <!--通用列表-->
    <Table
      v-if="
        searchdata.caseStatisticalDimension.indexOf('STATISTICAL_TYPE') == -1 &&
        searchdata.caseStatisticalDimension.indexOf('ENTRUSTING_UNIT_AREA') ==
          -1
      "
      :data.sync="tableData"
      :page.sync="page"
      :search.sync="searchdata"
      :sort.sync="tablesort"
      port="caseQuantityStatistics"
      :hasPaging="true"
      :selfDefinedBtn="true"
      :orgId="orgId"
    >
      <template solt>
        <el-table-column
          v-for="(item, i) in tabHeaderList"
          :key="i"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column
          v-if="isInvoiceType"
          prop="invoiceType"
          label="发票类型"
        />
        <el-table-column prop="countNum" label="案件量"></el-table-column>
        <el-table-column
          prop="amount.yuanFmt"
          label="合同金额"
        ></el-table-column>
        <!-- <el-table-column prop="received.yuanFmt" label="已收金额" /> -->
        <el-table-column prop="actualReceivable.yuanFmt" label="实收金额">
        </el-table-column>
        <el-table-column prop="notReceived.yuanFmt" label="待收金额">
        </el-table-column>
        <el-table-column
          prop="invoiceAmount.yuanFmt"
          label="开票金额"
          v-if="isInvoiceType"
        >
        </el-table-column>
        <el-table-column
          v-if="isInvoiceType"
          prop="invoiceCnt"
          label="开票数量"
        />
        <el-table-column prop="address" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.id !== null"
              @click="checkCaseDetail(scope.$index, scope.row)"
              >明细
            </el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              v-if="scope.row.id == null"
              disabled
              >合计
            </el-button>
            <el-button
              type="primary"
              v-if="
                historyShow &&
                scope.row.entrustInfoName != '个人委托' &&
                scope.row.entrustInfoName != '多方委托' &&
                scope.row.id !== null
              "
              size="mini"
              @click="checkCaseHistory(scope.$index, scope.row)"
              >变更历史
            </el-button>
          </template>
        </el-table-column>
      </template>
    </Table>
    <!--统计类型列表-->
    <!-- show-summary
      :summary-method="getSummaries" -->
    <el-table
      v-if="
        searchdata.caseStatisticalDimension.indexOf('STATISTICAL_TYPE') != -1
      "
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      size="mini"
      row-key="id"
      :row-class-name="tableRowClassName"
      border
      fit
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <template solt>
        <el-table-column prop="name" label="统计类型" />
        <el-table-column
          prop="caseCountStatisticsResultDto.countNum"
          label="案件量"
        />
        <el-table-column
          prop="caseCountStatisticsResultDto.amount.yuanFmt"
          label="合同金额"
        />
        <!-- <el-table-column
          prop="caseCountStatisticsResultDto.received.yuanFmt"
          label="已收金额"
        /> -->
        <el-table-column
          prop="caseCountStatisticsResultDto.actualReceivable.yuanFmt"
          label="实收金额"
        />
        <el-table-column
          prop="caseCountStatisticsResultDto.notReceived.yuanFmt"
          label="待收金额"
        />
        <!-- <el-table-column
          prop="caseCountStatisticsResultDto.invoiceAmount.yuanFmt"
          label="开票金额"
        /> -->
        <el-table-column
          prop="caseCountStatisticsResultDto.address"
          label="操作"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="
                scope.row.id !== null &&
                scope.row.children == null &&
                scope.row.caseCountStatisticsResultDto !== null
              "
              size="mini"
              @click="checkCaseDetail(scope.$index, scope.row)"
              >明细
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!--委托单位所属区域-->
    <el-table
      v-if="
        searchdata.caseStatisticalDimension.indexOf('ENTRUSTING_UNIT_AREA') !=
        -1
      "
      :data="tableData"
      style="width: 100%"
      size="mini"
      row-key="id"
      border
      :row-class-name="tableRowClassName"
      fit
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <template solt>
        <el-table-column prop="name" label="委托单位所属区域" />
        <el-table-column
          prop="caseCountStatisticsResultDto.countNum"
          label="案件量"
        />
        <el-table-column
          prop="caseCountStatisticsResultDto.amount.yuanFmt"
          label="合同金额"
        ></el-table-column>
        <!-- <el-table-column
          prop="caseCountStatisticsResultDto.received.yuanFmt"
          label="已收金额"
        /> -->
        <el-table-column
          prop="caseCountStatisticsResultDto.actualReceivable.yuanFmt"
          label="实收金额"
        />
        <el-table-column
          prop="caseCountStatisticsResultDto.notReceived.yuanFmt"
          label="待收金额"
        />
        <el-table-column
          prop="caseCountStatisticsResultDto.address"
          label="操作"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="
                scope.row.id !== null &&
                scope.row.children == null &&
                scope.row.caseCountStatisticsResultDto !== null
              "
              @click="checkCaseDetail(scope.$index, scope.row)"
              >明细
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog title="案件查询" :visible.sync="moreSearchDialog" width="1150px">
      <div>
        <!--案件基本信息-->
        <Collapse title="时间查询" :active="true">
          <template>
            <el-form :model="searchForm" size="small" label-width="130px">
              <el-row>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="登记日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginRegisterDate"
                      :endValue.sync="searchForm.endRegisterDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="委托日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginEntrustingDate"
                      :endValue.sync="searchForm.endEntrustingDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="受理日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginAcceptDate"
                      :endValue.sync="searchForm.endAcceptDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="出案日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginReportOutDate"
                      :endValue.sync="searchForm.endReportOutDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="发放日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginGiveDate"
                      :endValue.sync="searchForm.endGiveDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="归档日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginArchiveDate"
                      :endValue.sync="searchForm.endArchiveDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="案发日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginHappenDate"
                      :endValue.sync="searchForm.endHappenDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="12" :xl="12">
                  <el-form-item label="签发日期">
                    <DataPicker
                      :startValue.sync="searchForm.beginIssuerDate"
                      :endValue.sync="searchForm.endIssuerDate"
                      valueFormat="yyyy/MM/dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </Collapse>
        <Collapse title="状态查询" :active="true">
          <template>
            <el-form :model="searchForm" size="small" label-width="130px">
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="重新鉴定">
                    <el-select
                      class="w100"
                      v-model="searchForm.isRepeat"
                      :clearable="true"
                    >
                      <el-option value="Y" label="是"></el-option>
                      <el-option value="N" label="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="回避案件">
                    <el-select
                      class="w100"
                      v-model="searchForm.isWithdrawalNeed"
                      :clearable="true"
                    >
                      <el-option value="Y" label="是"></el-option>
                      <el-option value="N" label="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="加急案件">
                    <el-select
                      class="w100"
                      v-model="searchForm.isUrgent"
                      :clearable="true"
                    >
                      <el-option value="Y" label="是"></el-option>
                      <el-option value="N" label="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="发放状态">
                    <el-select
                      class="w100"
                      v-model="searchForm.isGiveInfo"
                      :clearable="true"
                    >
                      <el-option value="Y" label="已发放"></el-option>
                      <el-option value="N" label="未发放"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="收费状态">
                    <el-select
                      class="w100"
                      v-model="searchForm.chargeStatus"
                      :clearable="true"
                    >
                      <el-option value="0" label="未收费"></el-option>
                      <el-option value="1" label="部分收费"></el-option>
                      <el-option value="2" label="已收费"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="panClass.sm"
                  :md="panClass.md"
                  :lg="{ span: 8 }"
                  v-if="isInvoiceType"
                >
                  <el-form-item label="发票状态">
                    <el-select
                      class="w100"
                      v-model="searchForm.invoiceStatus"
                      :clearable="true"
                    >
                      <el-option value="NORMAL" label="正常"></el-option>
                      <el-option value="ABORT" label="已作废"></el-option>
                      <el-option value="RED" label="冲红"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </Collapse>

        <Collapse title="鉴定意见" :active="true">
          <template>
            <el-form :model="searchForm" size="small" label-width="130px">
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="检测结果">
                    <el-select
                      class="w100"
                      v-model="searchForm.finalResult"
                      :clearable="true"
                    >
                      <el-option value="Y" label="肯定"></el-option>
                      <el-option value="N" label="否定"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="是否突变">
                    <el-select
                      class="w100"
                      v-model="searchForm.mutation"
                      :clearable="true"
                    >
                      <el-option value="Y" label="是"></el-option>
                      <el-option value="N" label="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="乙醇检测结果">
                    <el-col :span="11">
                      <el-form-item
                        class="margin0"
                        prop="ethanolTestResultsMin"
                      >
                        <el-input
                          v-model="searchForm.ethanolTestResultsMin"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align: center"
                      >-</el-col
                    >
                    <el-col :span="11">
                      <el-form-item
                        class="margin0"
                        prop="ethanolTestResultsMax"
                      >
                        <el-input
                          v-model="searchForm.ethanolTestResultsMax"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="毒物毒品类别">
                    <el-select
                      :clearable="true"
                      value-key="id"
                      class="w100"
                      v-model="searchForm.poisonType"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in poisonCategoryOpt"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="毒物毒品名称">
                    <select-from-table
                      :className="'w100'"
                      :model.sync="searchForm.poisonName"
                      port="poison"
                      :modelId="true"
                      :clearable="true"
                      :org-id="orgId"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="定性结果">
                    <el-select
                      class="w100"
                      v-model="searchForm.qualitativeResult"
                      :clearable="true"
                    >
                      <el-option value="POSITIVE" label="阳性"></el-option>
                      <el-option value="NEGATIVE" label="阴性"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="定量结果">
                    <el-input
                      width="60px"
                      v-model="searchForm.quantitativeResult"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="伤残鉴定级别" prop="disabilityLevelId">
                    <select-from-dict
                      :model.sync="searchForm.disabilityLevelId"
                      :clearable="true"
                      :className="'w100'"
                      data_type="disability_level"
                      :modelId="true"
                      :org-id="orgId"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="损伤程度" prop="damageDegreeId">
                    <select-from-dict
                      :model.sync="searchForm.damageDegreeId"
                      :clearable="true"
                      :className="'w100'"
                      data_type="damage_degree"
                      :modelId="true"
                      :org-id="orgId"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="车速" prop="speedMin">
                    <el-col :span="11">
                      <el-input
                        v-model="searchForm.speedMin"
                        :clearable="true"
                      ></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-input
                        v-model="searchForm.speedMax"
                        :clearable="true"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item
                    label="文书鉴定意见"
                    prop="documentConclusionId"
                  >
                    <select-from-dict
                      :model.sync="searchForm.documentConclusionId"
                      :clearable="true"
                      :className="'w100'"
                      data_type="document_conclusion"
                      :modelId="true"
                      :org-id="orgId"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
                  <el-form-item label="鉴定意见">
                    <el-input
                      width="60px"
                      v-model="searchForm.audioVisualSuggest"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </Collapse>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </el-dialog>
    <InitChart ref="initChart" />
    <CaseQuantityHistory ref="caseQuantityHistory" />
  </div>
</template>

<script>
import Select2 from "../../components/common/Select2";
import api from "../../api";
import { getFormData, post, get } from "../../api/http";
import Collapse from "@/page/layout/Collapse";
import CaseQuantityHistory from "./Module/CaseQuantityHistory.vue";
import InitChart from "./Module/InitStatisticalChart";
import { mapState } from "vuex";

export default {
  name: "CaseQuantity",
  components: { Select2, InitChart, Collapse, CaseQuantityHistory },
  data() {
    return {
      isInvoiceType: false, //统计维度是否选择了发票类型
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      lastSearchDataType: "", //保存上一次搜索统计维度
      searchForm: {
        caseStatisticalDimension: "",
        orgId: null,
        invoiceStatus: "NORMAL",
      },
      tableData: [],
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tablesort: null,
      searchdata: { caseStatisticalDimension: [] },
      moreSearchDialog: false,
      orgList: [],
      isNotOrg: false,
      poisonCategoryOpt: [],
      allTabHeaderList: [
        {
          prop: "professionCategoryName",
          label: "专业类别",
          value: "PROFESSION_CATEGORY",
        },
        {
          prop: "entrustInfoName",
          label: "委托单位",
          value: "ENTRUSTING_UNIT",
        },
        {
          prop: "entrustInfoType",
          label: "委托单位类别",
          value: "ENTRUSTING_UNIT_TYPE",
        },
        {
          prop: "entrustInfoArea",
          label: "委托单位所属区域",
          value: "ENTRUSTING_UNIT_AREA",
        },
        {
          prop: "entrustInfoPrefecture",
          label: "委托单位辖区",
          value: "UNIT_PREFECTURE",
        },
        {
          prop: "caseCategory",
          label: "案件种类",
          value: "CASE_KIND",
        },
        {
          prop: "caseType",
          label: "案件类型",
          value: "CASE_TYPE",
        },
        {
          prop: "caseStat",
          label: "统计类型",
          value: "STATISTICAL_TYPE",
        },
        {
          prop: "acceptStationName",
          label: "受理地点",
          value: "ACCEPT_STATION",
        },
        {
          prop: "authenticatedItem",
          label: "鉴定项目",
          value: "ENTRUSTING_MATTER",
        },
        {
          prop: "chargingType",
          label: "收费类型",
          value: "CHARGE_TYPE",
        },
        {
          prop: "giveStatus",
          label: "发放状态",
          value: "GIVE_STATUS",
        },
        {
          prop: "settleStatus",
          label: "结算状态",
          value: "SETTLEMENT_STATUS",
        },
        {
          prop: "chargeStatus",
          label: "收费状态",
          value: "CHARGE_STATUS",
        },
      ],
      tabHeaderList: [],
    };
  },
  inject: ["hasPermission"],
  methods: {
    //统计表格合计
    /*  getSummaries({ columns, data }) {
      console.log("columns",columns)
      console.log("data",data)
     const sums = [];
      for (let i = 0; i < columns.length; i++) {
        let t = columns[i].property.split(".");
        if (t.length == 1) {
          sums[i] = data[data.length - 1][t[0]];
        } else if (t.length == 2) {
          if (data[data.length - 1][t[0]] != null) {
            sums[i] = data[data.length - 1][t[0]][t[1]];
          } else {
            sums[i] = "";
          }
        }
        sums[0] = "合计"
      }
      this.sums = sums;
      return sums;
    }, */
    tableRowClassName: function (row, index) {
      if (row.row.id == null) {
        return "hidden-row";
      }
      return "";
    },
    cancelDia() {
      this.moreSearchDialog = false;
    },
    openDia() {
      // this.searchForm.invoiceStatus = "NORMAL"
      this.moreSearchDialog = true;
    },
    initChartFn() {
      this.$refs.initChart.init();
    },
    search() {
      this.searchdata = this.dataProcessing(); //处理一次表单对象
      this.cancelDia();
      if (this.lastSearchDataType != this.searchdata.caseStatisticalDimension) {
        this.searchForm = {
          caseStatisticalDimension: this.searchForm.caseStatisticalDimension,
          orgId: null,
          invoiceStatus: "NORMAL",
        };
        this.lastSearchDataType = this.searchdata.caseStatisticalDimension;
        this.searchdata = {
          caseStatisticalDimension: this.searchdata.caseStatisticalDimension,
          orgId: null,
          invoiceStatus: "NORMAL",
        };
      }
      if (
        this.searchdata.caseStatisticalDimension.indexOf("INVOICE_TYPE") != -1
      ) {
        this.isInvoiceType = true;
      } else {
        this.isInvoiceType = false;
      }
      if (
        this.searchdata.caseStatisticalDimension.indexOf("STATISTICAL_TYPE") !=
          -1 ||
        this.searchdata.caseStatisticalDimension.indexOf(
          "ENTRUSTING_UNIT_AREA"
        ) != -1
      ) {
        this.$get(api.caseQuantityStatistics, this.searchdata)
          .then((res) => {
            this.tableData = res.data.list;
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      }
    },
    download(data, name) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", decodeURI(name));
      document.body.appendChild(link);
      link.click();
    },
    resultExport() {
      let data2 = this.dataProcessing();
      this.$getFormData(api.caseStatisticsExport, data2)
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
    dataProcessing() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.entrustingUnit) {
        data.entrustingUnitId = data.entrustingUnit.id;
        delete data.entrustingUnit;
      }
      if (
        data.caseStatisticalDimension &&
        data.caseStatisticalDimension.length > 0
      ) {
        data.caseStatisticalDimension = data.caseStatisticalDimension.join(",");
      } else {
        this.searchForm.caseStatisticalDimension = ["PROFESSION_CATEGORY"];
        data.caseStatisticalDimension = "PROFESSION_CATEGORY";
      }
      this.tabHeaderList = [];
      this.searchForm.caseStatisticalDimension.map((item, index) => {
        this.allTabHeaderList.forEach((v, i) => {
          if (v.value === item) {
            this.tabHeaderList.push(v);
          }
        });
      });
      return data;
    },
    checkCaseDetail(index, row) {
      let id = "";
      // debugger;
      if (row.id && row.id.length > 0) {
        id = row.id;
      } else if (row.caseCountStatisticsResultDto) {
        id = row.caseCountStatisticsResultDto.id;
      }
      /* this.$router.push({
        path: "/statistics/case-quantity-detail?id=" + id,
      }); */
      let url = this.$router.resolve({
        path: "/statistics/case-quantity-detail?id=" + id,
      });
      window.open(url.href); //注意，需要加href
    },
    //变更历史
    checkCaseHistory(index, row) {
      this.$refs.caseQuantityHistory.init(row);
    },
    setOrgIdSession(orgId) {
      if (orgId == undefined) {
        orgId = "";
      }
      this.$get(api.org + "/setOrgId?orgId=" + orgId)
        .then((res) => {
          //获取毒物毒品类别
          this.$get(api.poisonCategory)
            .then((res) => {
              this.poisonCategoryOpt = res.data;
            })
            .catch((err) => console.log(err));
          // this.search();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    options(options) {
      this.options = options;
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "案件量统计");
    this.$get(api.poisonCategory)
      .then((res) => {
        this.poisonCategoryOpt = res.data;
      })
      .catch((err) => console.log(err));
  },
  computed: {
    historyShow: function () {
      let str = this.searchdata.caseStatisticalDimension;
      if (str && typeof str == "string" && str.includes("ENTRUSTING_UNIT")) {
        return true;
      } else {
        return false;
      }
    },
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  watch: {
    "searchForm.caseStatisticalDimension": {
      handler(newVal, oldVal) {
        if (oldVal != null && newVal != null && newVal.length > oldVal.length) {
          if (
            oldVal.indexOf("STATISTICAL_TYPE") == 0 ||
            oldVal.indexOf("ENTRUSTING_UNIT_AREA") == 0
          ) {
            this.searchForm.caseStatisticalDimension = JSON.parse(
              JSON.stringify(oldVal)
            );
          }
          if (
            oldVal.indexOf("STATISTICAL_TYPE") == -1 &&
            oldVal.indexOf("ENTRUSTING_UNIT_AREA") == -1
          ) {
            if (
              newVal.indexOf("STATISTICAL_TYPE") != -1 ||
              newVal.indexOf("ENTRUSTING_UNIT_AREA") != -1
            ) {
              this.searchForm.caseStatisticalDimension = JSON.parse(
                JSON.stringify(oldVal)
              );
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
    orgId: {
      handler(newval, oldval) {
        this.searchForm = {
          caseStatisticalDimension: "",
          orgId: null,
          invoiceStatus: "NORMAL",
        };
        this.search();
      },
      immediate: true,
      deep: true,
    },
  },
  beforeRouteEnter(to, from, next) {
    get(api.myInfo)
      .then((res) => {
        if (res.data) {
          if (res.data.orgId == null || res.data.orgId.length == 0) {
            //获取机构
            get(api.org + "/list")
              .then((res) => {
                if (res.data) {
                  next((vm) => {
                    vm.orgList = res.data;
                    Object.assign(vm.searchForm, {
                      orgId: res.data[0].id,
                      caseStatisticalDimension: ["PROFESSION_CATEGORY"],
                    });
                    Object.assign(vm.searchdata, {
                      orgId: res.data[0].id,
                      caseStatisticalDimension: "PROFESSION_CATEGORY",
                    });

                    vm.isNotOrg = true;
                  });
                }
              })
              .catch((err) => {
                next();
              });
          } else {
            next((vm) => {
              vm.isNotOrg = false;
              Object.assign(vm.searchForm, {
                caseStatisticalDimension: ["PROFESSION_CATEGORY"],
              });
              Object.assign(vm.searchdata, {
                caseStatisticalDimension: "PROFESSION_CATEGORY",
              });
            });
          }
        }
      })
      .catch((err) => {
        next();
        console.log(err);
      });
  },
};
</script>
<style scope>
.el-table .hidden-row {
  display: none;
}
</style>
