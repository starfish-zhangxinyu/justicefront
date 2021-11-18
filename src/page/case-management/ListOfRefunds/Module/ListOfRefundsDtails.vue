<template>
    <el-dialog title="退案退费详情" :visible.sync="refundDetailDia" :append-to-body="true">
        <el-row>
            <span style="width:100px;">退案退费原因：</span>
            <span v-if="caseDeductionAmount.reason">{{caseDeductionAmount.reason}}</span>
        </el-row>
        <el-row style="margin-top: 2%">
            <el-table
                    v-if="caseDeductionAmount.flowRefundDiscountItemList && caseDeductionAmount.flowRefundDiscountItemList.length>0"
                    :data="caseDeductionAmount.flowRefundDiscountItemList"
                    size="mini" border>
                <el-table-column prop="fiCaseChargeSumByItem.chargingItem.name" label="收费项目"/>
                <el-table-column prop="fiCaseChargeSumByItem.chargingItem.chargingType.name" label="收费类型"/>
                <el-table-column prop="fiCaseChargeSumByItem.amount.yuanFmt" label="合同金额"/>
                <el-table-column label="退费金额" prop="fiCaseChargeSumByItem.refund.yuanFmt"/>
                <el-table-column label="待收金额" prop="fiCaseChargeSumByItem.notReceived.yuanFmt">
                    <template slot-scope="scope">
                        <span>{{scope.row.fiCaseChargeSumByItem.notReceived.cent / 100}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="减免金额" prop="fiCaseChargeSumByItem.discount.yuanFmt"></el-table-column>
                <el-table-column prop="amount.yuanFmt" label="本次退费金额"/>
                <el-table-column :label="labelName" min-width="100%">
                    <template slot-scope="scope">

<!--                        <span v-if="caseDeductionAmount.status.value == 'APPLYING'">{{scope.row.amount.yuanFmt ? parseInt(scope.row.fiCaseChargeSumByItem.notReceived.cent / 100) + parseInt(scope.row.amount.cent / 100) : ''}}</span>-->
<!--                        <span v-else>{{scope.row.amount.yuanFmt ? parseInt(scope.row.fiCaseChargeSumByItem.notReceived.cent / 100) : ''}}</span>-->
                        <!--不需要转换为整数-->
                        <span v-if="caseDeductionAmount.status.value == 'APPLYING'">{{scope.row.amount.yuanFmt ? (scope.row.fiCaseChargeSumByItem.notReceived.cent + scope.row.amount.cent) / 100 : ''}}</span>
                        <span v-else>{{scope.row.amount.yuanFmt ? scope.row.fiCaseChargeSumByItem.notReceived.cent / 100 : ''}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="margin-top: 2%">
            <el-col :span="8">
                <span>审批状态：</span>
                <span v-if="caseDeductionAmount.status">{{caseDeductionAmount.status.label}}</span>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer" style="margin-left: 20px">
            <el-button @click="cancel" size="mini">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from "@/api/index";

    export default {
        data() {
            return {
                caseDeductionAmount: [],
                refundDetailDia: false,
                labelName: ""
            };
        },
        methods: {
            init(row) {
                if (row.abortRefundName == "退案") {
                    this.labelName = "退案后应收金额";
                } else if (row.abortRefundName == "退费") {
                    this.labelName = "退费后待收金额";
                } else {
                    this.labelName = "退案退费后收金额";
                }
                this.$get(api.caseChargeFlow + "/get", {
                    procInsId: row.procInsId,
                    caseId: row.caseDto.id
                }).then(res => {
                    this.caseDeductionAmount = res.data;
                }).catch(res => console.log(res));
                this.refundDetailDia = true;
            },
            cancel() {
                this.refundDetailDia = false;
            },
            submit() {
            }
        },
        components: {}
    };
</script>

<style lang="less" scoped></style>
