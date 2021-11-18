<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="受理地点列表"  name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" label-width="110px" :inline="true">

                    <el-form-item label="受理地点" >
                        <el-input v-model.trim="searchForm.name" @keyup.enter.native="search"></el-input>
                    </el-form-item>
                    <el-button
                            @click="search"
                            type="primary"
                            icon="el-icon-search" size="small"
                            style="color: white">查询</el-button>
                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    port="acceptStation"
                    @edit="edit"
                    :hasPaging="true"
                    @deleteRow="deleteRow"
                    :selfDefinedBtn="false">
                <template solt>
                    <el-table-column
                            prop="name"
                            label="受理地点">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注">
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="受理地点添加" name="form"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    export default {
        name: "List",
        data(){
            return{
                activeName:'list',
                page:{current:1,pageSize:30,total:0},
                tableData:[],
                tablesort:null,
                searchdata:{},
                searchForm:{},
            }
        },
        methods:{

            init(data){
                var searchData=JSON.parse(JSON.stringify(data));
                searchData["page.current"]=this.page.current;
                searchData["page.pageSize"]=this.page.pageSize;
                this.$get(api.acceptStation,searchData).then((res) => {
                    this.tableData=res.data.list;
                    this.page.pageSize=res.data.pageSize;
                    this.page.current=res.data.current;
                    this.page.total=res.data.total;
                }).catch((err) => {console.log(err)})
            },
            search(){
                var data=JSON.parse(JSON.stringify(this.searchForm));
                this.searchdata=data;
            },
            deleteRow(index,row){
                this.$confirm(this,'确定删除受理点'+row.name+'吗?').then((res)=>{
                    this.$del(api.acceptStation +'/'+row.id).then((res) => {
                        if(res.status==200){
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init(this.searchdata);
                        }

                    }).catch((err)=>{console.log(err)});
                }).catch((err)=>{});
            },
            edit(index,row){
                this.$router.push({path:'',query:{'id':row.id}})
                    .catch(err => { console.log(err) });
            },

        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval!='list'){
                    this.$router.push({path:''}).catch(err => { console.log(err) });
                }
            }
        },
    }
</script>

<style scoped>

</style>