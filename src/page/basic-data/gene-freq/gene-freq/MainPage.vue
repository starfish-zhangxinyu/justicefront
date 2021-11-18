<template>
    <div id="gene-freq">
        <!-- <PageBar title1="基础数据" title2="基因频率"></PageBar> -->
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
                // activeName:'list'
            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("geneFreqSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "基因频率")
        }
    }
</script>

<style scoped>

</style>