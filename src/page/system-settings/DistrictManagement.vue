<template>
  <div id="district-management">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="区域列表" name="list">
        <el-table
          :data="tableData"
          style="width: 100%"
          size="mini"
          row-key="id"
          border
          fit
          :expand-row-keys="expandRowKeys"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="name" label="区域名称"> </el-table-column>
          <el-table-column prop="code" label="区域编码"> </el-table-column>
          <!--<el-table-column-->
          <!--prop="areaType.label"-->
          <!--label="区域类型">-->
          <!--</el-table-column>-->

          <el-table-column prop="remarks" label="备注"> </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="warning"
                @click="edit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                plain
                type="danger"
                @click="deleteRow(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                plain
                type="primary"
                @click="hangleAdd(scope.$index, scope.row)"
                >添加下级区域</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="isAdd ? '区域添加' : '区域修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          :rules="rule"
          ref="areaForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="上级区域">
                <treeSelect
                  title="区域"
                  :model.sync="addForm.area"
                  name="area"
                  ref="treeSelect"
                  showUntilThree
                  :expandRowKeys="expandRowKeys"
                  isTitleChoose
                ></treeSelect>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="区域名称" prop="name">
                <el-input v-model.trim="addForm.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="{ span: 16 }">
              <el-form-item label="区域编码" prop="code">
                <el-input v-model="addForm.code"></el-input>
              </el-form-item>
            </el-col>

            <!--<el-col :lg="{span:16}">-->
            <!--<el-form-item label="区域类型"   >-->
            <!--<select-from-dict className="w100" :model.sync="addForm.areaType" data_type="sys_area_type"></select-from-dict>-->
            <!--</el-form-item>-->
            <!--</el-col>-->

            <el-col :lg="{ span: 16 }">
              <el-form-item label="备注">
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
              @click="save('areaForm')"
              ><i class="fa fa-save"></i> 保存</el-button
            >
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
import api from "../../api/index";
export default {
  name: "DistrictManagement",
  components: { treeSelect: Test },
  data() {
    var nameDistinct = (rule, value, callback) => {
      var id = this.addForm.id;
      let parentId = this.addForm.area.id;
      this.$get(api.areaNameDistinct, { newName: value, id: id, parentId })
        .then((res) => {
          if (!res.data) {
            callback(new Error("'" + value + "'已经存在！"));
          } else {
            callback();
          }
        })
        .catch((err) => {
          callback(new Error("服务器错误！"));
        });
    };
    var reg = /^\d{6}$/;
    var isNumber = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else if (!reg.test(value)) {
        return callback(new Error("该项输入必须为六位数字!"));
      } else {
        return callback();
      }
    };
    return {
      activeName: "list",
      tableData: [],
      isAdd: true,
      flag: true,
      addForm: {
        area: { name: "" },
        name: "",
        code: "",
        areaType: null,
        remarks: "",
      },
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { min: 1, max: 50, message: "最多输入50个字符!", trigger: "blur" },
          { validator: nameDistinct, trigger: "blur" },
        ],
        code: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { min: 1, max: 6, message: "最多输入6个字符!", trigger: "blur" },
          { validator: isNumber, trigger: "blur" },
        ],
      },
      expandRowKeys: [],
    };
  },
  methods: {
    init() {
      this.$refs.treeSelect.initData();
      this.$get(api.area)
        .then((res) => {
          console.log(res.data, "阿秋");
          this.tableData = res.data;
          this.activeName = "list";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(index, row) {
      console.log(row, "hhhhhhh");
      this.isAdd = false;
      this.activeName = "changelist";
      var data = JSON.parse(JSON.stringify(row));
      data.area = data.parent;
      Object.assign(this.addForm, data);
      sessionStorage.setItem(
        "DistrictManagement",
        JSON.stringify({
          isAdd: this.isAdd,
          activeName: this.activeName,
          form: this.addForm,
        })
      );
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除区域" + row.name + "及以下子区域吗?")
        .then((res) => {
          this.$del(api.area + "/" + row.id)
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
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.parent = { id: data.area.id };
      delete data.area;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeName == "addlist") {
            if (this.flag) {
              console.log(data, "新增");
              this.$post(api.area, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                  }
                  this.init();
                  this.$refs[formName].resetFields();
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              console.log(data, "添加下级区域");
              this.$post(api.area, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                  }
                  this.init();
                  this.$refs[formName].resetFields();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            console.log(data, "修改");
            this.$put(api.area + "/" + data.id, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.init();
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
    hangleAdd(index, row) {
      this.isAdd = true;
      this.activeName = "addlist";
      this.flag = false;
      var data = JSON.parse(JSON.stringify(row));
      // this.addForm.area=data;
      let postData = {
        areaType: null,
        code: "",
        name: "",
        remarks: "",
        area: data,
      };
      this.addForm = postData;
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval) {
        sessionStorage.setItem(
          "DistrictManagement",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addForm,
          })
        );
      }
      if (newval == "list") {
        this.isAdd = true;
        Object.assign(this.addForm, {
          area: { name: "" },
          name: "",
          code: "",
          areaType: null,
          remarks: "",
        });
        this.$refs.areaForm.resetFields();
      } else if (newval == "addlist") {
        if (this.flag) {
          Object.assign(this.addForm, {
            area: { name: "" },
            name: "",
            code: "",
            areaType: null,
            remarks: "",
          });
        }
      }
    },
  },
  created: function () {
    if (sessionStorage.getItem("DistrictManagement")) {
      let { activeName, isAdd, form } = JSON.parse(
        sessionStorage.getItem("DistrictManagement")
      );
      this.activeName = activeName;
      this.isAdd = isAdd;
      this.addForm = {
        area: { name: "" },
        name: "",
        code: "",
        areaType: null,
        remarks: "",
      };
    }
    this.$get(api.area)
      .then((res) => {
        this.tableData = res.data;
        console.log(res.data, "初始表");
        let expandRowKeys = [];
        this.tableData.forEach((item) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
    this.$store.dispatch("login/headerTitleChange", "区域管理");
  },
  beforeDestroy() {
    sessionStorage.removeItem("DistrictManagement");
  },
};
</script>

<style scoped>
</style>

