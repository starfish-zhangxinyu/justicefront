<template>
  <div>
    <el-form
      ref="form"
      label-width="130px"
      size="small"
      :model="acceptForm"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-row>
        <el-col :sm="panClass.sm" :md="{ span: 12 }" :xl="panClass.xl">
          <el-form-item
            label="专业类别"
            :rules="$filter_rules({ required: true })"
            prop="professionCategory"
          >
            <select-from-table
              :model.sync="acceptForm.professionCategory"
              port="profession"
              className="w100"
              :hasDefault="true"
              :disabled="disabled"
            ></select-from-table>
          </el-form-item>
        </el-col>
        <el-col :sm="panClass.sm" :md="{ span: 12 }" :xl="panClass.xl">
          <el-form-item
            label="委托方类型"
            :rules="$filter_rules({ required: true, trigger: 'change' })"
            prop="entrustInfo.entrustingPartyType"
          >
            <el-radio-group
              v-model="acceptForm.entrustInfo.entrustingPartyType"
            >
              <el-radio label="UNIT">单位</el-radio>
              <el-radio label="PERSONAL">个人</el-radio>
              <el-radio label="MULTIPLE">多方委托</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!--委托信息-->
      <Collapse title="委托信息" :active="true">
        <template>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="是否重新鉴定" prop="entrustInfo.repeat">
                <el-radio-group v-model="acceptForm.entrustInfo.repeat">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="重新鉴定原因"
                prop="entrustInfo.repeatReason"
                v-if="acceptForm.entrustInfo.repeat == 'Y'"
              >
                <select-from-dict
                  :model.sync="acceptForm.entrustInfo.repeatReason"
                  className="w100"
                  data_type="repeat_auth_reason"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :sm="{ span: 18 }"
              :md="{ span: 16 }"
              :xl="{ span: 13, offset: 1 }"
            >
              <el-form-item
                label="委托单位"
                prop="entrustInfo.entrustingUnit.name"
                :rules="$filter_rules({ required: true })"
                v-if="acceptForm.entrustInfo.entrustingPartyType == 'UNIT'"
              >
                <el-row>
                  <el-col>
                    <select-client
                      ref="selectClient"
                      :model.sync="acceptForm.entrustInfo.entrustingUnit"
                      className="w100"
                      :functionCb="entrustAddFn"
                      @openDialog="openDialog"
                    />
                    <entrustAdd ref="entrustAdd" @addOk="addOkFn" />
                  </el-col>
                  <!-- 委托单位新增 写成上面的回调函数了-->
                </el-row>
              </el-form-item>
              <el-form-item
                label="委托人"
                prop="entrustInfo.entrustingParty"
                :rules="$filter_rules({ required: true })"
                v-if="acceptForm.entrustInfo.entrustingPartyType != 'UNIT'"
              >
                <el-input
                  class="w100"
                  v-model="acceptForm.entrustInfo.entrustingParty"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--联系人-->
          <el-row>
            <!--委托单位下的联系人-->
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="acceptForm.entrustInfo.entrustingPartyType == 'UNIT'"
            >
              <el-form-item
                label="联系人"
                :rules="$filter_rules({ required: true })"
                prop="entrustInfo.contact.name"
              >
                <el-select
                  v-model="acceptForm.entrustInfo.contact.name"
                  style="width: calc(100% - 44px)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in contactOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  plain
                  @click="unitContactDialog = true"
                ></el-button>
              </el-form-item>
            </el-col>
            <!--其他联系人-->
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="acceptForm.entrustInfo.entrustingPartyType != 'UNIT'"
            >
              <el-form-item
                label="联系人"
                :rules="$filter_rules({ required: true })"
                prop="entrustInfo.contact.name"
              >
                <el-select
                  v-model="acceptForm.entrustInfo.contact.name"
                  placeholder="请选择"
                  allow-create
                  class="w100"
                  filterable
                >
                  <el-option
                    v-for="item in contactOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="联系人电话"
                :rules="$filter_rules({ required: true })"
                prop="entrustInfo.contact.phone"
              >
                <el-input
                  v-model.trim="acceptForm.entrustInfo.contact.phone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="联系人地址"
                prop="entrustInfo.contact.address"
              >
                <el-input
                  v-model.trim="acceptForm.entrustInfo.contact.address"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="案件类型" prop="entrustInfo.caseType">
                <select-from-dict
                  :model.sync="acceptForm.entrustInfo.caseType"
                  data_type="case_type"
                  className="multiple-select w100"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="统计类别" prop="entrustInfo.caseStatType">
                <TreeSelect
                  :model.sync="acceptForm.caseStatType"
                  name="caseStatType"
                  title="统计类别选择"
                ></TreeSelect>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="案件种类" prop="entrustInfo.caseCategory">
                <select-from-dict
                  data_type="case_category"
                  className="w100"
                  :model.sync="acceptForm.entrustInfo.caseCategory"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="是否回避" prop="entrustInfo.withdrawalNeed">
                <el-radio-group v-model="acceptForm.entrustInfo.withdrawalNeed">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <div v-if="acceptForm.entrustInfo.withdrawalNeed == 'Y'">
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  label="回避人"
                  :rules="$filter_rules({ required: true, trigger: 'change' })"
                  prop="caseWithdrawalList"
                >
                  <el-select
                    value-key="id"
                    class="w100"
                    v-model="acceptForm.caseWithdrawalList"
                    filterable
                    :multiple="true"
                  >
                    <el-option
                      v-for="item in sysUserListData"
                      :key="item.id"
                      :label="item.hrStaff.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.md">
                <el-form-item
                  label="回避原因"
                  prop="entrustInfo.withdrawalReason"
                >
                  <select-from-dict
                    :className="'w100'"
                    :model.sync="acceptForm.entrustInfo.withdrawalReason"
                    data_type="withdrawal_reason"
                  ></select-from-dict>
                </el-form-item>
              </el-col>
            </div>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="是否加急" prop="entrustInfo.urgent">
                <el-radio-group v-model="acceptForm.entrustInfo.urgent">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="材料是否齐全"
                prop="entrustInfo.materialAllReady"
              >
                <el-radio-group
                  v-model="acceptForm.entrustInfo.materialAllReady"
                >
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="hasPermission('auth:cnas')"
            >
              <el-form-item
                label="CNAS/CMA项目"
                prop="entrustInfo.isCnasItem"
                :rules="$filter_rules({ required: true })"
              >
                <el-radio-group v-model="acceptForm.entrustInfo.isCnasItem">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="受理地点"
                prop="acceptStation"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-table
                  ref="acceptStationTable"
                  :model.sync="acceptForm.acceptStation"
                  port="acceptStation"
                  :hasDefault="true"
                  className="multiple-select"
                ></select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :sm="{ span: 24 }"
              :md="{ span: 24 }"
              :xl="{ span: 13, offset: 1 }"
            >
              <el-form-item label="基本案情" prop="entrustInfo.entrustingDesc">
                <el-input
                  v-model="acceptForm.entrustInfo.entrustingDesc"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 20 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :sm="{ span: 24 }"
              :md="{ span: 24 }"
              :xl="{ span: 13, offset: 1 }"
            >
              <el-form-item prop="remarks" label="备注">
                <el-input
                  v-model="acceptForm.remarks"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </Collapse>
      <!--既往鉴定史-start-->
      <div class="portlet" v-if="acceptForm.entrustInfo.repeat == 'Y'">
        <div class="portlet-header">
          <span>既往鉴定史</span>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addHistory()"
            >新增
          </el-button>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <el-table
            :data="acceptForm.authHistoryList"
            border
            style="width: 100%"
            size="small"
            stripe
          >
            <el-table-column prop="authOrg" label="机构名称">
              <template slot-scope="scope">
                <el-form-item label-width="0px">
                  <el-input v-model.trim="scope.row.authOrg"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="caseNo" label="案件编号">
              <template slot-scope="scope">
                <el-form-item label-width="0px">
                  <el-input v-model.trim="scope.row.caseNo"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="authHistoryAuthenticatorList"
              label="本机构参与鉴定的鉴定人"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0px">
                  <select-qualification
                    :profession_category="acceptForm.professionCategory.id"
                    qualification_type="AUTH"
                    :filterable="true"
                    className="multiple-select"
                    :multiple="true"
                    :model.sync="scope.row.authHistoryAuthenticatorList"
                  ></select-qualification>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200%">
              <template slot-scope="scope">
                <UploadFile :model.sync="scope.row.files" :multiple="true" />
                <el-button
                  type="danger"
                  size="mini"
                  style="margin-left: 10px"
                  @click.native.prevent="deleteHistory(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--鉴定信息-->
      <Collapse title="鉴定信息" :active="true">
        <template>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="案发时间" prop="happenDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.happenDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="委托日期" prop="entrustingDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.entrustingDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="受理日期" prop="acceptDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.acceptDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="约定完成时间" prop="promiseFinishDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.promiseFinishDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="计划完成时间"
                :class="workDay ? 'margin0' : null"
                prop="deadline"
              >
                <el-col
                  :xl="{ span: 20 }"
                  :md="{ span: 20 }"
                  :sm="{ span: 20 }"
                >
                  <el-date-picker
                    @change="dateChange"
                    style="width: 100%"
                    v-model="acceptForm.deadline"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                  <span class="font1" v-if="workDay"
                    >受理日期后{{ workDay }}个{{ label }}</span
                  >
                </el-col>
                <el-col :xl="{ span: 3 }" :md="{ span: 3 }" :sm="{ span: 3 }">
                  <el-button
                    type="primary"
                    icon="el-icon-time"
                    size="small"
                    plain
                    @click="byDay"
                  >
                    <!-- <font-awesome-icon icon="calendar-alt"/> -->
                  </el-button>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="案件判断人"
                prop="authenticator.judger"
                :rules="$filter_rules({ required: true })"
              >
                <el-select
                  v-model="acceptForm.authenticator.judger"
                  placeholder="请选择"
                  class="w100"
                  value-key="id"
                >
                  <el-option
                    v-for="item in judegerList"
                    :key="item.id"
                    :label="item.hrStaff.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="鉴定助理" prop="authenticator.assist">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="ASSIST"
                  :model.sync="acceptForm.authenticator.assist"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="第一鉴定人" prop="authenticator.auth1">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth1"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="第二鉴定人" prop="authenticator.auth2">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth2"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="第三鉴定人" prop="authenticator.auth3">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth3"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="第四鉴定人" prop="authenticator.auth4">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth4"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="第五鉴定人" prop="authenticator.auth5">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth5"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                label="授权签字人"
                prop="authenticator.authorized_signatory"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTHORIZED_SIGNATORY"
                  :model.sync="acceptForm.authenticator.authorized_signatory"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="复核人" prop="authenticator.reviewer">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="REVIEWER"
                  :model.sync="acceptForm.authenticator.reviewer"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="签发人" prop="authenticator.issuer">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="ISSUER"
                  :model.sync="acceptForm.authenticator.issuer"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="市场人员" prop="authenticator.sales">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="SALES"
                  :model.sync="acceptForm.authenticator.sales"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="实验人员" prop="authenticator.lab_staff">
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="LAB_STAFF"
                  :model.sync="acceptForm.authenticator.lab_staff"
                  :multiple="true"
                ></select-qualification>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </Collapse>
    </el-form>
    <!--增加委托单位下的联系人-->
    <el-dialog title="增加联系人" :visible.sync="unitContactDialog">
      <el-form
        :model="unitContactForm"
        ref="unitContactForm"
        label-position="right"
        label-width="100px"
        size="small"
      >
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item
              label="姓名"
              :rules="$filter_rules({ required: true })"
              prop="name"
            >
              <el-input v-model="unitContactForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="性别">
              <el-select v-model="unitContactForm.sex" placeholder="请选择性别">
                <el-option label="男" value="M"></el-option>
                <el-option label="女" value="F"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="职务">
              <el-input v-model="unitContactForm.position"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item
              label="手机号"
              :rules="$filter_rules({ required: true, type: 'mobile' })"
              prop="phone"
            >
              <el-input v-model="unitContactForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="座机">
              <el-input v-model="unitContactForm.fax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item
              label="联系地址"
              :rules="$filter_rules({ required: true })"
              prop="address"
            >
              <el-input v-model="unitContactForm.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="微信/邮箱">
              <el-input v-model="unitContactForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="备注">
              <el-input v-model="unitContactForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unitContactDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="saveContact('unitContactForm')"
          size="small"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectFromQualification from "../../../components/common/SelectFromQualification";
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Collapse from "../../layout/Collapse";
import TreeSelect from "../../../components/common/TreeSelect";
import api from "../../../api/index";
import entrustAdd from "./../accept-case/Module/EntrustedAdd.vue";
import UploadFile from "@/components/common/UploadFile.vue";

export default {
  name: "BasicMsg",
  props: ["isDisabled"],
  components: {
    Collapse: Collapse,
    "select-qualification": SelectFromQualification,
    TreeSelect: TreeSelect,
    entrustAdd,
    UploadFile,
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      caseMarkOpt: [],
      workDay: "",
      label: "",
      reportTypeOpt: [],
      description: "请参考案件编号",
      contactOpt: [],
      unitContactDialog: false,
      unitContactForm: {},
      disabled: this.isDisabled,
      judegerList: [],
      isAddShow: false,
      sysUserListData: [], //用户数据
      completeDays: null, //默认日期
      isWorkingDay: false, //计划完成日期是否按工作日计算
    };
  },
  inject: ["hasPermission"],
  methods: {
    addOkFn(res) {
      this.$refs.selectClient.searchClient();
      this.$refs.selectClient.init();
      this.acceptForm.entrustInfo.entrustingUnit = res;
    },
    entrustAddFn() {
      this.$refs.entrustAdd.init();
    },
    //按工作日
    byDay() {
      if (this.acceptForm.acceptDate) {
        this.$prompt("请输入" + this.label, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            var dateArr = this.acceptForm.acceptDate.split(" ");
            var data = {
              acceptDate: dateArr[0].replace(/-/g, "/"),
              days: value,
            };
            if (this.isWorkingDay) {
              this.$get(api.caCase + "/date", data)
                .then((res) => {
                  this.workDay = value;
                  this.acceptForm.deadline = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              let time =
                new Date(
                  this.acceptForm.acceptDate.replace(/-/g, "/")
                ).getTime() +
                86400000 * value;
              this.acceptForm.deadline = this.$thisDate(true, time);
              this.$nextTick(() => this.dateChange());
            }
          })
          .catch(() => {});
      } else {
        this.$message.error("请先填写受理日期！");
      }
    },
    dateChange(res) {
      if (this.acceptForm.acceptDate && this.acceptForm.deadline) {
        let startTime = new Date(
          this.acceptForm.acceptDate.replace(/-/g, "/").split(" ")[0]
        ).getTime();
        let endTime = new Date(
          this.acceptForm.deadline.replace(/-/g, "/").split(" ")[0]
        ).getTime();
        if (endTime >= startTime) {
          if (this.isWorkingDay) {
            var data = {
              acceptDate: this.acceptForm.acceptDate
                .replace(/-/g, "/")
                .split(" ")[0],
              completeDate: this.acceptForm.deadline
                .replace(/-/g, "/")
                .split(" ")[0],
            };
            this.$get(api.caCase + "/date", data)
              .then((res) => {
                this.workDay = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.workDay = (endTime - startTime) / 86400000;
            this.workDay = this.workDay.toString();
          }
        } else {
          this.$message.error("计划完成日期不可早于受理日期！");
          this.acceptForm.deadline = "";
        }
      } else {
        if (!this.acceptForm.acceptDate) {
          this.$message.error("请先填写受理日期！");
          this.acceptForm.deadline = "";
          this.workDay = "";
        }
      }
    },
    openDialog() {
      this.$refs.form.clearValidate("entrustInfo.entrustingUnit.name");
    },
    saveContact(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.acceptForm.entrustInfo.entrustingPartyType == "UNIT") {
            if (this.acceptForm.entrustInfo.entrustingUnit.id) {
              var data = { ...this.unitContactForm };
              data.status = "1";
              this.$put(
                api.addUnitContact +
                  this.acceptForm.entrustInfo.entrustingUnit.id,
                data
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                    this.$get(
                      api.entrustingUnit +
                        "/" +
                        this.acceptForm.entrustInfo.entrustingUnit.id
                    )
                      .then((res) => {
                        this.contactOpt = [].concat(
                          res.data.externalPersonDtoList
                        );
                        this.contactOpt.forEach((v, i) => {
                          if (data.name == v.name) {
                            this.acceptForm.entrustInfo.contact = v;
                          }
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    this.unitContactDialog = false;
                    this.unitContactForm = {};
                    this.$refs.unitContactForm.clearValidate();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message.error("请先选择委托单位！");
            }
          } else {
            this.$post(api.externalPerson, this.unitContactForm)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    },
    addHistory() {
      this.acceptForm.authHistoryList.push({
        authHistoryAuthenticatorList: [],
      });
    },
    deleteHistory(index, row) {
      this.acceptForm.authHistoryList.splice(index, 1);
    },
  },
  watch: {
    isDisabled(newVal, oldVal) {
      this.disabled = newVal;
    },
    //监听委托方类型
    "acceptForm.entrustInfo.entrustingPartyType": {
      handler(newVal, oldVal) {
        if (oldVal) {
          this.acceptForm.entrustInfo.contact = {};
        }
        if (newVal != "UNIT") {
          this.$refs.form.clearValidate("entrustInfo.entrustingUnit.name");
          this.acceptForm.entrustInfo.entrustingUnit = { id: "" };
          this.$get(api.externalPerson, { type: "PERSONAL_CONTACT" })
            .then((res) => {
              this.contactOpt = res.data.list;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$refs.form.clearValidate("entrustInfo.entrustingParty");
          this.acceptForm.entrustInfo.entrustingParty = "";
          this.contactOpt = [];
        }
      },
    },
    //监听委托单位id
    "acceptForm.entrustInfo.entrustingUnit.id": {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          if (oldVal) {
            this.acceptForm.entrustInfo.contact = {};
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
          this.acceptForm.entrustInfo.contact = {};
        }
      },
    },
    //监听联系人
    "acceptForm.entrustInfo.contact.name": {
      handler(newVal, oldVal) {
        if (newVal) {
          this.contactOpt.forEach((v, i) => {
            if (v.name == newVal) {
              this.acceptForm.entrustInfo.contact = {
                name: newVal,
                phone: v.phone,
                address: v.address,
              };
            }
          });
        }
      },
      immediate: true,
    },
    //监听专业类别
    "acceptForm.professionCategory.id": function (newVal, oldVal) {
      if (newVal) {
        if (!this.$route.query.caseId) {
          this.$get("/api/param/v1/params/value", {
            professionCategoryId: newVal,
            key: "case.entrusting.desc",
          })
            .then((res) => {
              if (res.status == 200) {
                let json = JSON.parse(JSON.stringify(this.acceptForm));
                json.entrustInfo.entrustingDesc = res.data;
                json.entrustInfo.isCnasItem = "N";
                json.entrustInfo.materialAllReady = "Y";
                json.entrustInfo.urgent = "N";
                json.entrustInfo.withdrawalNeed = "N";
                json.entrustInfo.repeat = "N";
                this.$store.dispatch("register/changeBasic", json);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        this.$get("/api/param/v1/params/value", {
          professionCategoryId: newVal,
          key: "case.default.complete.days",
        })
          .then((res) => {
            res.status == 200 && Boolean(res.data)
              ? (this.completeDays = res.data)
              : (this.completeDays = 0);
          })
          .catch((err) => console.log(err));
        if (!this.$route.query.caseId) {
          this.$store.commit("register/changeBasicMsg", {
            authHistoryList: [],
            authenticatorList: [],
            professionCategory: this.acceptForm.professionCategory,
            entrustInfo: {
              contact: {},
              entrustingUnit: {},
              statisticsType: {},
            },
            authenticator: {},
            entrustingDate: this.$thisDate(true),
            promiseFinishDate: "",
          });
          this.$store.commit("register/changeAnthenticatedTargetMsg", {
            authenticatedVehicleList: [],
            authenticatedPersonList: [],
            authenticatedOtherList: [],
          });
          this.$store.commit("register/changeDnaSampleMsg", {
            dnaSampleList: [],
          });
          this.$store.commit("register/changeCaSampleMsg", {
            caSampleList: [],
          });
          this.$store.commit("register/changePoisonSampleMsg", {
            poSampleList: [],
          });
          this.$store.commit("register/changeEntrustingAuthItem", {
            entrustingMatterList: [],
          });
          this.$store.commit("register/changeChargeItem", {
            chargingItemList: [],
          });
          //初始化鉴定材料（鉴定材料的“默认显示”为是的，在登记或受理时，直接显示到鉴定材料表格里面。
          this.$get(api.auth, {
            "page.current": 0,
            "page.pageSize": 1000,
            professionCategoryId: newVal,
            isDefault: "Y",
          })
            .then((res) => {
              if (res.status == 200) {
                var echoData = JSON.parse(JSON.stringify(res.data));
                var defaultList = [];
                if (echoData && echoData.list) {
                  echoData.list.forEach((v) => {
                    defaultList.push({
                      type: v.materialType,
                      unit: v.materialUnit,
                      property: v.materialProperty,
                      handleType: v.handleType,
                      name: v.name,
                      quantity: 1,
                      status: { label: "正常", value: "NORMAL" },
                    });
                  });
                }
                this.$store.commit("register/changeMaterialNormal", {
                  inspectionMaterialListNormal: defaultList,
                  inspectionMaterialListWaitingSend: [],
                });
              } else {
                this.$store.commit("register/changeMaterialNormal", {
                  inspectionMaterialListNormal: [],
                  inspectionMaterialListWaitingSend: [],
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$store.commit("register/changeMaterialNormal", {
                inspectionMaterialListNormal: [],
                inspectionMaterialListWaitingSend: [],
              });
            });
        }
        //案件判断人渲染
        var data2 = {
          professionCategoryId: newVal,
          key: "case.authenticator.judger",
        };
        this.$get(api.param + "/value/user", data2)
          .then((res) => {
            this.judegerList = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
        this.$refs.acceptStationTable.init(); // add 再次初始化
      }
    },
    //监听约定完成日期
    "acceptForm.promiseFinishDate": function (newVal, oldVal) {
      if (newVal) {
        if (this.acceptForm.deadline == undefined) {
          this.acceptForm.deadline = newVal;
          this.dateChange();
          let json = JSON.parse(JSON.stringify(this.acceptForm));
          json.deadline = newVal;
          this.$store.dispatch("register/changeBasic", json);
        }
      }
    },
    "acceptForm.acceptDate": function (newVal, oldVal) {
      if (newVal) {
        this.acceptForm.acceptDate = this.$thisDate(true,newVal);
        var dateArr = this.acceptForm.acceptDate.split(" ");
        var data = {
          acceptDate: dateArr[0].replace(/-/g, "/"),
          days: this.completeDays,
        };
        if (this.isWorkingDay) {
          this.$get(api.caCase + "/date", data)
            .then((res) => {
              this.workDay = this.completeDays;
              // this.acceptForm.deadline = res.data;
              var json = JSON.parse(JSON.stringify(this.acceptForm));
              // json.deadline = res.data;
              json.promiseFinishDate = res.data;
              this.$store.dispatch("register/changeBasic", json);
              this.$nextTick(() => this.dateChange());
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          let time =
            new Date(this.acceptForm.acceptDate.replace(/-/g, "/")).getTime() +
            86400000 * this.completeDays;
          //this.acceptForm.deadline = this.$thisDate(true, time);
          this.acceptForm.promiseFinishDate = this.$thisDate(true, time);
          this.$nextTick(() => this.dateChange());
        }
        //     let time = new Date(this.acceptForm.acceptDate.replace(/-/g, "/")).getTime() + (86400000 * this.completeDays);
        //     this.acceptForm.promiseFinishDate = this.$thisDate(true, time);
        //     this.$nextTick(() => this.dateChange());
      }
    },
  },
  computed: {
    ...mapState("register", {
      acceptForm: "basicMsg",
      status: "status",
    }),
  },
  created() {
    //每次进入时，表单清空
    if (this.acceptForm.professionCategory) {
      this.acceptForm.professionCategory.id = "";
    } else {
      this.acceptForm.professionCategory = { id: "" };
    }
    var data = {};
    data["page.pageSize"] = 1000;
    data["page.current"] = 1;
    data.type = "report_type_flag";
    this.$get("/api/dict/v1/dicts", data)
      .then((res) => {
        this.reportTypeOpt = res.data.list;
      })
      .catch((err) => {
        console.log(err);
      });
    //案件判断人渲染
    var data2 = {
      professionCategoryId: this.acceptForm.professionCategory.id,
      key: "case.authenticator.judger",
    };
    this.$get(api.param + "/value/user", data2)
      .then((res) => {
        this.judegerList = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    this.$get("/api/param/v1/params/value", {
      professionCategoryId: null,
      key: "case.entrustingUnit.add",
    })
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 0) {
            this.isAddShow = false;
          } else {
            this.isAddShow = true;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //获取所有用户
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
    //获取日期计算方式
    this.$get("/api/param/v1/params/value", {
      professionCategoryId: null,
      key: "days.natural.or.work",
    })
      .then((res) => {
        if (res.data && res.data == "days.work") {
          this.isWorkingDay = true;
          this.label = "工作日";
        } else {
          this.label = "自然日";
        }
      })
      .catch((err) => console.log(err));
  },
  beforeDestroy() {
    //清除表单
    this.$store.commit("register/changeBasicMsg", {
      authHistoryList: [],
      authenticatorList: [],
      professionCategory: this.acceptForm.professionCategory,
      entrustInfo: { contact: {}, entrustingUnit: {}, statisticsType: {} },
      authenticator: {},
      entrustingDate: this.$thisDate(true),
      acceptDate: this.$thisDate(true),
      promiseFinishDate: "",
    });
    this.$store.commit("register/changeAnthenticatedTargetMsg", {
      authenticatedVehicleList: [],
      authenticatedPersonList: [],
      authenticatedOtherList: [],
    });
    this.$store.commit("register/changeCaSampleMsg", {
      caSampleList: [],
    });
    this.$store.commit("register/changeDnaSampleMsg", {
      dnaSampleList: [],
    });
    this.$store.commit("register/changePoisonSampleMsg", {
      poSampleList: [],
    });
    this.$store.commit("register/changeEntrustingAuthItem", {
      entrustingMatterList: [],
    });
    this.$store.commit("register/changeChargeItem", {
      chargingItemList: [],
    });
    this.$store.commit("register/changeMaterialNormal", {
      inspectionMaterialListNormal: [],
      inspectionMaterialListWaitingSend: [],
    });
  },
};
</script>

<style scoped>
</style>