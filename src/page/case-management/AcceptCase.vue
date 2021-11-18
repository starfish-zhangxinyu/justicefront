<template>
    <div>
        <PageBar title1="业务流程" title2="受理"></PageBar>
        <div class="accept-case-section">
            <el-form ref="acceptForm" label-width="130px" size="small" :model="acceptForm" class="demo-ruleForm"
                     label-position="right">
                <el-row>
                    <el-col :sm="panClass.sm" :md="{span:12}" :xl="panClass.xl">
                        <el-form-item
                                v-if="AcceptField.profession_category"
                                :label="AcceptField.profession_category.label"
                                :rules="$filter_rules({required:(AcceptField.profession_category.required)})"
                                prop="professionCategory">
                            <select-from-table :model.sync="acceptForm.professionCategory" port="profession"
                                               defaultValue="法医物证鉴定"></select-from-table>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="{span:12}" :xl="panClass.xl">
                        <el-form-item v-if="AcceptField.entrusting_type"
                                      :label="AcceptField.entrusting_type.label"
                                      :rules="$filter_rules({required:(AcceptField.entrusting_type.required)})"
                                      prop="entrustingPartyType">
                            <el-radio-group v-model="acceptForm.entrustInfo.entrustingPartyType">
                                <el-radio label="UNIT" v-if="AcceptField.unit">{{AcceptField.unit.label}}</el-radio>
                                <el-radio label="PERSONAL" v-if="AcceptField.personal">{{AcceptField.personal.label}}
                                </el-radio>
                                <el-radio label="MULTIPLE" v-if="AcceptField.multiple_entrusting">
                                    {{AcceptField.multiple_entrusting.label}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--委托信息-->
                <Collapse :title="AcceptField.entrusting_info.label" :active="true" v-if="AcceptField.entrusting_info">
                    <template >
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item
                                        v-if="AcceptField.is_re_auth"
                                        :label="AcceptField.is_re_auth.label"
                                        prop="repeat"
                                        :rules="$filter_rules({required:true})">
                                    <el-radio-group v-model="acceptForm.entrustInfo.repeat">
                                        <el-radio label="Y">是</el-radio>
                                        <el-radio label="N">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.re_auth_reason.label"
                                              v-if="AcceptField.re_auth_reason&&acceptForm.entrustInfo.repeat=='Y'"
                                              :rules="$filter_rules({required:(AcceptField.re_auth_reason.required)})">
                                    <select-from-dict :model.sync="acceptForm.entrustInfo.repeatReason"
                                                      data_type="repeat_auth_reason"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="{span:18}" :md="{span:18}" :xl="{span:12,offset:1}">
                                <el-form-item
                                        :label="AcceptField.entrusting_unit.label"
                                        prop="entrustInfo.entrustingUnit"
                                        :rules='$filter_rules({required:AcceptField.entrusting_unit.required})'
                                        v-if="AcceptField.entrusting_unit&&acceptForm.entrustInfo.entrustingPartyType=='UNIT'">
                                    <select-client :model.sync="acceptForm.entrustInfo.entrustingUnit"></select-client>
                                </el-form-item>
                                <el-form-item
                                        :label="AcceptField.entrusting_person.label"
                                        prop="entrustInfo.entrustingParty"
                                        :rules='$filter_rules({required:AcceptField.entrusting_person.required})'
                                        v-if="AcceptField.entrusting_person&&acceptForm.entrustInfo.entrustingPartyType!='UNIT'">
                                    <el-input v-model.trim="acceptForm.entrustInfo.entrustingParty"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.contact.label" v-if="AcceptField.contact"
                                              prop="entrustInfo.contact.name"
                                              :rules="$filter_rules({required:AcceptField.contact.required})">
                                    <el-input v-model.trim="acceptForm.entrustInfo.contact.name"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.contact_phone.label" v-if="AcceptField.contact_phone"
                                              prop="entrustInfo.contact.phone"
                                              :rules="$filter_rules({required:AcceptField.contact_phone.required})">
                                    <el-input v-model.trim="acceptForm.entrustInfo.contact.phone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.contact_address.label"
                                              v-if="AcceptField.contact_address">
                                    <el-input v-model.trim="acceptForm.entrustInfo.contact.address"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--</el-row>-->
                            <!--<el-row >-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.case_type.label" v-if="AcceptField.case_type">
                                    <select-from-dict :model.sync="acceptForm.entrustInfo.caseType"
                                                      data_type="case_type"
                                                      className="multiple-select"></select-from-dict>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.statistics_type.label"
                                              v-if="AcceptField.statistics_type">
                                    <el-input v-model.trim="acceptForm.entrustInfo.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.case_category.label" v-if="AcceptField.case_category">
                                    <select-from-dict data_type="case_category"
                                                      :model.sync="acceptForm.entrustInfo.caseCategory"></select-from-dict>
                                </el-form-item>
                            </el-col>
                            <!--</el-row>-->
                            <!--<el-row >-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.is_avoid.label" v-if="AcceptField.is_avoid"
                                              :rules="$filter_rules({required:AcceptField.is_avoid.required})"
                                              prop="entrustInfo.withdrawalNeed">
                                    <el-radio-group v-model="acceptForm.entrustInfo.withdrawalNeed">
                                        <el-radio label="Y">是</el-radio>
                                        <el-radio label="N">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <div v-if="acceptForm.entrustInfo.withdrawalNeed=='Y'">
                                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                    <el-form-item :label="AcceptField.avoid_person.label"
                                                  v-if="AcceptField.avoid_person"
                                                  :rules="$filter_rules({required: AcceptField.avoid_person.required})"
                                                  prop="entrustInfo.caseWithdrawalList">
                                        <select-from-table
                                                class-name="multiple-select"
                                                :model.sync="acceptForm.entrustInfo.caseWithdrawalList"
                                                :multiple="true"
                                                port="hrStaff"
                                                :clearable="true"></select-from-table>
                                    </el-form-item>
                                </el-col>
                                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.md">
                                    <el-form-item :label="AcceptField.avoid_reason.label"
                                                  v-if="AcceptField.avoid_reason" prop="entrustInfo.withdrawalReason">
                                        <el-input v-model="acceptForm.entrustInfo.withdrawalReason"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>


                            <!--<el-row >-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.is_urgent.label" v-if="AcceptField.is_urgent"
                                              :rules="$filter_rules({required:AcceptField.is_urgent.required})"
                                              prop="entrustInfo.urgent">
                                    <el-radio-group v-model="acceptForm.entrustInfo.urgent">
                                        <el-radio label="Y">是</el-radio>
                                        <el-radio label="N">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.is_material_all.label"
                                              v-if="AcceptField.is_material_all"
                                              :rules="$filter_rules({required:AcceptField.is_material_all.required})">
                                    <el-radio-group v-model="acceptForm.entrustInfo.materialAllReady">
                                        <el-radio label="Y">是</el-radio>
                                        <el-radio label="N">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.accept_station.label"
                                              v-if="AcceptField.accept_station">
                                    <select-from-table :model.sync="acceptForm.acceptStation" port="acceptStation"
                                                       className="multiple-select"></select-from-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="{span:24}" :md="{span:24}" :xl="{span:12,offset:1}">
                                <el-form-item :label="AcceptField.base_case_detail.label"
                                              v-if="AcceptField.base_case_detail"
                                              :rules="$filter_rules({required:AcceptField.base_case_detail.required})">
                                    <el-input v-model="acceptForm.entrustInfo.entrustingDesc" type="textarea"
                                              :autosize="{minRows:4,maxRows:20}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="{span:24}" :md="{span:24}" :xl="{span:12,offset:1}">
                                <el-form-item :label="AcceptField.remarks.label" v-if="AcceptField.remarks "
                                              :rules="$filter_rules({required:AcceptField.remarks.required})">
                                    <el-input v-model="acceptForm.remarks" type="textarea"
                                              :autosize="{minRows:2,maxRows:20}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </Collapse>
                <!--既往鉴定史-start-->
                <div class="portlet" v-if="acceptForm.entrustInfo.repeat=='Y'">
                    <div class="portlet-header">
                        <span v-if="AcceptField.auth_history">{{AcceptField.auth_history.label}}</span>
                        <el-button type="primary" size="mini" icon="el-icon-plus"
                                   style="float: right;margin-right: 10px;margin-top: 5px" @click="addHistory()">新增
                        </el-button>
                    </div>
                    <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                        <el-table
                                :data="acceptForm.authHistoryList"
                                border
                                style="width: 100%" size="small" stripe>
                            <el-table-column
                                    prop="authOrg"
                                    label="机构名称">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px">
                                        <el-input v-model.trim="scope.row.authOrg"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="caseNo"
                                    label="案件编号">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px">
                                        <el-input v-model.trim="scope.row.caseNo"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="authHistoryAuthenticatorList"
                                    label="本机构参与鉴定的鉴定人">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px">
                                        <el-select v-model="scope.row.authHistoryAuthenticatorList" placeholder="请选择"
                                                   :multiple="true">
                                            <!--<el-option-->
                                            <!--v-for="item in options"-->
                                            <!--:key="item.value"-->
                                            <!--:label="item.label"-->
                                            <!--:value="item.value">-->
                                            <!--</el-option>-->
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200%">
                                <template slot-scope="scope">
                                    <el-button type="danger" size="mini" @click.native.prevent="uploadHistory()">上传
                                    </el-button>
                                    <el-button type="danger" size="mini"
                                               @click.native.prevent="deleteHistory(scope.$index,scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div>
                </div>
                <!--鉴定信息-->
                <Collapse :title="AcceptField.auth_info.label" :active="true" v-if="AcceptField.auth_info">
                    <template>
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.case_happen_date.label"
                                              v-if="AcceptField.case_happen_date">
                                    <el-date-picker
                                            style="width: 100%"
                                            v-model="acceptForm.happenDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.entrusting_date.label"
                                              v-if="AcceptField.entrusting_date"
                                              :rules="$filter_rules({required:AcceptField.entrusting_date.required})">
                                    <el-date-picker
                                            style="width: 100%"
                                            v-model="acceptForm.entrustingDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.accept_date.label" v-if="AcceptField.accept_date"
                                              :rules="$filter_rules({required:AcceptField.accept_date.required})">
                                    <el-date-picker
                                            style="width: 100%"
                                            v-model="acceptForm.acceptDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.promise_finish_date.label"
                                              v-if="AcceptField.promise_finish_date" prop="promiseFinishDate"
                                              :rules="$filter_rules({required:(AcceptField.promise_finish_date.required)})">
                                    <el-date-picker
                                            style="width: 100%"
                                            v-model="acceptForm.promiseFinishDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.plan_finish_date.label"
                                              v-if="AcceptField.plan_finish_date" prop="deadline">
                                    <el-col :xl="{span:20}" :md="{span:20}" :sm="{span:20}">
                                        <el-date-picker
                                                style="width:100%"
                                                v-model="acceptForm.deadline"
                                                type="date"
                                                format="yyyy-MM-dd"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                        <span class="font1" v-if="workDay">受理日期后{{workDay}}个工作日</span>
                                    </el-col>
                                    <el-col :xl="{span:3}" :md="{span:3}" :sm="{span:3}">
                                        <el-button type="primary" icon="el-icon-time" size="small" plain @click="byDay">
                                            <!-- <font-awesome-icon icon="calendar-alt"/> -->
                                        </el-button>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.opinion_book_type.label"
                                              v-if="AcceptField.opinion_book_type"
                                              :rules="$filter_rules({required:AcceptField.opinion_book_type.required})">
                                    <select-from-dict
                                            data_type="report_type_flag"
                                            :model.sync="acceptForm.reportTypeFlag"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.case_no_flag.label" v-if="AcceptField.case_no_flag"
                                              :rules="$filter_rules({required:AcceptField.case_no_flag.required})">
                                    <el-select v-model="acceptForm.caseNoFlag" placeholder="请选择">
                                        <el-option
                                                v-for="item in caseMarkOpt"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.case_no.label" v-if="AcceptField.case_no"
                                              :rules="$filter_rules({required:AcceptField.case_no.required})">
                                    <el-select v-model="acceptForm.caseNoType" placeholder="请选择">
                                        <el-option label="手动编号" value=""></el-option>
                                        <el-option label="自动生成" value=""></el-option>
                                        <!-- <el-option label="空号选择" value=""></el-option> -->
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.assist.label" v-if="AcceptField.assist">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="ASSIST"
                                            :model.sync="acceptForm.authenticator.assist"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.auth1.label" v-if="AcceptField.auth1"
                                              :rules="$filter_rules({required:AcceptField.auth1.required})">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTH"
                                            :model.sync="acceptForm.authenticator.auth1"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <!--</el-row>-->
                            <!--<el-row >-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.auth2.label" v-if="AcceptField.auth2">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTH"
                                            :model.sync="acceptForm.authenticator.auth2"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.auth3.label" v-if="AcceptField.auth3">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTH"
                                            :model.sync="acceptForm.authenticator.auth3"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.auth4.label" v-if="AcceptField.auth4">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTH"
                                            :model.sync="acceptForm.authenticator.auth4"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <!--</el-row>-->
                            <!--<el-row >-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.auth5.label" v-if="AcceptField.auth5">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTH"
                                            :model.sync="acceptForm.authenticator.auth5"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.authorized_signatory.label"
                                              v-if="AcceptField.authorized_signatory">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="AUTHORIZED_SIGNATORY"
                                            :model.sync="acceptForm.authenticator.authorized_signatory"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"
                                    v-if="acceptForm.professionCategory">
                                <el-form-item :label="AcceptField.reviewer.label" v-if="AcceptField.reviewer">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="REVIEWER"
                                            :model.sync="acceptForm.authenticator.reviewer"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <!--</el-row>-->
                            <!--<el-row>-->
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.issuer.label" v-if="AcceptField.issuer">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="ISSUER"
                                            :model.sync="acceptForm.authenticator.issuer"></select-qualification>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.sales.label" v-if="AcceptField.sales">
                                    <select-from-table
                                            :model.sync="acceptForm.professionCategory"
                                            port="role"
                                            :clearable="true"></select-from-table>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item :label="AcceptField.lab_staff.label" v-if="AcceptField.lab_staff">
                                    <select-qualification
                                            :profession_category="acceptForm.professionCategory.id"
                                            qualification_type="LAB_STAFF"
                                            :model.sync="acceptForm.authenticator.labStaff"></select-qualification>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </Collapse>
                <!--鉴定对象-->
                <Portlet :title="AcceptField.anthenticated_target.label" :isKey="true"
                         v-if="AcceptField.anthenticated_target">
                    <template slot="buttonGroup">
                        <el-button type="primary" icon="el-icon-plus" size="mini"
                                   style="float: right;margin-right: 10px;margin-top: 5px"
                                   @click="addIdentifiedObject()">增加
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-tabs type="border-card" v-model="activeName">
                            <el-tab-pane label="车" name="vehicle">
                                <el-table
                                        :data="acceptForm.authenticatedVehicleList"
                                        stripe
                                        fit
                                        border
                                        size="mini"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="plateNumber"
                                            label="对象名称">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.plateNumber'"
                                                    label-width="0px">
                                                <el-input
                                                        v-model="scope.row.plateNumber"
                                                        size="small"
                                                        @change="vehicleChange(scope.$index,scope.row)"
                                                        @blur="inputBlur(scope.$index,scope.row,acceptForm.authenticatedVehicleList)"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="vehicleType"
                                            label="车辆类型">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.vehicleType'"
                                                    label-width="0px">
                                                <select-from-dict :model.sync="scope.row.vehicleType"
                                                                  data_type="vehicle_type"></select-from-dict>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="brand"
                                            label="品牌">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'authenticatedVehicleList.' + scope.$index + '.brand'"
                                                          label-width="0px">
                                                <el-input v-model="scope.row.brand" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="vin"
                                            label="车辆识别代码">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'authenticatedVehicleList.' + scope.$index + '.vin'"
                                                          label-width="0px">
                                                <el-input v-model="scope.row.vin" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="contact"
                                            label="联系人">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.contact'"
                                                    label-width="0px">
                                                <el-input v-model="scope.row.contact" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="contactPhone"
                                            label="联系电话">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.contactPhone'"
                                                    label-width="0px">
                                                <el-input v-model="scope.row.contactPhone" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="parkingAddress"
                                            label="停放地点">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.parkingAddress'"
                                                    label-width="0px">
                                                <el-input v-model="scope.row.parkingAddress" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="remarks"
                                            label="备注">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    :prop="'authenticatedVehicleList.' + scope.$index + '.remarks'"
                                                    label-width="0px">
                                                <el-input v-model="scope.row.remarks" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="操作" width="80px" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                                       @click="deleteVehicleRow(scope.$index, scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="人" name="person">
                                <el-table
                                        :data="acceptForm.authenticatedPersonList"
                                        stripe
                                        fit
                                        border
                                        size="mini"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="name"
                                            label="姓名">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.name'"
                                                    :rules="$filter_rules({required:true})">
                                                <el-input v-model="scope.row.name" size="small"
                                                          @change="personChange(scope.$index,scope.row)"
                                                          @blur="inputBlur(scope.$index,scope.row,acceptForm.authenticatedPersonList)"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="nationality"
                                            label="民族">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.nationality'">
                                                <select-from-dict :model.sync="scope.row.nationality"
                                                                  data_type="nationality"></select-from-dict>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="sex"
                                            label="性别">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.sex'">
                                                <el-select v-model="scope.row.sex" placeholder="请选择" size="small">
                                                    <el-option label="男" value="M"></el-option>
                                                    <el-option label="女" value="F"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="age"
                                            label="年龄">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.age'">
                                                <el-input v-model.number="scope.row.age" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="inspectAddress"
                                            label="家庭住址">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.inspectAddress'">
                                                <el-input v-model="scope.row.inspectAddress" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="idNumber"
                                            label="身份证号码">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.idNumber'">
                                                <el-input v-model="scope.row.idNumber" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="contact"
                                            label="联系人">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.contact'">
                                                <el-input v-model="scope.row.contact" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="contactPhone"
                                            label="联系电话">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.contactPhone'">
                                                <el-input v-model="scope.row.contactPhone" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="remarks"
                                            label="备注">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedPersonList.' + scope.$index + '.remarks'">
                                                <el-input v-model="scope.row.remarks" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="操作" width="80px" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                                       @click="deletePersonRow(scope.$index, scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="物" name="object">
                                <el-table
                                        fit
                                        :data="acceptForm.authenticatedOtherList"
                                        stripe
                                        border
                                        size="mini"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="name"
                                            label="名称">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedOtherList.' + scope.$index + '.name'"
                                                    :rules="$filter_rules({required:true})">
                                                <el-input v-model="scope.row.name" size="small"
                                                          @change="otherChange(scope.$index,scope.row)"
                                                          @blur="inputBlur(scope.$index,scope.row,acceptForm.authenticatedOtherList)"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="authAddress"
                                            label="鉴定地点">
                                        <template slot-scope="scope">
                                            <el-form-item
                                                    label-width="0px"
                                                    :prop="'authenticatedOtherList.' + scope.$index + '.authAddress'">
                                                <el-input v-model="scope.row.authAddress" size="small"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="操作" width="80px" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                                       @click="deleteOtherRow(scope.$index, scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </Portlet>
                <!--物证样本-->
                <Portlet :title="AcceptField.material_evidence_sample.label" :isKey="true"
                         v-if="professionCategoryType=='DNA'">
                    <template slot="buttonGroup">
                        <el-button type="primary" icon="el-icon-plus" size="mini"
                                   style="float: right;margin-right: 10px;margin-top: 5px" @click="addDNASample()">增加
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                :data="acceptForm.dnaSampleList"
                                stripe
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    fixed
                                    prop="sampleNo"
                                    width="200%"
                                    label="样本编号">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sampleNo'">
                                        <el-input v-model="scope.row.sampleNo" size="small"
                                                  @blur="sampleNoBlur(scope.$index,scope.row,acceptForm.dnaSampleList)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    width="200%"
                                    label="姓名">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.name'">
                                        <el-input v-model="scope.row.name" size="small"
                                                  @change="dnaSampleChange(scope.$index,scope.row)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="150%"
                                    prop="nationality"
                                    label="民族">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.nationality'">
                                        <select-from-dict :model.sync="scope.row.nationality"
                                                          data_type="nationality"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="150%"
                                    prop="isIdenticalTwins"
                                    label="是否同卵胞胎">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.isIdenticalTwins'">
                                        <el-select v-model="scope.row.isIdenticalTwins" placeholder="请选择" size="small">
                                            <el-option label="是" value="1"></el-option>
                                            <el-option label="否" value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="tested"
                                    width="150%"
                                    label="是否是被检人">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.tested'">
                                        <el-select v-model="scope.row.tested" placeholder="请选择" size="small">
                                            <el-option label="是" value="Y"></el-option>
                                            <el-option label="否" value="N"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="credentialNo"
                                    width="200%"
                                    label="证件号">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.credentialNo'">
                                        <el-input v-model="scope.row.credentialNo" size="small" @change="credentialNoChange"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="birthDate"
                                    width="200%"
                                    label="出生日期">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.birthDate'">
                                        <el-date-picker
                                                style="width: 100%"
                                                v-model="scope.row.birthDate"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="age"
                                    width="150%"
                                    label="年龄（岁）">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.age'">
                                        <el-input v-model.number="scope.row.age" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="month"
                                    width="150%"
                                    label="年龄（月）">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.month'">
                                        <el-input v-model.number="scope.row.month" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="relation"
                                    width="150%"
                                    label="关系">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.relation'">
                                        <select-from-dict :model.sync="scope.row.relation"
                                                          data_type="relation"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sex"
                                    width="150%"
                                    label="性别">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sex'">
                                        <el-select v-model="scope.row.sex" placeholder="请选择" size="small">
                                            <el-option label="男" value="M"></el-option>
                                            <el-option label="女" value="F"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="transfused"
                                    width="150%"
                                    label="有输血">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.transfused'">
                                        <el-select v-model="scope.row.transfused" placeholder="请选择" size="small">
                                            <el-option label="无" value="0"></el-option>
                                            <el-option label="有" value="1"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    width="200%"
                                    label="住址">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.address'">
                                        <el-input v-model="scope.row.address" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="dnaSampleTypeList"
                                    width="300%"
                                    label="样品类型">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.dnaSampleTypeList'">
                                        <select-from-dict :model.sync="scope.row.dnaSampleTypeList"
                                                          data_type="sample_types" :multiple=true></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="bearer"
                                    width="200%"
                                    label="承载物">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.bearer'">
                                        <el-input v-model="scope.row.bearer" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    width="150%"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.quantity'">
                                        <el-input v-model.number="scope.row.quantity" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleUnit"
                                    width="150%"
                                    label="单位">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sampleUnit'">
                                        <select-from-dict :model.sync="scope.row.sampleUnit"
                                                          data_type="sample_unit"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleCharacter"
                                    width="150%"
                                    label="样品性状">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sampleCharacter'">
                                        <select-from-dict :model.sync="scope.row.sampleCharacter"
                                                          data_type="sample_character"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="colour"
                                    width="150%"
                                    label="颜色">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.colour'">
                                        <el-input v-model="scope.row.colour" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="size"
                                    width="150%"
                                    label="大小">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.size'">
                                        <el-input v-model="scope.row.size" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="packaging"
                                    width="150%"
                                    label="包装">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.packaging'">
                                        <el-input v-model="scope.row.packaging" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleSource"
                                    width="200%"
                                    label="样本来源">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sampleSource'">
                                        <select-from-dict :model.sync="scope.row.sampleSource"
                                                          data_type="sample_source"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleDesc"
                                    width="200%"
                                    label="样本描述">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.sampleDesc'">
                                        <el-input v-model="scope.row.sampleDesc" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="storePeriod"
                                    width="200%"
                                    label="保存期限">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.storePeriod'">
                                        <el-date-picker
                                                style="width: 100%"
                                                v-model="scope.row.storePeriod"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="extractWay"
                                    width="150%"
                                    label="取样方式">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.extractWay'">
                                        <select-from-dict :model.sync="scope.row.extractWay"
                                                          data_type="sample_extract_way"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="acceptDate"
                                    width="200%"
                                    label="受理日期">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.acceptDate'">
                                        <el-date-picker
                                                style="width: 100%"
                                                v-model="scope.row.acceptDate"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="handleWay"
                                    width="150%"
                                    label="处理方式">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'dnaSampleList.' + scope.$index + '.handleWay'">
                                        <select-from-dict :model.sync="scope.row.handleWay"
                                                          data_type="handle_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200px" fixed="right" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-upload" size="mini"></el-button>
                                   <!--  <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                                    <Czur :model.sync="scope.row.images"></Czur>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deleteDNARow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--毒物样本-->
                <Portlet :title="AcceptField.poison_sample.label" :isKey="true" v-if="professionCategoryType=='POISON'">
                    <template slot="buttonGroup">
                        <el-button type="primary" icon="el-icon-upload2" size="mini"
                                   style="float: right;margin-right: 10px;margin-top: 5px" @click="addPoSample()">增加
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                :data="acceptForm.poSampleList"
                                stripe
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    fixed
                                    prop="sampleNo"
                                    width="200%"
                                    label="样本编号">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sampleNo'">
                                        <el-input v-model="scope.row.sampleNo" size="small"
                                                  @blur="sampleNoBlur(scope.$index,scope.row,acceptForm.poSampleList)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleName"
                                    width="200%"
                                    label="样品名称">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sampleName'">
                                        <el-input v-model="scope.row.sampleName" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="authPersonName"
                                    width="200%"
                                    label="被检人">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.authPersonName'">
                                        <el-input v-model="scope.row.authPersonName" size="small"
                                                  @change="poSampleChange(scope.$index,scope.row)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sex"
                                    width="150%"
                                    label="性别">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sex'">
                                        <el-select v-model="scope.row.sex" placeholder="请选择" size="small">
                                            <el-option label="男" value="M"></el-option>
                                            <el-option label="女" value="F"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="credentialNo"
                                    width="200%"
                                    label="证件号">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.credentialNo'">
                                        <el-input v-model="scope.row.credentialNo" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="vesselNum"
                                    width="200%"
                                    label="采血管编号">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.vesselNum'">
                                        <el-input v-model="scope.row.vesselNum" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sampleResource"
                                    width="200%"
                                    label="样本来源">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sampleResource'">
                                        <el-input v-model="scope.row.sampleResource" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    width="150%"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.quantity'">
                                        <el-input v-model.number="scope.row.quantity" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="standard"
                                    width="150%"
                                    label="规格">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.standard'">
                                        <select-from-dict :model.sync="scope.row.standard"
                                                          data_type="	standard"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="volumeQuality"
                                    width="150%"
                                    label="体积质量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.volumeQuality'">
                                        <el-input v-model.number="scope.row.volumeQuality" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="acceptTime"
                                    width="150%"
                                    label="接收时间">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.acceptTime'">
                                        <el-date-picker
                                                style="width: 100%"
                                                v-model="scope.row.acceptTime"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="volumeQuality"
                                    width="150%"
                                    label="接收人">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.acceptPerson'">
                                        <el-input v-model.number="scope.row.acceptPerson" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="materialCharacter"
                                    width="150%"
                                    label="检材性状">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.materialCharacter'">
                                        <el-input v-model.number="scope.row.materialCharacter" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="packagingCharacter"
                                    width="200%"
                                    label="包装状况">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.packagingCharacter'">
                                        <select-from-dict :model.sync="scope.row.packagingCharacter"
                                                          data_type="packaging_character"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sendAuthPerson"
                                    width="150%"
                                    label="送检人">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sendAuthPerson'">
                                        <el-input v-model.number="scope.row.sendAuthPerson" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sendAuthTelephone"
                                    width="150%"
                                    label="送检人电话">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sendAuthTelephone'">
                                        <el-input v-model.number="scope.row.sendAuthTelephone" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sendAuthTime"
                                    width="150%"
                                    label="送检时间">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.sendAuthTime'">
                                        <el-date-picker
                                                style="width: 100%"
                                                v-model="scope.row.sendAuthTime"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="handle"
                                    width="150%"
                                    label="处理方式">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'poSampleList.' + scope.$index + '.handleType'">
                                        <select-from-dict :model.sync="scope.row.handleType"
                                                          data_type="handle_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200px" fixed="right" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-upload" size="mini"></el-button>
                                    <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                                    <Czur :model.sync="scope.row.images"></Czur>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deletePoRow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--委托鉴定事项-->
                <Portlet :title="AcceptField.entrusting_auth_item.label" :isKey="true"
                         v-if="AcceptField.entrusting_auth_item">
                    <template slot="buttonGroup">
                        <el-button type="primary"
                                   icon="el-icon-upload2"
                                   size="mini"
                                   style="float: right;margin-right: 10px;margin-top: 5px"
                                   @click="importEntrustMatter()">导入
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                :data="acceptForm.entrustingMatterList"
                                stripe
                                fit
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    prop="entrustingMatter.name"
                                    label="委托事项">
                            </el-table-column>
                            <el-table-column
                                    prop="entrustingSubMatter"
                                    label="细项">
                                <template slot-scope="scope">
             <span v-if="scope.row.entrustingSubMatter">
              {{transform(scope.row.entrustingSubMatter)}}
             </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="entrustingMatterTargetList"
                                    label="被鉴定对象/样本">
                                <template slot-scope="scope">
              <span v-if="scope.row.entrustingMatterTargetList">
              {{transform(scope.row.entrustingMatterTargetList)}}
             </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="description"
                                    label="描述">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'entrustingMatterList.' + scope.$index + '.description'"
                                                  :rules="$filter_rules({required:true})">
                                        <el-input v-model="scope.row.description"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'entrustingMatterList.' + scope.$index + '.quantity'">
                                        <el-input-number size="small" v-model="scope.row.quantity"
                                                         controls-position="right"></el-input-number>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="entrustingMatterStandardList"
                                    label="检验标准">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'entrustingMatterList.' + scope.$index +'.entrustingMatterStandardList'">
                                        <select-from-table
                                                :model.sync="scope.row.entrustingMatterStandardList"
                                                port="standard"
                                                :condition="professionCategory"
                                                :multiple="true"
                                                :clearable="true"></select-from-table>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="350px" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="importObj(scope.$index,scope.row)">
                                        导入被鉴定对象
                                    </el-button>
                                    <el-button type="primary" size="mini" @click="importPoison(scope.$index,scope.row)">
                                        导入毒物物品
                                    </el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deleteMatterRow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--收费项目-->
                <Portlet :title="AcceptField.charge_item.label" :isKey="true" v-if="AcceptField.charge_item">
                    <template slot="buttonGroup">
                        <el-button
                                type="primary"
                                icon="el-icon-upload2"
                                size="mini"
                                style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="importPayItem()">标准价导入
                        </el-button>
                        <el-button
                                type="primary"
                                icon="el-icon-upload2"
                                size="mini"
                                style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="importPayItem()">协议价导入
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                fit
                                :data="acceptForm.chargingItemList"
                                stripe
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    prop="chargingItem.name"
                                    label="收费项目">
                            </el-table-column>
                            <el-table-column
                                    prop="chargingItem.chargingType.name"
                                    label="收费类别">
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'chargingItemList.' + scope.$index + '.quantity'">
                                        <el-input v-model.number="scope.row.quantity" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="unitPrice.yuanFmt"
                                    label="单价">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'chargingItemList.' + scope.$index + '.unitPrice'">
                                        <el-input v-model.number="scope.row.unitPrice.yuanFmt" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="total"
                                    label="金额">
                                <template slot-scope="scope">
                                    {{parseInt(scope.row.unitPrice.yuanFmt)*scope.row.quantity}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="remarks"
                                    label="备注">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'chargingItemList.' + scope.$index + '.remarks'">
                                        <el-input v-model="scope.row.remarks" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="80px" align="center">
                                <template slot-scope="scope">
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deletePayRow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--鉴定材料-->
                <Portlet :title="AcceptField.auth_material.label" v-if="AcceptField.auth_material">
                    <template slot="buttonGroup">
                        <el-button
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="addCriticalMaterials()">增加
                        </el-button>
                        <el-button
                                type="primary"
                                icon="el-icon-upload2"
                                size="mini" style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="importCriticalMaterials('normal')">导入
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                fit
                                :data="acceptForm.inspectionMaterialListNormal"
                                stripe
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    width="200%"
                                    label="送检材料名称">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.name'">
                                        <el-input v-model="scope.row.name" size="small"
                                                  @blur="inputBlur(scope.$index,scope.row,acceptForm.inspectionMaterialListNormal)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    label="类型">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.type'">
                                        <select-from-dict :model.sync="scope.row.type"
                                                          data_type="material_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.quantity'">
                                        <el-input v-model.number="scope.row.quantity" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="unit"
                                    label="规格">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.unit'">
                                        <select-from-dict :model.sync="scope.row.unit"
                                                          data_type="unit_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="acceptDate"
                                    width="200%"
                                    label="接收时间">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.acceptDate'">
                                        <el-date-picker
                                                v-model="scope.row.acceptDate"
                                                style="width: 100%"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="property"
                                    label="材料性质">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.property'">
                                        <select-from-dict :model.sync="scope.row.property"
                                                          data_type="material_property"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="handleType"
                                    label="处理方式">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.handleType'">
                                        <select-from-dict :model.sync="scope.row.handleType"
                                                          data_type="handle_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="submitMaterialPerson"
                                    label="送检人">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.submitMaterialPerson'">
                                        <el-input v-model="scope.row.submitMaterialPerson" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="submitMaterialPhone"
                                    label="联系电话">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListNormal.' + scope.$index + '.submitMaterialPhone'">
                                        <el-input v-model="scope.row.submitMaterialPhone" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200px" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-upload" size="mini"></el-button>
                                   <!--  <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                                   <Czur :model.sync="scope.row.images"></Czur>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deleteMaterialRow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--待补充鉴定材料-->
                <Portlet :title="AcceptField.waiting_add_auth_material.label"
                         v-if="acceptForm.entrustInfo.materialAllReady=='N'">
                    <template slot="buttonGroup">
                        <el-button
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="addWaitingSendMaterials()">增加
                        </el-button>
                        <el-button
                                type="primary"
                                icon="el-icon-upload2"
                                size="mini" style="float: right;margin-right: 10px;margin-top: 5px"
                                @click="importCriticalMaterials('waitingSend')">导入
                        </el-button>
                    </template>
                    <template slot="body">
                        <el-table
                                :data="acceptForm.inspectionMaterialListWaitingSend"
                                fit
                                stripe
                                border
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    width="200%"
                                    label="材料名称">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.name'">
                                        <el-input v-model="scope.row.name" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    label="类型">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.type'">
                                        <select-from-dict :model.sync="scope.row.type"
                                                          data_type="material_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="quantity"
                                    label="数量">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.quantity'">
                                        <el-input v-model.number="scope.row.quantity" size="small"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="unit"
                                    label="规格">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.unit'">
                                        <select-from-dict :model.sync="scope.row.unit"
                                                          data_type="unit_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="property"
                                    label="材料性质">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.property'">
                                        <select-from-dict :model.sync="scope.row.property"
                                                          data_type="material_property"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="handleType"
                                    label="处理方式">
                                <template slot-scope="scope">
                                    <el-form-item
                                            label-width="0px"
                                            :prop="'inspectionMaterialListWaitingSend.' + scope.$index + '.handleType'">
                                        <select-from-dict :model.sync="scope.row.handleType"
                                                          data_type="handle_type"></select-from-dict>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200px" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-upload" size="mini"></el-button>
                                    <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                                    <Czur :model.sync="scope.row.images"></Czur>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click="deleteWaitingMaterialRow(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </Portlet>
                <!--发放信息-->
                <Collapse :title="AcceptField.give_way.label" :active="true" v-if="AcceptField.give_way">
                    <template >
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="发放方式">
                                    <select-from-enum
                                            :model.sync="acceptForm.giveInfo.giveType"
                                            type="ca.GiveType"></select-from-enum>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label-width="0">
                                    <el-checkbox-group v-model="acceptForm.giveInfo.credentialList">
                                        <el-checkbox label="CONTRACT">{{AcceptField.contract.label}}</el-checkbox>
                                        <el-checkbox label="INVOICE">{{AcceptField.invoice.label}}</el-checkbox>
                                        <el-checkbox label="ID_CARD">{{AcceptField.id_card.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </Collapse>
                <div class="footer">
                    <el-button type="success" size="mini" class="save-btn" @click="save()"><i class="fa fa-save"></i> 保存
                    </el-button>
                </div>

            </el-form>
        </div>
        <!--导入委托鉴定事项-->
        <el-dialog title="导入委托鉴定事项" :visible.sync="importEntrustMatterDialog">

            <el-table
                    :data="EntrustArr"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    style="width: 100%"
                    @selection-change="importEntrustSelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="鉴定项目">
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="备注"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="EntrustArr"
                            :search.sync="searchdata"
                            :sort.sync="tablesort"
                            :port="matterPort"></pagination>
                </div>
                <el-button @click="importEntrustMatterDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmImportEntrust()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--导入被鉴定对象-->
        <el-dialog title="导入被鉴定对象" :visible.sync="importIdentifiedObjDialog">
            <el-table
                    :data="importObjArr"
                    tooltip-effect="dark"
                    ref="objTable"
                    stripe
                    border
                    size="mini"
                    style="width: 100%"
                    @selection-change="importObjtSelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="type.label"
                        label="被鉴定对象类型">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="被鉴定对象">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" ref="objFooter">
                <el-button @click="importIdentifiedObjDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmImportObj()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--导入收费项目-->
        <el-dialog title="导入收费项目" :visible.sync="importPayItemDialog">

            <el-table
                    :data="payArr"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    style="width: 100%"
                    @selection-change="importPaySelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="鉴定项目">
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="备注"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page1.current"
                            :page.sync="page1"
                            :data.sync="payArr"
                            :search.sync="searchdata1"
                            :sort.sync="tablesort1"
                            :port="payPort"></pagination>
                </div>
                <el-button @click="importPayItemDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmImportPay()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--导入鉴定材料-->
        <el-dialog title="导入鉴定材料" :visible.sync="importMaterialDialog">

            <el-table
                    :data="materialArr"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    style="width: 100%"
                    @selection-change="importMaterialSelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="鉴定项目">
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="备注"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" ref="importMaterialFooter">
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page2.current"
                            :page.sync="page2"
                            :data.sync="materialArr"
                            :search.sync="searchdata2"
                            :sort.sync="tablesort2"
                            :port="auth"></pagination>
                </div>
                <el-button @click="importMaterialDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmImportMaterial()" size="small">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import portlet from './../layout/Portlet'
    import Collapse from '../layout/Collapse'
    import Select2 from '../../components/common/Select2'
    import Uploadpictures from '../../components/common/Uploadpictures'
    import SelectFromQualification from '../../components/common/SelectFromQualification'
    import api from '../../api/index'
    import Czur from '../../components/common/Czur'

    export default {
        name: "AcceptCase",
        components: {
            'Collapse': Collapse,
            'Select2': Select2,
            'select-qualification': SelectFromQualification,
            'Uploadpictures': Uploadpictures,
            'Portlet': portlet,
            'Czur': Czur
        },
        data() {
            return {
                AcceptField: {},
                professionCategory: {},
                professionCategoryType: '',
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                acceptForm: {
                    professionCategory: {},
                    authenticatorList: [],
                    //鉴定对象
                    authenticatedVehicleList: [], authenticatedPersonList: [], authenticatedOtherList: [],
                    caseWithdrawalList: [],
                    authHistoryList: [],
                    entrustInfo: {contact: {}, entrustingUnit: {name: '',}, entrustingPartyType: ''},

                    entrustingMatterList: [],
                    chargingItemList: [],
                    inspectionMaterialListNormal: [],
                    inspectionMaterialListWaitingSend: [],
                    caSampleList: [],
                    dnaSampleList: [],
                    poSampleList: [],
                    giveInfo: {credentialList: [], giveType: {value: 'SELF_PICK'}}, authenticator: {}
                },
                byPromiseDay: false,
                workDay: '',
                activeName: 'person',
                //委托事项
                importEntrustMatterDialog: false,
                importIdentifiedObjDialog: false,
                importObjArr: [],
                EntrustArr: [],
                matterPort: '',
                page: {pageSizes: [5, 8, 10], pageSize: 10, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                checkedEntrustMatter: [],
                checkedObj: [],
                standardOpt: [],
                //收费项目
                importPayItemDialog: false,
                payArr: [],
                page1: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort1: null,
                searchdata1: {},
                payPort: '',
                checkedPayItem: [],
                //鉴定材料
                importMaterialDialog: false,
                materialArr: [],
                auth: '',
                page2: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort2: null,
                searchdata2: {},
                checkedMaterial: [],
                giveOpt: [],
                caseMarkOpt: [],
            }
        },
        methods: {
            findInArr: function (arr, key, s) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i][key].id == s) {
                        return i;
                    }
                }
                return -1;
            },
            transform(arr) {
                var str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ',';
                }
                return str.substr(0, str.length - 1);
            },
            //输入框编号不能重复
            sampleNoBlur(index, row, arr) {
                var arr1 = [].concat(arr);
                arr1.splice(index, 1);
                var i = this.$findInArr(arr1, 'sampleNo', row.sampleNo);
                if (i != -1) {
                    this.$message({
                        message: '名称不能重复哟！',
                        type: 'warning'
                    });
                    row.sampleNo = '';
                }
            },

            //按工作日
            byDay() {
                if (this.acceptForm.acceptDate) {
                    this.$prompt('请输入工作日', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        // inputPattern: ,
                        // inputErrorMessage: '邮箱格式不正确'
                    }).then(({value}) => {
                        var dateArr = this.acceptForm.acceptDate.split(' ');
                        var data = {acceptDate: dateArr[0].replace(/-/g, "/"), days: value};
                        this.$get(api.caCase + '/date', data).then((res) => {
                            this.workDay = value;
                            this.acceptForm.deadline = res.data;
                        }).catch((err) => {
                            console.log(err)
                        });
                    }).catch(() => {
                    });
                } else {
                    this.$message.error('请先填写受理日期！');
                }

            },
            //按约定时间
            isByPromise() {
                if (this.byPromiseDay) {
                    this.acceptForm.deadline = this.acceptForm.promiseFinishDate;
                } else {
                    this.acceptForm.deadline = '';
                }
            },
            //输入框输入信息不能重复
            inputBlur(index, row, arr) {
                var arr1 = [].concat(arr);
                arr1.splice(index, 1);
                var i = this.$findInArr(arr1, 'name', row.name);
                if (i != -1) {
                    this.$message({
                        message: '名称不能重复哟！',
                        type: 'warning'
                    });
                    row.name = '';
                }
            },
            //增加鉴定材料
            addCriticalMaterials() {
                this.acceptForm.inspectionMaterialListNormal.push({status: {label: '正常', value: 'NORMAL'}});
            },
            //增加待补充鉴定材料
            addWaitingSendMaterials() {
                this.acceptForm.inspectionMaterialListWaitingSend.push({
                    status: {
                        label: '待补充材料',
                        value: 'WAITING_SEND'
                    }
                });
            },
            //导入鉴定材料
            importCriticalMaterials(value) {
                this.$refs.objFooter.setAttribute('status', value);
                this.importMaterialDialog = true;
                this.auth = 'auth';
                this.checkedMaterial = [];
                this.searchdata2 = {'professionCategoryId': this.acceptForm.professionCategory.id};
            },
            importMaterialSelectionChange(selection) {
                this.checkedMaterial = [].concat(selection);
            },
            confirmImportMaterial() {
                var status = this.$refs.importMaterialFooter.getAttribute('status');

                this.checkedMaterial.forEach((v, i) => {
                    if (status == 'normal') {
                        var index = this.$findInArr(this.acceptForm.inspectionMaterialListNormal, 'name', v.name);
                        if (index == -1) {
                            this.acceptForm.inspectionMaterialListNormal.push(
                                {
                                    type: v.materialType,
                                    unit: v.materialUnit,
                                    property: v.materialProperty,
                                    handleType: v.handleType,
                                    name: v.name,
                                    quantity: 1
                                }
                            );
                        }
                    } else {
                        var index = this.$findInArr(this.acceptForm.inspectionMaterialListWaitingSend, 'name', v.name);
                        if (index == -1) {
                            this.acceptForm.inspectionMaterialListWaitingSend.push(
                                {
                                    type: v.materialType,
                                    unit: v.materialUnit,
                                    property: v.materialProperty,
                                    handleType: v.handleType,
                                    name: v.name,
                                    quantity: 1
                                }
                            );
                        }
                    }

                });
                this.importMaterialDialog = false;
            },
            deleteMaterialRow(index, row) {
                this.acceptForm.inspectionMaterialListNormal.splice(index, 1);
            },
            deleteWaitingMaterialRow(index, row) {
                this.acceptForm.inspectionMaterialListWaitingSend.splice(index, 1);
            },
            //导入收费项目
            importPayItem() {
                this.importPayItemDialog = true;
                this.payPort = 'chargeItem';
                this.checkedPayItem = [];
                this.searchdata1 = {'professionCategoryId': this.acceptForm.professionCategory.id};
            },
            importPaySelectionChange(selection) {
                this.checkedPayItem = [].concat(selection);

            },
            confirmImportPay() {
                this.checkedPayItem.forEach((v, i) => {
                    var index = this.findInArr(this.acceptForm.chargingItemList, 'chargingItem', v.id);
                    if (index == -1) {
                        this.acceptForm.chargingItemList.push(
                            {
                                chargingItem: {name: v.name, id: v.id, chargingType: v.chargingType},
                                quantity: 1,
                                unitPrice: v.price,
                                remarks: ''
                            }
                        );
                    }
                });
                this.importPayItemDialog = false;
            },
            deletePayRow(index, row) {
                this.acceptForm.chargingItemList.splice(index, 1);
            },
            //导入委托事项
            importEntrustMatter() {
                this.importEntrustMatterDialog = true;
                this.checkedEntrustMatter = [];
                this.matterPort = 'entrustingMatter';
                this.searchdata = {'professionCategoryId': this.acceptForm.professionCategory.id};
            },

            importEntrustSelectionChange(selection) {
                this.checkedEntrustMatter = [].concat(selection);
            },
            confirmImportEntrust() {
                this.professionCategory = {professionCategoryId: this.acceptForm.professionCategory.id};
                this.checkedEntrustMatter.forEach((v, i) => {
                    var index = this.findInArr(this.acceptForm.entrustingMatterList, 'entrustingMatter', v.id);
                    if (index == -1) {
                        this.acceptForm.entrustingMatterList.push(
                            {entrustingMatter: {id: v.id, name: v.name}, entrustingMatterTargetList: [], quantity: 1}//
                        );
                    }
                });
                this.importEntrustMatterDialog = false;
            },
            deleteMatterRow(index, row) {
                this.acceptForm.entrustingMatterList.splice(index, 1);
            },
            //导入被鉴定样本
            importObj(index, row) {
                this.importIdentifiedObjDialog = true;
                this.importObjArr = [];
                this.$refs.objFooter.setAttribute('index', index);
                //车entrustingMatterTargetList
                //被鉴定人：PERSON，被鉴定车：VEHICLE，被鉴定其他：OTHER，毒物样本：PO_SAMPLE，DNA样本：DNA_SAMPLE
                if (this.acceptForm.authenticatedVehicleList.length) {
                    this.acceptForm.authenticatedVehicleList.forEach((v, i) => {
                        if (v.plateNumber && v.plateNumber != '') {
                            this.importObjArr.push({type: {label: '被鉴定车', value: 'VEHICLE'}, name: v.plateNumber});
                        }
                    })
                }

                //人
                if (this.acceptForm.authenticatedPersonList.length) {
                    this.acceptForm.authenticatedPersonList.forEach((v, i) => {
                        if (v.name && v.name != '') {
                            this.importObjArr.push({type: {label: '被鉴定人', value: 'PERSON'}, name: v.name});
                        }
                    })
                }
                //其他
                if (this.acceptForm.authenticatedOtherList.length) {
                    this.acceptForm.authenticatedOtherList.forEach((v, i) => {
                        if (v.name && v.name != '') {
                            this.importObjArr.push({type: {label: '被鉴定其他', value: 'OTHER'}, name: v.name});
                        }
                    })
                }

                //dna
                if (this.acceptForm.dnaSampleList.length) {
                    this.acceptForm.dnaSampleList.forEach((v, i) => {
                        if (v.name && v.name != '') {
                            this.importObjArr.push({type: {label: 'DNA样本', value: 'DNA_SAMPLE'}, name: v.name});
                        }
                    })
                }
                //毒物
                if (this.acceptForm.poSampleList.length) {
                    this.acceptForm.poSampleList.forEach((v, i) => {
                        if (v.authPersonName && v.authPersonName != '') {
                            this.importObjArr.push({type: {label: '毒物样本', value: 'PO_SAMPLE'}, name: v.authPersonName});
                        }
                    })
                }
                ;
                this.$nextTick(() => {
                    if (row.entrustingMatterTargetList.length) {
                        row.entrustingMatterTargetList.forEach((v, i) => {
                            this.importObjArr.forEach((val, index) => {
                                if (val.name == v.name || v.plateNumber || v.authPersonName) {
                                    this.$refs.objTable.toggleRowSelection(val);
                                }
                            })
                        })
                    }
                })

            },
            importObjtSelectionChange(selection) {
                this.checkedObj = [].concat(selection);
            },
            confirmImportObj() {
                var index = this.$refs.objFooter.getAttribute('index');
                this.acceptForm.entrustingMatterList[index].entrustingMatterTargetList = [];
                this.checkedObj.forEach((v, i) => {
                    this.acceptForm.entrustingMatterList[index].entrustingMatterTargetList.push({
                        "name": v.name,
                        "type": v.type.value
                    });
                });
                this.importIdentifiedObjDialog = false;
            },
            //增加鉴定对象
            addIdentifiedObject() {
                switch (this.activeName) {
                    case 'vehicle':
                        this.acceptForm.authenticatedVehicleList.push({oldName: ''});
                        break;
                    case 'person':
                        this.acceptForm.authenticatedPersonList.push({oldName: ''});
                        break;
                    case 'object':
                        this.acceptForm.authenticatedOtherList.push({oldName: ''});
                        break;
                }
            },
            changeObjName(index, row, arr, key = 'name') {
                if (arr[index].oldName) {
                    if (this.acceptForm.entrustingMatterList.length) {
                        this.acceptForm.entrustingMatterList.forEach((v, i) => {
                            if (v.entrustingMatterTargetList) {
                                v.entrustingMatterTargetList.forEach((m, n) => {
                                    if (m.name == row.oldName) {
                                        m.name = row[key];
                                    }
                                })
                            }

                        })
                    }
                }
                ;
                arr[index].oldName = arr[index][key];
            },
            //被鉴定车名称变更
            vehicleChange(index, row) {
                this.changeObjName(index, row, this.acceptForm.authenticatedVehicleList, 'plateNumber')
            },
            //被鉴定人名称变更
            personChange(index, row) {
                this.changeObjName(index, row, this.acceptForm.authenticatedPersonList)
            },
            //被鉴定物名称变更
            otherChange(index, row) {
                this.changeObjName(index, row, this.acceptForm.authenticatedOtherList)
            },
            //物证名称变更
            dnaSampleChange(index, row) {
                this.changeObjName(index, row, this.acceptForm.dnaSampleList)
            },
            //毒物名称变更
            poSampleChange(index, row) {
                this.changeObjName(index, row, this.acceptForm.poSampleList, 'authPersonName');
            },
            //删除鉴定车辆
            //对比删除导入的鉴定对象
            deleteObj(data, key = 'name') {
                if (this.acceptForm.entrustingMatterList.length) {
                    this.acceptForm.entrustingMatterList.forEach((v, i) => {
                        if (v.entrustingMatterTargetList) {
                            v.entrustingMatterTargetList.forEach((m, n) => {
                                if (m.name == data[key]) {
                                    v.entrustingMatterTargetList.splice(n, 1);
                                }
                            })
                        }

                    })
                }
            },
            deleteVehicleRow(index, row) {
                this.deleteObj(row, 'plateNumber');
                this.acceptForm.authenticatedVehicleList.splice(index, 1);
            },
            //删除鉴定人
            deletePersonRow(index, row) {
                this.deleteObj(row);
                this.acceptForm.authenticatedPersonList.splice(index, 1);

            },
            //删除鉴定物
            deleteOtherRow(index, row) {
                this.deleteObj(row);
                this.acceptForm.authenticatedOtherList.splice(index, 1);
            },
            addHistory() {
                this.acceptForm.authHistoryList.push({authHistoryAuthenticatorList: []});
            },
            deleteHistory(index, row) {
                this.acceptForm.authHistoryList.splice(index, 1)
            },
            //增加物证样本
            addDNASample() {
                this.acceptForm.dnaSampleList.push({oldName: ''});
            },
            //删除物证样本
            deleteDNARow(index, row) {
                this.deleteObj(row);
                this.acceptForm.dnaSampleList.splice(index, 1);
            },
            //增加毒物样本
            addPoSample() {
                this.acceptForm.poSampleList.push({oldName: ''});
            },
            deletePoRow(index, row) {
                this.deleteObj(row, 'authPersonName');
                this.acceptForm.poSampleList.splice(index, 1);
            },
            credentialNoChange(index,row){
                var 
            },

            save() {
                var data = JSON.parse(JSON.stringify(this.acceptForm));
                for (var key in data.authenticator) {
                    data.authenticatorList.push({
                        "participant": {
                            "id": data.authenticator[key]
                        },
                        "caseRole": key.toUpperCase()
                    });
                }
                delete data.authenticator;
                //entrustingMatterStandardList
                data.entrustingMatterList.forEach((v, i) => {
                    v.entrustingMatterStandardList = v.entrustingMatterStandardList.map((value, index) => {
                        return {standard: {id: value}};
                    })
                });
                //物证数据
                data.dnaSampleList.forEach((v, i) => {
                    v.dnaSampleTypeList = v.dnaSampleTypeList.map((value, index) => {
                        return {dnaSampleType: {id: value}};
                    });
                    delete v.oldName;
                });
                data.poSampleList.forEach((v, i) => {
                    delete v.oldName;
                });
                // authenticatedVehicleList:[],authenticatedPersonList:[],authenticatedOtherList:[],
                data.authenticatedVehicleList.forEach((v, i) => {
                    delete v.oldName;
                });
                data.authenticatedPersonList.forEach((v, i) => {
                    delete v.oldName;
                });
                data.authenticatedOtherList.forEach((v, i) => {
                    delete v.oldName;
                });
                if (data.reportTypeFlag) {
                    data.reportTypeFlag = data.reportTypeFlag.label;
                }
                data.giveInfo.credentials = 'INVOICE';
                this.$post(api.caCase + '/ACCEPT', data).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: '受理成功！',
                            type: 'success'
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                });

            }

        },
        watch: {
            'acceptForm.professionCategory': {
                handler(newVal, oldVal) {
                    if (newVal) {
                        this.professionCategoryType = newVal.type.value;
                        this.$get('/api/param/v1/params/value', {
                            professionCategoryId: newVal.id,
                            key: 'case.no.mark'
                        }).then((res) => {
                            if (res.status == 200) {
                                var arr = res.data.split('，');
                                console.log(arr);
                                this.caseMarkOpt = arr;
                            }
                        }).catch((err) => {
                            console.log(err)
                        });
                    }

                },
            },
            'acceptForm.deadline': {
                handler(newVal, oldVal) {
                    if (newVal) {
                        if (this.acceptForm.acceptDate) {
                            var acceptArr = this.acceptForm.acceptDate.split(' ');
                            var completeArr = newVal.split(' ');
                            var data = {
                                acceptDate: acceptArr[0].replace(/-/g, "/"),
                                completeDate: completeArr[0].replace(/-/g, "/")
                            };
                            this.$get(api.caCase + '/date', data).then((res) => {
                                this.workDay = res.data;
                            }).catch((err) => {
                                console.log(err)
                            });
                        } else {
                            this.acceptForm.deadline = '';
                            this.$message.error('请先填写受理日期！');
                        }
                    }
                }
            },
            '$route': function () {
                console.log(this.$route.name, '路由名称')

            }
        },

        created: function () {
            this.$get(api.enum + '/ca.GiveType').then((res) => {
                if (res.status == 200) {
                    this.giveOpt = res.data;
                }
            }).catch((err) => {
                console.log(err)
            });
            this.$get(api.acceptFormField + '/map').then((res) => {
                if (res.status == 200) {
                    this.AcceptField = res.data;
                }
            }).catch((err) => {
                console.log(err)
            });
        },

    }
</script>

<style scoped lang="less">
    .cell {
        .el-form-item__content {
            div {
                /*border: 1px solid red;*/
                margin-top: 10px;
                /*line-height: 23px;*/
                vertical-align: top;
            }

        }
    }

    .footer {
        height: 50px;
        width: 100px;
        text-align: center;
        border-radius: 5px;
        background-color: rgba(144, 147, 153, 0.5);
        text-align: center;
        position: fixed;
        bottom: 20px;
        right: 20px;
        line-height: 45px;
        z-index: 9999;
    }
</style>
