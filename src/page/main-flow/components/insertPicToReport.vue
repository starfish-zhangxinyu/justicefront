<template>
    <div>
        <Portlet title="照片">
            <template slot="buttonGroup">
                <!--<el-button type="primary" @click="addPics" size="mini"
                           style="float: right;margin-right: 10px;margin-top: 6px">
                    添加
                </el-button>-->
                <el-upload
                        action="#"
                        multiple
                        style="float: right;margin-top: -5px"
                        accept="image/*"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :show-file-list="false"
                        >
                    <el-button size="mini" type="primary" style="margin-right: 10px;">上 传</el-button>
                </el-upload>
                <el-button type="primary" @click="choosePics" size="mini"
                           style="float: right;margin-right: 10px;margin-top: 6px">
                    从鉴定记录选择
                </el-button>

            </template>
            <template slot="body">
                <div>
                    <el-form size="small" label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="每行照片数">
                                    <el-select class="w100" v-model.number="baseData.rowImgCount" clearable>
                                        <el-option label="1" value="1">
                                        </el-option>
                                        <el-option label="2" value="2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="8">
                                <el-form-item label="图片固定格式">
                                    <el-select style="width:100%" v-model="totalFixed">
                                        <el-option label="表格" value="1">
                                        </el-option>
                                        <el-option label="非表格" value="2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="8">
                                <el-form-item label="图片显示备注">
                                    <el-select style="width:100%" v-model="baseData.isRemark">
                                        <el-option label="显示" value="Y">
                                        </el-option>
                                        <el-option label="不显示" value="N">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                </div>
                <!--<div class="picwrap" ref="picwrap">
                    <div v-for="(item,index) in selectedImgs" :data-index="index" style="margin:10px" :key="item.id">
                        <Picture :src="item.photo && item.photo.url"
                                 :img="item"
                                 :index="index"
                                 ref="picture"
                                 :srcList="selectedImgs"
                                 :class="'picture' + index"
                                 @dragstart.native="handleDragStart($event, item)"
                                 @drop.native.prevent="handleDrop($event, 'picture' + index, item)"
                                 @dragover.native.prevent="handleDragOver"
                                 @deletePic="handleDelete"
                                 draggable="true"></Picture>
                    </div>
                </div>-->
                <PicWall :selectedImgs.sync="selectedImgs" ref="picWall" v-if="view" @changeImgs="changeImgs" :realImgs="realImgs"></PicWall>

            </template>
        </Portlet>
        <el-dialog title="选择照片" :visible.sync="choosePicDiag">
            <div class="imgsWrap">
                <div v-for="(item,index) in imgList" :key="index" style="margin:10px;position: relative">
                    <img :src="item.photo && item.photo.url" @click="isChoose(index)" class="imgSize">
                    <el-button v-show="checkedArr[index]" type="success" icon="el-icon-check" circle size="mini"
                               class="icon-position"></el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="choosePicDiag = false">取 消</el-button>
                <el-button type="primary" @click="chooseAll">全 选</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Portlet from '@/page/layout/Portlet';
    import Picture from "../../../components/common/Picture";
    import PicWall from "./PicWall"

    export default {
        components: {
            Picture,
            Portlet,
            PicWall
        },
        name: "insertPicToReport",
        data() {
            return {
                choosePicDiag: false,
                checkedArr: [],
                temp: null,
                originDom: null,
                totalNumber: null,
                totalFixed: null,
                totalRemark: null,
                view: true,
                selectedImgs: [],
                realImgs:[]
            }
        },
        props: {
            imgList: {
                type: Array,
                default() {
                    return []
                }
            },
            baseData: {
                type: Object,
            },
            reportImgs:{
                type: Array,
            }
        },
        watch: {
            imgList(newVal, oldVal) {
                this.selectedImgs = newVal.filter(item => item.photoName.length > 0).map(item => {return {rowCount: 1, name: item.photoName, img:item, angle: 0}})
                this.checkedArr = newVal.map(item => false)
            },
            baseData(newVal, oldVal) {
                this.$emit('update:baseData', newVal);
            },
            reportImgs(newVal, oldVal) {
                this.selectedImgs = this.selectedImgs.map((item, index) => {
                    // item.id = newVal[index].id;

                    item.name = newVal[index].photoName;
                    item.img= newVal[index]; return item;
                });
            }
        },
        methods: {
            handleChange(file, fileList) {
                let arr = [];

                window.URL = window.URL || window.webkitURL;
                //转为base64并且压缩
                lrz(file.raw, {width: 1280}).then((rst) => {
                    let name = file.name.substring(0, file.name.lastIndexOf('.') )

                    let imageType = file.name.substring(file.name.lastIndexOf('.') + 1,  file.name.length)
                    let obj = {rowCount: 1, name,img:{ photo:{imageType , url: rst.base64},photoName:name}, angle: 0}
                    this.realImgs.push(obj)

                    this.selectedImgs = JSON.parse(JSON.stringify(this.realImgs));

                });
            },
            handleRemove() {

            },
            changeImgs(imgList) {
                this.realImgs = imgList;
                this.$nextTick(() => {
                    let doms = this.$refs.picWall.$el.getElementsByClassName('my-certaintyView-img');

                    this.$emit('changeImgs', doms, imgList);
                })

            },
            choosePics() {
                this.choosePicDiag = true;
                /*this.view = false;*/
                this.checkedArr = this.checkedArr.map(() => false);
            },
            chooseAll() {
                let hasAllChoose = this.checkedArr.every(item => item);
                if (hasAllChoose) {
                    this.checkedArr = this.checkedArr.map(() => false);
                } else {
                    this.checkedArr = this.checkedArr.map(() => true);
                }

            },
            confirm() {
                this.view = false;

                this.$nextTick(() => {
                    let newImgs = JSON.parse(JSON.stringify(this.imgList.filter((item, index) => this.checkedArr[index]))).map(item => {return {rowCount: 1, name: item.photoName, img:item, angle: 0}});
                    let ids = this.realImgs.map(item => item.img && item.img.id);
                    newImgs.forEach( item => {
                        if(!ids.includes(item.img.id)) {
                            this.realImgs.push(item)
                        }
                    })
                    this.selectedImgs = this.realImgs;



                    //this.selectedImgs = JSON.parse(JSON.stringify(this.imgList.filter((item, index) => this.checkedArr[index]))).map(item => {return {rowCount: 1, name: item.photoName, img:item, angle: 0}});

                    this.view = true;
                    this.choosePicDiag = false;
                })

            },
            isChoose(index) {
                this.$set(this.checkedArr, index, !this.checkedArr[index]);
            },

        }
    }
</script>

<style scoped>
    .imgsWrap, .picwrap {
        display: flex;
        flex-wrap: wrap;
    }

    .imgSize {
        width: 150px;
        height: 150px;
    }

    .icon-position {
        position: absolute;
        top: -14px;
        right: -14px;
    }

</style>