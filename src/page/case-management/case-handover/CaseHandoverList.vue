<template>
    <div>
        <PageBar title1="案件管理" title2="案件交接列表"></PageBar>
        <div class="search-box" style="overflow: hidden">
            <el-form  :model="searchForm" size="small" label-width="130px">
                <el-row >
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="专业类别">
                            <select-from-table
                                    className="multiple-select"
                                    :model.sync="searchForm.professionCategoryId"
                                    port="profession"
                                    :modelId="true"
                                    :clearable="true"></select-from-table>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="被鉴定对象">
                            <el-input v-model="searchForm.authenticatedTarget"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="案件编号">
                            <el-input v-model="searchForm.caseNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="委托日期">
                            <el-date-picker
                                    style="width: 100%"
                                    v-model="searchForm.entrustingDate"
                                    type="date"
                                    placeholder="委托日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="鉴定助理">
                            <el-input v-model="searchForm.assist"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="第一鉴定人">
                            <el-input v-model="searchForm.auth1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="移交人">
                            <el-input v-model="searchForm.assist"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="接收人">
                            <el-input v-model="searchForm.auth1"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="申请时间">
                            <el-date-picker
                                    style="width: 100%"
                                    v-model="searchForm.entrustingDate"
                                    type="date"
                                    placeholder="申请时间"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="完成时间">
                            <el-date-picker
                                    style="width: 100%"
                                    v-model="searchForm.entrustingDate"
                                    type="date"
                                    placeholder="完成时间"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="交接状态">
                            <select-from-enum
                                    className="multiple-select"
                                    :model.sync="searchForm.FlowCaseStatus"
                                    :clearable="true"
                                    type="flow.FlowCaseStatus"
                                    :modelVal="true"></select-from-enum>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="1" :offset="3">
                        <el-button type="primary"  size="small" @click="search">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-button type="primary"  size="small" >导出Excel</el-button>
        <Table
                :data.sync="tableData"
                :search.sync="searchdata"
                :sort.sync="tablesort"
                port=""
                :hasPaging="true">
            <template solt>
                <el-table-column
                        prop="name"
                        label="专业类别">
                </el-table-column>

                <el-table-column
                        prop="name"
                        label="案件编号">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="委托方">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="鉴定对象">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="委托日期">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="鉴定助理">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="第一鉴定人">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="案件状态">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="移交人">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="案件流程角色">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="纸质材料移交">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="接收人">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="交接状态">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="完成时间">
                </el-table-column>

            </template>
        </Table>
    </div>
</template>

<script>
    export default {
        name: "CaseHandoverList",
    data(){
            return{
                panClass:{
                    sm:{span:12},
                    md:{span:8},
                    xl:{span:6,offset:1}
                },
                page:{current:1,pageSize:30,total:0},
                tableData:[],
                tablesort:null,
                searchdata:{},
                searchForm:{},
            }
    },
        methods:{
            search(){

            }
        }
    }
</script>

<style scoped>

</style>