<template>
    <div id="major-category">
        <!-- <PageBar title1="基础数据" title2="专业类别"></PageBar> -->
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
        created(){
            this.$store.dispatch("login/headerTitleChange", "专业类别")
        }
    }
</script>

<style scoped>

</style>