<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="质量控制计划列表" name="trainPlan">
        <div class="search-box" style="overflow: hidden">
          <!--@keyup.enter.native="search"-->
          <el-form :model="searchData" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划类型">
                  <el-select v-model="searchData.typeId" clearable class="w100">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划进度">
                  <select-from-enum
                    type="plan.FlowProgressStatus"
                    :model.sync="progressStatus"
                    clearable
                    class-name="w100"
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划年份">
                  <el-date-picker
                    v-model="searchData.planYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="计划年份"
                    class="w100"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
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
          port="getControlPlans"
          :hasPaging="true"
          postType="get"
          :search="searchData"
          :is-select="true"
          @selectChange="handleSelectionChange"
          @reject="openRejectDialog"
          @lock="lock"
          @unlock="unlock"
          @openStatus="openStatus"
          @submitPlan="submitPlan"
          ref="planTable"
          :exportTitle="exportTitle"
          :max-height="tableHeight"
          tag="CONTROL"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="type" label="计划类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="质量控制项目" show-overflow-tooltip></el-table-column>
          <el-table-column prop="controlMode" label="方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="chargePerson" label="负责人" show-overflow-tooltip width="150px;"></el-table-column>
          <el-table-column prop="planFlowDto.planYear" label="计划年份" show-overflow-tooltip></el-table-column>
          <el-table-column prop="offices" label="参与人员" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.hrStaffDtoList && scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
          </el-table-column>
          <el-table-column
            prop="planFlowDto.progressStatus.label"
            label="进度状态"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="planFlowDto.planStatus.label" label="任务状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planFlowDto.rejectReason" label="驳回理由" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="warning"
                plain
                @click="edit(scope.row) "
                size="small"
              ></el-button>
              <el-button
                icon="el-icon-folder-opened"
                @click="enterRecord(scope.row, scope.$index)"
                type="primary"
                size="small"
                plain
              ></el-button>
              <el-button
                icon="el-icon-delete"
                @click="deleteRow(scope.row,scope.$index)"
                type="danger"
                size="small"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </Plan-table>
        <el-dialog :visible.sync="trainingRecordDialog">
          <el-dialog
            :visible.sync="recordFormDialog"
            append-to-body
            width="40%"
          >
            <div class="search-box" style="overflow: hidden">
              <el-form :model="recordDto" size="small" label-width="130px" ref="recordForm">
                <el-row>
                  <el-col>
                    <el-form-item
                      label="日期"
                      prop="recordDate"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-date-picker
                        v-model="recordDto.recordDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        style="width:200px;"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="24" :md="24" :xl="24">
                    <el-form-item
                      label="参与人员"
                      :rules="$filter_rules({required:true,trigger:'change'})"
                      prop="staffIds"
                    >
                      <el-select v-model="recordDto.staffIds" multiple class="w100">
                        <el-option
                          v-for="item in recordStaffs"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item
                      label="质量控制记录名称"
                      prop="name"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-input v-model="recordDto.name" type="textarea"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item
                  label="质量控制工作描述"
                  prop="description"
                  :rules="$filter_rules({required:true,trigger:'blur'})"
                  class="textarea"
                >
                  <el-input type="textarea" v-model="recordDto.description" />
                </el-form-item>
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
                </el-form-item>

                <el-row>
                  <el-col :span="12" :offset="11">
                    <el-button
                      type="primary"
                      size="small"
                      style="color: white"
                      @click="confirmRecord"
                    >保存</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-dialog>
          <el-row>
            <el-col :span="24">
              <div class="portlet">
                <div class="portlet-header title-bgcolor">
                  <span>质量控制记录</span>
                  <el-button
                    type="primary"
                    @click="exportRecord"
                    style="float:right;margin-right:20px;margin-top:8px;"
                    size="mini"
                  >导出</el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addRecord"
                    style="float:right;margin-right:20px;margin-top:8px;"
                    size="mini"
                  >增加</el-button>
                </div>
                <div class="portlet-body">
                  <Record-table
                    port="getControlRecords"
                    ref="recordTable"
                    :hasPaging="true"
                    postType="get"
                    :is-select="true"
                    :exportTitle="exportReocrdTitle"
                    tag="CONTROL"
                    :active-plan-id="activePlan.id"
                    planType="planControlId"
                    max-height="400px"
                  >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="recordDate" label="日期" align="center" width="90px"></el-table-column>
                    <el-table-column prop="trainName" label="参与人员" show-overflow-tooltip align="center">
                      <template
                        slot-scope="scope"
                      >{{scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="质量控制记录名称" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column prop="description" label="质量控制工作描述" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column label="附件列表" align="center" width="100px">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="viewAttachment(scope.row)"
                        >查看</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="操作" width="120px" align="center">
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
                  <!-- <el-table :data="recordData" size="mini" stripe fit border style="width: 100%">
                    <el-table-column prop="recordDate" label="日期"></el-table-column>
                    <el-table-column prop="trainName" label="参与人员">
                      <template
                        slot-scope="scope"
                      >{{scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="质量控制记录名称"></el-table-column>
                    <el-table-column prop="description" label="质量控制工作描述"></el-table-column>
                    <el-table-column label="附件列表">
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
              </div>
            </el-col>
          </el-row>
          <!--<span slot="footer" class="dialog-footer">
            <el-button @click="trainingRecordDialog = false">取 消</el-button>
            <el-button type="primary" @click="trainingRecordDialog = false">确 定</el-button>
          </span>-->
        </el-dialog>
        <el-dialog title="附件" :visible.sync="isViewAttachment" width="50%" :show-close="false">
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
              <template>
                <!--<el-table
                  ref="multipleTable"

                  tooltip-effect="dark"
                  style="width: 100%"
                >&lt;!&ndash;:data="imgList"&ndash;&gt;
                  <el-table-column type="index" width="45"></el-table-column>
                  <el-table-column label="图片" width="120" prop="url">
                    <template slot-scope="scope">
                      <div class="demo-image_preview">

                        <el-image
                          style="width: 100px; height: 100px"
                          :src="scope.row.url"
                          :preview-src-list="[scope.row.url]"
                        ></el-image>
                      </div>
                    </template>
                    &lt;!&ndash; </div> &ndash;&gt;
                  </el-table-column>
                </el-table>-->
              </template>
            </el-col>
            <el-col :offset="2" :span="12">
              <h3>文件附件列表</h3>
              <el-table
                ref="multipleTable"
                :data="fileList"
                fit
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="index" align="center" width="50px"></el-table-column>
                <el-table-column label="文件"  prop="name" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="下载" width="70px" prop="[name,url]" align="center">
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
        <el-dialog :visible.sync="rejectDialog" width="30%">
          <el-form label-width="100px" size="mini">
            <el-form-item label="驳回理由">
              <el-input type="textarea" :autosize="{minRows:5}" v-model="rejectReason" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="reject('N')">取 消</el-button>
            <el-button type="primary" @click="reject('Y')">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :visible="statusDiag"
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
            <el-button @click="confirmStatus('N')">取 消</el-button>
            <el-button type="primary" @click="confirmStatus('Y')">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane :label="isAdd?'质量控制计划添加':'质量控制计划编辑'" :name="isAdd?'addlist':'changelist'">
        <div class="portlet">
          <div class="portlet-header title-bgcolor">
            <span>质量控制计划</span>
          </div>
          <div class="portlet-body">
            <el-form :model="planControlDto" ref="ruleForm" size="small" label-width="100px">
              <el-row :span="16">
                <el-col :span="16">
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="计划年份"
                        :rules="$filter_rules({required:true,trigger:'blur'})"
                        prop="planFlowDto.planYear"
                      >
                        <el-date-picker
                          v-model="planControlDto.planFlowDto.planYear"
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
                        <el-select v-model="planControlDto.typeId" class="w100">
                          <el-option
                            v-for="item in typeOptions"
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
                      <el-form-item
                        label="质量控制项目"
                        :rules="$filter_rules({required:true})"
                        prop="name"
                      >
                        <el-input v-model="planControlDto.name" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="方式"
                        :rules="$filter_rules({required:true})"
                        prop="controlMode"
                      >
                        <el-input v-model="planControlDto.controlMode" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="计划开始日期"
                        :rules="$filter_rules({required:true})"
                        prop="planFlowDto.startDate"
                      >
                        <el-date-picker
                          v-model="planControlDto.planFlowDto.startDate"
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
                          v-model="planControlDto.planFlowDto.endDate"
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
                        label="负责人"
                        :rules="$filter_rules({required:true})"
                        prop="chargePerson"
                      >
                        <el-input v-model="planControlDto.chargePerson" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="拟参与部门"
                        :rules="$filter_rules({required:true,trigger:'change'})"
                        prop="office"
                      >
                        <el-select
                          v-model="planControlDto.office"
                          placeholder="请选择"
                          multiple
                          clearable
                          class="w100"
                        >
                          <el-option
                            v-for="item in offices"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="拟参与人员"
                    prop="hrStaffDtoList"
                    v-if="planControlDto.office.length > 0"
                    :rules="$filter_rules({required:true,trigger:'change'})"
                  >
                    <el-tree
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
                  <el-button size="mini" type="success" @click="save('ruleForm')" :loading="planButtonLoading">保存</el-button>
                </el-col>
                <el-col :span="2">
                  <el-button size="mini" type="primary" @click="back">返回</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="质量控制计划统计" name="planStatistics">
        <div class="search-box" style="overflow: hidden">
          <!--@keyup.enter.native="search"-->
          <el-form :model="statisticRecord" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="统计类型">
                  <select-from-enum
                    type="plan.PlanStatType"
                    :model.sync="statisticRecord.statType"
                    :has-default="true"
                    class-name="w100"
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划类型">
                  <el-select v-model="statisticRecord.planTypeId" clearable class="w100">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="姓名">
                  <el-input v-model="statisticRecord.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划年份" class="margin0">
                  <el-date-picker
                    v-model="statisticRecord.planYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="计划年份"
                    class="w100"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-pie-chart"
                class="count"
                style="float:right"
                @click="count()"
              >统 计</el-button>
            </el-row>
          </el-form>
        </div>
        <el-table :data="statisticRecordData" stripe fit border size="mini" v-if="planStat" :max-height="StatTableHeight">
          <el-table-column prop="statPlanDto.planYear" label="年份" align="center"></el-table-column>
          <el-table-column prop="statPlanDto.annualPlanCounts" label="年度计划数" align="center"></el-table-column>
          <el-table-column prop="statPlanDto.annualPlanFinishCounts" label="年度计划完成数" align="center"></el-table-column>
          <el-table-column prop="statPlanDto.planAddCounts" label="新增计划数" align="center">
            <template slot-scope="scope">{{scope.row.statPlanDto.planAddCounts}}</template>
          </el-table-column>
          <el-table-column prop="statPlanDto.planAddFinishCounts" label="新增计划完成数" align="center"></el-table-column>
          <el-table-column prop="statPlanDto.totalPlanCounts" label="总计划数" align="center"></el-table-column>
          <el-table-column prop="statPlanDto.totalPlanFinishCounts" label="总完成数量" align="center"></el-table-column>
        </el-table>
        <el-table :data="statisticRecordData" stripe fit border v-if="personStat" size="mini" :max-height="StatTableHeight">
          <el-table-column prop="statPersonDto.planYear" label="年份" align="center"></el-table-column>
          <el-table-column prop="statPersonDto.name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="statPersonDto.controlTimes" label="参与质量控制次数" align="center"></el-table-column>
          <el-table-column prop="type" label="操作" align="center" v-if="personStat">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click="openStatRecordDiag(scope.row, scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="secondTotal"
          :current-page.sync="secondCurrent"
          :page-sizes="pageSizes"
          :page-size.sync="secondPageSize"
          layout="total, sizes, prev, pager, next"
          style="float:right"
          background
        ></el-pagination>

        <el-dialog :visible.sync="yearRecordDialog">
          <!--<el-table :data="statSpecificData" stripe fit border>
            <el-table-column prop="personName" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="recordDate" label="质量控制项目开展日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="planControlName" label="质量控制项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="description" label="质量控制工作描述" show-overflow-tooltip></el-table-column>
          </el-table>-->
          <StatDetail port="getSpecificControlRecords" ref="statDetail">
            <el-table-column prop="personName" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="recordDate" label="质量控制项目开展日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="planControlName" label="质量控制项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="description" label="质量控制工作描述" show-overflow-tooltip></el-table-column>
          </StatDetail>
         <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="yearRecordDialog = false">取 消</el-button>
            <el-button type="primary" @click="yearRecordDialog = false">确 定</el-button>
          </span>-->
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PlanTable from "./components/PlanTable";
import api from "../../api/index";
import PictrueWall from "../../components/common/PictureWall";
import FileWall from "../../components/common/FileWall";
import RecordTable from "./components/RecordTable";
import { myMixin } from "./mixins/myMixin";
import StatDetail from './components/StatDetail'

export default {
  name: "PlanControlManagement.vue",
  mixins: [myMixin],
  data() {
    return {
      searchForm: {},
      firstTotal: 0,
      secondTotal: 0,
      firstCurrent: 1,
      firstPageSize: 30,
      secondCurrent: 1,
      secondPageSize: 30,
      pageSizes: [30, 50, 80, 100],
      progressStatus: "",
      searchData: {
        planYear: "",
        progressStatus: "",
        targetObject: "",
        trainUnit: "",
        typeId: "",
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
        "质量控制项目",
        "方式",
        "负责人",
        "计划年份",
        "参与人员",
        "进度状态",
        "任务状态",
        "驳回理由",
      ],
      exportReocrdTitle: [
        "日期",
        "参与人员",
        "质量控制记录名称",
        "质量控制工作描述",
      ],
      selectRows: [],
      planControlDto: {
        planFlowDto: {
          planYear: "",
          startDate: "",
          endDate: "",
        },
        sysOfficeDtoList: [],
        hrStaffDtoList:[],
        office: [],
        name: "",
        staffDtos: [],
        typeId: "",
        controlMode: "",
        chargePerson: "",
      },
      offices: [], //参培部门,
      officeStaffs: [], //参培部门人员,
      typeOptions: [], //计划类型
      activeName: "trainPlan",
      defaultExpandedKeys: [], //默认展开的节点,
      defaultCheckedKeys: [],
      defaultProps: {
        children: "hrStaffDtoList",
        label: "name",
      },
      apartment: "参培部门",
      rejectDialog: false,
      tableData: [], //质量控制计划列表,
      recordData: [], //培训记录列表
      recordDto: {
        recordDate: "",
      },
      recordStaffs: [],
      recordSearchForm: {},
      trainingRecordDialog: false,
      yearRecordDialog: false,
      recordFormDialog: false,
      isViewAttachment: false,
      statusDiag: false,
      imgList: [], //请求回来的图片
      fileList: [],
      rejectReason: "", //驳回理由
      planFlowProgressStatus: "",
      isAdd: true,
      statisticRecord: {
        planTypeId: "",
        planYear: "",
        targetObject: "",
        statType: "",
      }, //统计提交表单
      personStat: true,
      planStat: false,
      statisticRecordData: [], //统计质量控制计划
      statSpecificData: [], //统计质量控制记录，
      activePlan: {},
      planButtonLoading: false,
    };
  },
  inject: ["hasPermission"],
  methods: {
    /*-----------------------------------------activeName == trainPlan--------------------------------------*/
    edit(row) {
      if (
        row.planFlowDto.planStatus &&
        row.planFlowDto.planStatus.value == "LOCK"
      ) {
        this.$message.error("该计划已锁定,禁止修改");
        return;
      }
      this.isAdd = false;
      this.activeName = "changelist";
      this.planControlDto = JSON.parse(JSON.stringify(row));
      let office = row.sysOfficeDtos.map((item) => item.id);
      this.$set(this.planControlDto, "office", office);
      this.defaultCheckedKeys = row.hrStaffDtoList.map(
        (item) => item.staffId || item.id
      );
    },
    save(dom) {
      //新增质量控制计划数据

      this.$refs[dom].validate((valid) => {
        if (valid) {
          //提交数据
          this.planButtonLoading = true;
          this.$post(api.submitControlPlan, this.planControlDto)
            .then((res) => {
              this.planButtonLoading = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.activeName = "trainPlan";
              this.search();
              this.planControlDto = {
                planFlowDto: {
                  planYear: "",
                  startDate: "",
                  endDate: "",
                },
                sysOfficeDtoList: [],
                hrStaffDtoList:[],
                office: [],
                staffDtos: [],
                name: "",
                controlMode: "",
                typeId: "",
                chargePerson: "",
              };
            })
            .catch((e) => console.log(e));
        }
      });
      /*this.planTrainDto.office = [];*/
    },
    //获取质量控制记录
    getRecord() {
      this.recordData = [];
      this.recordSearchForm.planControlId = this.activePlan.id;
      this.recordSearchForm["pageDto.current"] = 1;
      this.recordSearchForm["pageDto.pageSize"] = 30;
      let searchForm = JSON.parse(JSON.stringify(this.recordSearchForm));
      /*this.$get(api.getControlRecords, searchForm).then(res => {
        this.recordData = res.data.list;
      });*/
      this.$nextTick(() => {
        this.$refs.recordTable.init(searchForm);
      });
    },
    enterRecord(row, index) {
      this.activePlan = row;
      this.trainingRecordDialog = true;
      this.getRecord();
      this.$get(api.getAllPeople).then((res) => {
        this.recordStaffs = res.data;
      });
      /*this.recordStaffs*/
    },
    back() {
      this.activeName = 'trainPlan';
    },
    search(data) {
      /*/!*this.trainingRecordDialog = true;*!/
      //查询
      if (!data) {
        this.searchData["pageDto.current"] = 1;
        this.searchData["pageDto.pageSize"] = 30;
      } else {
        this.searchData["pageDto.current"] = data.current;
        this.searchData["pageDto.pageSize"] = data.pageSize;
      }
      let searchForm = JSON.parse(JSON.stringify(this.searchData));
      searchForm.progressStatus =
        searchForm.progressStatus && searchForm.progressStatus.value;
      this.$get(api.getControlPlans, searchForm).then(res => {
        this.tableData = res.data.list;
        this.firstTotal = res.data.total;
      });*/

      if (this.progressStatus) {
        this.searchData.progressStatus = this.progressStatus.value;
      } else {
        this.searchData.progressStatus = "";
      }
      this.$refs.planTable.init(this.searchData);
    },
    reject(sign) {
      if (sign == "N") {
        this.rejectDialog = false;
      } else {
        let rejectData = [];
        this.selectRows.forEach((item) => {
          rejectData.push({
            rejectReason: this.rejectReason,
            id: item.planFlowDto.id,
            planStatus: "REJECT",
          });
        });
        this.$put(api.reject, rejectData).then((res) => {
          this.$message.success("驳回成功!");
          this.rejectDialog = false;
          this.rejectReason = "";
          this.$refs.planTable.init(this.searchData);
        });
      }
    },
    openRejectDialog() {
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        if (
          this.selectRows.every(
            (item) => item.planFlowDto.planStatus.value == "SUBMITTED"
          )
        ) {
          this.rejectDialog = true;
        } else {
          this.$message.error("计划还未提交，不能驳回！");
        }
      }
    },
    lock() {
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        let lockData = [];
        this.selectRows.forEach((item) => {
          lockData.push({ id: item.planFlowDto.id, planStatus: "LOCK" });
        });
        this.$put(api.reject, lockData).then((res) => {
          this.$message.success("锁定成功!");
          this.$refs.planTable.init(this.searchData);
        });
      }
    },
    unlock() {
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        let unlockData = [];
        this.selectRows.forEach((item) => {
          unlockData.push({ id: item.planFlowDto.id, planStatus: "UNLOCK" });
        });
        this.$put(api.reject, unlockData).then((res) => {
          this.$message.success("取消锁定任务!");
          this.$refs.planTable.init(this.searchData);
        });
      }
    },
    openStatus() {
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        this.statusDiag = true;
      }
    },
    confirmStatus(sign) {
      if (sign == "N") {
        this.statusDiag = false;
      } else {
        let statusData = [];
        this.selectRows.forEach((item) => {
          statusData.push({
            id: item.planFlowDto.id,
            progressStatus: this.planFlowProgressStatus,
          });
        });
        this.$put(api.reject, statusData).then((res) => {
          this.$message.success("操作成功!");
          this.$refs.planTable.init(this.searchData);
          this.statusDiag = false;
        });
      }
    },
    submitPlan() {
      //提交培训计划
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        let submitData = [];
        this.selectRows.forEach((item) => {
          submitData.push({ id: item.planFlowDto.id, planStatus: "SUBMITTED" });
        });
        this.$put(api.reject, submitData).then((res) => {
          this.$message.success("提交计划成功!");
          this.$refs.planTable.init(this.searchData);
        });
      }
    },
    handleSelectionChange(val) {
      //选中的计划
      this.selectRows = val.reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      },[]);
    },
    handleNodeClick(data1, nodes) {
      let ids = [];
      //参培人员
      nodes.checkedNodes.forEach((item) => {
        if (!item.hrStaffDtoList) {
          ids.push({
            id: item.id,
          });
        }
      });
      this.planControlDto.staffDtos = ids;
      this.planControlDto.hrStaffDtoList = ids;
      this.$refs["ruleForm"].validateField('hrStaffDtoList'); //表单部分验证
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
      this.recordDto.otherFileDtos = this.recordDto.otherFileDtos.filter(
        (e) => {
          return file.url != e.path;
        }
      );
    },
    handleRemoveImg(file, fileList) {
      this.imgList = fileList;
      this.recordDto.otherFileDtos = this.recordDto.otherFileDtos.filter(
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
    /*  if (file.raw.type != "image/jpeg") {
        this.$message.error("文件格式错误");
        return;
      }*/
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

    handleFileUpload(file, fileList) {
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
    confirmRecord() {
      //压缩附件
      this.$refs.recordForm.validate((v) => {
        if(v) {
          let loadingInstance = this.$loading({ fullscreen: true });
          this.AsyncfileArr = [];
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
                this.recordDto.otherFileDtos.push({ image: img });
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
                this.recordDto.otherFileDtos.push({
                  file: {
                    name: v.name,
                    fileType: filetype,
                    base64Str: res,
                  },
                });
                resolve();
              });
            });
          });
          //保存培训记录
          this.recordDto.controlId = this.activePlan.id;
          let hrStaffDtoList = [];
          this.recordDto.staffIds.forEach((item) => {
            hrStaffDtoList.push({ id: item });
          });
          this.recordDto.hrStaffDtoList = hrStaffDtoList;
          Promise.all([f1, f2]).then((res) => {
            this.$post(api.confirmControlRecord, this.recordDto)
                    .then((res) => {
                      loadingInstance.close();
                      this.$message.success("保存成功");
                      this.recordFormDialog = false;
                      this.recordDto = {
                        description: "",
                        staffIds: [],
                        otherFileDtos: [],
                        trainDate: "",
                        trainUnit: "",
                        trainName: "",
                        trainType: "",
                        staffDtos: [],
                      };
                      this.getRecord();
                      console.log(res);
                    })
                    .catch((e) => {
                      this.$message.error("服务器内部错误");
                      loadingInstance.close();
                      console.log(e.errMsg);
                    });
          });
        }
      })



    },
    exportRecord() {
      //导出记录列表
      this.$refs.recordTable.exportRecord({ id: this.activePlan.id });
    },
    viewAttachment(val) {
      //查看附件
      this.isViewAttachment = true;
      this.genFileAndImgList(val);
    },
    addRecord() {
      this.recordFormDialog = true;
      this.recordDto = {
        description: "",
        staffIds: [],
        otherFileDtos: [],
        name: "",
        staffDtos: [],
        recordDate: "",
      };
      this.imgList = [];
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs['recordForm'].clearValidate();
      })
    },
    editRecord(row) {
      this.recordFormDialog = true;
      this.recordDto = JSON.parse(JSON.stringify(row));
      let staffIds = row.hrStaffDtoList.map((item) => item.id);
      this.$set(this.recordDto, "staffIds", staffIds);
      this.genFileAndImgList(row);
    },
    async deleteRecord(row) {
      let id = row.id;
      let api1 = api.delControlRecord + "/" + id;
      let p = await this.deleteRow1(row, api1);
      if (p) {
        this.getRecord();
      }
    },
    deleteRow1(row, api1) {
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
    genFileAndImgList(row) {
      let reg = "/.gif|.jpeg|.png|.jpg|.bmp/i";
      this.imgList = [];
      this.fileList = [];
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
    deleteRow(row, index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$del(api.deleteControlPlan + `/${row.id}/${row.planFlowDto.id}`)
          .then((res) => {
            this.$message.success('删除成功！');
            this.search();
          })
          .catch((e) => {
            this.$message.error(e.errMsg);
          });
      }).catch((e) => {
        console.log(e)
      })
    },
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
    /* -------------------------------activeName = planStatistics-------------------------*/
    statRecordInit(data) {
      //获取统计培训计划列表
      let record = JSON.parse(JSON.stringify(this.statisticRecord));
      if (!data) {
        record["pageDto.current"] = 1;
        record["pageDto.pageSize"] = 30;
        this.secondCurrent = 1;
        this.secondPageSize = 30;
      } else {
        record["pageDto.current"] = data.current;
        record["pageDto.pageSize"] = data.pageSize;
      }
      record.statType = record.statType.value;
      this.$get(api.getStatControlPlan, record).then((res) => {
        this.secondTotal = res.data.total;
        this.statisticRecordData = res.data.list;
        if (
          this.statisticRecordData[0] &&
          this.statisticRecordData[0].statPersonDto
        ) {
          this.personStat = true;
          this.planStat = false;
        } else {
          this.personStat = false;
          this.planStat = true;
        }
      });
    },
    count(data) {
      //统计
      this.statRecordInit(data);
    },
    openStatRecordDiag(row, index) {
      this.yearRecordDialog = true;
      /*statData*/
      let staffId = null;
      let planYear = null;
      if (this.personStat) {
        staffId = row.statPersonDto.staffId;
        planYear = row.statPersonDto.planYear;
      }
      /*this.$get(api.getSpecificControlRecords, {
        planYear,
        staffId,
      }).then((res) => {
        this.statSpecificData = res.data.list;
      });*/
      this.$nextTick(() => {
        this.$refs['statDetail'].init(planYear, staffId);
      })
    },
  },
  watch: {
    imgList(newVal, oldVal) {
      newVal = newVal.concat(this.fileList);
      let urls = newVal.map((item) => item.url).join(",");
      this.recordDto.otherFileDtos = this.recordDto.otherFileDto && this.recordDto.otherFileDtos.filter(
        (item) => urls.includes(item.path)
      );
    },
    fileList(newVal, oldVal) {
      newVal = newVal.concat(this.imgList);
      let urls = newVal.map((item) => item.url).join(",");
      this.recordDto.otherFileDtos = this.recordDto.otherFileDtos && this.recordDto.otherFileDtos.filter(
        (item) => urls.includes(item.path)
      );
    },
    "planControlDto.office"(newVal, oldVal) {
      let str = newVal.join(",");
      //参培部门
      this.planControlDto.sysOfficeDtoList =
        newVal &&
        newVal.map((item) => {
          return { id: item };
        });
      this.planControlDto.sysOfficeDtos =
        newVal &&
        newVal.map((item) => {
          return { id: item };
        });
      this.$get(api.officeStaff, { officeIds: str }).then((res) => {
        this.officeStaffs = res.data;
        this.defaultExpandedKeys =
          this.officeStaffs && this.officeStaffs.map((item) => item.id);
      });
    },
    activeName(newVal, oldVal) {
      if (oldVal == "changelist") {
        this.isAdd = true;
      }
      if (newVal == "addlist") {
        this.$refs["ruleForm"].resetFields();
      }
      if (newVal == "planStatistics") {
        this.statRecordInit();
      }
    },
    secondCurrent(newVal, oldVal) {
      this.count({ current: newVal, pageSize: this.secondPageSize });
    },
    secondPageSize(newVal, oldVal) {
      this.count({ current: this.secondCurrent, pageSize: newVal });
    },
  },
  components: {
    PlanTable,
    PictrueWall,
    FileWall,
    RecordTable,
    StatDetail
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "质量控制计划");
    //获取计划类型
    this.$get(api.type).then((res) => {
      this.typeOptions = res.data;
    });

    //获取拟参与部门
    this.$get(api.trainOffice).then((res) => {
      this.offices = res.data;
    });
  },
};
</script>

<style scoped>
.title-bgcolor {
  background-color: #f5f7fa;
}

.ccolor:hover {
  color: #ff3669;
}

.icon-wrap {
  font-size: 19px;
}
</style>