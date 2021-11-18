<template>
  <div>
    <CaseDetail :caseId="caseId" @getCaseNoFlag="getCaseNoFlag"></CaseDetail>
    <el-form
      ref="checkForm"
      label-width="100px"
      size="small"
      :model="checkForm"
      class="demo-ruleForm"
      label-position="right"
    >
      <Collapse
        title="检验信息"
        :active="true"
        v-if="functionTestInfo"
        class="jyinfo"
      >
        <template>
          <el-row>
            <el-col :span="11" :offset="0" v-if="functionTestTime">
              <Portlet title="检验时间" :is-key="true">
                <template slot="buttonGroup">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    style="float: right; margin-right: 10px; margin-top: 5px"
                    @click="addTime"
                  >
                    增加
                  </el-button>
                </template>
                <template slot="body">
                  <el-table
                    border
                    size="small"
                    :data="checkForm.timeTable"
                    fit
                    style="width: 100%"
                  >
                    <el-table-column prop="startDate" label="开始日期">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0px"
                          :rules="$filter_rules({ required: functionTestTime })"
                          :prop="'timeTable.' + scope.$index + '.startDate'"
                        >
                          <el-date-picker
                            style="width: 100%"
                            v-model="scope.row.startDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="endDate" label="结束日期">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0px"
                          :prop="'timeTable.' + scope.$index + '.endDate'"
                        >
                          <el-date-picker
                            style="width: 100%"
                            v-model="scope.row.endDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80px">
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteRow(scope.$index, 'timeTable')"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </Portlet>
            </el-col>
            <el-col
              :span="11"
              :offset="functionTestTime ? 2 : 0"
              v-if="functionTestSite"
            >
              <Portlet title="检验地点" :is-key="functionTestSite">
                <template slot="buttonGroup">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    style="float: right; margin-right: 10px; margin-top: 5px"
                    @click="addAddress"
                    >增加
                  </el-button>
                </template>
                <template slot="body">
                  <el-table
                    border
                    size="small"
                    :data="checkForm.addressTable"
                    fit
                    style="width: 100%"
                  >
                    <el-table-column prop="address" label="检验地点">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0px"
                          :rules="$filter_rules({ required: functionTestSite })"
                          :prop="'addressTable.' + scope.$index + '.address'"
                        >
                          <el-select
                            default-first-option
                            v-model="scope.row.address"
                            placeholder="请选择"
                            :filterable="true"
                            style="width: 100%"
                            :allow-create="true"
                          >
                            <el-option
                              v-for="item in addressOpt"
                              :key="item.value"
                              :label="item.label"
                              :value="item.label"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80px">
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteRow(scope.$index, 'addressTable')"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </Portlet>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }" v-if="functionTestEquipment">
              <el-form-item label="检验设备">
                <select-from-table
                  :model.sync="addForm.authRecordInstrumentList"
                  port="instrument"
                  :filterable="true"
                  :multiple="true"
                  className="multiple-select"
                  :condition="condition"
                  :clearable="true"
                ></select-from-table>
              </el-form-item>
            </el-col>
            <el-col :lg="{ span: 16 }" v-if="functionTestMethod">
              <el-form-item label="检验方法/标准">
                <select-from-table
                  :model.sync="addForm.authRecordStandardList"
                  port="standard"
                  :filterable="true"
                  :multiple="true"
                  className="multiple-select"
                  :condition="condition"
                  :clearable="true"
                  :disabled="isCnasItem"
                ></select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </Collapse>
    </el-form>
    <!--动态字段-->
    <Dynamicfield
      ref="dynamicfield"
      :model.sync="DynamicField"
      v-if="
        DynamicField.caSysDynamicFieldValueList &&
        DynamicField.caSysDynamicFieldValueList.length
      "
    ></Dynamicfield>
    <!--酒精检测记录-->
    <AlcoholResult
      v-if="entrustingMatterTypeList.indexOf('ALCOHOL') > -1"
      :case-id="caseId"
      :basic-data="authRecordsMsg"
      :model.sync="alcoholForm"
      :alcoholTestRecord="alcoholTestRecord"
      ref="alcoholResult"
      :caseNoFlag="caseNoFlag"
      @getComputedTable="getComputedTable"
    ></AlcoholResult>
    <!--文书车痕等-->
    <AuthResult
      v-if="judgeArr.indexOf(professionCategoryType) > -1"
      :case-id="caseId"
      :basic-data="authRecordsMsg"
      :model.sync="authResultForm"
      ref="authResult"
    ></AuthResult>
    <!--毒物-->
    <PoisonResult
      v-if="entrustingMatterTypeList.indexOf('POISON') > -1"
      :case-id="caseId"
      :basic-data="authRecordsMsg"
      :model.sync="poisonForm"
      :poisonTestResult="poisonTestResult"
      ref="poisonResult"
    ></PoisonResult>
    <!--物证-->
    <DnaResult
      v-if="professionCategoryType == 'DNA'"
      :case-id="caseId"
      :basic-data="authRecordsMsg"
      :model.sync="dnaForm"
      :dnaTestResult="dnaTestResult"
      ref="DnaResult"
    ></DnaResult>
    <!--检测记录-->
    <RecordData
      :case-id="caseId"
      :model.sync="addForm.authRecord"
      :basic-data="authRecordsMsg"
      :inspectInfoTestRecord="inspectInfoTestRecord"
    ></RecordData>

    <Portlet title="检测照片" v-if="testPhoto">
      <template slot="buttonGroup">
        <el-upload
          style="float: right; margin-right: 10px"
          class="upload-demo"
          action="#"
          :multiple="true"
          :on-change="handleChangePhoto"
          :auto-upload="false"
          :show-file-list="false"
          list-type="picture"
        >
          <el-button type="primary" icon="el-icon-plus" size="mini"
            >上传</el-button
          >
        </el-upload>
        <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                               style="float: right;margin-right: 10px;margin-top: 11px">扫描
                    </el-button> -->
        <Czur
          :isScan="true"
          style="float: right; margin-right: 10px"
          :model.sync="photoArr"
        ></Czur>
      </template>
      <template slot="body">
        <PictureWall :model.sync="photoArr" :has-title="true"> </PictureWall>
      </template>
    </Portlet>
    <Portlet title="鉴定/检验记录附件" v-if="fileInspectInfoTestRecord">
      <template slot="buttonGroup">
        <el-upload
          style="float: right; margin-right: 10px"
          class="upload-demo"
          action="#"
          :multiple="true"
          :on-change="handleChangeAccessory"
          :auto-upload="false"
          :show-file-list="false"
          list-type="picture"
        >
          <el-button type="primary" icon="el-icon-plus" size="mini"
            >上传</el-button
          >
        </el-upload>
        <Czur
          :isScan="true"
          style="float: right; margin-right: 10px"
          :model.sync="accessoryArr"
        ></Czur>
      </template>
      <template slot="body">
        <FileWall :model.sync="accessoryArr"> </FileWall>
      </template>
    </Portlet>
    <el-row>
      <el-col :span="2" :offset="11">
        <el-button
          type="success"
          size="mini"
          class="save-btn"
          @click="save('save')"
          ><i class="fa fa-save"></i>
          保存
        </el-button>
      </el-col>
      <el-col :span="2" v-if="taskId">
        <el-button
          type="primary"
          size="mini"
          class="save-btn"
          @click="save('finish')"
          ><i></i>完成
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PictureWall from "../../../components/common/PictureWall";
import FileWall from "../../../components/common/FileWall";
import Portlet from "../../layout/Portlet";
import Dynamicfield from "../../../components/common/Dynamicfield";
import caseDetail from "../../../components/common/CaseDetail";
import Collapse from "../../layout/Collapse";
import Czur from "../../../components/common/Czur";

import AuthResult from "./AuthResult";
import PoisonResult from "./PoisonResult";
import DnaResult from "./DnaResult";
import AlcoholResult from "./AlcoholResult";
import RecordData from "./RecordData";
import api from "../../../api/index";

export default {
  components: {
    Collapse: Collapse,
    Portlet: Portlet,
    PictureWall: PictureWall,
    FileWall: FileWall,
    CaseDetail: caseDetail,
    AuthResult: AuthResult,
    PoisonResult: PoisonResult,
    DnaResult: DnaResult,
    AlcoholResult: AlcoholResult,
    RecordData: RecordData,
    Dynamicfield: Dynamicfield,
    Czur,
  },
  name: "IdentificationRecords",
  data() {
    return {
      judgeArr: [
        "DAMAGE_DEGREE",
        "DISABILITY_LEVEL",
        "TRACE",
        "DOCUMENT",
        "VEHICLE_SPEED",
        "GENERAL",
      ],
      professionCategoryType: null,
      photoArr: [], //照片
      accessoryArr: [], //附件
      panClass: {
        sm: {
          span: 12,
        },
        md: {
          span: 12,
        },
      },
      condition: {}, //获取设备和方法的专业类别条件
      addressOpt: [], //检验地点
      authRecordsMsg: {}, //初始鉴定记录数据
      entrustingMatterTypeList: [], //委托事项类别
      checkForm: {
        timeTable: [{}],
        addressTable: [{}],
      }, //检验信息
      addForm: {
        authDate: "",
        authAddress: "",
        authPhotoList: [],
        authFileList: [],
        authRecord: "",
      },
      authResultForm: {
        authResultList: [],
      }, //文书车痕病理等
      poisonForm: {
        poSampleResultList: [],
      }, //毒物
      dnaForm: {
        dnaResultDtoList: [],
      }, //物证
      alcoholForm: {
        //酒精表单
        /* doubleResultList: [], */
        singleResultList: [],
        tertiaryButanolTable: [{}, {}],
      },
      caseId: "",
      DynamicField: {
        caSysDynamicFieldValueList: [],
      },
      taskId: "",
      //鉴定记录显示字段
      fieldMsg: "",
      functionTestTime: false,
      functionTestSite: false,
      functionTestInfo: true,
      functionTestEquipment: false,
      functionTestMethod: false,
      testPhoto: false,
      inspectInfoTestRecord: false,
      poisonTestResult: false,
      dnaTestResult: false,
      fileInspectInfoTestRecord: false,
      alcoholTestRecord: false,
      isCnasItem: false,
      caseNoFlag: "",
      computedTable: null,
    };
  },
  methods: {
    getComputedTable(computedTable) {
      this.computedTable = computedTable;
    },
    getCaseNoFlag(caseNoFlag) {
      //获取案鉴字
      this.caseNoFlag = caseNoFlag;
      this.$nextTick(() => {
        this.$refs["alcoholResult"] &&
          this.$refs["alcoholResult"].init(this.authRecordsMsg);
      });
    },
    getDynamicField(condition) {
      var data = {};
      data["page.pageSize"] = 1000;
      data["page.current"] = 1;
      this.$get(api.dynamicFields, condition)
        .then((res) => {
          let arr = [].concat(res.data);
          let finalList = [];
          arr.forEach((v, i) => {
            finalList = finalList.concat(v.list);
          });
          this.DynamicField.caSysDynamicFieldValueList = finalList.map(
            (v, i) => {
              if (
                v.inputType.value == "SELECT_MULTI" ||
                v.inputType.value == "CHECKBOX"
              ) {
                return {
                  sysDynamicField: v,
                  value: [],
                };
              } else {
                return {
                  sysDynamicField: v,
                  value: "",
                };
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //检验信息
    addTime() {
      this.checkForm.timeTable.push({});
    },
    addAddress() {
      this.checkForm.addressTable.push({});
    },
    deleteRow(index, name) {
      if (this.checkForm[name].length > 1) {
        this.checkForm[name].splice(index, 1);
      } else {
        this.$message.error("至少填写一项数据！");
      }
    },
    //上传照片
    handleChangePhoto(file, fileList) {
      if (file.raw.type.includes("image")) {
        this.photoArr.push({
          photo: {
            imageType: this.$getFileType(file),
            raw: file.raw,
          },
          photoName: "",
        });
      } else {
        this.$message.error("只能上传图片!");
      }
    },
    //上传附件
    handleChangeAccessory(file, fileList) {
      var fileName = file.name;
      let fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.accessoryArr.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    //最后保存
    async save(type) {
      var _this = this;
      let promiseArr = [];
      //验证所有表单的必填项
      for (var key in _this.$refs) {
        if (_this.$refs[key].$refs.form) {
          let p = new Promise(function (resolve, reject) {
            _this.$refs[key].$refs.form.validate((valid) => {
              if (valid) {
                resolve();
              } else {
                reject();
              }
            });
          });
          promiseArr.push(p);
        } else {
          let p = new Promise(function (resolve, reject) {
            _this.$refs[key].validate((valid) => {
              if (valid) {
                resolve();
              } else {
                reject();
              }
            });
          });
          promiseArr.push(p);
        }
      }

      Promise.all(promiseArr)
        .then(function (res) {
          //拼接检验时间
          var authDate = "";
          _this.checkForm.timeTable.forEach((v, i) => {
            if (i + 1 == _this.checkForm.timeTable.length) {
              authDate +=
                v.startDate +
                (v.endDate == "null" || v.endDate == null
                  ? ""
                  : "至" + v.endDate);
            } else {
              authDate +=
                v.startDate +
                (v.endDate == "null" || v.endDate == null
                  ? ""
                  : "至" + v.endDate) +
                ",";
            }
          });
          _this.addForm.authDate = authDate;
          //拼接检验地点
          var authAddress = "";

          _this.checkForm.addressTable.forEach((v, i) => {
            if (i + 1 == _this.checkForm.addressTable.length) {
              if (v.address) {
                if (v.address.id) {
                  authAddress += v.address.label;
                } else {
                  authAddress += v.address;
                }
              }
            } else {
              if (v.address) {
                if (v.address.id) {
                  authAddress += v.address.label + ",";
                } else {
                  authAddress += v.address + ",";
                }
              }
            }
          });
          _this.addForm.authAddress = authAddress;
          var accessoryPromise = [];
          //压缩照片
          let p3 = new Promise((resolve, reject) => {
            /* 偶尔会出现图片报错：Offset is outside the bounds of the DataView */
            _this.$compressPhotos(_this.photoArr).then((res) => {
              _this.addForm.authPhotoList = [].concat(res);
              resolve();
            });
          });
          accessoryPromise.push(p3);
          //压缩附件
          _this.addForm.authFileList = [];
          _this.accessoryArr.forEach((v, i) => {
            if (v.raw) {
              if (
                v.fileType == "JPG" ||
                v.fileType == "PNG" ||
                v.fileType == "jpg" ||
                v.fileType == "png"
              ) {
                let p = new Promise((resolve, reject) => {
                  lrz(v.raw, {
                    width: 1280,
                  }).then(function (rst) {
                    var index = v.name.lastIndexOf(".");
                    var fileName = v.name.substring(0, index);
                    _this.addForm.authFileList[i] = {
                      name: fileName,
                      fileType: v.fileType,
                      base64Str: rst.base64,
                    };
                    resolve();
                  });
                });
                accessoryPromise.push(p);
              } else {
                let p = new Promise((resolve, reject) => {
                  _this.$getBase64(v.raw).then(function (res) {
                    var index = v.name.lastIndexOf(".");
                    var fileName = v.name.substring(0, index);
                    _this.addForm.authFileList[i] = {
                      name: fileName,
                      fileType: v.fileType,
                      base64Str: res,
                    };
                    resolve();
                  });
                });
                accessoryPromise.push(p);
              }
            } else {
              _this.addForm.authFileList[i] = v;
            }
          });
          Promise.all(accessoryPromise).then((res) => {
            var data = JSON.parse(JSON.stringify(_this.addForm));
            if (data.authRecordInstrumentList.length) {
              data.authRecordInstrumentList = data.authRecordInstrumentList.map(
                (v, i) => {
                  return {
                    instrument: v,
                  };
                }
              );
            }
            if (data.authRecordStandardList.length) {
              data.authRecordStandardList = data.authRecordStandardList.map(
                (v, i) => {
                  return {
                    standard: v,
                  };
                }
              );
            }
            //文书车痕等
            if (_this.authResultForm.authResultList.length) {
              _this.authResultForm.authResultList.forEach((item) => {
                if (item.speedMax === "") {
                  item.speedMax = null;
                }
                if (item.speedMin === "") {
                  item.speedMin = null;
                }
                if (item.result === "") {
                  item.result = null;
                }
              });
              data.authResultList = [].concat(
                _this.authResultForm.authResultList
              );
            }
            //毒物数据处理
            if (_this.poisonForm.poSampleResultList.length) {
              data.poSampleResultList = [].concat(
                _this.poisonForm.poSampleResultList
              );
            }
            data.authAlcoholResultList = null;
            //酒精数据处理

            if (
              _this.authRecordsMsg.inputContentFlag === "1" &&
              _this.entrustingMatterTypeList.indexOf("ALCOHOL") > -1
            ) {
              if (
                _this.alcoholForm.doubleResultList &&
                _this.alcoholForm.doubleResultList.length &&
                _this.alcoholForm.doubleResultList[0].content1 !== null
              ) {
                //双通道
                var arr = [].concat(_this.alcoholForm.doubleResultList);
                arr.forEach((v, i) => {
                  if ((i + 1) % 2 != 0) {
                    var a_content = v.content;
                    var b_content = arr[i + 1].content;
                    v.content3 = arr[i + 1].content1;
                    v.content4 = arr[i + 1].content2;
                    v.content = v.contentAll;
                    v.relativeDifferencea = v.rd;
                    v.relativeDifferenceb = arr[i + 1].rd;
                    v.averagea = v.avg;
                    v.averageb = arr[i + 1].avg;
                    //v.content = ((a_content * 100 + b_content * 100) / 200).toFixed(2);
                  }
                });
                let arr1 = [];
                _this.alcoholForm.doubleResultList.forEach((v, i) => {
                  if (i % 2 == 0) {
                    arr1.push(v);
                  }
                });
                data.authAlcoholResultList = [].concat(arr1);
              } else {
                //单通道
                data.authAlcoholResultList = [].concat(
                  _this.alcoholForm.singleResultList
                );
              }
            }
            if (
              _this.authRecordsMsg.inputContentFlag === "0" &&
              _this.entrustingMatterTypeList.indexOf("ALCOHOL") > -1
            ) {
              //丁叔醇
              let sample =
                _this.authRecordsMsg.authAlcoholResultList[0] &&
                _this.authRecordsMsg.authAlcoholResultList[0].sample;
              let id =
                _this.authRecordsMsg.authAlcoholResultList[0] &&
                _this.authRecordsMsg.authAlcoholResultList[0].id;

              data.authAlcoholResultList = [].concat(
                _this.alcoholForm.tertiaryButanolTable
              );

              data.authAlcoholResultList.forEach((item) => {
                item.sample = sample;
              });
              delete _this.computedTable[0].caseNoFlag;
              delete _this.computedTable[0].createBy;
              delete _this.computedTable[0].createDate;
              delete _this.computedTable[0].delFlag;
              delete _this.computedTable[0].delFlag;
              delete _this.computedTable[0].orgId;
              delete _this.computedTable[0].remarks;
              delete _this.computedTable[0].updateBy;
              delete _this.computedTable[0].updateDate;
              delete _this.computedTable[0].id;

              let obj = JSON.parse(JSON.stringify(_this.computedTable[0]));
              obj.alcohol1 = data.authAlcoholResultList[0].alcohol;
              obj.alcohol2 = data.authAlcoholResultList[1].alcohol;
              obj.tertiaryButanol1 =
                data.authAlcoholResultList[0].tertiaryButanol;
              obj.tertiaryButanol2 =
                data.authAlcoholResultList[1].tertiaryButanol;
              obj.content1 = data.authAlcoholResultList[0].content;
              obj.content2 = data.authAlcoholResultList[1].content;
              obj.vx1 = data.authAlcoholResultList[0].vx;
              obj.vx2 = data.authAlcoholResultList[1].vx;

              obj.sample = sample;
              if (id) {
                obj.id = id;
              }
              data.authAlcoholResultList = [obj];
            }

            data.caSysDynamicFieldValueList = [].concat(
              _this.DynamicField.caSysDynamicFieldValueList
            );
            data.caSysDynamicFieldValueList.forEach((v, i) => {
              var str = "";
              if (v.value instanceof Array) {
                v.value.forEach((item, index) => {
                  str += item + ",";
                });
                v.value = str.substr(0, str.length - 1);
              }
            });
            data.caseId = _this.$route.query.caseId;
            const a = _this.$message({
              dangerouslyUseHTMLString: true,
              message:
                '<span><i class="el-icon-loading" style="font-size: 16px;margin-right: 5px"></i>正在保存中，请稍后</span>',
              center: true,
            });
            let myLoading = _this.$loading({ fullscreen: true });
            if (type == "finish") {
              data.taskId = _this.$route.query.taskId;
              data.procInsId = _this.$route.query.procInsId;
              _this
                .$post(api.authRecords + "?complete=1", data)
                .then((res) => {
                  if (res.status == 200) {
                    a.close();
                    _this.$message({
                      message: "已完成！",
                      type: "success",
                    });
                    // _this.$router.push({
                    //   path: "/mydashboard",
                    // });
                    _this.$router.go(-1); //为了保持筛选状态
                  }
                  myLoading.close();
                })
                .catch((err) => {
                  a.close();
                  _this.$message.error(
                    err.errMsg.replace("{FlowDynamicUserType}", err.extraInfo)
                  );
                  myLoading.close();
                });
            } else {
              _this
                .$post(api.authRecords, data)
                .then((res) => {
                  if (res.status == 200) {
                    a.close();
                    _this.$message({
                      message: "保存成功！",
                      type: "success",
                    });
                    if (_this.taskId) {
                      _this.init();
                    } else {
                      _this.$router.go(-1);
                    }
                  }
                  myLoading.close();
                })
                .catch((err) => {
                  a.close();
                  _this.$message.error("保存失败");
                  console.log(err);
                  myLoading.close();
                });
            }
          });
        })
        .catch(function () {});
    },
    init() {
      var dictData = {};
      dictData["page.pageSize"] = 1000;
      dictData["page.current"] = 1;
      dictData.type = "inspect_address";
      this.$get(api.dict, dictData)
        .then((res) => {
          this.addressOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$get(api.authRecords + "/" + this.caseId)
        .then((res) => {
          this.authRecordsMsg = JSON.parse(JSON.stringify(res.data));
          //是否是CNAS项目
          if (this.authRecordsMsg.isCnasItem == "Y") {
            this.isCnasItem = true;
          }
          this.professionCategoryType =
            this.authRecordsMsg.professionCategory.type.value;
          //获取专业的显示字段
          var proId = this.authRecordsMsg.professionCategory.id;
          //获取专业的显示字段
          this.selectFiled(proId);
          //酒精检验记录
          if (
            this.professionCategoryType === "POISON" &&
            res.data.authAlcoholResultList.length > 0
          ) {
            this.$nextTick(() => {
              this.$refs["alcoholResult"] &&
                this.$refs["alcoholResult"].init(this.authRecordsMsg);
            });
            if (
              res.data.authAlcoholResultList[0] &&
              this.authRecordsMsg.inputContentFlag == "0"
            ) {
              //叔丁醇
              let obj1 = {
                alcohol: res.data.authAlcoholResultList[0].alcohol1,
                tertiaryButanol:
                  res.data.authAlcoholResultList[0].tertiaryButanol1,
              };

              let obj2 = {
                alcohol: res.data.authAlcoholResultList[0].alcohol2,
                tertiaryButanol:
                  res.data.authAlcoholResultList[0].tertiaryButanol2,
              };
              this.alcoholForm.tertiaryButanolTable = [obj1, obj2];
            } else {
              if (
                res.data.authAlcoholResultList[0] &&
                res.data.authAlcoholResultList[0].content3
              ) {
                //双通道时
                let length = res.data.authAlcoholResultList.length;
                var doubleResultList1 = [];
                for (let i = 0; i < length; i++) {
                  const obj1 = Object.assign(
                    {},
                    res.data.authAlcoholResultList[i],
                    {
                      content1: res.data.authAlcoholResultList[i].content1,
                      content2: res.data.authAlcoholResultList[i].content2,
                      content3: res.data.authAlcoholResultList[i].content3,
                      content4: res.data.authAlcoholResultList[i].content4,
                      time: "第一次测试值（mg/100ml）",
                    }
                  );
                  const obj2 = Object.assign(
                    {},
                    res.data.authAlcoholResultList[i],
                    {
                      content1: res.data.authAlcoholResultList[i].content3,
                      content2: res.data.authAlcoholResultList[i].content4,
                      content3: null,
                      content4: null,
                      time: "第二次测试值（mg/100ml）",
                    }
                  );
                  doubleResultList1.push(obj1, obj2);
                }
                this.$set(
                  this.alcoholForm,
                  "doubleResultList",
                  doubleResultList1
                );
                this.path = "TWO_PATH";
              } else {
                //单通道时，
                /*  const obj1 = Object.assign({},res.data.authAlcoholResultList[0],
                                    {
                                    'content1':res.data.authAlcoholResultList[0].content1,
                                    'content2':res.data.authAlcoholResultList[0].content2,
                                    'content3':null,
                                    'content4':null,
                                    }) */
                this.$set(
                  this.alcoholForm,
                  "singleResultList",
                  res.data.authAlcoholResultList
                );
                this.alcoholForm.doubleResultList = [];
              }
            }
          }
          //获取动态字段
          if (
            !this.authRecordsMsg.caSysDynamicFieldValueList ||
            this.authRecordsMsg.caSysDynamicFieldValueList.length == 0
          ) {
            this.getDynamicField({
              target: "AUTH_RECORD",
              professionCategoryId: this.authRecordsMsg.professionCategory.id,
            });
          } else {
            //处理动态字段
            this.DynamicField.caSysDynamicFieldValueList =
              this.authRecordsMsg.caSysDynamicFieldValueList.map((v, i) => {
                if (
                  v.sysDynamicField.inputType.value == "SELECT_MULTI" ||
                  v.sysDynamicField.inputType.value == "CHECKBOX"
                ) {
                  var json = {
                    sysDynamicField: v.sysDynamicField,
                    value: [],
                  };
                  if (v.value.indexOf(",") == -1) {
                    json.value.push(v.value);
                  } else {
                    var arr = v.value.split(",");
                    json.value = [].concat(arr);
                  }
                  return json;
                } else {
                  return {
                    sysDynamicField: v.sysDynamicField,
                    value: v.value,
                  };
                }
              });
          }
          if (this.authRecordsMsg.id) {
            this.addForm.id = this.authRecordsMsg.id;
          }
          this.condition = {
            professionCategoryId: this.authRecordsMsg.professionCategory.id,
          };
          //获取委托事项类型
          if (this.authRecordsMsg.entrustingMatterList) {
            this.authRecordsMsg.entrustingMatterList.forEach((v, i) => {
              if (v.entrustingMatter) {
                this.entrustingMatterTypeList.push(
                  v.entrustingMatter.key.value
                );
              }
            });
          }
          //获取检验信息
          if (this.authRecordsMsg.authRecordInstrumentList) {
            this.addForm.authRecordInstrumentList =
              this.authRecordsMsg.authRecordInstrumentList.map((v, i) => {
                return v.instrument;
              });
          }
          this.addForm.authRecordStandardList =
            this.authRecordsMsg.authRecordStandardList.map((v, i) => {
              return v.standard;
            });

          if (this.authRecordsMsg.authDate) {
            this.checkForm.timeTable = [];
            if (this.authRecordsMsg.authDate.indexOf(",") > -1) {
              var timeArr = this.authRecordsMsg.authDate.split(",");
              timeArr.forEach((v, i) => {
                var arr = v.split("至");
                this.checkForm.timeTable.push({
                  startDate: arr[0],
                  endDate: arr[1] == "undefined" ? null : arr[1],
                });
              });
            } else {
              var arr = this.authRecordsMsg.authDate.split("至");
              this.checkForm.timeTable.push({
                startDate: arr[0],
                endDate: arr[1] == "undefined" ? null : arr[1],
              });
            }
          }
          if (
            this.authRecordsMsg.authPhotoList &&
            this.authRecordsMsg.authPhotoList.length
          ) {
            /* this.authRecordsMsg.authPhotoList.forEach((v, i) => {
                            if(!v.photo) {
                                var index = v.url.lastIndexOf('-')
                                var name = v.url.substring(index + 1);
                                var index2 = v.url.lastIndexOf('.');
                                var type = v.url.substring(index2 + 1);
                                this.photoArr[i] = {
                                    fileType: type,
                                    name: name,
                                    url: v.url
                                }
                            }else {
                                this.photoArr[i] = v
                            }
                        }) */
          }

          if (
            this.authRecordsMsg.authPhotoList &&
            this.authRecordsMsg.authPhotoList.length
          ) {
            this.photoArr = [].concat(this.authRecordsMsg.authPhotoList);
          }
          if (
            this.authRecordsMsg.authFileList &&
            this.authRecordsMsg.authFileList.length
          ) {
            this.accessoryArr = this.authRecordsMsg.authFileList.map((v, i) => {
              var index = v.url.lastIndexOf("-");
              var name = v.url.substring(index + 1);
              var index2 = v.url.lastIndexOf(".");
              var type = v.url.substring(index2 + 1);
              return {
                fileType: type,
                name: name,
                url: v.url,
              };
            });
          }
          if (this.authRecordsMsg.authAddress) {
            this.checkForm.addressTable = [];
            if (this.authRecordsMsg.authAddress.indexOf(",") > -1) {
              var addressArr = this.authRecordsMsg.authAddress.split(",");
              addressArr.forEach((v, i) => {
                this.checkForm.addressTable.push({
                  address: v,
                });
              });
            } else {
              this.checkForm.addressTable.push({
                address: this.authRecordsMsg.authAddress,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async selectFiled(proId) {
      await this.$get("/api/param/v1/params/value", {
        professionCategoryId: proId,
        key: "inspectInfo.function.show",
      })
        .then((res) => {
          if (res.status == 200) {
            this.fieldMsg = JSON.parse(JSON.stringify(res.data));
            var selectFiledArr = this.fieldMsg.split(",");
            if (selectFiledArr) {
              selectFiledArr.forEach((fv, fi) => {
                if (fv == "function.test.time") {
                  this.functionTestTime = true;
                } else if (fv == "function.test.site") {
                  this.functionTestSite = true;
                } else if (fv == "function.test.equipment") {
                  this.functionTestEquipment = true;
                } else if (fv == "dna.test.result") {
                  this.dnaTestResult = true;
                } else if (fv == "alcohol.test.record") {
                  this.alcoholTestRecord = true;
                } else if (fv == "poison.test.result") {
                  this.poisonTestResult = true;
                } else if (fv == "inspectInfo.test.record") {
                  this.inspectInfoTestRecord = true;
                } else if (fv == "test.photo") {
                  this.testPhoto = true;
                } else if (fv == "file.inspectInfo.test.record") {
                  this.fileInspectInfoTestRecord = true;
                } else if (fv == "function.test.method") {
                  this.functionTestMethod = true;
                }
              });
            }
            if (!this.functionTestTime && !this.functionTestSite) {
              this.functionTestInfo = false;
            }
          }
        })
        .catch((err) => console.log(err));
    },
  },

  created() {
    this.$store.dispatch("login/headerTitleChange", "鉴定记录");
    this.caseId = this.$route.query.caseId;
    this.taskId = this.$route.query.taskId;
    this.init();
  },
};
</script>

<style scoped lang="less">
.jyinfo {
  /deep/ .el-form-item__content {
    height: 52px;
  }
  /deep/ .el-form-item__error {
    position: absolute;
    top: 34px;
  }
}
</style>
