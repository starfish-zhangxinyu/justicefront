<template>
  <div>
    <!--鉴定对象-->
    <el-form
      ref="form"
      label-width="130px"
      size="small"
      :model="acceptForm"
      class="demo-ruleForm"
      label-position="right"
    >
      <Portlet title="鉴定对象" :isKey="true">
        <template slot="buttonGroup">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addIdentifiedObject()"
            >增加
          </el-button>
        </template>
        <template slot="body">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="车" name="vehicle">
              <el-table
                :data="acceptForm.authenticatedVehicleList"
                stripe
                fit
                border
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="plateNumber">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>对象名称</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' +
                        scope.$index +
                        '.plateNumber'
                      "
                      :rules="$filter_rules({ required: true })"
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.plateNumber"
                        size="small"
                        @change="changeName(scope.$index, scope.row)"
                        @blur="
                          inputBlur(
                            scope.$index,
                            scope.row,
                            acceptForm.authenticatedVehicleList
                          )
                        "
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="vehicleType" label="车辆类型">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' +
                        scope.$index +
                        '.vehicleType'
                      "
                      label-width="0px"
                    >
                      <select-from-dict
                        :model.sync="scope.row.vehicleType"
                        :has-default="true"
                        data_type="vehicle_type"
                      ></select-from-dict>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' + scope.$index + '.brand'
                      "
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.brand"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="vin" label="车辆识别代码">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' + scope.$index + '.vin'
                      "
                      label-width="0px"
                    >
                      <el-input
                        @blur="verifyVinOrCredentialNo(1, scope.row.vin)"
                        v-model="scope.row.vin"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="contact" label="联系人">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' + scope.$index + '.contact'
                      "
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.contact"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="contactPhone" label="联系电话">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' +
                        scope.$index +
                        '.contactPhone'
                      "
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.contactPhone"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="parkingAddress" label="停放地点">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' +
                        scope.$index +
                        '.parkingAddress'
                      "
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.parkingAddress"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="
                        'authenticatedVehicleList.' + scope.$index + '.remarks'
                      "
                      label-width="0px"
                    >
                      <el-input
                        v-model="scope.row.remarks"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                  <template slot-scope="scope">
                    <Uploadpictures
                      style="margin: 0"
                      :model.sync="scope.row.images"
                      :multiple="true"
                    ></Uploadpictures>
                    <Czur :model.sync="scope.row.images"></Czur>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      style="margin-left:10px;"
                      @click="
                        deleteRow(
                          scope.$index,
                          scope.row,
                          acceptForm.authenticatedVehicleList
                        )
                      "
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="人" name="person">
              <el-table
                :data="acceptForm.authenticatedPersonList"
                stripe
                fit
                border
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="name">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>姓名</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' + scope.$index + '.name'
                      "
                      :rules="$filter_rules({ required: true })"
                    >
                      <el-input
                        v-model="scope.row.name"
                        size="small"
                        @change="changeName(scope.$index, scope.row)"
                        @blur="
                          inputBlur(
                            scope.$index,
                            scope.row,
                            acceptForm.authenticatedPersonList
                          )
                        "
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="nationality" label="民族">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' +
                        scope.$index +
                        '.nationality'
                      "
                    >
                      <select-from-dict
                        :model.sync="scope.row.nationality"
                        :has-default="true"
                        data_type="nationality"
                      ></select-from-dict>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'authenticatedPersonList.' + scope.$index + '.sex'"
                    >
                      <el-select
                        v-model="scope.row.sex"
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
                <el-table-column prop="age" label="年龄">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'authenticatedPersonList.' + scope.$index + '.age'"
                    >
                      <el-input
                        v-model.number="scope.row.age"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="家庭住址">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' + scope.$index + '.address'
                      "
                    >
                      <el-input
                        v-model="scope.row.address"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="credentialType" label="证件类型">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' +
                        scope.$index +
                        '.credentialType'
                      "
                    >
                      <select-from-dict
                        :model.sync="scope.row.credentialType"
                        :has-default="true"
                        data_type="credential_type"
                      ></select-from-dict>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="credentialNo" label="证件号码">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' +
                        scope.$index +
                        '.credentialNo'
                      "
                    >
                      <el-input
                        @blur="
                          verifyVinOrCredentialNo(
                            2 | 4 | 8,
                            scope.row.credentialNo
                          )
                        "
                        v-model="scope.row.credentialNo"
                        @change="changeCredentialNo(scope.$index, scope.row)"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="contact" label="联系人">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' + scope.$index + '.contact'
                      "
                    >
                      <el-input
                        v-model="scope.row.contact"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="contactPhone" label="联系电话">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' +
                        scope.$index +
                        '.contactPhone'
                      "
                    >
                      <el-input
                        v-model="scope.row.contactPhone"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedPersonList.' + scope.$index + '.remarks'
                      "
                    >
                      <el-input
                        v-model="scope.row.remarks"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                  <template slot-scope="scope">
                    <Uploadpictures
                      :model.sync="scope.row.images"
                      style="margin: 0"
                      :multiple="true"
                    ></Uploadpictures>
                    <Czur :model.sync="scope.row.images"></Czur>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      style="margin-left:10px;"
                      @click="
                        deleteRow(
                          scope.$index,
                          scope.row,
                          acceptForm.authenticatedPersonList
                        )
                      "
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="物" name="object">
              <el-table
                fit
                :data="acceptForm.authenticatedOtherList"
                stripe
                border
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="name">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>名称</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'authenticatedOtherList.' + scope.$index + '.name'"
                      :rules="$filter_rules({ required: true })"
                    >
                      <el-input
                        v-model="scope.row.name"
                        size="small"
                        @change="
                          changeName(
                            scope.$index,
                            scope.row,
                            acceptForm.authenticatedOtherList
                          )
                        "
                        @blur="
                          inputBlur(
                            scope.$index,
                            scope.row,
                            acceptForm.authenticatedOtherList
                          )
                        "
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'authenticatedOtherList.' + scope.$index + '.remarks'
                      "
                    >
                      <el-input
                        v-model="scope.row.remarks"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                  <template slot-scope="scope">
                    <Uploadpictures
                      :model.sync="scope.row.images"
                      style="margin: 0"
                      :multiple="true"
                    ></Uploadpictures>
                    <Czur :model.sync="scope.row.images"></Czur>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      style="margin-left:10px;"
                      @click="
                        deleteRow(
                          scope.$index,
                          scope.row,
                          acceptForm.authenticatedOtherList
                        )
                      "
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </Portlet>
    </el-form>

    <!--车辆识别码/证件号验证结果-->
    <verify-dialog ref="verifyDialog"></verify-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import api from "../../../api/index";
import Uploadpictures from "../../../components/common/Uploadpictures";
import Czur from "../../../components/common/Czur";
import VerifyDialog from "../VerifyVinOrCredentialNoDialog.vue";

export default {
  name: "AnthenticatedTarget",

  components: {
    Portlet: Portlet,
    Uploadpictures: Uploadpictures,
    VerifyDialog: VerifyDialog,
    Czur: Czur,
  },
  data() {
    return {
      activeName: "vehicle",
    };
  },
  methods: {
    addIdentifiedObject() {
      switch (this.activeName) {
        case "vehicle":
          this.acceptForm.authenticatedVehicleList.push({ oldName: "" });
          break;
        case "person":
          this.acceptForm.authenticatedPersonList.push({
            oldName: "",
            sex: "N",
          });
          break;
        case "object":
          this.acceptForm.authenticatedOtherList.push({ oldName: "" });
          break;
      }
    },
    /*车辆识别码/证件号验证事件触发*/
    verifyVinOrCredentialNo(type, vinOrCredentialNo) {
      this.$refs.verifyDialog.verifyVinOrCredentialNo(type, vinOrCredentialNo);
    },

    inputBlur(index, row, arr) {
      var arr1 = [].concat(arr);
      arr1.splice(index, 1);
      if (row.plateNumber) {
        var i = this.$findInArr(arr1, "plateNumber", row.plateNumber);
        if (i != -1) {
          this.$message({
            message: "车牌号重复！",
            type: "warning",
          });
          row.plateNumber = "";
        }
      } else {
        var i = this.$findInArr(arr1, "name", row.name);
        if (i != -1) {
          this.$message({
            message: "车牌号重复！",
            type: "warning",
          });
          row.name = "";
        }
      }
    },
    deleteRow(index, row, arr) {
      arr.splice(index, 1);
      var json = this.judege(row);
      if (json) {
        delete json.value;
        this.$store.commit("acceptCase/deleteMatterTargetList", json);
      }
    },
    judege(obj) {
      var entrustingMatterList = [].concat(
        this.entrustingAuth.entrustingMatterList
      );
      if (entrustingMatterList.length) {
        var json = null;
        entrustingMatterList.forEach((v, i) => {
          if (v.entrustingMatterTargetList.length) {
            v.entrustingMatterTargetList.forEach((value, inx) => {
              if (value.name == obj.oldName) {
                var type = value.type;
                switch (type) {
                  case "VEHICLE":
                    json = {
                      index1: i,
                      index2: inx,
                      value: { name: obj.plateNumber, type: "VEHICLE" },
                    };
                    break;
                  case "PERSON":
                    json = {
                      index1: i,
                      index2: inx,
                      value: { name: obj.name, type: "PERSON" },
                    };
                    break;
                  case "OTHER":
                    json = {
                      index1: i,
                      index2: inx,
                      value: { name: obj.name, type: "OTHER" },
                    };
                    break;
                }
              }
            });
          }
        });
        return json;
      }
    },
    changeName(index, row) {
      if (row.plateNumber) {
        if (row.oldName) {
          var json = this.judege(row);
          if (json) {
            this.$store.commit("acceptCase/changeMatterTargetList", json);
          }
        }
        row.oldName = row.plateNumber;
      } else {
        var json = this.judege(row);
        if (json) {
          this.$store.commit("acceptCase/changeMatterTargetList", json);
        }
        row.oldName = row.name;
      }
    },
    changeCredentialNo(index, row) {
      if (row.credentialNo && row.credentialNo.length == 18) {
        var birthDay = row.credentialNo.slice(6, 14);
        var year = birthDay.slice(0, 4);
        var month = birthDay.slice(4, 6);
        var day = birthDay.slice(6, 8);
        var time = year + "-" + month + "-" + day;
        var born = new Date(time);
        var now = new Date();
        var age = Math.floor((now - born) / 31536000000);
        this.$set(row, "age", age);
      }
    },
  },
  created() {
    let unWatch = this.$watch(
      "acceptForm",
      (newVal, oldVal) => {
        if (
          newVal.authenticatedVehicleList &&
          newVal.authenticatedVehicleList.length
        ) {
          this.activeName = "vehicle";
        } else if (
          newVal.authenticatedPersonList &&
          newVal.authenticatedPersonList.length
        ) {
          this.activeName = "person";
        } else if (
          newVal.authenticatedOtherList &&
          newVal.authenticatedOtherList.length
        ) {
          this.activeName = "object";
        }
        if (unWatch) unWatch();
      },
      { immediate: true, deep: true }
    );
  },
  watch: {
    //监听专业类别
    "basicMsg.professionCategory.id": function (newVal, oldVal) {
      if (newVal) {
        this.$get("/api/param/v1/params/value", {
          professionCategoryId: newVal,
          key: "authenticated.default.select",
        })
          .then((res) => {
            if (res.status == 200) {
              var activeName = res.data;
              if (activeName && activeName != "select_nothing") {
                this.activeName = activeName;
              } else {
                this.activeName = "vehicle";
              }
            }
          })
          .catch((err) => console.log(err));
      }
    },
  },
  computed: {
    ...mapState("acceptCase", {
      AcceptField: "acceptField",
      acceptForm: "anthenticatedTargetMsg",
      entrustingAuth: "entrustingAuthItem",
      basicMsg: "basicMsg",
    }),
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item__content {
  height: 52px;
}
/deep/ .el-form-item__error {
  position: absolute;
  top: 34px;
}
</style>