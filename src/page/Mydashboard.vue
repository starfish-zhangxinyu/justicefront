<template>
  <div id="My-Dashboard" class="noneBG">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <Collapse
          title="鉴定待办任务"
          v-if="hasPermission('dashboard:auth:todolist')"
          iconname="list"
          :active="true"
        >
          <template>
            <div class="search-box" style="overflow: hidden">
              <el-form
                :model="searchForm"
                size="small"
                :inline="true"
                label-width="72px"
              >
                <el-form-item label="鉴定对象">
                  <el-input
                    v-model.trim="searchForm.authenticatedTarget"
                    @keyup.enter.native="search"
                    class="w200"
                  />
                </el-form-item>
                <el-form-item label="案件编号">
                  <el-input
                    v-model.trim="searchForm.caseNo"
                    @keyup.enter.native="search"
                    class="w200"
                  />
                </el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  style="color: white"
                  @click="search"
                  @keyup.enter="search"
                  >查询
                </el-button>
              </el-form>
            </div>
            <Table
              :data.sync="tableData"
              :page.sync="page"
              :search.sync="searchdata"
              :sort.sync="tablesort"
              port="actTask"
              :hasPaging="true"
              :selfDefinedBtn="true"
              max-height="510px"
              height="510px"
            >
              <template solt>
                <el-table-column
                  prop="taskName"
                  width="94px"
                  show-overflow-tooltip
                  label="任务标题"
                >
                  <template slot-scope="scope">
                    <span
                      :style="isShowColor(scope.row.caseVariable.priority)"
                      >{{ $divideDate(scope.row.taskName) }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="caseVariable.caseNo"
                  show-overflow-tooltip
                  width="210px"
                  label="案件编号"
                />
                <el-table-column
                  prop="caseVariable.entrustingName"
                  width="90px"
                  show-overflow-tooltip
                  label="委托方"
                />
                <el-table-column
                  prop="caseVariable.authenticatedTarget"
                  show-overflow-tooltip
                  label="鉴定对象"
                />
                <el-table-column
                  prop="createDateFormat"
                  show-overflow-tooltip
                  label="任务时间"
                />
                <el-table-column align="center" width="70px" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-finished"
                      type="primary"
                      plain
                      @click.native="handleTask(scope.$index, scope.row)"
                      size="mini"
                    >
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </Table>
          </template>
        </Collapse>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <Collapse
          title="最新消息"
          v-if="hasPermission('dashboard:message')"
          iconname="xiaoxi"
          :active="true"
        >
          <template>
            <div style="height: 600px">
              <div style="height: 600px; overflow-y: auto">
                <el-table class="table" :data="msgList">
                  <el-table-column show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="top">
                        {{ msgList[scope.$index].createDate }}
                      </span>
                      <span class="left">
                        {{ msgList[scope.$index].title }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  class="noList el-table__empty-text"
                  v-if="msgList.length === 0"
                >
                  暂无数据
                </div>
              </div>
              <div class="msg_bottom">
                <pagination
                  :isSmall="false"
                  :layout="'prev,pager,next'"
                  :pcurrent.sync="msgPage.current"
                  :page.sync="msgPage"
                  :data.sync="msgList"
                  port="msgRecentApi"
                  style="width: 100%"
                />
              </div>
            </div>
          </template>
        </Collapse>
      </el-col>
    </el-row>
    <HomeEcharts v-if="loginName != 'qihe_maintainer'" />
  </div>
</template>

<script>
import api from "./../api/index";
import PageOfficeApi from "./../components/tpl/PageOfficeApi";
import Collapse from "./layout/Collapse";
import HomeEcharts from "./HomeEchats";

export default {
  name: "MyDashboard",
  components: { Collapse: Collapse, HomeEcharts },
  data() {
    return {
      searchForm: {},
      page: { current: 1, pageSize: 30, total: 0 },
      tableData: [],
      tablesort: null,
      searchdata: {},
      msgList: [],
      msgPage: {
        pageSizes: [20, 30, 40, 50],
        current: 1,
        pageSize: 25,
        total: 0,
      },
      loginName: "",
    };
  },
  inject: ["hasPermission"],
  methods: {
    change(file, fileList) {},
    search() {
      let searchItem = JSON.parse(
        window.sessionStorage.getItem("dashboardsearchData")
      );
      var data = JSON.parse(JSON.stringify(this.searchForm));

      if (
        searchItem != {} &&
        JSON.stringify(data) == "{}" &&
        searchItem != null
      ) {
        this.searchForm = searchItem;
        this.searchdata = { ...this.searchForm };
      } else {
        this.searchdata = data;
        window.sessionStorage.setItem(
          "dashboardsearchData",
          JSON.stringify(this.searchForm)
        );
      }
    },
    isShowColor(data) {
      if (data == 10) {
        return "color:#FF0000";
      } else if (data == 9) {
        return "color:#FFC125";
      } else if (data == 8) {
        return "color:#36648B";
      }
    },
    handleTask(index, row) {
      if (row.formKey == "ARCHIVE") {
        //归档
        this.$router
          .push({
            path: "/main-flow/file",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey == "AUTHENTICATE_RECORD") {
        this.$router
          .push({
            path: "/main-flow/auth-records",

            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        row.formKey === "REPORT_INIT" ||
        row.formKey === "REPORT_AUDIT"
      ) {
        this.$router
          .push({
            path: "/main-flow/report-form",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "REPORT_PROOF") {
        this.$router
          .push({
            path: "/main-flow/report-proof",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "REPORT_DEMARK") {
        this.$router
          .push({
            path: "/main-flow/report-demark",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "REPORT_PRINT") {
        var data = {
          caseIds: row.caseVariable.caseId,
          taskId: row.taskId,
          procInsId: row.procInsId,
        };
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
          });
      } else if (row.formKey === "CASE_OUT_PRINT") {
        debugger;
        this.$router
          .push({
            path: "/main-flow/case-out-print",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey == "JUDGE") {
        this.$router
          .push({
            path: "/case/judge",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey == "ACCEPT") {
        this.$router
          .push({
            path: "/case/acceptcase",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              status: "ACCEPT",
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        row.formKey === "REPORT_SIGN" ||
        row.formKey === "REPORT_STAMP"
      ) {
        //先判断是否有去痕的pdf存在，没有则生成
        this.$get(
          api.reportForm + "/deMarkPdf?caseId=" + row.caseVariable.caseId
        )
          .then((res) => {
            if (res.data) {
              if (
                res.data.deMarkPdfCreateLink != undefined &&
                res.data.deMarkPdfCreateLink.length > 0
              ) {
                let deMarkPdfCreateLink = res.data.deMarkPdfCreateLink;
                window.location.href = deMarkPdfCreateLink;
              } else {
                this.$router
                  .push({
                    path: "/main-flow/signature",
                    query: {
                      taskId: row.taskId,
                      procInsId: row.procInsId,
                      caseId: row.caseVariable.caseId,
                      taskName: row.taskName,
                      formKey: row.formKey,
                    },
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "CASE_OUT") {
        this.$router
          .push({
            path: "/main-flow/caseout",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "GIVE") {
        this.$router
          .push({
            path: "/main-flow/report-giveout",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "ARCHIVE_MAKE") {
        //归档目录
        this.$router
          .push({
            path: "/case/file-directory",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey === "REPORT_SEAL") {
        this.$router
          .push({
            path: "/main-flow/seal",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              taskName: row.taskName,
              formKey: row.formKey,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey == "FINANCE_CONFIRM") {
        if (row.caseVariable.caseNo) {
          var status = 1;
        } else {
          var status = 0;
        }

        this.$router
          .push({
            path: "/case/confirmFinancial",
            query: {
              taskId: row.taskId,
              procInsId: row.procInsId,
              caseId: row.caseVariable.caseId,
              status: status,
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.formKey == "AUDIT") {
        if (row.procDefKey == "ABORT_CASE") {
          this.$router
            .push({
              path: "/case/abort",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row.procDefKey == "REPORT_CHANGE") {
          this.$router
            .push({
              path: "/case/report-change",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row.procDefKey == "DISCOUNT") {
          this.$router
            .push({
              path: "/case/charge-discount",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row.procDefKey == "REFUND") {
          this.$router
            .push({
              path: "/case/charge-refund",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row.procDefKey == "AMOUNT_CHANGE") {
          this.$router
            .push({
              path: "/case/amount-change",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row.procDefKey == "MAKE_INVOICE") {
          this.$get(
            api.invoicesApply +
              "/info?procInsId=" +
              row.procInsId +
              "&taskId=" +
              row.taskId
          )
            .then((res) => {
              if (res.status == 200) {
                var data = res.data;
                if (data.makeInvoiceType == "BATCH") {
                  this.$router
                    .push({
                      path: "/case/batch-make-invoice-apply",
                      query: {
                        taskId: row.taskId,
                        procInsId: row.procInsId,
                        caseIds: row.caseVariable.caseId + ",",
                        activeShow: "F",
                        lastFlow: data.lastFlow,
                      },
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else if (data.makeInvoiceType == "REGISTER") {
                  this.$router
                    .push({
                      path: "/case/make-invoice-apply",
                      query: {
                        taskId: row.taskId,
                        procInsId: row.procInsId,
                        caseIds: row.caseVariable.caseId + ",",
                        activeShow: "F",
                        lastFlow: data.lastFlow,
                      },
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else if (row.formKey == "AUDIT_REFUND") {
        if (row.procDefKey == "ABORT_CASE") {
          this.$router
            .push({
              path: "/case/charge-refund",
              query: {
                taskId: row.taskId,
                procInsId: row.procInsId,
                caseId: row.caseVariable.caseId,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "我的面板");
    /* this.isShowTip = [] */
    this.loginName = localStorage.getItem("loginName");
    this.search();
  },
  beforeRouteEnter(to, from, next) {
    /* 判断如果不是操作返回当前页，清除搜索条件 */
    if (
      from.path != "/case/charge-refund" &&
      from.path != "/case/make-invoice-apply" &&
      from.path != "/case/batch-make-invoice-apply" &&
      from.path != "/case/amount-change" &&
      from.path != "/case/charge-refund" &&
      from.path != "/case/charge-discount" &&
      from.path != "/case/report-change" &&
      from.path != "/case/abort" &&
      from.path != "/case/confirmFinancial" &&
      from.path != "/main-flow/seal" &&
      from.path != "/case/file-directory" &&
      from.path != "/main-flow/report-giveout" &&
      from.path != "/main-flow/caseout" &&
      from.path != "/main-flow/signature" &&
      from.path != "/case/acceptcase" &&
      from.path != "/case/judge" &&
      from.path != "/main-flow/case-out-print" &&
      from.path != "/main-flow/report-demark" &&
      from.path != "/main-flow/report-proof" &&
      from.path != "/main-flow/report-form" &&
      from.path != "/main-flow/auth-records" &&
      from.path != "/main-flow/file"
    ) {
      window.sessionStorage.removeItem("dashboardsearchData");
    }
    next();
  },
};
</script>
<style scoped lang="less">
.table /deep/ .el-table__header-wrapper {
  display: none;
}

.table /deep/ .el-table__row .el-tooltip .left {
  padding-right: 0px !important;
}

.msg-item {
  min-height: 30px;
  line-height: 30px;
  height: 60px;
  color: #333;
  font-size: 12px;
  border-bottom: 1px solid #ebeef5;
}

/*.left,  .top {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }*/
.left {
  font-weight: 600;
  padding-left: 10px;
}

.top {
  text-align: left;
  margin-left: 10px;
  font-size: 12px;
  display: block;
}

.msg_bottom {
  height: 53px;
  background: white;
  margin: 2px -10px 10px;
}

.noList {
  font-size: 12px;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>