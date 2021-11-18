<template>
    <div class="picwrap" ref="picwrap">
            <!--这里key值不这样写就会错误-->
            <Picture v-for="(item,index) in selectedImgs2"  style="margin:10px" :key="+new Date()"
                     :image="item"
                     :index="index"
                     ref="picture"
                     :class="'picture' + index"
                     @dragstart.native="handleDragStart($event, item, index)"
                     @drop.native.prevent="handleDrop($event, 'picture' + index, item, index)"
                     @dragover.native.prevent="handleDragOver"
                     @deletePic="handleDelete"
                     @getImgData="getImgData"
                     draggable="true"></Picture>
        <!--</div>-->
    </div>

</template>

<script>
    import Picture from "../../../components/common/Picture";

    export default {
        name: "PicWall.vue",
        components: {
            Picture
        },
        data() {
           return {
               afterDeleteImgs:this.realImgs,
               temp:{img:'',rowCount:'', angle:'', name:''},
               selectedImgs2: JSON.parse(JSON.stringify(this.selectedImgs))
           }
        },
        props:{
            selectedImgs:{
                type:Array,
                default() {
                    return []
                }
            },
            realImgs:{
                ype:Array,
                default() {
                    return []
                }
            }
        },
        watch: {
            realImgs(newal, oldValue) {
                this.afterDeleteImgs = newal;
            },
            selectedImgs(newal, oldValue) {

                this.selectedImgs2 = JSON.parse(JSON.stringify(newal));
            },
            selectedImgs2(newVal,oldValue) {
                this.$emit('changeImgs', newVal);
            }
        },
        methods:{
            getImgData(detailImg) {
                this.$emit('changeImgs', this.selectedImgs2);
            },
            handleDragStart(e, img, index) {

                this.temp.img = img.img;
                this.temp.rowCount = img.rowCount;
                this.temp.angle = img.angle;
                this.temp.name = img.name;
                this.temp.index = index;
            },
            handleDrop(e, domClass, img, index) {

                let currentImg = JSON.parse(JSON.stringify(img));

                this.$set(this.selectedImgs2[index], 'img', this.temp.img);
                this.$set(this.selectedImgs2[index], 'rowCount', this.temp.rowCount);
                this.$set(this.selectedImgs2[index], 'angle', this.temp.angle);
                this.$set(this.selectedImgs2[index], 'name', this.temp.name);


                this.$set(this.selectedImgs2[this.temp.index], 'img', currentImg.img);
                this.$set(this.selectedImgs2[this.temp.index], 'rowCount', currentImg.rowCount);
                this.$set(this.selectedImgs2[this.temp.index], 'angle', currentImg.angle);
                this.$set(this.selectedImgs2[this.temp.index], 'name', currentImg.name);

                this.$nextTick(() => {
                    this.$refs.picture.forEach((item,index)=> {
                        item.refreshIndex(index);
                    })
                })
            },
            handleDragOver(e) {
                e.preventDefault();
            },
            handleDelete(img, outIndex) {

                this.selectedImgs2.splice(outIndex, 1);
                // this.selectImgs =


                this.$nextTick(() => {
                    this.$refs.picture.forEach((item,index)=> {
                        item.refreshIndex(index);
                    })
                })

            },
        },

        created() {
        }
    }
</script>

<style scoped>

</style>