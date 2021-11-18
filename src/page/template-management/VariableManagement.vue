<template>
    <div>
        <!-- <PageBar title1="模板管理" title2="变量管理"></PageBar> -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="变量列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" :inline="true" label-width="100px">
                        <el-form-item label="返回类型">
                            <select-from-enum
                                    :model.sync="searchForm.returnType"
                                    placeholder="请选择"
                                    :clearable="true"
                                    :modelVal="true"
                                    @keyup.enter.native="search"
                                    type="tpl.VariableReturnType"></select-from-enum>
                        </el-form-item>
                        <el-form-item label="变量名">
                            <el-input
                                    v-model.trim="searchForm.variableName"
                                    @keyup.enter.native="search"
                                    class="w215"/>
                        </el-form-item>
                        <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="small"
                                style="color: white"
                                @click="search"
                        >查询
                        </el-button
                        >
                    </el-form>
                </div>
                <el-table
                        :data="trueTableData"
                        fit
                        stripe
                        border
                        size="mini"
                        style="width: 100%"
                >
                    <el-table-column prop="name" label="变量名称"></el-table-column>
                    <el-table-column prop="body" label="程序体">
                        <template slot-scope="scope">
                            <el-button type="text" @click="check(scope.$index, scope.row)"
                            >查看
                            </el-button
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="returnType.label" label="返回类型">
                    </el-table-column>
                    <el-table-column prop="paramsName" label="参数"></el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
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
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="tableData"
                            :search.sync="searchdata"
                            :sort.sync="tablesort"
                            port="templateVariable"
                    >
                    </pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane
                    :label="isAdd ? '变量添加' : '变量修改'"
                    :name="isAdd ? 'addlist' : 'changelist'"
            >
                <el-form :model="addForm" size="small" ref="variableForm" label-width="150px" :rules="rule">
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="变量名"  prop="name">
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="标签名" prop="tagName">
                                <el-input v-model.trim="addForm.tagName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="返回类型" prop="returnType">
                                <select-from-enum
                                        class="w100"
                                        :model.sync="addForm.returnType"
                                        placeholder="请选择"
                                        class-name="multiple-select"
                                        type="tpl.VariableReturnType"></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="参数"  prop="params">
                                <select-from-enum
                                        class="w100"
                                        :model.sync="addForm.params"
                                        placeholder="请选择"
                                        :multiple=true
                                        class-name="multiple-select"
                                        type="tpl.BaseData"></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="数据类别"  prop="dataCatalog">
                                <select-from-enum
                                        class="w100"
                                        :model.sync="addForm.dataCatalog"
                                        placeholder="请选择"
                                        class-name="multiple-select"
                                        type="tpl.DataCatalog"></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 16 }">
                            <el-form-item label="程序体"  prop="body">
                                <el-input v-model="addForm.body" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-row>
                    <el-col :span="2" :offset="11">
                        <el-button
                                type="success"
                                size="mini"
                                class="save-btn"
                                @click="save('variableForm')"
                        ><i class="fa fa-save"></i> 保存
                        </el-button
                        >
                    </el-col>
                </el-row
                >
            </el-tab-pane>
        </el-tabs>
        <!--程序体-->
        <el-dialog title="程序体" :visible.sync="dialogVisible" width="30%">
            <span>{{ msg }}</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >确 定</el-button
        >
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import Select2 from "../../components/common/Select2";
    import api from "../../api/index";
    import {get} from '@/api/http';

    export default {
        name: "VariableManagement",
        components: {Select2: Select2},
        data() {
            var nameValidate = (rule, value, callback) => {
                var id = this.addForm.id ? this.addForm.id : '';
                this.$get(api.templateVariable + "/validate?name=" + value + '&id=' + id).then(res => {
                    if (!res.data) {
                        callback(new Error("已存在名为'" + value + "'的变量名！"))
                    } else {
                        callback();
                    }
                }).catch(err => {
                    callback(new Error('后台校验出错！'));
                })
            };
            return {
                page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                searchForm: {},
                tableData: [],
                trueTableData: [],//处理后的数据
                enumList: [],//参数的枚举List
                activeName: "list",
                isAdd: true,
                addForm: {name: '', tagName: '', returnType: [], dataCatalog: [], body: ''},
                dialogVisible: false,
                msg: "",
                rule: {
                    name: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {validator: nameValidate, trigger: 'blur'},
                    ],
                    tagName: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                    returnType: [
                        {required: true, message: '该输入项为必填项!', trigger: 'change'},
                    ],
                    params: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                    dataCatalog: [
                        {required: true, message: '该输入项为必填项!', trigger: 'change'},
                    ],
                    body: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                }
            };
        },
        methods: {
            handleClick(tab, event) {
                if (sessionStorage.getItem("bltemplateSearchData")) {
                    this.searchdata = JSON.parse(sessionStorage.getItem("bltemplateSearchData"));
                    this.searchForm = this.searchdata;
                }
                //重置表单
                this.$refs["variableForm"].resetFields();
            },
            init() {
                let json = {
                    "page.current": this.page.current,
                    "page.pageSize": this.page.pageSize
                };
                this.$get(api.templateVariable, Object.assign(json, this.searchdata))
                    .then(res => {
                        this.tableData = res.data.list;
                        this.page.total = res.data.total;
                        this.page.pageSize = res.data.pageSize;
                        this.page.current = res.data.current;
                        this.activeName = "list";
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("bltemplateSearchData", JSON.stringify(data));
                this.searchdata = data;
            },
            check(index, row) {
                this.dialogVisible = true;
                this.msg = row.body;
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = "changelist";
                var data = JSON.parse(JSON.stringify(row));
                data.params = data.params.split(",");
                data.params = data.params.map(v => {
                    return {value: v};
                })
                this.addForm = data;
                sessionStorage.setItem("FormTemplate3",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
            },
            deleteRow(index, row) {
                this.$confirmBox("确定删除变量" + row.name + "?")
                    .then(res => {
                        this.$del(api.templateVariable + "/" + row.id)
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
            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.addForm));
                        let params = "";
                        this.addForm.params.forEach(v => {
                            params = params.concat(v.value, ",");
                        })
                        data.params = params.substring(0, params.length - 1);
                        if (this.activeName == "addlist") {
                            this.$post(api.templateVariable, data).then(res => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "新增成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch(err => {
                                this.$message.error(err.errMsg)
                            });
                        } else {
                            this.$put(api.templateVariable + "/" + data.id, data).then(res => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.isAdd = true;
                                    this.$refs[formName].resetFields();
                                }
                            }).catch(err => {
                                this.$message.error(err.errMsg)
                            });
                        }
                    }
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if(newval){
                    sessionStorage.setItem("FormTemplate3",JSON.stringify({
                        isAdd:this.isAdd,
                        activeName:this.activeName,
                        form:this.addForm
                    }));
                }
                if (newval == "list"||newval=="addlist") {
                    this.isAdd = true;
                    this.addForm = {
                        professionCategoryList: [],
                        returnType: [],
                        dataCatalog: [],
                        params: [],
                        loopDataDtoList: [],
                        name: '',
                        tagName: '',
                        body: ''
                    };
                }
            },
            tableData: function (newVal, oldVal) {
                this.trueTableData = [];
                newVal.forEach(v => {
                    var paramsName = v.params;
                    this.enumList.forEach(v1 => {
                        paramsName = paramsName.replace(v1.value, v1.label);
                    })
                    v.paramsName = paramsName;
                    this.trueTableData.push(v);
                })
            }
        },
        created: function () {
            if(sessionStorage.getItem("FormTemplate3")){
                let {activeName,isAdd,form} = JSON.parse(sessionStorage.getItem("FormTemplate3"));
                this.activeName=activeName;
                this.isAdd=isAdd;
                this.addForm=form;
            };
            this.$get(api.enum + '/tpl.BaseData').then((res) => {
                this.enumList = res.data;
                console.log(this.enumList, "参数枚举")
            }).catch((err) => {
                console.log(err)
            })
            this.$store.dispatch("login/headerTitleChange", "变量管理")
        },
        beforeRouteEnter(to, from, next) {
            get(api.enum + '/tpl.BaseData').then(res => {
                if (res.data) {
                    next(vm => {
                        vm.enumList = res.data;
                    })
                }
            }).catch((err) => console.log(err));
        },
        beforeDestroy(){
            sessionStorage.removeItem("FormTemplate3");
        }
    };
</script>

<style scoped></style>
