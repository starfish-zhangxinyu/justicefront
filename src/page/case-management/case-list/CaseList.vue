<template>
  <!-- 案件列表 -->
  <div id="case-list">
    <!--案件查询开始-->
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" class="marBot10">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                :orgId="orgId"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" class="marBot10">
              <el-input v-model="searchForm.caseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象" class="margin10">
              <el-input v-model="searchForm.authenticatedTarget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="流水号" class="margin0">
              <el-input v-model="searchForm.serialNumber"></el-input>
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
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="登记日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginRegisterDate"
                        :endValue.sync="searchForm.endRegisterDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="委托日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginEntrustingDate"
                        :endValue.sync="searchForm.endEntrustingDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="受理日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginAcceptDate"
                        :endValue.sync="searchForm.endAcceptDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <!--</el-row>-->
                  <!--<el-row >-->
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="出案日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginReportOutDate"
                        :endValue.sync="searchForm.endReportOutDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="发放日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginGiveDate"
                        :endValue.sync="searchForm.endGiveDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="归档日期">
                      <DataPicker
                        :startValue.sync="searchForm.beginArchiveDate"
                        :endValue.sync="searchForm.endArchiveDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <!--</el-row>-->
                  <!--<el-row >-->
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="案发时间">
                      <DataPicker
                        :startValue.sync="searchForm.beginHappenDate"
                        :endValue.sync="searchForm.endHappenDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
                    <el-form-item label="检验时间">
                      <DataPicker
                        :startValue.sync="searchForm.beginAuthenticatedDate"
                        :endValue.sync="searchForm.endAuthenticatedDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :xl="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="委托类型">
                      <select-from-dict
                        :model.sync="searchForm.entrustingUnitTypeId"
                        data_type="ex_unit_type"
                        :model-id="true"
                        :clearable="true"
                        className="multiple-select"
                        :orgId="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="联系人">
                      <el-input v-model="searchForm.contact"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="案件类型">
                      <select-from-dict
                        :model.sync="searchForm.caseTypeId"
                        :model-id="true"
                        :clearable="true"
                        data_type="case_type"
                        className="multiple-select"
                        :filterable="true"
                        :orgId="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="受理地点">
                      <select-from-table
                        :model.sync="searchForm.acceptStationId"
                        port="acceptStation"
                        :model-id="true"
                        className="multiple-select"
                        :orgId="orgId"
                        :clearable="true"
                        :filterable="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="是否重新鉴定">
                      <el-select
                        v-model="searchForm.historyAuthenticated"
                        style="width: 100%"
                        :clearable="true"
                        placeholder="请选择"
                      >
                        <el-option label="是" value="Y"></el-option>
                        <el-option label="否" value="N"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="采血管编号">
                      <el-input v-model="searchForm.vesselNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="鉴定项目">
                      <select-from-table
                        :model.sync="searchForm.authenticatedItemId"
                        port="entrustingMatter"
                        :model-id="true"
                        className="multiple-select"
                        :orgId="orgId"
                        :clearable="true"
                        :filterable="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="基本案情">
                      <el-input
                        v-model="searchForm.entrustingDesc"
                        :autosize="{ minRows: 1, maxRows: 6 }"
                        type="textarea"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="案件相关人员">
                <el-row>
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="鉴定助理">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        qualification_type="ASSIST"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.assistId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="复核人">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="REVIEWER"
                        :model.sync="searchForm.reviewerId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="授权签字人">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="AUTHORIZED_SIGNATORY"
                        :model.sync="searchForm.authorizedSignatoryId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="签发人">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        :filterable="true"
                        className="multiple-select"
                        qualification_type="ISSUER"
                        :model.sync="searchForm.issuerId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="登记人">
                      <select-from-table
                        :model.sync="searchForm.registerId"
                        :filterable="true"
                        :clearable="true"
                        port="register"
                        className="multiple-select"
                        :condition="{ type: 'case' }"
                        :orgId="orgId"
                      >
                      </select-from-table>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="市场人员">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        qualification_type="SALES"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.saleId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="实验人员">
                      <select-qualification
                        dataScope="caseData"
                        profession_category="ALL"
                        qualification_type="LAB_STAFF"
                        :filterable="true"
                        className="multiple-select"
                        :model.sync="searchForm.labStaffId"
                        :orgId="orgId"
                      ></select-qualification>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="案件状态">
                <el-row>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="案件状态" prop="caseStatus">
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
                    :lg="{ span: 8 }"
                    v-show="searchForm.caseStatus == 'NORMAL'"
                  >
                    <el-form-item label="正常阶段">
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
                    :lg="{ span: 8 }"
                    v-show="searchForm.caseStatus == 'ABNORMAL'"
                  >
                    <el-form-item label="异常阶段">
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
                    :lg="{ span: 8 }"
                    v-show="searchForm.caseStatus == 'ABNORMAL'"
                  >
                    <el-form-item label="过程情况">
                      <select-from-enum
                        :model.sync="searchForm.processSituation"
                        :list-type="listType"
                        :clearable="true"
                        type="flow.FlowCaseStatus"
                        className="multiple-select"
                        :modelVal="true"
                      ></select-from-enum>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="是否已出案" prop="isReportOut">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="是否已发放" prop="isGiveInfo">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="是否已归档" prop="isArchive">
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
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="收费情况">
                <el-row>
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="收入类型" prop="revenueTypeId">
                      <select-from-dict
                        :model.sync="searchForm.revenueTypeId"
                        :clearable="true"
                        :model-id="true"
                        className="multiple-select"
                        data_type="revenue_type"
                        :orgId="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <!--</el-row>-->
                  <!--<el-row >-->
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="费用类型" prop="chargingTypeKey">
                      <el-select
                        v-model="searchForm.chargingTypeKey"
                        placeholder="请选择"
                        style="width: 100%"
                        :clearable="true"
                        value-key="key"
                      >
                        <el-option
                          v-for="item in chargeTypeData"
                          :key="item.key"
                          :label="item.name"
                          :value="item.key"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="来源方式" prop="chargeSourceId">
                      <select-from-dict
                        data_type="charge_source"
                        :model-id="true"
                        :clearable="true"
                        :model.sync="searchForm.chargeSourceId"
                        className="multiple-select"
                        :orgId="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="{ span: 8 }" :lg="{ span: 8 }">
                    <el-form-item label="收费确认日期" prop="">
                      <DataPicker
                        :startValue.sync="searchForm.beginConfirmedDate"
                        :endValue.sync="searchForm.endConfirmedDate"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="发票情况">
                <el-row>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="开票状态" prop="billingStatus">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="发票状态" prop="invoiceStatus">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="发票类型" prop="invoiceType">
                      <select-from-dict
                        :model.sync="searchForm.invoiceTypeId"
                        :model-id="true"
                        className="multiple-select"
                        data_type="invoice_type"
                        :clearable="true"
                        :orgId="orgId"
                      ></select-from-dict>
                    </el-form-item>
                  </el-col>
                  <!--</el-row>-->
                  <!--<el-row >-->
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="发票代码" prop="invoiceCode">
                      <el-input v-model="searchForm.invoiceCode"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="发票号码" prop="invoiceNo">
                      <el-input v-model="searchForm.invoiceNo"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="开票日期">
                      <DataPicker
                        :startValue.sync="searchForm.makeOutDateStart"
                        :endValue.sync="searchForm.makeOutDateEnd"
                        valueFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="鉴定意见">
                <el-row>
                  <el-col :xl="{ span: 24 }">
                    <el-col :lg="{ span: 8 }">
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
                    <el-col :lg="{ span: 8 }">
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
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
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
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="定量结果">
                      <el-input
                        v-model="searchForm.quantitativeResult"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :xl="{ span: 24 }">
                    <el-col :lg="{ span: 8 }">
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
                    <el-col :lg="{ span: 8 }">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :lg="{ span: 8 }">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="{ span: 8 }">
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
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="{ span: 8 }">
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
            <el-button @click="moreSearchDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmSearch">查询</el-button>
          </div>
        </el-dialog>
      </el-form>
    </div>
    <div class="case-list-table">
      <div style="margin: 10px 0">
        <el-button-group>
          <el-button
            size="small"
            type="primary"
            v-if="hasPermission('auth:case:edit')"
            @click="editCase"
            >编辑
          </el-button>
          <el-button
            size="small"
            type="primary"
            v-if="hasPermission('auth:report:out')"
            @click="caseOut"
            >出案
          </el-button>
          <el-button
            size="small"
            type="primary"
            v-if="hasPermission('auth:case:giveinfo')"
            @click="giveOutMsg"
            >发放信息
          </el-button>
          <el-dropdown
            v-if="hasPermission('auth:management:record')"
            @command="handleCommand"
          >
            <el-button type="primary" size="small">
              案件相关记录<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:inspect')"
                command="鉴定记录"
                >鉴定记录
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:consult')"
                command="会诊记录"
                >会诊记录
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:communicate')"
                command="沟通记录"
                >沟通记录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:information')"
            @command="settleImageUpload"
          >
            <el-button type="primary" size="small">
              资料信息管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:object:upload')"
                command="鉴定对象图片上传"
              >
                鉴定对象图片上传
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:material:upload')"
                command="鉴定材料图片上传"
              >
                鉴定材料图片上传
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:material:waiting')"
                command="补资料"
                @click="fillMaterial"
                >补资料
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:case')"
            @command="settleCase"
          >
            <el-button type="primary" size="small">
              案件管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:associated')"
                command="案件关联"
                >案件关联
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:unassociated')"
                command="案件取消关联"
                >案件取消关联
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:suspend')"
                command="案件中止"
                >案件中止(时效暂停)
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:delay')"
                command="案件时限延长"
                >案件时限延长
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:abort')"
                command="终止鉴定"
                >终止鉴定(退案)
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:supplement')"
                command="补充鉴定"
                >补充鉴定
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:repeat')"
                command="重新鉴定"
                >重新鉴定
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:report:change')"
                command="报告变更"
                >报告变更
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:caseNo')"
                command="修改编号"
                >修改编号
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:del')"
                command="删除案件"
                >删除案件
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:archive')"
            @command="settleFile"
          >
            <el-button type="primary" size="small">
              档案管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:archive-dict')"
                command="制作档案目录"
                >制作档案目录
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:archive')"
                command="归档"
                >归档
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:finance')"
            @command="costFun"
          >
            <el-button type="primary" size="small">
              费用管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:finance:amountChange')"
                command="费用异动"
                >费用异动
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:finance:discount')"
                command="费用减免"
                >费用减免
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:finance:refund')"
                command="退费"
                >退费
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:finance:edit')"
                command="费用编辑"
                >费用编辑
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:export')"
            @command="exportFun"
          >
            <el-button type="primary" size="small">
              导出功能<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:export')"
                command="导出案件列表"
                >导出案件列表
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:report:export')"
                command="导出报告"
                >导出报告
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:report:cover')"
                command="导出封面"
                >导出封面
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:print')"
            @command="printBarCode"
          >
            <el-button type="primary" size="small">
              打印功能<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:barcode:case')"
                command="CASE_BAR_CODE"
                >案件条码
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:barcode:sample')"
                command="SPECIMEN_BAR_CODE"
              >
                样本条码
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:barcode:material')"
                command="MATERIAL_BAR_CODE"
              >
                检材条码
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:print:report')"
                command="打印报告"
                >打印报告
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:print:form')"
                command="打印表单"
                >打印表单
              </el-dropdown-item>
              <!-- 新需求添加 21-1011 -->
              <el-dropdown-item
                v-if="hasPermission('auth:print:cover')"
                command="打印封面"
                >打印封面
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="hasPermission('auth:management:other')"
            @command="otherFun"
          >
            <el-button type="primary" size="small">
              其他功能<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="hasPermission('auth:case:copy')"
                command="案件复制"
                >案件复制
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:allocate')"
                command="案件分配"
                >案件分配
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:marketer:update')"
                command="修改市场人员"
                >修改市场人员
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('auth:case:apply:invoice')"
                command="开票申请"
                >开票申请
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </div>
      <div class="el-table-self" style="width: 100%">
        <el-table
          ref="casetable"
          class="table-fixed"
          fit
          border
          size="mini"
          @select-all="handleCheckBox"
          @select="handleCheckBox"
          @sort-change="sortChange"
          :data="tableData"
          :max-height="tableHeight"
          :sort.sync="tablesort"
          style="width: 100%"
        >
          <el-table-column fixed width="55" type="selection"></el-table-column>
          <el-table-column
            fixed
            prop="caseNo"
            :resizable="false"
            label="案件编号"
            width="250px"
            :show-overflow-tooltip="true"
            sortable="custom"
          >
            <template slot-scope="scope">
              <router-link
                target="_blank"
                :to="{ path: '/case/case-detail', query: { id: scope.row.id } }"
                style="text-decoration: none"
              >
                <el-link type="primary" style="font-size: 12px"
                  >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
                </el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="serialNumber"
            label="流水号"
            width="140px"
            :show-overflow-tooltip="true"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustInfo.entrustingUnit.name"
            show-overflow-tooltip
            width="110px"
            label="委托方"
          >
            <template slot-scope="scope">
              <span
                ><!-- {{(scope.row.entrustInfo.entrustingUnit && scope.row.entrustInfo.entrustingUnit.name != '')?
                                scope.row.entrustInfo.entrustingUnit.name:scope.row.entrustInfo.entrustingParty}} -->
                {{
                  scope.row.entrustInfo.entrustingUnit &&
                  scope.row.entrustInfo.entrustingUnit.name != null &&
                  scope.row.entrustInfo.entrustingUnit.name != ""
                    ? scope.row.entrustInfo.entrustingUnit.name
                    : scope.row.entrustInfo.entrustingParty
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustInfo.contact.name"
            label="联系人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustInfo.contact.phone"
            min-width="120%"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustInfo.authenticatedTarget"
            min-width="120%"
            label="鉴定对象"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="professionCategory.name"
            min-width="150%"
            label="专业类别"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustingDate"
            label="委托日期"
            min-width="100%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.entrustingDate">{{
                $divideDate(scope.row.entrustingDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="acceptDate"
            label="受理日期"
            min-width="110%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.acceptDate">{{
                $divideDate(scope.row.acceptDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="reportOutDate"
            label="出案日期"
            min-width="100%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.reportOutDate">{{
                $divideDate(scope.row.reportOutDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="giveDate"
            label="发放日期"
            min-width="100%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.giveInfo">{{
                $divideDate(scope.row.giveInfo.giveDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="archiveDate"
            label="归档日期"
            min-width="100%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.archive">{{
                $divideDate(scope.row.archive.archiveDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="assist.participant.hrStaff.name"
            width="90px"
            label="鉴定助理"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="auth1.participant.hrStaff.name"
            width="90px"
            label="第一鉴定人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="auth2.participant.hrStaff.name"
            width="90px"
            label="第二鉴定人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="auth3.participant.hrStaff.name"
            width="90px"
            label="第三鉴定人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="authorizedSignatory.participant.hrStaff.name"
            label="授权签字人"
            width="90px"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="reviewer.participant.hrStaff.name"
            label="复核人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="createBy.hrStaff.name"
            label="登记人"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="createDate"
            label="登记日期"
            min-width="100%"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.createDate">{{
                $divideDate(scope.row.createDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="flowStatus.label"
            width="100px"
            label="进度（状态）"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.reportOutDate &&
                  scope.row.flowStatus.value == 'SIGNED'
                "
                >已出案</span
              >
              <span
                v-if="
                  !(
                    scope.row.reportOutDate &&
                    scope.row.flowStatus.value == 'SIGNED'
                  )
                "
                >{{ scope.row.flowStatus.label }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="entrustInfo.materialAllReady"
            label="材料齐全"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.entrustInfo.materialAllReady == "N" ? "否" : "是"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.amount.yuanFmt"
            label="合同金额"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.amountRefund.yuanFmt"
            label="退费金额"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.discount.yuanFmt"
            label="减免金额"
            width="120"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.amountReceivable.yuanFmt"
            label="应收"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.actualReceivable.yuanFmt"
            label="实收"
          ></el-table-column>
          <!-- <el-table-column
            :resizable="false"
            prop="financeInfo.amountReceived.yuanFmt"
            label="已收"
          ></el-table-column> -->
          <el-table-column
            :resizable="false"
            prop="financeInfo.notReceived.yuanFmt"
            label="待收"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            prop="financeInfo.invoiceAmount.yuanFmt"
            label="开票金额"
          ></el-table-column>
          <!--<el-table-column fixed="right" label="操作" width="160px">-->
          <!--<template slot-scope="scope">-->

          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>

        <div class="pagination-footer">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="tableData"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            port="caCase"
          >
          </pagination>
        </div>
      </div>
    </div>

    <!--会诊信息-->
    <el-dialog
      title="会诊信息"
      :visible.sync="consultationDialogVisible"
      width="50%"
      class="consultation"
    >
      <div class="portlet">
        <div class="portlet-header">
          <span>会诊历史记录</span><em style="color: red">*</em>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <el-table
            border
            size="small"
            :data="consultationHistory"
            style="width: 100%"
          >
            <el-table-column
              prop="expert.name"
              label="会诊专家"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="result"
              label="会诊结果"
            ></el-table-column>
            <el-table-column
              prop="consultationFee"
              label="会诊费用"
            ></el-table-column>
            <el-table-column prop="consultationStartDate" label="开始时间">
              <template slot-scope="scope">
                <span v-if="scope.row.consultationStartDate">{{
                  $divideDate(scope.row.consultationStartDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="consultationEndDate" label="结束时间">
              <template slot-scope="scope">
                <span v-if="scope.row.consultationEndDate">{{
                  $divideDate(scope.row.consultationEndDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="checkConsultationDetail(scope.$index, scope.row)"
                  >详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-form
        :model="consultationForm"
        size="small"
        ref="consultationForm"
        label-width="80px"
      >
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="开始时间"
              prop="consultationStartDate"
              :rules="$filter_rules({ required: true, trigger: 'blur' })"
            >
              <el-date-picker
                style="width: 100%"
                v-model="consultationForm.consultationStartDate"
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
          <el-col :span="18" :offset="3">
            <el-form-item
              label="结束时间"
              prop="consultationEndDate"
              :rules="$filter_rules({ required: true, trigger: 'blur' })"
            >
              <el-date-picker
                style="width: 100%"
                v-model="consultationForm.consultationEndDate"
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
          <el-col :span="18" :offset="3">
            <el-form-item
              label="到期时间"
              prop="expiredDate"
              :rules="$filter_rules({ required: true, trigger: 'blur' })"
            >
              <el-date-picker
                style="width: 100%"
                v-model="consultationForm.expiredDate"
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
          <el-col :span="18" :offset="3">
            <el-form-item
              label="会诊专家"
              prop="expert"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-select
                v-model="consultationForm.expert"
                class="w100"
                placeholder="请选择"
                value-key="id"
              >
                <el-option
                  v-for="item in expertOpt"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="会诊费用"
              prop="consultationFee"
              :rules="$filter_rules({ required: true })"
            >
              <el-input v-model="consultationForm.consultationFee"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="会诊类型"
              prop="consultationType"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                :className="'w100'"
                :model.sync="consultationForm.consultationType"
                data_type="consultation_type"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item
              label="会诊结果"
              prop="result"
              :rules="$filter_rules({ required: true })"
            >
              <el-input
                v-model="consultationForm.result"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <Portlet title="附件">
              <template slot="buttonGroup">
                <el-upload
                  style="float: right; margin-right: 10px"
                  class="upload-demo"
                  action="#"
                  :multiple="true"
                  :on-change="handleChangeFile"
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
                <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                                           style="float: right;margin-right: 10px;margin-top: 11px">扫描
                                </el-button> -->
                <Czur
                  :isScan="true"
                  style="float: right; margin-right: 10px"
                  :model.sync="consultationForm.files"
                ></Czur>
              </template>
              <template slot="body">
                <FileWall
                  :model.sync="consultationForm.files"
                  :has-title="false"
                >
                </FileWall>
              </template>
            </Portlet>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="consultationDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="isDisabled"
          @click="confirmConsultation('consultationForm')"
          >确 定
        </el-button>
      </div>
      <el-dialog
        width="700px"
        title="会诊信息详情"
        :visible.sync="consultationInnerVisible"
        append-to-body
      >
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">开始时间</span>
            <span
              class="detail"
              v-if="consultationDetail.consultationStartDate"
              >{{ $divideDate(consultationDetail.consultationStartDate) }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">结束时间</span>
            <span
              class="detail"
              v-if="consultationDetail.consultationEndDate"
              >{{ $divideDate(consultationDetail.consultationEndDate) }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">到期时间</span>
            <span class="detail" v-if="consultationDetail.expiredDate">{{
              $divideDate(consultationDetail.expiredDate)
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">会诊专家</span
            ><span class="detail" v-if="consultationDetail.expert">{{
              consultationDetail.expert.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">会诊费用</span
            ><span class="detail">{{
              consultationDetail.consultationFee
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <span class="label">会诊类型</span
            ><span class="detail" v-if="consultationDetail.consultationType">{{
              consultationDetail.consultationType.label
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="6">
            <span class="label">会诊结果</span
            ><span class="detail">{{ consultationDetail.result }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="6">
            <span class="label" style="float: left; margin: 0">附件详情</span>
            <span class="detail" v-if="consultationDetail.files">
              <div
                style="display: inline-block"
                :key="index"
                v-for="(item, index) in consultationDetail.files"
              >
                <el-image
                  style="width: 146px; height: 146px; margin-left: 5px"
                  :src="item.url"
                  :preview-src-list="[...item.url]"
                  v-if="item.url.includes('jpg') || item.url.includes('png')"
                />
                <a v-else :href="item.url" target="_blank">
                  <div class="el-image el-image2">{{ `附件${index + 1}` }}</div>
                </a>
              </div>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="12" :offset="6">-->
          <!--<span>会诊结果:</span>-->
          <!--<el-image-->
          <!--style="height: 146px;width: 146px;vertical-align: top;margin-left: 10px"-->
          <!--:src="consultationDetail.image.url"-->
          <!--v-if="consultationDetail.image">-->
          <!--</el-image>-->
          <!--</el-col>-->
        </el-row>
      </el-dialog>
    </el-dialog>
    <!--案件编号修改-->
    <el-dialog
      title="修改案件编号"
      :visible.sync="editCaseNoDialog"
      width="40%"
    >
      <el-form :model="editCaseNoForm" ref="editCaseNoForm" label-width="130px">
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item label="当前编号">
              <el-input
                v-model="editCaseNoForm.caseNo"
                size="mini"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item
              label="鉴定意见书类型"
              prop="reportTypeFlag"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-from-dict
                data_type="report_type_flag"
                :model.sync="editCaseNoForm.reportTypeFlag"
                :modelId="false"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item
              label="案号标志"
              prop="caseNoFlag"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-select
                v-model="editCaseNoForm.caseNoFlag"
                placeholder="请选择"
                size="mini"
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
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item
              label="编号"
              prop="radio"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <el-radio-group v-model="editCaseNoForm.radio" size="mini">
                <el-radio label="N">自动分配</el-radio>
                <el-radio label="Y">手动分配</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item
              label="年份"
              prop="caseNoYear"
              :rules="$filter_rules({ required: true })"
            >
              <el-date-picker
                size="mini"
                v-model="editCaseNoForm.caseNoYear"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editCaseNoForm.radio == 'Y'">
          <el-col :span="22" :offset="1">
            <el-form-item
              label="顺序号"
              prop="caseNoSequence"
              :rules="$filter_rules({ required: true })"
            >
              <el-input
                v-model="editCaseNoForm.caseNoSequence"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCaseNoDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmCaseNo('editCaseNoForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="发放信息"
      :visible.sync="giveOutDialog"
      width="50%"
      class="giveout"
    >
      <div class="portlet">
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <el-form :model="giveOutForm" ref="giveOutForm" label-width="100px">
            <el-row>
              <el-col :span="13">
                <el-form-item
                  label="发放方式"
                  prop="giveType"
                  :rules="$filter_rules({ required: true })"
                >
                  <el-select
                    v-model="giveOutForm.giveType"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in giveOpt"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="giveOutForm.giveType == 'SELF_PICK'">
              <el-row>
                <el-col :span="13">
                  <el-form-item
                    label="领取凭证"
                    prop="credentialList"
                    :rules="$filter_rules({ required: true })"
                  >
                    <el-checkbox-group v-model="giveOutForm.credentialList">
                      <el-checkbox label="CONTRACT">合同/合同副本</el-checkbox>
                      <el-checkbox label="INVOICE">票据</el-checkbox>
                      <el-checkbox label="ID_CARD">身份证</el-checkbox>
                      <el-checkbox label="OTHER">其他</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="5"
                  v-if="giveOutForm.credentialList.indexOf('OTHER') > -1"
                >
                  <el-form-item
                    prop="otherCredentials"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                    label-width="0px"
                  >
                    <el-input v-model="giveOutForm.otherCredentials"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="领取人"
                    prop="consignee"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-input
                      v-model="giveOutForm.consignee"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item
                    label="发放日期"
                    prop="giveDate"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-date-picker
                      size="small"
                      v-model="giveOutForm.giveDate"
                      type="date"
                      class="w100"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="giveOutForm.giveType == 'SEND'">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="送件人" prop="sendPerson" size="small">
                    <el-input
                      v-model="giveOutForm.sendPerson"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item label="送件日期" prop="sendDate" size="small">
                    <el-date-picker
                      size="small"
                      v-model="giveOutForm.sendDate"
                      type="date"
                      class="w100"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="领取人"
                    prop="consignee"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-input
                      v-model="giveOutForm.consignee"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item
                    label="送达地址"
                    prop="sendAddress"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-input
                      v-model="giveOutForm.sendAddress"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="发放日期"
                    prop="giveDate"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-date-picker
                      size="small"
                      v-model="giveOutForm.giveDate"
                      type="date"
                      class="w100"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="giveOutForm.giveType == 'POST'">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="邮寄单位" prop="postUnit" size="small">
                    <el-input
                      v-model="giveOutForm.postUnit"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item label="收件人" prop="consignee" size="small">
                    <el-input
                      v-model="giveOutForm.consignee"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="收件人电话"
                    prop="postRecipientPhone"
                    size="small"
                  >
                    <el-input
                      v-model="giveOutForm.postRecipientPhone"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item
                    label="发放日期"
                    prop="giveDate"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-date-picker
                      size="small"
                      v-model="giveOutForm.giveDate"
                      type="date"
                      class="w100"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="快递公司"
                    prop="expressCompany"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <select-from-dict
                      :className="'w100'"
                      :model.sync="giveOutForm.expressCompany"
                      data_type="express_company"
                    ></select-from-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item
                    label="快递单号"
                    prop="expressNo"
                    :rules="$filter_rules({ required: true })"
                    size="small"
                  >
                    <el-input v-model="giveOutForm.expressNo"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="portlet">
              <div class="portlet-header">
                <span style="font-size: 16px">返还材料</span>
                <el-button
                  type="primary"
                  size="mini"
                  style="float: right; margin-right: 10px; margin-top: 6px"
                  @click="importMaterialClick"
                  >导入
                </el-button>
              </div>
              <div class="portlet-body" style="background-color: white">
                <el-table
                  border
                  size="small"
                  :data="returnCaInspectionMaterials"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="送检鉴定材料"
                  ></el-table-column>
                  <el-table-column
                    prop="type.label"
                    label="类型"
                  ></el-table-column>
                  <el-table-column
                    prop="quantity"
                    label="数量"
                  ></el-table-column>
                  <el-table-column
                    prop="unit.label"
                    label="规格"
                  ></el-table-column>
                  <el-table-column prop="acceptDate" label="接收时间">
                    <template slot-scope="scope">
                      <span v-if="scope.row.acceptDate">{{
                        $divideDate(scope.row.acceptDate)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="property.label"
                    label="材料性质"
                  ></el-table-column>
                  <el-table-column
                    prop="handleType.label"
                    label="处理方式"
                  ></el-table-column>
                  <el-table-column
                    prop="submitMaterialPerson"
                    label="送检人"
                  ></el-table-column>
                  <el-table-column
                    prop="submitMaterialPhone"
                    label="联系电话"
                  ></el-table-column>
                  <el-table-column
                    prop="status.label"
                    label="材料状态"
                  ></el-table-column>
                  <el-table-column prop="" label="文件及图片">
                    <template
                      slot-scope="scope"
                      v-if="scope.row.images.length > 0"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="
                          imageDialog = true;
                          imgs = scope.row.images;
                        "
                        >查看
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80%">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="backNoReturnStatus(scope.$index, scope.row)"
                      >
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="其他发放材料"
                  label-width="40%"
                  prop="credentials"
                >
                  <el-checkbox-group v-model="giveOutForm.otherGiveMaterials">
                    <el-checkbox label="INVOICE">发票</el-checkbox>
                    <el-checkbox label="OTHER">其他</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col
                :span="5"
                v-if="giveOutForm.otherGiveMaterials.indexOf('OTHER') > -1"
              >
                <el-form-item
                  prop="otherMsg"
                  size="small"
                  :rules="$filter_rules({ required: true })"
                  label-width="0px"
                >
                  <el-input v-model="giveOutForm.otherMsg"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item
                  prop="remarks"
                  size="small"
                  label="备注"
                  label-width="8%"
                >
                  <el-input
                    v-model="giveOutForm.remarks"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="portlet">
        <div class="portlet-header">
          <span>上传回执</span>
          <el-upload
            style="float: right; margin-right: 10px"
            class="upload-demo"
            action="#"
            :multiple="true"
            :on-change="handleChangeReceipt"
            :file-list="receiptImages"
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button type="primary" icon="el-icon-plus" size="mini"
              >上传</el-button
            >
          </el-upload>
          <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                               style="float: right;margin-right: 10px;margin-top: 11px" @click="">扫描
                    </el-button> -->
          <Czur
            :isScan="true"
            style="float: right; margin-right: 10px"
            :model.sync="receiptImages"
          ></Czur>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <PictureWall
            :model.sync="receiptImages"
            :has-title="false"
          ></PictureWall>
        </div>
      </div>
      <div class="portlet">
        <div class="portlet-header">
          <span>附件</span>
          <el-upload
            style="float: right; margin-right: 10px"
            class="upload-demo"
            action="#"
            :multiple="true"
            :on-change="handleChangeAccessory"
            :auto-upload="false"
            :show-file-list="false"
            list-type="picture"
          >
            <el-button type="primary" icon="el-icon-plus" size="mini"
              >上传</el-button
            >
          </el-upload>
          <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                               style="float: right;margin-right: 10px;margin-top: 11px" @click="">扫描
                    </el-button> -->
          <Czur
            :isScan="true"
            style="float: right; margin-right: 10px"
            :model.sync="annexImages"
          ></Czur>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <FileWall :model.sync="annexImages"> </FileWall>
          <!--                    <PictureWall :model.sync="annexImages" :has-title="false"></PictureWall>-->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="giveOutDialog = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmGiveOut('giveOutForm')"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="案件材料"
      :visible.sync="materialReturnDialog"
      width="800px"
      class="caseMaterial"
    >
      <el-table
        border
        :resizable="false"
        size="small"
        :data="giveOutForm.inspectionMaterial"
        style="width: 100%"
        @selection-change="importMaterialChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="送检鉴定材料"></el-table-column>
        <el-table-column prop="type.label" label="类型"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="unit.label" label="规格"></el-table-column>
        <el-table-column prop="acceptDate" label="接收时间" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.acceptDate">{{
              $divideDate(scope.row.acceptDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="property.label"
          label="材料性质"
        ></el-table-column>
        <el-table-column
          prop="handleType.label"
          label="处理方式"
        ></el-table-column>
        <el-table-column
          prop="submitMaterialPerson"
          label="送检人"
        ></el-table-column>
        <el-table-column
          prop="submitMaterialPhone"
          label="联系电话"
        ></el-table-column>
        <el-table-column prop="status.label" label="材料状态"></el-table-column>
        <el-table-column prop="" label="文件及图片">
          <template slot-scope="scope" v-if="scope.row.images.length > 0">
            <el-button
              type="primary"
              size="mini"
              @click="
                imageDialog = true;
                imgs = scope.row.images;
              "
              >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="materialReturnDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="importMaterial" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--归档-->
    <el-dialog
      title="归档"
      :visible="archivedFileDialog"
      width="40%"
      :before-close="closeDialog"
    >
      <el-form
        :model="archivedFileForm"
        size="small"
        ref="archivedFileForm"
        label-width="80px"
      >
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item
              label="归档日期"
              :rules="$filter_rules({ required: true })"
              prop="archiveDate"
            >
              <el-date-picker
                style="width: 100%"
                v-model="archivedFileForm.archiveDate"
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
          <el-col :span="20" :offset="2">
            <el-form-item
              label="立卷人"
              prop="rollupPerson"
              :rules="$filter_rules({ required: true })"
              v-if="archivedFileForm.rollupPerson"
            >
              <el-select
                class="w100"
                v-model="archivedFileForm.rollupPerson.label"
                filterable
              >
                <el-option
                  v-for="item in sysUserListData"
                  :key="item.id"
                  :label="item.hrStaff.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item
              label="归档人"
              prop="archivePerson"
              :rules="$filter_rules({ required: true })"
              v-if="archivedFileForm.archivePerson"
            >
              <el-select
                class="w100"
                v-model="archivedFileForm.archivePerson.label"
                filterable
              >
                <el-option
                  v-for="item in sysUserListData"
                  :key="item.id"
                  :label="item.hrStaff.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item
              label="存放位置"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
              prop="location"
            >
              <select-from-dict
                :className="'w100'"
                :model.sync="archivedFileForm.location"
                data_type="location"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item
              label="存档期限"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
              prop="storeTime"
            >
              <select-from-dict
                :className="'w100'"
                :model.sync="archivedFileForm.storeTime"
                data_type="archive_store_time"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="案件类型">
              <select-from-dict
                :className="'w100'"
                :clearable="true"
                :model.sync="archivedFileForm.caseType"
                data_type="case_type"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="备注">
              <el-input
                v-model="archivedFileForm.remarks"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="listFormFile2"
          >打印表单</el-button
        >
        <el-button @click="archivedFileDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="archivedFile('archivedFileForm')"
          size="small"
          :loading="isLoading"
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--沟通记录-->
    <el-dialog
      title="沟通记录"
      :visible.sync="recordCommunicationDialog"
      width="50%"
    >
      <el-form
        :model="recordCommunicationForm"
        ref="recordCommunicationForm"
        label-width="80px"
      >
        <div class="portlet">
          <div class="portlet-header">
            <span>历史沟通记录</span>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              border
              size="small"
              :data="communicationTable"
              style="width: 100%"
            >
              <el-table-column prop="communicationDate" label="沟通时间">
                <template slot-scope="scope">
                  <span v-if="scope.row.communicationDate">{{
                    $divideDate(scope.row.communicationDate)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="content"
                label="沟通内容"
                show-overflow-tooltip
                class-name="communicateContent"
              ></el-table-column>
              <el-table-column
                prop="reportFileList"
                label="附件列表"
                class-name="appendList"
              >
                <template slot-scope="scope">
                  <div
                    v-for="(item, index) in scope.row.reportFileList"
                    :key="index"
                  >
                    <el-link :href="item.url" target="_blank"
                      >{{ index + 1 }}.{{ item.name }}</el-link
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="portlet">
          <div class="portlet-header">
            <span>沟通记录</span>
          </div>
          <div class="portlet-body" style="padding: 8px">
            <el-row>
              <el-col :span="22" :offset="1">
                <el-form-item
                  label="沟通时间"
                  prop="communicationDate"
                  :rules="$filter_rules({ required: true })"
                >
                  <el-date-picker
                    v-model="recordCommunicationForm.communicationDate"
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
              <el-col :span="22" :offset="1">
                <el-form-item
                  label="沟通内容"
                  prop="content"
                  :rules="$filter_rules({ required: true })"
                >
                  <el-input
                    v-model="recordCommunicationForm.content"
                    size="small"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="{ span: 22, offset: 1 }">
                <el-form-item label="附件上传">
                  <el-col :lg="{ span: 22 }" v-if="!isAudit">
                    <el-upload
                      class="upload-demo"
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="
                        (file, fileList) => {
                          handleChange(file, fileList, 'reportFileList');
                        }
                      "
                      style="width: 100px; display: inline-block"
                    >
                      <el-button type="primary" size="small"
                        >请选择文件</el-button
                      >
                    </el-upload>
                    <el-tag
                      style="margin-right: 5px"
                      @close="handleClose(tag)"
                      v-for="tag in reportFileList"
                      :key="tag.name"
                      closable
                    >
                      {{ tag.name }}
                    </el-tag>
                  </el-col>
                  <el-col :lg="{ span: 24 }" v-else>
                    <span
                      v-if="form.reportFileList.length == 0"
                      class="el-form-item__label"
                      >暂无附件</span
                    >
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recordCommunicationDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          :disabled="isDisabled"
          @click="confirmCommunication('recordCommunicationForm')"
          size="small"
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--沟通记录窗口结束-->

    <!--补资料窗口开始-->
    <el-dialog
      title="待补齐鉴定材料"
      :visible.sync="fillMaterialDialog"
      width="1000px"
      class="waiting-supply"
    >
      <div class="portlet">
        <div class="portlet-header">
          <span>补资料</span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addFillMaterialRow()"
            >增加
          </el-button>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <el-button-group style="margin-bottom: 10px">
            <el-button size="small" type="primary" @click="receive"
              >收到</el-button
            >
            <el-button size="small" type="primary" @click="allReceive"
              >全部补全</el-button
            >
          </el-button-group>
          <el-form :model="fillMaterialForm" ref="fillMaterialForm">
            <!-- debugger -->
            <el-table
              fit
              ref="casetable"
              border
              size="small"
              @select-all="handleCheckMaterial"
              @select="handleCheckMaterial"
              :data="fillMaterialForm.fillMaterialData"
              style="width: 100%"
            >
              <el-table-column
                :resizable="false"
                width="55"
                type="selection"
              ></el-table-column>
              <el-table-column
                :resizable="false"
                prop="name"
                label="材料名称"
                width="120px"
              >
                <template slot="header">
                  <i style="color: red; margin-right: 5px">*</i
                  ><span>补充材料名称</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :rules="$filter_rules({ required: true })"
                    :prop="'fillMaterialData.' + scope.$index + '.name'"
                  >
                    <el-input v-model="scope.row.name" size="small"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="type.label"
                label="类型"
                width="100px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.type'"
                  >
                    <select-from-dict
                      :model.sync="scope.row.type"
                      :has-default="true"
                      data_type="material_type"
                    ></select-from-dict>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="quantity"
                label="数量"
                width="80px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.quantity'"
                  >
                    <el-input
                      v-model.number="scope.row.quantity"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="unit.label"
                label="规格"
                width="90px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.unit'"
                  >
                    <select-from-dict
                      :model.sync="scope.row.unit"
                      :has-default="true"
                      data_type="unit_type"
                    ></select-from-dict>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="acceptDate"
                label="接收时间"
                width="160px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.acceptDate'"
                  >
                    <el-date-picker
                      v-model="scope.row.acceptDate"
                      style="width: 100%"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="property.label"
                label="材料性质"
                width="140px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.property'"
                  >
                    <select-from-dict
                      :model.sync="scope.row.property"
                      :has-default="true"
                      data_type="material_property"
                    ></select-from-dict>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="handleType.label"
                label="处理方式"
                width="140px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="'fillMaterialData.' + scope.$index + '.handleType'"
                  >
                    <select-from-dict
                      :model.sync="scope.row.handleType"
                      :has-default="true"
                      data_type="handle_type"
                    ></select-from-dict>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="submitMaterialPerson"
                label="送检人"
                width="100px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'fillMaterialData.' +
                      scope.$index +
                      '.submitMaterialPerson'
                    "
                  >
                    <el-input
                      v-model="scope.row.submitMaterialPerson"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="submitMaterialPhone"
                width="140px"
                label="联系电话"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0px"
                    :prop="
                      'fillMaterialData.' +
                      scope.$index +
                      '.submitMaterialPhone'
                    "
                  >
                    <el-input
                      v-model="scope.row.submitMaterialPhone"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                label="操作"
                width="250"
                align="center"
              >
                <template slot-scope="scope">
                  <UploadPictures
                    :model.sync="scope.row.images"
                    :multiple="true"
                    :append-to-body="true"
                  ></UploadPictures>
                  <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                  <Czur :isScan="true" :model.sync="scope.row.images"></Czur>
                  <el-button
                    type="danger"
                    size="mini"
                    @click.native.prevent="deleteRow(scope.$index, scope.row)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fillMaterialDialog = false" size="small"
          >关闭</el-button
        >
        <el-button type="primary" @click="saveFillMaterial()" size="small"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--补资料窗口结束-->

    <!--出案窗口开始-->
    <el-dialog title="出案" :visible.sync="showCaseOutDialog" width="680px">
      <el-form :model="caseOutForm" label-position="right" ref="caseOutForm">
        <template>
          <el-table
            :data="caseOutForm.caseOutDataList"
            ref="caseOutDataList"
            border
            @select-all="handleCheckBox"
            @select="handleCheckBox"
            size="small"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50px"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="caseNo"
              width="250px"
              label="案件编号"
            ></el-table-column>
            <el-table-column
              prop="reportOutDate"
              width="250px"
              label="出案日期"
            >
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  style="width: 100%"
                  v-model="scope.row.reportOutDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  v-if="caseOutForm.caseOutDataList.length != 1"
                  @click="caseOutForm.caseOutDataList.splice(scope.$index, 1)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCaseOutDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveCaseOut('caseOutForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--出案窗口结束-->

    <!--案件中止窗口开始-->
    <el-dialog title="案件中止" :visible.sync="casePauseDialog" width="40%">
      <el-form :model="casePauseForm" ref="casePauseForm" label-width="130px">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="暂停原因">
              <el-input
                v-model="casePauseForm.suspendReason"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="附件">
              <el-upload
                class="upload-demo"
                action="#"
                :multiple="true"
                :on-change="changeCasePauseFile"
                :auto-upload="false"
                :show-file-list="false"
                list-type="picture"
              >
                <el-button type="primary" icon="el-icon-plus" size="mini"
                  >上传</el-button
                >
              </el-upload>
            </el-form-item>
            <FileWall :model.sync="casePauseForm.files" :has-title="false">
            </FileWall>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="预计暂停天数" label-width="30%">
              <el-input
                v-model.number="casePauseForm.planSuspendDays"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="casePauseDialog = false" size="small"
          >关闭</el-button
        >
        <el-button
          type="primary"
          :disabled="isDisabled"
          @click="confirmCasePause"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--案件中止窗口结束-->

    <!--鉴定对象图片上传窗口-->
    <el-dialog title="鉴定对象列表" :visible.sync="authenticatedTargetDialog">
      <div v-if="authObjectType == 'other'">
        <div
          style="margin-top: 10px"
          v-if="authenticatedPersonData && authenticatedPersonData.length > 0"
        >
          <span>鉴定人信息</span>
          <el-table
            :data="authenticatedPersonData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column
              property="nationality.label"
              label="民族"
            ></el-table-column>
            <el-table-column property="sex" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == 'N'">未知</span>
                <span v-if="scope.row.sex == 'F'">女</span>
                <span v-if="scope.row.sex == 'M'">男</span>
              </template>
            </el-table-column>
            <el-table-column property="age" label="年龄"></el-table-column>
            <el-table-column
              property="inspectAddress"
              label="家庭住址"
            ></el-table-column>
            <el-table-column
              property="idNumber"
              label="身份证号码"
            ></el-table-column>
            <el-table-column
              property="contact"
              label="联系人"
            ></el-table-column>
            <el-table-column
              property="contactPhone"
              label="联系人电话"
            ></el-table-column>
            <el-table-column property="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="margin-top: 10px"
          v-if="authenticatedVehicleData && authenticatedVehicleData.length > 0"
        >
          <span>鉴定车信息</span>
          <el-table
            :data="authenticatedVehicleData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column
              property="plateNumber"
              label="对象名称"
            ></el-table-column>
            <el-table-column
              property="vehicleType.label"
              label="车辆类型"
            ></el-table-column>
            <el-table-column property="brand" label="品牌"></el-table-column>
            <el-table-column
              property="vin"
              label="车辆识别代码"
            ></el-table-column>
            <el-table-column
              property="contact"
              label="联系人"
            ></el-table-column>
            <el-table-column
              property="contactPhone"
              label="联系电话"
            ></el-table-column>
            <el-table-column
              property="parkingAddress"
              label="停放地点"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="margin-top: 10px"
          v-if="authenticatedOtherData && authenticatedOtherData.length > 0"
        >
          <span>鉴定其他信息</span>
          <el-table
            :data="authenticatedOtherData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="authObjectType == 'po'">
        <div style="margin-top: 10px">
          <span>毒物信息</span>
          <el-table
            :data="poSampleData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column
              property="sampleNo"
              label="样本编号"
              width="100px"
            ></el-table-column>
            <el-table-column
              property="sampleName"
              label="样本名称"
            ></el-table-column>
            <el-table-column
              property="authPersonName"
              label="被检人"
            ></el-table-column>
            <el-table-column property="sex" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == 'N'">未知</span>
                <span v-if="scope.row.sex == 'F'">女</span>
                <span v-if="scope.row.sex == 'M'">男</span>
              </template>
            </el-table-column>
            <el-table-column
              property="credentialType.label"
              label="证件类型"
            ></el-table-column>
            <el-table-column
              property="credentialNo"
              label="证件号"
              width="200px"
            ></el-table-column>
            <el-table-column
              property="vesselNum"
              label="采血管编号"
              width="100px"
            ></el-table-column>
            <el-table-column
              property="sampleResource"
              label="样本来源"
            ></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column
              property="standard.label"
              label="规格"
            ></el-table-column>
            <el-table-column
              property="volumeQuality"
              label="体积/质量"
            ></el-table-column>
            <el-table-column
              property="acceptTime"
              label="接收时间"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.acceptTime">{{
                  $divideDate(scope.row.acceptTime)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="acceptPerson"
              label="接收人"
            ></el-table-column>
            <el-table-column
              property="materialCharacter"
              label="检材性状"
            ></el-table-column>
            <el-table-column
              property="packagingCharacter.label"
              label="包装状况"
            ></el-table-column>
            <el-table-column
              property="handle.label"
              label="处理方式"
            ></el-table-column>
            <el-table-column
              property="sendAuthPerson"
              label="送检人"
            ></el-table-column>
            <el-table-column
              property="sendAuthTelephone"
              label="送检电话"
            ></el-table-column>
            <el-table-column
              property="sendAuthTime"
              label="送检时间"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.sendAuthTime">{{
                  $divideDate(scope.row.sendAuthTime)
                }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column property="status" label="样本状态"></el-table-column>-->
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="authObjectType == 'dna'">
        <div style="margin-top: 10px">
          <span>dna样本信息</span>
          <el-table
            :data="dnaSampleData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column
              property="sampleNo"
              label="样本编号"
              width="60px"
            ></el-table-column>
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column
              property="nationality.label"
              label="民族"
            ></el-table-column>
            <!--<el-table-column property="caseHistoryNo" label="病历编号"></el-table-column>-->
            <el-table-column
              property="isIdenticalTwins"
              label="是否同卵胞胎"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isIdenticalTwins == '0'">否</span>
                <span v-if="scope.row.isIdenticalTwins == '1'">是</span>
              </template>
            </el-table-column>
            <el-table-column
              property="tested"
              label="是否是被检人"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.tested == 'N'">否</span>
                <span v-if="scope.row.tested == 'Y'">是</span>
              </template>
            </el-table-column>
            <el-table-column
              property="credentialType.label"
              label="证件类型"
            ></el-table-column>
            <el-table-column
              property="credentialNo"
              label="证件号"
            ></el-table-column>
            <el-table-column property="birthDate" label="出生日期">
              <template slot-scope="scope">
                <span v-if="scope.row.birthDate">{{
                  $divideDate(scope.row.birthDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column property="age" label="年龄(岁)"></el-table-column>
            <el-table-column
              property="month"
              label="年龄(月)"
            ></el-table-column>
            <el-table-column
              property="relation.label"
              label="检测关系"
            ></el-table-column>
            <el-table-column property="sex" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == 'N'">未知</span>
                <span v-if="scope.row.sex == 'F'">女</span>
                <span v-if="scope.row.sex == 'M'">男</span>
              </template>
            </el-table-column>
            <el-table-column
              property="transfused"
              label="有输血"
            ></el-table-column>
            <el-table-column property="address" label="住址"></el-table-column>
            <el-table-column property="bearer" label="承载物"></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column
              property="sampleUnit.label"
              label="单位"
            ></el-table-column>
            <el-table-column
              property="sampleCharacter.label"
              label="性状"
            ></el-table-column>
            <el-table-column property="colour" label="颜色"></el-table-column>
            <el-table-column property="size" label="大小"></el-table-column>
            <el-table-column
              property="packaging"
              label="包装"
            ></el-table-column>
            <el-table-column
              property="sampleSource.label"
              label="样本来源"
              width="150px"
            ></el-table-column>
            <el-table-column
              property="sampleDesc"
              label="样本描述"
            ></el-table-column>
            <el-table-column
              property="storePeriod.label"
              label="保存期限"
            ></el-table-column>
            <el-table-column
              property="extractWay.label"
              label="取样方式"
            ></el-table-column>
            <el-table-column
              property="handleWay.label"
              label="处理方式"
            ></el-table-column>
            <el-table-column property="acceptDate" label="接收时间">
              <template slot-scope="scope">
                <span v-if="scope.row.acceptDate">{{
                  $divideDate(scope.row.acceptDate)
                }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column property="testBy" label="实验人员"></el-table-column>-->
            <!--<el-table-column property="status" label="实验状态"></el-table-column>-->
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        v-if="
          authObjectType == 'DOCUMENT' ||
          authObjectType == 'TRACE_EVIDENCE' ||
          authObjectType == 'ELECTRONIC' ||
          authObjectType == 'ACOUSTIC_IMAGE'
        "
      >
        <div style="margin-top: 10px">
          <el-table
            :data="caSampleData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%; margin-top: 5px"
          >
            <el-table-column
              property="type.label"
              label="类型"
            ></el-table-column>
            <el-table-column property="sampleNo" label="编号"></el-table-column>
            <el-table-column
              v-if="authObjectType == 'ACOUSTIC_IMAGE'"
              property="carrier"
              label="载体"
            ></el-table-column>
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column
              v-if="authObjectType == 'ELECTRONIC'"
              property="brand"
              label="品牌"
            ></el-table-column>
            <el-table-column
              v-if="authObjectType == 'ELECTRONIC'"
              property="model"
              label="型号/容量"
            ></el-table-column>
            <el-table-column
              v-if="authObjectType == 'ELECTRONIC'"
              property="imeiSn"
              label="IMEI/SN"
            ></el-table-column>
            <el-table-column
              v-if="authObjectType != 'ELECTRONIC'"
              property="unit.label"
              label="规格"
            ></el-table-column>
            <el-table-column
              v-if="
                authObjectType == 'DOCUMENT' ||
                authObjectType == 'ACOUSTIC_IMAGE'
              "
              property="property.label"
              label="材料性质"
            ></el-table-column>
            <el-table-column
              property="appearanceStatus.label"
              label="外观/状态"
            ></el-table-column>
            <el-table-column
              property="handleType.label"
              label="处理方式"
            ></el-table-column>
            <el-table-column
              property="acceptDate"
              label="接收时间"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.acceptDate">{{
                  $divideDate(scope.row.acceptDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="submitMaterialPerson"
              label="送检人"
            ></el-table-column>
            <el-table-column
              property="submitMaterialPhone"
              label="送检人电话"
              width="100px"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <UploadPictures
                  :model.sync="scope.row.images"
                  :append-to-body="true"
                  :multiple="true"
                  title="图片资料上传"
                ></UploadPictures>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="authenticatedTargetDialog = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="authObjectImageUpload"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--鉴定材料图片上传窗口-->
    <el-dialog title="鉴定材料列表" :visible.sync="authenticatedMaterialDialog">
      <el-table
        :data="authenticatedMaterialData"
        fit
        stripe
        border
        size="mini"
        style="width: 100%"
      >
        <el-table-column property="name" label="送检鉴定材料"></el-table-column>
        <el-table-column property="type.label" label="类型"></el-table-column>
        <el-table-column property="quantity" label="数量"></el-table-column>
        <el-table-column property="unit.label" label="规格"></el-table-column>
        <el-table-column property="acceptDate" label="接收时间">
          <template slot-scope="scope">
            <span>{{
              scope.row.acceptDate && scope.row.acceptDate.split(" ")[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="property.label"
          label="材料性质"
        ></el-table-column>
        <el-table-column
          property="handleType.label"
          label="处理方式"
        ></el-table-column>
        <el-table-column
          property="submitMaterialPerson"
          label="送检人"
        ></el-table-column>
        <el-table-column
          property="submitMaterialPhone"
          label="联系电话"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <UploadPictures
              :model.sync="scope.row.images"
              :append-to-body="true"
              :multiple="true"
              title="图片资料上传"
            ></UploadPictures>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="authenticatedMaterialDialog = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="authMaterialImageUpload"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--导出案件列表-->
    <el-dialog title="导出案件列表" :visible.sync="exportCaseListDialog">
      <span style="margin-left: 80%">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
          >全选
        </el-checkbox>
        <el-checkbox v-model="checkReverse" @change="handleCheckReverseChange"
          >反选
        </el-checkbox>
      </span>
      <el-checkbox-group
        v-model="checkedList"
        @change="handleCheckedItemChange"
      >
        <el-table
          :data="caseListHeaders"
          fit
          stripe
          border
          size="mini"
          style="width: 100%; padding: 0"
          :show-header="true"
        >
          <el-table-column align="center" label="列表栏">
            <template slot-scope="scope">
              <ul>
                <li style="float: left; min-width: 25%">
                  <el-checkbox :label="scope.row.first" v-if="scope.row.first">
                    {{ scope.row.first }}
                  </el-checkbox>
                </li>
                <li style="float: left; min-width: 25%">
                  <el-checkbox
                    :label="scope.row.second"
                    v-if="scope.row.second"
                  >
                    {{ scope.row.second }}
                  </el-checkbox>
                </li>
                <li style="float: left; min-width: 25%">
                  <el-checkbox :label="scope.row.third" v-if="scope.row.third">
                    {{ scope.row.third }}
                  </el-checkbox>
                </li>
                <li style="float: left; min-width: 25%">
                  <el-checkbox :label="scope.row.forth" v-if="scope.row.forth">
                    {{ scope.row.forth }}
                  </el-checkbox>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="exportCaseListDialog = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="exportCaseList"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--案件分配的dialog-->
    <el-dialog title="案件分配" :visible.sync="showCaseAllocationDialog">
      <div>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件编号</span
            ><span class="detail">{{ detailMsg.caseNo }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">专业类别</span>
            <span class="detail" v-if="detailMsg.professionCategory">{{
              detailMsg.professionCategory.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2" v-if="detailMsg.entrustInfo"
            ><span class="label">委托方</span>
            <span
              class="detail"
              v-if="
                detailMsg.entrustInfo.entrustingUnit &&
                detailMsg.entrustInfo.entrustingUnit.name
              "
              >{{ detailMsg.entrustInfo.entrustingUnit.name }}</span
            >
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingParty">{{
              detailMsg.entrustInfo.entrustingParty
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系人</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.name
                : null
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系电话</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.phone
                : null
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系地址</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.address
                : null
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">委托日期</span>
            <span class="detail" v-if="detailMsg.entrustingDate">{{
              $divideDate(detailMsg.entrustingDate)
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">登记日期</span>
            <span class="detail" v-if="detailMsg.createDate">{{
              $divideDate(detailMsg.createDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">受理日期</span>
            <span class="detail" v-if="detailMsg.acceptDate">{{
              $divideDate(detailMsg.acceptDate)
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">约定完成时间</span>
            <span class="detail" v-if="detailMsg.promiseFinishDate">{{
              $divideDate(detailMsg.promiseFinishDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">计划完成时间</span>
            <span class="detail" v-if="detailMsg.deadline">{{
              $divideDate(detailMsg.deadline)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2" v-if="detailMsg.judger"
            ><span class="label">案件判断人</span>
            <span class="detail" v-if="detailMsg.judger">{{
              detailMsg.judger.participant.hrStaff.name
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">鉴定助理</span>
            <span
              class="detail"
              v-if="detailMsg.assist && detailMsg.assist.participant"
              >{{ detailMsg.assist.participant.hrStaff.name }}</span
            ></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">第一鉴定人</span>
            <span class="detail" v-if="detailMsg.auth1">{{
              detailMsg.auth1.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第二鉴定人</span>
            <span class="detail" v-if="detailMsg.auth2">{{
              detailMsg.auth2.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">第三鉴定人</span>
            <span class="detail" v-if="detailMsg.auth3">{{
              detailMsg.auth3.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第四鉴定人</span>
            <span class="detail" v-if="detailMsg.auth4">{{
              detailMsg.auth4.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第五鉴定人</span>
            <span class="detail" v-if="detailMsg.auth5">{{
              detailMsg.auth5.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">复核人</span>
            <span class="detail" v-if="detailMsg.reviewer">{{
              detailMsg.reviewer.participant.hrStaff.name
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">授权签字人</span>
            <span class="detail" v-if="detailMsg.authorizedSignatory">{{
              detailMsg.authorizedSignatory.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">签发人</span>
            <span class="detail" v-if="detailMsg.issuer">{{
              detailMsg.issuer.participant.hrStaff.name
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">实验人员</span>
            <span class="detail" v-if="detailMsg.labStaff">{{
              detailMsg.labStaffName
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">市场人员</span>
            <span class="detail" v-if="detailMsg.saleStaff">{{
              detailMsg.saleStaff.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件类型</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseType">{{
              detailMsg.entrustInfo.caseType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">统计类别</span>
            <span class="detail" v-if="detailMsg.caseStatType">{{
              detailMsg.caseStatType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">案件种类</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseCategory">{{
              detailMsg.entrustInfo.caseCategory.label
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案发时间</span>
            <span class="detail" v-if="detailMsg.happenDate">{{
              $divideDate(detailMsg.happenDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">材料齐全</span>
            <span
              class="detail"
              v-if="detailMsg.entrustInfo.materialAllReady"
              >{{
                detailMsg.entrustInfo.materialAllReady == "Y" ? "是" : "否"
              }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">基本案情</span>
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingDesc">{{
              detailMsg.entrustInfo.entrustingDesc
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">备注</span>
            <span class="detail">{{ detailMsg.remarks }}</span></el-col
          >
        </el-row>
      </div>
      <el-form
        :model="caseDto"
        style="margin-left: 10%"
        ref="allocationForm"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="鉴定助理">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="ASSIST"
                :isObject="true"
                :model.sync="caseDto.assist.participant"
                :isDisabled="caseDto.assist.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="第一鉴定人"
              prop="auth1.participant"
              :rules="$filter_rules({ required: true, trigger: 'change' })"
            >
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTH"
                :isObject="true"
                :model.sync="caseDto.auth1.participant"
                :isDisabled="caseDto.auth1.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第二鉴定人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTH"
                :isObject="true"
                :model.sync="caseDto.auth2.participant"
                :isDisabled="caseDto.auth2.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第三鉴定人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTH"
                :isObject="true"
                :model.sync="caseDto.auth3.participant"
                :isDisabled="caseDto.auth3.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第四鉴定人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTH"
                :isObject="true"
                :model.sync="caseDto.auth4.participant"
                :isDisabled="caseDto.auth4.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第五鉴定人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTH"
                :isObject="true"
                :model.sync="caseDto.auth5.participant"
                :isDisabled="caseDto.auth5.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="复核人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="REVIEWER"
                :isObject="true"
                :model.sync="caseDto.reviewer.participant"
                :isDisabled="caseDto.reviewer.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权签字人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="AUTHORIZED_SIGNATORY"
                :isObject="true"
                :model.sync="caseDto.authorizedSignatory.participant"
                :isDisabled="caseDto.authorizedSignatory.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签发人">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="ISSUER"
                :isObject="true"
                :model.sync="caseDto.issuer.participant"
                :isDisabled="caseDto.issuer.isDisabled"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实验人员">
              <select-qualification
                :profession_category="caseDto.professionCategory.id"
                qualification_type="LAB_STAFF"
                :isObject="true"
                :model.sync="caseDto.labStaff"
                :multiple="true"
              ></select-qualification>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showCaseAllocationDialog = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="caseAllocation('allocationForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--修改市场人员窗口-->
    <el-dialog
      title="修改市场人员"
      :visible.sync="showModifySalesDialog"
      width="1200px"
    >
      <el-form ref="updatesalesPersonForm" label-position="right">
        <Collapse title="案件信息" :active="true">
          <template>
            <el-table
              :data="updatesalesPersonForm.caseList"
              ref="caseList"
              border
              :resizable="false"
              @select-all="handleCheckBox"
              @select="handleCheckBox"
              size="small"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50px"
                label="序号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="caseDto.caseNo"
                width="250px"
                label="案件编号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="caseDto.entrustInfo.entrustingUnit.name"
                label="委托方"
                width="170px"
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
                show-overflow-tooltip
                prop="caseDto.entrustInfo.authenticatedTarget"
                label="被鉴定对象"
              />
              <el-table-column
                show-overflow-tooltip
                prop="amount"
                width="120px"
                label="合同金额"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="oldSalesPerson"
                width="150px"
                label="原市场人员"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="newSalesPerson"
                width="150px"
                label="现市场人员"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'caseList.' + scope.$index + '.newSalesPerson'"
                  >
                    <select-qualification
                      className="w100"
                      :profession_category="
                        scope.row.caseDto.professionCategoryId
                      "
                      qualification_type="SALES"
                      :model.sync="scope.row.newSalesPerson"
                    ></select-qualification>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    v-if="updatesalesPersonForm.caseList.length != 1"
                    @click="
                      updatesalesPersonForm.caseList.splice(scope.index, 1)
                    "
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showModifySalesDialog = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="modifySales('updatesalesPersonForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--费用异动申请-->
    <el-dialog
      title="费用异动申请列表"
      :visible.sync="costChangeDialog"
      width="1200px"
      :append-to-body="true"
    >
      <el-table
        :data="costChangeData"
        fit
        stripe
        border
        size="mini"
        style="width: 100%"
        :max-height="tableHeight"
      >
        <el-table-column
          property="entrustInfo.entrustingUnit.name"
          show-overflow-tooltip
          label="委托方"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.entrustInfo.entrustingUnit &&
              scope.row.entrustInfo.entrustingUnit.name != ""
                ? scope.row.entrustInfo.entrustingUnit.name
                : scope.row.entrustInfo.entrustingParty
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="caseNo"
          show-overflow-tooltip
          label="案件号"
        ></el-table-column>
        <el-table-column
          property="entrustInfo.authenticatedTarget"
          show-overflow-tooltip
          label="鉴定对象"
        ></el-table-column>
        <el-table-column
          property="professionCategory.name"
          show-overflow-tooltip
          label="专业类别"
        ></el-table-column>
        <el-table-column
          property="assist.participant.hrStaff.name"
          label="鉴定助理"
        ></el-table-column>
        <el-table-column
          property="auth1.participant.hrStaff.name"
          label="第一鉴定人"
        ></el-table-column>
        <el-table-column
          property="caseStatus.label"
          label="案件状态"
        ></el-table-column>
        <el-table-column label="收费状态">
          <template slot-scope="scope">
            {{
              scope.row.chargeStatus == 0
                ? "未收费"
                : scope.row.chargeStatus == 1
                ? "部分收费"
                : "已收全"
            }}
          </template>
        </el-table-column>
        <el-table-column
          property="settleStatus"
          label="结算状态"
        ></el-table-column>
        <el-table-column
          property="financeInfo.amount.yuanFmt"
          label="合同金额"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div style="margin-top: 6px">
              <el-badge :is-dot="judgeIsClick(scope.row.id)">
                <el-button
                  size="mini"
                  @click="openCaseChargeItemsDialog(scope.row)"
                  >修改</el-button
                >
              </el-badge>
              <el-button
                size="mini"
                @click="delCurRow(scope.row)"
                style="margin-left: 10px"
                >删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="费用异动收费项目详情列表"
        :visible.sync="caseChargeItemDialog"
        :append-to-body="true"
      >
        <el-button size="mini" @click="addChargeItem" style="margin-left: 92%"
          >添加</el-button
        >
        <!--导入收费项目模态框-->
        <el-dialog
          title="收费项目"
          :visible.sync="chargeItemDialog"
          :append-to-body="true"
        >
          <el-table
            :data="chargeItems"
            border
            stripe
            size="mini"
            @selection-change="handleSelectionChange"
            ref="chargeItemTable"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="name" label="收费项目"></el-table-column>
            <el-table-column
              property="chargingType.name"
              label="收费类别"
            ></el-table-column>
            <el-table-column property="price.yuanFmt" label="单价">
            </el-table-column>
            <!--<el-table-column property="remarks" label="备注"></el-table-column>-->
          </el-table>
          <div class="pagination-footer">
            <pagination
              :pcurrent.sync="page.current"
              :page.sync="page"
              :data.sync="chargeItems"
              :search.sync="chargeItemCondition"
              port="chargeItem"
            ></pagination>
          </div>
          <div slot="footer" class="dialog-footer" style="margin-left: 20px">
            <el-button @click="chargeItemDialog = false" size="mini"
              >取 消</el-button
            >
            <el-button type="primary" @click="confirmChargeItems" size="mini"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <el-form
          size="small"
          :model="caseChargeItemForm"
          ref="caseChargeItemForm"
        >
          <el-form-item
            prop="reason"
            label="费用异动原因"
            :rules="$filter_rules({ required: true, trigger: 'change' })"
          >
            <select-from-dict
              :model.sync="caseChargeItemForm.reason"
              data_type="amount_change_reason"
            ></select-from-dict>
          </el-form-item>
          <el-table
            :data="caseChargeItemForm.caseChargeItemData"
            fit
            stripe
            border
            size="mini"
            style="width: 100%"
            show-summary
            :summary-method="getYDSummaries"
          >
            <el-table-column min-width="120%" label="收费项目">
              <template slot-scope="scope">
                <select-from-table
                  :disabled="
                    scope.row.notEdit || (!scope.row.notInvoice && isInvoice)
                  "
                  :model.sync="scope.row.chargingItem"
                  :modelId="false"
                  v-if="scope.row"
                  port="chargeItem"
                ></select-from-table>
              </template>
            </el-table-column>
            <el-table-column property="unitPrice" label="单价">
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'caseChargeItemData.' + scope.$index + '.unitPrice.value'
                  "
                  :rules="$filter_rules({ required: true })"
                >
                  <el-input-number
                    v-if="scope.row"
                    :precision="2"
                    :disabled="
                      scope.row.notEdit || (!scope.row.notInvoice && isInvoice)
                    "
                    size="mini"
                    v-model="scope.row.unitPrice.value"
                    controls-position="right"
                    :min="
                      scope.row.chargingItem && scope.row.chargingItem.minPrice
                        ? scope.row.chargingItem.minPrice.cent / 100
                        : 0
                    "
                    :max="
                      scope.row.chargingItem && scope.row.chargingItem.maxPrice
                        ? scope.row.chargingItem.maxPrice.cent / 100
                        : 99999
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              property="quantity"
              label="数量"
              :rules="$filter_rules({ required: true })"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'caseChargeItemData.' + scope.$index + '.quantity'"
                  :rules="$filter_rules({ required: true })"
                >
                  <el-input
                    :disabled="
                      scope.row.notEdit || (!scope.row.notInvoice && isInvoice)
                    "
                    size="mini"
                    v-model="scope.row.quantity"
                    v-if="scope.row"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="金额">
              <template slot-scope="scope">
                {{ scope.row.unitPrice.value * scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="30%">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="
                    scope.row.notEdit || (!scope.row.notInvoice && isInvoice)
                  "
                  @click="delChargeItem(scope.row.chargingItem.id)"
                  >删 除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelChargeItems">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="saveChargeItems('caseChargeItemForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="costChangeDialog = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          :disabled="isDisabled"
          type="primary"
          @click="confirmCostChange"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="费用编辑收费项目列表"
      :visible.sync="caseChargeItemEditDialog"
      width="1200px"
    >
      <el-button
        size="mini"
        @click="addChargeItem1"
        style="margin-left: 90%; margin-bottom: 10px"
        >添加</el-button
      >
      <!--导入收费项目模态框-->
      <el-dialog
        title="收费项目"
        :visible.sync="chargeItemEditDialog"
        :append-to-body="true"
      >
        <el-table
          :data="chargeItems"
          border
          stripe
          size="mini"
          @selection-change="handleSelectionChange"
          ref="chargeItemTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="name" label="收费项目"></el-table-column>
          <el-table-column
            property="chargingType.name"
            label="收费类别"
          ></el-table-column>
          <el-table-column property="price.yuanFmt" label="单价">
          </el-table-column>
          <!--<el-table-column property="remarks" label="备注"></el-table-column>-->
        </el-table>
        <div class="pagination-footer">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="chargeItems"
            :search.sync="chargeItemCondition"
            port="chargeItem"
          ></pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-left: 20px">
          <el-button @click="chargeItemEditDialog = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="confirmChargeItems1" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-form
        size="small"
        :model="caseChargeItemEditForm"
        ref="caseChargeItemEditForm"
        style="width: 100%"
      >
        <el-table
          :data="caseChargeItemEditForm.caseChargeItemData"
          fit
          stripe
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column width="200px" label="收费项目">
            <template slot-scope="scope">
              <select-from-table
                :model.sync="scope.row.chargingItem"
                :modelId="false"
                v-if="scope.row"
                port="chargeItem"
              ></select-from-table>
            </template>
          </el-table-column>
          <el-table-column
            width="100px"
            prop="chargingItem.chargingType.name"
            label="收费类别"
          >
          </el-table-column>
          <el-table-column property="unitPrice" label="单价" width="200px">
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'caseChargeItemData.' + scope.$index + '.unitPrice.value'
                "
                :rules="$filter_rules({ required: true })"
              >
                <el-input-number
                  v-if="scope.row"
                  :precision="2"
                  size="mini"
                  v-model="scope.row.unitPrice.value"
                  controls-position="right"
                  :min="
                    scope.row.chargingItem && scope.row.chargingItem.minPrice
                      ? scope.row.chargingItem.minPrice.cent / 100
                      : 0
                  "
                  :max="
                    scope.row.chargingItem && scope.row.chargingItem.maxPrice
                      ? scope.row.chargingItem.maxPrice.cent / 100
                      : 99999
                  "
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            property="quantity"
            label="数量"
            :rules="$filter_rules({ required: true })"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'caseChargeItemData.' + scope.$index + '.quantity'"
                :rules="$filter_rules({ required: true })"
              >
                <el-input
                  size="mini"
                  v-model="scope.row.quantity"
                  v-if="scope.row"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="150px" prop="total" label="金额">
            <template slot-scope="scope">
              {{
                (scope.row.total = Number(
                  BigDecimalUtils.times(
                    scope.row.unitPrice.value,
                    scope.row.quantity
                  )
                ))
              }}
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            property="quantity"
            label="备注"
            :rules="$filter_rules({ required: false })"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'caseChargeItemData.' + scope.$index + '.remarks'"
                :rules="$filter_rules({ required: false })"
              >
                <el-input
                  size="mini"
                  v-model="scope.row.remarks"
                  v-if="scope.row"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="delChargeItem1(scope.row.chargingItem.id)"
                >删 除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="caseChargeItemEditDialog = !caseChargeItemEditDialog"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="confirmChargeEdit('caseChargeItemEditForm')"
          >确 定
        </el-button>
      </div>
    </el-dialog>

    <!--表单打印窗口开始-->
    <el-dialog title="表单打印" :visible.sync="showListFormFileDialog">
      <div style="margin-top: 10px">
        <!--<el-button size="mini" type="primary" @click="formFilePrint">打印表单</el-button>-->
        <Table
          :data.sync="listFormFileData"
          :search.sync="listFormFileSearchData"
          @selectChange="handleFormSelectCheck"
          :isSelect="true"
          :sort.sync="listFormFileTableSort"
          :page.sync="listFormFilePage"
          port="template"
          :hasPaging="true"
          :selfDefinedBtn="true"
        >
          <template solt>
            <el-table-column
              fixed
              width="55"
              type="selection"
            ></el-table-column>
            <el-table-column prop="name" label="表单名称"></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="printForm(scope.row, 'Y')"
                  >重新渲染表单
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="printForm(scope.row, 'N')"
                  >打印表单</el-button
                >
              </template>
            </el-table-column>
          </template>
        </Table>
      </div>
    </el-dialog>
    <!--表单打印窗口结束-->

    <!--费用减免模态框-->
    <el-dialog
      title="费用减免"
      :visible.sync="caseChargeDeductionDialog"
      width="60%"
    >
      <div>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件编号</span
            ><span class="detail">{{ detailMsg.caseNo }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">专业类别</span>
            <span class="detail" v-if="detailMsg.professionCategory">{{
              detailMsg.professionCategory.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2" v-if="detailMsg.entrustInfo"
            ><span class="label">委托方</span>
            <span
              class="detail"
              v-if="
                detailMsg.entrustInfo.entrustingUnit &&
                detailMsg.entrustInfo.entrustingUnit.name
              "
              >{{ detailMsg.entrustInfo.entrustingUnit.name }}</span
            >
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingParty">{{
              detailMsg.entrustInfo.entrustingParty
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系人</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.name
                : null
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系电话</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.phone
                : null
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系地址</span>
            <span class="detail" v-if="detailMsg.entrustInfo">{{
              detailMsg.entrustInfo.contact
                ? detailMsg.entrustInfo.contact.address
                : null
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">委托日期</span>
            <span class="detail" v-if="detailMsg.entrustingDate">{{
              $divideDate(detailMsg.entrustingDate)
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">登记日期</span>
            <span class="detail" v-if="detailMsg.createDate">{{
              $divideDate(detailMsg.createDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">受理日期</span>
            <span class="detail" v-if="detailMsg.acceptDate">{{
              $divideDate(detailMsg.acceptDate)
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">约定完成时间</span>
            <span class="detail" v-if="detailMsg.promiseFinishDate">{{
              $divideDate(detailMsg.promiseFinishDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">计划完成时间</span>
            <span class="detail" v-if="detailMsg.deadline">{{
              $divideDate(detailMsg.deadline)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2" v-if="detailMsg.judger"
            ><span class="label">案件判断人</span>
            <span class="detail" v-if="detailMsg.judger">{{
              detailMsg.judger.participant.hrStaff.name
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">鉴定助理</span>
            <span
              class="detail"
              v-if="
                detailMsg.assist &&
                detailMsg.assist.participant &&
                detailMsg.assist.participant.hrStaff
              "
              >{{ detailMsg.assist.participant.hrStaff.name }}</span
            ></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">第一鉴定人</span>
            <span class="detail" v-if="detailMsg.auth1">{{
              detailMsg.auth1.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第二鉴定人</span>
            <span class="detail" v-if="detailMsg.auth2">{{
              detailMsg.auth2.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">第三鉴定人</span>
            <span class="detail" v-if="detailMsg.auth3">{{
              detailMsg.auth3.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第四鉴定人</span>
            <span class="detail" v-if="detailMsg.auth4">{{
              detailMsg.auth4.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第五鉴定人</span>
            <span class="detail" v-if="detailMsg.auth5">{{
              detailMsg.auth5.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">复核人</span>
            <span class="detail" v-if="detailMsg.reviewer">{{
              detailMsg.reviewer.participant.hrStaff.name
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">授权签字人</span>
            <span class="detail" v-if="detailMsg.authorizedSignatory">{{
              detailMsg.authorizedSignatory.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">签发人</span>
            <span class="detail" v-if="detailMsg.issuer">{{
              detailMsg.issuer.participant.hrStaff.name
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">实验人员</span>
            <span class="detail" v-if="detailMsg.labStaff">{{
              detailMsg.labStaffName
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">市场人员</span>
            <span class="detail" v-if="detailMsg.saleStaff">{{
              detailMsg.saleStaff.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件类型</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseType">{{
              detailMsg.entrustInfo.caseType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">统计类别</span>
            <span class="detail" v-if="detailMsg.caseStatType">{{
              detailMsg.caseStatType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">案件种类</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseCategory">{{
              detailMsg.entrustInfo.caseCategory.label
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案发时间</span>
            <span class="detail" v-if="detailMsg.happenDate">{{
              $divideDate(detailMsg.happenDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">材料齐全</span>
            <span
              class="detail"
              v-if="detailMsg.entrustInfo.materialAllReady"
              >{{
                detailMsg.entrustInfo.materialAllReady == "Y" ? "是" : "否"
              }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">基本案情</span>
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingDesc">{{
              detailMsg.entrustInfo.entrustingDesc
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">备注</span>
            <span class="detail">{{ detailMsg.remarks }}</span></el-col
          >
        </el-row>
      </div>
      <div style="margin-top: 10px">
        <span>费用减免</span>
        <el-form
          :model="caseChargeDeductionData"
          ref="caseChargeDeductionForm"
          :inline="true"
        >
          <el-row>
            <el-col :span="20" :offset="4">
              <el-form-item
                prop="reason.id"
                label="减免原因"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-dict
                  :model.sync="caseChargeDeductionData.reason"
                  data_type="case_discount_reason"
                  :clearable="true"
                >
                </select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-table
                :data="caseChargeDeductionData.flowRefundDiscountItemList"
                fit
                :summary-method="getSummaries"
                ref="flowRefundDiscountTable"
                show-summary
              >
                <el-table-column
                  label="收费项目"
                  prop="fiCaseChargeSumByItem.chargingItem.name"
                  min-width="100%"
                ></el-table-column>
                <el-table-column
                  label="收费类别"
                  width="100px"
                  prop="fiCaseChargeSumByItem.chargingItem.chargingType.name"
                ></el-table-column>
                <el-table-column
                  label="合同金额"
                  width="100px"
                  prop="fiCaseChargeSumByItem.amount.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="退费金额"
                  width="100px"
                  prop="fiCaseChargeSumByItem.refund.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="待收金额"
                  width="100px"
                  prop="fiCaseChargeSumByItem.notReceived.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="实收金额"
                  width="100px"
                  prop="fiCaseChargeSumByItem.actualReceivable.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="已减免金额"
                  width="100px"
                  prop="fiCaseChargeSumByItem.discount.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="减免金额"
                  width="150px"
                  prop="amount.value"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'flowRefundDiscountItemList.' +
                        scope.$index +
                        '.amount.value'
                      "
                      :rules="$filter_rules({ required: true })"
                      size="mini"
                    >
                      <!--<el-input v-model="scope.row.amount.value"></el-input>-->
                      <el-input-number
                        :precision="2"
                        size="mini"
                        v-model="scope.row.amount.value"
                        controls-position="right"
                        :min="0"
                        :max="
                          scope.row.fiCaseChargeSumByItem &&
                          scope.row.fiCaseChargeSumByItem.notReceived
                            ? scope.row.fiCaseChargeSumByItem.notReceived.cent /
                              100
                            : 99999
                        "
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="减免后待收金额"
                  width="150px"
                  prop="fiCaseChargeSumByItem.newNotReceived"
                >
                  <template slot-scope="scope">
                    <el-form-item size="mini">
                      {{
                        scope.row.amount.value
                          | getNewNotReceived(
                            scope.row.fiCaseChargeSumByItem.notReceived.yuanFmt,
                            scope.row.amount.value
                          )
                      }}
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="100px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'flowRefundDiscountItemList.' +
                        scope.$index +
                        '.remarks'
                      "
                      size="mini"
                    >
                      <el-input v-model="scope.row.remarks"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="caseChargeDeductionDialog = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :disabled="isDisabled"
          @click="saveCaseChargeDeductionForm('caseChargeDeductionForm')"
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--退费模态框-->
    <el-dialog title="退费" :visible.sync="caseChargeRefundDialog">
      <div>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件编号</span
            ><span class="detail">{{ detailMsg.caseNo }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">专业类别</span>
            <span class="detail" v-if="detailMsg.professionCategory">{{
              detailMsg.professionCategory.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2" v-if="detailMsg.entrustInfo"
            ><span class="label">委托方</span>
            <span
              class="detail"
              v-if="
                detailMsg.entrustInfo.entrustingUnit &&
                detailMsg.entrustInfo.entrustingUnit.name
              "
              >{{ detailMsg.entrustInfo.entrustingUnit.name }}</span
            >
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingParty">{{
              detailMsg.entrustInfo.entrustingParty
            }}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 10px">
        <el-form
          :model="caseChargeRefundData"
          ref="caseChargeRefundForm"
          :inline="true"
        >
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item
                prop="reason.id"
                label="退费原因"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-dict
                  :model.sync="caseChargeRefundData.reason"
                  data_type="case_refund_reason"
                  :clearable="true"
                >
                </select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="
              caseChargeRefundData.reason &&
              caseChargeRefundData.reason.label == '其他'
            "
          >
            <el-col :span="22" :offset="2">
              <el-form-item
                label="其他理由"
                :rules="$filter_rules({ required: true })"
                prop="otherReason"
              >
                <el-input
                  type="textarea"
                  v-model="caseChargeRefundData.otherReason"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="caseChargeRefundData.flowRefundDiscountItemList"
                border
                fit
                :summary-method="getSummaries"
                ref="flowRefundDiscountTable"
                show-summary
              >
                <el-table-column
                  label="收费项目"
                  prop="fiCaseChargeSumByItem.chargingItem.name"
                  min-width="100%"
                ></el-table-column>
                <el-table-column
                  label="收费类别"
                  prop="fiCaseChargeSumByItem.chargingItem.chargingType.name"
                ></el-table-column>
                <el-table-column
                  label="合同金额"
                  prop="fiCaseChargeSumByItem.amount.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="已减免金额"
                  prop="fiCaseChargeSumByItem.discount.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="待收金额"
                  prop="fiCaseChargeSumByItem.notReceived.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="实收金额"
                  prop="fiCaseChargeSumByItem.actualReceivable.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="已退费金额"
                  prop="fiCaseChargeSumByItem.refund.yuanFmt"
                ></el-table-column>
                <el-table-column
                  label="退费金额"
                  width="150px"
                  prop="amount.value"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'flowRefundDiscountItemList.' +
                        scope.$index +
                        '.amount.value'
                      "
                      :rules="$filter_rules({ required: true })"
                      size="mini"
                    >
                      <el-input-number
                        :precision="2"
                        size="mini"
                        v-model="scope.row.amount.value"
                        controls-position="right"
                        :min="0"
                        :max="
                          scope.row.fiCaseChargeSumByItem &&
                          scope.row.fiCaseChargeSumByItem.actualReceivable
                            ? scope.row.fiCaseChargeSumByItem.actualReceivable
                                .cent / 100
                            : 99999
                        "
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'flowRefundDiscountItemList.' +
                        scope.$index +
                        '.remarks'
                      "
                      size="mini"
                    >
                      <el-input v-model="scope.row.remarks"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="caseChargeRefundDialog = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="saveCaseChargeRefundForm('caseChargeRefundForm')"
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="图片"
      :visible.sync="imageDialog"
      width="30%"
      append-to-body
    >
      <span v-for="image in imgs" :key="image.id">
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
    <TimeExtend ref="TimeExtendref" />
  </div>
</template>

<script>
import Portlet from "../../layout/Portlet";
import Collapse from "../../layout/Collapse";
import Select2 from "../../../components/common/Select2";
import FileWall from "../../../components/common/FileWall";
import PictureWall from "../../../components/common/PictureWall";
import api from "../../../api/index";
import PageOfficeApi from "../../../components/tpl/PageOfficeApi";
import SimpleUpload from "../../../components/common/SimpleUpload";
import UploadPictures from "../../../components/common/Uploadpictures";
import Test from "../../../components/common/TreeSelect";
import SelectFromQualification from "../../../components/common/SelectFromQualification";
import store from "@/store.js";
import TimeExtend from "./Module/TimeExtend";
import { get } from "@/api/http";
import MoreSearch from "./Module/MoreSearch";
import Czur from "../../../components/common/Czur";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";
import BigDecimalUtils from "@/utils/BigDecimalUtils";

export default {
  name: "CaseList",
  components: {
    Collapse: Collapse,
    Select2: Select2,
    SimpleUpload: SimpleUpload,
    UploadPictures: UploadPictures,
    PictureWall: PictureWall,
    treeSelect: Test,
    "select-qualification": SelectFromQualification,
    Portlet,
    FileWall,
    TimeExtend,
    MoreSearch,
    Czur,
  },
  data() {
    return {
      BigDecimalUtils: BigDecimalUtils,
      tableHeight: "553px",
      allOptions: [],
      checkAll: false,
      checkReverse: false,
      //isIndeterminate: true,
      caseListHeaders: [],
      checkedList: [],
      panClass: {
        sm: {
          span: 12,
        },
        md: {
          span: 8,
        },
        xl: {
          span: 6,
          offset: 1,
        },
      },
      chargeTypeData: [], //收费类型，用于动态渲染财务列表表头和查询条件
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: {},
      searchForm: {
        entrustingUnit: {},
        authId: null,
        orgId: null,
        authRole: null,
        processSituation: "",
      },
      moreSearchDialog: false,
      checkMore: false,
      tableData: [],
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},
      sysUserListData: [], //用户数据
      consultationDialogVisible: false, //会诊模态框
      consultationInnerVisible: false, //会诊详情模态框
      exportCaseListDialog: false,
      consultationDetail: {}, //会诊详情数据
      consultationHistory: [],
      consultationForm: {
        files: [],
      }, //会诊表单
      expertOpt: [],
      editCaseNoDialog: false, //修改案件编号模态框
      editCaseNoForm: {},
      caseMarkOpt: [],
      isAudit: false,
      giveOutDialog: false, //发放信息模态框
      giveOutForm: {
        credentialList: [],
        otherGiveMaterials: [],
        inspectionMaterial: [],
      },
      giveOpt: [],
      tableData1: [],
      receiptImages: [], //回执
      annexImages: [], //附件
      archivedFileDialog: false, //归档模态框
      archivedFileForm: {
        caseType: {
          id: "",
        },
        archivePerson: {
          id: "",
        },
        rollupPerson: {
          id: "",
        },
      },
      recordCommunicationDialog: false, //沟通记录模态框
      recordCommunicationForm: {}, //沟通记录表单
      communicationTable: [], //以往沟通记录
      reportFileList: [], //沟通记录附件

      fillMaterialDialog: false, //补资料
      fillMaterialForm: {
        fillMaterialData: [],
      }, //待补资料列表
      selectedMaterial: [],

      casePauseDialog: false, //案件中止
      casePauseForm: {
        files: [],
      }, //案件中止(暂停)表单
      showCaseOutDialog: false, //出案模态框
      caseOutForm: {
        caseOutDataList: [],
      }, //出案数据

      authenticatedPersonData: [], //鉴定人列表
      authenticatedVehicleData: [], //鉴定车列表
      authenticatedOtherData: [], //鉴定其他列表
      poSampleData: [], //毒物样本列表
      dnaSampleData: [], //dna样本列表
      caSampleData: [], //检材样本列表
      authenticatedTargetDialog: false, //鉴定对象图片上传模态框
      authenticatedMaterialDialog: false, //鉴定材料图片上传模态框
      authenticatedMaterialData: [], //鉴定材料列表
      showCaseAllocationDialog: false, //案件分配的模态框
      costChangeDialog: false, //需要费用异动的案件模态框
      costChangeData: [], //需要费用异动的案件的数据
      caseChargeDeductionDialog: false, //费用减免的模态框
      caseChargeDeductionData: {
        reason: {
          id: null,
        },
      }, //费用减免的数据
      caseChargeRefundDialog: false, //退费模态框
      caseChargeRefundData: {
        reason: {
          id: null,
        },
        otherReason: "",
      }, //退费的数据
      caseChargeItemDialog: false, //案件收费项目的的模态框
      caseChargeItemEditDialog: false,
      caseChargeItemForm: {
        reason: {},
        caseChargeItemData: [], //案件的收费项目
      },
      caseChargeItemEditForm: {
        caseChargeItemData: [], //案件的收费项目
      },
      chargeItemDialog: false, //基本收费项目的模态框
      chargeItemEditDialog: false,
      chargeItems: [], //所有的收费项目
      chargeItemCondition: {}, //费用异动收费项目筛选数据
      chargeItemSelect: [], //选中的收费项目
      tempCostChargeData: [], //案件的收费项目修改后临时存的值
      chargeItemCaseId: "", //当前已经选中的收费项目的案件的id
      amountChangeDetailListAfter: [], //费用异动后的数据
      caseDto: {
        professionCategory: {
          id: null,
        },
        auth1: {
          participant: {},
        },
        auth2: {
          participant: {},
        },
        auth3: {
          participant: {},
        },
        auth4: {
          participant: {},
        },
        auth5: {
          participant: {},
        },
        assist: {
          participant: {},
        },
        issuer: {
          participant: {},
        },
        reviewer: {
          participant: {},
        },
        saleStaff: {
          participant: {},
        },
        authorizedSignatory: {
          participant: {},
        },
        labStaff: [],
      },
      detailMsg: {
        entrustInfo: {},
        labStaffName: null,
      },
      //表单打印相关
      showListFormFileDialog: false,
      listFormFileData: [],
      listFormFileSearchData: {},
      listFormFileTableSort: null,
      listFormFilePage: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 5,
        total: 0,
        current: 1,
      },
      authObjectType: null,
      //集团
      isNotOrg: null,
      orgList: [],
      materialReturnDialog: false, //返还材料导入模态框
      importMaterialSelect: [], //返还材料模态框选中id
      returnCaInspectionMaterials: [], //当前案件中已返回的案件材料
      imageDialog: false,
      imgs: null,
      showModifySalesDialog: false,
      salesPersonForm: {},
      salesPersonRule: {
        saleId: [
          {
            required: true,
            message: "请选择市场人员！",
            trigger: "blur",
          },
        ],
      },
      isDisabled: false,
      updatesalesPersonForm: {
        caseList: [],
      }, //批量修改市场人员
      poisonCategoryOpt: [], //毒物毒品类别,
      expenseChange: false, //是否进行费用异动修改
      formSelectRows: [],
      isInvoice: true,
      listType: "",
      isLoading: false,
    };
  },
  inject: ["hasPermission"],
  beforeUpdate() {
    let communication = document.querySelector("communicateContent");

    if (communication) {
      communication.children[0].style = "height:200px;";
    }
  },
  filters: {
    getNewNotReceived(v1, v2) {
      if (!v2) {
        return v1;
      } else {
        return BigDecimalUtils.minus(v2, v1, 2);
      }
    },
  },
  methods: {
    //费用异动收费项目详情表格合计
    getYDSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1 || index === 5) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property === "quantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        const value = data.map((item) =>
          Number(item.unitPrice.value * item.quantity)
        );
        if (column.property === "total") {
          sums[index] = value.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      this.sums = sums;
      return sums;
    },
    closeDialog() {
      this.archivedFileDialog = false;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        var property = "";
        if (column.property) {
          property = column.property;
        }
        const values = data.map((item) => {
          var value = item;
          if (property == "fiCaseChargeSumByItem.newNotReceived") {
            value = BigDecimalUtils.minus(
              value.fiCaseChargeSumByItem.notReceived.yuanFmt,
              Number(value.amount.value),
              2
            );
          } else {
            var propertyList = property.split(".");
            propertyList.forEach((v) => {
              value =
                typeof value[v] == "string"
                  ? value[v].replace(",", "")
                  : value[v];
            });
          }
          if (property == "amount.value") {
            value = Number(value);
          }
          return Number(value);
        });
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            typeof curr == "string" ? (curr = curr.replace(",", "")) : curr;
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index];
        }
      });
      return sums;
    },
    //案件导出项目全选
    handleCheckAllChange(val) {
      this.checkedList = val ? this.allOptions : [];
    },
    //案件导出项目反选
    handleCheckReverseChange(val) {
      let reverseList = [];
      this.allOptions.forEach((item) => {
        if (!this.checkedList.includes(item)) {
          reverseList.push(item);
        }
      });
      this.checkedList = reverseList;
    },
    handleCheckedItemChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allOptions.length;
    },
    //只能选择一个案件的判断
    judgeCaseLength(arr) {
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
    //初始化表格数据
    init() {
      this.$get(api.caCase, this.searchdata, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
        "page.orderBys": this.page.orderBys,
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
    //更多查询
    confirmSearch() {
      let form = JSON.parse(JSON.stringify(this.searchForm));
      if (form.registerId != null) {
        form.registerId = form.registerId.id;
      }
      form = Object.assign(form, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
        "page.orderBys": this.page.orderBys,
      });
      if (form.caseStatus == "") {
        form.abnormalStage = "";
        form.normalStage = "";
      } else if (form.caseStatus == "NORMAL") {
        form.abnormalStage = "";
      } else {
        form.normalStage = "";
      }
      this.$get(api.caCase, form)
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.moreSearchDialog = false;
          this.searchdata = form;
          sessionStorage.setItem(
            "caseListSearchData",
            JSON.stringify(this.searchdata)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkMoreInformation() {
      this.checkMore = !this.checkMore;
    },
    //数组中有某个值返回值的下标，没有返回false;
    findInArr(arr, value) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == value.id) {
          return i;
        }
      }
      return -1;
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
        this.tableData.forEach((item, index) => {
          this.selectData[curpage] &&
            this.selectData[curpage].forEach((value, ind, arr) => {
              if (value.id === item.id) {
                this.$refs.casetable.toggleRowSelection(item, true);
              }
            });
        });
      });
    },
    //案件编辑
    editCase() {
      var caseList = [].concat(this.selectRows);
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag && caseList[0].flowStatus.statusOfInt >= 5) {
        this.$message.error("该案件已签发，不能进行编辑！");
        return;
      }
      if (flag) {
        if (caseList[0].flowStatus.statusOfInt == 0) {
          this.$router
            .push({
              path: "/case/register/edit",
              query: {
                caseId: caseList[0].id,
                status: "REGISTER_EDIT",
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (caseList[0].flowStatus.statusOfInt > 0) {
          this.$router
            .push({
              path: "/case/acceptcase/edit",
              query: {
                caseId: caseList[0].id,
                status: "ACCEPT_EDIT",
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("此案件不能编辑！");
        }
      }
    },
    //案件复制
    copyCase() {
      var caseList = [].concat(this.selectRows);
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag) {
        var statusOfInt = caseList[0].flowStatus.statusOfInt;
        if (statusOfInt == 0) {
          this.$router.push({
            path: "/case/register/copy",
            query: {
              caseId: caseList[0].id,
              status: "CASE_COPY",
            },
          });
        } else {
          this.$router.push({
            path: "/case/accept/copy",
            query: {
              caseId: caseList[0].id,
              status: "CASE_COPY",
            },
          });
        }
      }
    },
    otherFun(command) {
      switch (command) {
        case "案件复制":
          this.copyCase();
          break;
        case "案件分配":
          this.caseAllocationDialog();
          break;
        case "修改市场人员":
          this.modifySalesDialog();
          break;
        case "开票申请":
          this.makeInvoiceApplyForm();
          break;
      }
    },
    //案件相关记录
    handleCommand(command) {
      var caseList = [].concat(this.selectRows);
      switch (command) {
        case "鉴定记录":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && caseList[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行鉴定记录！");
            return;
          }
          if (flag) {
            this.$router
              .push({
                path: "/main-flow/auth-records",
                query: {
                  caseId: caseList[0].id,
                },
              })
              .catch((err) => {
                console.log(err);
              });
          }
          break;
        case "会诊记录":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && caseList[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行会诊记录");
            return;
          }
          this.consultationForm = {
            files: [],
          };
          if (flag) {
            this.$get(
              "/api/external-person/v1/external-persons/by-pc?professionCategoryId=" +
                caseList[0].professionCategory.id
            )
              .then((res) => {
                this.expertOpt = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
            this.$get(
              "/api/consultation-record/v1/consultation-records/" +
                caseList[0].id
            )
              .then((res) => {
                this.consultationHistory = res.data;
                this.consultationDialogVisible = true;
              })
              .catch((err) => {
                console.log(err);
              });
          }

          break;
        case "沟通记录":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            var p1 = new Promise((resolve, reject) => {
              this.$get(
                "/api/ca-give-info/v1/ca-give-infos/details/" + caseList[0].id
              )
                .then((res) => {
                  resolve(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            });
            var p2 = new Promise((resolve, reject) => {
              this.$get(
                "/api/communication-record/v1/communication-records/" +
                  caseList[0].id
              )
                .then((res) => {
                  resolve(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            });
            Promise.all([p1, p2]).then((res) => {
              this.recordCommunicationForm = {};
              this.reportFileList = [];
              this.communicationTable = [];
              if (res[0].data) {
                var data = JSON.parse(JSON.stringify(res[0].data));
                data.giveType = data.giveType.value;
                if (!data.credentialList || data.credentialList.length == 0) {
                  data.credentialList = [];
                } else {
                  data.credentialList = data.credentialList.map((v, i) => {
                    return v.value;
                  });
                }
                this.recordCommunicationForm.giveInfoDto = data;
              }
              this.communicationTable = res[1].data;
              this.recordCommunicationDialog = true;
              if (this.$refs.recordCommunicationForm) {
                this.$refs.recordCommunicationForm.resetFields();
                this.$refs.recordCommunicationForm.clearValidate();
              }
            });
          }
          break;
      }
    },
    //会诊详情
    checkConsultationDetail(index, row) {
      this.consultationInnerVisible = true;
      this.consultationDetail = row;
    },
    //出案
    caseOut() {
      var list = JSON.parse(JSON.stringify(this.selectRows));
      var caseNo1 = "";
      var caseNo2 = "";
      if (list == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
        return;
      } else {
        list.forEach((v, i) => {
          if (v.flowStatus.statusOfInt < 5) {
            caseNo1 += v.caseNo + ",";
          }
          if (v.reportOutDate) {
            caseNo2 += v.caseNo + ",";
          }
          v.reportOutDate = this.$thisDate(true);
        });
      }
      if (caseNo1.length > 0) {
        this.$message.error(
          "案件 " +
            caseNo1.substr(0, caseNo1.length - 1) +
            " 还未签发，不能进行出案！"
        );
        return;
      }
      if (caseNo2.length > 0) {
        this.$message.error(
          "案件 " +
            caseNo2.substr(0, caseNo2.length - 1) +
            " 已经出案，不能再进行出案！"
        );
        return;
      }
      this.caseOutForm.caseOutDataList = list;
      this.showCaseOutDialog = true;
    },
    //保存出案
    saveCaseOut(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(
            JSON.stringify(this.caseOutForm.caseOutDataList)
          );
          this.$put(api.caCase + "/out", data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "出案成功！",
                  type: "success",
                });
                this.showCaseOutDialog = false;
                this.init();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //打印报告
    reportPrint() {
      var checkRows = JSON.parse(JSON.stringify(this.selectRows));
      if (checkRows.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
        return;
      }
      var data = {
        caseIds: "",
      };
      var caseNo = "";
      checkRows.forEach((v, i) => {
        data.caseIds += v.id + ",";
        if (v.flowStatus.statusOfInt < 5) {
          caseNo += v.caseNo + ",";
        }
      });
      if (caseNo.length > 0) {
        this.$message.error(
          "案件 " +
            caseNo.substr(0, caseNo.length - 1) +
            " 还未签发，不能进行报告打印！"
        );
        return;
      }
      this.$get(api.caCase + "/report/print", data)
        .then((res) => {
          if (res.status == 200) {
            var index = res.data.indexOf(".pdf");
            var length = res.data.length - 4;
            if (index == length) {
              window.location.href = res.data;
            } else {
              PageOfficeApi.openDoc(res.data, "N");
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.errMsg);
        });
    },
    //打开案件分配的对话框
    caseAllocationDialog() {
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag && this.selectRows[0].flowStatus.statusOfInt >= 5) {
        this.$message.error("该案件已签发，不能进行案件分配！");
        return;
      }
      if (flag) {
        this.$get(api.caCase + "/entrust-info/" + this.selectRows[0].id).then(
          (res) => {
            this.detailMsg = res.data;
            var name = "";
            if (res.data.labStaff) {
              var labStaffArr = res.data.labStaff;
              labStaffArr.forEach((v, i) => {
                name = name + v.participant.hrStaff.name + ",";
              });
              name = name.substr(0, name.length - 1);
            }
            this.detailMsg.labStaffName = name;
          }
        );
        this.$get(api.caCase + "/authenticator/" + this.selectRows[0].id).then(
          (res) => {
            this.caseDto = {
              professionCategory: {
                id: null,
              },
              auth1: {
                participant: {},
              },
              auth2: {
                participant: {},
              },
              auth3: {
                participant: {},
              },
              auth4: {
                participant: {},
              },
              auth5: {
                participant: {},
              },
              assist: {
                participant: {},
              },
              issuer: {
                participant: {},
              },
              reviewer: {
                participant: {},
              },
              authorizedSignatory: {
                participant: {},
              },
              labStaff: [],
            };
            //给案件的鉴定人员赋值，如果为空，则不赋值
            this.caseDto.professionCategory = res.data.professionCategory;
            this.showCaseAllocationDialog = true;
            if (res.data.auth1) {
              this.caseDto.auth1 = res.data.auth1;
              if (res.data.auth1.prohibitUpdate == "Y") {
                this.caseDto.auth1.isDisabled = true;
              }
            }
            if (res.data.auth2) {
              this.caseDto.auth2 = res.data.auth2;
              if (res.data.auth2.prohibitUpdate == "Y") {
                this.caseDto.auth2.isDisabled = true;
              }
            }
            if (res.data.auth3) {
              this.caseDto.auth3 = res.data.auth3;
              if (res.data.auth3.prohibitUpdate == "Y") {
                this.caseDto.auth3.isDisabled = true;
              }
            }
            if (res.data.auth4) {
              this.caseDto.auth4 = res.data.auth4;
              if (res.data.auth4.prohibitUpdate == "Y") {
                this.caseDto.auth4.isDisabled = true;
              }
            }
            if (res.data.auth5) {
              this.caseDto.auth5 = res.data.auth5;
              if (res.data.auth5.prohibitUpdate == "Y") {
                this.caseDto.auth5.isDisabled = true;
              }
            }
            if (res.data.assist) {
              this.caseDto.assist = res.data.assist;
              //设置不可修改
              if (res.data.assist.prohibitUpdate == "Y") {
                this.caseDto.assist.isDisabled = true;
              }
            }
            if (res.data.issuer) {
              this.caseDto.issuer = res.data.issuer;
              if (res.data.issuer.prohibitUpdate == "Y") {
                this.caseDto.issuer.isDisabled = true;
              }
            }
            if (res.data.authorizedSignatory) {
              this.caseDto.authorizedSignatory = res.data.authorizedSignatory;
              if (res.data.authorizedSignatory.prohibitUpdate == "Y") {
                this.caseDto.authorizedSignatory.isDisabled = true;
              }
            }
            if (res.data.reviewer) {
              this.caseDto.reviewer = res.data.reviewer;
              if (res.data.reviewer.prohibitUpdate == "Y") {
                this.caseDto.reviewer.isDisabled = true;
              }
            }
            if (res.data.labStaff) {
              res.data.labStaff.forEach((v, i) => {
                this.caseDto.labStaff.push(v.participant);
              });
            }
            // this.showCaseAllocationDialog = true;
          }
        );
      }
    },

    //批量修改市场人员
    modifySalesDialog() {
      this.updatesalesPersonForm.caseList = [];
      if (this.selectRows == 0) {
        this.$message.error("至少需要选择一个案件，请选择需要操作的案件！");
        return;
      } else {
        this.defaultData = JSON.parse(JSON.stringify(this.selectRows));
        this.defaultData.forEach((v, i) => {
          var temp = {
            caseDto: {
              id: v.id,
              caseNo: v.caseNo,
              entrustInfo: v.entrustInfo,
              professionCategoryId: v.professionCategory.id,
            },
            amount: v.financeInfo.amount.yuanFmt,
            oldSalesPerson:
              v.saleStaff == undefined ||
              v.saleStaff.participant == undefined ||
              v.saleStaff.participant.hrStaff == undefined
                ? ""
                : v.saleStaff.participant.hrStaff.name,
            newSalesPerson: "",
          };
          this.updatesalesPersonForm.caseList.push(temp);
        });
        this.updatesalesPersonForm.caseList;
        this.showModifySalesDialog = true;
      }
    },
    modifySales(formName) {
      var data = [].concat(this.updatesalesPersonForm.caseList);
      var dataUpdate = [];
      data.forEach((v, i) => {
        dataUpdate.push({
          caseId: v.caseDto.id,
          caseNo: v.caseDto.caseNo,
          saleId: v.newSalesPerson,
        });
      }),
        Promise.all(dataUpdate).then((res) => {
          this.$post(api.caCase + "/saleperson/update", dataUpdate)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "市场人员更新成功!",
                  type: "success",
                });
                this.showModifySalesDialog = false;
                this.confirmSearch();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
    },
    //案件分配
    caseAllocation: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //第一鉴定人到第五鉴定人不能重复
          var auth1Toauth5List = [];
          this.caseDto.authenticatorList = [];
          if (
            this.caseDto.auth1.participant &&
            this.caseDto.auth1.participant.id
          ) {
            this.caseDto.auth1.caseRole = "AUTH1";
            this.caseDto.authenticatorList.push(this.caseDto.auth1);
            auth1Toauth5List.push(this.caseDto.auth1.participant.id);
          }
          if (
            this.caseDto.auth2.participant &&
            this.caseDto.auth2.participant.id
          ) {
            this.caseDto.auth2.caseRole = "AUTH2";
            this.caseDto.authenticatorList.push(this.caseDto.auth2);
            auth1Toauth5List.push(this.caseDto.auth2.participant.id);
          }
          if (
            this.caseDto.auth3.participant &&
            this.caseDto.auth3.participant.id
          ) {
            this.caseDto.auth3.caseRole = "AUTH3";
            this.caseDto.authenticatorList.push(this.caseDto.auth3);
            auth1Toauth5List.push(this.caseDto.auth3.participant.id);
          }
          if (
            this.caseDto.auth4.participant &&
            this.caseDto.auth4.participant.id
          ) {
            this.caseDto.auth4.caseRole = "AUTH4";
            this.caseDto.authenticatorList.push(this.caseDto.auth4);
            auth1Toauth5List.push(this.caseDto.auth4.participant.id);
          }
          if (
            this.caseDto.auth5.participant &&
            this.caseDto.auth5.participant.id
          ) {
            this.caseDto.auth5.caseRole = "AUTH5";
            this.caseDto.authenticatorList.push(this.caseDto.auth5);
            auth1Toauth5List.push(this.caseDto.auth5.participant.id);
          }
          if (
            this.caseDto.issuer.participant &&
            this.caseDto.issuer.participant.id
          ) {
            this.caseDto.issuer.caseRole = "ISSUER";
            this.caseDto.authenticatorList.push(this.caseDto.issuer);
          }
          if (
            this.caseDto.reviewer.participant &&
            this.caseDto.reviewer.participant.id
          ) {
            this.caseDto.reviewer.caseRole = "REVIEWER";
            this.caseDto.authenticatorList.push(this.caseDto.reviewer);
          }
          if (
            this.caseDto.assist.participant &&
            this.caseDto.assist.participant.id
          ) {
            this.caseDto.assist.caseRole = "ASSIST";
            this.caseDto.authenticatorList.push(this.caseDto.assist);
          }
          if (
            this.caseDto.authorizedSignatory.participant &&
            this.caseDto.authorizedSignatory.participant.id
          ) {
            this.caseDto.authorizedSignatory.caseRole = "AUTHORIZED_SIGNATORY";
            this.caseDto.authenticatorList.push(
              this.caseDto.authorizedSignatory
            );
          }
          if (this.caseDto.labStaff) {
            var labStaffArr = this.caseDto.labStaff;
            labStaffArr.forEach((v, i) => {
              var labStaffObj = {
                caseRole: "LAB_STAFF",
                caseId: this.selectRows[0].id,
                participant: v,
              };
              this.caseDto.authenticatorList.push(labStaffObj);
            });
          }
          var repetitionBl = this.judgeRepetitionAuth(auth1Toauth5List);
          if (repetitionBl) {
            this.$message.error("第一鉴定人到第五鉴定人不可重复！");
            return;
          }
          this.caseDto.id = this.selectRows[0].id;
          this.$put(
            api.caCase + "/allocation/" + this.selectRows[0].id,
            JSON.parse(JSON.stringify(this.caseDto))
          ).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              // this.selectRows = [];
              this.$refs.casetable.clearSelection();
              this.init();
              this.showCaseAllocationDialog = false;
            }
          });
        }
      });
    },
    //补资料窗口打开
    fillMaterial() {
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag && this.selectRows[0].flowStatus.statusOfInt >= 5) {
        this.$message.error("该案件已签发，不能进行补资料！");
        return;
      }
      if (flag) {
        // var materialStatus = this.selectRows[0].entrustInfo.materialAllReady;
        // if (materialStatus == 'N') {
        var data = {
          caseId: this.selectRows[0].id,
          materialStatus: "WAITING_SEND",
        };
        this.$get(api.inspectMaterial, data)
          .then((res) => {
            this.fillMaterialForm.fillMaterialData = [].concat(
              res.data.inspectionMaterialListWaitingSend
            );
            this.fillMaterialDialog = true;
          })
          .catch((err) => {
            console.log(err);
          });
        // } else {
        //     this.$message.error('该案件资料齐全，不能补充!')
        // }
      }
    },
    //勾选的材料
    handleCheckMaterial(selections) {
      this.selectedMaterial = [].concat(selections);
    },
    //增加补充资料
    addFillMaterialRow() {
      this.fillMaterialForm.fillMaterialData.push({
        status: {
          label: "待补充材料",
          value: "WAITING_SEND",
        },
        quantity: 1,
      });
    },

    //批量收到补充资料
    receive() {
      if (this.selectedMaterial.length) {
        this.$refs.fillMaterialForm.validate((valid) => {
          if (valid) {
            var arr = [].concat(this.fillMaterialForm.fillMaterialData);
            var imgPromise = [];
            arr.forEach((v, i) => {
              var index = this._.findIndex(this.selectedMaterial, function (o) {
                return o.name == v.name;
              });
              if (index != -1) {
                v.status = {
                  label: "正常",
                  value: "NORMAL",
                };
              } else {
                v.status = {
                  label: "待补充材料",
                  value: "WAITING_SEND",
                };
              }
              if (v.images && v.images.length) {
                let p = new Promise((resolve, reject) => {
                  this.$compressImages(v.images).then((res) => {
                    v.images = res;
                    resolve();
                  });
                });
                imgPromise.push(p);
              }
            });
            Promise.all(imgPromise)
              .then((res) => {
                this.$put(
                  api.receivedMaterial + "/" + this.selectRows[0].id,
                  arr
                )
                  .then((res) => {
                    if (res.status == 200) {
                      var data = {
                        caseId: this.selectRows[0].id,
                        materialStatus: "WAITING_SEND",
                      };
                      this.$get(api.inspectMaterial, data)
                        .then((res) => {
                          this.fillMaterialForm.fillMaterialData = [].concat(
                            res.data.inspectionMaterialListWaitingSend
                          );
                          if (
                            this.fillMaterialForm.fillMaterialData.length == 0
                          ) {
                            this.$confirmBox(
                              "所有待补充资料已经补全，是否把案件的‘资料是否齐全’设为是？"
                            )
                              .then((res1) => {
                                this.$put(
                                  api.allReady + "/" + this.selectRows[0].id
                                )
                                  .then((res2) => {
                                    this.$message({
                                      message: "设置成功！",
                                      type: "success",
                                    });
                                    this.fillMaterialDialog = false;
                                    this.selectData = {};
                                    this.selectDataLength = 0;
                                    // this.selectRows = [];
                                    this.init();
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              })
                              .catch((err) => {});
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      } else {
        this.$message.error("请选择收到的材料");
      }
    },
    //全部补齐
    allReceive() {
      this.$refs.fillMaterialForm.validate((valid) => {
        if (valid) {
          var imgPromise = [];
          var arr = [].concat(this.fillMaterialForm.fillMaterialData);
          if (arr.length > 0) {
            arr.forEach((v, i) => {
              v.status = {
                label: "正常",
                value: "NORMAL",
              };
              if (v.images && v.images.length) {
                let p = new Promise((resolve, reject) => {
                  this.$compressImages(v.images).then((res) => {
                    v.images = res;
                    resolve();
                  });
                });
                imgPromise.push(p);
              }
            });
            Promise.all(imgPromise)
              .then((res) => {
                this.$put(
                  api.receivedMaterial + "/" + this.selectRows[0].id,
                  arr
                )
                  .then((res) => {
                    if (res.status == 200) {
                      this.fillMaterialForm.fillMaterialData = [];
                      this.$confirmBox(
                        "所有待补充资料已经补全，是否把案件的‘资料是否齐全’设为是？"
                      )
                        .then((res1) => {
                          this.$put(api.allReady + "/" + this.selectRows[0].id)
                            .then((res2) => {
                              this.$message({
                                message: "设置成功！",
                                type: "success",
                              });
                              this.fillMaterialDialog = false;
                              this.selectData = {};
                              this.selectDataLength = 0;
                              // this.selectRows = [];
                              this.$refs.casetable.clearSelection();
                              this.init();
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        })
                        .catch((err) => {});
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$message.error("没有待补充的资料！");
          }
        }
      });
    },
    //删除补充资料
    deleteRow(index, row) {
      this.fillMaterialForm.fillMaterialData.splice(index, 1);
      if (this.fillMaterialForm.fillMaterialData.length == 0) {
        this.$confirmBox(
          "所有待补充资料已经补全，是否把案件的‘资料是否齐全’设为是？"
        )
          .then((res) => {
            this.$put(api.allReady + "/" + this.selectRows[0].id)
              .then((res1) => {
                this.$message({
                  message: "设置成功！",
                  type: "success",
                });
                this.fillMaterialDialog = false;
                this.selectData = {};
                this.selectDataLength = 0;
                // this.selectRows = [];
                this.$refs.casetable.clearSelection();
                this.init();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {});
      }
    },
    //保存待补充材料
    saveFillMaterial() {
      this.$refs.fillMaterialForm.validate((valid) => {
        if (valid) {
          var imgPromise = [];
          var arr = [].concat(this.fillMaterialForm.fillMaterialData);
          arr.forEach((v, i) => {
            if (v.images && v.images.length) {
              let p = new Promise((resolve, reject) => {
                this.$compressImages(v.images).then((res) => {
                  v.images = res;
                  resolve();
                });
              });
              imgPromise.push(p);
            }
          });
          Promise.all(imgPromise)
            .then((res) => {
              this.$put(api.receivedMaterial + "/" + this.selectRows[0].id, arr)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "保存成功！",
                      type: "success",
                    });
                    this.fillMaterialDialog = false;
                    this.selectData = {};
                    this.selectDataLength = 0;
                    // this.selectRows = [];
                    this.$refs.casetable.clearSelection();
                    this.init();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //案件暂停附件上传
    changeCasePauseFile(file, fileList) {
      var fileName = file.name;
      var fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.casePauseForm.files.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    //案件管理
    settleCase(command) {
      var caseList = [].concat(this.selectRows);
      switch (command) {
        case "案件关联":
          if (caseList.length == 1) {
            this.$prompt("请输入关联案件流水号", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
              .then(({ value }) => {
                this.$put(
                  api.caCase +
                    "/association?" +
                    "caseId=" +
                    caseList[0].id +
                    "&otherSerialNumber=" +
                    value
                )
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "关联成功！",
                        type: "success",
                      });
                      this.init();
                      this.selectData = {};
                      this.selectDataLength = 0;
                      this.$refs.casetable.clearSelection();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err) {
                      this.$message.error(err.errMsg);
                    }
                  });
              })
              .catch(() => {});
          } else if (caseList.length == 0) {
            this.$message.error("您还没有选择案件，请选择需要操作的案件！");
          } else {
            this.$message.error("只能1个案件进行操作！");
          }
          break;
        case "案件取消关联":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            this.$confirmBox("您确定要把此案件去关联吗？")
              .then((res) => {
                this.$put(api.caCase + "/cancel-association/" + caseList[0].id)
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "取消关联成功！",
                        type: "success",
                      });
                      this.init();
                      this.selectData = {};
                      this.selectDataLength = 0;
                      // this.selectRows = [];
                      this.$refs.casetable.clearSelection();
                    }
                  })
                  .catch((err) => {
                    if (err) {
                      this.$message.error(err.errMsg);
                    }
                  });
              })
              .catch((err) => {});
          }
          break;
        case "修改编号":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && this.selectRows[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能修改案件编号！");
            return;
          }
          if (flag) {
            var data = this.selectRows[0];
            this.editCaseNoDialog = true;
            this.editCaseNoForm = {
              caseNo: data.caseNo,
              id: data.id,
              professionCategory: {
                id: data.professionCategory.id,
                type: data.professionCategory.type,
              },
            };
            this.$get("/api/param/v1/params/value", {
              professionCategoryId: data.professionCategory.id,
              key: "case.no.mark",
            })
              .then((res) => {
                if (res.status == 200) {
                  var arr = res.data.split("，");
                  this.caseMarkOpt = arr;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
          break;
        case "删除案件":
          var flag = this.judgeCaseLength(this.selectRows);
          var data = this.selectRows[0];
          if (flag && data.flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能删除案件！");
            return;
          }
          if (
            data.financeInfo &&
            data.financeInfo.actualReceivable &&
            data.financeInfo.actualReceivable.cent > 0
          ) {
            this.$message.error("该案件已收费，不能删除案件！");
            return;
          }
          if (
            data.financeInfo &&
            data.financeInfo.invoiceAmount &&
            data.financeInfo.invoiceAmount.cent > 0
          ) {
            this.$message.error("该案件已开票，不能删除案件！");
            return;
          }
          if (flag) {
            this.$confirmBox(
              "确定删除案件" + (data.caseNo ? data.caseNo : "") + "吗?"
            )
              .then((res) => {
                this.$del("/api/ca-case/v1/cases/" + data.id)
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "删除成功！",
                        type: "success",
                      });
                      this.init();
                      this.selectData = {};
                      this.selectDataLength = 0;
                      // this.selectRows = [];
                      this.$refs.casetable.clearSelection();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {});
          }
          break;
        case "案件中止":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && caseList[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行案件时效暂停！");
            return;
          }
          if (flag) {
            var data = this.selectRows[0];
            // casePauseForm
            this.$get("/api/ca-case/v1/cases/is-suspend/" + data.id)
              .then((res) => {
                if (res.data) {
                  this.$message.error(
                    "该案件已处于暂停状态，请在案件中止列表中查看!"
                  );
                } else {
                  this.casePauseDialog = true;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
          break;
        case "终止鉴定":
          //是否存在已退案案件
          if (this.selectRows.length == 1) {
            if (this.selectRows[0].flowStatus.value == "ABORTED") {
              this.$message.error("该案件已退案！");
              return;
            }
          }
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (this.selectRows[0].caseStatus.value != "CHANGE_APPLY") {
              this.$router
                .push({
                  path: "/case/abort",
                  query: {
                    caseId: this.selectRows[0].id,
                  },
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message({
                message: "案件正在进行报告变更,不能再申请退案",
                type: "error",
              });
            }
          }
          break;
        case "报告变更":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (this.selectRows[0].flowStatus.statusOfInt >= 5) {
              if (this.selectRows[0].caseStatus.value != "CHANGE_APPLY") {
                this.$router
                  .push({
                    path: "/case/report-change",
                    query: {
                      caseId: this.selectRows[0].id,
                      caseNo: this.selectRows[0].caseNo,
                      professionCategoryId:
                        this.selectRows[0].professionCategory.id,
                    },
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                this.$message({
                  message: "案件正在进行报告变更,不能再申请报告变更",
                  type: "error",
                });
              }
            } else {
              this.$message.error("此案件还未签发，不需要做报告变更！");
            }
          }
          break;
        case "补充鉴定":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (this.selectRows[0].reportOutDate) {
              this.$router
                .push({
                  path: "/case/acceptcase/case_supplement",
                  query: {
                    caseId: caseList[0].id,
                    status: "CASE_SUPPLEMENT",
                  },
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message.error("此案件还未出案，不需要做补充鉴定！");
            }
          }
          break;
        case "重新鉴定":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (this.selectRows[0].reportOutDate) {
              this.$router
                .push({
                  path: "/case/acceptcase/case_supplement",
                  query: {
                    caseId: caseList[0].id,
                    status: "REAUTHENTICATE",
                  },
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message.error("此案件还未出案，不需要做重新鉴定！");
            }
          }
          break;
        case "案件时限延长":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && caseList[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行案件时效延长！");
            return;
          }
          if (flag) {
            this.timeExtendFn(this.selectRows[0]);
          }
          break;
      }
    },
    handleChange(file, fileList, arrName) {
      this[arrName].push(file);
    },
    handleClose(tag) {
      var index = this._.findIndex(this.reportFileList, function (o) {
        return o.uid == tag.uid;
      });
      this.reportFileList.splice(index, 1);
    },
    //案件时效延长
    timeExtendFn(item) {
      this.$refs.TimeExtendref.init(item);
    },
    //档案管理
    settleFile(command) {
      var caseList = [].concat(this.selectRows);
      switch (command) {
        case "制作档案目录":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (caseList[0].flowStatus.statusOfInt >= 5) {
              this.$router
                .push({
                  path: "/case/file-directory",
                  query: {
                    caseId: caseList[0].id,
                    professionCategoryId: caseList[0].professionCategory.id,
                  },
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message({
                message: "此案件未签发不能制作归档目录！",
                type: "warning",
              });
            }
          }

          break;
        case "归档":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            if (caseList[0].flowStatus.statusOfInt >= 5) {
              var temp = {};
              temp["page.pageSize"] = 1000;
              temp["page.current"] = 1;
              this.$get("/api/user/v1/users", temp)
                .then((res) => {
                  let arr = [];
                  res.data.list.forEach((v, i) => {
                    if (v.hrStaff) {
                      arr.push(v);
                    }
                  });
                  this.sysUserListData = arr;
                })
                .catch((err) => {
                  console.log(err);
                });

              this.$get("/api/ca-archive/v1/archives/" + caseList[0].id)
                .then((res) => {
                  if (res.data) {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.archivedFileForm = data;
                    this.archivedFileDialog = true;
                    if (res.data.archivePerson == null) {
                      //获取当前用户
                      this.$get(api.myInfo).then((res) => {
                        var myInfo = JSON.parse(JSON.stringify(res.data));
                        this.archivedFileForm.archivePerson = myInfo;
                      });
                    }
                    if (this.archivedFileForm.rollupPerson == null)
                      this.archivedFileForm.rollupPerson =
                        caseList[0].auth1.participant;
                  } else {
                    //获取当前用户
                    this.$get(api.myInfo).then((res) => {
                      var myInfo = JSON.parse(JSON.stringify(res.data));
                      this.archivedFileForm = {
                        caseType: {
                          id: "",
                        },
                        archivePerson: myInfo,
                        rollupPerson: caseList[0].auth1.participant,
                      };
                      this.archivedFileDialog = true;
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message({
                message: "此案件未签发不能进行归档操作！",
                type: "warning",
              });
            }
          }
          break;
      }
    },
    //确认修改案件编号
    confirmCaseNo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.editCaseNoForm));
          data.reportTypeFlag = data.reportTypeFlag.label;
          if (data.radio == "N") {
            data.caseNoSequence = "";
          }
          delete data.radio;
          delete data.caseNo;
          this.$put(api.caCase + "/update-case-no/" + data.id, data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
                this.init();
                // this.selectRows = [];
                this.selectData = {};
                this.selectDataLength = 0;
                this.$refs.casetable.clearSelection();
                this.$refs[formName].resetFields();
                this.editCaseNoDialog = false;
              }
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        }
      });
    },
    //点击发放信息按钮
    giveOutMsg() {
      var flag = this.judgeCaseLength(this.selectRows);
      var Acase = this.selectRows[0];
      if (flag) {
        this.queryReturnMaterial(Acase.id);
        if (Number(Acase.flowStatus.statusOfInt) >= 5) {
          this.$get("/api/ca-give-info/v1/ca-give-infos/details/" + Acase.id)
            .then((res) => {
              if (res.status == 200) {
                if (res.data != null && res.data != "") {
                  var data = JSON.parse(JSON.stringify(res.data));
                  if (
                    data.credentialList == null ||
                    data.credentialList.length == 0
                  ) {
                    data.credentialList = [];
                  } else {
                    data.credentialList = data.credentialList.map((v, i) => {
                      return v.value;
                    });
                  }
                  if (
                    data.otherGiveMaterials == null ||
                    data.otherGiveMaterials == ""
                  ) {
                    data.otherGiveMaterials = [];
                  } else {
                    var str = data.otherGiveMaterials;
                    if (str.indexOf("发票") != -1 && str.length > 2) {
                      data.otherGiveMaterials = ["INVOICE", "OTHER"];
                      data.otherMsg = str.substr(
                        str.indexOf("发票") + 3,
                        str.length
                      );
                    } else if (str.indexOf("发票") != -1 && str.length <= 2) {
                      data.otherGiveMaterials = ["INVOICE"];
                    } else {
                      data.otherGiveMaterials = ["OTHER"];
                      data.otherMsg = str.substr(1, str.length);
                    }
                  }
                  data.giveType = data.giveType.value;

                  this.giveOutForm = data;
                  this.receiptImages = data.receiptImages;

                  this.annexImages = data.annexImages.map((v, i) => {
                    var index = v.url.lastIndexOf("-");
                    var name = v.url.substring(index + 1);
                    var index2 = v.url.lastIndexOf(".");
                    var type = v.url.substring(index2 + 1);
                    return {
                      fileType: type,
                      name: name,
                      url: v.url,
                    };
                  });
                }
                this.giveOutDialog = true;
              }
            })
            .catch((err) => {});
        } else {
          this.$message.error("此案件还未签发，不能进行发放或修改发放信息！");
        }
      }
    },
    //会诊信息上传附件
    handleChangeFile(file, fileList) {
      // if (!file.raw.type.includes('image')) {
      //     this.$message.error(`上传文件只能是图片!`);
      //     return;
      // }
      var fileName = file.name;
      var fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.consultationForm.files.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    //确认会诊信息
    confirmConsultation(formName) {
      this.isDisabled = true;
      var _this = this;
      setTimeout(() => {
        _this.isDisabled = false;
      }, 3000);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { consultationStartDate, consultationEndDate, expiredDate } =
            this.consultationForm;
          // 开始时间，结束时间，到期日期
          if (
            new Date(consultationStartDate.replace("-", "/")).getTime() >
            new Date(consultationEndDate.replace("-", "/")).getTime()
          ) {
            this.$message.error("开始时间不能早于结束时间！");
            return;
          }
          if (
            new Date(consultationEndDate.replace("-", "/")).getTime() >
            new Date(expiredDate.replace("-", "/")).getTime()
          ) {
            this.$message.error("结束时间不能晚于到期时间！");
            return;
          }
          var filePromise = [];
          if (this.consultationForm.files.length) {
            this.consultationForm.files.forEach((v, i) => {
              if (v.raw) {
                if (v.fileType == "JPG" || v.fileType == "PNG") {
                  let p = new Promise((resolve, reject) => {
                    lrz(v.raw, {
                      width: 1280,
                    }).then(function (rst) {
                      var index = v.name.lastIndexOf(".");
                      var fileName = v.name.substring(0, index);
                      _this.consultationForm.files[i] = {
                        name: fileName,
                        fileType: v.fileType,
                        base64Str: rst.base64,
                      };
                      resolve();
                    });
                  });
                  filePromise.push(p);
                } else {
                  let p = new Promise((resolve, reject) => {
                    _this.$getBase64(v.raw).then(function (res) {
                      var index = v.name.lastIndexOf(".");
                      var fileName = v.name.substring(0, index);
                      _this.consultationForm.files[i] = {
                        name: fileName,
                        fileType: v.fileType,
                        base64Str: res,
                      };
                      resolve();
                    });
                  });
                  filePromise.push(p);
                }
              } else {
                this.consultationForm.files[i] = v;
              }
            });
          }
          Promise.all(filePromise).then((res) => {
            var data1 = JSON.parse(JSON.stringify(this.consultationForm));
            data1.caseDto = {
              id: this.selectRows[0].id,
            };
            delete data1.img;
            this.$post(
              "/api/consultation-record/v1/consultation-records",
              data1
            )
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "保存成功！",
                    type: "success",
                  });
                  this.consultationDialogVisible = false;
                  this.consultationForm = {
                    consultationType: {
                      id: "",
                    },
                    expert: {
                      id: "",
                    },
                    img: {},
                  };
                  // this.selectRows = [];
                  this.selectData = {};
                  this.selectDataLength = 0;
                  this.$refs.casetable.clearSelection();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      });
    },
    //确认沟通
    async confirmCommunication(formName) {
      this.isDisabled = true;
      var _this = this;
      setTimeout(() => {
        _this.isDisabled = false;
      }, 3000);
      let { reportFileList } = _this;
      let files = await _this.fileYs(reportFileList); //沟通记录附件
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(_this.recordCommunicationForm));
          data.caseId = _this.selectRows[0].id;
          data.reportFileList = files;
          _this
            .$post("/api/communication-record/v1/communication-records/", data)
            .then((res) => {
              if (res.status == 200) {
                _this.$message({
                  message: "保存成功！",
                  type: "success",
                });
                _this.recordCommunicationDialog = false;
                _this.$refs[formName].resetFields();
                // _this.selectRows = [];
                _this.selectData = {};
                _this.selectDataLength = 0;
                _this.$refs.casetable.clearSelection();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    //确认归档
    async archivedFile(formName) {
      await new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          valid ? resolve() : reject();
        });
      });
      this.isLoading = true;
      var data = JSON.parse(JSON.stringify(this.archivedFileForm));
      var flagRollupPerson = 0;
      var flagArchivePerson = 0;
      //判读选项卡value是否等于选项卡Text，如果是其判断标签+1
      this.sysUserListData.forEach((v, i) => {
        if (data.rollupPerson.label == v.hrStaff.name) {
          data.rollupPerson.id = v.id;
          flagRollupPerson++;
        }
        if (data.archivePerson.label == v.hrStaff.name) {
          data.archivePerson.id = v.id;
          flagArchivePerson++;
        }
      });
      if (flagRollupPerson == 0)
        data.rollupPerson.id = this.archivedFileForm.rollupPerson.label;
      if (flagArchivePerson == 0)
        data.archivePerson.id = this.archivedFileForm.archivePerson.label;
      data.caseId = this.selectRows[0].id;
      this.$put("/api/ca-archive/v1/archives", data)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "保存成功！",
              type: "success",
            });
            this.isLoading = false;
            this.archivedFileDialog = false;
            // this.selectRows = [];
            this.selectData = {};
            this.selectDataLength = 0;
            this.init();
            this.$refs.casetable.clearSelection();
            this.$refs[formName].clearValidate();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //选择上传回执文件
    handleChangeReceipt(file, fileList) {
      this.receiptImages = this.$isUploadImg(fileList);
    },
    //选择上传附件文件
    handleChangeAccessory(file, fileList) {
      var fileName = file.name;
      let fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.annexImages.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
      // this.annexImages = this.$isUploadImg(fileList);
    },
    //打印表单相关
    listFormFile() {
      var caseList = [].concat(this.selectRows);
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag) {
        (this.listFormFileSearchData = {
          professionCategoryId: caseList[0].professionCategory.id,
          // notInFormLocationList: "AUTH_RECORD,REPORT_CHANGE", //报告变更页面和受理界面的表单过滤掉
          templateType: "FORM",
        }),
          (this.showListFormFileDialog = true); //打开模态框
      }
    },

    //打印表单相关2
    listFormFile2() {
      var caseList = [].concat(this.selectRows);
      var flag = this.judgeCaseLength(this.selectRows);
      if (flag) {
        (this.listFormFileSearchData = {
          professionCategoryId: caseList[0].professionCategory.id,
          formLocation: "ARCHIVED",
          templateType: "FORM",
        }),
          (this.showListFormFileDialog = true); //打开模态框
      }
    },

    //表单多选框选择监听
    handleFormSelectCheck(val) {
      this.formSelectRows = val;
    },
    formFilePrint() {
      let formList = this.formSelectRows;
      var caseList = [].concat(this.selectRows);
      var caseId = caseList[0].id;
      var fileList = "";
      formList.forEach((v, i) => {
        if (v.templateFile && v.templateFile.url) {
          fileList = fileList + v.templateFile.url + ",";
        }
      });
      let data = this.listFormFileSearchData;
      data.fileList = fileList;
      this.$get(api.caCase + "/form/print", data)
        .then((res) => {
          if (res.status == 200) {
            PageOfficeApi.renderForm1(caseId, res.data, "Y");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.errMsg);
        });
    },
    printForm(row, isReCreate) {
      var caseList = [].concat(this.selectRows);
      var caseId = caseList[0].id;
      PageOfficeApi.renderForm(caseId, null, row.id, isReCreate);
    },
    //确认发放信息
    confirmGiveOut(formName) {
      var data = JSON.parse(JSON.stringify(this.giveOutForm));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var imageArr = [];
          // receiptImages:[],//回执
          // annexImages:[],//附件
          data.receiptImages = [];
          data.annexImages = [];
          this.receiptImages.forEach((v, i) => {
            if (v.raw) {
              let p = new Promise((resolve, reject) => {
                let file = v.raw;
                let filename = file.name.substring(
                  0,
                  file.name.lastIndexOf(".")
                );
                let filetype = filename.substring(
                  filename.lastIndexOf(".") + 1,
                  filename.length + 1
                );
                lrz(file, {
                  width: 1280,
                }).then(function (rst) {
                  let img = {
                    imageType: filetype,
                    image: rst.base64,
                  };
                  data.receiptImages.push(img);
                  resolve();
                });
              });
              imageArr.push(p);
            } else {
              data.receiptImages.push(v);
            }
          });
          this.annexImages.forEach((v, i) => {
            if (v.raw) {
              if (
                v.fileType.toUpperCase() == "JPG" ||
                v.fileType.toUpperCase() == "PNG"
              ) {
                let p = new Promise((resolve, reject) => {
                  let file = v.raw;
                  let filename = file.name.substring(
                    0,
                    file.name.lastIndexOf(".")
                  );
                  let filetype = file.name.substring(
                    file.name.lastIndexOf(".") + 1,
                    file.name.length + 1
                  );
                  lrz(file, {
                    width: 1280,
                  }).then(function (rst) {
                    let img = {
                      name: filename,
                      imageType: filetype,
                      image: rst.base64,
                    };
                    data.annexImages.push(img);
                    resolve();
                  });
                });
                imageArr.push(p);
              } else {
                let p = new Promise((resolve, reject) => {
                  this.$getBase64(v.raw).then(function (res) {
                    var index = v.name.lastIndexOf(".");
                    var fileName = v.name.substring(0, index);
                    let filetype = v.name.substring(
                      v.name.lastIndexOf(".") + 1,
                      v.name.length + 1
                    );
                    let img = {
                      name: fileName,
                      imageType: filetype,
                      image: res,
                    };
                    data.annexImages.push(img);
                    resolve();
                  });
                });
                imageArr.push(p);
              }
            } else {
              data.annexImages.push(v);
            }
          });
          Promise.all(imageArr).then((res) => {
            // if (data.otherGiveMaterials.length) {
            //     if (data.otherGiveMaterials.indexOf('INVOICE') == -1) {
            //         this.$message({
            //             message: '发票必选',
            //             type: 'warning'
            //         });
            //     } else {
            if (data.otherGiveMaterials.indexOf("INVOICE") != -1) {
              data.otherGiveMaterials =
                "发票" +
                (this.giveOutForm.otherMsg == undefined ||
                this.giveOutForm.otherMsg == ""
                  ? ""
                  : "," + this.giveOutForm.otherMsg);
            } else if (data.otherGiveMaterials.indexOf("INVOICE") == -1) {
              data.otherGiveMaterials =
                this.giveOutForm.otherMsg == undefined ||
                this.giveOutForm.otherMsg == ""
                  ? ""
                  : "," + this.giveOutForm.otherMsg;
            }
            this.$put(
              "/api/ca-give-info/v1/ca-give-infos/" + this.selectRows[0].id,
              data
            )
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "发放成功！",
                    type: "success",
                  });
                  this.init();
                  this.giveOutDialog = false;
                  this.annexImages = [];
                  this.receiptImages = [];
                  this.$refs.casetable.clearSelection();
                  // this.selectRows = [];
                  this.selectData = {};
                  this.selectDataLength = 0;
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
              });
            //     }
            // }
            // ;
          });
        }
      });
    },
    //确认中止案件
    confirmCasePause() {
      this.isDisabled = true;
      var Acase = this.selectRows[0];
      this.casePauseForm.caseId = Acase.id;
      var _this = this;
      setTimeout(() => {
        _this.isDisabled = false;
      }, 3000);
      var filePromise = [];
      if (this.casePauseForm.files.length) {
        this.casePauseForm.files.forEach((v, i) => {
          if (v.raw) {
            if (v.fileType == "JPG" || v.fileType == "PNG") {
              let p = new Promise((resolve, reject) => {
                lrz(v.raw, {
                  width: 1280,
                }).then(function (rst) {
                  var index = v.name.lastIndexOf(".");
                  var fileName = v.name.substring(0, index);
                  _this.casePauseForm.files[i] = {
                    name: fileName,
                    fileType: v.fileType,
                    base64Str: rst.base64,
                  };
                  resolve();
                });
              });
              filePromise.push(p);
            } else {
              let p = new Promise((resolve, reject) => {
                _this.$getBase64(v.raw).then(function (res) {
                  var index = v.name.lastIndexOf(".");
                  var fileName = v.name.substring(0, index);
                  _this.casePauseForm.files[i] = {
                    name: fileName,
                    fileType: v.fileType,
                    base64Str: res,
                  };
                  resolve();
                });
              });
              filePromise.push(p);
            }
          } else {
            this.casePauseForm.files[i] = v;
          }
        });
      }
      Promise.all(filePromise)
        .then((res) => {
          this.$post(
            "api/ca-case/v1/cases/suspend/" + Acase.id,
            this.casePauseForm
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "案件中止成功！",
                  type: "success",
                });
                this.casePauseDialog = false;
                // this.selectRows = [];
                this.selectData = {};
                this.selectDataLength = 0;
                this.init();
                this.$refs.casetable.clearSelection();
                this.casePauseForm = {
                  files: [],
                };
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    settleImageUpload(command) {
      switch (command) {
        case "鉴定对象图片上传":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && this.selectRows[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行鉴定对象图片上传！");
            return;
          }
          if (flag) {
            this.authenticatedTargetDialog = true;
            this.$get(
              api.caCase + "/authenticated/" + this.selectRows[0].id
            ).then((res) => {
              let pc = res.data.professionCategory;
              this.authenticatedPersonData = res.data.authenticatedPersonList;
              this.authenticatedVehicleData = res.data.authenticatedVehicleList;
              this.authenticatedOtherData = res.data.authenticatedOtherList;
              this.poSampleData = res.data.poSampleList;
              this.dnaSampleData = res.data.dnaSampleList;
              this.caSampleData = res.data.caSampleList;
              if (pc.type.value == "DNA") {
                this.authObjectType = "dna";
              } else if (pc.type.value == "POISON") {
                this.authObjectType = "po";
              } else if (
                pc.type.value == "DOCUMENT" ||
                pc.type.value == "TRACE_EVIDENCE" ||
                pc.type.value == "ELECTRONIC" ||
                pc.type.value == "ACOUSTIC_IMAGE"
              ) {
                this.authObjectType = pc.type.value;
              } else {
                this.authObjectType = "other";
              }
            });
          }
          break;
        case "鉴定材料图片上传":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag && this.selectRows[0].flowStatus.statusOfInt >= 5) {
            this.$message.error("该案件已签发，不能进行鉴定材料图片上传！");
            return;
          }
          if (flag) {
            this.authenticatedMaterialDialog = true;
            this.$get(api.inspectMaterial, {
              caseId: this.selectRows[0].id,
              materialStatus: "NORMAL",
            }).then((res) => {
              this.authenticatedMaterialData =
                res.data.inspectionMaterialListNormal;
            });
          }
          break;
        case "补资料":
          this.fillMaterial();
          break;
      }
    },
    authMaterialImageUpload() {
      this.authenticatedMaterialDialog = false;
      let imgPromise = [];
      if (this.authenticatedMaterialData) {
        this.authenticatedMaterialData.forEach((item) => {
          if (item.images && item.images.length !== 0) {
            item.images.forEach((image) => {
              if (image.raw) {
                let p = new Promise((resolve) => {
                  let file = image.raw;
                  let filetype = file.type.substring(
                    file.type.lastIndexOf("/") + 1,
                    file.type.length
                  );
                  lrz(file, {
                    width: 1280,
                  }).then(function (rst) {
                    image.image = rst.base64;
                    image.imageType = filetype;
                    image.url = null;
                    resolve();
                  });
                });
                imgPromise.push(p);
              }
            });
          }
        });
      }
      Promise.all(imgPromise)
        .then(() => {
          this.$put(
            api.inspectMaterial + "/upload-images",
            this.authenticatedMaterialData
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                // this.selectRows = [];
                this.$refs.casetable.clearSelection();
              }
            })
            .catch((err) => {
              this.$message({
                message: "保存失败",
                type: "error",
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fileYs(fileArr) {
      return new Promise((resolve1, reject1) => {
        let arrPromise = [];
        fileArr.forEach((v, i) => {
          let name = v.raw.name.split(".")[0];
          let type = v.raw.name.split(".").reverse()[0];
          let p = new Promise((resolve, reject) => {
            if (v.raw.type && v.raw.type.split("/")[0] == "image") {
              //判断是不是图片
              this.$compressImages([v]).then((response) => {
                resolve({
                  base64Str: response[0].image,
                  name: name,
                  url: "",
                  fileType: type,
                });
              });
            } else {
              this.$getBase64(v.raw).then((response) => {
                resolve({
                  base64Str: response,
                  name: name,
                  url: "",
                  fileType: type,
                });
              });
            }
          });
          arrPromise.push(p);
        });
        Promise.all(arrPromise).then((res) => {
          resolve1(res);
        });
      });
    },
    handleImages(list, imgPromise) {
      if (list) {
        list.forEach((item) => {
          if (item.images) {
            item.images.forEach((image) => {
              if (image.raw) {
                let p = new Promise((resolve) => {
                  let file = image.raw;
                  let filetype = file.type.substring(
                    file.type.lastIndexOf("/") + 1,
                    file.type.length
                  );
                  lrz(file, {
                    width: 1280,
                  }).then((rst) => {
                    image.image = rst.base64;
                    image.imageType = filetype;
                    image.url = null;
                    resolve();
                  });
                });
                imgPromise.push(p);
              }
            });
          }
        });
      }
      return {
        list: list,
        imgPromise: imgPromise,
      };
    },
    authObjectImageUpload() {
      this.authenticatedTargetDialog = false;
      var imgPromise = [];
      let temp = {
        list: [],
        imgPromise: [],
      };
      temp = this.handleImages(this.authenticatedPersonData, imgPromise);
      imgPromise = temp.imgPromise;
      this.authenticatedPersonData = temp.list;
      temp = this.handleImages(this.authenticatedVehicleData, imgPromise);
      imgPromise = temp.imgPromise;
      this.authenticatedVehicleData = temp.list;
      temp = this.handleImages(this.authenticatedOtherData, imgPromise);
      imgPromise = temp.imgPromise;
      this.authenticatedOtherData = temp.list;
      temp = this.handleImages(this.poSampleData, imgPromise);
      imgPromise = temp.imgPromise;
      this.poSampleData = temp.list;
      temp = this.handleImages(this.dnaSampleData, imgPromise);
      imgPromise = temp.imgPromise;
      this.dnaSampleData = temp.list;
      temp = this.handleImages(this.caSampleData, imgPromise);
      imgPromise = temp.imgPromise;
      this.caSampleData = temp.list;
      Promise.all(imgPromise).then(() => {
        this.$put(api.caCase + "/authenticated-images", {
          id: this.selectRows[0].id,
          authenticatedVehicleList: this.authenticatedVehicleData,
          authenticatedPersonList: this.authenticatedPersonData,
          authenticatedOtherList: this.authenticatedOtherData,
          poSampleList: this.poSampleData,
          dnaSampleList: this.dnaSampleData,
          caSampleList: this.caSampleData,
        })
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              // this.selectRows = [];
              this.$refs.casetable.clearSelection();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    exportFun(command) {
      switch (command) {
        case "导出案件列表":
          this.exportCaseListDialog = true;
          this.caseListHeaders = [];
          this.$get(api.caCase + "/case-headers").then((res) => {
            this.allOptions = res.data;
            let caseListHeaders = res.data;
            let itemCnt = Math.floor(caseListHeaders.length / 4.0);
            for (let i = 0; i < itemCnt; i++) {
              let startIndex = i * 4;
              this.caseListHeaders.push({
                first: caseListHeaders[startIndex],
                second: caseListHeaders[startIndex + 1],
                third: caseListHeaders[startIndex + 2],
                forth: caseListHeaders[startIndex + 3],
              });
            }
            if (caseListHeaders.length % 4 !== 0) {
              let left = caseListHeaders.length % 4;
              let startIndex = itemCnt * 4 - 1;
              switch (left) {
                case 1:
                  this.caseListHeaders.push({
                    first: caseListHeaders[startIndex + 1],
                  });
                  break;
                case 2:
                  this.caseListHeaders.push({
                    first: caseListHeaders[startIndex + 1],
                    second: caseListHeaders[startIndex + 2],
                  });
                  break;
                case 3:
                  this.caseListHeaders.push({
                    first: caseListHeaders[startIndex + 3],
                    second: caseListHeaders[startIndex + 1],
                    third: caseListHeaders[startIndex + 2],
                  });
                  break;
              }
            }
          });
          break;
        case "导出报告":
          var caseList = [].concat(this.selectRows);
          var caseIds = "";
          var exportBl = false;
          for (let i = 0; i < caseList.length; i++) {
            caseIds = caseIds + "," + caseList[i].id;
            if (caseList[i].flowStatus.statusOfInt < 5) {
              exportBl = true;
            }
          }
          if (exportBl) {
            this.$message.error("所选案件中有未签发的案件，不需要导出报告！");
            return;
          } else {
            var data = {
              caseIds: caseIds,
            };
            this.$postFormData2(api.caCase + "/export-word", data, {})
              .then((res) => {
                const blob = new Blob([res.data], {
                  type: "application/zip",
                });
                const href = window.URL.createObjectURL(blob);
                const downloadElement = document.createElement("a");
                downloadElement.href = href;
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
              })
              .catch((err) => {
                //将返回的blob转换为json
                const reader = new FileReader();
                reader.readAsText(err, "utf-8");
                reader.onload = function () {
                  const readerres = reader.result;
                  const parseObj = JSON.parse(readerres);
                };
                if (parseObj.errCode == "message.130020") {
                  this.$message.error(parseObj.errMsg);
                } else {
                  console.log(err);
                }
              });
          }
          break;
        case "导出封面":
          var caseList = [].concat(this.selectRows);
          var caseIds = "";
          for (let i = 0; i < caseList.length; i++) {
            caseIds = caseIds + "," + caseList[i].id;
            if (!caseList[i].qrCodeCoverUrl) {
              this.$message.error(`${caseList[i].caseNo}无赋码封面！`);
              return;
            }
          }
          var data = {
            caseIds: caseIds,
          };
          this.$postFormData2(api.caCase + "/export-pdf", data, {})
            .then((res) => {
              const blob = new Blob([res.data], {
                type: "application/zip",
              });
              const href = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = href;
              // a.download = `${caseList[0].caseNo}.zip`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(href);
            })
            .catch((err) => {
              //将返回的blob转换为json
              const reader = new FileReader();
              reader.readAsText(err, "utf-8");
              reader.onload = function () {
                const readerres = reader.result;
                const parseObj = JSON.parse(readerres);
                this.$message.error(parseObj.errMsg);
              };
            });
          break;
      }
    },
    costFun(command) {
      switch (command) {
        case "费用异动":
          if (this.selectRows != null && this.selectRows.length != 0) {
            //判断是否有案件正在申请中
            let caseIds = "";
            for (var i = 0; i < this.selectRows.length; i++) {
              var item = this.selectRows[i];
              if (
                item.flowStatus.statusOfInt < 5 &&
                item.financeInfo.amountReceived.cent == 0 &&
                item.billingStatus == "0"
              ) {
                this.$message.error(
                  "案件" +
                    item.caseNo +
                    "未签发未收费,且未开票，不能申请费用异动!"
                );
                return;
              }
              caseIds = caseIds + item.id + ",";
            }
            this.$get(api.checkCaseChange, {
              caseIds: caseIds.substring(0, caseIds.length - 1),
            }).then((res) => {
              if (!res.data || res.data.length == 0) {
                this.costChangeDialog = true;
                this.costChangeData = [].concat(this.selectRows);
                //初始化案件收费项目的的值
                this.tempCostChargeData = this.costChangeData.map((item) => {
                  return {
                    caseId: item.id,
                    tempChargeItemData: [],
                  };
                });
              } else {
                if (this.selectRows.length == 1) {
                  this.$message({
                    message: res.data.replace("!", ",") + "请重新选择!",
                    type: "error",
                  });
                } else {
                  this.$message({
                    message: "有正在申请" + res.data + "的案件，请重新选择！",
                    type: "error",
                  });
                }
              }
            });
          } else {
            this.$message({
              message: "请选择案件",
              type: "warning",
            });
          }
          break;
        case "费用减免":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            this.$get(api.checkCaseChange, {
              caseIds: this.selectRows[0].id,
            }).then((res) => {
              if (!res.data || res.data.length == 0) {
                this.caseChargeDeductionData.receivable = this.selectRows[0]
                  .financeInfo
                  ? this.selectRows[0].financeInfo.notReceived.yuanFmt
                  : null;
                this.$get(
                  api.caCase + "/entrust-info/" + this.selectRows[0].id
                ).then((res) => {
                  this.detailMsg = res.data;
                  var name = "";
                  if (res.data.labStaff) {
                    var labStaffArr = res.data.labStaff;
                    labStaffArr.forEach((v, i) => {
                      name = name + v.participant.hrStaff.name + ",";
                    });
                    name = name.substr(0, name.length - 1);
                  }
                  this.detailMsg.labStaffName = name;
                });
                this.$get(api.caseChargeFlow + "/get", {
                  caseId: this.selectRows[0].id,
                })
                  .then((res) => {
                    this.caseChargeDeductionData = res.data;
                    this.caseChargeDeductionData.reason = {
                      id: null,
                    };
                    this.caseChargeDeductionData.flowRefundDiscountItemList.forEach(
                      (item) => {
                        item.amount = {
                          value: null,
                        };
                      }
                    );
                    this.caseChargeDeductionDialog = true;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                this.$message({
                  message: res.data.replace("!", ",") + "请重新选择!",
                  type: "error",
                });
              }
            });
          }
          break;
        case "退费": //caseChargeRefundDialog
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            this.$get(api.checkCaseChange, {
              caseIds: this.selectRows[0].id,
            }).then((res) => {
              if (!res.data || res.data.length == 0) {
                var actualReceivable = this.selectRows[0].financeInfo
                  ? this.selectRows[0].financeInfo.actualReceivable.yuanFmt
                  : null;
                if (actualReceivable != 0) {
                  this.caseChargeRefundData.receivable = this.selectRows[0]
                    .financeInfo
                    ? this.selectRows[0].financeInfo.notReceived.yuanFmt
                    : null;
                  this.$get(
                    api.caCase + "/entrust-info/" + this.selectRows[0].id
                  ).then((res) => {
                    this.detailMsg = res.data;
                    var name = "";
                    if (res.data.labStaff) {
                      var labStaffArr = res.data.labStaff;
                      labStaffArr.forEach((v, i) => {
                        name = name + v.participant.hrStaff.name + ",";
                      });
                      name = name.substr(0, name.length - 1);
                    }
                    this.detailMsg.labStaffName = name;
                  });
                  this.$get(api.caseChargeFlow + "/get", {
                    caseId: this.selectRows[0].id,
                  })
                    .then((res) => {
                      this.caseChargeRefundData = res.data;
                      this.caseChargeRefundData.reason = {
                        id: null,
                      };
                      this.caseChargeRefundData.flowRefundDiscountItemList.forEach(
                        (item) => {
                          item.amount = {
                            value: null,
                          };
                        }
                      );
                      this.caseChargeRefundDialog = true;
                    })
                    .catch((res) => {
                      console.log(res);
                    });
                } else {
                  this.$message({
                    message: "案件实收金额为0,不能申请退费",
                    type: "error",
                  });
                }
              } else {
                this.$message({
                  message: res.data.replace("!", ",") + "请重新选择!",
                  type: "error",
                });
              }
            });
          }
          break;
        case "费用编辑":
          var flag = this.judgeCaseLength(this.selectRows);
          if (flag) {
            var item = this.selectRows[0];
            if (
              item.giveInfo &&
              item.giveInfo.giveDate &&
              item.flowStatus.statusOfInt > 5
            ) {
              this.$message.error(
                "案件" + item.caseNo + "已发放，不能进行费用编辑!"
              );
              return;
            }
            if (item.chargeStatus != "0") {
              this.$message.error(
                "案件" + item.caseNo + "已收费，不能进行费用编辑!"
              );
              return;
            }
            if (item.billingStatus != "0") {
              this.$message.error(
                "案件" + item.caseNo + "已开票，不能进行费用编辑!"
              );
              return;
            }
            this.$get(api.checkCaseChange, {
              caseIds: item.id,
            }).then((res) => {
              if (!res.data || res.data.length == 0) {
                this.$get(api.checkCaseInvoiceApply, {
                  caseIds: item.id,
                }).then((res) => {
                  if (!res.data || res.data.length == 0) {
                    this.caseChargeItemEditDialog = true;
                    this.$get(
                      "/api/ca-charging-item/v1/ca-charging-items?caseId=" +
                        this.selectRows[0].id
                    ).then((res) => {
                      if (res.data) {
                        item.tempChargeItemData = res.data;
                        item.tempChargeItemData.forEach((value) => {
                          value.unitPrice.value = (
                            value.unitPrice.cent / 100
                          ).toString();
                        });
                        this.caseChargeItemEditForm.caseId = item.id;
                        this.caseChargeItemEditForm.caseChargeItemData =
                          JSON.parse(JSON.stringify(item.tempChargeItemData));
                        this.caseChargeItemEditForm.professionCategory =
                          item.professionCategory;
                      }
                    });
                  } else {
                    this.$message({
                      message: "该案件在开票申请中,请重新选择！",
                      type: "error",
                    });
                  }
                });
              } else {
                if (this.selectRows.length == 1) {
                  this.$message({
                    message: res.data.replace("!", ",") + "请重新选择!",
                    type: "error",
                  });
                } else {
                  this.$message({
                    message: "该案件正在申请" + res.data + "，请重新选择！",
                    type: "error",
                  });
                }
              }
            });
          }
          break;
      }
    },
    saveCaseChargeRefundForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let amountFlag = false;
          for (let index in this.caseChargeRefundData
            .flowRefundDiscountItemList) {
            let item =
              this.caseChargeRefundData.flowRefundDiscountItemList[index];
            if (
              Number(item.amount.value).toFixed(2) >
              Number(item.fiCaseChargeSumByItem.actualReceivable.cent) / 100
            ) {
              amountFlag = true;
              break;
            }
          }
          if (amountFlag) {
            this.$message({
              message: "退费金额不能大于实收金额！",
              type: "error",
            });
          } else {
            let formData = JSON.parse(
              JSON.stringify(this.caseChargeRefundData)
            );
            formData.caseDto = {
              id: this.selectRows[0].id,
            };
            formData.changeType = "REFUND";
            formData.flowRefundDiscountItemList.forEach((item) => {
              delete item.id;
              item.chargingItem = item.fiCaseChargeSumByItem.chargingItem;
              item.amount.cent = parseFloat(item.amount.value * 100).toFixed(0);
            });
            if (formData.reason.label == "其他") {
              formData.reason = this.caseChargeRefundData.otherReason;
            } else {
              formData.reason = formData.reason.label;
            }
            this.$post(api.caseChargeFlow + "/apply", formData)
              .then((res) => {
                if (res.status === 200) {
                  this.$message({
                    message: "申请成功",
                    type: "success",
                  });
                  this.caseChargeRefundDialog = false;
                }
              })
              .catch((err) => {
                this.$message({
                  message: "失败",
                  type: "error",
                });
              });
          }
        }
      });
    },
    saveCaseChargeDeductionForm(form) {
      this.isDisabled = true;
      let _this = this;
      setTimeout(() => {
        _this.isDisabled = false;
      }, 3000);
      _this.$refs[form].validate((valid) => {
        if (valid) {
          let amountFlag = false;
          for (let index in _this.caseChargeDeductionData
            .flowRefundDiscountItemList) {
            let item =
              _this.caseChargeDeductionData.flowRefundDiscountItemList[index];
            if (
              Number(item.amount.value).toFixed(2) >
              Number(item.fiCaseChargeSumByItem.notReceived.cent) / 100
            ) {
              amountFlag = true;
              break;
            }
          }
          if (amountFlag) {
            _this.$message({
              message: "减免金额不能大于收费项目金额！",
              type: "error",
            });
          } else {
            let formData = JSON.parse(
              JSON.stringify(_this.caseChargeDeductionData)
            );
            formData.caseDto = {
              id: _this.selectRows[0].id,
            };
            formData.changeType = "DISCOUNT";
            formData.flowRefundDiscountItemList.forEach((item) => {
              delete item.id;
              item.chargingItem = item.fiCaseChargeSumByItem.chargingItem;
              item.amount.cent = parseFloat(item.amount.value * 100).toFixed(0);
            });
            formData.reason = formData.reason.label;
            _this
              .$post(api.caseChargeFlow + "/apply", formData)
              .then((res) => {
                if (res.status === 200) {
                  _this.$message({
                    message: "申请成功",
                    type: "success",
                  });
                  _this.caseChargeDeductionDialog = false;
                }
              })
              .catch((err) => {
                _this.$message({
                  message: "失败",
                  type: "error",
                });
              });
          }
        }
      });
    },
    //导出案件列表
    exportCaseList() {
      let itemStr = "";
      if (this.checkedList && this.checkedList.length !== 0) {
        this.checkedList.forEach((item) => {
          itemStr += item;
          itemStr += ",";
        });
        itemStr = itemStr.substring(0, itemStr.length - 1);
      }
      var exportExcelSearchData = null;
      var idList = "";
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList = idList + data.id + ",";
        }

        exportExcelSearchData = {
          idList: idList,
        };
      } else {
        exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      }
      exportExcelSearchData.requiredItem = itemStr;
      this.$axios
        .get(api.caCase + "/export-excel", {
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
          link.setAttribute("download", "案件列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
          this.exportCaseListDialog = false;
        })
        .catch((err) => console.log(err));
    },
    //判断修改按钮是否点击
    judgeIsClick(id) {
      return this.tempCostChargeData.some((item) => {
        return (
          item.caseId == id &&
          (item.tempChargeItemData == null ||
            item.tempChargeItemData.length == 0)
        );
      });
    },
    //删除此行已选择的案件
    delCurRow(row) {
      this.costChangeData.splice(
        this.costChangeData.findIndex((item) => item === row),
        1
      );
      this.tempCostChargeData.splice(
        this.tempCostChargeData.findIndex((item) => item.caseId === row.id),
        1
      );
    },
    /**
             * 查看案件的收费项目信息，第一次点击修改的话，需要从后台获取数据，如果前台数据为空，再次从后台获取，用临时变量保存
             修改后的数据，再次点击时取此临时值
             */
    openCaseChargeItemsDialog(row) {
      this.chargeItemCaseId = row.id;
      this.caseChargeItemDialog = true;
      if (row.billingStatus == "1") {
        this.isInvoice = true;
      } else {
        this.isInvoice = false;
      }
      this.caseChargeItemForm.caseChargeItemData = [];
      let flag = false;
      for (let index in this.tempCostChargeData) {
        if (this.tempCostChargeData[index].caseId == row.id) {
          if (
            this.tempCostChargeData[index].tempChargeItemData &&
            this.tempCostChargeData[index].tempChargeItemData.length !== 0
          ) {
            this.caseChargeItemForm.caseChargeItemData = JSON.parse(
              JSON.stringify(this.tempCostChargeData[index].tempChargeItemData)
            );
            this.caseChargeItemForm.reason = JSON.parse(
              JSON.stringify(this.tempCostChargeData[index].reason)
            );
            this.caseChargeItemForm.professionCategory = JSON.parse(
              JSON.stringify(this.tempCostChargeData[index].professionCategory)
            );
            flag = true;
          }
          break;
        }
      }
      if (!flag) {
        this.$get(
          "/api/ca-charging-item/v1/ca-charging-items?caseId=" + row.id
        ).then((res) => {
          this.tempCostChargeData.forEach((item) => {
            if (item.caseId == row.id) {
              if (res.data) {
                item.tempChargeItemData = res.data;
                item.reason = {};
                item.professionCategory = row.professionCategory;
                item.tempChargeItemData.forEach((value) => {
                  if (
                    value.fiCaseChargeItemList &&
                    value.fiCaseChargeItemList.length > 0
                  ) {
                    value.notEdit = true;
                  }
                  value.unitPrice.value = value.unitPrice.cent / 100;
                });
                this.caseChargeItemForm.caseChargeItemData = JSON.parse(
                  JSON.stringify(item.tempChargeItemData)
                );
                this.caseChargeItemForm.professionCategory =
                  row.professionCategory;
              }
            }
          });
        });
      }
      if (this.$refs["caseChargeItemForm"]) {
        this.$refs["caseChargeItemForm"].clearValidate();
      }
    },
    handleSelectionChange(val) {
      this.chargeItemSelect = [].concat(val);
    },

    importMaterialChange(val) {
      this.importMaterialSelect = [].concat(val);
    },
    //保存导入材料状态
    importMaterial: function () {
      let data = [];
      let caseId = null;
      for (let item of this.importMaterialSelect) {
        if (!caseId) {
          caseId = item.caseId;
        }
        data.push({
          id: item.id,
          isReturn: 1,
        });
      }
      this.$post(api.inspectMaterial + "/isImport", data)
        .then((res) => {
          if (res.data) {
            this.$message({
              message: "导入成功！",
              type: "success",
            });
            this.materialReturnDialog = false;
            this.queryReturnMaterial(caseId);
          }
        })
        .catch((err) => {
          this.$message({
            message: "导入失败！",
            type: "error",
          });
        });
    },
    //查询已导入材料
    queryReturnMaterial: function (caseId) {
      this.$get(api.searchInspectMaterial + "/" + caseId)
        .then((res) => {
          var data = JSON.parse(JSON.stringify(res.data));
          this.returnCaInspectionMaterials = data.inspectionMaterial;
        })
        .catch((err) => {});
    },
    //确认已选中的收费项目
    confirmChargeItems() {
      this.chargeItemDialog = false;
      this.caseChargeItemDialog = true;
      let temp = this.caseChargeItemForm.caseChargeItemData;
      this.chargeItemSelect.forEach((item) => {
        let isExist = false;
        isExist = temp.some((cci) => {
          if (cci.chargingItem.id == item.id) {
            cci.quantity = Number(cci.quantity) + 1;
            return true;
          }
        });
        if (!isExist) {
          this.caseChargeItemForm.caseChargeItemData.push({
            chargingItem: item,
            unitPrice: {
              yuanFmt: item.price.yuanFmt,
              cent: item.price.cent,
              value: item.price.cent / 100,
            },
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
            quantity: "1",
            notInvoice: true,
          });
        }
      });
    },
    //确认已选中的收费项目
    confirmChargeItems1() {
      this.chargeItemEditDialog = false;
      this.caseChargeItemEditDialog = true;
      let temp = this.caseChargeItemEditForm.caseChargeItemData;
      this.chargeItemSelect.forEach((item) => {
        let isExist = false;
        isExist = temp.some((cci) => {
          if (cci.chargingItem.id == item.id) {
            cci.quantity = Number(cci.quantity) + 1;
            return true;
          }
        });
        if (!isExist) {
          this.caseChargeItemEditForm.caseChargeItemData.push({
            chargingItem: item,
            unitPrice: {
              yuanFmt: item.price.yuanFmt,
              cent: item.price.cent,
              value: item.price.cent / 100,
            },
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
            quantity: "1",
          });
        }
      });
    },
    //增加收费项目
    addChargeItem() {
      this.chargeItemDialog = true;
      this.chargeItemCondition = {
        professionCategoryId: this.caseChargeItemForm.professionCategory.id,
      };
    },
    //增加收费项目
    addChargeItem1() {
      this.chargeItemEditDialog = true;
      this.chargeItemCondition = {
        professionCategoryId: this.caseChargeItemEditForm.professionCategory.id,
      };
    },
    //删除收费项目
    delChargeItem(chargeItemId) {
      this.caseChargeItemForm.caseChargeItemData.splice(
        this.caseChargeItemForm.caseChargeItemData.findIndex(
          (item) => item.chargingItem.id == chargeItemId
        ),
        1
      );
    },
    delChargeItem1(chargeItemId) {
      this.caseChargeItemEditForm.caseChargeItemData.splice(
        this.caseChargeItemEditForm.caseChargeItemData.findIndex(
          (item) => item.chargingItem.id == chargeItemId
        ),
        1
      );
    },
    cancelChargeItems() {
      this.caseChargeItemDialog = false;
      this.$refs["caseChargeItemForm"].resetFields();
    },
    //保存收费项目，不允许没有一条收费项目，提示导入
    saveChargeItems(form) {
      if (!Object.keys(this.caseChargeItemForm.reason).length) {
        this.caseChargeItemForm.reason = null;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (
            this.caseChargeItemForm.caseChargeItemData == null ||
            this.caseChargeItemForm.caseChargeItemData.length == 0
          ) {
            this.$message({
              message: "请导入一项收费项目",
              type: "error",
            });
          } else {
            this.expenseChange = true;
            this.caseChargeItemDialog = false;
            this.tempCostChargeData.forEach((item) => {
              if (item.caseId == this.chargeItemCaseId) {
                item.tempChargeItemData =
                  this.caseChargeItemForm.caseChargeItemData;
                item.reason = this.caseChargeItemForm.reason;
              }
            });
          }
        }
      });
    },
    confirmChargeEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (
            this.caseChargeItemEditForm.caseChargeItemData == null ||
            this.caseChargeItemEditForm.caseChargeItemData.length == 0
          ) {
            this.$message({
              message: "请导入一项收费项目",
              type: "error",
            });
          } else {
            this.caseChargeItemEditForm.caseChargeItemData.forEach((item) => {
              item.unitPrice.cent = item.unitPrice.value * 100;
              item.unitPrice.yuanFmt = item.unitPrice.value.toString();
            });
            var data = {
              chargingItemList: this.caseChargeItemEditForm.caseChargeItemData,
              id: this.caseChargeItemEditForm.caseId,
            };
            this.$post(api.caseCharge + "/edit", data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.caseChargeItemEditDialog = false;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    },
    //保存最终费用异动后的数据
    confirmCostChange() {
      this.isDisabled = true;
      var _this = this;
      setTimeout(() => {
        _this.isDisabled = false;
      }, 2000);
      if (
        _this.tempCostChargeData.some(
          (item) =>
            item.tempChargeItemData == null ||
            item.tempChargeItemData.length == 0
        )
      ) {
        _this.$message({
          message: "请修改案件的费用异动信息",
          type: "error",
        });
      } else {
        if (!this.expenseChange) {
          this.$message({
            message: "请增加或修改收费项目!",
            type: "error",
          });
          return;
        }
        this.$confirm("是否进行费用异动?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let finalData = _this.tempCostChargeData.map((item) => {
              _this.amountChangeDetailListAfter = [];
              let data = {};
              data.caseDto = {
                id: item.caseId,
              };
              data.reason = item.reason.label;
              item.tempChargeItemData.forEach((it) => {
                _this.amountChangeDetailListAfter.push({
                  unitPrice: {
                    cent: Number(
                      BigDecimalUtils.times(it.unitPrice.value, 100)
                    ),
                  },
                  quantity: it.quantity,
                  chargingItem: {
                    id: it.chargingItem.id,
                  },
                });
              });
              data.amountChangeDetailListAfter =
                _this.amountChangeDetailListAfter;
              return data;
            });
            _this
              .$post(api.caseChangeAmountApply, finalData)
              .then((res) => {
                if (res.status == 200) {
                  _this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  _this.costChangeDialog = false;
                }
              })
              .catch((err) => {
                console.log(err);
                if (err) {
                  _this.$message.error(err.errMsg);
                }
              });
          })
          .catch(() => {});
      }
    },
    printBarCode: function (command) {
      switch (command) {
        case "打印报告":
          this.reportPrint();
          break;
        case "打印表单":
          this.listFormFile();
          break;
        case "打印封面":
          var caseList = [].concat(this.selectRows);
          if (!caseList[0].qrCodeCoverUrl) {
            this.$message.error("该案件没有赋码封面！");
            return;
          }
          if (caseList.length < 1) {
            this.$message.error("请选择案件！");
          } else if (caseList.length > 1) {
            this.$message.error("只能选择一个案件进行封面打印！");
          } else {
            window.open(caseList[0].qrCodeCoverUrl);
          }
          break;
      }
      if (
        command == "打印报告" ||
        command == "打印表单" ||
        command == "打印封面"
      )
        return;
      if (this.selectRows && this.selectRows.length != 0) {
        if (this.selectRows.length != 1) {
          this.$message.error("只能选择一个案件进行条码打印！");
          return;
        }
        window.open(
          store.state.barcode.barcodeBaseUrl +
            "?barCodeType=" +
            command +
            "&caseId=" +
            this.selectRows[0].id,
          "_blank"
        );
      } else {
        this.$message.error("请选择案件");
      }
    },
    importMaterialClick: function () {
      this.materialReturnDialog = true;
    },
    judgeRepetitionAuth(data) {
      for (let i = 0; i < data.length; i++) {
        var repetitionTime = 0;
        var authId = data[i];
        for (let j = 0; j < data.length; j++) {
          if (authId == data[j]) {
            repetitionTime++;
          }
        }
        if (repetitionTime >= 2) {
          return true;
        }
      }
    },
    backNoReturnStatus: function (index, row) {
      let data = {
        id: row.id,
        isReturn: 0,
      };
      this.$post(api.updateNoBackinspectMaterial, data)
        .then((res) => {
          if (res.data) {
            this.$message({
              message: "删除成功！",
              type: "success",
            });
            this.materialReturnDialog = false;
            this.queryReturnMaterial(row.caseId);
          }
        })
        .catch((err) => {
          this.$message({
            message: "删除失败！",
            type: "error",
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
      } else if (prop == "archiveDate") {
        this.tablesort.prop = "ca.archive_date";
      } else if (prop == "createDate") {
        this.tablesort.prop = "cc.create_date";
      }
    },
    makeInvoiceApplyForm() {
      var caseList = [].concat(this.selectRows);
      if (caseList.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
        return;
      }
      var noAmountCase = ""; //待开金额为0的案件
      var caseIds = "";
      caseList.forEach((v, i) => {
        if (
          v.financeInfo.amountReceivable.cent -
            v.financeInfo.invoiceAmount.cent <=
          0
        ) {
          noAmountCase = noAmountCase + v.caseNo + "、";
        }
        caseIds = caseIds + v.id + ",";
      });
      if (noAmountCase) {
        this.$message.error(
          "案件" +
            noAmountCase.substr(0, noAmountCase.length - 1) +
            "待开金额为0!"
        );
        return;
      }
      this.$get(api.checkCaseInvoiceApply, {
        caseIds: caseIds,
      }).then((res) => {
        if (!res.data || res.data.length == 0) {
          this.$router.push({
            path: "/case/make-invoice-apply",
            query: {
              caseIds: caseIds,
              activeShow: "T",
              lastFlow: "F",
            },
          });
        } else {
          this.$message({
            message: "案件正在进行申请开票,不能再申请开票",
            type: "error",
          });
        }
      });
    },
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
    beforeunloadHandler(e) {
      e = e || window.event;
      if (e) {
        window.sessionStorage.removeItem("caseListSearchData");
      }
      return;
    },
  },

  created: function () {
    this.$store.dispatch("login/headerTitleChange", "案件列表");
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
    if (sessionStorage.getItem("caseListSearchData")) {
      this.searchdata = JSON.parse(
        sessionStorage.getItem("caseListSearchData")
      );
      this.searchForm = this.searchdata;
    }
    this.$get(api.enum + "/ca.GiveType")
      .then((res) => {
        if (res.status == 200) {
          this.giveOpt = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.$get(api.chargingType).then((res) => {
      this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
    });
    this.$get(api.poisonCategory)
      .then((res) => {
        this.poisonCategoryOpt = res.data;
      })
      .catch((err) => console.log(err));
    //查询用户专业
    this.$get(api.profession + "/nowUser")
      .then((res) => {
        this.categoryOfNowUser = res.data;
      })
      .catch((err) => console.log(err));
  },
  mounted() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    let watcher = this.$watch(
      "tableData",
      () => {
        let oBox = document.querySelector(".el-table__fixed-body-wrapper");
        let fixedBox = document.querySelector(".el-table__fixed");
        oBox.style.maxHeight = parseInt(oBox.style.maxHeight) - 10 + "px";
        fixedBox.style.bottom = "0px";
        fixedBox.style.height = `${fixedBox.clientHeight - 16}px`;
        if (watcher) watcher();
      },
      {
        deep: true,
      }
    );
  },
  watch: {
    /*'searchForm.orgId': function (newVal, oldVal) {
            this.setOrgIdSession();
        },*/
    orgId: function (newVal, oldVal) {
      this.searchForm = {
        entrustingUnit: {},
        authId: null,
        orgId: null,
        authRole: null,
      };
      this.init();
    },
    "searchForm.authId": function (newVal, oldVal) {
      if (!newVal) {
        this.searchForm.authRole = null;
      }
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
    tableData(newVal, oldVal) {
      this.echoSelectData();
    },
    pageSizeChange() {
      /* this.echoSelectData();
            console.log('条数变');*/
    },
    currentChange() {
      /*this.echoSelectData();*/
    },
    otherGiveMaterialsChange() {},
    "caseDto.auth1.participant": function (newVal, oldVal) {
      if (!newVal) {
        // this.caseDto.auth1.participant = null;
      }
    },
    "caseDto.auth1": function (newVal, oldVal) {
      console.log("newVal123", newVal);
      console.log("oldVal", oldVal);
    },
  },
  computed: {
    pageSizeChange() {
      return this.page.pageSize;
    },
    currentChange() {
      return this.page.current;
    },
    otherGiveMaterialsChange() {
      return this.giveOutForm.otherGiveMaterials;
    },
    ...mapState("login", ["headerTitle", "orgId"]),
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
                    vm.searchForm = {
                      orgId: res.data[0].id,
                      authRole: null,
                    };
                    vm.searchdata = {
                      orgId: res.data[0].id,
                    };
                    vm.isNotOrg = true;
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            next((vm) => {
              vm.isNotOrg = false;
            });
          }
        }
      })
      .catch((err) => console.log(err));
    /* 判断如果不是操作返回当前页，清除搜索条件 */
    if (
      from.path != "/case/make-invoice-apply" &&
      from.path != "/case/file-directory" &&
      from.path != "/case/acceptcase/case_supplement" &&
      from.path != "/case/report-change" &&
      from.path != "/case/abort" &&
      from.path != "/main-flow/auth-records" &&
      from.path != "/case/accept/copy" &&
      from.path != "/case/register/copy" &&
      from.path != "/case/acceptcase/edit" &&
      from.path != "/case/register/edit" &&
      from.path != "/case/case-detail"
    ) {
      window.sessionStorage.removeItem("caseListSearchData");
    }
    next();
  },
};
</script>

<style lang="less" scoped>
.table-fixed {
  /deep/ .el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }

  /deep/ .el-table__fixed {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
#case-list .giveout {
  z-index: 9999 !important;
}

#case-list .caseMaterial {
  z-index: 9999 !important;
}

#case-list .consultation {
  z-index: 9999 !important;
}

#case-list .waiting-supply {
  z-index: 9999 !important;
}

/* #case-list /deep/ .el-dialog__wrapper:nth-child(6) .el-dialog {
        z-index: 9999 !important;
    } */

.label {
  color: #606266;
  /*color:#428bca;*/
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  padding-bottom: 16px;
  margin-right: 8px;
  white-space: nowrap;
  display: table-cell;

  &:after {
    content: ":";
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
}

.dotClass {
  margin-top: 10px;
  margin-right: 40px;
}

.detail {
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  padding-bottom: 16px;
  color: #909399;
  display: table-cell;
}

.el-table td {
  padding: 0px 0 !important;

  .cell {
    line-height: 40px;
  }

  .cell span {
    border-right: 1px solid red;
    padding: 10px 7px;
    width: 100px;
    display: inline-block;
  }

  .cell span:last-child {
    border: none;
  }
}

.el-image2 {
  width: 146px;
  height: 146px;
  margin-left: 5px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  color: #606266;
  text-align: center;
  line-height: 146px;
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

body > .el-message-box__wrapper {
  z-index: 9999 !important;
}
</style>
