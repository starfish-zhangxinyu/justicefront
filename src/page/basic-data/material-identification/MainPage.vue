<template>
    <div id="material-identification">
        <!-- <PageBar title1="基础数据" title2="鉴定材料"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'
    export default {
        components:{'List':List,'Form':Form},
        name: "MainPage",
        created(){
            this.$store.dispatch("login/headerTitleChange", "鉴定材料")
        }
    }
</script>

<style scoped>

</style>