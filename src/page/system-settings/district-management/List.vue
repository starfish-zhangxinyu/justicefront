<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="区域列表"  name="list">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    size="small"
                    row-key="id"
                    border
                    fit
                    default-expand-all
                    :tree-props="{children: 'children'}">
                <el-table-column
                        prop="name"
                        label="区域名称"
                >
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="区域编码"
                >
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="areaType.label"-->
                        <!--label="区域类型">-->
                <!--</el-table-column>-->

                <el-table-column
                        prop="remarks"
                        label="备注">
                </el-table-column>
                <el-table-column
                        label="操作"  align="center" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" plain type="warning" @click="edit(scope.$index, scope.row)">修改</el-button>
                        <el-button size="mini" plain type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                        <el-button size="mini" plain type="primary" @click="hangleAdd(scope.$index, scope.row)">添加下级区域</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="区域添加" name="form"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    export default {
        name: "List",
        data(){
            return{
                activeName:'list',
            }
        },
        methods:{

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

            deleteRow(index,row){
                this.$confirmBox('确定删除区域'+row.name+'及以下子区域吗?').then((res)=>{
                    this.$del(api.area +'/'+row.id).then((res) => {
                        if(res.status==200){
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init();
                        }

                    }).catch((err)=>{console.log(err)});
                }).catch((err)=>{});
            },
            hangleAdd(index,row){
                this.$router.push({path:'',query:{'parentId':row.parent.id}})
                    .catch(err => { console.log(err) });
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