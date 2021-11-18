<template>
    <div id="my-info">
        <router-view name="listPage"></router-view>
    </div>
</template>

<script>
    import MyInfoForm from './MyInfoForm'
    import MyPwdForm from './MyPwdForm'

    export default {
        name: "MyInfoPage",
        components: {'MyInfoForm': MyInfoForm, 'MyPwdForm': MyPwdForm},
        data() {
            return {
                activeName: 'MyInfoForm'
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "个人信息")
        }
    }
</script>

<style scoped>

</style>