<template>
  <div id="fiInvoiceList">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="110px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="发票状态" prop="status">
              <select-from-enum
                :model.sync="searchForm.status"
                :clearable="true"
                :modelVal="true"
                className="multiple-select"
                type="invoice.InvoiceStatus"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="开票日期">
              <DataPicker
                :startValue.sync="searchForm.makeOutDateFrom"
                :endValue.sync="searchForm.makeOutDateTo"
                valueFormat="yyyy/MM/dd HH:mm:ss"
                valueFormat2="yyyy/MM/dd 23:59:59"
                :isValueFormat2="true"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="发票类型">
              <select-from-dict
                :model.sync="searchForm.invoiceTypeId"
                data_type="invoice_type"
                :clearable="true"
                className="multiple-select"
                :modelId="true"
                @keyup="search"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="发票性质">
                            <select-from-enum
                                    :model.sync="searchForm.invoiceProperty"
                                    :clearable="true"
                                    type="invoice.InvoiceProperty"
                                    className="multiple-select"
                                    :modelVal="true"
                            ></select-from-enum>
                        </el-form-item>
                    </el-col> -->
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="发票代码">
              <el-input
                v-model="searchForm.invoiceCode"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="发票号码">
              <el-input
                v-model="searchForm.invoiceNo"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位">
              <select-from-table
                :model.sync="searchForm.entrustingUnitId"
                port="entrustingUnit"
                :clearable="true"
                :filterable="true"
                :model-id="true"
                className="multiple-select"
                :org-id="orgId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位辖区" class="margin0">
              <select-from-dict
                :model.sync="searchForm.prefectureId"
                :clearable="true"
                className="w100"
                data_type="prefecture_id"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象">
              <el-input
                v-model="searchForm.authenticatedTarget"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号">
              <el-input
                v-model="searchForm.caseNo"
                @keyup.enter.native="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="案号标志" class="margin0">
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
    <el-button-group style="margin-bottom: 10px">
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:abort')"
        @click="redOrAbortInvoice(false)"
        >作废
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:red')"
        @click="redOrAbortInvoice(true)"
        >冲红
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:add')"
        @click="newInvoice()"
        >新开
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:edit')"
        @click="editInvoice()"
        >修改
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:export')"
        @click="exportExcel()"
        >导出
      </el-button>
    </el-button-group>
    <el-table
      :data="tableData"
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      :summary-method="summation ? getSummaries : null"
      show-summary
      size="mini"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column type="selection" fixed="left" width="55">
      </el-table-column>
      <el-table-column
        prop="caseDto.caseNo"
        label="案件编号"
        width="250px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{
              path: '/case/case-detail',
              query: { id: scope.row.caseDto.id },
            }"
            style="text-decoration: none"
          >
            <el-link type="primary" style="font-size: 12px"
              >{{ scope.row.caseDto.caseNo ? scope.row.caseDto.caseNo : "无" }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="caseDto.entrustInfo.entrustingUnit.prefecture.label"
        show-overflow-tooltip
        label="委托单位辖区"
      ></el-table-column>
      <el-table-column
        prop="caseDto.entrustInfo.authenticatedTarget"
        label="鉴定对象"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="invoiceCode"
        label="发票代码"
        show-overflow-tooltip
        width="100"
      ></el-table-column>
      <el-table-column
        prop="invoiceNo"
        label="发票号码"
        show-overflow-tooltip
        width="100"
      ></el-table-column>
      <el-table-column
        prop="invoiceType.label"
        label="发票类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="makeOutDate"
        label="开票日期"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.makeOutDate">{{
            $divideDate(scope.row.makeOutDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        show-overflow-tooltip
        prop="invoiceAmount.yuanFmt"
        label="开票金额"
      ></el-table-column>
      <el-table-column
        prop="drawer"
        label="开票人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="invoiceReceiver"
        label="领票人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="title"
        label="开票抬头"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        width="120"
        prop="taxpayerNo"
        label="纳税人识别号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="address"
        label="单位地址"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="phoneNo"
        label="电话号码"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="bank"
        label="开户银行"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="bankAccount"
        label="银行账号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="receiveDate"
        label="领票日期"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.receiveDate">{{
            $divideDate(scope.row.receiveDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="giveType.label"
        label="递送方式"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="remarks"
        label="备注"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="status.label"
        label="状态"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tableSort"
        port="invoices"
        :org-id="orgId"
      >
      </pagination>
    </div>

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
          >保存
        </el-button>
      </div>
    </el-dialog>
    <!--发票修改窗口结束-->

    <!--发票新开窗口开始-->
    <el-dialog
      title="发票新开"
      :visible.sync="showNewInvoiceDialog"
      width="50%"
      class="new-invoice"
    >
      <el-form
        :model="newInvoiceForm"
        label-position="right"
        ref="newInvoiceForm"
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
                :model.sync="newInvoiceForm.invoiceType"
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
                v-model="newInvoiceForm.makeOutDate"
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
                v-model="newInvoiceForm.receiveDate"
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
              <el-input size="small" v-model="newInvoiceForm.drawer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="递送方式"
              prop="giveType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-enum
                :model.sync="newInvoiceForm.giveType"
                :clearable="true"
                type="ca.GiveType"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="发票金额"
              prop="invoiceAmount"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-input
                size="small"
                v-model="newInvoiceForm.invoiceAmount"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="发票代码" prop="invoiceCode">
              <el-input
                size="small"
                v-model="newInvoiceForm.invoiceCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="发票号" prop="invoiceNo">
              <el-input
                size="small"
                v-model="newInvoiceForm.invoiceNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="领票人" prop="invoiceReceiver">
              <el-input
                size="small"
                v-model="newInvoiceForm.invoiceReceiver"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="开票抬头" prop="title">
              <el-input size="small" v-model="newInvoiceForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="纳税人识别号" prop="taxpayerNo">
              <el-input
                size="small"
                v-model="newInvoiceForm.taxpayerNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="单位地址" prop="address">
              <el-input
                size="small"
                v-model="newInvoiceForm.address"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="电话号码" prop="phoneNo">
              <el-input
                size="small"
                v-model="newInvoiceForm.phoneNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="开户银行" prop="bank">
              <el-input size="small" v-model="newInvoiceForm.bank"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                size="small"
                v-model="newInvoiceForm.bankAccount"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="备注" prop="remarks">
              <el-input
                size="small"
                v-model="newInvoiceForm.remarks"
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
            :on-change="changeNewInvoice"
            :auto-upload="false"
            :show-file-list="false"
            list-type="picture"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="margin-top: 11px"
              >上传
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
            :model.sync="newInvoiceImages"
          ></Czur>
        </template>
        <template slot="body">
          <PictureWall :model.sync="newInvoiceImages"></PictureWall>
        </template>
      </Portlet>
      <div slot="footer" class="dialog-footer" ref="newInvoiceFooter">
        <el-button @click="showNewInvoiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveNewInvoice('newInvoiceForm')"
          >保存
        </el-button>
      </div>
    </el-dialog>
    <!--发票新开窗口结束-->

    <!--作废/冲红窗口开始-->
    <el-dialog
      :title="isRed ? '发票冲红' : '发票作废'"
      :visible.sync="showRedOrAbortDialog"
      width="30%"
    >
      <el-form :model="redOrAbortForm" ref="redOrAbortForm" label-width="100px">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="理由"
              :rules="$filter_rules({ required: true })"
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
            <el-form-item label="其他理由" prop="abortReasonOther">
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
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--作废/冲红窗口结束-->
  </div>
</template>

<script>
import api from "../../api/index";
import PictureWall from "../../components/common/PictureWall";
import Portlet from "../layout/Portlet";
import Czur from "../../components/common/Czur";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";
import BigDecimalUtils from "../../utils/BigDecimalUtils";

export default {
  name: "FiInvoiceList",
  components: {
    PictureWall: PictureWall,
    Portlet: Portlet,
    Czur,
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tableData: [], //从后台获取的数据
      tableSort: null,
      searchdata: {},
      searchForm: {},
      //选择框相关
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},
      //发票修改相关
      showEditInvoiceDialog: false, //发票修改模态框
      editInvoiceForm: {}, //发票修改表单
      editInvoiceImages: [], //发票修改相关图片
      //发票新开相关
      showNewInvoiceDialog: false, //发票新开模态框
      newInvoiceForm: {}, //发票新开表单
      newInvoiceImages: [], //新开发票的图片
      //发票冲红作废相关
      showRedOrAbortDialog: false, //冲红或者作废模态框
      isRed: true, //冲红或者作废
      redOrAbortForm: {}, //冲红或者作废表单，
      summation: {}, //合计
      caseMarkOpt: [],
    };
  },
  inject: ["hasPermission"],
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
            if (column.property == "invoiceAmount.yuanFmt") {
              sums[index] = this.summation["totalAmount"];
            }
          }
        }
      });

      return sums;
    },
    initSum() {
      this.$get(api.invoices + "/total", this.searchdata)
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
    changeInvoice(file, fileList) {
      this.editInvoiceImages.push(file);
    },
    changeNewInvoice(file, fileList) {
      this.newInvoiceImages.push(file);
    },
    init() {
      this.$get(api.invoices, this.searchdata, {
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
    search() {
      let data = JSON.parse(JSON.stringify(this.searchForm));
      this.searchdata = data;
      /* 委托单位辖区id修改 */
      if (this.searchdata.prefectureId != undefined) {
        this.searchdata.prefectureId = this.searchdata.prefectureId.id;
      }
      this.initSum();
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
        .get(api.invoices + "/export", {
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
          link.setAttribute("download", "发票列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
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
    checkSelectLength() {
      if (this.selectRows.length == 1) {
        if (this.selectRows[0].status.value == "NORMAL") {
          return true;
        } else {
          this.$message.error("不能操作已冲红或已作废的记录！");
        }
        return false;
      } else {
        if (this.selectRows.length == 0) {
          this.$message.error("请选择一行记录进行操作！");
        } else {
          this.$message.error("只能选择一行记录进行操作！");
        }
        return false;
      }
    },
    //修改发票
    editInvoice() {
      if (this.checkSelectLength()) {
        this.editInvoiceForm = {};
        this.$get(api.invoices + "/" + this.selectRows[0].id)
          .then((res) => {
            this.editInvoiceForm = JSON.parse(JSON.stringify(res.data));
            this.editInvoiceImages = JSON.parse(
              JSON.stringify(res.data.images)
            );
            this.showEditInvoiceDialog = true;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    saveEditInvoice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.editInvoiceForm));
          let p = new Promise((resolve, reject) => {
            this.$compressImages(this.editInvoiceImages).then((res) => {
              data.images = [].concat(res);
              resolve();
            });
          });
          data.invoiceAmount = this.editInvoiceForm.invoiceAmount;
          p.then((res) => {
            this.$put(api.invoices + "/" + data.id, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.init();
                  this.showEditInvoiceDialog = false;
                  //   this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
    //冲红、作废
    redOrAbortInvoice(action) {
      if (this.checkSelectLength()) {
        this.redOrAbortForm = {};
        this.isRed = action;
        this.redOrAbortForm.status = this.isRed ? "RED" : "ABORT";
        var text = this.isRed ? "冲红" : "作废";
        this.redOrAbortForm.id = this.selectRows[0].id;
        if (
          this.selectRows[0].invoiceProperty &&
          this.selectRows[0].invoiceProperty.value == "OTHER"
        ) {
          this.$confirmBox("该发票为其他业务收入发票，是否" + text + "?").then(
            (res) => {
              this.showRedOrAbortDialog = true;
            }
          );
        } else if (this.selectRows[0].caseCount > 1) {
          this.$confirmBox("该发票关联多个案件，是否" + text + "?").then(
            (res) => {
              this.showRedOrAbortDialog = true;
            }
          );
        } else {
          this.showRedOrAbortDialog = true;
        }
      }
    },
    saveRedOrAbort(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.redOrAbortForm));
          this.$put(api.invoices + "/redOrAbort/" + data.id, data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this.init();
                this.showRedOrAbortDialog = false;
                // this.$refs[formName].resetFields();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //新开
    newInvoice() {
      this.newInvoiceForm = {};
      this.newInvoiceImages = [];
      this.showNewInvoiceDialog = true;
    },
    saveNewInvoice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.newInvoiceForm));
          data.invoiceAmount = {
            cent: Math.round(data.invoiceAmount * 100),
          };
          let p = new Promise((resolve, reject) => {
            this.$compressImages(this.newInvoiceImages).then((res) => {
              data.images = [].concat(res);
              resolve();
            });
          });
          var arr = [];
          arr.push(data);
          p.then((res) => {
            this.$post(api.invoices + "/save", arr)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "发票新开成功！",
                    type: "success",
                  });
                  this.showNewInvoiceDialog = false;
                  this.init();
                  this.selectRows = [];
                  //   this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
  },
  watch: {
    orgId: function () {
      //   this.searchForm = {};
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
    ...mapState("login", ["orgId"]),
  },
  created() {
    this.initSum();
    this.$store.dispatch("login/headerTitleChange", "发票管理列表");
    this.tableHeight =
      window.innerHeight - commonNum.tableBottomThreeRows + "px";
  },
};
</script>

<style lang="less" scoped>
.edit-invoice {
  z-index: 9999 !important;
}
.new-invoice {
  z-index: 9999 !important;
}
</style>
