<template>
    <div>
        <PageBar title1="系统设置" title2="机构管理"></PageBar>
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
        }
    }
</script>

<style scoped>

</style>