<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="字典列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" :inline="true" label-width="80px">
                    <el-form-item label="标签" prop="label">
                        <el-input v-model.trim="searchForm.label"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="searchForm.type" clearable @keyup.enter.native="search" filterable>
                            <el-option
                                    v-for="item in typeOpt"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model.trim="searchForm.description" @keyup.enter.native="search"></el-input>
                    </el-form-item>
                    <el-button
                            icon="el-icon-search"
                            size="small"
                            type="primary"
                            @click="search"
                            style="color: white">查询
                    </el-button>
                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    port="dict"
                    :hasPaging="true"
                    :selfDefinedBtn="true">
                <template solt>
                    <!--                    <el-table-column-->
                    <!--                            prop="value"-->
                    <!--                            label="键值">-->
                    <!--                    </el-table-column>-->
                    <el-table-column
                            prop="label"
                            label="标签">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="描述">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                       @click.native.prevent="deleteRow(scope.$index,scope.row)"></el-button>
                            <el-button type="primary" plain icon="el-icon-plus" size="mini"
                                       @click.native.prevent="add(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="字典添加" name="form"></el-tab-pane>
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
                tablesort: null,
                searchdata: {},
                searchForm: {},
            }
        },
        methods: {

            init(data) {
                var searchData = JSON.parse(JSON.stringify(data));
                searchData["page.current"] = this.page.current;
                searchData["page.pageSize"] = this.page.pageSize;
                this.$get(api.dict, searchData).then((res) => {
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
                this.searchdata = data;
            },
            //删除
            deleteRow(index, row) {
                this.$confirmBox('确定删除字典' + row.label + '?').then((res) => {
                    this.$del(api.dict + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.dictInit();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push({path: '', query: {'id': row.id}})
                    .catch(err => {
                        console.log(err)
                    });
            },
            //增加
            add(index, row) {
                var data = JSON.parse(JSON.stringify(row));
                this.$router.push(
                    {path: '', query: {sort: data.sort, description: data.description, type: data.type}}
                ).catch(err => {
                    console.log(err)
                });

            },

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval != 'list') {
                    this.$router.push({path: ''}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
    }
</script>

<style scoped>

</style>