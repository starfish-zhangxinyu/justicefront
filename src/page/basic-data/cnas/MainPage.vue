<template>
    <div id="cnas">
        <!-- <PageBar title1="基础数据" title2="CNAS"></PageBar> -->
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
                activeName:'list'
            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("cnasSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "CNAS列表")
        }
    }
</script>

<style scoped>

</style>