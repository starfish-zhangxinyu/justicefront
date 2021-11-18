<template>
    <div>
        <el-select
                @keyup.enter.native="handleKeyUp"
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
                    :label="item.name"
                    :value="modelId?item.id:item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "Select",
        props: ['model', 'filterable', 'multiple', 'className', "modelId", 'allowCreate', 'hasDefault','clearable','disabled'],
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
            }
        },
        watch: {
            deep: true,
            'model': function (newval, oldval) {
                this.value = newval;
            },
            value: function (newval, oldval) {
                this.$emit("update:model", newval);
            }
        },
        created() {
            var data = {};
            data['page.pageSize'] = 1000;
            data['page.current'] = 1;
            let url = '/api/dna-base-kit/v1/dna-base-kits';
            this.$get(url, data).then((res) => {
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
        },
    }
</script>

<style scoped>
    .multiple-select {
        width: 100%;
    }
</style>
