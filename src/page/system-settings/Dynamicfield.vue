<template>
    <div id="dynamic-field">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态字段列表" name="list">
                <div class="search-box" style="overflow: hidden;">
                    <el-form
                            :model="searchForm"
                            size="small"
                            :inline="true"
                            label-width="80px"
                    >
                        <el-form-item label="页面">
                            <select-from-enum
                                    @keyup.enter.native="search"
                                    :model.sync="searchForm.target"
                                    :clearable="true"
                                    type="sys.DynamicFieldTarget"
                                    :modelVal="true"
                            ></select-from-enum>
                        </el-form-item>
                        <el-form-item label="专业类别">
                            <select-from-table
                                    @keyup.enter.native="search"
                                    :model.sync="searchForm.professionCategoryId"
                                    :clearable="true"
                                    :modelId="true"
                                    :condition="condition"
                                    port="profession"
                            ></select-from-table>
                        </el-form-item>
                        <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="small"
                                @click="search"
                                style="color: white"
                        >查询
                        </el-button>
                    </el-form>
                </div>
                <div
                        class="portlet"
                        v-for="(item, i) in list"
                        style="margin-bottom: 30px"
                >
                    <div class="portlet-header">
                        <span>{{ item.keyName }}</span>
                    </div>
                    <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                        <el-table
                                :data="item.list"
                                fit
                                stripe
                                border
                                size="mini"
                                style="width: 100%"
                        >
                            <el-table-column prop="label">
                                <template slot="header" slot-scope="{ column, $index }">
                                    <i style="color: red;margin-right: 5px">*</i
                                    ><span>字段名称</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="英文名"></el-table-column>
                            <el-table-column prop="target.label" label="页面">
                            </el-table-column>
                            <el-table-column prop="professionCategoryList" label="专业类别">
                                <template slot-scope="scope">
                  <span v-if="scope.row.professionCategoryList">
                    {{ transform(scope.row.professionCategoryList) }}
                  </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="inputType.label" label="参数输入类型">
                            </el-table-column>
                            <el-table-column prop="populateType.label" label="渲染类型">
                            </el-table-column>
                            <el-table-column prop="validateRules" label="渲染数据">
                            </el-table-column>
                            <el-table-column prop="addSelectBlank" label="是否有空白项">
                                <template slot-scope="scope">
                  <span v-if="scope.row.addSelectBlank">{{
                    scope.row.addSelectBlank == "Y" ? "是" : "否"
                  }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="validateRules" label="验证规则">
                            </el-table-column>
                            <el-table-column prop="defalutValue" label="默认值">
                            </el-table-column>
                            <el-table-column prop="width" label="宽度"></el-table-column>
                            <el-table-column prop="maxLength" label="最大长度">
                            </el-table-column>
                            <el-table-column prop="rows" label="行数"></el-table-column>
                            <el-table-column label="操作" align="center" width="150px">
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
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane
                    :label="isAdd ? '动态字段添加' : '动态字段修改'"
                    :name="isAdd ? 'addlist' : 'changelist'"
            >
                <el-form
                        :model="addForm"
                        size="small"
                        ref="fieldForm"
                        label-width="120px"
                >
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item
                                    label="页面"
                                    :rules="$filter_rules({ required: true, trigger: 'change' })"
                                    prop="target"
                            >
                                <select-from-enum
                                        :model.sync="addForm.target"
                                        className="w100"
                                        :clearable="true"
                                        type="sys.DynamicFieldTarget"
                                ></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item
                                    label="专业类别"
                                    :rules="$filter_rules({ required: true, trigger: 'change' })"
                                    prop="professionCategoryList"
                            >
                                <select-from-table
                                        :model.sync="addForm.professionCategoryList"
                                        port="profession"
                                        className="multiple-select"
                                        :condition="condition"
                                        :multiple="true"
                                >
                                </select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                                        placeholder="请选择组名">
                                    <el-option
                                            v-for="item in group"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item
                                    label="字段名称"
                                    :rules="$filter_rules({ required: true })"
                                    prop="label"
                            >
                                <el-input v-model.trim="addForm.label"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item
                                    label="英文名"
                                    :rules="$filter_rules({ required: true })"
                                    prop="name"
                            >
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item
                                    label="参数输入类型"
                                    :rules="$filter_rules({ required: true, trigger: 'change' })"
                                    prop="inputType"
                            >
                                <select-from-enum
                                        className="w100"
                                        :model.sync="addForm.inputType"
                                        :clearable="true"
                                        type="common.FormInputType"
                                ></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div v-if="isShow">
                        <el-row>
                            <el-col :lg="{ span: 16, offset: 4 }">
                                <el-form-item
                                        label="渲染类型"
                                        :rules="$filter_rules({ required: true, trigger: 'change' })"
                                        prop="populateType"
                                >
                                    <select-from-enum
                                            :model.sync="addForm.populateType"
                                            :clearable="true"
                                            type="common.PopulateType"
                                    ></select-from-enum>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{ span: 16, offset: 4 }">
                                <el-form-item
                                        label="渲染数据"
                                        :rules="$filter_rules({ required: true })"
                                        prop="populateValues"
                                >
                                    <el-input
                                            v-model.trim="addForm.populateValues"
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
                                        v-model.trim="addForm.validateRules"
                                        type="textarea"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item label="默认值">
                                <el-input v-model.trim="addForm.defalutValue"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item label="宽度">
                                <el-input v-model.trim="addForm.width"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item label="最大长度">
                                <el-input v-model.trim="addForm.maxLength"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16, offset: 4 }">
                            <el-form-item label="行数">
                                <el-input v-model.trim="addForm.rows"></el-input>
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
                                @click="save('fieldForm')"
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
    import {mapState} from "vuex";

    export default {
        name: "Dynamicfield",
        data() {
            return {
                activeName: "list",
                isAdd: true,
                searchForm: {},
                tableData: [],
                addForm: {professionCategoryList: []},
                paramOpt: [],
                popTypeOpt: [],
                list: [],
                isShow: false,
                group: [], //动态字段组名列表
                condition: {}
            };
        },
        methods: {
            transform(arr) {
                var str = "";
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ",";
                }
                return str.substr(0, str.length - 1);
            },
            handleClick(tab, event) {
                if (sessionStorage.getItem("DynamicfieldData")) {
                    this.searchForm = JSON.parse(sessionStorage.getItem("DynamicfieldData"));
                }
                //重置表单
                this.$refs["fieldForm"].resetFields();
            },
            init() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.orgId = this.orgId;
                this.$get(api.dynamicFields, data)
                    .then(res => {
                        this.list = res.data;
                        this.activeName = "list";
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            search() {
                sessionStorage.setItem("DynamicfieldData", JSON.stringify(this.searchForm));
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.orgId = this.orgId;
                this.$get(api.dynamicFields, data)
                    .then(res => {
                        this.list = res.data;
                        this.activeName = "list";
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.activeName == "addlist") {
                            data.orgId = this.orgId;
                            this.$post(api.dynamicFields, data)
                                .then(res => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: "新增成功！",
                                            type: "success"
                                        });
                                        this.init();
                                        this.$refs[formName].resetFields();
                                    }
                                }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            console.log(data, "修改");
                            this.$put(api.dynamicFields + "/" + data.id, data).then(res => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            });
                        }
                    }
                });
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = "changelist";
                var data = JSON.parse(JSON.stringify(row));
                this.addForm = data;
                console.log(this.addForm, "行数据");
            },
            deleteRow(index, row) {
                this.$confirmBox("确定删除动态字段" + row.name + "?")
                    .then(res => {
                        this.$del(api.dynamicFields + "/" + row.id)
                            .then(res => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "删除成功！",
                                        type: "success"
                                    });
                                    this.init();
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                    });
            }
        },
        created: function () {
            this.$store.dispatch("login/headerTitleChange", "动态字段")
            this.init();
            this.condition = {orgId: this.orgId};
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == "list") {
                    this.isAdd = true;
                    this.$refs.fieldForm.resetFields();
                } else if (newval == "addlist") {
                    this.addForm = {professionCategoryList: []};
                    this.$get(api.dynamicFields + '/group', {orgId: this.orgId}).then((res) => {
                        this.group = [].concat(res.data);
                    }).catch((err) => {
                        console.log(err)
                    });
                }
            },
            "addForm.inputType.value": function (newval, oldval) {
                if (newval) {
                    if (
                        newval == "RADIO" ||
                        newval == "CHECKBOX" ||
                        newval == "SELECT" ||
                        newval == "SELECT_MULTI"
                    ) {
                        this.isShow = true;
                    } else {
                        this.isShow = false;
                        var data = JSON.parse(JSON.stringify(this.addForm));
                        data.populateType = null;
                        data.populateValues = "";
                        data.addSelectBlank = "";
                        this.addForm = data;
                    }
                }
            },
            'orgId': {
                handler(newVal, oldVal) {
                    this.condition = {orgId: this.orgId};
                    if (this.activeName == 'list') {
                        this.init();
                    }
                    this.$get(api.dynamicFields + '/group', {orgId: this.orgId}).then((res) => {
                        this.group = [].concat(res.data);
                    }).catch((err) => {
                        console.log(err)
                    });
                }
            }
        },
        computed: {
            ...mapState("login", ["orgId"])
        },
    };
</script>

<style scoped></style>
