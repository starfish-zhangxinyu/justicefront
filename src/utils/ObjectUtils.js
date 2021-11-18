/**
 * 把source中和dest中属性相同
 * 
 * @param {*} obj1 
 * @param {*} obj2 
 */
function copySameProperty(dest, source) {
    if (!dest || !source) return;
    var oldJson = JSON.parse(JSON.stringify(dest));
    var json = {};
    var json2 = Object.assign(dest, source); //合并的对象；
    for (item in json2) {
        for (v in oldJson) {
            if (item === v) {
                json[item] = json2[item];
            }
        }
    }
    return json;
}