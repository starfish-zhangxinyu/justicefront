<template>
  <el-row id="moreSearch">
    <!-- 案件相关时间 -->
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginRegisterDate || searchForm.endRegisterDate"
    >
      <el-form-item label="登记日期">
        <DataPicker
          :startValue.sync="searchForm.beginRegisterDate"
          :endValue.sync="searchForm.endRegisterDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginEntrustingDate || searchForm.endEntrustingDate"
    >
      <el-form-item label="委托日期">
        <DataPicker
          :startValue.sync="searchForm.beginEntrustingDate"
          :endValue.sync="searchForm.endEntrustingDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginAcceptDate || searchForm.endAcceptDate"
    >
      <el-form-item label="受理日期">
        <DataPicker
          :startValue.sync="searchForm.beginAcceptDate"
          :endValue.sync="searchForm.endAcceptDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginReportOutDate || searchForm.endReportOutDate"
    >
      <el-form-item label="出案日期">
        <DataPicker
          :startValue.sync="searchForm.beginReportOutDate"
          :endValue.sync="searchForm.endReportOutDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginGiveDate || searchForm.endGiveDate"
    >
      <el-form-item label="发放日期">
        <DataPicker
          :startValue.sync="searchForm.beginGiveDate"
          :endValue.sync="searchForm.endGiveDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginArchiveDate || searchForm.endArchiveDate"
    >
      <el-form-item label="归档日期">
        <DataPicker
          :startValue.sync="searchForm.beginArchiveDate"
          :endValue.sync="searchForm.endArchiveDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginHappenDate || searchForm.endHappenDate"
    >
      <el-form-item label="案发时间">
        <DataPicker
          :startValue.sync="searchForm.beginHappenDate"
          :endValue.sync="searchForm.endHappenDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="
        searchForm.beginAuthenticatedDate || searchForm.endAuthenticatedDate
      "
    >
      <el-form-item label="检验时间">
        <DataPicker
          :startValue.sync="searchForm.beginAuthenticatedDate"
          :endValue.sync="searchForm.endAuthenticatedDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.beginIssuerDate || searchForm.endIssuerDate"
    >
      <el-form-item label="签发日期">
        <DataPicker
          :startValue.sync="searchForm.beginIssuerDate"
          :endValue.sync="searchForm.endIssuerDate"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <!-- 案件基本信息 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.entrustingUnitId">
      <el-form-item label="委托方">
        <select-from-table
          :model.sync="searchForm.entrustingUnitId"
          port="allEntrustingUnit"
          :model-id="true"
          :className="'multiple-select'"
          allow-create
          :clearable="true"
          :filterable="true"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.entrustingUnitTypeId">
      <el-form-item label="委托类型">
        <!-- <select-from-dict
          :model.sync="searchForm.entrustingUnitTypeId"
          data-_type="ex_unit_type"
          :model-id="true"
          :clearable="true"
          :className="'multiple-select'"
        /> -->
        <select-from-dict
          :model.sync="searchForm.entrustingUnitTypeId"
          data_type="ex_unit_type"
          :model-id="true"
          :clearable="true"
          className="multiple-select"
        >
        </select-from-dict>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.contact">
      <el-form-item label="联系人">
        <el-input v-model="searchForm.contact" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.caseTypeId">
      <el-form-item label="案件类型">
        <select-from-dict
          :model.sync="searchForm.caseTypeId"
          :model-id="true"
          :clearable="true"
          data_type="case_type"
          className="multiple-select"
          :filterable="true"
        >
        </select-from-dict>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.acceptStationId">
      <el-form-item label="受理地点">
        <select-from-table
          :model.sync="searchForm.acceptStationId"
          port="acceptStation"
          :model-id="true"
          :className="'multiple-select'"
          :clearable="true"
          :filterable="true"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.historyAuthenticated">
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
    <!-- <el-col :lg="{span:8}" v-show="searchForm.entrustNum">
      <el-form-item label="委托书编号">
        <el-input v-model="searchForm.entrustNum" />
      </el-form-item>
    </el-col>-->
    <el-col :lg="{ span: 8 }" v-show="searchForm.vesselNum">
      <el-form-item label="采血管编号">
        <el-input v-model="searchForm.vesselNum" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.authenticatedItemId">
      <el-form-item label="鉴定项目">
        <!-- <el-input v-model="searchForm.authenticatedItemId" /> -->
        <select-from-table
          :model.sync="searchForm.authenticatedItemId"
          port="entrustingMatter"
          :model-id="true"
          className="multiple-select"
          :clearable="true"
          :filterable="true"
        />
      </el-form-item>
    </el-col>
    <!-- <el-col :lg="{span:8}" v-show="searchForm.submitMaterialPerson">
      <el-form-item label="送检人">
        <el-input v-model="searchForm.submitMaterialPerson" />
      </el-form-item>
    </el-col>-->
    <el-col :lg="{ span: 8 }" v-show="searchForm.entrustingDesc">
      <el-form-item label="基本案情">
        <el-input
          v-model="searchForm.entrustingDesc"
          :autosize="{ minRows: 1, maxRows: 1 }"
          type="textarea"
        />
      </el-form-item>
    </el-col>
    <!-- 案件相关人员 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.authId">
      <el-form-item label="鉴定人">
        <select-qualification
          profession_category="ALL"
          qualification_type="AUTH"
          :filterable="true"
          :className="'multiple-select'"
          :model.sync="searchForm.authId"
          :orgId="searchForm.orgId"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.authRole">
      <el-form-item label="鉴定人角色">
        <el-select
          v-model="searchForm.authRole"
          placeholder="请选择"
          :clearable="true"
          style="width: 100%"
          :disabled="!searchForm.authId"
        >
          <el-option label="第一鉴定人" value="AUTH1" />
          <el-option label="第二鉴定人" value="AUTH2" />
          <el-option label="第三鉴定人" value="AUTH3" />
          <el-option label="第四鉴定人" value="AUTH4" />
          <el-option label="第五鉴定人" value="AUTH5" />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.assistId">
      <el-form-item label="鉴定助理">
        <select-qualification
          profession_category="ALL"
          qualification_type="ASSIST"
          :filterable="true"
          :className="'multiple-select'"
          :model.sync="searchForm.assistId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.reviewerId">
      <el-form-item label="复核人">
        <select-qualification
          profession_category="ALL"
          :filterable="true"
          :className="'multiple-select'"
          qualification_type="REVIEWER"
          :model.sync="searchForm.reviewerId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.authorizedSignatoryId">
      <el-form-item label="授权签字人">
        <select-qualification
          profession_category="ALL"
          :filterable="true"
          :className="'multiple-select'"
          qualification_type="AUTHORIZED_SIGNATORY"
          :model.sync="searchForm.authorizedSignatoryId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.issuerId">
      <el-form-item label="签发人">
        <select-qualification
          profession_category="ALL"
          :filterable="true"
          :className="'multiple-select'"
          qualification_type="ISSUER"
          :model.sync="searchForm.issuerId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.registerId">
      <el-form-item label="登记人">
        <select-from-table
          :model.sync="searchForm.registerId"
          :filterable="true"
          :clearable="true"
          port="register"
          :className="'multiple-select'"
          :orgId="searchForm.orgId"
        />
      </el-form-item>
    </el-col>
    <!-- <el-col :lg="{span:8}" v-show="searchForm.saleId">
      <el-form-item label="市场人员">
        <select-from-table
          :model.sync="searchForm.saleId"
          :filterable="true"
          :clearable="true"
          port="hrStaff"
          :className="'multiple-select'"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{span:8}" v-show="searchForm.labStaffId">
      <el-form-item label="实验人员">
        <select-from-table
          :model.sync="searchForm.labStaffId"
          :filterable="true"
          :clearable="true"
          port="hrStaff"
          :className="'multiple-select'"
        />
      </el-form-item>
    </el-col> -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.saleId">
      <el-form-item label="市场人员">
        <select-qualification
          profession_category="ALL"
          qualification_type="SALES"
          :filterable="true"
          className="multiple-select"
          :model.sync="searchForm.saleId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.labStaffId">
      <el-form-item label="实验人员">
        <select-qualification
          profession_category="ALL"
          qualification_type="LAB_STAFF"
          :filterable="true"
          className="multiple-select"
          :model.sync="searchForm.labStaffId"
          :orgId="searchForm.orgId"
        ></select-qualification>
      </el-form-item>
    </el-col>
    <!-- 案件状态 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.caseStatus">
      <el-form-item label="案件状态" prop="caseStatus">
        <el-select
          v-model="searchForm.caseStatus"
          placeholder="请选择"
          :clearable="true"
          style="width: 100%"
        >
          <el-option label="所有正常阶段案件" value="NORMAL"></el-option>
          <el-option label="所有异常阶段案件" value="ABNORMAL"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col
      :lg="{ span: 8 }"
      v-show="searchForm.caseStatus == 'NORMAL' && searchForm.normalStage"
    >
      <el-form-item label="正常阶段" prop="normalStage">
        <select-from-enum
          :model.sync="searchForm.normalStage"
          :clearable="true"
          type="ca.FlowStatusQuery"
          :className="'multiple-select'"
          :modelVal="true"
        ></select-from-enum>
      </el-form-item>
    </el-col>
    <el-col
      :lg="{ span: 8 }"
      v-show="searchForm.caseStatus == 'ABNORMAL' && searchForm.abnormalStage"
    >
      <el-form-item label="异常阶段" prop="abnormalStage">
        <select-from-enum
          :model.sync="searchForm.abnormalStage"
          :clearable="true"
          type="flow.FlowChangeType"
          class="multiple-select"
          :modelVal="true"
        ></select-from-enum>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.processSituation">
      <el-form-item label="过程情况" prop="processSituation">
        <select-from-enum
          :model.sync="searchForm.processSituation"
          :clearable="true"
          type="flow.FlowCaseStatus"
          :list-type="listType"
          class="multiple-select"
          :modelVal="true"
        ></select-from-enum>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.isReportOut">
      <el-form-item label="是否已出案" prop="isReportOut">
        <el-select
          value
          v-model="searchForm.isReportOut"
          style="width: 100%"
          :clearable="true"
        >
          <el-option value="N" label="未出案"></el-option>
          <el-option value="Y" label="已出案"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.isGiveInfo">
      <el-form-item label="是否已发放" prop="isGiveInfo">
        <el-select
          value
          v-model="searchForm.isGiveInfo"
          style="width: 100%"
          :clearable="true"
        >
          <el-option value="N" label="未发放"></el-option>
          <el-option value="Y" label="已发放"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.isArchive">
      <el-form-item label="是否已归档" prop="isArchive">
        <el-select
          value
          v-model="searchForm.isArchive"
          style="width: 100%"
          :clearable="true"
        >
          <el-option value="N" label="未归档"></el-option>
          <el-option value="Y" label="已归档"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <!-- 收费情况 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.chargeStatus">
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
    <el-col :lg="{ span: 8 }" v-show="searchForm.revenueTypeId">
      <el-form-item label="收入类型" prop="revenueTypeId">
        <select-from-dict
          :model.sync="searchForm.revenueTypeId"
          :clearable="true"
          :model-id="true"
          :className="'multiple-select'"
          data_type="revenue_type"
          :orgId="searchForm.orgId"
        />
      </el-form-item>
    </el-col>

    <el-col :lg="{ span: 8 }" v-show="searchForm.chargingTypeKey">
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
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.chargeSourceId">
      <el-form-item label="来源方式" prop="chargeSourceId">
        <select-from-dict
          data_type="charge_source"
          :model-id="true"
          :clearable="true"
          :model.sync="searchForm.chargeSourceId"
          :className="'multiple-select'"
          :orgId="searchForm.orgId"
        />
      </el-form-item>
    </el-col>
    <el-col
      :lg="{ span: 8 }"
      v-show="searchForm.confirmedDateStart || searchForm.confirmedDateEnd"
    >
      <el-form-item label="收费确认日期">
        <DataPicker
          :startValue.sync="searchForm.confirmedDateStart"
          :endValue.sync="searchForm.confirmedDateEnd"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <!-- 发票情况 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.billingStatus">
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
    <el-col :lg="{ span: 8 }" v-show="searchForm.InvoiceStatus">
      <el-form-item label="发票状态" prop="invoiceStatus">
        <select-from-enum
          :model.sync="searchForm.InvoiceStatus"
          :clearable="true"
          :className="'multiple-select'"
          :modelVal="true"
          type="invoice.InvoiceStatus"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.invoiceTypeId">
      <el-form-item label="发票类型" prop="invoiceType">
        <select-from-dict
          :model.sync="searchForm.invoiceTypeId"
          :model-id="true"
          :className="'multiple-select'"
          data_type="invoice_type"
          :clearable="true"
          :orgId="searchForm.orgId"
        />
      </el-form-item>
    </el-col>

    <el-col :lg="{ span: 8 }" v-show="searchForm.invoiceCode">
      <el-form-item label="发票代码" prop="invoiceCode">
        <el-input v-model="searchForm.invoiceCode" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.invoiceNo">
      <el-form-item label="发票号码" prop="invoiceNo">
        <el-input v-model="searchForm.invoiceNo" />
      </el-form-item>
    </el-col>
    <el-col
      :lg="{ span: 8 }"
      v-show="searchForm.makeOutDateStart || searchForm.makeOutDateEnd"
    >
      <el-form-item label="开票日期">
        <DataPicker
          :startValue.sync="searchForm.makeOutDateStart"
          :endValue.sync="searchForm.makeOutDateEnd"
          valueFormat="yyyy/MM/dd HH:mm:ss"
        />
      </el-form-item>
    </el-col>
    <!-- 鉴定意见 -->
    <el-col :lg="{ span: 8 }" v-show="searchForm.finalResult">
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
    <el-col :lg="{ span: 8 }" v-show="searchForm.mutation">
      <el-form-item label="基因突变">
        <el-select
          v-model="searchForm.mutation"
          :clearable="true"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option value="Y" label="存在" />
          <el-option value="N" label="不存在" />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.ethanolTestResults">
      <el-form-item label="乙醇检测结果">
        <el-input v-model="searchForm.ethanolTestResults" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.poisonType">
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
    <el-col :lg="{ span: 8 }" v-show="searchForm.poisonName">
      <el-form-item label="毒物毒品名称">
        <select-from-table
          :model.sync="searchForm.poisonName"
          port="poison"
          :modelId="true"
          :className="'w100'"
          :clearable="true"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.qualitativeResult">
      <el-form-item label="定性结果">
        <el-select
          v-model="searchForm.qualitativeResult"
          :clearable="true"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option value="NEGATIVE" label="阴性" />
          <el-option value="POSITIVE" label="阳性" />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.quantitativeResult">
      <el-form-item label="定量结果">
        <el-input v-model="searchForm.quantitativeResult" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.clinicalSuggest">
      <el-form-item label="法医临床鉴定意见">
        <el-input v-model="searchForm.clinicalSuggest" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.disabilityLevelId">
      <el-form-item label="伤残鉴定级别">
        <select-from-dict
          :model.sync="searchForm.disabilityLevelId"
          :clearable="true"
          data_type="disability_level"
          :className="'w100'"
          :model-id="true"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.damageDegreeId">
      <el-form-item label="损伤程度">
        <select-from-dict
          :model.sync="searchForm.damageDegreeId"
          :clearable="true"
          :className="'w100'"
          data_type="damage_degree"
          :model-id="true"
        />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.pathologySuggest">
      <el-form-item label="法医病理鉴定意见">
        <el-input v-model="searchForm.pathologySuggest" />
      </el-form-item>
    </el-col>
    <el-col :lg="{ span: 8 }" v-show="searchForm.vehicleTraceSuggest">
      <el-form-item label="车辆痕迹鉴定意见" prop="vehicleTraceSuggest">
        <el-input v-model="searchForm.vehicleTraceSuggest" />
      </el-form-item>
    </el-col>
    <el-col
      :xl="{ span: 8 }"
      v-show="searchForm.speedMin || searchForm.speedMax"
    >
      <el-form-item label="车速">
        <el-col :span="11">
          <el-form-item class="margin0" prop="speedMin">
            <el-input v-model="searchForm.speedMin" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item class="margin0" prop="speedMax">
            <el-input v-model="searchForm.speedMax" />
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-col>
    <el-col :xl="{ span: 8 }" v-show="searchForm.documentConclusion">
      <el-form-item label="文书鉴定意见">
        <select-from-dict
          :model.sync="searchForm.documentConclusion"
          :clearable="true"
          data_type="document_conclusion"
          :className="'w100'"
          :model-id="true"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="{ span: 8 }" v-show="searchForm.traceConclusion">
      <el-form-item label="痕迹鉴定意见">
        <select-from-dict
          :model.sync="searchForm.traceConclusion"
          :clearable="true"
          data_type="trace_conclusion"
          :className="'w100'"
          :model-id="true"
        />
      </el-form-item>
    </el-col>
    <el-col :xl="{ span: 8 }" v-show="searchForm.audioVisualSuggest">
      <el-form-item label="声像资料鉴定意见" prop="audioVisualSuggest">
        <el-input v-model="searchForm.audioVisualSuggest" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import SelectFromQualification from "@/components/common/SelectFromQualification";
export default {
  name: "MoreSearch",
  props: {
    searchForm: { type: Object, processSituation: "" },
    chargeTypeData: Array, //费用类型
    poisonCategoryOpt: Array, //毒物毒品类别
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      form: "",
      listType: "",
    };
  },
  methods: {
    poPoisonCategoryChange(json) {
      var data = JSON.parse(JSON.stringify(val));
      this.port = "poison";
      row.poisonConditon = { poisonCategoryId: data.id };
    },
  },
  components: {
    "select-qualification": SelectFromQualification,
  },
  watch: {
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
  },
};
</script>

<style lang='less' scoped>
</style>