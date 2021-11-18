<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="试剂盒列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" :inline=true label-width="100px">

                    <el-form-item label="试剂盒名称">
                        <el-input v-model.trim="searchForm.name" class="w215"/>
                    </el-form-item>

                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>

                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    port="dnaKit"
                    :hasPaging="true"
                    :selfDefinedBtn=true>
                <template solt>
                    <el-table-column
                            label="序号">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="试剂盒名称">
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" icon="el-icon-sort"
                                       @click="locusSort(scope.$index,scope.row)"></el-button>
                            <el-button type="warning" plain size="small" icon="el-icon-edit"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" plain size="small" icon="el-icon-delete"
                                       @click="deleteRow(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="试剂盒添加" name="form"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../../api'

    export default {
        name: "List",
        data() {
            return {
                activeName: 'list',
                page: {current: 1, pageSize: 30, total: 0},
                tableData: [],
                tablesort: null,
                searchdata: {},
                searchForm: {
                    name: ''
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
                this.$get(api.dnaKit, searchData).then((res) => {
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
                sessionStorage.setItem("dnaKitSearchData",JSON.stringify(data));
                this.searchdata = data;
            },
            locusSort(index, row){
                this.$router.push({path: '/dna/kit/locusSortForm', query: {'id': row.id}})
                    .catch(err => {
                        console.log(err)
                    });
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除试剂盒' + row.name + '?').then((res) => {
                    this.$del(api.dnaKit + '/' + row.id).then((res) => {
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
                this.$router.push({path: '/dna/kit/form', query: {'id': row.id}})
                    .catch(err => {
                        console.log(err)
                    });
            },

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval != 'list') {
                    this.$router.push({path: '/dna/kit/form'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        created(){
            if(sessionStorage.getItem("dnaKitSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("dnaKitSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>