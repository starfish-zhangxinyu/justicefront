<template>
    <div >
        <PageBar title1="系统设置" title2="角色管理"></PageBar>
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
    }
</script>

<style scoped>

</style>