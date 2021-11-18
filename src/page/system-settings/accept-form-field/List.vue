<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="受理字段列表" name="list">
            <div class="search-box" style="overflow: hidden;">
                <el-form
                        :model="searchForm"
                        size="small"
                        :inline="true"
                        label-width="100px"
                >
                    <el-form-item label="字段名称">
                        <el-input v-model.trim="searchForm.label" class="w215"/>
                    </el-form-item>
                    <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="small"
                            @click="search"
                    >查询
                    </el-button
                    >
                </el-form>
            </div>
            <el-form :model="formData" size="small" :inline="true">
                <el-table
                        ref="table"
                        border
                        :data="formData.tableData"
                        size="mini"
                        style="width: 100%"
                >
                    <el-table-column prop="label" label="字段名">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-input v-model="scope.row.label"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="英文名"></el-table-column>
                    <el-table-column prop="required" label="是否必须">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-select v-model="scope.row.required">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label"
                                    >
                                    </el-option>
                                </el-select>
                                <!--<select-from-enum :model="scope.row.required" :clearable=false type="common.YesNo"></select-from-enum>-->
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row :span="2" style="margin-top: 15px">
                    <el-col :offset="11">
                        <el-button type="success" size="mini" class="save-btn" @click="save"
                        ><i class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from "../../../api";
    import Select2 from "../../../components/common/Select2";
    import {mapState} from "vuex";

    export default {
        name: "List",
        components: {Select2},
        data() {
            return {
                activeName: "list",
                page: {current: 1, pageSize: 30, total: 0},
                formData: {
                    tableData: []
                },
                searchForm: {
                    label: null
                },
                options: [],
                tableHeight: "100%"
            };
        },
        methods: {
            transform(arr) {
                var str = "";
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ",";
                }
                return str.substr(0, str.length - 1);
            },
            init() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.orgId = this.orgId;
                this.$get(api.acceptFormField, data)
                    .then(res => {
                        this.formData.tableData = res.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            search() {
                this.init();
            },
            save() {
                this.$put(api.acceptFormField, this.formData.tableData)
                    .then(res => {
                        if (res.status == 200) {
                            this.$message({
                                message: "保存成功！",
                                type: "success"
                            });
                            this.init();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.$get(api.enum + "/common.YesNo").then(res => {
                this.options = res.data;
            });
        },
        computed: {
            ...mapState("login", ["orgId"])
        },
        watch: {
            'orgId': {
                handler(newVal, oldVal) {
                    this.init();
                }
            }
        }
    };
</script>

<style scoped></style>
