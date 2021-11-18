<template>
  <div id="case-statistics">
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
            <el-form-item label="案件时限状态" label-width="30%">
              <el-select
                v-model="searchForm.overdueStatus"
                :clearable="true"
                class="w100"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" label-width="30%">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                className="w100"
                :clearable="true"
                class="multiple-select"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" label-width="30%">
              <el-input clearable v-model="searchForm.caseNo" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="委托单位" label-width="30%" class="margin0">
              <select-client
                port="entrustingNorApi"
                :model.sync="searchForm.entrustingUnitId"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="流水号" label-width="30%" class="margin0">
              <el-input v-model="searchForm.serialNumber" size="small" />
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
            <el-form-item label="签发人" label-width="30%">
              <select-qualification
                dataScope="statScope"
                profession_category="ALL"
                :filterable="true"
                className="multiple-select"
                qualification_type="ISSUER"
                :model.sync="searchForm.issuerId"
                :change-select="orgId"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="委托日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginEntrustingDate"
                :endValue.sync="searchForm.endEntrustingDate"
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
            <el-form-item label="受理日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginAcceptDate"
                :endValue.sync="searchForm.endAcceptDate"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="签发日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginIssuerDate"
                :endValue.sync="searchForm.endIssuerDate"
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
            <el-form-item label="出案日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginReportOutDate"
                :endValue.sync="searchForm.endReportOutDate"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="发放日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginGiveDate"
                :endValue.sync="searchForm.endGiveDate"
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
            <el-form-item label="案发日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginHappenDate"
                :endValue.sync="searchForm.endHappenDate"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="登记日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginRegisterDate"
                :endValue.sync="searchForm.endRegisterDate"
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
            <el-form-item label="归档日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginArchiveDate"
                :endValue.sync="searchForm.endArchiveDate"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定助理" label-width="30%">
              <select-qualification
                dataScope="statScope"
                profession_category="ALL"
                qualification_type="ASSIST"
                :className="'w100'"
                :model.sync="searchForm.assistId"
                :change-select="orgId"
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
            <el-form-item label="收费确认日期" label-width="30%">
              <DataPicker
                :startValue.sync="searchForm.beginChargeConfirmDate"
                :endValue.sync="searchForm.endChargeConfirmDate"
              />
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="鉴定人" label-width="30%">
              <select-qualification
                dataScope="statScope"
                profession_category="ALL"
                qualification_type="AUTH"
                :filterable="true"
                :className="'multiple-select w100'"
                :model.sync="searchForm.authId"
                :change-select="orgId"
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
            <el-form-item label="鉴定人角色" label-width="30%">
              <el-select
                v-model="searchForm.authRole"
                placeholder="请选择"
                :clearable="true"
                class="multiple-select"
                style="width: 100%"
              >
                <el-option label="第一鉴定人" value="AUTH1"></el-option>
                <el-option label="第二鉴定人" value="AUTH2"></el-option>
                <el-option label="第三鉴定人" value="AUTH3"></el-option>
                <el-option label="第四鉴定人" value="AUTH4"></el-option>
                <el-option label="第五鉴定人" value="AUTH5"></el-option>
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
      v-if="hasPermission('auth:statistics:prescription:export')"
      @click="resultExport()"
    >
      <i class="fa fa-sign-out"></i>导出
    </el-button>
    <Table
      :data.sync="tableData"
      :page.sync="page"
      :search.sync="searchdata"
      :sort.sync="tablesort"
      port="prescriptionListApi"
      :hasPaging="true"
      :selfDefinedBtn="true"
      :maxHeight="tableHeight"
      :org-id="orgId"
    >
      <template solt>
        <el-table-column
          width="100"
          prop="overdueStatus.label"
          label="案件时效状态"
          show-overflow-tooltip
        />
        <el-table-column
          width="250"
          prop="caseNo"
          label="案件编号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{ path: '/case/case-detail', query: { id: scope.row.id } }"
              style="text-decoration: none"
            >
              <el-link type="primary" style="font-size: 12px"
                >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
              </el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="term"
          label="鉴定时限"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="caseCompleteDays"
          label="案件完成时限"
          show-overflow-tooltip
        />
        <el-table-column
          width="120"
          prop="serialNumber"
          label="流水号"
          show-overflow-tooltip
        />
        <el-table-column
          width="120"
          prop="entrustInfo.entrustingUnit.name"
          label="委托单位"
          show-overflow-tooltip
        />
        <el-table-column
          width="120"
          prop="entrustInfo.authenticatedTarget"
          label="鉴定对象"
          show-overflow-tooltip
        />
        <el-table-column
          width="120"
          prop="professionCategory.name"
          label="专业类别"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="createDate"
          label="登记日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="entrustingDate"
          label="委托日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="acceptDate"
          label="受理日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="issuerDate"
          label="签发日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="reportOutDate"
          label="出案日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="giveDate"
          label="发放日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="archiveDate"
          label="归档日期"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="assist.participant.label"
          label="鉴定助理"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="auth1.participant.label"
          label="第一鉴定人"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="auth2.participant.label"
          label="第二鉴定人"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="auth3.participant.label"
          label="第三鉴定人"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="auth4.participant.label"
          label="第四鉴定人"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="auth5.participant.label"
          label="第五鉴定人"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="createBy.hrStaff.name"
          label="登记人"
          show-overflow-tooltip
        />
      </template>
    </Table>
  </div>
</template>

<script>
import Select2 from "../../components/common/Select2";
import SelectFromQualification from "@/components/common/SelectFromQualification";
import api from "../../api";
import { getFormData, post } from "../../api/http";
import { get } from "@/api/http";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";

export default {
  name: "CaseStatistics",
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
      moreSearchDialog: false,
      innerPanClass: {
        sm: { span: 12 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      searchForm: {},
      tableData: [],
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      orgList: [],
      isNotOrg: false,
      options: [
        {
          value: "OVERDUE",
          label: "超期",
        },
        {
          value: "WITHIN",
          label: "期限内完成",
        },
        {
          value: "DELAY",
          label: "延期完成",
        },
      ],
      options2: [
        {
          value: "选项1",
          label: "已发放",
        },
        {
          value: "选项2",
          label: "未发放",
        },
      ],
      options3: [
        {
          value: "选项1",
          label: "已开",
        },
        {
          value: "选项2",
          label: "未开",
        },
      ],
    };
  },
  inject: ["hasPermission"],
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  methods: {
    search() {
      let json = JSON.parse(JSON.stringify(this.searchForm));
      if (typeof json.entrustingUnitId === "object") {
        json.entrustingUnitId = json.entrustingUnitId.id;
      }
      if (json.authRole && !json.authId) {
        this.$message.error("请选择对应角色的鉴定人!");
        return;
      }
      this.searchdata = json;
      this.moreSearchDialog = false;
    },
    download(data, name) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    },
    resultExport() {
      let data = JSON.parse(JSON.stringify(this.searchdata));
      this.$getFormData(api.prescriptionExportApi, data)
        .then((res) => {
          this.download(res.data, "案件时效统计列表.xls");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    detail(index, row) {
      /* this.$router.push({
                    path: "/statistics/case-quantity-detail",
                    query: {
                        caseIds: row.caseIds
                    }
                }); */
      let url = this.$router.resolve({
        path: "/statistics/case-quantity-detail",
        query: {
          caseIds: row.caseIds,
        },
      });
      window.open(url.href, "_blank");
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
  created() {
    this.$store.dispatch("login/headerTitleChange", "案件时效统计");
    // this.setOrgIdSession();
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
  },
  watch: {
    orgId: function () {
      this.searchForm = {};
    },
  },
};
</script>
<style scope></style>
