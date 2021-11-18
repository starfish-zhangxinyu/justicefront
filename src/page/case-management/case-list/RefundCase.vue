<template>
    <div>
        <CaseDetail :case-id="caseId"></CaseDetail>
        <el-form label-width="130px" size="small" :model="form" class="demo-ruleForm" label-position="right">
            <Portlet title="退费">
                <template slot="body">
                    <el-table
                            :data="tableData"
                            fit
                            stripe
                            border
                            :summary-method="getSummaries"
                            show-summary
                            size="mini"
                            style="width: 100%">
                        <el-table-column
                                prop="fiCaseChargeSumByItem.chargingItem.name"
                                label="收费项目">
                        </el-table-column>
                        <el-table-column
                                prop="fiCaseChargeSumByItem.chargingItem.chargingType.name"
                                label="收费类别">
                        </el-table-column>
                        <el-table-column
                                prop="fiCaseChargeSumByItem.amount.yuanFmt"
                                label="合同金额">
                        </el-table-column>
                        <el-table-column
                                prop="fiCaseChargeSumByItem.refund.yuanFmt"
                                label="已退费金额">
                        </el-table-column>
                        <el-table-column
                                prop="fiCaseChargeSumByItem.discount.yuanFmt"
                                label="已减免金额">
                        </el-table-column>
                        <el-table-column
                                prop="fiCaseChargeSumByItem.notReceived.yuanFmt"
                                label="待收金额">
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
                                prop="amount.yuanFmt"
                                label="本次退费金额">
                        </el-table-column>
<!--                        <el-table-column label="退费后应收金额" prop="fiCaseChargeSumByItem.newNotReceived">-->
<!--                            <template slot-scope="scope">-->
<!--                                {{scope.row.amount ?-->
<!--                                ( Number(scope.row.fiCaseChargeSumByItem.notReceived.cent/100) +-->
<!--                                Number(scope.row.amount.cent/100)) : null}}-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column prop="remarks" label="备注"></el-table-column>
                    </el-table>
                    <el-form ref="form" label-width="130px" size="small" :model="form" class="demo-ruleForm"
                             label-position="right" style="margin-top: 20px">
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item :label="form.changeType && form.changeType.value =='ABORT_CASE' ? '退案原因':'退费原因'">
                                    <span v-if="form.reason">{{form.reason}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item label="审批结果" prop="auditResult.approved"
                                              :rules="$filter_rules({required:true})">
                                    <el-select v-model="form.auditResult.approved" placeholder="请选择" style="width: 100%"
                                               :clearable="true">
                                        <el-option label="通过" value="true"></el-option>
                                        <el-option label="不通过" value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                    <el-row style="margin-top: 20px">
                        <el-col :span="2" :offset="11">
                            <el-button type="success" size="mini" class="save-btn" @click="save('form')"><i
                                    class="fa fa-save"></i> 保存
                            </el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="mini" class="save-btn" @click="goBack()"><i
                                    class="el-icon-arrow-left"></i> 返回
                            </el-button>
                        </el-col>
                    </el-row>
                </template>
            </Portlet>
        </el-form>
    </div>
</template>

<script>
    import Portlet from '../../layout/Portlet'
    import caseDetail from '../../../components/common/CaseDetail'
    import api from '../../../api/index'

    export default {
        name: "RateRelief",
        components: {'Portlet': Portlet, 'CaseDetail': caseDetail},
        data() {
            return {
                caseId: '',
                taskId: '',
                procInsId: '',
                form: {auditResult: {approved: ''}},
                tableData: [],
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.form));
                        data.procInsId = this.$route.query.procInsId;
                        data.taskId = this.$route.query.taskId;
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
                    }
                })
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];

                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    var property = '';
                    if (column.property) {
                        /*if(column.property == 'amount.yuanFmt'){
                            property = column.property;
                        }else{*/
                            property = column.property.replace('yuanFmt', 'cent');
                        // }
                    }
                    const values = data.map(item => {
                        var value = item;
                        if (property == 'fiCaseChargeSumByItem.newNotReceived') {
                            value = value.fiCaseChargeSumByItem.notReceived.cent - Number(value.amount.yuanFmt)*100;
                        } else {
                            var propertyList = property.split(".");
                            propertyList.forEach(v => {
                                value = value[v];
                            })
                        }

                        if(property == 'amount.yuanFmt'){
                            value = Number(value)*100;
                        }else if(property == 'remarks'){
                            value= 'remarks';
                        }
                        return Number(value);
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
                        sums[index] = sums[index] / 100;
                    }
                });
                return sums;
            },
        },
        created() {
            this.caseId = this.$route.query.caseId;
            this.taskId = this.$route.query.taskId;
            this.procInsId = this.$route.query.procInsId;
            var data = {
                caseId: this.caseId,
                procInsId: this.procInsId
            }
            this.$get(api.caseChange + '/get', data).then((res) => {
                if (res.status == 200) {
                    this.form = JSON.parse(JSON.stringify(res.data));
                    this.form.auditResult = {approved: ''};
                    this.tableData = res.data.flowRefundDiscountItemList;
                }
            }).catch((err) => {
                console.log(err)
            });
        }
    }
</script>

<style scoped>

</style>