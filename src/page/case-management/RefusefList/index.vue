<template>
    <div>
        <!-- <PageBar title1="案件管理" title2="不予受理列表" /> -->
        <div class="search-box" style="overflow: hidden">
            <el-form :model="searchForm" size="small" label-width="100px">
                <el-row>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="专业类别">
                            <select-from-table
                                    :model.sync="searchForm.professionCategoryId"
                                    port="profession"
                                    :model-id="true"
                                    :clearable="true"
                                    className="multiple-select w100"
                                    :orgId="orgId"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="委托单位">
                            <select-from-table
                                    :model.sync="searchForm.entrustingUnitId"
                                    port="entrustingUnit"
                                    :model-id="true"
                                    className="multiple-select w100"
                                    allow-create
                                    :clearable="true"
                                    :filterable="true"
                                    :orgId="orgId"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="第一鉴定人">
                            <select-qualification
                                    dataScope='caseData'
                                    profession_category="ALL"
                                    qualification_type="AUTH"
                                    :filterable="true"
                                    className="multiple-select w100"
                                    :model.sync="searchForm.firstAuthId"
                                    :orgId="orgId"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="登记日期" class="margin0">
                            <DataPicker
                                :startValue.sync="searchForm.beginRegisterDate"
                                :endValue.sync="searchForm.endRegisterDate"
                                valueFormat="yyyy/MM/dd HH:mm:ss"
                                valueFormat2="yyyy/MM/dd 23:59:59"
                                :isValueFormat2="true"
                                />
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="联系人" class="margin0">
                            <el-input v-model="searchForm.contact"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-button type="primary" size="small" @click="search"
                                style="float:right;"
                                class="el-icon-search">查询</el-button>
                </el-row>
            </el-form>
        </div>
        <el-table
                :data="tableData"
                fit
                border
                size="small"
                style="width: 100%"
                :max-height="tableHeight"
        >
            <el-table-column fixed width="55" type="selection" />
            <el-table-column prop="serialNumber" label="流水号" width="120px"/>
            <el-table-column prop="professionCategory.name" label="专业类别" width="100px"/>
            <el-table-column prop="entrustInfo.entrustingUnit.name" label="委托单位" show-overflow-tooltip min-width="80%">
                <template slot-scope="scope">
                  <span>
                    {{(scope.row.entrustInfo.entrustingUnit && scope.row.entrustInfo.entrustingUnit.name != null&&scope.row.entrustInfo.entrustingUnit.name != '' )?
                    scope.row.entrustInfo.entrustingUnit.name:scope.row.entrustInfo.entrustingParty}}
                  </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="entrustInfo.contact.name"
                    show-overflow-tooltip
                    label="联系人"
            />
            <el-table-column
                    prop="entrustInfo.contact.phone"
                    show-overflow-tooltip
                    label="联系电话"
            />
            <el-table-column
                    prop="entrustInfo.authenticatedTarget"
                    show-overflow-tooltip
                    label="鉴定对象"
            />
            <el-table-column
                    prop="createDate"
                    show-overflow-tooltip
                    label="登记日期"
            />
            <el-table-column prop="createBy.hrStaff.name" label="登记人" show-overflow-tooltip />
            <el-table-column prop="auth1.participant.hrStaff.name" label="第一鉴定人"  min-width="50%" show-overflow-tooltip/>
            <el-table-column prop="financeInfo.amountReceivable.yuanFmt" label="应收金额"  min-width="50%" show-overflow-tooltip/>
            <!-- <el-table-column prop="financeInfo.amountReceived.yuanFmt" label="已收金额" min-width="50%" show-overflow-tooltip/> -->
            <el-table-column prop="caRefuseInfoDto.refuseReason.label" show-overflow-tooltip label="不予受理原因"  min-width="150%">

                <template slot-scope="scope" v-if="scope.row.caRefuseInfoDto">
                  <span>
                    <!-- {{scope.row.caRefuseInfoDto.refuseReason&&scope.row.caRefuseInfoDto.refuseReason.label.indexOf('其他')>-1?
                    scope.row.caRefuseInfoDto.refuseReasonOther:scope.row.caRefuseInfoDto.refuseReason.label}} -->
                    {{scope.row.caRefuseInfoDto.refuseReason&&scope.row.caRefuseInfoDto.refuseReason.label}}
                  </span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-footer">
            <pagination
                    :pcurrent.sync="page.current"
                    :page.sync="page"
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    port="refusefListApi"
                    :orgId="orgId"
            />
        </div>
    </div>
</template>

<script>
    import SelectFromQualification from "@/components/common/SelectFromQualification";
    import commonNum from '@/utils/commonNum.js';
    import {mapState} from "vuex";
    export default {
        components: {
            "select-qualification": SelectFromQualification,
        },
        name: "RefusefList",
        data() {
            return {
                panClass: {
                    sm: { span: 12 },
                    md: { span: 8 },
                    xl: { span: 6, offset: 1 }
                },
                page: { current: 1, pageSize: 30, total: 0 },
                tableData: [],
                tablesort: null,
                searchdata: {},
                searchForm: { entrustingUnit: {} }
            };
        },
        methods: {
            search() {
                let dates = this.searchForm.applyDates;
                if (dates) {
                    this.searchForm.applyDateBegin = dates[0];
                    this.searchForm.applyDateEnd = dates[1];
                }
                this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
                delete this.searchdata.applyDates;
            },
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "不予受理列表")
            this.tableHeight = window.innerHeight - commonNum.tableBottom + 42 + 'px';
        },
        computed:{
            ...mapState("login", ["headerTitle","orgId"])
        },
        watch: {
            'orgId':function (newVal, oldVal) {
                this.searchForm = { entrustingUnit: {} };
                //清空表单
                // this.$refs.searchForm.resetFields();

            },
        },
    };
</script>

<style scoped>

</style>