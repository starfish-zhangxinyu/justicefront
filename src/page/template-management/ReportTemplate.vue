<template>
  <div id="form-template">
    <!-- <PageBar title1="模板管理" title2="报告模板"/> -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报告模板列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form
            :model="searchForm"
            size="small"
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="searchForm.professionCategoryId"
                port="profession"
                :clearable="true"
                :modelId="true"
                @keyup="search"
              ></select-from-table>
            </el-form-item>

            <el-form-item label="模板名称">
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
        >
          <el-table-column prop="name" label="报告名称"></el-table-column>
          <el-table-column prop="templateFile.url" label="模板">
            <template slot-scope="scope">
              <el-button size="mini" @click="openTemplate(scope.row)"
                >修改
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="professionCategoryList" label="专业类别">
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
                {{ transform(scope.row.professionCategoryList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="操作">
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
            port="template"
          >
          </pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="isAdd ? '报告模板添加' : '报告模板修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form :model="addForm" size="small" ref="ftForm" label-width="150px">
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="报告模板名称"
                prop="name"
                :rules="$filter_rules({ required: true })"
              >
                <el-input v-model.trim="addForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :lg="{span:16,offset:4}">-->
          <!--<el-form-item label="报告位置">-->
          <!--<select-from-enum-->
          <!--:model.sync="addForm.formLocation"-->
          <!--:clearable="true"-->
          <!--type="tpl.FormLocation">-->
          <!--</select-from-enum>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
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
                  :multiple="true"
                  className="multiple-select"
                  @change="showInput"
                >
                  <el-option
                    label="全部专业"
                    :value="{ id: 'ALL', type: { value: 'DNA' } }"
                  ></el-option>
                </select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="模板文件"
                :rules="$filter_rules({ required: true })"
              >
                <!--<el-col :lg="{span:24}">-->
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="handleChange"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".docx"
                  style="width: 100%"
                >
                  <el-input v-model="templateFile.name" style="width: 100%">
                    <template slot="prepend">请选择文件</template>
                  </el-input>
                </el-upload>
                <!--</el-col>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="所需数据"
                prop="requireDatas"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <!-- debugger -->
                <select-from-enum
                  className="w100"
                  :model.sync="addForm.requireDatas"
                  :clearable="true"
                  type="tpl.DataCatalog"
                  :multiple="true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="是否保存"
                prop="save"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <el-select
                  class="w100"
                  v-model="addForm.save"
                  placeholder="请选择"
                >
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dnaVertical">
            <el-col :lg="{ span: 16 }">
              <el-form-item
                class="nowrap"
                label="检测结果表动态列数"
                prop="dnaRelationColumns"
                :rules="$filter_rules({ required: true })"
              >
                <el-input v-model.trim="addForm.dnaRelationColumns"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="表格数据循环">
                <el-button type="primary" @click="addDataCircle"
                  >增加
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 10px"
            :key="i"
            v-for="(v, i) in addForm.loopDataDtoList"
          >
            <el-col :lg="{ span: 20, offset: 2 }">
              <div class="portlet">
                <div class="portlet-header">
                  <span>表格循环填充设置</span>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    style="float: right; margin-right: 10px; margin-top: 5px"
                    @click="deleteDataCircle(i)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    style="float: right; margin-right: 10px; margin-top: 5px"
                    @click="addDataCircleRow(i)"
                    >增加列
                  </el-button>
                </div>
                <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                  <el-form
                    size="small"
                    :model="v"
                    :ref="'loopDataDtoListForm' + i"
                    label-width="140px"
                  >
                    <el-row>
                      <el-col :lg="{ span: 8, offset: 2 }">
                        <el-form-item
                          label="是否存在表格数据"
                          :rules="$filter_rules({ required: true })"
                        >
                          <el-radio-group v-model="radio[i]">
                            <el-radio label="Y">是</el-radio>
                            <el-radio label="N">否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :lg="{ span: 8, offset: 2 }"
                        v-if="radio[i] == 'Y'"
                      >
                        <el-form-item
                          label="表格循环表格数"
                          prop="tableQuantity"
                          :rules="$filter_rules({ required: true })"
                        >
                          <el-input v-model.trim="v.tableQuantity"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :lg="{ span: 8, offset: 2 }">
                        <el-form-item
                          label="书签名"
                          prop="bookmark"
                          :rules="$filter_rules({ required: true })"
                        >
                          <el-input v-model.trim="v.bookmark"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :lg="{ span: 8, offset: 2 }">
                        <el-form-item
                          label="行数"
                          prop="insertAfterIndex"
                          :rules="
                            $filter_rules({ required: true, type: 'number' })
                          "
                        >
                          <el-input v-model.number="v.insertAfterIndex" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :lg="{ span: 8, offset: 2 }">
                        <el-form-item
                          label="起始行"
                          prop="rowStart"
                          :rules="
                            $filter_rules({ required: true, type: 'number' })
                          "
                        >
                          <el-input v-model.number="v.rowStart"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :lg="{ span: 8, offset: 2 }">
                        <el-form-item
                          label="表格循环数据"
                          prop="loopDataType"
                          :rules="$filter_rules({ required: true })"
                        >
                          <el-select
                            v-model="v.loopDataType"
                            placeholder="请选择"
                            :clearable="true"
                            style="width: 100%"
                            @change="dataTypeChange(i)"
                          >
                            <el-option
                              v-for="item in loopOpt"
                              :key="item.value"
                              :label="item.label"
                              :value="item"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-table
                    :data="v.data"
                    border
                    fit
                    stripe
                    size="mini"
                    style="width: 100%"
                  >
                    <el-table-column label="列号" type="index">
                    </el-table-column>
                    <el-table-column prop="name" label="值">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.value"
                          placeholder="请选择"
                          size="small"
                        >
                          <el-option
                            v-for="(item, index) in v.fillOpt"
                            :key="index"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          plain
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDataRow(i, scope.$index, scope.row)"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="save('ftForm')"
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
    </el-tabs>
  </div>
</template>

<script>
import Test from "../../components/common/TreeSelect";
import Select2 from "../../components/common/Select2";
import api from "../../api/index";
import common from "../../../static/js/common";
import PageOfficeApi from "../../components/tpl/PageOfficeApi";

export default {
  name: "FormTemplate",
  components: { Select2: Select2, treeSelect: Test },
  data() {
    return {
      activeName: "list",
      isAdd: true,
      searchForm: {},
      tableData: [],
      page: { pageSizes: [30, 50, 100], pageSize: 30, total: 0, current: 1 },
      tablesort: null,
      searchdata: { templateType: "REPORT" },
      addForm: {
        professionCategoryList: [],
        loopDataDtoList: [],
        name: null,
        save: null,
        dnaRelationColumns: 0,
      }, //新增模板
      templateFile: {}, //模板文件
      localOpt: [],
      loopOpt: [],
      dataOpt: [],
      radio: [], //判断是否存在循环数据
      dnaVertical: false,
    };
  },
  methods: {
    init() {
      let json = {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      };
      this.$get(api.template, Object.assign(json, this.searchdata))
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
    transform(arr) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      data.templateType = "REPORT";
      sessionStorage.setItem("templateSearchData", JSON.stringify(data));
      this.searchdata = data;
    },
    async edit(index, row) {
      this.isAdd = false;
      this.activeName = "changelist";
      let res = await this.$get(api.template + "/" + row.id).catch((err) =>
        console.log(err)
      );
      var data = JSON.parse(JSON.stringify(res.data));
      // Object.assign(this.addForm,data);
      this.addForm = data;
      this.addForm.requireDatas = data.requireDataList;
      this.showInput(this.addForm.professionCategoryList);
      if (data.templateFile) {
        this.templateFile.url = data.templateFile.url;
      }
      if (data.loopDataDtoList) {
        this.$get(api.enum + "/tpl.LoopDataType")
          .then((res) => {
            this.loopOpt = res.data;
          })
          .catch((err) => {
            console.log(err);
          });

        let json = JSON.parse(JSON.stringify(data.loopDataDtoList));

        for (let i = 0; i < json.length; i++) {
          json[i].tableQuantity != null
            ? (this.radio[i] = "Y")
            : (this.radio[i] = "N");
          json[i].data = [];
          json[i].fillOpt = [];
          if (json[i].variables) {
            let respones = await this.$get("/api/template/v1/vars", {
              loopDataType: json[i].loopDataType.value,
            }).catch((err) => console.log(err));
            let arr = ["不填充", "序号"].concat(respones.data);
            arr.forEach((val, index) => {
              json[i].fillOpt.push(val);
            });
            var arr1 = json[i].variables.split(",");
            arr1.forEach((val1, index) => {
              json[i].data[index] = { value: val1 };
            });
          }
        }
        data.loopDataDtoList = json;
        for (let i = 0; i < this.addForm.loopDataDtoList.length; i++) {
          for(let j =0;j<this.addForm.loopDataDtoList[i].data.length;j++){
            if (this.addForm.loopDataDtoList[i].data[j].value == "null") {
            this.addForm.loopDataDtoList[i].data[j].value = "不填充";
          }
          }
          
        }
      }
      sessionStorage.setItem(
        "FormTemplate",
        JSON.stringify({
          isAdd: this.isAdd,
          activeName: this.activeName,
          form: this.addForm,
        })
      );
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除表单模板" + row.name + "?")
        .then((res) => {
          this.$del(api.template + "/" + row.id)
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
    handleChange(file, filelist) {
      console.log(file, "ooooo");
      this.templateFile = file;
    },
    addDataCircle() {
      this.addForm.loopDataDtoList.push({ data: [], fillOpt: [] });
      this.radio.push("N");
      this.$get(api.enum + "/tpl.LoopDataType")
        .then((res) => {
          console.log(res, "循环数据类型");
          this.loopOpt = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteDataCircle(index) {
      this.addForm.loopDataDtoList.splice(index, 1);
      this.radio.splice(index, 1);
    },
    addDataCircleRow(index) {
      this.addForm.loopDataDtoList[index].data.push({});
      if (!this.addForm.loopDataDtoList[index].loopDataType) {
        this.addForm.loopDataDtoList[index].fillOpt.push("不填充");
        this.addForm.loopDataDtoList[index].fillOpt.push("序号");
      } else {
        this.$get("/api/template/v1/vars", {
          loopDataType: this.addForm.loopDataDtoList[index].loopDataType.value,
        })
          .then((res) => {
            console.log(res, "填充值");
            this.addForm.loopDataDtoList[index].fillOpt = [];
            var arr = ["不填充", "序号"].concat(res.data);
            arr.forEach((v, i) => {
              this.addForm.loopDataDtoList[index].fillOpt.push(v);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    dataTypeChange(index) {
      if (this.addForm.loopDataDtoList[index].loopDataType) {
        this.$get("/api/template/v1/vars", {
          loopDataType: this.addForm.loopDataDtoList[index].loopDataType.value,
        })
          .then((res) => {
            this.addForm.loopDataDtoList[index].fillOpt = [
              "不填充",
              "序号",
            ].concat(res.data);
            console.log(this.addForm.loopDataDtoList[index]);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(this.addForm.loopDataDtoList[index], "?????");
        this.addForm.loopDataDtoList[index].data.forEach((v, i) => {
          if (v.value != "不填充" && v.value != "序号") {
            this.$set(v, "value", "");
          }
        });
      }
    },
    deleteDataRow(i, index, row) {
      this.addForm.loopDataDtoList[i].data.splice(index, 1);
    },
    //动态表单验证（表格数据循环）
    refFromFn() {
      let arr = [];
      let bflog = true;
      for (let i in this.$refs) {
        if (this.$refs[i][0]) {
          this.$refs[i][0].validate((valid) => {
            arr.push(valid);
          });
        }
      }
      arr.forEach((v) => {
        if (v == true) {
          bflog = true;
        } else {
          bflog = false;
          return false;
        }
      });
      return bflog;
    },
    save(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (
          this.templateFile.raw ||
          (this.addForm.templateFile && this.addForm.templateFile.url)
        ) {
          if (!that.refFromFn()) return; //表格数据循环验证
        } else {
          that.refFromFn();
          this.$message.error("请上传模板文件!");
          return;
        }
        if (valid) {
          let requireDatas = "";
          this.addForm.requireDatas.forEach((item) => {
            requireDatas = requireDatas.concat(item.value, ",");
          });
          var data = JSON.parse(JSON.stringify(this.addForm));
          data.requireDatas = requireDatas.substring(
            0,
            requireDatas.length - 1
          );
          let p = new Promise((resolve, reject) => {
            if (this.templateFile.raw) {
              common.getBase64(this.templateFile.raw).then((res) => {
                var fileName = this.templateFile.name;
                data.templateFile = {
                  name: fileName,
                  base64Str: res,
                  fileType: fileName.substring(
                    fileName.indexOf(".") + 1,
                    fileName.length + 1
                  ),
                };
                resolve();
              });
            } else {
              resolve();
            }
          });
          data.templateType = "REPORT";
          var loopFlag = true;
          data.loopDataDtoList.forEach((v, i) => {
            if (v.data.length == 0) {
              loopFlag = false;
            }
            var str = "";
            v.data.forEach((m, n) => {
              if (m.value == "不填充") {
                m.value = "null";
              }
              str += m.value + ",";
            });
            if (this.radio[i] == "N") {
              v.tableQuantity = null;
            }
            delete v.data;
            delete v.loopDataType.items; //枚举值字段接收不到
            delete v.fillOpt;
            v.variables = str.substr(0, str.length - 1);
          });
          if (!loopFlag) {
            this.$message.error("表格数据循环至少要设置一列!");
            return;
          }
          if (this.activeName == "addlist" && loopFlag) {
            p.then((res) => {
              this.$post(api.template, data)
                .then((res) => {
                  console.log(data, "新增???");
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                    this.templateFile = {};
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: err.errMsg,
                    type: "error",
                  });
                });
            });
          } else if (loopFlag) {
            p.then((res) => {
              this.$put(api.template + "/" + data.id, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "修改成功！",
                      type: "success",
                    });
                    this.addForm = {
                      professionCategoryList: [],
                      loopDataDtoList: [],
                      name: null,
                      save: null,
                      dnaRelationColumns: 0,
                    }; //新增模板
                    this.init();
                    this.$refs[formName].resetFields();
                  } else {
                    this.$message({
                      message: res.errMsg,
                      type: "error",
                    });
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: err.errMsg,
                    type: "error",
                  });
                });
            });
          }
        }
      });
    },
    handleClick(tab, event) {
      if (sessionStorage.getItem("templateSearchData")) {
        this.searchdata = JSON.parse(
          sessionStorage.getItem("templateSearchData")
        );
        this.searchForm = this.searchdata;
      }
      //重置表单
      this.$refs["ftForm"].resetFields();
    },
    openTemplate(row) {
      if (row.templateFile && row.templateFile.url) {
        PageOfficeApi.openDoc(row.templateFile.url, "Y");
      }
    },
    showInput: function (newval) {
      var noDnaCount = 0;
      newval.forEach((item) => {
        var type = item.type.value;
        if (type == "DNA") {
          this.dnaVertical = true;
        } else {
          noDnaCount++;
        }
      });
      var selectedLength = newval.length;
      if (selectedLength == noDnaCount) {
        this.dnaVertical = false;
      }
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval) {
        sessionStorage.setItem(
          "FormTemplate",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addForm,
          })
        );
      }
      if (newval == "list" || newval == "addlist") {
        this.isAdd = true;
        this.addForm = {
          professionCategoryList: [],
          loopDataDtoList: [],
          name: null,
          save: null,
        };
        this.templateFile = {};
      }
    },
    "addForm.professionCategoryList": {
      handler: function (newVal, oldVal) {
        if (newVal) {
          if (!this.$findArrFn(newVal, "ALL")) {
            if (newVal.length > 1) {
              this.addForm.professionCategoryList = [{ id: "ALL" }];
              this.$message.info("你已选择全部专业类别!");
            }
          }
        }
      },
      deep: true,
    },
  },
  created() {
    if (sessionStorage.getItem("FormTemplate")) {
      let { activeName, isAdd, form } = JSON.parse(
        sessionStorage.getItem("FormTemplate")
      );
      this.activeName = activeName;
      this.isAdd = isAdd;
      this.addForm = form;
    }
    this.$store.dispatch("login/headerTitleChange", "报告模板");
  },
  beforeDestroy() {
    sessionStorage.removeItem("FormTemplate");
  },
};
</script>

<style scoped lang="less">
.upload-demo /deep/ .el-upload {
  width: 100% !important;
}
</style>

<!--//   searchdata:{templateType:'REPORT'},-->
