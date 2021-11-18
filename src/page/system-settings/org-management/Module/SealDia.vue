<template>
    <el-dialog title="电子签章上传" width="700px" :visible.sync="SealDia">
        <el-form :model="signatureForm" ref="SealForm" size="small" label-width="100px">
            <el-row>
                <el-col :lg="{span:16,offset:4}">
                    <el-form-item label="电子签章">
                        <SimpleUpload :model.sync="signatureForm.sealImagePath"></SimpleUpload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :lg="{span:16,offset:4}">
                    <el-form-item label="电子签章秘钥">
                        <el-input v-model="signatureForm.digitalSignaturePassword" show-password autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" size="small">取 消</el-button>
            <el-button type="primary" @click="submit('SealForm')" size="small">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from "@/api/index";
    import SimpleUpload from '@/components/common/SimpleUpload'

    export default {
        name: "",
        data() {
            return {
                signatureForm: {
                    sealImagePath: {},
                    digitalSignaturePassword: ''
                },
                SealDia: false
            };
        },
        components: { SimpleUpload},
        methods: {
            init(row) {
                this.$get(api.org+'/'+row.id).then(res=>{
                    if(res.status=='200'){
                        this.signatureForm=res.data;
                    }
                }).catch(err=>{})
                this.SealDia = true;
            },
            cancel() {
                this.SealDia = false;
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
            submit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.signatureForm));
                        let imageArrPromise = [];
                        this.imageLrz(data.sealImagePath, this.signatureForm.sealImagePath, imageArrPromise);
                        /* debugger */
                        Promise.all(imageArrPromise).then(res => {
                            this.$put(api.org + '/'+data.id, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    //关闭弹窗
                                    this.SealDia = false;
                                }
                            }).catch((err) => {
                                console.log("err")
                                this.$message.error(err.errMsg);
                            });
                        })
                    }
                });
            },
        },

    };
</script>

<style lang="less" scoped></style>
