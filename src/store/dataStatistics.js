const state = {
    caseQuantityCaseIds : null,
    incomeCaseIds: null
};
const getters = {   //实时监听state值的变化(最新状态)
    getCaseQuantityCaseIds(state) {
        return state.caseQuantityCaseIds;
    },
    getIncomeCaseIds(state) {
        return state.incomeCaseIds;
    },
};
const mutations = {
    changeCaseQuantityCaseIds(state, value) {
        state.caseQuantityCaseIds = value;
        window.sessionStorage.setItem('caseQuantityCaseIds', value)
    },
    changeIncomeCaseIds(state, value) {
        state.incomeCaseIds = value;
        window.sessionStorage.setItem('incomeCaseIds', value)
    },
};
const actions = {

};
export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    getters,
    state,
    mutations,
    actions
}