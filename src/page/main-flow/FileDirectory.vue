<template>
    <div>
        <PageBar title1="业务流程" title2="归档目录"></PageBar>
        <CaseDetail :caseId="caseId"></CaseDetail>
        <Portlet title="存档文件">
            <template slot="body">
                <el-table
                        stripe
                        fit
                        border
                        size="mini"
                        :data="archiveFileList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <el-table-column
                            prop="fileName"
                            width="150px"
                            label="文件名称">
                    </el-table-column>
                    <el-table-column
                            prop="pageCount"
                            width="200px"
                            label="页数">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pageCount" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="images"
                            label="扫描件">
                        <template slot-scope="scope">
                            <PictureWall
                                    :has-title="false"
                                    :model.sync="scope.row.images"
                                    position="table"></PictureWall>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="300px"
                            label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="上传图片" placement="bottom">
                                <el-upload
                                        style="float: left;"
                                        :multiple="true"
                                        action="#"
                                        :show-file-list="false"
                                        :on-change="(file, fileList) => {handleChange(file, fileList,scope.$index,scope.row)}"
                                        :auto-upload="false">
                                <el-button size="mini" icon="el-icon-upload" type="primary"></el-button>
                                </el-upload>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="选择材料扫描件" placement="bottom">
                                <el-button size="mini" icon="el-icon-plus" type="primary"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="向上插入项目" placement="bottom">
                                <el-button size="mini" icon="el-icon-upload2" type="primary"
                                           @click="insertBefore(scope.$index,scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="向下插入项目" placement="bottom">
                                <el-button size="mini" icon="el-icon-download" type="primary"
                                           @click="insertAfter(scope.$index,scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                                <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteRow(scope.$index,scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </Portlet>
        <el-row>
            <el-col :span="2"  :offset="10">
            <el-button type="success" size="mini" class="save-btn" @click="save()"><i class="fa fa-save"></i> 保存</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="mini" class="save-btn"> 完成
                </el-button>
            </el-col>
            <!--<el-col :span="2">-->
                <!--<el-button type="primary" size="mini" class="save-btn"><i-->
                        <!--class="el-icon-arrow-left"></i> 打印目录-->
                <!--</el-button>-->
            <!--</el-col>-->
        </el-row>
        <!--文件名称-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form :model="form">
                <el-form-item label="文件名称" label-width="80px">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" ref="footer">
                 <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="confirm()">确 定</el-button>
           </span>
        </el-dialog>
    </div>

</template>

<script>
    import api from '../../api/index'
    import portlet from './../layout/Portlet'
    import caseDetail from './../../components/common/CaseDetail'
    import PictureWall from '../../components/common/PictureWall'
    export default {
        name: "FileDirectory",
        components: {'Portlet': portlet, 'CaseDetail': caseDetail,'PictureWall':PictureWall},
        data() {
            return {
                dialogVisible:false,
                caseId: '',
                archiveFileList: [{fileName:'alo',images:[]}],
                form:{},
                selectRows:[]
            }
        },
        methods: {
            handleSelectionChange() {

            },
            handleChange(file,filelist,index,row){
                var fileName=file.name;
                var fileType=fileName.substring(fileName.indexOf('.')+1,fileName.length+1);
                row.images.push({type:fileType,raw:file.raw});
                row.pageCount=row.images.length;
            },
            //向上插入项目
            insertBefore(index, row) {
                this.form={};
                this.dialogVisible=true;
                this.$refs.footer.setAttribute('index',index);
            },
            //向下插入项目
            insertAfter(index, row) {
                this.form={};
                this.dialogVisible=true;
                this.$refs.footer.setAttribute('index',index+1);
            },
            //确定
            confirm(){
                var index=this.$refs.footer.getAttribute('index');
                this.archiveFileList.splice(index, 0, {fileName:this.form.name,images:[]});
                this.dialogVisible=false;
            },
            deleteRow(index,row){
                this.archiveFileList.splice(index,1);
            },
            save(){
                var promiseArr=[];
                var finalArr=[];
                var _this=this;
               this.archiveFileList.forEach((v,i)=>{
                   finalArr[i]=[];
                    if(v.images){
                       v.images.forEach((item,index)=>{
                                if(item.raw){
                                    let p = new Promise((resolve,reject)=>{
                                        let file =item.raw;
                                        lrz(file,{width:1280}).then(function(rst) {
                                            finalArr[i].push({'imageType':item.type,'image':rst.base64});
                                            resolve();
                                        });
                                    });
                                    promiseArr.push(p);
                                }else{
                                    finalArr[i].push(item);
                                }

                        })
                    }
                });
                Promise.all(promiseArr).then(res=>{
                    var data={id:this.$route.query.id,archiveFileDtoList:[]};
                    this.archiveFileList.forEach((v,i)=>{
                        if(v.id){
                            data.archiveFileDtoList.push(
                                {id:v.id,fileName:v.fileName,pageCount:v.pageCount,images:finalArr[i]}
                            )
                        }else{
                            data.archiveFileDtoList.push(
                                {fileName:v.fileName,pageCount:v.pageCount,images:finalArr[i]}
                            )
                        }

                    });
                   this.$put(api.archiveDirectorys,data).then((res)=>{
                      if(res.status==200){
                          this.$message({
                              message: '保存成功！',
                              type: 'success'
                          });
                      }
                   }).catch((err)=>{console.log(err)});
                })
            }
        },
        created(){
            this.caseId=this.$route.query.caseId;
            this.$get(api.archiveDirectorys+'/'+this.$route.query.id).then((res)=>{
                this.archiveFileList=res.data;
            }).catch((err)=>{console.log(err)});
        }
    }
</script>

<style scoped>

</style>