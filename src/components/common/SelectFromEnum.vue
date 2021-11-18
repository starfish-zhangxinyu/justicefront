<template>
    <div>
        <el-select
                @keyup.enter.native="handleKeyUp"
                value-key="value"
                v-model="value"
                size="small"
                :filterable="filterable"
                :clearable="clearable"
                :multiple="multiple"
                :key="type"
                :class="className">
            <slot></slot>
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="modelVal?item.value:item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import api from '../../api/index'

    export default {
        props: ['model', 'filterable', 'multiple', 'className', 'clearable', 'type', 'modelVal', 'hasDefault','filterData','listType'],
        name: "SelectFromEnum",
        data() {
            return {
                options: [],
                value: this.model,
                listType1: this.listType || ''
            }
        },
        methods: {
            handleKeyUp() {
                this.$emit("keyup")
            },
            init(){
                if (this.type) {
                    let filterData = this.filterData ? {filterData:this.filterData} : null;
                    this.$get(api.enum + '/' + this.type, filterData).then((res) => {
                        this.options = res.data;
                        this.$emit("options", this.options);
                        if (this.hasDefault && !this.multiple) {
                            if (!this.model || !this.model.value) {
                                var defaultVal = JSON.parse(JSON.stringify(res.data[0]));
                                this.value = defaultVal;
                            }
                        }
                        if (this.hasDefault && this.multiple) {
                            if (!this.model.length) {
                                var defaultVal = JSON.parse(JSON.stringify(res.data[0]));
                                this.value.push(defaultVal);
                            }
                        }
                        if (this.type == "flow.FlowCaseStatus"){
                            if (this.listType && this.listType == "abort"){
                                this.options = this.options.filter(item => item.value != 'CANCEL_DISCOUNT' );
                            } else if(this.listType == "refund"){
                                this.options = this.options.filter(item => item.value != 'CANCEL_DISCOUNT' && item.value != 'CANCEL_ABORT' );
                            } else if (this.listType == "discount"){
                                this.options = this.options.filter(item => item.value != 'CANCEL_REFUND' && item.value != 'CANCEL_ABORT' );
                            }else {
                                this.options = this.options.filter(item => item.value != 'CANCEL_REFUND' && item.value != 'CANCEL_DISCOUNT' && item.value != 'CANCEL_ABORT' );
                            }
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }
        },
        watch: {
            deep: true,
            'model': function (newval, oldval) {
                this.value = newval;
            },
            "listType":function(newVal, oldVal){
                this.init();
            },
            value: function (newval, oldval) {
                if (newval == '') {
                    newval = null;
                }
                this.$emit("update:model", newval);
            },
        },
        created: function () {
            this.init();
        }
    }
</script>

<style scoped>
    .multiple-select {
        width: 100%;
    }
</style>