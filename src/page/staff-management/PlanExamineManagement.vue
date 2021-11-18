<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="考核计划列表" name="examinePlanList">
        <div class="search-box" style="overflow: hidden">
          <el-form :model="searchForm" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划类型">
                  <el-select v-model="searchForm.typeId" clearable class="w100">
                    <el-option
                      v-for="item in planTypes"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="考核对象">
                  <el-input v-model="searchForm.targetObject" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="考核进度">
                  <select-from-enum
                    type="plan.FlowProgressStatus"
                    :model.sync="progressStatus"
                    :clearable="true"
                    class-name="w100"
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="主考部门" class="margin0">
                  <el-input v-model="searchForm.department" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划年份" class="margin0">
                  <el-date-picker
                    v-model="searchForm.planYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="计划年份"
                    class="w100"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                style="color: white;float:right"
                @click="search"
              >查询</el-button>
            </el-row>
          </el-form>
        </div>
        <Plan-table
          port="examinePlanList"
          :hasPaging="true"
          postType="post"
          :search="searchForm"
          :is-select="true"
          @selectChange="handleSelectionChange"
          @reject="reject"
          @lock="lock"
          @unlock="unlock"
          @openStatus="editProgresStatus"
          @submitPlan="submit"
          ref="planTable"
          :exportTitle="exportTitle"
          tag="EXAM"
          :max-height="tableHeight"
        >
          <el-table-column type="selection" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planType" label="计划类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="考核项目" show-overflow-tooltip></el-table-column>
          <el-table-column prop="examineMode" label="考核方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="targetObject" label="考核对象" show-overflow-tooltip></el-table-column>
          <el-table-column prop="department" label="主考部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planFlowDto.planYear" label="计划年份" show-overflow-tooltip></el-table-column>

          <el-table-column prop="hrStaffDtoList" label="考核人员" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.hrStaffDtoList && scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
          </el-table-column>
          <el-table-column prop="planFlowDto.progressStatus.label" label="进度状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planFlowDto.planStatus.label" label="任务状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planFlowDto.rejectReason" label="驳回理由" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="操作" align="center" width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="warning"
                plain
                @click="edit(scope.$index,scope.row)"
                size="small"
              ></el-button>
              <el-button
                icon="el-icon-folder-opened"
                @click="viewRecordList(scope.row)"
                type="primary"
                size="small"
                plain
              ></el-button>
              <el-button
                icon="el-icon-delete"
                @click="deletePlan(scope.row)"
                type="danger"
                size="small"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </Plan-table>
        <el-dialog
          :visible="progresStatusDialog"
          width="25%"
          title="修改"
          :close-on-click-modal="true"
          :close-on-press-escape="true"
          :show-close="false"
        >
          <el-form label-width="100px" size="mini">
            <el-form-item label="进度状态">
              <select-from-enum
                type="plan.FlowProgressStatus"
                :model.sync="planFlowProgressStatus"
                :has-default="true"
              ></select-from-enum>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="progresStatusDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmEditProgresStatus">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          :visible="rejectDialog"
          width="25%"
          title="修改"
          :close-on-click-modal="true"
          :close-on-press-escape="true"
          :show-close="false"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="输入驳回理由"
            v-model="rejectContent"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="rejectDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmReject">确 定</el-button>
          </span>
        </el-dialog>
        <!--<template>
          <el-table
            :data="planTableData.list"
            stripe
            fit
            border
            style="width: 100%"
            size="mini"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >

          </el-table>
          <div class="block">
            <span class="demonstration"></span>
            <el-pagination
              @size-change="handlePageSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="planTableData.current"
              :page-sizes="pagesizes"
              :page-size="pagesize"
              layout="sizes, prev, pager, next"
              :total="planTableData.total"
            ></el-pagination>
          </div>
        </template>-->
        <el-dialog :visible.sync="examRecordDialog">
          <div class="portlet-header title-bgcolor">
            <span>考核记录</span>
            <el-button
              type="primary"
              @click="exportRecord"
              style="float:right;margin-right:20px;margin-top:8px;"
              size="mini"
            >导出</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="examRecordFormDialog = true"
              style="float:right;margin-right:20px;margin-top:8px;"
              size="mini"
            >增加</el-button>
          </div>
          <div class="portlet-body">
            <Record-table
              port="examineRecordList"
              ref="recordTable"
              :hasPaging="true"
              postType="get"
              :is-select="true"
              :exportTitle="exportReocrdTitle"
              tag="EXAM"
              :active-plan-id="activePlan.id"
              planType="planExamineId"
              max-height="400px"
            >
              <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
              <el-table-column prop="id" v-if="false" show-overflow-tooltip></el-table-column>
              <el-table-column prop="impDate" label="考核实施日期" show-overflow-tooltip></el-table-column>
              <el-table-column prop="staffName" label="被考核人" show-overflow-tooltip></el-table-column>
              <el-table-column prop="result" label="考核结果" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" label="考核情况简述" show-overflow-tooltip></el-table-column>
              <el-table-column label="考核记录附件">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="viewAttachment(scope.row)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="操作" width="120px">
                <template slot-scope="scope">
                  <span class="icon-wrap">
                    <el-button
                      icon="el-icon-edit"
                      @click="editRecord(scope.row)"
                      size="mini"
                      type="warning"
                      plain
                    ></el-button>
                    <el-button
                      icon="el-icon-delete"
                      @click="deleteRecord(scope.row)"
                      size="mini"
                      type="danger"
                      plain
                    ></el-button>
                  </span>
                </template>
              </el-table-column>
            </Record-table>
            <!-- <el-table :data="examineRecordList" stripe border style="width: 100%">
              <el-table-column prop="id" v-if="false"></el-table-column>
              <el-table-column prop="impDate" label="考核实施日期"></el-table-column>
              <el-table-column prop="staffName" label="被考核人"></el-table-column>
              <el-table-column prop="result" label="考核结果"></el-table-column>
              <el-table-column prop="description" label="考核情况简述"></el-table-column>
              <el-table-column label="考核记录附件">
                <template slot-scope="scope">
                  <el-button
                    type="warning"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    @click="viewAttachment(scope.row)"
                  >查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="操作">
                <template slot-scope="scope">
                  <span class="icon-wrap">
                    <i class="el-icon-edit ccolor" @click="editRecord(scope.row)"></i>
                    <i class="el-icon-delete ccolor" @click="deleteRecord(scope.row)"></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>-->
          </div>
          <el-dialog
            title="附件"
            :visible.sync="isViewAttachment"
            width="50%"
            :show-close="false"
            append-to-body
          >
            <el-row>
              <el-col :span="10">
                <h3>图片附件列表</h3>
                <div>
                  <el-image
                          style="width: 100px; height: 100px;float:left;margin-left:30px;margin-top:20px;"
                          :src="item.url"
                          :preview-src-list="[item.url]"
                          v-for="item in imgList"
                          :key="item.url"
                  ></el-image>
                </div>
                <!--<template>-->
                  <!--<el-table-->
                    <!--ref="multipleTable"-->
                    <!--:data="imgList"-->
                    <!--tooltip-effect="dark"-->
                    <!--style="width: 100%"-->
                  <!--&gt;-->
                    <!--<el-table-column type="index" width="45"></el-table-column>-->
                    <!--<el-table-column label="图片" width="120" prop="url">-->
                      <!--<template slot-scope="scope">-->
                        <!--<div class="demo-image_preview">-->
                          <!--<el-image-->
                            <!--style="width: 100px; height: 100px"-->
                            <!--:src="scope.row.url"-->
                            <!--:preview-src-list="[scope.row.url]"-->
                          <!--&gt;</el-image>-->
                        <!--</div>-->
                      <!--</template>-->
                      <!--&lt;!&ndash; </div> &ndash;&gt;-->
                    <!--</el-table-column>-->
                  <!--</el-table>-->
                <!--</template>-->
              </el-col>
              <el-col :span="12" :offset="2">
                <h3>文件附件列表</h3>
                <el-table
                  ref="multipleTable"
                  :data="fileList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column label="文件" prop="name">
                    <template slot-scope="scope">
                      <span>{{scope.row.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="下载" width="70px" prop="[name,url]">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-bottom"
                        circle
                        @click="download(scope.row.name,scope.row.url)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="isViewAttachment = false">关闭</el-button>
            </span>
          </el-dialog>
          <el-dialog :visible.sync="examRecordFormDialog" append-to-body>
            <div class="portlet-header title-bgcolor">
              <div v-if="isEditRecord">编辑考核记录</div>
              <div v-else>新增考核记录</div>
            </div>
            <div class="portlet-body">
              <el-form :model="examRecordForm" ref="recordForm" size="small" label-width="100px">
                <el-row>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      label="考核实施日期"
                      prop="impDate"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-date-picker
                        v-model="examRecordForm.impDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        class="w100"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      :rules="$filter_rules({required:true,trigger:'change'})"
                      prop="staffId"
                      label="被考核人"
                    >
                      <el-select v-model="examRecordForm.staffId" clearable class="w100">
                        <el-option
                          v-for="item in allStaffs"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      :rules="$filter_rules({required:true})"
                      prop="result"
                      label="考核结果"
                    >
                      <el-input v-model="examRecordForm.result" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item
                  :rules="$filter_rules({required:true})"
                  prop="description"
                  label="考核情况描述"
                >
                  <el-input type="textarea" v-model="examRecordForm.description" />
                </el-form-item>
                <br />
                <el-form-item label="文件附件上传" prop="otherFile">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    multiple
                    :on-change="handleFileUpload"
                    :on-remove="handleRemoveFile"
                    :auto-upload="false"
                    :show-file-list="true"
                    :file-list="fileList"
                    list-type="text"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-row>
                  <el-col>
                    <el-form-item label="图片附件上传" prop="otherFile">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        multiple
                        :on-change="handleImgUpload"
                        :on-remove="handleRemoveImg"
                        :auto-upload="false"
                        :file-list="imgList"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                      <!-- <PictrueWall :model.sync="imgList" :hasTile="false"></PictrueWall> -->
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12" :offset="11">
                    <el-button
                      @click="saveAndValid('confirmRecord')"
                      type="primary"
                      size="small"
                      style="color: white"
                    >保存</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-dialog>
        </el-dialog>
      </el-tab-pane>
      <!--:label="isAdd?'添加员工':'修改员工信息'"-->
      <el-tab-pane :label="isPlanAdd?'考核计划添加':'考核计划编辑'" :name="isPlanAdd?'addPlan':'editPlan'">
        <div class="portlet">
          <div class="portlet-header title-bgcolor">
            <span>考核计划</span>
          </div>
          <div class="portlet-body">
            <el-form :model="inEditPlan" size="small" ref="planForm" label-width="100px">
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item prop="id">
                    <input v-model="inEditPlan.id" v-if="false" />
                  </el-form-item>
                  <el-form-item prop="planFlowDto.id">
                    <input v-model="inEditPlan.planFlowDto.id" v-if="false" />
                  </el-form-item>
                  <el-form-item
                    label="计划年份"
                    :rules="$filter_rules({required:true,trigger:'blur'})"
                    prop="planFlowDto.planYear"
                  >
                    <el-date-picker
                      v-model="inEditPlan.planFlowDto.planYear"
                      type="year"
                      value-format="yyyy"
                      placeholder="计划年份"
                      class="w100"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item label="计划类型" prop="typeId" :rules="$filter_rules({required:true,trigger:'change'})">
                    <el-select v-model="inEditPlan.typeId" clearable class="w100">
                      <el-option
                        v-for="item in planTypes"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item label="考核项目" prop="name" :rules="$filter_rules({required:true})">
                    <el-input type="textarea" v-model="inEditPlan.name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item
                    label="考核方式"
                    prop="examineMode"
                    :rules="$filter_rules({required:true})"
                  >
                    <el-input type="textarea" v-model="inEditPlan.examineMode"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item
                    label="针对对象"
                    prop="targetObject"
                    :rules="$filter_rules({required:true})"
                  >
                    <el-input type="textarea" v-model="inEditPlan.targetObject" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item
                    label="计划开始日期"
                    prop="planFlowDto.startDate"
                    :rules="$filter_rules({required:true})"
                  >
                    <el-date-picker
                      v-model="inEditPlan.planFlowDto.startDate"
                      class="w100"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item
                    label="预计结束日期"
                    :rules="$filter_rules({required:true})"
                    prop="planFlowDto.endDate"
                  >
                    <el-date-picker
                      v-model="inEditPlan.planFlowDto.endDate"
                      class="w100"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item
                    label="主考部门"
                    prop="department"
                    :rules="$filter_rules({required:true})"
                  >
                    <el-input v-model="inEditPlan.department" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}">
                  <el-form-item label="考核部门" :rules="$filter_rules({required:true})">
                    <el-select multiple v-model="selectedOffices" placeholder="请选择" clearable class="w100">
                      <el-option
                        v-for="item in sysOfficeDtoList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="{span:16}" v-if="selectedOffices.length!=0">
                  <el-form-item label="考核人员" :rules="$filter_rules({required:true})" prop="hrStaffDtoList">
                    <el-tree
                      ref="personTree"
                      :data="officeStaffs"
                      show-checkbox
                      node-key="id"
                      @check="handleNodeClick"
                      :default-expanded-keys="defaultExpandedKeys"
                      :default-checked-keys="defaultCheckedKeys"
                      :props="defaultProps"
                    ></el-tree>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" :offset="10">
                  <el-button size="mini" type="success" @click="saveAndValid('plan')" :loading="planButtonLoading">保存</el-button>
                </el-col>
                <el-col :span="2">
                  <el-button size="mini" type="primary" @click="back">返回</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="考核计划统计" name="planStatistics">
        <div class="search-box" style="overflow: hidden">
          <!--@keyup.enter.native="search"-->
          <el-form :model="queryStatRequestParam" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="统计类型">
                  <select-from-enum
                    type="plan.PlanStatType"
                    :model.sync="queryStatRequestParam.statType"
                    class-name="w100"
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划类型">
                  <el-select v-model="queryStatRequestParam.planTypeId" clearable class="w100">
                    <el-option
                      v-for="item in planTypes"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="姓名">
                  <el-input v-model="queryStatRequestParam.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划年份" class="margin0">
                  <el-date-picker
                    v-model="queryStatRequestParam.planYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="计划年份"
                    class="w100"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-button
                type="primary"
                icon="el-icon-pie-chart"
                size="small"
                style="color: white;float:right"
                @click="getStatList"
              >统计</el-button>
            </el-row>
          </el-form>
        </div>
        <el-table
          :data="statTableData"
          v-if="queryStatRequestParam.statType.value=='PERSON'"
          stripe
          size="mini"
          fit
          border
          style="width: 100%"
          :max-height="StatTableHeight"
        >
          <el-table-column prop="personDto.planYear" label="年份" align="center"></el-table-column>
          <el-table-column prop="personDto.name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="personDto.examTimes" label="被考核次数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click="viewStatPersonRecord(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="statTableData"
          v-if="queryStatRequestParam.statType.value=='PLAN'"
          stripe
          size="mini"
          fit
          border
          style="width: 100%"
          :max-height="StatTableHeight"
        >
          <el-table-column prop="planDto.planYear" label="计划年份" align="center"></el-table-column>
          <el-table-column prop="planDto.annualPlanCounts" label="年度计划数" align="center"></el-table-column>
          <el-table-column prop="planDto.annualPlanFinishCounts" label="年度计划完成数" align="center"></el-table-column>
          <el-table-column prop="planDto.planAddCounts" label="新增计划数" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.planDto && scope.row.planDto.planAddCounts}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="planDto.planAddFinishCounts" label="新增计划完成数" align="center"></el-table-column>
          <el-table-column prop="planDto.totalPlanCounts" label="总计划数" align="center"></el-table-column>
          <el-table-column prop="planDto.totalPlanFinishCounts" label="总完成数量" align="center"></el-table-column>
        </el-table>

        <div class="block" style="float:right">
          <span class="demonstration"></span>
          <el-pagination
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryStatRequestParam.pageDto.current"
            :page-sizes="pagesizes"
            :page-size="pagesize"
            layout="total,sizes,prev, pager, next"
            :total="planTableData.total"
            background
          ></el-pagination>
        </div>
        <el-dialog :visible.sync="yearRecordDialog">
          <template>
            <!--<el-table :data="statPersonDetailTabelData" stripe style="width: 100%"  fit  border>
              <el-table-column prop="staffName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="impDate" label="考核日期" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="name" label="考核项目" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="result" label="考核结果" align="center" show-overflow-tooltip></el-table-column>员工列表
            </el-table>-->
            <StatDetail port="statPersonRecordDetail" ref="statDetail">
                <el-table-column prop="staffName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="impDate" label="考核日期" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="考核项目" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="result" label="考核结果" align="center" show-overflow-tooltip></el-table-column>员工列表
            </StatDetail>
          </template>
         <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="yearRecordDialog = false">关闭</el-button>
          </span>-->
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import api from "../../api";
import PictureWall from "../../components/common/PictureWall";
import Portlet from "@/page/layout/Portlet";
import PlanTable from "./components/PlanTable";
import RecordTable from "./components/RecordTable";
import { myMixin } from "./mixins/myMixin";
import StatDetail from './components/StatDetail'

export default {
  name: "PlanExamineManagement.vue",
  mixins: [myMixin],
  data() {
    return {
      activeName: "examinePlanList",
      planTableData: {
        list: [],
        total: 0,
      },
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      innerPanClass: {
        sm: { span: 24 },
        md: { span: 12 },
        xl: { span: 12 },
      },
      exportTitle: [
        "计划类型",
        "考核项目",
        "考核方式",
        "考核对象",
        "主考部门",
        "计划年份",
        "考核人员",
        "进度状态",
        "任务状态",
        "驳回理由",
      ],
      exportReocrdTitle: [
        "考核实施日期",
        "被考核人",
        "考核结果",
        "考核情况简述",
      ],
      trainingRecordDialog: false,
      yearRecordDialog: false,
      progresStatusDialog: false,
      isPlanAdd: true,
      apartment: "参培部门",
      searchData: [],
      typeOptions: [{ id: "", label: "" }],
      planTypes: [],
      searchForm: {
        typeId: "",
        targetObject: "",
        flowProgressStatus: "",
        department: "",
        planYear: "",
        pageDto: {
          pageSize: 30,
          current: 1,
        },
      },
      planFlowProgressStatus: "",
      progressStatus: "",
      examineRecordList: [
        {
          id: "",
          impDate: "",
          result: "",
          description: "",
          otherFileDtos: [],
          name: "",
          staffName: "",
          staffId: "",
        },
      ],
      currentPage2: "",
      planTableSelections: [],
      pagesizes: [30, 50, 80, 100],
      pagesize: 30,
      inEditPlan: {
        id: "",
        planType: "",
        name: "",
        examineMode: "",
        targetObject: "",
        department: "",
        planFlowDto: {
          planYear: "",
          endDate: "",
          startDate: "",
        },
        sysOfficeDtoList: [],
        hrStaffDtoList: [],
      },
      sysOfficeDtoList: [],
      selectedOffices: [],
      officeStaffs: [],
      defaultProps: {
        children: "hrStaffDtoList",
        label: "name",
        id: "id",
      },
      defaultCheckedKeys: [],
      checkedKeys: [],
      defaultExpandedKeys: [],
      rejectDialog: false,
      rejectContent: "",
      examRecordDialog: false,
      examRecordFormDialog: false,
      examRecordForm: {
        otherFileDtos: [],
        staffId: "",
      },
      fileList: [],
      imgList: [],
      activePlan: {},
      examineId: "",
      allStaffs: [],
      isViewAttachment: false,
      isEditRecord: false,
      queryStatRequestParam: {
        statType: {
          value: "PERSON",
          label: "",
        },
        planTypeId: "",
        name: "",
        planYear: "",
        pageDto: {
          pageSize: 30,
          current: 1,
        },
      },
      page: {
        current: "",
        pageSize: "",
      },
      statTableData: [
        {
          personDto: {
            planYear: "",
            staffId: "",
            name: "",
            examTimes: "",
          },
          planDto: {
            planYear: "",
            annualPlanCounts: "",
            annualPlanFinishCounts: "",
            planAddCounts: "",
            planAddFinishCounts: "",
            totalPlanCounts: "",
            totalPlanFinishCounts: "",
          },
        },
      ],
      statPersonDetailTabelData: [
        {
          name: "",
          impDate: "",
          staffName: "",
          result: "",
        },
      ],
      isStatPerson: true,
      planButtonLoading: false,
    };
  },

  methods: {
    exportRecord() {
      //导出记录列表
      this.$refs.recordTable.exportRecord({ id: this.activePlan.id });
    },
    handleSizeChange() {},
    viewStatPersonRecord(val) {
      this.yearRecordDialog = true;
      let param = {
        planYear: val.personDto.planYear,
        staffId: val.personDto.staffId,
      };
      /*this.getStatPersonDetail(param);*/
        this.$nextTick(() => {
            this.$refs['statDetail'].init(param.planYear, param.staffId);
        })
    },
    /*getStatPersonDetail(param) {
      this.$get(api.statPersonRecordDetail, param).then((e) => {
        this.statPersonDetailTabelData = e.data.list;
      });
    },*/
    downloadBlobFile(name, blob) {
      // 创建a标签
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      // download属性
      link.setAttribute("download", name);
      // href链接

      link.setAttribute("href", url);
      // 自执行点击事件
      link.click();
    },
    downloadFile(name, url) {
      // 创建a标签
      const link = document.createElement("a");
      // download属性
      link.setAttribute("download", name);
      // href链接
      link.setAttribute("href", url);
      // 自执行点击事件
      link.click();
    },
    download(name, url) {
      let ext = name.substring(name.lastIndexOf(".") + 1, name.length);
      let fileName = name.substring(name.lastIndexOf("-") + 1, name.length);
      /*if (
        ext.toLowerCase() == "jpg" ||
        ext.toLowerCase() == "png" ||
        ext.toLowerCase() == "txt"
      ) {
        fetch(url)
          .then((response) => {
            if (response.status == 200)
              // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
              return response.blob();
            throw new Error(`status: ${response.status}.`);
          })
          .then((blob) => {
            // 获取到blob对象
            this.downloadBlobFile(fileName, blob);
          })
          .catch((error) => {
          });
      } else {
        this.downloadFile(fileName, url);
      }*/
        fetch(url)
            .then((response) => {
              if (response.status == 200)
              // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                return response.blob();
              throw new Error(`status: ${response.status}.`);
            })
            .then((blob) => {
              // 获取到blob对象
              this.downloadBlobFile(fileName, blob);
            })
            .catch((error) => {
              console.log("failed. cause:", error);
            });
    },
    editRecord(val) {
      this.isEditRecord = true;
      this.examRecordFormDialog = true;
      this.examRecordForm = JSON.parse(JSON.stringify(val));
      this.genFileAndImgList(val);
    },
    viewAttachment(val) {
      this.isViewAttachment = true;
      this.genFileAndImgList(val);
    },
    genFileAndImgList(row) {
      let reg = "/.gif|.jpeg|.png|.jpg|.bmp/i";
      row.otherFileDtos.forEach((e) => {
        let obj = new Object();
        obj.url = e.path;
        obj.name = e.path.substring(e.path.lastIndexOf("-") + 1, e.path.length);
        if (
          e.path.substring(e.path.lastIndexOf("."), e.path.length).match(reg)
        ) {
          this.imgList.push(obj);
        } else {
          this.fileList.push(obj);
        }
      });
    },
    confirmRecord() {
      //压缩附件
        let loadingInstance = this.$loading({ fullscreen: true });
      let f1 = null;
      let f2 = null;
      //上传图片
      this.imgList.forEach((v) => {
        if (!v.raw) {
          return;
        }
        f1 = new Promise((resolve, reject) => {
          let file = v.raw;
          let filetype = file.type.substring(
            file.type.lastIndexOf("/") + 1,
            file.type.length
          );
          lrz(file, { width: 1280 }).then((rst) => {
            let img = { name: v.name, imageType: filetype, image: rst.base64 };
            this.examRecordForm.otherFileDtos.push({ image: img });
            resolve();
          });
        });
      });
      this.fileList.forEach((v) => {
        if (!v.raw) {
          return;
        }
        //上传文件附件
        f2 = new Promise((resolve, reject) => {
          this.$getBase64(v.raw).then((res) => {
            let file = v.raw;
            let filetype = file.type.substring(
              file.type.lastIndexOf("/") + 1,
              file.type.length
            );
            let file1 = { name: v.name, fileType: filetype, base64Str: res };
            this.examRecordForm.otherFileDtos.push({ file: file1 });
            resolve();
          });
        });
      });
      //保存培训记录
      this.examRecordForm.examineId = this.examineId;
      Promise.all([f1, f2]).then((res) => {
        this.$post(api.editOrAddExamRecord, this.examRecordForm)
          .then((res) => {
            loadingInstance.close();
            this.$message.success("保存成功");
            this.examRecordFormDialog = false;
            this.getRecordList();
            console.log(res);
          })
          .catch((e) => {
            this.$message.error("服务器内部错误");
              loadingInstance.close();
            console.log(e.errMsg);
          });
      });
    },
    getRecordList() {
      this.$nextTick(() => {
        this.$refs.recordTable.init({ planExamineId: this.examineId });
      });
    },
    handleRemoveImg(file, fileList) {
      this.imgList = fileList;
      this.examRecordForm.otherFileDtos = this.examRecordForm.otherFileDtos.filter(
        (e) => {
          return file.url != e.path;
        }
      );
    },
    handleImgUpload(file, fileList) {
      //图片上传处理
      if (
              file.raw.type != "image/jpeg" &&
              file.raw.type != "image/jpg" &&
              file.raw.type != "image/png"
      ) {
        let index = fileList.findIndex((item) => item.uid == file.uid);
        fileList.splice(index, 1);
        this.handleImgDebounce();
        return;
      }
      var fileName = file.name;
      let fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.imgList.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
      this.examRecordForm.otherFileDtos = this.examRecordForm.otherFileDtos.filter(
        (e) => {
          return file.url != e.path;
        }
      );
    },
    async deleteRecord(row) {
      let api1 = api.delRecord + "/" + row.id;
      let p = await this.deleteRow(row, api1);
      if (p) {
        this.getRecordList();
      }
    },
    async deletePlan(row) {
      let api1 = api.delExamPlan + "/" + row.id + "/" + row.planFlowDto.id;
      let p = await this.deleteRow(row, api1);
      if (p) {
        this.getPlanList();
      }
    },
    deleteRow(row, api1) {
      let p = this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$del(api1)
            .then((res) => {
              this.$message({
                type: "success",
                message: "操作成功",
              });
            })
            .catch((err) => {
              this.$message.error(err.errMsg);
            });
          return true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          return false;
        });
      return p;
    },
    search() {
      this.getPlanList();
    },
    reject() {
      // 驳回
      if (
        this.planTableSelections == null ||
        this.planTableSelections.length == 0
      ) {
        this.$message.error("请选择计划");
        return;
      }
      if (
        this.planTableSelections.every(
          (item) => item.planFlowDto.planStatus.value == "SUBMITTED"
        )
      ) {
        this.rejectDialog = true;
      } else {
        this.$message.error("计划还未提交，不能驳回！");
      }
    },
    confirmReject() {
      this.rejectDialog = false;
      let planFlowDtoList = [];
      this.planTableSelections.map((e) => {
        planFlowDtoList.push({
          id: e.planFlowDto.id,
          planStatus: "REJECT",
          rejectReason: this.rejectContent,
        });
      });
      this.$put(api.reject, planFlowDtoList)
        .then((e) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.$refs.planTable.init(this.searchForm);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    lock() {
      //锁定
      if (
        this.planTableSelections == null ||
        this.planTableSelections.length == 0
      ) {
        this.$message.error("请选择计划");
        return;
      }
      this.changePlanFlow("LOCK", null);
    },
    unlock() {
      //未锁定
      if (
        this.planTableSelections == null ||
        this.planTableSelections.length == 0
      ) {
        this.$message.error("请选择计划");
        return;
      }
      this.changePlanFlow("UNLOCK", null);
    },
    confirmEditProgresStatus() {
      let p = new Promise((resolve, reject) => {
        this.changePlanFlow(null, this.planFlowProgressStatus);
        resolve((this.progresStatusDialog = false));
      });
    },
    editProgresStatus() {
      if (
        this.planTableSelections == null ||
        this.planTableSelections.length == 0
      ) {
        this.$message.error("请选择计划");
        return;
      }
      this.progresStatusDialog = true;
    },
    edit(index, row) {
      if (row.planFlowDto.planStatus.value == "LOCK") {
        this.$message.error("该计划已锁定,禁止修改");
        return;
      }
      this.isPlanAdd = false;
      this.activeName = "editPlan";
      this.inEditPlan = row;
      this.selectedOffices = this.inEditPlan.sysOfficeDtoList.map((e) => {
        return e.id;
      });
    },
    saveAndValid(val) {
      if (val == "plan") {
        this.$refs["planForm"].validate((v) => {
          if (v) {
            this.save();
          }
        });
      } else if (val == "confirmRecord") {
        this.$refs["recordForm"].validate((v) => {
          if (v) {
            this.confirmRecord();
          }
        });
      }
    },
    handleNodeClick(data, nodes) {
        let ids = [];
        //参培人员
        nodes.checkedNodes.forEach((item) => {
            if (!item.hrStaffDtoList) {
                ids.push({
                    id: item.id,
                });
            }
        });
        this.inEditPlan.hrStaffDtoList = ids;
        this.$refs["planForm"].validateField('hrStaffDtoList'); //表单部分验证
    },
    save() {
      //保存数据
      //处理考核部门格式
      this.planButtonLoading =  true;
      this.inEditPlan.sysOfficeDtoList = this.selectedOffices.map((e) => {
        return { id: e };
      });
      //处理考核对象格式
      this.inEditPlan.hrStaffDtoList = this.$refs.personTree
        .getCheckedKeys()
        .map((e) => {
          return { id: e };
        });
      this.$post(api.editOrAddExamPlan, this.inEditPlan)
        .then((e) => {
          this.planButtonLoading =  false;
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.resetPlanForm();
          this.activeName = "examinePlanList";
        })
        .catch((err) => {
          console.log(err);
          this.planButtonLoading =  false;
          this.message.error("操作失败");
        });
    },
    resetPlanForm() {
      this.$refs.planForm.resetFields();
      this.selectedOffices = [];
      this.getPlanList();
    },
    back() {
      this.activeName = "examinePlanList";
    },
    submit() {
      //提交
      if (
        this.planTableSelections == null ||
        this.planTableSelections.length == 0
      ) {
        this.$message.error("请选择计划");
        return;
      }
      this.changePlanFlow("SUBMITTED", null);
    },
    changePlanFlow(planStatus, progressStatus) {
      let planFlowDtoList = [];
      if (planStatus != null) {
        this.planTableSelections.map((e) => {
          planFlowDtoList.push({
            id: e.planFlowDto.id,
            planStatus: planStatus,
          });
        });
      }
      if (progressStatus != null) {
        this.planTableSelections.map((e) => {
          planFlowDtoList.push({
            id: e.planFlowDto.id,
            progressStatus: progressStatus,
          });
        });
      }
      this.$put(api.reject, planFlowDtoList)
        .then((e) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.$refs.planTable.init(this.searchForm);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPlanTypes() {
      //获取计划类型
      this.$get(api.type).then((res) => {
        this.planTypes = res.data;
      });
    },
    getPlanList() {
      /*this.planTableData = { list: [] };
      //获取计划列表
      this.$post(api.examinePlanList, this.searchForm)
        .then(res => {
          this.planTableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });*/
      if (this.progressStatus) {
        this.searchForm.flowProgressStatus = this.progressStatus.value;
      } else {
        this.searchForm.flowProgressStatus = "";
      }
      this.$refs.planTable.init(this.searchForm);
    },
    handlePageSizeChangeStat(val) {
      this.queryStatRequestParam.pageDto.pageSize = val;
      this.getStatList();
    },
    handleCurrentChangeStat(val) {
      this.getStatList();
    },
    handlePageSizeChange(val) {
      this.searchForm.pageDto.pageSize = val;
      this.getStatList();
    },
    handleCurrentChange(val) {
      this.searchForm.pageDto.current = val;
      this.getStatList();
    },
    handleSelectionChange(val) {
      this.planTableSelections = val.reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      },[]);
    },
    viewRecordList(row) {
      this.activePlan = row;
      let p = new Promise((e, v) => {
        this.examRecordDialog = true;
        this.examineId = row.id;
        e();
      });
      p.then(() => {
        this.getRecordList();
      });
    },
    getSysOffices() {
      this.$get(api.trainOffice).then((res) => {
        this.sysOfficeDtoList = res.data;
      });
    },
    handleFileUpload(file, fileList) {
      // 文件上传处理
      // 文件上传处理
      if (
              file.raw.type == "image/jpeg" ||
              file.raw.type == "image/jpg" ||
              file.raw.type == "image/png"
      ) {
        let index = fileList.findIndex((item) => item.uid == file.uid);
        fileList.splice(index, 1);
        this.handleFileDebounce();
        return;
      }
      var fileName = file.name;
      let fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.fileList.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    getStatList() {
      this.$post(api.statExamRecordOrPlan, this.queryStatRequestParam).then(
        (res) => {
          this.statTableData = res.data.list;
          this.planTableData.total = res.data.total;
        }
      );
    },
  },
  watch: {
    "queryStatRequestParam.statType.value": function (val) {
      this.getStatList();
    },
    isViewAttachment: function (val) {
      if (!val) {
        this.fileList = [];
        this.imgList = [];
      }
    },
    activeName: function (val1, val2) {
      if (val2 == "editPlan") {
        this.isPlanAdd = true;
        this.inEditPlan.planFlowDto.planStatus = null;
        this.inEditPlan.planFlowDto.progressStatus = null;
        this.inEditPlan.planFlowDto.rejectReason = "";
      }
      if (val1 == "editPlan" || val1 == "addPlan") {
        this.getSysOffices();
      }
      if (val1 == "planStatistics") {
        //获取计划类型
        let p = new Promise((e, v) => {
          this.getPlanTypes();
          e();
        });
        p.then(() => {
          this.getStatList();
        });
      }
    },
    isPlanAdd: function (val1) {
      if (val1) {
        this.resetPlanForm();
      }
    },
    "inEditPlan.sysOfficeDtoList"(val1, val2) {
      let officeIds = "";
      val1.map((e) => {
        officeIds.concat(",", e);
      });
    },
    selectedOffices: function (val1, val2) {
      let ids = val1.join(",");
      this.$get(api.officeStaff, { officeIds: ids }).then((res) => {
        this.officeStaffs = res.data;
        this.defaultExpandedKeys = res.data.map((e) => {
          return e.id;
        });
        this.defaultCheckedKeys = this.inEditPlan.hrStaffDtoList.map((e) => {
          return e.id;
        });
      });
    },
    examRecordFormDialog: function (val) {
      if (val) {
        this.$get(api.getAllPeople).then((res) => {
          this.allStaffs = res.data;
        });
      }
      if (!val) {
        this.examRecordForm = {
          id: "",
          impDate: "",
          result: "",
          description: "",
          otherFileDtos: [],
          name: "",
          staffName: "",
          staffId: "",
        };
        this.imgList = [];
        this.fileList = [];
        this.isEditRecord = false;
      }
    },
  },
  components: {
    PlanTable,
    Portlet: Portlet,
    PictureWall: PictureWall,
    RecordTable,
    StatDetail
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "考核计划");
    this.getPlanTypes();
  },
};
</script>

<style scoped>
.title-bgcolor {
  background-color: #f5f7fa;
}
.textarea /deep/ .el-form-item__content {
  width: calc(95% - 50px);
}

.ccolor:hover {
  color: #ff3669;
}

.icon-wrap {
  font-size: 19px;
}
</style>