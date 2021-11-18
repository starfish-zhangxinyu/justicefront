<template>
  <div id="receivables">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small">
        <el-row>
          <!--<el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item v-show="isNotOrg" label="机构" label-width="30%">
                            <el-select
                                    ref="orgId"
                                    v-model="searchForm.orgId"
                                    filterable
                                    placeholder="请选择机构" style="width: 100%"
                            >
                                <el-option
                                        v-for="item in orgList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>-->
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" label-width="30%">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :clearable="true"
                className="multiple-select"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
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
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案号标志" label-width="30%">
              <el-select
                v-model="searchForm.caseNoFlag"
                class="w100"
                :clearable="true"
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="item in caseNoFlagList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="第一鉴定人" label-width="30%" class="margin0">
              <select-qualification
                dataScope="statScope"
                profession_category="ALL"
                qualification_type="AUTH"
                :filterable="true"
                className="multiple-select"
                :model.sync="searchForm.auth1Id"
                :change-select="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="受理地点" label-width="30%" class="margin0">
              <select-from-table
                :model.sync="searchForm.acceptStationId"
                port="acceptStation"
                :model-id="true"
                className="multiple-select"
                :clearable="true"
                :filterable="true"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
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
        <!-- <el-row>
                    <el-col :span="1" :offset="21">
                        <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="mini"
                                @click="search()"
                        >查询
                        </el-button
                        >
                    </el-col>
                </el-row>-->
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
            <el-form-item label="受理日期">
              <DataPicker
                :startValue.sync="searchForm.acceptDateBegin"
                :endValue.sync="searchForm.acceptDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="委托日期">
              <DataPicker
                :startValue.sync="searchForm.entrustingDateBegin"
                :endValue.sync="searchForm.entrustingDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
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
            <el-form-item label="登记日期">
              <DataPicker
                :startValue.sync="searchForm.registerDateBegin"
                :endValue.sync="searchForm.registerDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="案发日期">
              <DataPicker
                :startValue.sync="searchForm.happenDateBegin"
                :endValue.sync="searchForm.happenDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
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
            <el-form-item label="出案日期">
              <DataPicker
                :startValue.sync="searchForm.reportOutDateBegin"
                :endValue.sync="searchForm.reportOutDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="发放日期">
              <DataPicker
                :startValue.sync="searchForm.giveDateBegin"
                :endValue.sync="searchForm.giveDateEnd"
                valueFormat="yyyy/MM/dd HH:mm:ss"
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
            <el-form-item label="委托方">
              <select-from-table
                :model.sync="searchForm.entrustingUnitId"
                port="allEntrustingUnit"
                :model-id="true"
                className="multiple-select"
                allow-create
                :clearable="true"
                :filterable="true"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="委托单位类别">
              <select-from-dict
                :model.sync="searchForm.entrustingUnitTypeId"
                data_type="ex_unit_type"
                :model-id="true"
                :clearable="true"
                className="multiple-select"
                :org-id="orgId"
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
            <el-form-item label="发放状态">
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
    <el-button
      type="primary"
      size="mini"
      @click="exportExcel"
      v-if="hasPermission('auth:statistics:income:export')"
      >导出
    </el-button>
    <Table
      :data.sync="tableData"
      :page.sync="page"
      :sort.sync="tablesort"
      :search.sync="searchdata"
      port="caseQuantityRevenues"
      :hasPaging="true"
      :selfDefinedBtn="true"
      :org-id="orgId"
    >
      <template solt>
        <el-table-column prop="entrustInfoName" label="委托方" />
        <el-table-column prop="countNum" label="案件量" />
        <el-table-column prop="amount.yuanFmt" label="合同金额" />
        <el-table-column prop="discount.yuanFmt" label="减免金额" />
        <!-- <el-table-column prop="received.yuanFmt" label="已收金额" /> -->
        <el-table-column prop="actualReceivable.yuanFmt" label="实收金额" />
        <el-table-column
          prop="actualReceivableAfterTax.yuanFmt"
          label="税后金额（实收金额）"
        />
        <el-table-column prop="actualReceivableTax.yuanFmt" label="税费（实收金额）" />
        <el-table-column prop="notReceived.yuanFmt" label="待收金额" />
        <el-table-column prop="invoiceAmount.yuanFmt" label="开票金额" />
        <el-table-column prop="method" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="detail(scope.row.caseIds)"
              v-if="scope.row.id !== null"
            >
              明细
            </el-button>
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
import SelectFromQualification from "../../components/common/SelectFromQualification";
import { get } from "@/api/http";
import { mapState } from "vuex";

export default {
  name: "Income",
  components: {
    Select2: Select2,
    "select-qualification": SelectFromQualification,
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
      searchForm: { entrustingUnit: { name: "" } },
      tableData: [],
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },

      tablesort: null,
      searchdata: {},
      caseNoFlagList: [],
      orgList: [],
      isNotOrg: false,
    };
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  inject: ["hasPermission"],
  methods: {
    search() {
      this.moreSearchDialog = false;
      let data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.entrustingUnit) {
        if (data.entrustingUnit.id) {
          data.entrustingUnitId = data.entrustingUnit.id;
          delete data.data.entrustingUnit;
        }
      }
      this.searchdata = data;
    },
    detail(caseIds) {
      
      /* this.$router.push({
        path: "/statistics/incomeDetail",
      }); */
      this.$store.commit("dataStatistics/changeIncomeCaseIds", caseIds);
      let url = this.$router.resolve({
        path: "/statistics/incomeDetail",
      });
      window.open(url.href);
    },
    exportExcel() {
      var exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      this.$axios
        .get(api.caseQuantityRevenues + "/export", {
          params: exportExcelSearchData,
          responseType: "blob",
        })
        .then((res) => {
          let {
            data: { data },
          } = res;
          if (!data) return;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "收入统计.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
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
    orgId: {
      handler(newval, oldval) {
        // this.setOrgIdSession();
        this.searchForm = { entrustingUnit: { name: "" } };
        //获取案号标志
        this.$get(api.sequenceSetting, {
          "page.pageSize": 1000000,
          "page.current": 1,
        })
          .then((res) => {
            this.caseNoFlagList = res.data.list.map((v) => {
              return v.caseNoFlag;
            });
            this.caseNoFlagList = this.caseNoFlagList.filter(
              (item, index, self) => {
                return self.indexOf(item) == index;
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "收入统计");
    // this.setOrgIdSession();
    this.$get(api.sequenceSetting, {
      "page.pageSize": 1000000,
      "page.current": 1,
    })
      .then((res) => {
        this.caseNoFlagList = res.data.list.map((v) => {
          return v.caseNoFlag;
        });
        this.caseNoFlagList = this.caseNoFlagList.filter(
          (item, index, self) => {
            return self.indexOf(item) == index;
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
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
