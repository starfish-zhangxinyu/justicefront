<template>
  <Portlet title="毒物样本" :isKey="true">
    <template slot="buttonGroup">
      <el-button
        type="primary"
        icon="el-icon-upload2"
        size="mini"
        style="float: right; margin-right: 10px; margin-top: 5px"
        @click="addPoSample()"
        >增加
      </el-button>
    </template>
    <template slot="body">
      <el-form
        ref="form"
        label-width="0px"
        size="small"
        :model="acceptForm"
        class="demo-ruleForm"
      >
        <el-table
          :data="acceptForm.poSampleList"
          stripe
          border
          fit
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
            v-if="editPoisonSampleno"
            fixed="left"
            prop="sampleNo"
            width="200%"
            label="样本编号"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sampleNo'"
              >
                <el-input
                  v-model="scope.row.sampleNo"
                  size="small"
                  @blur="
                    sampleNoBlur(
                      scope.$index,
                      scope.row,
                      acceptForm.poSampleList
                    )
                  "
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleName" width="200%">
            <template slot="header" slot-scope="{ column, $index }">
              <i style="color: red; margin-right: 5px">*</i
              ><span>样品名称</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sampleName'"
                :rules="$filter_rules({ required: true })"
              >
                <el-input
                  v-model="scope.row.sampleName"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="authPersonName" width="200%">
            <template slot="header" slot-scope="{ column, $index }">
              <i style="color: red; margin-right: 5px">*</i><span>被检人</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.authPersonName'"
                :rules="$filter_rules({ required: true })"
              >
                <el-input
                  v-model="scope.row.authPersonName"
                  size="small"
                  @change="sampleNameChange(scope.$index, scope.row)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sex" width="150%" label="性别">
            <template slot-scope="scope">
              <el-form-item :prop="'poSampleList.' + scope.$index + '.sex'">
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
          <el-table-column prop="credentialType" label="证件类型">
            <template slot-scope="scope">
              <el-form-item
                label-width="0px"
                :prop="'poSampleList.' + scope.$index + '.credentialType'"
              >
                <select-from-dict
                  :model.sync="scope.row.credentialType"
                  :has-default="true"
                  data_type="credential_type"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="credentialNo" width="200%" label="证件号">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.credentialNo'"
              >
                <el-input
                  @blur="verifyCredentialNo(scope.row.credentialNo)"
                  v-model="scope.row.credentialNo"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="vesselNum" width="200%" label="采血管编号">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.vesselNum'"
              >
                <el-input v-model="scope.row.vesselNum" size="small"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sampleResource" width="200%" label="样本来源">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sampleResource'"
              >
                <el-input
                  v-model="scope.row.sampleResource"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" width="150%" label="数量">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.quantity'"
              >
                <el-input
                  v-model.number="scope.row.quantity"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="standard" width="150%" label="规格">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.standard'"
              >
                <select-from-dict
                  :model.sync="scope.row.standard"
                  :has-default="true"
                  data_type="standard"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="volumeQuality" width="150%" label="体积质量">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.volumeQuality'"
              >
                <el-input
                  v-model="scope.row.volumeQuality"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="acceptTime" width="150%" label="接收时间">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.acceptTime'"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="scope.row.acceptTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="volumeQuality" width="150%" label="接收人">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.acceptPerson'"
              >
                <el-input
                  v-model.number="scope.row.acceptPerson"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialCharacter"
            width="150%"
            label="检材性状"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.materialCharacter'"
              >
                <el-input
                  v-model.number="scope.row.materialCharacter"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="packagingCharacter"
            width="200%"
            label="包装状况"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.packagingCharacter'"
              >
                <select-from-dict
                  :model.sync="scope.row.packagingCharacter"
                  :has-default="true"
                  data_type="packaging_character"
                ></select-from-dict>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sendAuthPerson" width="150%" label="送检人">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sendAuthPerson'"
              >
                <el-input
                  v-model.number="scope.row.sendAuthPerson"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="sendAuthTelephone"
            width="150%"
            label="送检人电话"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sendAuthTelephone'"
              >
                <el-input
                  v-model.number="scope.row.sendAuthTelephone"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sendAuthTime" width="150%" label="送检时间">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.sendAuthTime'"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="scope.row.sendAuthTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="handle" width="150%" label="处理方式">
            <template slot-scope="scope">
              <el-form-item
                :prop="'poSampleList.' + scope.$index + '.handleType'"
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
            label="操作"
            width="200px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <Uploadpictures
                :model.sync="scope.row.images"
                style="margin: 0"
                :appendToBody="true"
                :multiple="true"
              ></Uploadpictures>
              <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
              <Czur :model.sync="scope.row.images"></Czur>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deletePoRow(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!--证件号验证结果-->
      <verify-dialog ref="verifyDialog" />
    </template>
  </Portlet>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import api from "../../../api/index";
import Czur from "../../../components/common/Czur";
import Uploadpictures from "../../../components/common/Uploadpictures";
import VerifyDialog from "../VerifyVinOrCredentialNoDialog.vue";

export default {
  name: "PoisonInfo",
  components: {
    Portlet: Portlet,
    Czur,
    VerifyDialog,
    Uploadpictures: Uploadpictures,
  },
  data() {
    return {
      editPoisonSampleno: null,
    };
  },
  methods: {
    //增加毒物样本
    addPoSample() {
      this.acceptForm.poSampleList.push({
        oldName: "",
        sex: "N",
        volumeQuality: "约2ml",
      });
    },
    /*证件号验证事件触发*/
    verifyCredentialNo(vinOrCredentialNo) {
      this.$refs.verifyDialog.verifyVinOrCredentialNo(
        2 | 4 | 8,
        vinOrCredentialNo
      );
    },

    deletePoRow(index, row) {
      this.acceptForm.poSampleList.splice(index, 1);
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
    //输入框编号不能重复
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
                    value: {
                      name: row.authPersonName,
                      type: "PO_SAMPLE",
                    },
                  });
                }
              });
            }
          });
        }
      }
      row.oldName = row.authPersonName;
    },
  },
  computed: {
    ...mapState("register", {
      acceptForm: "poisonSampleMsg",
      entrustingAuth: "entrustingAuthItem",
    }),
  },
  created() {
    this.$get("/api/param/v1/params/value", {
      key: "edit.poison.sample.no",
    })
      .then((res) => {
        if (res.data) {
          this.editPoisonSampleno = true;
        } else {
          this.editPoisonSampleno = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>