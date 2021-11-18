<template>
    <div class="portlet">
        <div class="portlet-header">
            <span>{{title}}</span><em style="color: red" v-if="isKey">*</em>
            <slot name="buttonGroup" class="btn-class"></slot>
        </div>
        <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Portlet",
        props:['title','isKey'],
        data(){
         return{

         }
        },
        created(){
        }
    }
</script>

<style scoped lang="less">
    .btn-class{
        float: right;
    }

</style>