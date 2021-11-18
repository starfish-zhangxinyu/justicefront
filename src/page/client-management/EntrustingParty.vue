<template>
  <div id="entrusting-party">
    <!-- <PageBar title1="客户管理" title2="委托单位管理"/> -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="委托单位列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form
            :model="searchForm"
            size="small"
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="委托单位类别">
              <select-from-dict
                :model.sync="searchForm.typeId"
                :clearable="true"
                data_type="ex_unit_type"
                :modelId="true"
                @keyup="search"
              />
            </el-form-item>
            <el-form-item label="单位名称">
              <el-input
                v-model.trim="searchForm.name"
                @keyup.enter.native="search"
                class="w215"
              />
            </el-form-item>

            <el-form-item label="所属区域">
              <treeSelect
                title="区域"
                :model.sync="searchForm.area"
                name="area"
                showUntilThree
                :expandRowKeys="expandRowKeys"
                isTitleChoose
                @hasLoadedTree="hasLoadedTree"
              ></treeSelect>
            </el-form-item>
            <el-button
              type="primary"
              @click="search"
              icon="el-icon-search"
              size="small"
              style="color: white"
              >查询
            </el-button>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          fit
          stripe
          border
          size="mini"
          style="width: 100%"
          :max-height="tableHeight"
        >
          <el-table-column prop="name" label="单位名称"></el-table-column>
          <el-table-column prop="type.label" label="委托单位类别">
          </el-table-column>
          <el-table-column prop="area.name" label="所属区域"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="fax" label="传真"></el-table-column>
          <el-table-column label="操作" align="center" width="200px">
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
              <el-button
                type="warning"
                plain
                size="mini"
                @click.native.prevent="changeRow(scope.$index, scope.row)"
                >变更
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
            port="entrustingUnit"
          >
          </pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="isAdd ? '委托单位添加' : '委托单位修改'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          :rules="rule"
          ref="entrustingUnitForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="委托单位辖区">
                <select-from-dict
                  :model.sync="addForm.prefecture"
                  :has-default="true"
                  className="w100"
                  :clearable="true"
                  data_type="prefecture_id"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="单位名称" prop="name">
                <el-input v-model.trim="addForm.name" :disabled="!isAdd" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="委托单位类别">
                <select-from-dict
                  :model.sync="addForm.type"
                  className="w100"
                  :clearable="true"
                  data_type="ex_unit_type"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="所属区域" prop="area">
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
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="地址">
                <el-input v-model.trim="addForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="电话">
                <el-input v-model.trim="addForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="传真">
                <el-input v-model.trim="addForm.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :span="16"  :offset="4">-->
          <!--<el-form-item label="添加日期" label-width="10%" >-->
          <!--<el-date-picker-->
          <!--v-model="addForm.date"-->
          <!--type="date"-->
          <!--placeholder="选择日期"-->
          <!--format="yyyy 年 MM 月 dd 日"-->
          <!--value-format="yyyy-MM-dd">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="备注">
                <el-input v-model="addForm.remarks" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="portlet">
          <div class="portlet-header">
            <span>委托单位联系人</span>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="float: right; margin-right: 10px; margin-top: 5px"
              @click="addContactRow"
              >增加
            </el-button>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-form :model="addForm" ref="contactForm">
              <el-table
                :data="addForm.externalPersonDtoList"
                stripe
                border
                fit
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="name">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>姓名</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'externalPersonDtoList.' + scope.$index + '.name'"
                      :rules="$filter_rules({ required: true })"
                    >
                      <el-input
                        v-model.trim="scope.row.name"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'externalPersonDtoList.' + scope.$index + '.sex'"
                      label-width="0px"
                    >
                      <el-select
                        v-model="scope.row.sex"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option label="男" value="M"></el-option>
                        <el-option label="女" value="F"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="position" label="职务">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'externalPersonDtoList.' + scope.$index + '.position'
                      "
                    >
                      <el-input
                        v-model.trim="scope.row.position"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="phone">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>手机号</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'externalPersonDtoList.' + scope.$index + '.phone'"
                      :rules="$filter_rules({ required: true, type: 'mobile' })"
                    >
                      <el-input
                        v-model.trim="scope.row.phone"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="fax" label="座机">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'externalPersonDtoList.' + scope.$index + '.fax'"
                    >
                      <el-input
                        v-model.trim="scope.row.fax"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="address">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>联系地址</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'externalPersonDtoList.' + scope.$index + '.address'
                      "
                      :rules="$filter_rules({ required: true })"
                    >
                      <el-input
                        v-model.trim="scope.row.address"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="微信/邮箱">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="'externalPersonDtoList.' + scope.$index + '.email'"
                    >
                      <el-input
                        v-model.trim="scope.row.email"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="status">-->
                <!--<template slot="header" slot-scope="{ column, $index }">-->
                <!--<i style="color: red;margin-right: 5px">*</i><span>状态</span>-->
                <!--</template>-->
                <!--<template slot-scope="scope">-->
                <!--<el-form-item-->
                <!--label-width="0px"-->
                <!--:prop="'externalPersonDtoList.' + scope.$index + '.status'"-->
                <!--:rules="$filter_rules({required:true})">-->
                <!--<el-select v-model="scope.row.status" placeholder="请选择" size="small">-->
                <!--<el-option label="等待审批" value="0"></el-option>-->
                <!--<el-option label="正常" value="1"></el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="remarks" label="备注">
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'externalPersonDtoList.' + scope.$index + '.remarks'
                      "
                    >
                      <el-input
                        v-model.trim="scope.row.remarks"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteContactRow(scope.$index, scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
        <div class="portlet">
          <div class="portlet-header">
            <span>添加协议价</span>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="float: right; margin-right: 10px; margin-top: 5px"
              @click="addPayRow"
              >增加
            </el-button>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-form :model="addForm" size="small" ref="agreementPriceForm">
              <el-table
                :data="addForm.agreementPriceDtoList"
                stripe
                border
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="baseChargingItem.name" label="收费项目">
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="professionCategory.name"-->
                <!--label="专业类别">-->
                <!--</el-table-column>-->
                <el-table-column label="普通价（元）">
                  <template slot-scope="scope">
                    <span v-if="scope.row.baseChargingItem.price">{{
                      scope.row.baseChargingItem.price.yuanFmt
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="agreementPrice">
                  <template slot="header">
                    <i style="color: red; margin-right: 5px">*</i
                    ><span>协议价（元）</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      label-width="0px"
                      :prop="
                        'agreementPriceDtoList.' +
                        scope.$index +
                        '.agreementPrice'
                      "
                      :rules="$filter_rules({ required: true })"
                    >
                      <el-input-number
                        class="w100"
                        v-model="scope.row.agreementPrice"
                        controls-position="right"
                        :min="
                          scope.row.baseChargingItem.minPrice
                            ? scope.row.baseChargingItem.minPrice.cent / 100
                            : 0
                        "
                        :max="
                          scope.row.baseChargingItem.maxPrice
                            ? scope.row.baseChargingItem.maxPrice.cent / 100
                            : 99999
                        "
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deletePayRow(scope.$index, scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="save('entrustingUnitForm')"
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
      <el-tab-pane label="委托单位变更" name="changeClient" v-if="ischange">
        <el-form
          :model="changeForm"
          size="small"
          :rules="rule"
          ref="partChangeForm"
          label-width="100px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="变更原因" prop="unitChangeReason">
                <select-from-dict
                  :className="'w100'"
                  :model.sync="changeForm.unitChangeReason"
                  data_type="change_reason"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="变更日期" prop="changeDate">
                <el-date-picker
                  class="w100"
                  v-model="changeForm.changeDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="unitName">
            <el-col :lg="{ span: 16 }">
              <el-form-item label="单位名称" prop="name">
                <el-input v-model.trim="changeForm.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!unitName">
            <el-col :lg="{ span: 16 }">
              <el-form-item label="委托单位辖区">
                <el-input v-model.trim="changeForm.prefecture" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="委托单位类别">
                <select-from-dict
                  :className="'w100'"
                  :model.sync="changeForm.type"
                  :clearable="true"
                  data_type="ex_unit_type"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="所属区域" prop="area">
                <treeSelect
                  title="区域"
                  :model.sync="changeForm.area"
                  name="area"
                ></treeSelect>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="地址">
                <el-input v-model.trim="changeForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="电话">
                <el-input v-model.trim="changeForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="传真">
                <el-input v-model.trim="changeForm.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
              @click="saveChange('partChangeForm')"
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
      <el-tab-pane label="委托单位导入" name="import">
        <el-form
          :model="importForm"
          size="small"
          ref="importForm"
          :rules="rule2"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="下载模板">
                <el-button type="primary" @click="dowmTemplete"
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
    <!--导入收费项目模态框-->
    <el-dialog
      title="收费项目"
      :visible.sync="dialogTableVisible"
      @close="closeDialogTable"
    >
      <el-form :model="xySearchForm" size="small" label-width="80px">
        <el-row>
          <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="xySearchForm.professionCategoryId"
                port="profession"
                className="multiple-select"
                :modelId="true"
                :clearable="true"
              ></select-from-table>
            </el-form-item>
          </el-col>
          <el-button-group style="float: right" class="clearfix">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="confirmSearch"
              >查询
            </el-button>
          </el-button-group>
        </el-row>
      </el-form>
      <el-table
        :data="payData"
        border
        stripe
        size="mini"
        @selection-change="handleSelectionChange"
        ref="payTable"
        :row-key="getRowKeys"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column property="name" label="收费项目"></el-table-column>
        <el-table-column
          property="chargingType.name"
          label="收费类别"
        ></el-table-column>
        <el-table-column property="price.yuanFmt" label="单价">
        </el-table-column>
        <el-table-column property="remarks" label="备注"></el-table-column>
      </el-table>
      <div class="pagination-footer">
        <pagination
          :pcurrent.sync="page1.current"
          :page.sync="page1"
          :data.sync="payData"
          :search.sync="xySearchdata"
          :port="port"
        ></pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-left: 20px">
        <el-button @click="dialogTableVisible = false" size="mini"
          >取 消
        </el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Test from "../../components/common/TreeSelect";
import Select2 from "../../components/common/Select2";
import api from "../../api/index";
import common from "@/assets/js/common";

export default {
  name: "EntrustingParty",
  components: { Select2: Select2, treeSelect: Test },
  data() {
    var nameDistinct = (rule, value, callback) => {
      this.$get(api.entrustingUnitNameValidate, {
        newName: value,
        id: this.addForm.id,
      })
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
    var nameDistinct2 = (rule, value, callback) => {
      if (
        this.templateFile.name &&
        this.templateFile.name.indexOf("xlsx") != -1
      ) {
        callback();
      } else {
        callback(new Error("请上传excel格式的模板文件"));
      }
    };
    var areaDistinct = (rule, value, callback) => {
      if (value.name != "") {
        callback();
      } else {
        callback(new Error("该输入项为必填项!"));
      }
    };
    return {
      activeName: "list",
      searchForm: { area: { name: "" }, status: "NOR" },
      isAdd: true,
      ischange: false,
      page: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      page1: {
        pageSizes: [30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      xySearchForm: {
        professionCategoryId: "",
      },
      xySearchdata: {},
      panClass: {
        sm: {
          span: 12,
        },
        md: {
          span: 8,
        },
        xl: {
          span: 7,
        },
      },
      tablesort: null,
      searchdata: { status: "NOR" },
      tableData: [],
      addForm: {
        area: { name: "" },
        externalPersonDtoList: [],
        agreementPriceDtoList: [],
        name: "",
      },
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { min: 1, max: 50, message: "最多输入50个字符!", trigger: "blur" },
          { validator: nameDistinct, trigger: "blur" },
        ],
        area: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
          { validator: areaDistinct, trigger: "blur" },
        ],
        unitChangeReason: [{ message: "变更原因为必填项!", required: true }],
        changeDate: [{ message: "变更日期为必填项!", required: true }],
      },
      // typeOpt:[],
      clientList: [],
      contactList: [],
      changeForm: { area: { name: "" } },
      table2: [],
      payData: [],
      dialogTableVisible: false,
      unitName: true,
      port: "",
      checked: [],
      agreementPriceForm: { table: [] },
      //导入
      importForm: {}, //新增模板
      templateFile: {}, //模板文件
      rule2: {
        file: [{ validator: nameDistinct2, trigger: "change" }],
      },
      expandRowKeys: [],
    };
  },
  methods: {
    //关闭收费项目
    closeDialogTable() {
      this.xySearchForm.professionCategoryId = "";
      this.xySearchdata = {};
    },
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
    handleClick(tab, event) {
      if (sessionStorage.getItem("entrustingUnitSearchData")) {
        this.searchdata = JSON.parse(
          sessionStorage.getItem("entrustingUnitSearchData")
        );
        this.searchForm = this.searchdata;
      }
      //重置表单
      this.$refs["entrustingUnitForm"].resetFields();
    },
    init() {
      let json = {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      };
      this.$get(api.entrustingUnit, Object.assign(json, this.searchdata))
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
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      data.areaId = data.area.id;
      sessionStorage.setItem("entrustingUnitSearchData", JSON.stringify(data));
      delete data.area;
      this.searchdata = data;
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除委托用户" + row.name + "?")
        .then((res) => {
          this.$del(api.entrustingUnit + "/" + row.id)
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
              this.$message.error(err.errMsg);
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    changeRow(index, row) {
      this.ischange = true;
      this.activeName = "changeClient";
      var data = JSON.parse(JSON.stringify(row));
      this.changeForm = data;
      sessionStorage.setItem(
        "EntrustingParty",
        JSON.stringify({
          isAdd: this.isAdd,
          activeName: this.activeName,
          form: this.addForm,
          ischange: this.ischange,
          changeForm: this.changeForm,
        })
      );
    },
    edit(index, row) {
      this.isAdd = false;
      this.activeName = "changelist";
      this.$get(api.entrustingUnit + "/" + row.id)
        .then((res) => {
          var data = JSON.parse(JSON.stringify(res.data));
          if (!data.area) {
            data.area = { name: "" };
          }
          if (data.agreementPriceDtoList) {
            data.agreementPriceDtoList = data.agreementPriceDtoList.map((v) => {
              v.agreementPrice = v.agreementPrice.cent / 100;
              return v;
            });
          }
          this.addForm = data;
          sessionStorage.setItem(
            "EntrustingParty",
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
    addContactRow() {
      this.addForm.externalPersonDtoList.push({ status: "1" });
    },
    deleteContactRow(index, row) {
      this.addForm.externalPersonDtoList.splice(index, 1);
    },
    /* 添加协议价搜索 */
    confirmSearch() {
      var data = JSON.parse(JSON.stringify(this.xySearchForm));
      this.xySearchdata = data;
    },
    addPayRow() {
      this.dialogTableVisible = true;
      this.port = "chargeItem";
      this.checked = [];
      this.$nextTick(() => {
        this.$refs.payTable.clearSelection();
      });
    },
    deletePayRow(index, row) {
      this.addForm.agreementPriceDtoList.splice(index, 1);
      console.log(
        "this.addForm.agreementPriceDtoList",
        this.addForm.agreementPriceDtoList
      );
    },
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.externalPersonDtoList = [].concat(data.externalPersonDtoList);
      data.agreementPriceDtoList = [].concat(data.agreementPriceDtoList);
      data.externalPersonDtoList.forEach((v, i) => {
        v.type = "UNIT_CONTACT";
      });
      data.agreementPriceDtoList.forEach((item) => {
        if (item.agreementPrice !== 0) {
          item.agreementPrice = { cent: item.agreementPrice * 100 };
        }
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.contactForm.validate((valid) => {
            if (valid) {
              if (this.activeName == "addlist") {
                this.$post(api.entrustingUnit, data)
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "新增成功！",
                        type: "success",
                      });
                      this.init();
                      this.$refs[formName].resetFields();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                if (data.type == "") {
                  data.type = { id: "" };
                }
                console.log("data", data);
                this.$put(api.entrustingUnit + "/" + data.id, data).then(
                  (res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "修改成功！",
                        type: "success",
                      });
                      this.init();
                      this.$refs[formName].resetFields();
                    }
                  }
                );
              }
            } else {
              this.$message.error("请输入委托单位联系人必填项！");
            }
          });
        } else {
          this.$message.error("请输入所有必填项！");
        }
      });
    },
    saveChange(formName) {
      var data = JSON.parse(JSON.stringify(this.changeForm));
      data.entrustingUnitChangeDto = {
        unitChangeReason: data.unitChangeReason,
        changeDate: data.changeDate,
      };
      if (data.type == "") {
        data.type = { id: "" };
      }
      delete data.unitChangeReason;
      delete data.changeDate;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$put(api.entrustingUnit + "/change/" + data.id, data).then(
            (res) => {
              if (res.status == 200) {
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
                this.init();
                this.$refs[formName].resetFields();
              } else {
                this.$message.error(err.errMsg);
              }
            }
          );
        }
      });
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSelectionChange(val) {
      this.checked = [];
      this.checked = [].concat(val);
    },
    confirm() {
      this.dialogTableVisible = false;
      console.log("this.checked", this.checked);
      this.checked.forEach((v, i) => {
        this.addForm.agreementPriceDtoList.push({
          baseChargingItem: v,
          agreementPrice: v.price.cent / 100,
        });
      });
      console.log("this.addForm", this.addForm.agreementPriceDtoList);
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
    dowmTemplete() {
      this.$getFormData(api.template + "/download", {
        templeleName: "委托单位导入模板.xlsx",
      })
        .then((res) => {
          this.download(res.data, "委托单位导入模板.xlsx");
        })
        .catch((err) => {
          this.$message({
            message: "模板下载错误，请联系管理员",
            type: "error",
          });
        });
    },
    handleChange(file, filelist) {
      this.templateFile = file;
    },
    saveImport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.importForm));
          let p = new Promise((resolve, reject) => {
            if (this.templateFile.raw) {
              common.getBase64(this.templateFile.raw).then((res) => {
                var fileName = this.templateFile.name;
                data.file = {
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
            this.$post(api.entrustingUnit + "/import", data.file)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "导入成功！",
                    type: "success",
                  });
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
                this.$getFormData("/api" + err.extraInfo)
                  .then((res) => {
                    this.download(
                      res.data,
                      res.headers["content-disposition"].split("=")[1]
                    );
                  })
                  .catch((error) => {
                    this.$message({
                      message: "导入错误，请联系管理员",
                      type: "error",
                    });
                  });
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
          "EntrustingParty",
          JSON.stringify({
            isAdd: this.isAdd,
            activeName: this.activeName,
            form: this.addForm,
            ischange: this.ischange,
            changeForm: this.changeForm,
          })
        );
      }
      if (newval == "list" || newval == "addlist") {
        this.isAdd = true;
        this.$refs.entrustingUnitForm.resetFields();
        this.$refs.contactForm.resetFields();
        this.$refs.agreementPriceForm.resetFields();
        this.addForm = {
          area: { name: "" },
          externalPersonDtoList: [],
          agreementPriceDtoList: [],
          name: "",
        };
      }
      if (newval == "changeClient") {
        this.ischange = true;
      } else {
        this.ischange = false;
      }
    },
    reasonChange() {
      if (this.changeForm.unitChangeReason.label === "名称变更") {
        this.unitName = true;
      } else {
        this.unitName = false;
        // this.changeForm.name = "";
      }
    },
  },
  computed: {
    reasonChange() {
      return this.changeForm.unitChangeReason;
    },
  },
  created() {
    if (sessionStorage.getItem("EntrustingParty")) {
      let {
        activeName,
        isAdd,
        form,
        ischange,
        changeForm = { area: { name: "" } },
      } = JSON.parse(sessionStorage.getItem("EntrustingParty"));
      this.activeName = activeName;
      this.isAdd = isAdd;
      this.addForm = form;
      this.ischange = ischange == "true" ? true : false;
      this.changeForm = changeForm;
    }
    this.$store.dispatch("login/headerTitleChange", "委托单位管理");
    this.tableHeight = window.innerHeight - 315 + "px";
  },
  beforeDestroy() {
    sessionStorage.removeItem("EntrustingParty");
  },
};
</script>

<style lang="less" scoped>
.portlet {
  /deep/ .el-form-item__content {
    height: 52px;
  }
  /deep/ .el-form-item__error {
    position: absolute;
    top: 34px;
  }
}
</style>
