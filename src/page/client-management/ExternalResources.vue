<template>
  <div id="external-resources">
    <!-- <PageBar title1="客户管理" title2="外部资源管理"></PageBar> -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="外部资源列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form
            :model="searchForm"
            size="small"
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="外部资源类型">
              <select-from-dict
                @keyup="search"
                :model.sync="searchForm.externalResourceTypeId"
                data_type="external_resource_type"
                :clearable="true"
                :modelId="true"
              ></select-from-dict>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input
                v-model.trim="searchForm.name"
                @keyup.enter.native="search"
                class="w215"
              />
            </el-form-item>

            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="color: white"
              @click="search"
              >查询
            </el-button>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          stripe
          fit
          border
          size="mini"
          style="width: 100%"
          :max-height="tableHeight"
        >
          <el-table-column
            prop="externalResourceType.label"
            label="类型"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 'F'">女</span>
              <span v-if="scope.row.sex == 'M'">男</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="birthday"
            label="生日"
            show-overflow-tooltip
            :formatter="formatDate"
          >
          </el-table-column>
          <el-table-column
            prop="position"
            label=" 技术职称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="professionSubject"
            label="科别/类别"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="professionQualification"
            label="行业资格"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="鉴定专业类别"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
                {{ transform(scope.row.professionCategoryList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                plain
                icon="el-icon-edit"
                size="mini"
                @click="edit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
              ></el-button>
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
            port="externalPerson"
          >
          </pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="isAdd ? '外部资源添加' : '外部资源修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          ref="resorceForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="类型"
                prop="externalResourceType"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-dict
                  className="w100"
                  :model.sync="addForm.externalResourceType"
                  data_type="external_resource_type"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="姓名"
                prop="name"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <el-input v-model.trim="addForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="性别">
                <el-radio-group v-model="addForm.sex">
                  <el-radio label="M">男</el-radio>
                  <el-radio label="F">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="电话">
                <el-input v-model.trim="addForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="生日">
                <el-date-picker
                  class="w100"
                  v-model="addForm.birthday"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="技术职称">
                <el-input v-model.trim="addForm.position"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="科别/类别">
                <el-input v-model.trim="addForm.professionSubject"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="行业资格">
                <el-input
                  v-model.trim="addForm.professionQualification"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="状态"
                prop="status"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <el-select
                  class="w100"
                  v-model="addForm.status"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option label="等待审批" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="专业类别"
                prop="professionCategoryList"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-table
                  :model.sync="addForm.professionCategoryList"
                  port="profession"
                  className="multiple-select"
                  :multiple="true"
                >
                  <template>
                    <el-option
                      label="全部类别"
                      :value="{ id: 'ALL' }"
                    ></el-option>
                  </template>
                </select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="11">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="save('resorceForm')"
              ><i class="fa fa-save"></i> 保存
            </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Test from "../../components/common/TreeSelect";
import Select2 from "../../components/common/Select2";
import api from "../../api/index";

export default {
  name: "ExternalResources",
  components: { Select2: Select2, treeSelect: Test },
  data() {
    return {
      activeName: "list",
      searchForm: {},
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: { type: "EXTERNAL_RESOURCE" },
      isAdd: true,
      tableData: [{ name: "jackson" }],
      addForm: { professionCategoryList: [] },
    };
  },
  methods: {
    formatDate(row, column, cellValue, index) {
      if (!cellValue) {
        return "";
      }
      var date = new Date(cellValue);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDay() < 10 ? "0" + date.getDay() : date.getDay();
      return year + "-" + month + "-" + day;
    },
    transform(arr) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    handleClick(tab, event) {
      if (sessionStorage.getItem("externalPersonSearchData")) {
        this.searchdata = JSON.parse(
          sessionStorage.getItem("externalPersonSearchData")
        );
        this.searchForm = this.searchdata;
      }
      //重置表单
      this.$refs["resorceForm"].resetFields();
    },
    init() {
      this.$get(api.externalPerson, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
        type: "EXTERNAL_RESOURCE",
      })
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.activeName = "list";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      data.type = "EXTERNAL_RESOURCE";
      sessionStorage.setItem("externalPersonSearchData", JSON.stringify(data));
      this.searchdata = data;
    },
    edit(index, row) {
      this.isAdd = false;
      this.activeName = "changelist";
      var data = JSON.parse(JSON.stringify(row));
      this.addForm = data;
      sessionStorage.setItem(
        "ExternalResources",
        JSON.stringify({
          isAdd: this.isAdd,
          activeName: this.activeName,
          form: this.addForm,
        })
      );
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除外部资源" + row.name + "?")
        .then((res) => {
          this.$del(api.externalPerson + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.init();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      // data.professionCategoryList = data.professionCategoryList.map((v, i) => {
      //     return {id: v};
      // });
      data.type = "EXTERNAL_RESOURCE";
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeName == "addlist") {
            this.$post(api.externalPerson, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                  this.init();
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$put(api.externalPerson + "/" + data.id, data).then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
                this.init();
                this.$refs[formName].resetFields();
              }
            });
          }
        }
      });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval) {
        sessionStorage.setItem(
          "ExternalResources",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addForm,
          })
        );
      }
      if (newval == "list" || newval == "addlist") {
        this.isAdd = true;
        this.$refs.resorceForm.resetFields();
        this.addForm = { professionCategoryList: [] };
      }
    },
  },
  created() {
    if (sessionStorage.getItem("ExternalResources")) {
      let { activeName, isAdd, form } = JSON.parse(
        sessionStorage.getItem("ExternalResources")
      );
      this.activeName = activeName;
      this.isAdd = isAdd;
      this.addForm = form;
    }
    this.$store.dispatch("login/headerTitleChange", "外部资源管理");
    this.tableHeight = window.innerHeight - 315 + "px";
  },
  beforeDestroy() {
    sessionStorage.removeItem("ExternalResources");
  },
};
</script>

<style scoped></style>
