<template>
  <!-- 收费确认列表页面  -->
  <div id="fiCaseChargeList">
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
            <el-form-item label="确认时间">
              <DataPicker
                :startValue.sync="searchForm.confirmDateFrom"
                :endValue.sync="searchForm.confirmDateTo"
                valueFormat="yyyy/MM/dd HH:mm:ss"
                valueFormat2="yyyy/MM/dd 23:59:59"
                :isValueFormat2="true"
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
                :org-id="orgId"
                @keyup="search"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="确认金额">
              <el-col :span="11">
                <el-input
                  v-model="searchForm.amountFrom"
                  @keyup.enter.native="search"
                ></el-input>
              </el-col>
              <el-col :span="2" style="text-align: center">
                <span style="color: #606266; text-align: center">-</span>
              </el-col>
              <el-col :span="11">
                <el-input
                  v-model="searchForm.amountTo"
                  @keyup.enter.native="search"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="来源方式">
              <select-from-dict
                data_type="charge_source"
                :model.sync="searchForm.chargeSourceId"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                @keyup="search"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案号标志">
              <el-select
                class="w100"
                v-model="searchForm.caseNoFlag"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in caseMarkOpt"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
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
        <el-row> </el-row>
      </el-form>
    </div>
    <el-dialog :visible="moreSearchDialog" @close="moreSearchDialog = false">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="备注">
              <el-input
                v-model="searchForm.remarks"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="委托单位类型">
              <select-from-dict
                data_type="ex_unit_type"
                :model.sync="searchForm.unitTypeId"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                @change="fillEntrustingUnit"
                @keyup="search"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="委托方">
              <select-from-table
                :model.sync="searchForm.entrustingUnitId"
                port="allEntrustingUnit"
                :model-id="true"
                className="multiple-select"
                allow-create
                :clearable="true"
                :filterable="true"
                :condition="extrustingUnitQueryCondition"
                :orgId="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="委托单位辖区">
              <select-from-dict
                :model.sync="searchForm.prefectureId"
                :clearable="true"
                className="w100"
                data_type="prefecture_id"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="联系人">
              <el-select
                v-model="searchForm.contact"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in contactOpt"
                  :key="i"
                  :label="item != undefined ? item.name : null"
                  :value="item != undefined ? item.name : null"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="检验地点">
              <select-from-dict
                :model.sync="searchForm.authAddress"
                data_type="inspect_address"
                className="multiple-select"
                modelId="label"
                :clearable="true"
                @keyup="search"
                :orgId="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="案件编号">
              <el-input
                v-model="searchForm.caseNo"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="鉴定对象">
              <el-input
                v-model="searchForm.authenticatedTarget"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="鉴定人">
              <select-qualification
                profession_category="ALL"
                qualification_type="AUTH"
                dataScope="caseData"
                :filterable="true"
                className="multiple-select"
                :model.sync="searchForm.authId"
                :orgId="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="鉴定人角色">
              <el-select
                v-model="searchForm.authRole"
                placeholder="请选择"
                :clearable="true"
                className="multiple-select"
                style="width: 100%"
                :disabled="!searchForm.authId"
              >
                <el-option label="第一鉴定人" value="AUTH1"></el-option>
                <el-option label="第二鉴定人" value="AUTH2"></el-option>
                <el-option label="第三鉴定人" value="AUTH3"></el-option>
                <el-option label="第四鉴定人" value="AUTH4"></el-option>
                <el-option label="第五鉴定人" value="AUTH5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :sm="dialogClass.sm"
            :md="dialogClass.md"
            :xl="dialogClass.xl"
          >
            <el-form-item label="受理点">
              <select-from-table
                ref="acceptStationTable"
                :model.sync="searchForm.acceptStationId"
                port="acceptStation"
                className="multiple-select"
              ></select-from-table>
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
        style="color: white"
        v-if="hasPermission('finance:confirm:export')"
        @click="exportExcel"
        >导出
      </el-button>
    </el-button-group>
    <el-table
      :data="trueTableData"
      border
      size="mini"
      :summary-method="summation ? getSummaries : null"
      show-summary
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column label="付款方" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.payer">{{ scope.row.payer }}</span>
          <span v-if="scope.row.paymentUnit">{{
            scope.row.paymentUnit.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="caEntrustInfo.entrustingUnit.name"
        label="委托方"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.caEntrustInfo.entrustingUnit &&
            scope.row.caEntrustInfo.entrustingUnit.name
              ? scope.row.caEntrustInfo.entrustingUnit.name
              : scope.row.caEntrustInfo.entrustingParty
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="caEntrustInfo.entrustingUnit.type.label"
        show-overflow-tooltip
        label="委托方类型"
      ></el-table-column>
      <el-table-column
        width="100"
        prop="caEntrustInfo.entrustingUnit.prefecture.label"
        show-overflow-tooltip
        label="委托单位辖区"
      ></el-table-column>
      <el-table-column
        width="160"
        prop="caEntrustInfo.authenticatedTarget"
        show-overflow-tooltip
        label="鉴定对象"
      ></el-table-column>
      <el-table-column
        prop="caseNo"
        label="案件编号"
        show-overflow-tooltip
        width="250px"
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
        prop="assist.hrStaff.name"
        width="100"
        label="鉴定助理"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="auth1.hrStaff.name"
        width="100"
        label="第一鉴定人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="auth2.hrStaff.name"
        width="100"
        label="第二鉴定人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="auth3.hrStaff.name"
        width="100"
        label="第三鉴定人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="authorized_signatory.hrStaff.name"
        width="100"
        label="授权签字人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="confirmDate"
        label="确认时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.confirmDate">{{
            $divideDate(scope.row.confirmDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeSource.label"
        label="来源方式"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="revenueType.label"
        label="收入类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="remarks"
        label="备注"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="amount.yuanFmt"
        label="确认金额"
        width="100px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column width="200%" prop="address" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="hasPermission('auth:finance:charge:eidt')"
            type="warning"
            size="small"
            plain
            @click="edit(scope.$index, scope.row)"
            >修改
          </el-button>
          <el-button
            v-if="hasPermission('auth:finance:charge:del')"
            type="danger"
            size="small"
            plain
            @click="deleteRow(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
      <template v-for="v in chargeTypeData">
        <el-table-column
          :prop="v.key"
          :label="v.name"
          width="100px"
          :key="v.id"
        ></el-table-column>
      </template>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tableSort"
        :org-id="orgId"
        port="caseCharge"
      >
      </pagination>
    </div>

    <!--收费确认修改窗口开始-->
    <el-dialog
      title="收费确认修改"
      :visible.sync="showEditChargeDialog"
      width="50%"
    >
      <el-form
        :model="editChargeForm"
        label-position="right"
        ref="editChargeForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="案件编号" label-width="25%" prop="caseNo">
              <span v-if="editChargeForm.caseNo">{{
                editChargeForm.caseNo
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="付款方" label-width="25%" prop="payment">
              <el-radio
                v-model="payment"
                label="0"
                :disabled="
                  editChargeForm.fiCaseChargeOtherChargeList.length > 0
                "
                >单位
              </el-radio>
              <el-radio
                v-model="payment"
                label="1"
                :disabled="
                  editChargeForm.fiCaseChargeOtherChargeList.length > 0
                "
                >个人
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="付款单位"
              label-width="25%"
              prop="paymentUnit"
              v-if="payment == '0'"
            >
              <select-from-table
                :model.sync="editChargeForm.paymentUnit"
                port="entrustingUnit"
                :clearable="true"
                :filterable="true"
                :disabled="isUseOtherCharge"
                className="multiple-select"
              />
            </el-form-item>
            <el-form-item
              label="付款人"
              label-width="25%"
              prop="payer"
              v-if="payment == '1'"
            >
              <el-input
                v-model="editChargeForm.payer"
                :disabled="isUseOtherCharge"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="收入类型"
              label-width="50%"
              prop="abortReasonId"
            >
              <select-from-dict
                :model.sync="editChargeForm.revenueType"
                data_type="revenue_type"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item
              label="来源方式"
              label-width="50%"
              prop="chargeSource"
              :rules="$filter_rules({ required: true })"
            >
              <select-from-dict
                data_type="charge_source"
                :model.sync="editChargeForm.chargeSource"
                className="multiple-select"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="收费确认日期"
              label-width="25%"
              prop="confirmDate"
              :rules="$filter_rules({ required: true })"
            >
              <el-date-picker
                v-model="editChargeForm.confirmDate"
                size="small"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="收费确认金额"
              label-width="25%"
              prop="amount.cent"
              :rules="$filter_rules({ required: true })"
            >
              <span>{{ editChargeForm.amount.cent }}</span>
              <!--<el-input :disabled="isUseOtherCharge"
                                      v-model.number="editChargeForm.amount.cent" size="small"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="备注" label-width="25%" prop="remarks">
              <el-input
                v-model="editChargeForm.remarks"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <div class="portlet">
              <div class="portlet-header">
                <span>按收费项目的收费金额<em style="color: red">*</em></span>
              </div>
              <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                <el-table
                  :data="editChargeForm.fiCaseChargeItemList"
                  ref="fiCaseChargeItemListTemp"
                  border
                  size="small"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    prop="chargingItem.name"
                    label="收费项目"
                  ></el-table-column>
                  <el-table-column
                    prop="fiCaseChargeSumByItem.amount.yuanFmt"
                    label="合同金额"
                  ></el-table-column>
                  <el-table-column
                    prop="fiCaseChargeSumByItem.discount.yuanFmt"
                    label="减免金额"
                  ></el-table-column>
                  <el-table-column
                    prop="fiCaseChargeSumByItem.refund.yuanFmt"
                    label="退费金额"
                  ></el-table-column>
                  <!-- <el-table-column
                    prop="fiCaseChargeSumByItem.received.yuanFmt"
                    label="已收金额"
                  >
                  </el-table-column> -->
                  <el-table-column
                    prop="fiCaseChargeSumByItem.actualReceivable.yuanFmt"
                    label="实收金额"
                  ></el-table-column>
                  <el-table-column
                    prop="fiCaseChargeSumByItem.notReceived.yuanFmt"
                    label="待收金额"
                  >
                    <!--<template slot-scope="scope">-->
                    <!--<span v-if="scope.row.receivable">{{scope.row.receivable}}</span>-->
                    <!--</template>-->
                  </el-table-column>
                  <el-table-column prop="amount" label="确认收费金额">
                    <template slot-scope="scope">
                      <el-input-number
                        size="small"
                        v-if="scope.row.amount.cent > 0"
                        :disabled="isUseOtherCharge"
                        @blur="checkValue(scope.$index, scope.row)"
                        :precision="2"
                        v-model="scope.row.amount.cent"
                        controls-position="right"
                        :min="0"
                        :max="999999999"
                      />
                      <span v-else>{{scope.row.amount.cent}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditChargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCharge('editChargeForm')"
          >保存
        </el-button>
      </div>
    </el-dialog>
    <!--收费确认修改窗口结束-->
  </div>
</template>

<script>
import api from "../../api/index";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";
import BigDecimalUtils from "../../utils/BigDecimalUtils";
import SelectFromQualification from "../../components/common/SelectFromQualification";

export default {
  name: "FiCaseChargeList",
  inject: ["hasPermission"],
  components: {
    "select-qualification": SelectFromQualification,
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      dialogClass: {
        sm: { span: 24 },
        md: { span: 12 },
        xl: { span: 8, offset: 1 },
      },
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tableData: [], //从后台获取的数据
      trueTableData: [], //处理后显示的数据
      chargeTypeData: [], //收费类型，用于动态渲染财务列表表头
      tableSort: null,
      searchdata: {},
      searchForm: {},
      //收费确认修改相关
      showEditChargeDialog: false,
      editChargeForm: { amount: {}, fiCaseChargeOtherChargeList: [] }, //
      isUseOtherCharge: false, //是否使用了其他业务收入
      payment: "1", //付款方，默认为付款人
      summation: {},
      flag: true,
      extrustingUnitQueryCondition: {},
      moreSearchDialog: false,
      contactOpt: [],
      caseMarkOpt: [],
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (this.summation && this.summation["totalAmount"] != undefined) {
          if (column.property) {
            if (column.property == "amount.yuanFmt") {
              sums[index] = this.summation["totalAmount"];
            } else if (this.summation[column.property] != undefined) {
              sums[index] = this.summation[column.property];
            }
          }
        }
      });

      return sums;
    },
    init() {
      this.$get(api.caseCharge, this.searchdata, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      })
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initTableData(data) {
      this.trueTableData = [];
      var tempData = [].concat(data);
      tempData.forEach((v, i) => {
        //鉴定人信息
        v.assist = {};
        v.auth1 = {};
        v.auth2 = {};
        v.auth3 = {};
        v.authorized_signatory = {};
        if (v.authenticatorList) {
          v.authenticatorList.forEach((value) => {
            v[value.caseRole.value.toLowerCase()] = value.participant;
          });
        }
        //收费类型信息
        if (this.chargeTypeData.length) {
          this.chargeTypeData.forEach((value) => {
            v[value.key] = 0;
          });
        }
        //按收费类型的收费确认金额
        if (v.fiCaseChargeByTypeList && v.fiCaseChargeByTypeList.length) {
          v.fiCaseChargeByTypeList.forEach((value) => {
            v[value.chargingType.key] = value.amount.yuanFmt;
          });
        }
        this.trueTableData.push(v);
      });
    },
    exportExcel() {
      var exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      this.$axios
        .get(api.caseCharge + "/export", {
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
          link.setAttribute("download", "收费确认列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
    search() {
      let temp = "";
      temp = this.searchForm.acceptStationId;
      if (typeof this.searchForm.acceptStationId == "object") {
        this.searchForm.acceptStationId = this.searchForm.acceptStationId.id;
      }
      let data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.amountFrom) {
        data.amountFrom = data.amountFrom * 100;
      }
      if (data.amountTo) {
        data.amountTo = data.amountTo * 100;
      }
      this.searchdata = data;
      if (this.searchdata.prefectureId != undefined) {
        this.searchdata.prefectureId = this.searchdata.prefectureId.id;
      }
      this.moreSearchDialog = false;
      this.searchForm.acceptStationId = temp;
      this.initSum();
    },
    initSum() {
      this.$get(api.caseCharge + "/total", this.searchdata)
        .then((res) => {
          this.summation = res.data;
          for (let key in this.summation) {
            this.summation[key] = BigDecimalUtils.divide(
              this.summation[key],
              100
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //收费确认修改
    edit(index, row) {
      if (row.payer == "") {
        this.payment = "0";
      } else if (row.paymentUnit == "" || row.paymentUnit == null) {
        this.payment = "1";
      }
      this.isUseOtherCharge = false;
      this.$get(api.caseCharge + "/" + row.id)
        .then((res) => {
          var data = res.data;
          this.showEditChargeDialog = true;
          // if (data.paymentUnit) {
          //     this.payment = "0";
          // } else {
          //     this.payment = "1";
          // }
          if (data.fiCaseChargeOtherChargeList.length > 0) {
            this.isUseOtherCharge = true;
          }
          data.amount.cent = data.amount.cent / 100;
          this.editChargeForm = JSON.parse(JSON.stringify(data));
          if (this.editChargeForm.fiCaseChargeItemList) {
            this.editChargeForm.fiCaseChargeItemList.forEach((value) => {
              if (!value.amount) {
                value.amount = { cent: 0 };
              }
              value.receivable =
                (value.fiCaseChargeSumByItem.amount.cent -
                  value.fiCaseChargeSumByItem.received.cent -
                  value.fiCaseChargeSumByItem.discount.cent -
                  value.fiCaseChargeSumByItem.refund.cent +
                  value.amount.cent) /
                100;
              value.fiCaseChargeSumByItem.received.cent =
                (value.fiCaseChargeSumByItem.received.cent -
                  value.amount.cent) /
                100;
              value.amount.cent = value.amount.cent / 100;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //收费确认修改保存
    saveEditCharge(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$nextTick(() => {
            var flag = true;
            var data = JSON.parse(JSON.stringify(this.editChargeForm));
            var amount = 0;
            data.fiCaseChargeItemList.forEach((v, i) => {
              amount += v.amount.cent;
              v.amount.cent = v.amount.cent * 100;
            });
            if (amount != data.amount.cent) {
              flag = false;
              this.$message.error(
                "收费确认的金额必须等于各收费项目确认金额之和!"
              );
              return;
            }
            if (this.editChargeForm.amount.cent == 0) {
              this.$message.error("收费确认金额必须大于0!");
              return;
            }
            data.amount = {
              cent: data.amount.cent * 100,
            };
            if (this.payment == "0") {
              data.payer = "";
            } else {
              data.paymentUnit = { id: "" };
            }
            if (data.paymentUnit == "") {
              data.paymentUnit = { id: "" };
            }
            if (flag) {
              this.$put(api.caseCharge + "/" + data.id, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "收费确认修改成功！",
                      type: "success",
                    });
                    this.showEditChargeDialog = false;
                    this.init();
                  }
                })
                .catch((err) => {
                  console.log(err.errMsg);
                  this.$message.error(err.errMsg);
                });
            }
          });
        }
      });
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除该信息?")
        .then((res) => {
          this.$del(api.caseCharge + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.init();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    checkValue(index, row) {
      this.$nextTick(() => {
        this.editChargeForm.amount.cent =
          this.editChargeForm.fiCaseChargeItemList.reduce(
            (preValue, current) => {
              return preValue + current.amount.cent;
            },
            0
          );
      });
      if (row.amount.cent > row.receivable) {
        row.amount.cent = 0;
        this.$message.error(
          '收费项目"' + row.chargingItem.name + '"的确认金额不能大于应收金额'
        );
      }
    },
    //选择委托单位类型时，渲染委托方
    fillEntrustingUnit(newVal) {
      this.extrustingUnitQueryCondition = { typeId: newVal };
    },
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.initTableData(this.tableData);
      },
      immediate: true,
    },
    orgId: function () {
      this.$get(api.chargingType).then((res) => {
        this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
      });
      // this.searchForm = {};
    },
    //监听委托方id
    "searchForm.entrustingUnitId": {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          if (oldVal) {
            this.searchForm.contact = "";
          }
          this.$get(api.entrustingUnit + "/" + newVal)
            .then((res) => {
              this.contactOpt = [].concat(res.data.externalPersonDtoList);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (!newVal && oldVal) {
          this.searchForm.contact = "";
        }
      },
    },
    "searchForm.professionCategoryId": function (newVal, oldVal) {
      if (newVal) {
        this.$get("/api/param/v1/params/value", {
          professionCategoryId: newVal,
          key: "case.no.mark",
        })
          .then((res) => {
            if (res.status == 200) {
              var arr = res.data.split("，");
              this.caseMarkOpt = arr;
            }
          })
          .catch((err) => console.log(err));
      }
    },
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  created() {
    this.initSum();
    this.$get(api.chargingType).then((res) => {
      this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
    });
    this.$store.dispatch("login/headerTitleChange", "收费确认列表");
    this.tableHeight =
      window.innerHeight - commonNum.tableBottomThreeoRowsWithoutButton + "px";
  },
};
</script>

<style scoped>
</style>