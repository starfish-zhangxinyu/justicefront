const state = {
   barcodeBaseUrl:"",//打印地址
   
};
const getters = {
    getBarcodeUrl(state) {
        return state.barcodeBaseUrl;
    },
};
const mutations = {
    barcodeBaseUrlChange(state, value){
        state.barcodeBaseUrl = `${value}/api/barcode/v1/print/pdf`;
    }
}

export default {
    namespaced: true,
    getters,
    mutations,
    state,
}
