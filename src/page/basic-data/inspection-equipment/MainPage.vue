<template>
    <div id="inspection-equipment">
        <!-- <PageBar title1="基础数据" title2="检验设备"></PageBar> -->
        <keep-alive>
            <!--<router-view name="listPage"></router-view>-->
            <router-view name="listPage" v-if="$route.meta.keepAlive"/>
        </keep-alive>
            <router-view name="listPage" v-if="!$route.meta.keepAlive"/>

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
            sessionStorage.removeItem("instrumentSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "检验设备")
        }
    }
</script>

<style scoped>

</style>