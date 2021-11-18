<template>
    <div id="major-category">
        <!-- <PageBar title1="基础数据" title2="物证样本关系"/> -->
        <router-view name="listPage"/>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'
    export default {
        name: "MESMItem",
        components:{'List':List,'Form':Form},
        data(){
            return{
                activeName:'list'
            }
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "物证样本关系")
        }
    }
</script>

<style scoped>

</style>