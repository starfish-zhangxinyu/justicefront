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

        <Collapse title="去痕" :active="true">
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
              <el-button type="primary" @click="save()">
                <i class="fa fa-save"></i> 保存
              </el-button>
              <el-button type="success" @click="saveAndComplete()">
                <i class="fa fa-check-circle"></i> 保存且完成
              </el-button>
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
      PageOfficeApi.reportMake2(
        this.reportForm.caseId,
        "",
        this.reportForm.taskId,
        "Y"
      );
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
              var data = JSON.parse(JSON.stringify(this.reportForm));
              console.log(data, "reportForm");
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
            } else {
              this.$message.error("请先保存报告后再完成任务！");
            }
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
