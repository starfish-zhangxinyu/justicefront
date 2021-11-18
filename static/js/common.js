//公共js方法
import axios from "axios/index";

export default {

  //处理时间
handleTime:function(val){
 if(!val){
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
}else{
   return ''
 }
},
  handleDateTime:function(val){
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
      if (H < 10) {
        H = '0' + H;
      }
      if (i < 10) {
        i = '0' + i;
      }
      if (s1 < 10) {
        s1 = '0' + s1;
      }
      var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s1;
      return t;
    } else {
      return "";
    }
  },
  confirm:function (_this,confirmText) {
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
   Trim:function(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
},
  findInArr:function (arr, key, s) {
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i][key]);
      if (arr[i][key] == s) {
        return i;
      }
    }
    return -1;
  },
 //将文件转换成base64
    getBase64(file){
      return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            let Result = "";
            reader.readAsDataURL(file);
            reader.onload = function() {
                Result = reader.result;
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.onloadend = function() {
                resolve(Result);
            };
        });
    },
    //批量压缩图片
    compressImages(imageArr){
      var compressedImages=[];
      var allPromise=[];
        imageArr.forEach((v,i)=>{
            if(v.raw){
                let p = new Promise((resolve,reject)=>{
                    let file =v.raw;
                    let filename = file.name.substring(0,file.name.lastIndexOf('.'));
                    let filetype=file.type.substring(file.type.lastIndexOf('/')+1,file.type.length);
                    lrz(file,{width:1280}).then(function(rst) {
                        let img={'imageType':filetype,'image':rst.base64};
                        compressedImages.push(img);
                        resolve();
                    });
                });
                allPromise.push(p);
            }else{
                compressedImages.push(v);
            }

        });
        Promise.all(allPromise).then(res=>{
            return compressedImages;
        })

    },

}
