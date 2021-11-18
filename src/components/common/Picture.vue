<template>
    <div
            class="picture-wrapper"
            draggable="true"
            ref="porlet"
    >
        <div class="header">
            <span class="number">{{rightIndex + 1}}</span>
            <div style="float:right">
                <i class="el-icon-refresh-right hover" @click="turnRight">
                </i>
                <i class="el-icon-refresh-left hover" @click="turnLeft"></i>
                <i class="el-icon-close hover" @click="deletePic(image)"></i>
            </div>

        </div>
        <div class="body">
            <div>
                <img :src="imgData.img.photo && imgData.img.photo.url"
                     ref="image"
                     class="my-certaintyView-img"
                     style="width:150px;height:150px"
                     @click="handlePreview(imgData.img.photo.url)"
                     :draggable="false"
                     alt=""
                >
            </div>
            <div  class="my-preview" ref="myPreview" v-show="isPreview" @click="closePreview" style="overflow: auto">
            </div>
        </div>
        <div class="footer" style="width:170px">
            <el-input v-model="imgData.name" style="width:60%" size="mini">
            </el-input>
            <el-select v-model="imgData.rowCount" style="width:40%;float:right;" size="mini">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    import Portlet from "../../page/layout/Portlet";

    export default {
        name: "Picture",
        components: {Portlet},
        props: {
            image: {},
            index: {
                type: Number
            }
        },
        data() {
            return {
                isPreview: false,
                temp: null,
                originDom: null,
                rightIndex: this.index,
                imgData: this.image


            }
        },
        watch:{
           'imgData.angle':function() {
               this.$refs.image.style.transform = `rotate(${this.imgData.angle}deg)`;
           }
        },
        methods: {
            turnRight() {
                this.$refs.image.style.transform = `rotate(${this.imgData.angle = this.imgData.angle + 90}deg)`;
            },
            turnLeft() {
                this.$refs.image.style.transform = `rotate(${this.imgData.angle = this.imgData.angle - 90}deg)`;
            },
            deletePic(img) {
               /* var child = this.$refs.porlet.parentNode;
                var parent = child.parentNode;
                var index = Array.prototype.indexOf.call(parent.children, child);*/
                this.$emit('deletePic', img, this.rightIndex);
            },
            handlePreview(src) {
                this.isPreview = true;
                this.$nextTick(() => {
                    if (this.$refs.myPreview.children.length > 0) {
                        let img = this.$refs.myPreview.children[0];
                        img.src = src;
                        img.onload = () => {
                            if(img.getBoundingClientRect().height > window.innerHeight) {
                                this.$refs.myPreview.className = 'my-preview  is-align-items';
                            }else {
                                this.$refs.myPreview.className = 'my-preview';
                            }
                        }
                        img.style.transform = `rotate(${this.imgData.angle}deg)`;

                    } else {
                        let img = document.createElement('img');
                        img.className = 'my-preview-img';
                        this.$refs.myPreview.appendChild(img);
                        img.src = src;
                        img.onload = () => {
                            if(img.getBoundingClientRect().height > window.innerHeight) {
                                this.$refs.myPreview.className = 'my-preview  is-align-items';
                            }else {
                                this.$refs.myPreview.className = 'my-preview';
                            }
                        }
                        img.style.transform = `rotate(${this.imgData.angle}deg)`;
                    }
                })


            },
            closePreview() {
                this.isPreview = false;
            },
            refreshIndex(index) {
                var child = this.$refs.porlet.parentNode;
                var parent = child.parentNode;
                let children = parent ? parent.children : []
                this.rightIndex = /*Array.prototype.indexOf.call(children, child);*/index;
                this.imgData.index = this.rightIndex;
                this.$emit('getImgData', this.imgData)
            },
        },
        mounted() {
            this.$refs.image.style.transform = `rotate(${this.imgData.angle}deg)`;
            this.$watch('imgData', () => {
                this.$nextTick(() => {
                    this.$refs.image.onload = () => {
                        this.$emit('getImgData', this.imgData)
                    }
                    this.$emit('getImgData', this.imgData)
                })

            }, {
                deep: true,
                immediate: true
            })
        },
        created() {
            this.imgData.index = this.rightIndex;
        }

    }
</script>

<style scoped>
    .hover:hover {
        border-radius: 50%;
        background: #fff;
    }

    .picture-wrapper {
        border: 1px solid #eee;
    }

    .header {
        background: #eee;
    }

    .body {
        padding: 10px;
    }

    .my-preview {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .is-align-items {
        align-items: flex-start;
    }

    .number {
        color: red;
        font-size: 20px;

    }

</style>