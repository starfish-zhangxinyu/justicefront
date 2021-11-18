<template>
  <div>
    <el-form
      ref="form"
      label-width="0px"
      size="small"
      :model="acceptForm"
      class="demo-ruleForm"
    >
      <!--鉴定材料-->
      <Portlet title="鉴定材料">
        <template slot="buttonGroup">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addCriticalMaterials()"
            >增加
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="importCriticalMaterials('normal')"
            >导入
          </el-button>
        </template>
        <template slot="body">
          <el-table
            fit
            :data="acceptForm.inspectionMaterialListNormal"
            stripe
            border
            size="mini"
            style="width: 100%"
          >
            <!-- <el-table-column prop="type" label="鉴定材料类型" width="200%">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.type'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.type"
                    :has-default="true"
                    data_type="material_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="type" label="鉴定材料来源" width="200%">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.type'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.type"
                    :has-default="true"
                    data_type="material_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column width="300%" prop="name">
              <template slot="header">
                <i style="color: red; margin-right: 5px">*</i
                ><span>送检鉴定材料</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :rules="$filter_rules({ required: true })"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.name'
                  "
                >
                  <el-input
                    v-model="scope.row.name"
                    size="small"
                    @blur="
                      inputBlur(
                        scope.$index,
                        scope.row,
                        acceptForm.inspectionMaterialListNormal
                      )
                    "
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="130px">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.type'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.type"
                    :has-default="true"
                    data_type="material_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.quantity'
                  "
                >
                  <el-input
                    v-model.number="scope.row.quantity"
                    size="small"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="规格">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.unit'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.unit"
                    :has-default="true"
                    data_type="unit_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="acceptDate" width="200%" label="接收时间">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' +
                    scope.$index +
                    '.acceptDate'
                  "
                >
                  <el-date-picker
                    v-model="scope.row.acceptDate"
                    style="width: 100%"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="property" label="材料性质" width="130px">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' + scope.$index + '.property'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.property"
                    :has-default="true"
                    data_type="material_property"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="handleType" label="处理方式" width="130px">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' +
                    scope.$index +
                    '.handleType'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.handleType"
                    :has-default="true"
                    data_type="handle_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="submitMaterialPerson"
              label="送检人"
              width="130px"
            >
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' +
                    scope.$index +
                    '.submitMaterialPerson'
                  "
                >
                  <el-input
                    v-model="scope.row.submitMaterialPerson"
                    size="small"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="submitMaterialPhone"
              label="联系电话"
              width="140px"
            >
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListNormal.' +
                    scope.$index +
                    '.submitMaterialPhone'
                  "
                >
                  <el-input
                    v-model="scope.row.submitMaterialPhone"
                    size="small"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <Uploadpictures
                  :model.sync="scope.row.images"
                  :multiple="true"
                  style="margin: 0"
                ></Uploadpictures>
                <Czur :model.sync="scope.row.images"></Czur>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  style="margin-left: 10px"
                  @click="deleteMaterialRow(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </Portlet>
      <!--待补充鉴定材料-->
      <Portlet
        title="待补充鉴定材料"
        :isKey="basicMsg.entrustInfo.materialAllReady == 'N'"
        v-if="basicMsg.entrustInfo.materialAllReady == 'N'"
      >
        <template slot="buttonGroup">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addWaitingSendMaterials()"
            >增加
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="importCriticalMaterials('waitingSend')"
            >导入
          </el-button>
        </template>
        <template slot="body">
          <el-table
            :data="acceptForm.inspectionMaterialListWaitingSend"
            fit
            stripe
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="name" width="200%">
              <template slot="header">
                <i style="color: red; margin-right: 5px">*</i
                ><span>补充材料名称</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :rules="$filter_rules({ required: true })"
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.name'
                  "
                >
                  <el-input
                    v-model="scope.row.name"
                    size="small"
                    @blur="
                      inputBlur(
                        scope.$index,
                        scope.row,
                        acceptForm.inspectionMaterialListWaitingSend
                      )
                    "
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.type'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.type"
                    :has-default="true"
                    data_type="material_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.quantity'
                  "
                >
                  <el-input
                    v-model.number="scope.row.quantity"
                    size="small"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="规格">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.unit'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.unit"
                    :has-default="true"
                    data_type="unit_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="property" label="材料性质">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.property'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.property"
                    :has-default="true"
                    data_type="material_property"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="handleType" label="处理方式">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="
                    'inspectionMaterialListWaitingSend.' +
                    scope.$index +
                    '.handleType'
                  "
                >
                  <select-from-dict
                    :model.sync="scope.row.handleType"
                    :has-default="true"
                    data_type="handle_type"
                  ></select-from-dict>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="scope">
                <Uploadpictures
                  :model.sync="scope.row.images"
                  :multiple="true"
                ></Uploadpictures>
                <Czur :multiple="true"></Czur>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  style="margin-left: 10px"
                  @click="deleteWaitingMaterialRow(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </Portlet>

      <!--导入鉴定材料-->
      <el-dialog title="导入鉴定材料" :visible.sync="importMaterialDialog">
        <el-table
          :data="materialArr"
          tooltip-effect="dark"
          stripe
          border
          size="mini"
          style="width: 100%"
          @selection-change="importMaterialSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" label="送检材料名称"></el-table-column>
          <el-table-column
            prop="materialType.label"
            label="类型"
          ></el-table-column>
          <el-table-column
            prop="materialUnit.label"
            label="规格"
          ></el-table-column>
          <el-table-column
            prop="handleType.label"
            label="处理方式"
          ></el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" ref="importMaterialFooter">
          <div class="pagination-footer">
            <!--<pagination
              :pcurrent.sync="page.current"
              :page.sync="page"
              :data.sync="materialArr"
              :search.sync="searchdata"
              :sort.sync="tablesort"
              :port="auth"
            ></pagination>-->
          </div>
          <el-button @click="importMaterialDialog = false" size="small"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="confirmImportMaterial()"
            size="small"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import Uploadpictures from "../../../components/common/Uploadpictures";
import Czur from "../../../components/common/Czur";
import api from "../../../api/index";

export default {
  name: "AuthMaterial",
  components: { Portlet: Portlet, Uploadpictures: Uploadpictures, Czur: Czur },
  data() {
    return {
      //鉴定材料
      importMaterialDialog: false,
      materialArr: [],
      auth: "",
      page: { pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      checkedMaterial: [],
    };
  },
  computed: {
    ...mapState("acceptCase", {
      AcceptField: "acceptField",
      acceptForm: "materialNormal",
      basicMsg: "basicMsg",
      entrustMsg: "entrustMsg",
    }),
  },
  methods: {
    //增加鉴定材料
    addCriticalMaterials() {
      this.acceptForm.inspectionMaterialListNormal.push({
        status: { label: "正常", value: "NORMAL" },
        quantity: 1,
      });
    },
    //增加待补充鉴定材料
    addWaitingSendMaterials() {
      this.acceptForm.inspectionMaterialListWaitingSend.push({
        status: {
          label: "待补充材料",
          value: "WAITING_SEND",
        },
        quantity: 1,
      });
    },
    //输入框输入信息不能重复
    inputBlur(index, row, arr) {
      var arr1 = [].concat(arr);
      arr1.splice(index, 1);
      var i = this.$findInArr(arr1, "name", row.name);
      if (i != -1) {
        this.$message({
          message: "名称不能重复哟！",
          type: "warning",
        });
        row.name = "";
      }
    },
    //导入鉴定材料
    importCriticalMaterials(value) {
      this.$refs.importMaterialFooter.setAttribute("status", value);
      this.importMaterialDialog = true;
      this.auth = "auth";
      this.checkedMaterial = [];
      this.searchdata = {
        professionCategoryId: this.basicMsg.professionCategory.id,
      };
      this.$get(api[this.auth], this.searchdata).then((res) => {
        this.materialArr = res.data.list;
      });
    },
    importMaterialSelectionChange(selection) {
      this.checkedMaterial = [].concat(selection);
    },
    confirmImportMaterial() {
      var status = this.$refs.importMaterialFooter.getAttribute("status");

      this.checkedMaterial.forEach((v, i) => {
        if (status == "normal") {
          var index = this._.findIndex(
            this.acceptForm.inspectionMaterialListNormal,
            function (o) {
              return o.name == v.name;
            }
          );
          if (index == -1) {
            this.acceptForm.inspectionMaterialListNormal.push({
              type: v.materialType,
              unit: v.materialUnit,
              property: v.materialProperty,
              handleType: v.handleType,
              name: v.name,
              quantity: 1,
              status: { label: "正常", value: "NORMAL" },
            });
          } else {
            this.acceptForm.inspectionMaterialListNormal[index].quantity += 1;
          }
        } else {
          var index = this._.findIndex(
            this.acceptForm.inspectionMaterialListWaitingSend,
            function (o) {
              return o.name == v.name;
            }
          );
          if (index == -1) {
            this.acceptForm.inspectionMaterialListWaitingSend.push({
              type: v.materialType,
              unit: v.materialUnit,
              property: v.materialProperty,
              handleType: v.handleType,
              name: v.name,
              quantity: 1,
              status: {
                label: "待补充材料",
                value: "WAITING_SEND",
              },
            });
          } else {
            this.acceptForm.inspectionMaterialListWaitingSend[
              index
            ].quantity += 1;
          }
        }
      });
      this.importMaterialDialog = false;
    },
    deleteMaterialRow(index, row) {
      this.acceptForm.inspectionMaterialListNormal.splice(index, 1);
    },
    deleteWaitingMaterialRow(index, row) {
      this.acceptForm.inspectionMaterialListWaitingSend.splice(index, 1);
    },
  },
};
</script>

<style lang="less"  scoped>
/deep/ .el-form-item__content {
  height: 52px;
}
/deep/ .el-form-item__error {
  position: absolute;
  top: 34px;
}
</style>
