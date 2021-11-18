<template>
  <div id="personnelPerformance">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small">
        <el-row> </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" label-width="30%">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :clearable="true"
                :className="'multiple-select w100'"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" label-width="30%">
              <el-input class="w100" v-model="searchForm.caseNo" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="结算状态" label-width="30%">
              <el-select
                class="w100"
                v-model="searchForm.settleStatus"
                clearable
              >
                <el-option value="all" label="全部状态" />
                <el-option value="Y" label="已结算" />
                <el-option value="N" label="未结算" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="登记日期" label-width="30%" class="margin0">
              <DataPicker
                :startValue.sync="searchForm.createDate.from"
                :endValue.sync="searchForm.createDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托日期" label-width="30%" class="margin0">
              <DataPicker
                :startValue.sync="searchForm.entrustingDate.from"
                :endValue.sync="searchForm.entrustingDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案号标志" label-width="30%">
              <el-select
                class="w100"
                v-model="searchForm.caseNoFlag"
                placeholder="请选择"
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
          <!--<el-col :span="1" :offset="21">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">查询</el-button>
                    </el-col>-->
          <el-button-group style="float: right" class="clearfix">
            <el-button
              size="small"
              class="el-icon-more"
              @click="moreSearchDialog = true"
              >更多</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="el-icon-search"
              >查询</el-button
            >
          </el-button-group>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible="moreSearchDialog" @close="moreSearchDialog = false">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="受理日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.acceptDate.from"
                :endValue.sync="searchForm.acceptDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="出案日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.reportOutDate.from"
                :endValue.sync="searchForm.reportOutDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="发放日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.giveDate.from"
                :endValue.sync="searchForm.giveDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="归档日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.archiveDate.from"
                :endValue.sync="searchForm.archiveDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="收费日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.amountReceivedDate.from"
                :endValue.sync="searchForm.amountReceivedDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.authDate.from"
                :endValue.sync="searchForm.authDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="签发日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.issueDate.from"
                :endValue.sync="searchForm.issueDate.to"
                valueFormat="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="角色类型" label-width="30%">
              <select-from-enum
                :model.sync="searchForm.role"
                :className="'w100'"
                :clearable="true"
                :modelVal="true"
                type="flow.CaseRole"
                filterData="JUDGER"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="人员姓名" label-width="30%">
              <el-input v-model="searchForm.name" />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定项目" label-width="30%">
              <select-from-table
                :model.sync="searchForm.authenticatedItemId"
                port="entrustingMatter"
                :model-id="true"
                :condition="professionCategoryCondition"
                className="multiple-select"
                :orgId="orgId"
                :clearable="true"
                :filterable="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="统计类别" label-width="30%">
              <TreeSelect
                :model.sync="searchForm.caseStatType"
                name="caseStatType"
                title="统计类别选择"
              ></TreeSelect>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="受理点" label-width="30%">
              <select-from-table
                ref="acceptStationTable"
                :model.sync="searchForm.acceptStationId"
                port="acceptStation"
                className="multiple-select"
              ></select-from-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定对象" label-width="30%">
              <el-input v-model="searchForm.authenticatedTarget" />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="委托方类型" label-width="30%">
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
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="收费状态" label-width="30%">
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
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="归档状态" label-width="30%">
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
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="发放状态" label-width="30%">
              <el-select
                v-model="searchForm.giveStatus"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="未发放" value="0"></el-option>
                <el-option label="已发放" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moreSearchDialog = false">取消</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </el-dialog>
    <el-button-group>
      <el-button
        type="primary"
        @click="exportFile"
        size="mini"
        v-if="hasPermission('auth:statistics:person:export')"
      >
        <i class="fa fa-sign-out"></i>导出
      </el-button>
      <el-button
        type="primary"
        @click="updateData"
        size="mini"
        v-if="hasPermission('auth:statistics:person:update')"
      >
        <i class="fa fa-refresh"></i>更新数据
      </el-button>
    </el-button-group>
    <Table
      :data.sync="tableData"
      :page.sync="page"
      :sort.sync="tablesort"
      :search.sync="searchdata"
      port="personPerforQueryApi"
      :hasPaging="true"
      postType="post"
      :selfDefinedBtn="true"
      :max-height="tableHeight"
      :org-id="orgId"
    >
      <template solt>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip />
        <el-table-column prop="roleName" label="角色" show-overflow-tooltip />
        <el-table-column prop="caseCnt" label="案件量" show-overflow-tooltip />
        <el-table-column
          prop="targetCnt"
          label="样本数"
          show-overflow-tooltip
        />
        <el-table-column
          prop="amount.yuanFmt"
          label="合同金额"
          show-overflow-tooltip
        />
        <el-table-column
          prop="discount.yuanFmt"
          label="减免金额"
          show-overflow-tooltip
        />
        <el-table-column
          prop="amountRefund.yuanFmt"
          label="退费金额"
          show-overflow-tooltip
        />
        <el-table-column
          prop="amountReceivable.yuanFmt"
          label="应收金额"
          show-overflow-tooltip
        />
        <el-table-column
          v-for="(item, index) in realList"
          :key="index"
          width="90px"
          :prop="item.key"
          :label="item.name"
          show-overflow-tooltip
        />
        <!-- <el-table-column
          prop="amountReceived.yuanFmt"
          label="已收金额"
          show-overflow-tooltip
        /> -->
        <el-table-column
          prop="amountRealReceived.yuanFmt"
          label="实收金额"
          show-overflow-tooltip
        />
        <el-table-column
          v-for="(item, index) in receivedList"
          :key="index + 100"
          width="90px"
          :prop="item.key"
          :label="item.name"
          show-overflow-tooltip
        />
        <el-table-column
          prop="amountRealReceivedExcludeTaxes.yuanFmt"
          label="税后金额（实收）"
          show-overflow-tooltip
        />
        <el-table-column
          prop="taxes.yuanFmt"
          label="税额（实收）"
          show-overflow-tooltip
        />
        <el-table-column
          prop="address"
          label="操作"
          width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="detail(scope.$index, scope.row)"
              v-if="scope.row.id !== null"
              >案件明细</el-button
            >
            <el-button
              type="primary"
              plain
              size="mini"
              v-if="scope.row.id == null"
              disabled
              >合计
            </el-button>
          </template>
        </el-table-column>
      </template>
    </Table>
  </div>
</template>

<script>
import Select2 from "../../components/common/Select2";
import api from "../../api/index";
import { get } from "@/api/http";
import commonNum from "../../utils/commonNum";
import TreeSelect from "../../components/common/TreeSelect";
import { mapState } from "vuex";

export default {
  name: "PersonnelPerformance",
  components: {
    Select2: Select2,
    TreeSelect: TreeSelect,
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      innerPanClass: {
        sm: { span: 12 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      moreSearchDialog: false,
      searchForm: {
        acceptDate: {},
        amountReceivedDate: {},
        archiveDate: {},
        authDate: {},
        createDate: {},
        entrustingDate: {},
        giveDate: {},
        issueDate: {},
        reportOutDate: {},
      },
      tableData: [],
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: {},
      receivableList: [],
      receivedList: [], //实收
      realList: [], //应收
      timer: null,
      timer2: null,
      orgList: [],
      isNotOrg: false,
      professionCategoryCondition: { professionCategoryId: "" },
      caseMarkOpt: [],
    };
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  inject: ["hasPermission"],
  methods: {
    //更新数据
    updateData() {
      clearTimeout(this.timer2);
      this.timer2 = setTimeout(async () => {
        try {
          await this.$post(api.personPerforUpdateApi);
          this.$message.success("数据更新成功!");
        } catch {
          this.$message.error("数据更新失败!");
        }
      }, 500);
    },
    //导出
    exportFile() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          let { data, headers } = await this.$postFormData2(
            api.personPerforExportApi,
            this.searchdata
          );
          this.$downFile(
            data,
            decodeURI(headers["content-disposition"].split("filename=")[1]) ||
              "个人绩效统计.xls"
          );
        } catch {
          this.$message.error("导出失败");
        }
      }, 500);
    },
    search() {
      this.moreSearchDialog = false;
      let temp = "";
      temp = this.searchForm.acceptStationId;
      if (typeof this.searchForm.acceptStationId == "object") {
        this.searchForm.acceptStationId = this.searchForm.acceptStationId.id;
      }
      var data = JSON.parse(JSON.stringify(this.searchForm));
      this.searchdata = data;
      this.searchForm.acceptStationId = temp;
    },
    detail(index, row) {
      sessionStorage.setItem("personnelPerformanceDetailRole", row.role);
      /* this.$router.push({
                    path: "/statistics/personnelPerformanceDetail",
                    query: {
                        id: row.id,
                        role: row.role
                    }
                }); */
      let url = this.$router.resolve({
        path: "/statistics/personnelPerformanceDetail",
        query: {
          id: row.id,
          role: row.role,
        },
      });
      window.open(url.href, "_blank");
    },
    initTable() {
      this.$get(api.chargeTypeApi)
        .then((res) => {
          if (res.status == "200") {
            let arr = [],
              arr2 = [],
              arr3 = [];
            res.data.forEach((item, index) => {
              arr.push({
                key: `receivableCt${item.key.substring(2, 4)}.yuanFmt`,
                name: `应收${item.name}`,
              }); //应收金额
              arr2.push({
                key: `receivedCt${item.key.substring(2, 4)}.yuanFmt`,
                name: `实收${item.name}`,
              }); //实收金额
              arr3.push({
                key: `amountReceivableList[` + index + `].amountReceivable.yuanFmt`,
                name: `应收${item.name}`,
              }); //应收金额
            });
            this.receivableList = arr;
            this.receivedList = arr2;
            this.realList = arr3;
          }
        })
        .catch((err) => console.log(err));
    },
    setOrgIdSession() {
      var orgId = this.searchForm.orgId;
      if (orgId == undefined) {
        orgId = "";
      }
      this.$get(api.org + "/setOrgId?orgId=" + orgId)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    orgId: function () {
      this.searchForm = {
        acceptDate: {},
        amountReceivedDate: {},
        archiveDate: {},
        authDate: {},
        createDate: {},
        entrustingDate: {},
        giveDate: {},
        issueDate: {},
        reportOutDate: {},
      };
    },
    "searchForm.professionCategoryId": function (newVal, oldVal) {
      this.professionCategoryCondition = { professionCategoryId: newVal };
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
      }
    },
  },
  created() {
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
    this.$store.dispatch("login/headerTitleChange", "人员绩效清单");
    /*this.setOrgIdSession();*/
    // this.initTable();
  },
  // beforeRouteEnter(to, from, next) {
  //     get(api.myInfo).then(res => {
  //         if (res.data) {
  //             console.log("res.data", res.data)
  //             if (res.data.orgId == null || res.data.orgId.length == 0) {
  //                 //获取机构
  //                 get(api.org + '/list').then(res => {
  //                     if (res.data) {
  //                         next(vm => {
  //                             vm.orgList = res.data;
  //                             vm.searchForm = {
  //                                 acceptDate: {},
  //                                 amountReceivedDate: {},
  //                                 archiveDate: {},
  //                                 authDate: {},
  //                                 createDate: {},
  //                                 entrustingDate: {},
  //                                 giveDate: {},
  //                                 issueDate: {},
  //                                 reportOutDate: {},
  //                                 orgId: res.data[0].id,
  //                             }
  //                             vm.searchdata = {
  //                                 orgId: res.data[0].id,
  //                             };
  //                             vm.isNotOrg = true;
  //                         })
  //                     }
  //                 }).catch(err => {
  //                     console.log(err)
  //                 });
  //             } else {
  //                 next(vm => {
  //                     vm.isNotOrg = false;
  //                 })
  //             }
  //         }
  //     }).catch((err) => console.log(err));
  // },
};
</script>

<style scoped></style>
