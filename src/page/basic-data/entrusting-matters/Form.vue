<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="委托事项列表" name="list"></el-tab-pane>
    <el-tab-pane :label="isAdd ? '委托事项添加' : '委托事项修改'" name="form">
      <el-form
        :model="addForm"
        size="small"
        ref="matterForm"
        label-width="150px"
      >
        <el-row>
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="委托事项名"
              prop="name"
              :rules="$filter_rules({ required: true })"
            >
              <el-input v-model.trim="addForm.name"></el-input>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
          <el-col :lg="{ span: 16 }">
            <el-form-item label="类型">
              <select-from-enum
                className="w100"
                :model.sync="addForm.key"
                :clearable="true"
                type="base.EntrustingMatterKey"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="专业类别"
              :rules="$filter_rules({ required: true })"
              prop="professionCategory"
            >
              <select-from-table
                className="w100"
                :model.sync="addForm.professionCategory"
                port="profession"
                @change="showDnaResultName"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
          <el-col :lg="{ span: 16 }">
            <el-form-item label="收费项目">
              <select-from-table
                :model.sync="addForm.chargingItemList"
                port="chargeItem"
                :multiple="true"
                className="multiple-select"
                :condition="chargingItemCondition"
                :clearable="true"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
          <el-col :lg="{ span: 16 }">
            <el-form-item label="默认标准">
              <select-from-table
                :model.sync="addForm.standardList"
                :multiple="true"
                className="multiple-select"
                port="standard"
                :condition="standardCondition"
                :clearable="true"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }" v-if="showDnaResultNameInput">
            <el-form-item label="DNA计算结果名称" prop="dnaResultName">
              <el-input v-model.trim="addForm.dnaResultName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model.trim="addForm.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="{ span: 16 }">
            <el-form-item label="排序序号" prop="sort">
              <el-input-number
                v-model.trim="addForm.sort"
                :precision="0"
                :step="1"
                :min="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  
      <div class="portlet">
        <div class="portlet-header">
          <span>委托事项细项</span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right; margin-right: 10px; margin-top: 5px"
            @click="addSubMatter"
            >增加
          </el-button>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
          <el-table
            :data="addForm.entrustingSubMatterList"
            stripe
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="name" label="细项名称">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.name" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteSubMatter(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-row>
        <el-col :span="2" :offset="11">
          <el-button
            type="success"
            size="mini"
            class="save-btn"
            @click="save('matterForm')"
            ><i class="fa fa-save"></i> 保存
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="mini"
            class="save-btn"
            @click="activeName = 'list'"
            ><i class="el-icon-arrow-left"></i> 返回
          </el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="委托事项导入" name="import"></el-tab-pane>
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";

export default {
  name: "Form",
  data() {
    return {
      activeName: "form",
      isAdd: true,
      isAddDetail: true,
      addForm: { id: "", entrustingSubMatterList: [] },
      disabled: false,
      chargingItemCondition: {},
      standardCondition: {},
      showDnaResultNameInput: false,
    };
  },
  methods: {
    addSubMatter() {
      this.addForm.entrustingSubMatterList.push({});
    },
    deleteSubMatter(index, row) {
      this.addForm.entrustingSubMatterList.splice(index, 1);
    },
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.$post(api.entrustingMatter, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                  this.$router
                    .push({ path: "/auth/entrustingmatters/list" })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$put(api.entrustingMatter + "/" + data.id, data).then(
              (res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.$router
                    .push({ path: "/auth/entrustingmatters/list" })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              }
            );
          }
        }
      });
    },
    showDnaResultName(newval) {
      if (newval.type.value == "DNA") {
        this.showDnaResultNameInput = true;
      } else {
        this.showDnaResultNameInput = false;
      }
      this.addForm.chargingItemList = [];
      this.addForm.standardList = [];
      this.chargingItemCondition = { professionCategoryId: newval.id };
      this.standardCondition = { professionCategoryId: newval.id };
    },
  },
  created() {
    this.activeName = "form";
    if (this.$route.query.id) {
      this.isAdd = false;
      this.$get(api.entrustingMatter + "/" + this.$route.query.id).then(
        (res) => {
          var data = JSON.parse(JSON.stringify(res.data));
          this.addForm = data;
          if (this.addForm.professionCategory.type.value == "DNA") {
            this.showDnaResultNameInput = true;
          } else {
            this.showDnaResultNameInput = false;
          }
          // this.showDnaResultName(this.addForm.professionCategory);
        }
      );
    } else {
      this.isAdd = true;
    }
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.$router
          .push({ path: "/auth/entrustingmatters/list" })
          .catch((err) => {
            console.log(err);
          });
      }
      if (newval == "import") {
        this.$router
          .push({ path: "/auth/entrustingmatters/import" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
</style>