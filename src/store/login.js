const state = {
    isLogin: '',  //初始化一个colects数组,
    userObj: {},
    isLoginType: false,
    headerTitle:"我的面板",
    orgId:"1",//机构ID
    isMobile: false
};
const getters = {   //实时监听state值的变化(最新状态)
    watchLoginState(state) {
        return state.isLogin;
    },
};
const mutations = {
    changeMobile(state, value) {
        //是否是移动端
        state.isMobile = value;
    },
    changeLoginState(state, value) { //如何变化isLogin
        state.isLogin = value;
    },
    /*
    * 更改用户登陆状态
    */
    loginChange(state, res) {
        if (res) {
            state.isLoginType = true;
            state.userObj = res;
        } else {
            state.isLoginType = false;
            state.userObj = {};
        }
    },
    headerTitleChange(state, res) {
        state.headerTitle= res;
    },
    orgIdChange(state, res){
        state.orgId=res;
    }
};
const actions = {
    handleChangeMobile(context, val) {
        context.commit('changeMobile', val);
    },
    changeLogin(context, val) { //触发mutations里面的changeLoginState ,传入数据形参val 对应到value
        context.commit('changeLoginState', val);
    },
    /*
    * 更改用户登陆状态
    */
    loginChange({commit},res) {
        commit('loginChange', res);
    },
    headerTitleChange({commit},res) {
        commit('headerTitleChange', res);
    },
    orgIdChange({commit},res){
        commit('orgIdChange', res);
    }
};
export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    getters,
    state,
    mutations,
    actions
}
