<template>
    <div id="dna-kit">
        <PageBar title1="基础数据" title2="基因座列表"></PageBar>
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
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("dnaMarkerSearchData");
            next();
        }
    }
</script>

<style scoped>

</style>