<template>
    <div id="alcohol-param">
        <!-- <PageBar title1="基础数据" title2="酒精参数"></PageBar> -->
        <el-tabs type="border-card">
            <el-tab-pane label="酒精参数设置">
                <div class="portlet" v-for="(item,i) in list" :key="i">
                    <div class="portlet-header">
                        <span>{{item.caseNoFlag}}</span>
                    </div>
                    <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                        <el-form :model="item" size="small" label-width="150px" :ref="['form'+i]">
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="b" prop="vb" :rules="$filter_rules({required:true})">
                                        <el-input v-model.trim="item.vb"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="a" prop="va" :rules="$filter_rules({required:true})">
                                        <el-input v-model.trim="item.va"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="y" prop="vy" :rules="$filter_rules({required:true})">
                                        <el-input v-model.trim="item.vy"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="r" prop="vr" :rules="$filter_rules({required:true})">
                                        <el-input v-model.trim="item.vr"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="不确定性" prop="uncertainty"
                                                  :rules="$filter_rules({required:true})">
                                        <el-input v-model.trim="item.uncertainty"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-row>
                            <el-col :span="2" :offset="10">
                                <el-button type="success" size="mini" class="save-btn" @click="save('form'+i,item, i)" :loading="loadingList[i]"><i
                                        class="fa fa-save" ></i> 保存
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from '../../../api/index'

    export default {
        name: "AlcoholParamForm",
        data() {
            return {
                list: [],
                loadingList:[]
            }
        },
        methods: {
            save(formName, item, i) {
                this.$refs[formName][0].validate((valid) => {
                    if (valid) {
                        this.$set(this.loadingList, i, true);
                        this.loadingList[i] = true;
                        var data = JSON.parse(JSON.stringify(item));
                        this.$post(api.alcoholParam, data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                // this.$refs[formName].resetFields();
                                /*this.$set(this.loadingList, i, false);*/
                            }
                            this.$get(api.alcoholParam).then((res) => {
                                this.list = res.data;
                                this.loadingList.map(item => false);
                                this.$set(this.loadingList, i, false);
                            }).catch((err) => {
                                console.log(err)
                            });
                        }).catch((err) => {
                            console.log(err)
                            this.$set(this.loadingList, i, false);
                        })
                    }
                });
            },
        },
        created: function () {
            this.$get(api.alcoholParam).then((res) => {
                this.list = res.data;
                this.loadingList.map(item => false);
            }).catch((err) => {
                console.log(err)
            });
            this.$store.dispatch("login/headerTitleChange", "酒精参数")
        },
    }
</script>

<style scoped>

</style>