export function debounce(fn, time, immediate) { //immediate:表示是否立即执行，传入布尔值
    let timer = null;
    return function() {
        if(timer) {
            clearTimeout(timer)
        }
        if(immediate) {
            if(!timer) {
                fn.call(this);
            }
            timer = setTimeout(() => {
                timer = null
            }, time)
        }else {
            // fn.call(this);
            timer = setTimeout(() => {
                fn.apply(this)
            },time)
        }

    }
}


