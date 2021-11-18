<template>
    <div>
        <PageBar title1="系统设置" title2="顺序号设置"></PageBar>
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import form from './Form.vue'
    import list from './List.vue'
    export default {
        name: "MainPage",
        components:{form,list},
        data(){
            return{
            }
        },
        beforeRouteLeave(to,from,next){
            sessionStorage.removeItem("sequenceSetSearchData");
            next();
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "顺序号设置");
        }

    }
</script>

<style scoped>

</style>