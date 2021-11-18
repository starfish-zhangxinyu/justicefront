<template>
    <div>
        <CaseDetail :case-id="caseId"></CaseDetail>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="委托鉴定事项" name="entrustMatterTab">
                <el-table
                        border
                        size="small"
                        :data="entrustMatterTable"
                        style="width:100%">
                    <el-table-column prop="entrustingMatter.name" label="委托事项" ></el-table-column>
                    <el-table-column prop="" label="明细" ></el-table-column>
                    <el-table-column prop="entrustingMatter.standardList" label="检验标准" >
                        <template slot-scope="scope">
                             <span v-if="scope.row.professionCategoryList">
                                      {{transform(scope.row.standardList)}}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="数量"></el-table-column>
                    <el-table-column prop="remarks" label="备注" ></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收费项目" name="payItemTab">
                <el-table border size="small" :data="payItemTable" style="width:100%">
                    <el-table-column prop="chargingItem.name" label="收费项目" ></el-table-column>
                    <el-table-column prop="chargingItem.chargingType.name" label="收费类别" ></el-table-column>
                    <el-table-column prop="quantity" label="数量" ></el-table-column>
                    <el-table-column prop="unitPrice.yuanFmt" label="单价"></el-table-column>
                    <el-table-column prop="" label="金额" >
                        <template slot-scope="scope">
                            <span>{{scope.row.quantity*parseInt(scope.row.unitPrice.yuanFmt)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" ></el-table-column>
                    <el-table-column prop="fiCaseCharge.amount" label="收入确定金额"></el-table-column>
                    <el-table-column prop="fiCaseCharge.confirmDate" label="收费确认日期" >
                        <template slot-scope="scope">
                            <span>{{$divideDate(scope.row.fiCaseCharge.confirmDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentUnit.name" label="缴费方" ></el-table-column>
                    <el-table-column prop="fiCaseCharge.updateBy.name" label="操作人" ></el-table-column>
                    <el-table-column prop="fiCaseCharge.updateDate" label="操作时间" >
                        <template slot-scope="scope">
                            <span>{{$divideDate(scope.row.fiCaseCharge.updateDate)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    import caseDetail from '../../components/common/CaseDetail'
    export default {
        name: "ConfirmFinancial",
        components: {'CaseDetail':caseDetail},
        data(){
            return{
                caseId:'',
                activeName:'',
                entrustMatterTable:[],
                payItemTable:[]
            }
        },
        methods:{
            transform(arr){
                var str='';
                for(let i=0;i<arr.length;i++){
                    str+=arr[i].name+',';
                }
                return str.substr(0,str.length-1);
            },
        },
    }
</script>

<style scoped>

</style>