<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="其他业务收入列表" name="list">
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
                  className="multiple-select"
                  :org-id="orgId"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="确认日期">
                <DataPicker
                  :startValue.sync="searchForm.beginChargeConfirmDate"
                  :endValue.sync="searchForm.endChargeConfirmDate"
                  valueFormat="yyyy/MM/dd HH:mm:ss"
                  valueFormat2="yyyy/MM/dd 23:59:59"
                  :isValueFormat2="true"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="付款方">
                <select-from-table
                  :model.sync="searchForm.entrustingUnitId"
                  port="entrustingUnit"
                  :allow-create="true"
                  :model-id="true"
                  :clearable="true"
                  :filterable="true"
                  className="multiple-select"
                  :org-id="orgId"
                />
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
          </el-row>

          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="来源方式" class="margin0">
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
              <el-form-item label="备注" class="margin0">
                <el-input
                  v-model="searchForm.remarks"
                  @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="color: white; float: right"
              @click="search"
              >查询
            </el-button>
          </el-row>
        </el-form>
      </div>
      <el-table
        :span-method="arraySpanMethod"
        :data="trueTableData"
        :fit="true"
        border
        style="width: 100%"
        size="mini"
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
          prop="professionCategoryName"
          label="专业类别"
          show-overflow-tooltip
          width="100px"
        >
        </el-table-column>
        <el-table-column prop="amount.yuanFmt" label="确认金额" width="80px">
        </el-table-column>
        <el-table-column prop="balance.yuanFmt" label="余额" width="80px">
        </el-table-column>
        <el-table-column
          prop="relationCaseCount"
          label="关联案件数量"
          width="80px"
        >
        </el-table-column>
        <el-table-column
          prop="chargeSource.label"
          show-overflow-tooltip
          label="来源方式"
        >
        </el-table-column>
        <el-table-column
          prop="sourceCategory.label"
          show-overflow-tooltip
          label="来源类别"
        >
        </el-table-column>
        <el-table-column prop="remarks" show-overflow-tooltip label="备注">
        </el-table-column>
        <el-table-column label="开票状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceTotalAmount == 0">未开票</span>
            <span
              v-if="
                scope.row.invoiceTotalAmount > 0 &&
                scope.row.invoiceTotalAmount < scope.row.amount.cent / 100
              "
              >部分开票</span
            >
            <span
              v-if="scope.row.invoiceTotalAmount == scope.row.amount.cent / 100"
              >全部开票</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceTotalAmount"
          show-overflow-tooltip
          label="合计开票金额"
        >
        </el-table-column>

        <el-table-column
          prop="invoiceMsg.invoiceAmount.yuanFmt"
          show-overflow-tooltip
          label="开票金额"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.makeOutDate"
          show-overflow-tooltip
          label="开票日期"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceMsg">{{
              $divideDate(scope.row.invoiceMsg.makeOutDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.invoiceCode"
          show-overflow-tooltip
          label="开票代码"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.invoiceNo"
          show-overflow-tooltip
          label="开票号码"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.invoiceReceiver"
          show-overflow-tooltip
          label="领票人"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.title"
          show-overflow-tooltip
          label="开票抬头"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.taxpayerNo"
          show-overflow-tooltip
          label="纳税人识别号"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.address"
          show-overflow-tooltip
          label="单位地址"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.phoneNo"
          show-overflow-tooltip
          label="电话号码"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.bank"
          show-overflow-tooltip
          label="开户银行"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.bankAccount"
          show-overflow-tooltip
          label="银行账号"
        >
        </el-table-column>
        <el-table-column
          prop="invoiceMsg.id"
          label="发票操作"
          width="210%"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              v-if="
                scope.row.invoiceMsg &&
                hasPermission('auth:finance:other:invoice:edit')
              "
              plain
              @click="editInvoice(scope.$index, scope.row)"
              >修改
            </el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="
                scope.row.invoiceMsg &&
                hasPermission('auth:finance:other:invoice:red')
              "
              plain
              @click="redOrAbortInvoice(scope.$index, scope.row, true)"
              >冲红
            </el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="
                scope.row.invoiceMsg &&
                hasPermission('auth:finance:other:invoice:cancel')
              "
              plain
              @click="redOrAbortInvoice(scope.$index, scope.row, false)"
            >
              作废
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
                        prop="remarks"
                        show-overflow-tooltip
                        label="备注">
                </el-table-column>-->
        <el-table-column prop="address" label="操作" width="390%" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="hasPermission('auth:finance:other:edit')"
              type="warning"
              size="mini"
              plain
              @click="edit(scope.$index, scope.row)"
              >修改
            </el-button>
            <el-button
              v-if="hasPermission('auth:finance:other:delete')"
              type="danger"
              size="mini"
              plain
              @click="deleteRow(scope.$index, scope.row)"
              >删除
            </el-button>
            <el-button
              v-if="hasPermission('auth:finance:other:order')"
              type="primary"
              size="mini"
              plain
              @click="invoiceRegister(scope.$index, scope.row)"
            >
              开票登记
            </el-button>
            <el-button
              v-if="hasPermission('auth:finance:other:edit-remark')"
              type="primary"
              size="mini"
              plain
              @click="editRemarks(scope.$index, scope.row)"
              >修改备注
            </el-button>
            <el-button
              v-if="hasPermission('auth:finance:other:detail')"
              type="primary"
              size="mini"
              plain
              @click="relevanceCaseList(scope.$index, scope.row)"
              >明细
            </el-button>
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
          port="otherCharge"
          :org-id="orgId"
        >
        </pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane
      v-if="hasPermission('auth:finance:other:add')"
      label="其他业务收入添加"
      name="form"
    ></el-tab-pane>

    <!--发票修改窗口开始-->
    <el-dialog
      title="发票修改"
      :visible.sync="showEditInvoiceDialog"
      width="50%"
      class="edit-invoice"
    >
      <el-form
        :model="editInvoiceForm"
        label-position="right"
        ref="editInvoiceForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="发票类型"
              prop="invoiceType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                data_type="invoice_type"
                :model.sync="editInvoiceForm.invoiceType"
                className="multiple-select"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="开票日期"
              prop="makeOutDate"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="editInvoiceForm.makeOutDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="领票日期"
              prop="receiveDate"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="editInvoiceForm.receiveDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="开票人"
              prop="drawer"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-input
                size="small"
                v-model="editInvoiceForm.drawer"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="递送方式"
              prop="giveType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-enum
                :model.sync="editInvoiceForm.giveType"
                :clearable="true"
                type="ca.GiveType"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="发票金额"
              v-if="editInvoiceForm.invoiceAmount"
              prop="invoiceAmount.yuanFmt"
            >
              <el-input
                disabled
                size="small"
                v-model="editInvoiceForm.invoiceAmount.yuanFmt"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="发票代码" prop="invoiceCode">
              <el-input
                size="small"
                v-model="editInvoiceForm.invoiceCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="发票号" prop="invoiceNo">
              <el-input
                size="small"
                v-model="editInvoiceForm.invoiceNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="领票人" prop="invoiceReceiver">
              <el-input
                size="small"
                v-model="editInvoiceForm.invoiceReceiver"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="开票抬头" prop="title">
              <el-input size="small" v-model="editInvoiceForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="纳税人识别号" prop="taxpayerNo">
              <el-input
                size="small"
                v-model="editInvoiceForm.taxpayerNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="单位地址" prop="address">
              <el-input
                size="small"
                v-model="editInvoiceForm.address"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="电话号码" prop="phoneNo">
              <el-input
                size="small"
                v-model="editInvoiceForm.phoneNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="开户银行" prop="bank">
              <el-input size="small" v-model="editInvoiceForm.bank"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                size="small"
                v-model="editInvoiceForm.bankAccount"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="备注" prop="remarks">
              <el-input
                size="small"
                v-model="editInvoiceForm.remarks"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <Portlet title="发票图片">
        <template slot="buttonGroup">
          <el-upload
            style="float: right; margin-right: 10px"
            class="upload-demo"
            action="#"
            :multiple="true"
            :on-change="changeInvoice"
            :auto-upload="false"
            :show-file-list="false"
            list-type="picture"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="margin-top: 11px"
            >
              上传
            </el-button>
          </el-upload>
          <!-- <el-button
                            type="primary"
                            icon="el-icon-camera-solid"
                            size="mini"
                            style="float: right;margin-right: 10px;margin-top: 11px"
                    >扫描
                    </el-button> -->
          <Czur
            :isScan="true"
            style="float: right; margin-right: 10px"
            :model.sync="editInvoiceImages"
          ></Czur>
        </template>
        <template slot="body">
          <PictureWall :model.sync="editInvoiceImages"></PictureWall>
        </template>
      </Portlet>
      <div slot="footer" class="dialog-footer" ref="editInvoiceFooter">
        <el-button @click="showEditInvoiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEditInvoice('editInvoiceForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--发票修改窗口结束-->

    <!--开票登记窗口开始-->
    <el-dialog
      title="开票登记"
      :visible.sync="makeInvoiceDialog"
      width="960px"
      class="invoice-register"
    >
      <el-form
        :model="makeInvoiceForm"
        label-position="right"
        ref="makeInvoiceForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="发票类型"
              prop="invoiceType.id"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                data_type="invoice_type"
                ref="selectFromDict"
                :model.sync="makeInvoiceForm.invoiceType"
                className="multiple-select"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="开票日期"
              prop="makeOutDate"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="makeInvoiceForm.makeOutDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="领票日期"
              prop="receiveDate"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="makeInvoiceForm.receiveDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="开票人"
              prop="drawer"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-input
                size="small"
                v-model="makeInvoiceForm.drawer"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="递送方式"
              prop="giveType"
              :rules="$filter_rules({ required: true })"
            >
              <select-from-enum
                :model.sync="makeInvoiceForm.giveType"
                :clearable="true"
                type="ca.GiveType"
              ></select-from-enum>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="portlet">
          <div class="portlet-header">
            <span>开票信息</span>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="float: right; margin-right: 10px; margin-top: 5px"
              @click="makeInvoiceForm.invoiceRegisterTable.push({})"
            >
              增加
            </el-button>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="makeInvoiceForm.invoiceRegisterTable"
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
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'invoiceRegisterTable.' + scope.$index + '.invoiceCode'
                    "
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.invoiceCode"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceNo" label="发票号" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'invoiceRegisterTable.' + scope.$index + '.invoiceNo'
                    "
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.invoiceNo"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceAmount"
                label="开票金额"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'invoiceRegisterTable.' + scope.$index + '.invoiceAmount'
                    "
                  >
                    <el-input-number
                      :precision="2"
                      size="mini"
                      v-model="scope.row.invoiceAmount"
                      controls-position="right"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="开票抬头" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.title'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.title"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="taxpayerNo"
                label="纳税人识别号"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.taxpayerNo'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.taxpayerNo"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单位地址" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.address'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.address"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="phoneNo" label="电话号码" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.phoneNo'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.phoneNo"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="bank" label="开户银行" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.bank'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.bank"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="bankAccount"
                label="银行账号"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.bankAccount'"
                  >
                    <el-input
                      size="small"
                      v-model.number="scope.row.bankAccount"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceReceiver"
                label="领票人"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'invoiceRegisterTable.' +
                      scope.$index +
                      '.invoiceReceiver'
                    "
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.invoiceReceiver"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" width="150px">
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceRegisterTable.' + scope.$index + '.remarks'"
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.remarks"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="200px"
                fixed="right"
                align="center"
              >
                <template slot-scope="scope">
                  <Uploadpictures
                    :isUploadImg="true"
                    :model.sync="scope.row.images"
                    :multiple="true"
                    :append-to-body="true"
                  ></Uploadpictures>
                  <Czur :model.sync="scope.row.images"></Czur>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    v-if="makeInvoiceForm.invoiceRegisterTable.length != 1"
                    @click="
                      makeInvoiceForm.invoiceRegisterTable.splice(
                        scope.$index,
                        1
                      )
                    "
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="makeInvoiceFooter">
        <el-button @click="makeInvoiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmMakeOut('makeInvoiceForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--开票登记窗口结束-->

    <!--作废/冲红窗口开始-->
    <el-dialog
      :title="isRed ? '发票冲红' : '发票作废'"
      :visible.sync="showRedOrAbortDialog"
      width="30%"
    >
      <el-form :model="redOrAbortForm" label-width="100px" ref="redOrAbortForm">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="理由"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
              prop="abortReason"
            >
              <select-from-dict
                data_type="abort_reason_id"
                :model.sync="redOrAbortForm.abortReason"
                className="multiple-select"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            redOrAbortForm.abortReason &&
            redOrAbortForm.abortReason.label == '其他'
          "
        >
          <el-col :span="18" :offset="3">
            <el-form-item
              label="其他理由"
              :rules="$filter_rules({ required: true })"
              prop="abortReasonOther"
            >
              <el-input
                type="textarea"
                v-model="redOrAbortForm.abortReasonOther"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRedOrAbortDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRedOrAbort('redOrAbortForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--作废/冲红窗口结束-->

    <!--修改备注窗口开始-->
    <el-dialog
      title="修改备注"
      :visible.sync="showEditRemarksDialog"
      width="30%"
    >
      <el-form :model="editRemarksForm" label-width="100px">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                v-model="editRemarksForm.remarks"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditRemarksDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRemarks('editRemarksForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--修改备注窗口结束-->
  </el-tabs>
</template>

<script>
import Collapse from "../layout/Collapse";
import Uploadpictures from "../../components/common/Uploadpictures";
import Select2 from "../../components/common/Select2";
import PictureWall from "../../components/common/PictureWall";
import api from "../../api/index";
import SimpleUpload from "../../components/common/SimpleUpload";
import TreeSelect from "../../components/common/TreeSelect";
import Portlet from "../layout/Portlet";
import Czur from "../../components/common/Czur";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";

export default {
  name: "Otherincome",
  components: {
    Collapse: Collapse,
    Select2: Select2,
    SimpleUpload: SimpleUpload,
    PictureWall: PictureWall,
    treeSelect: TreeSelect,
    Uploadpictures: Uploadpictures,
    Portlet: Portlet,
    Czur,
  },
  inject: ["hasPermission"],
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      activeName: "list",
      searchConfirmInvoice: {},
      checkMore: false,
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      trueTableData: [], //处理过的表格数据
      tableData: [],
      searchForm: { entrustingUnit: {} },
      dialogFormVisible: false,
      spanArr: [], //合并参数
      pos: 0,
      //开票登记相关
      makeInvoiceDialog: false,
      makeInvoiceForm: {
        invoiceType: {},
        invoiceRegisterTable: [{}],
        drawer: null,
      }, //开票登记表单
      //发票修改相关
      showEditInvoiceDialog: false, //发票修改模态框
      editInvoiceForm: {}, //发票修改表单
      editInvoiceImages: [], //发票修改图片
      //冲红作废相关
      showRedOrAbortDialog: false, //冲红或者作废模态框
      isRed: true, //冲红或者作废
      redOrAbortForm: {}, //冲红或者作废表单
      //备注修改相关
      showEditRemarksDialog: false, //修改备注模态框
      editRemarksForm: {}, //备注修改表单
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
      sessionStorage.setItem("otherChargeSearchData", JSON.stringify(data));
      this.searchdata = data;
    },
    checkMoreInformation() {
      this.checkMore = !this.checkMore;
    },
    init() {
      this.$get(api.otherCharge, this.searchForm,{
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      })
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.activeName = "list";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(index, row) {
      this.$router
        .push({
          path: "/fi/financial-management/fiOtherChargeForm",
          query: { id: row.id },
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除该信息?")
        .then((res) => {
          this.$del(api.otherCharge + "/" + row.id)
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
              this.$message.error(err.errMsg);
            });
        })
        .catch((err) => {});
    },
    //点击开票登记
    invoiceRegister(index, row) {
      //this.$store.state.login.userObj.label
      this.makeInvoiceForm = {
        invoiceType: {
          id: "e2a10467b32092d3cd838e0743739820",
          value: "1",
          label: "普通发票",
          type: "invoice_type",
          description: "发票类型",
          sort: 2,
          parentId: "0",
          orgId: "1",
        },
        invoiceRegisterTable: [{}],
        drawer: this.$store.state.login.userObj.label || "",
        makeOutDate: this.$thisDate(true),
        receiveDate: this.$thisDate(true),
        giveType: { value: "SELF_PICK", label: "自取" },
      };
      this.$refs.makeInvoiceFooter.setAttribute("index", index);
      if (row.invoiceTotalAmount == 0) {
        this.makeInvoiceDialog = true;
        this.makeInvoiceForm.invoiceAmountNeed = row.amount.cent;
      } else if (row.invoiceTotalAmount == row.amount.cent / 100) {
        this.$message.error("其他业务收入的待开金额为0！");
      } else {
        this.$message.error("其他业务收入关联的案件已开发票，请作废后再开！");
      }
      //清除验证
      this.$nextTick(function () {
        this.$refs["makeInvoiceForm"].clearValidate();
      });
    },
    //确认开票信息
    async confirmMakeOut(formName) {
      try {
        await new Promise((resolve, reject) => {
          this.$refs[formName].validate((valid) =>
            valid ? resolve() : reject()
          );
        });
        let data = { ...this.makeInvoiceForm };
        let index = this.$refs.makeInvoiceFooter.getAttribute("index");
        let id = this.trueTableData[index].id;
        let invoiceAmount = 0;
        let invoiceList = [];
        let p = [];
        data.invoiceRegisterTable.forEach((item) => {
          invoiceAmount += item.invoiceAmount * 100;
        });
        if (invoiceAmount.toFixed(0) != data.invoiceAmountNeed) {
          this.$message.error("其他业务收入的开票金额必须等于待开金额！");
          return;
        }
        for (let i = 0; i < data.invoiceRegisterTable.length; i++) {
          let invoice = {
            invoiceType: data.invoiceType,
            invoiceCode: data.invoiceRegisterTable[i].invoiceCode,
            invoiceNo: data.invoiceRegisterTable[i].invoiceNo,
            makeOutDate: data.makeOutDate,
            receiveDate: data.receiveDate,
            invoiceAmount: {
              cent: Math.round(
                data.invoiceRegisterTable[i].invoiceAmount * 100
              ).toFixed(0),
            },
            drawer: data.drawer,
            invoiceReceiver: data.invoiceRegisterTable[i].invoiceReceiver,
            title: data.invoiceRegisterTable[i].title,
            taxpayerNo: data.invoiceRegisterTable[i].taxpayerNo,
            address: data.invoiceRegisterTable[i].address,
            phoneNo: data.invoiceRegisterTable[i].phoneNo,
            bank: data.invoiceRegisterTable[i].bank,
            bankAccount: data.invoiceRegisterTable[i].bankAccount,
            remarks: data.invoiceRegisterTable[i].remarks,
            giveType: data.giveType,
          };
          if (
            data.invoiceRegisterTable[i].images &&
            data.invoiceRegisterTable[i].images.length &&
            typeof data.invoiceRegisterTable[i].images == "object"
          ) {
            let arr = [];
            for (
              let j = 0;
              j < data.invoiceRegisterTable[i].images.length;
              j++
            ) {
              let res = await this.$getBase64(
                data.invoiceRegisterTable[i].images[j].raw
              );
              arr.push({
                imageType: data.invoiceRegisterTable[i].images[j].name
                  .split(".")
                  .reverse()[0],
                image: res,
              });
            }
            data.invoiceRegisterTable[i].images = arr;
            arr = null;
          }
          invoice.images = data.invoiceRegisterTable[i].images;
          invoiceList.push(invoice);
        }
        data.invoiceList = invoiceList;
        data.id = id;
        this.$post(api.otherCharge + "/invoice", data).then((res) => {
          if (res.status == 200) {
            this.$message.success("开票成功！");
            this.init();
            this.makeInvoiceDialog = false;
            this.$refs[formName].resetFields();
            this.makeInvoiceForm = {
              invoiceType: {},
              invoiceRegisterTable: [{}],
              drawer: null,
            };
          }
        });
      } catch (err) {
        console.log("错误:", err);
      }
    },
    //发票修改
    editInvoice(index, row) {
      this.$get(api.invoices + "/" + row.invoiceMsg.id)
        .then((res) => {
          this.editInvoiceForm = JSON.parse(JSON.stringify(res.data));
          this.editInvoiceImages = JSON.parse(JSON.stringify(res.data.images));
          this.showEditInvoiceDialog = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.editInvoiceForm.otherChargeId = row.id;
      this.showEditInvoiceDialog = true;
    },
    saveEditInvoice(formName) {
      var data = JSON.parse(JSON.stringify(this.editInvoiceForm));
      let p = new Promise((resolve, reject) => {
        this.$compressImages(this.editInvoiceImages).then((res) => {
          data.images = [].concat(res);
          resolve();
        });
      });
      p.then((res) => {
        this.$put(api.otherCharge + "/invoice/" + data.id, data)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "修改成功！",
                type: "success",
              });
              this.init();
              this.showEditInvoiceDialog = false;
              this.$refs[formName].resetFields();
            }
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      }).catch((err) => {
        console.log(err);
      });
    },
    //冲红
    redOrAbortInvoice(index, row, action) {
      var info = action
        ? "该其他业务收入的发票需要全部冲红"
        : "该其他业务收入的发票需要全部作废";
      this.$confirmBox(info)
        .then((res) => {
          this.isRed = action;
          this.showRedOrAbortDialog = true;
          this.redOrAbortForm.status = this.isRed ? "RED" : "ABORT";
          this.redOrAbortForm.invoiceId = row.invoiceMsg.id;
          this.redOrAbortForm.otherChargeId = row.id;
          //清除验证
          this.$nextTick(function () {
            this.$refs["redOrAbortForm"].clearValidate();
          });
        })
        .catch((err) => {});
    },
    saveRedOrAbort(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            abortReason: this.redOrAbortForm.abortReason,
            abortReasonOther: this.redOrAbortForm.abortReasonOther,
            status: this.redOrAbortForm.status,
            id: this.redOrAbortForm.invoiceId,
          };
          this.$put(
            api.otherCharge +
              "/invoice/redOrAbort/" +
              this.redOrAbortForm.otherChargeId,
            data
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this.init();
                this.showRedOrAbortDialog = false;
                this.$refs[formName].resetFields();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //备注修改
    editRemarks(index, row) {
      var data = JSON.parse(JSON.stringify(row));
      this.showEditRemarksDialog = true;
      this.editRemarksForm = { remarks: data.remarks };
      this.editRemarksForm.id = data.id;
    },
    relevanceCaseList(index, row) {
      /* this.$router.push({
                    path: '/financial/FiOtherChargeCaseList',
                    query: {'id': row.id}
                }) */
      let url = this.$router.resolve({
        path: "/financial/FiOtherChargeCaseList",
        query: { id: row.id },
      });
      window.open(url.href, "_blank");
    },
    saveEditRemarks(formName) {
      this.$put(
        api.otherCharge +
          "/remarks/" +
          this.editRemarksForm.id +
          "?remarks=" +
          this.editRemarksForm.remarks
      )
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "备注修改成功！",
              type: "success",
            });
            this.init();
            this.showEditRemarksDialog = false;
            this.$refs[formName].resetFields();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initTableData(data) {
      this.trueTableData = [];
      var sampleData = [].concat(data);
      sampleData.forEach((v, i) => {
        if (v.caseIds) {
          v.caseIds = v.caseIds.split(",");
          v.relationCaseCount = v.caseIds.length;
        } else {
          v.relationCaseCount = 0;
        }
        if (v.invoiceList.length) {
          var invoiceTotalAmount = 0;
          v.invoiceList.forEach((value) => {
            invoiceTotalAmount += value.invoiceAmount.cent / 100;
          });
          v.invoiceList.forEach((value) => {
            var json = JSON.parse(JSON.stringify(v));
            json.invoiceTotalAmount = invoiceTotalAmount;
            if (
              value.invoiceProperty &&
              value.invoiceProperty.value == "OTHER"
            ) {
              json.invoiceMsg = value;
            }
            this.trueTableData.push(json);
          });
        } else {
          var json = JSON.parse(JSON.stringify(v));
          delete json.invoiceList;
          json.invoiceMsg = null;
          json.invoiceTotalAmount = 0;
          json.invoiceTotalStatus = "0";
          this.trueTableData.push(json);
        }
      });
      this.getSpanArr(this.trueTableData);
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      var exceptColArr = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      if (exceptColArr.indexOf(columnIndex) == -1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    changeInvoice(file, fileList) {
      this.editInvoiceImages.push(file);
    },
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.initTableData(this.tableData);
      },
      immediate: true,
    },
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.$router
          .push({ path: "/fi/financial-management/fiOtherChargeList" })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$router
          .push({ path: "/fi/financial-management/fiOtherChargeForm" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    orgId: function () {
      this.searchForm = { entrustingUnit: {} };
    },
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  created() {
    if (sessionStorage.getItem("otherChargeSearchData")) {
      this.searchdata = JSON.parse(
        sessionStorage.getItem("otherChargeSearchData")
      );
      this.searchForm = this.searchdata;
    }
    this.$get(api.myInfo).then((res) => {
      var data = JSON.parse(JSON.stringify(res.data));
      this.makeInvoiceForm.drawer =
        data.hrStaff == undefined ? "" : data.hrStaff.name;
    });
    this.tableHeight =
      window.innerHeight - commonNum.tableBottomThreeRows + "px";
  },
};
</script>

<style scoped lang="less">
.edit-invoice {
  z-index: 9999 !important;
}
.invoice-register {
  z-index: 9999 !important;
}
</style>