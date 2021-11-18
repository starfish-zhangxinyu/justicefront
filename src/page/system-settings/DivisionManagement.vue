<template>
  <div id="division-management">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="部门列表" name="list">
        <el-table
          :data="tableData"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
          border
          fit
          size="mini"
          style="width: 100%"
        >
          <el-table-column prop="name" label="部门名称"> </el-table-column>
          <el-table-column prop="area.name" label="归属区域"> </el-table-column>
          <el-table-column prop="zipCode" label="编码"> </el-table-column>
          <el-table-column prop="officeType.label" label="类型">
          </el-table-column>
          <el-table-column prop="remarks" label="备注"> </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >
                修改
              </el-button>
              <el-button
                type="danger"
                size="mini"
                plain
                @click="handleDelete(scope.$index, scope.row)"
              >
                删除
              </el-button>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleAdd(scope.$index, scope.row)"
              >
                添加下级部门
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane
        :label="isAdd ? '部门添加' : '部门修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          ref="divisionForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="上级部门">
                <select-department
                  :model.sync="addForm.office"
                ></select-department>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="归属区域"
                prop="area.name"
                :rules="$filter_rules({ required: true })"
              >
                <treeSelect
                  title="区域"
                  :model.sync="addForm.area"
                  name="area"
                  showUntilThree
                  :expandRowKeys="expandRowKeys"
                  isTitleChoose
                  @hasLoadedTree="hasLoadedTree"
                ></treeSelect>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="部门名称"
                prop="name"
                :rules="$filter_rules({ required: true, maxLength: 50 })"
              >
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="部门类型"
                :rules="$filter_rules({ required: true })"
              >
                <select-from-dict
                  :model.sync="addForm.officeType"
                  className="w100"
                  data_type="sys_office_type"
                ></select-from-dict>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="部门负责人">
                <el-input v-model="addForm.master"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="联系地址">
                <el-input v-model="addForm.address"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="邮政编码">
                <el-input v-model="addForm.zipCode"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="电话">
                <el-input v-model="addForm.phone"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="传真">
                <el-input v-model="addForm.fax"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="邮箱">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="备注/部门职能">
                <el-input v-model="addForm.remarks" type="textarea"></el-input>
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
              @click="saveDivision('divisionForm')"
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
      <el-tab-pane label="部门导入" name="importList">
        <el-form
          :model="templateFile"
          size="small"
          ref="importForm"
          :rules="rule"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="下载模板">
                <el-button type="primary" @click="downTemplate"
                  >下载模板<i class="el-icon-download"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
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
import Test from "../../components/common/TreeSelect";
import common from "@/assets/js/common";

export default {
  components: { treeSelect: Test },
  name: "DivisionManagement",
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
      tableData: [],
      activeName: "list",
      flag: true,
      addForm: {
        office: { name: "" },
        area: { name: "" },
        name: "",
        officeType: null,
        master: "",
        address: "",
        zipCode: "",
        phone: "",
        fax: "",
        email: "",
        remarks: "",
      },
      isAdd: true,
      disabled: false,
      templateFile: { name: "" },
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        file: [{ validator: nameDistinct, trigger: "change" }],
      },
      expandRowKeys: [],
    };
  },
  methods: {
    hasLoadedTree(data) {
      let expandRowKeys = [];
      data.forEach((item) => {
        if (item.children) {
          expandRowKeys.push(item.id);
          let provinceArr = item.children;
          provinceArr.forEach((item) => {
            if (item.children) {
              expandRowKeys.push(item.id);
            }
          });
        }
      });
      this.expandRowKeys = expandRowKeys;
    },
    async divisionInit() {
      await this.$get(api.offices).then((res) => {
        this.tableData = res.data;
        this.activeName = "list";
      });
    },
    saveDivision(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.parent = { id: data.office.id };
      delete data.office;
      data.area = { id: data.area.id };
      data.grade = "g";
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeName == "addlist") {
            if (this.flag) {
              delete data.id;
              this.$post(api.offices, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                    this.divisionInit();
                    this.$refs[formName].resetFields();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              delete data.id;
              this.$post(api.offices, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                    this.divisionInit();
                    this.flag = false;
                    this.$refs[formName].resetFields();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            data.parent = { id: data.parent.id };
            data.area = { id: data.area.id };
            this.$put(api.offices + "/" + this.addForm.id, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.divisionInit();
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    },
    //修改编辑部门
    handleEdit(index, row) {
      this.isAdd = false;
      this.activeName = "changelist";
      this.$get(api.offices + "/" + row.id)
        .then((res) => {
          Object.assign(this.addForm, JSON.parse(JSON.stringify(res.data)));
          this.addForm.office = this.addForm.parent;
          sessionStorage.setItem(
            "DivisionManagement",
            JSON.stringify({
              isAdd: this.isAdd,
              activeName: this.activeName,
              form: this.addForm,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除部门
    handleDelete(index, row) {
      this.$confirmBox("确定删除部门" + row.name + "?")
        .then((res) => {
          this.$del(api.offices + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.divisionInit();
              }
            })
            .catch((err) => {
              this;
              this.$message.error(err.errMsg);
            });
        })
        .catch((err) => {});
    },
    //添加下级部门
    handleAdd(index, row) {
      this.isAdd = true;
      this.activeName = "addlist";
      this.flag = false;
      this.$get(api.offices + "/" + row.id)
        .then((res) => {
          this.addForm = JSON.parse(JSON.stringify(res.data));
          this.addForm.office = {
            name: this.addForm.name,
            id: this.addForm.id,
          };
          this.addForm.name = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downTemplate() {
      this.$getFormData(api.template + "/download", {
        templeleName: "部门导入模板.xlsx",
      })
        .then((res) => {
          this.download(res.data, "部门导入模板.xlsx");
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
            this.$post(api.offices + "/import", data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "导入成功！",
                    type: "success",
                  });
                  this.activeName = "list";
                  this.divisionInit();
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
        sessionStorage.setItem(
          "DivisionManagement",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addForm,
          })
        );
      }
      if (newval != "changelist") {
        this.isAdd = true;
        this.$refs.divisionForm.resetFields();
        Object.assign(this.addForm, {
          office: { name: "" },
          area: { name: "" },
          name: "",
          officeType: null,
          master: "",
          address: "",
          zipCode: "",
          phone: "",
          fax: "",
          email: "",
          remarks: "",
        });
      }
    },
  },
  async created() {
    this.$get(api.myInfo).then(async (res) => {
      if (res.data.orgId == null || res.data.orgId.length == 0) {
        this.$get(api.org + "/setOrgId?orgId=" + null)
          .then(async (res) => {
            await this.divisionInit();
            if (sessionStorage.getItem("DivisionManagement")) {
              let { activeName, isAdd, form } = JSON.parse(
                sessionStorage.getItem("DivisionManagement")
              );
              this.activeName = activeName;
              this.isAdd = isAdd;
              this.addForm = form;
            }
          })
          .catch((e) => console.log(e));
      } else {
        await this.divisionInit();
        if (sessionStorage.getItem("DivisionManagement")) {
          let { activeName, isAdd, form } = JSON.parse(
            sessionStorage.getItem("DivisionManagement")
          );
          this.activeName = activeName;
          this.isAdd = isAdd;
          this.addForm = form;
        }
      }
    });
    this.$store.dispatch("login/headerTitleChange", "部门管理");
  },
  beforeDestroy() {
    sessionStorage.removeItem("DivisionManagement");
  },
};
</script>

<style scoped>
</style>
