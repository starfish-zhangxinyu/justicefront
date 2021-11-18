<template>
  <div>
    <el-select
      v-model="value"
      size="small"
      :filterable="filterable"
      :disabled="disabled"
      :clearable="clearable"
      :multiple="multiple"
      :class="className">
      <slot></slot>
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  import api from '../../api/index'
  export default {
    name: "Select2",
    props:['model','filterable','multiple','className','port','disabled','clearable','changeSelect'],
    data(){
      return{
        options:[],
        value:this.model
      }
    },
    methods:{
    },
    watch:{
      deep:true,
      'model':function(newval,oldval){
        this.value=newval;
      },
      'port':function(newval,oldval){
          if(this.port){
              var data={};
              data['page.pageSize']=1000;
              data['page.current']=1;
              this.$get(api[this.port],data).then((res)=>{
                  this.options=res.data.list||res.data;
              }).catch((err)=>{
                  console.log(err)});
          }
      },
      'changeSelect':function(newval,oldval){
        if(this.port){
          var data={};
          data['page.pageSize']=1000;
          data['page.current']=1;
          this.$get(api[this.port],data).then((res)=>{
            this.options=res.data.list||res.data;
          }).catch((err)=>{
            console.log(err)});
        }
      },
      value:function (newval,oldval) {
        this.$emit("update:model", newval);
      }
    },
    created:function () {
        if(this.port) {
            var data = {};
            data['page.pageSize'] = 1000;
            data['page.current'] = 1;
            this.$get(api[this.port], data).then((res) => {
                this.options = res.data.list || res.data;
            }).catch((err) => {
                console.log(err)
            })
        }
    }

  }
</script>

<style scoped>
  .multiple-select{
    width: 100%;
  }
</style>
