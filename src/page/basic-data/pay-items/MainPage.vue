<template>
    <div id="pay-items">
        <!-- <PageBar title1="基础数据" title2="收费项目"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'
    export default {
        components:{'List':List,'Form':Form},
        name: "MainPage",
        // created(){
            // this.$router.push({path:'/auth/chargingitems/list'}).catch(err => { console.log(err) });
        // }
        watch:{
            $route(to, from) {

            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("chargeItemSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "收费项目")
        }
    }
</script>

<style scoped>

</style>