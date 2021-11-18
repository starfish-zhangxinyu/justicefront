<template>
    <div id="inspection-equipment">
        <PageBar title1="基础数据" title2="检验设备"></PageBar>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="检验设备列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" :inline="true" label-width="100px">

                        <el-form-item label="设备编号">
                            <el-input v-model.trim="searchForm.serialNumber" @keyup.enter.native="search"></el-input>
                        </el-form-item>

                        <el-form-item label="检验设备名称">
                            <el-input v-mode.triml="searchForm.name" @keyup.enter.native="search"></el-input>
                        </el-form-item>

                        <el-form-item label="专业类别">
                            <select-from-table :model.sync="searchForm.professionCategoryId" port="profession"
                                               :modelId="true" :clearable="true"
                                               @keyup.enter.native="search"></select-from-table>
                        </el-form-item>

                        <el-form-item label="溯源方式">
                            <select-from-dict :clearable="true" :model.sync="searchForm.traceModeId" :filterable="true"
                                              data_type="trace_mode" :modelId="true"
                                              @keyup.enter.native="search"></select-from-dict>
                        </el-form-item>

                        <el-form-item label="校验单位">
                            <select-from-dict :clearable="true" :model.sync="searchForm.calibrateOrgId"
                                              :filterable="true" data_type="calibrate_org" :modelId="true"
                                              @keyup.enter.native="search"></select-from-dict>
                        </el-form-item>

                        <el-button type="primary" icon="el-icon-search" size="small"
                                   style="color: white;" @click="search">查询
                        </el-button>
                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="serialNumber"
                            label="设备编号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="检验设备名称">
                    </el-table-column>
                    <el-table-column
                            prop="modelNumber"
                            label="型号/规格">
                    </el-table-column>
                    <el-table-column
                            prop="traceMode.label"
                            label="溯源方式">
                    </el-table-column>
                    <el-table-column
                            prop="calibratePeriod"
                            label="校验周期（月）">
                    </el-table-column>
                    <el-table-column
                            prop="calibrateOrg.label"
                            label="校验单位">
                    </el-table-column>
                    <el-table-column
                            prop="professionCategoryList"
                            label="专业类别">
                        <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
              {{transform(scope.row.professionCategoryList)}}
             </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
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
                            port="instrument">
                    </pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'检验设备添加':'检验设备修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="equipmentForm" label-width="100px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="设备编号">
                                <el-input v-model.trim="addForm.serialNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="设备名称" :rules='required'>
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="型号/规格">
                                <el-input v-model.trim="addForm.modelNumber"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="溯源方式">
                                <select-from-dict :model.sync="addForm.traceMode" :filterable="true"
                                                  data_type="trace_mode" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="校验周期" :rules='required'>
                                <el-input v-model.trim="addForm.calibratePeriod">
                                    <template slot="append">个月</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="校准机构">
                                <select-from-dict :model.sync="addForm.calibrateOrg" :filterable="true"
                                                  data_type="calibrate_org" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="专业类别" :rules='required'>
                                <select-from-table :model.sync="addForm.professionCategoryList" port="profession"
                                                   :multiple=true className="multiple-select">
                                    <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                                </select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="11">
                        <el-button type="success" size="mini" class="save-btn" @click="save('equipmentForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                </el-row>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Select2 from '../../components/common/Select2'
    import api from '../../api/index'

    export default {
        components: {'Select2': Select2},
        name: "InspectionEquipment",
        data() {
            return {
                activeName: 'list',
                searchForm: {},
                isAdd: true,
                page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                tableData: [],
                addForm: {professionCategoryList: []},
            }
        },
        methods: {
            init() {
                this.$get(api.instrument,
                    {
                        "page.current": this.page.current,
                        "page.pageSize": this.page.pageSize,
                    }
                ).then((res) => {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.activeName = "list";
                }).catch((err) => {
                    console.log(err)
                })
            },
            transform(arr) {
                var str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ',';
                }
                return str.substr(0, str.length - 1);
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
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
                            this.init();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist';
                var data = JSON.parse(JSON.stringify(row));

                this.addForm = data;
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));

                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (this.activeName == 'addlist') {
                            this.$post(api.instrument, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            this.$put(api.instrument + '/' + data.id, data,).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.isAdd = true;
                } else if (newval == 'addlist') {
                    this.addForm = {professionCategoryList: []}
                }
            }
        }
    }
</script>

<style scoped>

</style>
