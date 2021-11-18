<template>
    <div id="poison">
        <!-- <PageBar title1="财务管理" title2="其他业务收入"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import FiOtherChargeList from './FiOtherChargeList'
    import FiOtherChargeForm from './FiOtherChargeForm'

    export default {
        name: "FiOtherChargePage",
        components: {'List': FiOtherChargeList, 'Form': FiOtherChargeForm},
        data() {
            return {
                activeName: 'list'
            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("otherChargeSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "其他业务收入")
        }
    }
</script>

<style scoped>

</style>