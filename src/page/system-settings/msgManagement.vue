<template>
  <div id="msg-management">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="消息列表" name="list">
        <el-table
          :data="tableData"
          stripe
          fit
          border
          :resizable="false"
          @selection-change="handleCheckBox"
          row-key="id"
          size="mini"
          style="width: 100%"
          height="500px"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="orgName"
            label="机构"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column
            prop="sysUserDtos"
            label="用户"
            show-overflow-tooltip
            width="100px;"
          >
            <template slot-scope="scope">
              {{
                scope.row.sysUserDtos
                  ? scope.row.sysUserDtos.map((e) => e.loginName).join(",")
                  : "所有人"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            show-overflow-tooltip
            width="400px;"
          ></el-table-column>
          <el-table-column
            prop="content"
            align="center"
            label="内容"
            show-overflow-tooltip
            width="100px;"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="view(scope.row.content)"
                >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="isRead"
            label="已读"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column
            prop="createDate"
            label="消息创建时间"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column
            prop="notifyExpireTime"
            label="消息过期时间"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                @click="edit(scope.row)"
                size="mini"
                type="warning"
                plain
              ></el-button>
              <el-button
                icon="el-icon-delete"
                @click="del(scope.row)"
                size="mini"
                type="danger"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="contentVisible" width="30%">
          <span>{{ tmp }}</span>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
        <el-dialog
          title="编辑"
          :visible.sync="isEditMsg"
          width="50%"
          :show-close="false"
          :before-close="handleClose"
        >
          <div>
            <el-form :model="tmpMsgData" label-width="100px">
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="标题"
                        prop="title"
                        :rules="
                          $filter_rules({ required: true, trigger: 'blur' })
                        "
                      >
                        <el-input v-model="tmpMsgData.title"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        :rules="
                          $filter_rules({ required: true, trigger: 'blur' })
                        "
                        prop="content"
                        label="内容"
                      >
                        <el-input
                          type="textarea"
                          v-model="tmpMsgData.content"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        :rules="
                          $filter_rules({ required: true, trigger: 'blur' })
                        "
                        prop="notifyExpireTime"
                        label="过期时间"
                      >
                        <el-date-picker
                          v-model="tmpMsgData.notifyExpireTime"
                          type="date"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="消息接收用户">
                        <el-input
                          disabled
                          type="text"
                          v-model="tmpUsers"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isEditMsg = false">取 消</el-button>
            <el-button type="primary" @click="confirmEditMsg">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="新增消息" name="addMsg">
        <div>
          <el-form :model="msgData" label-width="100px" ref="addForm">
            <el-row>
              <el-col :span="16">
                <el-row>
                  <el-col :lg="{ span: 16 }">
                    <el-form-item
                      label="标题"
                      prop="title"
                      :rules="
                        $filter_rules({ required: true, trigger: 'blur' })
                      "
                    >
                      <el-input v-model="msgData.title"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="{ span: 16 }">
                    <el-form-item
                      :rules="
                        $filter_rules({ required: true, trigger: 'blur' })
                      "
                      prop="content"
                      label="内容"
                    >
                      <el-input
                        type="textarea"
                        v-model="msgData.content"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="{ span: 16 }">
                    <el-form-item
                      :rules="
                        $filter_rules({ required: true, trigger: 'blur' })
                      "
                      prop="notifyExpireTime"
                      label="过期时间"
                    >
                      <el-date-picker
                        v-model="msgData.notifyExpireTime"
                        type="date"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="机构">
                      <el-select
                        v-model="msgData.orgId"
                        aria-placeholder="请选择消息发送给谁"
                      >
                        <el-option
                          v-for="item in orgs"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="{ span: 8 }">
                    <el-form-item label="部门" name="selectedOfficeId">
                      <el-select
                        v-model="selectedOfficeId"
                        @change="changeOffice"
                      >
                        <el-option
                          v-for="item in offices"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="{ span: 16 }">
                    <el-form-item label="消息接收用户">
                      <el-select
                        v-model="msgData.userIds"
                        multiple
                        placeholder="请选择消息发送给谁"
                        @change="changeMessage"
                      >
                        <el-option
                          v-for="item in users"
                          :key="item.id"
                          :label="item.loginName"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2" :offset="10">
                    <el-button
                      size="mini"
                      type="success"
                      @click="save('addForm')"
                      >保存</el-button
                    >
                  </el-col>
                  <el-col :span="2">
                    <el-button size="mini" type="primary" @click="back"
                      >返回</el-button
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import api from "../../api/index";

export default {
  name: "msgManagement",
  data() {
    return {
      activeName: "list",
      tableData: [
        {
          org: "",
          sysUserDtos: [],
          title: "",
          content: "",
          isRead: "",
          createDate: "",
          notifyExpireTime: "",
        },
      ],
      msgData: {
        title: "",
        content: "",
        orgId: "",
        notifyExpireTime: "",
        userIds: [],
      },
      tmpMsgData: {
        id: "",
        title: "",
        content: "",
        notifyExpireTime: "",
      },
      users: [{ id: "", loginName: "" }],
      orgs: [{ id: "", name: "" }],
      offices: [{ id: "", name: "" }],
      selectedOfficeId: [],
      contentVisible: false,
      isEditMsg: false,
      tmp: "",
      tmpUsers: "",
    };
  },
  methods: {
    handleCheckBox(val) {},
    view(row) {
      this.contentVisible = true;
      this.tmp = row;
    },
    search() {
      this.$get(api.msg + "/list1", {
        messageType: "CUSTOM",
      }).then((res) => {
        this.tableData = res.data.list;
      });
    },
    edit(row) {
      this.tmpUsers = row.sysUserDtos.map((e) => e.loginName).join(",");
      this.isEditMsg = true;
      this.tmpMsgData = row;
    },
    del(row) {
      this.$confirm("确认删除该消息?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$del(api.msg + "/del/" + row.id)
            .then((res) => {
              this.$message.success("删除成功");
              this.search();
            })
            .catch((err) => {
              this.$message.error("异常错误,删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    back() {
      // this.$router.go(-1);
      this.activeName = "list";
    },
    changeOffice() {
      this.$nextTick(() => {
        this.$refs["addForm"].clearValidate("selectedOfficeId"); //清楚当前select的校验规则
      });
    },
    changeMessage() {
      this.$forceUpdate();
    },
    save() {
      let loadingInstance = this.$loading({ fullscreen: true });
      this.msgData.type = "CUSTOM";
      this.$post(api.msg + "/add", this.msgData)
        .then((res) => {
          this.$message.success("添加成功");
          this.msgData = {};
          this.activeName = "list";
          this.search();
        })
        .catch((err) => {
          this.$message.error("操作失败");
        });
      loadingInstance.close();
    },
    getOrgs() {
      this.$get(api.org + "/list").then((res) => {
        this.orgs = res.data;
      });
    },
    getOffices(id) {
      this.$get(api.offices + "/all/" + id).then((res) => {
        this.offices = res.data;
      });
    },
    getUsers(orgId, officeId) {
      this.$get(api.users + "/" + orgId + "/" + officeId).then((e) => {
        this.users = e.data;
      });
    },
    handleClose() {
      this.inEditMsg = "";
    },
    confirmEditMsg() {
      this.$put(api.msg + "/update", this.tmpMsgData).then((e) => {
        this.$message.success("修改成功");
        this.search();
        this.isEditMsg = false;
      });
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "消息管理");
    this.search();
  },
  watch: {
    activeName: function (val) {
      if (val == "addMsg") {
        this.getOrgs();
      }
    },
    "msgData.orgId": function (val) {
      this.selectedOfficeId = "";
      this.msgData.userIds = [];
      if (val) {
        this.getOffices(val);
      }
    },
    selectedOfficeId: function (val) {
      this.msgData.userIds = [];
      if (val) {
        this.getUsers(this.msgData.orgId, val);
      }
    },
    isEditMsg: function (val) {
      if (!val) {
        this.tmpUsers = "";
        this.tmpMsgData = {
          title: "",
          content: "",
          notifyExpireTime: "",
        };
      }
    },
  },
};
</script>
<style scoped>
</style>