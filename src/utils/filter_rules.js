/*
 * @Description: <page></page>页面
 * @Author: Simon Shen
 * @Date: 2021-01-05 11:23:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-05 15:02:14
 */
var mobileReg = /^1[3456789]\d{9}$/
var isvalidateMobile = (rule, value, callback) => {
    if (!value) {
        return callback();
    }else if (!mobileReg.test(value)) {
        return callback(new Error('请输入正确手机号!'));
    } else {
        return callback();
    }

};

var validatePass = (rule, value, callback) => {
    //判断输入是否全为空格
    value = value + '';
    if(!value.trim()) {
        callback(new Error("不能输入全为空格"));
    }else {
        callback();
    }
}

var validateArray = (rule,value,callback) => {
    //判断是否是空数组
    if(Object.prototype.toString.call(value) == '[object Array]' && value.length == 0) {
        callback(new Error("该输入项为必填项"));
    }else {
        callback();
    }
}


var isvalidateDecimal = (rule,value,callback) => {
    //判断是否是空数组
    if(isNaN(Number(value))) {
        callback(new Error("该项输入必须为数字"));
    }else {
        callback();
    }
}


const filter_rules = function (item) {
    let rules = [];
    let trigger = item.trigger ? item.trigger : 'blur';
    if (item.required) {
        rules.push({required: true, message: '该输入项为必填项!', trigger: trigger});
    }
    if (item.required) {
        rules.push({validator: validateArray, trigger: trigger});
    }
    if (item.maxLength) {
        rules.push({min: 1, max: item.maxLength, message: '最多输入' + item.maxLength + '个字符!', trigger: trigger})
    }
    if (item.min && item.max) {
        rules.push({
            min: item.min,
            max: item.max,
            message: '字符长度在' + item.min + '至' + item.max + '之间!',
            trigger: trigger
        })
    }
    if(item.pattern){
        rules.push({
            pattern: item.pattern,
            message: item.message,
            trigger: trigger
        })
    }
    if (item.type) {
        let type = item.type;
        switch (type) {
            case 'email':
                rules.push({type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'});
                break;
            case 'mobile':
                rules.push({validator: isvalidateMobile, message: '请输入正确手机号!',trigger: 'blur'});
                break;
            case 'number':
                rules.push({type: 'number', message: '该项输入必须为数字', trigger: 'blur'});
                break;
            case 'decimalNumber':
                rules.push({validator: isvalidateDecimal, trigger: 'blur'});
                break;
            default:
                rules.push({});
                break;
        }
    }
    if (item.required) {
    rules.push({validator: validatePass, trigger: trigger});
    }


    return rules;
};
export default filter_rules;
