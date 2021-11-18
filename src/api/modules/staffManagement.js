export default {
  //员工管理
  hrStaff: "/api/hr-staff/v1/hr-staffs",
  //员工管理统计
  countHrStaff: "/api/hr-staff/v1/staff/evaluate",
  //修改员工状态
  changeStaffStatus: "/api/hr-staff/v1/hr-staff-status",

  //市场人员
  hrStaffList: "/api/hr-staff/v1/hr-staffs/list",
  hrStaffListAll: "/api/hr-staff/v1/hr-all-staffs",

  // --------------------plan通用API----------------------
  //培训计划类型
  type: "/api/plan/v1/types",
  //获取参培部门
  trainOffice: "/api/plan/v1/offices",
  //获取参培部门人员
  officeStaff: "/api/plan/v1/office/staff/tree",
  //获取所有人员
  getAllPeople: "/api/plan/v1/staff/all",
  //修改流程状态
  reject: "/api/plan/v1/flows",
  //导出计划列表
  exportPlan:'/api/plan/v1/export/plan',
  //导出计划列表
  exportRecord:'/api/plan/v1/export/record',
  // ------------------------培训计划API-------------------------
  //培训计划列表
  trainPlan: "/api/plan/train/v1/plans",
  //提交培训计划
  submitPlans: "/api/plan/train/v1/plans",
  //获取培训计划
  getPlans: "/api/plan/train/v1/plans",
  //获取培训计划详情
  getDetail: "/api/plan/train/v1/detail",
  //删除培训计划
  deletePlan: "/api/plan/train/v1/plans",
  //添加、编辑培训记录
  confirmRecord: "/api/plan/train/v1/records",
  //删除培训记录
  deleteRecord: "/api/plan/train/v1/record",
  //获取培训记录
  getRecords: "/api/plan/train/v1/records",
  //获取培训记录参培人员
  getRecordStaffs: "/api/plan/train/v1/participants",
  //统计培训记录
  statisticRecord: "/api/plan/train/v1/records/stat",
  //计划统计中按人员统计获取具体培训记录
  getSpecificRecords: "/api/plan/train/v1/records/person",
  // ------------------------考核计划API-------------------------
  //考核计划列表
  examinePlanList: "/api/plan/examine/v1/plans",
  //考核记录列表
  examineRecordList: "/api/plan/examine/v1/records",
  //统计考核记录/计划列表
  examineStatList: "/api/plan/examine/v1/record/stat",
  // 添加/编辑考核计划
  editOrAddExamPlan: "/api/plan/examine/v1/plan/editOrAdd",
  // 删除考核计划
  delExamPlan: "/api/plan/examine/v1/plan",
  // 添加编辑考核记录
  editOrAddExamRecord: "/api/plan/examine/v1/record/editOrAdd",
  // 考核计划统计
  statExamRecordOrPlan: "/api/plan/examine/v1/record/stat",
  // 考核计划统计按人员统计获取具体人员考核记录
  statPersonRecordDetail: "/api/plan/examine/v1/record/person",
  //删除记录
  delRecord: "/api/plan/examine/v1/record",

  register: "/api/user/v1/register",

  //质量控制计划api
  getControlPlans: "/api/plan/control/v1/plans",
  //编辑/添加计划
  submitControlPlan: "/api/plan/control/v1/plan",
  //获取质量控制记录
  getControlRecords: "/api/plan/control/v1/records",
  //增加、编辑控制记录
  confirmControlRecord: "/api/plan/control/v1/records",
  //删除质量控制计划
  deleteControlPlan: "/api/plan/control/v1/plans",
  //删除质量控制记录
  delControlRecord: "/api/plan/control/v1/record",
  //根据不同维度统计质量控制计划
  getStatControlPlan: "/api/plan/control/v1/records/stat",
  //计划统计中按人员统计获取具体培训记录
  getSpecificControlRecords: "/api/plan/control/v1/records/person",
  // ------------------------质量监督API-------------------------
  //编辑/添加计划
  submitSupervisePlan: "/api/plan/supervise/v1/plan",
  //获取编辑计划
  getSupervisePlans: "/api/plan/supervise/v1/plans",
  //获取质量监督记录
  getSuperviseRecord: "/api/plan/supervise/v1/records/person",
  //删除记录
  delSuperviseRecord:"/api/plan/supervise/v1/record",
  //增加、编辑质量监督记录
  confirmSuperviseRecord: "/api/plan/supervise/v1/records",
  //删除质量监督计划
  deleteSupervisePlan: "/api/plan/supervise/v1/plans",
  //根据不同维度统计质量控制计划
  getStatSupervisePlan: "/api/plan/supervise/v1/records/stat",
  // ------------------------计划关联API-------------------------
  //获取关联计划列表
  getRelationPlans: "/api/plan/relation/v1/plan/list",
  //插入关联计划
  relatePlans: "/api/plan/relation/v1/plan/add",
  //取消关联计划
  deleteRelatedPlans: "/api/plan/relation/v1/plan/del",
};
