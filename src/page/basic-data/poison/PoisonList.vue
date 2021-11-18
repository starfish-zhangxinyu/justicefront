<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="毒物列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" label-width="100px" :inline="true">
                    <el-form-item label="毒物分类">
                        <select-from-table :model.sync="searchForm.poisonCategoryId" port="poisonCategory"
                                           :clearable="true" :modelId="true"></select-from-table>
                    </el-form-item>
                    <el-form-item label="毒物名称">
                        <el-input v-model.trim="searchForm.poisonName" class="w215"/>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="search">
                        查询
                    </el-button>
                </el-form>
            </div>
            <el-table
                    :span-method="arraySpanMethod"
                    :data="tableData"
                    border
                    size="small"
                    style="width: 100%">
                <el-table-column
                        prop="parent.name"
                        label="毒物分类名称">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="毒物名称">
                </el-table-column>
                <el-table-column
                        label="毒物分类操作" width="150px" align="center" v-if="!selfDefinedBtn">
                    <template slot-scope="scope" v-if="scope.row.parent">
                        <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                   @click="editPoisonCategory(scope.$index, scope.row)"></el-button>
                        <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                   @click.native.prevent="deleteCategory(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        label="毒物操作" width="150px" align="center" v-if="!selfDefinedBtn">
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
                        port="poison">
                </pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="毒物添加" name="form"></el-tab-pane>
        <el-tab-pane label="毒物导入" name="import"></el-tab-pane>
        <!--毒物分类修改-->
        <el-dialog title="修改毒物分类" :visible.sync="editPoisonCategoryDialog" width="30%">
            <el-form :model="editPoisonCategoryForm" ref="editPoisonCategoryForm" label-width="130px">
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-form-item label="毒物分类名称" prop="name" :rules="$filter_rules({required:true})">
                            <el-input v-model="editPoisonCategoryForm.name" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editPoisonCategoryDialog = false">取 消</el-button>
                <el-button type="primary" @click="savePoisonCategory('editPoisonCategoryForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-tabs>

</template>

<script>
    import api from '../../../api/index.js'

    export default {
        name: "List",
        data() {
            return {
                activeName: 'list',
                tableData: [],
                tablesort: null,
                spanArr: [],//合并参数
                searchdata: {},
                searchForm: {},
                editPoisonCategoryForm: {},
                editPoisonCategoryDialog: false,//修改毒物分类模态框
                page: {current: 1, pageSize: 30, total: 0},
                selfDefinedBtn: false
            }
        },
        methods: {
            poisonInit() {
                var searchData = this.searchdata;
                searchData["page.current"] = this.page.current;
                searchData["page.pageSize"] = this.page.pageSize;
                this.$get(api.poison, searchData).then((res) => {
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
                sessionStorage.setItem("poisonSearchData", JSON.stringify(data));
                this.searchdata = data;
            },
            getSpanArr(data) {
                this.spanArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].parent != null && data[i - 1].parent != null && data[i].parent.id === data[i - 1].parent.id) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                var exceptColArr = [1, 3];
                if (exceptColArr.indexOf(columnIndex) == -1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除毒物' + row.name + '?').then((res) => {
                    this.$del(api.poison + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.poisonInit();
                        }

                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push(
                    {path: '/auth/poison/PoisonForm', query: {'id': row.id}}
                ).catch(err => {
                    console.log(err)
                });
            },
            deleteCategory(index, row) {

                if (row.parent.name != '' && row.parent.id != '') {
                    this.$confirmBox('确定删除毒物分类' + row.parent.name + '?').then((res) => {
                        this.$del(api.poison + '/' + row.parent.id).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success'
                                });
                                this.poisonInit();
                            }

                        }).catch((err) => {
                            console.log(err)
                        });
                    }).catch((err) => {
                    });
                }
            },
            editPoisonCategory(index, row) {
                this.editPoisonCategoryDialog = true;
                this.editPoisonCategoryForm = JSON.parse(JSON.stringify(row.parent));
            },
            savePoisonCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = this.editPoisonCategoryForm;
                        this.$put(api.poison + '/' + data.id, data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                this.poisonInit();
                                this.editPoisonCategoryDialog = false;
                            }
                        }).catch((err) => {
                            this.$message.error(err.errMsg);
                        });
                    }
                });
            },
        },
        watch: {
            'tableData': {
                handler(newVal, oldVal) {
                    this.getSpanArr(this.tableData);
                },
                immediate: true
            },
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/poison/PoisonList'}).catch(err => {
                        console.log(err)
                    });
                } else if (newval == 'import') {
                    this.$router.push({path: '/auth/poison/import'}).catch(err => {
                        console.log(err)
                    });
                } else {
                    this.$router.push({path: '/auth/poison/PoisonForm'}).catch(err => {
                        console.log(err)
                    });
                }
            },
        },
        created() {
            if (sessionStorage.getItem("poisonSearchData")) {
                this.searchdata = JSON.parse(sessionStorage.getItem("poisonSearchData"));
                this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>