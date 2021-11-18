<template>
  <div>
    <Portlet title="委托事项" :isKey="true">
      <template
        slot="buttonGroup"
        v-if="
          basicMsg.professionCategory &&
          basicMsg.professionCategory.type &&
          basicMsg.professionCategory.type.value != 'DNA'
        "
      >
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="importEntrustMatter()"
          >导入
        </el-button>
      </template>
      <template
        slot="buttonGroup"
        v-if="
          basicMsg.professionCategory &&
          basicMsg.professionCategory.type &&
          basicMsg.professionCategory.type.value == 'DNA'
        "
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="addEntrustMatterAndSample()"
          >增加
        </el-button>
      </template>

      <template slot="body">
        <el-form
          ref="form"
          label-width="0px"
          size="small"
          :model="acceptForm"
          class="demo-ruleForm"
        >
          <el-table
            :data="acceptForm.entrustingMatterList"
            stripe
            fit
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="entrustingMatter.name" label="委托事项">
            </el-table-column>
            <el-table-column prop="entrustingSubMatterName" label="细项">
            </el-table-column>
            <el-table-column
              prop="entrustingMatterTargetList"
              label="被鉴定对象/样本"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.entrustingMatterTargetList">
                  {{ transform(scope.row.entrustingMatterTargetList) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述">
              <!-- <template slot="header" slot-scope="{ column, $index }"> -->
              <template slot="header">
                <!-- <i style="color: red;margin-right: 5px">*</i> -->
                <span>描述</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'entrustingMatterList.' + scope.$index + '.description'
                  "
                >
                  <el-input v-model="scope.row.description"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" width="150px" label="数量">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'entrustingMatterList.' + scope.$index + '.quantity'"
                >
                  <el-input-number
                    size="small"
                    v-model="scope.row.quantity"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustingMatterStandardList"
              width="216px"
              label="检验标准"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'entrustingMatterList.' +
                    scope.$index +
                    '.entrustingMatterStandardList'
                  "
                >
                  <select-from-table
                    :className="'w100 customSlecte'"
                    :model.sync="scope.row.entrustingMatterStandardList"
                    port="standard"
                    :condition="condition"
                    :multiple="true"
                    :clearable="true"
                  ></select-from-table>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="importObj(scope.$index, scope.row)"
                  v-if="basicMsg.professionCategory.type.value != 'DNA'"
                >
                  导入被鉴定对象
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="importPoison(scope.$index, scope.row)"
                  v-if="basicMsg.professionCategory.type.value == 'POISON'"
                >
                  增加毒物物品
                </el-button>
                <el-button
                  :disabled="scope.row.isOldVal"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteMatterRow(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </Portlet>

    <!--导入委托鉴定事项-->
    <el-dialog
      title="导入委托鉴定事项"
      :visible.sync="importEntrustMatterDialog"
    >
      <el-table
        ref="entrust"
        :data="EntrustArr"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
        @select="importEntrustSelectionChange"
        @select-all="importEntrustSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="name" label="鉴定项目"> </el-table-column>
        <el-table-column prop="entrustingSubMatter.name" label="细项">
        </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div class="pagination-footer">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="EntrustArr"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            port="entrustingMatterList"
          ></pagination>
        </div>
        <el-button @click="importEntrustMatterDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmImportEntrust()" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--物证添加委托鉴定事项和样本关系-->
    <el-dialog
      title="增加委托鉴定事项"
      :visible.sync="addEntrustMatterAndSampleDialog"
      :before-close="closeDnaSampleDialog"
    >
      <Collapse title="委托事项" :active="true">
        <el-table
          :data="EntrustArr"
          tooltip-effect="dark"
          stripe
          border
          size="mini"
          style="width: 100%"
          @selection-change="addEntrustSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="name" label="鉴定项目"> </el-table-column>
          <el-table-column prop="entrustingSubMatter.name" label="细项">
          </el-table-column>
          <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div style="margin-top: 5px; margin-bottom: 5px">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="EntrustArr"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            port="entrustingMatterList"
          ></pagination>
        </div>
      </Collapse>
      <Collapse title="物证样本" :active="true">
        <el-table
          :data="dnaSample.dnaSampleList"
          tooltip-effect="dark"
          stripe
          border
          size="mini"
          style="width: 100%"
          ref="dnaSampleTable"
          @selection-change="addDnaSampleChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.sex == "F" ? "女" : "男" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dnaSampleRelation.name"
            label="关系"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </Collapse>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDnaSampleDialog()" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="confirmAddEntrustAndSample()"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--导入被鉴定对象-->
    <el-dialog title="导入被鉴定对象" :visible.sync="importIdentifiedObjDialog">
      <el-table
        :data="importObjArr"
        tooltip-effect="dark"
        ref="objTable"
        stripe
        border
        size="mini"
        style="width: 100%"
        @selection-change="importObjtSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="type.label" label="被鉴定对象类型">
        </el-table-column>
        <el-table-column prop="name" label="被鉴定对象"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" ref="objFooter">
        <el-button @click="importIdentifiedObjDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmImportObj()" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--导入毒物毒品-->
    <el-dialog title="增加毒物毒品" :visible.sync="importPoisonDialog">
      <el-form
        ref="poisonForm"
        label-width="0px"
        size="small"
        :model="poisonForm"
        class="demo-ruleForm"
      >
        <el-button
          type="primary"
          size="mini"
          style="float: right; margin-bottom: 10px"
          @click="addPoison"
          >增加
        </el-button>
        <el-table
          :data="poisonForm.poSampleResultList"
          tooltip-effect="dark"
          stripe
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column prop="poPoisonCategory">
            <!-- <template slot="header" slot-scope="scope"> -->
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i
              ><span>毒物毒品类别</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :rules="$filter_rules({ required: true })"
                :prop="
                  'poSampleResultList.' + scope.$index + '.poPoisonCategory'
                "
              >
                <el-select
                  :clearable="true"
                  value-key="id"
                  v-model="scope.row.poPoisonCategory"
                  placeholder="请选择"
                  @change="
                    (val) => {
                      poPoisonCategoryChange(val, scope.row);
                    }
                  "
                >
                  <el-option
                    v-for="item in poisonCategoryOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="poPoison.name">
            <!-- <template slot="header" slot-scope="scope"> -->
            <template slot="header">
              <i style="color: red; margin-right: 5px">*</i
              ><span>毒物名称</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :rules="$filter_rules({ required: true })"
                :prop="'poSampleResultList.' + scope.$index + '.poPoison'"
              >
                <select-from-table
                  :model.sync="scope.row.poPoison"
                  :port="port"
                  :condition.sync="scope.row.poisonConditon"
                  :clearable="true"
                ></select-from-table>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deletePoison(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="poisonFooter">
        <el-button @click="importPoisonDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="savePoison()" size="small"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import api from "../../../api/index";
import Collapse from "../../layout/Collapse";

export default {
  name: "EntrustingAuthItem",
  components: { Portlet: Portlet, Collapse: Collapse },
  data() {
    return {
      importEntrustMatterDialog: false,
      addEntrustMatterAndSampleDialog: false,
      importIdentifiedObjDialog: false,
      importObjArr: [],
      EntrustArr: [],
      checkedObj: [],
      matterPort: "",
      page: { pageSizes: [5, 8, 10], pageSize: 10, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      importPoisonDialog: false,
      poisonCategoryOpt: [], //毒物毒品类别
      condition: {},
      port: "",
      poisonForm: { poSampleResultList: [] },
      turnPageChecked: [], //翻页勾选
    };
  },
  props: {
    isEdit: { type: Boolean, default: false },
  },
  updated() {
    this.$nextTick(() => {
      let selectRows = JSON.parse(JSON.stringify(this.turnPageChecked));
      /*debugger*/
      this.EntrustArr.forEach((outerItem) => {
        selectRows[this.page.current - 1] &&
          selectRows[this.page.current - 1].forEach((item) => {
            /*if(outerItem.id == item.id) {
                            this.$refs.entrust.toggleRowSelection(outerItem,true);
                        }*/
            if (outerItem.entrustingSubMatter && item.entrustingSubMatter) {
              if (
                outerItem.entrustingSubMatter.id == item.entrustingSubMatter.id
              ) {
                this.$refs.entrust.toggleRowSelection(outerItem, true);
              }
            } else if (outerItem.id == item.id) {
              this.$refs.entrust.toggleRowSelection(outerItem, true);
            }
          });
      });
    });
  },
  methods: {
    poPoisonCategoryChange(val, row) {
      var data = JSON.parse(JSON.stringify(val));
      this.port = "poison";
      row.poisonConditon = { poisonCategoryId: data.id };
      if (row.poPoison) {
        row.poPoison = null;
      }
      if (row.result) {
        row.result = "";
      }
      if (row.poisonContent) {
        row.poisonContent = "";
      }
    },
    verifySample(_this, parentName) {
      for (let key in _this.$parent.$parent.$refs) {
        if (parentName == key) {
          var obj = _this.$parent.$parent.$refs[key];
          let p = new Promise(function (resolve, reject) {
            obj.$refs.form.validate((valid) => {
              if (valid) {
                resolve();
              } else {
                _this.$message.error("请完善样本表格中样本信息！");
              }
            });
          });
          return p;
        }
      }
    },
    findInArr: function (arr, key, s) {
      //判断重复
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key].id == s) {
          return i;
        }
      }
      return -1;
    },
    transform(arr) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    //导入委托事项
    importEntrustMatter() {
      this.importEntrustMatterDialog = true;
      this.checkedEntrustMatter = [];
      this.turnPageChecked = [];
      this.matterPort = "entrustingMatter";
      this.searchdata = {
        professionCategoryId: this.basicMsg.professionCategory.id,
      };
    },
    //增加委托事项和样本关系
    addEntrustMatterAndSample() {
      var allDnaSample = this.dnaSample.dnaSampleList;
      var noNameFlag = false;
      allDnaSample.forEach((vd, di) => {
        if (!vd.name) {
          noNameFlag = true;
        }
      });
      if (noNameFlag) {
        this.$message.error("请录入样本姓名!");
        return;
      }
      this.addEntrustMatterAndSampleDialog = true;
      this.checkedAddEntrustMatter = [];
      this.checkedAddDnaSample = [];
      this.searchdata = {
        professionCategoryId: this.basicMsg.professionCategory.id,
      };
    },
    importEntrustSelectionChange(selection) {
      this.turnPageChecked[this.page.current - 1] = selection;
      this.checkedEntrustMatter = this.turnPageChecked.reduce(
        (previousValue, currentValue) => {
          return previousValue.concat(currentValue);
        },
        []
      );
    },
    addEntrustSelectionChange(selection) {
      this.checkedAddEntrustMatter = [].concat(selection);
    },
    addDnaSampleChange(selection) {
      this.checkedAddDnaSample = [].concat(selection);
    },
    confirmImportEntrust: function () {
      this.checkedEntrustMatter.forEach((v, i) => {
        if (!this.isEdit) {
          v.chargingItemList.forEach((item, index) => {
            var num = this._.findIndex(
              this.chargeItem.chargingItemList,
              function (o) {
                return o.chargingItem.id == item.id;
              }
            );
            if (num == -1) {
              this.chargeItem.chargingItemList.push({
                chargingItem: {
                  name: item.name,
                  id: item.id,
                  chargingType: item.chargingType,
                },
                quantity: 1,
                unitPrice: item.price.cent / 100,
                remarks: "",
                parentId: v.id, //收费与委托事项进行ID绑定。
              });
            } else {
              this.chargeItem.chargingItemList[num].quantity += 1;
            }
          });
        }
        var entrustingSubMatterId = "";
        var entrustingSubMatterName = "";
        if (v.entrustingSubMatter) {
          entrustingSubMatterId = v.entrustingSubMatter.id;
          entrustingSubMatterName = v.entrustingSubMatter.name;
        }
        if (this.basicMsg.professionCategory.type.value == "DNA") {
          this.acceptForm.entrustingMatterList.push(
            {
              entrustingMatter: { id: v.id, name: v.name, key: v.key },
              entrustingMatterTargetList: [],
              quantity: 1,
              entrustingSubMatterId: entrustingSubMatterId,
              entrustingSubMatterName: entrustingSubMatterName,
            } //
          );
        } else {
          var index = this.findInArr(
            this.acceptForm.entrustingMatterList,
            "entrustingMatter",
            v.id
          );
          /* if (index == -1) { */
          this.acceptForm.entrustingMatterList.push({
            entrustingMatter: { id: v.id, name: v.name, key: v.key },
            entrustingMatterTargetList: [],
            entrustingMatterStandardList: v.standardList,
            quantity: 1,
            entrustingSubMatterId: entrustingSubMatterId,
            entrustingSubMatterName: entrustingSubMatterName,
          });
        }
      });
      this.importEntrustMatterDialog = false;
    },
    closeDnaSampleDialog() {
      this.addEntrustMatterAndSampleDialog = false;
      this.$refs.dnaSampleTable.clearSelection();
    },
    //增加鉴定委托事项和样本关系
    confirmAddEntrustAndSample: function () {
      var checkedDnaSample = this.checkedAddDnaSample;
      if (this.checkedAddEntrustMatter.length > 1) {
        this.$message.error("只能选择一个委托事项！");
        return;
      }
      this.checkedAddEntrustMatter.forEach((v, i) => {
        if (!this.isEdit) {
          v.chargingItemList.forEach((item, index) => {
            var num = this._.findIndex(
              this.chargeItem.chargingItemList,
              function (o) {
                return o.chargingItem.id == item.id;
              }
            );
            if (num == -1) {
              this.chargeItem.chargingItemList.push({
                chargingItem: {
                  name: item.name,
                  id: item.id,
                  chargingType: item.chargingType,
                },
                quantity: 1,
                unitPrice: item.price.cent / 100,
                remarks: "",
              });
            } else {
              this.chargeItem.chargingItemList[num].quantity += 1;
            }
          });
        }
        var entrustingSubMatterId = "";
        var entrustingSubMatterName = "";
        if (v.entrustingSubMatter) {
          entrustingSubMatterId = v.entrustingSubMatter.id;
          entrustingSubMatterName = v.entrustingSubMatter.name;
        }
        v.entrustingMatterTargetList = [];
        var matterType = v.key.value;
        var matterName = v.name;
        if (
          matterType == "DIAD" ||
          matterType == "FULLSIBS" ||
          matterType == "HALFSIBS" ||
          matterType == "NEPHEWUNCLE" ||
          matterType == "IDENTICAL"
        ) {
          var lengnth = checkedDnaSample.length;
          if (lengnth != 2) {
            this.$message.error(matterName + "中只能选择2个样本！");
            return;
          }
        }
        if (matterType == "DIAD") {
          var fatherAndmotherNum = 0;
          var childNum = 0;
          let grandFather = 0;
          checkedDnaSample.forEach((v, i) => {
            var relationFm = v.dnaSampleRelation.sampleRelationType.value;
            if (relationFm == "GRANDPA") {
              grandFather++;
            }
            if (relationFm == "FATHER" || relationFm == "MOTHER") {
              fatherAndmotherNum++;
            } else if (relationFm == "SON" || relationFm == "DAUGHTER") {
              childNum++;
            }
          });
          if (grandFather !== 0) {
            let father = checkedDnaSample.filter(
              (item) =>
                item.dnaSampleRelation.sampleRelationType.value == "FATHER"
            );
            if (!father.length) {
              this.$message.error(matterName + "中缺少一个父亲！");
              return;
            }
          } else if (fatherAndmotherNum < 1) {
            this.$message.error(matterName + "中至少需要选择一个父亲或母亲！");
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName + "中需要选择一个儿子或女儿！");
            return;
          }
        } else if (matterType == "TRIPLET") {
          var lengnth = checkedDnaSample.length;
          if (lengnth != 3) {
            this.$message.error("三联体亲子鉴定中只能选择3个样本！");
            return;
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
            this.$message.error(
              matterName + "中至少需要选择一个父亲和一个母亲！"
            );
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName + "中需要选择一个儿子或女儿！");
            return;
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
            this.$message.error(matterName + "中只能选择哥弟姐妹！");
            return;
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
            this.$message.error(matterName + "中至少需要选择一个叔叔或阿姨！");
            return;
          } else if (childNum == 0) {
            this.$message.error(matterName + "中至少需要选择一个侄儿或侄女！");
            return;
          }
        }
        var dnaSampleNames = "";
        var noNameFlag = false;
        checkedDnaSample.forEach((vd, di) => {
          if (!vd.name) {
            noNameFlag = true;
          }
          dnaSampleNames += vd.name + ",";
          v.entrustingMatterTargetList.push({
            name: vd.name,
            type: "DNA_SAMPLE",
          });
        });
        if (noNameFlag) {
          this.$message.error("请录入样本姓名!");
          return;
        }
        //相同的委托事项不能填写相同的样本
        var isExists = false;
        dnaSampleNames = dnaSampleNames.substr(0, dnaSampleNames.length - 1);

        this.acceptForm.entrustingMatterList.forEach((ev, ei) => {
          var etDnaSampleNames = "";
          ev.entrustingMatterTargetList.forEach((tv, ti) => {
            etDnaSampleNames += tv.name + ",";
          });
          etDnaSampleNames = etDnaSampleNames.substr(
            0,
            etDnaSampleNames.length - 1
          );
          if (
            dnaSampleNames == etDnaSampleNames &&
            ev.entrustingMatter.id == v.id
          ) {
            isExists = true;
          }
        });
        if (!isExists) {
          if (this.basicMsg.professionCategory.type.value == "DNA") {
            this.acceptForm.entrustingMatterList.push({
              entrustingMatter: { id: v.id, name: v.name, key: v.key },
              entrustingMatterTargetList: v.entrustingMatterTargetList,
              quantity: 1,
              entrustingSubMatterId: entrustingSubMatterId,
              entrustingSubMatterName: entrustingSubMatterName,
            });
          }
        } else {
          this.$message.error("所选样本已添加过鉴定事项!");
          return;
        }
      });
    },
    //导入被鉴定对象
    importObj(index, row) {
      //导入被鉴定对象
      var professionCategoryType = this.basicMsg.professionCategory.type.value; //专业类别
      var entrustingMatterTargetList = [].concat(
        row.entrustingMatterTargetList
      );
      if (
        professionCategoryType == "DOCUMENT" ||
        professionCategoryType == "TRACE_EVIDENCE" ||
        professionCategoryType == "ELECTRONIC" ||
        professionCategoryType == "ACOUSTIC_IMAGE"
      ) {
        var caSampleList = [].concat(this.caSample.caSampleList);
        if (caSampleList.length) {
          this.verifySample(this, "caSample")
            .then((res) => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              caSampleList.forEach((v, i) => {
                this.importObjArr.push({
                  type: { label: "检材样本", value: "CA_SAMPLE" },
                  name: v.name,
                });
              });
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function (o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function () {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("没有可以导入的检材样本！");
        }
      } else if (professionCategoryType == "DNA") {
        var dnaSampleList = [].concat(this.dnaSample.dnaSampleList);
        if (dnaSampleList.length) {
          this.verifySample(this, "dnaInfo")
            .then((res) => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              dnaSampleList.forEach((v, i) => {
                this.importObjArr.push({
                  type: { label: "DNA样本", value: "DNA_SAMPLE" },
                  name: v.name,
                  relation: v.dnaSampleRelation,
                });
              });
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function (o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function () {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("没有可以导入的物证样本！");
        }
      } else if (professionCategoryType == "POISON") {
        var poSampleList = [].concat(this.poisonSample.poSampleList);
        if (poSampleList.length) {
          this.verifySample(this, "poisonInfo")
            .then((res) => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              poSampleList.forEach((v, i) => {
                this.importObjArr.push({
                  type: { label: "毒物样本", value: "PO_SAMPLE" },
                  name: v.authPersonName,
                });
              });
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function (o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function () {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("没有可以导入的毒物样本！");
        }
      } else {
        var authenticatedVehicleList = [].concat(
          this.anthenticatedTarget.authenticatedVehicleList
        );
        var authenticatedPersonList = [].concat(
          this.anthenticatedTarget.authenticatedPersonList
        );
        var authenticatedOtherList = [].concat(
          this.anthenticatedTarget.authenticatedOtherList
        );
        if (
          authenticatedVehicleList.length ||
          authenticatedPersonList.length ||
          authenticatedOtherList.length
        ) {
          this.verifySample(this, "anthenticatedTargetInfo")
            .then((res) => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              if (authenticatedVehicleList.length) {
                authenticatedVehicleList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定车", value: "VEHICLE" },
                    name: v.plateNumber,
                  });
                });
              }
              if (authenticatedPersonList.length) {
                authenticatedPersonList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定人", value: "PERSON" },
                    name: v.name,
                  });
                });
              }
              if (authenticatedOtherList.length) {
                authenticatedOtherList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定其他", value: "OTHER" },
                    name: v.name,
                  });
                });
              }
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function (o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function () {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("没有可以导入的对象！");
        }
      }
    },
    importObjtSelectionChange(selection) {
      this.checkedObj = [].concat(selection);
    },
    confirmImportObj() {
      var index = this.$refs.objFooter.getAttribute("index");
      this.acceptForm.entrustingMatterList[index].entrustingMatterTargetList =
        [];
      var matterType = this.acceptForm.entrustingMatterList[index]
        .entrustingMatter.key
        ? this.acceptForm.entrustingMatterList[index].entrustingMatter.key.value
        : "";
      var matterName =
        this.acceptForm.entrustingMatterList[index].entrustingMatter.name;
      if (matterType == "POISON") {
        var lengnth = this.checkedObj.length;
        if (lengnth > 1) {
          this.$message.error("只能导入一个被鉴定对象！");
        } else {
          this.checkedObj.forEach((v, i) => {
            this.acceptForm.entrustingMatterList[
              index
            ].entrustingMatterTargetList.push({
              name: v.name,
              type: v.type.value,
            });
          });
          this.importIdentifiedObjDialog = false;
        }
      } else {
        if (
          matterType == "DIAD" ||
          matterType == "FULLSIBS" ||
          matterType == "HALFSIBS" ||
          matterType == "NEPHEWUNCLE" ||
          matterType == "IDENTICAL" ||
          matterType == "GRANDPARENTCHILD"
        ) {
          var lengnth = this.checkedObj.length;
          if (lengnth != 2) {
            this.$message.error(matterName + "中只能选择2个样本！");
            return;
          }
        }
        if (matterType == "DIAD") {
          var fatherAndmotherNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == "FATHER" || relationFm == "MOTHER") {
              fatherAndmotherNum++;
            } else if (relationFm == "SON" || relationFm == "DAUGHTER") {
              childNum++;
            }
          });
          if (fatherAndmotherNum < 1) {
            this.$message.error(matterName + "中至少需要选择一个父亲或母亲！");
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName + "中需要选择一个儿子或女儿！");
            return;
          }
        } else if (matterType == "TRIPLET") {
          var lengnth = this.checkedObj.length;
          if (lengnth != 3) {
            this.$message.error("三联体亲子鉴定中只能选择3个样本！");
            return;
          }
          var fatherAndmotherNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == "FATHER" || relationFm == "MOTHER") {
              fatherAndmotherNum++;
            } else if (relationFm == "SON" || relationFm == "DAUGHTER") {
              childNum++;
            }
          });
          if (fatherAndmotherNum < 2) {
            this.$message.error(
              matterName + "中至少需要选择一个父亲和一个母亲！"
            );
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName + "中需要选择一个儿子或女儿！");
            return;
          }
        } else if (matterType == "FULLSIBS" || matterType == "HALFSIBS") {
          var compatriotsNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
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
            this.$message.error(matterName + "中只能选择哥弟姐妹！");
            return;
          }
        } else if (matterType == "NEPHEWUNCLE") {
          var uncleNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == "UNCLE" || relationFm == "AUNT") {
              uncleNum++;
            } else if (relationFm == "NEPHEW" || relationFm == "NIECE") {
              childNum++;
            }
          });
          if (uncleNum == 0) {
            this.$message.error(matterName + "中至少需要选择一个叔叔或阿姨！");
            return;
          } else if (childNum == 0) {
            this.$message.error(matterName + "中至少需要选择一个侄儿或侄女！");
            return;
          }
        }
        this.checkedObj.forEach((v, i) => {
          this.acceptForm.entrustingMatterList[
            index
          ].entrustingMatterTargetList.push({
            name: v.name,
            type: v.type.value,
          });
        });
        this.importIdentifiedObjDialog = false;
      }
    },
    importPoison(index, row) {
      this.$refs.poisonFooter.setAttribute("index", index);
      if (row.poSampleResultList) {
        this.poisonForm.poSampleResultList = [].concat(row.poSampleResultList);
        this.port = "poison";
        this.poisonForm.poSampleResultList.forEach((v, i) => {
          v.poisonConditon = { poisonCategoryId: v.poPoisonCategory.id };
        });
      } else {
        this.poisonForm.poSampleResultList = [];
      }
      this.importPoisonDialog = true;
    },
    addPoison() {
      this.poisonForm.poSampleResultList.push({});
    },
    deletePoison(index, row) {
      this.poisonForm.poSampleResultList.splice(index, 1);
    },
    savePoison() {
      var index = this.$refs.poisonFooter.getAttribute("index");
      this.$refs.poisonForm.validate((valid) => {
        if (valid) {
          this.acceptForm.entrustingMatterList[index].poSampleResultList =
            [].concat(this.poisonForm.poSampleResultList);
          this.importPoisonDialog = false;
        } else {
          this.importPoisonDialog = true;
          return false;
        }
      });
    },
    deleteMatterRow(index, row) {
      //利用引用数据类型的特性来更新数据
      this.acceptForm.entrustingMatterList.splice(index, 1);
      this.chargeItem.chargingItemList =
        this.chargeItem.chargingItemList.filter((item) => {
          if (item.parentId !== row.entrustingMatter.id) return item;
        });
    },
  },
  computed: {
    ...mapState("acceptCase", {
      AcceptField: "acceptField",
      acceptForm: "entrustingAuthItem",
      basicMsg: "basicMsg",
      anthenticatedTarget: "anthenticatedTargetMsg",
      caSample: "caSampleMsg",
      dnaSample: "dnaSampleMsg",
      poisonSample: "poisonSampleMsg",
      chargeItem: "chargeItem",
    }),
  },
  watch: {
    "basicMsg.professionCategory.id": function (newVal, oldVal) {
      if (newVal) {
        this.condition = { professionCategoryId: newVal };
      }
    },
  },
  created() {
    this.$get(api.poisonCategory)
      .then((res) => {
        this.poisonCategoryOpt = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>