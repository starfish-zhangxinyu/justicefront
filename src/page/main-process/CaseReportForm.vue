<template>
    <div>
        <caseDetail :case-id="caseId" :recordable="true" :editable="true"></caseDetail>
        <Collapse title="签审流程" :active="true">
            <el-table
                    :data="tableData"
                    fit
                    stripe
                    border
                    size="mini"
                    style="width: 100%">
                <el-table-column
                        prop=""
                        label="阶段">
                </el-table-column>
                <el-table-column
                        prop=""
                        label="签审人">
                </el-table-column>
                <el-table-column
                        prop=""
                        label="时间">
                </el-table-column>
                <el-table-column
                        prop=""
                        label="意见">
                </el-table-column>

            </el-table>
        </Collapse>
        <el-form ref="form" label-width="130px" size="small" :model="form" class="demo-ruleForm" label-position="right" >
        <Collapse title="鉴定意见" :active="true">
           <el-row>
               <el-col :lg="{span:16,offset:4}">
                   <el-form-item label="伤残鉴定级别" >
                       <select-from-table
                               :model.sync="addForm.entrustingMatter"
                               port="entrustingMatter"
                               :filterable="true"
                               :clearable="true"></select-from-table>
                   </el-form-item>
               </el-col>
               <el-col :lg="{span:16,offset:4}">
                   <el-form-item label="损伤程度" >
                       <select-from-table
                               :model.sync="addForm.entrustingMatter"
                               port="entrustingMatter"
                               :filterable="true"
                               :clearable="true"></select-from-table>
                   </el-form-item>
               </el-col>
               <el-col :lg="{span:16,offset:4}">
                   <el-form-item label="鉴定意见结论" >
                       <select-from-table
                               :model.sync="addForm.entrustingMatter"
                               port="entrustingMatter"
                               :filterable="true"
                               :clearable="true"></select-from-table>
                   </el-form-item>
               </el-col>
               <el-col :lg="{span:16,offset:4}">
                   <el-form-item label="车速" >
                      <el-input ></el-input>
                   </el-form-item>
               </el-col>
               <el-col :lg="{span:16,offset:4}">
                   <el-form-item label="鉴定意见" >
                       <el-input type="textarea" :rows="4"></el-input>
                   </el-form-item>
               </el-col>
           </el-row>
        </Collapse>
        <Collapse title="鉴定人" :active="true">

                <el-row>

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

        </Collapse>
        <Collapse title="签审意见" :active="true"></Collapse>
        </el-form>
    </div>
</template>

<script>
    import Collapse from '../layout/Collapse';
    import Portlet from '../layout/Portlet'
    import caseDetail from '../../components/common/CaseDetail'
    import SelectFromQualification from '../../components/common/SelectFromQualification'
    export default {
        name: "CaseReportForm",
        components: {
            'Portlet':Portlet,
            'CaseDetail':caseDetail,
            'Collapse':Collapse,
            'select-qualification':SelectFromQualification
        },
        data(){
            return{
                panClass:{
                    sm:{span:12},
                    md:{span:8},
                    xl:{span:6,offset:1}
                },
                professionCategoryId:'',
                caseId:'',
                tableData:[],
                form:{}
            }
        }
    }
</script>

<style scoped>

</style>