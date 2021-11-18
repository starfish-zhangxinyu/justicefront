<template>
  <div class="portlet">
    <div class="portlet-header">
      <span style="font-size: 16px"><icon :name="iconname" type="class" style="color:#324A90"/> {{title}}</span>
      <b :class="[isShow?'el-icon-arrow-down':'el-icon-arrow-up']" @click.stop="handleChange()"></b>
    </div>
    <div class="portlet-body" v-show="isShow" style="background-color: white">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Collapse",
      /*props:['title','active','iconname'],*/
      props:{
        title:'',
        active:{
          type:Boolean,
        },
        iconname:''
      },
      data(){
          return{
           isShow:this.active
          }
      },
      methods:{
        handleChange(){
          this.isShow=!this.isShow;
        }
      },
      created() {
          // console.log(this.active,'activeactive')
      }
    }
</script>

<style scoped>

</style>
