<template>
    <div>
        <caseDetail :case-id="caseId"></caseDetail>
        <Portlet title="人员选择">
            <template slot="body">
                <el-form ref="form" label-width="130px" size="small" :model="form" class="demo-ruleForm" label-position="right" >
                    <el-row>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="鉴定助理">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="ASSIST"
                                        :model.sync="form.assist"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第一鉴定人"  :rules="$filter_rules({required:true})">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.auth1"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第二鉴定人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.auth2"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第三鉴定人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.auth3"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第四鉴定人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.auth4"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第五鉴定人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.auth5"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="授权签字人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTHORIZED_SIGNATORY"
                                        :model.sync="form.authorized_signatory"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="复核人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="REVIEWER"
                                        :model.sync="form.reviewer"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="签发人">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        qualification_type="ISSUER"
                                        :model.sync="form.issuer"></select-qualification>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </Portlet>
    </div>
</template>

<script>
    import Portlet from '../layout/Portlet'
    import caseDetail from '../../components/common/CaseDetail'
    import SelectFromQualification from '../../components/common/SelectFromQualification'
    export default {
        name: "CaseDistribution",
        components: {'Portlet':Portlet,'CaseDetail':caseDetail,'select-qualification':SelectFromQualification},
        data(){
            return{
                caseId:'',
                form:{},
                panClass:{
                    sm:{span:12},
                    md:{span:8},
                    xl:{span:6,offset:1}
                },
                professionCategoryId:''
            }
        }
    }
</script>

<style scoped>

</style>