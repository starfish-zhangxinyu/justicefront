<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="CNAS/CMA项目列表"  name="list">
            <div class="search-box" style="overflow: hidden">
                <el-form  :model="searchForm" size="small" :inline="true" label-width="100px">

                    <el-form-item label="专业类别" >
                        <select-from-table
                                @keyup="search"
                                :model.sync="searchForm.professionCategoryId"
                                port="profession" :clearable="true" :modelId="true">
                        </select-from-table>
                    </el-form-item>

                    <el-form-item label="委托事项名称" >
                        <el-input v-model.trim="searchForm.entrustingMatterName" :clearable="true" @keyup.enter.native="search" class="w215"/>
                    </el-form-item>

                    <el-form-item label="项目/参数" >
                        <el-input v-model.trim="searchForm.name" :clearable="true" @keyup.enter.native="search" class="w215"/>
                    </el-form-item>

                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>

                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :search.sync="searchdata"
                    :sort.sync="tablesort"
                    :page.sync="page"
                    port="cnas"
                    @edit="edit"
                    :hasPaging="true"
                    @deleteRow="deleteRow"
                    :selfDefinedBtn="false">
                <template solt>
                    <el-table-column
                            prop="name"
                            show-overflow-tooltip
                            label="CNAS/CMA项目/参数">
                    </el-table-column>
                    <el-table-column
                            label="委托事项名称"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                              <span v-if="scope.row.entrustingMatterList">
                              {{transform(scope.row.entrustingMatterList)}}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="professionCategory.name"
                            show-overflow-tooltip
                            label="专业类别">
                    </el-table-column>
                    <el-table-column
                            prop="traceMode.label"
                            show-overflow-tooltip
                            label="鉴定标准（方法）">
                        <template slot-scope="scope">
              <span v-if="scope.row.standardList">
              {{transform(scope.row.standardList)}}
             </span>
                        </template>
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="CNAS/CMA项目添加" name="form"></el-tab-pane>
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
            transform(arr){
                var str='';
                for(let i=0;i<arr.length;i++){
                    str+=arr[i].name+',';
                }
                return str.substr(0,str.length-1);
            },
            init(data){
                var searchData=JSON.parse(JSON.stringify(data));
                searchData["page.current"]=this.page.current;
                searchData["page.pageSize"]=this.page.pageSize;
                this.$get(api.cnas,searchData).then((res) => {
                    this.tableData=res.data.list;
                    this.page.pageSize=res.data.pageSize;
                    this.page.current=res.data.current;
                    this.page.total=res.data.total;
                }).catch((err) => {console.log(err)})
            },
            search(){
                var data=JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("cnasSearchData",JSON.stringify(data));
                this.searchdata=data;
            },
            deleteRow(index,row){
                this.$confirmBox('确定删除项目'+row.name+'?').then((res)=>{
                    this.$del(api.cnas +'/'+row.id).then((res) => {
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
                this.$router.push({path:'/auth/cnas/form',query:{'id':row.id}})
                    .catch(err => { console.log(err) });
            },

        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval!='list'){
                    this.$router.push({path:'/auth/cnas/form'}).catch(err => { console.log(err) });
                }
            }
        },
        created(){
            if(sessionStorage.getItem("cnasSearchData")){
               this.searchdata = JSON.parse(sessionStorage.getItem("cnasSearchData"));
               this.searchForm = this.searchdata;
            }
        }
    }
</script>

<style scoped>

</style>