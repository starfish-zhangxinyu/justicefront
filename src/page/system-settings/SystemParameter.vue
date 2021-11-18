<template>
  <div id="system-parameter">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="系统参数设置" name="list">
        <div class="portlet" v-for="(item, i) in list" :key="i">
          <div class="portlet-header">
            <span>{{ item.keyName }}</span>
          </div>
          
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="item.list"
              stripe
              fit
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="name" label="参数名称"> </el-table-column>
              <el-table-column prop="value" label="参数值">
                <template slot-scope="scope">
                  <span v-if="!scope.row.isEdit">{{
                    scope.row.inputType.value == "SELECT" ||
                    scope.row.inputType.value == "SELECT_MULTI"
                      ? scope.row.label
                      : scope.row.value
                  }}</span>
                  <div v-if="scope.row.isEdit">
                    <div v-if="scope.row.inputType.value">
                      <!--文本输入框-->
                      <el-input
                        v-model="scope.row.value"
                        size="mini"
                        v-if="scope.row.inputType.value == 'TEXT'"
                      ></el-input>
                      <!--多行文本输入框-->
                      <el-input
                        v-model="scope.row.value"
                        size="mini"
                        v-if="scope.row.inputType.value == 'TEXTAREA'"
                        type="textarea"
                      ></el-input>
                      <!--单选框-->
                      <Radio
                        :model.sync="scope.row.value"
                        v-if="scope.row.inputType.value == 'RADIO'"
                        :type="scope.row.populateValues"
                        :options="scope.row.populateValues"
                        :from="scope.row.populateType.value"
                      ></Radio>

                      <!--复选框-->
                      <Checkbox
                        :model.sync="scope.row.value"
                        v-if="scope.row.inputType.value == 'CHECKBOX'"
                        :type="scope.row.populateValues"
                        :options="scope.row.populateValues"
                        :from="scope.row.populateType.value"
                      ></Checkbox>
                      <!--下拉选项框-->
                      <div
                        v-if="
                          scope.row.inputType.value == 'SELECT' ||
                          scope.row.inputType.value == 'SELECT_MULTI'
                        "
                      >
                        <!--枚举SYS_ENUM  CUSTOM_ENUM-->
                        <!--自定义枚举-->
                        <el-select
                          size="small"
                          style="width: 100%"
                          v-model="scope.row.value"
                          placeholder="请选择"
                          v-if="scope.row.populateType.value == 'CUSTOM_ENUM'"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                        >
                          <el-option
                            label=""
                            value=""
                            v-if="scope.row.addSelectBlank"
                          ></el-option>
                          <el-option
                            v-for="obj in strToJson(scope.row.populateValues)"
                            :key="obj.value"
                            :label="obj.label"
                            :value="obj.value"
                          >
                          </el-option>
                        </el-select>

                        <!--  所有人员-->
                        <el-select
                          v-model="scope.row.value"
                          placeholder="请选择"
                          value-key="id"
                          className="multiple-select"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          v-if="
                            scope.row.populateType.value == 'ALL' &&
                            scope.row.addSelectBlank
                          "
                        >
                          <el-option
                            label=""
                            value=""
                            v-if="scope.row.addSelectBlank"
                          ></el-option>
                          <el-option
                            v-for="item in allReceivers"
                            :key="item.id"
                            :label="item.hrStaff.name"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>

                        <!--系统枚举-->
                        <select-from-enum
                          :model-val="true"
                          v-if="scope.row.populateType.value == 'SYS_ENUM'"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          :model.sync="scope.row.value"
                          :type="scope.row.populateValues"
                        >
                          <template>
                            <el-option
                              label=""
                              value=""
                              v-if="scope.row.addSelectBlank"
                            ></el-option>
                          </template>
                        </select-from-enum>

                        <!--字典表-->
                        <select-from-dict
                          className="multiple-select"
                          :model.sync="scope.row.value"
                          :model-id="true"
                          v-if="
                            scope.row.populateType.value == 'DICT' &&
                            scope.row.addSelectBlank
                          "
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          :data_type="scope.row.populateValues"
                        >
                          <template slot-scope="scope">
                            <el-option
                              label=""
                              value=""
                              v-if="scope.row.addSelectBlank"
                            ></el-option>
                          </template>
                        </select-from-dict>
                      </div>
                      <!--日期选择器-->
                      <el-date-picker
                        v-if="scope.row.inputType.value == 'DATE'"
                        v-model="item.value"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述">
              </el-table-column>
              <el-table-column prop="remarks" label="备注"> </el-table-column>
              <el-table-column label="操作" align="center" width="280px">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="saveSys(scope.$index, scope.row)"
                    :icon="
                      scope.row.isEdit ? 'el-icon-check' : 'el-icon-setting'
                    "
                  >
                  </el-button>
                  <el-button
                    v-if="scope.row.isEdit"
                    size="mini"
                    icon="el-icon-close"
                    @click="editCancel(scope.$index, scope.row, item.list)"
                  >
                  </el-button>
                  <el-button
                    type="warning"
                    plain
                    size="mini"
                    icon="el-icon-edit"
                    @click="edit(scope.$index, scope.row)"
                  >
                  </el-button>
                  <el-button
                    type="danger"
                    plain
                    size="mini"
                    icon="el-icon-delete"
                    @click="delSys(scope.row)"
                  >
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="isAdd ? '添加参数' : '修改参数'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          ref="paramForm"
          label-width="100px"
        >
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="组名"
                :rules="$filter_rules({ required: true })"
                prop="group"
              >
                <el-select
                  class="w100"
                  v-model="addForm.group"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择组名"
                >
                  <el-option
                    v-for="item in group"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="参数类型"
                :rules="$filter_rules({ required: true })"
                prop="type"
              >
                <el-select
                  class="w100"
                  v-model="addForm.type"
                  :disabled="!isAdd"
                  @change="getParamsPcOrSYS(addForm.type)"
                >
                  <el-option label="系统参数" value="SYS"></el-option>
                  <el-option label="专业参数" value="PC"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="addForm.type == 'PC'">
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="专业类别"
                :rules="$filter_rules({ required: true })"
                prop="categoryIds"
              >
                <el-select
                  v-model="addForm.categoryIds"
                  multiple
                  placeholder="请选择"
                  class="w100"
                  :disabled="!isAdd"
                >
                  <el-option
                    v-for="item in addTabCategory"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="参数名称"
                prop="name"
                :rules="$filter_rules({ required: true })"
              >
                <!-- <el-select class="w100" v-model="addForm.name" @change="setDefaultValue($event)">
                                    <el-option
                                            v-for="item in params"
                                            :key="item.key"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select> -->
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
              <!--<el-form-item label="参数名称" :rules='$filter_rules({required:true})' prop="name">
                                <el-input v-model="addForm.name"></el-input>
                            </el-form-item>-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="关键字"
                :rules="$filter_rules({ required: true })"
                prop="key"
              >
                <el-input v-model="addForm.key" :disabled="!isAdd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="参数值">
                <el-input v-model="addForm.value"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item
                label="参数输入类型"
                :rules="$filter_rules({ required: true })"
                prop="inputType"
              >
                <el-select class="w100" v-model="addForm.inputType">
                  <el-option label="文本框" value="TEXT"></el-option>
                  <el-option label="单选框" value="RADIO"></el-option>
                  <el-option label="复选框" value="CHECKBOX"></el-option>
                  <el-option
                    label="下拉选择框（单选）"
                    value="SELECT"
                  ></el-option>
                  <el-option
                    label="下拉选择框（多选）"
                    value="SELECT_MULTI"
                  ></el-option>
                  <el-option label="多行文本框" value="TEXTAREA"></el-option>
                  <el-option label="日期输入框" value="DATE"></el-option>
                  <el-option label="图片上传" value="IMAGE"></el-option>
                  <el-option label="图片多选" value="IMAGE_MULTI"></el-option>
                  <el-option label="文件上传" value="FILE"></el-option>
                  <el-option label="多文件上传" value="FILE_MULTI"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="isShow">
            <el-row>
              <el-col :lg="{ span: 16, offset: 4 }">
                <el-form-item label="渲染类型">
                  <el-select v-model="addForm.populateType">
                    <el-option
                      v-for="item in popTypeOpt"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="{ span: 16, offset: 4 }">
                <el-form-item label="渲染数据">
                  <el-input
                    v-model="addForm.populateValues"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="{ span: 16, offset: 4 }">
                <el-form-item label="是否有空白项">
                  <el-radio-group v-model="addForm.addSelectBlank">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="验证规则">
                <el-input
                  v-model="addForm.validateRules"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="默认值">
                <el-input v-model="addForm.defalutValue"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="宽度">
                <el-input v-model="addForm.width"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="最大长度">
                <el-input v-model="addForm.maxLength"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="行数">
                <el-input v-model="addForm.rows"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row >-->
          <!--<el-col :span="16"  :offset="4">-->
          <!--<el-form-item label="枚举值"  label-width="15%" >-->
          <!--<el-input v-model="addForm.populateValues" type="textarea"></el-input>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="描述">
                <el-input
                  v-model="addForm.description"
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
              @click="save('paramForm')"
              ><i class="fa fa-save" :loading="saveLoading"></i> 保存
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
      <el-tab-pane label="专业参数列表" name="propParList">
        <div class="search-box" style="overflow: hidden">
          <el-form
            :model="searchForm"
            size="small"
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="专业类别">
              <select-from-table
                :model.sync="searchForm.professionCategory"
                :has-default="true"
                :condition="condition"
                port="profession"
                className="multiple-select"
                :org-id="orgId"
              >
              </select-from-table>
            </el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="search"
              >查询
            </el-button>
          </el-form>
        </div>
        <div class="portlet" v-for="(item, i) in list1" :key="i">
          <div class="portlet-header">
            <span>{{ item.keyName }}</span>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="item.list"
              stripe
              border
              fit
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="name" label="参数名称"> </el-table-column>
              <el-table-column prop="value" label="参数值">
                <template slot-scope="scope">
                  <span v-if="!scope.row.isEdit">{{
                    scope.row.inputType.value == "SELECT" ||
                    scope.row.inputType.value == "SELECT_MULTI"
                      ? scope.row.label
                      : scope.row.value
                  }}</span>
                  <div v-if="scope.row.isEdit">
                    <div v-if="scope.row.inputType.value">
                      <!--文本输入框-->
                      <el-input
                        v-model="scope.row.value"
                        size="mini"
                        v-if="scope.row.inputType.value == 'TEXT'"
                      ></el-input>
                      <!--多行文本输入框-->
                      <el-input
                        v-model="scope.row.value"
                        size="mini"
                        v-if="scope.row.inputType.value == 'TEXTAREA'"
                        type="textarea"
                      ></el-input>
                      <!--单选框-->

                      <Radio
                        :model.sync="scope.row.value"
                        v-if="scope.row.inputType.value == 'RADIO'"
                        :type="scope.row.populateValues"
                        :options="scope.row.populateValues"
                        :from="scope.row.populateType.value"
                      ></Radio>

                      <!--复选框-->
                      <Checkbox
                        :model.sync="scope.row.value"
                        v-if="scope.row.inputType.value == 'CHECKBOX'"
                        :type="scope.row.populateValues"
                        :options="scope.row.populateValues"
                        :from="scope.row.populateType.value"
                      ></Checkbox>
                      <!--下拉选项框-->
                      <div
                        v-if="
                          scope.row.inputType.value == 'SELECT' ||
                          scope.row.inputType.value == 'SELECT_MULTI'
                        "
                      >
                        <!--枚举SYS_ENUM  CUSTOM_ENUM-->
                        <!--自定义枚举-->
                        <el-select
                          size="small"
                          style="width: 100%"
                          v-model="scope.row.value"
                          placeholder="请选择"
                          v-if="scope.row.populateType.value == 'CUSTOM_ENUM'"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                        >
                          <el-option
                            label=""
                            value=""
                            v-if="scope.row.addSelectBlank"
                          ></el-option>
                          <el-option
                            v-for="obj in strToJson(scope.row.populateValues)"
                            :key="obj.value"
                            :label="obj.label"
                            :value="obj.value"
                          >
                          </el-option>
                        </el-select>

                        <!--系统枚举-->
                        <select-from-enum
                          :model-val="true"
                          v-if="scope.row.populateType.value == 'SYS_ENUM'"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          :model.sync="item.value"
                          :type="scope.row.populateValues"
                        >
                          <template>
                            <el-option
                              label=""
                              value=""
                              v-if="scope.row.addSelectBlank"
                            ></el-option>
                          </template>
                        </select-from-enum>

                        <!--字典表-->
                        <select-from-dict
                          className="multiple-select"
                          :model.sync="scope.row.value"
                          :model-id="true"
                          v-if="
                            scope.row.populateType.value == 'DICT' &&
                            scope.row.addSelectBlank
                          "
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          :data_type="scope.row.populateValues"
                        >
                          <template slot-scope="scope">
                            <el-option
                              label=""
                              value=""
                              v-if="scope.row.addSelectBlank"
                            ></el-option>
                          </template>
                        </select-from-dict>

                        <!--专业人员-->
                        <el-select
                          v-model="scope.row.value"
                          placeholder="请选择"
                          value-key="id"
                          className="multiple-select"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          v-if="
                            scope.row.populateType.value == 'USER_PC' &&
                            scope.row.addSelectBlank
                          "
                        >
                          <el-option
                            label=""
                            value=""
                            v-if="scope.row.addSelectBlank"
                          ></el-option>
                          <el-option
                            v-for="item in pcUserList"
                            :key="item.id"
                            :label="item.hrStaff.name"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>

                        <!--  所有人员-->
                        <el-select
                          v-model="scope.row.value"
                          placeholder="请选择"
                          value-key="id"
                          className="multiple-select"
                          :multiple="
                            scope.row.inputType.value == 'SELECT_MULTI'
                          "
                          v-if="
                            scope.row.populateType.value == 'ALL' &&
                            scope.row.addSelectBlank
                          "
                        >
                          <el-option
                            label=""
                            value=""
                            v-if="scope.row.addSelectBlank"
                          ></el-option>
                          <el-option
                            v-for="item in allReceivers"
                            :key="item.id"
                            :label="item.hrStaff.name"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <!--日期选择器-->
                      <el-date-picker
                        v-if="scope.row.inputType.value == 'DATE'"
                        v-model="item.value"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="280px">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    :icon="
                      scope.row.isEdit ? 'el-icon-check' : 'el-icon-setting'
                    "
                    @click="savePc(scope.$index, scope.row)"
                  >
                  </el-button>
                  <el-button
                    v-if="scope.row.isEdit"
                    size="mini"
                    icon="el-icon-close"
                    @click="editCancel(scope.$index, scope.row, item.list)"
                  >
                  </el-button>
                  <el-button
                    type="warning"
                    plain
                    size="mini"
                    icon="el-icon-edit"
                    @click="edit(scope.$index, scope.row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    plain
                    size="mini"
                    icon="el-icon-delete"
                    @click="delPc(scope.row)"
                  >
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Select2 from "../../components/common/Select2";
import Radio from "../../components/common/Radio";
import Checkbox from "../../components/common/Checkbox";
import api from "../../api/index";
import { mapState } from "vuex";

export default {
  name: "SystemParameter",
  components: { Select2: Select2, Radio: Radio, Checkbox: Checkbox },
  data() {
    return {
      list: [],
      list1: [],
      isShow: false,
      activeName: "list",
      addForm: { inputType: null, value: null },
      searchForm: { professionCategory: { id: "" }, orgId: "" },
      popTypeOpt: [],
      group: [],
      pcUserList: [],
      condition: {},
      params: [],
      allReceivers: [],
      saveLoading: false,
      isAdd: true,
      addTabCategory: [], //添加/修改参数的专业类别
    };
  },
  inject: ["hasPermission"],
  methods: {
    strToJson(str) {
      return JSON.parse(str);
    },
    search() {
      this.$get(api.param, {
        categoryId:
          this.searchForm.professionCategory &&
          this.searchForm.professionCategory.id
            ? this.searchForm.professionCategory.id
            : "pc",
        orgId: this.orgId,
      })
        .then((res) => {
          this.list1 = [].concat(res.data);
          this.list1.forEach((v, i) => {
            v.list.forEach((m, n) => {
              this.$set(m, "isEdit", false);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      this.getPcUserList();
      this.getAllReceivers();
    },
    getPcUserList() {
      //专业人员
      var data = {
        professionCategoryId: this.searchForm.professionCategory
          ? this.searchForm.professionCategory.id
          : "",
        qualificationType: "",
        orgId: this.orgId,
      };
      this.$get(api.hrStaff + "/qualification", data)
        .then((res) => {
          this.pcUserList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllReceivers() {
      //获取所有人员
      this.$get(api.hrStaff + "/qualification", {
        orgId: this.orgId,
        professionCategoryId: "",
        qualificationType: "",
      })
        .then((res) => {
          this.allReceivers = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delSys(row) {
      //删除系统参数
      this.$confirm("确认删除该参数?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(api.param + "/" + row.id)
            .then((res) => {
              if (res.data.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.$get(api.param, {
                  categoryId: "",
                  orgId: this.orgId,
                })
                  .then((res) => {
                    this.list = res.data;
                    this.list.forEach((v, i) => {
                      v.list.forEach((m, n) => {
                        this.$set(m, "isEdit", false);
                      });
                    });
                    this.activeName = "list";
                    this.editCancel(index, row, []);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    delPc(row) {
      //删除专业参数
      var category = this.searchForm.professionCategory.id;
      this.$confirm("确认删除该参数?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = { id: row.id, categoryId: category };
          this.$axios
            .delete(api.param, { data: data })
            .then((res) => {
              if (res.data.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.$get(api.param, {
                  categoryId: this.searchForm.professionCategory
                    ? this.searchForm.professionCategory.id
                    : "",
                  orgId: this.orgId,
                })
                  .then((res) => {
                    this.list1 = res.data;
                    this.list1.forEach((v, i) => {
                      v.list.forEach((m, n) => {
                        this.$set(m, "isEdit", false);
                      });
                    });
                    this.activeName = "propParList";
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(index, row) {
      var data = JSON.parse(JSON.stringify(row));
      let val = {
        categoryId:
          this.activeName == "list"
            ? ""
            : this.searchForm.professionCategory.id,
        key: data.key,
        orgId: this.orgId,
      };
      this.$post("/api/param/v1/params/specific", val)
        .then((res) => {
          var result = JSON.parse(JSON.stringify(res.data));
          this.addForm = result;
          this.addForm.categoryIds = [];
          this.addForm.categoryIds[0] = this.searchForm.professionCategory.id;
          this.isAdd = false;
          this.activeName = "changelist";
        })
        .catch((err) => {
          console.log(err);
        });
      sessionStorage.setItem(
        "SystemParameter",
        JSON.stringify({
          isAdd: this.isAdd,
          activeName: this.activeName,
          form: this.addForm,
        })
      );
    },
    //取消保存
    editCancel(index, row, list) {
      Object.assign(row, JSON.parse(window.sessionStorage.getItem(row.id)));
      row.isEdit = false;
    },
    saveSys(index, row) {
      window.sessionStorage.setItem(row.id, JSON.stringify(row));
      var data = JSON.parse(JSON.stringify(row));
      if (!row.isEdit) {
        row.isEdit = true;
      } else {
        delete data.orgId;
        if (data.inputType.value == "SELECT_MULTI") {
          // if (data.key == 'instrument.calibrator'&&data.inputType.value == 'SELECT_MULTI') {
          var value = "";
          if (data.value) {
            data.value.forEach((v, i) => {
              value = value + v + ",";
            });
            data.value = value.substr(0, value.length - 1);
          }
        }
        this.$put(api.param + "/" + data.id, data)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "修改成功！",
                type: "success",
              });
              this.$get(api.param, {
                categoryId: "",
                orgId: this.orgId,
              })
                .then((res) => {
                  this.list = res.data;
                  this.list.forEach((v, i) => {
                    v.list.forEach((m, n) => {
                      this.$set(m, "isEdit", false);
                    });
                  });
                  this.activeName = "list";
                  this.editCancel(index, row, []);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      }
    },
    savePc(index, row) {
      window.sessionStorage.setItem(row.id, JSON.stringify(row));
      if (!row.isEdit) {
        row.isEdit = true;
      } else {
        var data = JSON.parse(JSON.stringify(row));
        if (data.inputType.value == "SELECT_MULTI") {
          var value = "";
          if (data.value) {
            data.value.forEach((v, i) => {
              value = value + v + ",";
            });
            data.value = value.substr(0, value.length - 1);
          }
        }
        data.categoryId = this.searchForm.professionCategory
          ? this.searchForm.professionCategory.id
          : "";
        this.$put(api.param + "/" + data.id, data).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            this.$get(api.param, {
              categoryId: data.categoryId,
              orgId: this.orgId,
            })
              .then((res) => {
                this.list1 = res.data;
                this.list1.forEach((v, i) => {
                  v.list.forEach((m, n) => {
                    this.$set(m, "isEdit", false);
                  });
                });
                this.activeName = "propParList";
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    },
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.orgId = this.orgId;
      console.log("data", data);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          if (this.isAdd) {
            this.$post(api.param, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "新增成功！",
                    type: "success",
                  });
                  this.saveLoading = false;
                  this.$get(api.param, data)
                    .then((res) => {
                      this.list = res.data;
                      this.activeName = "list";
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
              });
          } else {
            data.categoryId = this.searchForm.professionCategory
              ? this.searchForm.professionCategory.id
              : "";
            this.$post(api.param + "/" + data.id, data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "修改成功！",
                    type: "success",
                  });
                  this.saveLoading = false;
                  delete data.categoryId;
                  this.$get(api.param, data)
                    .then((res) => {
                      this.list = res.data;
                      this.activeName = "list";
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  this.$refs[formName].resetFields();
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
              });
          }
        }
      });
    },
    searchSys() {
      this.$get(api.param, { orgId: this.orgId })
        .then((res) => {
          this.list = [].concat(res.data);
          this.list.forEach((v, i) => {
            v.list.forEach((m, n) => {
              this.$set(m, "isEdit", false);
              if (m.inputType.value == "SELECT_MULTI" && m.value) {
                m.value = m.value.split(",");
              }
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      this.$get(api.param + "/group", { orgId: this.orgId })
        .then((res) => {
          this.group = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getParamsPcOrSYS(newval) {
      this.$get(api.param + "/name-enums", { type: newval, orgId: this.orgId })
        .then((res) => {
          this.params = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setDefaultValue(newval) {
      var paramsArr = this.params;
      paramsArr.forEach((v, i) => {
        if (v.key == newval) {
          this.addForm.value = v.defaultValue;
        }
      });
    },
  },
  created: function () {
    this.$store.dispatch("login/headerTitleChange", "系统参数");
    this.$get("api/enum/v1/enums/common.PopulateType")
      .then((res) => {
        this.popTypeOpt = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    this.condition = { orgId: this.orgId };
  },
  watch: {
    activeName: function (newval, oldval) {
      if (newval == "list") {
        this.isAdd = true;
        this.addForm = {};
        this.$refs.paramForm.resetFields();
      }
      if (newval == "propParList") {
        this.search();
      }
    },
    inputTypeChange() {
      var str = this.addForm.inputType;
      if (
        str == "RADIO" ||
        str == "CHECKBOX" ||
        str == "SELECT" ||
        str == "SELECT_MULTI"
      ) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    orgId: {
      handler(newVal, oldVal) {
        this.searchForm.professionCategory = { id: "" };
        this.condition = { orgId: newVal };
        this.searchSys();
        this.search();
      },
      immediate: true,
    },
    "addForm.type"(newVal, oldVal) {
      if (newVal == "PC") {
        this.$get(api.profession)
          .then((res) => {
            this.addTabCategory = res.data.list;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  computed: {
    inputTypeChange() {
      return this.addForm.inputType;
    },
    ...mapState("login", ["orgId"]),
  },
};
</script>

<style scoped>
</style>
