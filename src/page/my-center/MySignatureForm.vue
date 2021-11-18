<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="个人信息" name="MyInfoForm"/>
        <el-tab-pane label="修改密码" name="MyPwdForm"/>
        <el-tab-pane label="电子签名" name="MySignatureForm">
            <el-form :model="signatureForm" ref="signatureForm" size="small" label-width="100px">
                <el-row>
                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="电子签名">
                            <SimpleUpload :model.sync="signatureForm.signatureImagePath"></SimpleUpload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="电子签名秘钥">
                            <el-input v-model="signatureForm.digitalSignaturePassword" show-password autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="save('signatureForm')"><i
                            class="fa fa-save"></i> 保存
                    </el-button>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../api/index.js'
    import SimpleUpload from '../../components/common/SimpleUpload'

    export default {
        components: {'SimpleUpload': SimpleUpload},
        name: "MySignatureForm",
        data() {
            return {
                activeName: 'MySignatureForm',
                signatureForm: {
                    signatureImagePath: {},
                    digitalSignaturePassword: ''
                }
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.signatureForm));
                        let imageArrPromise = [];
                        this.imageLrz(data.signatureImagePath, this.signatureForm.signatureImagePath, imageArrPromise);
                        Promise.all(imageArrPromise).then(res => {
                            this.$post(api.myInfo, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                }
                            }).catch((err) => {
                                console.log("err")
                                this.$message.error(err.errMsg);
                            });
                        })
                    }
                })
            },
            imageLrz(data1, data2, imageArrPromise) {
                if (data2 && !data2.url && data2.raw) {
                    let p = new Promise((resolve, reject) => {
                        let file = data2.raw;
                        let fileType = file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length);
                        lrz(file, {width: 1280}).then(function (rst) {
                            // let img = {'imageType': fileType, 'image': rst.base64};
                            data1.imageType = fileType;
                            data1.image = rst.base64;
                            resolve();
                        });
                    });
                    imageArrPromise.push(p);
                }
            },
        },
        created() {
            this.$get(api.myInfo).then((res) => {
                this.signatureForm = JSON.parse(JSON.stringify(res.data));
            })
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'MyInfoForm') {
                    this.$router.push({path: '/myCenter/MyInfoForm'}).catch(err => {
                        console.log(err)
                    });
                }
                if (newval == 'MyPwdForm') {
                    this.$router.push({path: '/myCenter/MyPwdForm'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
