<template>
  <el-form
    ref="form"
    label-width="130px"
    size="small"
    :model="authResultForm"
    class="demo-ruleForm"
    label-position="right"
  >
    <Collapse
      :title="judgeData.title"
      :active="true"
      v-if="
        judgeData &&
        authResultForm.authResultList &&
        authResultForm.authResultList.length > 0
      "
    >
      <template>
        <el-table
          :data="authResultForm.authResultList"
          fit
          stripe
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column prop="authenticatedTarget" label="被鉴定对象/样本">
          </el-table-column>
          <el-table-column
            prop="caEntrustingMatter.entrustingMatter.name"
            label="委托事项"
          >
          </el-table-column>
          <el-table-column prop="result" label="鉴定结果" align="center">
            <template slot-scope="scope">
              <el-row v-if="judgeData.dataType">
                <!-- :rules="$filter_rules({required:true})" -->
                <el-form-item
                  label-width="0px"
                  :prop="'authResultList.' + scope.$index + '.result'"
                >
                  <select-from-dict
                    :model.sync="scope.row.result"
                    :clearable="true"
                    :data_type="judgeData.dataType['' + scope.$index]"
                  ></select-from-dict>
                </el-form-item>
              </el-row>

              <el-row v-else>
                <el-col :span="11">
                  <el-form-item
                    label-width="0px"
                    :prop="'authResultList.' + scope.$index + '.speedMin'"
                  >
                    <el-input v-model="scope.row.speedMin"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item
                    label-width="0px"
                    :prop="'authResultList.' + scope.$index + '.speedMax'"
                  >
                    <el-input v-model="scope.row.speedMax"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Collapse>
  </el-form>
</template>

<script>
import Collapse from "../../layout/Collapse";

export default {
  name: "AuthResult",
  props: ["model", "caseId", "basicData"],
  components: { Collapse: Collapse },
  data() {
    return {
      judgeData: null,
      authResultForm: this.model,
      dataTypeIndex: [],
    };
  },
  methods: {
    init() {
      var professionCategoryType = this.basicData.professionCategory.type;
      //获取委托事项类型
      var entrustingMatterTypeList = [];
      var datatype = {};
      this.basicData.entrustingMatterList.forEach((v, i) => {
        if (v.entrustingMatter) {
          entrustingMatterTypeList.push(v.entrustingMatter.key.value);
        }
      });
      this.authResultForm.authResultList = [].concat(
        this.basicData.authResultList
      );
      if (entrustingMatterTypeList.indexOf("DAMAGE_DEGREE") > -1) {
        //损伤程度鉴定
        this.authResultForm.authResultList.forEach((v, i) => {
          if (v.caEntrustingMatter) {
            if (v.caEntrustingMatter.entrustingMatter) {
              if (
                v.caEntrustingMatter.entrustingMatter.key.value.indexOf(
                  "DAMAGE_DEGREE"
                ) > -1
              )
                datatype["" + i] = "damage_degree";
            }
          }
        });
        this.judgeData = { title: "鉴定结果" };
      }

      if (entrustingMatterTypeList.indexOf("DISABILITY_LEVEL") > -1) {
        //伤残鉴定级别
        this.authResultForm.authResultList.forEach((v, i) => {
          if (v.caEntrustingMatter) {
            if (v.caEntrustingMatter.entrustingMatter) {
              if (
                v.caEntrustingMatter.entrustingMatter.key.value ==
                "DISABILITY_LEVEL"
              ) {
                datatype["" + i] = "disability_level";
              }
            }
          }
        });
        //datatype[1] = 'disability_level';

        this.judgeData = { title: "鉴定结果" };
      }

      if (professionCategoryType.value == "DOCUMENT") {
        //文书鉴定
        /* datatype[""+0] = 'document_conclusion'; */
        this.authResultForm.authResultList.forEach((v, i) => {
          datatype["" + i] = "document_conclusion";
        });
        this.judgeData = { title: "文书鉴定结果" }; //专业类别
      }
      if (entrustingMatterTypeList.indexOf("VEHICLE_SPEED") > -1) {
        datatype = null;
        this.judgeData = { title: "车速鉴定结果" };
      }
      this.judgeData["dataType"] = datatype;
    },
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        this.authResultForm = newVal;
      },
      deep: true,
      immediate: true,
    },
    authResultForm: {
      handler(newVal, oldVal) {
        this.$emit("update:model", newVal);
      },
      deep: true,
      immediate: true,
    },
    basicData() {
      this.init();
    },
  },
  created() {
    if (this.basicData) {
      this.init();
    }
  },
};
</script>

<style scoped>
</style>