//公共js方法
import axios from "axios/index";

export default {

  //处理时间
  handleTime: function (val) {
    if (!val) {
      var date = new Date(val);
      Y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        H = date.getHours(),
        i = date.getMinutes(),
        s1 = date.getSeconds();
      if (m < 10) {
        m = '0' + m;
      }
      if (d < 10) {
        d = '0' + d;
      }
      var t = Y + '-' + m + '-' + d
      return t;
    } else {
      return ''
    }
  },
  confirm: function (_this, confirmText) {
    return new Promise((resolve, reject) => {
      _this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  },
  //去掉输入内容的前后空格
  Trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  findInArr: function (arr, key, s) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] == s) {
        return i;
      }
    }
    return -1;
  },
  //将文件转换成base64
  getBase64(file) {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      let Result = "";
      reader.readAsDataURL(file);
      reader.onload = function () {
        Result = reader.result;
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.onloadend = function () {
        resolve(Result);
      };
    });
  },
  //批量压缩图片
  compressImages(imageArr) {
    var compressedImages = [];
    var allPromise = [];
    imageArr.forEach((v, i) => {
      if (v.raw) {
        let p = new Promise((resolve, reject) => {
          let file = v.raw;
          let filename = file.name.substring(0, file.name.lastIndexOf('.'));
          let filetype = file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length);
          lrz(file, { width: 1280 }).then(function (rst) {
            let img = { 'imageType': filetype, 'image': rst.base64 };
            compressedImages.push(img);
            resolve();
          });
        });
        allPromise.push(p);
      } else {
        compressedImages.push(v);
      }

    });
    Promise.all(allPromise).then(res => {
      return compressedImages;
    })

  },
  //文件下载
  downFile(data, fileName) {
    if (!data) return;
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  },
  //获取当前的时间,传入val(时间戳)，可转时间
  thisDate(isShowTime, val) {
    let date = val ? new Date(val) : new Date();
    let Y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate().toString().padStart(2, '0');
    let H = date.getHours().toString().padStart(2, '0');
    let i = date.getMinutes().toString().padStart(2, '0');
    let s = date.getSeconds().toString().padStart(2, '0');
    if (isShowTime) {
      return `${Y}-${m}-${d} ${H}:${i}:${s}`;
    } else {
      return `${Y}-${m}-${d}`;
    }
  },
  //判断数组中是否有某个值
  findArrFn(arr, id) {
    let bFlog = true;
    arr.forEach(item => {
      if (item.id == id) {
        bFlog = false;
        return false;
      }
    });
    return bFlog;
  },
  //验证上传的文件类型是不是图片
  // 传入需要上传的文件列表，返回一个数组
  isUploadImg(fileList) {
    let arr = [];
    fileList.forEach((item, index) => {
      if (!item.raw.type.includes('image')) {
        this.$message.error('请上传图片文件!');
        return false
      } else {
        arr.push(item)
      }
    })
    return arr;
  },
}