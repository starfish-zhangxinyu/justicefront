<template>
    <div id="inspection-equipment">
        <!-- <PageBar title1="基础数据" title2="检验标准"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'
    export default {
        name: "MainPage",
        components:{'List':List,'Form':Form},
        data(){
            return{
            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("standardSearchData");
            next();
        },
         created(){
            this.$store.dispatch("login/headerTitleChange", "检验标准")
        }
    }
</script>

<style scoped>

</style>