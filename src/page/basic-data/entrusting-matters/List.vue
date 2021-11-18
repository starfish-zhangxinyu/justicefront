<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="委托事项列表" name="list">
      <div class="search-box" style="overflow: hidden">
        <el-form
          :model="searchForm"
          size="small"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="专业类别">
            <select-from-table
              @keyup="search"
              :model.sync="searchForm.professionCategoryId"
              port="profession"
              :clearable="true"
              :modelId="true"
            ></select-from-table>
          </el-form-item>

          <el-form-item label="委托事项名">
            <el-input
              v-model.trim="searchForm.name"
              @keyup.enter.native="search"
              :clearable="true"
            ></el-input>
          </el-form-item>

          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            style="color: white"
            @click="search"
            >查询</el-button
          >
        </el-form>
      </div>
      <Table
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        :page.sync="page"
        port="entrustingMatter"
        @edit="edit"
        :hasPaging="true"
        @deleteRow="deleteRow"
        :selfDefinedBtn="false"
      >
        <template solt>
          <el-table-column prop="name" label="委托事项名称"></el-table-column>
          <el-table-column prop="key.label" label="类型"> </el-table-column>
          <el-table-column prop="professionCategory.name" label="专业类别">
            <!--                        <template slot-scope="scope">-->
            <!--              <span v-if="scope.row.professionCategory">-->
            <!--              <span>{{scope.row.professionCategory.name?scope.row.professionCategory.name:'全部类别'}}</span>-->
            <!--              </span>-->
            <!--                        </template>-->
          </el-table-column>
          <el-table-column prop="chargingItemList" label="收费项目">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItemList">
                {{ transform(scope.row.chargingItemList) }}
              </span>
            </template>
          </el-table-column>
        </template>
      </Table>
    </el-tab-pane>
    <el-tab-pane label="委托事项添加" name="form"></el-tab-pane>
    <el-tab-pane label="委托事项导入" name="import"></el-tab-pane>
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";
export default {
  name: "List",
  data() {
    return {
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
      var searchData = JSON.parse(JSON.stringify(data));
      searchData["page.current"] = this.page.current;
      searchData["page.pageSize"] = this.page.pageSize;
      this.$get(api.entrustingMatter, searchData)
        .then((res) => {
          this.tableData = res.data.list;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      sessionStorage.setItem(
        "entrustingMatterSearchData",
        JSON.stringify(data)
      );
      this.searchdata = data;
    },
    edit(index, row) {
      this.$router
        .push({ path: "/auth/entrustingmatters/form", query: { id: row.id } })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除委托事项" + row.name + "?")
        .then((res) => {
          this.$del(api.entrustingMatter + "/" + row.id)
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
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval != "list") {
        if (newval == "import") {
          this.$router
            .push({ path: "/auth/entrustingmatters/import" })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$router
            .push({ path: "/auth/entrustingmatters/form" })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
  },
  created() {
    if (sessionStorage.getItem("entrustingMatterSearchData")) {
      this.searchdata = JSON.parse(
        sessionStorage.getItem("entrustingMatterSearchData")
      );
      this.searchForm = this.searchdata;
    }
  },
};
</script>

<style scoped>
</style>