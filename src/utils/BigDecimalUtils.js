var bigdecimal = require('big.js');

export default {
   getAvg : function(arr,point){
       var sum = new bigdecimal.Big("0");
       arr.forEach((item) => {
           var itemDec = new bigdecimal.Big(item.toString())
           sum = sum.plus(itemDec);
       })
       var length = new bigdecimal.Big(arr.length.toString());
       var avg = sum.div(length);
       if(point && avg != 0){
           avg = avg.toFixed(point)
       }
       return avg.toString();
   },
   getRd : function(x1,x2,point){
       var rd = new bigdecimal.Big("0");
       var vx1 = new bigdecimal.Big(x1.toString());
       var vx2 = new bigdecimal.Big(x2.toString());
       if (Number(x1) > 0 || Number(x2) > 0){
           var subAbs = new bigdecimal.Big(Math.abs(vx1.minus(vx2).times(new bigdecimal.Big('100'))).toString());
           var avg = (vx1.plus(vx2)).div(new bigdecimal.Big('2'));
           rd = subAbs.div(avg);
       }
       if (point && rd != 0){
           rd = rd.toFixed(point);
       }else {
           rd = 0;
       }
       return rd.toString();
   },
   divide:function(x1,x2,point) {
       var vx1 = new bigdecimal.Big(x1.toString());
       var vx2 = new bigdecimal.Big(x2.toString());
       let res = 0;
       if(vx2 != 0) {
           res =  vx1.div(vx2);
       }else {
           res = 0;
       }
       if(point < 0) {
           point = 0;
       }
       res = res.toFixed(point);
       return res.toString();
   },
   getContent:function(avg, a, b, point) {
       var avg = new bigdecimal.Big(avg.toString());
       var a = new bigdecimal.Big(a.toString());
       var b = new bigdecimal.Big(b.toString());
       let res = 0;
       if(b !=0) {
           res = (avg.minus(a) ).div(b);
       }
       if(point < 0) {
           point = 0;
       }
       res = res.toFixed(point);
       return res.toString();
   },
    //减法
    minus:function (v1, v2) {
       if(v2 == null) {
           return
       }
       console.log(v1, v2)
        if(typeof v1 == 'string' && v1.indexOf(',') > -1) {
            v1 = v1.replace(',','')
        }
        if(typeof v2 == 'string' && v2.indexOf('.') > -1) {
            v2.replace(',','')
        }
        let a = new bigdecimal.Big(v1.toString());
        let b = new bigdecimal.Big(v2.toString());

        let res = a.minus(b);
        return res.toString();
    },
    //乘法
    times: function(v1, v2) {
        if(v2 == null) {
            return
        }
        let a = new bigdecimal.Big(v1.toString());
        let b = new bigdecimal.Big(v2.toString());
        let res = a.times(b);
        return res.toString();
    },
    //加法
    plus: function(v1, v2) {
        if(v2 == null) {
            return
        }
        let a = new bigdecimal.Big(v1.toString());
        let b = new bigdecimal.Big(v2.toString());
        let res = a.plus(b);
        return res.toString();
    },
}