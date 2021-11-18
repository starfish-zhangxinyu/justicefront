<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基因频率列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" :inline=true label-width="100px">

                    <el-form-item label="基因座名称">
                        <el-input v-model.trim="searchForm.dnaLocus" class="w215"/>
                    </el-form-item>

                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>

                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    port="geneFreq"
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
                            prop="frequencyType.label"
                            label="基因频率分布表名称">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="150px">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" icon="el-icon-edit" plain
                                       @click="edit(scope.$index, scope.row)"/>
                            <el-button type="danger" size="small" icon="el-icon-delete" plain
                                       @click="deleteRow(scope.$index, scope.row)"/>
                        </template>
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="基因频率导入" name="import"></el-tab-pane>
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
                    dnaLocus: ''
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
                this.$get(api.geneFreqType, searchData).then((res) => {
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
                sessionStorage.setItem("geneFreqSearchData",JSON.stringify(data));
                this.searchdata = data;
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除基因频率' + row.frequencyType.label + '?').then((res) => {
                    this.$del(api.geneFreq + '/' + row.frequencyType.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.search();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push({
                    path: '/gene-freq/form',
                    query: {'id': row.frequencyType.id, "frequencyTypeLabel": row.frequencyType.label}
                })
                .catch(err => {
                    console.log(err)
                });
            },

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval != 'list') {
                    if(newval == 'import'){
                        this.$router.push({path: '/gene-freq/import'}).catch(err => {
                            console.log(err)
                        });
                        return;
                    }
                    this.$router.push({path: '/gene-freq/form'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        created(){
            if(sessionStorage.getItem("geneFreqSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("geneFreqSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>