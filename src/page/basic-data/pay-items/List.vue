<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="收费项目列表" name="list">
      <div class="search-box" style="overflow: hidden">
        <el-form
          :model="searchForm"
          size="small"
          label-width="100px"
          :inline="true"
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

          <el-form-item label="项目名称">
            <el-input
              v-model.trim="searchForm.name"
              placeholder="请输入"
              @keyup.enter.native="search"
              class="w215"
            />
          </el-form-item>

          <el-form-item label="收费类型">
            <el-select
              v-model="searchForm.chargingTypeKey"
              placeholder="请选择"
              @keyup.enter.native="search"
              :clearable="true"
            >
              <el-option
                v-for="item in opt"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            style="color: white"
            @click="search"
          >
            查询
          </el-button>
        </el-form>
      </div>
      <Table
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        :page.sync="page"
        port="chargeItem"
        @edit="edit"
        :hasPaging="true"
        @deleteRow="deleteRow"
        :selfDefinedBtn="false"
      >
        <template solt>
          <el-table-column prop="name" label="收费项目名称"> </el-table-column>
          <el-table-column prop="professionCategoryList" label="专业类别">
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.professionCategoryList"
                :key="index"
              >
                <!-- 不是最后一条数据加个逗号 -->
                <span
                  v-if="
                    item != null &&
                    index != scope.row.professionCategoryList.length - 1
                  "
                  >{{ item.name }},</span
                >
                <span
                  v-if="
                    item != null &&
                    index == scope.row.professionCategoryList.length - 1
                  "
                  >{{ item.name }}</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="chargingType.name" label="收费类型">
          </el-table-column>
          <el-table-column prop="price.yuanFmt" label="价格"> </el-table-column>
          <el-table-column prop="name" label="价格限制/金额">
            <template slot-scope="scope">
              <span v-if="scope.row.minPrice && scope.row.maxPrice">
                {{
                  scope.row.minPrice.yuanFmt + "~" + scope.row.maxPrice.yuanFmt
                }}</span
              >
              <span v-if="scope.row.minPrice && !scope.row.maxPrice"
                >{{ scope.row.minPrice.yuanFmt }}~</span
              >
              <span v-if="!scope.row.minPrice && scope.row.maxPrice">
                ~{{ scope.row.maxPrice.yuanFmt }}</span
              >
            </template>
          </el-table-column>
        </template>
      </Table>
    </el-tab-pane>
    <el-tab-pane label="收费项目添加" name="form"></el-tab-pane>
    <!--<el-tab-pane label="收费项目导入" name="import"></el-tab-pane>-->
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
      opt: [],
    };
  },
  methods: {
    init(data) {
      var searchData = JSON.parse(JSON.stringify(data));
      searchData["page.current"] = this.page.current;
      searchData["page.pageSize"] = this.page.pageSize;
      this.$get(api.chargeItem, searchData)
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
      sessionStorage.setItem("chargeItemSearchData", JSON.stringify(data));
      this.searchdata = data;
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除收费项目" + row.name + "?")
        .then((res) => {
          this.$del(api.chargeItem + "/" + row.id)
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
        .push({ path: "/auth/chargingitems/form", query: { id: row.id } })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval != "list") {
        if (newval == "import") {
          this.$router
            .push({ path: "/auth/chargingitems/import" })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$router
            .push({ path: "/auth/chargingitems/form" })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
  },
  created: function () {
    if (sessionStorage.getItem("chargeItemSearchData")) {
      this.searchdata = JSON.parse(
        sessionStorage.getItem("chargeItemSearchData")
      );
      this.searchForm = this.searchdata;
    }
    this.$get(api.chargingType)
      .then((res) => {
        this.opt = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>