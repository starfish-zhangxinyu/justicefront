<template>
  <div class="signature-box">
    <el-button
      type="primary"
      size="small"
      style="margin-bottom: 10px"
      @click="signature"
      :disabled="signDisabled"
      >{{ title }}</el-button
    >
    <el-button
      size="small"
      type="primary"
      @click="reSign"
      :disabled="reSignDisabled"
      >重新{{ title }}</el-button
    >
    {{ title }}密码：
    <el-input
      size="small"
      v-model="password"
      show-password
      autocomplete="off"
      style="display: inline-block; width: 100px"
    ></el-input>
    <div class="search-box">
      <div class="pdf-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :style="{ width: pageCount * 40 + 80 + 'px' }"
          layout="prev, pager, next"
          :page-size="1"
          :current-page.sync="currentPage"
          :total="pageCount"
        ></el-pagination>
      </div>
      <div class="container">
        <div
          style="margin: 0 auto; height: 1123px; width: 794px"
          id="pdf-box"
          ref="pdfBox"
        >
          <pdf
            :src="pdfSrc"
            class="pdf"
            :page="currentPage"
            @num-pages="pageCount = $event"
          ></pdf>
          <VueDragResize
            :w="vw"
            :h="vh"
            v-on:resizing="resize"
            :aspectRatio="true"
            v-if="imgShow"
            :isResizable="true"
            :x="positionLeft"
            :y="positionTop"
            :style="{
              'margin-left': imgLeft + 'px',
              'margin-top': imgTop + 'px',
            }"
            parent="#pdf-box"
            :parentW="794"
            :parentH="1123"
            :parentLimitation="true"
            @resizestop="resizestop"
            @dragstop="dragStop"
            :minw="10"
            :minh="10"
          >
            <!--<div class="box" :style="{width: + vw+ 'px',height:+vh+'px'}">-->
            <img :src="imgSrc" class="picture" ref="img" />

            <!--</div>-->
          </VueDragResize>
        </div>
      </div>

      <!-- -->
    </div>
    <div class="search-box" style="text-align: center">
      <el-button size="small" type="primary" @click="save()">保存</el-button>
      <el-button size="small" type="success" @click="complete">完成</el-button>
    </div>
  </div>
</template>
<script>
import api from "../../api/index";
import pdf from "vue-pdf";
import VueDragResize from "vue-drag-resize";

export default {
  name: "Signature",
  components: { pdf: pdf, VueDragResize: VueDragResize },
  data() {
    return {
      currentPage: 1,
      imgShow: false,

      signDisabled: false,
      reSignDisabled: false,

      pdfSrc: "",
      imgSrc: "",
      vw: 0,
      vh: 0,

      imgTop: 0,
      imgLeft: 0,

      positionLeft: 0,
      positionTop: 0,

      signatureLocationInfoList: [],
      savedList: [],
      pageCount: 0,
      password: "", //电子签名秘钥
      title: "",
    };
  },
  methods: {
    resize(newRect) {
      this.vw = newRect.width;
      this.vh = newRect.height;
    },
    dragStop(obj) {
      //signNum signX signY
      var index = this._.findIndex(this.signatureLocationInfoList, [
        "signNum",
        this.currentPage,
      ]);
      if (index == -1) {
        this.signatureLocationInfoList.push({
          llx: obj.left,
          lly: obj.top,
          urx: obj.width,
          ury: obj.height,
          signNum: this.currentPage,
          imagePath: this.imgSrc,
        });
      } else {
        this.signatureLocationInfoList[index] = {
          llx: obj.left,
          lly: obj.top,
          urx: obj.width,
          ury: obj.height,
          signNum: this.currentPage,
          imagePath: this.imgSrc,
        };
      }
    },
    resizestop(obj) {
      var index = this._.findIndex(this.signatureLocationInfoList, [
        "signNum",
        this.currentPage,
      ]);
      if (index == -1) {
        this.signatureLocationInfoList.push({
          llx: obj.left,
          lly: obj.top,
          urx: obj.width,
          ury: obj.height,
          signNum: this.currentPage,
          imagePath: this.imgSrc,
        });
      } else {
        this.signatureLocationInfoList[index] = {
          llx: obj.left,
          lly: obj.top,
          urx: obj.width,
          ury: obj.height,
          signNum: this.currentPage,
          imagePath: this.imgSrc,
        };
      }
    },
    handleCurrentChange(current) {
      this.currentPage = current;
      var index = this._.findIndex(this.signatureLocationInfoList, [
        "signNum",
        current,
      ]);
      if (index != -1) {
        this.imgShow = true;

        this.positionLeft = this.signatureLocationInfoList[index].llx;
        this.positionTop = this.signatureLocationInfoList[index].lly;
        this.vw = this.signatureLocationInfoList[index].urx;
        this.vh = this.signatureLocationInfoList[index].ury;
      } else {
        this.positionLeft = 0;
        this.positionTop = 0;
        this.vw = 100;
        this.vh = 100;
        this.imgShow = false;
      }
    },
    //签名
    signature() {
      if (this.pdfSrc && this.pageCount) {
        /* this.imgShow = true;
        this.vw = 100;
        this.vh = 100;  */
        let img = new Image();
        img.src = this.imgSrc;
        let that = this;
        img.onload = function () {
          that.imgShow = true;
          that.vw = img.width;
          that.vh = img.height;
        };
      } else {
        this.$message.error("pdf文件未加载！");
      }
    },
    //重新签名
    reSign() {
      this.$get(api.getPdfUrl + "?caseId=" + this.$route.query.caseId)
        .then((res) => {
          this.imgSrc = res.data.imageUrl;
          this.pdfSrc = res.data.pdfUrl;
          this.password = "";
          this.signatureLocationInfoList = [];
          this.signDisabled = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //完成
    complete() {
      var data = {
        pdfUrl: this.pdfSrc,
        password: this.password,
        signatureLocationInfoList: [],
      };
      if (!(data.password && data.password != "")) {
        this.$message.error("请输入" + this.title + "密码！");
        return;
      }
      var list = [].concat(this.signatureLocationInfoList);
      list.forEach((v, i) => {
        var x = v.llx;
        var y = v.lly;
        var h = v.ury;
        var w = v.urx;
        v.llx = Number((x / 794).toFixed(3));
        v.lly = Number(((1123 - (y + h)) / 1123).toFixed(3));
        v.urx = Number(((x + w) / 794).toFixed(3));
        v.ury = Number(((1123 - y) / 1123).toFixed(3));
        v.signNum = v.signNum.toString();
      });
      if (list.length == 0) {
        if (this.savedList.length) {
          data.signatureLocationInfoList = [].concat(this.savedList);
        } else {
          data.signatureLocationInfoList = [];
        }
      } else {
        data.signatureLocationInfoList = list;
      }
      if (data.signatureLocationInfoList.length) {
        this.$put(
          api.pdfComplete +
            "?taskId=" +
            this.$route.query.taskId +
            "&procInsId=" +
            this.$route.query.procInsId +
            "&caseId=" +
            this.$route.query.caseId,
          data
        )
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "已完成！",
                type: "success",
              });
              this.reSignDisabled = true;
              /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
              this.$router.go(-1); //为了保持筛选状态
            }
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      } else {
        this.$message.error("您还未" + this.title + "，不能完成！");
      }
    },
    save() {
      var data = {
        pdfUrl: this.pdfSrc,
        password: this.password,
        signatureLocationInfoList: [],
      };
      if (!(data.password && data.password != "")) {
        this.$message.error(`请输入${this.title}密码！`);
        return;
      }
      var list = [].concat(this.signatureLocationInfoList);

      list.forEach((v, i) => {
        var x = v.llx;
        var y = v.lly;
        var h = v.ury;
        var w = v.urx;
        v.llx = Number((x / 794).toFixed(3));
        v.lly = Number(((1123 - (y + h)) / 1123).toFixed(3));
        v.urx = Number(((x + w) / 794).toFixed(3));
        v.ury = Number(((1123 - y) / 1123).toFixed(3));
        v.signNum = v.signNum.toString();
      });
      if (list.length == 0) {
        if (this.savedList.length) {
          data.signatureLocationInfoList = this.savedList;
        } else {
          data.signatureLocationInfoList = [];
        }
      } else {
        data.signatureLocationInfoList = list;
      }
      if (data.signatureLocationInfoList.length) {
        this.$post(
          api.pdfSign +
            "?taskId=" +
            this.$route.query.taskId +
            "&procInsId=" +
            this.$route.query.procInsId +
            "&caseId=" +
            this.$route.query.caseId,
          data
        )
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              this.positionLeft = 0;
              this.positionTop = 0;
              this.vw = 100;
              this.vh = 100;
              this.imgShow = false;
              this.signDisabled = true;
              this.reSignDisabled = false;
              this.signatureLocationInfoList = [];
              this.$get(
                api.getPdfUrl +
                  "?caseId=" +
                  this.$route.query.caseId +
                  "&taskId=" +
                  this.$route.query.taskId
              )
                .then((res) => {
                  this.imgSrc = res.data.imageUrl;
                  this.pdfSrc = res.data.pdfUrl;
                  this.savedList = [].concat(
                    res.data.signatureLocationInfoList
                  );
                  if (res.data.signatureLocationInfoList) {
                    this.signDisabled = true;
                    this.reSignDisabled = false;
                  }
                })
                .catch((err) => {
                  this.$message.error(err.errMsg);
                });
            }
          })
          .catch((err) => {
            this.$message.error(err.errMsg);
          });
      } else {
        this.$message.error(`您还未${this.title},不能进行保存！`);
      }
    },
  },
  created() {
    if (this.$route.query.formKey == "REPORT_SIGN") {
      this.title = "签名";
    } else {
      this.title = "签章";
    }
    /* this.vw = 100;
    this.vh = 100; */
    this.$get(
      api.getPdfUrl +
        "?caseId=" +
        this.$route.query.caseId +
        "&taskId=" +
        this.$route.query.taskId
    )
      .then((res) => {
        this.imgSrc = res.data.imageUrl;
        this.pdfSrc = res.data.pdfUrl;
        this.password = res.data.password;
        this.savedList = [].concat(res.data.signatureLocationInfoList);
        if (
          res.data.signatureLocationInfoList &&
          res.data.signatureLocationInfoList.length > 0
        ) {
          this.signDisabled = true;
          this.reSignDisabled = false;
        }
      })
      .catch((err) => {
        this.$message.error(err.errMsg);
      });
    this.$nextTick(() => {
      this.imgTop = this.$refs.pdfBox.offsetTop;
      this.imgLeft = this.$refs.pdfBox.offsetLeft;
    });
  },
};
</script>


<style scoped>
.container {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: relative;
}
#pdf-box {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.pdf {
  border: 1px solid gainsboro;
  overflow: hidden;
  height: 1123px;
  width: 794px;
}

.picture {
  height: 100%;
  width: 100%;
}

.pdf-pagination {
  width: 250px;
  overflow: auto;
  margin: 0 auto;
  margin-bottom: 10px;
}

.box {
  border-radius: 50%;
}
</style>