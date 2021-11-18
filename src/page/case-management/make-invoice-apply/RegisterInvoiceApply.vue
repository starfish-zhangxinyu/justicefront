<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="开票登记" name="RegisterInvoiceApply">
            <Collapse title="案件信息" :active="true">
                <el-table
                        :data="tableData"
                        border
                        show-summary
                        :summary-method="getSummaries"
                        max-height="250"
                        size="small"
                        style="width: 100%">
                    <el-table-column prop="entrustInfo.entrustingUnit.name" label="委托方">
                        <template slot-scope="scope">
                                                    <span>{{(scope.row.entrustInfo.entrustingUnit && scope.row.entrustInfo.entrustingUnit.name)?
                                                     scope.row.entrustInfo.entrustingUnit.name:scope.row.entrustInfo.entrustingParty}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="professionCategory.name" label="专业类别"></el-table-column>
                    <el-table-column prop="caseNo" label="案件编号"></el-table-column>
                    <el-table-column prop="financeInfo.amount" label="合同金额">
                        <template slot-scope="scope">
                            <span v-if="scope.row.financeInfo.amount">{{scope.row.financeInfo.amount.cent/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="financeInfo.discount" label="减免金额">
                        <template slot-scope="scope">
                            <span v-if="scope.row.financeInfo.discount">{{scope.row.financeInfo.discount.cent/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="financeInfo.amountRefund" label="退费金额">
                        <template slot-scope="scope">
                            <span v-if="scope.row.financeInfo.amountRefund">{{scope.row.financeInfo.amountRefund.cent/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="financeInfo.invoiceAmount" label="已开金额">
                        <template slot-scope="scope">
                            <span v-if="scope.row.financeInfo.invoiceAmount">{{scope.row.financeInfo.invoiceAmount.cent/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="待开金额">
                        <template slot-scope="scope">
                            <span v-if="scope.row.financeInfo.invoiceAmount">{{(scope.row.financeInfo.amountReceivable.cent-scope.row.financeInfo.invoiceAmount.cent)/100}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </Collapse>
            <el-form :model="makeInvoiceForm" label-position="right" ref="makeInvoiceForm">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="发票类型" label-width="40%" prop="invoiceType"
                                      :rules="$filter_rules({required:true, trigger: 'change'})">
                            <select-from-dict data_type="invoice_type" :model.sync="makeInvoiceForm.invoiceType"
                                              className="multiple-select"></select-from-dict>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="开票日期" label-width="40%" prop="makeOutDate"
                                      :rules="$filter_rules({required:true, trigger: 'change'})">
                            <el-date-picker
                                    size="small"
                                    style="width: 100%"
                                    v-model="makeInvoiceForm.makeOutDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="领票日期" label-width="40%" prop="receiveDate"
                                      :rules="$filter_rules({required:true, trigger: 'change'})">
                            <el-date-picker
                                    size="small"
                                    style="width: 100%"
                                    v-model="makeInvoiceForm.receiveDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="申请开票人" label-width="40%" prop="applyDrawer"
                                      :rules="$filter_rules({required:true, trigger: 'change'})">
                            <el-input size="small" v-model="makeInvoiceForm.applyDrawer"
                                      :disabled="applyDrawerDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1" v-if="lastFlow">
                        <el-form-item label="开票人" label-width="40%" prop="drawer"
                                      :rules="$filter_rules({required:lastFlow, trigger: 'change'})">
                            <el-input size="small" v-model="makeInvoiceForm.drawer"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="递送方式" label-width="40%" prop="giveType"
                                      :rules="$filter_rules({required:true, trigger: 'change'})">
                            <select-from-enum :model.sync="makeInvoiceForm.giveType" :clearable="true"
                                              type="ca.GiveType"></select-from-enum>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="portlet">
                    <div class="portlet-header">
                        <span>开票信息</span>
                        <el-button type="primary" icon="el-icon-plus" size="mini"
                                   style="float: right;margin-right: 10px;margin-top: 5px"
                                   @click="addRow">
                            增加
                        </el-button>
                    </div>
                    <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                        <el-table
                                :data="makeInvoiceForm.invoiceList"
                                border
                                size="small"
                                style="width: 100%"
                                show-summary
                                ref="table2"
                                :summary-method="getSummaries2"
                        >
                            <el-table-column prop="invoiceCode" label="发票代码" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.invoiceCode'">
                                        <el-input size="small" v-model="scope.row.invoiceCode"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoiceNo" label="发票号" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.invoiceNo'">
                                        <el-input size="small" v-model="scope.row.invoiceNo"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoiceAmount" width="150px">
                                <template slot="header" slot-scope="{ column, $index }">
                                    <i style="color: red;margin-right: 5px">*</i><span>开票金额</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                            :prop="'invoiceList.' + scope.$index + '.invoiceAmount'"
                                            :rules="$filter_rules({required: true})" size="mini">
                                        <el-input-number :precision="2" size="mini"
                                                         v-model="scope.row.invoiceAmount" controls-position="right"
                                                         :min="0"
                                                         :max="99999999999"/>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" label="开票抬头" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.title'">
                                        <el-input size="small" v-model.number="scope.row.title"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="taxpayerNo" label="纳税人识别号" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.taxpayerNo'">
                                        <el-input size="small" v-model.number="scope.row.taxpayerNo"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="单位地址" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.address'">
                                        <el-input size="small" v-model.number="scope.row.address"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="phoneNo" label="电话号码" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.phoneNo'">
                                        <el-input size="small" v-model.number="scope.row.phoneNo"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bank" label="开户银行" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.bank'">
                                        <el-input size="small" v-model.number="scope.row.bank"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bankAccount" label="银行账号" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.bankAccount'">
                                        <el-input size="small" v-model.number="scope.row.bankAccount"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoiceReceiver" label="领票人" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.invoiceReceiver'">
                                        <el-input size="small" v-model="scope.row.invoiceReceiver"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="remarks" label="备注" width="150px">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px"
                                                  :prop="'invoiceList.' + scope.$index + '.remarks'">
                                        <el-input size="small" v-model="scope.row.remarks"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作" width="200px" align="center">
                                <template slot-scope="scope">
                                    <Uploadpictures :model.sync="scope.row.images" :multiple="true"
                                                    :append-to-body="true"/>
                                    <Czur :multiple="true" :model.sync="scope.row.images"></Czur>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               v-if="makeInvoiceForm.invoiceList.length !=1"
                                               @click="makeInvoiceForm.invoiceList.splice(scope.$index, 1)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <el-row>
                    <el-col :span="2" :offset="10" v-if="!this.$route.query.procInsId">
                        <el-button type="primary" @click="saveInvoiceApply('makeInvoiceForm')">保存</el-button>
                    </el-col>

                    <el-col :span="8" :offset="8" v-if="this.$route.query.procInsId">
                        <el-form-item label="审批结果" prop="approved"
                                      :rules="$filter_rules({required:true})">
                            <el-select v-model="makeInvoiceForm.approved" placeholder="请选择"
                                       :clearable="true">
                                <el-option label="通过" value="true"></el-option>
                                <el-option label="不通过" value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="10" v-if="this.$route.query.procInsId">
                        <el-button type="primary" @click="auditInvoiceApply('makeInvoiceForm')">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="批量开票" name="BatchInvoiceApply" v-if="activeShowBatch"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index'
    import Collapse from '../../layout/Collapse'
    import Uploadpictures from '../../../components/common/Uploadpictures'
    import Czur from '../../../components/common/Czur'

    export default {
        name: "RegisterInvoiceApply",
        components: {
            'Collapse': Collapse,
            'Uploadpictures': Uploadpictures,
            'Czur': Czur
        },
        data() {
            return {
                activeName: 'RegisterInvoiceApply',
                activeShowBatch: true,
                lastFlow: false,
                tableData: [],
                procInsId: '',
                taskId: '',
                makeInvoiceForm: {
                    invoiceList: [{}], invoiceType: null,
                    makeOutDate: null,
                    receiveDate: null,
                    applyDrawer: "",
                    giveType: null, drawer: "", approved: ''
                },//开票登记表单
                applyDrawerDisabled: false,
                loading: false,
                loadingText: "正在申请，请稍后...",
                isInvoice: true  //是否支持多个案件开一张发票 
            }
        },
        methods: {
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => {
                        var value = item;
                        if (index === 7) {
                            value = value.financeInfo.amountReceivable.cent - value.financeInfo.invoiceAmount.cent;
                        }
                        return Number(value / 100);
                    });
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index];
                    }
                });
                return sums;
            },
            getSummaries2(param) {
                const {columns, data} = param;
                //行和列
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    } else if (index === 2) {
                        //开票金额列
                        const values = data.map(item => item[column.property]);
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                        }
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            addRow() {
                var caseSize = this.tableData.length;
                var invoiceSize = this.makeInvoiceForm.invoiceList.length;
                if (caseSize > 1 && invoiceSize >= 1) {
                    this.$message.error("多个案件只能开一张发票！");
                    return;
                }
                this.makeInvoiceForm.invoiceList.push({})
            }
            ,
            saveInvoiceApply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //获取案件id
                        var caseIds = '';
                        var invoiceList = [];
                        var promiseArr = [];
                        var invoiceAmount = 0; // 开票金额
                        var needInvoiceAmount = 0; //待收金额和
                        this.tableData.forEach((vt, it) => {
                            caseIds = caseIds + vt.id + ','
                            needInvoiceAmount += (vt.financeInfo.amountReceivable.cent - vt.financeInfo.invoiceAmount.cent);
                        });
                        caseIds = caseIds.substr(0, caseIds.length - 1);
                        this.makeInvoiceForm.invoiceList.forEach((v, i) => {
                            var invoice = {};
                            if (v.images && v.images.length) {
                                let p = new Promise((resolve, reject) => {
                                    this.$compressImages(v.images).then((res) => {
                                        invoice.images = [].concat(res);
                                        resolve();
                                    });
                                });
                                promiseArr.push(p);
                            }
                            invoice.drawer = this.makeInvoiceForm.drawer;
                            invoice.applyDrawer = this.makeInvoiceForm.applyDrawer;
                            invoice.giveType = this.makeInvoiceForm.giveType;
                            invoice.invoiceType = this.makeInvoiceForm.invoiceType;
                            invoice.invoiceAmount = {cent: Math.round(v.invoiceAmount * 100)};
                            invoice.makeOutDate = this.makeInvoiceForm.makeOutDate;
                            invoice.receiveDate = this.makeInvoiceForm.receiveDate;
                            invoice.invoiceCode = v.invoiceCode;
                            invoice.invoiceNo = v.invoiceNo;
                            invoice.invoiceReceiver = v.invoiceReceiver;
                            invoice.title = v.title;
                            invoice.taxpayerNo = v.taxpayerNo;
                            invoice.address = v.address;
                            invoice.phoneNo = v.phoneNo;
                            invoice.bank = v.bank;
                            invoice.bankAccount = v.bankAccount;
                            invoice.remarks = v.remarks;
                            invoiceAmount += Math.round(v.invoiceAmount * 100);
                            invoiceList.push(invoice);
                        })
                        if (needInvoiceAmount < invoiceAmount) {
                            this.$message.error("开票金额不能大于待开金额！");
                            return;
                        }
                        if (caseIds.indexOf(",") != -1) {
                            if (needInvoiceAmount != invoiceAmount) {
                                this.$message.error("多个案件的开票金额必须等于待开金额！");
                                return;
                            } else if (invoiceList.length > 1) {
                                this.$message.error("多个案件只能开一张发票！");
                                return;
                            }
                        }
                        if (!this.isInvoice) {
                            let message = `已开票案件${this.isInvoiceData.caseNo},不能再进行多案件开票!`;
                            this.$message.error(message);
                            return;
                        }
                        const loading = this.$loading({
                            lock: true,
                            text: '正在提交申请，请稍等...',
                            spinner: 'el-icon-loading'
                        });
                        Promise.all(promiseArr).then((res) => {
                            this.$post(api.invoicesApply + '/save?caseIds=' + caseIds, invoiceList).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '开票登记申请成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/case/case-list'});
                                }
                                loading.close();
                            }).catch((err) => {
                                if (err.errCode) {
                                    this.$message.error(err.errMsg);
                                } else {
                                    console.log(err)
                                }
                                loading.close();
                            });
                        }).catch((err) => {
                            console.log(err)
                        });

                    }
                });
            }
            ,

            auditInvoiceApply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //获取案件id
                        var caseIds = '';
                        var invoiceList = [];
                        var promiseArr = [];
                        var invoiceAmount = 0; // 开票金额
                        var needInvoiceAmount = 0; //待收金额和
                        this.tableData.forEach((vt, it) => {
                            caseIds = caseIds + vt.id + ','
                            needInvoiceAmount += (vt.financeInfo.amountReceivable.cent - vt.financeInfo.invoiceAmount.cent);
                        });
                        caseIds = caseIds.substr(0, caseIds.length - 1);
                        var dataForm = this.makeInvoiceForm;
                        this.makeInvoiceForm.invoiceList.forEach((v, i) => {
                            var invoice = {};
                            if (v.images && v.images.length) {
                                let p = new Promise((resolve, reject) => {
                                    this.$compressImages(v.images).then((res) => {
                                        invoice.images = [].concat(res);
                                        resolve();
                                    });
                                });
                                promiseArr.push(p);
                            }
                            invoice.drawer = this.makeInvoiceForm.drawer;
                            invoice.applyDrawer = this.makeInvoiceForm.applyDrawer;
                            invoice.giveType = this.makeInvoiceForm.giveType;
                            invoice.invoiceType = this.makeInvoiceForm.invoiceType;
                            invoice.invoiceAmount = {cent: Math.round(v.invoiceAmount * 100)};
                            invoice.makeOutDate = this.makeInvoiceForm.makeOutDate;
                            invoice.receiveDate = this.makeInvoiceForm.receiveDate;
                            invoice.id = v.id;
                            invoice.invoiceCode = v.invoiceCode;
                            invoice.invoiceNo = v.invoiceNo;
                            invoice.invoiceReceiver = v.invoiceReceiver;
                            invoice.title = v.title;
                            invoice.taxpayerNo = v.taxpayerNo;
                            invoice.address = v.address;
                            invoice.phoneNo = v.phoneNo;
                            invoice.bank = v.bank;
                            invoice.bankAccount = v.bankAccount;
                            invoice.remarks = v.remarks;
                            invoiceAmount += Math.round(v.invoiceAmount * 100);
                            invoiceList.push(invoice);
                        })
                        if (needInvoiceAmount < invoiceAmount) {
                            this.$message.error("开票金额不能大于待收金额！");
                            return;
                        }
                        if (caseIds.indexOf(",") != -1) {
                            if (needInvoiceAmount != invoiceAmount) {
                                this.$message.error("多个案件的开票金额必须等于待收金额！");
                                return;
                            } else if (invoiceList.length > 1) {
                                this.$message.error("多个案件只能开一张发票！");
                                return;
                            }
                        }
                        //申请
                        var flowInvoiceApply = {
                            procInsId: this.procInsId,
                            taskId: this.taskId,
                            flowInvoiceDtoList: invoiceList,
                            auditResult: {
                                approved: this.makeInvoiceForm.approved
                            }
                        };
                        const loading = this.$loading({
                            lock: true,
                            text: '正在提交审批，请稍等...',
                            spinner: 'el-icon-loading'
                        });
                        Promise.all(promiseArr).then((res) => {
                            this.$post(api.invoicesApply + '/register-audit?caseIds=' + caseIds, flowInvoiceApply).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '审批成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({
                                        path: '/mydashboard',
                                    });
                                }
                                loading.close();
                            }).catch((err) => {
                                loading.close();
                                console.log(err)
                            });
                        }).catch((err) => {
                            loading.close();
                            console.log(err)
                        });
                    }
                });

            }

        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "开票申请");
            if (this.$route.query.activeShow == "F") {
                this.activeShowBatch = false;
            } else {
                this.activeShowBatch = true;
            }
            //最后一个流程
            if (this.$route.query.lastFlow == "T") {
                this.lastFlow = true;
            } else {
                this.lastFlow = false;
            }
            var caseIds = this.$route.query.caseIds;
            var idList = caseIds.substr(0, caseIds.length - 1).split(",");
            this.$post(api.finance+'/byIds',idList).then((res) => {
                this.isInvoiceData = res.data.find(item => item.financeInfo.invoiceAmount && item.financeInfo.invoiceAmount.cent > 0) 
                if(this.isInvoiceData && idList.length > 1) {
                    this.isInvoice = false;
                }
                this.tableData = res.data;
            }).catch((err) => {
                console.log(err)
            })
            //审批
            var procInsId = this.$route.query.procInsId;
            this.procInsId = procInsId;
            this.taskId = this.$route.query.taskId;
            if (procInsId) {
                this.$get(api.invoicesApply + '/register-apply-info?procInsId=' + procInsId).then((res) => {
                    if (res.status == 200) {
                        var data = res.data;
                        this.makeInvoiceForm.invoiceType = data.flowInvoiceDtoList[0].invoiceType;
                        this.makeInvoiceForm.makeOutDate = data.flowInvoiceDtoList[0].makeOutDate;
                        this.makeInvoiceForm.receiveDate = data.flowInvoiceDtoList[0].receiveDate;
                        this.makeInvoiceForm.drawer = data.flowInvoiceDtoList[0].drawer;
                        this.makeInvoiceForm.applyDrawer = data.flowInvoiceDtoList[0].applyDrawer;
                        this.makeInvoiceForm.giveType = data.flowInvoiceDtoList[0].giveType;
                        data.flowInvoiceDtoList.forEach(item => {
                            item.invoiceAmount = parseFloat(item.invoiceAmount.cent / 100);
                        })
                        this.makeInvoiceForm.invoiceList = data.flowInvoiceDtoList;
                    }
                }).catch((err) => {
                    console.log(err)
                });
                if (this.$route.query.lastFlow == "T") {
                    this.$get(api.myInfo).then((res) => {
                        var data = JSON.parse(JSON.stringify(res.data));
                        this.makeInvoiceForm.drawer = (data.hrStaff == undefined ? '' : data.hrStaff.name);
                    });
                }
                //申请开票人不能修改
                this.applyDrawerDisabled = true;
            } else {
                this.$get(api.myInfo).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.makeInvoiceForm.applyDrawer = (data.hrStaff == undefined ? '' : data.hrStaff.name);
                });
            }
        }
        ,
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'BatchInvoiceApply') {
                    this.$router.push({
                        path: '/case/batch-make-invoice-apply',
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
            ,
        }

    }
</script>

<style scoped>

</style>