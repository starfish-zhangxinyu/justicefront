export default {
    //codis分析导入
    "importCodis": '/api/dna-codis/v1/import-codis-result',
    //codis分析导入
    "disposeImportCodis": '/api/dna-codis/v1/dispose-import',
    //获取符合条件的最终实验结果
    "finalCodis": '/api/dna-codis/v1/list',
    //获取当前实验结果
    "currentCodis": '/api/dna-codis/v1/dna-marker-calc-list',
    //获取历史记录
    "historyCodis": '/api/dna-codis/v1/dna-result-list/history',
    //重新计算
    "recount": '/api/dna-codis/v1/re-calc/dna-result',
    //设置最终实验结果
    "updateCodis": '/api/dna-codis/v1/update/last-dna-result',
    //合并基因座
    "mergeCodis": '/api/dna-codis/v1/merge/loca-marker',
    //保存实验结果
    'dnaResult': '/api/dna-codis/v1/save/dna-result',
    //完成检测
    'completeDetection': '/api/dna-codis/v1/complete/detection',
    //查询dna样本
    'dnaSample': '/api/dna-sample/v1/dna-samples',
    //修改单个基因座的计算公式
    'updateFormula':'/api/dna-codis/v1/update-calc-data'
}