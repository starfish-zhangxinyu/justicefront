export default {
    install(Vue, options) {
        //切割时间
        Vue.prototype.$divideDate = function (date) {
            var arr = date ?  date.split(' ') : [];
            return arr[0];
        };
        //确认消息框
        Vue.prototype.$confirmBox = function (confirmText) {
            return new Promise((resolve, reject) => {
                this.$confirm(confirmText, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err)
                })
            })
        };
        Vue.prototype.$handleTime = function (val) {
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
        };
        Vue.prototype.$handleDateTime = function (val) {
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
        };
        //将文件转化为base64
        Vue.prototype.$getBase64 = function (file) {
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
        };
        Vue.prototype.$findInArr = function (arr, key, s) {
            for (let i = 0; i < arr.length; i++) {
                console.log(arr[i][key]);
                if (arr[i][key] == s) {
                    return i;
                }
            }
            return -1;
        };
        Vue.prototype.$getFileType = function (file) {
            var fileName = file.name;
            var fileType = fileName.substring(fileName.indexOf('.') + 1, fileName.length + 1);
            return fileType;
        };
        //批量压缩photo对象
        Vue.prototype.$compressPhotos = async (imageArr) => {
            var arr = [];
            for (var i = 0; i < imageArr.length; i++) {
                if ((imageArr[i].photo && imageArr[i].photo.raw) || imageArr[i].raw) { 
                    if(imageArr[i].photo && imageArr[i].photo.raw) {
                        //当显示title时，为上传
                        var image = await lrz(imageArr[i].photo.raw, {width: 1280}).then(function (rst) {
                            return {photo:{'imageType': imageArr[i].photo.imageType, 'image': rst.base64},photoName:imageArr[i].photoName};
                        });
                    }else {
                        //当显示title时，为扫描
                        var image = await lrz(imageArr[i].raw, {width: 1280}).then(function (rst) {
                            return {photo:{'imageType': imageArr[i].fileType, 'image': rst.base64},photoName:imageArr[i].photoName};
                        });
                    }
                   
                    arr.push(image);
                } else {
                    arr.push(imageArr[i]);
                }

            }
            ;
            return arr;
        };
        //批量压缩image对象
        Vue.prototype.$compressImages = async (imageArr) => {
            var arr = [];
            for (var i = 0; i < imageArr.length; i++) {
                if (imageArr[i].raw) {
                    var image = await lrz(imageArr[i].raw, {width: 1280}).then(function (rst) {
                        let imageType='';
                        if(imageArr[i].imageType){
                            imageType=imageArr[i].imageType;
                        }else{
                            var fileName = imageArr[i].name;
                            imageType = fileName.substring(fileName.indexOf('.') + 1, fileName.length + 1);

                        }
                        return {'imageType': imageType, 'image': rst.base64};
                    });
                    arr.push(image);
                } else {
                    arr.push(imageArr[i]);
                }

            }
            ;
            return arr;
        };
        //压缩单张图片
        Vue.prototype.$compressImage = async (image) => {
            var image = await lrz(image.raw, {width: 1280}).then(function (rst) {
                return {'imageType': image.imageType, 'image': rst.base64};
            });

            return image;
        };
        Vue.prototype.$replaceSubTag =   function(value) {
            if (value) {
                return value.replace(new RegExp("@", 'gm'), '<sub>').replace(new RegExp("&", 'gm'), '<span>').replace(new RegExp("#", 'gm'), '</span>');
            } else {
                return value;
            }
        };
        Vue.prototype.$replaceSupTag =   function(value) {
            if (value) {
                return value.replace(new RegExp("&lt;", 'gm'), '<').replace(new RegExp("&gt;", 'gm'), '>');
            } else {
                return value;
            }
        };

    }

}
