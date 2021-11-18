<template>
    <div>
        <el-select
                @keyup.enter.native="handleKeyUp"
                @change="change(value)"
                :name="data_type"
                value-key="id"
                v-model="value"
                default-first-option
                size="small"
                :disabled="disabled"
                :allow-create="allowCreate"
                :filterable="filterable"
                :clearable="clearable"
                :multiple="multiple"
                :class="className">
            <slot></slot>
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.label"
                    :value="modelId?(modelId=='label'?item.label:item.id):item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "Select",
        props: ['data_type', 'model', 'filterable', 'multiple', 'className', "modelId", 'allowCreate', 'hasDefault','clearable','disabled','orgId'],
        data() {
            return {
                options: [],
                value: this.model,
                count: 0
            }
        },
        methods: {
            handleKeyUp() {
                this.$emit("keyup")
            },
            change(value) {
                this.$emit("change",value)
            },
            init() {
                var data = {};
                data['page.pageSize'] = 1000;
                data['page.current'] = 1;
                data.type = this.data_type;
                if (this.data_type) {
                    // /api/dict/v1/dicts 旧的字典表
                    // /api/dna-sample-relation/v1/list
                    let url = data.type=='relation'?'/api/dna-sample-relation/v1/list':'/api/dict/v1/dicts';
                    this.$get(url, data).then((res) => {
                        if(data.type=='relation'){
                            res.data.list.forEach((v,i)=>{ v.label = v.name });
                        }
                        this.options = [].concat(res.data.list);
                        if (this.hasDefault && !this.multiple) {
                            if(!this.model||!this.model.id){
                                var defaultVal = JSON.parse(JSON.stringify(res.data.list[0]));
                                this.value = defaultVal;
                            }
                        }

                        if (this.hasDefault && this.multiple) {
                            if (!this.value.length) {
                                var defaultVal = JSON.parse(JSON.stringify(res.data.list[0]));
                                this.value.push(defaultVal);
                            }
                        };


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
            value: function (newval, oldval) {
                this.$emit("update:model", newval);
            },
            orgId() {
                this.init()
            },
            hasDefault() {
                if (this.options){
                    var defaultVal = this.options[0];
                    this.value = defaultVal;
                }
            }
        },
        created() {
            this.init()
        },

    }
</script>

<style scoped>
    .multiple-select {
        width: 100%;
    }
</style>
