<template>
    <div>
        <!-- <PageBar title1="员工管理" title2="员工列表"/> -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="鉴定设备列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" :inline="true" label-width="120px">
                        <el-form-item label="设备编号">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-form-item label="设备名称">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-form-item label="校准到期日期时间">
                            <DataPicker :startValue.sync="searchForm.beginRegisterDate" :endValue.sync="searchForm.endRegisterDate" valueFormat="yyyy/MM/dd HH:mm:ss" />
                        </el-form-item>
                        <el-form-item label="设备状态">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-form-item label="专业类别">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="search"
                                   style="color: white">查询
                        </el-button>
                    </el-form>
                </div>
                <el-table :data="tableData" stripe border size="mini" fit style="width: 100%">
                    <el-table-column prop="name" label="设备编号"></el-table-column>
                    <el-table-column prop="birthday" label="设备名称">
                        <template slot-scope="scope">
                            <span v-if="scope.row.birthday">{{divideDate(scope.row.birthday)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="educationBackground.label" label="规格型号"></el-table-column>
                    <el-table-column prop="professionalTitle.label" label="专业类别"></el-table-column>
                    <el-table-column prop="office.name" label="购置时间"></el-table-column>
                    <el-table-column prop="office.name" label="校准日期"></el-table-column>
                    <el-table-column prop="office.name" label="设备状态"></el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" icon="el-icon-edit" palin size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" plain size="mini"
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
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
                            port="hrStaffListAll">
                    </pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane :label="'鉴定设备添加/编辑'" :name="isAdd?'addlist':'changelist'">
                <div class="portlet">
                    <div class="portlet-header title-bgcolor">
                        <span>鉴定设备基础信息</span>
                    </div>
                    <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                    <el-form :model="addForm" size="small" ref="staffForm" label-width="150px">
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="设备编号" prop="name" :rules="$filter_rules({required:true})">
                                    <el-input v-model.trim="addForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="设备名称" prop="sex"
                                              :rules="$filter_rules({required: true, trigger: 'change'})">
                                    <el-select class="w100" v-model="addForm.sex" placeholder="请选择">
                                        <el-option label="男" value="F"></el-option>
                                        <el-option label="女" value="M"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="规格型号" prop="name" :rules="$filter_rules({required:true})">
                                    <el-input v-model.trim="addForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="溯源方式" prop="name" :rules="$filter_rules({required:true})">
                                    <el-input v-model.trim="addForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="专业类别" prop="name" :rules="$filter_rules({required:true})">
                                    <el-input v-model.trim="addForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="购置时间" prop="birthday">
                                    <el-date-picker
                                            class="w100"
                                            v-model="addForm.birthday"
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
                                <el-form-item label="购置金额" prop="educationBackground"
                                              :rules="$filter_rules({required: true, trigger: 'change'})">
                                    <select-from-dict className="w100" :model.sync="addForm.educationBackground"
                                                      data_type="education_background"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="最近校准时间" prop="birthday">
                                    <el-date-picker
                                            class="w100"
                                            v-model="addForm.birthday"
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
                                <el-form-item label="校准周期（月）" prop="professionalTitle"
                                              :rules="$filter_rules({required: true, trigger: 'change'})">
                                    <select-from-dict className="w100" :model.sync="addForm.professionalTitle"
                                                      data_type="professional_title"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:16}">
                                <el-form-item label="校准机构" prop="professionalTitle"
                                              :rules="$filter_rules({required: true, trigger: 'change'})">
                                    <select-from-dict className="w100" :model.sync="addForm.professionalTitle"
                                                      data_type="professional_title"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    </div>
                </div>
                <el-row>
                    <el-col :span="24">
                        <Portlet title="附件">
                            <template slot="buttonGroup">
                                <el-upload
                                        style="float: right;margin-right: 10px;"
                                        class="upload-demo"
                                        action="#"
                                        :multiple="true"
                                        :on-change="handleChangeAccessory"
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        list-type="picture">
                                    <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
                                </el-upload>
                            </template>
                            <template slot="body">
                                <PictureWall :model.sync="accessoryArr" :has-title="false">
                                </PictureWall>
                            </template>
                        </Portlet>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('staffForm')"><i
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
    import Select2 from '../../components/common/Select2'
    import common from '../../../static/js/common.js'
    import FileWall from '../../components/common/FileWall'
    import Portlet from '../layout/Portlet'

    export default {
        name: "StaffManage",
        components: {'Select2': Select2,'FileWall':FileWall,'Portlet':Portlet},
        data() {
            var nameDistinct = (rule, value, callback) => {
                if (this.templateFile.name && this.templateFile.name.indexOf("xlsx") != -1) {
                    callback();
                } else {
                    callback(new Error("请上传excel格式的模板文件"))
                }
            }
            return {
                activeName: 'list',
                isAdd: true,
                tableData: [],
                tablesort: null,
                searchdata: {},
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                searchForm: {office: {name: ''}},
                addForm: {
                    office: {},
                    authCategoryList: [],
                    assistCategoryList: [],
                    reviewerCategoryList: [],
                    signatoryCategoryList: [],
                    issuerCategoryList: [],
                    educationBackground: {},
                    name: '',
                    sex: '',
                    birthday: '',
                    professionalTitle: '',
                    techTitle: '',
                    isAuthenticator: '',
                    licenseNumber: '',
                    certificateStartDate: '',
                    certificateExpireDate: '',
                    isAssist: '',
                    isReviewer: '',
                    isSignatory: '',
                    isIssuer: '',
                    jobNo: '',
                    graduateSchool: '',
                    graduateDate: '',
                    major: '',
                    hireDate: '',
                    workYear: '',
                    contractType: '',
                    contractYear: '',
                    contractExpireDate: '',
                    contractNum: '',
                    contractLastDate: '',
                    firstAuthDate: '',
                    leaveDate: '',
                    becomeRegularDate: '',
                    status: '',
                    hrStaffCertificates: []
                },
                annexVisible: false,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                templateFile: {},
                accessoryArr:[], //附件
                activeFileList: [] ,//附件列表
                currentNum: 0,
                rule: {
                    name: [
                        {required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                    file: [{validator: nameDistinct, trigger: 'change'}]
                },
            }
        },
        methods: {
            confirm() {
                //压缩附件
                this.annexVisible = false;
                this.AsyncfileArr = [];
                let _that = this;
                this.addForm.hrStaffCertificates[this.currentNum].certificateFile = [];
                this.activeFileList.forEach((v, i) => {
                    if(v.raw) {
                        let f = null;
                        if(v.raw.type == 'image/png' || v.raw.type == 'image/jpeg'|| v.raw.type == 'image/jpg') {
                            console.log(this.addForm.hrStaffCertificates);
                            f = new Promise((resolve, reject) => {
                                let file = v.raw;
                                let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                                let filetype = file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length);
                                lrz(file, {width: 1280}).then( rst => {
                                    let file = {name:v.name,fileType: filetype, base64Str: rst.base64};
                                    _that.addForm.hrStaffCertificates[this.currentNum].certificateFile.push(file);
                                    console.log(this.addForm.hrStaffCertificates);
                                    resolve();
                                });
                            });
                        }else {
                            //上传的是pdf
                            if(v.raw.type == 'application/pdf') {
                                f = new Promise((resolve, reject) => {
                                    this.$getBase64(v.raw).then( (res) => {
                                        var index = v.name.lastIndexOf('.');
                                        var fileName = v.name.substring(0, index);
                                        let file = v.raw;
                                        let filetype = file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length);
                                        _that.addForm.hrStaffCertificates[this.currentNum].certificateFile.push({name:v.name,fileType: filetype, base64Str: res});
                                        resolve();
                                    });
                                });
                            }else {
                                this.$message({
                                    type:'error',
                                    message: '只能上传图片或PDF文件！'
                                })
                                this.annexVisible = true;
                                return
                            }
                        }
                        this.AsyncfileArr.push(f)
                    }else {
                        addForm.hrStaffCertificates.push({url:v.url});
                    }
                })

            },
            openDiag(index) {
                this.annexVisible = true;
                this.activeFileList = this.accessoryArr[index].fileList
                this.currentNum = index;
            },
            deleteCetificate(index) {
                this.addForm.hrStaffCertificates.splice(index, 1);
                this.accessoryArr.splice(index, 1);
            },
            addCetificate() {
                this.addForm.hrStaffCertificates.push({name:'',issueUnit:'',issueDate:'',validDate:'',certificateFile:[]});
                this.accessoryArr.push({fileList:[]});
            },
            cetificateSuccess() {
                this.$message({
                    type:'success',
                    message:'证书上传成功'
                })
            },
            cetificateError() {
                this.$message({
                    type:'error',
                    message:'证书上传失败'
                })
            },
            handleChangeCetificate(file, fileList) {
                //证书上传
                var fileName = file.name;
                let fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length + 1);
                this.activeFileList.push({
                    fileType: fileType,
                    raw: file.raw,
                    name: fileName
                });
            },
            divideDate(date) {
                var arr = date.split(' ');
                return arr[0];
            },
            handleClick(tab, event) {
                if (sessionStorage.getItem("hrStaffSearchData")) {
                    this.searchdata = JSON.parse(sessionStorage.getItem("hrStaffSearchData"));
                    this.searchForm = this.searchdata;
                }
                //重置表单
                this.$refs["staffForm"].resetFields();
            },
            init() {
                let json = {
                    "page.current": this.page.current,
                    "page.pageSize": this.page.pageSize
                };
                this.$get(api.hrStaff,
                    Object.assign(json, this.searchdata)
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
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.officeId = data.office.id;
                sessionStorage.setItem("hrStaffSearchData", JSON.stringify(data));
                delete data.office;
                this.searchdata = data;
            },
            handleRemove(file, fileList) {
                this.fileList = [].concat(fileList);
            },
            handleChange(file, fileList) {
                this.fileList = [].concat(fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除员工' + row.name + '及其所关联的用户账号?').then((res) => {
                    this.$del(api.hrStaff + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist';
                this.$get(api.hrStaff + '/' + row.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    data.sex = data.sex.value;
                    this.fileList = data.images.map((v, i) => {
                        return {name: '', url: v.url};
                    })
                    data.isAuth = 'N';
                    data.isAssist = 'N';
                    data.isIssuer = 'N';
                    data.isReviewer = 'N';
                    data.isSignatory = 'N';
                    if (data.staffQualifications) {
                        data.staffQualifications.forEach((v, i) => {
                            switch (v.qualificationType) {
                                case 'AUTH':
                                    data.isAuth = 'Y'
                                    data.authCategoryList = v.professionCategoryList.map((v, i) => {
                                        return v.id
                                    });
                                    break;
                                case 'ASSIST':
                                    data.isAssist = 'Y';
                                    data.assistCategoryList = v.professionCategoryList.map((v, i) => {
                                        return v.id
                                    });
                                    break;
                                case 'REVIEWER':
                                    data.isReviewer = 'Y';
                                    data.reviewerCategoryList = v.professionCategoryList.map((v, i) => {
                                        return v.id
                                    });
                                    break;
                                case 'AUTHORIZED_SIGNATORY':
                                    data.isSignatory = 'Y';
                                    data.signatoryCategoryList = v.professionCategoryList.map((v, i) => {
                                        return v.id
                                    });
                                    break;
                                case 'ISSUER':
                                    data.isIssuer = 'Y';
                                    data.issuerCategoryList = v.professionCategoryList.map((v, i) => {
                                        return v.id
                                    });
                                    break;
                            }
                        });

                    }
                    Object.assign(this.addForm, data);
                    sessionStorage.setItem("StaffManage",JSON.stringify({
                        isAdd:this.isAdd,
                        activeName:this.activeName,
                        form:this.addForm
                    }));
                }).catch((err) => {
                    console.log(err)
                });

            },
            save(formName) {
                var arr = [];
                if (this.addForm.isAuthenticator == 'Y') {
                    var professionCategoryList = this.addForm.authCategoryList.map((v, i) => {
                        return {id: v};
                    });
                    arr.push({qualificationType: 'AUTH', professionCategoryList: professionCategoryList});
                }
                if (this.addForm.isAssist == 'Y') {
                    var professionCategoryList = this.addForm.assistCategoryList.map((v, i) => {
                        return {id: v};
                    });
                    arr.push({qualificationType: 'ASSIST', professionCategoryList: professionCategoryList});
                }
                if (this.addForm.isReviewer == 'Y') {
                    var professionCategoryList = this.addForm.reviewerCategoryList.map((v, i) => {
                        return {id: v};
                    });
                    arr.push({qualificationType: 'REVIEWER', professionCategoryList: professionCategoryList});
                }
                if (this.addForm.isSignatory == 'Y') {
                    var professionCategoryList = this.addForm.signatoryCategoryList.map((v, i) => {
                        return {id: v};
                    });
                    arr.push({
                        qualificationType: 'AUTHORIZED_SIGNATORY',
                        professionCategoryList: professionCategoryList
                    });
                }
                if (this.addForm.isIssuer == 'Y') {
                    var professionCategoryList = this.addForm.issuerCategoryList.map((v, i) => {
                        return {id: v};
                    });
                    arr.push({qualificationType: 'ISSUER', professionCategoryList: professionCategoryList});
                }
                ;

                var data = JSON.parse(JSON.stringify(this.addForm));
                data.staffQualifications = [].concat(arr);
                data.office = {id: data.office.id};
                delete data.isAssist;
                delete data.isReviewer;
                delete data.isSignatory;
                delete data.isIssuer;
                delete data.authCategoryList;
                delete data.assistCategoryList;
                delete data.reviewerCategoryList;
                delete data.signatoryCategoryList;
                delete data.issuerCategoryList;
                data.images = [];

                let imageArr = [];

                this.fileList.forEach((v, i) => {
                    if (v.raw) {
                        let p = new Promise((resolve, reject) => {
                            let file = v.raw;
                            let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                            let filetype = file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length);
                            lrz(file, {width: 1280}).then(function (rst) {
                                let img = {'imageType': filetype, 'image': rst.base64};
                                data.images.push(img);
                                resolve();
                            });
                        });
                        imageArr.push(p);
                    } else {
                        data.images.push({url: v.url});
                    }

                });
                Promise.all([...this.AsyncfileArr,...imageArr]).then(res => {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if (this.activeName == 'addlist') {
                                this.$post(api.hrStaff, data).then((res) => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success'
                                        });
                                        this.init();
                                        this.$refs[formName].resetFields();
                                        this.fileList = [];
                                    }
                                }).catch((err) => {
                                    console.log(err)
                                })
                            } else {
                                this.$put(api.hrStaff + '/' + data.id, data).then((res) => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: '修改成功！',
                                            type: 'success'
                                        });
                                        this.init();
                                        this.$refs[formName].resetFields();
                                    }
                                })
                            }
                        }
                    })
                });
            },
            downTemplate() {
                this.$getFormData(api.template + '/download', {'templeleName': "员工导入模板.xlsx"}).then(res => {
                    this.download(
                        res.data, "员工导入模板.xlsx"
                    );
                }).catch(err => {
                    this.$message({
                        message: "模板下载错误，请联系管理员",
                        type: 'error'
                    });
                })
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
            handleChange(file, filelist) {
                this.templateFile = file;
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
                            this.$post(api.hrStaff + '/import', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: "导入成功！",
                                        type: 'success'
                                    });
                                    this.activeName = 'list';
                                    this.init();
                                }
                            })
                        });
                    }
                })
            },
        },
        watch: {
            activeName: function (newval, oldval) {
                if(newval){
                    sessionStorage.setItem("StaffManage",JSON.stringify({
                        isAdd:this.isAdd,
                        activeName:this.activeName,
                        form:this.addForm
                    }));
                }
                if (newval == 'list') {
                    this.isAdd = true;
                    this.fileList = [];
                    Object.assign(this.addForm, {
                        office: {},
                        authCategoryList: [],
                        assistCategoryList: [],
                        reviewerCategoryList: [],
                        signatoryCategoryList: [],
                        issuerCategoryList: [],
                        name: '',
                        sex: '',
                        birthday: '',
                        professionalTitle: '',
                        techTitle: '',
                        isAuthenticator: '',
                        licenseNumber: '',
                        certificateStartDate: '',
                        certificateExpireDate: '',
                        isAssist: '',
                        isReviewer: '',
                        isSignatory: '',
                        isIssuer: '',
                        jobNo: '',
                        graduateSchool: '',
                        graduateDate: '',
                        major: '',
                        hireDate: '',
                        workYear: '',
                        contractType: '',
                        contractYear: '',
                        contractExpireDate: '',
                        contractNum: '',
                        contractLastDate: '',
                        firstAuthDate: '',
                        leaveDate: '',
                        becomeRegularDate: '',
                        status: '',
                        hrStaffCertificates: []
                    })

                    this.$refs.staffForm.resetFields();
                    this.$refs.staffForm.clearValidate();
                }
            },
        },
        created(){
            if(sessionStorage.getItem("StaffManage")){
                let {activeName,isAdd,form} = JSON.parse(sessionStorage.getItem("StaffManage"));
                this.activeName=activeName;
                this.isAdd=isAdd;
                this.addForm=form;
            };
            this.$store.dispatch("login/headerTitleChange", "设备管理")
        },
        beforeDestroy(){
            sessionStorage.removeItem("StaffManage");
        }

    }
</script>

<style scoped>
    .title-bgcolor {
        background-color: #F5F7FA;
    }
</style>