<template>
    <div id="material-identification">
        <PageBar title1="基础数据" title2="鉴定材料"></PageBar>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="鉴定材料列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="100px">
                        <el-row>
                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="鉴定材料名称">
                                    <el-input v-model.trim="searchForm.name" @keyup.enter.native="search"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="专业类别">
                                    <select-from-table :model.sync="searchForm.professionCategoryId" port="profession"
                                                       :modelId="true" :clearable="true"
                                                       @keyup="search"></select-from-table>
                                </el-form-item>
                            </el-col>

                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="类型">
                                    <select-from-dict
                                            :clearable="true"
                                            :model.sync="searchForm.materialTypeId"
                                            :filterable="true" data_type="material_type"
                                            @keyup.enter.native="search"
                                            :modelId="true"></select-from-dict>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="材料性质">
                                    <select-from-dict
                                            @keyup.enter.native="search"
                                            :model.sync="searchForm.materialPropertyId"
                                            :filterable="true" data_type="material_property"
                                            :modelId="true" :clearable="true"></select-from-dict>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="规格">
                                    <select-from-dict
                                            @keyup.enter.native="search"
                                            :model.sync="searchForm.materialUnitId"
                                            :filterable="true" data_type="unit_type"
                                            :modelId="true" :clearable="true"></select-from-dict>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="{span:7,offset:1}">
                                <el-form-item label="处理方式">
                                    <select-from-dict
                                            @keyup.enter.native="search"
                                            :model.sync="searchForm.handleTypeId"
                                            :filterable="true" data_type="handle_type"
                                            :modelId="true" :clearable="true"></select-from-dict>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1" :offset="22">
                                <el-button type="primary" icon="el-icon-search" size="small"
                                           style="color: white" @click="search">查询
                                </el-button>
                            </el-col>
                        </el-row>
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
                            prop="name"
                            label="鉴定材料名称">
                    </el-table-column>
                    <el-table-column
                            prop="materialType.label"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="materialProperty.label"
                            label="材料性质">
                    </el-table-column>
                    <el-table-column
                            prop="materialUnit.label"
                            label="规格">
                    </el-table-column>
                    <el-table-column
                            prop="handleType.label"
                            label="处理方式">
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
                            <el-button type="warning" icon="el-icon-edit" plain size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" plain size="mini"
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
                            port="auth"
                    >
                    </pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'鉴定材料添加':'鉴定材料修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="materialForm" label-width="100px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="鉴定材料名称" :rules='required'>
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="专业类别" :rules='required'>
                                <select-from-table :model.sync="addForm.professionCategoryList" port="profession"
                                                   :multiple=true className="multiple-select"></select-from-table>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="类型">
                                <select-from-dict data_type="material_type" :model.sync="addForm.materialType"
                                                  className="multiple-select" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="材料性质">
                                <select-from-dict data_type="material_property" :model.sync="addForm.materialProperty"
                                                  className="multiple-select" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="规格">
                                <select-from-dict data_type="unit_type" :model.sync="addForm.materialUnit"
                                                  className="multiple-select" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="处理方式">
                                <select-from-dict data_type="handle_type" :model.sync="addForm.handleType"
                                                  className="multiple-select" :clearable="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="是否默认" :rules='required'>
                                <el-radio-group v-model="addForm.isDefault">
                                    <el-radio label="Y">是</el-radio>
                                    <el-radio label="N">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('materialForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                                class="el-icon-arrow-left"></i> 返回
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
        name: "MaterialIdentification",
        components: {'Select2': Select2},
        data() {
            return {
                page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                activeName: 'list',
                searchForm: {},
                isAdd: true,
                tableData: [{'name': 'jackson'}],
                addForm: {},
                aaa: 'aaa'
            }
        },
        methods: {
            init() {
                this.$get(api.auth,
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
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist'
                var data = JSON.parse(JSON.stringify(row));
                this.addForm = data;
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除' + row.name + '?').then((res) => {
                    this.$del(api.auth + '/' + row.id).then((res) => {
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
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'addlist') {
                            this.$post(api.auth, data).then((res) => {
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
                            this.$put(api.auth + '/' + data.id, data,).then((res) => {
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
                })
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.isAdd = true;
                } else if (newval == 'addlist') {
                    this.addForm = {}
                }
            }
        }
    }
</script>

<style scoped>

</style>
