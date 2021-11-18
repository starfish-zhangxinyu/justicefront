<template>
  <div>
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="申请时间">
              <DataPicker
                :startValue.sync="searchForm.applyDateBegin"
                :endValue.sync="searchForm.applyDateEnd"
                valueFormat="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="完成时间">
              <DataPicker
                :startValue.sync="searchForm.completeDateBegin"
                :endValue.sync="searchForm.completeDateEnd"
                valueFormat="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别">
              <select-from-table
                className="multiple-select"
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :modelId="true"
                :clearable="true"
                :orgId="orgId"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="状态" class="margin0">
              <select-from-enum
                className="multiple-select"
                :model.sync="searchForm.status"
                :clearable="true"
                type="flow.FlowCaseStatus"
                :modelVal="true"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号" class="margin0">
              <el-input
                v-model="searchForm.caseNo"
                :clearable="true"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-button-group style="float: right">
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
            <el-form-item label="案件编号更改">
              <el-select
                v-model="searchForm.caseNoChange"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="变更类型">
              <el-select
                v-model="searchForm.reportChangeType"
                placeholder="请选择"
                style="width: 100%"
                :clearable="true"
              >
                <el-option label="出具补证书" value="0"></el-option>
                <el-option label="重出报告" value="1"></el-option>
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
            <el-form-item label="鉴定助理">
              <select-qualification
                dataScope="caseData"
                className="multiple-select"
                profession_category="ALL"
                qualification_type="ASSIST"
                :filterable="true"
                :model.sync="searchForm.assistId"
                :orgId="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="投诉类型">
              <select-from-dict
                className="multiple-select"
                :model.sync="searchForm.complaintTypeId"
                data_type="complaint_type"
                :clearable="true"
                :modelId="true"
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
            <el-form-item label="第一鉴定人">
              <select-qualification
                dataScope="caseData"
                className="multiple-select"
                profession_category="ALL"
                qualification_type="AUTH"
                :filterable="true"
                :model.sync="searchForm.firstAuthId"
                :orgId="orgId"
              ></select-qualification>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="申请人">
              <select-from-table
                :model.sync="searchForm.applyPersonId"
                :filterable="true"
                :clearable="true"
                port="register"
                className="multiple-select"
                :condition="{ type: 'case' }"
                :orgId="orgId"
              >
              </select-from-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="变更原因">
              <select-from-dict
                className="multiple-select"
                :model.sync="searchForm.reason"
                data_type="report_change_reason"
                :clearable="true"
                :orgId="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
          <el-col
            :sm="innerPanClass.sm"
            :md="innerPanClass.md"
            :xl="innerPanClass.xl"
          >
            <el-form-item label="更改内容">
              <select-from-dict
                className="multiple-select"
                :model.sync="searchForm.changePartId"
                data_type="change_part"
                :clearable="true"
                :modelId="true"
                :orgId="orgId"
              ></select-from-dict>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moreSearchDialog = false">取消</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </el-dialog>
    <el-button-group style="margin-bottom: 10px">
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:reportChange:export')"
        @click="exportExcel()"
      >
        导出
      </el-button>
      <el-button
        type="primary"
        size="small"
        v-if="hasPermission('auth:reportChange:fileUpload')"
        @click="changeReasonFileUpload()"
        >变更原因附件上传
      </el-button>
    </el-button-group>
    <el-table
      :data="tableData"
      fit
      border
      @select-all="handleCheckBox"
      @select="handleCheckBox"
      size="mini"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column fixed width="55" type="selection"></el-table-column>
      <el-table-column prop="caseDto.caseNo" label="案件编号" width="250px">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{
              path: '/case/case-detail',
              query: { id: scope.row.caseDto.id },
            }"
            style="text-decoration: none"
            v-if="scope.row.newCaseNo == null"
          >
            <el-link type="primary" style="font-size: 12px"
              >{{ scope.row.caseDto.caseNo ? scope.row.caseDto.caseNo : "无" }}
            </el-link>
          </router-link>
          <span v-else>{{
            scope.row.caseDto.caseNo ? scope.row.caseDto.caseNo : "无"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="变更类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.reportChangeType == '0'">补正书</span>
          <span v-if="scope.row.reportChangeType == '1'">重出报告</span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="变更原因" show-overflow-tooltip />
      <el-table-column
        prop="changePartLabel"
        label="更改内容"
        show-overflow-tooltip
      />
      <el-table-column
        prop="complaintType.label"
        label="投诉类型"
        show-overflow-tooltip
      />
      <el-table-column prop="status.label" label="状态" show-overflow-tooltip />
      <el-table-column
        prop="caseDto.assist.participant.hrStaff.name"
        label="鉴定助理"
        show-overflow-tooltip
      />
      <el-table-column
        prop="caseDto.auth1.participant.hrStaff.name"
        label="第一鉴定人"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createBy.hrStaff.name"
        label="申请人"
        show-overflow-tooltip
      />
      <el-table-column prop="createDate" label="申请时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{
            $divideDate(scope.row.createDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="批准时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.status.value == 'PASS'">{{
            $divideDate(scope.row.updateDate)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="caseNoChange"
        label="案件编号更改"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.caseNoChange == '0'">否</span>
          <span v-if="scope.row.caseNoChange == '1'">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="newCaseNo"
        label="新案件编号"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{
              path: '/case/case-detail',
              query: { id: scope.row.caseDto.id },
            }"
            style="text-decoration: none"
            v-if="scope.row.newCaseNo != null"
          >
            <el-link type="primary" style="font-size: 12px">
              <span
                v-if="
                  scope.row.caseNoChange == '1' && scope.row.newCaseNo == 'auto'
                "
                >自动生成
              </span>
              <span
                v-if="
                  scope.row.caseNoChange == '1' &&
                  scope.row.newCaseNo != 'auto' &&
                  scope.row.status.value == 'PASS'
                "
                >{{ scope.row.newCaseNo }}}</span
              >
              <span
                v-if="
                  scope.row.caseNoChange == '1' &&
                  scope.row.newCaseNo != 'auto' &&
                  scope.row.status.value != 'PASS'
                "
                >顺序号:{{ scope.row.newCaseNo }}</span
              >
            </el-link>
          </router-link>
          <span v-else>
            <span
              v-if="
                scope.row.caseNoChange == '1' && scope.row.newCaseNo == 'auto'
              "
              >自动生成</span
            >
            <span
              v-if="
                scope.row.caseNoChange == '1' &&
                scope.row.newCaseNo != 'auto' &&
                scope.row.status.value == 'PASS'
              "
              >{{ scope.row.newCaseNo }}}</span
            >
            <span
              v-if="
                scope.row.caseNoChange == '1' &&
                scope.row.newCaseNo != 'auto' &&
                scope.row.status.value != 'PASS'
              "
              >顺序号:{{ scope.row.newCaseNo }}</span
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)"
            >详情
          </el-button>
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
        port="reportChangeList"
        :org-id="orgId"
      >
      </pagination>
    </div>
    <el-dialog
      width="50%"
      title="变更原因附件上传"
      :visible.sync="showChangeReasonFileDialog"
    >
      <el-form :model="fileForm" size="small" ref="fileForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <Portlet title="附件">
              <template slot="buttonGroup">
                <el-upload
                  style="float: right; margin-right: 10px"
                  class="upload-demo"
                  action="#"
                  :multiple="true"
                  :on-change="handleChangeFile"
                  :auto-upload="false"
                  :show-file-list="false"
                  list-type="picture"
                >
                  <el-button type="primary" icon="el-icon-plus" size="mini"
                    >上传</el-button
                  >
                </el-upload>
                <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                                           style="float: right;margin-right: 10px;margin-top: 11px">扫描
                                </el-button> -->
                <Czur
                  :isScan="true"
                  style="float: right; margin-right: 10px"
                ></Czur>
              </template>
              <template slot="body">
                <FileWall :model.sync="fileForm.files" :has-title="false">
                </FileWall>
              </template>
            </Portlet>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangeReasonFileDialog = false">取 消</el-button>
        <el-button type="primary" @click="uploadChangeReasonFile('fileForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--报告变更详情窗口开始-->
    <el-dialog
      width="30%"
      title="报告变更详情"
      :visible.sync="showDetailDialog"
    >
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">案件编号</span>
          <span class="detail" v-if="detailData.caseDto">{{
            detailData.caseDto.caseNo
          }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">变更原因</span>
          <span class="detail" v-if="detailData.reason">{{
            detailData.reason
          }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">投诉类型</span>
          <span
            class="detail"
            v-if="detailData.complaintType && detailData.complaintType.label"
            >{{ detailData.complaintType.label }}</span
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">更改内容</span>
          <span class="detail" v-if="detailData.changePartLabel">{{
            detailData.changePartLabel
          }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">更改内容摘要</span>
          <span class="detail" v-if="detailData.changeContent">{{
            detailData.changeContent
          }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">报告变更类型</span>
          <span class="detail" v-if="detailData.reportChangeType == '0'"
            >出具补正书</span
          >
          <span class="detail" v-if="detailData.reportChangeType == '1'"
            >重出鉴定意见书</span
          >
        </el-col>
      </el-row>
      <el-row v-if="detailData.reportChangeType == '0'">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">补正书</span>
          <el-button type="primary" size="small" @click="showReportChangeFile"
            >查看补正书
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="detailData.reportChangeType == '1'">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">原报告是否收回</span>
          <span class="detail" v-if="detailData.reportReceive == '0'"
            >已收回</span
          >
          <span class="detail" v-if="detailData.reportReceive == '1'"
            >无法收回</span
          >
        </el-col>
      </el-row>
      <el-row v-if="detailData.reportChangeType == '1'">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">案件号</span>
          <span class="detail" v-if="detailData.caseNoChange == '0'"
            >案件号不变</span
          >
          <span class="detail" v-if="detailData.caseNoChange == '1'"
            >案件号改变</span
          >
        </el-col>
      </el-row>
      <el-row v-if="detailData.caseNoChange == '1'">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">案件编号</span>
          <span class="detail" v-if="detailData.isAutoCaseNo == '0'"
            >自动编号</span
          >
          <span class="detail" v-if="detailData.isAutoCaseNo == '1'"
            >手动编号</span
          >
        </el-col>
      </el-row>
      <el-row v-if="detailData.isAutoCaseNo == '1'">
        <el-col :lg="{ span: 16, offset: 4 }">
          <span class="label" v-if="detailData.status.value != 'PASS'"
            >顺序号</span
          >
          <span class="label" v-if="detailData.status.value == 'PASS'"
            >新案件编号</span
          >
          <span class="detail" v-if="detailData.newCaseNo">{{
            detailData.newCaseNo
          }}</span>
        </el-col>
      </el-row>
      <el-row v-if="detailData.entrustingInfoFileList">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">委托方情况说明附件</span>
          <div class="detail">
            <el-link
              v-for="(item, index) in detailData.entrustingInfoFileList"
              :key="index"
              :href="item.url"
              target="_blank"
              >{{ index == 0 ? null : "，" }}{{ `附件${index + 1}` }}
            </el-link>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="detailData.reportFileList">
        <el-col :lg="{ span: 16, offset: 4 }"
          ><span class="label">报告附件</span>
          <div class="detail">
            <el-link
              v-for="(item, index) in detailData.reportFileList"
              :key="index"
              :href="item.url"
              target="_blank"
              >{{ index == 0 ? null : "，" }}{{ `附件${index + 1}` }}
            </el-link>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!--报告变更详情窗口结束-->
  </div>
</template>

<script>
import api from "../../../api/index";
import SelectFromQualification from "../../../components/common/SelectFromQualification";
import PageOfficeApi from "../../../components/tpl/PageOfficeApi";
import Portlet from "../../layout/Portlet";
import FileWall from "../../../components/common/FileWall";
import Czur from "../../../components/common/Czur";
import commonNum from "@/utils/commonNum.js";
import { mapState } from "vuex";

export default {
  name: "ReportChangeList",
  components: {
    "select-qualification": SelectFromQualification,
    Portlet: Portlet,
    FileWall: FileWall,
    Czur,
  },
  computed: {
    ...mapState("login", ["headerTitle", "orgId"]),
  },
  watch: {
    orgId: function (newVal, oldVal) {
      this.searchForm = {};
      // this.init()
      // //清空表单
      // this.$refs.searchForm.resetFields();
    },
  },
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      innerPanClass: {
        sm: { span: 24 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      moreSearchDialog: false,
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: {},
      sysUserListData: [], //用户数据
      //选择框相关
      selectData: {}, //记录每页选中的数据{1:[],2:[],...}
      selectDataLength: 0, //所有选中数据的长度
      selectRows: [], //记录所有选中的数据{[],[],[],...},

      //详情模态框
      showDetailDialog: false,
      detailData: { reportChangeType: "" },

      //变更原因附加相关
      showChangeReasonFileDialog: false,
      fileForm: { files: [] },
    };
  },
  inject: ["hasPermission"],
  methods: {
    search() {
      this.moreSearchDialog = false;
      var data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.reason) {
        data.reason = data.reason.label;
      }
      if (data.applyPersonId != null) {
        data.applyPersonId = data.applyPersonId.id;
      }
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
    detail(row) {
      this.$get(
        api.caseChange + "/get?caseId=" + row.caseDto.id + "&id=" + row.id
      )
        .then((res) => {
          var data = JSON.parse(JSON.stringify(res.data));
          //处理案件编号
          if (data.caseNoChange == "1") {
            if (data.newCaseNo == "auto") {
              data.isAutoCaseNo = "0";
            } else {
              data.isAutoCaseNo = "1";
            }
          }
          this.detailData = data;
          debugger;
          this.showDetailDialog = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exportExcel() {
      var exportExcelSearchData = null;
      var idList = "";
      if (this.selectRows.length > 0) {
        for (var i = 0; i < this.selectRows.length; i++) {
          var data = this.selectRows[i];
          idList = idList + data.id + ",";
        }
        exportExcelSearchData = { idList: idList };
      } else {
        var data = JSON.parse(JSON.stringify(this.searchForm));
        data.reason = data.reason ? data.reason.label : "";
        exportExcelSearchData = data;
      }
      this.$axios
        .get(api.reportChangeList + "/export", {
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
          link.setAttribute("download", "报告变更列表.xlsx");
          document.body.appendChild(link);
          link.click();
          url = null;
          link = null;
        })
        .catch((err) => console.log(err));
    },
    changeReasonFileUpload() {
      if (this.selectRows.length == 0) {
        this.$message.error("请至少选择一行记录进行操作！");
        return;
      }
      this.showChangeReasonFileDialog = true;
    },
    handleChangeFile(file, fileList) {
      var fileName = file.name;
      var fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.fileForm.files.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    uploadChangeReasonFile() {
      var _this = this;
      //压缩附件
      var data = [];
      var pList = [];
      _this.fileForm.files.forEach((v, i) => {
        if (v.raw) {
          if (v.fileType == "JPG" || v.fileType == "PNG") {
            let p = new Promise((resolve, reject) => {
              lrz(v.raw, { width: 1280 }).then(function (rst) {
                var index = v.name.lastIndexOf(".");
                var fileName = v.name.substring(0, index);
                var temp = {
                  name: fileName,
                  fileType: v.fileType,
                  base64Str: rst.base64,
                };
                data.push(temp);
                resolve();
              });
            });
            pList.push(p);
          } else {
            let p = new Promise((resolve, reject) => {
              _this.$getBase64(v.raw).then(function (res) {
                var index = v.name.lastIndexOf(".");
                var fileName = v.name.substring(0, index);
                var temp = {
                  name: fileName,
                  fileType: v.fileType,
                  base64Str: res,
                };
                data.push(temp);
                resolve();
              });
            });
            pList.push(p);
          }
        }
      });
      Promise.all(pList)
        .then((res) => {
          var ids = "";
          _this.selectRows.forEach((v) => {
            ids += v.id + ",";
          });
          _this
            .$put(
              api.caseChange +
                "/upload-file?ids=" +
                ids.substr(0, ids.length - 1),
              data
            )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "上传成功！",
                  type: "success",
                });
                this.showChangeReasonFileDialog = false;
                this.fileForm = { files: [] };
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch();
    },
    showReportChangeFile() {
      PageOfficeApi.openDoc(this.detailData.reportChangeFile, "N");
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "报告变更列表");
    this.tableHeight = window.innerHeight - commonNum.tableBottom + "px";
    var temp = {};
    temp["page.pageSize"] = 1000;
    temp["page.current"] = 1;
    this.$get("/api/user/v1/users", temp)
      .then((res) => {
        let arr = [];
        res.data.list.forEach((v, i) => {
          if (v.hrStaff) {
            arr.push(v);
          }
        });
        this.sysUserListData = arr;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped lang="less">
[v-cloak] {
  display: none;
}

.label {
  color: #1f2f3d;
  /*color:#428bca;*/
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  margin-right: 8px;
  white-space: nowrap;
  display: table-cell;

  &:after {
    content: ":";
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
}

.detail {
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  padding-bottom: 16px;
  /*color: #909399;*/
  color: #666666;
  display: table-cell;
}
</style>