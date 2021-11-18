<!--
  鉴定意见书制作和审核复核页面。
 
  @Author: Simon Shen 
  @Date: 2019-10-18 21:52:01 
  @Last Modified by: Simon Shen
  @Last Modified time: 2019-10-18 21:52:48
 -->
<template>
  <div>
    <PageBar title1="鉴定主流程" :title2="title2"></PageBar>
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
        <CaseBasicInfo :caseId="$route.query.caseId"></CaseBasicInfo>

        <Collapse title="文字校对" :active="true">
          <el-row>
            <el-col :lg="{ span: 12 }">
              <el-form-item label="出案日期" prop="reportOutDate">
                <el-date-picker
                  v-model="reportForm.reportOutDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :sm="panClass.sm"
              :md="panClass.md"
              :xl="panClass.xl"
              v-if="initData.reportFile || initData.finishedFlows.length > 0"
            >
              <el-button type="primary" @click="openReport()">
                <i class="fa fa-save"></i> &nbsp;打开报告&nbsp;&nbsp;
              </el-button>
            </el-col>
          </el-row>
        </Collapse>

        <el-input v-model="reportForm.taskId" type="hidden"></el-input>
        <el-input v-model="reportForm.caseId" type="hidden"></el-input>

        <div class="footer">
          <!-- <el-row>
                        <el-col :sm="{span:4}" :md="{span:4}" :xl="{span:24}"> -->
          <el-button type="primary" @click="save()">
            <i class="fa fa-save"></i> 保存
          </el-button>
          <el-button type="success" @click="saveAndComplete()">
            <i class="fa fa-check-circle"></i> 保存且完成
          </el-button>
          <!-- </el-col> -->
          <!-- <el-col :sm="{span:4}" :md="{span:4}" :xl="{span:24}">
                            <el-button type="success" @click="saveAndComplete()">
                                <i class="fa fa-check-circle"></i> 保存且完成
                            </el-button>
                        </el-col> -->
          <!-- </el-row> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import CaseBasicInfo from "../common/CaseBasicInfo";
import Collapse from "../layout/Collapse";
import api from "../../api/index";
import PageOfficeApi from "../../components/tpl/PageOfficeApi";

export default {
  components: {
    Collapse: Collapse,
    CaseBasicInfo: CaseBasicInfo,
  },
  data() {
    return {
      initData: {
        title2: "",
        professionCategoryId: "",
        finishedFlows: [{}],
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
        resultId: "",
        //驳回到哪个节点
        rejectToNode: "",
        auditComment: "",
        caseId: "",
        taskId: "",
        reportOutDate: null,
      },
      auditResult: "Y",
      reportTemplateDialog: false, //是否显示选择报告模板的弹出框
      reportTemplates: [], //报告模板
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      formKey: "",
      acceptFields: [],
    };
  },
  created() {
    this.formKey = this.$route.query.formKey;
    this.title2 = this.$route.query.taskName;
    this.$get(api.reportForm + "/init-data", {
      caseId: this.$route.query.caseId,
      taskId: this.$route.query.taskId,
    })
      .then((res) => {
        if (res.status == 200) {
          this.initData = res.data;
          this.reportForm = res.data;
          this.reportForm.caseId = this.$route.query.caseId;
          this.reportForm.taskId = this.$route.query.taskId;
          this.reportForm.procInsId = this.$route.query.procInsId;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    //直接打开报告
    openReport() {
      //打开报告前先保存出案日期
      if (this.reportForm.reportOutDate) {
        var data = [
          {
            id: this.$route.query.caseId,
            reportOutDate: this.reportForm.reportOutDate,
          },
        ];
        this.$put(api.caCase + "/out", data)
          .then((res) => {
            if (res.status == 200) {
              PageOfficeApi.renderProof(
                this.reportForm.caseId,
                this.reportForm.taskId
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        PageOfficeApi.renderProof(
          this.reportForm.caseId,
          this.reportForm.taskId
        );
      }
    },
    save() {
      this.$refs["reportForm"].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.reportForm));
          this.$post(api.reportForm + "/save", data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    saveAndComplete() {
      this.$refs["reportForm"].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.reportForm));
          this.$post(api.reportForm + "/save?complete=1", data)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                });
                /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
                this.$router.go(-1); //为了保持筛选状态
              }
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.footer {
  text-align: center;
}
</style>
