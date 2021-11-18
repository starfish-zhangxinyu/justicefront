<template>
  <!--扫描图片窗口-->
  <div
    style="display: inline-block; margin: 0 10px"
    v-if="hasPermission('auth:camera')"
  >
    <el-button
      v-if="isScan"
      type="primary"
      size="mini"
      icon="el-icon-camera-solid"
      @click="upload"
      >扫描</el-button
    >
    <el-button
      v-else
      type="primary"
      size="mini"
      icon="el-icon-camera-solid"
      @click="upload"
    ></el-button>
    <el-dialog
      width="80%"
      :visible.sync="scannerDialog"
      @open="open"
      @close="close"
      :append-to-body="true"

    >
      <el-row>
        <el-col :span="10">
          <div style="overflow: hidden" ref="div" class="overflow">
            <canvas
              style="
                margin-left: 6px;
                width: 100% !important;
                height: 380px !important;
                background: black;
              "
              ref="canvas"
            />
            <div class="setting-button">
              <el-button @click="ancelClipSelect">取消区域</el-button>
              <el-button type="primary" @click="czurOptionDialog = true"
                >选项设置</el-button
              >
            </div>
          </div>
        </el-col>
        <el-col :span="14" style="padding-left: 10px">
          <Portlet title="图片" style="height: 380px !important">
            <template slot="buttonGroup">
              <el-button
                type="primary"
                icon="el-icon-camera-solid"
                size="mini"
                style="float: right; margin-right: 10px; margin-top: 11px"
                @click="scannerPhoto"
                >扫描</el-button
              >
            </template>
            <template slot="body">
              <PictureWall
                :model.sync="newTemImages"
                :has-title="false"
                style="height: 380px; overflow: scroll"
              ></PictureWall>
            </template>
          </Portlet>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="20">
          <div>
            <el-button @click="scannerDialog = false">取 消</el-button>
            <el-button type="primary" @click.native.prevent="confirmUpload"
              >确 定</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="选项设置"
      width="40%"
      :visible.sync="czurOptionDialog"
      @open="czurOptionDialogOpen"
    >
      <el-form ref="form" :model="czurOption" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="A4扫描幅面">
              <el-select v-model="czurOption.CZUR_A4">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="像素">
              <el-select v-model="czurOption.CZUR_Zoom">
                <el-option label="1800W" value="1800W"></el-option>
                <el-option label="1600W" value="1600W"></el-option>
                <el-option label="1000W" value="1000W"></el-option>
                <el-option label="800W" value="800W"></el-option>
                <el-option label="500W" value="500W"></el-option>
                <el-option label="200W" value="200W"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="图片处理方式">
              <el-select v-model="czurOption.CZUR_ProcessType">
                <el-option label="原图" value="src"></el-option>
                <el-option label="单页自动裁剪" value="single"></el-option>
                <el-option label="成册展平拆分双页" value="curve_1"></el-option>
                <el-option
                  label="成册展不平拆分双页"
                  value="curve_0"
                ></el-option>
                <el-option label="选框裁剪" value="clip"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图像质量">
              <el-select v-model="czurOption.CZUR_Format_Jpg">
                <el-option label="60" value="60"></el-option>
                <el-option label="65" value="65"></el-option>
                <el-option label="70" value="70"></el-option>
                <el-option label="75" value="75"></el-option>
                <el-option label="80" value="80"></el-option>
                <el-option label="85" value="85"></el-option>
                <el-option label="90" value="90"></el-option>
                <el-option label="95" value="95"></el-option>
                <el-option label="100" value="100"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="颜色模式">
              <el-select v-model="czurOption.CZUR_ClrMode">
                <el-option label="无模式" value="0"></el-option>
                <el-option label="彩色模式" value="1"></el-option>
                <el-option label="白纸印章模式" value="2"></el-option>
                <el-option label="证件底纹模式" value="3"></el-option>
                <el-option label="黑白模式" value="4"></el-option>
                <el-option label="灰度模式" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="翻页检测">
              <el-select v-model="czurOption.CZUR_AutoPageDetect">
                <el-option label="不检测翻页动作" value="0"></el-option>
                <el-option label="检测翻页动作" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="空白页检测">
              <el-select v-model="czurOption.CZUR_BlankPageDetect">
                <el-option label="不检测" value="0"></el-option>
                <el-option label="检测" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="边缘检测">
              <el-select v-model="czurOption.CZUR_EdgeDetect">
                <el-option label="不检测" value="0"></el-option>
                <el-option label="检测" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="是否保存到本地">
              <el-select v-model="czurOption.CZUR_SavePath">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="保存路径"
              v-if="czurOption.CZUR_SavePath == '1'"
            >
              <el-input
                v-model="czurOption.CZUR_SavePathInput"
                placeholder="C:/Users/Public/Pictures"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="czurOptionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveOptions">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <!--扫描图片窗口-->
</template>

<script>
import Portlet from "../../page/layout/Portlet";
import { ETPlug } from "../../assets/js/ETPlug"; //先要引入
import PictureWall from "../../components/common/PictureWall";

export default {
  name: "Czur",
  components: { Portlet: Portlet, PictureWall: PictureWall },
  data() {
    return {
      scannerDialog: false,
      czurOptionDialog: false,
      showFileList: [],
      confirmList: [],
      newTemImages: [],
      deviceInitialized: false,
      //选项设置
      czurOption: {
        CZUR_A4: "0",
        CZUR_Zoom: "200W",
        CZUR_ProcessType: "src",
        CZUR_Format_Jpg: 100,
        CZUR_ClrMode: "0",
        CZUR_AutoPageDetect: "0",
        CZUR_BlankPageDetect: "0",
        CZUR_EdgeDetect: 0,
        CZUR_SavePath: "0",
        CZUR_SavePathInput: "",
      },
    };
  },
  props: ["model", "isScan"],
  inject: ["hasPermission"],
  methods: {
    confirmUpload() {
      /* this.confirmList = [].concat(this.newTemImages); */
      this.confirmList = this.confirmList.concat(this.newTemImages);
      this.scannerDialog = false;
    },
    upload() {
      this.scannerDialog = true;
      this.newTemImages = [];
      this.showFileList = this.model;
    },
    open() {
      this.$nextTick(function () {

        if (!this.deviceInitialized) {
          ETPlug.initCzur(this.$refs.canvas, this.handleChangeAccessory);
          /* ETPlug.initCzur(this.$refs.canvas, this.handleChangeAccessory); */
          this.deviceInitialized = true;
        } else {
          if (!ETPlug.deviceIsOpen()) {
            ETPlug.openDevice();
          }
        }
      });
    },
    scannerPhoto() {
      ETPlug.capture();
    },
    //选择上传附件文件
    handleChangeAccessory(file, fileList) {
      var newTemImagesLen = this.newTemImages.length + 1;
      var imgFile = this.base64ImgtoFile(file, "imageScan" + newTemImagesLen);
      var url = URL.createObjectURL(imgFile);
      this.newTemImages.push({
        fileType: "jpg",
        raw: imgFile,
        name: imgFile.name,
        url: url,
        status: "ready",
      });
    },
    //将base64转为图片文件
    base64ImgtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.jpg`, {
        type: mime,
      });
    },
    close() {
      this.deviceInitialized = false;
      this.newTemImages = [];
      ETPlug.closeDevice();
    },
    czurOptionDialogOpen() {
      var options = ETPlug.readCzurOptionFromCookie();
      (this.czurOption.CZUR_A4 = options.CZUR_A4),
        (this.czurOption.CZUR_Zoom = options.CZUR_Zoom),
        (this.czurOption.CZUR_ProcessType = options.CZUR_ProcessType),
        (this.czurOption.CZUR_Format_Jpg = options.CZUR_Format_Jpg),
        (this.czurOption.CZUR_ClrMode = options.CZUR_ClrMode),
        (this.czurOption.CZUR_AutoPageDetect = options.CZUR_AutoPageDetect),
        (this.czurOption.CZUR_BlankPageDetect = options.CZUR_BlankPageDetect),
        (this.czurOption.CZUR_EdgeDetect = options.CZUR_EdgeDetect.toString());
      if (options.CZUR_SavePath.toString() == "0") {
        this.czurOption.CZUR_SavePath = "0";
      } else {
        this.czurOption.CZUR_SavePathInput = options.CZUR_SavePath.toString();
        this.czurOption.CZUR_SavePath = "1";
      }
    },
    saveOptions() {
      ETPlug.setCzurOption("CZUR_A4", this.czurOption.CZUR_A4);
      ETPlug.setCzurOption("CZUR_Zoom", this.czurOption.CZUR_Zoom);
      ETPlug.setCzurOption(
        "CZUR_ProcessType",
        this.czurOption.CZUR_ProcessType
      );

      ETPlug.setCzurOption(
        "CZUR_Format_Jpg",
        parseInt(this.czurOption.CZUR_Format_Jpg)
      );

      ETPlug.setCzurOption("CZUR_ClrMode", this.czurOption.CZUR_ClrMode);
      ETPlug.setCzurOption(
        "CZUR_AutoPageDetect",
        this.czurOption.CZUR_AutoPageDetect
      );
      ETPlug.setCzurOption(
        "CZUR_BlankPageDetect",
        this.czurOption.CZUR_BlankPageDetect
      );

      ETPlug.setCzurOption(
        "CZUR_EdgeDetect",
        parseInt(this.czurOption.CZUR_EdgeDetect)
      );

      if (this.czurOption.CZUR_SavePath == "0") {
        ETPlug.setCzurOption("CZUR_SavePath", this.czurOption.CZUR_SavePath);
      } else {
        if (this.czurOption.CZUR_SavePathInput) {
          ETPlug.setCzurOption(
            "CZUR_SavePath",
            this.czurOption.CZUR_SavePathInput
          );
        } else {
          ETPlug.setCzurOption("CZUR_SavePath", "C:\\Users\\Public\\Pictures");
        }
      }
      this.czurOptionDialog = false;
    },
    ancelClipSelect() {
      ETPlug.cancelClipSelect();
    },
  },
  watch: {
    confirmList: {
      handler(newval, oldval) {
        this.$emit("update:model", newval);
      },
      immediate: true,
    },
    model: {
      handler(newval, oldval) {
        if (newval) {
          this.confirmList = newval;
          var arr = [].concat(newval);
          this.showFileList = arr;
        } else {
          this.confirmList = [];
        }
      },
      immediate: true,
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.overflow {
  text-align: left;
}
.overflow .setting-button {
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translate(-50%, 0);
  /* text-align: left !important; */
}
</style>