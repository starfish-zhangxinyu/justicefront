<template>
    <div id="acceptFormFieid">
        <PageBar title1="系统设置" title2="受理表单字段"></PageBar>
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    export default {
        name: "MainPage",
        components:{'List':List},
        data(){
            return{
                activeName:'list'
            }
        },
        created(){
            this.$router.push({path:'/system/accept-form-field/list'}).catch(err => { console.log(err) });
        }
    }
</script>

<style scoped>

</style>