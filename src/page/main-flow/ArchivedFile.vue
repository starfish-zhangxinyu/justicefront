<template>
    <div>
        <PageBar title1="业务流程" title2="归档"></PageBar>
        <CaseDetail :case-id="caseId" @detailMsg="getMSg(msg)"></CaseDetail>
        <el-form :model="archivedFileForm" size="small" ref="archivedFileForm" label-width="80px">
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="归档日期" :rules="$filter_rules({required:true})" prop="archiveDate">
                        <el-date-picker
                                style="width: 100%"
                                v-model="archivedFileForm.archiveDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="立卷人" prop="rollupPerson" :rules="$filter_rules({required:true})"
                                  v-if="archivedFileForm.rollupPerson">
                        <el-select class="w100" v-model="archivedFileForm.rollupPerson.label" labelfilterable>
                            <el-option
                                    v-for="item in sysUserListData"
                                    :key="item.id"
                                    :label="item.hrStaff.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="归档人" prop="archivePerson" :rules="$filter_rules({required:true})"
                                  v-if="archivedFileForm.archivePerson">
                        <el-select class="w100" v-model="archivedFileForm.archivePerson.label"
                                   labelfilterable>
                            <el-option
                                    v-for="item in sysUserListData"
                                    :key="item.id"
                                    :label="item.hrStaff.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="存放位置" :rules="$filter_rules({required:true,trigger:'change'})"
                                  prop="location">
                        <select-from-dict :className="'w100'" :model.sync="archivedFileForm.location"
                                          data_type="location"></select-from-dict>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="存档期限" :rules="$filter_rules({required:true,trigger:'change'})"
                                  prop="storeTime">
                        <select-from-dict :className="'w100'" :model.sync="archivedFileForm.storeTime"
                                          data_type="archive_store_time"></select-from-dict>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="案件类型">
                        <select-from-dict :className="'w100'" :model.sync="archivedFileForm.caseType"
                                          data_type="case_type"></select-from-dict>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="备注">
                        <el-input v-model="archivedFileForm.remarks" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="20" :offset="2">
                    :rules="$filter_rules({required:true})" prop="name"
                    <el-form-item label="归档人" prop="archivePerson">
                        <treeSelect title="归档人" :model.sync="archivedFileForm.aa" name="officeGroup" :inside="true"></treeSelect>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="保管期限" :rules="$filter_rules({required:true})" prop="storeTime">
                    <select-from-dict :model.sync="archivedFileForm.storeTime" data_type="archive_store_time"></select-from-dict>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="放置位置">
                    <el-input v-model="archivedFileForm.location"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="归档日期" :rules="$filter_rules({required:true})" prop="archiveDate">
                    <el-date-picker
                            style="width: 100%"
                            v-model="archivedFileForm.archiveDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="案件类型">
                    <select-from-dict :model.sync="archivedFileForm.caseType" data_type="case_type"></select-from-dict>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="备注">
                    <el-input v-model="archivedFileForm.remarks" type="textarea"></el-input>
                </el-form-item>
            </el-col>
        </el-row> -->
        </el-form>
        <el-row>
            <el-col :span="2" :offset="11">
                <el-button type="success" size="mini" class="save-btn" @click="save('save')"><i
                        class="fa fa-save"></i> 保存
                </el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="mini" class="save-btn" @click="save('complete')">
                    完成
                </el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="mini" class="save-btn" @click="printFormFile()">
                    打印表单
                </el-button>
            </el-col>
        </el-row>
        <!--表单打印窗口开始-->
        <el-dialog title="表单打印" :visible.sync="showListFormFileDialog">
            <div style="margin-top: 10px">
                <!--<el-button size="mini" type="primary" @click="formFilePrint">打印表单</el-button>-->
                <Table :data.sync="listFormFileData" :search.sync="listFormFileSearchData"
                       @selectChange="handleFormSelectCheck" :isSelect="true"
                       :sort.sync="listFormFileTableSort" :page.sync="listFormFilePage" port="template"
                       :hasPaging="true" :selfDefinedBtn="true">
                    <template solt>
                        <el-table-column fixed width="55" type="selection"></el-table-column>
                        <el-table-column prop="name" label="表单名称"></el-table-column>
                        <el-table-column label="操作" align="center" width="300px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="printForm(scope.row,'Y')">重新渲染表单
                                </el-button>
                                <el-button size="mini" type="primary" @click="printForm(scope.row,'N')">打印表单</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </Table>
            </div>
        </el-dialog>
        <!--表单打印窗口结束-->
    </div>
</template>

<script>
    import CaseDetail from '../../components/common/CaseDetail'
    import TreeSelect from '../../components/common/TreeSelect'
    import api from '../../api/index'
    import PageOfficeApi from "../../components/tpl/PageOfficeApi";

    export default {
        name: "ArchivedFile",
        components: {'CaseDetail': CaseDetail, 'TreeSelect': TreeSelect},
        data() {
            return {
                archivedFileForm: {
                    caseType: {id: ''},
                    archivePerson: {id: ''},
                    rollupPerson: {id: ''},
                },
                caseId: '',
                taskId: '',
                sysUserListData: [],//用户数据

                //表单打印相关
                showListFormFileDialog: false,
                listFormFileData: [],
                listFormFileSearchData: {},
                listFormFileTableSort: null,
                listFormFilePage: {
                    pageSizes: [30, 50, 80, 100],
                    pageSize: 5,
                    total: 0,
                    current: 1
                },
                authObjectType: null,
            }
        },
        methods: {
            save(type) {
                this.$refs['archivedFileForm'].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.archivedFileForm));
                        var flagRollupPerson = 0;
                        var flagArchivePerson = 0;
                        data.caseId = this.$route.query.caseId;
                        data.type = type;
                        data.taskId = this.taskId;
                        data.procInsId = this.procInsId;

                        //判读选项卡value是否等于选项卡Text，如果是其判断标签+1
                        this.sysUserListData.forEach((v, i) => {
                            if (data.rollupPerson.label == v.hrStaff.name) {
                                data.rollupPerson.id = v.id;
                                flagRollupPerson++;
                            }
                            if (data.archivePerson.label == v.hrStaff.name) {
                                data.archivePerson.id = v.id;
                                flagArchivePerson++;
                            }
                        })
                        if (flagRollupPerson == 0)
                            data.rollupPerson.id = this.archivedFileForm.rollupPerson.label;
                        if (flagArchivePerson == 0)
                            data.archivePerson.id = this.archivedFileForm.archivePerson.label;
                        let myLoading = this.$loading({fullscreen: true});
                        this.$put('/api/ca-archive/v1/archives', data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                this.init(myLoading);
                            }
                            if (type == 'complete') {
                                this.$router.push("/home");
                            }
                        }).catch((err) => {
                            console.log(err)
                            myLoading.close();
                        })
                    } else {
                        return false;
                    }
                })

            },
            printFormFile() {
                //打印表单
                let currentCase = this.detailMsg;

                this.listFormFileSearchData = {
                    professionCategoryId: currentCase.professionCategory.id,
                    formLocation: "ARCHIVED",
                    templateType: 'FORM',
                }
                this.showListFormFileDialog = true; //打开模态框
            },
            handleFormSelectCheck() {

            },
            printForm(row, isReCreate) {
                var caseId = this.detailMsg.id;
                PageOfficeApi.renderForm(caseId, null, row.id, isReCreate)
            },
            init(loading) {
                this.caseId = this.$route.query.caseId;
                this.taskId = this.$route.query.taskId;
                this.procInsId = this.$route.query.procInsId;
                this.$get('/api/ca-case/v1/cases/entrust-info/' + this.caseId).then((res) => {
                    if (res.status == 200) {
                        this.detailMsg = res.data;
                        this.$get('/api/ca-archive/v1/archives/' + this.caseId).then((res) => {
                            if (res.data) {
                                var data = JSON.parse(JSON.stringify(res.data));
                                this.archivedFileForm = data;
                                if (res.data.archivePerson == null) {
                                    //获取当前用户
                                    this.$get(api.myInfo).then((res) => {
                                        var myInfo = JSON.parse(JSON.stringify(res.data));
                                        this.archivedFileForm.archivePerson = myInfo
                                    });
                                }
                                if (this.archivedFileForm.rollupPerson == null)
                                    this.archivedFileForm.rollupPerson = this.detailMsg.auth1.participant
                            } else {
                                this.$get(api.myInfo).then((res) => {
                                    var myInfo = JSON.parse(JSON.stringify(res.data));
                                    this.archivedFileForm = {
                                        caseType: {id: ''},
                                        archivePerson: myInfo,
                                        rollupPerson: this.detailMsg.auth1.participant,
                                    }
                                });
                            }
                            this.archivedFileDialog = true;
                            if (loading) {
                                loading.close();
                            }
                        }).catch((err) => {
                            if (loading) {
                                loading.close();
                            }
                        });

                    }
                }).catch((err) => {
                    if (loading) {
                        loading.close();
                    }
                    console.log(err)
                });
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "归档")
            this.init();

            var temp = {};
            temp['page.pageSize'] = 1000;
            temp['page.current'] = 1;
            this.$get('/api/user/v1/users', temp).then((res) => {
                let arr = [];
                res.data.list.forEach((v, i) => {
                    if (v.hrStaff) {
                        arr.push(v)
                    }
                });
                this.sysUserListData = arr;
            }).catch((err) => {
                console.log(err)
            });

        }
    }
</script>

<style scoped>

</style>