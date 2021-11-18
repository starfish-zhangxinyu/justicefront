<template>
  <div style="overflow: hidden">
    <el-pagination
      style="float: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pages.current"
      :page-sizes="pages.pageSizes"
      :page-size="pages.pageSize"
      :layout="layout"
      :small="isSmall"
      :total="pages.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  name: "TablePagination",
  // props:['data','port','page','search','sort'],
  props: {
    port: {
      //表格数据的接口
      type: String,
      required: true,
    },
    data: Array,
    //如果默认值得类型为数组或者对象，一定要在函数中返回这个默认值，而不是直接写，否则报错
    page: {
      //页码信息
      type: Object,
      default() {
        return {
          pageSizes: [30, 50, 80, 100],
          current: 1,
          pageSize: 30,
          total: 0,
        };
      },
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
    layout: {
      type: String,
      default: "total,sizes,prev, pager, next",
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    changeSelect: {
      type: String,
    },
    orgId: "",
  },
  data() {
    return {
      pages: this.page,
      tableData: this.data,
    };
  },
  methods: {
    init(data) {
      if (this.port) {
        var column = encodeURI("page.orderBys[0].column");
        var orderType = encodeURI("page.orderBys[0].orderType");
        let loadingInstance = this.$loading({ fullscreen: true });
        if (!this.sort) {
          if (this.postType === "post") {
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

          data = data || {};
          data["page.current"] = data["page.current"] || 1;
          data["page.pageSize"] = data["page.pageSize"] || 30;
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
              this.$message.error(err.errMsg)
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
              this.$message.error(err.errMsg)
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
  },
  watch: {
    page: function (newval, oldval) {
      this.pages = newval;
    },
    pages: function (newval, oldval) {
      this.$emit("update:page", newval);
    },
    orgId: function () {
      this.init();
    },
    data: function (newval, oldval) {
      this.tableData = newval;
    },
    tableData: function (newval, oldval) {
      this.$emit("update:data", newval);
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
    changeSelect: function () {
      var searchform = JSON.parse(JSON.stringify(this.search));
      this.init();
    },
    deep: true,
    immediate: true,
  },
  created: function () {
    let { current, pageSize } = this.page;
    if (this.search) {
      var searchform = JSON.parse(JSON.stringify(this.search));
      searchform["page.pageSize"] = pageSize;
      searchform["page.current"] = current;
      this.init(searchform);
    } else {
      var searchform = {};
      searchform["page.pageSize"] = pageSize;
      searchform["page.current"] = current;
      this.init(searchform);
    }
  },
};
</script>

<style scoped lang="less">
</style>
