<template>
    <div>
        <CaseDetail :caseId="caseId"></CaseDetail>
        <el-form ref="judgeForm" label-width="130px" size="small" :model="form" class="demo-ruleForm"
                 label-position="right">
            <Portlet title="受理判断">
                <template slot="body">
                    <el-row>
                        <el-col :lg="{span:12,offset:6}">
                            <el-form-item label="评审结果" prop="radio" :rules="$filter_rules({required:true})">
                                <el-select v-model="form.radio" placeholder="请选择" style="width: 100%" :clearable="true">
                                    <el-option label="不予受理" value="0"></el-option>
                                    <el-option label="可以受理" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:12,offset:6}" v-if="form.radio=='0'">
                            <el-form-item label="不予受理原因" prop="caRefuseInfoDto.refuseReason"
                                          :rules="$filter_rules({required:true})">
                                <select-from-dict
                                        class-name="multiple-select"
                                        :model.sync="form.caRefuseInfoDto.refuseReason"
                                        data_type="case_refuse_reason"></select-from-dict>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:12,offset:6}"
                                v-if="form.caRefuseInfoDto.refuseReason&&form.caRefuseInfoDto.refuseReason.label=='其他'">
                            <el-form-item label="其他原因">
                                <el-input v-model="form.caRefuseInfoDto.refuseReasonOther" type="textarea"
                                          :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </Portlet>
            <Portlet title="鉴定人员" v-if="form.radio=='1'">
                <template slot="body">
                    <el-row>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="鉴定助理" prop="authenticator.assist">
                                <select-qualification
                                        :profession_category="professionCategoryId"
                                        :is-object="true"
                                        qualification_type="ASSIST"
                                        :model.sync="form.authenticator.assist"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第一鉴定人" :rules="$filter_rules({required:true})"
                                          prop="authenticator.auth1">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.authenticator.auth1"></select-qualification>
                            </el-form-item>
                        </el-col>

                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第二鉴定人" prop="authenticator.auth2">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.authenticator.auth2"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第三鉴定人" prop="authenticator.auth3">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.authenticator.auth3"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第四鉴定人">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.authenticator.auth4"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="第五鉴定人">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTH"
                                        :model.sync="form.authenticator.auth5"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="授权签字人">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="AUTHORIZED_SIGNATORY"
                                        :model.sync="form.authenticator.authorized_signatory"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="复核人">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="REVIEWER"
                                        :model.sync="form.authenticator.reviewer"></select-qualification>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="签发人">
                                <select-qualification
                                        :is-object="true"
                                        :profession_category="professionCategoryId"
                                        qualification_type="ISSUER"
                                        :model.sync="form.authenticator.issuer"></select-qualification>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </Portlet>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="primary" size="mini" @click="save('judgeForm')">保存</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import Portlet from '../layout/Portlet'
    import caseDetail from '../../components/common/CaseDetail'
    import SelectFromQualification from '../../components/common/SelectFromQualification'
    import api from '../../api/index'

    export default {
        name: "CaseJudgment",
        components: {'Portlet': Portlet, 'CaseDetail': caseDetail, 'select-qualification': SelectFromQualification},
        data() {
            return {
                caseId: '',
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                form: {authenticator: {}, caRefuseInfoDto: {}},
                professionCategoryId: '',
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.form));
                        data.procInsId = this.$route.query.procInsId;
                        data.taskId = this.$route.query.taskId;
                        data.id = this.caseId;
                        data.authenticatorList = [];
                        var auth1Toauth5List = [];
                        for (var key in data.authenticator) {
                            data.authenticatorList.push({
                                "participant": data.authenticator[key],
                                "caseRole": key.toUpperCase()
                            });
                            if (key.toUpperCase() == 'AUTH1' ||
                                key.toUpperCase() == 'AUTH2' ||
                                key.toUpperCase() == 'AUTH3' ||
                                key.toUpperCase() == 'AUTH4' ||
                                key.toUpperCase() == 'AUTH5') {
                                if (data.authenticator[key]) {
                                    auth1Toauth5List.push(data.authenticator[key].id);
                                }
                            }
                        }
                        ;
                        var flag = true;
                        if (this.form.radio == '0') {
                            flag = false;
                        }
                        delete data.authenticator;
                        delete data.radio;
                        //第一鉴定人到第五鉴定人不能重复
                        var repetitionBl = this.judgeRepetitionAuth(auth1Toauth5List);
                        if (repetitionBl) {
                            this.$message.error('第一鉴定人到第五鉴定人不可重复！');
                            return;
                        }
                        this.$post(api.caseJudge + '/?approved=' + flag, data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
                                this.$router.go(-1);//为了保持筛选状态
                            }
                        }).catch((err) => {
                            console.log(err)
                        });
                    }
                });

            },
            judgeRepetitionAuth(data) {
                for (let i = 0; i < data.length; i++) {
                    var repetitionTime = 0;
                    var authId = data[i];
                    for (let j = 0; j < data.length; j++) {
                        if (authId == data[j]) {
                            repetitionTime++;
                        }
                    }
                    if (repetitionTime >= 2) {
                        return true;
                    }
                }
            }
        },
        watch: {
            'form.radio': {
                handler(newVal, oldVal) {
                    if (newVal == '1') {
                        this.form.caRefuseInfoDto = {};
                    }
                }
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "案件受理判断")
            this.caseId = this.$route.query.caseId;
            this.$get(api.caseJudge + '/' + this.$route.query.caseId).then((res) => {
                this.professionCategoryId = res.data.professionCategory.id;
                var roleData = {};
                res.data.authenticatorList.forEach((v, i) => {
                    var key = v.caseRole.value.toLowerCase();
                    roleData[key] = v.participant;
                });
                this.form.authenticator = {};
                this._.assign(this.form.authenticator, {...roleData});
            }).catch((err) => {
                console.log(err)
            });
        }
    }
</script>

<style scoped>

</style>