<template>
    <el-radio-group v-model="value">
        <el-radio v-for="item in list" :label="from=='DICT'?item.id:item.value">{{item.label}}</el-radio>
    </el-radio-group>
</template>

<script>
    import api from '../../api/index'

    export default {
        name: "Radio",
        props: ['model', 'from', 'type','options'],
        data() {
            return {
                value: this.model,
                list: [],
            }
        },
        methods: {
            strToJson(str){
                return JSON.parse(str);
            },
        },
        created() {
            if (this.from == 'SYS_ENUM') {
                this.$get(api.enum + '/' + this.type).then((res) => {
                    this.list = res.data;
                }).catch((err) => {
                    console.log(err)
                });

            } else if (this.from == 'DICT') {
                var data = {};
                data['page.pageSize'] = 1000;
                data['page.current'] = 1;
                data.type = this.data_type;
                if (this.data_type) {
                    this.$get('/api/dict/v1/dicts', data).then((res) => {
                        this.list = [].concat(res.data.list);
                    }).catch((err) => {
                        console.log(err);
                    });

                }
            }else{
               this.list=this.strToJson(this.options);
            }
        },
        watch:{
            deep: true,
            'model': function (newval, oldval) {
                this.value = newval;
            },
            value: function (newval, oldval) {
                if (newval == '') {
                    newval = null;
                }
                this.$emit("update:model", newval);
            }
        }
    }
</script>

<style scoped>

</style>