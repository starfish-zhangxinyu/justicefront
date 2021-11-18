var ETPlug = function () {

    var fetchImageCallbackFunc;
    var cav_frame;
    var ctx_frame;
    var img_frame = new Image();
    var frame_Data;
    var clip_x = 0;
    var clip_y = 0;
    var clip_width = 0;
    var clip_height = 0;
    var clip_select = false;
    var bcr_x = 0;
    var bcr_y = 0;
    var bcr_width = 0;
    var bcr_height = 0;
    var bcr_select = false;
    var edge_detect = false;
    //边缘检测四个点的比例系数
    var x1 = 0, y1 = 0;
    var x2 = 0, y2 = 0;
    var x3 = 0, y3 = 0;
    var x4 = 0, y4 = 0;
    //框选的类型，0(裁剪区域框)、1(条码识别框)
    var select_type = -1;
    var down_flag = false;
    //是否火狐浏览器标记
    var firefox_flag = false;
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        firefox_flag = true;
    }
    //是否绘制视频画面
    var is_draw_frame = false;
    var ws_data = null;
    //服务的端口号
    var data_svc_port = 7890;
    var data_svc_connect = false;
    //数据通道是否经过身份验证
    var data_svc_prove = false;
    var ws_cmd = null;
    var cmd_svc_port = 10889;
    var cmd_svc_connect = false;
    var device_is_open = false;

    function connect_data_svc() {
        if (data_svc_connect == true) {
            console.log("已连接数据服务器");
            return;
        }
        var url = "ws://localhost:" + data_svc_port + "/";
        if ('WebSocket' in window) {
            ws_data = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
            ws_data = new MozWebSocket(url);
        } else {
            alert("浏览器不支持WebSocket");
        }
        dataWebSocketEvent();
    }

    function dataWebSocketEvent() {
        //服务器打开以后
        ws_data.onopen = function () {
            data_svc_connect = true;
            console.log("成功连接数据服务器");

            //成功连接服务器后，需要发送身份验证消息
            //身份验证格式: {"id": 1000}
            //成功收到验证反馈消息: {"id": 1001, "status": "success"}，说明为CZUR提供
            ws_data.send('{\"id\": 1000}');
        }

        ws_data.onmessage = function (e) {
            if (data_svc_prove == false) {
                var jsonObj = window.JSON.parse(e.data);
                if (jsonObj.id == 1001) {
                    //身份验证成功
                    data_svc_prove = true;
                    console.log("数据服务器身份验证成功: " + jsonObj.status);
                    if (firefox_flag == true) {
                        //如果是火狐浏览器，设置数据通道的格式为二进制
                        ws_data.binaryType = "arraybuffer";
                    }
                }
                else {
                    //发送的身份验证数据包有问题
                    console.log("数据服务器身份验证失败: " + jsonObj.error);
                }
                return;
            }

            is_draw_frame = true;

            if (firefox_flag == true) {
                var aDataArray = new Uint8Array(e.data);

                var dataNum = 0;
                //发送的视频帧格式为ARGB，赋值的时候注意顺序
                for (var i = 0; i < frame_Data.data.length; i += 4) {
                    frame_Data.data[i + 0] = aDataArray[dataNum + 1];
                    frame_Data.data[i + 1] = aDataArray[dataNum + 2];
                    frame_Data.data[i + 2] = aDataArray[dataNum + 3];
                    frame_Data.data[i + 3] = aDataArray[dataNum + 0];
                    dataNum = dataNum + 4;
                }
                ctx_frame.putImageData(frame_Data, 0, 0);
                drawRect();
            } else {
                if (e.data != null && e.data.indexOf('width') < 0) {
                    img_frame.crossOrigin = 'anonymous';
                    img_frame.src = 'data:image/jpeg;base64,' + e.data;
                    img_frame.onload = function (e) {
                        ctx_frame.drawImage(img_frame, 0, 0, cav_frame.width, cav_frame.height);
                        drawRect();
                    }
                }

            }
        }

        ws_data.onclose = function () {
            data_svc_prove = false;
            data_svc_connect = false;
            console.log("数据服务器断开");
        }
    }


    function connect_cmd_svc() {
        if (cmd_svc_connect == true) {
            
            console.log("已连接指令服务器");
            return;
        }

        var url = "ws://localhost:" + cmd_svc_port + "/";
        if ('WebSocket' in window) {
            ws_cmd = new WebSocket(url);
        }
        else if ('MozWebSocket' in window) {
            ws_cmd = new MozWebSocket(url);
        }
        else {
            alert("浏览器不支持WebSocket");
        }
        cmdWebSocketEvent();
    }

    function cmdWebSocketEvent() {
        ws_cmd.onopen = function () {
            cmd_svc_connect = true;
            console.log("成功连接指令服务器");

            //成功连接服务器后，需要发送身份验证消息
            //身份验证格式: {"id": 1000}
            //成功收到验证反馈消息: {"id": 1001, "status": "success"}，说明为CZUR提供
            ws_cmd.send('{\"id\": 1000}');
        }

        ws_cmd.onmessage = function (e) {
            var jsonObj = window.JSON.parse(e.data);
            switch (jsonObj.id) {
                //身份验证反馈消息               
                case 1001: {
                    console.log("指令服务器身份验证成功: " + jsonObj.status);
                    //服务器身份验证成功以后，打开设备。
                    H5_OpenDevice();
                }
                    break;
                //打开设备反馈消息
                case 200: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "打开设备失败: " + jsonObj.error + "\r\n";
                        alert('打开设备失败，请检查设备是否已经打开且连接电脑！')
                        console.log(text);
                    } else {
                        device_is_open = true;
                        readAndSetDeviceParam();
                    }
                }
                    break;
                //拍照反馈消息
                case 201: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "拍照失败: " + jsonObj.error;
                        console.log(text);
                    }
                }
                    break;

                case 109: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "拍照失败(请检查路径是否有效，名称前缀是否包含特殊字符): " + jsonObj.error;
                        console.log(text);
                    }
                    else {
                    }
                }
                    break;

                //关闭设备反馈
                case 203: {

                    edge_detect = false;
                    is_draw_frame = false;

                    //预览画面清除
                    ctx_frame.fillStyle = "#000000";
                    ctx_frame.beginPath();
                    ctx_frame.fillRect(0, 0, cav_frame.width, cav_frame.height);
                    ctx_frame.closePath();

                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "关闭设备失败: " + jsonObj.error;
                        console.log(text);
                    }
                    else {
                        console.log('关闭设备成功')
                        // //关闭设备成功
                        // txtlog.value = "关闭设备成功\r\n" + txtlog.value;
                    }
                }
                    break;

                //自定义名称格式
                case 204: {
                    //成功
                    console.log("自定义格式成功!");
                }
                    break;

                //保存路径反馈消息
                case 205: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "设置路径失败: " + jsonObj.error;
                        console.log(text);
                    }
                    else {
                        //成功
                        console.log("设置路径成功");
                    }
                }
                    break;

                //图片尺寸反馈消息
                case 206: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("设置尺寸失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("设置尺寸成功");
                    }
                }
                    break;

                //图片dpi反馈消息
                case 207: {
                    //成功
                    console.log("设置DPI成功");
                }
                    break;

                //色彩模式反馈消息
                case 208: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "设置色彩模式失败: " + jsonObj.error;
                        console.log(text);
                    }
                    else {
                        //成功
                        console.log("设置色彩模式成功");
                    }
                }
                    break;

                //旋转角度反馈消息
                case 209: {
                    if (jsonObj.hasOwnProperty("error")) {
                        var text = "设置旋转角度失败: " + jsonObj.error;
                        console.log(text);
                    }
                    else {
                        //成功
                        console.log("设置旋转角度成功");
                    }
                }
                    break;

                //原图模式反馈消息
                case 210: {
                    //成功
                    console.log("设置原图模式成功");
                }
                    break;

                //单页裁边反馈消息
                case 211: {
                    //成功
                    console.log("设置单页裁边成功");
                }
                    break;

                //曲线展平反馈消息
                case 212: {
                    //成功
                    console.log("设置曲面展平成功");
                }
                    break;

                //空白页检测反馈消息
                case 213: {
                    //成功
                    console.log("设置空白页检测成功");
                }
                    break;

                //翻页检测反馈消息
                case 214: {
                    //成功
                    console.log("设置翻页检测成功");
                }
                    break;

                //BMP格式反馈消息
                case 215: {
                    //成功
                    console.log("设置BMP格式成功");
                }
                    break;

                //JPG格式反馈消息
                case 216: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("设置JPG格式失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("设置JPG格式成功");
                    }
                }
                    break;

                //HTTP上传反馈消息
                case 217: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("设置HTTP上传失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("正在进行HTTP上传，请稍后");
                    }
                }
                    break;

                //添加合成PDF图片反馈消息
                case 218: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("添加图片失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("添加图片成功");
                    }
                }
                    break;

                //合成PDF反馈消息
                case 219: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("合成PDF失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("正在合成PDF，请稍后\r\n");
                    }
                }
                    break;

                //手动裁剪反馈消息
                case 220: {
                    if (jsonObj.on != 0) {
                        console.log("已开启区域裁剪区域");
                    }
                    else {
                        console.log("已关闭区域裁剪区域");
                    }
                }
                    break;

                //条码识别反馈消息
                case 221: {
                    if (jsonObj.on != 0) {
                        console.log("已开启条码识别区域");
                    }
                    else {
                        console.log("已关闭条码识别区域");
                    }
                }
                    break;

                //base64数据反馈消息
                case 222: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("获取base64数据失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        //将接收到的base64数据直接显示
                        //console.log(jsonObj.success)
                        fetchImageCallbackFunc('data:image/jpeg;base64,' + jsonObj.success);

                        // img_jpg.crossOrigin = 'anonymous';
                        // img_jpg.src = 'data:image/jpeg;base64,' + jsonObj.success;
                        // img_jpg.onload = function (e) {
                        //     ctx_jpg.drawImage(img_jpg, 0, 0, cav_jpg.width, cav_jpg.height);
                        // }
                    }
                }
                    break;

                //重命名文件名称
                case 223: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("重命名文件失败");
                    }
                    else {
                        console.log("重命名文件成功\r\n");
                    }
                }
                    break;

                //设置火狐浏览器反馈
                case 224: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("设置浏览器类型失败: " + jsonObj.error);
                    }
                    else {
                        console.log("设置浏览器类型成功");
                    }
                }
                    break;

                //边缘检测设置反馈
                case 225: {
                    if (jsonObj.on != 0) {
                        x1 = 0;
                        y1 = 0;
                        x2 = 0;
                        y2 = 0;
                        x3 = 0;
                        y3 = 0;
                        x4 = 0;
                        y4 = 0;
                        edge_detect = true;
                        console.log("开启边缘检测");
                    }
                    else {
                        edge_detect = false;
                        console.log("关闭边缘检测");
                    }
                }
                    break;

                //删除文件反馈
                case 226: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("删除文件成功: " + jsonObj.error);
                    }
                    else {
                        console.log("删除文件成功");
                    }
                }
                    break;

                //设置配置信息反馈
                case 227: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("保存配置信息失败");
                    }
                    else {
                        console.log("保存配置信息成功");
                    }
                }
                    break;

                //读取配置信息反馈
                case 228: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("读取配置信息失败: " + jsonObj.error);
                    }
                    else {
                        console.log("读取配置信息成功");
                    }
                }
                    break;

                //设置A4扫描反馈
                case 229: {
                    if (jsonObj.on != 0) {
                        console.log("开启A4扫描幅面");
                    }
                    else {
                        console.log("关闭A4扫描幅面");
                    }
                }
                    break;

                //证件OCR结果反馈
                case 230: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("证件OCR失败: " + jsonObj.error);
                    }
                    else {
                        console.log("OCR成功:\r\n" + e.data);
                    }
                }
                    break;

                //文档OCR结果反馈
                case 231: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("文档OCR失败: " + jsonObj.error);
                    }
                    else {
                        console.log("文档OCR成功:\r\n" + e.data);
                    }
                }
                    break;

                //发送数据包反馈消息
                case 100: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("发送数据包失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("发送数据包成功\r\n");
                    }
                }
                    break;

                //合成PDF结果反馈消息
                case 101: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("合成PDF文档失败: " + jsonObj.error);
                    }
                    else {
                        console.log("合成PDF文档成功");
                    }
                }
                    break;

                //HTTP上传结果反馈消息
                case 102: {
                    if (jsonObj.hasOwnProperty("error")) {
                        console.log("HTTP上传失败: " + jsonObj.error);
                    }
                    else {
                        //成功
                        console.log("HTTP上传成功: " + jsonObj.status);
                    }
                }
                    break;

                //单张图片结果反馈消息
                case 103: {
                    //将图片名称显示到列表中
                    console.log("图片: " + jsonObj.file);

                    //如果需要显示jpg图片，发送消息: {"id": 22, "file": "jpg名称"}
                    var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file + '\"' + '}';
                    ws_cmd.send(text);
                }
                    break;

                //左、右页图片反馈消息
                case 104: {
                    //将图片名称显示到列表中
                    console.log("左侧图片: " + jsonObj.file1);
                    console.log("右侧图片: " + jsonObj.file2);

                    // //左侧图片
                    var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file1 + '\"' + '}';
                    ws_cmd.send(text);
                    // //右侧图片
                    var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file2 + '\"' + '}';
                    ws_cmd.send(text);
                }
                    break;

                //开启空白页检测，检测到图片均为空白图片
                case 105: {
                    //不存在图片
                }
                    break;

                //单张图片+条码内容 反馈消息
                case 106: {
                    //图片名称为: jsonObj.file
                    //条码内容为: jsonOjb.text(可为空)

                    // console.log("图片: " + jsonObj.file );
                    //
                    // var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file + '\"' + '}';
                    // ws_cmd.send(text);
                    //
                    // //显示条码内容
                    // txtlog.value = "条码内容: " + jsonObj.text + "\r\n" + txtlog.value;
                }
                    break;

                //左右页图片+条码内容 反馈消息
                case 107: {
                    // //左侧图片: jsonObj.file1;
                    // //右侧图片: jsonObj.file2;
                    // //条码内容: jsonObj.text(可为空)
                    //
                    // txtlog.value = "左侧图片: " + jsonObj.file1 + "\r\n" + txtlog.value;
                    // txtlog.value = "右侧图片: " + jsonObj.file2 + "\r\n" + txtlog.value;
                    //
                    // var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file1 + '\"' + '}';
                    // ws_cmd.send(text);
                    //
                    // var text = '{\"id\": 22, \"file\": ' + '\"' + jsonObj.file2 + '\"' + '}';
                    // ws_cmd.send(text);
                    //
                    // txtlog.value = "条码内容: " + jsonObj.text + "\r\n" + txtlog.value;
                }
                    break;

                //开启空白页检测，检测到图片均为空白图片，既为空白图片，也就不会存在条码，
                //但为了预防算法检测BUG，还是需要处理下该消息
                case 108: {
                    //不存在图片
                    //条码内容: jsonObj.text(可为空)
                    console.log("条码内容: " + jsonObj.text);
                }
                    break;

                //设备拔出通知
                case 110: {
                    console.log("设备拔出");
                }
                    break;

                //边缘检测区域通知
                case 111: {
                    x1 = jsonObj.x1;
                    y1 = jsonObj.y1;
                    x2 = jsonObj.x2;
                    y2 = jsonObj.y2;
                    x3 = jsonObj.x3;
                    y3 = jsonObj.y3;
                    x4 = jsonObj.x4;
                    y4 = jsonObj.y4;
                }
                    break;
            }
        }

        ws_cmd.onclose = function () {

            cmd_svc_connect = false;
            console.log("未连接指令服务器");
        }
    }


    function CANCEL_BCR_SELECT() {
        if (is_draw_frame == true) {
            if (bcr_select == true) {
                bcr_select = false;
                //取消条码识别
                ws_cmd.send('{\"id\":21, \"on\": 0}');
            }
        }
    }

    function CANCEL_CLIP_SELECT() {
        if (is_draw_frame == true) {
            if (clip_select == true) {
                clip_select = false;
                //取消裁剪区域
                ws_cmd.send('{\"id\":20, \"on\": 0}');
            }
        }
    }

    function drawRect() {

        if (edge_detect == true) {
            ctx_frame.shadowBlur = 5; // 设置模糊度
            ctx_frame.shadowColor = "rgba(0,1,0,0)"; // 设置阴影颜色
            ctx_frame.strokeStyle = "#00FF00";
            ctx_frame.lineWidth = 2;
            ctx_frame.beginPath();
            ctx_frame.moveTo(x1 * cav_frame.width, y1 * cav_frame.height);
            ctx_frame.lineTo(x2 * cav_frame.width, y2 * cav_frame.height);

            ctx_frame.moveTo(x2 * cav_frame.width, y2 * cav_frame.height);
            ctx_frame.lineTo(x3 * cav_frame.width, y3 * cav_frame.height);

            ctx_frame.moveTo(x3 * cav_frame.width, y3 * cav_frame.height);
            ctx_frame.lineTo(x4 * cav_frame.width, y4 * cav_frame.height);

            ctx_frame.moveTo(x4 * cav_frame.width, y4 * cav_frame.height);
            ctx_frame.lineTo(x1 * cav_frame.width, y1 * cav_frame.height);
            ctx_frame.stroke();
        }

        if (clip_select == true) {
            ctx_frame.shadowBlur = 5; // 设置模糊度
            ctx_frame.shadowColor = "rgba(0,1,0,0)"; // 设置阴影颜色
            ctx_frame.strokeStyle = "#FF0000";
            ctx_frame.lineWidth = 1;
            ctx_frame.beginPath();
            ctx_frame.rect(clip_x, clip_y, clip_width, clip_height);
            ctx_frame.stroke();
        }

        if (bcr_select == true) {
            ctx_frame.shadowBlur = 5; // 设置模糊度
            ctx_frame.shadowColor = "rgba(0,1,0,0)"; // 设置阴影颜色
            ctx_frame.strokeStyle = "#0000FF";
            ctx_frame.lineWidth = 1;
            ctx_frame.beginPath();
            ctx_frame.rect(bcr_x, bcr_y, bcr_width, bcr_height);
            ctx_frame.stroke();
        }
    }


    function H5_OpenDevice() {
        //通知插件服务浏览器的类型，以及视频预览的分辨率
        if (firefox_flag == true) {
            var data = '{\"id\": 24, \"firefox\": 1, \"width\": ' + cav_frame.width + ', \"height\": ' + cav_frame.height + '}';
            ws_cmd.send(data);
        }
        else {
            ws_cmd.send('{\"id\": 24, \"firefox\": 0, \"width\": 0, \"height\": 0}');
        }

        //打开设备，格式：{"id": 0}
        ws_cmd.send('{\"id\": 0}');
    }


    function H5_CloseDevice() {
        //关闭设备，格式: {"id": 3}
        cmd_svc_connect = false;
        ws_cmd.send('{\"id\": 3}');
    }

    function H5_Custom(prefix, number) {
        //自定义名称格式化，格式：{"id": 4, "prefix": "格式前缀", "num": 起始序号}
        var data = '{\"id\": 4, \"prefix\": ' + '\"' + prefix + '\"' + ',' + '\"num\": ' + number + '}';
        ws_cmd.send(data);
    }

    function H5_SavePath(path) {
        //保存路径，格式: {"id": 5, "path": "路径名称"}
        var data = '{\"id\": 5, \"path\": ' + '\"' + path + '\"' + '}';
        ws_cmd.send(data);
    }

    function H5_Size(width, height) {
        //设置宽高，格式: {"id": 6, "width": width, "height": height}
        var data = '{\"id\": 6, \"width\": ' + width + ',' + '\"height\": ' + height + '}';
        ws_cmd.send(data);
    }

    function H5_dpi(dpi) {
        //图片dpi，格式: {"id": 7, "dpi": value}
        var data = '{\"id\": 7, \"dpi\": ' + dpi + '}';
        ws_cmd.send(data);
    }

    function H5_Color(color) {
        //色彩模式，格式: {"id": 8, "clr": value}
        var data = '{\"id\": 8, \"clr\": ' + color + '}';
        ws_cmd.send(data);
    }

    function H5_Rotate(angle) {
        //旋转角度，格式: {"id": 9, "angle": value}
        var data = '{\"id\": 9, \"angle\": ' + angle + '}';
        ws_cmd.send(data);
    }

    function H5_Origin() {
        //原图不裁边和展平，格式: {"id": 10}
        ws_cmd.send('{\"id\": 10}');
    }

    function H5_CutEdge() {
        //单页裁边，格式: {"id": 11}
        ws_cmd.send('{\"id\": 11}');
    }

    /**
     * 书籍展平
     * @param split 0:不拆页 1：拆页
     * @constructor
     */
    function H5_Flatten(split) {
        //书籍展平，格式: {"id": 12, "split": 1/0}
        ws_cmd.send('{\"id\": 12, \"split\": ' + split + '}');
    }

    function H5_BlankDetect(detect) {
        //空白页检测，格式: {"id": 13, "detect": 1/0}
        ws_cmd.send('{\"id\": 13, \"detect\": ' + detect + '}');
    }

    function H5_AutoScan(detectPage) {
        //翻页检测，格式: {"id": 14, "detect": 1/0}
        ws_cmd.send('{\"id\": 14, \"detect\": ' + detectPage + '}');

    }

    function H5_BMP() {
        //BMP类型，格式: {"id": 15}
        ws_cmd.send('{\"id\": 15}');
    }

    function H5_JPG(quality) {
        //JPG类型，格式: {"id": 16, "quality": value}
        var data = '{\"id\": 16, \"quality\": ' + quality + '}';
        ws_cmd.send(data);
    }

    function H5_HTTP_UPLOAD(url, name, file) {
        //http上传，格式: {"id": 17, "url": "url地址", "name": "form表单名称", "file": "本地文件"}

        var data = '{\"id\": 17, \"url\":' + '\"' + url + '\",' + '\"name\":' + '\"' + name + '\",' + '\"file\":' + '\"' + file + '\"' + '}';
        ws_cmd.send(data);
    }

    function H5_AddImage(image) {
        //添加合成PDF文档的图片文件，格式: {"id": 18, "file": "本地图片文件"}
        var data = '{\"id\": 18, \"file\": ' + '\"' + image + '\"' + '}';
        ws_cmd.send(data);
    }

    function H5_MergePDF(pdf) {
        //合成PDF文档，格式: {"id": 19, "pdf": "pdf文档名称"}
        var data = '{\"id\": 19, \"pdf\": ' + '\"' + pdf + '\"' + '}';
        ws_cmd.send(data);
    }

    function H5_Rename() {
        //重命名文件，格式: {"id": 23, "file": "本地文件", "name": "新名称"}
        // var file = document.getElementById("refile");
        // var name = document.getElementById("newname");
        //
        // var data = '{\"id\": 23, \"file\": \"' + file.value + '\", \"name\": \"' + name.value + '\"}';
        // ws_cmd.send(data);
    }

    function H5_EdgeDetect(detectedge) {
        //边缘检测，格式: {"id": 25, "on": 1/0}
        ws_cmd.send('{\"id\": 25, \"detect\": ' + detectedge + '}');
    }

    function H5_Delete() {
        //删除文件，格式: {"id": 26, "file": "本地文件"}
        // var file = document.getElementById("delfile");
        //
        // var data = '{\"id\": 26, \"file\": \"' + file.value + '\"}';
        // ws_cmd.send(data);
    }

    function H5_SaveCfg() {
        //保存配置信息，格式: {"id": 27}
        ws_cmd.send('{\"id\": 27}');
    }

    function H5_ReadCfg() {
        //读取配置信息，格式: {"id": 28}
        ws_cmd.send('{\"id\": 28}');
    }

    function H5_A4(isA4) {
        //设置A4扫描幅面，格式: {"id": 29, "on": 1/0}
        ws_cmd.send('{\"id\": 29, \"on\": ' + isA4 + '}');
    }

    function H5_OCR_Paperwork(ocrimage, ocrtype) {
        //识别证件，格式：{"id": 30, "type": 0/1/2/3, "file": "图片文件名称"}
        var data = '{\"id\": 30, \"type\": ' + ocrtype + ', \"file\": \"' + ocrimage + '\"}';
        ws_cmd.send(data);
    }

    function H5_OCR_Document(ocrimage, ocrdoc) {
        //识别证件，格式：{"id": 31, "file": "图片文件名称", "doc": "文档保存名称"}
        var data = '{\"id\": 31,' + '\"file\": \"' + ocrimage + '\", \"doc\": \"' + ocrdoc + '\"}';
        ws_cmd.send(data);
    }

    function convertZoomTOWH(value) {
        var width = 2592;
        var height = 1944;
        if (value == "1800W") {
            width = 4896;
            height = 3672;
        } else if (value == "1600W") {
            width = 4608;
            height = 3456;
        } else if (value == "1000W") {
            width = 3672;
            height = 2754;
        } else if (value == "800W") {
            width = 3264;
            height = 2448;
        } else if (value == "500W") {
            width = 2592;
            height = 1944;
        } else if (value == "200W") {
            width = 1600;
            height = 1200;
        }
        return {width: width, height: height};
    }

    //从cookie中读取参数，并对设备和Modal中的选项进行设置。
    function readAndSetDeviceParam() {
        var options = ETPlug.readCzurOptionFromCookie();

        H5_A4(options.CZUR_A4);
        var widthAndHeight = convertZoomTOWH(options.CZUR_Zoom);
        H5_Size(widthAndHeight.width, widthAndHeight.height);
        H5_Color(options.CZUR_ClrMode);
        H5_AutoScan(options.CZUR_AutoPageDetect);
        H5_BlankDetect(options.CZUR_BlankPageDetect);
        H5_EdgeDetect(options.CZUR_EdgeDetect);
        processTypeChanged(options.CZUR_ProcessType);
        H5_JPG(options.CZUR_Format_Jpg);

    }

    function processTypeChanged(value) {
        select_type = -1;
        console.log("设置处理类型：" + value);
        switch (value) {
            case "clip":
                //当前没有绘制框选区域，需要切换为原图模式
                ws_cmd.send('{\"id\": 10}');
                select_type = 0;
                break;
            case "src":
                CANCEL_CLIP_SELECT();
                H5_Origin();
                break;
            case "curve_1":
                CANCEL_CLIP_SELECT();
                H5_Flatten(1);
                break;
            case "curve_0":
                CANCEL_CLIP_SELECT();
                H5_Flatten(0);
                break;
            case "single":
                CANCEL_CLIP_SELECT();
                H5_CutEdge();
                break;
        }
    }
    function cookie(name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie =cookies[i].replace(/(^\s*)|(\s*$)/g, "");
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

    }
    return {
        initCzur: function (vedioFrame, fetchImageCallback) {
            cav_frame = vedioFrame;
            /* cav_frame = document.getElementById(vedioFrame);  */
            ctx_frame = cav_frame.getContext("2d");
            frame_Data = ctx_frame.createImageData(cav_frame.width, cav_frame.height);
            cav_frame.onmousedown = function (e) {
                if (is_draw_frame == true) {
                    switch (select_type) {
                        case 0: {
                            if (clip_select) {
                                break;
                            }

                            down_flag = true;
                            clip_x = e.offsetX;
                            clip_y = e.offsetY;
                        }
                            break;

                        case 1: {
                            if (bcr_select) {
                                break;
                            }

                            down_flag = true;
                            bcr_x = e.offsetX;
                            bcr_y = e.offsetY;
                        }
                    }
                }
            }

            cav_frame.onmouseup = function (e) {
                if (is_draw_frame == true) {
                    if (down_flag == false) {
                        return;
                    }

                    down_flag = false;

                    var data;
                    switch (select_type) {
                        case 0: {

                            clip_select = true;
                            clip_width = e.offsetX - clip_x;
                            clip_height = e.offsetY - clip_y;

                            data = '{\"id\": 20, \"on\": 1, \"width\": ' + cav_frame.width + ',\"height\":' + cav_frame.height + ',\"x\": ' + clip_x + ',\"y\":' + clip_y + ',\"cx\":' + clip_width + ',\"cy\":' + clip_height + '}';
                            ws_cmd.send(data);
                        }
                            break;

                        case 1: {

                            bcr_select = true;
                            bcr_width = e.offsetX - bcr_x;
                            bcr_height = e.offsetY - bcr_y;

                            data = '{\"id\": 21, \"on\": 1, \"width\": ' + cav_frame.width + ',\"height\":' + cav_frame.height + ',\"x\": ' + bcr_x + ',\"y\":' + bcr_y + ',\"cx\":' + bcr_width + ',\"cy\":' + bcr_height + '}';
                            ws_cmd.send(data);
                        }
                    }
                }
            }

            cav_frame.onmousemove = function (e) {
                if (is_draw_frame == true) {
                    if (down_flag == false) {
                        return;
                    }

                    if (firefox_flag == true) {
                        ctx_frame.putImageData(frame_Data, 0, 0);
                    }
                    else {
                        ctx_frame.drawImage(img_frame, 0, 0, cav_frame.width, cav_frame.height);
                    }

                    switch (select_type) {
                        case 0: {
                            ctx_frame.shadowBlur = 5;
                            ctx_frame.shadowColor = "rgba(0,0,0,0.5)";
                            ctx_frame.strokeStyle = "#FF0000";
                            ctx_frame.lineWidth = 1;
                            ctx_frame.beginPath();
                            ctx_frame.rect(clip_x, clip_y, e.offsetX - clip_x, e.offsetY - clip_y);
                            ctx_frame.stroke();
                        }
                            break;

                        case 1: {
                            ctx_frame.shadowBlur = 5;
                            ctx_frame.shadowColor = "rgba(0,0,0,0.5)";
                            ctx_frame.strokeStyle = "#0000ff";
                            ctx_frame.lineWidth = 1;
                            ctx_frame.beginPath();
                            ctx_frame.rect(bcr_x, bcr_y, e.offsetX - bcr_x, e.offsetY - bcr_y);
                            ctx_frame.stroke();
                        }
                            break;
                    }
                    drawRect();
                }
            }
            fetchImageCallbackFunc = fetchImageCallback;
            connect_cmd_svc();
            connect_data_svc();
            device_is_open = true;
        },
        closeDevice: function () {
            if (device_is_open) {
                H5_CloseDevice();
                device_is_open = false;
            }
        },
        openDevice: function () {
            device_is_open = true;
            H5_OpenDevice();      

        },
        deviceIsOpen: function () {
            return device_is_open;
        },
        capture: function () {
            //拍照，格式: {"id": 1}
            ws_cmd.send('{\"id\": 1}');
        },
        //取消区域选择
        cancelClipSelect: function () {
            CANCEL_CLIP_SELECT();
        },
        readCzurOptionFromCookie: function () {
            var CZUR_A4 = cookie('CZUR_A4') == null ? 0 : cookie('CZUR_A4');
            var CZUR_Zoom = cookie('CZUR_Zoom') == null ? '500W' : cookie('CZUR_Zoom');
            var CZUR_ClrMode = cookie('CZUR_ClrMode') == null ? 0 : cookie('CZUR_ClrMode');
            //自动翻页检测
            var CZUR_AutoPageDetect = cookie('CZUR_AutoPageDetect') == null ? 0 : cookie('CZUR_AutoPageDetect');
            //空白页检测
            var CZUR_BlankPageDetect = cookie('CZUR_BlankPageDetect') == null ? 0 : cookie('CZUR_BlankPageDetect');
            //边缘检测
            var CZUR_EdgeDetect = cookie('CZUR_EdgeDetect') == null ? 0 : cookie('CZUR_EdgeDetect');
            //图片处理类型
            var CZUR_ProcessType = cookie('CZUR_ProcessType') == null ? 'src' : cookie('CZUR_ProcessType');
            //图片质量百分比
            var CZUR_Format_Jpg = cookie('CZUR_Format_Jpg') == null ? 70 : cookie('CZUR_Format_Jpg');
            var CZUR_SavePath = cookie('CZUR_SavePath') == null ? 0 : cookie('CZUR_SavePath');
            return {
                CZUR_A4: CZUR_A4,
                CZUR_Zoom: CZUR_Zoom,
                CZUR_ClrMode: CZUR_ClrMode,
                CZUR_AutoPageDetect: CZUR_AutoPageDetect,
                CZUR_BlankPageDetect: CZUR_BlankPageDetect,
                CZUR_EdgeDetect: CZUR_EdgeDetect,
                CZUR_ProcessType: CZUR_ProcessType,
                CZUR_Format_Jpg: CZUR_Format_Jpg,
                CZUR_SavePath:CZUR_SavePath
            }
        },
        setCzurOption: function (type, value) {
            if (type == "CZUR_A4") {
                H5_A4(value);
                cookie('CZUR_A4', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_Zoom") {
                var widthAndHeight = convertZoomTOWH(value);
                H5_Size(widthAndHeight.width, widthAndHeight.height);
                cookie('CZUR_Zoom', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_ClrMode") {
                H5_Color(value);
                cookie('CZUR_ClrMode', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_AutoPageDetect") {
                H5_AutoScan(value);
                cookie('CZUR_AutoPageDetect', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_BlankPageDetect") {
                H5_BlankDetect(value);
                cookie('CZUR_BlankPageDetect', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_EdgeDetect") {
                H5_EdgeDetect(value);
                cookie('CZUR_EdgeDetect', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_Format_Jpg") {
                H5_JPG(value);
                cookie('CZUR_Format_Jpg', value, {expires: 3650, path: '/'});
            } else if (type == "CZUR_ProcessType") {
                processTypeChanged(value);
                cookie('CZUR_ProcessType', value, {expires: 3650, path: '/'});
            }else if(type == "CZUR_SavePath"){
                H5_SavePath(value);
                cookie('CZUR_SavePath', value, {expires: 3650, path: '/'});
            }
        }
    }
}();
export {ETPlug};
