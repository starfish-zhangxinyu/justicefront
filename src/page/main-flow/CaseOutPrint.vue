<!--
  案件流程中出案及报告打印功能。
 
  @Author: Simon Shen 
  @Date: 2020-09-01 21:52:01 
 -->
<template>
    <div>
        <PageBar title1="业务流程" title2="出案及报告打印"></PageBar>
        <CaseDetail :case-id="caseId"></CaseDetail>
        <el-form :model="caseOutForm" ref="caseOutForm" label-width="130px" size="small">
            <el-row>
                <el-col :lg="{span:16,offset:4}">
                    <el-form-item label="出案日期" prop="reportOutDate" :rules="$filter_rules({required:true})">
                        <el-date-picker
                                style="width: 100%"
                                v-model="caseOutForm.reportOutDate"
                                type="date"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin-top: 50px">
                
                <el-col :span="2" :offset="9">
                    <el-button type="success" size="mini" class="save-btn" @click="save('caseOutForm')"> 保存
                    </el-button>
                </el-col>

                <el-col :span="3">
                    <el-button type="success" size="mini" class="save-btn" @click="printReport()"> 打印报告
                    </el-button>
                </el-col>

                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="complete('caseOutForm')"> 完成
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import api from "../../api/index";
    import Portlet from '../layout/Portlet'
    import CaseDetail from '../../components/common/CaseDetail'
    import PageOfficeApi from "../../components/tpl/PageOfficeApi";

    export default {
        components: {'Portlet': Portlet, 'CaseDetail': CaseDetail},
        name: "CaseOutPrint",
        data() {
            return {
                caseId: '',
                caseOutForm: {}
            }
        },
        methods: {
            save(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var list =[];
                        list.push({
                            id:this.$route.query.caseId,
                            reportOutDate:this.caseOutForm.reportOutDate
                        });
                        this.$put(api.caCase + "/out" ,list).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                });
            },
             complete(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var list =[];
                        list.push({
                            id:this.$route.query.caseId,
                            reportOutDate:this.caseOutForm.reportOutDate,
                            procInsId:this.$route.query.procInsId,
                            taskId:this.$route.query.taskId
                        });
                        this.$put(api.caCase + "/out",list).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '已完成！',
                                    type: 'success'
                                });
                                /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
                                this.$router.go(-1);//为了保持筛选状态

                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                });
            },
            printReport(){
                PageOfficeApi.renderReport(
                    this.$route.query.caseId,
                    this.$route.query.taskId
                );
            }
        },
        created() {
         this.caseId=this.$route.query.caseId;
            this.$get(api.caCase + "/out/" + this.$route.query.caseId).then((res) => {
            if(res.data){
                this.caseOutForm={reportOutDate:res.data};
            }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
</script>

<style scoped>

</style>