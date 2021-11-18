<!--
 * @Description: <page>用户管理</page>页面
-->
<template>
  <div id="user-management">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form :model="searchUser" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="所属部门">
                  <select-department
                    :model.sync="searchUser.office"
                  ></select-department>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="登录名">
                  <el-input
                    v-model="searchUser.loginName"
                    @keyup.enter.native="search"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="姓名">
                  <el-input
                    v-model="searchUser.name"
                    @keyup.enter.native="search"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="角色" class="margin0">
                  <el-select
                    v-model="searchUser.roleId"
                    @keyup.enter.native="search"
                    :clearable="true"
                    class="w100"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-button
                @click="search"
                icon="el-icon-search"
                size="small"
                type="primary"
                style="color: white; float: right"
                >查询
              </el-button>
            </el-row>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          border
          fit
          @sort-change="sortChange"
          size="small"
          style="width: 100%"
        >
          <el-table-column prop="loginName" label="登录名" sortable="custom">
          </el-table-column>
          <el-table-column prop="hrStaff.name" label="姓名"> </el-table-column>
          <el-table-column prop="mobile" sortable="custom" label="手机">
          </el-table-column>
          <el-table-column prop="hrStaff.office.name" label="所属部门">
          </el-table-column>
          <el-table-column align="center" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="handleEdit(scope.$index, scope.row)"
                >修改
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button>
              <el-button
                size="mini"
                type="warning"
                plain
                @click="handleChangPass(scope.$index, scope.row)"
                >重置密码
              </el-button>
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
            port="users"
          >
          </pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane
        :label="isAdd ? '用户添加' : '用户修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addUserForm"
          size="small"
          ref="addUserForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="登录名"
                prop="loginName"
                :rules="$filter_rules({ required: true, min: 2, max: 32 })"
              >
                <el-input
                  v-model.trim="addUserForm.loginName"
                  :readonly="activeName == 'changelist' ? true : false"
                  @change="loginNameChange()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="关联员工"
                prop="hrStaff.id"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-table
                  className="w100"
                  :model.sync="addUserForm.hrStaff"
                  port="hrStaff"
                  :clearable="true"
                ></select-from-table>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="手机"
                prop="mobile"
                :rules="$filter_rules({ required: true, type: 'mobile' })"
              >
                <el-input v-model.trim="addUserForm.mobile"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="是否允许登录">
                <el-radio-group v-model="addUserForm.loginFlag">
                  <el-radio label="NORMAL">是</el-radio>
                  <el-radio label="LOCKED">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="用户角色" prop="roles">
                <el-select
                  v-model="addUserForm.roles"
                  multiple
                  style="width: 100%"
                  value-key="id"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="备注">
                <el-input
                  v-model="addUserForm.remarks"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="saveUser('addUserForm')"
              :loading="saveLoading"
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

      <el-tab-pane label="用户导入" name="importList">
        <el-form
          :model="templateFile"
          size="small"
          ref="importForm"
          :rules="rule"
          label-width="110px"
        >
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="下载模板">
                <el-button type="primary" @click="downTemplate"
                  >下载模板<i class="el-icon-download"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="模板文件" prop="file">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-change="handleChange"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".xlsx"
                  style="width: 100%"
                >
                  <el-input v-model="templateFile.name" style="width: 100%">
                    <template slot="prepend">请选择文件</template>
                  </el-input>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="saveImport('importForm')"
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
import api from "../../api/index";
import pagination from "../../components/common/TablePagination";
import common from "@/assets/js/common";
import commonNum from "../../utils/commonNum";

export default {
  name: "UserManagement",
  components: { pagination: pagination },
  data() {
    var nameDistinct = (rule, value, callback) => {
      if (
        this.templateFile.name &&
        this.templateFile.name.indexOf("xlsx") != -1
      ) {
        callback();
      } else {
        callback(new Error("请上传excel格式的模板文件"));
      }
    };
    return {
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      tablesort: null,
      searchdata: {},
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      searchUser: { office: {} },
      tableData: [],
      activeName: "list",
      isAdd: true,
      addUserForm: {
        loginName: "",
        hrStaff: {},
        office: {},
        roles: [],
        mobile: "",
        loginFlag: "NORMAL",
      },

      options: [],
      templateFile: {},
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        file: [{ validator: nameDistinct, trigger: "change" }],
      },
      saveLoading: false,
      token: commonNum.createUUId(),
    };
  },
  methods: {
    handleClick(tab, event) {
      if (sessionStorage.getItem("userSetSearchData")) {
        this.searchdata = JSON.parse(
          sessionStorage.getItem("userSetSearchData")
        );
        this.searchUser = this.searchdata;
      }
      //重置表单
      /*this.$refs["addUserForm"].resetFields();*/
      this.addUserForm = {
        loginName: "",
        hrStaff: {},
        office: {},
        roles: [],
        mobile: "",
        loginFlag: "NORMAL",
      };
    },
    userInit() {
      let json = {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      };
      this.$get(api.users, Object.assign(json, this.searchdata))
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
    //查询用户
    search() {
      var json = JSON.parse(JSON.stringify(this.searchUser));
      json.officeId = json.office.id;
      sessionStorage.setItem("userSetSearchData", JSON.stringify(json));
      delete json.office;
      this.searchdata = json;
    },
    sortChange(obj) {
      this.tablesort = JSON.parse(JSON.stringify(obj));
      if (obj.order == "ascending") {
        this.tablesort.order = "ASC";
      } else if (obj.order == "descending") {
        this.tablesort.order = "DESC";
      } else {
        this.tablesort = null;
        return;
      }
    },
    //登录名失去焦点时
    loginNameChange(val) {
      if (this.addUserForm.loginName) {
        this.$get(
          "/api/user/v1/users/staff-info?loginName=" +
            this.addUserForm.loginName
        )
          .then((res) => {
            if (res.data) {
              this.$set(this.addUserForm, "hrStaff", res.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    saveUser(formName) {
      console.log(this.addUserForm, "this.addUserForm");
      var json = JSON.parse(JSON.stringify(this.addUserForm));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          //新增用户
          if (this.activeName == "addlist") {
            var headers = {
              headers: { avoidDuplicateSubmitToken: this.token },
            };
            this.$post(api.users, json, headers)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                  this.userInit();

                  console.log(this.addUserForm, "this.addUserForm2");
                  /*this.$refs[formName].resetFields();*/
                  this.addUserForm = {
                    loginName: "",
                    hrStaff: {},
                    office: {},
                    roles: [],
                    mobile: "",
                    loginFlag: "NORMAL",
                  };
                }
                this.saveLoading = false;
              })
              .catch((err) => {
                this.token = commonNum.createUUId();
                this.saveLoading = false;
                this.$message.error(err.errMsg);
                this.$refs.loginName.value = "";
                this.$refs.loginName.focus();
              });
            //  修改用户
          } else {
            this.$put(api.users + "/" + this.addUserForm.id, json)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                }
                this.saveLoading = false;
                this.userInit();
                // this.$refs[formName].resetFields();
              })
              .catch((err) => {
                this.saveLoading = false;
              });
          }
        }
      });
    },
    //编辑用户
    handleEdit(index, row) {
      console.log(row, "row");
      this.isAdd = false;
      this.activeName = "changelist";
      this.$get(api.users + "/" + row.id)
        .then((res) => {
          Object.assign(this.addUserForm, JSON.parse(JSON.stringify(res.data)));
          sessionStorage.setItem(
            "UserManagement",
            JSON.stringify({
              isAdd: this.isAdd,
              activeName: this.activeName,
              form: this.addUserForm,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除用户
    handleDelete(index, row) {
      this.$confirmBox("确定删除用户" + row.name + "?")
        .then((res) => {
          this.$del(api.users + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.userInit();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    //重置用户密码
    handleChangPass(index, row) {
      this.$confirmBox("确定重置用户" + row.name + "的密码吗?")
        .then((res) => {
          this.$put(api.users + "/" + row.id + "/password/reset")
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "重置密码成功！",
                  type: "success",
                });
                this.userInit();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    downTemplate() {
      this.$getFormData(api.template + "/download", {
        templeleName: "用户导入模板.xlsx",
      })
        .then((res) => {
          this.download(res.data, "用户导入模板.xlsx");
        })
        .catch((err) => {
          this.$message({
            message: "模板下载错误，请联系管理员",
            type: "error",
          });
        });
    },
    download(data, name) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    },
    handleChange(file, filelist) {
      this.templateFile = file;
    },
    saveImport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = null;
          let p = new Promise((resolve, reject) => {
            if (this.templateFile.raw) {
              common.getBase64(this.templateFile.raw).then((res) => {
                var fileName = this.templateFile.name;
                data = {
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
          p.then((res) => {
            this.$post(api.users + "/import", data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "导入成功！",
                    type: "success",
                  });
                  this.activeName = "list";
                  this.userInit();
                }
              })
              .catch((err) => {                
                this.$message.error(err.errMsg);
                this.$getFormData('/api'+err.extraInfo).then(res=>{
                    this.download(res.data,res.headers["content-disposition"].split("=")[1])
                }).catch(error=>{
                    this.$message({
                        message: '导入错误，请联系管理员',
                        type: 'error'
                    });
                })
              });
          });
        }
      });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval) {
        this.token = commonNum.createUUId();
        sessionStorage.setItem(
          "UserManagement",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addUserForm,
          })
        );
      }
      if (newval == "list") {
        /*this.$refs['addUserForm'].resetFields();*/
        this.addUserForm = {
          loginName: "",
          hrStaff: {},
          office: {},
          roles: [],
          mobile: "",
          loginFlag: "NORMAL",
        };
        this.isAdd = true;
      } else if (newval == "addlist") {
        this.addUserForm = {
          office: {},
          hrStaff: {},
          roles: [],
          loginFlag: "NORMAL",
        };
        this.isAdd = true;
      }
    },
  },
  created: function () {
    if (sessionStorage.getItem("UserManagement")) {
      let { activeName, isAdd, form } = JSON.parse(
        sessionStorage.getItem("UserManagement")
      );
      this.activeName = activeName;
      this.isAdd = isAdd;
      this.addUserForm = form;
    }
    this.$get(api.myInfo).then((res) => {
      if (res.data.orgId == null || res.data.orgId.length == 0) {
        this.$get(api.org + "/setOrgId?orgId=" + null)
          .then((res) => {
            this.$get("/api/role/v1/roles")
              .then((res) => {
                console.log(res.data, "role");
                this.options = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((e) => console.log(e));
      } else {
        this.$get("/api/role/v1/roles")
          .then((res) => {
            console.log(res.data, "role");
            this.options = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    this.$store.dispatch("login/headerTitleChange", "用户管理");
  },
  beforeDestroy() {
    sessionStorage.removeItem("UserManagement");
  },
};
</script>

<style scoped>
</style>
