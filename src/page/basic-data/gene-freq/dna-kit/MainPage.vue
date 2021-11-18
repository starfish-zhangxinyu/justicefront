<template>
    <div id="dna-kit">
        <!-- <PageBar title1="基础数据" title2="试剂盒"></PageBar> -->
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
            sessionStorage.removeItem("dnaKitSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "试剂盒")
        }
    }
</script>

<style scoped>

</style>