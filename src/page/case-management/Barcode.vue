<template>
    <div>
        <div v-if="barCodeType ===`案件条码`" class="lvel" >

                <img :src="`data:image/png;base64,`+caseDetailDto.barCode.img" class="barCodeImg"/>
                <div style="text-align: center;padding-top: 5px;margin: auto;">{{caseDetailDto.barCode.code}}</div>

        </div>
<!--        <div v-if="barCodeType ===`案件条码`" class="lvel" >-->

<!--                <img :src="`data:image/png;base64,`+caseDetailDto.barCode.img" class="barCodeImg"/>-->
<!--                <div style="text-align: center;padding-top: 5px;margin: auto;">{{caseDetailDto.barCode.code}}</div>-->

<!--        </div>-->
        <div v-else-if="barCodeType===`样本条码`" class="lvel">
            样本条码
        </div>

        <div v-else-if="barCodeType===`检材条码`" class="lvel">
            样本条码
        </div>


    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Barcode",
        data(){
            return {
                barCodeType:'',
                caseId:'',
                caseDetailDto:{}
            }
        },
        mounted() {
          let query= this.$route.query;
            this.barCodeType = query.barCodeType;
            this.caseId = query.caseId;
          this.$get(api.printBarCode,query).then(res=>{
              this.caseDetailDto=res.data.caseDetail;
              setTimeout(function(){
                  window.print()
              },1000)

          }).catch(err=>{})
        }
    }
</script>

<style  media="print" scoped>
    .lvel{
        width: 268px;height: 150px;
        background-color: white;
        border: 1px solid black;
        margin: auto;margin-bottom:30px;
        margin-top: 10px;
    }
    .barCodeImg{
        width:260px;height:80px;
        margin-top: 3px;
    }

     @page {
        size: 280px 200px!important;
        margin-bottom: 0mm !important;
        margin-top: 0mm !important;
    }
    body{
        width: 280px!important;
        height: 200px!important;
    }
</style>
