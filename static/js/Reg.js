//校验规则

  const required={ required: true, message: '此项为必填项', trigger: 'blur' };
  const limit=function(a,b){
    return { min: a, max: b, message: `长度在 ${a}到 ${b}个字符`, trigger: 'change' };
  };
  // const checkPhone=function(rule, value, callback) {
  //   if (!value) {
  //     return callback(new Error('手机号不能为空'));
  //   } else {
  //     const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  //     console.log(reg.test(value));
  //     if (reg.test(value)) {
  //       callback();
  //     } else {
  //       return callback(new Error('请输入正确的手机号'));
  //     }
  //   }
  // };
  // const checkMobile={validator: checkPhone, trigger: 'blur'};
export {required,limit}
