<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验设备列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" label-width="150px">
                    <el-row>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="设备编号">
                                <el-input v-model.trim="searchForm.serialNumber"
                                          @keyup.enter.native="search"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="检验设备名称">
                                <el-input v-model.triml="searchForm.name" @keyup.enter.native="search"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="专业类别">
                                <select-from-table className="w100"
                                        :model.sync="searchForm.professionCategoryId"
                                        port="profession" :modelId="true" :clearable="true"
                                        @keyup="search"></select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="溯源方式" class="margin0">
                                <select-from-dict className="w100"
                                        :model.sync="searchForm.traceModeId"
                                        :clearable="true"
                                        :filterable="true" data_type="trace_mode" :modelId="true"
                                        @keyup="search"></select-from-dict>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="校验单位" class="margin0">
                                <select-from-dict className="w100"
                                        :model.sync="searchForm.calibrateOrgId"
                                        :clearable="true"
                                        :filterable="true" data_type="calibrate_org" :modelId="true"
                                        @keyup="search"></select-from-dict>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="校准到期日期时间">
                                <DataPicker :startValue.sync="searchForm.calibrateLastDateStart"
                                            :endValue.sync="searchForm.calibrateLastDateEnd"
                                            valueFormat="yyyy/MM/dd HH:mm:ss"
                                            isImmediate/>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                            <el-form-item label="设备状态" class="margin0">
                                <select-from-enum :model.sync="searchForm.status" :clearable="true" type="base.InstrumentStatus" :modelVal="true" class-name="w100"></select-from-enum>
                            </el-form-item>
                        </el-col>
                            <el-button type="primary" icon="el-icon-search" size="small"
                                       style="color: white;float:right" @click="search">查询
                            </el-button>
                    </el-row>

                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    :page.sync="page"
                    port="instrument"
                    :hasPaging="true"
                    :selfDefinedBtn="true"
                    :maxHeight="tableHeight"
                    ref="instrumentTable">
                <template solt>
                    <el-table-column
                            prop="serialNumber"
                            show-overflow-tooltip
                            label="设备编号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            show-overflow-tooltip
                            label="检验设备名称">
                    </el-table-column>
                    <el-table-column
                            prop="modelNumber"
                            show-overflow-tooltip
                            label="型号/规格">
                    </el-table-column>
                    <el-table-column
                            prop="traceMode.label"
                            show-overflow-tooltip
                            label="溯源方式">
                    </el-table-column>
                    <el-table-column
                            prop="calibratePeriod"
                            show-overflow-tooltip
                            label="校验周期（月）">
                    </el-table-column>
                    <el-table-column
                            prop="calibrateOrg.label"
                            show-overflow-tooltip
                            label="校验单位">
                    </el-table-column>
                    <el-table-column
                            prop="professionCategoryList"
                            show-overflow-tooltip
                            label="专业类别">
                        <template slot-scope="scope">
                              <span v-if="scope.row.professionCategoryList">
                              {{transform(scope.row.professionCategoryList)}}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="purchaseDate"
                            show-overflow-tooltip
                            label="购置时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.purchaseDate && scope.row.purchaseDate.slice(0, 11)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="purchasePrice.yuanFmt"
                            show-overflow-tooltip
                            label="购置金额">
                    </el-table-column>
                    <el-table-column
                            prop="calibrateLastDate"
                            show-overflow-tooltip
                            label="校验日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.calibrateLastDate && scope.row.calibrateLastDate.slice(0, 11)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status.label"
                            show-overflow-tooltip
                            label="设备状态">
                    </el-table-column>
                    <el-table-column
                            label="操作" width="250px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="primary" plain icon="el-icon-folder-opened" size="mini"
                                       @click="openRecord(scope.$index,scope.row)"></el-button>
                            <el-button type="primary" plain icon="el-icon-edit-outline" size="mini"
                                       @click.native.prevent="openStatusDiag(scope.$index, scope.row)"></el-button>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </template>
            </Table>
            <el-dialog  :visible.sync="instrumentStatusDiag">
                <el-form :model="instrumentStatusForm" ref="instrumentStatusForm"  size="small" label-width="100px">
                    <el-row>
                        <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                            <el-form-item label="设备状态"  :rules="$filter_rules({required:true,trigger:'change'})"
                                          prop="instrumentStatus"
                                          >
                                <select-from-enum :model.sync="instrumentStatusForm.instrumentStatus" :clearable="true"
                                                  type="base.InstrumentStatus" :modelVal="true" className="w100"></select-from-enum>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                            <el-form-item label="停用时间" :rules="$filter_rules({required:true})" prop="stopDate"
                                          v-if="instrumentStatusForm && instrumentStatusForm.instrumentStatus == 'STOP'||instrumentStatusForm.instrumentStatus == 'REPAIRING'">
                                <el-date-picker
                                        v-model="instrumentStatusForm.stopDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        class="w100"
                                        >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                            <el-form-item label="报废时间" :rules="$filter_rules({required:true})" prop="scrappedDate"
                                          v-if="instrumentStatusForm && instrumentStatusForm.instrumentStatus == 'SCRAPPED'">
                                <el-date-picker
                                        v-model="instrumentStatusForm.scrappedDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        class="w100"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                            <el-form-item label="恢复时间" prop="recoveryDate"
                                          v-if="instrumentStatusForm && instrumentStatusForm.instrumentStatus !== 'SCRAPPED'">
                                <el-date-picker
                                        v-model="instrumentStatusForm.recoveryDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        class="w100"
                                       >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="confirmChangeStatus('N')">取 消</el-button>
                    <el-button type="primary" @click="confirmChangeStatus('Y')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog  :visible.sync="instrumentRecord">
                <!--:data.sync="tableData"
                :search.sync="searchRecord"
                :sort.sync="tablesort"
                :page.sync="page"
                :maxHeight="tableHeight"-->
                <!--ref="instrumentTable"-->
                <Table  :search.sync="searchRecord"
                        port="changeInstrumentStatus"
                        :hasPaging="true"
                        :data.sync="tableRecordData"
                        :selfDefinedBtn="true"
                        ref="tableRecord"
                        >
                    <template solt>
                        <el-table-column
                                prop="stopDate"
                                show-overflow-tooltip
                                label="停止使用日期" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.stopDate && scope.row.stopDate.slice(0, 11)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="recoveryDate"
                                show-overflow-tooltip
                                label="恢复使用日期"
                                align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.recoveryDate && scope.row.recoveryDate.slice(0, 11)}}</span>
                            </template>
                        </el-table-column>
                    </template>
                </Table>
            </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="检验设备添加" show-overflow-tooltip name="form"></el-tab-pane>
        <el-tab-pane label="检验设备导入" show-overflow-tooltip name="import"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'

    export default {
        name: "List",
        data() {
            return {
                activeName: 'list',
                page: {current: 1, pageSize: 30, total: 0},
                tableData: [],
                tableRecordData:[],
                tablesort: null,
                searchdata: {},
                searchForm: {calibrateLastDateStart:null,calibrateLastDateEnd:null},
                searchRecord:{},
                 panClass: {
                    sm: { span: 12 },
                    md: { span: 8 },
                    xl: { span: 6, offset: 1 }
                },
                innerPanClass: {
                    sm: {span: 12},
                    md: {span: 12},
                    xl: {span: 12}
                },
                instrumentStatusDiag: false,
                instrumentRecord: false,
                instrumentStatusForm: {
                    instrumentStatus: '',
                    stopDate: '',
                    recoveryDate:'',
                    scrappedDate:'',
                },
            }
        },
        methods: {
            transform(arr) {
                var str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ',';
                }
                return str.substr(0, str.length - 1);
            },
            init(data) {
                var searchData = JSON.parse(JSON.stringify(data));
                searchData["page.current"] = this.page.current;
                searchData["page.pageSize"] = this.page.pageSize;
                this.$get(api.instrument, searchData).then((res) => {
                    this.tableData = res.data.list;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.page.total = res.data.total;
                }).catch((err) => {
                    console.log(err)
                })
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("instrumentSearchData",JSON.stringify(data));
                this.searchdata = data;
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除检验设备' + row.name + '?').then((res) => {
                    this.$del(api.instrument + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init(this.searchdata);
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push({path: '/auth/instruments/form', query: {'id': row.id}})
                    .catch(err => {
                        console.log(err)
                    });
            },
            openRecord(index, row) {
                this.searchRecord.id = row.id;
                this.instrumentRecord = true;
                this.searchRecord['page.pageSize'] = 30;
                this.searchRecord["page.current"] = 1;
                this.$nextTick(() => {
                    this.$refs['tableRecord'].init(this.searchRecord);
                })

            },
            openStatusDiag(index, row) {
                this.$refs['instrumentStatusForm'] && this.$refs['instrumentStatusForm'].resetFields();
                this.instrumentStatusDiag = true;
                this.activeInstrument = row;
            },
            confirmChangeStatus(sign) {
                if(sign === 'Y') {
                    this.$refs['instrumentStatusForm'].validate(valid => {
                        if(valid) {
                            this.$put(api.changeInstrumentStatus,{
                                baseInstrument:{
                                    id: this.activeInstrument.id
                                },
                                stopDate: this.instrumentStatusForm.stopDate,
                                recoveryDate: this.instrumentStatusForm.recoveryDate,
                                instrumentStatus: this.instrumentStatusForm.instrumentStatus
                            }).then(() => {
                                this.$message.success('修改成功！');
                                this.instrumentStatusDiag = false;
                                this.init(this.searchdata)
                            }).catch(e => {
                                this.$message.error(e.errMsg);
                            })
                        }
                    })
                }else {
                    this.instrumentStatusDiag = false;
                }
            },
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval != 'list') {
                    if (newval =='form') {
                        this.$router.push({path: '/auth/instruments/form'}).catch(err => {
                            console.log(err)
                        });
                    }else {
                        this.$router.push({path: '/auth/instruments/import'}).catch(err => {
                            console.log(err)
                        });
                    }

                }
            }
        },
        created(){
            this.tableHeight = window.innerHeight - 385 + 'px';
            if(sessionStorage.getItem("instrumentSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("instrumentSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>