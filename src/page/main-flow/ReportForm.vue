<!--鉴定意见书制作和审核复核页面。 -->
<template>
  <div>
    <!-- <PageBar title1="鉴定主流程" :title2="title2"></PageBar> -->
    <div>
      <el-form
        ref="reportForm"
        label-width="130px"
        size="small"
        :model="reportForm"
        class="demo-ruleForm"
        label-position="right"
      >
        <!-- 案件基本信息-->
        <CaseBasicInfo
          :caseId="$route.query.caseId"
          @getCaseNoFlag="getCaseNoFlag"
        ></CaseBasicInfo>

        <Collapse
          title="签审流程"
          :active="isFlowShow"
          v-show="
            initData.finishedFlows != null && initData.finishedFlows.length > 0
          "
        >
          <template>
            <el-table
              :data="initData.finishedFlows"
              fit
              stripe
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column
                prop="flowStageName"
                label="阶段"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="assignee.hrStaff.name"
                label="签审人"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="createDate"
                label="完成时间"
                width="140"
              ></el-table-column>
              <el-table-column prop="auditResult" label="操作" width="140">
                <template slot-scope="scope">
                  <span v-if="scope.row.auditResult == 'Y'">同意</span>
                  <span v-if="scope.row.auditResult == 'N'">驳回</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="auditComment"
                label="意见"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </template>
        </Collapse>
        <InsertPicToReport
          :imgList="authRecordImgs"
          v-if="initData.finishedFlows.length == 0"
          @changeImgs="changeImgs"
          :baseData.sync="picBaseData"
          :reportImgs="selectedImgs"
        ></InsertPicToReport>
        <Portlet title="鉴定结果/意见">
          <template slot="buttonGroup">
            <el-button
              v-show="false"
              type="primary"
              @click="saveAuthResultAndOpinion"
              size="mini"
              style="float: right; margin-right: 10px; margin-top: 6px"
            >
              保存
            </el-button>
          </template>
          <template slot="body">
            <!--  毒物鉴定结果-->
            <PoisonResult
              v-if="entrustingMatterTypeList.indexOf('POISON') > -1"
              :case-id="caseId"
              :basic-data="authRecordsMsg"
              :model.sync="poisonForm"
              ref="poisonResult"
            ></PoisonResult>
            <!--   酒精检测结果-->
            <AlcoholResult
              v-if="entrustingMatterTypeList.indexOf('ALCOHOL') > -1"
              :case-id="caseId"
              :basic-data="authRecordsMsg"
              :model.sync="alcoholForm"
              ref="alcoholResult"
              :caseNoFlag="caseNoFlag"
              @getComputedTable="getComputedTable"
            ></AlcoholResult>
            <!--物证-->
            <DnaResult
              v-if="professionCategoryType == 'DNA'"
              :case-id="caseId"
              :basic-data="authRecordsMsg"
              :model.sync="dnaForm"
              ref="DnaResult"
            ></DnaResult>
            <!--文书车痕等-->
            <AuthResult
              v-if="judgeArr.indexOf(professionCategoryType) > -1"
              :case-id="caseId"
              :basic-data="authRecordsMsg"
              :model.sync="authResultForm"
              ref="authResult"
            ></AuthResult>
            <el-row>
              <el-col :sm="{ span: 24 }" :md="{ span: 24 }" :xl="{ span: 24 }">
                <el-form-item
                  label="意见"
                  prop="auditComment"
                  :rules="$filter_rules({ required: true })"
                  label-width="60px"
                >
                  <el-input
                    v-model="reportForm.auditComment"
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 22 }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Portlet>

        <Collapse
          title="鉴定人"
          :active="true"
          v-if="
            initData.canSelectAuthenticator == 'Y' &&
            currentUserId == reportForm.auth1
          "
        >
          <template>
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.auth2.label"
                  prop="auth2"
                  :rules="$filter_rules({ required: true, trigger: 'change' })"
                >
                  <!-- acceptFields.auth2.required -->
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="AUTH"
                    :model.sync="reportForm.auth2"
                    :userId="currentUserId"
                  ></select-qualification>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.auth3.label"
                  prop="auth3"
                  :rules="
                    $filter_rules({
                      required: acceptFields.auth3.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="AUTH"
                    :model.sync="reportForm.auth3"
                    :userId="currentUserId"
                  ></select-qualification>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.auth4.label"
                  prop="auth4"
                  :rules="
                    $filter_rules({
                      required: acceptFields.auth4.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="AUTH"
                    :model.sync="reportForm.auth4"
                    :userId="currentUserId"
                  ></select-qualification>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.auth5.label"
                  prop="auth5"
                  :rules="
                    $filter_rules({
                      required: acceptFields.auth5.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="AUTH"
                    :model.sync="reportForm.auth5"
                    :userId="currentUserId"
                  ></select-qualification>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.authorized_signatory.label"
                  prop="authorizedSignatory"
                  :rules="
                    $filter_rules({
                      required: acceptFields.authorized_signatory.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="AUTHORIZED_SIGNATORY"
                    :model.sync="reportForm.authorizedSignatory"
                  ></select-qualification>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.reviewer.label"
                  prop="reviewer"
                  :rules="
                    $filter_rules({
                      required: acceptFields.reviewer.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="REVIEWER"
                    :model.sync="reportForm.reviewer"
                  ></select-qualification>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item
                  :label="acceptFields.issuer.label"
                  prop="issuer"
                  :rules="
                    $filter_rules({
                      required: acceptFields.issuer.required,
                      trigger: 'change',
                    })
                  "
                >
                  <select-qualification
                    :profession_category="initData.professionCategoryId"
                    qualification_type="ISSUER"
                    :model.sync="reportForm.issuer"
                  ></select-qualification>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Collapse>
        <Collapse
          title="签审意见"
          :active="true"
          v-if="
            initData.finishedFlows != null &&
            initData.finishedFlows.length > 0 &&
            formKey == 'REPORT_AUDIT'
          "
        >
          <template>
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item prop="auditResult">
                  <el-select
                    v-model="reportForm.auditResult"
                    placeholder="请选择"
                  >
                    <el-option label="同意" value="Y"></el-option>
                    <el-option label="驳回" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item prop="isNeedReport" label="是否上报">
                  <el-select
                    v-model="reportForm.isNeedReport"
                    placeholder="请选择"
                  >
                    <el-option label="是" value="Y"></el-option>
                    <el-option label="否" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :sm="panClass.sm"
                :md="panClass.md"
                :xl="panClass.xl"
                v-if="reportForm.auditResult == 'N'"
              >
                <el-form-item
                  label="驳回到"
                  :rules="$filter_rules({ required: true })"
                  prop="rejectToNode"
                >
                  <el-select
                    v-model="reportForm.rejectToNode"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="flow in initData.rejectFlowData"
                      :key="flow.taskDefKey"
                      :label="flow.flowStageName"
                      :value="flow.taskDefKey"
                    >
                      <span style="float: left">{{ flow.flowStageName }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ flow.assignee.hrStaff.name }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Collapse>
        <el-input v-model="reportForm.taskId" type="hidden"></el-input>
        <el-input v-model="reportForm.caseId" type="hidden"></el-input>

        <!--<div class="footer">
                    <el-row>
                        <el-col :sm="{span:4}" :md="{span:4}" :xl="{span:24}">
                            <el-button type="primary" @click="save()">
                                <i class="fa fa-save"></i> 保存
                            </el-button>
                        </el-col>
                        <el-col :sm="{span:4}" :md="{span:4}" :xl="{span:24}">
                            <el-button type="success" @click="saveAndComplete()">
                                <i class="fa fa-check-circle"></i> 保存且完成
                            </el-button>
                        </el-col>
                    </el-row>
                </div>-->

        <div class="sticky-bottom">
          <span
            style="margin-left: 10px"
            v-if="initData.finishedFlows.length == 0"
          >
            <el-button type="primary" @click="openTemplateDialog()">
              <span v-if="initData.reportFile">重新</span>生成报告
            </el-button>
          </span>
          <span
            style="margin-left: 10px"
            v-if="initData.reportFile || initData.finishedFlows.length > 0"
          >
            <el-button type="primary" @click="openReport()">
              <i class="fa fa-save"></i> &nbsp;打开报告&nbsp;&nbsp;
            </el-button>
          </span>
          <span style="margin-left: 10px">
            <el-button type="primary" @click="save()">
              <i class="fa fa-save"></i> 保存
            </el-button>
          </span>
          <span style="margin-left: 10px">
            <el-button type="success" @click="saveAndComplete()">
              <i class="fa fa-check-circle"></i> 保存且完成
            </el-button>
          </span>
        </div>
      </el-form>
    </div>
    <!-- 报告模板 -->
    <el-dialog title="选择鉴定意见书模板" :visible.sync="reportTemplateDialog">
      <el-table
        :data="reportTemplates"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
      >
        <el-table-column prop="name" label="模板名称"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="mini"
              @click="openReportTemplate(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reportTemplateDialog = false" size="small"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CaseBasicInfo from "../common/CaseBasicInfo";
import Collapse from "../layout/Collapse";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import api from "../../api/index";
import PageOfficeApi from "../../components/tpl/PageOfficeApi";
import PoisonResult from "./auth-result/PoisonResult";

import DnaResult from "./auth-result/DnaResult";

import AlcoholResult from "./auth-result/AlcoholResult";

import AuthResult from "./auth-result/AuthResult";
import Portlet from "@/page/layout/Portlet";
import InsertPicToReport from "./components/insertPicToReport";
import { debounce } from "@/utils/debounce.js";

export default {
  components: {
    InsertPicToReport,
    Collapse: Collapse,
    "select-qualification": SelectFromQualification,
    CaseBasicInfo: CaseBasicInfo,
    AuthResult: AuthResult,
    PoisonResult: PoisonResult,
    DnaResult: DnaResult,
    AlcoholResult: AlcoholResult,
    Portlet: Portlet,
  },
  data() {
    return {
      isFlowShow: false,
      currentUserId: "", //当前用户的Id
      initData: {
        title2: "",
        professionCategoryId: "",
        finishedFlows: [],
        //是否伤残等级鉴定
        isDisabilityLevel: "N",
        //是否损伤程度鉴定
        isDamageDegree: "N",
        doneAuthenticators: [],
        //是否能选择鉴定人（一般是第一鉴定人可以选择）
        canSelectAuthenticator: "",
        reportFile: "",
      },
      reportForm: {
        authOpinion: "",
        auth2: "",
        auth3: "",
        auth4: "",
        auth5: "",
        authorizedSignatory: "",
        reviewer: "",
        issuer: "",
        //损失程度或伤残等级的Id
        resultId: {},
        //驳回到哪个节点
        rejectToNode: "",
        auditComment: "",
        caseId: "",
        taskId: "",
        auditResult: "",
        isNeedReport: "",
      },
      auditResult: "Y",
      isNeedReport: "Y",
      reportTemplateDialog: false, //是否显示选择报告模板的弹出框
      reportTemplates: [], //报告模板
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      formKey: "",
      acceptFields: [],
      judgeArr: [
        "DAMAGE",
        "DISABILITY",
        "TRACE",
        "DOCUMENT",
        "VEHICLE",
        "GENERAL",
      ],
      professionCategoryType: "",
      authResultForm: { authResultList: [] }, //文书车痕病理等
      poisonForm: { poSampleResultList: [] }, //毒物
      dnaForm: { dnaResultDtoList: [] }, //物证
      alcoholForm: {
        //酒精表单
        doubleResultList: [],
        singleResultList: [],
        tertiaryButanolTable: [{}, {}],
      },
      authRecordsMsg: {},
      caseId: "",
      entrustingMatterTypeList: [], //委托事项类别
      caseNoFlag: "",
      computedTable: null,
      authRecordImgs: [],
      picBaseData: { rowImgCount: 2, isRemark: "Y" },
      handleImgChange: null,
      selectedImgs: [],
    };
  },
  created() {
    /*受理字段*/
    this.handleImgChange = debounce(
      () => {
        // //转base64
        // let lens = this.draftDoms.length;
        // if(lens == 0) {
        //
        //     return;
        // }
        // this.filePathArr = [];
        // for (let i = 0; i < lens; i++) {
        //     //设置图片跨域访问
        //
        //     if (!this.draftDoms[i].crossOrigin) {
        //         // this.draftDoms[i].setAttribute('crossorigin', '');
        //         this.draftDoms[i].crossOrigin = "anonymous";
        //         this.draftDoms[i].onload = () => {
        //             //不做任何改动时
        //             //画图
        //
        //             let filePath = this.getBase64Image(this.draftDoms[i], this.draftImgs[i].angle);
        //             let url = this.draftImgs[i].img.photo.url;
        //             let imageType = this.draftImgs[i].img.photo.imageType || url.substring(url.lastIndexOf('.') + 1, url.length)
        //
        //             this.filePathArr.push( {filePath, photoName: this.draftImgs[i].name,imageType});
        //             if(this.filePathArr.length === lens) {
        //                 this.saveReportPics(this.filePathArr);
        //             }
        //         }
        //     } else {
        //         //画图
        //         let filePath = this.getBase64Image(this.draftDoms[i], this.draftImgs[i].angle);
        //
        //         let url = this.draftImgs[i].img.photo.url;
        //         let imageType = this.draftImgs[i].img.photo.imageType || url.substring(url.lastIndexOf('.') + 1, url.length)
        //
        //         this.filePathArr.push( {filePath, photoName: this.draftImgs[i].name,imageType});
        //         if(this.filePathArr.length === lens) {
        //             this.saveReportPics(this.filePathArr);
        //         }
        //     }
        //
        // }
      },
      1000,
      false
    );
    this.$get(api.acceptFormField + "/map")
      .then((res) => {
        if (res.status == 200) {
          this.acceptFields = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.caseId = this.$route.query.caseId;
    this.formKey = this.$route.query.formKey;
    this.title2 = this.$route.query.taskName;
    this.$store.dispatch("login/headerTitleChange", this.title2);
    this.$get(api.reportForm + "/init-data", {
      caseId: this.$route.query.caseId,
      taskId: this.$route.query.taskId,
    })
      .then((res) => {
        if (res.status == 200) {
          this.initData = JSON.parse(JSON.stringify(res.data));
          // this.reportForm = JSON.parse(JSON.stringify(res.data));
          Object.assign(this.reportForm, res.data);
          this.reportForm.caseId = this.$route.query.caseId;
          this.reportForm.taskId = this.$route.query.taskId;
          this.reportForm.procInsId = this.$route.query.procInsId;
          if (this.initData.isNeedReport != "N") {
            this.reportForm.isNeedReport = "Y";
          }
          //驳回的流程进行去重
          this.initData.rejectFlowData = [];
          if (this.initData.finishedFlows.length > 0) {
            this.reportForm.auditResult = "Y";
            var temp = [];
            for (let i = 0; i < this.initData.finishedFlows.length; i++) {
              var flow = this.initData.finishedFlows[i];
              if (flow.taskDefKey == this.initData.taskDefKey) {
                return;
              }
              if (temp.indexOf(flow.flowStageName) == -1) {
                this.initData.rejectFlowData.push(flow);
                temp.push(flow.flowStageName);
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //获取鉴定记录
    this.$get(api.authRecords + "/" + this.$route.query.caseId)
      .then((res) => {
        this.authRecordsMsg = JSON.parse(JSON.stringify(res.data));
        //鉴定记录的照片

        if (this.authRecordsMsg) {
          this.authRecordImgs = this.authRecordsMsg.authPhotoList;
          if (
            this.authRecordsMsg.authResultList &&
            this.authRecordsMsg.authResultList
          ) {
            this.authRecordsMsg.authResultList.forEach((v, i) => {
              if (
                v.caEntrustingMatter.entrustingMatter.key.value ==
                "DAMAGE_DEGREE"
              ) {
                this.reportForm.resultId["DAMAGE_DEGREE"] = {
                  id: v.result ? v.result.id : null,
                  label: v.result ? v.result.label : "",
                };
              }
              if (
                v.caEntrustingMatter.entrustingMatter.key.value ==
                "DISABILITY_LEVEL"
              ) {
                this.reportForm.resultId["DISABILITY_LEVEL"] = {
                  id: v.result ? v.result.id : null,
                  label: v.result ? v.result.label : "",
                };
              }
              //文书
              if (
                v.caEntrustingMatter.entrustingMatter.key.value == "GENERAL"
              ) {
                this.reportForm.resultId["GENERAL"] = {
                  id: v.result ? v.result.id : null,
                  label: v.result ? v.result.label : "",
                };
              }
            });
          }

          //酒精检验记录
          this.professionCategoryType =
            this.authRecordsMsg.professionCategory.type.value;
          if (
            this.professionCategoryType === "POISON" &&
            res.data.authAlcoholResultList.length > 0
          ) {
            this.$nextTick(() => {
              this.$refs["alcoholResult"].init(this.caseNoFlag);
            });

            if (
              res.data.authAlcoholResultList[0] &&
              res.data.authAlcoholResultList[0].tertiaryButanol1 &&
              res.data.authAlcoholResultList[0].tertiaryButanol1.length > 0
            ) {
              //叔丁醇
              let obj1 = {
                alcohol: res.data.authAlcoholResultList[0].alcohol1,
                tertiaryButanol:
                  res.data.authAlcoholResultList[0].tertiaryButanol1,
              };

              let obj2 = {
                alcohol: res.data.authAlcoholResultList[0].alcohol2,
                tertiaryButanol:
                  res.data.authAlcoholResultList[0].tertiaryButanol2,
              };
              this.alcoholForm.tertiaryButanolTable = [obj1, obj2];
            } else {
              if (
                res.data.authAlcoholResultList[0] &&
                res.data.authAlcoholResultList[0].content3
              ) {
                //双通道时
                let length = res.data.authAlcoholResultList.length;
                var doubleResultList1 = [];
                for (let i = 0; i < length; i++) {
                  const obj1 = Object.assign(
                    {},
                    res.data.authAlcoholResultList[i],
                    {
                      content1: res.data.authAlcoholResultList[i].content1,
                      content2: res.data.authAlcoholResultList[i].content2,
                      content3: res.data.authAlcoholResultList[i].content3,
                      content4: res.data.authAlcoholResultList[i].content4,
                      time: "第一次测试值（mg/100ml）",
                    }
                  );
                  const obj2 = Object.assign(
                    {},
                    res.data.authAlcoholResultList[i],
                    {
                      content1: res.data.authAlcoholResultList[i].content3,
                      content2: res.data.authAlcoholResultList[i].content4,
                      content3: null,
                      content4: null,
                      time: "第二次测试值（mg/100ml）",
                    }
                  );
                  doubleResultList1.push(obj1, obj2);
                }
                this.$set(
                  this.alcoholForm,
                  "doubleResultList",
                  doubleResultList1
                );
                this.path = "TWO_PATH";
              } else {
                this.$set(
                  this.alcoholForm,
                  "singleResultList",
                  res.data.authAlcoholResultList
                );
                this.alcoholForm.doubleResultList = [];
              }
            }
          }
        }
        this.professionCategoryType =
          this.authRecordsMsg.professionCategory.type.value;
        this.authRecordsMsg.entrustingMatterList.forEach((v, i) => {
          if (v.entrustingMatter) {
            this.entrustingMatterTypeList.push(v.entrustingMatter.key.value);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //获取当前用户
    this.$get(api.myInfo).then((res) => {
      var data = JSON.parse(JSON.stringify(res.data));
      this.currentUserId = data.id;
    });
  },
  methods: {
    saveImgs(fn, loadingInstace) {
      //转base64
      let lens = this.draftDoms.length;
      if (lens == 0) {
        loadingInstace.close();
        fn();
        return;
      }
      this.filePathArr = [];

      for (let i = 0; i < lens; i++) {
        //设置图片跨域访问

        if (!this.draftDoms[i].crossOrigin) {
          // this.draftDoms[i].setAttribute('crossorigin', '');
          if (!this.draftDoms[i].src.includes("data:image/")) {
            this.draftDoms[i].src =
              this.draftDoms[i].src + "?v=" + Math.random();
          }

          this.draftDoms[i].crossOrigin = "anonymous";
          this.draftDoms[i].onload = () => {
            //不做任何改动时
            //画图

            let filePath = this.getBase64Image(
              this.draftDoms[i],
              this.draftImgs[i].angle
            );
            let url = this.draftImgs[i].img.photo.url;
            let imageType =
              this.draftImgs[i].img.photo.imageType ||
              url.substring(url.lastIndexOf(".") + 1, url.length);

            this.filePathArr.push({
              filePath,
              photoName: this.draftImgs[i].name,
              imageType,
              index: i,
            });

            if (this.filePathArr.length === lens) {
              this.filePathArr = this.filePathArr.sort(
                (v1, v2) => v1.index - v2.index
              );
              this.saveReportPics(this.filePathArr, fn, loadingInstace);
            }
          };
          this.draftDoms[i].onerror = () => {
            loadingInstace && loadingInstace.close();
          };
        } else {
          //画图
          let filePath = this.getBase64Image(
            this.draftDoms[i],
            this.draftImgs[i].angle
          );

          let url = this.draftImgs[i].img.photo.url;
          let imageType =
            this.draftImgs[i].img.photo.imageType ||
            url.substring(url.lastIndexOf(".") + 1, url.length);

          this.filePathArr.push({
            filePath,
            photoName: this.draftImgs[i].name,
            imageType,
            index: i,
          });
          if (this.filePathArr.length === lens) {
            this.filePathArr = this.filePathArr.sort(
              (v1, v2) => v1.index - v2.index
            );
            this.saveReportPics(this.filePathArr, fn, loadingInstace);
          }
        }
      }
    },
    changeImgs(doms, draftImgs) {
      this.draftImgs = draftImgs;
      this.draftDoms = doms;
      this.handleImgChange();
    },
    getComputedTable(computedTable) {
      this.computedTable = computedTable;
    },
    getCaseNoFlag(caseNoFlag) {
      //获取案鉴字
      this.caseNoFlag = caseNoFlag;
      this.$nextTick(() => {
        this.$refs["alcoholResult"] &&
          this.$refs["alcoholResult"].init(caseNoFlag);
      });
    },
    //获取报告的模板列表
    listTemplates(row) {
      this.$get(api.template, {
        "page.current": 0,
        "page.pageSize": 1000,
        templateType: "REPORT",
        professionCategoryId: this.initData.professionCategoryId,
      })
        .then((res) => {
          this.reportTemplates = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //根据模板Id，生成PageOffice链接，并打开
    openReportTemplate(row) {
      if (
        this.arrPhoto.length > 0 &&
        typeof this.arrPhoto[0].index == "number"
      ) {
        this.arrPhoto.sort((n1, n2) => n1.index - n2.index);
      }
      if (
        this.arrPhoto.length > 0 &&
        typeof this.picBaseData.rowImgCount == "number"
      ) {
        let num = this.picBaseData.rowImgCount;
        this.arrPhoto.forEach((item) => (item.rowCount = num));
      }

      PageOfficeApi.reportMake(
        this.reportForm.caseId,
        row.id,
        this.reportForm.taskId,
        this.arrPhoto,
        this.picBaseData.isRemark
      );
      this.reportTemplateDialog = false;
    },
    //将图片转为base64
    getBase64Image(img, angle) {
      var canvas = document.createElement("canvas");
      if (angle < 0) {
        angle = (angle % 360) + 360;
      }
      if (angle >= 360) {
        angle = angle % 360;
      }
      var ctx = canvas.getContext("2d");
      if (angle == 90) {
        //90°时
        canvas.height = img.naturalWidth;
        canvas.width = img.naturalHeight;
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, 0, -img.naturalHeight);
      }
      if (angle == 0) {
        //0°时
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, 0, 0);
      }
      if (angle == 180) {
        //180°时
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth, -img.naturalHeight);
      }
      if (angle == 270) {
        //270°时
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth, 0);
      }
      /*ctx.rotate(angle * Math.PI / 180);
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);*/
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var dataURL = canvas.toDataURL("image/" + ext);

      return dataURL;
    },
    //直接打开报告
    openReport() {
      PageOfficeApi.reportMake(
        this.reportForm.caseId,
        this.reportForm.templateId,
        this.reportForm.taskId
      );
    },

    //打开报告模板窗口，进行选择模板。
    openTemplateDialog() {
      //转base64
      /*this.draftDoms = document.getElementsByClassName('my-certaintyView-img');*/
      let loadingInstace = this.$loading({
        fullscreen: true,
      });
      let lens = this.draftDoms.length;
      if (lens == 0) {
        loadingInstace.close();
        this.listTemplates();
        this.reportTemplateDialog = true;
      }
      this.arrPhoto = [];
      for (let i = 0; i < lens; i++) {
        //设置图片跨域访问

        if (!this.draftDoms[i].crossOrigin) {
          // this.draftDoms[i].setAttribute('crossorigin', '');
          if (!this.draftDoms[i].src.includes("data:image/")) {
            this.draftDoms[i].src =
              this.draftDoms[i].src + "?v=" + Math.random();
          }
          this.draftDoms[i].crossOrigin = "anonymous";
          this.draftDoms[i].onload = () => {
            //不做任何改动时
            //画图
            let filePath = this.getBase64Image(
              this.draftDoms[i],
              this.draftImgs[i].angle
            );
            this.arrPhoto.push({
              filePath,
              name: this.draftImgs[i].name,
              rowCount: this.draftImgs[i].rowCount,
              index: i,
            });
            if (this.arrPhoto.length === lens) {
              loadingInstace.close();
              this.reportTemplateDialog = true;
              this.listTemplates();
            }
          };
        } else {
          //画图
          let filePath = this.getBase64Image(
            this.draftDoms[i],
            this.draftImgs[i].angle
          );

          this.arrPhoto.push({
            filePath,
            name: this.draftImgs[i].name,
            rowCount: this.draftImgs[i].rowCount,
          });
          if (this.arrPhoto.length === lens) {
            loadingInstace.close();
            this.reportTemplateDialog = true;
            this.listTemplates();
          }
          /*doms[i].removeAttribute('crossOrigin');*/
        }
      }
    },
    save() {
      this.saveAuthResultAndOpinion("save");
    },
    save1() {
      this.$refs["reportForm"].validate((valid) => {
        if (valid) {
          let loadingInstace = this.$loading({
            fullscreen: true,
            text: "正在保存中...",
          });
          var data = JSON.parse(JSON.stringify(this.reportForm));
          data.resultId = "";

          if (this.initData.finishedFlows.length == 0) {
            let p1 = new Promise((resolve, reject) => {
              this.saveImgs(() => {
                resolve();
              }, loadingInstace);
            });

            let p2 = new Promise((resolve, reject) => {
              this.$post(api.reportForm + "/save", data)
                .then((res) => {
                  resolve();
                })
                .catch((err) => {
                  loadingInstace.close();
                });
            });

            Promise.all([p1, p2])
              .then(() => {
                loadingInstace.close();
                this.$message({
                  message: "保存成功！",
                  type: "success",
                });
              })
              .catch((err) => {
                loadingInstace.close();
              });
          } else {
            this.$post(api.reportForm + "/save", data)
              .then((res) => {
                loadingInstace.close();
                if (res.status == 200) {
                  this.$message({
                    message: "保存成功！",
                    type: "success",
                  });
                }
              })
              .catch((err) => {
                loadingInstace.close();
              });
          }
        }
      });
    },
    saveAndComplete() {
      this.saveAuthResultAndOpinion("saveAndComplete");
    },
    saveAndComplete1() {
      this.$refs["reportForm"].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.reportForm));
          if (data.auditResult == "Y") {
            data.rejectToNode = "";
          }
          data.resultId = "";
          //验证是否已经做了报告，或者对报告进行了修改
          var flag = false; //当前任务是否保存过报告
          let p1 = new Promise((resolve, reject) => {
            this.$get(
              "/api/flow-case-task-record/v1/flow-case-task-records/" +
                this.$route.query.taskId
            ).then((res) => {
              if (res.data) {
                if (res.data && res.data.reportFile) {
                  flag = true;
                }
              }
              resolve();
            });
          });
          Promise.all([p1]).then(() => {
            if (flag) {
              this.saveReportForm(data);
            } else {
              if (
                this.initData.finishedFlows &&
                this.initData.finishedFlows.length > 0
              ) {
                this.$confirmBox("您还没有修改报告，是否确认提交?")
                  .then((res) => {
                    this.saveReportForm(data);
                  })
                  .catch((err) => {});
              } else {
                this.$message.error("请先制作报告后再完成任务！");
              }
            }
          });
        }
      });
    },
    //保存报告图片
    saveReportPics(filePathArr, fn, loadingInstace) {
      let imgs = {};
      const { id, caseId } = this.authRecordsMsg;
      imgs.id = id;
      imgs.caseId = caseId;

      // debugger
      imgs.authPhotoList = this.draftImgs.map((item, index) => {
        item = JSON.parse(JSON.stringify(item));
        let img = item.img;
        img.sort = item.index;
        img.photo.image = filePathArr[index].filePath;
        img.photoName = filePathArr[index].photoName;
        img.photo.imageType = filePathArr[index].imageType;

        delete img.createBy;
        delete img.updateBy;

        return img;
      });

      this.$post(api.saveReportPics, imgs)
        .then((res) => {
          this.selectedImgs = res.data;
          this.$nextTick(() => {
            typeof fn === "function" && fn();
          });
        })
        .catch((err) => {
          loadingInstace && loadingInstace.close();
        });
    },
    saveReportForm(data) {
      let loadingInstace = this.$loading({
        fullscreen: true,
        text: "正在保存中...",
      });

      if (this.initData.finishedFlows.length == 0) {
        let p1 = new Promise((resolve, reject) => {
          this.saveImgs(() => {
            resolve();
          }, loadingInstace);
        });

        let p2 = new Promise((resolve, reject) => {
          this.$post(api.reportForm + "/save?complete=1", data)
            .then((res) => {
              if (res.status == 200) {
                resolve();
              }
            })
            .catch((err) => {
              loadingInstace.close();
              this.$message.error(err.errMsg);
            });
        });

        Promise.all([p1, p2])
          .then(() => {
            loadingInstace.close();
            this.$message({
              message: "保存成功！",
              type: "success",
            });
            this.$router.go(-1);
          })
          .catch((err) => {
            loadingInstace.close();
          });
      } else {
        this.$post(api.reportForm + "/save?complete=1", data)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              this.$router.go(-1);
            }
            loadingInstace.close();
          })
          .catch((err) => {
            loadingInstace.close();
            this.$message.error(err.errMsg);
          });
      }

      // this.$post(api.reportForm + '/save?complete=1', data).then((res) => {
      //     if (res.status == 200) {
      //         this.$message({
      //             message: '保存成功！',
      //             type: 'success'
      //         });
      //         this.$router.push({
      //             path: '/mydashboard',
      //         });
      //     }
      // }).catch((err) => {
      //     this.$message.error(err.errMsg);
      // })
    },
    saveAuthResultAndOpinion(type) {
      // authResultForm: {authResultList: []},//文书车痕病理等
      // poisonForm: {poSampleResultList: []},//毒物
      // dnaForm: {dnaResultDtoList: []},//物证
      // alcoholForm: {                       //酒精表单
      //     doubleResultList: [],
      //         singleResultList: [],
      //         tertiaryButanolTable: [{}, {}],
      // },
      let authAlcoholResultList = null;
      /* if (this.alcoholForm.singleResultList.length > 0) {
                    let doublelist = this.alcoholForm.doubleResultList;
                    authAlcoholResultList[0].content1 = doublelist[0].content1;
                    authAlcoholResultList[0].content2 = doublelist[0].content2;
                    authAlcoholResultList[0].content3 = doublelist[1].content1;
                    authAlcoholResultList[0].content4 = doublelist[1].content2;
                    authAlcoholResultList[0].content = (parseFloat(doublelist[0].content1) + parseFloat(doublelist[0].content2) + parseFloat(doublelist[1].content1) + parseFloat(doublelist[1].content2)) / 4
                } */

      //酒精数据处理
      if (this.entrustingMatterTypeList.indexOf("ALCOHOL") > -1) {
        if (this.authRecordsMsg.inputContentFlag === "1") {
          if (
            this.alcoholForm.doubleResultList &&
            this.alcoholForm.doubleResultList.length &&
            this.alcoholForm.doubleResultList[0].content1 !== null
          ) {
            //双通道
            var arr = [].concat(this.alcoholForm.doubleResultList);
            arr.forEach((v, i) => {
              if ((i + 1) % 2 != 0) {
                var a_content = v.content;
                var b_content = arr[i + 1].content;
                v.content3 = arr[i + 1].content1;
                v.content4 = arr[i + 1].content2;
                v.content = v.contentAll;
                v.relativeDifferencea = v.rd;
                v.relativeDifferenceb = arr[i + 1].rd;
                v.averagea = v.avg;
                v.averageb = arr[i + 1].avg;
              }
            });
            let arr1 = [];
            this.alcoholForm.doubleResultList.forEach((v, i) => {
              if (i % 2 == 0) {
                arr1.push(v);
              }
            });
            authAlcoholResultList = [].concat(arr1);
          } else {
            //单通道
            authAlcoholResultList = [].concat(
              this.alcoholForm.singleResultList
            );
          }
        }
        if (this.authRecordsMsg.inputContentFlag === "0") {
          //丁叔醇
          let sample =
            this.authRecordsMsg.authAlcoholResultList[0] &&
            this.authRecordsMsg.authAlcoholResultList[0].sample;
          let id =
            this.authRecordsMsg.authAlcoholResultList[0] &&
            this.authRecordsMsg.authAlcoholResultList[0].id;

          authAlcoholResultList = [].concat(
            this.alcoholForm.tertiaryButanolTable
          );
          authAlcoholResultList.forEach((item) => {
            item.sample = sample;
          });
          delete this.computedTable[0].caseNoFlag;
          delete this.computedTable[0].createBy;
          delete this.computedTable[0].createDate;
          delete this.computedTable[0].delFlag;
          delete this.computedTable[0].delFlag;
          delete this.computedTable[0].orgId;
          delete this.computedTable[0].remarks;
          delete this.computedTable[0].updateBy;
          delete this.computedTable[0].updateDate;
          delete this.computedTable[0].id;

          let obj = JSON.parse(JSON.stringify(this.computedTable[0]));
          obj.alcohol1 = authAlcoholResultList[0].alcohol;
          obj.alcohol2 = authAlcoholResultList[1].alcohol;
          obj.tertiaryButanol1 = authAlcoholResultList[0].tertiaryButanol;
          obj.tertiaryButanol2 = authAlcoholResultList[1].tertiaryButanol;
          obj.sample = sample;
          obj.content1 = authAlcoholResultList[0].content;
          obj.content2 = authAlcoholResultList[1].content;
          obj.vx1 = authAlcoholResultList[0].vx;
          obj.vx2 = authAlcoholResultList[1].vx;
          if (id) {
            obj.id = id;
          }
          authAlcoholResultList = [obj];
        }
      }
      //修改鉴定结果值
      if (this.authRecordsMsg && this.reportForm.resultId) {
        this.authResultForm.authResultList.forEach((item) => {
          if (item.result === "") {
            item.result = null;
          }
        });
      }
      this.$post(api.saveReportFormAuthResultAndOpinion, {
        poSampleResultList: this.poisonForm.poSampleResultList,
        authResultList: this.authResultForm.authResultList,
        dnaResultDtoList: this.dnaForm.dnaResultDtoList,
        authAlcoholResultList: authAlcoholResultList,
        authOpinion: this.reportForm.auditComment,
        caseId: this.caseId,
        taskId: this.$route.query.taskId,
      })
        .then((res) => {
          if (res.status == 200) {
            if (type == "save") {
              this.save1();
            } else {
              this.saveAndComplete1();
            }
          } else {
            this.$message({
              message: "保存鉴定结果/意见失败！",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  /*   watch: {
               'model': {
                   handler(newVal, oldVal) {
                       this.authResultForm = newVal;
                   },
                   deep: true,
                   immediate: true
               },
               authResultForm: {
                   handler(newVal, oldVal) {
                       this.$emit("update:model", newVal);
                   },
                   deep: true,
                   immediate: true
               }
           },*/
};
</script>

<style scoped lang="less">
.footer {
  text-align: center;
}

.sticky-bottom {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}
</style>
