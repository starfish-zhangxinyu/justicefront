<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="关系">
              <el-select
                class="w100"
                v-model="searchForm.handOverType"
                filterable
              >
                <el-option label="用户与案件相关" value="Y" />
                <el-option label="用户与任务相关" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
                @valueChange="professionChange"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="姓名">
              <el-select
                class="w100"
                v-model="searchForm.handOverFromUserId"
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
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item
              label="鉴定人角色"
              v-if="searchForm.handOverType == 'Y'"
            >
              <el-select
                v-model="searchForm.authRole"
                placeholder="请选择"
                :clearable="true"
                className="multiple-select"
                style="width: 100%"
              >
                <el-option label="鉴定人" value="AUTH"></el-option>
                <el-option label="案件判断人" value="JUDGER"></el-option>
                <el-option label="市场人员" value="SALES"></el-option>
                <el-option label="实验人员" value="LAB_STAFF"></el-option>
                <el-option label="复核人" value="REVIEWER"></el-option>
                <el-option
                  label="授权签字人"
                  value="AUTHORIZED_SIGNATORY"
                ></el-option>
                <el-option label="签发人" value="ISSUER"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号">
              <el-input v-model="searchForm.caseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="流水号">
              <el-input v-model="searchForm.serialNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象" class="margin0">
              <el-input v-model="searchForm.authenticatedTarget"></el-input>
            </el-form-item>
          </el-col>
          <el-button
            type="primary"
            size="small"
            @click="search"
            v-if="searchForm.handOverType == 'Y'"
            class="el-icon-search"
            style="float: right"
            >查询</el-button
          >
        </el-row>
        <el-row v-if="searchForm.handOverType !== 'Y'">
          <el-button
            type="primary"
            size="small"
            @click="search"
            class="el-icon-search"
            style="float: right; margin-bottom: 1px"
            >查询</el-button
          >
        </el-row>
      </el-form>
    </div>
    <el-button
      size="small"
      type="primary"
      style="margin-bottom: 10px"
      @click="handOver"
      >案件交接</el-button
    >
    <el-table
      :data="tableData"
      fit
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      size="small"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column fixed width="55" type="selection"></el-table-column>
      <el-table-column prop="serialNumber" label="流水号"> </el-table-column>
      <el-table-column
        prop="caseNo"
        label="案件编号"
        width="250px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/case/case-detail', query: { id: scope.row.caseId } }"
            style="text-decoration: none"
          >
            <el-link type="primary" style="font-size: 12px">{{
              scope.row.caseNo ? scope.row.caseNo : "无"
            }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="entrustInfo.entrustingUnit.name" label="委托方">
        <template slot-scope="scope">
          <span>{{
            scope.row.entrustInfo.entrustingUnit &&
            scope.row.entrustInfo.entrustingUnit.name != null &&
            scope.row.entrustInfo.entrustingUnit.name != ""
              ? scope.row.entrustInfo.entrustingUnit.name
              : scope.row.entrustInfo.entrustingParty
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="entrustInfo.authenticatedTarget" label="鉴定对象">
      </el-table-column>
      <el-table-column prop="professionCategory.name" label="专业类别">
      </el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'N'"
        prop="flowName"
        label="交接流程名"
      >
      </el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'N'"
        prop="taskName"
        label="交接任务名"
      >
      </el-table-column>
      <el-table-column
        prop="assist.participant.hrStaff.name"
        width="90px"
        label="鉴定助理"
      ></el-table-column>
      <el-table-column
        prop="auth1.participant.hrStaff.name"
        width="90px"
        label="第一鉴定人"
      ></el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'Y'"
        prop="auth2.participant.hrStaff.name"
        width="90px"
        label="第二鉴定人"
      ></el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'Y'"
        prop="auth3.participant.hrStaff.name"
        width="90px"
        label="第三鉴定人"
      ></el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'Y'"
        prop="authorizedSignatory.participant.hrStaff.name"
        label="授权签字人"
        width="90px"
      ></el-table-column>
      <el-table-column
        v-if="searchdata.handOverType == 'Y'"
        prop="reviewer.participant.hrStaff.name"
        label="复核人"
      ></el-table-column>
      <el-table-column
        prop="caseStatus.label"
        label="案件状态"
      ></el-table-column>
      <el-table-column
        prop="flowStatus.label"
        width="100px"
        label="进度（状态）"
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.reportOutDate && scope.row.flowStatus.value == 'SIGNED'
            "
            >已出案</span
          >
          <span v-if="!scope.row.reportOutDate">{{
            scope.row.flowStatus.label
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="caseHandOverList"
      >
      </pagination>
    </div>
    <el-dialog title="案件交接" :visible.sync="showHandOverDialog">
      <el-form :model="handOverForm" label-width="100px" ref="handOverForm">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item
              label="移交人"
              :rules="$filter_rules({ required: true })"
              prop="handOverToId"
            >
              <el-select
                class="w100"
                v-model="handOverForm.handOverToUserId"
                filterable
              >
                <el-option
                  v-for="item in handOverUserListData"
                  :key="item.id"
                  :label="item.hrStaff.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showHandOverDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveHandOver('handOverForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/index";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import SelectClient from "../../components/common/SelectClient";
import commonNum from "@/utils/commonNum.js";
export default {
  components: {
    "select-qualification": SelectFromQualification,
    "select-client": SelectClient,
  },
  name: "CaseHandOverList",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: { handOverFromUserId: "" },

      //选择框相关
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},

      showHandOverDialog: false,
      handOverForm: { handOverToId: "" },
      sysUserListData: [], //所有用户数据
      handOverUserListData: [], //符合条件的移交人的数据
    };
  },
  methods: {
    search() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
    },
    handleCheckBox(rows) {
      //rows是数组，返回是当前页已选是数据 [ { .. } , { ... }, .. ]
      var curpage = this.page.current; //当前页码，具体由自己写的组件取值
      this.selectData[curpage] = [];
      if (rows.length > 0) {
        rows.forEach((item) => {
          if (item && item.caseId !== undefined) {
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
    handOver() {
      if (this.selectRows.length == 0) {
        this.$message.error("您还没有选择案件，请选择需要操作的案件！");
      }
      this.handOverUserListData = [];
      if (this.searchdata.handOverType == "Y") {
        this.getUser(this.searchdata.authRole);
      } else {
        //先判断选择的任务负责人是否为同一类型
        var assigneeType = this.selectRows[0].taskAssigneeType;
        var assignee = this.selectRows[0].taskAssignee;
        for (var i = 1; i < this.selectRows.length; i++) {
          var v = this.selectRows[i];
          if (
            v.taskAssigneeType == assigneeType ||
            (v.taskAssigneeType == assigneeType && v.taskAssignee != assignee)
          ) {
            this.$message.error(
              "所选任务的负责人存在不同类型，不能同时进行案件交接！"
            );
            return;
          }
        }
        if (assigneeType == "USER" || assigneeType == "ROLE") {
          var temp = { roleId: "" };
          temp["page.pageSize"] = 1000;
          temp["page.current"] = 1;
          if (assigneeType == "ROLE") {
            temp.roleId = assignee;
          }
          this.$get("/api/user/v1/users", temp)
            .then((res) => {
              let arr = [];
              res.data.list.forEach((v, i) => {
                if (v.hrStaff) {
                  arr.push(v);
                }
              });
              this.handOverUserListData = arr;
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
              console.log("handOver", err.errMsg);
            });
        } else if (assigneeType == "FLOW_USER") {
          this.$get(api.flowUsers + "/" + assignee)
            .then((res) => {
              this.handOverUserListData = res.data;
            })
            .catch((err) => {
              // this.$message.error(err.errMsg);
              console.log("handOver1", err);
            });
        } else if (assigneeType == "DYNAMIC_USER") {
          this.getUser(assignee);
        }
      }
      this.showHandOverDialog = true;
    },
    getUser(assignee) {
      if (
        assignee == "AUTH1" ||
        assignee == "AUTH2" ||
        assignee == "AUTH3" ||
        assignee == "AUTH4" ||
        assignee == "AUTH5"
      ) {
        assignee = "AUTH";
      }
      if (assignee == "JUDGER") {
        var data2 = {
          professionCategoryId: this.searchdata.professionCategoryId,
          key: "case.authenticator.judger",
        };
        this.$get(api.param + "/value/user", data2)
          .then((res) => {
            this.handOverUserListData = res.data;
          })
          .catch((err) => {
            // this.$message.error(err.errMsg);
            console.log("judger", err);
          });
      } else if (this.searchdata.authRole == "SALES") {
        var data = {};
        data.enName = "MARKET";
        this.$get("/api/hr-staff/v1/hr-staffs/list", data)
          .then((res) => {
            this.handOverUserListData = res.data;
          })
          .catch((err) => {
            // this.$message.error(err.errMsg);
            console.log("MARKET", err);
          });
      } else {
        var data = {
          qualificationType: assignee,
          professionCategoryId: this.searchdata.professionCategoryId,
          dataScope: "caseData",
        };
        this.$get("/api/hr-staff/v1/hr-staffs/qualification/dataScope", data)
          .then((res) => {
            this.handOverUserListData = res.data;
          })
          .catch((err) => {
            // this.$message.error(err.errMsg);
            console.log("dataScope", err);
          });
      }
    },
    saveHandOver() {
      var data = JSON.parse(JSON.stringify(this.handOverForm));
      if (this.searchdata.handOverType == "Y") {
        var caseIds = [];
        this.selectRows.forEach((v) => {
          caseIds.push(v.caseId);
        });
        data.caseIds = caseIds;
      } else if (this.searchdata.handOverType == "N") {
        var taskIds = [];
        var caseIds = [];
        this.selectRows.forEach((v) => {
          taskIds.push(v.taskId);
          caseIds.push(v.caseId);
        });
        data.taskIds = taskIds;
        data.caseIds = caseIds;
      } else {
        return;
      }
      data.authRole =
        this.searchdata.authRole == "" ? assignee : this.searchdata.authRole;
      data.handOverFromUserId = this.searchdata.handOverFromUserId;
      data.handOverType = this.searchForm.handOverType
      this.$put(api.caseHandOverList, data)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "案件交接成功！",
              type: "success",
            });
            this.showHandOverDialog = false;
            this.handOverForm = { handOverToId: "" };
            this.init();
          }
        })
        .catch((err) => {
          this.$message.error(err.errMsg);
        });
    },
    professionChange(value) {
      this.searchForm.handOverFromUserId = null;
      this.$get("/api/hr-staff/v1/hr-staffs/qualification/dataScope", {
        dataScope: "caseData",
        professionCategoryId: value,
      })
        .then((res) => {
          let arr = [];
          res.data.forEach((v, i) => {
            if (v.hrStaff) {
              arr.push(v);
            }
          });
          this.sysUserListData = arr;
        })
        .catch((err) => {
          // this.$message.error(err.errMsg);
          console.log("professionChange", err);
        });
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "案件交接列表");
    this.tableHeight =
      window.innerHeight - commonNum.tableBottomThreeRows + "px";
    var temp = {};
    temp["page.pageSize"] = 1000;
    temp["page.current"] = 1;
    this.$get("/api/hr-staff/v1/hr-staffs/qualification/dataScope", {
      dataScope: "caseData",
      professionCategoryId: "",
    })
      .then((res) => {
        let arr = [];
        res.data.forEach((v, i) => {
          if (v.hrStaff) {
            arr.push(v);
          }
        });
        this.sysUserListData = arr;
      })
      .catch((err) => {
        this.$message.error(err.errMsg);
        console.log("error", err.errMsg);
      });
    // let watcher = this.$watch('tableData', () => {
    //     document.querySelector(".el-table__fixed-body-wrapper").style.top = "61px ";
    // })
  },
};
</script>

<style scoped>
.buttonTop {
  margin-top: 18px;
}
</style>