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
            v-if="AcceptField.profession_category"
            :label="AcceptField.profession_category.label"
            :rules="
              $filter_rules({
                required: AcceptField.profession_category.required,
                trigger: 'change',
              })
            "
            prop="professionCategory"
          >
            <select-from-table
              className="w100"
              :model.sync="acceptForm.professionCategory"
              port="profession"
              :hasDefault="true"
              :disabled="disabled"
            ></select-from-table>
          </el-form-item>
        </el-col>
        <el-col :sm="panClass.sm" :md="{ span: 12 }" :xl="panClass.xl">
          <el-form-item
            v-if="AcceptField.entrusting_type"
            :label="AcceptField.entrusting_type.label"
            :rules="
              $filter_rules({
                required: AcceptField.entrusting_type.required,
                trigger: 'change',
              })
            "
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
              <el-form-item
                v-if="AcceptField.is_re_auth"
                :label="AcceptField.is_re_auth.label"
                prop="entrustInfo.repeat"
                :rules="
                  $filter_rules({
                    required: AcceptField.is_re_auth.required,
                    trigger: 'change',
                  })
                "
              >
                <el-radio-group v-model="acceptForm.entrustInfo.repeat">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.re_auth_reason.label"
                prop="entrustInfo.repeatReason"
                :rules="
                  $filter_rules({
                    required: AcceptField.re_auth_reason.required,
                    trigger: 'change',
                  })
                "
                v-if="
                  AcceptField.re_auth_reason &&
                  acceptForm.entrustInfo.repeat == 'Y'
                "
              >
                <select-from-dict
                  className="w100"
                  :model.sync="acceptForm.entrustInfo.repeatReason"
                  data_type="repeat_auth_reason"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 联系人 -->
            <el-col
              :sm="{ span: 18 }"
              :md="{ span: 16 }"
              :xl="{ span: 13, offset: 1 }"
            >
              <el-form-item
                :label="AcceptField.entrusting_unit.label"
                prop="entrustInfo.entrustingUnit.name"
                :rules="
                  $filter_rules({
                    required: AcceptField.entrusting_unit.required,
                  })
                "
                v-if="
                  AcceptField.entrusting_unit &&
                  acceptForm.entrustInfo.entrustingPartyType == 'UNIT'
                "
              >
                <el-row>
                  <el-col>
                    <select-client
                      ref="selectClient"
                      className="w100"
                      :model.sync="acceptForm.entrustInfo.entrustingUnit"
                      :functionCb="entrustAddFn"
                      @openDialog="openDialog"
                    />
                    <entrustAdd ref="entrustAdd" @addOk="addOkFn" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                :label="AcceptField.entrusting_person.label"
                prop="entrustInfo.entrustingParty"
                :rules="
                  $filter_rules({
                    required: AcceptField.entrusting_person.required,
                  })
                "
                v-if="
                  AcceptField.entrusting_person &&
                  acceptForm.entrustInfo.entrustingPartyType != 'UNIT'
                "
              >
                <el-row>
                  <el-col :span="24">
                    <el-input
                      class="w100"
                      v-model.trim="acceptForm.entrustInfo.entrustingParty"
                    />
                  </el-col>
                </el-row>
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
                :label="AcceptField.contact.label"
                v-if="AcceptField.contact"
                :rules="
                  $filter_rules({
                    required: AcceptField.contact.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.contact.name"
              >
                <el-select
                  v-model="acceptForm.entrustInfo.contact.name"
                  style="width: calc(100% - 44px)"
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
                :label="AcceptField.contact.label"
                v-if="AcceptField.contact"
                :rules="
                  $filter_rules({
                    required: AcceptField.contact.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.contact.name"
              >
                <el-select
                  class="w100"
                  v-model="acceptForm.entrustInfo.contact.name"
                  placeholder="请选择"
                  allow-create
                  filterable
                  default-first-option
                  @blur="handleBlur"
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
                :label="AcceptField.contact_phone.label"
                v-if="AcceptField.contact_phone"
                :rules="
                  $filter_rules({
                    required: AcceptField.contact_phone.required,
                  })
                "
                prop="entrustInfo.contact.phone"
              >
                <el-input
                  class="w100"
                  v-model.trim="acceptForm.entrustInfo.contact.phone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.contact_address.label"
                v-if="AcceptField.contact_address"
                :rules="
                  $filter_rules({
                    required: AcceptField.contact_address.required,
                  })
                "
                prop="entrustInfo.contact.address"
              >
                <el-input
                  class="w100"
                  v-model.trim="acceptForm.entrustInfo.contact.address"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.case_type.label"
                v-if="AcceptField.case_type"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_type.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.caseType"
              >
                <select-from-dict
                  :model.sync="acceptForm.entrustInfo.caseType"
                  data_type="case_type"
                  className="multiple-select"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.case_stat_type.label"
                v-if="AcceptField.case_stat_type"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_stat_type.required,
                  })
                "
                prop="caseStatType"
              >
                <TreeSelect
                  :model.sync="acceptForm.caseStatType"
                  name="caseStatType"
                  title="统计类别选择"
                  ref="treeSelect"
                ></TreeSelect>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.case_category.label"
                v-if="AcceptField.case_category"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_category.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.caseCategory"
              >
                <select-from-dict
                  data_type="case_category"
                  className="w100"
                  :model.sync="acceptForm.entrustInfo.caseCategory"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.is_avoid.label"
                v-if="AcceptField.is_avoid"
                :rules="
                  $filter_rules({
                    required: AcceptField.is_avoid.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.withdrawalNeed"
              >
                <el-radio-group v-model="acceptForm.entrustInfo.withdrawalNeed">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <div v-if="acceptForm.entrustInfo.withdrawalNeed == 'Y'">
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="AcceptField.avoid_person.label"
                  v-if="AcceptField.avoid_person"
                  :rules="
                    $filter_rules({
                      required: AcceptField.avoid_person.required,
                      trigger: 'change',
                    })
                  "
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
                  :label="AcceptField.avoid_reason.label"
                  v-if="AcceptField.avoid_reason"
                  :rules="
                    $filter_rules({
                      required: AcceptField.avoid_reason.required,
                      trigger: 'change',
                    })
                  "
                  prop="entrustInfo.withdrawalReason"
                >
                  <select-from-dict
                    :model.sync="acceptForm.entrustInfo.withdrawalReason"
                    data_type="withdrawal_reason"
                  ></select-from-dict>
                </el-form-item>
              </el-col>
            </div>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.is_urgent.label"
                v-if="AcceptField.is_urgent"
                :rules="
                  $filter_rules({
                    required: AcceptField.is_urgent.required,
                    trigger: 'change',
                  })
                "
                prop="entrustInfo.urgent"
              >
                <el-radio-group v-model="acceptForm.entrustInfo.urgent">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.is_material_all.label"
                v-if="AcceptField.is_material_all"
                prop="entrustInfo.materialAllReady"
                :rules="
                  $filter_rules({
                    required: AcceptField.is_material_all.required,
                    trigger: 'change',
                  })
                "
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
                :label="AcceptField.is_cnas_item.label"
                ref="clientStyle"
                v-if="AcceptField.is_cnas_item"
                prop="entrustInfo.isCnasItem"
                :rules="
                  $filter_rules({
                    required: AcceptField.is_cnas_item.required,
                    trigger: 'change',
                  })
                "
              >
                <el-radio-group v-model="acceptForm.entrustInfo.isCnasItem">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.accept_station.label"
                v-if="AcceptField.accept_station"
                :rules="
                  $filter_rules({
                    required: AcceptField.accept_station.required,
                    trigger: 'change',
                  })
                "
                prop="acceptStation"
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
              <el-form-item
                :label="AcceptField.base_case_detail.label"
                prop="entrustInfo.entrustingDesc"
                v-if="AcceptField.base_case_detail"
                :rules="
                  $filter_rules({
                    required: AcceptField.base_case_detail.required,
                  })
                "
              >
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
              <el-form-item
                prop="remarks"
                :label="AcceptField.remarks.label"
                v-if="AcceptField.remarks"
                :rules="
                  $filter_rules({ required: AcceptField.remarks.required })
                "
              >
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
              <el-form-item
                :label="AcceptField.case_happen_date.label"
                prop="happenDate"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_happen_date.required,
                  })
                "
                v-if="AcceptField.case_happen_date"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.happenDate"
                  type="date"
                  format="yyyy -MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.entrusting_date.label"
                v-if="AcceptField.entrusting_date"
                prop="entrustingDate"
                :rules="
                  $filter_rules({
                    required: AcceptField.entrusting_date.required,
                  })
                "
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.entrustingDate"
                  type="date"
                  format="yyyy -MM - dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.accept_date.label"
                v-if="AcceptField.accept_date"
                prop="acceptDate"
                :rules="
                  $filter_rules({ required: AcceptField.accept_date.required })
                "
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="acceptForm.acceptDate"
                  type="date"
                  format="yyyy -MM - dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.promise_finish_date.label"
                prop="promiseFinishDate"
                :rules="
                  $filter_rules({
                    required: AcceptField.promise_finish_date.required,
                  })
                "
                v-if="AcceptField.promise_finish_date"
              >
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
                :label="AcceptField.plan_finish_date.label"
                :rules="
                  $filter_rules({
                    required: AcceptField.plan_finish_date.required,
                  })
                "
                v-if="AcceptField.plan_finish_date"
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
                  <span class="font1" v-if="workDay && acceptForm.deadline"
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
                :label="AcceptField.opinion_book_type.label"
                v-if="AcceptField.opinion_book_type"
                :rules="
                  $filter_rules({
                    required: AcceptField.opinion_book_type.required,
                    trigger: 'change',
                  })
                "
                prop="reportTypeFlag"
              >
                <el-select
                  class="w100"
                  v-model="acceptForm.reportTypeFlag"
                  placeholder="请选择"
                  v-if="
                    status != 'ACCEPT_EDIT' &&
                    status != 'CASE_SUPPLEMENT' &&
                    status != 'REAUTHENTICATE'
                  "
                >
                  <el-option
                    v-for="item in reportTypeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="description"
                  disabled
                  v-if="
                    status == 'ACCEPT_EDIT' ||
                    status == 'CASE_SUPPLEMENT' ||
                    status == 'REAUTHENTICATE'
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.case_no_flag.label"
                v-if="AcceptField.case_no_flag"
                prop="caseNoFlag"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_no_flag.required,
                    trigger: 'change',
                  })
                "
              >
                <el-select
                  class="w100"
                  v-model="acceptForm.caseNoFlag"
                  placeholder="请选择"
                  v-if="
                    status != 'ACCEPT_EDIT' &&
                    status != 'CASE_SUPPLEMENT' &&
                    status != 'REAUTHENTICATE'
                  "
                >
                  <el-option
                    v-for="item in caseMarkOpt"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="description"
                  disabled
                  v-if="
                    status == 'ACCEPT_EDIT' ||
                    status == 'CASE_SUPPLEMENT' ||
                    status == 'REAUTHENTICATE'
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="
                status != 'ACCEPT_EDIT' &&
                status != 'CASE_SUPPLEMENT' &&
                status != 'REAUTHENTICATE'
              "
            >
              <el-form-item
                :label="AcceptField.case_no.label"
                v-if="AcceptField.case_no"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_no.required,
                    trigger: 'change',
                  })
                "
                prop="caseNoType"
              >
                <el-select
                  class="w100"
                  v-model="acceptForm.caseNoType"
                  placeholder="请选择"
                >
                  <el-option
                    label="手动编号"
                    id="selectBox"
                    value="手动编号"
                  ></el-option>
                  <el-option label="自动编号" value="自动编号"></el-option>
                  <!-- <el-option label="空号选择" value="空号选择"></el-option> -->
                </el-select>
                <el-input
                  v-model="acceptForm.caseNo"
                  disabled
                  v-if="
                    status == 'ACCEPT_EDIT' ||
                    status == 'CASE_SUPPLEMENT' ||
                    status == 'REAUTHENTICATE'
                  "
                ></el-input>
              </el-form-item>
              <el-form-item v-if="caseNoGenForm.year" prop="year">
                <span
                  >{{ caseNoGenForm.year }}-{{ caseNoGenForm.sequence }}</span
                >
              </el-form-item>
            </el-col>
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="
                status == 'ACCEPT_EDIT' ||
                status == 'CASE_SUPPLEMENT' ||
                status == 'REAUTHENTICATE'
              "
            >
              <el-form-item
                :label="AcceptField.case_no.label"
                v-if="AcceptField.case_no"
                :rules="
                  $filter_rules({
                    required: AcceptField.case_no.required,
                    trigger: 'change',
                  })
                "
                prop="caseNo"
              >
                <el-input
                  class="w100"
                  v-model="acceptForm.caseNo"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.assist.label"
                v-if="AcceptField.assist"
                :rules="
                  $filter_rules({
                    required: AcceptField.assist.required,
                    trigger: 'change',
                  })
                "
                prop="authenticator.assist"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="ASSIST"
                  :model.sync="acceptForm.authenticator.assist"
                  :isDisabled="authenticatorDisabled"
                  :status="this.$route.query.status"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <!-- 第一鉴定人 -->
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.auth1.label"
                v-if="AcceptField.auth1"
                prop="authenticator.auth1"
                :rules="
                  $filter_rules({
                    required: AcceptField.auth1.required,
                    trigger: 'change',
                  })
                "
              >
                <select-qualification
                  v-if="!authenticatorDisabled"
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth1"
                  :status="this.$route.query.status"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
                <el-input
                  v-else
                  :v-model="
                    acceptForm.auth1 ? acceptForm.auth1.participant.label : ''
                  "
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.auth2.label"
                prop="authenticator.auth2"
                :rules="
                  $filter_rules({
                    required: AcceptField.auth2.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.auth2"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth2"
                  :status="this.$route.query.status"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.auth3.label"
                prop="authenticator.auth3"
                :rules="
                  $filter_rules({
                    required: AcceptField.auth3.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.auth3"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :status="this.$route.query.status"
                  :model.sync="acceptForm.authenticator.auth3"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.auth4.label"
                prop="authenticator.auth4"
                :rules="
                  $filter_rules({
                    required: AcceptField.auth4.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.auth4"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTH"
                  :status="this.$route.query.status"
                  :model.sync="acceptForm.authenticator.auth4"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.auth5.label"
                prop="authenticator.auth5"
                :rules="
                  $filter_rules({
                    required: AcceptField.auth5.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.auth5"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  :status="this.$route.query.status"
                  qualification_type="AUTH"
                  :model.sync="acceptForm.authenticator.auth5"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.authorized_signatory.label"
                prop="authenticator.authorized_signatory"
                :rules="
                  $filter_rules({
                    required: AcceptField.authorized_signatory.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.authorized_signatory"
              >
                <select-qualification
                  className="w100"
                  :status="this.$route.query.status"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="AUTHORIZED_SIGNATORY"
                  :model.sync="acceptForm.authenticator.authorized_signatory"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.reviewer.label"
                prop="authenticator.reviewer"
                :rules="
                  $filter_rules({
                    required: AcceptField.reviewer.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.reviewer"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="REVIEWER"
                  :model.sync="acceptForm.authenticator.reviewer"
                  :isDisabled="authenticatorDisabled"
                  :status="this.$route.query.status"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.issuer.label"
                prop="authenticator.issuer"
                :rules="
                  $filter_rules({
                    required: AcceptField.issuer.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.issuer"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="ISSUER"
                  :model.sync="acceptForm.authenticator.issuer"
                  :status="this.$route.query.status"
                  :isDisabled="authenticatorDisabled"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.sales.label"
                prop="authenticator.sales"
                :rules="
                  $filter_rules({
                    required: AcceptField.sales.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.sales"
              >
                <select-qualification
                  className="w100"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="SALES"
                  :model.sync="acceptForm.authenticator.sales"
                  :isDisabled="authenticatorDisabled"
                  :status="this.$route.query.status"
                ></select-qualification>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item
                :label="AcceptField.lab_staff.label"
                prop="authenticator.lab_Staff"
                :rules="
                  $filter_rules({
                    required: AcceptField.lab_staff.required,
                    trigger: 'change',
                  })
                "
                v-if="AcceptField.lab_staff"
              >
                <select-qualification
                  className="w100"
                  :status="this.$route.query.status"
                  :profession_category="acceptForm.professionCategory.id"
                  qualification_type="LAB_STAFF"
                  :multiple="true"
                  :isDisabled="authenticatorDisabled"
                  :model.sync="acceptForm.authenticator.lab_staff"
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
              :rules="
                $filter_rules({
                  required: AcceptField.contact && AcceptField.contact.required,
                })
              "
              prop="name"
            >
              <el-input v-model="unitContactForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="性别">
              <el-select v-model="unitContactForm.sex" clearable>
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
              :rules="
                $filter_rules({
                  required:
                    AcceptField.contact_phone &&
                    AcceptField.contact_phone.required,
                })
              "
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
              :rules="
                $filter_rules({
                  required:
                    AcceptField.contact_address &&
                    AcceptField.contact_address.required,
                })
              "
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
    <!--手动编号开始-->
    <el-dialog
      title="手动编号选择"
      :visible.sync="caseNoGenDialog"
      :before-close="closeCaseNoGenDialog"
      width="35%"
    >
      <el-form
        :model="caseNoGenForm"
        label-position="right"
        label-width="100px"
        size="small"
      >
        <el-row>
          <el-col :span="16" :offset="2">
            <el-form-item label="年" :rules="$filter_rules({ required: true })">
              <el-select
                v-model="caseNoGenForm.year"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="2">
            <el-form-item
              label="输入编号"
              :rules="$filter_rules({ required: true, type: 'number' })"
            >
              <el-input v-model="caseNoGenForm.sequence"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCaseNoGenDialog()" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="saveCaseNoGenDialog()" size="small"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!--手动编号结束-->
  </div>
</template>

<script>
import SelectFromQualification from "../../../components/common/SelectFromQualification";
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Collapse from "../../layout/Collapse";
import TreeSelect from "../../../components/common/TreeSelect";
import api from "../../../api/index";
import entrustAdd from "./Module/EntrustedAdd.vue";
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
      caseNoGenDialog: false,
      caseNoGenForm: {},
      years: [],
      disabled: this.isDisabled,
      isAddShow: false,
      authenticatorDisabled: false,
      salesAuthenticatorDisabled: false,
      sysUserListData: [], //用户数据
      completeDays: null, //默认日期
      isWorkingDay: false, //计划完成日期是否按工作日计算
    };
  },
  inject: ["hasPermission"],
  methods: {
    handleBlur(err) {
      console.log(err);
    },
    uploadHistory() {},
    addOkFn(res) {
      //添加联系人
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
              if (data.days != null && data.days != "") {
                let time1 =
                  new Date(
                    this.acceptForm.acceptDate.replace(/-/g, "/")
                  ).getTime() +
                  86400000 * value;
                this.acceptForm.deadline = this.$thisDate(true, time1);
              }
            }
          })
          .catch(() => {});
      } else {
        this.$message.error("请先填写受理日期！");
      }
    },
    openDialog() {
      this.$refs.form.clearValidate("entrustInfo.entrustingUnit.name");
    },
    dateChange(res) {
      if (this.acceptForm.acceptDate && this.acceptForm.deadline) {
        let startTime = this.acceptForm.acceptDate
          .replace(/-/g, "/")
          .split(" ")[0];
        let endTime = this.acceptForm.deadline.replace(/-/g, "/").split(" ")[0];
        if (new Date(endTime).getTime() >= new Date(startTime).getTime()) {
          var data = { acceptDate: startTime, completeDate: endTime };
          if (this.isWorkingDay) {
            this.$get(api.caCase + "/date", data)
              .then((res) => {
                this.workDay = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.workDay =
              (new Date(endTime).getTime() - new Date(startTime).getTime()) /
              86400000;
            this.workDay = this.workDay.toString();
          }
        } else {
          this.$message.error("计划完成日期不可早于受理日期！");
          this.acceptForm.deadline = "";
          this.workDay = "";
        }
      } else {
        if (!this.acceptForm.acceptDate) {
          this.$message.error("请先填写受理日期！");
          this.acceptForm.deadline = "";
          this.workDay = "";
        }
      }
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
    closeCaseNoGenDialog() {
      this.acceptForm.caseNoYear = "";
      this.acceptForm.caseNoSequence = "";
      this.caseNoGenDialog = false;
      this.caseNoGenForm = {};
      this.acceptForm.caseNoType = "自动编号";
    },
    saveCaseNoGenDialog() {
      this.acceptForm.caseNoYear = this.caseNoGenForm.year;
      this.acceptForm.caseNoSequence = this.caseNoGenForm.sequence;
      this.caseNoGenDialog = false;
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
    isDisabled: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.disabled = newVal;
        }
      },
      immediate: true,
    },
    //监听委托方类型
    "acceptForm.entrustInfo.entrustingPartyType": {
      handler(newVal, oldVal) {
        // if (oldVal) {
        // this.acceptForm.entrustInfo.contact = {};
        // }
        if (newVal != "UNIT") {
          //unit:单位
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
          var entrustInfo = JSON.parse(
            JSON.stringify(this.acceptForm.entrustInfo)
          );
          entrustInfo.entrustingParty = "";
          this.acceptForm.entrustInfo = entrustInfo;
          this.contactOpt = [];
        }
      },
    },
    //监听委托人
    "acceptForm.entrustInfo.entrustingParty": {
      handler(newVal, oldVal) {
        if (oldVal && newVal != oldVal) {
          // this.acceptForm.entrustInfo.contact = {};
        }
      },
    },
    //监听委托单位id
    "acceptForm.entrustInfo.entrustingUnit.id": {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          // if (oldVal) {
          // this.acceptForm.entrustInfo.contact = {};
          // }
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
        this.completeDays = 0;
        this.$get("/api/param/v1/params/value", {
          professionCategoryId: newVal,
          key: "caseno.default.select",
        })
          .then((res) => {
            if (res.status == 200) {
              if (res.data == "manual") {
                this.acceptForm.caseNoType = "手动编号";
              } else if (res.data == "auto") {
                this.acceptForm.caseNoType = "自动编号";
              } else {
                return;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
        this.$get("/api/param/v1/params/value", {
          professionCategoryId: newVal,
          key: "case.default.complete.days",
        })
          .then((res) => {
            this.completeDays = Boolean(res.data) ? res.data : 0;
          })
          .catch((err) => console.log(err));
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
                this.$store.dispatch("acceptCase/changeBasic", json);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (!this.$route.query.caseId) {
          this.$store.commit("acceptCase/changeBasicMsg", {
            authHistoryList: [],
            authenticatorList: [],
            professionCategory: this.acceptForm.professionCategory,
            entrustInfo: {
              contact: {},
              entrustingUnit: {},
              statisticsType: {},
              entrustingPartyType: "UNIT",
            },
            authenticator: {},
            entrustingDate: this.$thisDate(true),
            acceptDate: this.$thisDate(true),
            promiseFinishDate: "",
          });
          this.$store.commit("acceptCase/changeAnthenticatedTargetMsg", {
            authenticatedVehicleList: [],
            authenticatedPersonList: [],
            authenticatedOtherList: [],
          });
          this.$store.commit("acceptCase/changeCaSampleMsg", {
            caSampleList: [],
          });
          this.$store.commit("acceptCase/changeDnaSampleMsg", {
            dnaSampleList: [],
          });
          this.$store.commit("acceptCase/changePoisonSampleMsg", {
            poSampleList: [],
          });
          this.$store.commit("acceptCase/changeEntrustingAuthItem", {
            entrustingMatterList: [],
          });
          this.$store.commit("acceptCase/changeChargeItem", {
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
                this.$store.commit("acceptCase/changeMaterialNormal", {
                  inspectionMaterialListNormal: defaultList,
                  inspectionMaterialListWaitingSend: [],
                });
              } else {
                this.$store.commit("acceptCase/changeMaterialNormal", {
                  inspectionMaterialListNormal: [],
                  inspectionMaterialListWaitingSend: [],
                });
              }
            })
            .catch((err) => {
              this.$store.commit("acceptCase/changeMaterialNormal", {
                inspectionMaterialListNormal: [],
                inspectionMaterialListWaitingSend: [],
              });
            });

          this.$refs.acceptStationTable.init(); // add 再次初始化
        }
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
          this.$store.dispatch("acceptCase/changeBasic", json);
        }
      }
    },
    //监听计划完成日期
    "acceptForm.deadline": {
      handler(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.$nextTick(() => this.dateChange());
        }
      },
      immediate: true,
      deep: true,
    },
    //监听受理日期
    "acceptForm.acceptDate": function (newVal, oldVal) {
      if (newVal && oldVal && newVal != oldVal) {
        if (this.acceptForm.deadline) {
          this.$nextTick(() => this.dateChange());
        }
      }
    },
    completeDays: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (
            !this.$route.query.status == "ACCEPT_EDIT" ||
            (!this.acceptForm.acceptDate &&
              this.$route.query.status == "ACCEPT_EDIT")
          ) {
            this.acceptForm.acceptDate = this.$thisDate(true);
          }

          var dateArr = this.acceptForm.acceptDate.split(" ");
          var data = {
            acceptDate: dateArr[0].replace(/-/g, "/"),
            days: newVal,
          };
          if (this.isWorkingDay) {
            this.$get(api.caCase + "/date", data)
              .then((res) => {
                this.workDay = newVal;
                this.acceptForm.deadline = res.data;
                var json = JSON.parse(JSON.stringify(this.acceptForm));
                json.deadline = res.data;
                this.$store.dispatch("acceptCase/changeBasic", json);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.workDay = newVal;
            let time =
              new Date(
                this.acceptForm.acceptDate.replace(/-/g, "/")
              ).getTime() +
              86400000 * this.workDay;
            this.acceptForm.deadline = this.$thisDate(true, time);
          }
        }
      },
      immediate: true,
      deep: true,
    },
    //监听案件编号规则（自动、手动、空号选择）
    "acceptForm.caseNoType": function (newVal, oldVal) {
      if (newVal) {
        if (newVal == "手动编号") {
          // this.caseNoGenForm = {year:new Date().getFullYear()};
          // this.caseNoGenDialog = true;
        } else {
          this.caseNoGenDialog = false;
          this.caseNoGenForm = {};
          this.acceptForm.caseNoYear = "";
          this.acceptForm.caseNoSequence = "";
        }
      }
    },
    immediate: true,
  },
  computed: {
    ...mapState("acceptCase", {
      AcceptField: "acceptField",
      acceptForm: "basicMsg",
      status: "status",
    }),
  },
  created() {
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
    //手动编号年份
    var year = new Date().getFullYear();
    for (var i = 0; i < 6; i++) {
      this.years.push((year - 4 + i).toString());
    }
    var status = this.$route.query.status;
    if (status == "ACCEPT_EDIT") {
      this.authenticatorDisabled = true;
    } else if (status == "CASE_SUPPLEMENT" || status == "REAUTHENTICATE") {
      this.salesAuthenticatorDisabled = true;
    }
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
  mounted() {
    let timer = setInterval(() => {
      if (document.querySelector("#selectBox")) {
        document.querySelector("#selectBox").onclick = () => {
          this.caseNoGenForm = { year: new Date().getFullYear() };
          this.caseNoGenDialog = true;
        };
        clearInterval(timer);
      }
    }, 100);
    /* this.$refs.form.resetFields() */
  },
  beforeDestroy() {
    this.$store.commit("acceptCase/changeBasicMsg", {
      authHistoryList: [],
      authenticatorList: [],
      professionCategory: this.acceptForm.professionCategory,
      entrustInfo: { contact: {}, entrustingUnit: {}, statisticsType: {} },
      authenticator: {},
      entrustingDate: this.$thisDate(true),
      acceptDate: this.$thisDate(true),
      promiseFinishDate: "",
    });
    this.$store.commit("acceptCase/changeAnthenticatedTargetMsg", {
      authenticatedVehicleList: [],
      authenticatedPersonList: [],
      authenticatedOtherList: [],
    });
    this.$store.commit("acceptCase/changeCaSampleMsg", {
      caSampleList: [],
    });
    this.$store.commit("acceptCase/changeDnaSampleMsg", {
      dnaSampleList: [],
    });
    this.$store.commit("acceptCase/changePoisonSampleMsg", {
      poSampleList: [],
    });
    this.$store.commit("acceptCase/changeEntrustingAuthItem", {
      entrustingMatterList: [],
    });
    this.$store.commit("acceptCase/changeChargeItem", {
      chargingItemList: [],
    });
    this.$store.commit("acceptCase/changeMaterialNormal", {
      inspectionMaterialListNormal: [],
      inspectionMaterialListWaitingSend: [],
    });
  },
};
</script>

<style scoped>
</style>