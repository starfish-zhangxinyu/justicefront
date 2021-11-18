<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验数据类型列表" name="groupList"></el-tab-pane>
        <el-tab-pane label="检验数据类型添加" name="groupForm"></el-tab-pane>
        <el-tab-pane label="检验数据列表" name="itemList">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" label-width="100px" :inline="true">
                    <el-form-item label="专业类别">
                        <select-from-table :model.sync="searchForm.professionCategoryId" port="profession"
                                           @keyup="search"
                                           :clearable="true" :modelId="true"></select-from-table>
                    </el-form-item>
                    <el-form-item label="检验数据类型">
                        <select-from-table :model.sync="searchForm.authDataItemGroupId" port="authDataGroup"
                                           @keyup="search"
                                           :clearable="true" :modelId="true" :filterable="true"></select-from-table>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model.trim="searchForm.name" @keyup.enter.native="search"  class="w215"/>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="search">
                        查询
                    </el-button>
                </el-form>
            </div>
            <Table :data.sync="tableData"
                   :page="page"
                   :search.sync="searchdata"
                   port="authDataItem"
                   @edit="edit"
                   :hasPaging="true"
                   @deleteRow="deleteRow"
                   :selfDefinedBtn="false">
                <template solt>
                    <el-table-column
                            prop="name"
                            label="检验数据名称">
                    </el-table-column>
                    <el-table-column
                            prop="authDataItemGroup.name"
                            label="检验数据类型">
                    </el-table-column>
                    <el-table-column
                            prop="authDataItemUnit.label"
                            label="单位">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排列顺序">
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="检验数据添加" name="itemForm"></el-tab-pane>
        <el-tab-pane label="检验数据导入" name="itemImport"></el-tab-pane>
    </el-tabs>
    
</template>

<script>
    import api from '../../../api/index.js'
    export default {
        name: "List",
        data() {
            return {
                activeName: 'itemList',
                tableData: [],
                tablesort: null,
                searchdata: {},
                searchForm: {},
                page: {current: 1, pageSize: 30, total: 0}
            }
        },
        methods: {
            authDataItemInit() {
                var searchData = this.searchdata;
                searchData["page.current"]=this.page.current;
                searchData["page.pageSize"]=this.page.pageSize;
                this.$get(api.authDataItem,searchData).then((res) => {
                    this.tableData = res.data.list;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.page.total = res.data.total;
                }).catch((err) => {
                    console.log(err)
                })
            },
            search(){
                var data=JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("authDataItemSearchData",JSON.stringify(data));
                this.searchdata=data;
            },
            deleteRow(index, row) {
                this.$confirmBox( '确定删除检验数据' + row.name + '?').then((res) => {
                    this.$del(api.authDataItem + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.authDataItemInit();
                        }

                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push(
                    {path: '/auth/authDataItem/authDataItemForm', query: {'id': row.id}}
                ).catch(err => {
                    console.log(err)
                });
            },
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'groupList') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataGroupList'}).catch(err => {
                        console.log(err)
                    });
                }else if (newval == 'groupForm') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataGroupForm'}).catch(err => {
                        console.log(err)
                    });
                } else if (newval == 'itemForm') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataItemForm'}).catch(err => {
                        console.log(err)
                    });
                } else if (newval == 'itemImport') {
                    this.$router.push({path: '/auth/authDataItem/authDataItemImport'}).catch(err => {
                        console.log(err)
                    });
                } else  {
                    this.$router.push({path: '/auth/authDataItem/authDataGroupImport'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        created() {
             if(sessionStorage.getItem("authDataItemSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("authDataItemSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>