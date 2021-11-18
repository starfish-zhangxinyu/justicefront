<template>
    <!--车辆识别码/证件号验证结果-->
    <el-dialog title="鉴定历史记录" :visible.sync="importVerfyDialog">

        <el-table
                :data="verifyArr"
                tooltip-effect="dark"
                stripe
                border
                size="90px"
                style="width: 100%">

            <el-table-column
                    prop="name"
                    label="案件编号">
                <template slot-scope="scope">
                    <router-link :to="{path:'/case/case-detail',query:{id:scope.row.id}}"
                                 style="text-decoration: none;">
                        <el-link type="primary">{{scope.row.caseNo ? scope.row.caseNo:'无'}}</el-link>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="entrustInfo"
                    label="委托方">
                <template slot-scope="scope">
                            <span>{{(scope.row.entrustInfo.entrustingUnit && scope.row.entrustInfo.entrustingUnit.name != null && scope.row.entrustInfo.entrustingUnit.name != '')?
                                scope.row.entrustInfo.entrustingUnit.name:scope.row.entrustInfo.entrustingParty}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="importVerfyDialog = false" size="small">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>

    export default {
        name:"VerifyDialog",
        data(){
            return {
                importVerfyDialog:false,
                verifyArr: [],
                verifyTitle:''
            }
        },
        methods:{
            /*车辆识别码/证件号验证事件触发*/
            verifyVinOrCredentialNo(type,vinOrCredentialNo){
                if (vinOrCredentialNo&&vinOrCredentialNo.length>0){
                    this.$get(`/api/ca-case/v1/cases/findCaseByVinOrCredentialNo`,{
                        type: type,
                        vinOrCredentialNo: vinOrCredentialNo
                    }).then((res) => {
                        if (res.data&&res.data.length>0) {
                            this.importVerfyDialog = true
                            this.verifyArr = res.data;
                            if (type == 1){
                                this.verifyTitle = '该车辆验证码已存在案件'
                            }else{
                                this.verifyTitle = '该证件号已存在案件'
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }

            },
        },
    }
</script>