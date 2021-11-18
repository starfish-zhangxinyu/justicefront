const state = {
    status: 'REGISTER',
    basicMsg: {
        authHistoryList: [],
        authenticatorList: [],
        professionCategory: {type: {}},
        entrustInfo: {contact: {}, entrustingUnit: {}, statisticsType: {}},
        authenticator: {}
    },//委托信息
    anthenticatedTargetMsg: {authenticatedVehicleList: [], authenticatedPersonList: [], authenticatedOtherList: []},//鉴定对象
    caSampleMsg: {caSampleList: []},//检材样本
    dnaSampleMsg: {dnaSampleList: []},//物证样本
    poisonSampleMsg: {poSampleList: []},//毒物样本
    entrustingAuthItem: {entrustingMatterList: []},//委托事项
    CNASItem: {CNASItemList: []},//cnas事项

    chargeItem: {chargingItemList: []},//收费项目
    materialNormal: {inspectionMaterialListNormal: [], inspectionMaterialListWaitingSend: []},//补充材料
};
const getters = {   //实时监听state值的变化(最新状态)
    watchAcceptField(state) {
        return state.acceptField;
    },
    watchStatus(state) {
        return state.status;
    },
    watchBasicMsg(state) {//委托信息
        return state.basicMsg;
    },
    watchCaSampleMsg(state) {//检材样本
        return state.caSampleMsg;
    },
    watchDnaSampleMsg(state) {//物证样本
        return state.dnaSampleMsg;
    },
    watchPoisonSampleMsg(state) {//毒物样本
        return state.poisonSampleMsg;
    },
    watchAnthenticatedTargetMsg(state) {//鉴定对象
        return state.anthenticatedTargetMsg;
    },
    watchEntrustingAuthItem(state) {//委托事项
        return state.entrustingAuthItem;
    },
    watchCNASItem(state) {//cnas事项
        return state.CNASItem;
    },
    watchChargeItem(state) {//收费项目
        return state.chargeItem;
    },
    watchMaterialNormal(state) {//补充材料
        return state.materialNormal;
    },

};
const mutations = {
    changeAcceptField(state, value) {
        state.acceptField = value;
    },
    changeBasicMsg(state, value) {

        var data = JSON.parse(JSON.stringify(value));
        state.basicMsg = data;
    },
    changeCaSampleMsg(state, value) {
        state.caSampleMsg = value;
    },
    changeDnaSampleMsg(state, value) {
        state.dnaSampleMsg = value;
    },
    changePoisonSampleMsg(state, value) {
        state.poisonSampleMsg = value;
    },
    changeAnthenticatedTargetMsg(state, value) {
        state.anthenticatedTargetMsg = value;
    },
    changeEntrustingAuthItem(state, value) {
        state.entrustingAuthItem = value;
    },
    changeMatterTargetList(state, json) {
        var index1 = json.index1;
        var index2 = json.index2;
        var value = json.value;
        state.entrustingAuthItem.entrustingMatterList[index1].entrustingMatterTargetList.splice(index2, 1, value);
    },
    deleteMatterTargetList(state, json) {
        var index1 = json.index1;
        var index2 = json.index2;
        state.entrustingAuthItem.entrustingMatterList[index1].entrustingMatterTargetList.splice(index2, 1);
    },
    changeChargeItem(state, value) {
        state.chargeItem = value;
    },
    changeMaterialNormal(state, value) {
        state.materialNormal = value;
    },
    changePageStatus(state, value) {
        state.status = value;
    },
    changeCNASItem(state, value) {
        state.CNASItem = value
    }
};
const actions = {
    changeField(context, val) { //触发mutations里面的changeAcceptField ,传入数据形参val 对应到value
        context.commit('changeAcceptField', val);
    },
    changeBasic(context, val) {
        context.commit('changeBasicMsg', val);
    },
    changeCaSample(context, val) {
        context.commit('changeCaSampleMsg', val);
    },
    changeDnaSample(context, val) {
        context.commit('changeDnaSampleMsg', val);
    },
    changePoisonSample(context, val) {
        context.commit('changePoisonSampleMsg', val);
    },
    changeAnthenticatedTarget(context, val) {
        context.commit('changeAnthenticatedTargetMsg', val);
    },
    changeAuthItem(context, val) {
        context.commit('changeEntrustingAuthItem', val);
    },
    changeMatterTarget(context, val) {
        context.commit('changeMatterTargetList', val);
    },
    deleteMatterTarget(context, val) {
        context.commit('deleteMatterTargetList', val);
    },
    changeCharge(context, val) {
        context.commit('changeChargeItem', val);
    },
    changeMaterialNormal(context, val) {
        context.commit('changeMaterialNormal', val);
    },
    changeStatus(context, val) {
        context.commit('changePageStatus', val);
    },
    changeCNAS(context, val) {
        context.commit('changeCNASItem', val);
    }

};
export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    getters,
    state,
    mutations,
    actions
}