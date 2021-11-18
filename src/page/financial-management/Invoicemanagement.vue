<template>
  <div id="invoice-management">
    <!-- <PageBar title1="财务管理" title2="财务管理列表"></PageBar> -->
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
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
            <el-form-item label="案件编号">
              <el-input
                v-model="searchForm.caseNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象">
              <el-input
                v-model="searchForm.authenticatedTarget"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="流水号" class="margin0">
              <el-input
                v-model="searchForm.serialNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位辖区" class="margin0">
              <select-from-dict
                :model.sync="searchForm.prefectureId"
                className="w100"
                data_type="prefecture_id"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-button-group style="float: right" class="clearfix">
            <el-button
              plain
              size="small"
              icon="el-icon-more"
              @click="moreSearchDialog = true"
            >
              {{ checkMore ? "收拢" : "更多" }}
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="color: white"
              @click="confirmSearch"
              >查询
            </el-button>
          </el-button-group>
        </el-row>
        <!--更多案件查询条件-->
        <el-dialog
          title="案件查询"
          :visible.sync="moreSearchDialog"
          width="70%"
        >
          <div>
            <MoreSearch
              :poisonCategoryOpt="poisonCategoryOpt"
              :chargeTypeData="chargeTypeData"
              :searchForm="searchForm"
            />
            <el-tabs type="border-card">
              <el-tab-pane label="案件相关时间">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="登记日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginRegisterDate"
                        :endValue.sync="searchForm.endRegisterDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="委托日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginEntrustingDate"
                        :endValue.sync="searchForm.endEntrustingDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="受理日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginAcceptDate"
                        :endValue.sync="searchForm.endAcceptDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="出案日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginReportOutDate"
                        :endValue.sync="searchForm.endReportOutDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="发放日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginGiveDate"
                        :endValue.sync="searchForm.endGiveDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- v-show="
                      searchForm.beginArchiveDate || searchForm.endArchiveDate
                    " -->
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="归档日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginArchiveDate"
                        :endValue.sync="searchForm.endArchiveDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="案发时间">
                      <DataPicker
                        :startValue.sync="searchForm.beginHappenDate"
                        :endValue.sync="searchForm.endHappenDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- v-show="
                      searchForm.beginAuthenticatedDate ||
                      searchForm.endAuthenticatedDate
                    " -->
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="检验时间">
                      <DataPicker
                        :startValue.sync="searchForm.beginAuthenticatedDate"
                        :endValue.sync="searchForm.endAuthenticatedDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- v-show="
                      searchForm.beginIssuerDate || searchForm.endIssuerDate
                    " -->
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="签发日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginIssuerDate"
                        :endValue.sync="searchForm.endIssuerDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="案件基本信息">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="委托方" :label-width="labelWidth">
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
                    <el-form-item label="委托类型" :label-width="labelWidth">
                      <select-from-dict
                        :model.sync="searchForm.entrustingUnitTypeId"
                        :model-id="true"
                        :clearable="true"
                        data_type="ex_unit_type"
                        className="multiple-select"
                        :org-id="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="联系人" :label-width="labelWidth">
                      <el-input v-model="searchForm.contact"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="案件类型" :label-width="labelWidth">
                      <select-from-dict
                        :model.sync="searchForm.caseTypeId"
                        :model-id="true"
                        :clearable="true"
                        data_type="case_type"
                        className="multiple-select"
                        :filterable="true"
                        :org-id="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="受理地点" :label-width="labelWidth">
                      <select-from-table
                        :model.sync="searchForm.acceptStationId"
                        port="acceptStation"
                        :model-id="true"
                        className="multiple-select"
                        :clearable="true"
                        :filterable="true"
                        :org-id="orgId"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- v-show="searchForm.historyAuthenticated" -->
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="是否重新鉴定">
                      <el-select
                        v-model="searchForm.historyAuthenticated"
                        style="width: 100%"
                        :clearable="true"
                        placeholder="请选择"
                      >
                        <el-option label="是" value="Y" />
                        <el-option label="否" value="N" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="采血管编号" :label-width="labelWidth">
                      <el-input v-model="searchForm.vesselNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="鉴定项目" :label-width="labelWidth">
                      <!--                                        <el-input v-model="searchForm.authenticatedItemIds"></el-input>-->
                      <select-from-table
                        :model.sync="searchForm.authenticatedItemId"
                        port="entrustingMatter"
                        :model-id="true"
                        className="multiple-select"
                        :clearable="true"
                        :filterable="true"
                        :org-id="orgId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="委托书编号" :label-width="labelWidth">
                      <el-input v-model="searchForm.entrustNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="基本案情">
                      <el-input
                        v-model="searchForm.entrustingDesc"
                        :autosize="{ minRows: 1, maxRows: 1 }"
                        type="textarea"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="案件相关人员">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="鉴定人" :label-width="labelWidth">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        qualification_type="AUTH"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.authId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="鉴定人角色" :label-width="labelWidth">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="鉴定助理" :label-width="labelWidth">
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
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="复核人" :label-width="labelWidth">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="REVIEWER"
                        :model.sync="searchForm.reviewerId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="授权签字人" :label-width="labelWidth">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="AUTHORIZED_SIGNATORY"
                        :model.sync="searchForm.signatoryId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="签发人" :label-width="labelWidth">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="ISSUER"
                        :model.sync="searchForm.signerId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="登记人" :label-width="labelWidth">
                      <select-from-table
                        :model.sync="searchForm.registerId"
                        :filterable="true"
                        :clearable="true"
                        port="register"
                        className="multiple-select"
                        :org-id="orgId"
                      >
                      </select-from-table>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="市场人员" :label-width="labelWidth">
                      <select-qualification
                        profession_category="ALL"
                        qualification_type="SALES"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.saleId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="实验人员" :label-width="labelWidth">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        qualification_type="LAB_STAFF"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.labStaffId"
                        :org-id="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="案件状态">
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                  <el-form-item
                    label="案件状态"
                    :label-width="labelWidth"
                    prop="caseStatus"
                  >
                    <el-select
                      v-model="searchForm.caseStatus"
                      placeholder="请选择"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <el-option
                        label="所有正常阶段案件"
                        value="NORMAL"
                      ></el-option>
                      <el-option
                        label="所有异常阶段案件"
                        value="ABNORMAL"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="panClass.sm"
                  :md="panClass.md"
                  :xl="panClass.xl"
                  v-show="searchForm.caseStatus == 'NORMAL'"
                >
                  <el-form-item
                    label="正常阶段"
                    :label-width="labelWidth"
                    prop="normalStage"
                  >
                    <select-from-enum
                      :model.sync="searchForm.normalStage"
                      :clearable="true"
                      type="ca.FlowStatusQuery"
                      className="multiple-select"
                      :modelVal="true"
                    ></select-from-enum>
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="panClass.sm"
                  :md="panClass.md"
                  :xl="panClass.xl"
                  v-show="searchForm.caseStatus == 'ABNORMAL'"
                >
                  <el-form-item
                    label="异常阶段"
                    :label-width="labelWidth"
                    prop="abnormalStage"
                  >
                    <select-from-enum
                      :model.sync="searchForm.abnormalStage"
                      :clearable="true"
                      type="flow.FlowChangeType"
                      className="multiple-select"
                      :modelVal="true"
                    ></select-from-enum>
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="panClass.sm"
                  :md="panClass.md"
                  :xl="panClass.xl"
                  v-show="searchForm.caseStatus == 'ABNORMAL'"
                >
                  <el-form-item
                    label="过程情况"
                    :label-width="labelWidth"
                    prop="processSituation"
                  >
                    <select-from-enum
                      :model.sync="searchForm.processSituation"
                      :clearable="true"
                      type="flow.FlowCaseStatus"
                      className="multiple-select"
                      :modelVal="true"
                      :list-type="listType"
                    ></select-from-enum>
                  </el-form-item> </el-col
                ><el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                  <el-form-item
                    label="是否已出案"
                    prop="isReportOut"
                    :label-width="labelWidth"
                  >
                    <el-select
                      value=""
                      v-model="searchForm.isReportOut"
                      style="width: 100%"
                      :clearable="true"
                    >
                      <el-option value="N" label="未出案"></el-option>
                      <el-option value="Y" label="已出案"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                  <el-form-item
                    label="是否已发放"
                    prop="isGiveInfo"
                    :label-width="labelWidth"
                  >
                    <el-select
                      value=""
                      v-model="searchForm.isGiveInfo"
                      style="width: 100%"
                      :clearable="true"
                    >
                      <el-option value="N" label="未发放"></el-option>
                      <el-option value="Y" label="已发放"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                  <el-form-item
                    label="是否已归档"
                    prop="isArchive"
                    :label-width="labelWidth"
                  >
                    <el-select
                      value=""
                      v-model="searchForm.isArchive"
                      style="width: 100%"
                      :clearable="true"
                    >
                      <el-option value="N" label="未归档"></el-option>
                      <el-option value="Y" label="已归档"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="收费情况">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="收费状态"
                      :label-width="labelWidth"
                      prop="chargeStatus"
                    >
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="收入类型"
                      :label-width="labelWidth"
                      prop="revenueTypeId"
                    >
                      <select-from-dict
                        :model.sync="searchForm.revenueTypeId"
                        :clearable="true"
                        :model-id="true"
                        className="multiple-select"
                        data_type="revenue_type"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="费用类型"
                      :label-width="labelWidth"
                      prop="chargingTypeKey"
                    >
                      <el-select
                        v-model="searchForm.chargingTypeKey"
                        placeholder="请选择"
                        style="width: 100%"
                        :clearable="true"
                        value-key="key"
                      >
                        <el-option
                          v-for="(item, i) in chargeTypeData"
                          :key="i"
                          :label="item.name"
                          :value="item.key"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="来源方式"
                      :label-width="labelWidth"
                      prop="chargeSourceId"
                    >
                      <select-from-dict
                        data_type="charge_source"
                        :model-id="true"
                        :clearable="true"
                        :model.sync="searchForm.chargeSourceId"
                        className="multiple-select"
                        :org-id="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :sm="panClass.sm"
                    :md="{ span: 16 }"
                    :xl="{ span: 13, offset: 1 }"
                  >
                    <el-form-item
                      label="收费确认日期"
                      :label-width="labelWidth"
                    >
                      <DataPicker
                        :startValue.sync="searchForm.confirmedDateStart"
                        :endValue.sync="searchForm.confirmedDateEnd"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="发票情况">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="开票状态"
                      :label-width="labelWidth"
                      prop="billingStatus"
                    >
                      <el-select
                        v-model="searchForm.billingStatus"
                        placeholder="请选择"
                        style="width: 100%"
                        :clearable="true"
                      >
                        <el-option label="未开票" value="0"></el-option>
                        <el-option label="部分开票" value="1"></el-option>
                        <el-option label="全部开票" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="发票状态"
                      :label-width="labelWidth"
                      prop="invoiceStatus"
                    >
                      <select-from-enum
                        :model.sync="searchForm.InvoiceStatus"
                        :clearable="true"
                        className="multiple-select"
                        :modelVal="true"
                        type="invoice.InvoiceStatus"
                      >
                      </select-from-enum>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="发票类型"
                      :label-width="labelWidth"
                      prop="invoiceTypeId"
                    >
                      <select-from-dict
                        :model.sync="searchForm.invoiceTypeId"
                        :model-id="true"
                        className="multiple-select"
                        :org-id="orgId"
                        data_type="invoice_type"
                        :clearable="true"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="发票代码"
                      :label-width="labelWidth"
                      prop="invoiceCode"
                    >
                      <el-input v-model="searchForm.invoiceCode"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="发票号码"
                      :label-width="labelWidth"
                      prop="invoiceNo"
                    >
                      <el-input v-model="searchForm.invoiceNo"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="开票日期" :label-width="labelWidth">
                      <DataPicker
                        :startValue.sync="searchForm.makeOutDateStart"
                        :endValue.sync="searchForm.makeOutDateEnd"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                        valueFormat2="yyyy/MM/dd 23:59:59"
                        :isValueFormat2="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="鉴定意见">
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="检测结果">
                      <el-select
                        v-model="searchForm.finalResult"
                        :clearable="true"
                        style="width: 100%"
                        placeholder="请选择"
                      >
                        <el-option value="Y" label="肯定"></el-option>
                        <el-option value="N" label="否定"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="基因突变">
                      <el-select
                        v-model="searchForm.mutation"
                        :clearable="true"
                        style="width: 100%"
                        placeholder="请选择"
                      >
                        <el-option value="Y" label="存在"></el-option>
                        <el-option value="N" label="不存在"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="毒物毒品名称">
                      <select-from-table
                        :className="'w100'"
                        :model.sync="searchForm.poisonName"
                        port="poison"
                        :modelId="true"
                        :clearable="true"
                        :orgId="orgId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="定性结果">
                      <el-select
                        v-model="searchForm.qualitativeResult"
                        :clearable="true"
                        style="width: 100%"
                        placeholder="请选择"
                      >
                        <el-option value="NEGATIVE" label="阴性"></el-option>
                        <el-option value="POSITIVE" label="阳性"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="定量结果">
                      <el-input
                        v-model="searchForm.quantitativeResult"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :xl="{ span: 24 }">
                    <el-col
                      :sm="panClass.sm"
                      :md="panClass.md"
                      :xl="panClass.xl"
                    >
                      <el-form-item
                        label="伤残鉴定级别"
                        prop="disabilityLevelId"
                      >
                        <select-from-dict
                          :model.sync="searchForm.disabilityLevelId"
                          :clearable="true"
                          data_type="disability_level"
                          :className="'w100'"
                          :model-id="true"
                        >
                        </select-from-dict>
                      </el-form-item>
                    </el-col>
                    <el-col
                      :sm="panClass.sm"
                      :md="panClass.md"
                      :xl="panClass.xl"
                    >
                      <el-form-item label="损伤程度" prop="damageDegree">
                        <select-from-dict
                          :model.sync="searchForm.damageDegreeId"
                          :clearable="true"
                          :className="'w100'"
                          data_type="damage_degree"
                          :model-id="true"
                        >
                        </select-from-dict>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="车速">
                      <el-col :span="11">
                        <el-form-item class="margin0" prop="speedMin">
                          <el-input v-model="searchForm.speedMin"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col class="line" :span="2" style="text-align: center"
                        >-</el-col
                      >
                      <el-col :span="11">
                        <el-form-item class="margin0" prop="speedMax">
                          <el-input v-model="searchForm.speedMax"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item
                      label="文书鉴定意见"
                      prop="documentConclusion"
                    >
                      <select-from-dict
                        :model.sync="searchForm.documentConclusionId"
                        :clearable="true"
                        data_type="document_conclusion"
                        :className="'w100'"
                        :model-id="true"
                      >
                      </select-from-dict>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <el-form-item label="鉴定意见" prop="audioVisualSuggest">
                      <el-input
                        v-model="searchForm.audioVisualSuggest"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="moreSearchDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmSearch">查询</el-button>
          </div>
        </el-dialog>
      </el-form>
    </div>
    <el-button-group style="margin-bottom: 10px">
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:charge:confirm')"
        @click="showChargeModel()"
        >收费确认
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:make')"
        @click="showInvoiceModel()"
        >开票登记
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:batch')"
        @click="showInvoiceBatchModel()"
        >批量开票
      </el-button>
      <el-button
        type="primary"
        size="small"
        style="color: white"
        v-if="hasPermission('finance:invoice:export')"
        @click="exportExcel"
        :disabled="exportAble"
        >{{ exportCode }}
      </el-button>
    </el-button-group>
    <el-table
      :span-method="arraySpanMethod"
      :data="splitTableData"
      ref="invoiceTable"
      fit
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      @sort-change="sortChange"
      size="mini"
      style="width: 100%"
      class="table"
      :max-height="tableHeight"
      :row-key="getRowKey"
    >
      <el-table-column type="selection" fixed="left" width="55">
      </el-table-column>
      <el-table-column
        width="250px"
        show-overflow-tooltip
        prop="caseNo"
        label="案件编号"
        sortable="custom"
        fixed="left"
      >
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ path: '/case/case-detail', query: { id: scope.row.id } }"
            style="text-decoration: none"
          >
            <el-link type="primary" style="font-size: 12px">{{
              scope.row.caseNo ? scope.row.caseNo : "无"
            }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        width="110px"
        label="流水号"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="professionCategory.name"
        label="专业类别"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="entrustInfo.entrustingUnit.name"
        label="委托方"
      >
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
        show-overflow-tooltip
        prop="entrustInfo.contact.name"
        label="联系人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="entrustInfo.authenticatedTarget"
        label="鉴定对象"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        width="100px"
        label="登记日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ $divideDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="acceptDate"
        width="100px"
        label="受理日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.acceptDate">{{
            $divideDate(scope.row.acceptDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="entrustingDate"
        width="100px"
        label="委托日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.entrustingDate">{{
            $divideDate(scope.row.entrustingDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="happenDate"
        width="100px"
        label="案发日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.happenDate">{{
            $divideDate(scope.row.happenDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="reportOutDate"
        width="100px"
        label="出案日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.reportOutDate">{{
            $divideDate(scope.row.reportOutDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="giveDate"
        width="100px"
        label="发放日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.giveInfo && scope.row.giveInfo.giveDate">{{
            $divideDate(scope.row.giveInfo.giveDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createBy.hrStaff.name"
        label="登记人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="assist.participant.hrStaff.name"
        label="鉴定助理"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth1.participant.hrStaff.name"
        label="第一鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth2.participant.hrStaff.name"
        label="第二鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="auth3.participant.hrStaff.name"
        label="第三鉴定人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="authorizedSignatory.participant.hrStaff.name"
        label="授权签字人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="saleStaff.participant.hrStaff.name"
        label="市场人员"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="financeInfo.amount.yuanFmt"
        label="合同金额"
      ></el-table-column>
      <el-table-column
        prop="financeInfo.discount.yuanFmt"
        label="减免金额"
      ></el-table-column>
      <el-table-column
        prop="financeInfo.amountRefund.yuanFmt"
        label="退费金额"
      ></el-table-column>
      <!--        <el-table-column prop="financeInfo.amountReceived.yuanFmt" label="已收金额"></el-table-column>-->
      <el-table-column
        prop="financeInfo.actualReceivable.yuanFmt"
        label="实收金额"
      ></el-table-column>
      <el-table-column
        prop="financeInfo.notReceived.yuanFmt"
        label="待收金额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="fiCaseChargeList"
        label="付款方"
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.fiCaseChargeList.length > 0 &&
              scope.row.fiCaseChargeList[0].paymentUnit
            "
            >{{ scope.row.fiCaseChargeList[0].paymentUnit.name }}</span
          >
          <span
            v-if="
              scope.row.fiCaseChargeList.length > 0 &&
              scope.row.fiCaseChargeList[0].payer
            "
            >{{ scope.row.fiCaseChargeList[0].payer }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="fiCaseChargeList[0].chargeSource.label"
        label="收费来源"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="financeInfo.amountReceivedDate"
        label="收费确认日期"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.financeInfo">{{
            $divideDate(scope.row.financeInfo.amountReceivedDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTotalAmount"
        label="发票状态"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.financeInfo">
            <span
              v-if="
                scope.row.invoiceTotalAmount.cent > 0 &&
                scope.row.invoiceTotalAmount.cent <
                  scope.row.financeInfo.amountReceivable.cent
              "
              >未开票</span
            >
            <span
              v-if="
                (scope.row.invoiceTotalAmount.cent == undefined
                  ? scope.row.invoiceTotalAmount
                  : scope.row.invoiceTotalAmount.cent) > 0 &&
                (scope.row.invoiceTotalAmount.cent == undefined
                  ? scope.row.invoiceTotalAmount
                  : scope.row.invoiceTotalAmount.cent) <
                  scope.row.financeInfo.amount.cent
              "
              >部分开票</span
            >
            <span
              v-if="
                scope.row.invoiceTotalAmount.cent >=
                scope.row.financeInfo.amountReceivable.cent
              "
              >全部开票</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTotalAmount.cent"
        label="合计开票金额"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.financeInfo && scope.row.financeInfo.invoiceAmount"
            >{{ scope.row.financeInfo.invoiceAmount.cent / 100 }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTemp.invoiceAmount.yuanFmt"
        label="开票金额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTemp.makeOutDate"
        label="开票日期"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.invoiceTemp">{{
            $divideDate(scope.row.invoiceTemp.makeOutDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTemp.invoiceCode"
        label="发票代码"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTemp.invoiceNo"
        label="发票号码"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="invoiceTemp.invoiceReceiver"
        label="领票人"
      ></el-table-column>
      <el-table-column prop="" label="发票操作" width="250%" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="small"
            v-if="scope.row.invoiceTemp && hasPermission('auth:finance:edit')"
            plain
            @click="editInvoice(scope.$index, scope.row)"
            >修改
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="scope.row.invoiceTemp && hasPermission('auth:finance:red')"
            plain
            @click="redOrAbortInvoice(scope.$index, scope.row, true)"
            >冲红
          </el-button>
          <el-button
            type="danger"
            size="small"
            v-if="scope.row.invoiceTemp && hasPermission('auth:finance:cancel')"
            plain
            @click="redOrAbortInvoice(scope.$index, scope.row, false)"
          >
            作废
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchData"
        :sort.sync="tablesort"
        port="finance"
        :org-id="orgId"
      >
      </pagination>
    </div>

    <!--收费确认窗口开始-->
    <el-dialog title="收费确认" :visible.sync="showChargeDialog" width="50%">
      <el-form
        :model="chargeForm"
        label-position="right"
        ref="chargeForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="22" :offset="1">
            <div class="portlet">
              <div class="portlet-header">
                <span>案件财务基本信息</span>
              </div>
              <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                <el-table
                  :data="defaultData"
                  ref="defaultData"
                  border
                  @select-all="handleCheckBox"
                  @select="handleCheckBox"
                  size="small"
                  style="width: 100%"
                  :row-key="defaultData.id"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    prop="entrustInfo.entrustingUnit.name"
                    label="委托方"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        scope.row.entrustInfo.entrustingUnit &&
                        scope.row.entrustInfo.entrustingUnit.name
                          ? scope.row.entrustInfo.entrustingUnit.name
                          : scope.row.entrustInfo.entrustingParty
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="caseNo" label="案件编号">
                    <template slot-scope="scope">
                      <router-link
                        target="_blank"
                        :to="{
                          path: '/case/case-detail',
                          query: { id: scope.row.id },
                        }"
                        style="text-decoration: none"
                      >
                        <el-link type="primary" style="font-size: 12px"
                          >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
                        </el-link>
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="entrustInfo.authenticatedTarget"
                    label="被鉴定对象"
                  ></el-table-column>
                  <el-table-column
                    prop="financeInfo.amount.yuanFmt"
                    label="合同金额"
                  ></el-table-column>
                  <el-table-column
                    prop="financeInfo.discount.yuanFmt"
                    label="减免金额"
                  ></el-table-column>
                  <el-table-column
                    prop="financeInfo.amountRefund.yuanFmt"
                    label="退费金额"
                  ></el-table-column>
                  <!-- <el-table-column
                    prop="financeInfo.amountReceived.yuanFmt"
                    label="已收金额"
                  ></el-table-column> -->
                  <el-table-column
                    prop="financeInfo.actualReceivable.yuanFmt"
                    label="实收金额"
                  ></el-table-column>
                  <el-table-column
                    prop="financeInfo.notReceived.yuanFmt"
                    label="待收金额"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="付款方" label-width="25%" prop="payment">
              <el-radio v-model="payment" label="0">单位</el-radio>
              <el-radio v-model="payment" label="1">个人</el-radio>
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
                :model.sync="chargeForm.paymentUnit"
                port="entrustingNorApi"
                :clearable="true"
                :filterable="true"
                className="multiple-select"
                @change="(val) => getOtherCharge(val, 'paymentUnit')"
              />
            </el-form-item>
            <el-form-item
              label="付款人"
              label-width="25%"
              prop="payer"
              v-if="payment == '1'"
            >
              <el-input
                v-model="chargeForm.payer"
                @blur="getOtherCharge(chargeForm.payer, 'payer')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="otherChargeList.length > 0">
          <el-col :span="20">
            <el-form-item
              label="来自其他业务收入"
              label-width="25%"
              prop="fiOtherCharge"
            >
              <el-col>
                <template>
                  <el-select
                    v-model="chargeForm.fiOtherCharge"
                    placeholder="请选择"
                    :clearable="true"
                    value-key="id"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, i) in otherChargeList"
                      :key="i"
                      :label="
                        '收入' +
                        item.amount.cent / 100 +
                        '元，余额' +
                        item.balance.cent / 100 +
                        '元'
                      "
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-col>
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
                :model.sync="chargeForm.revenueType"
                data_type="revenue_type"
                :org-id="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="来源"
              label-width="50%"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
              prop="chargeSource"
            >
              <select-from-dict
                data_type="charge_source"
                :model.sync="chargeForm.chargeSource"
                className="multiple-select"
                :hasDefault="hasDefault"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="收费确认日期"
              label-width="25%"
              :rules="$filter_rules({ required: true })"
              prop="confirmDate"
            >
              <el-date-picker
                v-model="chargeForm.confirmDate"
                size="small"
                type="date"
                class="w100"
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
              :rules="$filter_rules({ required: true })"
              label-width="25%"
              prop="amount.cent"
            >
              {{ allPrice }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="备注" label-width="25%" prop="remarks">
              <el-input v-model="chargeForm.remarks" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="defaultData.length == 1">
          <el-col :span="22" :offset="1">
            <div class="portlet">
              <div class="portlet-header">
                <span>按收费项目的收费金额</span><em style="color: red">*</em>
              </div>
              <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                <el-table
                  :data="fiCaseChargeItemListTemp"
                  ref="fiCaseChargeItemListTemp"
                  border
                  @select-all="handleCheckBox"
                  @select="handleCheckBox"
                  size="small"
                  style="width: 100%"
                  :row-key="fiCaseChargeItemListTemp.id"
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
                    prop="amount.yuanFmt"
                    label="合同金额"
                  ></el-table-column>
                  <el-table-column
                    prop="discount.yuanFmt"
                    label="减免金额"
                  ></el-table-column>
                  <el-table-column
                    prop="refund.yuanFmt"
                    label="退费金额"
                  ></el-table-column>
                  <!-- <el-table-column
                    prop="received.yuanFmt"
                    label="已收金额"
                  ></el-table-column> -->
                  <el-table-column
                    prop="actualReceivable.yuanFmt"
                    label="实收金额"
                  ></el-table-column>
                  <el-table-column
                    prop="notReceived.yuanFmt"
                    label="待收金额"
                  ></el-table-column>
                  <el-table-column
                    prop="value"
                    label="确认收费金额"
                    width="140px"
                  >
                    <template slot-scope="scope">
                      <el-form-item label-width="0" prop="value">
                        <!-- <el-input size="small" v-model.number="scope.row.value"/> -->
                        <el-input-number
                          size="small"
                          :precision="2"
                          v-model="scope.row.value"
                          controls-position="right"
                          :min="0"
                          :max="999999999"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChargeDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCharge('chargeForm')"
          :disabled="isDisabled"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--收费确认窗口结束-->

    <!--开票登记窗口开始-->
    <el-dialog
      title="开票登记"
      :visible.sync="showInvoiceDialog"
      width="60%"
      class="invoice-register"
    >
      <el-form
        :model="makeInvoiceForm"
        label-position="right"
        ref="makeInvoiceForm"
      >
        <Collapse title="案件信息" :active="true">
          <template>
            <el-table
              :data="defaultData"
              ref="defaultData"
              border
              @select-all="handleCheckBox"
              @select="handleCheckBox"
              size="small"
              style="width: 100%"
              show-summary
              :summary-method="getSummaries2"
            >
              <el-table-column
                prop="entrustInfo.entrustingUnit.name"
                label="委托方"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.entrustInfo.entrustingUnit &&
                    scope.row.entrustInfo.entrustingUnit.name
                      ? scope.row.entrustInfo.entrustingUnit.name
                      : scope.row.entrustInfo.entrustingParty
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="professionCategory.name" label="专业类别">
              </el-table-column>
              <el-table-column prop="caseNo" label="案件编号">
                <template slot-scope="scope">
                  <router-link
                    target="_blank"
                    :to="{
                      path: '/case/case-detail',
                      query: { id: scope.row.id },
                    }"
                    style="text-decoration: none"
                  >
                    <el-link type="primary" style="font-size: 12px"
                      >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
                    </el-link>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="entrustInfo.authenticatedTarget"
                label="鉴定对象"
              >
              </el-table-column>
              <el-table-column prop="financeInfo.amount" label="合同金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.financeInfo.amount">{{
                    scope.row.financeInfo.amount.cent / 100
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="financeInfo.discount" label="减免金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.financeInfo.discount">{{
                    scope.row.financeInfo.discount.cent / 100
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="financeInfo.amountRefund" label="退费金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.financeInfo.amountRefund">{{
                    scope.row.financeInfo.amountRefund.cent / 100
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="financeInfo.invoiceAmount"
                label="已开金额"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.financeInfo.invoiceAmount">{{
                    scope.row.financeInfo.invoiceAmount.cent / 100
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="待开金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.financeInfo.invoiceAmount">{{
                    (scope.row.financeInfo.amountReceivable.cent -
                      scope.row.financeInfo.invoiceAmount.cent) /
                    100
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Collapse>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="发票类型"
              label-width="40%"
              prop="invoiceType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                data_type="invoice_type"
                :model.sync="makeInvoiceForm.invoiceType"
                className="multiple-select"
                :hasDefault="true"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item
              label="开票日期"
              label-width="40%"
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
              label-width="40%"
              prop="receiveDate"
              :rules="$filter_rules({ required: true, trigger: 'blur' })"
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
              label-width="40%"
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
              label-width="40%"
              prop="giveType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-enum
                :model.sync="makeInvoiceForm.giveType"
                :clearable="true"
                type="ca.GiveType"
                :has-default="true"
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
              @click="makeInvoiceForm.invoiceList.push({})"
            >
              增加
            </el-button>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="makeInvoiceForm.invoiceList"
              border
              size="small"
              style="width: 100%"
              show-summary
              :summary-method="getSummaries"
              :row-key="makeInvoiceForm.invoiceList.id"
            >
              <el-table-column
                prop="invoiceCode"
                label="发票代码"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'invoiceList.' + scope.$index + '.invoiceCode'"
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
                    :prop="'invoiceList.' + scope.$index + '.invoiceNo'"
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.invoiceNo"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceAmount" width="150px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>开票金额</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :rules="
                      $filter_rules({ required: true, type: 'decimalNumber' })
                    "
                    :prop="'invoiceList.' + scope.$index + '.invoiceAmount'"
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.invoiceAmount"
                    ></el-input>
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
                    :prop="'invoiceList.' + scope.$index + '.invoiceReceiver'"
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
                    :prop="'invoiceList.' + scope.$index + '.remarks'"
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.remarks"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200px" align="center">
                <template slot-scope="scope">
                  <Uploadpictures
                    :model.sync="scope.row.images"
                    :isUploadImg="true"
                    :multiple="true"
                    :append-to-body="true"
                  />
                  <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                  <Czur :model.sync="scope.row.images"></Czur>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    v-if="makeInvoiceForm.invoiceList.length != 1"
                    @click="makeInvoiceForm.invoiceList.splice(scope.$index, 1)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showInvoiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveInvoice('makeInvoiceForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--开票登记窗口结束-->

    <!--批量开票窗口开始-->
    <el-dialog
      title="批量开票"
      :visible.sync="showInvoiceBatchDialog"
      width="80%"
      class="invoice-batch"
    >
      <el-form
        :model="makeInvoiceBatchForm"
        label-position="right"
        ref="makeInvoiceBatchForm"
      >
        <Collapse title="案件信息" :active="true">
          <template>
            <el-table
              :data="makeInvoiceBatchForm.invoiceList"
              ref="invoiceList"
              border
              @select-all="handleCheckBox"
              @select="handleCheckBox"
              size="small"
              style="width: 100%"
              :row-key="makeInvoiceBatchForm.invoiceList.id"
            >
              <el-table-column
                type="index"
                width="50px"
                label="序号"
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
                      >{{
                        scope.row.caseDto.caseNo
                          ? scope.row.caseDto.caseNo
                          : "无"
                      }}
                    </el-link>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="caseDto.entrustInfo.authenticatedTarget"
                width="100px"
                label="鉴定对象"
              >
              </el-table-column>
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
              <el-table-column prop="invoiceType" width="120px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>发票类型</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'invoiceList.' + scope.$index + '.invoiceType'"
                    :rules="
                      $filter_rules({ required: true, trigger: 'change' })
                    "
                  >
                    <select-from-dict
                      data_type="invoice_type"
                      :model.sync="scope.row.invoiceType"
                      className="multiple-select"
                      :has-default="true"
                    ></select-from-dict>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceCode"
                width="150px"
                label="发票代码"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.invoiceCode"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceNo" width="150px" label="发票号">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.invoiceNo"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="drawer" width="150px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>开票人</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'invoiceList.' + scope.$index + '.drawer'"
                    :rules="$filter_rules({ required: true })"
                  >
                    <el-input
                      size="small"
                      v-model="scope.row.drawer"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="invoiceReceiver"
                width="150px"
                label="领票人"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.invoiceReceiver"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="title" width="150px" label="开票抬头">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.title"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="taxpayerNo"
                width="150px"
                label="纳税人识别号"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.taxpayerNo"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" width="150px" label="单位地址">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.address"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="phoneNo" width="150px" label="电话号码">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.phoneNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="bank" width="150px" label="开户银行">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.bank"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="bankAccount"
                width="150px"
                label="银行账号"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.bankAccount"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="makeOutDate" width="150px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>开票日期</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'invoiceList.' + scope.$index + '.makeOutDate'"
                    :rules="$filter_rules({ required: true })"
                  >
                    <el-date-picker
                      size="small"
                      style="width: 100%"
                      v-model="scope.row.makeOutDate"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="receiveDate" width="150px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>领票日期</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'invoiceList.' + scope.$index + '.receiveDate'"
                    :rules="$filter_rules({ required: true })"
                  >
                    <el-date-picker
                      size="small"
                      style="width: 100%"
                      v-model="scope.row.receiveDate"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="giveType" width="120px">
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>递送方式</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'invoiceList.' + scope.$index + '.giveType'"
                    :rules="
                      $filter_rules({ required: true, trigger: 'change' })
                    "
                  >
                    <select-from-enum
                      :model.sync="scope.row.giveType"
                      :clearable="true"
                      type="ca.GiveType"
                      :has-default="true"
                    ></select-from-enum>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" width="150px" label="备注">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.remarks"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200px" align="center">
                <template slot-scope="scope">
                  <Uploadpictures
                    :model.sync="scope.row.images"
                    :multiple="true"
                    :append-to-body="true"
                  ></Uploadpictures>
                  <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                  <Czur :model.sync="scope.row.images"></Czur>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    v-if="makeInvoiceBatchForm.invoiceList.length != 1"
                    @click="
                      makeInvoiceBatchForm.invoiceList.splice(scope.$index, 1)
                    "
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showInvoiceBatchDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveInvoiceBatch('makeInvoiceBatchForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--批量开票窗口结束-->

    <!--发票修改窗口开始-->
    <el-dialog
      title="发票修改"
      :visible.sync="showEditInvoiceDialog"
      width="960px"
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
  </div>
</template>

<script>
import Collapse from "../layout/Collapse";
import api from "../../api/index";
import Select2 from "../../components/common/Select2";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import Uploadpictures from "../../components/common/Uploadpictures";
import Portlet from "../layout/Portlet";
import PictureWall from "../../components/common/PictureWall";
import Czur from "../../components/common/Czur";
import commonNum from "@/utils/commonNum.js";
import MoreSearch from "@/page/case-management/case-list/Module/MoreSearch";
import { mapState } from "vuex";
/*import InvoiceTable from './components/InvoiceTable'*/
import BigDecimalUtils from "../../utils/BigDecimalUtils";

export default {
  name: "Invoicemanagement",
  components: {
    Collapse: Collapse,
    Select2: Select2,
    "select-qualification": SelectFromQualification,
    Uploadpictures: Uploadpictures,
    Portlet: Portlet,
    PictureWall: PictureWall,
    MoreSearch,
    Czur,
    /*InvoiceTable*/
  },
  data() {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
      };

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }

      return fmt;
    };
    return {
      checkMore: false,
      exportAble: false, //控制导出按钮是否可点击
      exportCode: "导出", //导出按钮文字
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tablesort: null,
      tableData: [], //从后台获取的数据
      splitTableData: [], //把发票切分的数据
      chargeTypeData: [], //收费类型，用于动态渲染财务列表表头和查询条件
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      spanArr: [],
      labelWidth: "100px",
      //查询相关
      moreSearchDialog: false,
      searchForm: {
        entrustingUnit: { name: "" },
        caseStatus: "",
        processSituation: "",
      },
      searchData: {},
      //选择框相关
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},
      defaultData: [], //模态框中显示的案件详情
      //收费确认相关
      showChargeDialog: false, //收费确认模态框
      chargeForm: {
        fiCaseChargeItemList: [],
        amount: { cent: 0 },
        confirmDate: null,
        fiOtherCharge: null,
        payer: "",
      }, //收费确认表单
      hasDefault: 0,
      payment: "0", //收费确认付款单位
      otherChargeList: [], //收费确认时的其他业务收入选择框
      fiCaseChargeItemListTemp: [], //收费确认按收费项目
      //开票登记相关
      showInvoiceDialog: false, //开票登记模态框
      drawer: "", //开票人
      makeInvoiceForm: {
        invoiceList: [{}],
        drawer: "",
        makeOutDate: "",
        receiveDate: "",
      }, //开票登记表单
      //批量开票相关
      showInvoiceBatchDialog: false, //批量开票模态框
      makeInvoiceBatchForm: { invoiceList: [] }, //批量开票表单
      //发票修改相关
      showEditInvoiceDialog: false, //发票修改模态框
      editInvoiceForm: {}, //发票修改表单
      editInvoiceImages: [], //发票修改图片
      //发票冲红作废相关
      showRedOrAbortDialog: false, //冲红或者作废模态框
      isRed: true, //冲红或者作废
      redOrAbortForm: {}, //冲红或者作废表单
      isDisabled: false,
      listType: "",
      poisonCategoryOpt: [], //毒物毒品类别,
    };
  },
  inject: ["hasPermission"],
  methods: {
    setOrgIdSession() {
      var orgId = this.searchForm.orgId;
      if (orgId == undefined) {
        orgId = "";
      }
      this.$get(api.org + "/setOrgId?orgId=" + orgId)
        .then((res) => {
          this.$get(api.poisonCategory)
            .then((res) => {
              this.poisonCategoryOpt = res.data;
            })
            .catch((err) => console.log(err));
          //费用类型
          this.$get(api.chargingType).then((res) => {
            this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSummaries2(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index <= 2) {
          return;
        }

        const values = data.map((item) => {
          var value = item;

          if (column.property) {
            let propertyName = column.property.split(".");
            return Number(value[propertyName[0]][propertyName[1]].cent);
          } else {
            return Number(
              value.financeInfo.amountReceivable.cent -
                value.financeInfo.invoiceAmount.cent
            );
          }
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
          sums[index] /= 100;
        }
      });
      return sums;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index !== 2) {
          return;
        }
        const values = data.map((item) => {
          var value = item;
          return Number(value.invoiceAmount);
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
          sums[index];
        }
      });
      return sums;
    },
    changeSelectRows(rows) {
      this.selectRows = JSON.parse(JSON.stringify(rows));
    },
    getRowKey(row) {
      return row.id;
    },
    checkSelectLength(arr) {
      if (arr.length == 1) {
        return true;
      } else {
        if (arr.length == 0) {
          this.$message.error("您还没有选择案件，请选择需要操作的案件！");
        } else {
          this.$message.error("只能选择一个案件进行操作！");
        }
        return false;
      }
    },
    init() {
      this.$get(api.finance, this.searchData, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      })
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          // this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.confirmSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取当前时间
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var hour = " 00:00:00"; //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}${hour}`;
      return defaultDate;
    },
    //合并单元格
    initTableData(data) {
      this.splitTableData = [];
      var tempData = [].concat(data);
      tempData.forEach((v, i) => {
        if (this.chargeTypeData.length) {
          this.chargeTypeData.forEach((value) => {
            v[value.key] = 0;
          });
        }
        //按收费类型的收费确认金额
        if (v.fiCaseChargeTypeList.length) {
          v.fiCaseChargeTypeList.forEach((value) => {
            v[value.chargingType.key] = value.received.cent / 100;
          });
        }
        //发票切分
        if (v.fiInvoiceList.length) {
          var invoiceTotalAmount = { cent: 0 };
          v.fiInvoiceList.forEach((value) => {
            var json = JSON.parse(JSON.stringify(v));
            delete json.fiInvoiceList;
            json.invoiceTemp = value;
            json.invoiceTotalAmount = invoiceTotalAmount;
            invoiceTotalAmount.cent += value.invoiceAmount.cent;
            this.splitTableData.push(json);
          });
        } else {
          var json = JSON.parse(JSON.stringify(v));
          delete json.invoiceList;
          json.invoiceTemp = null;
          json.invoiceTotalAmount = 0;
          this.splitTableData.push(json);
        }
      });
      this.getSpanArr(this.splitTableData);
      this.echoSelectData();
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
      var i = this.chargeTypeData.length;
      i = 0; //列表上收费类型列BUG，先固定
      var exceptColArr = [
        28 + i,
        29 + i,
        30 + i,
        31 + i,
        32 + i,
        33 + i,
        34 + i,
        35 + i,
      ];
      if (exceptColArr.indexOf(columnIndex) == -1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
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
    echoSelectData() {
      this.$nextTick(() => {
        var curpage = this.page.current;
        this.splitTableData.forEach((item, index) => {
          this.selectData[curpage] &&
            this.selectData[curpage].forEach((value, ind, arr) => {
              if (value.id === item.id) {
                this.$refs.invoiceTable.toggleRowSelection(item, true);
              }
            });
        });
      });
    },
    //查询
    confirmSearch() {
      this.searchData = JSON.parse(JSON.stringify(this.searchForm));
      if (this.searchData && this.searchData.registerId) {
        this.searchData.registerId = this.searchData.registerId.id;
      }
      if (this.searchData && this.searchData.prefectureId) {
        this.searchData.prefectureId = this.searchData.prefectureId.id;
      }
      this.moreSearchDialog = false;
    },
    //打开收费确认模态框
    showChargeModel() {
      this.isDisabled = false;
      if (this.selectRows.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
      } else {
        //判断是否有案件正在进行费用异动、退案、退费、费用减免，并给出提示信息
        let caseIds1 = "";
        this.selectRows.forEach((item) => {
          caseIds1 = caseIds1 + item.id + ",";
        });
        var flag = true;
        this.$get(api.checkCaseChange, {
          caseIds: caseIds1.substring(0, caseIds1.length - 1),
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            flag = false;
            var message =
              this.selectRows.length > 1
                ? res.data.replace(/!/g, ",<br>")
                : res.data;
            var confirmInfo = message + "请等待审批完成后再进行收费确认";
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<span style='line-height:25px;color: red'>${confirmInfo}</span>`,
              type: "error",
            });
          }
          if (flag) {
            this.showChargeModel2();
          }
        });
      }
    },
    showChargeModel2() {
      this.chargeForm = {
        fiCaseChargeItemList: [],
        amount: { cent: 0 },
        fiOtherCharge: null,
        payer: "",
        confirmDate: this.getNowTime(),
      };
      if (this.selectRows[0].fiCaseChargeList.length > 0) {
        if (this.selectRows[0].fiCaseChargeList[0].payer != "") {
          this.payment = "1";
          this.chargeForm.payer = this.selectRows[0].fiCaseChargeList[0].payer;
        } else if (
          this.selectRows[0].fiCaseChargeList[0].paymentUnit != "" &&
          this.selectRows[0].fiCaseChargeList[0].paymentUnit != null
        ) {
          this.payment = "0";
          this.chargeForm.paymentUnit =
            // this.selectRows[0].fiCaseChargeList[0].paymentUnit.name;
            this.selectRows[0].fiCaseChargeList[0].paymentUnit;
        }
      }
      this.defaultData = JSON.parse(JSON.stringify(this.selectRows));
      this.chargeForm.amount = { cent: 0 };
      var noAmountCase = ""; //待收金额为0的案件
      var caseIds = "";
      var professionCategoryIds = "";
      this.defaultData.forEach((v, i) => {
        if (v.financeInfo.notReceived.cent <= 0) {
          noAmountCase = noAmountCase + v.caseNo + "、";
        }
        caseIds = caseIds + v.id + "|";
        this.chargeForm.amount.cent +=
          v.financeInfo.notReceived.cent / 100;
        professionCategoryIds =
          professionCategoryIds + v.professionCategory.id + ",";
      });
      this.chargeForm.amount.cent = this.chargeForm.amount.cent.toFixed(2);
      //如果只有一个案件才显示，按收费项目收费确认
      if (this.defaultData.length == 1) {
        this.fiCaseChargeItemListTemp = JSON.parse(
          JSON.stringify(this.defaultData[0].fiCaseChargeSumByItemList)
        );
      }
      this.chargeForm.caseId = caseIds.substr(0, caseIds.length - 1);
      this.chargeForm.professionCategoryIds = professionCategoryIds.substr(
        0,
        professionCategoryIds.length - 1
      );
      if (noAmountCase) {
        this.$message.error(
          "案件" +
            noAmountCase.substr(0, noAmountCase.length - 1) +
            "待收金额为0!"
        );
      } else {
        //清空委托方和其他业务收入选择框
        // this.chargeForm.payer = null;
        // this.chargeForm.paymentUnit = null;
        this.chargeForm.otherChargeSum = null;
        this.otherChargeList = [];
        this.showChargeDialog = true;
        //清除验证
        this.$nextTick(function () {
          this.$refs["chargeForm"].clearValidate();
        });
      }
      this.hasDefault++;
    },
    //收费确认时根据选择的付款方获取对应的其他业务收入
    getOtherCharge(value, payment) {
      this.otherChargeList = [];
      this.chargeForm.fiOtherCharge = null;
      var data = {
        paymentUnitId: "",
        payer: "",
        professionCategoryIds: this.chargeForm.professionCategoryIds,
      };
      if (payment == "paymentUnit") {
        data.paymentUnitId = value.id;
      } else if (payment == "payer") {
        data.payer = value;
      }
      this.$get(api.otherCharge + "/list", data)
        .then((res) => {
          this.otherChargeList = JSON.parse(JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //确认收费
    saveCharge(formName) {
      this.isDisabled = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var flag = true;
          var data = JSON.parse(JSON.stringify(this.chargeForm));
          let cent =
            typeof this.allPrice == "string"
              ? BigDecimalUtils.times(this.allPrice, 100)
              : 0;
          cent = +cent;
          data.amount = {
            cent: cent, //parseInt(parseFloat(parseFloat(data.amount.cent).toFixed(2)) * 100)
          };
          if (this.payment == "0") {
            data.payer = "";
          } else {
            data.paymentUnit = { id: "" };
          }
          this.fiCaseChargeItemListTemp.forEach((v, i) => {
            if (v.value) {
              data.fiCaseChargeItemList.push({
                chargingItem: v.chargingItem,
                amount: { cent: Number(BigDecimalUtils.times(v.value, 100)) },
              });
            } else {
              data.fiCaseChargeItemList.push({
                chargingItem: v.chargingItem,
                amount: { cent: 0 },
              });
            }
          });
          if (data.fiOtherCharge) {
            delete data.fiOtherCharge.createBy;
            delete data.fiOtherCharge.updateBy;
            if (data.fiOtherCharge.balance.cent < data.amount.cent) {
              flag = false;
              this.$message.error("收费确认的金额不能大于其他业务收入的余额!");
            } else if (
              data.fiOtherCharge.balance.cent > data.amount.cent &&
              data.amount.cent <
                this.defaultData[0].financeInfo.notReceived.cent
            ) {
              flag = false;
              this.$message.error(
                "使用其他业务收入进行收费确认必须一次性收完!"
              );
            }
          }
          if (this.defaultData.length == 1) {
            if (
              this.defaultData[0].financeInfo.notReceived.cent <
              data.amount.cent
            ) {
              flag = false;
              this.$message.error("收费确认的金额不能大于待收金额!");
            }
            var amount = 0;
            data.fiCaseChargeItemList.forEach((value) => {
              amount += parseInt(value.amount.cent);
            });
            // if (amount != data.amount.cent) {
            //     flag = false;
            //     this.$message.error("收费确认的金额必须等于各收费项目确认金额之和!");
            // }
          }
          if (flag) {
            this.$post(api.caseCharge, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "收费确认成功！",
                    type: "success",
                  });
                  this.showChargeDialog = false;
                  this.init();
                  this.selectRows = [];
                  this.selectData = [];
                  this.$refs.invoiceTable.clearSelection();
                  this.$refs[formName].resetFields();
                  this.$refs.fiCaseChargeItemListTemp.clearSelection();
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
                this.isDisabled = false;
              });
          } else {
            this.isDisabled = false;
          }
        } else {
          this.isDisabled = false;
        }
      });
    },
    //开票登记
    showInvoiceModel() {
      if (this.selectRows.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
        return;
      } else {
        this.defaultData = JSON.parse(JSON.stringify(this.selectRows));
        var noAmountCase = ""; //待开金额为0的案件
        var hasInvoiceCaseNo = ""; //已开发票的案件
        var caseIds = "";
        this.defaultData.forEach((v, i) => {
          if (
            v.financeInfo.amountReceivable.cent - v.financeInfo.invoiceAmount.cent <=
            0
          ) {
            noAmountCase = noAmountCase + v.caseNo + "、";
          }
          if (
            v.financeInfo.invoiceAmount &&
            v.financeInfo.invoiceAmount.cent > 0
          ) {
            hasInvoiceCaseNo += v.caseNo + "、";
          }
          caseIds = caseIds + v.id + ",";
        });
        caseIds = caseIds.substr(0, caseIds.length - 1);
        this.makeInvoiceForm = { invoiceList: [{}], drawer: "" };
        this.makeInvoiceForm.caseIds = caseIds;
        this.makeInvoiceForm.drawer = this.drawer;
        if (caseIds.indexOf(",") != -1 && hasInvoiceCaseNo.length > 0) {
          this.$message.error(
            "案件" +
              hasInvoiceCaseNo.substr(0, hasInvoiceCaseNo.length - 1) +
              "已开发票，不能再进行多个案件开票!"
          );
          return;
        }
        if (noAmountCase) {
          let str = noAmountCase.substr(0, noAmountCase.length - 1);
          if (str === "null") {
            str = "";
          }
          this.$message.error("案件" + str + "待开金额为0!");
          return;
        }
        this.showInvoiceDialog = true;
      }
      //清除验证
      this.$nextTick(() => {
        this.$refs["makeInvoiceForm"].clearValidate();
      });
      let day = new Date().format("yyyy-MM-dd hh:mm:ss");
      this.$set(this.makeInvoiceForm, "makeOutDate", day);
      this.$set(this.makeInvoiceForm, "receiveDate", day);
    },
    saveInvoice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var caseIds = this.makeInvoiceForm.caseIds;
          var invoiceList = [];
          var promiseArr = [];
          var invoiceAmount = 0; // 开票金额
          var needInvoiceAmount = 0; //待收金额和
          this.makeInvoiceForm.invoiceList.forEach((v, i) => {
            var invoice = {};
            if (v.images && v.images.length) {
              let p = new Promise((resolve, reject) => {
                this.$compressImages(v.images).then((res) => {
                  invoice.images = [].concat(res);
                  resolve();
                });
              });
              promiseArr.push(p);
            }
            invoice.drawer = this.makeInvoiceForm.drawer;
            invoice.giveType = this.makeInvoiceForm.giveType;
            invoice.invoiceType = this.makeInvoiceForm.invoiceType;
            invoice.invoiceAmount = { cent: Math.round(v.invoiceAmount * 100) };
            invoice.makeOutDate = this.makeInvoiceForm.makeOutDate;
            invoice.receiveDate = this.makeInvoiceForm.receiveDate;
            invoice.invoiceCode = v.invoiceCode;
            invoice.invoiceNo = v.invoiceNo;
            invoice.invoiceReceiver = v.invoiceReceiver;
            invoice.title = v.title;
            invoice.taxpayerNo = v.taxpayerNo;
            invoice.address = v.address;
            invoice.phoneNo = v.phoneNo;
            invoice.bank = v.bank;
            invoice.bankAccount = v.bankAccount;
            invoice.remarks = v.remarks;
            invoiceAmount += Math.round(v.invoiceAmount * 100);
            invoiceList.push(invoice);
          });
          this.defaultData.forEach((v) => {
            needInvoiceAmount +=
              v.financeInfo.amountReceivable.cent - v.financeInfo.invoiceAmount.cent;
          });
          if (needInvoiceAmount < invoiceAmount) {
            this.$message.error("开票金额不能大于待开金额！");
            return;
          }
          if (caseIds.indexOf(",") != -1) {
            if (needInvoiceAmount != invoiceAmount) {
              this.$message.error("多个案件的开票金额必须等于待收金额！");
              return;
            } else if (invoiceList.length > 1) {
              this.$message.error("多个案件只能开一张发票！");
              return;
            }
          }
          Promise.all(promiseArr)
            .then((res) => {
              this.$post(api.invoices + "/save?caseIds=" + caseIds, invoiceList)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "开票登记成功！",
                      type: "success",
                    });
                    this.showInvoiceDialog = false;
                    this.init();
                    this.selectRows = [];
                    this.selectData = [];
                    this.$refs.invoiceTable.clearSelection();
                    this.$refs.fiCaseChargeItemListTemp.clearSelection();
                    this.$refs[formName].resetFields();
                  }
                })
                .catch((err) => {
                  this.$message.error(err.errMsg);
                });
            })
            .catch((err) => {
              return err;
            });
        }
      });
    },
    //批量开票
    showInvoiceBatchModel() {
      this.makeInvoiceBatchForm.invoiceList = [];
      if (this.selectRows.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
      } else {
        this.defaultData = JSON.parse(JSON.stringify(this.selectRows));
        var noAmountCase = ""; //待开金额为0的案件
        this.defaultData.forEach((v, i) => {
          if (
            v.financeInfo.amountReceivable.cent - v.financeInfo.invoiceAmount.cent <=
            0
          ) {
            noAmountCase = noAmountCase + v.caseNo + "、";
          }
          var temp = {
            caseDto: {
              id: v.id,
              caseNo: v.caseNo,
              entrustInfo: v.entrustInfo,
            },
            drawer: this.drawer,
            invoiceAmount: {
              cent:
                v.financeInfo.amountReceivable.cent -
                v.financeInfo.invoiceAmount.cent,
            },
          };
          this.makeInvoiceBatchForm.invoiceList.push(temp);
        });
        if (noAmountCase) {
          let str = noAmountCase.substr(0, noAmountCase.length - 1);
          if (str === "null") {
            str = "";
          }
          this.$message.error("案件" + str + "待开金额为0!");
        } else {
          this.showInvoiceBatchDialog = true;
        }
      }
      let day = new Date().format("yyyy-MM-dd hh:mm:ss");
      this.makeInvoiceBatchForm.invoiceList.forEach((item) => {
        this.$set(item, "makeOutDate", day);
        this.$set(item, "receiveDate", day);
      });
    },
    saveInvoiceBatch(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = [].concat(this.makeInvoiceBatchForm.invoiceList);
          var promiseArr = [];

          data.forEach((v, i) => {
            if (v.images && v.images.length) {
              let p = new Promise((resolve, reject) => {
                this.$compressImages(v.images).then((res) => {
                  v.images = res;
                  resolve();
                });
              });
              promiseArr.push(p);
            }
          });
          Promise.all(promiseArr).then((res) => {
            this.$post(api.invoices + "/saveBatch", data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "批量开票成功！",
                    type: "success",
                  });
                  this.showInvoiceBatchDialog = false;
                  this.init();
                  this.selectRows = [];
                  this.selectData = [];
                  this.$refs.invoiceTable.clearSelection();
                  this.$refs.fiCaseChargeItemListTemp.clearSelection();
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      });
    },
    //修改发票
    editInvoice(index, row) {
      this.editInvoiceForm = {};
      this.editInvoiceImages = [];
      this.$get(api.invoices + "/" + row.invoiceTemp.id)
        .then((res) => {
          this.editInvoiceForm = JSON.parse(JSON.stringify(res.data));
          this.editInvoiceImages = JSON.parse(JSON.stringify(res.data.images));
          this.showEditInvoiceDialog = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeInvoice(file, fileList) {
      this.editInvoiceImages.push(file);
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
                  this.$refs[formName].resetFields();
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
    redOrAbortInvoice(index, row, action) {
      this.redOrAbortForm = {};
      this.isRed = action;
      this.redOrAbortForm.status = this.isRed ? "RED" : "ABORT";
      var text = this.isRed ? "冲红" : "作废";
      this.redOrAbortForm.id = row.invoiceTemp.id;
      var data = {};
      var p1 = new Promise((resolve, reject) => {
        this.$get(api.invoices + "/" + row.invoiceTemp.id)
          .then((res) => {
            if (res.status == 200) {
              data = res.data;
              resolve();
            } else {
              resolve();
            }
          })
          .catch((err) => {
            console.log(err);
            resolve();
          });
      });
      Promise.all([p1]).then((res) => {
        if (data.invoiceProperty && data.invoiceProperty.value == "OTHER") {
          this.$confirmBox("该发票为其他业务收入发票，是否" + text + "?").then(
            (res) => {
              this.showRedOrAbortDialog = true;
            }
          );
        } else if (data.caseCount > 1) {
          this.$confirmBox("该发票关联多个案件，是否" + text + "?").then(
            (res) => {
              this.showRedOrAbortDialog = true;
            }
          );
        } else {
          this.showRedOrAbortDialog = true;
        }
        //清除验证
        this.$nextTick(function () {
          if (this.$refs["redOrAbortForm"]) {
            this.$refs["redOrAbortForm"].clearValidate();
          }
        });
      });
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
                this.$refs[formName].resetFields();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //导出财务列表
    exportExcel() {
      this.exportAble = true;
      this.exportCode = "正在导出";
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
        .get(api.finance + "/export", {
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
          link.setAttribute("download", "财务管理列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
          this.exportAble = false;
          this.exportCode = "导出";
        })
        .catch((err) => {
          this.exportAble = false;
          this.exportCode = "导出";
          console.log(err);
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
      if (prop == "caseNo") {
        this.tablesort.prop = "cc.caseNo";
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
      } else if (prop == "createDate") {
        this.tablesort.prop = "cc.create_date";
      } else if (prop == "happenDate") {
        this.tablesort.prop = "cc.happen_date";
      }
    },
  },
  watch: {
    "searchForm.authId": function (newVal, oldVal) {
      if (!newVal) {
        this.searchForm.authRole = null;
      }
    },
    tableData: {
      handler(newVal, oldVal) {
        this.initTableData(this.tableData);
      },
      immediate: true,
    },
    orgId: function () {
      this.searchForm = { entrustingUnit: { name: "" }, caseStatus: "" };
      this.$get(api.chargingType).then((res) => {
        this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
      });
    },
    "searchForm.abnormalStage": function (newVal, oldVal) {
      if (newVal == "ABORT_CASE") {
        this.listType = "abort";
      } else if (newVal == "REFUND") {
        this.listType = "refund";
      } else if (newVal == "DISCOUNT") {
        this.listType = "discount";
      } else {
        this.listType = "";
      }

      if (newVal) {
        this.searchForm.processSituation = "";
      }
    },

    page: {
      handler(newval, oldval) {
        this.echoSelectData();
      },
      deep: true,
    },
    "chargeForm.amount.cent": {
      handler: function (newVal, oldVal) {
        if (newVal) {
          var amount = this.defaultData[0].financeInfo.notReceived.cent;
          var newValue = parseInt(
            BigDecimalUtils.times(
              parseFloat(this.chargeForm.amount.cent).toFixed(2),
              100
            )
          );
          if (newValue == amount) {
            var fiCaseChargeItemListTemp = JSON.parse(
              JSON.stringify(this.fiCaseChargeItemListTemp)
            );
            fiCaseChargeItemListTemp.forEach((v) => {
              v.value = v.notReceived.cent / 100;
            });
            this.fiCaseChargeItemListTemp = fiCaseChargeItemListTemp;
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    //收费确认的总金额
    allPrice: function () {
      let allPrice = 0;
      if (this.defaultData && this.defaultData.length == 1) {
        // let allPrice = 0;
        this.fiCaseChargeItemListTemp.forEach((v) => {
          // debugger
          allPrice = BigDecimalUtils.plus(allPrice, v.value);
          // allPrice += v.value;
        });
        this.chargeForm.amount.cent =
          parseInt((allPrice * 100).toString()) / 100;
        //this.chargeForm.amount.cent = parseInt((allPrice * 100).toString()) / 100;
      } else if (this.defaultData && this.defaultData.length > 1) {
        this.defaultData.forEach((v) => {
          if (v && v.financeInfo && v.financeInfo.notReceived) {
            allPrice = BigDecimalUtils.plus(
              allPrice,
              v.financeInfo.notReceived.cent
            );
          }
        });
        allPrice = BigDecimalUtils.divide(allPrice, 100);
        this.chargeForm.amount.cent =
          parseInt((allPrice * 100).toString()) / 100;
      }
      return allPrice;
    },
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "财务管理列表");
    this.$get(api.myInfo).then((res) => {
      var data = JSON.parse(JSON.stringify(res.data));
      this.drawer = data.hrStaff == undefined ? "" : data.hrStaff.name;
    });
    this.$get(api.chargingType).then((res) => {
      this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
    });
    this.$get(api.poisonCategory)
      .then((res) => {
        this.poisonCategoryOpt = res.data;
      })
      .catch((err) => console.log(err));
    //表格的最大高度
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
  mounted() {
    let watcher = this.$watch(
      "tableData",
      () => {
        let oBox = document.querySelector(".el-table__fixed-body-wrapper");
        oBox.style.height = parseInt(oBox.style.height) - 10 + "px";
        document.querySelector(".el-table__fixed").style.bottom = "0px";
        if (watcher) watcher();
      },
      { deep: true }
    );
  },
};
</script>

<style  lang="less" scoped>
.table /deep/ .cell {
  width: 100% !important;
}
.invoice-register {
  z-index: 9999 !important;
}
.invoice-batch {
  z-index: 9999 !important;
}
.edit-invoice {
  z-index: 9999 !important;
}
</style>
<style lang="less">
body > .el-dialog__wrapper {
  z-index: 9999 !important;
}
body > .el-select-dropdown {
  z-index: 9999 !important;
}
body > .el-date-picker {
  z-index: 9999 !important;
}
body > .el-date-picker {
  z-index: 9999 !important;
}
body > .el-message.el-message--error {
  z-index: 9999 !important;
}
</style>
