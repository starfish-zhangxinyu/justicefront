<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="开票登记" name="RegisterInvoiceApply" v-if="activeShowRegister"></el-tab-pane>
        <el-tab-pane label="批量开票" name="BatchInvoiceApply">
            <el-form :model="makeInvoiceBatchForm" label-position="right" ref="makeInvoiceBatchForm">
                <Collapse title="案件信息" :active="true">
                    <el-table
                            :data="makeInvoiceBatchForm.invoiceList"
                            ref="invoiceList"
                            border
                            max-height="650"
                            size="small"
                            style="width: 100%">
                        <el-table-column type="index" width="50px" label="序号"></el-table-column>
                        <el-table-column prop="caseDto.entrustInfo.entrustingUnit.name" label="委托方">
                            <template slot-scope="scope">
                                                <span>{{(scope.row.caseDto.entrustInfo.entrustingUnit && scope.row.caseDto.entrustInfo.entrustingUnit.name)?
                                                 scope.row.caseDto.entrustInfo.entrustingUnit.name:scope.row.caseDto.entrustInfo.entrustingParty}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="caseDto.caseNo" width="250px" label="案件编号"></el-table-column>
                        <el-table-column prop="invoiceAmount.cent" width="100px" label="开票金额">
                            <template slot-scope="scope">
                                <span v-if="scope.row.invoiceAmount">{{scope.row.invoiceAmount.cent/100}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceType" width="120px">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>发票类型</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.invoiceType'"
                                        :rules="$filter_rules({required:true,trigger:'change'})">
                                    <select-from-dict data_type="invoice_type" :model.sync="scope.row.invoiceType"
                                                      className="multiple-select"></select-from-dict>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceCode" width="150px" label="发票代码">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.invoiceCode"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceNo" width="150px" label="发票号">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.invoiceNo"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="applyDrawer" width="150px">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>申请开票人</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.applyDrawer'"
                                        :rules="$filter_rules({required:true})">
                                    <el-input size="small" v-model="scope.row.applyDrawer"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="drawer" width="150px" v-if="lastFlow">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>开票人</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.drawer'"
                                        :rules="$filter_rules({required:true})">
                                    <el-input size="small" v-model="scope.row.drawer"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceReceiver" width="150px" label="领票人">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.invoiceReceiver"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="title" width="150px" label="开票抬头">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.title"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="taxpayerNo" width="150px" label="纳税人识别号">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.taxpayerNo"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" width="150px" label="单位地址">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.address"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phoneNo" width="150px" label="电话号码">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.phoneNo"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bank" width="150px" label="开户银行">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.bank"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bankAccount" width="150px" label="银行账号">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.bankAccount"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="makeOutDate" width="150px">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>开票日期</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.makeOutDate'"
                                        :rules="$filter_rules({required:true})">
                                    <el-date-picker
                                            size="small"
                                            style="width: 100%"
                                            v-model="scope.row.makeOutDate"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="receiveDate" width="150px">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>领票日期</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.receiveDate'"
                                        :rules="$filter_rules({required:true})">
                                    <el-date-picker
                                            size="small"
                                            style="width: 100%"
                                            v-model="scope.row.receiveDate"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="giveType" width="120px">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>递送方式</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :prop="'invoiceList.' + scope.$index + '.giveType'"
                                        :rules="$filter_rules({required:true,trigger:'change'})">
                                    <select-from-enum :model.sync="scope.row.giveType" :clearable="true"
                                                      type="ca.GiveType"></select-from-enum>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="150px" label="备注">
                            <template slot-scope="scope">
                                <el-input size="small" v-model="scope.row.remarks"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作" width="200px" align="center">
                            <template slot-scope="scope">
                                <Uploadpictures :model.sync="scope.row.images" :multiple="true"
                                                :append-to-body="true"></Uploadpictures>
                                <Czur :model.sync="scope.row.images"></Czur>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           v-if="makeInvoiceBatchForm.invoiceList.length !=1"
                                           @click="deleteCaseInvoice(scope.row,scope.$index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </Collapse>
                <el-row>
                    <el-col :span="2" :offset="10" v-if="!this.$route.query.procInsId">
                        <el-button type="primary" @click="saveBatchInvoiceApply('makeInvoiceBatchForm')">保存</el-button>
                    </el-col>
                    <el-col :span="8" :offset="8" v-if="this.$route.query.procInsId">
                        <el-form-item label="审批结果" prop="approved"
                                      :rules="$filter_rules({required:true})">
                            <el-select v-model="makeInvoiceBatchForm.approved" placeholder="请选择"
                                       :clearable="true">
                                <el-option label="通过" value="true"></el-option>
                                <el-option label="不通过" value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="10" v-if="this.$route.query.procInsId">
                        <el-button type="primary" @click="auditBatchInvoiceApply('makeInvoiceBatchForm')">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index'
    import Collapse from '../../layout/Collapse'
    import Uploadpictures from '../../../components/common/Uploadpictures'
    import Czur from '../../../components/common/Czur'

    export default {
        name: "BatchInvoiceApply",
        components: {
            'Collapse': Collapse,
            'Uploadpictures': Uploadpictures,
            'Czur': Czur
        },
        data() {
            return {
                activeName: 'BatchInvoiceApply',
                activeShowRegister: true,
                lastFlow: false,
                makeInvoiceBatchForm: {invoiceList: [], approved: ''},//批量开票表单
                auditDeleteInvoice: [],
                procInsId: '',
                taskId: '',
                initApplyDrawer: '',
                initdrawer: '',
            }
        },
        methods: {
            saveBatchInvoiceApply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = [].concat(this.makeInvoiceBatchForm.invoiceList);
                        var promiseArr = [];
                        data.forEach((v, i) => {
                            if (v.images && v.images.length) {
                                let p = new Promise((resolve, reject) => {
                                    this.$compressImages(v.images).then((res) => {
                                        v.images = res;
                                        resolve();
                                    });
                                });
                                promiseArr.push(p);
                            }
                        });
                        const loading = this.$loading({
                            lock: true,
                            text: '正在提交申请，请稍等...',
                            spinner: 'el-icon-loading'
                        });
                        Promise.all(promiseArr).then((res) => {
                            this.$post(api.invoicesApply + '/saveBatch', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '批量开票申请成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/case/case-list'});
                                }
                                loading.close();
                            }).catch((err) => {
                                loading.close();
                                if (err.errCode) {
                                    this.$message.error(err.errMsg);
                                } else {
                                    console.log(err)
                                }
                            });
                        });

                    }
                });
            },
            auditBatchInvoiceApply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = [].concat(this.makeInvoiceBatchForm.invoiceList);
                        var promiseArr = [];
                        data.forEach((v, i) => {
                            if (v.images && v.images.length) {
                                let p = new Promise((resolve, reject) => {
                                    this.$compressImages(v.images).then((res) => {
                                        v.images = res;
                                        resolve();
                                    });
                                });
                                promiseArr.push(p);
                            }
                        });
                        //申请
                        var flowInvoiceApply = {
                            procInsId: this.procInsId,
                            taskId: this.taskId,
                            flowInvoiceDtoList: data,
                            auditResult: {
                                approved: this.makeInvoiceBatchForm.approved
                            },
                            auditDeleteInvoices: this.auditDeleteInvoice
                        };
                        const loading = this.$loading({
                            lock: true,
                            text: '正在提交审批，请稍等...',
                            spinner: 'el-icon-loading'
                        });
                        Promise.all(promiseArr).then((res) => {
                            this.$post(api.invoicesApply + '/batch-audit', flowInvoiceApply).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '审批成功！',
                                        type: 'success'
                                    });
                                    // this.$router.push({
                                    //     path: '/mydashboard',
                                    // });
                                    this.$router.go(-1);
                                }
                                loading.close();
                            }).catch((err) => {
                                loading.close();
                                if (err.errCode) {
                                    this.$message.error(err.errMsg);
                                } else {
                                    console.log(err)
                                }
                            });
                        });

                    }
                });
            },
            deleteCaseInvoice(row, index) {
                this.makeInvoiceBatchForm.invoiceList.splice(index, 1);
                if (row.id) {
                    this.auditDeleteInvoice.push(row.id);
                }
            }
        },
        async created() {
            this.$store.dispatch("login/headerTitleChange", "开票申请");
            if (this.$route.query.activeShow == "F") {
                this.activeShowRegister = false;
            } else {
                this.activeShowRegister = true;
            }
            //最后一个流程
            if (this.$route.query.lastFlow == "T") {
                this.lastFlow = true;
            } else {
                this.lastFlow = false;
            }
            var procInsId = this.$route.query.procInsId;
            this.procInsId = procInsId;
            this.taskId = this.$route.query.taskId;
            if (procInsId) {
                if (this.$route.query.lastFlow == "T") {
                    await this.$get(api.myInfo).then((res) => {
                        var data = JSON.parse(JSON.stringify(res.data));
                        this.initdrawer = (data.hrStaff == undefined ? '' : data.hrStaff.name);
                    });
                }
                await this.$get(api.invoicesApply + '/batch-apply-info?procInsId=' + procInsId + "&isList=N").then((res) => {
                    if (res.status == 200) {
                        var applyInfo = res.data;
                        var invoiceInfos = applyInfo.flowInvoiceDtoList;
                        invoiceInfos.forEach((v, i) => {
                            console.log("v.invoiceAmount",v)
                            v.drawer = this.initdrawer;
                            // v.invoiceAmount = {cent: v.caseDto.financeInfo.amountReceivable.cent - v.caseDto.financeInfo.invoiceAmount.cent}
                            v.invoiceAmount = {cent: v.invoiceAmount.cent}
                            this.makeInvoiceBatchForm.invoiceList.push(v);
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                });
            } else {
                await this.$get(api.myInfo).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.initApplyDrawer = (data.hrStaff == undefined ? '' : data.hrStaff.name);
                });
                var caseIds = this.$route.query.caseIds;
                var idList = caseIds.substr(0, caseIds.length - 1).split(",");
                await this.$post(api.finance + '/byIds', idList).then((res) => {
                    var caseDtos = res.data;
                    caseDtos.forEach((v, i) => {
                        var temp = {
                            caseDto: {
                                id: v.id,
                                caseNo: v.caseNo,
                                entrustInfo: v.entrustInfo
                            },
                            invoiceAmount: {cent: v.financeInfo.amountReceivable.cent - v.financeInfo.invoiceAmount.cent},
                            applyDrawer: this.initApplyDrawer
                        };
                        this.makeInvoiceBatchForm.invoiceList.push(temp);
                    })
                }).catch((err) => {
                    console.log(err)
                });

            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'RegisterInvoiceApply') {
                    this.$router.push({
                        path: '/case/make-invoice-apply',
                        query: {
                            'caseIds': this.$route.query.caseIds,
                            'procInsId': this.$route.query.procInsId,
                            'taskId': this.$route.query.taskId,
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
    }

</script>

<style scoped>

</style>