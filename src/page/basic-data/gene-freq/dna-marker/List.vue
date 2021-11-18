<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基因座列表" name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" :inline=true label-width="100px">

                    <el-form-item label="基因座名称">
                        <el-input v-model.trim="searchForm.name" class="w215"/>
                    </el-form-item>

                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>

                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    fit
                    border
                    size="small"
                    style="width: 100%">
                    <el-table-column
                            label="序号">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="基因座名称">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center" width="160px">
                        <template slot-scope="scope" >
                            <el-button type="warning" plain size="mini"
                                       @click="updateMarker(scope.$index,scope.row)">编辑
                            </el-button>
                            <el-button type="warning" plain size="mini"
                                       @click="saveMarker(scope.$index,scope.row)" disabled>保存
                            </el-button>
                            <el-button v-if="scope.row.isEdit"  size="mini"
                                       @click="editCancel(scope.$index,scope.row,item.list)">取消
                            </el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </el-tab-pane>
<!--        <el-tab-pane label="基因座添加" name="form"></el-tab-pane>-->
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
            init(current, pageSize) {
                var searchData = JSON.parse(JSON.stringify(data));
                searchData["page.current"] = current;
                searchData["page.pageSize"] = pageSize;
                this.$get(api.dnaMarker, searchData).then((res) => {
                    this.tableData =[].concat(res.data.list);
                    this.page.total = res.data.total;
                }).catch((err) => {
                    console.log(err)
                })
            },
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("dnaMarkerSearchData",JSON.stringify(data));
                this.searchdata = data;
            },
            updateMarker(index, row){

            },
            saveMarker(index, row) {
                window.sessionStorage.setItem(row.id,JSON.stringify(row));
                var data = JSON.parse(JSON.stringify(row));
                if (!row.isEdit) {
                    row.isEdit = true;
                } else {
                    delete data.orgId;
                }
            },
        },
        created(){
            if(sessionStorage.getItem("dnaMarkerSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("dnaMarkerSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>