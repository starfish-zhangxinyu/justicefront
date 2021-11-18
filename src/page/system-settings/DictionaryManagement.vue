<template>
    <div id="dictionary-management">
        <el-tabs type="border-card" v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="字典列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" :inline="true" label-width="80px">
                        <el-form-item label="类型">
                            <el-select v-model="searchForm.type" clearable @keyup.enter.native="search"
                                       :filterable="true">
                                <el-option
                                        v-for="item in typeOpt"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input v-model.trim="searchForm.description" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>

                        <el-button
                                icon="el-icon-search"
                                size="small"
                                type="primary"
                                @click="search"
                                style="color: white">查询
                        </el-button>
                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%">
                    <!--                    <el-table-column-->
                    <!--                            prop="value"-->
                    <!--                            label="键值">-->
                    <!--                    </el-table-column>-->
                    <el-table-column
                            prop="label"
                            label="标签">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="描述">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                       @click.native.prevent="deleteRow(scope.$index,scope.row)"></el-button>
                            <el-button type="primary" plain icon="el-icon-plus" size="mini"
                                       @click.native.prevent="add(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="tableData"
                            :search="searchdata"
                            :sort="tablesort"
                            port="dict"
                    >
                    </pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'字典添加':'字典修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="dictForm" :rules="rule" label-width="150px">
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="键值" prop="value">
                                <el-input v-model.trim="addForm.value"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="标签" prop="label">
                                <el-input v-model.trim="addForm.label"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="类型" prop="type">
                                <el-input v-model.trim="addForm.type"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="描述"
                                          prop="description">
                                <el-input v-model.trim="addForm.description"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,}">
                            <el-form-item label="排序" 
                                          prop="sort">
                                <el-input v-model.number="addForm.sort"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="备注" >
                                <el-input v-model="addForm.remarks" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="saveDict('dictForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                     <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="字典导入" name="importList" v-if = "hasPermission('auth:dict:import')">
                <el-form :model="templateFile" size="small" ref="importForm" :rules="rule" label-width="110px">
<!--                    <el-row>-->
<!--                        <el-col :lg="{span:16,offset:4}">-->
<!--                            <el-form-item label="下载模板">-->
<!--                                <el-button type="primary" @click="downTemplate">下载模板<i class="el-icon-download"></i>-->
<!--                                </el-button>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="模板文件" prop="file">
                                <el-upload
                                        class="upload-demo"
                                        action=""
                                        :on-change="handleChange"
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        accept=".xlsx"
                                        style="width:100%">
                                    <el-input v-model="templateFile.name" style="width:100%">
                                        <template slot="prepend">请选择文件</template>
                                    </el-input>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" :loading="isSaving" @click="saveImport('importForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from '../../api/index'
    import pagination from '../../components/common/TablePagination'
    import common from "../../../static/js/common";

    export default {
        name: "DictionaryManagement",
        components: {'pagination': pagination},
        data() {
            var nameDistinct = (rule, value, callback) => {
                if (this.isAdd && this.addForm.type) {
                    this.$get(api.dict + "/distinct/name", {'label': value, 'type': this.addForm.type}).then(res => {
                        if (!res.data) {
                            callback(new Error("所选类型下已存在'" + value + "'标签！"))
                        } else {
                            callback();
                        }
                    }).catch(err => {
                        callback(new Error('校验出错，请联系管理员！'));
                    })
                } else {
                    callback();
                }
            };
            return {
                activeName: 'list',
                isAdd: true,
                flag: true,
                searchForm: {},
                searchdata: {},
                tableData: [],
                tablesort: null,
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                addForm: {value:'',label:'',type:'',description:'',sort:'',remarks:''},
                typeOpt: [],
                rule: {
                    value: [
                        {min: 1, max: 50, message: '最多输入50个字符!', trigger: 'blur'},
                    ],
                    label: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多输入50个字符!', trigger: 'blur'},
                        {validator: nameDistinct, trigger: 'blur'},
                    ],
                    type: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多输入50个字符!', trigger: 'blur'},
                    ],
                    description: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多输入50个字符!', trigger: 'blur'},
                    ],
                    sort: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {type: 'number', message: "请输入数字", trigger: 'blur'}
                    ]
                },
                templateFile: {},
                isSaving:false
            }
        },
        inject: ["hasPermission"],
        methods: {
            handleClick(tab, event) {
                if(sessionStorage.getItem("DictionaryManagementSearchData")){
                    this.searchdata = JSON.parse(sessionStorage.getItem("DictionaryManagementSearchData"));
                    this.searchForm = this.searchdata;
                }
                Object.assign(this.addForm,{value:'',label:'',type:'',description:'',sort:'',remarks:''});
                sessionStorage.setItem("DictionaryManagement",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
                //重置表单
                this.$refs["dictForm"].resetFields();
            },
            dictInit() {
                let json = { 
                    "page.current": this.page.current,
                    "page.pageSize": this.page.pageSize
                    };
                this.$get(api.dict,
                   Object.assign(json,this.searchdata)
                ).then((res) => {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.activeName = "list";
                }).catch((err) => {
                    console.log(err)
                })
            },
            handleChange(file, fileList) {
                this.templateFile = file;
                console.log("dasdsadasdsa",)
            },
            saveImport(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = null;
                        let p = new Promise((resolve, reject) => {
                            if (this.templateFile.raw) {
                                common.getBase64(this.templateFile.raw).then((res) => {
                                    var fileName = this.templateFile.name;
                                    data = {
                                        'name': fileName,
                                        'base64Str': res,
                                        'fileType': fileName.substring(fileName.indexOf('.') + 1, fileName.length + 1)
                                    };
                                    resolve();
                                })
                            } else {
                                resolve();
                            }
                        });
                        p.then((res) => {
                            this.$post(api.dict + '/import', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "导入成功！",
                                        type: 'success'
                                    });
                                    this.activeName = 'list';
                                    this.dictInit();
                                }
                            }).catch(err=>{
                                this.$message.error(err.errMsg);
                                this.$getFormData('/api'+err.extraInfo).then(res=>{
                                    this.download(res.data,res.headers["content-disposition"].split("=")[1])
                                }).catch(error=>{
                                    this.$message({
                                        message: '导入错误，请联系管理员',
                                        type: 'error'
                                    });
                                })
                            })
                        });
                    }
                })
            },
            //查询
            search() {
                var json = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("DictionaryManagementSearchData",JSON.stringify(json));
                this.searchdata = json;
            },
            //编辑
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist'
                Object.assign(this.addForm,JSON.parse(JSON.stringify(row)));
                sessionStorage.setItem("DictionaryManagement",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
            },
            //删除
            deleteRow(index, row) {
                this.$confirmBox('确定删除字典' + row.label + '?').then((res) => {
                    this.$del(api.dict + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.dictInit();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            //增加
            add(index, row) {
                var data = JSON.parse(JSON.stringify(row));
                this.isAdd = true;
                this.activeName = 'addlist';
                this.addForm = {sort: data.sort, description: data.description, type: data.type};


            },
            //保存修改或者修改的内容
            saveDict(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addForm.type == 'report_type_flag' && !this.addForm.value) {
                            this.$message.error("该字典类型对应的键值不能为空！");
                            return;
                        }
                        //新增
                        if (this.activeName == 'addlist') {
                            var data = JSON.parse(JSON.stringify(this.addForm));

                            let  {description, label, sort, type, value, remarks} = data;
                            let  data2 = {description, label, sort, type, value, remarks};
                            this.$post(api.dict, data2).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                }
                                this.dictInit();
                                this.$refs[formName].resetFields();
                            }).catch((err) => {
                                console.log(err)
                            })
                            //修改
                        } else if (this.activeName == 'changelist') {
                            var data = JSON.parse(JSON.stringify(this.addForm));
                            delete data.createBy;
                            delete data.updateBy;
                            console.log(data, '0000');
                            this.$put(api.dict + '/' + this.addForm.id, data,
                            ).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    // this.searchForm = {};
                                    this.dictInit();
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.isAdd = true;
                    Object.assign(this.addForm,{value:'',label:'',type:'',description:'',sort:'',remarks:''});
                    this.$refs.dictForm.resetFields();
                }
            }
        },
        created: function () {
            this.$store.dispatch("login/headerTitleChange", "字典管理");
            if(sessionStorage.getItem("DictionaryManagement")){
                let {activeName,isAdd,form} = JSON.parse(sessionStorage.getItem("DictionaryManagement"));
                this.activeName=activeName;
                this.isAdd=isAdd;
                this.addForm=form;
            };
            this.$get(api.myInfo).then(res => {
                if (res.data.orgId == null || res.data.orgId.length == 0){
                    this.$get(api.org + "/setOrgId?orgId=" + null).then(res => {
                        this.$get('/api/dict/v1/dicts/types').then((res) => {
                            this.typeOpt = res.data;
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch(e => console.log(e))
                }else{
                    this.$get('/api/dict/v1/dicts/types').then((res) => {
                        this.typeOpt = res.data;
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            });

        },
        beforeDestroy(){
            sessionStorage.removeItem("DictionaryManagement");
        }
    }
</script>

<style scoped>

</style>
