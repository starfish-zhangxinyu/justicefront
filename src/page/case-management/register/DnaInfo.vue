<template>
  <el-form
    ref="form"
    label-width="0px"
    size="small"
    :model="acceptForm"
    class="demo-ruleForm"
  >
    <Portlet title="物证样本" :isKey="true">
      <template slot="buttonGroup">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="addDNASample()"
          >增加
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="showImportDnaSampleDialog = true"
        >
          导入物证样本
        </el-button>
      </template>
      <template slot="body">
        <el-table
          :data="acceptForm.dnaSampleList"
          stripe
          fit
          border
          size="mini"
          style="width: 100%"
        >
          <!-- <el-table-column prop="type" label="鉴定材料类型" width="200%">
            <template slot-scope="scope">
              <el-form-item
                label-width="0px"
                :prop="'inspectionMaterialListNormal.' + scope.$index + '.type'"
              >
                <select-from-dict
                  :model.sync="scope.row.type"
                  :has-default="true"
                  data_type="material_type"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="鉴定材料来源" width="200%">
            <template slot-scope="scope">
              <el-form-item
                label-width="0px"
                :prop="'inspectionMaterialListNormal.' + scope.$index + '.type'"
              >
                <select-from-dict
                  :model.sync="scope.row.type"
                  :has-default="true"
                  data_type="material_type"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column
            v-if="editDnaSampleno"
            fixed="left"
            prop="sampleNo"
            width="200%"
            label="样本编号"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sampleNo'"
              >
                <el-input
                  v-model="scope.row.sampleNo"
                  size="small"
                  :disabled="scope.row.isExport"
                  @focus="dnaSampleVerify(scope.row)"
                  @blur="
                    sampleNoBlur(
                      scope.$index,
                      scope.row,
                      acceptForm.dnaSampleList
                    )
                  "
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" width="200%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>姓名</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.name'"
                :rules="$filter_rules({ required: true })"
              >
                <el-input
                  v-model="scope.row.name"
                  size="small"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  @change="sampleNameChange(scope.$index, scope.row)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="150%" prop="nationality" label="民族">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.nationality'"
              >
                <select-from-dict
                  :model.sync="scope.row.nationality"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  data_type="nationality"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            width="150%"
            prop="isIdenticalTwins"
            label="是否同卵胞胎"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.isIdenticalTwins'"
              >
                <el-select
                  v-model="scope.row.isIdenticalTwins"
                  :disabled="scope.row.isExport"
                  value-key="id"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="tested" width="150%" label="是否是被检人">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.tested'">
                <el-select
                  v-model="scope.row.tested"
                  value-key="id"
                  :disabled="scope.row.isExport"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="credentialType" label="证件类型">
            <template slot-scope="scope">
              <el-form-item
                label-width="0px"
                :prop="'dnaSampleList.' + scope.$index + '.credentialType'"
              >
                <select-from-dict
                  :model.sync="scope.row.credentialType"
                  :has-default="true"
                  :disabled="scope.row.isExport"
                  data_type="credential_type"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="credentialNo" width="200%" label="证件号">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.credentialNo'"
              >
                <el-input
                  @change="retriveBirthDay(scope.$index)"
                  @blur="verifyCredentialNo(scope.row.credentialNo)"
                  v-model="scope.row.credentialNo"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="birthDate" width="200%" label="出生日期">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.birthDate'"
              >
                <el-date-picker
                  style="width: 100%"
                  :disabled="scope.row.isExport"
                  v-model="scope.row.birthDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  @change="birthDateChange(scope.$index, scope.row.birthDate)"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="age" width="150%" label="年龄（岁）">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.age'">
                <el-input
                  :disabled="scope.row.isExport"
                  @focus="dnaSampleVerify(scope.row)"
                  v-model.number="scope.row.age"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="month" width="150%" label="年龄（月）">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.month'">
                <el-input
                  :disabled="scope.row.isExport"
                  @focus="dnaSampleVerify(scope.row)"
                  v-model.number="scope.row.month"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="dnaSampleRelation" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>关系</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.dnaSampleRelation'"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="scope.row.dnaSampleRelation"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  @change="RelativeChange($event, scope.row)"
                  data_type="relation"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sex" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>性别</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sex'"
                :rules="$filter_rules({ required: true })"
              >
                <el-select
                  v-model="scope.row.sex"
                  value-key="id"
                  :disabled="scope.row.isExport"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option label="未知" value="N"></el-option>
                  <el-option label="男" value="M"></el-option>
                  <el-option label="女" value="F"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="transfused" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>有输血</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.transfused'"
                :rules="$filter_rules({ required: true })"
              >
                <el-select
                  v-model="scope.row.transfused"
                  value-key="id"
                  :disabled="scope.row.isExport"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option label="有" value="1"></el-option>
                  <el-option label="无" value="0"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="200%" label="住址">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.address'"
              >
                <el-input
                  v-model="scope.row.address"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="dnaSampleTypeList"
            width="300%"
            label="样品类型"
          >
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i
              ><span>样品类型</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.dnaSampleTypeList'"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="scope.row.dnaSampleTypeList"
                  data_type="sample_types"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  :multiple="true"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="bearer" width="200%" label="承载物">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.bearer'">
                <el-input
                  v-model="scope.row.bearer"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>数量</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.quantity'"
                :rules="$filter_rules({ required: true })"
              >
                <el-input
                  v-model.number="scope.row.quantity"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleUnit" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>单位</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sampleUnit'"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="scope.row.sampleUnit"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  data_type="sample_unit"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleCharacter" width="150%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i><span>性状</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sampleCharacter'"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="scope.row.sampleCharacter"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  data_type="sample_character"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="colour" width="150%" label="颜色">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.colour'">
                <el-input
                  v-model="scope.row.colour"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="size" width="150%" label="大小">
            <template slot-scope="scope">
              <el-form-item :prop="'dnaSampleList.' + scope.$index + '.size'">
                <el-input
                  v-model="scope.row.size"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="packaging" width="150%" label="包装">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.packaging'"
              >
                <el-input
                  v-model="scope.row.packaging"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleSource" width="200%">
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i
              ><span>样本来源</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sampleSource'"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="scope.row.sampleSource"
                  :hasDefault="true"
                  :disabled="scope.row.isExport"
                  data_type="sample_source"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleDesc" width="200%" label="样本描述">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.sampleDesc'"
              >
                <el-input
                  v-model="scope.row.sampleDesc"
                  @focus="dnaSampleVerify(scope.row)"
                  :disabled="scope.row.isExport"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="storePeriod" width="200%" label="保存期限">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.storePeriod'"
              >
                <select-from-dict
                  :model.sync="scope.row.storePeriod"
                  :disabled="scope.row.isExport"
                  data_type="store_period"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="extractWay" width="150%" label="取样方式">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.extractWay'"
              >
                <select-from-dict
                  :model.sync="scope.row.extractWay"
                  :disabled="scope.row.isExport"
                  data_type="sample_extract_way"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="acceptDate" width="200%" label="接收时间">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.acceptDate'"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="scope.row.acceptDate"
                  :disabled="scope.row.isExport"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="handleWay" width="150%" label="处理方式">
            <template slot-scope="scope">
              <el-form-item
                :prop="'dnaSampleList.' + scope.$index + '.handleWay'"
              >
                <select-from-dict
                  :model.sync="scope.row.handleWay"
                  :disabled="scope.row.isExport"
                  data_type="handle_type"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200px"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-button type="primary" :disabled="scope.row.isExport" icon="el-icon-upload" size="mini"></el-button> -->
              <Uploadpictures
                :model.sync="scope.row.images"
                :multiple="true"
                :isDisabled="scope.row.dnasampleDisabled || scope.row.isExport"
              ></Uploadpictures>
              <!-- <el-button type="primary" :disabled="scope.row.isExport" icon="el-icon-camera-solid" size="mini"></el-button> -->
              <Czur :model.sync="scope.row.images"></Czur>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRow(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Portlet>

    <!--物证样本导入窗口开始-->
    <el-dialog
      title="导入物证样本"
      width="720px"
      :visible.sync="showImportDnaSampleDialog"
    >
      <div class="search-box" style="overflow: hidden">
        <el-form
          :model="searchData"
          size="small"
          label-width="80px"
          :inline="true"
        >
          <el-form-item label="样本编号">
            <el-input
              v-model="searchData.sampleNo"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model="searchData.name"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件编号" width="240px">
            <el-input
              v-model="searchData.caseNo"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-button
            @click="search"
            icon="el-icon-search"
            size="small"
            type="primary"
            style="color: white"
            >查询
          </el-button>
        </el-form>
      </div>
      <el-table
        :data="importDnaSampleData"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
        @selection-change="importDnaSampleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="sampleNo" label="样本编号"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="caseNos" label="案件编号"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" ref="importDnaSampleFooter">
        <div class="pagination-footer">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="importDnaSampleData"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            :port="dnaSamplePort"
          ></pagination>
        </div>
        <el-button @click="showImportDnaSampleDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmImportDnaSample()" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--物证样本导入窗口结束-->

    <!--证件号验证结果-->
    <verify-dialog ref="verifyDialog" />
  </el-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import api from "../../../api/index";
import Czur from "../../../components/common/Czur";
import VerifyDialog from "../VerifyVinOrCredentialNoDialog.vue";
import Uploadpictures from "../../../components/common/Uploadpictures";
import IdCardUtils from "../../../utils/IdCard";

export default {
  name: "DnaInfo",
  components: { Portlet: Portlet, Czur, VerifyDialog, Uploadpictures },
  data() {
    return {
      editDnaSampleno: null,

      //导入物证样本
      dnaSamplePort: "dnaSample",
      showImportDnaSampleDialog: false,
      searchData: {},
      searchdata: {},
      importDnaSampleData: [],
      tablesort: null,
      page: { pageSizes: [5, 8, 10], pageSize: 10, total: 0, current: 1 },
      checkedImportDnaSample: [],
      rowFlag: false,
      row: -1, //增加的行数
      timer: null,
    };
  },
  methods: {
    sampleNoBlur(index, row, arr) {
      var arr1 = [].concat(arr);
      arr1.splice(index, 1);
      var i = this.$findInArr(arr1, "sampleNo", row.sampleNo);
      if (i != -1) {
        this.$message({
          message: "名称不能重复哟！",
          type: "warning",
        });
        row.sampleNo = "";
      }
    },

    /*证件号验证事件触发*/
    verifyCredentialNo(vinOrCredentialNo) {
      this.$refs.verifyDialog.verifyVinOrCredentialNo(
        2 | 4 | 8,
        vinOrCredentialNo
      );
    },
    /**根据输入的身份证号码，填充生日**/
    retriveBirthDay(index) {
      var row = this.acceptForm.dnaSampleList[index];
      if (row.credentialType.label == "身份证") {
        var info = IdCardUtils.idValid(row.credentialNo);
        if (!info) {
          return;
        }
        row.birthDate = info.birthDay + " 00:00:00";
        this.birthDateChange(index, info.birthDay);
      }
    },
    //增加物证样本
    addDNASample() {
      this.row += 1;
      this.acceptForm.dnaSampleList.push({
        oldName: "",
        quantity: "1",
        sex: "M",
        transfused: "0",
        age: null,
        month: null,
        birthDate: null,
      });
    },
    //样本名称变化
    sampleNameChange(index, row) {
      if (row.oldName) {
        var entrustingMatterList = [].concat(
          this.entrustingAuth.entrustingMatterList
        );
        if (entrustingMatterList.length) {
          entrustingMatterList.forEach((v, i) => {
            if (v.entrustingMatterTargetList.length) {
              v.entrustingMatterTargetList.forEach((value, inx) => {
                if (value.name == row.oldName) {
                  this.$store.commit("register/changeMatterTargetList", {
                    index1: i,
                    index2: inx,
                    value: { name: row.name, type: "DNA_SAMPLE" },
                  });
                }
              });
            }
          });
        }
      }
      row.oldName = row.name;
    },
    deleteRow(index, row) {
      this.row -= 1;
      this.acceptForm.dnaSampleList.splice(index, 1);
      if (row.oldName) {
        var entrustingMatterList = [].concat(
          this.entrustingAuth.entrustingMatterList
        );
        if (entrustingMatterList.length) {
          entrustingMatterList.forEach((v, i) => {
            if (v.entrustingMatterTargetList.length) {
              v.entrustingMatterTargetList.forEach((value, inx) => {
                if (value.name == row.oldName) {
                  this.$store.commit("register/deleteMatterTargetList", {
                    index1: i,
                    index2: inx,
                  });
                }
              });
            }
          });
        }
      }
    },
    search() {
      var json = JSON.parse(JSON.stringify(this.searchData));
      this.searchdata = json;
    },
    importDnaSampleSelectionChange(selection) {
      this.checkedImportDnaSample = [].concat(selection);
    },
    confirmImportDnaSample() {
      this.checkedImportDnaSample.forEach((v, i) => {
        var dnaSampleTypeList = [];
        v.dnaSampleTypeList.forEach((v1, i) => {
          dnaSampleTypeList.push(v1.dnaSampleType);
        });
        v.dnaSampleTypeList = dnaSampleTypeList;
        v.caseCount = 10;
        v.isExport = true; //是否是导入的物证样本
        this.acceptForm.dnaSampleList.push(v);
      });
      this.showImportDnaSampleDialog = false;
    },
    dnaSampleVerify(row) {
      if (row.caseCount > 1) {
        this.rowFlag = true;
      } else {
        this.rowFlag = false;
      }
      if (this.rowFlag) {
        this.$message.error(
          "该样本关联了其他案件，修改该样本将会同时修改其他案件对应样本！"
        );
      }
    },
    //出生日期发生变化时出发
    birthDateChange(index, time) {
      if (!time) {
        this.acceptForm.dnaSampleList[index].age = null;
        this.acceptForm.dnaSampleList[index].month = null;
        return;
      }
      //出生时间
      debugger;
      let birthDate = new Date(time);
      let birthYear = birthDate.getFullYear();
      let birthMonth = birthDate.getMonth();
      let birthDay = birthDate.getDate();
      //当前时间
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth();
      let currentDay = new Date().getDate();
      let date =
        currentYear * 12 + currentMonth - (birthYear * 12 + birthMonth);
      if (date > 0 || (date == 0 && currentDay - birthDay >= 0)) {
        let age = Math.floor(date / 12);
        let month = date % 12;
        if (currentDay - birthDay < 0) {
          month -= 1;
          if (month < 0) {
            month = 11;
            age = age - 1;
          }
        }
        this.acceptForm.dnaSampleList[index].age = age;
        this.acceptForm.dnaSampleList[index].month = month;
      } else {
        this.$message.error("出生日期不能晚于当天日期！");
        this.acceptForm.dnaSampleList[index].age = null;
        this.acceptForm.dnaSampleList[index].month = null;
      }
    },
    //亲属关系发生变化时出发
    RelativeChange(value, person) {
      person.sex = value.sampleRelationType.sex;
    },
  },
  watch: {
    "acceptForm.dnaSampleList": {
      handler(newVal, oldVal) {
        if (this.rowFlag) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$message.error(
              "该样本关联了其他案件，修改该样本将会同时修改其他案件对应样本！"
            );
          }, 500);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("register", {
      acceptForm: "dnaSampleMsg",
      entrustingAuth: "entrustingAuthItem",
    }),
  },
  created() {
    this.$get("/api/param/v1/params/value", {
      key: "edit.dna.sample.no",
    })
      .then((res) => {
        if (res.data) {
          this.editDnaSampleno = true;
        } else {
          this.editDnaSampleno = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.sex = null;
  },
};
</script>

<style lang="less" scoped>
.demo-ruleForm /deep/ .el-table__fixed-body-wrapper {
  z-index: auto !important;
}
</style>