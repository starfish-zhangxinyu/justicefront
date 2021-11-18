<template>
  <div id="IncomeDetail">
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别" label-width="30%">
              <Select2
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                className="multiple-select w100"
                :clearable="true"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" label-width="30%">
              <el-input class="w100" v-model="searchForm.caseNo" />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="鉴定对象" label-width="30%">
              <el-input class="w100" v-model="searchForm.authenticatedTarget" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="联系人" label-width="30%">
              <el-input class="w100" v-model="searchForm.contact" />
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
            <el-form-item label="开票状态" label-width="30%">
              <el-select
                v-model="searchForm.billingStatus"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="未开票" value="0"></el-option>
                <el-option label="部分开票" value="1"></el-option>
                <el-option label="全部开票" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search()"
            style="float: right"
            >查询
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-button-group>
      <el-button type="primary" size="mini" @click="goBack"
        ><i class="fa fa-sign-out"></i>返回
      </el-button>
      <el-button type="primary" size="mini" @click="exportList()"
        ><i class="fa fa-sign-out"></i>导出
      </el-button>
    </el-button-group>
    <Table
      :data.sync="tableData"
      :page.sync="page"
      :sort.sync="tablesort"
      :search.sync="searchdata"
      port="caseQuantityRevenuesDetail"
      :hasPaging="true"
      postType="postFormData"
      :selfDefinedBtn="true"
      :isSelect="true"
      @selectChange="handleCheckBox"
      :max-height="tableHeight"
    >
      <template solt>
        <el-table-column fixed width="55" type="selection"></el-table-column>
        <el-table-column
          prop="serialNumber"
          label="流水号"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="financeInfo.amountReceivedDate"
          width="120"
          label="收费确认日期"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.financeInfo.amountReceivedDate">{{
              $divideDate(scope.row.financeInfo.amountReceivedDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="caseNo"
          label="案件编号"
          width="250"
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
          prop="entrustInfo.entrustingUnit.name"
          label="委托方"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.entrustInfo.entrustingUnit &&
              scope.row.entrustInfo.entrustingUnit.name != ""
                ? scope.row.entrustInfo.entrustingUnit.name
                : scope.row.entrustInfo.entrustingParty
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="entrustInfo.contact.name"
          label="联系人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="entrustingDate"
          label="委托日期"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.entrustingDate">{{
              $divideDate(scope.row.entrustingDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="acceptDate"
          label="受理日期"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.acceptDate">{{
              $divideDate(scope.row.acceptDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reportOutDate"
          label="出案日期"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reportOutDate">{{
              $divideDate(scope.row.reportOutDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="giveDate"
          label="发放日期"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.giveInfo">{{
              $divideDate(scope.row.giveInfo.giveDate)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="assist.participant.hrStaff.name"
          label="鉴定助理"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auth1.participant.hrStaff.name"
          label="第一鉴定人"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auth2.participant.hrStaff.name"
          label="第二鉴定人"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auth3.participant.hrStaff.name"
          label="第三鉴定人"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="reviewer.participant.label"
          label="复核人"
          width="100"
        />
        <el-table-column
          prop="authorizedSignatory.participant.label"
          label="授权签字人"
          width="100"
        />
        <el-table-column
          prop="issuer.participant.label"
          label="签发人"
          width="100"
        />
        <el-table-column
          prop="labStaff.participant.label"
          label="实验人员"
          width="100"
        >
          <template slot-scope="scope">
            {{
              scope.row.labStaff.map((item) => item.participant.label).join(",")
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="financeInfo.amount.yuanFmt"
          label="合同金额"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="financeInfo.discount.yuanFmt"
          label="减免金额"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="financeInfo.amountRefund.yuanFmt"
          label="退费金额"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="financeInfo.amountReceivable.yuanFmt"
          label="应收金额"
          width="100"
          show-overflow-tooltip
        />
        <!-- <el-table-column
          prop="financeInfo.amountReceived.yuanFmt"
          label="已收金额"
          width="100"
          show-overflow-tooltip
        /> -->
        <el-table-column
          prop="financeInfo.notReceived.yuanFmt"
          label="待收金额"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="financeInfo.actualReceivable.yuanFmt"
          label="实收金额"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="financeInfo.invoiceAmount.yuanFmt"
          label="开票金额"
          width="100"
          show-overflow-tooltip
        />
      </template>
    </Table>
  </div>
</template>

<script>
import api from "../../../api";
import Select2 from "../../../components/common/Select2";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";

export default {
  name: "IncomeDetail",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},
      searchForm: {},
      tableData: [],
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: {},
      idList: "",
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      data.idList = this.idList;
      this.searchdata = data;
    },
    handleCheckBox(rows) {
      //rows是数组，返回是当前页已选是数据 [ { .. } , { ... }, .. ]
      var curpage = this.page.current; //当前页码，具体由自己写的组件取值
      this.selectData[curpage] = [];
      if (rows.length > 0) {
        rows.forEach((item) => {
          if (item && item.id !== undefined) {
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
    exportList() {
      var exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      let idList = this.selectRows.map((item) => item.id);
      exportExcelSearchData.idList = idList;
      if (exportExcelSearchData.idList.length == 0) {
        exportExcelSearchData.idList = this.idList;
      }
      this.$axios
        .post(
          api.caseQuantityRevenuesDetail + "/export",
          exportExcelSearchData,
          { responseType: "blob" }
        )
        .then((res) => {
          let {
            data: { data },
          } = res;
          if (!data) return;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "收入统计详情.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
  },
  watch: {
    orgId: function () {
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState("login", ["orgId"]),
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "收入统计详情");
    this.tableHeight =
      window.innerHeight - commonNum.tableBottomThreeRows + "px";
    /*if (this.$route.query.caseIds) {
                this.idList = this.$route.query.caseIds.split(",");
            }*/
    try {
      if (this.$store.getters["dataStatistics/getIncomeCaseIds"]) {
        this.idList =
          this.$store.getters["dataStatistics/getIncomeCaseIds"].split(",");
      } else {
        this.idList = window.sessionStorage.getItem("incomeCaseIds").split(",");
      }
    } catch (e) {
      this.idList = [];
    }
    this.searchdata = { idList: this.idList };
  },
  components: { Select2 },
};
</script>
