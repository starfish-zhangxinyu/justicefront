<template>
  <div style="margin-top: 10px">
    <el-table
      :data="data"
      stripe
      fit
      border
      :resizable="false"
      @selection-change="handleCheckBox"
      row-key="id"
      size="mini"
      style="width: 100%"
      :max-height="maxHeight"
      :height="height"
      :row-class-name="tableRowClassName"
      :show-summary="sjtjPage"
      :summary-method="getSummaries"
      ref="tableRef"
    >
      <slot></slot>
      <el-table-column
        label="操作"
        width="150px"
        align="center"
        v-if="!selfDefinedBtn"
      >
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
    <div style="overflow: hidden" class="pagination-footer">
      <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.current"
        :page-sizes="pages.pageSizes"
        :page-size="pages.pageSize"
        :layout="layout"
        :total="pages.total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
import Sortable from "sortablejs";

export default {
  name: "Table",
  // props:['data','port','page','search','sort',],
  props: {
    data: Array,
    port: {
      //表格数据的接口
      type: String,
      required: true,
    },
    hasPaging: Boolean,
    page: {
      //页码信息
      type: Object,
      default() {
        return { current: 1, pageSize: 30 };
      },
    },
    refreshSearch: Boolean,
    selfDefinedBtn: {
      type: Boolean,
      required: false,
    },
    search: {
      type: Object,
      default() {
        return {};
      },
    },
    sort: {
      type: Object,
      default() {
        return null;
      },
    },
    postType: {
      type: String,
    },
    //是否可拖拽
    isDragdrop: {
      type: Boolean,
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: "total,sizes,prev, pager, next",
    }, //分页的类型参数
    maxHeight: {
      type: String,
    },
    height: {
      type: String,
    },
    orgId: {
      type: String,
    },
  },
  data() {
    return {
      // pageSizes: [],
      total: 0,
      pages: this.page,
      tableData: this.data,
      sjtjPage: false,
      sums: [],
    };
  },
  methods: {
    //案件量统计表格合计
    getSummaries({ columns, data }) {
      const sums = [];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].property != undefined) {
          let t = columns[i].property.split(".");
          if (t.length == 1) {
            if (data[data.length - 1] != null) {
              sums[i] = data[data.length - 1][t[0]];
              if (sums[i] == "合计") {
                sums[i] = "";
              }
            }
          } else if (t.length == 2) {
            if (data[data.length - 1] != null) {
              if (data[data.length - 1][t[0]] != null) {
                sums[i] = data[data.length - 1][t[0]][t[1]];
                if (sums[i] == "合计") {
                  sums[i] = "";
                }
              } else {
                sums[i] = "";
              }
            }
          } else if (t.length == 3) {
            if (
              data[data.length - 1][t[0]] != null &&
              data[data.length - 1][t[0]][t[1]] != null
            ) {
              sums[i] = data[data.length - 1][t[0]][t[1]][t[2]];
              if (sums[i] == "合计") {
                sums[i] = "";
              }
            } else {
              sums[i] = "";
            }
          }
        }
      }
      sums[0] = "合计";
      this.sums = sums;
      return sums;
    },
    tableRowClassName: function (row, index) {
      if (
        this.port == "caseQuantityStatistics" ||
        this.port == "caseQuantityRevenues" ||
        this.port == "personPerforQueryApi" ||
        this.port == "caseQuantityRevenuesDetail"
      ) {
        this.sjtjPage = true;
        if (row.row.id == null) {
          return "hidden-row";
        }
        return "";
      }
    },
    //选框 触发回调
    handleCheckBox(list) {
      if (this.isSelect) {
        this.$emit("selectChange", list);
      }
    },
    init(data = {}) {
      if (this.port) {
        var column = encodeURI("page.orderBys[0].column");
        var orderType = encodeURI("page.orderBys[0].orderType");
        let loadingInstance = this.$loading({ fullscreen: true });
        //请求类型 formdata
        if (this.postType === "postFormData") {
          data.page = {
            current: data["page.current"],
            pageSize: data["page.pageSize"],
          };
          this.$postFormData(api[this.port], data)
            .then((res) => {
              this.tableData = res.data.list;
              this.page.pageSize = res.data.pageSize;
              this.page.current = res.data.current;
              this.page.total = res.data.total;
              loadingInstance.close();
            })
            .catch((err) => {
              console.log(err);
              loadingInstance.close();
            });
          return;
        } else if (this.postType === "post") {
          //json
          data.page = {
            current: data["page.current"],
            pageSize: data["page.pageSize"],
          };
          this.$post(api[this.port], data)
            .then((res) => {
              this.tableData = res.data.list;
              this.page.pageSize = res.data.pageSize;
              this.page.current = res.data.current;
              this.page.total = res.data.total;
              loadingInstance.close();
            })
            .catch((err) => {
              console.log(err);
              loadingInstance.close();
            });
          return;
        }

        if (!this.sort) {
          this.$get(api[this.port], data)
            .then((res) => {
              this.tableData = res.data.list;
              this.pages.total = res.data.total;
              this.pages.pageSize = res.data.pageSize;
              this.pages.current = res.data.current;
              loadingInstance.close();
            })
            .catch((err) => {
              console.log(err);
              loadingInstance.close();
            });
        } else {
          data[column] = this.sort.prop;
          data[orderType] = this.sort.order;
          this.$get(api[this.port], data)
            .then((res) => {
              this.tableData = res.data.list;
              this.pages.total = res.data.total;
              this.pages.pageSize = res.data.pageSize;
              this.pages.current = res.data.current;
              loadingInstance.close();
            })
            .catch((err) => {
              console.log(err);
              loadingInstance.close();
            });
        }
      }
    },
    handleSizeChange(pageSize) {
      if (this.search) {
        var searchform = JSON.parse(JSON.stringify(this.search));
        searchform["page.current"] = 1;
        searchform["page.pageSize"] = pageSize;
        this.init(searchform);
      } else {
        var searchform = {};
        searchform["page.current"] = 1;
        searchform["page.pageSize"] = pageSize;
        this.init(searchform);
      }
    },
    handleCurrentChange(current) {
      if (this.search) {
        var searchform = JSON.parse(JSON.stringify(this.search));
        searchform["page.current"] = current;
        searchform["page.pageSize"] = this.pages.pageSize;
        this.init(searchform);
      } else {
        var searchform = {};
        searchform["page.current"] = current;
        searchform["page.pageSize"] = this.pages.pageSize;
        this.init(searchform);
      }
    },
    edit(index, row) {
      this.$emit("edit", index, row);
    },
    deleteRow(index, row) {
      this.$emit("deleteRow", index, row);
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          let { current, pageSize } = _this.pages;
          _this.$emit("dragdropCb", {
            idList: _this.tableData.map((item) => item.id),
            "page.current": current,
            "page.pageSize": pageSize,
          }); //拖拽后的回调
        },
      });
    },
  },
  watch: {
    data: function (newval, oldval) {
      this.tableData = newval;
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
      });
    },
    port: function (newval, oldval) {
      if (newval == "caseQuantityStatistics") {
        this.sjtjPage = true;
      }
    },
    tableData: function (newval, oldval) {
      this.$emit("update:data", newval);
    },
    page: function (newval, oldval) {
      this.pages = newval;
    },
    pages: function (newval, oldval) {
      this.$emit("update:page", newval);
    },
    search: function (newval, oldval) {
      if (this.search) {
        var searchform = JSON.parse(JSON.stringify(this.search));
        searchform["page.pageSize"] = this.pages.pageSize;
        searchform["page.current"] = 1;
        this.init(searchform);
      } else {
        var searchform = {};
        searchform["page.pageSize"] = this.pages.pageSize;
        searchform["page.current"] = 1;
        this.init(searchform);
      }
    },
    sort: function (newval, oldval) {
      if (this.hasPaging) {
        if (this.search) {
          var searchform = JSON.parse(JSON.stringify(this.search));
          searchform["page.pageSize"] = this.pages.pageSize;
          searchform["page.current"] = 1;
          this.init(searchform);
        } else {
          var searchform = {};
          searchform["page.pageSize"] = this.pages.pageSize;
          searchform["page.current"] = 1;
          this.init(searchform);
        }
      }
    },
    orgId(newVal, oldVal) {
      if (this.search) {
        var searchform = JSON.parse(JSON.stringify(this.search));
        searchform["page.pageSize"] = this.pages.pageSize;
        searchform["page.current"] = 1;
        this.init(searchform);
      } else {
        var searchform = {};
        searchform["page.pageSize"] = this.pages.pageSize;
        searchform["page.current"] = 1;
        this.init(searchform);
      }
    },
    deep: true,
    immediate: true,
  },
  created: function () {
    if (!this.refreshSearch) {
      if (this.hasPaging) {
        if (this.search) {
          var searchform = JSON.parse(JSON.stringify(this.search));
          searchform["page.pageSize"] = 30;
          searchform["page.current"] = 1;
          this.init(searchform);
        } else {
          var searchform = {};
          searchform["page.pageSize"] = 30;
          searchform["page.current"] = 1;
          this.init(searchform);
        }
      } else {
        this.init();
      }
    }
  },
  mounted() {
    if (this.isDragdrop) this.rowDrop();
  },
};
</script>

<style scoped lang="less">
.el-table .hidden-row {
  display: none;
}
</style>
