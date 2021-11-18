<template>
    <div id="role-management">
        <!-- <PageBar title1="系统设置" title2="角色管理"/> -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <!--角色列表-->
            <el-tab-pane label="角色列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form
                            :model="searchForm"
                            size="small"
                            label-width="100px"

                    >
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="所属部门">
                                    <select-department
                                            :model.sync="searchForm.office"
                                    ></select-department>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="角色名称">
                                    <el-input
                                            v-model.trim="searchForm.roleName"
                                            @keyup.enter.native="search"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="数据范围">
                                    <select-from-enum
                                            :model.sync="searchForm.dataRange"
                                            :clearable="true"
                                            :model-val="true"
                                            type="sys.CaseDataScopeType"
                                            class-name="w100"
                                    ></select-from-enum>
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="角色类型" class="margin0">
                                    <select-from-dict :model.sync="searchForm.roleTypeId"
                                                      :clearable="true"
                                                      :model-id="true"
                                                      data_type="sys_role_type"
                                                      class-name="w100">
                                    </select-from-dict>
                                </el-form-item>
                            </el-col>
                            <el-button
                                    @click="search"
                                    type="primary"
                                    icon="el-icon-search"
                                    size="small"
                                    style="color: white;float:right;"
                            >查询
                            </el-button>
                        </el-row>

                    </el-form>
                </div>
                <el-table
                        ref="dragTable"
                        :data="tableData"
                        row-key="id"
                        stripe
                        fit
                        border
                        el-tree-node
                        size="mini"
                        style="width: 100%"
                >
                    <el-table-column prop="name" label="角色名称" show-overflow-tooltip/>
                    <el-table-column prop="enname" label="英文名称" show-overflow-tooltip/>
                    <el-table-column prop="roleType.label" label="角色类型" show-overflow-tooltip/>
                    <el-table-column prop="caseDataScope.label" label="案件数据范围" show-overflow-tooltip/>
                    <el-table-column prop="userDataScope.label" label="账户角色数据范围" show-overflow-tooltip/>
                    <el-table-column prop="baseDataScope.label" label="基础数据数据范围" show-overflow-tooltip/>
                    <el-table-column prop="statDataScope.label" label="统计报表数据范围" show-overflow-tooltip/>
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
            </el-tab-pane>
            <el-tab-pane
                    :label="isAdd ? '角色添加' : '角色修改'"
                    :name="isAdd ? 'addlist' : 'changelist'"
            >
                <el-form
                        :model="addForm"
                        size="small"
                        ref="roleForm"
                        label-width="150px"
                >
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item
                                    label="归属部门"
                                    prop="office.name"
                                    :rules="$filter_rules({ required: true })"
                            >
                                <select-department
                                        :model.sync="addForm.office"
                                ></select-department>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item
                                    label="角色名称"
                                    prop="name"
                                    :rules="$filter_rules({ required: true, maxLength: 50 })"
                            >
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="英文名称">
                                <el-input v-model.trim="addForm.enname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="角色类型">
                                <select-from-dict :model.sync="addForm.roleType" className="w100"
                                                  data_type="sys_role_type"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="案件数据范围" :rules="$filter_rules({required:true})">
                                <select-from-enum
                                        className="w100"
                                        :model.sync="addForm.caseDataScope"
                                        :clearable="true"
                                        type="sys.CaseDataScopeType"
                                >
                                </select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                            v-if="
              addForm.caseDataScope && addForm.caseDataScope.value == 'DETAIL'
            "
                    >
                        <el-col :lg="{ span: 8 }">
                            <el-form-item label="专业类别">
                                <select-from-table
                                        :model.sync="addForm.caseProfessionCategoryList"
                                        port="profession"
                                        :multiple="true"
                                        className="multiple-select w100"
                                >
                                    <el-option label="全部专业" value="ALL"></el-option>
                                </select-from-table>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{ span: 8 }">
                            <el-form-item label="受理地点">
                                <select-from-table
                                        :model.sync="addForm.caseAcceptStationList"
                                        port="acceptStation"
                                        :multiple="true"
                                        className="multiple-select w100"
                                ></select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                            v-if="
              addForm.caseDataScope && addForm.caseDataScope.value == 'SALES'
            "
                    >
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="案源汇总" prop="caseSaleList">
                                <el-select
                                        class="w100"
                                        v-model="addForm.caseSaleList"
                                        placeholder="请选择"
                                        :multiple="true"
                                        value-key="id"
                                >
                                    <el-option
                                            v-for="item in salesList"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16}">
                            <el-form-item label="账号角色数据范围" :rules="$filter_rules({required:true})">
                                <select-from-enum
                                        className="w100"
                                        :model.sync="addForm.userDataScope"
                                        :clearable="true"
                                        type="sys.UserDataScopeType"
                                >
                                </select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16}">
                            <el-form-item label="基础数据数据范围" :rules="$filter_rules({required:true})">
                                <select-from-enum
                                        className="w100"
                                        :model.sync="addForm.baseDataScope"
                                        :clearable="true"
                                        type="sys.BaseDataScopeType"
                                >
                                </select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="统计报表数据范围" :rules="$filter_rules({required:true})">
                                <select-from-enum
                                        className="w100"
                                        :model.sync="addForm.statDataScope"
                                        :clearable="true"
                                        type="sys.CaseDataScopeType"
                                >
                                </select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                            v-if="
              addForm.statDataScope && addForm.statDataScope.value == 'DETAIL'
            "
                    >
                        <el-col :lg="{ span: 8 }">
                            <el-form-item label="专业类别">
                                <select-from-table
                                        :model.sync="addForm.statProfessionCategoryList"
                                        port="profession"
                                        :multiple="true"
                                        className="multiple-select w100"
                                >
                                    <el-option label="全部专业" value="ALL"></el-option>
                                </select-from-table>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{ span: 8 }">
                            <el-form-item label="受理地点">
                                <select-from-table
                                        :model.sync="addForm.statAcceptStationList"
                                        port="acceptStation"
                                        :multiple="true"
                                        className="multiple-select w100"
                                ></select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if=" addForm.statDataScope && addForm.statDataScope.value == 'SALES' "
                    >
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="案源汇总" prop="statSaleList">
                                <el-select
                                        v-model="addForm.statSaleList"
                                        placeholder="请选择"
                                        :multiple="true"
                                        value-key="id"
                                >
                                    <el-option
                                            v-for="item in salesList"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="角色授权">
                                <el-tree
                                        :data="treedata"
                                        show-checkbox
                                        default-expand-all
                                        node-key="id"
                                        @check="itemClick"
                                        :default-checked-keys="defaultKeys"
                                        ref="tree"
                                        highlight-current
                                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i
                            :class="[
                        hanveChild(node, data)
                          ? 'el-icon-folder-opened'
                          : 'el-icon-document'
                      ]"
                            style="margin-left: 5px;color: #3b7db6"
                    ></i
                    ><span style="margin-left: 5px">{{ node.label }}</span>
                  </span>
                                </el-tree>
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
                                @click="save('roleForm')"
                                :loading="saveLoading"
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
    import Select2 from "../../components/common/Select2";
    import api from "../../api/index";
    import Sortable from "sortablejs";
    import VJstree from "vue-jstree";
    import commonNum from "../../utils/commonNum";

    export default {
        name: "RoleManagement",
        components: {Select2: Select2, "v-jstree": VJstree},
        data() {
            return {
                //
                oldList: [],
                newList: [],
                //
                aaa: "",
                bbb: "",
                page: {
                    pageSizes: [30, 50, 80, 100],
                    pageSize: 30,
                    total: 0,
                    current: 1
                },
                tablesort: null,
                searchdata: {},
                searchForm: {office: {name: ""}},
                tableData: [],
                addForm: {
                    office: {name: ""},
                    name: "",
                    enname: "",
                    remarks: "",
                    roleType: null,
                    caseDataScope: null,
                    userDataScope: null,
                    baseDataScope: null,
                    statDataScope: null,
                },
                activeName: "list",
                isAdd: true,
                treedata: null,
                salesList: null,
                defaultKeys: [],
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                saveLoading: false,
                token: commonNum.createUUId()
            };
        },
        methods: {
            hanveChild(n, d) {
                if (n.childNodes.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            handleClick(tab, event) {
                if (sessionStorage.getItem("roleSearchData")) {
                    this.searchdata = JSON.parse(sessionStorage.getItem("roleSearchData"));
                    this.searchForm = this.searchdata;
                }
                //重置表单
                this.$refs["roleForm"].resetFields();
            },
            init() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.officeId = data.office.id;
                delete data.office;
                this.$get(api.role, data).then(res => {
                    this.tableData = res.data;
                    this.activeName = "list";
                }).catch(err => {
                    console.log(err);
                });
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.officeId = data.office.id;
                sessionStorage.setItem("roleSearchData", JSON.stringify(data));
                delete data.office;
                this.$get(api.role, data).then(res => {
                    this.tableData = res.data;
                    this.activeName = "list";
                }).catch(err => {
                    console.log(err);
                });
            },
            itemClick(a, b) {
                this.addForm.menuList = [];
                let keys = [].concat(b.checkedKeys).concat(b.halfCheckedKeys);
                this.addForm.menuList = keys;
            },
            deleteRow(index, row) {
                this.$confirmBox("确定删除角色" + row.name + "?")
                    .then(res => {
                        this.$del(api.role + "/" + row.id)
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
                                this.$alert(err.errMsg || "删除失败", "提示", {
                                    confirmButtonText: "确定",
                                    type: "warning"
                                });
                            });
                    })
                    .catch(err => {
                    });
            },

            edit(index, row) {
                this.isAdd = false;
                this.activeName = "changelist";
                this.$get(api.role + "/" + row.id).then(res => {
                    if (res.status == 200) {
                        var data = JSON.parse(JSON.stringify(res.data));
                        console.log(data, "data");
                        data.menuList = data.menuList.map((v, i) => {
                            return v.id;
                        });
                        if (
                            data.statProfessionCategoryList &&
                            data.statProfessionCategoryList.length
                        ) {
                            var index = this._.findIndex(
                                data.statProfessionCategoryList,
                                function (o) {
                                    return o.id == "ALL";
                                }
                            );
                            if (index != -1) {
                                data.statProfessionCategoryList[index] = "ALL";
                            }
                        }
                        if (
                            data.caseProfessionCategoryList &&
                            data.caseProfessionCategoryList.length
                        ) {
                            var index = this._.findIndex(
                                data.caseProfessionCategoryList,
                                function (o) {
                                    return o.id == "ALL";
                                }
                            );
                            if (index != -1) {
                                data.caseProfessionCategoryList[index] = "ALL";
                            }
                        }
                        Object.assign(this.addForm, data);
                        sessionStorage.setItem("RoleManagement", JSON.stringify({
                            isAdd: this.isAdd,
                            activeName: this.activeName,
                            form: this.addForm
                        }));
                        this.$get(api.role + "/" + row.id + "/leaf/keys")
                            .then(res => {
                                this.$refs.tree.setCheckedKeys(res.data);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                })
                    .catch(err => {
                        console.log(err);
                    });
            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.addForm));
                        data.office = {id: data.office.id};
                        if (data.menuList && data.menuList.length) {
                            data.menuList = data.menuList.map((v, i) => {
                                return {id: v};
                            });
                        }
                        if (
                            data.statProfessionCategoryList &&
                            data.statProfessionCategoryList.length
                        ) {
                            var index = this._.findIndex(
                                data.statProfessionCategoryList,
                                function (o) {
                                    return o == "ALL";
                                }
                            );
                            if (index != -1) {
                                data.statProfessionCategoryList[index] = {id: "ALL"};
                            }
                        }
                        if (
                            data.caseProfessionCategoryList &&
                            data.caseProfessionCategoryList.length
                        ) {
                            var index = this._.findIndex(
                                data.caseProfessionCategoryList,
                                function (o) {
                                    return o == "ALL";
                                }
                            );

                            if (index != -1) {
                                data.caseProfessionCategoryList[index] = {id: "ALL"};
                            }
                        }
                        this.saveLoading = true;
                        if (this.activeName == "addlist") {
                            data.id = null;
                            console.log(data, '新增成功')
                            var headers = {headers: {avoidDuplicateSubmitToken: this.token}}
                            this.$post(api.role, data, headers)
                                .then(res => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: "新增成功！",
                                            type: "success"
                                        });
                                        this.init();
                                        this.$refs[formName].resetFields();
                                    }
                                    this.saveLoading = false;
                                }).catch(err => {
                                this.$message.error(err.errMsg)
                                this.saveLoading = false;
                            });
                        } else {
                            this.$put(api.role + "/" + data.id, data).then(res => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                    this.saveLoading = false;
                                }
                            }).catch(err => {
                                this.$message.error(err.errMsg)
                                this.saveLoading = false;
                            });
                        }
                    }
                });
            },
            setSort() {
                const el = this.$refs.dragTable.$el.querySelectorAll(
                    ".el-table__body-wrapper > table > tbody"
                )[0];
                this.sortable = Sortable.create(el, {
                    ghostClass: "sortable-ghost", // Class name for the drop placeholder,
                    setData: function (dataTransfer) {
                        // to avoid Firefox bug
                        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                        dataTransfer.setData("Text", "");
                    },
                    onEnd: evt => {
                        const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
                        this.tableData.splice(evt.newIndex, 0, targetRow);
                        // for show the changes, you can delete in you code
                        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
                        this.newList.splice(evt.newIndex, 0, tempIndex);

                    }
                });
            },
            initData() {
                this.$get(api.role)
                    .then(res => {
                        this.tableData = res.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
                if (!this.treedata) {
                    this.$get(api.menu + '/user')
                        .then(res => {
                            console.log(res.data, 'treedata');
                            this.treedata = [].concat(res.data);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
                if (!this.salesList) {
                    this.$get(api.hrStaffList, {enName: "MARKET"})
                        .then(res => {
                            res.data.push({label: "全部市场人员", id: "ALL"});
                            this.salesList = res.data;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        },
        watch: {
            tableData: function (newval, oldval) {
                if (newval.length) {
                    this.oldList = newval.map((v, index) => index);
                    this.newList = this.oldList.slice();
                }
            },
            activeName: function (newval, oldval) {
                let that = this;
                if (newval) {
                    this.token = commonNum.createUUId();
                    sessionStorage.setItem("RoleManagement", JSON.stringify({
                        isAdd: this.isAdd,
                        activeName: this.activeName,
                        form: this.addForm
                    }));
                }
                if (newval == "list" || newval == "addlist") {
                    this.isAdd = true;
                    this.$refs.roleForm.resetFields();
                    Object.assign(this.addForm, {
                        office: {name: ""},
                        name: "",
                        enname: "",
                        remarks: "",
                        roleType: null,
                        caseDataScope: null,
                        userDataScope: null,
                        baseDataScope: null,
                        statDataScope: null,
                    })
                }
            },
            "addForm.caseDataScope.value": {
                handler(newVal, oldVal) {
                    if (oldVal == "SALES") {
                        this.addForm.caseSaleList = [];
                    }
                    if (oldVal == "DETAIL") {
                        this.addForm.caseProfessionCategoryList = [];
                        this.addForm.caseAcceptStationList = [];
                    }
                }
            },
            "addForm.statDataScope.value": {
                handler(newVal, oldVal) {
                    if (oldVal == "SALES") {
                        this.addForm.statSaleList = [];
                    }
                    if (oldVal == "DETAIL") {
                        this.addForm.statProfessionCategoryList = [];
                        this.addForm.statAcceptStationList = [];
                    }
                }
            }
        },
        created: function () {
            if (sessionStorage.getItem("RoleManagement")) {
                let {activeName, isAdd, form} = JSON.parse(sessionStorage.getItem("RoleManagement"));
                this.activeName = activeName;
                this.isAdd = isAdd;
                this.addForm = form;
            }
            ;
            this.$get(api.myInfo).then(res => {
                if (res.data.orgId == null || res.data.orgId.length == 0) {
                    this.$get(api.org + "/setOrgId?orgId=" + null).then(res => {
                        this.initData();
                    }).catch(e => console.log(e))
                } else {
                    this.initData();
                }
            });
            this.$store.dispatch("login/headerTitleChange", "角色管理")
        },
        mounted() {
            this.$nextTick(() => {
                this.setSort();
            });
        },
        beforeDestroy() {
            sessionStorage.removeItem("RoleManagement");
        }
    };
</script>
<style>
    .sortable-ghost {
        opacity: 0.8;
        color: #fff !important;
        background: #428bca !important;
    }
</style>
<style scoped lang="less">
    * {
        box-sizing: border-box;
    }

    .page-bar {
        border: 0;
        padding: 0px;
        background-color: #eee;
        margin-bottom: 25px;
        margin-left: -20px;
        margin-right: -20px;
        padding-left: 10px;
        padding-right: 20px;
        height: 36px;
        font-size: 14px;

        ul {
            height: 36px;
            margin-left: -30px;

            li {
                margin-top: 8px;
                list-style: none;
                float: left;
                color: #666666;

                i {
                    margin: 0 5px 0 5px;
                }

                a {
                    text-decoration: none;
                    color: #666666;
                }
            }
        }
    }

    .clearfix {
        display: block;
        content: "";
        clear: both;
    }
</style>
