<template>
  <div>
    <!-- <PageBar title1="业务流程" :title2="title"></PageBar> -->
    <el-form
      ref="mainProcess"
      label-width="130px"
      size="small"
      :model="acceptForm"
      class="demo-ruleForm"
      label-position="right"
    >
      <BasicMsg
        ref="basicMsgInfo"
        :is-disabled.sync="professionDisabled"
      ></BasicMsg>

      <!--动态字段-->
      <Dynamicfield
        ref="dynamicfield"
        :model.sync="DynamicField"
      ></Dynamicfield>

      <!--鉴定对象-->
      <div v-if="basicMsg.professionCategory">
        <AnthenticatedTarget
          ref="anthenticatedTargetInfo"
          v-show="
            basicMsg.professionCategory.type.value == 'GENERAL' ||
            basicMsg.professionCategory.type.value == 'TRACE'
          "
        ></AnthenticatedTarget>
      </div>

      <!--检材样本-->
      <div v-if="basicMsg.professionCategory">
        <CaSample
          ref="caSample"
          v-show="
            basicMsg.professionCategory.type.value == 'DOCUMENT' ||
            basicMsg.professionCategory.type.value == 'ELECTRONIC' ||
            basicMsg.professionCategory.type.value == 'TRACE_EVIDENCE' ||
            basicMsg.professionCategory.type.value == 'ACOUSTIC_IMAGE'
          "
        ></CaSample>
      </div>

      <!--物证样本-->
      <div v-if="basicMsg.professionCategory">
        <DnaInfo
          ref="dnaInfo"
          v-show="basicMsg.professionCategory.type.value == 'DNA'"
        ></DnaInfo>
      </div>
      <!--毒物样本-->
      <div v-if="basicMsg.professionCategory">
        <PoisonInfo
          ref="poisonInfo"
          v-show="basicMsg.professionCategory.type.value == 'POISON'"
        ></PoisonInfo>
      </div>
      <!--委托事项-->
      <EntrustingAuthItem v-show="!isCnasItemY" ref="entrustingAuthItemInfo" />
      <!-- cnas事项 -->
      <CnasItem ref="CnasItemCom" v-show="isCnasItemY" />
      <!--收费项目-->
      <ChargeItem
        :isEdit="isEdit"
        ref="chargeItemInfo"
        :isAbled="isAbled"
        :hasInvoiced="hasInvoiced"
      ></ChargeItem>
      <!--鉴定材料-->
      <AuthMaterial ref="authMaterialInfo"></AuthMaterial>
      <!--发放信息-->
      <Collapse title="发放信息" :active="true">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl" style="margin-right:10px;">
            <el-form-item label="送达方式">
              <select-from-enum
                className="w100"
                :model.sync="acceptForm.giveInfo.giveType"
                type="ca.GiveType"
              ></select-from-enum>
            </el-form-item>
          </el-col>
          <el-col
            :sm="panClass.sm"
            :md="panClass.md"
            :xl="panClass.xl"
            v-if="
              acceptForm.giveInfo.giveType &&
              acceptForm.giveInfo.giveType.value == 'SELF_PICK'
            "
          >
            <el-form-item label-width="0">
              <el-checkbox-group v-model="acceptForm.giveInfo.credentialList">
                <el-checkbox label="CONTRACT">合同副本</el-checkbox>
                <el-checkbox label="INVOICE">票据</el-checkbox>
                <el-checkbox label="ID_CARD">身份证</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            acceptForm.giveInfo.giveType &&
            acceptForm.giveInfo.giveType.value == 'POST'
          "
        >
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="邮寄单位">
              <el-input v-model="acceptForm.giveInfo.postUnit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="收件人">
              <el-input v-model="acceptForm.giveInfo.consignee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="收件人电话">
              <el-input
                v-model="acceptForm.giveInfo.postRecipientPhone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            acceptForm.giveInfo.giveType &&
            acceptForm.giveInfo.giveType.value == 'SEND'
          "
        >
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="送达地址">
              <el-input v-model="acceptForm.giveInfo.sendAddress"></el-input>
            </el-form-item>
            <!-- <el-form-item label="证件类型">
              <select-from-enum
                className="w100"
                :model.sync="acceptForm.giveInfo.giveType"
                type="ca.GiveType"
              ></select-from-enum>
            </el-form-item> -->
            <!-- <el-form-item label="联系电话">
              <el-input v-model="acceptForm.giveInfo.sendAddress"></el-input>
            </el-form-item> -->
          </el-col>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="领取（接收）人">
              <el-input v-model="acceptForm.giveInfo.consignee"></el-input>
            </el-form-item>
            <!-- <el-form-item label="证件号码">
              <el-input v-model="acceptForm.giveInfo.sendAddress"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="联系地址">
              <el-input v-model="acceptForm.giveInfo.sendAddress"></el-input>
            </el-form-item> -->
          </el-col>
        </el-row>
      </Collapse>
      <div class="footer">
        <el-button
          type="success"
          size="mini"
          class="save-btn"
          @click="save()"
          :disabled="btnDisabled"
          ><i class="fa fa-save"></i> 保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Collapse from "../../layout/Collapse";

import AnthenticatedTarget from "./AnthenticatedTarget";
import CaSample from "./CaSample";
import DnaInfo from "./DnaInfo";
import PoisonInfo from "./PoisonInfo";

import EntrustingAuthItem from "./EntrustingAuthItem";
import ChargeItem from "./ChargeItem";
import AuthMaterial from "./AuthMaterial";
import BasicMsg from "./BasicMsg";

import api from "../../../api/index";
import Dynamicfield from "../../../components/common/Dynamicfield";
import CnasItem from "./Module/CnasItem.vue";

export default {
  name: "MainPage",
  components: {
    Collapse: Collapse,
    BasicMsg: BasicMsg,
    AnthenticatedTarget: AnthenticatedTarget,
    CaSample: CaSample,
    DnaInfo: DnaInfo,
    PoisonInfo: PoisonInfo,
    EntrustingAuthItem: EntrustingAuthItem,
    ChargeItem: ChargeItem,
    AuthMaterial: AuthMaterial,
    Dynamicfield: Dynamicfield,
    CnasItem,
  },
  data() {
    return {
      acceptForm: { giveInfo: { credentialList: [] } },
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      btnDisabled: false,
      title: "登记",
      professionDisabled: false,
      DynamicField: { caSysDynamicFieldValueList: [] },
      isEdit: false, //判断该案件是否收费了
      isAbled: false,
      hasInvoiced: false, //判断该案件是否开票了
    };
  },
  methods: {
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
                return { sysDynamicField: v, value: [] };
              } else {
                return { sysDynamicField: v, value: "" };
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    findArrFn(arr, id) {
      let brun = false;
      arr.forEach((v, i) => {
        if (v.cnasItem.id === id) {
          brun = i;
          return false;
        }
      });
      return brun;
    },
    save() {
      this.btnDisabled = true;
      var _this = this;
      let { $message } = this;
      setTimeout(function () {
        _this.btnDisabled = false;
      }, 10000);
      var validateArr = [];
      for (var key in _this.$refs) {
        if (_this.$refs[key] != undefined && _this.$refs[key].$refs.form) {
          let p = new Promise(function (resolve, reject) {
            _this.$refs[key].$refs.form.validate((valid) => {
              if (valid) {
                resolve();
              } else {
                reject();
              }
            });
          });
          validateArr.push(p);
        }
      }
      Promise.all(validateArr)
        .then(async (res) => {
          //鉴定对象鉴定材料合集
          var authenticatedTarget = {
            ...this.$store.state.register.anthenticatedTargetMsg,
            ...this.$store.state.register.caSampleMsg,
            ...this.$store.state.register.poisonSampleMsg,
            ...this.$store.state.register.dnaSampleMsg,
            ...this.$store.state.register.materialNormal,
          };
          var acceptCaseData = { ...this.$store.state.register };
          var data = {};
          for (var key in acceptCaseData) {
            if (key != "status") {
              this._.assign(data, { ...acceptCaseData[key] });
            }
          }
          this._.assign(data, { ...this.acceptForm });
          //鉴定历史
          if (data.authHistoryList) {
            data.authHistoryList.forEach((v, i) => {
              if (v.authHistoryAuthenticatorList) {
                v.authHistoryAuthenticatorList =
                  v.authHistoryAuthenticatorList.map((v1, i1) => {
                    return { authenticator: { id: v1 } };
                  });
              }
            });
            try {
              for (let i = 0; i < data.authHistoryList.length; i++) {
                let arr = [];
                if (typeof data.authHistoryList[i].files === "object") {
                  for (
                    let j = 0;
                    j < data.authHistoryList[i].files.length;
                    j++
                  ) {
                    if (data.authHistoryList[i].files[j].raw) {
                      arr.push({
                        base64Str: await this.$getBase64(
                          data.authHistoryList[i].files[j].raw
                        ),
                        name: data.authHistoryList[i].files[j].name,
                        fileType:
                          data.authHistoryList[i].files[j].name.split(".")[1],
                      });
                    } else {
                      arr.push(data.authHistoryList[i].files[j]);
                    }
                  }
                }
                data.authHistoryList[i].files = [...arr];
                arr = null;
              }
            } catch (err) {
              console.log("报错了", err);
            }
          }
          data = JSON.parse(JSON.stringify(data));
          data.authenticatorList = [];
          var auth1Toauth5List = [];
          for (var key in data.authenticator) {
            if (key.toUpperCase() != "LAB_STAFF") {
              data.authenticatorList.push({
                participant: {
                  id: data.authenticator[key],
                },
                caseRole: key.toUpperCase(),
              });
            } else {
              data.authenticator[key].map((item) => {
                data.authenticatorList.push({
                  participant: {
                    id: item,
                  },
                  caseRole: key.toUpperCase(),
                });
              });
            }
            if (
              key.toUpperCase() == "AUTH1" ||
              key.toUpperCase() == "AUTH2" ||
              key.toUpperCase() == "AUTH3" ||
              key.toUpperCase() == "AUTH4" ||
              key.toUpperCase() == "AUTH5"
            ) {
              if (data.authenticator[key]) {
                auth1Toauth5List.push(data.authenticator[key]);
              }
            }
          }
          delete data.authenticator;
          //第一鉴定人到第五鉴定人不能重复
          var repetitionBl = this.judgeRepetitionAuth(auth1Toauth5List);
          if (repetitionBl) {
            this.$message.error("第一鉴定人到第五鉴定人不可重复！");
            return;
          }
          var errEessageEm = "";
          data.entrustingMatterList.forEach((v, i) => {
            v.entrustingMatterStandardList = v.entrustingMatterStandardList.map(
              (value, item) => {
                return { ...value, ...{ standard: value } };
              }
            );
            if (data.professionCategory.type.value == "DNA") {
              errEessageEm = this.judgeDnaRealtion(
                v,
                data.dnaSampleList,
                false
              );
            }
          });
          if (errEessageEm) {
            this.$message.error(errEessageEm);
            return;
          }
          data.chargingItemList.forEach((v, i) => {
            v.unitPrice = { cent: (v.unitPrice * 100).toFixed(0) };
          });
          data.dnaSampleList.forEach((v, i) => {
            v.dnaSampleTypeList = v.dnaSampleTypeList.map((value, item) => {
              return { ...value, ...{ dnaSampleType: value } };
            });
          });
          if (data.caseWithdrawalList && data.caseWithdrawalList.length) {
            data.caseWithdrawalList = data.caseWithdrawalList.map((v, i) => {
              return { withdrawal: v };
            });
          }
          //鉴定材料及鉴定对象图片压缩
          var authenticatedTargetPromise = [];
          for (let key in authenticatedTarget) {
            if (authenticatedTarget[key]) {
              authenticatedTarget[key].forEach((v, i) => {
                if (v.images && v.images.length) {
                  let p = new Promise((resolve, reject) => {
                    this.$compressImages(v.images).then((res) => {
                      data[key][i].images = res;
                      resolve();
                    });
                  });
                  authenticatedTargetPromise.push(p);
                }
              });
            }
          }
          Promise.all(authenticatedTargetPromise)
            .then((res) => {
              var status = "REGISTER";
              if (this.$route.query.status == "CASE_COPY") {
                status = "CASE_COPY";
              } else if (this.$route.query.status == "REGISTER_EDIT") {
                status = "REGISTER_EDIT";
              }

              if (data.professionCategory.type.value === "DNA") {
                //物证样本
                if (data.dnaSampleList.length === 0) {
                  $message.error("请增加物证样本!");
                  return;
                }
              } else if (data.professionCategory.type.value === "POISON") {
                //毒物
                if (data.poSampleList.length === 0) {
                  $message.error("请增加毒物样本!");
                  return;
                }
              } else if (
                data.professionCategory.type.value === "DOCUMENT" ||
                data.professionCategory.type.value === "ELECTRONIC" ||
                data.professionCategory.type.value === "TRACE_EVIDENCE" ||
                data.professionCategory.type.value === "ACOUSTIC_IMAGE"
              ) {
                if (data.caSampleList.length === 0) {
                  $message.error("请增加检材样本!");
                  return;
                }
              } else {
                //判断是否有鉴定对象
                if (
                  data.authenticatedVehicleList.length > 0 ||
                  data.authenticatedPersonList.length > 0 ||
                  data.authenticatedOtherList.length > 0
                ) {
                } else {
                  $message.error("请增加鉴定对象!");
                  return;
                }
              }
              if (this.basicMsg.entrustInfo.isCnasItem === "Y") {
                if (
                  !this.CNASItem.CNASItemList ||
                  this.CNASItem.CNASItemList.length === 0
                ) {
                  $message.error("请导入CNAS/CMA项目!");
                  return;
                }
              } else {
                if (
                  !data.entrustingMatterList ||
                  data.entrustingMatterList.length === 0
                ) {
                  $message.error("请导入委托鉴定事项!");
                  return;
                } //判断是否有 委托鉴定事项
              }
              if (
                !data.chargingItemList ||
                data.chargingItemList.length === 0
              ) {
                $message.error("请导入收费项目!");
                return;
              } //判断是否有 收费项目
              if (data.entrustInfo.materialAllReady == "N") {
                if (
                  !data.inspectionMaterialListWaitingSend ||
                  data.inspectionMaterialListWaitingSend.length === 0
                ) {
                  $message.error("请导入或增加待补充鉴定材料!");
                  return;
                }
              }
              //CNAS选择的是Y
              var errEessage = "";
              if (this.basicMsg.entrustInfo.isCnasItem === "Y") {
                let jsonArr = JSON.parse(
                  JSON.stringify(this.CNASItem.CNASItemList)
                );
                let arr = [];
                jsonArr.forEach((v, i) => {
                  let index = this.findArrFn(arr, v.id);
                  if (index !== false) {
                    //重
                    arr[index].entrustingMatterList.push({
                      entrustingMatter: {
                        id: v.entrustingId,
                        name: v.entrustingName,
                        key: v.entrustingKey,
                      },
                      description: "",
                      poSampleResultList: v.poSampleResultList || [], //选择的毒物  ok
                      entrustingMatterTargetList:
                        v.entrustingMatterTargetList || [],
                    });
                  } else {
                    //没重
                    arr.push({
                      standardList: v.standardList || [], //CNAS关联的标准  ok
                      cnasItem: {
                        id: v.cnasId,
                        name: v.name,
                      },
                      entrustingMatterList: [
                        {
                          entrustingMatter: {
                            id: v.entrustingId,
                            name: v.entrustingName,
                            key: v.entrustingKey,
                          },
                          description: "",
                          poSampleResultList: v.poSampleResultList || [], //选择的毒物  ok
                          entrustingMatterTargetList:
                            v.entrustingMatterTargetList || [], //委托事项对应的被鉴定对象或样本  ok
                        },
                      ], //委托事项   ok
                    });
                  }
                  if (data.professionCategory.type.value == "DNA") {
                    errEessage = this.judgeDnaRealtion(
                      v,
                      data.dnaSampleList,
                      true
                    );
                  }
                });
                data.cnasItemList = arr;
                delete data.CNASItemList;
              }
              if (errEessage) {
                this.$message.error(errEessage);
                return;
              }
              let loadingInstance = this.$loading({ fullscreen: true });
              this.$post(api.caCase + "/" + status, data)
                .then((res) => {
                  loadingInstance.close();
                  if (res.status == 200) {
                    this.$message({
                      message: this.title + "成功！",
                      type: "success",
                    });
                    this.$router.push({
                      path: "/case/case-list",
                    });
                  }
                })
                .catch((err) => {
                  loadingInstance.close();
                  $message.error(err.errMsg);
                  console.log(err);
                });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log("发生了错误", err);
          $message.error("请填写所有必填项!");
          setTimeout(() => {
            var isError = document.getElementsByClassName("is-error");
            isError[0].querySelectorAll("input,textarea")[0].focus();
          }, 100);
          return false;
        });
    },
    judgeRepetitionAuth(data) {
      for (let i = 0; i < data.length; i++) {
        var repetitionTime = 0;
        var authId = data[i];
        for (let j = 0; j < data.length; j++) {
          if (authId == data[j]) {
            repetitionTime++;
          }
        }
        if (repetitionTime >= 2) {
          return true;
        }
      }
    },
    judgeDnaRealtion(em, dnaSampleList, isCnasItem) {
      var errEessage = "";
      var checkedDnaSample = [];
      var matterType = isCnasItem
        ? em.entrustingKey.value
        : em.entrustingMatter.key.value;
      var matterName = isCnasItem
        ? em.entrustingName
        : em.entrustingMatter.name;
      em.entrustingMatterTargetList.forEach((v, i) => {
        dnaSampleList.forEach((v2, i2) => {
          if (v2.name == v.name) {
            checkedDnaSample.push(v2);
          }
        });
      });
      if (
        matterType == "DIAD" ||
        matterType == "FULLSIBS" ||
        matterType == "HALFSIBS" ||
        matterType == "NEPHEWUNCLE" ||
        matterType == "IDENTICAL"
      ) {
        var lengnth = checkedDnaSample.length;
        if (lengnth != 2) {
          errEessage = matterName + "中只能选择2个样本！";
          return errEessage;
        }
      }
      if (matterType == "DIAD") {
        var fatherAndmotherNum = 0;
        var childNum = 0;
        checkedDnaSample.forEach((v, i) => {
          var relationFm = v.dnaSampleRelation.sampleRelationType.value;
          if (relationFm == "FATHER" || relationFm == "MOTHER") {
            fatherAndmotherNum++;
          } else if (relationFm == "SON" || relationFm == "DAUGHTER") {
            childNum++;
          }
        });
        if (fatherAndmotherNum < 1) {
          errEessage = matterName + "中至少需要选择一个父亲或母亲！";
          return errEessage;
        } else if (childNum != 1) {
          errEessage = matterName + "中需要选择一个儿子或女儿！";
          return errEessage;
        }
      } else if (matterType == "TRIPLET") {
        var lengnth = checkedDnaSample.length;
        if (lengnth != 3) {
          errEessage = matterName + "中只能选择3个样本！";
          return errEessage;
        }
        var fatherAndmotherNum = 0;
        var childNum = 0;
        checkedDnaSample.forEach((v, i) => {
          var relationFm = v.dnaSampleRelation.sampleRelationType.value;
          if (relationFm == "FATHER" || relationFm == "MOTHER") {
            fatherAndmotherNum++;
          } else if (relationFm == "SON" || relationFm == "DAUGHTER") {
            childNum++;
          }
        });
        if (fatherAndmotherNum < 2) {
          errEessage = matterName + "中至少需要选择一个父亲和一个母亲！";
          return errEessage;
        } else if (childNum != 1) {
          errEessage = matterName + "中需要选择一个儿子或女儿！";
          return errEessage;
        }
      } else if (matterType == "FULLSIBS" || matterType == "HALFSIBS") {
        var compatriotsNum = 0;
        checkedDnaSample.forEach((v, i) => {
          var relationFm = v.dnaSampleRelation.sampleRelationType.value;
          if (
            relationFm == "ELDERBROTHER" ||
            relationFm == "YOUNGERBROTHER" ||
            relationFm == "ELDERSISTER" ||
            relationFm == "OUNGERSISTER"
          ) {
            compatriotsNum++;
          }
        });
        if (compatriotsNum != 2) {
          errEessage = matterName + "中只能选择哥弟姐妹！";
          return errEessage;
        }
      } else if (matterType == "NEPHEWUNCLE") {
        var uncleNum = 0;
        var childNum = 0;
        checkedDnaSample.forEach((v, i) => {
          var relationFm = v.dnaSampleRelation.sampleRelationType.value;
          if (relationFm == "UNCLE" || relationFm == "AUNT") {
            uncleNum++;
          } else if (relationFm == "NEPHEW" || relationFm == "NIECE") {
            childNum++;
          }
        });
        if (uncleNum == 0) {
          errEessage = matterName + "中至少需要选择一个叔叔或阿姨！";
          return errEessage;
        } else if (childNum == 0) {
          errEessage = matterName + "中至少需要选择一个侄儿或侄女！";
          return errEessage;
        }
      }
    },
  },
  watch: {
    "basicMsg.professionCategory.id": {
      handler(newVal, oldVal) {
        if (!this.$route.query.caseId) {
          if (newVal && oldVal) {
            if (newVal != oldVal) {
              this.getDynamicField({
                target: "CASE_FORM",
                professionCategoryId: newVal,
              });
            }
          }
          if (newVal && !oldVal) {
            this.getDynamicField({
              target: "CASE_FORM",
              professionCategoryId: newVal,
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
    "acceptForm.giveInfo.giveType.value": {
      handler(newVal, oldVal) {
        if (oldVal) {
          var id = this.acceptForm.giveInfo.id;
          this.acceptForm.giveInfo = {
            id: id,
            giveType: { value: newVal },
            credentialList: [],
          };
        }
      },
      immediate: true,
    },
  },
  async created() {
    if (!this.$route.query.caseId) {
      //如果是登记，则给发放信息默认值
      Object.assign(this.acceptForm, {
        giveInfo: { giveType: { value: "SELF_PICK" }, credentialList: [] },
      });
    }
    //获取是否收费了
    if (this.$route.query.caseId) {
      try {
        let res = await this.$get(
          `${api.isHasChargeApi}/${this.$route.query.caseId}`
        );
        if (this.$route.query.status !== "CASE_COPY") {
          res.data.amountReceived.cent > 0
            ? (this.isEdit = true)
            : (this.isEdit = false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    let that = this;
    if (this.$route.query.caseId) {
      this.professionDisabled = true;
      if (this.$route.query.status == "CASE_COPY") {
        this.title = "案件复制";
      } else {
        this.title = "案件编辑";
      }
      this.$store.commit("register/changePageStatus", this.$route.query.status);
      this.$get(api.caCase + "/" + this.$route.query.caseId)
        .then((res) => {
          if (res.status == 200) {
            var echoData = JSON.parse(JSON.stringify(res.data));
            console.warn(echoData, "回显数据");
            if (echoData.chargeType == "0") {
              this.isAbled = false;
            } else {
              this.isAbled = true;
            }

            if (echoData.invoiceType == "0") {
              this.hasInvoiced = false;
            } else {
              this.hasInvoiced = true;
            }
            //处理鉴定人数据
            var roleData = {};
            echoData.authenticatorList.forEach((v, i) => {
              var key = v.caseRole.value.toLowerCase();
              if (key.toUpperCase() == "LAB_STAFF") {
                if (!roleData.lab_staff) roleData.lab_staff = [];
                roleData.lab_staff.push(v.participant.id);
              } else {
                roleData[key] = v.participant.id;
              }
            });
            //处理鉴定历史
            if (echoData.authHistoryList) {
              echoData.authHistoryList.forEach((v, i) => {
                for (let i = 0; i < v.files.length; i++) {
                  v.files[i].name = `附件${i + 1}`;
                }
                v.authHistoryAuthenticatorList =
                  v.authHistoryAuthenticatorList.map((v1, i1) => {
                    return v1.authenticator.id;
                  });
              });
            }
            this.$store
              .dispatch("register/changeCNAS", {
                cnasItemList: [],
              })
              .then(() => {
                let data = [];
                if (echoData.cnasItemList) {
                  echoData.cnasItemList.forEach((v) => {
                    v.entrustingMatterList.forEach((item) => {
                      data.push({
                        id: v.id, //案件cans id
                        cnasId: v.cnasItem.id,
                        name: v.cnasItem.name,
                        standardList: v.standardList || [],
                        entrustingId: item.entrustingMatter.id,
                        entrustingSqlId: item.id,
                        entrustingMatterTargetList:
                          item.entrustingMatterTargetList || [],
                        entrustingName: item.entrustingMatter.name,
                        poSampleResultList: item.poSampleResultList || [],
                      });
                    });
                  });
                  that.$refs.CnasItemCom.init(data);
                  data = null;
                }
              });
            echoData.authenticator = {};
            this._.assign(echoData.authenticator, { ...roleData });

            echoData.entrustingMatterList.forEach((v, i) => {
              v.entrustingMatterStandardList =
                v.entrustingMatterStandardList.map((value, item) => {
                  return value.standard;
                });
            });
            echoData.chargingItemList.forEach((v, i) => {
              v.unitPrice = v.unitPrice.cent / 100;
            });
            echoData.caSampleList.forEach((v, i) => {
              v.oldName = v.name;
            });
            echoData.dnaSampleList.forEach((v, i) => {
              if (this.$route.query.status == "CASE_COPY") {
                v.sampleNo = "";
              }
              if (v.dnaSampleRelation) {
                v.dnaSampleRelation.label = v.dnaSampleRelation.name;
              }
              v.oldName = v.name;
              v.dnaSampleTypeList = v.dnaSampleTypeList.map((value, item) => {
                return value.dnaSampleType;
              });
            });
            echoData.poSampleList.forEach((v, i) => {
              if (this.$route.query.status == "CASE_COPY") {
                v.sampleNo = "";
              }
              v.oldName = v.authPersonName;
            });
            echoData.authenticatedVehicleList.forEach((v, i) => {
              v.oldName = v.plateNumber;
            });
            echoData.authenticatedPersonList.forEach((v, i) => {
              v.oldName = v.name;
            });
            echoData.authenticatedOtherList.forEach((v, i) => {
              v.oldName = v.name;
            });
            echoData.caseWithdrawalList = echoData.caseWithdrawalList.map(
              (v, i) => {
                return v.withdrawal;
              }
            );
            if (!echoData.entrustInfo) {
              echoData.entrustInfo = {
                contact: {},
                entrustingUnit: {},
                statisticsType: {},
              };
            }
            if (!echoData.entrustInfo.contact) {
              echoData.entrustInfo.contact = {};
            }
            if (!echoData.entrustInfo.entrustingUnit) {
              echoData.entrustInfo.entrustingUnit = {};
            }
            if (!echoData.entrustInfo.statisticsType) {
              echoData.entrustInfo.statisticsType = {};
            }
            this.$store.commit("register/changeCaSampleMsg", {
              caSampleList: echoData.caSampleList,
            });
            this.$store.commit("register/changeDnaSampleMsg", {
              dnaSampleList: echoData.dnaSampleList,
            });
            this.$store.commit("register/changePoisonSampleMsg", {
              poSampleList: echoData.poSampleList,
            });
            this.$store.commit("register/changeAnthenticatedTargetMsg", {
              authenticatedVehicleList: echoData.authenticatedVehicleList,
              authenticatedPersonList: echoData.authenticatedPersonList,
              authenticatedOtherList: echoData.authenticatedOtherList,
            });
            if (this.isEdit === true) {
              echoData.entrustingMatterList.forEach((item, index) => {
                item.isOldVal = true; //是否是旧的委托事项数据
              });
            }
            this.$store.commit("register/changeEntrustingAuthItem", {
              entrustingMatterList: echoData.entrustingMatterList,
            });
            this.$store.commit("register/changeChargeItem", {
              chargingItemList: echoData.chargingItemList,
            });
            this.$store.commit("register/changeMaterialNormal", {
              inspectionMaterialListNormal:
                echoData.inspectionMaterialListNormal,
              inspectionMaterialListWaitingSend:
                echoData.inspectionMaterialListWaitingSend,
            });
            //处理发放信息
            if (echoData.giveInfo && echoData.giveInfo.credentials) {
              echoData.giveInfo.credentialList =
                echoData.giveInfo.credentials.split(",");
            }
            this.acceptForm.giveInfo = echoData.giveInfo;
            //处理动态字段
            this.DynamicField.caSysDynamicFieldValueList =
              echoData.caSysDynamicFieldValueList.map((v, i) => {
                if (
                  v.sysDynamicField.inputType.value == "SELECT_MULTI" ||
                  v.sysDynamicField.inputType.value == "CHECKBOX"
                ) {
                  var json = { sysDynamicField: v.sysDynamicField, value: [] };
                  if (v.value.indexOf(",") == -1) {
                    json.value.push(v.value);
                  } else {
                    var arr = v.value.split(",");
                    json.value = [].concat(arr);
                  }
                  return json;
                } else {
                  return { sysDynamicField: v.sysDynamicField, value: v.value };
                }
              });
            if (this.$route.query.status === "CASE_COPY") {
              //案件复制时，把最新的的动态字段渲染出来，旧的动态字段的value赋给新的动态字段。
              this.$get(api.dynamicFields, {
                target: "CASE_FORM",
                professionCategoryId: echoData.professionCategory.id,
              })
                .then((res) => {
                  let arr = [];
                  let finalList = [];
                  res.data.forEach((v, i) => {
                    finalList = [...finalList, ...v.list];
                  });
                  arr = finalList.map((v, i) => {
                    if (
                      v.inputType.value == "SELECT_MULTI" ||
                      v.inputType.value == "CHECKBOX"
                    ) {
                      return { sysDynamicField: v, value: [] };
                    } else {
                      return { sysDynamicField: v, value: "" };
                    }
                  });
                  arr.forEach((item) => {
                    this.DynamicField.caSysDynamicFieldValueList.forEach(
                      (v) => {
                        if (item.sysDynamicField.id == v.sysDynamicField.id) {
                          item.value = v.value;
                        }
                      }
                    );
                  });
                  this.DynamicField.caSysDynamicFieldValueList = arr;
                })
                .catch((err) => console.log(err));
            }
            var basicMsg = { ...echoData };
            basicMsg.entrustInfo.entrustingPartyType =
              basicMsg.entrustInfo.entrustingPartyType.value;
            basicMsg.entrustInfo.contact.name =
              basicMsg.entrustInfo.contact.name;
            delete basicMsg.caSampleList;
            delete basicMsg.dnaSampleList;
            delete basicMsg.poSampleList;
            delete basicMsg.authenticatedVehicleList;
            delete basicMsg.authenticatedPersonList;
            delete basicMsg.authenticatedOtherList;
            delete basicMsg.entrustingMatterList;
            delete basicMsg.chargingItemList;
            delete basicMsg.inspectionMaterialListNormal;
            delete basicMsg.inspectionMaterialListWaitingSend;
            delete basicMsg.giveInfo;
            delete basicMsg.caSysDynamicFieldValueList;
            this.$store.commit("register/changeBasicMsg", basicMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.$store.dispatch("login/headerTitleChange", this.title);
  },
  computed: {
    ...mapState("register", {
      basicMsg: "basicMsg",
      status: "status",
      CNASItem: "CNASItem",
    }),
    //是否CNAS 选择Y
    isCnasItemY: function () {
      if (
        this.basicMsg.entrustInfo.isCnasItem &&
        this.basicMsg.entrustInfo.isCnasItem !== "Y"
      ) {
        this.$store.dispatch("register/changeCNAS", { CNASItemList: [] });
      }
      return this.basicMsg.entrustInfo.isCnasItem &&
        this.basicMsg.entrustInfo.isCnasItem === "Y"
        ? true
        : false;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/case/register") {
      this.title = "案件登记";
      this.$store.commit("register/changePageStatus", "REGISTER");
      for (var key in this.$refs) {
        if (this.$refs[key].$refs.form) {
          this.$refs[key].$refs.form.resetFields();
        }
      }
    }
    if (this.$route.query.caseId) {
      this.$store.commit("register/changeBasicMsg", {
        authHistoryList: [],
        authenticatorList: [],
        professionCategory: this.basicMsg.professionCategory,
        entrustInfo: { contact: {}, entrustingUnit: {}, statisticsType: {} },
        authenticator: {},
      });
      this.$store.commit("register/changeAnthenticatedTargetMsg", {
        authenticatedVehicleList: [],
        authenticatedPersonList: [],
        authenticatedOtherList: [],
      });
      this.$store.commit("register/changeDnaSampleMsg", {
        dnaSampleList: [],
      });
      this.$store.commit("register/changePoisonSampleMsg", {
        poSampleList: [],
      });
      this.$store.commit("register/changeEntrustingAuthItem", {
        entrustingMatterList: [],
      });
      this.$store.commit("register/changeChargeItem", {
        chargingItemList: [],
      });
      this.$store.commit("register/changeMaterialNormal", {
        inspectionMaterialListNormal: [],
        inspectionMaterialListWaitingSend: [],
      });
    }
    next();
  },
};
</script>

<style scoped lang="less">
.footer {
  height: 50px;
  width: 100px;
  text-align: center;
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.5);
  text-align: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  line-height: 45px;
  z-index: 999;
}
</style>