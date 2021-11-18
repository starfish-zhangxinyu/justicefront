<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="动态字段列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'动态字段添加':'动态字段修改'" name="form">
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    export default {
        name: "Form",
        data(){
            return{
                activeName:'form',
                isAdd:true,
                addForm:{},
            }
        },
        methods:{
            save(formName){

            },
        },
        created(){
            this.activeName='form';
            if(this.$route.query.id){
                this.isAdd=false;

            }else{
                this.isAdd=true;
            }

        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval=='list'){
                    this.$router.push({path:''}).catch(err => { console.log(err) });
                }
            }
        },
    }
</script>

<style scoped>

</style>