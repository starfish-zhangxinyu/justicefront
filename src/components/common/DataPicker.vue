<template>
  <div class="flexBox">
    <el-form-item
      :rules="isRequire?$filter_rules({required: true, trigger: 'change'}):{required: false}"
      :prop="startName"
      class="margin0 borRNull"
    >
      <el-date-picker
        class="w100"
        v-model="start"
        type="date"
        placeholder="开始日期"
        format="yyyy-MM-dd"
        :value-format="valueFormat"
      />
    </el-form-item>
    <div class="line">-</div>
    <el-form-item
      :rules="isRequire?$filter_rules({required: true, trigger: 'change'}):{required: false}"
      :prop="endName"
      class="margin0 borLNull"
    >
      <el-date-picker
        class="w100"
        v-model="end"
        type="date"
        placeholder="结束日期"
        format="yyyy-MM-dd"
        :value-format="isValueFormat2?valueFormat2:valueFormat"
        prefix-icon="null"
      />
    </el-form-item>
  </div>
</template>
     <!-- <DataPicker 
            :startValue.sync="searchForm.beginAcceptDate" 
            :endValue.sync="searchForm.endAcceptDate"/> -->
<script>
export default {
  name: "",
  data() {
    return {
      start: '',
      end: ''
    };
  },
  props: {
    isRequire: {
      type: Boolean,
      default: false
    }, // 是否开启验证，为true时需要传startName，endName
    startName: {
      type: String,
      default: ""
    }, //需要验证当前表单 开始时间的键名
    endName: {
      type: String,
      default: ""
    }, //需要验证当前表单 结束时间的键名
    startValue: {
      type: String,
      default: ""
    }, //开始时间的绑定值
    endValue: {
      type: String,
      default: ""
    }, //结束时间的绑定值
    valueFormat:{
      type:String,
      default:"yyyy/MM/dd"
    },//数据类型
    valueFormat2:{
      type:String,
      default:"yyyy/MM/dd"
    },//数据类型2
    isValueFormat2:{
      type:Boolean,
      default:false
    },//是否开启第二种数据类型
    isImmediate:{
      type:Boolean,
      default: false
    }
  },
  methods: {},
  watch: {
    start: function(newval, oldval) {
      if (
        newval &&
        this.end &&
        new Date(this.end).getTime() < new Date(newval).getTime()
      ) {
        this.$message.warning("开始时间不可以晚于结束时间!");
        this.start = "";
      } else {
        this.$emit("update:startValue", newval);
      }
    },
    end: function(newval, oldval) {
      if (
        newval &&
        this.start &&
        new Date(this.start).getTime() > new Date(newval).getTime()
      ) {
        this.$message.warning("开始时间不可以早于结束时间!");
        this.end = "";
      } else {
        this.$emit("update:endValue", newval);
      }
    },
    startValue:function(newval, oldval){
      // newval?this.start = newval:null;
      this.start = newval
    },
    endValue:function(newval, oldval){
      // newval?this.end = newval:null;
      this.end = newval
    }
  },
  created() {
    if(this.isImmediate) {
      this.$watch(function () {
        return this.startValue;
      },(newval, oldval) => {
        this.start = newval;
      }, {immediate: true})

      this.$watch(function (){
        return this.endValue;
    },(newval, oldval) => {
        this.end = newval;
      }, {immediate: true})
    }
  }
};
</script>

<style lang='less' scope>
.flexBox .line {
  background: #fff;
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  height: 32px;
  text-align: center;
  padding: 0 5px;
}
.flexBox {
  display: flex !important;
  align-items: center!important;
}
.flexBox .el-form-item__content{
  height: 32px;
}
.flexBox .el-form-item__content input{
  float: left;
  padding-right: 10px;
}
.flexBox .borRNull input {
  border-right: none;
  border-radius: 4px 0 0 4px;
}
.flexBox .borLNull input {
  border-left: none;
  border-radius: 0 4px 4px 0;
}
.flexBox:hover .borRNull input,
.flexBox:hover .borLNull input,
.flexBox:hover .line {
  border-top: 1px solid #c0c4cc !important;
  border-bottom: 1px solid #c0c4cc !important;
}
.flexBox:hover .borRNull input {
  border-left: 1px solid #c0c4cc !important;
}
.flexBox:hover .borLNull input {
  border-right: 1px solid #c0c4cc !important;
}
.flexBox .is-error + div.line,
.borLNull.is-error input,
.flexBox .borRNull.is-error input {
  border-top: 1px solid #f56c6c !important;
  border-bottom: 1px solid #f56c6c !important;
}
.flexBox .borRNull.is-error input {
  border-left: 1px solid #f56c6c !important;
}
.flexBox .is-error + div.line + div.el-form-item input {
  border-top: 1px solid #f56c6c !important;
  border-bottom: 1px solid #f56c6c !important;
  border-right: 1px solid #f56c6c !important;
}
.borLNull.is-error input {
  border-right: 1px solid #dcdfe6 !important;
  border-top: 1px solid #dcdfe6 !important;
  border-bottom: 1px solid #dcdfe6 !important;
}
</style>