/*基础数据路由*/

//专业类别
import MajorCategory from '@/page/basic-data/major-category/MainPage.vue'
import MajorCategoryList from '@/page/basic-data/major-category/List.vue'
import MajorCategoryForm from '@/page/basic-data/major-category/Form.vue'
//收费项目
import PayItems from '@/page/basic-data/pay-items/MainPage.vue'
import PayItemsList from '@/page/basic-data/pay-items/List.vue'
import PayItemsForm from '@/page/basic-data/pay-items/Form.vue'
import PayItemsImport from '@/page/basic-data/pay-items/Import.vue'
//委托事项
import EntrustingMatters from '@/page/basic-data/entrusting-matters/MainPage.vue'
import EntrustingMattersList from '@/page/basic-data/entrusting-matters/List.vue'
import EntrustingMattersForm from '@/page/basic-data/entrusting-matters/Form.vue'
import EntrustingMattersImport from '@/page/basic-data/entrusting-matters/Import.vue'
//鉴定材料
import MaterialIdentification from '@/page/basic-data/material-identification/MainPage.vue'
import MaterialIdentificationList from '@/page/basic-data/material-identification/List.vue'
import MaterialIdentificationForm from '@/page/basic-data/material-identification/Form.vue'
//检验设备
import InspectionEquipment from '@/page/basic-data/inspection-equipment/MainPage.vue'
import InspectionEquipmentList from '@/page/basic-data/inspection-equipment/List.vue'
import InspectionEquipmentForm from '@/page/basic-data/inspection-equipment/Form.vue'
import InspectionEquipmentImport from '@/page/basic-data/inspection-equipment/Import.vue'
//检验标准
import InspectionStandard from '@/page/basic-data/inspection-standard/MainPage.vue'
import InspectionStandardList from '@/page/basic-data/inspection-standard/List.vue'
import InspectionStandardForm from '@/page/basic-data/inspection-standard/Form.vue'
import InspectionStandardImport from '@/page/basic-data/inspection-standard/Import.vue'
//cnas列表
import Cnas from '@/page/basic-data/cnas/MainPage.vue'
import CnasList from '@/page/basic-data/cnas/List.vue'
import CnasForm from '@/page/basic-data/cnas/Form.vue'
//收费类型
import Chargingtype from '@/page/basic-data/Chargingtype.vue'
//毒物管理
import PoisonPage from '@/page/basic-data/poison/PoisonPage.vue'
import PoisonList from "@/page/basic-data/poison/PoisonList.vue"
import PoisonForm from "@/page/basic-data/poison/PoisonForm.vue"
import PoisonImport from "@/page/basic-data/poison/Import.vue"

//基因座列表
import DnaMarker from '@/page/basic-data/gene-freq/dna-marker/MainPage.vue'
import DnaMarkerList from '@/page/basic-data/gene-freq/dna-marker/List.vue'
//试剂盒列表
import DnaKit from '@/page/basic-data/gene-freq/dna-kit/MainPage.vue'
import DnaKitList from '@/page/basic-data/gene-freq/dna-kit/List.vue'
import DnaKitForm from '@/page/basic-data/gene-freq/dna-kit/Form.vue'
import LocusSortForm from '@/page/basic-data/gene-freq/dna-kit/LocusSortForm.vue'
//基因频率列表
import GeneFreq from '@/page/basic-data/gene-freq/gene-freq/MainPage.vue'
import GeneFreqList from '@/page/basic-data/gene-freq/gene-freq/List.vue'
import GeneFreqForm from '@/page/basic-data/gene-freq/gene-freq/Form.vue'
import GeneFreqImport from '@/page/basic-data/gene-freq/gene-freq/Import.vue'
//案件统计类型列表
import CaseStatType from '@/page/basic-data/statistics-category/MainPage.vue'
import CaseStatTypeList from '@/page/basic-data/statistics-category/List.vue'
import CaseStatTypeForm from '@/page/basic-data/statistics-category/Form.vue'
//检验数据管理
import AuthDataItemPage from '@/page/basic-data/authDataItem/AuthDataItemPage.vue'
import AuthDataGroupForm from '@/page/basic-data/authDataItem/AuthDataGroupForm.vue'
import AuthDataGroupList from '@/page/basic-data/authDataItem/AuthDataGroupList.vue'
import AuthDataItemForm from '@/page/basic-data/authDataItem/AuthDataItemForm.vue'
import AuthDataItemList from '@/page/basic-data/authDataItem/AuthDataItemList.vue'
import AuthDataItemImport from '@/page/basic-data/authDataItem/AuthDataItemImport.vue'
import AuthDataGroupImport from '@/page/basic-data/authDataItem/AuthDataGroupImport.vue'
//酒精参数
import AlcoholParamForm from '@/page/basic-data/alcoholParam/AlcoholParamForm.vue'

//物证样本关系管理
import MESMItem from '@/page/basic-data/MaterialEvidenceSample/MainPage.vue'
import MESMIList from '@/page/basic-data/MaterialEvidenceSample/List.vue'
import MESMIForm from '@/page/basic-data/MaterialEvidenceSample/Form.vue'
export default [
    // 专业类别
    {
        path: '/auth/professioncategories',
        name: 'MajorCategory',
        components: {childRoute: MajorCategory},
        children: [
            {
                path: '/auth/professioncategories/list',
                components: {listPage: MajorCategoryList},
                name: 'MajorCategoryList'
            },
            {
                path: '/auth/professioncategories/form',
                components: {listPage: MajorCategoryForm},
                name: 'MajorCategoryForm'
            },
        ],
        meta: {}
    },
    //物证样本关系管理
    {
    path: '/auth/MaterialEvidenceSample',
    name: 'MESMItem',
    components: {childRoute: MESMItem},
    children: [
        {path: '/auth/MaterialEvidenceSample/list', components: {listPage: MESMIList}, name: 'MESMIList'},
        {path: '/auth/MaterialEvidenceSample/form', components: {listPage: MESMIForm}, name: 'MESMIForm'},
    ],
    meta: {}
    },

    //收费项目
    {
        path: '/auth/chargingitems',
        name: 'PayItems',
        components: {childRoute: PayItems},
        children: [
            {path: '/auth/chargingitems/list', components: {listPage: PayItemsList}, name: 'PayItemsList'},
            {path: '/auth/chargingitems/form', components: {listPage: PayItemsForm}, name: 'PayItemsForm'},
            {path: '/auth/chargingitems/import', components: {listPage: PayItemsImport}, name: 'PayItemsImport'},
        ],
        meta: {}
    },
    //委托事项
    {
        path: '/auth/entrustingmatters',
        name: 'EntrustingMatters',
        components: {childRoute: EntrustingMatters},
        meta: {},
        children: [
            {
                path: '/auth/entrustingmatters/list',
                components: {listPage: EntrustingMattersList},
                name: 'EntrustingMattersList'
            },
            {
                path: '/auth/entrustingmatters/form',
                components: {listPage: EntrustingMattersForm},
                name: 'EntrustingMattersForm'
            },
            {
                path: '/auth/entrustingmatters/import',
                components: {listPage: EntrustingMattersImport},
                name: 'EntrustingMattersImport'
            },
        ],
    },
    //鉴定材料
    {
        path: '/auth/inspectionmaterials',
        name: 'MaterialIdentification',
        components: {childRoute: MaterialIdentification},
        meta: {},
        children: [
            {
                path: '/auth/inspectionmaterials/list',
                components: {listPage: MaterialIdentificationList},
                name: 'MaterialIdentificationList'
            },
            {
                path: '/auth/inspectionmaterials/form',
                components: {listPage: MaterialIdentificationForm},
                name: 'MaterialIdentificationForm'
            },
        ],
    },
    //检验设备
    {
        path: '/auth/instruments',
        name: 'InspectionEquipment',
        components: {childRoute: InspectionEquipment},
        meta: {},
        children: [
            {
                path: '/auth/instruments/list',
                components: {listPage: InspectionEquipmentList},
                name: 'InspectionEquipmentList',
                meta:{
                    keepAlive:true
                }
            },
            {
                path: '/auth/instruments/form',
                components: {listPage: InspectionEquipmentForm},
                name: 'InspectionEquipmentForm'
            },
            {
                path: '/auth/instruments/import',
                components: {listPage: InspectionEquipmentImport},
                name: 'InspectionEquipmentImport'
            },
        ],
    },
    //检验标准
    {
        path: '/auth/standard',
        name: 'InspectionStandard',
        components: {childRoute: InspectionStandard},
        meta: {},
        children: [
            {
                path: '/auth/standard/list',
                components: {listPage: InspectionStandardList},
                name: 'InspectionStandardList'
            },
            {
                path: '/auth/standard/form',
                components: {listPage: InspectionStandardForm},
                name: 'InspectionStandardForm'
            },
            {
                path: '/auth/standard/import',
                components: {listPage: InspectionStandardImport},
                name: 'InspectionStandardImport'
            },
        ],
    },
    //收费类型
    {
        path: '/auth/chargingtype',
        name: 'Chargingtype',
        components: {childRoute: Chargingtype},
        meta: {}
    },
    //CNAS列表
    {
        path: '/auth/cnas',
        name: 'Cnas',
        components: {childRoute: Cnas},
        meta: {},
        children: [
            {path: '/auth/cnas/list', components: {listPage: CnasList}, name: 'CnasList'},
            {path: '/auth/cnas/form', components: {listPage: CnasForm}, name: 'CnasForm'},
        ],
    },
    //毒物管理
    {
        path: '/auth/poison',
        name: 'poison',
        components: {childRoute: PoisonPage},
        meta: {},
        children: [
            {path: '/auth/poison/poisonList', components: {listPage: PoisonList}, name: 'PoisonList'},
            {path: '/auth/poison/poisonForm', components: {listPage: PoisonForm}, name: 'PoisonForm'},
            {path: '/auth/poison/import', components: {listPage: PoisonImport}, name: 'PoisonImport'},
        ],
    },
    //基因座列表
    {
        path: '/dna/marker',
        name: 'DnaMarker',
        components: {childRoute: DnaMarker},
        meta: {},
        children: [
            {path: '/dna/marker/list', components: {listPage: DnaMarkerList}, name: 'DnaMarkerList'},
        ],
    },
    //试剂盒列表
    {
        path: '/dna/kit',
        name: 'DnaKit',
        components: {childRoute: DnaKit},
        meta: {},
        children: [
            {path: '/dna/kit/list', components: {listPage: DnaKitList}, name: 'DnaKitList'},
            {path: '/dna/kit/form', components: {listPage: DnaKitForm}, name: 'DnaKitForm'},
            {path: '/dna/kit/locusSortForm', components: {listPage: LocusSortForm}, name: 'LocusSortForm'},
        ],
    },
    //基因频率列表
    {
        path: '/gene-freq',
        name: 'GeneFreq',
        components: {childRoute: GeneFreq},
        meta: {},
        children: [
            {path: '/gene-freq/list', components: {listPage: GeneFreqList}, name: 'GeneFreqList'},
            {path: '/gene-freq/form', components: {listPage: GeneFreqForm}, name: 'GeneFreqForm'},
            {path: '/gene-freq/import', components: {listPage: GeneFreqImport}, name: 'GeneFreqImport'},
        ],
    },
    // 检验数据管理列表
    {
        path: '/auth/authDataItem',
        name: 'authDataItem',
        components: {childRoute: AuthDataItemPage},
        meta: {},
        children: [
            {
                path: '/auth/authDataItem/authDataGroupList',
                components: {listPage: AuthDataGroupList},
                name: 'AuthDataGroupList'
            },
            {
                path: '/auth/authDataItem/authDataGroupForm',
                components: {listPage: AuthDataGroupForm},
                name: 'AuthDataGroupForm'
            },
            {
                path: '/auth/authDataItem/authDataItemList',
                components: {listPage: AuthDataItemList},
                name: 'AuthDataItemList'
            },
            {
                path: '/auth/authDataItem/authDataItemForm',
                components: {listPage: AuthDataItemForm},
                name: 'AuthDataItemForm'
            },
            {
                path: '/auth/authDataItem/authDataGroupImport',
                components: {listPage: AuthDataGroupImport},
                name: 'AuthDataGroupImport'
            },
            {
                path: '/auth/authDataItem/authDataItemImport',
                components: {listPage: AuthDataItemImport},
                name: 'AuthDataItemImport'
            },
        ],
    },
    //基本案件统计类型
    {
        path: '/case-stat-type',
        name: 'CaseStatType',
        components: {childRoute: CaseStatType},
        meta: {},
        children: [
            {path: '/case-stat-type/list', components: {listPage: CaseStatTypeList}, name: 'CaseStatTypeList'},
            {path: '/case-stat-type/form', components: {listPage: CaseStatTypeForm}, name: 'CaseStatTypeForm'},
        ],
    },
    //酒精参数
    {
        path: '/base/alcoholParamForm',
        name: 'AlcoholParamForm',
        components: {childRoute: AlcoholParamForm},
        meta: {}
    }

];