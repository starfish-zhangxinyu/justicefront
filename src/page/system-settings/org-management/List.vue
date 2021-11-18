<template>
    <div>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="机构列表" name="listPage">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="100px" :inline="true">
                        <el-form-item label="机构名称">
                            <el-input v-model.trim="searchForm.name" :clearable="true"></el-input>
                        </el-form-item>
                        <el-form-item label="机构代码">
                            <el-input v-model.trim="searchForm.code" :clearable="true"></el-input>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="orgListSearch">
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
                            prop="name"
                            label="机构名称">
                    </el-table-column>
                    <el-table-column
                            prop="code"
                            label="机构代码">
                    </el-table-column>
                    <el-table-column
                            prop="area.name"
                            label="区域">
                    </el-table-column>
                    <el-table-column
                            prop="orgType.label"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="legalPerson"
                            label="法人姓名">
                    </el-table-column>
                    <el-table-column
                            prop="principal"
                            label="机构负责人">
                    </el-table-column>
                    <el-table-column
                            prop="uscCode"
                            label="统一社会信用代码">
                    </el-table-column>
                    <el-table-column
                            prop="practiceCategory"
                            label="执业类别">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="联系电话">
                    </el-table-column>
                    <el-table-column
                            prop="fax"
                            label="传真">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="邮件">
                    </el-table-column>
                    <el-table-column
                            prop="expireDate"
                            label="有效期">
                    </el-table-column>
                    <el-table-column label="操作" width="200px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="primary" plain icon="el-icon-upload" size="mini"
                                       @click="ElectronicSignature(scope.$index, scope.row)"></el-button>
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
                            port="org"
                          >
                    </pagination>
                </div>
            </el-tab-pane>
         <el-tab-pane label="机构添加" name="formPage">
        </el-tab-pane>
        </el-tabs>
        <SealDia ref="sealDia"/>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    import SealDia from "./Module/SealDia.vue"
    export default {
        data(){
            return{
                activeName: "listPage",
                searchForm:{},
                tableData:[],
                page: {current: 1, pageSize: 30, total: 0},
            }
        },
        components:{
            SealDia
        },
        methods:{

            orgListSearch() {
                let searchData = this.searchForm;
                searchData["page.current"]=this.page.current;
                searchData["page.pageSize"]=this.page.pageSize;
                this.$get(api.org,searchData).then((res) => {
                    this.tableData = res.data.list;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.page.total = res.data.total;
                }).catch((err) => {
                    console.log(err)
                })

            },
            edit(i,row){
                this.$router.push({path:'/system/org-management/form',query:{id:row.id}})
            },
            ElectronicSignature(i,row){
                this.$refs.sealDia.init(row);
            },
            deleteRow(i,row){
                this.$confirmBox("是否删除"+row.name+"机构？").then(res=>{
                    this.$del(api.org + '/'+row.id).then(res=>{
                        this.$message.success("删除成功");
                        this.orgListSearch();
                    }).catch(err=>{

                    })
                }).catch(err=>{})

            }
        },
        watch:{
            activeName:function(newVal,oldVal){
                if(newVal=='formPage'){
                    this.$router.push({path:'/system/org-management/form'}).catch(err=>{});
                }
            }
        }

    }
</script>

<style scoped>

</style>