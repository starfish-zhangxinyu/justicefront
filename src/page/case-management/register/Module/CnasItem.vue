<template>
  <div>
    <!-- :title="AcceptField.entrusting_auth_item.label" -->
    <!-- v-if="AcceptField.entrusting_auth_item" -->
    <Portlet :title="'CNAS/CMA项目'" :isKey="true" >
      <template slot="buttonGroup">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          style="float: right;margin-right: 10px;margin-top: 5px"
          @click="importEntrustMatter()"
        >导入</el-button>
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
            :data="acceptForm.CNASItemList"
            :span-method="objectSpanMethod"
            @cell-mouse-leave="cellMouseLeave"
            @cell-mouse-enter="cellMouseEnter"
            :cell-class-name="tableRowClassName"
            fit
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="name" label="CNAS/CMA项目"></el-table-column>
            <el-table-column prop="entrustingName" style="padding:0" label="委托事项">
              <template slot-scope="scope" style="padding:0">
                <div>{{scope.row.entrustingName}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="entrustingMatterTargetList" label="被鉴定对象/样本">
              <template slot-scope="scope">
                <span
                  v-for="(v,i) in scope.row.entrustingMatterTargetList"
                  :key="i"
                >{{i==0?'':','}}{{v.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="standardList" label="标准">
              <template slot-scope="scope">
                <p v-for="(v,i) in scope.row.standardList" :key="i">{{v.name}}</p>
                <!-- <span>1111</span> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="importObj(scope.$index,scope.row)"
                >导入被鉴定对象</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="importPoison(scope.$index,scope.row)"
                  v-if="basicMsg.professionCategory.type.value=='POISON'"
                >增加毒物物品</el-button>
              </template>
            </el-table-column>
            <el-table-column label="删除" width="80px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteMatterRow(scope.$index,scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </Portlet>

    <!--导入委托鉴定事项-->
    <el-dialog title="导入委托鉴定事项" :visible.sync="importEntrustMatterDialog">
      <el-table
        :data="EntrustArr"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
        @selection-change="importEntrustSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="鉴定项目"></el-table-column>
        <!--<el-table-column-->
        <!--prop="key.label"-->
        <!--label="类型">-->
        <!--</el-table-column>-->
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div class="pagination-footer">
          <pagination
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="EntrustArr"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            :port="matterPort"
          />
        </div>
        <el-button @click="importEntrustMatterDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmImportEntrust()" size="small">确 定</el-button>
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
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="type.label" label="被鉴定对象类型"></el-table-column>
        <el-table-column prop="name" label="被鉴定对象"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" ref="objFooter">
        <el-button @click="importIdentifiedObjDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmImportObj()" size="small">确 定</el-button>
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
          style="float: right;margin-bottom: 10px"
          @click="addPoison"
        >增加</el-button>
        <el-table
          :data="poisonForm.poSampleResultList"
          tooltip-effect="dark"
          stripe
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column prop="poPoisonCategory">
            <template slot="header" slot-scope="{ column, $index }">
              <i style="color: red;margin-right: 5px">*</i>
              <span>毒物毒品类别</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :rules="$filter_rules({required:true})"
                :prop="'poSampleResultList.' + scope.$index + '.poPoisonCategory'"
              >
                <el-select
                  :clearable="true"
                  value-key="id"
                  v-model="scope.row.poPoisonCategory"
                  placeholder="请选择"
                  @change="(val)=>{poPoisonCategoryChange(val,scope.row)}"
                >
                <!-- debugger -->
                  <el-option
                    v-for="item in poisonCategoryOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="poPoison.name">
            <template slot="header" slot-scope="{ column, $index }">
              <i style="color: red;margin-right: 5px">*</i>
              <span>毒物名称</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :rules="$filter_rules({required:true})"
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
                @click="deletePoison(scope.$index,scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="poisonFooter">
        <el-button @click="importPoisonDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="savePoison()" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 <!-- CNAS/CMA项目事项 -->
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Portlet from "../../../layout/Portlet";
import api from "../../../../api/index";

export default {
  name: "CNASItem",
  components: { Portlet },
  data() {
    return {
      importEntrustMatterDialog: false,
      importIdentifiedObjDialog: false,
      importObjArr: [],
      EntrustArr: [],
      CNASArr: [],
      checkedObj: [],
      matterPort: "",
      page: { pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      importPoisonDialog: false,
      poisonCategoryOpt: [], //毒物毒品类别
      condition: {},
      port: "",
      poisonForm: { poSampleResultList: [] },//鉴定的毒物类别

      tabRowI: [],
      tabRowNum: 0,

      rowIndex: "-1",
      OrderIndexArr: [],
      hoverOrderArr: []
    };
  },
  methods: {
    init(res){
      let that = this;
      this.$store.dispatch('register/changeCNAS', {CNASItemList: res}).then(()=>{
          that.getOrderNumber();
      });
    },
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
          let p = new Promise(function(resolve, reject) {
            obj.$refs.form.validate(valid => {
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
    findInArr: function(arr, key, s) {
      //判断重复
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][key]);
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
    //导入事项
    importEntrustMatter() {
      this.importEntrustMatterDialog = true;
      this.checkedEntrustMatter = [];
      this.matterPort = "cnas";
      this.searchdata = {
        professionCategoryId: this.basicMsg.professionCategory.id
      };
    },
    importEntrustSelectionChange(selection) {
      this.checkedEntrustMatter = [].concat(selection);
    },
    //导入点击确定
    confirmImportEntrust() {
      let data = [];
      this.checkedEntrustMatter.forEach((v, i) => {
        let standard = [];
        // v.standardList.forEach((item, index) => {
        //   item
        // });
        v.entrustingMatterList.forEach((item, index) => {
          data.push({
            id: v.id,
            cnasId:v.id,
            name: v.name,
            entrustingId: item.id,
            entrustingName: item.name,
            entrustingKey:item.key,
            standardList: v.standardList,
          });
          // var num = this._.findIndex(this.chargeItem.chargingItemList, function(o) {
          //   return o.chargingItem.id == item.id;
          // });
          // if (num == -1) {
          //   this.chargeItem.chargingItemList.push({
          //     chargingItem: {
          //       name: item.name,
          //       id: item.id,
          //       chargingType: item.chargingType
          //     },
          //     quantity: 1,
          //     unitPrice: item.price,
          //     remarks: ""
          //   });
          // } else {
          //   this.chargeItem.chargingItemList[num].quantity += 1;
          // }
        });
        return false;
        if (this.basicMsg.professionCategory.type.value == "DNA") {
          this.acceptForm.entrustingMatterList.push(
            {
              entrustingMatter: { id: v.id, name: v.name, key: v.key },
              entrustingMatterTargetList: [],
              quantity: 1
            } //
          );
        } else {
          var index = this.findInArr(
            this.acceptForm.entrustingMatterList,
            "entrustingMatter",
            v.id
          );
          if (index == -1) {
            this.acceptForm.entrustingMatterList.push(
              {
                entrustingMatter: { id: v.id, name: v.name, key: v.key },
                entrustingMatterTargetList: [],
                quantity: 1
              } //
            );
          } else {
            this.$message.error("请不要重复导入");
          }
        }
      });

      this.acceptForm.CNASItemList = data;
      this.getOrderNumber();
      this.importEntrustMatterDialog = false;
    },
    //导入被鉴定对象
    importObj(index, row) {
      //导入被鉴定对象
      var professionCategoryType = this.basicMsg.professionCategory.type.value; //专业类别
      var entrustingMatterTargetList = [].concat(
        row.entrustingMatterTargetList
      );
      if (professionCategoryType == "DNA") {
        var dnaSampleList = [].concat(this.dnaSample.dnaSampleList);
        if (dnaSampleList.length) {
          this.verifySample(this, "dnaInfo")
            .then(res => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              dnaSampleList.forEach((v, i) => {
                this.importObjArr.push({
                  type: { label: "DNA样本", value: "DNA_SAMPLE" },
                  name: v.name,
                  relation: v.dnaSampleRelation
                });
              });
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function(o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function() {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("没有可以导入的物证样本！");
        }
      } else if (professionCategoryType == "POISON") {
        var poSampleList = [].concat(this.poisonSample.poSampleList);
        if (poSampleList.length) {
          this.verifySample(this, "poisonInfo")
            .then(res => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              poSampleList.forEach((v, i) => {
                this.importObjArr.push({
                  type: { label: "毒物样本", value: "PO_SAMPLE" },
                  name: v.authPersonName
                });
              });
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function(o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function() {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch(err => {
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
            .then(res => {
              this.importIdentifiedObjDialog = true;
              this.importObjArr = [];
              if (authenticatedVehicleList.length) {
                authenticatedVehicleList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定车", value: "VEHICLE" },
                    name: v.plateNumber
                  });
                });
              }
              if (authenticatedPersonList.length) {
                authenticatedPersonList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定人", value: "PERSON" },
                    name: v.name
                  });
                });
              }
              if (authenticatedOtherList.length) {
                authenticatedOtherList.forEach((v, i) => {
                  this.importObjArr.push({
                    type: { label: "被鉴定其他", value: "OTHER" },
                    name: v.name
                  });
                });
              }
              this.$refs.objFooter.setAttribute("index", index);
              entrustingMatterTargetList.forEach((v, i) => {
                var index = this._.findIndex(this.importObjArr, function(o) {
                  return o.name == v.name;
                });
                if (index != -1) {
                  this.$nextTick(function() {
                    this.$refs.objTable.toggleRowSelection(
                      this.importObjArr[index],
                      true
                    );
                  });
                }
              });
            })
            .catch(err => {
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
      var index = this.$refs.objFooter.getAttribute("index"); //点击的是第几个表格
      let data = JSON.parse(JSON.stringify(this.acceptForm.CNASItemList));
      data[index].entrustingMatterTargetList = this.checkedObj.map((v, i) => {
        return { name: v.name, type: v.type.value };
      });
      this.acceptForm.CNASItemList = data;
      this.importIdentifiedObjDialog = false;
      return;
      var matterType = this.acceptForm.CNASItemList[index].entrustingMatter.key.value;
      var matterName = this.acceptForm.entrustingMatterList[index].entrustingMatter.name;
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
              type: v.type.value
            });
          });
          this.importIdentifiedObjDialog = false;
        }
      } else {
        if (matterType == 'DIAD' ||matterType == 'FULLSIBS'
                ||matterType == 'HALFSIBS' ||matterType == 'NEPHEWUNCLE' || matterType == 'IDENTICAL' || matterType == 'GRANDPARENTCHILD'){
          var lengnth = this.checkedObj.length;
          if (lengnth != 2) {
            this.$message.error(matterName+'中只能选择2个样本！');
            return;
          }
        }
        if (matterType == 'DIAD') {
          var fatherAndmotherNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == 'FATHER' || relationFm == 'MOTHER') {
              fatherAndmotherNum++;
            } else if (relationFm == 'SON' || relationFm == 'DAUGHTER') {
              childNum++;
            }
          });
          if (fatherAndmotherNum < 1) {
            this.$message.error(matterName+'中至少需要选择一个父亲或母亲！');
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName+'中需要选择一个儿子或女儿！');
            return;
          }
        } else if (matterType == 'TRIPLET') {
          var lengnth = this.checkedObj.length;
          if (lengnth != 3) {
            this.$message.error('三联体亲子鉴定中只能选择3个样本！');
            return;
          }
          var fatherAndmotherNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == 'FATHER' || relationFm == 'MOTHER') {
              fatherAndmotherNum++;
            } else if (relationFm == 'SON' || relationFm == 'DAUGHTER') {
              childNum++;
            }
          });
          if (fatherAndmotherNum < 2) {
            this.$message.error(matterName+'中至少需要选择一个父亲和一个母亲！');
            return;
          } else if (childNum != 1) {
            this.$message.error(matterName+'中需要选择一个儿子或女儿！');
            return;
          }
        }else if (matterType == 'FULLSIBS' || matterType == 'HALFSIBS'){
          var compatriotsNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == 'ELDERBROTHER' || relationFm == 'YOUNGERBROTHER'
                    || relationFm == 'ELDERSISTER' || relationFm == 'OUNGERSISTER') {
              compatriotsNum++;
            }
          });
          if (compatriotsNum != 2){
            this.$message.error(matterName+'中只能选择哥弟姐妹！');
            return;
          }
        }else if (matterType == 'NEPHEWUNCLE'){
          var uncleNum = 0;
          var childNum = 0;
          this.checkedObj.forEach((v, i) => {
            var relationFm = v.relation.sampleRelationType.value;
            if (relationFm == 'UNCLE' || relationFm == 'AUNT') {
              uncleNum++;
            }else if (relationFm == 'NEPHEW' || relationFm == 'NIECE'){
              childNum ++;
            }
          });
          if (uncleNum == 0) {
            this.$message.error(matterName+'中至少需要选择一个叔叔或阿姨！');
            return;
          } else if (childNum == 0) {
            this.$message.error(matterName+'中至少需要选择一个侄儿或侄女！');
            return;
          }
        }
        this.checkedObj.forEach((v, i) => {
          this.acceptForm.entrustingMatterList[
            index
          ].entrustingMatterTargetList.push({
            name: v.name,
            type: v.type.value
          });
        });
        this.importIdentifiedObjDialog = false;
      }
    },
    //导入毒物鉴定
    importPoison(index, row) {
      this.$refs.poisonFooter.setAttribute("index", index);
      if (row.poSampleResultList) {
        this.poisonForm.poSampleResultList = [].concat(row.poSampleResultList);
        this.port = "poison";
        this.poisonForm.poSampleResultList.forEach((v, i) => {
          v.poisonConditon = { poisonCategoryId: v.poPoisonCategory.id };
        });
      }else{
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
      let index = this.$refs.poisonFooter.getAttribute("index");
      this.$refs.poisonForm.validate(valid => {
        if (valid) {
          this.acceptForm.CNASItemList[index].poSampleResultList = [].concat(this.poisonForm.poSampleResultList);
          this.importPoisonDialog = false;
        } else {
          this.importPoisonDialog = true;
          return false;
        }
      });
    },
    deleteMatterRow(index, row) {
      this.acceptForm.CNASItemList.splice(index, 3);
    },
    getOrderNumber() {
      let OrderObj = {};
      this.acceptForm.CNASItemList.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.name]) {
          OrderObj[element.name].push(index);
        } else {
          OrderObj[element.name] = [];
          OrderObj[element.name].push(index);
        }
      });
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    //合并行函数，不管
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 3 || columnIndex === 5) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    //table函数，不管
    tableRowClassName({ row, rowIndex }) {
      let arr = this.hoverOrderArr;
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return "hovered-row";
        }
      }
    },
    //table函数，不管
    cellMouseEnter(row, column, cell, event) {
      this.rowIndex = row.rowIndex;
      this.hoverOrderArr = [];
      this.OrderIndexArr.forEach(element => {
        if (element.indexOf(this.rowIndex) >= 0) {
          this.hoverOrderArr = element;
        }
      });
    },
    //table函数，不管
    cellMouseLeave(row, column, cell, event) {
      this.rowIndex = "-1";
      this.hoverOrderArr = [];
    }
  },
  computed: {
    ...mapState("register", {
      AcceptField: "acceptField",
      basicMsg: "basicMsg",
      anthenticatedTarget: "anthenticatedTargetMsg",
      dnaSample: "dnaSampleMsg",
      poisonSample: "poisonSampleMsg",
      chargeItem: "chargeItem",

      acceptForm: "CNASItem"
    })
  },
  watch: {
    "basicMsg.professionCategory.id": function(newVal, oldVal) {
      if (newVal) {
        this.condition = { professionCategoryId: newVal.id };
      }
    }
  },
  created() {
    this.$get(api.poisonCategory)
      .then(res => {
        this.poisonCategoryOpt = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped>

</style>