export default {
    //专业类别
    "profession": '/api/profession-category/v1/profession-categorys',
    //收费项目
    'chargeItem': '/api/charging-item/v1/charging-items',
    //标准
    "standard": '/api/standard/v1/standards',
    //修改检验标准状态
    'changeStandardStatus':'/api/standard/v1/standard-status',
    //鉴定材料
    "auth": '/api/auth-material/v1/auth-materials',
    //委托事项
    "entrustingMatter": '/api/entrusting-matter/v1/entrusting-matters',
    //委托事项（以细项为单位）
    "entrustingMatterList": '/api/entrusting-matter/v1/entrusting-matters/list',
    //检验设备
    "instrument": '/api/instrument/v1/instruments',
    //修改检验设备状态
    "changeInstrumentStatus": '/api/instrument/v1/instruments-status',
    "cnas": '/api/cnas-item/v1/cnas-items',
    //收费类型
    "chargingType": '/api/charging-type/v1/charging-types',
    //毒物管理
    "poison": '/api/po-poison/v1/poisons',
    //毒物分类
    "poisonCategory": '/api/po-poison/v1/poisons/category',
    //基因座
    "dnaMarker": "/api/dna-base-kit/v1/dna-base-markers",
    //试剂盒
    "dnaKit": "/api/dna-base-kit/v1/dna-base-kits",
    //基因频率
    "geneFreq": "/api/dna-base-gene-frequency/v1/dna-base-gene-frequencys",
    //基因频率类型表
    "geneFreqType": "/api/dna-base-gene-frequency/v1/frequencys-type",
    //检验数据类型
    "authDataGroup": "/api/base-auth-data-item-group/v1/auth-data-item-groups",
    //检验数据类型下的检验数据
    'authData': '/api/auth-data/v1/auth-datas',
    //检验数据
    "authDataItem": "/api/base-auth-data-item/v1/auth-data-items",
    //案件统计类别
    "caseStatType": "/api/case-stat-type/v1/case-stat-types",
    //酒精参数
    "alcoholParam": "/api/alcohol-param/v1/alcohol-params",

    //获取所有的样本关系
    'dnaRelationListApi': '/api/dna-sample-relation/v1/list',
    //保存样本关系
    "dnaRelationSaveApi": "/api/dna-sample-relation/v1/save",
    //获取物证样本关系
    "dnaRelationDetailApi": "/api/dna-sample-relation/v1/get-relation",//{id}
    //删除样本关系
    "dnaRelationDelApi": "/api/dna-sample-relation/v1/delete",//{id}
    //表格排序
    "tablesSortApi": "/api/dynamic-table/v1/dynamic-tables/sort",//{id}
}