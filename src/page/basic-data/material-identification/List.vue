<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="鉴定材料列表" name="list">
      <div class="search-box" style="overflow: hidden">
        <el-form :model="searchForm" size="small" label-width="100px">
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="鉴定材料名称">
                <el-input v-model.trim="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="专业类别">
                <select-from-table
                  className="w100"
                  :model.sync="searchForm.professionCategoryId"
                  port="profession"
                  :modelId="true"
                  :clearable="true"
                ></select-from-table>
              </el-form-item>
            </el-col>

            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="类型">
                <select-from-dict
                  className="w100"
                  :model.sync="searchForm.materialTypeId"
                  :filterable="true"
                  data_type="material_type"
                  :modelId="true"
                  :clearable="true"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="材料性质">
                <select-from-dict
                  className="w100"
                  :model.sync="searchForm.materialPropertyId"
                  :filterable="true"
                  data_type="material_property"
                  :modelId="true"
                  :clearable="true"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="规格">
                <select-from-dict
                  className="w100"
                  :model.sync="searchForm.materialUnitId"
                  :filterable="true"
                  data_type="unit_type"
                  :modelId="true"
                  :clearable="true"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="处理方式">
                <select-from-dict
                  className="w100"
                  :model.sync="searchForm.handleTypeId"
                  :filterable="true"
                  data_type="handle_type"
                  :modelId="true"
                  :clearable="true"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="color: white; float: right"
              @click="search"
              >查询</el-button
            >
          </el-row>
        </el-form>
      </div>
      <Table
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        :page.sync="page"
        port="auth"
        @edit="edit"
        :hasPaging="true"
        :refreshSearch="true"
        @deleteRow="deleteRow"
        :selfDefinedBtn="false"
      >
        <template solt>
          <el-table-column
            prop="name"
            label="鉴定材料名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="materialType.label"
            show-overflow-tooltip
            label="类型"
          >
          </el-table-column>
          <el-table-column
            prop="materialProperty.label"
            show-overflow-tooltip
            label="材料性质"
          >
          </el-table-column>
          <el-table-column
            prop="materialUnit.label"
            show-overflow-tooltip
            label="规格"
          >
          </el-table-column>
          <el-table-column
            prop="handleType.label"
            show-overflow-tooltip
            label="处理方式"
          >
          </el-table-column>
          <el-table-column
            prop="professionCategoryList"
            show-overflow-tooltip
            label="专业类别"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
                {{ transform(scope.row.professionCategoryList) }}
              </span>
            </template>
          </el-table-column>
        </template>
      </Table>
    </el-tab-pane>
    <el-tab-pane label="鉴定材料添加" name="form"></el-tab-pane>
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";
export default {
  name: "List",
  data() {
    return {
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      activeName: "list",
      page: { current: 1, pageSize: 30, total: 0 },
      tableData: [],
      tablesort: null,
      searchdata: {},
      searchForm: {},
    };
  },
  methods: {
    transform(arr) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    init(data) {
      let searchItem = JSON.parse(window.sessionStorage.getItem("searchItems"));
      if (searchItem != {}) {
        var searchData = searchItem;
      } else {
        var searchData = JSON.parse(JSON.stringify(data));
      }
      searchData["page.current"] = this.page.current;
      searchData["page.pageSize"] = this.page.pageSize;
      this.$get(api.auth, searchData)
        .then((res) => {
          this.tableData = res.data.list;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.page.total = res.data.total;
          window.sessionStorage.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      let searchItem = JSON.parse(window.sessionStorage.getItem("searchItems"));
      var data = JSON.parse(JSON.stringify(this.searchForm));
      if (
        searchItem != {} &&
        JSON.stringify(data) == "{}" &&
        searchItem != null
      ) {
        this.searchForm = searchItem;
        this.searchdata = searchItem;
      } else {
        this.searchdata = data;
        window.sessionStorage.setItem(
          "searchItems",
          JSON.stringify(this.searchForm)
        );
      }
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除" + row.name + "?")
        .then((res) => {
          this.$del(api.auth + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.init(this.searchdata);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    edit(index, row) {
      this.$router
        .push({ path: "/auth/inspectionmaterials/form", query: { id: row.id } })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval != "list") {
        this.$router
          .push({ path: "/auth/inspectionmaterials/form" })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != "/auth/inspectionmaterials/form") {
      window.sessionStorage.removeItem("searchItems");
    }
    next();
  },
  mounted() {
    this.search();
  },
};
</script>

<style scoped>
</style>