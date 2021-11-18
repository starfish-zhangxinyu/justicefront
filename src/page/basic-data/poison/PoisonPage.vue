<template>
    <div id="poison">
        <!-- <PageBar title1="基础数据" title2="毒物管理"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import PoisonList from './PoisonList'
    import PoisonForm from './PoisonForm'

    export default {
        name: "PoisonPage",
        components: {'List': PoisonList, 'Form': PoisonForm},
        data() {
            return {
                activeName: 'list'
            }
        },
        beforeRouteLeave(to, form, next) {
            sessionStorage.removeItem("poisonSearchData");
            next();
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "毒物管理")
        }
    }
</script>

<style scoped>

</style>