<template>
  <div>
    <!-- <PageBar title1="员工管理" title2="员工列表"/> -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="员工列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form :model="searchForm" size="small" label-width="100px">
            <el-row>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="员工姓名">
                  <el-input
                    v-model.trim="searchForm.name"
                    @keyup.enter.native="search"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="所属部门">
                  <select-department
                    :model.sync="searchForm.office"
                  ></select-department>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="学历" prop="educationBackground">
                  <select-from-dict
                    className="w100"
                    :model.sync="searchForm.educationBackground"
                    data_type="education_background"
                    clearable
                  ></select-from-dict>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="专业类别">
                  <select-from-table
                    :model.sync="searchForm.professionCategoryId"
                    port="profession"
                    :modelId="true"
                    clearable
                    class-name="w100"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="员工状态">
                  <select-from-enum
                    type="hr.HrStaffStatus"
                    :model.sync="searchForm.staffStatus"
                    class-name="w100"
                    clearable
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="技术类别">
                  <!-- <select-from-dict className="w100" :model.sync="searchForm.qualificationType"
                                                      data_type="professional_title" clearable></select-from-dict>-->
                  <select-from-enum
                    type="base.QulificationType"
                    :model.sync="searchForm.qualificationType"
                    class-name="w100"
                    clearable
                  ></select-from-enum>
                </el-form-item>
              </el-col>
              <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                <el-form-item label="职务" class="margin0">
                  <select-from-dict
                    className="w100"
                    :model.sync="searchForm.techTitle"
                    data_type="professional_title"
                    clearable
                  ></select-from-dict>
                </el-form-item>
              </el-col>
              <!--<el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="职业状态" class="margin0">
                                    <el-select
                                            class="w100"
                                            v-model="searchForm.workStatus"
                                            placeholder="请选择"
                                            clearable>
                                        <el-option label="兼职" value="M"></el-option>
                                        <el-option label="全职" value="F"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>-->
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="search"
                style="color: white; float: right"
                >查询
              </el-button>
            </el-row>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          stripe
          border
          size="mini"
          fit
          style="width: 100%"
          :max-height="tableHeight"
        >
          <el-table-column prop="name" label="员工姓名"></el-table-column>
          <el-table-column prop="sex.label" label="性别"></el-table-column>
          <el-table-column prop="idCard" label="身份证号码"></el-table-column>
          <el-table-column prop="birthday" label="出生日期">
            <template slot-scope="scope">
              <span v-if="scope.row.birthday">{{
                divideDate(scope.row.birthday)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="educationBackground.label"
            label="学历"
          ></el-table-column>
          <el-table-column
            prop="professionalTitle.label"
            label="职务"
          ></el-table-column>
          <el-table-column
            prop="office.name"
            label="所属部门"
          ></el-table-column>
          <!--<el-table-column prop="contractType.label" label="职业状态"></el-table-column>-->
          <el-table-column
            prop="status.label"
            label="员工状态"
          ></el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit"
                plain
                size="mini"
                @click="edit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="primary"
                size="mini"
                class="el-icon-edit-outline"
                plain
                @click.native.prevent="changeStatus(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                size="mini"
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :visible="statusDiag"
          width="25%"
          title="修改员工状态"
          :close-on-click-modal="true"
          :close-on-press-escape="true"
          :show-close="false"
        >
          <el-form label-width="100px" size="mini">
            <el-form-item label="员工状态">
              <select-from-enum
                type="hr.HrStaffStatus"
                :model.sync="staffStatus"
                :has-default="true"
              ></select-from-enum>
            </el-form-item>
            <el-form-item
              label="入职时间"
              v-if="staffStatus && staffStatus.value == 'NORMAL'"
            >
              <el-date-picker
                class="w100"
                v-model="entryWorkDay"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="离职时间"
              v-if="staffStatus && staffStatus.value == 'LEAVE_OFFICE'"
            >
              <el-date-picker
                class="w100"
                v-model="leaveWorkDay"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmStatus('N')">取 消</el-button>
            <el-button type="primary" @click="confirmStatus('Y')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <div class="pagination-footer">
          <pagination
            v-if="isRender"
            :pcurrent.sync="page.current"
            :page.sync="page"
            :data.sync="tableData"
            :search.sync="searchdata"
            :sort.sync="tablesort"
            port="hrStaffListAll"
          >
          </pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane
        :label="isAdd ? '添加员工' : '修改员工信息'"
        :name="isAdd ? 'addlist' : 'changelist'"
      >
        <el-form
          :model="addForm"
          size="small"
          ref="staffForm"
          label-width="150px"
        >
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="员工姓名"
                prop="name"
                :rules="$filter_rules({ required: true })"
              >
                <el-input v-model.trim="addForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="性别"
                prop="sex"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <el-select
                  class="w100"
                  v-model="addForm.sex"
                  placeholder="请选择"
                >
                  <el-option label="男" value="M"></el-option>
                  <el-option label="女" value="F"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="身份证号"
                prop="idCard"
                :rules="$filter_rules({ required: true })"
              >
                <el-input v-model.trim="addForm.idCard"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  class="w100"
                  v-model="addForm.birthday"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="学历"
                prop="educationBackground"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-dict
                  className="w100"
                  :model.sync="addForm.educationBackground"
                  data_type="education_background"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="职务" prop="professionalTitle">
                <select-from-dict
                  className="w100"
                  :model.sync="addForm.professionalTitle"
                  data_type="professional_title"
                  clearable
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="技术职称"
                prop="techTitle"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-from-dict
                  className="w100"
                  :model.sync="addForm.techTitle"
                  data_type="tech_title_type"
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <!--                    <el-row>-->
          <!--                        <el-col :lg="{span:16}">-->
          <!--                            <el-form-item label="技术职称" prop="techTitle">-->
          <!--                                <el-input class="w100" v-model.trim="addForm.techTitle"></el-input>-->
          <!--                            </el-form-item>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="政治面貌" prop="politicalStatus">
                <select-from-dict
                  className="w100"
                  :model.sync="addForm.politicalStatus"
                  data_type="political_status"
                  clearable
                ></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item label="是否填写花名册详情" prop="isDisplayRoster">
                <el-radio-group v-model="addForm.isDisplayRoster">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16 }">
              <el-form-item
                label="所属部门"
                prop="office.name"
                :rules="$filter_rules({ required: true, trigger: 'change' })"
              >
                <select-department
                  className="w100"
                  :model.sync="addForm.office"
                ></select-department>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <div class="portlet">
                <div class="portlet-header title-bgcolor">
                  <span>技术人员信息</span>
                </div>
                <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="是否鉴定人"
                        prop="isAuthenticator"
                        :rules="
                          $filter_rules({ required: true, trigger: 'change' })
                        "
                      >
                        <el-radio-group v-model="addForm.isAuthenticator">
                          <el-radio label="Y">是</el-radio>
                          <el-radio label="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAuthenticator == 'Y'">
                    <el-col :span="16">
                      <el-form-item
                        label="鉴定人专业"
                        prop="authCategoryList"
                        :rules="$filter_rules({ required: true })"
                      >
                        <select-from-table
                          :model.sync="addForm.authCategoryList"
                          port="profession"
                          :multiple="true"
                          class-name="multiple-select"
                          :modelId="true"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAuthenticator == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="执业证号">
                        <el-input v-model="addForm.licenseNumber"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAuthenticator == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="证书开始日期">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.certificateStartDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAuthenticator == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="证书有效期">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.certificateExpireDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAuthenticator == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="证书图片">
                        <div>
                          <el-upload
                            action="#"
                            :multiple="true"
                            :auto-upload="false"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG"
                            :file-list="imgList"
                            list-type="picture-card"
                            :on-change="handleChange"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                          >
                            <i class="el-icon-plus"></i>
                          </el-upload>
                          <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="" />
                          </el-dialog>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--<el-row>
                                        <el-col :lg="{span:16}">
                                            <el-form-item label="职业状态" v-if="addForm.isAuthenticator=='Y'">
                                                <el-select class="w100" v-model="addForm.workStatus" placeholder="请选择">
                                                    <el-option label="兼职" value="M"></el-option>
                                                    <el-option label="全职" value="F"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>-->
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="是否鉴定助理"
                        prop="isAssist"
                        :rules="
                          $filter_rules({ required: true, trigger: 'change' })
                        "
                      >
                        <el-radio-group v-model="addForm.isAssist">
                          <el-radio label="Y">是</el-radio>
                          <el-radio label="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isAssist == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="鉴定助理专业"
                        prop="assistCategoryList"
                        :rules="$filter_rules({ required: true })"
                      >
                        <select-from-table
                          :model.sync="addForm.assistCategoryList"
                          :modelId="true"
                          port="profession"
                          class-name="multiple-select"
                          :multiple="true"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="是否复核人"
                        prop="isReviewer"
                        :rules="
                          $filter_rules({ required: true, trigger: 'change' })
                        "
                      >
                        <el-radio-group v-model="addForm.isReviewer">
                          <el-radio label="Y">是</el-radio>
                          <el-radio label="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isReviewer == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="复核人专业"
                        prop="reviewerCategoryList"
                        :rules="$filter_rules({ required: true })"
                      >
                        <select-from-table
                          :model.sync="addForm.reviewerCategoryList"
                          port="profession"
                          :modelId="true"
                          class-name="multiple-select"
                          :multiple="true"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="是否授权签字人"
                        prop="isSignatory"
                        :rules="
                          $filter_rules({ required: true, trigger: 'change' })
                        "
                      >
                        <el-radio-group v-model="addForm.isSignatory">
                          <el-radio label="Y">是</el-radio>
                          <el-radio label="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isSignatory == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="授权签字人专业"
                        prop="signatoryCategoryList"
                        :rules="$filter_rules({ required: true })"
                      >
                        <select-from-table
                          :model.sync="addForm.signatoryCategoryList"
                          port="profession"
                          :modelId="true"
                          class-name="multiple-select"
                          :multiple="true"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="是否签发人"
                        prop="isIssuer"
                        :rules="
                          $filter_rules({ required: true, trigger: 'change' })
                        "
                      >
                        <el-radio-group v-model="addForm.isIssuer">
                          <el-radio label="Y">是</el-radio>
                          <el-radio label="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="addForm.isIssuer == 'Y'">
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="签发人专业"
                        prop="issuerCategoryList"
                        :rules="$filter_rules({ required: true })"
                      >
                        <select-from-table
                          :model.sync="addForm.issuerCategoryList"
                          port="profession"
                          :modelId="true"
                          class-name="multiple-select"
                          :multiple="true"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="addForm.isDisplayRoster === 1">
            <el-col :span="20">
              <div class="portlet">
                <div class="portlet-header title-bgcolor">
                  <span>花名册详细信息</span>
                </div>
                <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                  <el-row>
                    
                    <!-- :rules="$filter_rules({ required: true })" -->
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="工号" prop="jobNo">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.jobNo"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="毕业院校">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.graduateSchool"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="专业">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.major"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="毕业时间">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.graduateDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="入职时间" prop="hireDate">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.hireDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="工（司）龄">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.workYear"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="合同类型" prop="contractType">
                        <select-from-dict
                          className="w100"
                          :model.sync="addForm.contractType"
                          data_type="contract_type"
                        ></select-from-dict>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="员工状态" prop="status">
                        <select-from-enum
                          type="hr.HrStaffStatus"
                          :model.sync="addForm.status"
                          class="statusStyle"
                        ></select-from-enum>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="合同年限" prop="contractYear">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.contractYear"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="合同到期时间"
                        prop="contractExpireDate"
                      >
                        <el-date-picker
                          class="w100"
                          v-model="addForm.contractExpireDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="签订合同次数">
                        <el-input
                          placeholder="请输入"
                          v-model="addForm.contractNum"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item
                        label="最后一次合同签订日期"
                        prop="contractLastDate"
                      >
                        <el-date-picker
                          class="w100"
                          v-model="addForm.contractLastDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="首次参加鉴定领域时间">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.firstAuthDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="离职时间">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.leaveDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="{ span: 16 }">
                      <el-form-item label="转正时间">
                        <el-date-picker
                          class="w100"
                          v-model="addForm.becomeRegularDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <div class="portlet">
                <div class="portlet-header title-bgcolor">
                  <span>证书信息</span>
                  <el-button
                    type="primary"
                    class="el-icon-plus"
                    size="mini"
                    style="margin-right: 10px; float: right; margin-top: 10px"
                    @click="addCetificate"
                    >增加</el-button
                  >
                </div>
                <div class="portlet-body" style="padding: 8px 8px 8px 8px">
                  <el-table
                    fit
                    :data="addForm.hrStaffCertificates"
                    width="100%"
                    border
                  >
                    <el-table-column
                      prop="prop"
                      label="证书名称"
                      width="width"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-input
                          placeholder="请输入"
                          v-model="scope.row.name"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="prop"
                      label="发证单位"
                      width="width"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-input
                          placeholder="请输入"
                          v-model="scope.row.issueUnit"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="prop"
                      label="发证日期"
                      width="width"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-date-picker
                          class="w100"
                          v-model="scope.row.issueDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="prop"
                      label="证书有效期"
                      width="width"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-date-picker
                          class="w100"
                          v-model="scope.row.validDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="上传证书附件"
                      width="150px"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          size="mini"
                          @click="openDiag(scope.$index)"
                          >上传证书附件</el-button
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="prop"
                      label="操作"
                      width="70px"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteCetificate(scope.$index)"
                          plain
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-dialog
                    title="附件上传"
                    :visible.sync="annexVisible"
                    width="30%"
                  >
                    <el-upload
                      class="upload-demo"
                      action="#"
                      :multiple="true"
                      :on-change="
                        (params, fileList) =>
                          handleChangeCetificate(params, fileList)
                      "
                      :auto-upload="false"
                      :show-file-list="false"
                      list-type="picture"
                      @on-success="cetificateSuccess"
                      @on-error="cetificateError"
                    >
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        style="margin: 10px"
                        >上传证书附件</el-button
                      >
                    </el-upload>
                    <FileWall :model.sync="activeFileList" isType2></FileWall>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="annexVisible = false">取 消</el-button>
                      <el-button type="primary" @click="confirm"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="save('staffForm')"
              :loading="isLoading"
              ><i class="fa fa-save"></i> 保存
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              class="save-btn"
              @click="activeName = 'list'"
              ><i class="el-icon-arrow-left"></i> 返回
            </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="员工导入" name="importList">
        <el-form
          :model="templateFile"
          size="small"
          ref="importForm"
          :rules="rule"
          label-width="110px"
        >
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="下载模板">
                <el-button type="primary" @click="downTemplate"
                  >下载模板<i class="el-icon-download"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{ span: 16, offset: 4 }">
              <el-form-item label="模板文件" prop="file">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-change="handleTemplateChange"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".xlsx"
                  style="width: 100%"
                >
                  <el-input v-model="templateFile.name" style="width: 100%">
                    <template slot="prepend">请选择文件</template>
                  </el-input>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="10">
            <el-button
              type="success"
              size="mini"
              class="save-btn"
              @click="saveImport('importForm')"
              ><i class="fa fa-save"></i> 保存
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              class="save-btn"
              @click="activeName = 'list'"
              ><i class="el-icon-arrow-left"></i> 返回
            </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="人员管评数据统计" name="dataStatic">
        <div class="search-box" style="overflow: hidden">
          <el-row>
            <el-form
              :model="countForm"
              ref="importForm"
              size="small"
              :inline="true"
              label-width="100px"
            >
              <el-form-item label="姓名">
                <el-input type="primary" class="w215" v-model="countForm.name">
                </el-input>
              </el-form-item>
              <el-form-item label="年份">
                <el-date-picker
                  v-model="countForm.planYear"
                  type="year"
                  value-format="yyyy"
                  placeholder="年份"
                ></el-date-picker>
              </el-form-item>
              <el-button type="primary" size="small" @click="count"
                >统 计</el-button
              >
            </el-form>
          </el-row>
        </div>
        <el-table
          :data="countTable"
          stripe
          fit
          border
          style="width: 100%"
          size="mini"
        >
          <el-table-column
            prop="planYear"
            label="年份"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="controlTimes"
            label="参与质量控制次数"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="controlSuperviseTimes"
            label="参与质量监督次数"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="trainTimes"
            label="参与培训次数"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="examTimes"
            label="被考核次数"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <el-pagination
          :total="countTotal"
          :current-page.sync="countCurrent"
          :page-sizes="page.pageSizes"
          :page-size.sync="countPageSize"
          layout="total, sizes, prev, pager, next"
          style="float: right"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "../../api/index";
import Select2 from "../../components/common/Select2";
import common from "../../../static/js/common.js";
import FileWall from "../../components/common/FileWall";

export default {
  name: "StaffManage",
  components: { Select2: Select2, FileWall: FileWall },
  data() {
    var nameDistinct = (rule, value, callback) => {
      if (
        this.templateFile.name &&
        this.templateFile.name.indexOf("xlsx") != -1
      ) {
        callback();
      } else {
        callback(new Error("请上传excel格式的模板文件"));
      }
    };
    return {
      activeName: "list",
      isAdd: true,
      tableData: [],
      tablesort: null,
      searchdata: {},
      page: {
        pageSizes: [25, 30, 50, 80, 100],
        pageSize: 30,
        total: 0,
        current: 1,
      },
      searchForm: { office: { name: "" } },
      panClass: {
        sm: { span: 12 },
        md: { span: 8 },
        xl: { span: 6, offset: 1 },
      },
      addForm: {
        politicalStatus: null,
        idCard: "",
        office: {},
        authCategoryList: [],
        assistCategoryList: [],
        reviewerCategoryList: [],
        signatoryCategoryList: [],
        issuerCategoryList: [],
        educationBackground: {},
        name: "",
        sex: "",
        birthday: null,
        professionalTitle: "",
        techTitle: null,
        isAuthenticator: "",
        licenseNumber: "",
        certificateStartDate: null,
        certificateExpireDate: null,
        isAssist: "",
        isReviewer: "",
        isSignatory: "",
        isIssuer: "",
        jobNo: null,
        graduateSchool: null,
        graduateDate: null,
        major: null,
        hireDate: null,
        workYear: null,
        contractType: null,
        contractYear: null,
        contractExpireDate: null,
        contractNum: null,
        contractLastDate: null,
        firstAuthDate: null,
        leaveDate: null,
        becomeRegularDate: null,
        status: null,
        hrStaffCertificates: [],
        isDisplayRoster: "",
      },
      statusDiag: false,
      staffStatus: null, //员工状态
      entryWorkDay: "", //入职时间
      leaveWorkDay: "", //离职时间
      annexVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      imgList: [],
      templateFile: {},
      accessoryArr: [[]], //附件
      activeFileList: [], //附件列表
      currentNum: 0,
      rule: {
        name: [
          { required: true, message: "该输入项为必填项!", trigger: "blur" },
        ],
        file: [{ validator: nameDistinct, trigger: "change" }],
      },
      AsyncfileArr: [],
      countForm: {
        name: "",
        planYear: "",
        pageDto: {
          current: 1,
          pageSize: 30,
        },
      },
      countTable: [],
      countTotal: 0,
      countCurrent: 1,
      countPageSize: 30,
      isRender: false,
      originFileList: [],
      isLoading: false,
    };
  },
  methods: {
    confirmStatus(sign) {
      if (sign == "N") {
        this.statusDiag = false;
      } else {
        let statusChange = {
          status: this.staffStatus,
          id: this.activeStaff.id,
          /*hireDate:this.entryWorkDay,*/
          leaveDate: this.leaveWorkDay,
          /*becomeRegularDate:*/
        };
        this.$put(api.changeStaffStatus, statusChange).then((res) => {
          this.$message.success("操作成功!");
          this.init();
          this.statusDiag = false;
        });
      }
    },
    changeStatus(index, row) {
      //修改员工状态
      this.statusDiag = true;
      this.activeStaff = row;
    },
    count() {
      this.$post(api.countHrStaff, this.countForm).then((res) => {
        this.countCurrent = res.data.current;
        this.countPageSize = res.data.pageSize;
        this.countTotal = res.data.total;
        this.countTable = res.data.list;
        console.log("统计的数据", this.countTable);
      });
    },
    confirm() {
      //压缩附件
      this.annexVisible = false;
      this.AsyncfileArr = [];
      let _that = this;
      this.addForm.hrStaffCertificates[this.currentNum].certificateFile = [];
      this.activeFileList.forEach((v, i) => {
        if (v.raw) {
          let f = null;
          if (
            v.raw.type == "image/png" ||
            v.raw.type == "image/jpeg" ||
            v.raw.type == "image/jpg"
          ) {
            console.log(this.addForm.hrStaffCertificates);
            f = new Promise((resolve, reject) => {
              let file = v.raw;
              let filename = file.name.substring(0, file.name.lastIndexOf("."));
              let filetype = file.type.substring(
                file.type.lastIndexOf("/") + 1,
                file.type.length
              );
              lrz(file, { width: 1280 }).then((rst) => {
                let file = {
                  name: v.name,
                  fileType: filetype,
                  base64Str: rst.base64,
                };
                _that.addForm.hrStaffCertificates[
                  this.currentNum
                ].certificateFile.push(file);
                console.log(this.addForm.hrStaffCertificates);
                resolve();
              });
            });
          } else {
            //上传的是其他文件
            f = new Promise((resolve, reject) => {
              this.$getBase64(v.raw).then((res) => {
                var index = v.name.lastIndexOf(".");
                var fileName = v.name.substring(0, index);
                let file = v.raw;
                let filetype = file.name.substring(
                  file.name.lastIndexOf(".") + 1,
                  file.name.length
                );
                _that.addForm.hrStaffCertificates[
                  this.currentNum
                ].certificateFile.push({
                  name: fileName,
                  fileType: filetype,
                  base64Str: res,
                });
                resolve();
              });
            });
          }
          this.AsyncfileArr.push(f);
        } else {
          this.addForm.hrStaffCertificates[
            this.currentNum
          ].certificateFile.push({ url: v.url });
        }
      });
    },
    openDiag(index) {
      this.annexVisible = true;
      this.activeFileList = this.accessoryArr[index]
        ? this.accessoryArr[index]
        : [];

      console.log(
        this.activeFileList,
        "this.accessoryArr[index]this.accessoryArr[index]"
      );
      this.currentNum = index;
    },
    deleteCetificate(index) {
      this.addForm.hrStaffCertificates.splice(index, 1);
      this.accessoryArr.splice(index, 1);
    },
    addCetificate() {
      this.addForm.hrStaffCertificates.push({
        name: "",
        issueUnit: "",
        issueDate: "",
        validDate: "",
        certificateFile: [],
      });
      this.accessoryArr.push([]);
    },
    cetificateSuccess() {
      this.$message({
        type: "success",
        message: "证书上传成功",
      });
    },
    cetificateError() {
      this.$message({
        type: "error",
        message: "证书上传失败",
      });
    },
    handleChangeCetificate(file, fileList) {
      //证书上传
      var fileName = file.name; /*.substring(0, file.name.indexOf('.'));*/
      let fileType = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length + 1
      );
      this.activeFileList.push({
        fileType: fileType,
        raw: file.raw,
        name: fileName,
      });
    },
    divideDate(date) {
      var arr = date.split(" ");
      return arr[0];
    },
    handleClick(tab, event) {
      /*if (sessionStorage.getItem("hrStaffSearchData")) {
                    this.searchdata = JSON.parse(sessionStorage.getItem("hrStaffSearchData"));
                    this.searchForm = this.searchdata;
                }*/
      //重置表单
      // this.$refs["staffForm"].resetFields();
    },
    init() {
      let json = {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize,
      };
      this.$get(api.hrStaffListAll, Object.assign(json, this.searchdata))
        .then((res) => {
          this.tableData = res.data.list;
          this.page.total = res.data.total;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.activeName = "list";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      var data = JSON.parse(JSON.stringify(this.searchForm));
      console.log(data, "查询条件");
      data.officeId = data.office.id;
      data.educationBackgroundId =
        data.educationBackground && data.educationBackground.id;
      data.staffStatus = data.staffStatus && data.staffStatus.value;
      data.professionalTitleId = data.techTitle && data.techTitle.id;
      data.qualificationType =
        data.qualificationType && data.qualificationType.value;
      /*sessionStorage.setItem("hrStaffSearchData", JSON.stringify(this.searchForm));*/
      delete data.office;
      delete data.educationBackground;
      delete data.techTitle;
      this.searchdata = data;
    },
    handleRemove(file, fileList) {
      this.imgList = [].concat(fileList);
    },
    handleChange(file, fileList) {
      this.imgList = [].concat(fileList);
      console.log(this.imgList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除员工" + row.name + "及其所关联的用户账号?")
        .then((res) => {
          this.$del(api.hrStaff + "/" + row.id)
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.init();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    },
    edit(index, row) {
      this.isAdd = false;
      this.activeName = "changelist";
      this.$get(api.hrStaff + "/" + row.id)
        .then((res) => {
          var data = JSON.parse(JSON.stringify(res.data));
          data.sex = data.sex.value;
          this.imgList = data.images.map((v, i) => {
            return { name: "", url: v.url };
          });
          data.isAuth = "N";
          data.isAssist = "N";
          data.isIssuer = "N";
          data.isReviewer = "N";
          data.isSignatory = "N";
          if (data.staffQualifications) {
            data.staffQualifications.forEach((v, i) => {
              switch (v.qualificationType) {
                case "AUTH":
                  data.isAuth = "Y";
                  data.authCategoryList = v.professionCategoryList.map(
                    (v, i) => {
                      return v.id;
                    }
                  );
                  break;
                case "ASSIST":
                  data.isAssist = "Y";
                  data.assistCategoryList = v.professionCategoryList.map(
                    (v, i) => {
                      return v.id;
                    }
                  );
                  break;
                case "REVIEWER":
                  data.isReviewer = "Y";
                  data.reviewerCategoryList = v.professionCategoryList.map(
                    (v, i) => {
                      return v.id;
                    }
                  );
                  break;
                case "AUTHORIZED_SIGNATORY":
                  data.isSignatory = "Y";
                  data.signatoryCategoryList = v.professionCategoryList.map(
                    (v, i) => {
                      return v.id;
                    }
                  );
                  break;
                case "ISSUER":
                  data.isIssuer = "Y";
                  data.issuerCategoryList = v.professionCategoryList.map(
                    (v, i) => {
                      return v.id;
                    }
                  );
                  break;
              }
            });
          }

          this.addForm = JSON.parse(JSON.stringify(data));
          this.accessoryArr = this.addForm.hrStaffCertificates.map(
            (item) => item.certificateFile
          );
          this.accessoryArr.forEach((item) => {
            item.forEach((innerItem) => {
              innerItem.name = innerItem.url.substring(
                innerItem.url.lastIndexOf("-") + 1,
                innerItem.url.length + 1
              );
            });
          });
          sessionStorage.setItem(
            "StaffManage",
            JSON.stringify({
              isAdd: this.isAdd,
              activeName: this.activeName,
              form: this.addForm,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    save(formName) {
      var arr = [];
      if (this.addForm.isAuthenticator == "Y") {
        var professionCategoryList = this.addForm.authCategoryList.map(
          (v, i) => {
            return { id: v };
          }
        );
        arr.push({
          qualificationType: "AUTH",
          professionCategoryList: professionCategoryList,
        });
      }
      if (this.addForm.isAssist == "Y") {
        var professionCategoryList = this.addForm.assistCategoryList.map(
          (v, i) => {
            return { id: v };
          }
        );
        arr.push({
          qualificationType: "ASSIST",
          professionCategoryList: professionCategoryList,
        });
      }
      if (this.addForm.isReviewer == "Y") {
        var professionCategoryList = this.addForm.reviewerCategoryList.map(
          (v, i) => {
            return { id: v };
          }
        );
        arr.push({
          qualificationType: "REVIEWER",
          professionCategoryList: professionCategoryList,
        });
      }
      if (this.addForm.isSignatory == "Y") {
        var professionCategoryList = this.addForm.signatoryCategoryList.map(
          (v, i) => {
            return { id: v };
          }
        );
        arr.push({
          qualificationType: "AUTHORIZED_SIGNATORY",
          professionCategoryList: professionCategoryList,
        });
      }
      if (this.addForm.isIssuer == "Y") {
        var professionCategoryList = this.addForm.issuerCategoryList.map(
          (v, i) => {
            return { id: v };
          }
        );
        arr.push({
          qualificationType: "ISSUER",
          professionCategoryList: professionCategoryList,
        });
      }
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.staffQualifications = [].concat(arr);
      data.office = { id: data.office.id };
      delete data.isAssist;
      delete data.isReviewer;
      delete data.isSignatory;
      delete data.isIssuer;
      delete data.authCategoryList;
      delete data.assistCategoryList;
      delete data.reviewerCategoryList;
      delete data.signatoryCategoryList;
      delete data.issuerCategoryList;
      if (!data.professionalTitle) {
        data.professionalTitle = null;
      }
      if (!data.politicalStatus) {
        data.politicalStatus = null;
      }
      data.images = [];

      let imageArr = [];

      this.imgList.forEach((v, i) => {
        if (v.raw) {
          let p = new Promise((resolve, reject) => {
            let file = v.raw;
            let filename = file.name.substring(0, file.name.lastIndexOf("."));
            let filetype = file.type.substring(
              file.type.lastIndexOf("/") + 1,
              file.type.length
            );
            lrz(file, { width: 1280 }).then(function (rst) {
              let img = { imageType: filetype, image: rst.base64 };
              data.images.push(img);
              resolve();
            });
          });
          imageArr.push(p);
        } else {
          data.images.push({ url: v.url });
        }
      });
      Promise.all([...this.AsyncfileArr, ...imageArr]).then((res) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoading = true;
            if (this.activeName == "addlist") {
              data.id = "";
              this.$post(api.hrStaff, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "新增成功！",
                      type: "success",
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                    this.fileList = [];
                    this.isLoading = false;
                  }
                })
                .catch((err) => {
                  console.log(err);
                  this.isLoading = false;
                });
            } else {
              this.$put(api.hrStaff + "/" + data.id, data)
                .then((res) => {
                  if (res.status == 200) {
                    this.$message({
                      message: "修改成功！",
                      type: "success",
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                    this.isLoading = false;
                  }
                })
                .catch((err) => {
                  this.isLoading = false;
                });
            }
          }
        });
      });
    },
    downTemplate() {
      this.$getFormData(api.template + "/download", {
        templeleName: "员工导入模板.xlsx",
      })
        .then((res) => {
          this.download(res.data, "员工导入模板.xlsx");
        })
        .catch((err) => {
          this.$message({
            message: "模板下载错误，请联系管理员",
            type: "error",
          });
        });
    },
    download(data, name) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    },
    handleTemplateChange(file, filelist) {
      this.templateFile = file;
    },
    saveImport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = null;
          let p = new Promise((resolve, reject) => {
            if (this.templateFile.raw) {
              common.getBase64(this.templateFile.raw).then((res) => {
                var fileName = this.templateFile.name;
                data = {
                  name: fileName,
                  base64Str: res,
                  fileType: fileName.substring(
                    fileName.indexOf(".") + 1,
                    fileName.length + 1
                  ),
                };
                resolve();
              });
            } else {
              resolve();
            }
          });
          p.then((res) => {
            this.$post(api.hrStaff + "/import", data)
              .then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "导入成功！",
                    type: "success",
                  });
                  this.activeName = "list";
                  this.init();
                }
              })
              .catch((err) => {
                this.$message.error(err.errMsg);
                this.$getFormData('/api'+err.extraInfo).then(res=>{
                    this.download(res.data,res.headers["content-disposition"].split("=")[1])
                }).catch(error=>{
                    this.$message({
                        message: '导入错误，请联系管理员',
                        type: 'error'
                    });
                })
              });
          });
        }
      });
    },
  },
  watch: {
    activeName: function (newval, oldval) {
      /*if(newval){
                    sessionStorage.setItem("StaffManage",JSON.stringify({
                        isAdd:this.isAdd,
                        activeName:this.activeName,
                        form:this.addForm
                    }));
                }*/
      if (newval == "addlist") {
        this.isAdd = true;
        this.fileList = [];
        this.addForm = Object.assign(this.addForm, {
          office: {},
          authCategoryList: [],
          assistCategoryList: [],
          reviewerCategoryList: [],
          signatoryCategoryList: [],
          issuerCategoryList: [],
          name: "",
          sex: "",
          birthday: null,
          professionalTitle: null,
          techTitle: null,
          isAuthenticator: null,
          licenseNumber: null,
          certificateStartDate: null,
          certificateExpireDate: null,
          isAssist: "",
          isReviewer: "",
          isSignatory: "",
          isIssuer: "",
          jobNo: null,
          graduateSchool: null,
          graduateDate: null,
          major: null,
          hireDate: null,
          workYear: null,
          contractType: null,
          contractYear: null,
          contractExpireDate: null,
          contractNum: null,
          contractLastDate: null,
          firstAuthDate: null,
          leaveDate: null,
          becomeRegularDate: null,
          status: null,
          hrStaffCertificates: [],
        });

        console.log(
          this.addForm.hrStaffCertificates,
          "hrStaffCertificateshrStaffCertificates"
        );
        this.accessoryArr = [[]]; //附件
        this.activeFileList = []; //附件列表
        this.imgList = [];
        this.currentNum = 0;
        this.$refs.staffForm.resetFields();
        this.$refs.staffForm.clearValidate();
      }
      if (oldval == "changelist") {
        this.isAdd = true;
      }
      if (newval == "changelist") {
        this.$refs.staffForm.clearValidate();
      }
    },
    countPageSize(newVal, oldVal) {
      this.countForm.pageDto.pageSize = newVal;
      this.count();
    },
    countCurrent(newVal, oldVal) {
      this.countForm.pageDto.current = newVal;
      this.count();
    },
  },
  created() {
    this.tableHeight = window.innerHeight - 387 + "px";
    if (sessionStorage.getItem("StaffManage")) {
      let { activeName, isAdd, form } = JSON.parse(
        sessionStorage.getItem("StaffManage")
      );
      this.activeName = "list";
      this.isAdd = true;
      /*this.addForm=form;*/
    }
    this.count();
    this.$get(api.myInfo).then((res) => {
      if (res.data.orgId == null || res.data.orgId.length == 0) {
        this.$get(api.org + "/setOrgId?orgId=" + null)
          .then((res) => {
            this.isRender = true;
          })
          .catch((e) => console.log(e));
      } else {
        this.isRender = true;
      }
    });
    this.$store.dispatch("login/headerTitleChange", "员工列表");
  },
  beforeDestroy() {
    sessionStorage.removeItem("StaffManage");
  },
};
</script>

<style scoped lang="less">
.title-bgcolor {
  background-color: #f5f7fa;
}
.statusStyle /deep/ .el-select {
  width: 100%;
}
</style>