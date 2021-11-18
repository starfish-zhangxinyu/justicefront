<template>
    <div>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="顺序号列表" name="listPage">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="100px" :inline="true">
                        <el-form-item label="机构名称">
<!--                            <el-input v-model.trim="" :clearable="true"></el-input>-->
                            <el-select v-model="searchForm.orgId" filterable placeholder="请选择" clearable >
                                <el-option
                                        v-for="item in orgList"
                                        :key="item.id"
                                        :label="item.name"
                                        :disabled="item.name=='总公司'"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="案件标志">
                            <el-input v-model.trim="searchForm.caseNoFlag" :clearable="true"  class="w215"/>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="sequenceListSearch">
                            查询
                        </el-button>
                    </el-form>
                </div>
                <el-table
                     :data="tableData"
                     border
                     size="small"
                     style="width: 100%">
                    <el-table-column
                            prop="org.name"
                            label="机构">
                    </el-table-column>
                    <el-table-column
                            prop="reportTypeFlag"
                            label="鉴定意见类型">
                    </el-table-column>
                    <el-table-column
                            prop="caseNoFlag"
                            label="案号标志">
                    </el-table-column>
                    <el-table-column
                            prop="year"
                            label="年号">
                    </el-table-column>
                    <el-table-column
                            prop="sequence"
                            label="顺序号">
                    </el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
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
                            :search.sync="searchData"
                            port="sequenceSetting"
                          />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        data(){
            return{
                activeName: "listPage",
                searchForm:{},
                searchData:{},
                tableData:[],
                orgList:[],
                page: {current: 1, pageSize: 30, total: 0},
            }
        },
        methods:{

            sequenceListSearch() {
                this.searchData = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("sequenceSetSearchData",JSON.stringify(this.searchData));
                // this.searchData["page.current"]=this.page.current;
                // this.searchData["page.pageSize"]=this.page.pageSize;
                // this.$get(api.sequenceSetting,this.searchData).then((res) => {
                //     this.tableData = res.data.list;
                //     this.page.pageSize = res.data.pageSize;
                //     this.page.current = res.data.current;
                //     this.page.total = res.data.total;
                // }).catch((err) => {
                //     console.log(err)
                // })
            },
            edit(i,row){
                this.$router.push({path:'/system/sequence-setting/form',query:{id:row.id}})
            },
            deleteRow(i,row){
                this.$confirmBox("是否删除"+row.caseNoFlag+"？").then(res=>{
                    this.$del(api.sequenceSetting + '/'+row.id).then(res=>{
                        this.$message.success("删除成功");
                        this.sequenceListSearch();
                    }).catch(err=>{

                    })
                }).catch(err=>{})

            }
        },
        watch:{
            activeName:function(newVal,oldVal){
                if(newVal=='formPage'){
                    this.$router.push({path:'/system/sequence-setting/form'}).catch(err=>{console.log("跳转表单出错")});
                }
            }
        },
        created() {
            if(sessionStorage.getItem("sequenceSetSearchData")){
               this.searchData = JSON.parse(sessionStorage.getItem("sequenceSetSearchData"));
               this.searchForm = this.searchData;
            }
            this.$get(api.org+'/list').then(res=>{
                this.orgList = res.data;
            }).catch(err=>{
               console.log("查询条件：机构列表加载出错")
            })
        }

    }
</script>

<style scoped>

</style>