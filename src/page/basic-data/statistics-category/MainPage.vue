<template>
    <div id="dnaKit">
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import List from './List'
    import Form from './Form'

    export default {
        name: "MainPage",
        components: {'List': List, 'Form': Form},
        data() {
            return {
                activeName: 'list'
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "案件统计类型")
        }
    }
</script>

<style scoped>

</style>