<!--显示案件的基本信息，放在案件变更、案件终止等流程申请页面的头部。-->
<template>
    <Portlet title="案件基本信息">
        <template slot="buttonGroup">
            <el-button type="primary" size="mini" style="float: right;margin-right: 10px;margin-top: 5px"
                       @click="checkDetail">查看详情
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-right: 10px;margin-top: 5px"
                       @click="authRecords">鉴定记录
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 5px"
                       @click="edit">编辑
            </el-button>
        </template>
        <template slot="body">
            <el-row v-cloak>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                    <span class="label">案件编号</span><span class="detail">{{detailMsg.caseNo}}</span>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">专业类别</span>
                    <span class="detail"
                          v-if="detailMsg.professionCategory">{{detailMsg.professionCategory.name}}</span>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">委托方</span>
                    <span class="detail"
                          v-if="detailMsg.entrustInfo.entrustingUnit&&detailMsg.entrustInfo.entrustingUnit.id">{{detailMsg.entrustInfo.entrustingUnit.name}}</span>
                    <span class="detail" v-if="detailMsg.entrustInfo.entrustingParty">{{detailMsg.entrustInfo.entrustingParty}}</span>
                </el-col>
            </el-row>
            <!--<el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">联系人</span>
                    <span class="detail"
                          v-if="detailMsg.entrustInfo.contact">{{detailMsg.entrustInfo.contact.name}}</span></el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">联系电话</span>
                    <span class="detail"
                          v-if="detailMsg.entrustInfo.contact">{{detailMsg.entrustInfo.contact.phone}}</span></el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">鉴定对象</span>
                    <span class="detail">{{detailMsg.entrustInfo.authenticatedTarget}}</span></el-col>
            </el-row>-->
            <!--<el-row>-->
                <!--<el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">委托日期</span>-->
                    <!--<span class="detail"-->
                          <!--v-if="detailMsg.entrustingDate">{{$divideDate(detailMsg.entrustingDate)}}</span></el-col>-->
                <!--<el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">登记日期</span>-->
                    <!--<span class="detail" v-if="detailMsg.createDate">{{$divideDate(detailMsg.createDate)}}</span>-->
                <!--</el-col>-->
                <!--<el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">受理日期</span>-->
                    <!--<span class="detail" v-if="detailMsg.acceptDate">{{$divideDate(detailMsg.acceptDate)}}</span>-->
                <!--</el-col>-->
            <!--</el-row>-->
           <!-- <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">鉴定助理</span>
                    <span class="detail" v-if="detailMsg.assist">{{detailMsg.assist.participant.hrStaff.name}}</span>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">第一鉴定人</span>
                    <span class="detail" v-if="detailMsg.auth1">{{detailMsg.auth1.participant.hrStaff.name}}</span>
                </el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">第二鉴定人</span>
                    <span class="detail" v-if="detailMsg.auth2">{{detailMsg.auth2.participant.hrStaff.name}}</span>
                </el-col>
            </el-row>-->
            <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">鉴定对象</span>
                    <span class="detail">{{detailMsg.entrustInfo.authenticatedTarget}}</span></el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">委托日期</span>
                    <span class="detail"
                          v-if="detailMsg.entrustingDate">{{$divideDate(detailMsg.entrustingDate)}}</span></el-col>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl"><span class="label">受理日期</span>
                    <span class="detail" v-if="detailMsg.acceptDate">{{$divideDate(detailMsg.acceptDate)}}</span>
                </el-col>
            </el-row>
        </template>
    </Portlet>
</template>

<script>
    import api from '../../api/index'
    import portlet from '../layout/Portlet'

    export default {
        name: "CaseBasicInfo",
        props: ['caseId'],
        components: {'Portlet': portlet},
        data() {
            return {
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                detailMsg: {entrustInfo: {entrustingUnit: {}, contact: {},}}
            }
        },
        methods: {
            divideDate(date) {
                var arr = date.split(' ');
                return arr[0];
            },
            checkDetail() {
                this.$router.push({
                    path: '/case/case-detail',
                    query: {
                        'id': this.caseId,
                    }
                }).catch(err => {
                    console.log(err)
                });
            },
            edit() {
                if (this.detailMsg.flowStatus.statusOfInt == 0) {
                    this.$router.push({
                        path: '/case/register/edit',
                        query: {'caseId': this.caseId, status: 'REGISTER_EDIT', fromPage: 'ReportForm'}
                    })
                } else if (this.detailMsg.flowStatus.statusOfInt > 0) {
                    this.$router.push({
                        path: '/case/acceptcase/edit',
                        query: {'caseId': this.caseId, status: 'ACCEPT_EDIT', fromPage: 'ReportForm'}
                    })
                } else {
                    this.$message.error('此案件不能编辑！');
                }
            },
            authRecords() {
                this.$router.push({
                    path: '/main-flow/auth-records',
                    query: {
                        'caseId': this.caseId,
                        fromPage: 'ReportForm'
                    }
                })
            }
        },
        created() {
            if (this.caseId) {
                this.$get(api.caCase + '/entrust-info/' + this.caseId).then((res) => {
                    if (res.status == 200) {
                        this.detailMsg = res.data;
                        this.$emit('getCaseNoFlag', this.detailMsg.caseNoFlag);
                    }

                }).catch((err) => {
                    console.log(err)
                });
            }
        }
    }
</script>

<style scoped lang="less">
    [v-cloak] {
        display: none;
    }

    .label {
        color: #1f2f3d;
        /*color:#428bca;*/
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        padding-bottom: 16px;
        margin-right: 8px;
        white-space: nowrap;
        display: table-cell;

        &:after {
            content: ":";
            margin: 0 8px 0 2px;
            position: relative;
            top: -0.5px;
        }
    }

    .detail {
        font-size: 14px;
        line-height: 1.5;
        width: 100%;
        padding-bottom: 16px;
        /*color: #909399;*/
        color: #666666;
        display: table-cell;
    }
</style>