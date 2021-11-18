<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="用户列表"  name="list"></el-tab-pane>
        <el-tab-pane label="用户添加" name="form"></el-tab-pane>
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
                this.$get(api.cnas,searchData).then((res) => {
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