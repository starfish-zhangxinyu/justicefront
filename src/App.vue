<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style  lang="less">
* {
  list-style: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.font1 {
  color: #606266;
  font-size: 12px;
  float: left;
  height: 18px;
  line-height: 18px;
}

.portlet {
  // border-radius: 4px 4px 4px 4px;
  border: solid 1px #e5e5e5;
  margin-bottom: 20px;
}
.portlet-header {
  background-color: #fff;
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  font-weight: 400;
  padding-left: 10px;
  color: #333;
  border-bottom: #eee 1px solid;
  direction: ltr;
  span {
    margin-left: 10px;
    font-size: 16px;
  }
  button {
    span {
      font-size: 12px;
      margin-left: 0px;
    }
  }
  b {
    float: right;
    padding-right: 10px;
    margin-top: 10px;
  }
}
.portlet-body {
  background-color: white;
  padding: 10px 10px 10px 10px;
}
.search-box {
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 4px 4px 4px 4px;
  padding: 10px;
  margin-bottom: 10px;
}
.pagination-footer {
  margin-top: 20px;
  margin-bottom: 20px;
  /*float: right;*/
}
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
.cell {
  .el-form-item__content {
    div {
      /*border: 1px solid red;*/
      margin-top: 0px;
      /*line-height: 23px;*/
      vertical-align: middle;
    }
  }
}
.el-table__header .has-gutter .gutter {
  width: 17px !important;
}
</style>
