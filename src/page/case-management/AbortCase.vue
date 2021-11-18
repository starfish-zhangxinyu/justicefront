<template>
    <div>
        <PageBar title1="案件列表" title2="退案"></PageBar>
        <CaseDetail :case-id="caseId"></CaseDetail>
        <Collapse title="退案申请" :active="true">
            <el-form :model="form" size="small" ref="form" label-width="130px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="理由" prop="reason" :rules="$filter_rules({required:true,trigger:'change'})">
                            <select-from-dict
                                    :disabled="disable"
                                    class-name="multiple-select"
                                    :model.sync="form.reason"
                                    :clearable="true"
                                    data_type="case_abort_reason"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.reason && form.reason.label == '其他'">
                    <el-col :lg="{span:16}">
                        <el-form-item label="其他理由" :rules="$filter_rules({required:true})" prop="otherReason">
                            <el-input type="textarea" v-model="form.otherReason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="是否退费" prop="needRefund" :rules="$filter_rules({required:true,trigger: 'change'})">
                            <el-select v-model="form.needRefund" placeholder="请选择" :disabled="disable">
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.needRefund&&form.needRefund=='Y'">
                    <el-col :lg="{span:16}">
                        <Collapse title="收费项目" :active="true">
                            <el-table
                                    :data="form.flowRefundDiscountItemList"
                                    fit
                                    stripe
                                    border
                                    size="mini"
                                    style="width: 100%">
                                <el-table-column
                                        prop="fiCaseChargeSumByItem.chargingItem.name"
                                        label="收费项目">
                                </el-table-column>
                                <el-table-column
                                        prop="fiCaseChargeSumByItem.amount.yuanFmt"
                                        label="合同金额">
                                </el-table-column>
                                <!-- <el-table-column
                                        prop="fiCaseChargeSumByItem.received.yuanFmt"
                                        label="已收金额">
                                </el-table-column> -->
                                <el-table-column
                                        prop="fiCaseChargeSumByItem.actualReceivable.yuanFmt"
                                        label="实收金额">
                                </el-table-column>
                                <el-table-column
                                        prop=""
                                        label="退费金额">
                                    <template slot-scope="scope">
                                        <el-form-item
                                                v-if="!$route.query.procInsId"
                                                :rules="$filter_rules({required:true})"
                                                label-width="0px"
                                                :prop="'flowRefundDiscountItemList.' + scope.$index + '.amount'">
                                            <el-input v-model="scope.row.amount" size="small"
                                                      :disabled="disable"></el-input>
                                        </el-form-item>
                                        <span v-if="$route.query.procInsId">{{scope.row.amount.yuanFmt}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Collapse>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="是否更改票据" prop="changeInvoice" :rules="$filter_rules({required:true,trigger:'change'})">
                            <el-select v-model="form.changeInvoice" placeholder="请选择" :disabled="disable">
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="$route.query.procInsId">
                    <el-col :lg="{span:16}">
                        <el-form-item label="审批结果" prop="auditResult.approved"
                                      :rules="$filter_rules({required:true,trigger:'change'})">
                            <el-select v-model="form.auditResult.approved" placeholder="请选择">
                                <el-option label="同意" :value="true"></el-option>
                                <el-option label="不同意" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.auditResult.approved==false">
                    <el-col :lg="{span:16}">
                        <el-form-item label="原因" prop="auditResult.comment" :rules="$filter_rules({required:true})">
                            <el-input size="small" type="textarea" :rows="3"
                                      v-model="form.auditResult.comment"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </Collapse>
        <el-row>
            <el-col :span="2" :offset="10">
                <el-button type="success" size="mini" class="save-btn" @click="save('form')"><i
                        class="fa fa-save"></i> 保存
                </el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="mini" class="save-btn" @click="goBack"><i
                        class="el-icon-arrow-left"></i> 返回
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Collapse from '../layout/Collapse'
    import CaseDetail from '../../components/common/CaseDetail'
    import api from '../../api/index'
    import BigDecimalUtils from "../../utils/BigDecimalUtils";

    export default {
        name: "CaseChange",
        components: {
            'CaseDetail': CaseDetail,
            'Collapse': Collapse
        },
        data() {
            return {
                form: {flowRefundDiscountItemList: [], auditResult: {}},
                caseId: '',
                disable: false,
                abortData: null
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.$route.query.procInsId) {
                            this.abortData.auditResult = this.form.auditResult;
                            this.abortData.procInsId = this.$route.query.procInsId;
                            this.abortData.taskId = this.$route.query.taskId;
                            this.$put(api.caseChange + '/audit', this.abortData).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    })
                                }
                                ;
                                this.$router.go(-1);
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            var data = JSON.parse(JSON.stringify(this.form));
                            var flag = true;
                            
                            if(data.needRefund == 'Y'){
                                data.flowRefundDiscountItemList.forEach((v, i) => {
                                    var rmb = BigDecimalUtils.divide(v.fiCaseChargeSumByItem.received.cent, 100, 2);
                                    if (flag && Number(v.amount) > Number(rmb)) {
                                        this.$message.error('退费金额不能大于实收金额');
                                        flag = false;
                                        return;
                                    } else {
                                        v.amount = {cent: Number(BigDecimalUtils.times(v.amount, 100))};
                                        v.chargingItem = v.fiCaseChargeSumByItem.chargingItem;
                                    }
                                });
                            }
                            
                            data.caseDto = {id: this.caseId};
                            data.changeType = 'ABORT_CASE';
                            data.reason = (data.reason.label == '其他' ? data.otherReason:data.reason.label)
                            if (!flag) {
                                return;
                            }
                            if (data.needRefund == 'N') {
                                data.flowRefundDiscountItemList = [];
                            }
                            this.$post(api.caseChange + '/apply', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    })
                                }
                                ;
                                this.$router.go(-1);
                            }).catch((err) => {
                                this.$message.error(`${err.errMsg}`);
                                console.log(err)
                            })
                        }

                    }
                });
            },
            goBack() {
                this.$router.go(-1)
            }
        },
        watch: {},
        created() {
            this.caseId = this.$route.query.caseId;
            if (this.$route.query.procInsId) {
                this.disable = true;
                this.$get(api.caseChange + '/get?caseId=' + this.$route.query.caseId + '&procInsId=' + this.$route.query.procInsId).then((res) => {
                    this.abortData = res.data;
                    this.form = {
                        reason: res.data.reason,
                        needRefund: res.data.needRefund,
                        changeInvoice: res.data.changeInvoice,
                        flowRefundDiscountItemList: [].concat(res.data.flowRefundDiscountItemList),
                        auditResult: {}
                    };
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.$get(api.caseChange + '/get?caseId=' + this.$route.query.caseId).then((res) => {
                    this.form.flowRefundDiscountItemList = [].concat(res.data.flowRefundDiscountItemList);
                }).catch((err) => {
                    console.log(err)
                })
            }

        }
    }
</script>

<style scoped>

</style>