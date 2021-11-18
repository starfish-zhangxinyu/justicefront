<template>
    <div id="CaseSuspendList">
        <div class="search-box" style="overflow: hidden">
            <el-form :model="searchForm" size="small" label-width="100px">
                <el-row>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="专业类别" >
                            <select-from-table :model.sync="searchForm.professionCategoryId"
                                               port="profession"
                                               :model-id="true"
                                               :clearable="true"
                                               className="multiple-select"
                                               :org-id="orgId"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="案件编号" >
                            <el-input v-model="searchForm.caseNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="鉴定对象" >
                            <el-input v-model="searchForm.authenticatedTarget"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                        <el-form-item label="流水号"  class="margin0">
                            <el-input v-model="searchForm.serialNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button icon="el-icon-search" size="small" type="primary"
                               style="color: white;float:right" @click="search"
                    >查询
                    </el-button>
                </el-row>
            </el-form>
        </div>
        <el-button size="small" type="primary" style="margin-bottom: 10px" v-if="hasPermission('auth:case:recover')" @click="recoverCase">案件恢复</el-button>
        <div class="el-table-self">
            <el-table
                    ref="casetable"
                    border
                    size="small"
                    @select-all="handleCheckBox"
                    @select="handleCheckBox"
                    :data="tableData"
                    style="width:100%"
                    :max-height="tableHeight">
                <el-table-column fixed width="55" type="selection"></el-table-column>
                <el-table-column prop="serialNumber" label="流水号" width="120"></el-table-column>
                <el-table-column prop="caseNo" label="案件编号" width="250px" show-overflow-tooltip> 
                    <template slot-scope="scope">
                        <router-link target="_blank" :to="{path:'/case/case-detail',query:{id:scope.row.id}}">
                            <el-link type="primary" style="font-size:12px;">{{scope.row.caseNo ? scope.row.caseNo:'无'}}</el-link>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="entrustInfo.entrustingUnit.name" label="委托方" width="120">
                    <template slot-scope="scope">
                        <span>
                                {{(scope.row.entrustInfo.entrustingUnit && scope.row.entrustInfo.entrustingUnit.name != null && scope.row.entrustInfo.entrustingUnit.name != '')?
                                    scope.row.entrustInfo.entrustingUnit.name:scope.row.entrustInfo.entrustingParty}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="entrustInfo.contact.name" label="联系人" width="120"></el-table-column>
                <el-table-column prop="entrustInfo.contact.phone" label="联系电话" width="120"></el-table-column>
                <el-table-column prop="entrustInfo.authenticatedTarget" label="鉴定对象" width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="professionCategory.name" label="专业类别" width="120"></el-table-column>
                <el-table-column prop="auditComment" label="鉴定意见" width="120"></el-table-column>
                <el-table-column prop="entrustingDate" label="委托日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.entrustingDate">{{$divideDate(scope.row.entrustingDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="acceptDate" label="受理日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.acceptDate">{{$divideDate(scope.row.acceptDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reportOutDate" label="出案日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.reportOutDate">{{$divideDate(scope.row.reportOutDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="giveDate" label="发放日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.giveInfo && scope.row.giveInfo.giveDate">{{$divideDate(scope.row.giveInfo.giveDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="archiveDate" label="归档日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.archive">{{$divideDate(scope.row.archive.archiveDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="assist.participant.hrStaff.name" label="鉴定助理" width="120"></el-table-column>
                <el-table-column prop="auth1.participant.hrStaff.name" label="第一鉴定人" width="120"></el-table-column>
                <el-table-column prop="auth2.participant.hrStaff.name" label="第二鉴定人" width="120"></el-table-column>
                <el-table-column prop="auth3.participant.hrStaff.name" label="第三鉴定人" width="120"></el-table-column>
                <el-table-column prop="authorizedSignatory.participant.hrStaff.name"
                                 label="授权签字人" width="90px"></el-table-column>
                <el-table-column prop="reviewer.participant.hrStaff.name" label="复核人"></el-table-column>
                <el-table-column prop="createBy.hrStaff.name" label="登记人"></el-table-column>
                <el-table-column prop="createDate" label="登记日期" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.createDate">{{$divideDate(scope.row.createDate)}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="flowStatus.label" label="进度（状态）" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.reportOutDate && scope.row.flowStatus.value == 'SIGNED'">已出案</span>
                        <span v-if="!scope.row.reportOutDate">{{scope.row.flowStatus.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="entrustInfo.materialAllReady" label="材料齐全">
                    <template slot-scope="scope">
                        <span>{{scope.row.entrustInfo.materialAllReady=='N'?'否':'是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="financeInfo.amount.yuanFmt" label="合同金额"></el-table-column>
                <el-table-column prop="financeInfo.amountRefund.yuanFmt" label="退费金额"></el-table-column>
                <el-table-column prop="financeInfo.discount.yuanFmt" label="减免金额" width="120"></el-table-column>
                <el-table-column prop="financeInfo.amountReceivable.yuanFmt" label="应收"></el-table-column>
                <!-- <el-table-column prop="financeInfo.amountReceived.yuanFmt" label="已收"></el-table-column> -->
                <el-table-column prop="financeInfo.actualReceivable.yuanFmt" label="实收"></el-table-column>
                <el-table-column prop="financeInfo.notReceived.yuanFmt" label="待收"></el-table-column>
                <el-table-column prop="financeInfo.invoiceAmount.yuanFmt" label="开票金额"></el-table-column>
                <!--<el-table-column fixed="right" label="操作" width="160px">-->
                <!--<template slot-scope="scope">-->

                <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div class="pagination-footer">
                <pagination
                        :pcurrent.sync="page.current"
                        :page.sync="page"
                        :data.sync="tableData"
                        :search.sync="searchdata"
                        :sort.sync="tablesort"
                        port="caCase"
                >
                </pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Collapse from '../layout/Collapse';
    import Select2 from '../../components/common/Select2'
    import PictureWall from '../../components/common/PictureWall'
    import api from '../../api/index'
    import SimpleUpload from '../../components/common/SimpleUpload'
    import Test from '../../components/common/TreeSelect'
    import commonNum from '@/utils/commonNum.js';
    import {mapState} from "vuex";

    export default {
        name: "CaseSuspendList",
        components: {
            'Collapse': Collapse, 'Select2': Select2, 'SimpleUpload': SimpleUpload,
            'PictureWall': PictureWall, 'treeSelect': Test
        },
        data() {
            return {
                page: {pageSizes: [30, 50, 80], pageSize: 5, total: 0, current: 1},
                tablesort: null,
                searchdata: {caseNature: 'suspend'},
                searchForm: {},
                tableData: [],
                selectData: [],
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
            }
        },
        inject:['hasPermission'],
        methods: {
            init() {
                this.$get(api.caCase,this.searchdata,
                    {
                        "page.current": this.page.current,
                        "page.pageSize": this.page.pageSize,
                        'caseNature': 'suspend'
                    }
                ).then((res) => {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                }).catch((err) => {
                    console.log(err)
                })
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.caseNature = 'suspend';
                this.searchdata = data;
            },
            handleCheckBox(selection) {
                this.selectData = [];
                this.selectData = [].concat(selection);
            },
            recoverCase() {
                if (this.selectData.length > 0) {
                    var data = this.selectData.map((v, i) => {
                        return v.id;
                    });
                    this.$confirmBox("确定恢复该案件吗？").then(res => {
                        this.$put('/api/ca-case/v1/cases/restore', data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '案件恢复成功！',
                                    type: 'success'
                                });
                            }
                            this.init();
                            // this.selectData = [];
                            this.$refs.casetable.clearSelection();
                        }).catch((err) => {
                            console.log(err)
                        });
                    }).catch(err => {
                    });
                } else {
                    this.$message.error('您还没有选择需要操作的案件！')
                }
            }
        },
        watch: {
            "orgId": function (newVal,oldVal) {
                this.searchForm = {};
                this.init();
            }
        },
        computed: {
            ...mapState("login",["headerTitle","orgId"]),
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "案件中止列表")
            this.tableHeight = window.innerHeight - commonNum.tableBottom + 'px';
        }
    }
</script>

<style scoped>

</style>