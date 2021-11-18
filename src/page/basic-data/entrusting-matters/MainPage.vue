<template>
    <div id="entrusting-matters">
        <!-- <PageBar title1="基础数据" title2="委托事项"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'
    export default {
        components:{'List':List,'Form':Form},
        name: "MainPage",
        beforeRouteLeave(to,from,next){
            sessionStorage.removeItem("entrustingMatterSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "委托事项")
        }
    }
</script>

<style scoped>

</style>