<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验标准列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'检验标准添加':'检验标准修改'" name="form">
            <el-form :model="addForm" size="small" ref="standardForm" :rules="rule" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="检验标准名称" prop="name">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="检验标准编号" prop="standardNo" >
                            <el-input v-model.trim="addForm.standardNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="标准发布日期">
                            <el-date-picker
                                    v-model="addForm.pubDate"
                                    value-format="yyyy-MM-dd"
                                    class="w100"
                                    type="date"
                                    placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="标准实施日期" prop="impDate">
                            <el-date-picker
                                    v-model="addForm.impDate"
                                    class="w100"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="标准作废日期">
                            <el-date-picker
                                    v-model="addForm.invalidDate"
                                    class="w100"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="机构实施日期">
                            <el-date-picker
                                    v-model="addForm.orgImpDate"
                                    class="w100"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="机构作废日期">
                            <el-date-picker
                                    v-model="addForm.orgInvalidDate"
                                    class="w100"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="标准类型" prop="standardType">
                            <select-from-dict data_type="standard_type" :model.sync="addForm.standardType"
                                              className="multiple-select" :clearable="true"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="标准状态" prop="status">
                            <select-from-enum
                                    className="w100"
                                    :model.sync="addForm.status"
                                    :clearable="true"
                                    type="base.StandardStatus"></select-from-enum>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="专业类别" prop="professionCategoryList">
                            <select-from-table
                                    :model.sync="addForm.professionCategoryList"
                                    port="profession"
                                    :multiple=true
                                    className="multiple-select">
                                <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                            </select-from-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- TODO -->
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="附件">
                            <el-upload class="upload-demo" action="#" :multiple="true" :on-change="handleChange" :auto-upload="false" :show-file-list="false" list-type="picture">
                                <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <FileWall :model.sync="fileList" :isType2="true" style="margin-left:150px;"></FileWall>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="10">
                    <el-button type="success" size="mini" class="save-btn" @click="save('standardForm')"><i
                            class="fa fa-save" :loading="buttonLoading"></i> 保存
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                            class="el-icon-arrow-left"></i> 返回
                    </el-button>
                </el-col>
            </el-row>

        </el-tab-pane>
        <el-tab-pane label="检验标准导入" name="import"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    import common from '@/assets/js/common'
    import FileWall from '../../../components/common/FileWall'

    export default {
        name: "Form",
        data() {
            var nameDistinct = (rule, value, callback) => {
                if (this.isAdd) {
                    this.$get(api.standard + "/distinct/name", {'name': value}).then(res => {
                        if (!res.data) {
                            callback(new Error("已存在名为'" + value + "'的检验标准名称！"))
                        } else {
                            callback();
                        }
                    }).catch(err => {
                        callback(new Error('后台校验出错！'));
                    })
                } else {
                    callback();
                }
            };
            return {
                templateFile: [],//模板文件
                activeName: 'form',
                isAdd: true,
                addForm: {},
                rule: {
                    name: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 60, message: '最多输入60个字符!', trigger: 'blur'},
                        {validator: nameDistinct, trigger: 'blur'},
                    ],
                    professionCategoryList: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                    standardNo:  [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ],
                    standardType:[
                        {required: true, message: '该输入项为必填项!', trigger: 'change'}
                    ],
                    status: [
                        {required: true, message: '该输入项为必填项!', trigger: 'change'}
                    ],
                    impDate: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ]
                },
                fileList:[],
                buttonLoading: false,
            }
        },
        methods: {
            handleChange(file, filelist) {
                this.fileList.push(file);
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                data.pdfFileList = [].concat(this.fileList);
                let fileArr = [];
                this.fileList.forEach((item) => {
                    if (item.raw) {
                      let f = new Promise((resolve,reject) => {
                            common.getBase64(item.raw).then((res) => {
                                var FileName = item.name;
                                var index = FileName.lastIndexOf('.');
                                 var fileName = FileName.substring(0, index);
                                data.pdfFileList.push({
                                    'name': fileName,
                                    'base64Str': res,
                                    'fileType': FileName.substring(FileName.indexOf('.') + 1, FileName.length + 1)
                                });
                                resolve();
                            })
                        })
                        fileArr.push(f);
                    }

                })

                console.log(data)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        if (this.isAdd) {
                            Promise.all(fileArr).then(() => {
                                this.$post(api.standard, data).then((res) => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success'
                                        });
                                        this.buttonLoading = false;
                                        this.$router.push({path: '/auth/standard/list'}).catch(err => {
                                            console.log(err)
                                        });
                                        this.$refs[formName].resetFields();
                                    }
                                }).catch((err) => {
                                    this.buttonLoading = false;
                                })
                            })
                        } else {
                            Promise.all(fileArr).then(() => {
                                this.$put(api.standard + '/' + data.id, data).then((res) => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: '修改成功！',
                                            type: 'success'
                                        });
                                        this.buttonLoading = false;
                                        this.$router.push({path: '/auth/standard/list'}).catch(err => {
                                            console.log(err)
                                        });
                                        this.$refs[formName].resetFields();
                                    }
                                })
                            })
                        }
                    }
                })
            }
        },
        computed: {
        },
        created() {
            this.activeName = 'form';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.standard + '/' + this.$route.query.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.addForm = data;
                    this.fileList = data.pdfFileList;
                    this.fileList.forEach(item => {
                        item.name = item.url.substring(item.url.lastIndexOf('-')+1, item.url.length + 1);
                    })
                })
            } else {
                this.isAdd = true;
            }

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/standard/list'}).catch(err => {
                        console.log(err)
                    });
                }
                if(newval=='import'){
                    this.$router.push({path:'/auth/standard/import'}).catch(err => { console.log(err) });
                }

            },
            "addForm.professionCategoryList":{
                handler:function(newVal,oldVal){
                    if(newVal){
                        if(!this.$findArrFn(newVal,'ALL')){
                            if(newVal.length>1){
                                this.addForm.professionCategoryList=[{id:'ALL'}];
                                this.$message.info('你已选择全部专业类别!');
                            }
                        }
                    }
                },
                deep:true,
            }
        },
        components:{
            FileWall
        }
    }
</script>

<style scoped>

</style>