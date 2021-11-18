<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验设备列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'检验设备添加':'检验设备修改'" name="form">
            <el-form :model="addForm" size="small" ref="equipmentForm" label-width="150px" :rules="rules">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="设备编号" prop="serialNumber">
                            <el-input v-model.trim="addForm.serialNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="设备名称" prop="name">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="型号/规格" prop="modelNumber">
                            <el-input v-model.trim="addForm.modelNumber"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="溯源方式" prop="traceMode">
                            <select-from-dict :model.sync="addForm.traceMode" className="w100" :filterable="true"
                                              data_type="trace_mode"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="校验周期" prop="calibratePeriod">
                            <el-input v-model.number="addForm.calibratePeriod">
                                <template slot="append">个月</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="校准机构">
                            <select-from-dict :model.sync="addForm.calibrateOrg" className="w100" :filterable="true"
                                              data_type="calibrate_org"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="专业类别" prop="professionCategoryList">
                            <select-from-table :model.sync="addForm.professionCategoryList" port="profession"
                                               :multiple=true className="multiple-select">
                                <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                            </select-from-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="购置时间">
                            <!--<select-from-table :model.sync="addForm.purchaseDate" port="profession"
                                               :multiple=true className="multiple-select">
                                <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                            </select-from-table>-->
                            <el-date-picker
                                    class="w100"
                                    v-model="addForm.purchaseDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="购置金额">
                            <el-input v-model.number="addForm.purchasePrice.yuanFmt">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="最近校准时间" prop="calibrateLastDate">
                            <!--<select-from-table :model.sync="addForm.purchaseDate" port="profession"
                                               :multiple=true className="multiple-select">
                                <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                            </select-from-table>-->
                            <el-date-picker
                                    class="w100"
                                    v-model="addForm.calibrateLastDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="附件">
                    <el-upload class="upload-demo" action="#" :multiple="true" :on-change="handleChangeAccessory" :auto-upload="false" :show-file-list="false" list-type="picture">
                        <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
                    </el-upload>
                </el-form-item>
                <FileWall :model.sync="fileList" :isType2="true" style="margin-left:150px;"></FileWall>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="save('equipmentForm')" :loading="isLoading"><i
                            class="fa fa-save"  ></i> 保存
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                            class="el-icon-arrow-left"></i> 返回
                    </el-button>
                </el-col>
            </el-row>

        </el-tab-pane>
        <el-tab-pane label="检验设备导入" name="import"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    import FileWall from '../../../components/common/FileWall'
    import common from '@/assets/js/common'

    export default {
        name: "Form",
        components: {
            FileWall
        },
        data() {
            var serialNumberUnique = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('该输入项为必填项!'));
                } else {
                    this.$get("/api/instrument/v1/instruments/distinct", {
                            serialNumber: value,
                            id: this.$route.query.id
                    }).then(res => {
                        if (!res.data) {
                            callback(new Error("编号为'" + value + "'的设备已经存在，编号不能重复！"))
                        } else {
                            callback();
                        }
                    }).catch(err => {
                        callback(new Error('服务器错误！'));
                    })
                }
            };
            return {

                addForm: {
                    name: '',
                    serialNumber: '',
                    modelNumber: '',
                    traceMode: '',
                    calibratePeriod: '',//校准周期
                    calibrateOrg: null,
                    professionCategoryList: [],
                    purchaseDate:'',
                    purchasePrice: {
                        cent:'',
                        yuanFmt: '',
                    },// 购置金额
                    calibrateLastDate:"" ,//最近校准时间
                },
                annexVisible: false,
                fileList: [],
                activeName: 'form',
                isAdd: true,
                annexImages:[],
                rules: {
                    serialNumber: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 64, message: '最多输入64个字符!', trigger: 'blur'},
                        {validator: serialNumberUnique, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 64, message: '最多输入64个字符!', trigger: 'blur'}
                    ],
                    modelNumber: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 64, message: '最多输入64个字符!', trigger: 'blur'}
                    ],
                    traceMode: [
                        {required: true, message: '该输入项为必填项!', trigger: 'change'}
                    ],
                    calibratePeriod: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {type: 'number', message: '该项输入必须为数字', trigger: 'blur'}
                    ],
                    professionCategoryList: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ],
                    calibrateLastDate: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ]
                },
                isLoading: false
            }
        },
        methods: {
            handleChangeAccessory(file, fileList){
                this.fileList.push(file);
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                data.baseInstrumentFileList = [].concat(this.fileList);
                let fileArr = [];
                this.fileList.forEach((item) => {
                    if (item.raw) {
                        let f = new Promise((resolve,reject) => {
                            common.getBase64(item.raw).then((res) => {
                                var FileName = item.name;
                                var index = FileName.lastIndexOf('.');
                                var fileName = FileName.substring(0, index);
                                data.baseInstrumentFileList.push({
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
                if(data.purchasePrice.yuanFmt) {
                    data.purchasePrice.cent = 100 * data.purchasePrice.yuanFmt;
                }else {
                    delete data.purchasePrice;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (this.$route.query.id) {
                            Promise.all(fileArr).then(() => {
                                this.$put(api.instrument + '/' + data.id, data,).then((res) => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: '修改成功！',
                                            type: 'success'
                                        });

                                        this.$router.push({path: '/auth/instruments/list'}).catch(err => {
                                            console.log(err)
                                        });
                                        this.$refs[formName].resetFields();
                                    }
                                }).catch((err) => {

                                    console.log(err)
                                });
                            })
                        } else {
                            this.isLoading = true;

                            this.$nextTick(() => {
                                Promise.all(fileArr).then(() => {
                                    this.$post(api.instrument, data).then((res) => {
                                        if (res.status == 200) {
                                            this.$message({
                                                message: '新增成功！',
                                                type: 'success'
                                            });
                                            this.isLoading = false;
                                            this.$router.push({path: '/auth/instruments/list'}).catch(err => {
                                                console.log(err)
                                            });
                                            this.$refs[formName].resetFields();
                                        }
                                    }).catch((err) => {
                                        this.isLoading = false;
                                        console.log(err)
                                    })
                                })
                            })

                        }
                    }
                });
            }
        },
        created() {
            this.activeName = 'form';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.instrument + '/' + this.$route.query.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    if(!data.purchasePrice)  {
                        data.purchasePrice = {
                            cent:'',
                            yuanFmt: '',
                        }
                    }
                    this.fileList = data.baseInstrumentFileList;
                    this.fileList.forEach(item => {
                        item.name = item.url.substring(item.url.lastIndexOf('-')+1, item.url.length + 1);
                    })
                    this.addForm = data;
                })
            } else {
                this.isAdd = true;
            }

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/instruments/list'}).catch(err => {
                        console.log(err)
                    });
                }
                if (newval == 'import') {
                    this.$router.push({path: '/auth/instruments/import'}).catch(err => {
                        console.log(err)
                    });
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
    }
</script>

<style scoped>

</style>