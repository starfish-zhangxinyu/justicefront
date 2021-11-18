<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="检验标准列表" name="list">
      <div class="search-box" style="overflow: hidden">
        <el-form :model="searchForm" size="small" label-width="100px">
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="检验标准名称">
                <el-input
                        v-model.trim="searchForm.name"
                        placeholder="请输入内容"
                        @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="检验标准编号">
                <el-input
                        v-model.trim="searchForm.standardNo"
                        placeholder="请输入内容"
                        @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="标准发布日期">
                <!-- <el-date-picker
                  @keyup.enter.native="search"
                  size="small"
                  class="w100"
                  v-model="searchForm.pubDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker> -->
                <DataPicker
                        :startValue.sync="searchForm.pubDateFrom"
                        :endValue.sync="searchForm.pubDateTo"
                        isImmediate/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="标准实施日期">
                <!-- <el-date-picker
                  @keyup.enter.native="search"
                  size="small"
                  class="w100"
                  v-model="searchForm.impDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker> -->
                <DataPicker
                        :startValue.sync="searchForm.impDateFrom"
                        :endValue.sync="searchForm.impDateTo"
                        isImmediate/>
              </el-form-item>
            </el-col>

            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="标准类型">
                <select-from-dict
                        :clearable="true"
                        @keyup="search"
                        data_type="standard_type"
                        :model.sync="searchForm.standardTypeId"
                        :model-id="true"
                        className="multiple-select"
                ></select-from-dict>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="专业类别">
                <select-from-table
                        className="w100"
                        :model.sync="searchForm.professionCategoryId"
                        :clearable="true"
                        port="profession"
                        :modelId="true"
                        @keyup="search"
                ></select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="标准状态" class="margin0">
              <select-from-enum
                      className="w100"
                      :model.sync="searchForm.status"
                      :clearable="true"
                      type="base.StandardStatus"
                      @keyup="search">
              </select-from-enum>
            </el-form-item>
          </el-col>
          <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  style="color: white;float:right"
                  @click="search"
          >查询
          </el-button>
        </el-form>
      </div>
      <Table
              :data.sync="tableData"
              :search.sync="searchdata"
              :sort.sync="tablesort"
              :page.sync="page"
              port="standard"
              @edit="edit"
              :hasPaging="true"
              @deleteRow="deleteRow"
              :selfDefinedBtn="true"
              :max-height="tableHeight"
      >
        <template solt>
          <el-table-column prop="name" show-overflow-tooltip label="检验标准名称"></el-table-column>
          <el-table-column
                  prop="standardNo"
                  show-overflow-tooltip
                  label="检验标准编号"
          ></el-table-column>
          <el-table-column prop="professionCategoryList" show-overflow-tooltip label="专业类别">
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
                {{ transform(scope.row.professionCategoryList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="standardType.label" show-overflow-tooltip label="标准类型">
          </el-table-column>
          <el-table-column prop="pubDate" show-overflow-tooltip label="标准发布日期">
          </el-table-column>
          <el-table-column prop="impDate" show-overflow-tooltip label="标准实施日期">
          </el-table-column>
          <el-table-column prop="orgImpDate" show-overflow-tooltip label="机构实施日期">
          </el-table-column>
          <el-table-column prop="orgInvalidDate" show-overflow-tooltip label="机构作废日期">
          </el-table-column>
          <el-table-column prop="status.label" show-overflow-tooltip label="标准状态">
          </el-table-column>
          <el-table-column
                  label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button type="warning" plain icon="el-icon-edit" size="mini"
                         @click="edit(scope.$index,scope.row)"></el-button>
              <el-button type="primary" plain icon="el-icon-edit-outline" size="mini"
                         @click.native.prevent="openStatusDiag(scope.$index, scope.row)"></el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"
                         @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </template>
      </Table>
      <el-dialog  :visible.sync="standardStatusDiag" width="30%">
        <el-form :model="standardStatusForm" ref="standardStatusForm"  size="small" label-width="100px">
          <el-row>
            <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
              <el-form-item label="标准状态"  :rules="$filter_rules({required:true,trigger:'change'})">
                <select-from-enum
                        className="w100"
                        :model.sync="standardStatusForm.status"
                        type="base.StandardStatus"
                        :has-default="true"
                        >
                </select-from-enum>
              </el-form-item>
              <el-form-item
                      label="机构作废日期"
                      prop="orgInvalidDate"
                      v-if="standardStatusForm.status && standardStatusForm.status.value == 'OBSOLETED'">
                <el-date-picker
                        v-model="standardStatusForm.orgInvalidDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="w100"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="confirmChangeStatus('N')">取 消</el-button>
          <el-button type="primary" @click="confirmChangeStatus('Y')">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="检验标准添加" show-overflow-tooltip name="form"></el-tab-pane>
    <el-tab-pane label="检验标准导入" show-overflow-tooltip name="import"></el-tab-pane>
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
          xl: { span: 6, offset: 1 }
        },
        innerPanClass: {
          sm: {span: 20,offset:2},
          md: {span: 20,offset:2},
          xl: {span: 20,offset:2}
        },
        activeName: "list",
        page: { current: 1, pageSize: 30, total: 0 },
        tableData: [],
        tablesort: null,
        searchdata: {},
        searchForm: {},
        standardStatusForm: {
          status: '',
          orgInvalidDate:'',
        },
        standardStatusDiag: false,
        tableHeight:'500px',
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
        this.$get(api.standard, searchData)
                .then(res => {
                  this.tableData = res.data.list;
                  this.page.pageSize = res.data.pageSize;
                  this.page.current = res.data.current;
                  this.page.total = res.data.total;
                })
                .catch(err => {
                  console.log(err);
                });
      },
      search() {
        var data = JSON.parse(JSON.stringify(this.searchForm));
        let searchData = {};
        /*data.status = data.status;*/ /*&& data.status.value;*/
        if (data.pubDate) {
          data.pubDateFrom = data.pubDate[0].replace(/-/g, "/");
          data.pubDateTo = data.pubDate[1].replace(/-/g, "/");
          delete data.pubDate;
        }
        if (data.impDate) {
          data.impDateFrom = data.impDate[0].replace(/-/g, "/");
          data.impDateTo = data.impDate[1].replace(/-/g, "/");
          delete data.impDate;
        }
        sessionStorage.setItem("standardSearchData",JSON.stringify(data));
        //用来搜索的searchdata;
        searchData = JSON.parse(JSON.stringify(data));
        searchData.status = data.status && data.status.value;
        this.searchdata = searchData;
      },
      deleteRow(index, row) {
        this.$confirmBox("确定删除" + row.name + "?")
                .then(res => {
                  this.$del(api.standard + "/" + row.id)
                          .then(res => {
                            if (res.status == 200) {
                              this.$message({
                                message: "删除成功！",
                                type: "success"
                              });
                              this.init(this.searchdata);
                            }
                          })
                          .catch(err => {
                            console.log(err);
                          });
                })
                .catch(err => {});
      },
      openStatusDiag(index, row) {
        this.$refs['standardStatusForm'] && this.$refs['standardStatusForm'].resetFields();
        this.standardStatusDiag = true;
        this.activeStandard = row;
      },
      confirmChangeStatus(sign) {
        if(sign === 'Y') {
          if(this.standardStatusForm.status && this.standardStatusForm.status.value != 'OBSOLETED') {
            this.standardStatusForm.orgInvalidDate = '';
          }
          this.$refs['standardStatusForm'].validate(valid => {
            if(valid) {
              this.$put(api.changeStandardStatus,{
                  id:  this.activeStandard.id,
                  status: this.standardStatusForm.status && this.standardStatusForm.status.value,
                  orgInvalidDate: this.standardStatusForm.orgInvalidDate
              }).then(() => {
                this.$message.success('修改成功！');
                this.standardStatusDiag = false;
                this.init(this.searchdata)
              }).catch(e => {
                this.$message.error(e.errMsg);
              })
            }
          })
        }else {
          this.standardStatusDiag = false;
        }
      },
      edit(index, row) {
        this.$router
                .push({ path: "/auth/standard/form", query: { id: row.id } })
                .catch(err => {
                  console.log(err);
                });
      }
    },
    watch: {
      activeName: function(newval, oldval) {
        if (newval != "list") {
          if (newval == "import") {
            this.$router.push({ path: "/auth/standard/import" }).catch(err => {
              console.log(err);
            });
          }else {
            this.$router.push({ path: "/auth/standard/form" }).catch(err => {
              console.log(err);
            });
          }

        }
      }
    },
    created(){
      this.tableHeight = window.innerHeight - 390 + 'px';
      if(sessionStorage.getItem("standardSearchData")){
        this.searchForm = JSON.parse(sessionStorage.getItem("standardSearchData"));
        this.searchdata = JSON.parse(sessionStorage.getItem("standardSearchData"));
        this.searchdata.status = this.searchdata.status && this.searchdata.status.value;
      }
    }
  };
</script>

<style scoped></style>
