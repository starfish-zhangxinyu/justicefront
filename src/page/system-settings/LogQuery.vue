<template>
  <div id="log-qurey">
    <!-- <PageBar title1="系统设置" title2="日志查询"></PageBar> -->
    <div class="search-box" style="overflow: hidden">
      <el-form :model="searchForm" size="small" label-width="100px" >
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="机构" prop="name">
              <!--             <el-input v-model.trim="searchForm.userAgent" @keyup.enter.native="search"></el-input>-->

              <el-select
                      ref="orgId"
                      v-model="searchForm.orgId"
                      clearable
                      filterable
                      placeholder="请选择机构"
                      style="width:100%"
              >
                <el-option v-for="item in orgs" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="操作功能">
              <el-input
                      v-model.trim="searchForm.title"
                      clearable
                      @keyup.enter.native="search"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="案件编号">
              <el-input
                      v-model.trim="searchForm.caseNo"
                      clearable
                      @keyup.enter.native="search"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="日期范围" label-width="100px" class="margin0">
              <DataPicker
                      :startValue.sync="searchForm.beginDate"
                      :endValue.sync="searchForm.endDate"
                      valueFormat="yyyy/MM/dd"
              />
            </el-form-item>
          </el-col>
          <el-col  :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="操作人">
              <select-from-table :model.sync="searchForm.userId" :filterable="true" :clearable="true" port="register" className="multiple-select" :orgId="searchForm.orgId">
              </select-from-table>
            </el-form-item>
          </el-col>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search" style="float:right">查询</el-button>
        </el-row>

      </el-form>
    </div>

    <el-table :data="tableData" border size="small" style="width: 100%" highlight-current-row>
      <el-table-column prop="createBy.hrStaff.name" label="操作人" show-overflow-tooltip >
        <template slot-scope="scope">
           <span>{{scope.row.createBy && scope.row.createBy.hrStaff ? scope.row.createBy.hrStaff.name : scope.row.createBy.name}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="sysOrg.name" label="机构" show-overflow-tooltip />
      <el-table-column prop="title" label="操作功能" show-overflow-tooltip />
      <el-table-column prop="action.label" label="操作类型" show-overflow-tooltip />
      <el-table-column prop="description" label="操作描述" show-overflow-tooltip min-width="200px" />
      <el-table-column prop="updateDate" label="操作时间" show-overflow-tooltip />
      <el-table-column prop="bizId" label="操作对象ID" show-overflow-tooltip />
      <el-table-column prop="remoteAddr" label="IP" show-overflow-tooltip />
      <el-table-column label="参数" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="viewParams(scope.row)">查看</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  v-clipboard:copy="scope.row.params"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
          >复制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="isDispParams" width="30%" close="isDispParams = false">
      <!-- <el-input type="textarea" :rows="24" v-model="tempParams"></el-input> -->
      <div v-html="tempParams"></div>
    </el-dialog>
    <div class="pagination-footer">
      <pagination
        :pcurrent.sync="page.current"
        :page.sync="page"
        :data.sync="tableData"
        :search.sync="searchdata"
        :sort.sync="tablesort"
        port="log"
      ></pagination>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";

export default {
  name: "LogQuery",
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 }
      },
      tablesort: null,
      searchdata: {},
      orgs: [],
      isDispParams: false,
      tempParams: "",
    };
  },
  methods: {
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.error("复制出错");
    },
    search() {
      console.log(this.searchForm);
      var data = JSON.parse(JSON.stringify(this.searchForm));
      if (data.userId != null) {
        data.userId = data.userId.id;
      }
      if (data.date) {
        data.beginDate = data.date[0].replace(/-/g, "/");
        data.endDate = data.date[1].replace(/-/g, "/");
        delete data.date;
      }
      console.log(data, "查询");
      this.searchdata = data;
    },
    viewParams(row) {
      this.tempParams = this.dealJson(row.params);
      this.isDispParams = true;
    },
    closeDialog() {
      this.isDispParams = false;
    },
    dealJson(json) {
      if (typeof json !== "string") {
        json = JSON.stringify(json, undefined, 4);
      }
      json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
      return json
        .replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          function (match) {
            let cls = "number";
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = "key";
              } else {
                cls = "string";
              }
            } else if (/true|false/.test(match)) {
              cls = "boolean";
            } else if (/null/.test(match)) {
              cls = "null";
            }
            if (cls == "key") {
              return (
                '<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="' +
                cls +
                '">' +
                match +
                "&nbsp;</span>"
              );
            } else {
              return '<span class="' + cls + '">' + match + "</span>";
            }
          }
        )
        .replace("}", "<br>}");
    },
  },
  mounted() {
    let that = this;
    this.$get(api.org + "/list")
      .then((res) => {
        if (res.data) {
          for (let e of res.data) {
            that.orgs.push(e);
          }
        }
      })
      .catch((err) => {});
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "日志查询");
  },

  // data.pubDateFrom=data.pubDate[0].replace(/-/g,"/");
};
</script>

<style scoped>
</style>
