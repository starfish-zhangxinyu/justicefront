<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="培训计划列表" name="trainPlan">
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
                <el-form-item label="针对对象">
                  <el-input v-model="searchData.targetObject" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="培训进度">
                  <select-from-enum
                    type="plan.FlowProgressStatus"
                    :model.sync="progressStatus"
                    clearable
                    class-name="w100"
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="培训方" class="margin0">
                  <el-input v-model="searchData.trainUnit" />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="计划年份" class="margin0">
                  <el-date-picker
                    v-model="searchData.planYear"
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
          port="getPlans"
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
          :maxHeight="tableHeight"
          tag="TRAIN"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="type" label="计划类型" show-overflow-tooltip width="100px;"></el-table-column>
          <el-table-column prop="name" label="培训目标" show-overflow-tooltip width="150px;"></el-table-column>
          <el-table-column prop="content" label="培训内容" show-overflow-tooltip width="150px;"></el-table-column>
          <el-table-column prop="targetObject" label="针对对象" show-overflow-tooltip width="150px;"></el-table-column>
          <el-table-column prop="trainUnit" label="培训方" show-overflow-tooltip width="150px;"></el-table-column>
          <el-table-column
            prop="planFlowDto.planYear"
            label="计划年份"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column prop="trainMode" label="培训方式" show-overflow-tooltip width="100px;"></el-table-column>
          <el-table-column prop="offices" label="参培人员" show-overflow-tooltip width="150px;">
            <template slot-scope="scope">{{scope.row.staffDtos.map(i => i.name).join(',')}}</template>
          </el-table-column>
          <el-table-column
            prop="planFlowDto.progressStatus.label"
            label="进度状态"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column
            prop="planFlowDto.planStatus.label"
            label="任务状态"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column
            prop="planFlowDto.rejectReason"
            label="驳回理由"
            show-overflow-tooltip
            width="100px;"
          ></el-table-column>
          <el-table-column prop="type" label="操作" width="250" align="center">
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
            @close="recordFormDialogClose"
          >
            <div class="portlet-header title-bgcolor">
              <div v-if="isEditRecord">编辑培训记录</div>
              <div v-else>新增培训记录</div>
            </div>
            <div class="portlet-body">
              <el-form :model="recordDto" size="small" label-width="100px" ref="recordForm">
                <el-row>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      label="培训日期"
                      prop="trainDate"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-date-picker
                        v-model="recordDto.trainDate"
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
                      label="培训方"
                      prop="trainUnit"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-input v-model="recordDto.trainUnit" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      label="培训记录名称"
                      prop="trainName"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-input v-model="recordDto.trainName" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      label="培训类型"
                      prop="trainType"
                      :rules="$filter_rules({required:true,trigger:'blur'})"
                    >
                      <el-input v-model="recordDto.trainType" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="innerPanClass.sm" :md="innerPanClass.md" :xl="innerPanClass.xl">
                    <el-form-item
                      label="参培人员"
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
                </el-row>
                <el-form-item
                  label="培训情况描述"
                  prop="description"
                  :rules="$filter_rules({required:true,trigger:'blur'})"
                >
                  <el-input type="textarea" v-model="recordDto.description" />
                </el-form-item>
                <br />
                <el-form-item label="文件附件上传" prop="otherFile">
                  <el-upload
                    action="#"
                    class="upload-demo"
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
                <br />
                <el-form-item label="图片附件上传" prop="otherFile">
                  <el-upload
                    action="#"
                    class="upload-demo"
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
                      :loading="recordButtonLoading"
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
                  <span>培训记录</span>
                  <el-button
                    type="primary"
                    @click="exportRecord"
                    style="float:right;margin-right:20px;margin-top:8px;"
                    size="mini"
                  >导出</el-button>
                  <el-button
                    type="primary"
                    @click="addRecord"
                    icon="el-icon-plus"
                    style="float:right;margin-right:20px;margin-top:8px;"
                    size="mini"
                  >增加</el-button>
                </div>
                <div class="portlet-body">
                  <!--<el-table :data="recordData" size="mini"
                            stripe fit border style="width: 100%"
                            @selection-change="handleRecordSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="trainDate" label="培训日期"></el-table-column>
                    <el-table-column prop="trainUnit" label="培训方"></el-table-column>
                    <el-table-column prop="trainName" label="培训记录名称"></el-table-column>
                    <el-table-column prop="trainName" label="参培人员">
                      <template
                        slot-scope="scope"
                      >{{scope.row.staffDtos.map(i => i.name).join(',')}}</template>
                    </el-table-column>
                    <el-table-column prop="trainType" label="培训类型"></el-table-column>
                    <el-table-column prop="description" label="培训情况描述"></el-table-column>
                    <el-table-column label="附件列表">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="viewAttachment(scope.row)"
                        >查看</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="操作" width="120px">
                      <template slot-scope="scope">
                          <el-button icon="el-icon-edit" @click="editRecord(scope.row)" size="mini" type="warning" plain></el-button>
                          <el-button icon="el-icon-delete" @click="deleteRecord(scope.row)" size="mini" type="danger" plain></el-button>
                      </template>
                    </el-table-column>
                  </el-table>-->
                  <Record-table
                    port="getRecords"
                    ref="recordTable"
                    :hasPaging="true"
                    postType="get"
                    :is-select="true"
                    :exportTitle="exportReocrdTitle"
                    tag="TRAIN"
                    :active-plan-id="activePlan.id"
                    planType="planTrainId"
                    max-height="400px"
                  >
                    <el-table-column type="selection" show-overflow-tooltip width="55"></el-table-column>
                    <el-table-column prop="trainDate" show-overflow-tooltip label="培训日期"></el-table-column>
                    <el-table-column prop="trainUnit" show-overflow-tooltip label="培训方"></el-table-column>
                    <el-table-column prop="trainName" show-overflow-tooltip label="培训记录名称"></el-table-column>
                    <el-table-column prop="trainName" show-overflow-tooltip label="参培人员">
                      <template
                        slot-scope="scope"
                      >{{scope.row.staffDtos.map(i => i.name).join(',')}}</template>
                    </el-table-column>
                    <el-table-column prop="trainType" show-overflow-tooltip label="培训类型"></el-table-column>
                    <el-table-column prop="description" show-overflow-tooltip label="培训情况描述"></el-table-column>
                    <el-table-column label="附件列表">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="viewAttachment(scope.row)">查看</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="操作" width="120px">
                      <template slot-scope="scope">
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
                      </template>
                    </el-table-column>
                  </Record-table>
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
              <div >
                <el-image
                        style="width: 100px; height: 100px;float:left;margin-left:30px;margin-top:20px;"
                        :src="item.url"
                        :preview-src-list="[item.url]"
                        v-for="item in imgList"
                        :key="item.url"
                ></el-image>
              </div>
              <!--<template>
                <el-table
                  ref="multipleTable"
                  :data="imgList"
                  tooltip-effect="dark"
                  style="width: 100%"
                >
                  <el-table-column type="index" width="45"></el-table-column>
                  <el-table-column label="图片" width="120" prop="url">
                    &lt;!&ndash; <div class="block" v-for="imgObj in imgList" :key="imgObj.url"> &ndash;&gt;
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
                </el-table>
              </template>-->
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
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column label="文件" prop="name" align="center">
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
      <el-tab-pane :label="isAdd?'培训计划添加':'培训计划编辑'" :name="isAdd?'addlist':'changelist'">
        <div class="portlet">
          <div class="portlet-header title-bgcolor">
            <span>培训计划</span>
          </div>
          <div class="portlet-body">
            <el-form :model="planTrainDto" ref="ruleForm" size="small" label-width="100px">
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
                          v-model="planTrainDto.planFlowDto.planYear"
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
                      <el-form-item
                        label="计划类型"
                        prop="typeId"
                        :rules="$filter_rules({required:true,trigger:'change'})"
                      >
                        <el-select v-model="planTrainDto.typeId" class="w100">
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
                        label="培训目标"
                        :rules="$filter_rules({required:true})"
                        prop="name"
                      >
                        <el-input type="textarea" v-model="planTrainDto.name" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="培训内容"
                        :rules="$filter_rules({required:true})"
                        prop="content"
                      >
                        <el-input type="textarea" v-model="planTrainDto.content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="针对对象"
                        :rules="$filter_rules({required:true})"
                        prop="targetObject"
                      >
                        <el-input type="textarea" v-model="planTrainDto.targetObject" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="培训方"
                        :rules="$filter_rules({required:true})"
                        prop="trainUnit"
                      >
                        <el-input type="textarea" v-model="planTrainDto.trainUnit" />
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
                          v-model="planTrainDto.planFlowDto.startDate"
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
                          v-model="planTrainDto.planFlowDto.endDate"
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
                        label="培训方式"
                        :rules="$filter_rules({required:true})"
                        prop="trainMode"
                      >
                        <el-input v-model="planTrainDto.trainMode" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" v-model="planTrainDto.remarks" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{span:16}">
                      <el-form-item
                        label="参培部门"
                        :rules="$filter_rules({required:true,trigger:'change'})"
                        prop="office"
                      >
                        <el-select
                          v-model="planTrainDto.office"
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
                  <el-form-item label="参培人员" prop="staffDtos" v-if="planTrainDto.office.length > 0" :rules="$filter_rules({required:true,trigger:'input'})">
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
      <el-tab-pane label="培训计划统计" name="planStatistics">
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
                @click="count()"
                style="float:right"
              >统 计</el-button>
            </el-row>
          </el-form>
        </div>
        <el-table :data="statisticRecordData" stripe fit border size="mini" v-if="planStat" :max-height="StatTableHeight">
          <el-table-column prop="planDto.planYear" label="年份" align="center"></el-table-column>
          <el-table-column prop="planDto.annualPlanCounts" label="年度计划数" align="center"></el-table-column>
          <el-table-column prop="planDto.annualPlanFinishCounts" label="年度计划完成数" align="center"></el-table-column>
          <el-table-column prop="planDto.planAddCounts" label="新增计划数" align="center">
            <template slot-scope="scope">{{scope.row.planDto.planAddCounts}}</template>
          </el-table-column>
          <el-table-column prop="planDto.planAddFinishCounts" label="新增计划完成数" align="center"></el-table-column>
          <el-table-column prop="planDto.totalPlanCounts" label="总计划数" align="center"></el-table-column>
          <el-table-column prop="planDto.totalPlanFinishCounts" label="总完成数量" align="center"></el-table-column>
        </el-table>
        <el-table :data="statisticRecordData" stripe fit border v-if="personStat" size="mini" :max-height="StatTableHeight">
          <el-table-column prop="personDto.planYear" label="年份" align="center"></el-table-column>
          <el-table-column prop="personDto.name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="personDto.trainTimes" label="参加培训次数" align="center"></el-table-column>
          <el-table-column prop="type" label="操作" align="center" v-if="personStat">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-document"
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

        <el-dialog :visible.sync="yearRecordDialog" @close="yearRecordDialog = false;">
          <StatDetail port="getSpecificRecords" ref="statDetail">
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trainDate" label="参加培训日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trainUnit" label="培训方" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trainName" label="培训记录名称" show-overflow-tooltip></el-table-column>
          </StatDetail>
          <!--<el-table :data="statSpecificData" stripe fit border size="mini">

          </el-table>-->
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PlanTable from "./components/PlanTable";
import api from "../../api/index";
import FileWall from "../../components/common/FileWall";
import PictrueWall from "../../components/common/PictureWall";
import RecordTable from "./components/RecordTable";
import StatDetail from './components/StatDetail'

import { myMixin } from "./mixins/myMixin";

export default {
  name: "PlanTrainManagement.vue",
  mixins:[myMixin],
  data() {
    return {
      activeName: "trainPlan",
      isAdd: true,
      statusDiag: false,
      trainingRecordDialog: false,
      yearRecordDialog: false,
      recordFormDialog: false,
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
      recordSearchForm: {},
      searchForm: {
        list: [
          {
            typeId: "",
            targetObject: "",
            trainUnit: "",
            planFlowDto: {
              planYear: "",
            },
          },
        ],
      },
      planTrainDto: {
        planFlowDto: {
          planYear: "",
          startDate: "",
          endDate: "",
        },
        sysOfficeDtoList: [],
        office: [],
        name: "",
        content: "",
        targetObject: "",
        trainUnit: "",
        trainMode: "",
        remarks: "",
        staffIds: [],
        staffDtos: [],
        typeId: "",
      },
      tableData: [], //培训计划列表
      recordData: [], //培训记录列表
      typeOptions: [], //计划类型
      offices: [], //参培部门,
      officeStaffs: [], //参培部门人员,
      rejectDialog: false,
      recordDto: {},
      recordStaffs: [],
      activePlan: {},
      statisticRecord: {
        planTypeId: "",
        planYear: "",
        targetObject: "",
        statType: "",
      },
      defaultProps: {
        children: "hrStaffDtoList",
        label: "name",
      },
      statisticRecordData: [], //统计培训计划
      statSpecificData: [], //统计培训记录
      selectRows: [],
      firstCurrent: 1,
      firstPageSize: 30,
      secondCurrent: 1,
      secondPageSize: 30,
      pageSizes: [30, 50, 80, 100],
      firstTotal: 0,
      secondTotal: 0,
      rejectReason: "", //驳回理由
      planFlowProgressStatus: "",
      progressStatus: "",
      personStat: true,
      planStat: false,
      defaultExpandedKeys: [], //默认展开的节点,
      defaultCheckedKeys: [],
      activeFileList: [], //附件列表,
      imgList: [],
      fileList: [],
      isViewAttachment: false,
      isEditRecord: false,
      exportTitle: [
        "计划类型",
        "培训目标",
        "培训内容",
        "针对对象",
        "培训方",
        "计划年份",
        "培训方式",
        "参培人员",
        "进度状态",
        "任务状态",
        "驳回理由",
      ],
      exportReocrdTitle: [
        "培训日期",
        "培训方",
        "培训记录名称",
        "参培人员",
        "培训类型",
        "培训情况描述",
      ],
      selectRecordRows: [],
      recordButtonLoading: false,
      planButtonLoading: false,

    };
  },
  inject: ["hasPermission"],
  methods: {
    exportRecord() {
      //导出记录列表
      this.$refs.recordTable.exportRecord({ id: this.activePlan.id });
    },
    deleteRecord(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$del(api.deleteRecord + "/" + row.id).then((res) => {
            this.$message.success('删除成功！');
            this.getRecord();
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
      link.setAttribute("download", 'jjjjj');
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
            console.log("failed. cause:", error);
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

    viewAttachment(val) {
      //查看附件
      this.isViewAttachment = true;
      this.genFileAndImgList(val);
    },
    recordFormDialogClose() {
      this.imgList = [];
      this.fileList = [];
    },
    openStatRecordDiag(row, index) {
      this.yearRecordDialog = true;
      /*statData*/
      let staffId = null;
      let planYear = null;
      if (this.personStat) {
        staffId = row.personDto.staffId;
        planYear = row.personDto.planYear;
      }
      /*this.$get(api.getSpecificRecords, {
        planYear,
        staffId,
      }).then((res) => {
        this.statSpecificData = res.data.list;
      });*/
      this.$nextTick(() => {
        this.$refs['statDetail'].init(planYear, staffId);
      })
    },
    editRecord(row) {
      this.isEditRecord = true;
      this.recordFormDialog = true;
      this.recordDto = JSON.parse(JSON.stringify(row));
      let staffIds = row.staffDtos.map((item) => item.id);
      this.$set(this.recordDto, "staffIds", staffIds);
      this.genFileAndImgList(row);
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
      this.recordDto.otherFileDtos = [];
      this.recordDto.otherFileDtos = fileList;
    },
    handleImgUpload(file, fileList) {
      //图片上传处理
      console.log(file, fileList)
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
      this.$refs["recordForm"].validate((v) => {
        if (v) {
          //压缩附件
          let loadingInstance = this.$loading({ fullscreen: true });
          this.recordButtonLoading = true;
          let f1 = null;
          let f2 = null;
          //上传图片
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
                let img = {
                  name: v.name,
                  imageType: filetype,
                  image: rst.base64,
                };
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
          this.recordDto.trainId = this.activePlan.id;
          let staffDtos = [];
          this.recordDto.staffIds.forEach((item) => {
            staffDtos.push({ id: item });
          });
          this.recordDto.staffDtos = staffDtos;
          Promise.all([f1, f2]).then((res) => {
            this.$post(api.confirmRecord, this.recordDto)
              .then((res) => {
                loadingInstance.close();
                this.recordButtonLoading = false;
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
    addRecord() {
      this.recordFormDialog = true;
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
    },
    getRecord() {
      this.recordSearchForm.planTrainId = this.activePlan.id;
      this.recordSearchForm["pageDto.current"] = 1;
      this.recordSearchForm["pageDto.pageSize"] = 30;
      let searchForm = JSON.parse(JSON.stringify(this.recordSearchForm));
      /*this.$get(api.getRecords, searchForm).then(res => {
        this.recordData = res.data.list;
      });*/
      this.$nextTick(() => {
        this.$refs.recordTable.init(searchForm);
      });
    },
    handleRecordSelectionChange(val) {
      //选中的培训记录
      this.selectRecordRows = val;
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
    reject(sign) {
      if (sign == "N") {
        this.rejectDialog = false;
      } else {
        let rejectData = [];
        this.selectRows.forEach((item) => {
          console.log(item.planFlowDto.id, "aaaaaaaaaaaassssssssssssssssssss");
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
    lock() {
      if (!this.selectRows.length) {
        this.$message({
          type: "error",
          message: "您还未选择计划！",
        });
      } else {
        let rejectData = [];
        this.selectRows.forEach((item) => {
          rejectData.push({ id: item.planFlowDto.id, planStatus: "LOCK" });
        });
        this.$put(api.reject, rejectData).then((res) => {
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
        let rejectData = [];
        this.selectRows.forEach((item) => {
          rejectData.push({ id: item.planFlowDto.id, planStatus: "UNLOCK" });
        });
        this.$put(api.reject, rejectData).then((res) => {
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
        let rejectData = [];
        this.selectRows.forEach((item) => {
          rejectData.push({
            id: item.planFlowDto.id,
            progressStatus: this.planFlowProgressStatus,
          });
        });
        this.$put(api.reject, rejectData).then((res) => {
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
      console.log(this.selectRows, "选择的计划");
    },
    search(data) {
      if (this.progressStatus) {
        this.searchData.progressStatus = this.progressStatus.value;
      } else {
        this.searchData.progressStatus = "";
      }
      this.$refs.planTable.init(this.searchData);
    },
    deleteRow(row, index) {
      console.log(row, "删除培训计划");
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$del(api.deletePlan + `/${row.id}/${row.planFlowDto.id}`)
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
    edit(row) {
      console.log(row, "编辑的计划");
      console.log(row.planFlowDto.planStatus.value, "编辑的计划");
      if (row.planFlowDto.planStatus.value == "LOCK") {
        this.$message.error("该计划已锁定,禁止修改");
        return;
      }
      this.isAdd = false;
      this.activeName = "changelist";
      this.planTrainDto = JSON.parse(JSON.stringify(row));
      /*this.planTrainDto = row;*/
      let office = row.sysOfficeDtoList.map((item) => item.id);
      this.$set(this.planTrainDto, "office", office);
      this.defaultCheckedKeys = row.staffDtos.map((item) => {
        return item.id;
      });
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
      this.planTrainDto.staffDtos = ids;
      this.planTrainDto.hrStaffDtoList = ids;
      this.$refs["ruleForm"].validateField('staffDtos'); //表单部分验证
      console.log(ids, "参培人员id");
    },
    save(dom) {
      //保存数据

      this.$refs[dom].validate((valid) => {
        if (valid) {
          //提交数据
          this.planButtonLoading = true;
          console.log(this.planTrainDto, "提交培训计划");
          this.$post(api.submitPlans, this.planTrainDto)
            .then((res) => {
              this.planButtonLoading = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.activeName = "trainPlan";
              this.search();
              this.planTrainDto = {
                planFlowDto: {
                  planYear: "",
                  startDate: "",
                  endDate: "",
                },
                sysOfficeDtoList: [],
                office: [],
                name: "",
                content: "",
                targetObject: "",
                trainUnit: "",
                trainMode: "",
                remarks: "",
                staffIds: [],
                typeId: "",
                staffDtos:[]
              };
            })
            .catch((e) => console.log(e));
        }
      });
      /*this.planTrainDto.office = [];*/
    },
    back() {
      this.activeName = "trainPlan";
    },
    count(data) {
      //统计
      console.log(this.statisticRecord, "this.statisticRecord");

      this.statRecordInit(data);
    },
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
      this.$get(api.statisticRecord, record).then((res) => {
        this.secondTotal = res.data.total;
        this.statisticRecordData = res.data.list;
        if (
          this.statisticRecordData[0] &&
          this.statisticRecordData[0].personDto
        ) {
          this.personStat = true;
          this.planStat = false;
        } else {
          this.personStat = false;
          this.planStat = true;
        }
        console.log(res.data.list, "统计培训计划");
      });
    },
  },
  components: {
    PlanTable,
    FileWall,
    PictrueWall,
    RecordTable,
    StatDetail
  },
  watch: {
    isViewAttachment: function (val) {
      if (!val) {
        this.fileList = [];
        this.imgList = [];
      }
    },
    "planTrainDto.office"(newVal, oldVal) {
      console.log(newVal, "培训部门id");
      let str = newVal.join(",");
      //参培部门
      this.planTrainDto.sysOfficeDtoList = newVal.map((item) => {
        return { id: item };
      });
      console.log(
        this.planTrainDto.sysOfficeDtoList,
        "this.planTrainDto.sysOfficeDtoList"
      );
      this.$get(api.officeStaff, { officeIds: str }).then((res) => {
        this.officeStaffs = res.data;
        this.defaultExpandedKeys = this.officeStaffs.map((item) => item.id);
        console.log("参培部门人员", this.officeStaffs);
      });
    },
    activeName(newVal, oldVal) {
      if (oldVal == "changelist") {
        this.isAdd = true;
      }
      if (newVal == "addlist") {
        this.$refs["ruleForm"].resetFields();
        this.defaultCheckedKeys = [];
      }
      if (newVal == "planStatistics") {
        this.statRecordInit();
      }
    },
    firstCurrent(newVal, oldVal) {
      this.search({ current: newVal, pageSize: this.firstPageSize });
    },
    firstPageSize(newVal, oldVal) {
      this.search({ current: this.firstCurrent, pageSize: newVal });
    },
    secondCurrent(newVal, oldVal) {
      this.count({ current: newVal, pageSize: this.secondPageSize });
    },
    secondPageSize(newVal, oldVal) {
      this.count({ current: this.secondCurrent, pageSize: newVal });
    },
    recordFormDialog: function (val) {
      if (!val) {
        this.isEditRecord = false;
      }
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "培训计划");
    //获取计划类型
    this.$get(api.type).then((res) => {
      this.typeOptions = res.data;
      console.log(this.typeOptions, "计划类型");
    });
    //获取参培部门
    this.$get(api.trainOffice).then((res) => {
      this.offices = res.data;
      console.log("参培部门", this.offices);
    });
  },
};
</script>

<style scoped>
.title-bgcolor {
  background-color: #f5f7fa;
}

.textarea /deep/ .el-form-item__content {
  width: calc(95% - 100px);
}

.ccolor:hover {
  color: #ff3669;
}
.icon-wrap {
  font-size: 19px;
}

/*.count {
  color: white;
  float: right;
  margin: 20px;
  margin-right: 50px;
}*/
</style>