<template>
  <div>
    <CaseDetail :caseId="caseId"></CaseDetail>
    <Portlet title="存档文件">
      <template slot="body">
        <el-table
          stripe
          fit
          border
          size="mini"
          :data="archiveFileList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="fileName" width="150px" label="文件名称">
          </el-table-column>
          <el-table-column prop="pageCount" width="200px" label="页数">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pageCount" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="扫描件">
            <template slot-scope="scope">
              <FileWall
                :isType2="true"
                :model.sync="scope.row.files"
                :has-title="false"
              />
            </template>
          </el-table-column>
          <el-table-column width="350px" label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="上传图片"
                placement="bottom"
              >
                <el-upload
                  style="float: left"
                  :multiple="true"
                  action="#"
                  :show-file-list="false"
                  :on-change="
                    (file, fileList) => {
                      handleChange(file, fileList, scope.$index, scope.row);
                    }
                  "
                  :auto-upload="false"
                >
                  <el-button
                    size="mini"
                    icon="el-icon-upload"
                    type="primary"
                  ></el-button>
                </el-upload>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="导入附件"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  @click="exportClick(scope.$index, scope.row)"
                  icon="el-icon-files"
                  type="primary"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="扫描"
                placement="bottom"
              >
                <el-button
                  type="primary"
                  icon="el-icon-camera-solid"
                  size="mini"
                ></el-button>
                <!-- <Czur :model.sync="scope.row.files"></Czur> -->
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="向上插入项目"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  icon="el-icon-upload2"
                  type="primary"
                  @click="insertBefore(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="向下插入项目"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  icon="el-icon-download"
                  type="primary"
                  @click="insertAfter(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteRow(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Portlet>
    <el-row>
      <el-col :span="2" :offset="10">
        <el-button type="success" size="mini" class="save-btn" @click="save()"
          ><i class="fa fa-save"></i> 保存
        </el-button>
      </el-col>
      <el-col :span="2" v-if="taskId">
        <el-button
          type="success"
          size="mini"
          class="save-btn"
          @click="saveAndComplete()"
        >
          完成
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          size="mini"
          class="save-btn"
          @click="goBack()"
        >
          返回
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          size="mini"
          class="save-btn"
          @click="printArchiveFile()"
        >
          打印目录
        </el-button>
      </el-col>
    </el-row>
    <!--文件名称-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="文件名称" label-width="80px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" ref="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog title="导入附件" :visible.sync="dialogExport" width="840px">
      <el-form :model="form">
        <el-tabs type="border-card">
          <el-tab-pane
            v-for="(v, i) in exportLists"
            :key="i"
            :label="v.keyName"
            v-if="v.list.length > 0"
          >
            <el-table
              stripe
              fit
              border
              size="mini"
              ref="multipleTable"
              :data="v.list"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="exportSelection"
            >
              <el-table-column type="selection" />
              <el-table-column prop="name" label="附件名称" />
              <el-table-column label="查看" width="150px">
                <template slot-scope="scope">
                  <el-link :href="scope.row.url" target="_blank">{{
                    `附件`
                  }}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer" ref="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" @click="exportSumbit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/index";
import Portlet from "./../layout/Portlet";
import CaseDetail from "./../../components/common/CaseDetail";
import PictureWall from "../../components/common/PictureWall";
import FileWall from "../../components/common/FileWall";
import Czur from "../../components/common/Czur";
import PageOfficeApi from "../../components/tpl/PageOfficeApi";

export default {
  name: "FileDirectory",
  components: { Portlet, CaseDetail, PictureWall, FileWall, Czur },
  data() {
    return {
      dialogVisible: false,
      dialogExport: false,
      caseId: "",
      archiveFileList: [],
      form: {},
      selectRows: [],
      exportLists: [],
      selectionExportList: [],
      chooseItem: {}, //当前选中的
      taskId: "",
      professionCategoryId: "",
      complete: false,
    };
  },
  methods: {
    exportClick(i, v) {
      this.chooseItem = v.files;
      this.dialogExport = true;
    },
    init() {
      this.$get(api.archiveDirectorys + "/" + this.$route.query.caseId)
        .then((res) => {
          if (res.data && res.data.length > 0 && res.data[0]) {
            this.archiveFileList = res.data;
          } else {
            var param = {
              professionCategoryId: this.professionCategoryId,
              key: "case.archive.files",
            };
            this.$get(api.param + "/value", param)
              .then((res) => {
                if (res.data && res.data != "") {
                  var list = res.data.split(",");
                  this.archiveFileList = [];
                  list.forEach((v) => {
                    var data = { fileName: v, files: [] };
                    this.archiveFileList.push(data);
                  });
                } else {
                  this.archiveFileList = [{ fileName: "", files: [] }];
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    },
    exportSelection(list) {
      this.selectionExportList = list;
    },
    findArrFn(arr, id) {
      let bFlog = true;
      arr.forEach((item) => {
        if (item.url == id) {
          bFlog = false;
          return false;
        }
      });
      return bFlog;
    },
    //导入确定
    exportSumbit() {
      let timer = null;
      if (this.selectionExportList.length == 0) {
        this.$message.error("请选择要导入的数据!");
        return;
      }
      this.selectionExportList.forEach((item) => {
        if (this.findArrFn(this.chooseItem, item.url)) {
          this.chooseItem.push(item);
        } else {
          timer ? clearTimeout(timer) : null;
          timer = setTimeout(() => this.$message.error("请勿重复导入!"), 300);
        }
      });
      this.$refs.multipleTable.forEach((item) => item.clearSelection());
      this.selectionExportList = [];
      this.chooseItem = [];
      this.dialogExport = false;
    },
    handleSelectionChange() {},
    handleChange(file, filelist, index, row) {
      var fileName = file.name;
      row.files.push({
        fileType: fileName.split(".").reverse()[0],
        raw: file.raw,
        url: URL.createObjectURL(file.raw),
        name: fileName,
        isNowUpload: true,
      });
      row.pageCount = row.files.length;
    },
    //向上插入项目
    insertBefore(index, row) {
      this.form = {};
      this.dialogVisible = true;
      this.$refs.footer.setAttribute("index", index);
    },
    //向下插入项目
    insertAfter(index, row) {
      this.form = {};
      this.dialogVisible = true;
      this.$refs.footer.setAttribute("index", index + 1);
    },
    //确定
    confirm() {
      var index = this.$refs.footer.getAttribute("index");
      this.archiveFileList.splice(index, 0, {
        fileName: this.form.name,
        files: [],
      });
      this.dialogVisible = false;
    },
    deleteRow(index, row) {
      this.archiveFileList.splice(index, 1);
    },
    saveAndComplete() {
      this.complete = true;
      this.save(this.taskId);
    },
    goBack() {
      this.$router.go(-1);
    },
    async save(taskId) {
      //异步循环处理附件
      var archiveFileList = JSON.parse(JSON.stringify(this.archiveFileList));
      for (let i = 0; i < this.archiveFileList.length; i++) {
        let pageCount = Number(this.archiveFileList[i].pageCount);
        if (this.archiveFileList[i].pageCount !== undefined) {
          if (isNaN(pageCount) || parseInt(pageCount) !== pageCount) {
            this.$message.error("页数输入错误，请重新输入!");
            return;
          }
        }
        if (this.archiveFileList[i].files) {
          let arr = [];
          for (let j = 0; j < this.archiveFileList[i].files.length; j++) {
            if (this.archiveFileList[i].files[j].raw) {
              arr.push({
                name: this.archiveFileList[i].files[j].name, //文件名
                base64Str: await this.$getBase64(
                  this.archiveFileList[i].files[j].raw
                ), //base64
                fileType: this.archiveFileList[i].files[j].fileType, //文件类型
              });
            } else {
              arr.push(this.archiveFileList[i].files[j]);
            }
          }
          archiveFileList[i].files = arr;
          arr = null;
        }
      }
      let data = {
        id: this.$route.query.caseId,
        archiveFileDtoList: [],
        taskId: taskId,
      };
      archiveFileList.forEach((v, i) => {
        if (v.id) {
          data.archiveFileDtoList.push({
            id: v.id,
            fileName: v.fileName,
            pageCount: v.pageCount == "" ? "0" : v.pageCount,
            files: v.files,
          });
        } else {
          data.archiveFileDtoList.push({
            fileName: v.fileName,
            pageCount: v.pageCount == "" ? "0" : v.pageCount,
            files: v.files,
          });
        }
      });
      let res = await this.$put(api.archiveDirectorys, data).catch((err) =>
        console.log(err)
      );
      if (res.status == 200) {
        if (taskId != "") {
          this.$message.success("保存成功！");
          if (this.complete) {
            this.$router.push("/home");
            this.complete = false;
          }
        }
        this.init();
      }
    },
    //打印归档目录
    printArchiveFile() {
      this.save("");
      this.$get(api.template, {
        professionCategoryId: this.professionCategoryId,
        formLocation: "ARCHIVED_FILE",
        templateType: "FORM",
      })
        .then((res) => {
          if (res.data.list && res.data.list.length > 0) {
            var templateId = res.data.list[0].id;
            PageOfficeApi.renderForm(this.caseId, null, templateId, "N");
          } else {
            this.$message.success(
              "专业没有对应的归档目录表单，请联系管理员设置！"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "归档目录");
    this.caseId = this.$route.query.caseId;
    this.taskId = this.$route.query.taskId;
    let p = [];
    p.push(
      new Promise((resolve, reject) => {
        this.$get("/api/ca-case/v1/cases/entrust-info/" + this.caseId).then(
          (res) => {
            if (res.status == 200) {
              if (
                res.data &&
                res.data.professionCategory &&
                res.data.professionCategory.id
              ) {
                this.professionCategoryId = res.data.professionCategory.id;
                resolve();
              }
            }
          }
        );
      })
    );
    Promise.all(p).then((res) => {
      this.init();
    });
    // 用来导入的数据
    this.$get(api.archive + "/get-all-files?caseId=" + this.caseId)
      .then((res) => {
        res.data ? (this.exportLists = res.data) : null;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
</style>