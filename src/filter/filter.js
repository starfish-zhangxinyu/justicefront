import Vue from 'vue'
Vue.filter('replaceSubTag', function (value) {
    if (value) {
        return value.replace(new RegExp("@", 'gm'), '<sub>').replace(new RegExp("&", 'gm'), '<span>').replace(new RegExp("#", 'gm'), '</span>');
    } else {
        return value;
    }
});

Vue.filter('replaceSupTag', function (value) {
    if (value) {
        return value.replace(new RegExp("&lt;", 'gm'), '<').replace(new RegExp("&gt;", 'gm'), '>');
    } else {
        return value;
    }
});

Vue.filter('aa', function (value) {
    return 'aa过滤器'+value;
});