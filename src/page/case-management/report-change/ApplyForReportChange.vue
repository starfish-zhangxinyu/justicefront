<template>
    <div>
        <CaseDetail :caseId="caseId"></CaseDetail>
        <Portlet title="报告变更申请">
            <template slot="body">
                <el-form :model="form" size="small" ref="form" label-width="130px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="变更原因" prop="reason" :rules="$filter_rules({required:true})">
                                <select-from-dict
                                        className="multiple-select"
                                        :model.sync="form.reason"
                                        :disabled="isAudit"
                                        data_type="report_change_reason"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.reason && form.reason.label == '其他'">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="其他理由" :rules="$filter_rules({required:true})" prop="otherReason">
                                <el-input type="textarea" v-model="form.otherReason"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="委托方情况说明">
                                <el-col :lg="{span:24}" v-if="!isAudit">
                                    <el-upload
                                            class="upload-demo"
                                            action="#"
                                            :auto-upload="false"
                                            :show-file-list="false"
                                            :on-change="(file,fileList)=>{handleChange(file,fileList,'entrustExplainFile')}"
                                            style="width:100px;display: inline-block">
                                        <el-button type="primary" size="small">请选择文件</el-button>
                                    </el-upload>
                                    <el-tag style="margin-right: 5px"
                                            @close="handleClose(tag)"
                                            v-for="tag in entrustExplainFile"
                                            :key="tag.name"
                                            closable>
                                        {{tag.name}}
                                    </el-tag>
                                </el-col>
                                <el-col :lg="{span:24}" v-else>
                                    <span v-if="form.entrustingInfoFileList.length==0"
                                          class="el-form-item__label">暂无附件</span>
                                    <!-- <a  v-for="(v,i) in form.entrustingInfoFileList" :key="i" :href="v.url" download="11.png">下载附件{{i+1}}</a> -->
                                    <el-link v-for="(v,i) in form.entrustingInfoFileList" download="11" :href="v.url"
                                             :key="i" target="_blank" class="downLoadLink" type="primary">下载附件{{i+1}}
                                    </el-link>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="投诉类型" prop="complaintType" :rules="$filter_rules({required:true})">
                                <select-from-dict
                                        className="multiple-select"
                                        :disabled="isAudit"
                                        :model.sync="form.complaintType"
                                        data_type="complaint_type"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="更改内容" prop="changePartList" :rules="$filter_rules({required:true})">
                                <el-checkbox-group v-model="form.changePartList" :disabled="isAudit">
                                    <el-checkbox
                                            v-for="item in changePartGroup"
                                            :key="item.id"
                                            :label="item.id">
                                        {{item.label}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="更改内容摘要" prop="changeContent" :rules="$filter_rules({required:true})">
                                <el-input v-model="form.changeContent" type="textarea" :disabled="isAudit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="报告变更类型" prop="reportChangeType"
                                          :rules="$filter_rules({required:true})">
                                <el-radio-group v-model="form.reportChangeType" :disabled="isAudit">
                                    <!-- <el-radio label="0" v-if="!checkSysDictAuthRecordId">出具补正书</el-radio> -->
                                    <el-radio label="0">出具补正书</el-radio>
                                    <el-radio label="1">重出鉴定意见书</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}" v-if="form.reportChangeType=='0'">
                            <el-form-item label="补正书">
                                <el-col :lg="{span:24}">
                                    <el-button type="primary" size="small" @click="editReportChangeFile">编辑补正书
                                    </el-button>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.reportChangeType=='1'">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="原报告是否收回" prop="reportReceive" :rules="$filter_rules({required:true})">
                                <el-radio-group v-model="form.reportReceive" :disabled="isAudit">
                                    <el-radio label="0">已收回</el-radio>
                                    <el-radio label="1">无法收回</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row v-if="form.reportChangeType=='1'">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="报告附件上传">
                                <el-col :lg="{span:24}" v-if="!isAudit">
                                    <el-upload
                                            class="upload-demo"
                                            action="#"
                                            :auto-upload="false"
                                            :show-file-list="false"
                                            :on-change="(file,fileList)=>{handleChange(file,fileList,'presentationFile')}"
                                            style="width:100px;display: inline-block">
                                        <el-button type="primary" size="small">请选择文件</el-button>
                                    </el-upload>
                                    <el-tag style="margin-right: 5px"
                                            @close="handleClose2(tag)"
                                            v-for="tag in presentationFile"
                                            :key="tag.name"
                                            closable>
                                        {{tag.name}}
                                    </el-tag>
                                </el-col>
                                <el-col :lg="{span:24}" v-else>
                                    <span v-if="form.reportFileList && form.reportFileList.length==0"
                                          class="el-form-item__label">暂无附件</span>
                                    <el-link v-for="(v,i) in form.reportFileList" :key="i" :href="v.url" target="_blank"
                                             class="downLoadLink" type="primary">下载附件{{i+1}}
                                    </el-link>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-if="form.reportChangeType=='1'">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="案件号更改" :rules="$filter_rules({required:true})">
                                <el-radio-group v-model="form.caseNoChange" :disabled="isAudit">
                                    <el-radio label="0">案件号不变</el-radio>
                                    <el-radio label="1">案件号改变</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row v-if="form.caseNoChange=='1' && caseNoRuleReportChange.length==0">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="案件编号" :rules="$filter_rules({required:true})">
                                <el-radio-group v-model="form.isAutoCaseNo" :disabled="isAudit">
                                    <el-radio label="0">自动编号</el-radio>
                                    <el-radio label="1">手动编号</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    
                    <!-- <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="顺序号" prop="newCaseNo"
                                          :rules="$filter_rules({required:true})">
                                <el-input v-model="form.newCaseNo" size="mini" :disabled="isAudit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    <el-row v-if="form.reportChangeType=='1' && form.caseNoChange=='1'  && caseNoRuleReportChange.length==0">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="鉴定意见书类型" prop="reportTypeFlag"
                                        :rules="$filter_rules({required:true, trigger: 'change'})">
                                <select-from-dict data_type="report_type_flag" :model.sync="form.reportTypeFlag" :disabled="isAudit"
                                                :modelId="false"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.reportChangeType=='1' && form.caseNoChange=='1'  && caseNoRuleReportChange.length==0">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="案号标志" prop="caseNoFlag"
                                        :rules="$filter_rules({required:true, trigger: 'change'})">
                                <el-select v-model="form.caseNoFlag" placeholder="请选择" size="mini" :disabled="isAudit">
                                    <el-option v-for="item in caseMarkOpt" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.reportChangeType=='1' && form.caseNoChange=='1' && caseNoRuleReportChange.length==0" >
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="编号" prop="radio"
                                        :rules="$filter_rules({required:true, trigger: 'change'})">
                                <el-radio-group v-model="form.radio" size="mini" :disabled="isAudit">
                                    <el-radio label="N">自动分配</el-radio>
                                    <el-radio label="Y">手动分配</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template v-if="form.reportChangeType=='1' && form.caseNoChange=='1' && form.radio=='Y' && caseNoRuleReportChange.length==0">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="年份" prop="caseNoYear" :rules="$filter_rules({required:true})">
                                <el-date-picker size="mini" v-model="form.caseNoYear" type="year"
                                                value-format="yyyy" placeholder="选择年" :disabled="isAudit">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.reportChangeType=='1' && form.caseNoChange=='1' && form.radio=='Y' && caseNoRuleReportChange.length==0">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="顺序号" prop="caseNoSequence" :rules="$filter_rules({required:true})">
                                <el-input v-model="form.caseNoSequence" size="mini" :disabled="isAudit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </template>
                    <el-row v-if="isAudit">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="审批结果" prop="auditResult.approved"
                                          :rules="$filter_rules({required:true,trigger:'change'})">
                                <el-select v-model="form.auditResult.approved" placeholder="请选择">
                                    <el-option label="同意" :value="true"></el-option>
                                    <el-option label="不同意" :value="false"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if=" form.auditResult.approved==false">
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="原因" prop="auditResult.comment"
                                          :rules="$filter_rules({required:true})">
                                <el-input size="small" type="textarea" :rows="3"
                                          v-model="form.auditResult.comment"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('form')"><i
                                class="fa fa-save"></i>保存
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="goBack"><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </template>
        </Portlet>

        <!--补正书打印窗口开始-->
        <el-dialog title="补正书" :visible.sync="showListFormFileDialog">
            <div style="margin-top: 10px">
                <Table
                        :data.sync="listFormFileData"
                        :search.sync="listFormFileSearchData"
                        :sort.sync="listFormFileTableSort"
                        :page.sync="listFormFilePage"
                        port="template"
                        :hasPaging="true"
                        :selfDefinedBtn="true">
                    <template solt>
                        <el-table-column
                                prop="name"
                                label="表单名称"
                        ></el-table-column>
                        <el-table-column label="操作" align="center" width="300px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="printForm(scope.row,'N')">编辑补正书
                                </el-button>
                            </template>
                        </el-table-column>
                    </template>
                </Table>
            </div>
        </el-dialog>
        <!--补正书打印窗口结束-->
    </div>
</template>

<script>
    import api from '../../../api/index'
    import portlet from './../../layout/Portlet'
    import caseDetail from './../../../components/common/CaseDetail'
    import PageOfficeApi from '../../../components/tpl/PageOfficeApi'

    export default {
        name: "ApplyForReportChange",
        components: {'Portlet': portlet, 'CaseDetail': caseDetail},
        data() {
            return {
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                form: {changePartList: [], auditResult: {}, reportChangeType: ''},
                changePartGroup: [],
                caseId: '',
                caseNo: '',
                isAudit: false,
                entrustExplainFile: [],//委托方情况说明
                correctionsFile: [],//这个先不管
                presentationFile: [],//报告附件上传
                sysDictAuthRecordId: '',//字典表中鉴定意见的Id
                checkSysDictAuthRecordId: false, //更改内容是否选中鉴定意见
                //补正书打印相关
                showListFormFileDialog: false,
                listFormFileData: [],
                listFormFileSearchData: {},
                listFormFileTableSort: null,
                listFormFilePage: {pageSizes: [5, 10, 20], pageSize: 5, total: 0, current: 1},
                caseNoRuleReportChange: '',
                caseMarkOpt: [],
            }
        },
        methods: {
            handleChange(file, fileList, arrName) {
                this[arrName].push(file);
            },
            handleClose(tag) {
                var index = this._.findIndex(this.entrustExplainFile, function (o) {
                    return o.uid == tag.uid;
                });
                this.entrustExplainFile.splice(index, 1);
            },
            handleClose1(tag) {
                var index = this._.findIndex(this.correctionsFile, function (o) {
                    return o.uid == tag.uid;
                });
                this.correctionsFile.splice(index, 1);
            },
            handleClose2(tag) {
                var index = this._.findIndex(this.presentationFile, function (o) {
                    return o.uid == tag.uid;
                });
                this.presentationFile.splice(index, 1);
            },
            //补正书相关
            editReportChangeFile() {
                var reportChangeFile = this.form.reportChangeFile;
                let p1 = new Promise((resolve, reject) => {
                    if (!reportChangeFile) {
                        //查询是否有已经保存的补正书，如果有则编辑，没有则选择
                        this.$get(api.tplFormFile + '/report-change-file?caseId=' + this.$route.query.caseId).then((res) => {
                            if (res.data) {
                                reportChangeFile = res.data.formFile;
                                this.form.reportChangeFile = res.data.formFile;
                            }
                            resolve();
                        })
                    } else {
                        resolve();
                    }
                });
                Promise.all([p1]).then(() => {
                    if (reportChangeFile) {
                        PageOfficeApi.openDoc(reportChangeFile, 'Y');
                    } else {
                        this.listFormFileSearchData = {
                            professionCategoryId: this.$route.query.professionCategoryId,
                            formLocation: 'REPORT_CHANGE',
                            templateType: 'FORM',
                        };
                        this.showListFormFileDialog = true;//打开模态框
                    }
                })

            },
            printForm(row, isReCreate) {
                PageOfficeApi.renderForm(this.caseId, null, row.id, isReCreate)
            },

            /*
            * 传入文件数组，返回文件base64
            */
            fileYs(fileArr) {
                return new Promise((resolve1, reject1) => {
                    let arrPromise = [];
                    fileArr.forEach((v, i) => {
                        let name = v.raw.name.split('.')[0];
                        let type = v.raw.name.split('.').reverse()[0];
                        let p = new Promise((resolve, reject) => {
                            if (v.raw.type && v.raw.type.split('/')[0] == "image") {//判断是不是图片
                                this.$compressImages([v]).then(response => {
                                    resolve({
                                        base64Str: response[0].image,
                                        name: name,
                                        url: '',
                                        fileType: type
                                    });
                                });
                            } else {
                                this.$getBase64(v.raw).then(response => {
                                    resolve({
                                        base64Str: response,
                                        name: name,
                                        url: '',
                                        fileType: type
                                    });
                                });
                            }
                        });
                        arrPromise.push(p);
                    });
                    Promise.all(arrPromise).then(res => {
                        resolve1(res);
                    });
                })
            },
            downLoad(url) {
                debugger
                var a = document.createElement('a');          // 创建一个a节点插入的document
                var event = new MouseEvent('click')           // 模拟鼠标click点击事件
                a.download = '附件'                  // 设置a节点的download属性值
                a.href = url;                                 // 将图片的src赋值给a节点的href
                a.dispatchEvent(event)                        // 触发鼠标点击事件
            },
            async save(formName) {
                let {entrustExplainFile, presentationFile} = this;
                let presentArr = await this.fileYs(presentationFile);//报告附件
                let entrustArr = await this.fileYs(entrustExplainFile);//委托方情况附件
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAudit) {
                            var data = {
                                auditResult: this.form.auditResult,
                                procInsId: this.$route.query.procInsId,
                                taskId: this.$route.query.taskId,
                                id: this.form.id,
                                caseDto: this.form.caseDto,
                                changeType: 'REPORT_CHANGE',
                            };
                            this.$put(api.caseChange + '/audit', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    })
                                }
                                this.$router.go(-1);
                            }).catch((err) => {
                                this.$message.error(err.errMsg);
                            })
                        } else {
                            var data = JSON.parse(JSON.stringify(this.form));
                            //处理附件
                            data.entrustingInfoFileList = entrustArr;
                            data.reportFileList = presentArr;
                            //处理更改内容
                            var changePart = '';
                            data.changePartList.forEach((v, i) => {
                                changePart += (v + ",");
                            });
                            data.changePart = changePart.substr(0, changePart.length - 1);
                            delete data.changePartList;
                            debugger
                            //处理案件编号规则
                            if (data.caseNoChange == '1') {//选择案件号变更
                                if(data.reportTypeFlag){
                                    data.newCaseNo = data.reportTypeFlag.label + "/" + data.caseNoFlag + "/" +(data.caseNoYear==null?'':data.caseNoYear) + "/" + (data.caseNoSequence==null?'':data.caseNoSequence);
                                }else{
                                    data.newCaseNo = '////';
                                }
                                data.oldCaseNo = this.caseNo;
                            } else {
                                delete data.newCaseNo;
                            }
                            delete data.isAutoCaseNo;
                            data.caseDto = {id: this.caseId};
                            data.changeType = 'REPORT_CHANGE';
                            data.reason = data.reason.label;
                            if (data.otherReason && data.otherReason.length > 0) {
                                data.reason = data.otherReason;
                            }
                            this.$post(api.caseChange + '/apply', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    })
                                }
                                this.$router.go(-1);
                            }).catch((err) => {
                                this.$message.error(err.errMsg);
                            })
                        }
                    }
                });
            },
            goBack() {
                this.$router.go(-1)
            }
        },
        watch: {
            'form.reportChangeReason.label': {
                handler(newVal, oldVal) {
                    if (oldVal && oldVal == '报告已发出，系委托方提供信息有误') {
                        this.entrustExplainFile = [];
                    }
                },
            },
            'form.changePartList': {
                //如果选中了鉴定意见，则报告变更类型仅仅为重出鉴定意见书
                handler(newVal, oldVal) {
                    /* var flag = false;
                    newVal.forEach(v => {
                        if (v == this.sysDictAuthRecordId) {
                            flag = true;
                            return;
                        }
                    });
                    if (flag) {
                        this.checkSysDictAuthRecordId = true;
                        this.form.reportChangeType = '1';
                    } else {
                        this.checkSysDictAuthRecordId = false;
                    } */
                },
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "报告变更申请")
            this.caseId = this.$route.query.caseId;
            this.caseNo = this.$route.query.caseNo;
            if (this.$route.query.procInsId) {
                this.isAudit = true;
                this.$get(api.caseChange + '/get?caseId=' + this.$route.query.caseId + '&procInsId=' + this.$route.query.procInsId).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    //处理更改内容
                    var changePartList = data.changePart.split(",");
                    data.changePartList = changePartList;
                    //处理案件编号
                    if (data.caseNoChange == '1') {
                        if(data.newCaseNo){
                            let noParts =  data.newCaseNo.split("/");
                            data.reportTypeFlag=noParts[0]
                            data.caseNoFlag=noParts[1]
                            if (noParts[3] && noParts[2]) {
                                data.radio = 'Y';//手动分配
                                data.caseNoYear=noParts[2];
                                data.caseNoSequence=noParts[3];
                            } else {
                                data.radio = 'N';
                            }
                        }else{
                            data.radio = 'N';
                        }
                        
                    }
                    data.auditResult = {approved: undefined}
                    this.form = data;
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                this.$get('/api/param/v1/params/value', {
                        professionCategoryId: this.$route.query.professionCategoryId,
                        key: 'case.no.mark'
                    }).then((res) => {
                        if (res.status == 200) {
                            var arr = res.data.split('，');
                            console.log(arr);
                            this.caseMarkOpt = arr;
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
            }

            var data = {};
            data['page.pageSize'] = 1000;
            data['page.current'] = 1;
            data.type = 'change_part';
            this.$get(api.dict, data).then((res) => {
                this.changePartGroup = res.data.list;
                this.changePartGroup.forEach(v => {
                    if (v.label == "鉴定意见") {
                        this.sysDictAuthRecordId = v.id;
                        return;
                    }
                })
            }).catch((err) => {
                console.log(err)
            })
            //获取报告变更的案件编号规则
            this.$get(api.param + "/value", {key: 'case.no.rule.reportChange'}).then((res) => {
                this.caseNoRuleReportChange = res.data;
            }).catch((err) => {
                console.log(err)
            });
        }
    }
</script>

<style scoped lang="less">
    [v-cloak] {
        display: none;
    }

    .label {
        color: #1f2f3d;
        /*color:#428bca;*/
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        padding-bottom: 16px;
        margin-right: 8px;
        white-space: nowrap;
        display: table-cell;

        &:after {
            content: ":";
            margin: 0 8px 0 2px;
            position: relative;
            top: -0.5px;
        }
    }

    .detail {
        font-size: 14px;
        line-height: 1.5;
        width: 100%;
        padding-bottom: 16px;
        /*color: #909399;*/
        color: #666666;
        display: table-cell;
    }

    .downLoadLink {
        height: 20px;
        line-height: 20px;
        margin-right: 10px;
    }
</style>