<template>
  <div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="案件资料移交" name="caseMaterialTransfer">
        <div class="search-box" v-if="activeName == 'caseMaterialTransfer'">
          <el-form
            :model="searchForm"
            ref="transferForm"
            size="small"
            label-width="100px"
          >
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="专业类别">
                  <select-from-table
                    className="w100"
                    :model.sync="searchForm.professionCategoryId"
                    :clearable="true"
                    :modelId="true"
                    port="profession"
                  ></select-from-table>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="委托单位">
                  <select-client
                    className="w100"
                    :model.sync="searchForm.entrustingUnit"
                  ></select-client>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="鉴定对象">
                  <el-input
                    class="w100"
                    v-model.trim="searchForm.authenticatedTarget"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="登记日期">
                  <DataPicker
                    :startValue.sync="searchForm.beginRegisterDate"
                    :endValue.sync="searchForm.endRegisterDate"
                    valueFormat="yyyy/MM/dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="受理日期">
                  <DataPicker
                    :startValue.sync="searchForm.beginAcceptDate"
                    :endValue.sync="searchForm.endAcceptDate"
                    valueFormat="yyyy/MM/dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="案件编号">
                  <el-input v-model.trim="searchForm.caseNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="联系人" class="margin0">
                  <el-input v-model.trim="searchForm.contact"></el-input>
                </el-form-item>
              </el-col>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="search"
                style="float: right"
                >查询
              </el-button>
            </el-row>
          </el-form>
        </div>
        <el-button-group style="margin-bottom: 10px">
          <el-button
            type="primary"
            size="mini"
            v-if="hasPermission('auth:material:transfer:save')"
            @click="saveMaterialType"
            >保存
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="hasPermission('auth:material:transfer:do')"
            @click="confirmTransfer"
            >移交
          </el-button>
        </el-button-group>
        <el-form>
          <el-table
            ref="caseTable"
            fit
            :stripe="true"
            border
            size="mini"
            :data="tableData"
            @selection-change="handleSelectionChange"
            :max-height="tableHeight"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="案件编号" width="250px" prop="caseNo"
              ><template slot-scope="scope">
                <router-link
                  target="_blank"
                  :to="{
                    path: '/case/case-detail',
                    query: { id: scope.row.id },
                  }"
                  style="text-decoration: none"
                >
                  <el-link type="primary" style="font-size: 12px"
                    >{{ scope.row.caseNo ? scope.row.caseNo : "无" }}
                  </el-link>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustInfo.authenticatedTarget"
              show-overflow-tooltip
              label="被鉴定对象"
            >
            </el-table-column>
            <el-table-column label="委托鉴定事项" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.entrustingMatterList"
                  :key="index"
                >
                  {{
                    item.entrustingMatter ? item.entrustingMatter.name : null
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in materialTransferType"
              :key="item.id"
              :label="item.label"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <span>
                    <el-input
                      v-if="showInput"
                      v-model="
                        scope.row.materialTransfer.materialTransferEntryDtoList[
                          index
                        ].quantity
                      "
                      size="mini"
                    >
                    </el-input>
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column  >
                            <template slot-scope="scope">
                                    <span v-for="(entry,index1) in scope.row.materialTransfer.materialTransferEntryDtoList" :key="index1"> 
                                         <el-form-item v-if="entry.materialType.id == item.id"> 
                                            <el-input  v-model="scope.row.id"
                                                    size="mini">
                                            </el-input>
                                        </el-form-item>
                                    </span>
                            </template>
                        </el-table-column> -->
          </el-table>
          <div style="overflow: hidden; margin-top: 1%">
            <el-row>
              <!-- <el-col :span="4" :offset="1">
                                <span style="font-size: 14px;color:#606266">共{{page.total}}条数据</span>
                            </el-col> -->
              <!--<el-col :span="8" :offset="">-->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.current"
                :page-sizes="page.pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="page.total"
                background
                style="float: right"
              >
              </el-pagination>
              <!-- </el-col>-->
            </el-row>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="案件资料接收" name="caseMaterialReceive">
        <div class="search-box" v-if="activeName == 'caseMaterialReceive'">
          <el-form
            :model="searchForm"
            ref="receiveForm"
            size="small"
            label-width="100px"
          >
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="专业类别">
                  <select-from-table
                    className="w100"
                    :model.sync="searchForm.professionCategoryId"
                    :clearable="true"
                    :modelId="true"
                    port="profession"
                  ></select-from-table>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="委托单位">
                  <select-client
                    :model.sync="searchForm.entrustingUnit"
                  ></select-client>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="鉴定对象">
                  <el-input
                    v-model.trim="searchForm.authenticatedTarget"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="联系人" class="margin0">
                  <el-input v-model.trim="searchForm.contact"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="案件编号" class="margin0">
                  <el-input v-model.trim="searchForm.caseNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="状态" class="margin0">
                  <select-from-enum
                    :model.sync="searchForm.materialTransferStatus"
                    className="w100"
                    type="ca.MaterialTransferStatus"
                    :modelVal="true"
                    :clearable="true"
                  >
                  </select-from-enum>
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
                  icon="el-icon-search"
                  size="small"
                  @click="search"
                  >查询</el-button
                >
              </el-button-group>
            </el-row>
          </el-form>
        </div>
        <el-dialog
          :visible="moreSearchDialog"
          @close="moreSearchDialog = false"
        >
          <el-form :model="searchForm" size="small" label-width="100px">
            <el-row>
              <el-col
                :sm="innerPanClass.sm"
                :md="innerPanClass.md"
                :xl="innerPanClass.xl"
              >
                <el-form-item label="登记日期" label-width="30%">
                  <DataPicker
                    :startValue.sync="searchForm.beginRegisterDate"
                    :endValue.sync="searchForm.endRegisterDate"
                    valueFormat="yyyy/MM/dd HH:mm:ss"
                  />
                </el-form-item> </el-col
              ><el-col
                :sm="innerPanClass.sm"
                :md="innerPanClass.md"
                :xl="innerPanClass.xl"
              >
                <el-form-item label="受理日期" label-width="30%">
                  <DataPicker
                    :startValue.sync="searchForm.beginAcceptDate"
                    :endValue.sync="searchForm.endAcceptDate"
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
                <el-form-item label="出案日期" label-width="30%">
                  <DataPicker
                    :startValue.sync="searchForm.beginReportOutDate"
                    :endValue.sync="searchForm.endReportOutDate"
                    valueFormat="yyyy/MM/dd HH:mm:ss"
                  />
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
          <el-button type="primary" size="mini" @click="rejectMaterialTransfer"
            >驳回</el-button
          >
          <el-button type="primary" size="mini" @click="acceptMaterialTransfer"
            >接收</el-button
          >
          <el-button type="primary" size="mini" @click="exportExcel"
            >导出Excel</el-button
          >
        </el-button-group>
        <el-table
          ref="caseTable2"
          fit
          border
          size="mini"
          :stripe="true"
          :data="tableData"
          :max-height="tableHeight2"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="案件编号" width="250px" prop="caseNo">
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
            prop="entrustInfo.authenticatedTarget"
            show-overflow-tooltip
            label="被鉴定对象"
          >
          </el-table-column>
          <el-table-column label="委托鉴定事项" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                v-for="item in scope.row.entrustingMatterList"
                :key="item.id"
              >
                {{ item.entrustingMatter ? item.entrustingMatter.name : null }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="it in materialTransferType"
            :label="it.label"
            :key="it.id"
          >
            <template slot-scope="scope">
              <span
                v-for="entry in scope.row.materialTransfer
                  .materialTransferEntryDtoList"
                :key="entry.id"
              >
                <span v-if="entry.materialType.id === it.id">
                  {{ entry.quantity }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="acceptDate"
            label="受理日期"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.acceptDate">{{
                $divideDate(scope.row.acceptDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialTransfer.transferBy.hrStaff.name"
            show-overflow-tooltip
            label="移交人"
          >
          </el-table-column>
          <el-table-column
            prop="materialTransfer.transferDate"
            show-overflow-tooltip
            label="移交时间"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.materialTransfer.transferDate">{{
                $divideDate(scope.row.materialTransfer.transferDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialTransfer.receiveDate"
            show-overflow-tooltip
            label="接受时间"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.materialTransfer.receiveDate">{{
                $divideDate(scope.row.materialTransfer.receiveDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialTransfer.receiveBy.hrStaff.name"
            show-overflow-tooltip
            label="接收人"
          >
          </el-table-column>
        </el-table>
        <div
          style="
            display: flex;
            overflow: hidden;
            justify-content: flex-end;
            align-items: center;
            margin-top: 1%;
          "
        >
          <span style="font-size: 14px; color: #606266"
            >共{{ page.total }}条</span
          >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.current"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="sizes, prev, pager, next"
            :total="page.total"
            background
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "../../api";
import SelectFromQualification from "../../components/common/SelectFromQualification";
import commonNum from "@/utils/commonNum.js";

export default {
  name: "caseMaterialTransfer",
  components: { SelectFromQualification },
  data() {
    return {
      materialTransferDialog: false,
      activeName: "caseMaterialTransfer",
      page: {
        current: 1,
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
      },
      tableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: { entrustingUnit: {} },
      moreSearchDialog: false,
      formData: { selectedCases: [] },
      data_type: "transfer_material_type",
      materialTransferType: [],
      defaultMaterialTransferEntryDtoList: [],
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
      currentPageSelect: {},
      showInput: false,
      tableHeight: "0px",
      tableHeight2: "0px",
    };
  },
  inject: ["hasPermission"],
  methods: {
    judgeIsSelected(selected) {
      if (selected == 0) {
        this.$message({
          message: "请选择案件",
          type: "error",
        });
        return false;
      }
      return true;
    },
    init(one) {
      if (this.searchForm.entrustingUnit) {
        this.searchForm.entrustingUnitId = this.searchForm.entrustingUnit.id;
      }
      let portSuffix = "";
      var searchData = JSON.parse(JSON.stringify(this.searchForm));
      if (!one) {
        portSuffix = "/case-list";
      }
      searchData["page.current"] = this.page.current;
      searchData["page.pageSize"] = this.page.pageSize;
      this.$get(api.caseMaterialHandle + portSuffix, searchData)
        .then((res) => {
          var tableData = res.data.list.map((v) => {
            if (
              !v.materialTransfer ||
              v.materialTransfer.materialTransferEntryDtoList.length == 0
            ) {
              let defaultMaterialTransferEntryDtoList = JSON.parse(
                JSON.stringify(this.defaultMaterialTransferEntryDtoList)
              );
              Object.assign(v, {
                materialTransfer: {
                  materialTransferEntryDtoList: [].concat(
                    defaultMaterialTransferEntryDtoList
                  ),
                },
              });
            }
            return v;
          });
          this.tableData = tableData;
          this.showInput = true;

          let currentPageSelect = this.currentPageSelect[this.page.current]
            ? this.currentPageSelect[this.page.current]
            : [];
          this.$nextTick(() => {
            this.tableData.forEach((item) => {
              currentPageSelect.forEach((innerItem, index) => {
                if (innerItem.id == item.id) {
                  if (one) {
                    this.$refs.caseTable2.toggleRowSelection(item, true);
                  } else {
                    this.$refs.caseTable.toggleRowSelection(item, true);
                  }
                }
              });
            });
          });
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      this.moreSearchDialog = false;
      if (this.activeName === "caseMaterialTransfer") {
        this.init();
      } else {
        this.init(true);
      }
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      history.replaceState(
        {},
        "",
        this.$route.path + "?activeName=" + this.activeName
      );
    },
    handleSelectionChange(val) {
      this.formData.selectedCases = val;
      //保留每页的已选择的案件
      let currentPage = this.page.current;
      this.currentPageSelect[currentPage] = val;
    },
    saveMaterialType() {
      if (this.judgeIsSelected(this.formData.selectedCases)) {
        let materialTypeInfo = this.formData.selectedCases.map((item) => {
          item.materialTransfer.caseId = item.id;
          return item.materialTransfer;
        });
        this.$put(api.caseMaterialHandle + "/type", materialTypeInfo)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    confirmTransfer() {
      let materialTransferInfo = this.formData.selectedCases.map((item) => {
        let materialTransfer = item.materialTransfer;
        materialTransfer.caseId = item.id;
        materialTransfer.professionCategoryId = item.professionCategory.id;
        return materialTransfer;
      });
      this.$post(api.caseMaterialHandle, materialTransferInfo)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "移交成功",
              type: "success",
            });
            this.init();
          }
        })
        .catch((err) => {
          this.$message.error(
            err.errMsg.replace("{professionCategoryName}", err.extraInfo)
          );
        });
    },
    rejectMaterialTransfer() {
      if (this.judgeIsSelected(this.formData.selectedCases)) {
        let flag = false;
        for (let item in this.formData.selectedCases) {
          if (
            this.formData.selectedCases[item].materialTransfer.status !=
            "WAITING_TRANSFER"
          ) {
            flag = true;
            break;
          }
        }
        if (flag) {
          this.$message({
            message: "已接收或未移交的案件的不能驳回",
            type: "error",
          });
        } else {
          let ids = "";
          this.formData.selectedCases.forEach((it) => {
            ids = ids + it.materialTransfer.id + ",";
          });
          this.$put(
            api.caseMaterialHandle +
              "/reject/" +
              ids.substring(0, ids.length - 1)
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "驳回成功",
                  type: "success",
                });
                this.init(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    acceptMaterialTransfer() {
      if (this.judgeIsSelected(this.formData.selectedCases)) {
        let flag = false;
        for (let item in this.formData.selectedCases) {
          if (
            this.formData.selectedCases[item].materialTransfer.status !=
            "WAITING_TRANSFER"
          ) {
            flag = true;
            break;
          }
        }
        if (flag) {
          this.$message({
            message: "已接收或未移交的案件的不能接收",
            type: "error",
          });
        } else {
          let ids = "";
          this.formData.selectedCases.forEach((it) => {
            ids = ids + it.materialTransfer.id + ",";
          });
          this.$put(
            api.caseMaterialHandle +
              "/accept/" +
              ids.substring(0, ids.length - 1)
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "接收成功",
                  type: "success",
                });
                this.init(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    exportExcel() {
      let exportExcelSearchData = null;
      let idList = "";
      let count = 0;
      for (let key in this.currentPageSelect) {
        this.currentPageSelect[key].forEach((item) => {
          idList = idList + item.id + ",";
          count++;
        });
      }
      if (count < this.tableData.length) {
        exportExcelSearchData = { idList: idList };
      } else {
        exportExcelSearchData = JSON.parse(JSON.stringify(this.searchForm));
      }
      this.$axios
        .get("/api/ca-material-transfer/v1/ca-material-transfers/export", {
          params: exportExcelSearchData,
          responseType: "blob",
        })
        .then((res) => {
          let {
            data: { data },
          } = res;
          if (!data) {
            return;
          }
          let a = document.createElement("a");
          let url = window.URL.createObjectURL(new Blob([data]));
          a.setAttribute("download", "案件资料接收列表.xlsx");
          a.href = url;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          a = null;
          url = null;
        });
    },
    handleSizeChange() {
      if (this.activeName == "caseMaterialReceive") {
        this.init(true);
      } else {
        this.init();
      }
    },
    handleCurrentChange() {
      if (this.activeName == "caseMaterialReceive") {
        this.init(true);
      } else {
        this.init();
      }
    },
  },
  created() {
    let data = {};
    data["page.pageSize"] = 1000;
    data["page.current"] = 1;
    data.type = this.data_type;
    if (this.data_type) {
      this.$get(api.dict, data)
        .then((res) => {
          this.materialTransferType = [].concat(res.data.list);
          this.defaultMaterialTransferEntryDtoList = res.data.list.map((v) => {
            return { materialType: v, quantity: 0 };
          });
          if (this.$route.query.activeName == "caseMaterialReceive") {
            this.init(true);
          } else {
            this.init();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (sessionStorage.getItem("caseMaterialTransfer")) {
      let { activeName, form } = JSON.parse(
        sessionStorage.getItem("caseMaterialTransfer")
      );
      this.activeName = activeName;
      this.searchForm = form;
    }

    this.$store.dispatch("login/headerTitleChange", "案件资料移交");
    this.tableHeight = window.innerHeight - 420 + "px";
    this.tableHeight2 = window.innerHeight - 358 + "px";
  },
  watch: {
    activeName: function (newval, oldval) {
      if (this.activeName == "caseMaterialReceive") {
        this.searchForm = {
          //   materialTransferStatus: "TRANSFERRED",
          materialTransferStatus: "",
          entrustingUnit: {},
        };
        this.init(true);
      } else {
        this.searchForm = { entrustingUnit: {} };
        this.init();
      }
      if (newval) {
        sessionStorage.setItem(
          "caseMaterialTransfer",
          JSON.stringify({
            activeName: this.activeName,
            form: this.searchForm,
          })
        );
      }
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("caseMaterialTransfer");
  },
};
</script>

<style scoped>
</style>