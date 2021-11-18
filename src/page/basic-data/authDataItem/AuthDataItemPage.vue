<template>
    <div id="poison">
        <!-- <PageBar title1="基础数据" title2="检验数据管理"></PageBar> -->
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import AuthDataGroupForm from './AuthDataGroupForm'
    import AuthDataGroupList from './AuthDataGroupList'
    import AuthDataItemForm from './AuthDataItemForm'
    import AuthDataItemList from './AuthDataItemList'

    export default {
        name: "AuthDataItemPage",
        components: {
            'groupList': AuthDataGroupList,
            'groupForm': AuthDataGroupForm,
            'itemList': AuthDataItemList,
            'itemForm': AuthDataItemForm
        },
        data() {
            return {
                activeName: 'groupList'
            }
        },
        beforeRouteLeave(to,form,next){
            sessionStorage.removeItem("authDataItemSearchData");
            sessionStorage.removeItem("authDataGroupSearchData");
            next();
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "检验数据管理")
        }
    }
</script>

<style scoped>

</style>