/*
 * @Description: 身份证相关的通用函数。
 * @Author: Simon Shen
 * @Date: 2020-12-29 09:32:35
 * @LastEditors: Simon Shen
 * @LastEditTime: 2021-01-07 10:46:46
 */
export default {
    idValid: function (ID) {
        var info = {};
        debugger
        if(typeof ID !== 'string') return '非法字符串';
        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        var birthday = ID.substr(6, 4) + '-' + Number(ID.substr(10, 2)) + '-' + Number(ID.substr(12, 2));
        var formatBirthDay = ID.substr(6, 4) + '-' + ID.substr(10, 2) + '-' + ID.substr(12, 2);
        var d = new Date(birthday);
        var newBirthday = d.getFullYear() + '-' + Number(d.getMonth() + 1) + '-' + Number(d.getDate());
        var currentTime = new Date().getTime();
        var time = d.getTime();
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var sum = 0, i, residue;
    
        if(!/^\d{17}(\d|x)$/i.test(ID)){
            console.log('非法身份证');
            return;
        }
        if(city[ID.substr(0,2)] === undefined){
            console.log("非法地区");
            return;
        }
        if(time >= currentTime || birthday !== newBirthday){
            console.log('非法生日');
            return;
        }
        for(i=0; i<17; i++) {
            sum += ID.substr(i, 1) * arrInt[i];
        }
        residue = arrCh[sum % 11];
        if (residue !== ID.substr(17, 1)){
            console.log('最后一位校验失败，非法身份证');
            return;
        }
        info.city = city[ID.substr(0,2)];
        info.birthDay = formatBirthDay;
        info.sex = ID.substr(16,1)%2?" 男":"女";
        return info;
    }
};