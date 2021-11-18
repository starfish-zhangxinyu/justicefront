<template>
  <div id="case-detail">
    <Collapse title="案件基本信息" :active="true">
      <template>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件编号</span
            ><span class="detail">{{ detailMsg.caseNo }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">专业类别</span>
            <span class="detail" v-if="detailMsg.professionCategory">{{
              detailMsg.professionCategory.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2" v-if="detailMsg.entrustInfo"
            ><span class="label">委托方</span>
            <span
              class="detail"
              v-if="
                detailMsg.entrustInfo.entrustingUnit &&
                detailMsg.entrustInfo.entrustingUnit.name
              "
              >{{ detailMsg.entrustInfo.entrustingUnit.name }}</span
            >
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingParty">{{
              detailMsg.entrustInfo.entrustingParty
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系人</span>
            <span class="detail" v-if="detailMsg.entrustInfo.contact">{{
              detailMsg.entrustInfo.contact.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">联系电话</span>
            <span class="detail" v-if="detailMsg.entrustInfo.contact">{{
              detailMsg.entrustInfo.contact.phone
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">联系地址</span>
            <span class="detail" v-if="detailMsg.entrustInfo.contact">{{
              detailMsg.entrustInfo.contact.address
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">委托日期</span>
            <span class="detail" v-if="detailMsg.entrustingDate">{{
              divideDate(detailMsg.entrustingDate)
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">登记日期</span>
            <span class="detail" v-if="detailMsg.createDate">{{
              divideDate(detailMsg.createDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">受理日期</span>
            <span class="detail" v-if="detailMsg.acceptDate">{{
              divideDate(detailMsg.acceptDate)
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">约定完成时间</span>
            <span class="detail" v-if="detailMsg.promiseFinishDate">{{
              divideDate(detailMsg.promiseFinishDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">计划完成时间</span>
            <span class="detail" v-if="detailMsg.deadline">{{
              divideDate(detailMsg.deadline)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2" v-if="detailMsg.judger"
            ><span class="label">案件判断人</span>
            <span class="detail" v-if="detailMsg.judger">{{
              detailMsg.judger.participant &&
              detailMsg.judger.participant.hrStaff.name
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">鉴定助理</span>
            <span class="detail" v-if="detailMsg.assist">{{
              detailMsg.assist.participant &&
              detailMsg.assist.participant.hrStaff.name
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">第一鉴定人</span>
            <span class="detail" v-if="detailMsg.auth1">{{
              detailMsg.auth1.participant &&
              detailMsg.auth1.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第二鉴定人</span>
            <span class="detail" v-if="detailMsg.auth2">{{
              detailMsg.auth2.participant &&
              detailMsg.auth2.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">第三鉴定人</span>
            <span class="detail" v-if="detailMsg.auth3">{{
              detailMsg.auth3.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第四鉴定人</span>
            <span class="detail" v-if="detailMsg.auth4">{{
              detailMsg.auth4.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">第五鉴定人</span>
            <span class="detail" v-if="detailMsg.auth5">{{
              detailMsg.auth5.participant.hrStaff.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">复核人</span>
            <span class="detail" v-if="detailMsg.reviewer">{{
              detailMsg.reviewer.participant.hrStaff.name
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">授权签字人</span>
            <span class="detail" v-if="detailMsg.authorizedSignatory">{{
              detailMsg.authorizedSignatory.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">签发人</span>
            <span class="detail" v-if="detailMsg.issuer">{{
              detailMsg.issuer.participant.hrStaff.name
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">实验人员</span>
            <span class="detail" v-if="detailMsg.labStaff">{{
              detailMsg.labStaffName
            }}</span></el-col
          >
          <el-col :span="6" :offset="2"
            ><span class="label">市场人员</span>
            <span class="detail" v-if="detailMsg.saleStaff">{{
              detailMsg.saleStaff.participant &&
              detailMsg.saleStaff.participant.hrStaff.name
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">受理点</span>
            <span class="detail">{{
              detailMsg.acceptStation && detailMsg.acceptStation.name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案件类型</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseType">{{
              detailMsg.entrustInfo.caseType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">统计类别</span>
            <span class="detail" v-if="detailMsg.caseStatType">{{
              detailMsg.caseStatType.label
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">案件种类</span>
            <span class="detail" v-if="detailMsg.entrustInfo.caseCategory">{{
              detailMsg.entrustInfo.caseCategory.label
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">案发时间</span>
            <span class="detail" v-if="detailMsg.happenDate">{{
              divideDate(detailMsg.happenDate)
            }}</span>
          </el-col>
          <el-col :span="6" :offset="2"
            ><span class="label">材料是否齐全</span>
            <span
              class="detail"
              v-if="detailMsg.entrustInfo.materialAllReady"
              >{{
                detailMsg.entrustInfo.materialAllReady == "Y" ? "是" : "否"
              }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2"
            ><span class="label">基本案情</span>
            <span class="detail" v-if="detailMsg.entrustInfo.entrustingDesc">{{
              detailMsg.entrustInfo.entrustingDesc
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2"
            ><span class="label">备注</span>
            <span class="detail">{{ detailMsg.remarks }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2"
            ><span class="label">统一司法鉴定案件编号</span
            ><span class="detail">{{ detailMsg.unifyCaseNo }}</span>
          </el-col>
          <el-col :span="6" :offset="2">
            <div style="display: flex">
              <span class="label">统一司法鉴定案件二维码</span>
              <span class="detail" v-if="detailMsg.qrCodePicUrl">
                <el-image :src="detailMsg.qrCodePicUrl"> </el-image>
              </span>
            </div>
          </el-col>
        </el-row>
      </template>
    </Collapse>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane
        label="委托信息"
        v-if="hasPermission('case:detail:entrustInfo')"
        name="entrustMsgTab"
      >
        <Collapse title="委托信息" :active="true">
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">是否重新鉴定</span>
              <span class="detail">{{
                detailMsg.entrustInfo.repeat == "Y" ? "是" : "否"
              }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="detailMsg.entrustInfo.repeat == 'Y'"
              ><span class="label">重新鉴定原因</span>
              <span class="detail" v-if="detailMsg.entrustInfo.repeatReason">{{
                detailMsg.entrustInfo.repeatReason.label
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">是否回避</span>
              <span class="detail" v-if="detailMsg.entrustInfo">{{
                detailMsg.entrustInfo.withdrawalNeed == "Y" ? "是" : "否"
              }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="detailMsg.entrustInfo.withdrawalNeed == 'Y'"
              ><span class="label">回避原因</span>
              <span
                class="detail"
                v-if="detailMsg.entrustInfo.withdrawalReason"
                >{{ detailMsg.entrustInfo.withdrawalReason.label }}</span
              >
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="detailMsg.entrustInfo.withdrawalNeed == 'Y'"
              ><span class="label">回避人</span>
              <div class="detail" v-if="detailMsg.caseWithdrawalList">
                <span
                  v-for="(item, index) in detailMsg.caseWithdrawalList"
                  :key="index"
                  >{{ index == 0 ? null : "，"
                  }}{{ item.withdrawal && item.withdrawal.label }}</span
                >
              </div>
            </el-col>
            <el-col :span="6" :offset="2"
              ><span class="label">是否加急</span>
              <span class="detail" v-if="detailMsg.entrustInfo"
                >{{ detailMsg.entrustInfo.urgent == "Y" ? "是" : "否" }}
              </span></el-col
            >
          </el-row>
          <el-row v-if="hasPermission('auth:cnas')">
            <el-col :span="6" :offset="2"
              ><span class="label">是否CNAS/CMA项目</span>
              <span class="detail" v-if="detailMsg.entrustInfo"
                >{{ detailMsg.entrustInfo.isCnasItem == "Y" ? "是" : "否" }}
              </span></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12" :offset="2">
              <span class="label">案件关联号</span>
              <span class="detail">
                <router-link
                  v-for="item in detailMsg.associationCases"
                  :to="{ path: '/case/case-detail', query: { id: item.id } }"
                  style="text-decoration: none"
                  :key="item.id"
                >
                  <el-link type="primary">{{ item.caseNo }}</el-link
                  >&nbsp;&nbsp;
                </router-link>
              </span>
            </el-col>
          </el-row>
        </Collapse>
        <Collapse
          title="既往鉴定史"
          v-if="detailMsg.entrustInfo.repeat == 'Y'"
          :active="true"
        >
          <el-table
            :data="detailMsg.authHistoryList"
            border
            style="width: 100%"
            size="small"
            stripe
          >
            <el-table-column prop="authOrg" label="机构名称" />
            <el-table-column prop="caseNo" label="案件编号" />
            <el-table-column
              prop="authHistoryAuthenticatorList"
              label="本机构参与鉴定的鉴定人"
            >
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row
                    .authHistoryAuthenticatorList"
                  :key="index"
                  >{{ index == 0 ? null : "，"
                  }}{{ item.authenticator && item.authenticator.label }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="authHistoryAuthenticatorList" label="附件">
              <template slot-scope="scope">
                <el-link
                  v-for="(item, index) in scope.row.files"
                  :key="index"
                  :href="item.url"
                  target="_blank"
                  >{{ index == 0 ? null : "，" }}{{ `附件${index + 1}` }}
                </el-link>
                <span></span>
              </template>
            </el-table-column>
          </el-table>
        </Collapse>
      </el-tab-pane>
      <el-tab-pane
        label="流程进度"
        v-if="hasPermission('case:detail:flowable')"
        name="processTab"
      >
        <el-form v-for="(item, index) in actList" :key="index" :name="index">
          <Collapse :title="index + 1 + '、' + item.keyName" :active="true">
            <template>
              <el-table
                border
                size="small"
                :data="item.list"
                style="width: 100%"
              >
                <el-table-column
                  prop="flowStageName"
                  label="任务"
                ></el-table-column>
                <el-table-column
                  prop="assignee.hrStaff.name"
                  label="处理人"
                ></el-table-column>
                <el-table-column
                  prop="createDate"
                  label="开始时间"
                ></el-table-column>
                <el-table-column
                  prop="finishTime"
                  label="完成时间"
                ></el-table-column>
                <el-table-column
                  prop="taskTimeSpend"
                  label="用时"
                ></el-table-column>
                <el-table-column prop="reportFile" label="报告预览">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="scope.row.reportFile"
                      @click="showReportFile(scope.row.reportFile)"
                      >打开报告
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="scope.row.reportChangeFile"
                      @click="showReportFile(scope.row.reportChangeFile)"
                      >打开补正书
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="!scope.row.reportFile && scope.row.pdfFile"
                      @click="showPdfFile(scope.row.pdfFile)"
                      >打开报告
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </Collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="鉴定对象信息"
        v-if="hasPermission('case:detail:authObj')"
        name="criticalObjTab"
      >
        <template>
          <div v-if="criticalObj.authObjectType == 'GENERAL'">
            <el-tabs type="border-card" v-model="objActiveName">
              <el-tab-pane
                label="车"
                name="vehicle"
                v-if="criticalObj.vehicleTable"
              >
                <el-table
                  :data="criticalObj.vehicleTable"
                  stripe
                  border
                  size="mini"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="plateNumber"
                    label="对象名称"
                  ></el-table-column>
                  <el-table-column
                    prop="vehicleType.label"
                    label="车辆类型"
                  ></el-table-column>
                  <el-table-column prop="brand" label="品牌"></el-table-column>
                  <el-table-column
                    prop="vin"
                    label="车辆识别代码"
                  ></el-table-column>
                  <el-table-column
                    prop="contact"
                    label="联系人"
                  ></el-table-column>
                  <el-table-column
                    prop="contactPhone"
                    label="联系电话"
                  ></el-table-column>
                  <el-table-column
                    prop="parkingAddress"
                    label="停放地点"
                  ></el-table-column>
                  <el-table-column
                    prop="remarks"
                    label="备注"
                  ></el-table-column>
                  <el-table-column label="图片">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="(imageDialog = true), (imgs = scope.row.images)"
                        >查看
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane
                label="人"
                name="person"
                v-if="criticalObj.personTable"
              >
                <el-table
                  :data="criticalObj.personTable"
                  stripe
                  border
                  size="mini"
                  style="width: 100%"
                >
                  <el-table-column prop="name" label="姓名"></el-table-column>
                  <el-table-column
                    prop="nationality.label"
                    label="民族"
                  ></el-table-column>
                  <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                      <span>{{ scope.row.sex == "F" ? "女" : "男" }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="age" label="年龄"></el-table-column>
                  <el-table-column
                    prop="address"
                    label="家庭住址"
                  ></el-table-column>
                  <el-table-column
                    prop="credentialType.label"
                    label="证件类型"
                  ></el-table-column>
                  <el-table-column
                    prop="credentialNo"
                    label="证件号码"
                  ></el-table-column>
                  <el-table-column
                    prop="contact"
                    label="联系人"
                  ></el-table-column>
                  <el-table-column
                    prop="contactPhone"
                    label="联系电话"
                  ></el-table-column>
                  <el-table-column
                    prop="remarks"
                    label="备注"
                  ></el-table-column>
                  <el-table-column label="图片">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="(imageDialog = true), (imgs = scope.row.images)"
                        >查看
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane
                label="物"
                name="object"
                v-if="criticalObj.otherTable"
              >
                <el-table
                  :data="criticalObj.otherTable"
                  stripe
                  border
                  size="mini"
                  style="width: 100%"
                >
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column
                    prop="remarks"
                    label="备注"
                  ></el-table-column>
                  <el-table-column label="图片">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="(imageDialog = true), (imgs = scope.row.images)"
                        >查看
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="criticalObj.authObjectType == 'POISON'">
            <div style="margin-top: 10px">
              <el-table
                :data="criticalObj.poSampleTable"
                fit
                stripe
                border
                size="mini"
                style="width: 100%; margin-top: 5px"
              >
                <el-table-column
                  property="sampleNo"
                  label="样本编号"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  property="sampleName"
                  label="样本名称"
                ></el-table-column>
                <el-table-column
                  property="authPersonName"
                  label="被检人"
                ></el-table-column>
                <el-table-column property="sex" label="性别">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex == 'N'">未知</span>
                    <span v-if="scope.row.sex == 'F'">女</span>
                    <span v-if="scope.row.sex == 'M'">男</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="credentialType.label"
                  label="证件类型"
                ></el-table-column>
                <el-table-column
                  property="credentialNo"
                  label="证件号"
                  width="200px"
                ></el-table-column>
                <el-table-column
                  property="vesselNum"
                  label="采血管编号"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  property="sampleResource"
                  label="样本来源"
                ></el-table-column>
                <el-table-column
                  property="quantity"
                  label="数量"
                ></el-table-column>
                <el-table-column
                  property="standard.label"
                  label="规格"
                ></el-table-column>
                <el-table-column
                  property="volumeQuality"
                  label="体积/质量"
                ></el-table-column>
                <el-table-column
                  property="acceptTime"
                  label="接收时间"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.acceptTime">{{
                      $divideDate(scope.row.acceptTime)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="acceptPerson"
                  label="接收人"
                ></el-table-column>
                <el-table-column
                  property="materialCharacter"
                  label="检材性状"
                ></el-table-column>
                <el-table-column
                  property="packagingCharacter.label"
                  label="包装状况"
                ></el-table-column>
                <el-table-column
                  property="handle.label"
                  label="处理方式"
                ></el-table-column>
                <el-table-column
                  property="sendAuthPerson"
                  label="送检人"
                ></el-table-column>
                <el-table-column
                  property="sendAuthTelephone"
                  label="送检电话"
                ></el-table-column>
                <el-table-column
                  property="sendAuthTime"
                  label="送检时间"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.sendAuthTime">{{
                      $divideDate(scope.row.sendAuthTime)
                    }}</span>
                  </template>
                </el-table-column>
                <!--<el-table-column property="status" label="样本状态"></el-table-column>-->
                <el-table-column label="操作" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="(imageDialog = true), (imgs = scope.row.images)"
                      >查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="criticalObj.authObjectType == 'DNA'">
            <div style="margin-top: 10px">
              <el-table
                :data="criticalObj.dnaSampleTable"
                fit
                stripe
                border
                size="mini"
                style="width: 100%; margin-top: 5px"
              >
                <el-table-column
                  property="sampleNo"
                  label="样本编号"
                  width="150px"
                ></el-table-column>
                <el-table-column property="name" label="姓名"></el-table-column>
                <el-table-column
                  property="nationality.label"
                  label="民族"
                ></el-table-column>
                <!--<el-table-column property="caseHistoryNo" label="病历编号"></el-table-column>-->
                <el-table-column
                  property="isIdenticalTwins"
                  label="是否同卵胞胎"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isIdenticalTwins == '0'">否</span>
                    <span v-if="scope.row.isIdenticalTwins == '1'">是</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="tested"
                  label="是否是被检人"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.tested == 'N'">否</span>
                    <span v-if="scope.row.tested == 'Y'">是</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="credentialType.label"
                  label="证件类型"
                ></el-table-column>
                <el-table-column
                  property="credentialNo"
                  label="证件号"
                ></el-table-column>
                <el-table-column property="birthDate" label="出生日期">
                  <template slot-scope="scope">
                    <span v-if="scope.row.birthDate">{{
                      $divideDate(scope.row.birthDate)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="age"
                  label="年龄(岁)"
                ></el-table-column>
                <el-table-column
                  property="month"
                  label="年龄(月)"
                ></el-table-column>
                <el-table-column
                  property="dnaSampleRelation.name"
                  label="关系"
                ></el-table-column>
                <el-table-column property="sex" label="性别">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex == 'N'">未知</span>
                    <span v-if="scope.row.sex == 'F'">女</span>
                    <span v-if="scope.row.sex == 'M'">男</span>
                  </template>
                </el-table-column>
                <el-table-column property="transfused" label="有输血">
                  <template slot-scope="scope">
                    <span>{{ scope.row.transfused == "1" ? "有" : "无" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="address"
                  label="住址"
                ></el-table-column>
                <el-table-column property="dnaSampleTypeList" label="样品类型">
                  <template slot-scope="scope">
                    {{ dnaSampleTypeList(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                  property="bearer"
                  label="承载物"
                ></el-table-column>
                <el-table-column
                  property="quantity"
                  label="数量"
                ></el-table-column>
                <el-table-column
                  property="sampleUnit.label"
                  label="单位"
                ></el-table-column>
                <el-table-column
                  property="sampleCharacter.label"
                  label="性状"
                ></el-table-column>
                <el-table-column
                  property="colour"
                  label="颜色"
                ></el-table-column>
                <el-table-column property="size" label="大小"></el-table-column>
                <el-table-column
                  property="packaging"
                  label="包装"
                ></el-table-column>
                <el-table-column
                  property="sampleSource.label"
                  label="样本来源"
                  width="150px"
                ></el-table-column>
                <el-table-column
                  property="sampleDesc"
                  label="样本描述"
                ></el-table-column>
                <el-table-column
                  property="storePeriod.label"
                  label="
                                期限"
                ></el-table-column>
                <el-table-column
                  property="extractWay.label"
                  label="取样方式"
                ></el-table-column>
                <el-table-column
                  property="handleWay.label"
                  label="处理方式"
                ></el-table-column>
                <el-table-column property="acceptDate" label="接收时间">
                  <template slot-scope="scope">
                    <span v-if="scope.row.acceptDate">{{
                      $divideDate(scope.row.acceptDate)
                    }}</span>
                  </template>
                </el-table-column>
                <!--<el-table-column property="testBy" label="实验人员"></el-table-column>-->
                <!--<el-table-column property="status" label="实验状态"></el-table-column>-->
                <el-table-column label="图片" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="(imageDialog = true), (imgs = scope.row.images)"
                      >查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div
            v-if="
              criticalObj.authObjectType == 'DOCUMENT' ||
              criticalObj.authObjectType == 'TRACE_EVIDENCE' ||
              criticalObj.authObjectType == 'ELECTRONIC' ||
              criticalObj.authObjectType == 'ACOUSTIC_IMAGE'
            "
          >
            <div style="margin-top: 10px">
              <el-table
                :data="criticalObj.caSampleTable"
                fit
                stripe
                border
                size="mini"
                style="width: 100%; margin-top: 5px"
              >
                <el-table-column
                  property="type.label"
                  label="类型"
                ></el-table-column>
                <el-table-column
                  property="sampleNo"
                  label="编号"
                ></el-table-column>
                <el-table-column
                  v-if="criticalObj.authObjectType == 'ACOUSTIC_IMAGE'"
                  property="carrier"
                  label="载体"
                ></el-table-column>
                <el-table-column property="name" label="名称"></el-table-column>
                <el-table-column
                  property="quantity"
                  label="数量"
                ></el-table-column>
                <el-table-column
                  v-if="criticalObj.authObjectType == 'ELECTRONIC'"
                  property="brand"
                  label="品牌"
                ></el-table-column>
                <el-table-column
                  v-if="criticalObj.authObjectType == 'ELECTRONIC'"
                  property="model"
                  label="型号/容量"
                ></el-table-column>
                <el-table-column
                  v-if="criticalObj.authObjectType == 'ELECTRONIC'"
                  property="imeiSn"
                  label="IMEI/SN"
                ></el-table-column>
                <el-table-column
                  v-if="criticalObj.authObjectType != 'ELECTRONIC'"
                  property="unit.label"
                  label="规格"
                ></el-table-column>
                <el-table-column
                  v-if="
                    criticalObj.authObjectType == 'DOCUMENT' ||
                    criticalObj.authObjectType == 'ACOUSTIC_IMAGE'
                  "
                  property="property.label"
                  label="材料性质"
                ></el-table-column>
                <el-table-column
                  property="appearanceStatus.label"
                  label="外观/状态"
                ></el-table-column>
                <el-table-column
                  property="handleType.label"
                  label="处理方式"
                ></el-table-column>
                <el-table-column property="acceptDate" label="接收时间">
                  <template slot-scope="scope">
                    <span v-if="scope.row.acceptDate">{{
                      $divideDate(scope.row.acceptDate)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="submitMaterialPerson"
                  label="送检人"
                ></el-table-column>
                <el-table-column
                  property="submitMaterialPhone"
                  label="送检人电话"
                ></el-table-column>
                <el-table-column label="图片" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="(imageDialog = true), (imgs = scope.row.images)"
                      >查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="委托鉴定事项"
        v-if="hasPermission('case:detail:entrustMatter') && !isCnasItem"
        name="entrustMatterTab"
      >
        <template>
          <el-table
            border
            size="small"
            :data="entrustMatterTable"
            style="width: 100%"
          >
            <el-table-column
              prop="entrustingMatter.name"
              label="委托事项"
            ></el-table-column>
            <el-table-column
              prop="entrustingSubMatterName"
              label="细项"
            ></el-table-column>
            <el-table-column
              prop="entrustingMatterTargetList"
              label="被鉴定对象/样本"
            >
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.entrustingMatterTargetList"
                  :key="index"
                >
                  {{ index == 0 ? null : "，" }}{{ item.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column
              prop="entrustingMatter.standardList"
              label="检验标准"
            >
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row
                    .entrustingMatterStandardList"
                  :key="index"
                >
                  {{ index == 0 ? null : "，" }}{{ item.standard.name }}
                </span>
                <!-- <span v-if="scope.row.entrustingMatterStandardList">
                                        {{transform(scope.row.entrustingMatterStandardList,'standard')}}
                                </span> -->
              </template>
            </el-table-column>
            <!-- <el-table-column prop="remarks" label="备注"></el-table-column> -->
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="CNAS/CMA项目"
        v-if="hasPermission('case:detail:entrustMatter') && isCnasItem"
        name="cnasItemListTab"
      >
        <template>
          <el-table
            :data="cnasItemList"
            :span-method="objectSpanMethod"
            @cell-mouse-leave="cellMouseLeave"
            @cell-mouse-enter="cellMouseEnter"
            :cell-class-name="tableRowClassName"
            fit
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="name" label="CNAS/CMA项目"></el-table-column>
            <el-table-column
              prop="entrustingName"
              style="padding: 0"
              label="委托事项"
            >
              <template slot-scope="scope" style="padding: 0">
                <div>{{ scope.row.entrustingName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustingMatterTargetList"
              label="被鉴定对象/样本"
            >
              <template slot-scope="scope">
                <span
                  v-for="(v, i) in scope.row.entrustingMatterTargetList"
                  :key="i"
                  >{{ i == 0 ? "" : "," }}{{ v.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="standardList" label="标准">
              <template slot-scope="scope">
                <p v-for="(v, i) in scope.row.standardList" :key="i">
                  {{ v.name }}
                </p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="鉴定材料"
        v-if="hasPermission('case:detail:inspectMaterial')"
        name="criticalMaterialTab"
      >
        <Collapse title="送检鉴定材料" :active="true">
          <template>
            <el-table
              border
              size="small"
              :data="criticalMaterial.normalTable"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="送检鉴定材料"
              ></el-table-column>
              <el-table-column prop="type.label" label="类型"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column prop="unit.label" label="规格"></el-table-column>
              <el-table-column prop="acceptDate" label="接收时间">
                <template slot-scope="scope" v-if="scope.row.acceptDate">
                  <span>{{ divideDate(scope.row.acceptDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="property.label"
                label="材料性质"
              ></el-table-column>
              <el-table-column
                prop="handleType.label"
                label="处理方式"
              ></el-table-column>
              <el-table-column
                prop="submitMaterialPerson"
                label="送检人"
              ></el-table-column>
              <el-table-column
                prop="submitMaterialPhone"
                label="联系电话"
              ></el-table-column>
              <el-table-column
                prop="status.label"
                label="材料状态"
              ></el-table-column>
              <el-table-column prop="" label="文件及图片">
                <template slot-scope="scope" v-if="scope.row.images.length > 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="(imageDialog = true), (imgs = scope.row.images)"
                    >查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Collapse>
        <Collapse
          title="待补充鉴定材料"
          :active="true"
          v-if="
            criticalMaterial.waitingTable &&
            detailMsg.entrustInfo.materialAllReady != 'Y'
          "
        >
          <template>
            <el-table
              border
              size="small"
              :data="criticalMaterial.waitingTable"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="补充材料名称"
              ></el-table-column>
              <el-table-column prop="type.label" label="类型"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column prop="unit.label" label="规格"></el-table-column>
              <!-- <el-table-column prop="acceptDate" label="接收时间">
                                <template slot-scope="scope" v-if="scope.row.acceptDate">
                                    <span>{{divideDate(scope.row.acceptDate)}}</span>
                                </template>
                            </el-table-column> -->
              <el-table-column
                prop="property.label"
                label="材料性质"
              ></el-table-column>
              <el-table-column
                prop="handleType.label"
                label="处理方式"
              ></el-table-column>
              <!-- <el-table-column prop="submitMaterialPerson" label="送检人"></el-table-column>
                            <el-table-column prop="submitMaterialPhone" label="联系电话"></el-table-column> -->
              <el-table-column
                prop="status.label"
                label="材料状态"
              ></el-table-column>
              <el-table-column prop="" label="文件及图片">
                <template slot-scope="scope" v-if="scope.row.images.length > 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="(imageDialog = true), (imgs = scope.row.images)"
                    >查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Collapse>
      </el-tab-pane>
      <el-tab-pane
        label="鉴定记录"
        v-if="hasPermission('case:detail:authrecord')"
        name="criticalRecordTab"
      >
        <table id="identificationRecord">
          <tbody>
            <tr v-if="functionTestTime">
              <td style="width: 100px">检验时间</td>
              <td>
                <span v-if="criticalRecord.authDate">{{
                  criticalRecord.authDate
                }}</span>
              </td>
            </tr>
            <tr v-if="functionTestSite">
              <td style="width: 100px">检验地点</td>
              <td>
                <span v-if="criticalRecord.authAddress">{{
                  criticalRecord.authAddress
                }}</span>
              </td>
            </tr>
            <tr v-if="functionTestEquipment">
              <td style="width: 100px">检验设备</td>
              <td>
                <span
                  v-if="
                    criticalRecord.authRecordInstrumentList &&
                    criticalRecord.authRecordInstrumentList.length
                  "
                  >{{
                    transform(
                      criticalRecord.authRecordInstrumentList,
                      "instrument"
                    )
                  }}</span
                >
              </td>
            </tr>
            <tr v-if="functionTestMethod">
              <td style="width: 100px">检验方法/标准</td>
              <td>
                <span
                  v-if="
                    criticalRecord.authRecordInstrumentList &&
                    criticalRecord.authRecordStandardList.length
                  "
                  >{{
                    transform(criticalRecord.authRecordStandardList, "standard")
                  }}</span
                >
              </td>
            </tr>
            <tr v-if="inspectInfoTestRecord">
              <td style="width: 100px">鉴定/检测记录</td>
              <td>
                <span v-if="criticalRecord.authRecord">{{
                  criticalRecord.authRecord
                }}</span>
              </td>
            </tr>
            <tr>
              <td style="width: 100px">鉴定结果</td>
              <td>
                <!--毒物鉴定结果开始-->
                <Portlet
                  title="毒物检验结果"
                  :active="true"
                  v-if="
                    criticalRecord.poSampleResultList &&
                    criticalRecord.poSampleResultList.length > 0
                  "
                >
                  <template slot="body">
                    <el-table
                      :span-method="arraySpanMethodForPoison"
                      :data="criticalRecord.poSampleResultList"
                      fit
                      stripe
                      border
                      size="mini"
                      style="width: 95%"
                    >
                      <el-table-column
                        prop="poSample.sampleNo"
                        label="样本编号"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="poSample.sampleName"
                        label="样本名称"
                      >
                      </el-table-column>
                      <el-table-column
                        label="毒物毒品类别"
                        prop="poPoisonCategory.name"
                      >
                      </el-table-column>
                      <el-table-column
                        label="毒物毒品名称"
                        prop="poPoison.name"
                      >
                      </el-table-column>
                      <el-table-column label="定性结果" prop="result">
                        <template slot-scope="scope">
                          <span v-if="scope.row.result == 'POSITIVE'"
                            >阳性</span
                          >
                          <span v-if="scope.row.result == 'NEGATIVE'"
                            >阴性</span
                          >
                        </template>
                      </el-table-column>
                      <el-table-column prop="poisonContent" label="定量结果">
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="center"
                        width="300px"
                      >
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="primary"
                            @click="openPoisonForm(scope.row)"
                          >
                            打印表单
                          </el-button>
                          <el-dialog
                            title="打印表单"
                            :visible="PrintManyForm"
                            :before-close="handleClose"
                          >
                            <el-table
                              :data="templateList"
                              fit
                              size="mini"
                              stripe
                              border
                            >
                              <el-table-column
                                prop="name"
                                label="表单名称"
                                align="center"
                              >
                              </el-table-column>
                              <el-table-column label="操作" align="center">
                                <template slot-scope="scope1">
                                  <el-button
                                    size="mini"
                                    type="primary"
                                    @click="
                                      openManyForm(scope1.row, pickedSampleId)
                                    "
                                  >
                                    打印表单
                                  </el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                          </el-dialog>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </Portlet>

                <!--毒物鉴定结果结束-->
                <!--酒精鉴定结果-->
                <Portlet
                  title="酒精检测记录"
                  v-if="
                    criticalRecord.authAlcoholResultList &&
                    criticalRecord.authAlcoholResultList.length > 0 &&
                    inputContentFlag == '1'
                  "
                >
                  <template slot="buttonGroup">
                    <el-select
                      v-model="path"
                      placeholder="请选择"
                      size="mini"
                      disabled
                      style="float: right; margin-right: 10px; width: 100px"
                    >
                      <el-option label="单通道" value="ONE_PATH"></el-option>
                      <el-option label="双通道" value="TWO_PATH"></el-option>
                    </el-select>
                  </template>
                  <template slot="body">
                    <!--单通道-->
                    <div v-if="path == 'ONE_PATH'" key="one">
                      <el-table
                        :data="criticalRecord.authAlcoholResultList"
                        fit
                        stripe
                        border
                        size="mini"
                        style="width: 95%"
                      >
                        <el-table-column
                          prop="sample.sampleNo"
                          label="样本编号"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="sample.sampleName"
                          label="样本名称"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="sample.authPersonName"
                          label="被检人"
                        >
                        </el-table-column>
                        <el-table-column prop="content1" label="C1(mg/100ml)">
                        </el-table-column>
                        <el-table-column prop="content2" label="C2(mg/100ml)">
                        </el-table-column>
                        <el-table-column
                          prop="relativeDifference"
                          label="相对相差(%)"
                        >
                        </el-table-column>
                        <el-table-column prop="content" label="C平均(mg/100ml)">
                        </el-table-column>
                      </el-table>
                    </div>
                    <!--双通道-->
                    <div v-if="path == 'TWO_PATH'" key="two">
                      <el-table
                        :span-method="arraySpanMethodAlcohol"
                        :data="criticalRecord.doubleResultList"
                        fit
                        stripe
                        border
                        size="mini"
                        style="width: 95%"
                      >
                        <el-table-column
                          prop="sample.sampleNo"
                          label="样本编号"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="sample.sampleName"
                          label="样本名称"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="sample.authPersonName"
                          label="被检人"
                        >
                        </el-table-column>
                        <el-table-column prop="time" label="测试次数">
                        </el-table-column>
                        <el-table-column prop="content1" label="通道A">
                        </el-table-column>
                        <el-table-column prop="content2" label="通道B">
                        </el-table-column>
                        <el-table-column prop="averagea" label="平均值">
                        </el-table-column>
                        <el-table-column
                          prop="relativeDifferencea"
                          label="相对相差（%）"
                        >
                        </el-table-column>
                        <el-table-column prop="content" label="总平均">
                        </el-table-column>
                        <el-table-column
                          prop="relativeDifference"
                          label="总相对相差"
                        >
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </Portlet>
                <div style="width: 100%">
                  <Collapse
                    title="酒精检测记录"
                    :active="true"
                    v-if="
                      criticalRecord.authAlcoholResultList &&
                      criticalRecord.authAlcoholResultList.length > 0 &&
                      inputContentFlag == '0'
                    "
                  >
                    <template>
                      <Portlet :title="sampleNo">
                        <template slot="body">
                          <el-table
                            :data="criticalRecord.tertiaryButanolTable"
                            fit
                            stripe
                            border
                            size="mini"
                            style="width: 95%"
                            v-if="
                              criticalRecord.authAlcoholResultList &&
                              criticalRecord.authAlcoholResultList.length > 0 &&
                              inputContentFlag == '0'
                            "
                          >
                            <el-table-column
                              type="index"
                              :index="indexMethod"
                              label="编号"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="tertiaryButanol"
                              label="叔丁醇"
                            >
                              <template slot-scope="scope">
                                <span>{{ scope.row.tertiaryButanol }}</span>
                                <!-- <el-input size="mini" v-model="scope.row.tertiaryButanol"></el-input>-->
                              </template>
                            </el-table-column>
                            <el-table-column prop="alcohol" label="乙醇">
                              <template slot-scope="scope">
                                <!--<el-input size="mini" v-model="scope.row.alcohol"></el-input>-->
                                <span>{{ scope.row.alcohol }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column label="乙醇/叔丁醇">
                              <template slot-scope="scope">
                                <span>{{
                                  getCompareVal(
                                    scope.row.alcohol,
                                    scope.row.tertiaryButanol
                                  )
                                }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="content" label="含量">
                              <template slot-scope="scope">
                                <span>{{
                                  getContent(
                                    scope.row.alcohol,
                                    scope.row.tertiaryButanol,
                                    scope.$index
                                  )
                                }}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                          <el-table
                            :data="computedTable"
                            fit
                            stripe
                            border
                            size="mini"
                            style="width: 95%; margin-top: 10px"
                          >
                            <el-table-column prop="vy" label="y">
                            </el-table-column>
                            <el-table-column prop="vb" label="b">
                            </el-table-column>
                            <el-table-column prop="va" label="a">
                            </el-table-column>
                            <el-table-column prop="vr" label="r">
                            </el-table-column>
                            <el-table-column prop="uncertainty" label="不确定">
                            </el-table-column>
                            <el-table-column label="均值" prop="averageContent">
                              <template>
                                <span>{{ getAverageContent() }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column label="RD">
                              <template>
                                <span>{{ getRD1() }}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </Portlet>
                    </template>
                  </Collapse>
                </div>

                <!--酒精鉴定结果结束-->
                <!--Dna鉴定结果-->
                <Portlet
                  title="DNA检验结果"
                  :active="true"
                  v-if="
                    criticalRecord.dnaResultDtoList &&
                    criticalRecord.dnaResultDtoList.length > 0
                  "
                >
                  <template slot="body">
                    <el-table
                      :span-method="arrayDnaSpanMethod"
                      :data="criticalRecord.dnaResultDtoList"
                      :row-class-name="tableRowJudgeResultColor"
                      fit
                      border
                      size="mini"
                      style="width: 95%"
                    >
                      <el-table-column
                        prop="sendTestCountProportion"
                        label="送检数/已检数"
                      >
                      </el-table-column>
                      <el-table-column prop="analyzeMethod" label="分析方法">
                      </el-table-column>
                      <el-table-column prop="createDate" label="导入结果时间">
                      </el-table-column>
                      <el-table-column prop="judgeResult" label="结果">
                        <template slot-scope="scope">
                          <div
                            v-if="
                              scope.row.judgeResult &&
                              scope.row.judgeResult != '无'
                            "
                          >
                            <span
                              >不符合点位数{{ scope.row.mutationCount }}个,{{
                                scope.row.entrustingMatterName
                              }}结果{{ scope.row.judgeResult }}</span
                            >
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="center"
                        width="280px"
                      >
                        <template slot-scope="scope">
                          <el-button
                            type="primary"
                            size="small"
                            @click="confirmResult(scope.$index, scope.row)"
                          >
                            确认实验结果
                          </el-button>
                          <el-button
                            type="primary"
                            size="small"
                            @click="historyResult(scope.$index, scope.row)"
                          >
                            历史实验结果
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </Portlet>
                <!-- 法医病理鉴定 -->
                <el-button
                  style="float: right; margin-right: 10px; margin-top: 6px"
                  type="primary"
                  size="mini"
                  @click="openAuthDataGroup"
                  v-if="detailMsg.professionCategory.name === '法医病理鉴定'"
                  >检验记录数据
                </el-button>
                <!--检验记录数据模态框-->
                <el-dialog
                  title="检验记录数据类型"
                  :visible.sync="outerVisible"
                  width="65%"
                >
                  <el-dialog
                    width="65%"
                    title="检验记录数据"
                    :visible.sync="innerVisible"
                    append-to-body
                  >
                    <el-form
                      ref="recordDataForm"
                      label-width="240px"
                      size="small"
                      :model="recordDataForm"
                      class="demo-ruleForm"
                      label-position="right"
                    >
                      <el-row>
                        <el-col
                          :sm="{ span: 12 }"
                          :md="{ span: 12 }"
                          v-for="(v, i) in recordDataForm.arr"
                          :key="i"
                        >
                          <el-form-item
                            :label="getLabel(v.authDataItem)"
                            v-if="v.value"
                          >
                            <input :value="v.value" disabled />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="innerVisible = false">取 消</el-button>
                    </div>
                  </el-dialog>
                  <el-row>
                    <el-col
                      style="margin: 10px 0; text-align: center"
                      :md="{ span: 6 }"
                      v-for="(v, i) in recordDataType"
                      :key="i"
                    >
                      <el-button
                        style="width: 180px"
                        v-if="v.flag"
                        @click="getRecordData(v, i)"
                        type="success"
                        size="small"
                        >{{ v && v.name }}
                      </el-button>
                    </el-col>
                  </el-row>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">关闭</el-button>
                  </div>
                </el-dialog>
                <!-- 法医病理鉴定结束 -->
                <!-- 法医临床鉴定 -->
                <el-button
                  style="float: right; margin-right: 10px; margin-top: 6px"
                  type="primary"
                  size="mini"
                  @click="openAuthDataGroup"
                  v-if="detailMsg.professionCategory.name === '法医临床鉴定'"
                  >检验记录数据
                </el-button>
                <!-- 法医临床鉴定结束 -->
                <!--通用鉴定结果开始-->
                <Collapse
                  :title="authResultTitle"
                  :active="true"
                  v-if="
                    criticalRecord.authResultList &&
                    criticalRecord.authResultList.length > 0
                  "
                >
                  <template>
                    <el-table
                      :data="criticalRecord.authResultList"
                      fit
                      stripe
                      border
                      size="mini"
                      style="width: 95%"
                    >
                      <el-table-column
                        prop="authenticatedTarget"
                        label="被鉴定对象/样本"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="caEntrustingMatter.entrustingMatter.name"
                        label="委托事项"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="result"
                        label="鉴定结果"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-if="authResultTitle == '鉴定结果'">{{
                            scope.row.result.label
                          }}</span>
                          <span v-if="authResultTitle == '文书鉴定结果'">{{
                            scope.row.result.label
                          }}</span>
                          <span
                            v-if="
                              authResultTitle == '车速鉴定结果' &&
                              (scope.row.speedMax ||
                                scope.row.speedMax === 0) &&
                              (scope.row.speedMin || scope.row.speedMin === 0)
                            "
                            >{{ scope.row.speedMin }}-{{
                              scope.row.speedMax
                            }}</span
                          >
                          <span
                            v-if="
                              authResultTitle == '车速鉴定结果' &&
                              scope.row.speedMax &&
                              scope.row.speedMin === null
                            "
                            >{{ scope.row.speedMax }}</span
                          >
                          <span
                            v-if="
                              authResultTitle == '车速鉴定结果' &&
                              scope.row.speedMax === null &&
                              scope.row.speedMin
                            "
                            >{{ scope.row.speedMin }}</span
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </Collapse>
                <!--通用鉴定结果结束-->

                <!--检验记录数据-->
              </td>
            </tr>
            <tr v-if="testPhoto">
              <td style="width: 100px">检测照片</td>
              <td>
                <span v-if="criticalRecord.authPhotoList"></span>
                <div style="display: flex; flex-wrap: wrap">
                  <div
                    class="img_box"
                    :key="i"
                    v-for="(v, i) in criticalRecord.authPhotoList"
                  >
                    <el-image
                      :preview-src-list="v.photo ? [v.photo.url] : []"
                      style="width: 140px; height: 140px; margin: 5px"
                      :src="v.photo ? v.photo.url : null"
                    />
                    <p>{{ v.photoName }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="fileInspectInfoTestRecord">
              <td style="width: 100px">鉴定/检验记录附件</td>
              <td v-if="criticalRecord.authFileList">
                <div v-for="(v, i) in criticalRecord.authFileList" :key="i">
                  <a :href="v.url" target="_blank">
                    <el-image
                      :src="v.url"
                      alt=""
                      class="item"
                      v-if="v.fileType == 'jpg' || v.fileType == 'png'"
                      style="float: left; margin: 5px"
                    />
                    <div
                      v-if="v.fileType != 'jpg' && v.fileType != 'png'"
                      style="
                        float: left;
                        height: 140px;
                        width: 140px;
                        margin: 5px;
                        border: 1px solid #d9d9d9;
                      "
                    >
                      <i
                        class="fa fa-folder"
                        aria-hidden="true"
                        style="font-size: 18px; margin: 0 5px; color: #dbc056"
                      ></i>
                      <span>{{ v.name }}</span>
                    </div>
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 100px">其他</td>

              <td v-if="criticalRecord.caSysDynamicFieldValueList">
                <div
                  :key="i"
                  v-for="(v, i) in criticalRecord.caSysDynamicFieldValueList"
                >
                  <span class="label">{{ v.sysDynamicField.label }}</span>
                  <span class="detail">{{
                    v.value == "Y" ? "是" : v.value == "N" ? "否" : v.label
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane
        label="发放信息"
        v-if="hasPermission('case:detail:giveInfo')"
        name="giveMsgTab"
      >
        <template>
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">送达方式</span>
              <span class="detail" v-if="giveMsg.giveType">{{
                giveMsg.giveType.label
              }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'SELF_PICK'"
            >
              <span class="label">领取凭证</span>
              <span class="detail">{{ giveMsg.proof }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="2">
              <span class="label">发放日期</span>
              <span class="detail" v-if="giveMsg.giveDate">{{
                $divideDate(giveMsg.giveDate)
              }}</span>
            </el-col>
            <el-col :span="6" :offset="2">
              <!-- <span class="label" v-if="giveMsg.giveType.value !='POST'">领取(接收)人</span> -->
              <!-- <span class="label" v-if="giveMsg.giveType.value =='POST'">领取(接收)人</span> -->
              <span class="label">领取(接收)人</span>
              <span class="detail">{{ giveMsg.consignee }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'SEND'"
            >
              <span class="label">送件人</span>
              <span class="detail">{{ giveMsg.sendPerson }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'SEND'"
            >
              <span class="label">送件日期</span>
              <span class="detail" v-if="giveMsg.sendDate">{{
                $divideDate(giveMsg.sendDate)
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'SEND'"
            >
              <span class="label">送达地址</span>
              <span class="detail">{{ giveMsg.sendAddress }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'POST'"
            >
              <span class="label">邮寄单位</span>
              <span class="detail">{{ giveMsg.postUnit }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'POST'"
            >
              <span class="label">收件人电话</span>
              <span class="detail">{{ giveMsg.postRecipientPhone }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'POST'"
            >
              <span class="label">快递公司</span>
              <span class="detail" v-if="giveMsg.expressCompany">{{
                giveMsg.expressCompany.label
              }}</span>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
              v-if="giveMsg.giveType.value == 'POST'"
            >
              <span class="label">快递单号</span>
              <span class="detail">{{ giveMsg.expressNo }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="2">
              <span class="label">其他发放材料信息</span>
              <span class="detail">{{ giveMsg.otherGiveMaterials }}</span>
            </el-col>
            <el-col :span="6" :offset="2">
              <span class="label">备注</span>
              <span class="detail">{{ giveMsg.remarks }}</span>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="6" :offset="2">
              <span class="label">证件类型</span>
              <span class="detail">{{ giveMsg.otherGiveMaterials }}</span>
            </el-col>
            <el-col :span="6" :offset="2">
              <span class="label">证件号码</span>
              <span class="detail">{{ giveMsg.remarks }}</span>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="6" :offset="2">
              <span class="label">联系方式</span>
              <span class="detail">{{ giveMsg.otherGiveMaterials }}</span>
            </el-col>
            <el-col :span="6" :offset="2">
              <span class="label">联系地址</span>
              <span class="detail">{{ giveMsg.remarks }}</span>
            </el-col>
          </el-row> -->
          <Collapse title="返还材料" :active="true">
            <el-table
              border
              size="small"
              :data="giveMsg.inspectionMaterial"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="送检鉴定材料"
              ></el-table-column>
              <el-table-column prop="type.label" label="类型"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column prop="unit.label" label="规格"></el-table-column>
              <el-table-column prop="acceptDate" label="接收时间">
                <template slot-scope="scope" v-if="scope.row.acceptDate">
                  <span>{{ divideDate(scope.row.acceptDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="property.label"
                label="材料性质"
              ></el-table-column>
              <el-table-column
                prop="handleType.label"
                label="处理方式"
              ></el-table-column>
              <el-table-column
                prop="submitMaterialPerson"
                label="送检人"
              ></el-table-column>
              <el-table-column
                prop="submitMaterialPhone"
                label="联系电话"
              ></el-table-column>
              <el-table-column
                prop="status.label"
                label="材料状态"
              ></el-table-column>
              <el-table-column prop="" label="文件及图片">
                <template slot-scope="scope" v-if="scope.row.images.length > 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="(imageDialog = true), (imgs = scope.row.images)"
                    >查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </Collapse>
          <Collapse title="回执" :active="true">
            <td>
              <span v-if="giveMsg.receiptImages"></span>
              <div
                class="img_box"
                :key="i"
                v-for="(v, i) in giveMsg.receiptImages"
              >
                <el-image
                  :preview-src-list="v ? [v.url] : []"
                  style="width: 140px; height: 140px; margin: 5px"
                  :src="v ? v.url : null"
                />
              </div>
            </td>
          </Collapse>
          <Collapse title="附件" :active="true">
            <td v-if="giveMsg.annexImages">
              <div
                class="img_box"
                v-for="(v, i) in giveMsg.annexImages"
                :key="i"
              >
                <a :href="v.url" target="_blank">
                  <el-image
                    :src="v.url"
                    alt=""
                    class="item"
                    v-if="v.fileType == 'jpg' || v.fileType == 'png'"
                    style="float: left; margin: 5px"
                  />
                  <div
                    v-if="v.fileType != 'jpg' && v.fileType != 'png'"
                    style="
                      float: left;
                      height: 140px;
                      width: 140px;
                      margin: 5px;
                      border: 1px solid #d9d9d9;
                    "
                  >
                    <i
                      class="fa fa-folder"
                      aria-hidden="true"
                      style="font-size: 18px; margin: 0 5px; color: #dbc056"
                    ></i>
                    <span>{{ v.name }}</span>
                  </div>
                </a>
              </div>
            </td>
          </Collapse>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="归档信息"
        v-if="hasPermission('case:detail:archive')"
        name="archivedMsgTab"
      >
        <template>
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">归档日期</span>
              <span class="detail" v-if="archivedMsg.archiveDate">{{
                $divideDate(archivedMsg.archiveDate)
              }}</span>
            </el-col>
            <el-col :span="6" :offset="2"
              ><span class="label">立卷人</span>
              <span
                class="detail"
                v-if="
                  archivedMsg.rollupPerson && archivedMsg.rollupPerson.hrStaff
                "
                >{{ archivedMsg.rollupPerson.hrStaff.name }}</span
              >
            </el-col>
            <el-col :span="6" :offset="2"
              ><span class="label">归档人</span>
              <span
                class="detail"
                v-if="
                  archivedMsg.archivePerson && archivedMsg.archivePerson.hrStaff
                "
                >{{ archivedMsg.archivePerson.hrStaff.name }}</span
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">存放位置</span>
              <span class="detail" v-if="archivedMsg.location">{{
                archivedMsg.location.label
              }}</span>
            </el-col>
            <el-col :span="6" :offset="2"
              ><span class="label">存档期限</span>
              <span class="detail" v-if="archivedMsg.storeTime">{{
                archivedMsg.storeTime.label
              }}</span>
            </el-col>
            <el-col :span="6" :offset="2"
              ><span class="label">案件类型</span>
              <span class="detail" v-if="archivedMsg.caseType">{{
                archivedMsg.caseType.label
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="2"
              ><span class="label">备注</span>
              <span class="detail">{{ archivedMsg.remarks }}</span>
            </el-col>
          </el-row>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="收费项目"
        v-if="hasPermission('case:detail:chargeItem')"
        name="payItemTab"
      >
        <el-table
          :span-method="arraySpanMethod"
          border
          size="small"
          :data="payItemTable"
          style="width: 100%"
          show-summary
          :summary-method="getSFSummaries"
        >
          <el-table-column prop="chargingItem.name" label="收费项目">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItem">{{
                scope.row.chargingItem.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fiCaseChargeType" label="收费类别">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItem.chargingType">{{
                scope.row.chargingItem.chargingType.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="unitPrice.yuanFmt" label="单价">
            <template slot-scope="scope">
              <span v-if="scope.row.unitPrice">{{
                parseInt(scope.row.unitPrice.cent) / 100
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="金额">
            <template slot-scope="scope">
              <span v-if="scope.row.unitPrice.yuanFmt">{{
                (scope.row.quantity * parseInt(scope.row.unitPrice.cent)) / 100
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.amount.yuanFmt"
            label="收费确认金额"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.caseCharge.chargeSource.label"
            label="收入来源"
          ></el-table-column>
          <el-table-column
            prop="fiCaseChargeItem.caseCharge.revenueType.label"
            label="收入类型"
          ></el-table-column>
          <el-table-column label="收费确认日期">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.confirmDate
                "
              >
                {{
                  $divideDate(scope.row.fiCaseChargeItem.caseCharge.confirmDate)
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="缴费方">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.paymentUnit
                "
              >
                {{
                  scope.row.fiCaseChargeItem.caseCharge.paymentUnit.name
                }}</span
              >
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.payer
                "
              >
                {{ scope.row.fiCaseChargeItem.caseCharge.payer }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.createBy &&
                  scope.row.fiCaseChargeItem.caseCharge.createBy.hrStaff
                "
              >
                {{
                  scope.row.fiCaseChargeItem.caseCharge.createBy.hrStaff.name
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.fiCaseChargeItem &&
                  scope.row.fiCaseChargeItem.caseCharge &&
                  scope.row.fiCaseChargeItem.caseCharge.createDate
                "
              >
                {{
                  $divideDate(scope.row.fiCaseChargeItem.caseCharge.createDate)
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="开票情况"
        v-if="hasPermission('case:detail:invoice')"
        name="invoiceTab"
      >
        <template>
          <el-table
            border
            size="small"
            :data="invoiceTable"
            style="width: 100%"
          >
            <el-table-column
              prop="invoiceCode"
              label="发票代码"
            ></el-table-column>
            <el-table-column
              prop="invoiceNo"
              label="发票号码"
            ></el-table-column>
            <el-table-column
              prop="invoiceType.label"
              label="发票类型"
            ></el-table-column>
            <el-table-column prop="makeOutDate" label="开票日期">
              <template slot-scope="scope">
                <span v-if="scope.row.makeOutDate">{{
                  divideDate(scope.row.makeOutDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="invoiceAmount.yuanFmt"
              label="开票金额"
            ></el-table-column>
            <el-table-column
              prop="applyDrawer"
              label="申请开票人"
            ></el-table-column>
            <el-table-column prop="drawer" label="开票人"></el-table-column>
            <el-table-column
              prop="invoiceReceiver"
              label="领票人"
            ></el-table-column>
            <el-table-column prop="title" label="开票抬头"></el-table-column>
            <el-table-column
              prop="taxpayerNo"
              label="纳税人识别号"
            ></el-table-column>
            <el-table-column prop="address" label="单位地址"></el-table-column>
            <el-table-column prop="phoneNo" label="电话号码"></el-table-column>
            <el-table-column prop="bank" label="开户银行"></el-table-column>
            <el-table-column
              prop="bankAccount"
              label="银行账号"
            ></el-table-column>
            <el-table-column prop="receiveDate" label="领票日期">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveDate">{{
                  divideDate(scope.row.receiveDate)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="giveType.label" label="递送方式">
              <template slot-scope="scope">
                <span v-if="scope.row.giveType">{{
                  scope.row.giveType.label
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="status.label" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status">{{
                  scope.row.status.label
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="(imageDialog = true), (imgs = scope.row.images)"
                  >查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="费用异动"
        v-if="hasPermission('case:detail:amountChange')"
        name="flowCaseChangeTab"
      >
        <div class="block" style="max-height: 500px; overflow: auto">
          <el-timeline style="margin-left: 2%">
            <el-timeline-item
              v-for="(item, index) in flowCaseChangeTable"
              :key="index"
              :timestamp="item.createDate"
              size="large"
              :color="colours[index]"
              placement="top"
            >
              <div>
                <el-row>
                  <el-col :span="12">
                    <span>异动原因：</span>
                    <span v-if="item.reason">{{ item.reason }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>审批结果：</span>
                    <span
                      v-if="item.status"
                      :style="
                        item.status.value == 'REFUSE'
                          ? { color: 'red' }
                          : item.status.value == 'PASS'
                          ? { color: 'green' }
                          : null
                      "
                      >{{ item.status.label }}</span
                    >
                  </el-col>
                </el-row>
                <el-row style="margin-top: 1%">
                  <el-table
                    :data="item.amountChangeDetailListBefore"
                    border
                    fit
                    show-summary
                    :summary-method="getYDSummaries"
                    :header-cell-style="{
                      'text-align': 'center',
                      backgroundColor: '#F8F8FF',
                    }"
                    size="mini"
                  >
                    <el-table-column label="变更前的收费项目">
                      <el-table-column
                        prop="chargingItem.name"
                        label="收费项目"
                      ></el-table-column>
                      <el-table-column
                        prop="chargingItem.chargingType.name"
                        label="收费类型"
                      ></el-table-column>
                      <el-table-column
                        prop="unitPrice.yuanFmt"
                        label="单价"
                      ></el-table-column>
                      <el-table-column
                        prop="quantity"
                        label="数量"
                      ></el-table-column>
                      <el-table-column prop="total" label="金额">
                        <template slot-scope="scope">
                          {{
                            (scope.row.unitPrice.cent * scope.row.quantity) /
                            100
                          }}
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-row>
                <el-row style="margin-top: 1%">
                  <el-table
                    :data="item.amountChangeDetailListAfter"
                    border
                    fit
                    :header-cell-style="{
                      'text-align': 'center',
                      backgroundColor: '#D3D3D3',
                    }"
                    size="mini"
                    show-summary
                    :summary-method="getYDSummaries"
                  >
                    <el-table-column label="变更后的收费项目">
                      <el-table-column
                        prop="chargingItem.name"
                        label="收费项目"
                      ></el-table-column>
                      <el-table-column
                        prop="chargingItem.chargingType.name"
                        label="收费类型"
                      ></el-table-column>
                      <el-table-column
                        prop="unitPrice.yuanFmt"
                        label="单价"
                      ></el-table-column>
                      <el-table-column
                        prop="quantity"
                        label="数量"
                      ></el-table-column>
                      <el-table-column prop="total" label="金额">
                        <template slot-scope="scope">
                          {{
                            (scope.row.unitPrice.cent * scope.row.quantity) /
                            100
                          }}
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="案件中止信息"
        v-if="hasPermission('case:detail:suspendInfo')"
        name="suspendTab"
      >
        <div class="block" style="max-height: 500px; overflow: auto">
          <el-timeline style="margin-left: 2%">
            <el-timeline-item
              v-for="(item, index) in caseSuspendTable"
              :key="index"
              :timestamp="item.startTime"
              size="normal"
              :color="colours[index]"
              placement="top"
            >
              <el-card class="box-card">
                <div slot="header">
                  <h3>{{ item.suspendReason }}</h3>
                </div>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <span>开始时间：{{ item.startTime }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>结束时间：{{ item.endTime }}</span>
                  </el-col>
                  <el-col :span="11" :offset="1" class="top">
                    <span>暂停天数：{{ item.suspendDays }}</span>
                  </el-col>
                  <el-col :span="12" class="top">
                    <span>暂停原因：{{ item.suspendReason }}</span>
                  </el-col>
                  <el-col :span="11" :offset="1" class="top">
                    <span>计划暂停天数：{{ item.planSuspendDays }}</span>
                  </el-col>
                  <el-col :span="12" class="top">
                    <span
                      >附件：
                      <div v-if="item.files">
                        <div v-for="(v, i) in item.files" :key="i">
                          <el-image
                            :src="v.url"
                            alt=""
                            class="item"
                            v-if="v.fileType == 'jpg' || v.fileType == 'png'"
                            style="float: left; margin: 5px"
                          />
                          <div
                            v-if="v.fileType != 'jpg' && v.fileType != 'png'"
                            style="
                              float: left;
                              border: 1px solid #d9d9d9;
                              margin-top: 7%;
                            "
                          >
                            <i
                              class="fa fa-folder"
                              aria-hidden="true"
                              style="
                                font-size: 18px;
                                margin: 0 5px;
                                color: #dbc056;
                              "
                            ></i>
                            <el-link :href="v.url" target="_blank">{{
                              v.name
                            }}</el-link>
                          </div>
                        </div>
                      </div>
                    </span>
                  </el-col>
                </el-row>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="案件交接"
        v-if="hasPermission('auth:case:handover')"
        name="chargeChangeTab"
      >
        <template>
          <el-table border size="small" :data="changeList" style="width: 100%">
            <el-table-column
              prop="handoverFromUserName"
              label="案件移交者"
            ></el-table-column>
            <el-table-column
              prop="handoverToUserName"
              label="案件移交给"
            ></el-table-column>
            <el-table-column prop="authRole" label="角色"></el-table-column>
            <el-table-column
              prop="handoverTime"
              label="交接时间"
            ></el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="其他信息"
        v-if="hasPermission('case:detail:other')"
        name="sysDynamicValueTab"
      >
        <template>
          <el-table
            border
            size="small"
            :data="sysDynamicFieldTable"
            style="width: 100%"
          >
            <el-table-column
              prop="sysDynamicField.label"
              label="变量名"
            ></el-table-column>
            <el-table-column prop="label" label="变量值"></el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="封面"
        v-if="hasPermission('case:detail:other')"
        name="cover"
      >
        <template v-if="detailMsg.qrCodeCoverPicUrl">
          <el-image :src="detailMsg.qrCodeCoverPicUrl"> </el-image>
        </template>
      </el-tab-pane>
      <el-dialog
        title="图片"
        :visible.sync="imageDialog"
        width="30%"
        append-to-body
      >
        <span v-for="image in imgs" :key="image.id">
          <el-image
            style="width: 146px; height: 146px"
            :src="image.url"
            fit="fill"
          >
          </el-image>
          &nbsp;&nbsp;
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="imageDialog = false">取 消</el-button>
          <el-button type="primary" @click="imageDialog = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!--基因座详情记录-->
      <el-dialog
        title="基因座详情记录"
        :visible.sync="codisDetailDialog"
        width="80%"
      >
        <el-form :model="codisForm" size="small" label-width="0px">
          <el-table
            :data="codisForm.dnaCalcDtoList"
            fit
            border
            size="small"
            style="width: 100%"
            :header-cell-style="discountHeaderStyle"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              property="markerName"
              label="基因座"
            ></el-table-column>
            <el-table-column
              v-for="(item, i) in tableHead"
              :label="item"
              align="center"
              :key="i"
            >
              <el-table-column property="name">
                <template slot-scope="scope">
                  <span v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                    {{ scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele1 }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column property="name">
                <template slot-scope="scope">
                  <span v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                    {{ scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele2 }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              property="calcResult"
              :label="dnaResultName"
              v-if="codisForm.entrustingMatterKey != 'NOCALCULATE'"
            >
              <template slot-scope="scope">
                <div v-html="$replaceSupTag(scope.row.calcResultString)"></div>
              </template>
            </el-table-column>
            <el-table-column
              property="formula"
              label="公式"
              v-if="codisForm.entrustingMatterKey != 'NOCALCULATE'"
            >
              <template slot-scope="scope">
                <div v-html="$replaceSubTag(scope.row.formula)"></div>
              </template>
            </el-table-column>
          </el-table>
          <el-row
            style="margin-top: 10px; line-height: 20px"
            v-if="codisForm.entrustingMatterKey != 'NOCALCULATE'"
          >
            <el-col :span="6" style="margin-top: 5px">
              <div style="width: 100%">
                <span style="height: 30px; line-height: 30px; float: left">
                  {{ "累计" + dnaResultName + "：" }}
                </span>
                <span
                  style="
                    color: red;
                    height: 30px;
                    line-height: 30px;
                    float: left;
                  "
                  :style="{
                    marginTop:
                      codisForm.totalCalcResultSting &&
                      codisForm.totalCalcResultSting.includes('sup')
                        ? '-5px'
                        : '0',
                  }"
                  v-html="$replaceSupTag(codisForm.totalCalcResultSting)"
                >
                </span>
              </div>
            </el-col>

            <el-col :span="6" style="margin-top: 5px">
              <div style="height: 30px; line-height: 30px">
                检测结果：{{ codisForm.judgeResult }}
              </div>
            </el-col>
            <el-col :span="6" style="margin-top: 5px">
              <div style="height: 30px; line-height: 30px">
                基因突变：{{
                  codisForm.mutation == "Y"
                    ? "存在"
                    : codisForm.mutation == "N"
                    ? "不存在"
                    : ""
                }}
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="codisDetailDialog = false"
            size="mini"
            type="primary"
            >取 消</el-button
          >
          <!-- <el-button type="primary" size="mini" @click="codisDetailDialog = false">确定</el-button> -->
        </div>
      </el-dialog>
      <!--历史实验结果信息-->
      <el-dialog
        title="历史实验结果信息"
        :visible.sync="historyResultDialog"
        width="80%"
      >
        <el-table
          :data="historyResultList"
          fit
          border
          size="small"
          style="width: 100%"
          :row-class-name="tableRowJudgeResultColor"
        >
          <el-table-column type="selection" width="55px"> </el-table-column>
          <el-table-column
            prop="dnaTestDto.kitName"
            label="试剂盒"
          ></el-table-column>
          <el-table-column
            prop="frequencyTypeName"
            label="基因频率类型"
          ></el-table-column>
          <el-table-column
            prop="createBy.hrStaff.name"
            label="导入结果人"
          ></el-table-column>
          <el-table-column prop="indexValue" label="导入结果时间">
            <template slot-scope="scope">
              {{ scope.row.createDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="totalCalcResultSting"
            :label="'累计' + dnaResultName"
          >
            <template slot-scope="scope">
              <div
                v-html="$replaceSupTag(scope.row.totalCalcResultSting)"
              ></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="judgeResult"
            label="检测结果"
          ></el-table-column>
          <el-table-column
            prop="indexValue"
            label="操作"
            align="center"
            width="230px"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="checkRow(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div ref="ResultDialog" slot="footer"></div>
      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
import Collapse from "../../layout/Collapse";
import api from "../../../api/index";
import common from "../../../../static/js/common.js";
import PageOfficeApi from "../../../components/tpl/PageOfficeApi";
import Portlet from "../../layout/Portlet";
import BigDecimalUtils from "@/utils/BigDecimalUtils";

export default {
  components: { Collapse: Collapse, Portlet: Portlet },
  name: "CaseDetail",
  data() {
    return {
      colours: [
        "#dde0d7",
        "#BBFFFF",
        "#98F5FF",
        "#00E5EE",
        "#00EEEE",
        "#00BFFF",
      ],
      activeName: "entrustMsgTab",
      imageDialog: false,
      imgs: null,
      objActiveName: "vehicle",
      tableData: [],
      detailMsg: {
        entrustInfo: {
          entrustingUnit: {},
          contact: {},
          caseType: {},
          caseCategory: {},
        },
        labStaffName: null,
      },
      actList: null,
      // processTable: null,//流程表
      criticalObj: {}, //鉴定对象
      entrustMatterTable: [], //委托鉴定事项
      cnasItemList: [], //CNAS项目
      isCnasItem: false,
      changeList: null, //案件移交列表
      rowIndex: "-1",
      OrderIndexArr: [],
      hoverOrderArr: [],
      criticalMaterialTable: null,
      criticalMaterial: {}, //鉴定材料
      criticalRecord: {}, //鉴定记录
      giveMsg: { giveType: {} }, //发放信息
      archivedMsg: { storeTime: {}, caseType: {}, archivePerson: {} }, //归档信息
      payItemTable: null, //收费项目
      invoiceTable: null, //开票情况
      flowCaseChangeTable: null,
      caseSuspendTable: null,
      sysDynamicFieldTable: null,
      authResultTitle: "",
      //鉴定记录显示字段
      functionTestTime: false,
      functionTestSite: false,
      functionTestInfo: true,
      functionTestEquipment: false,
      functionTestMethod: false,
      testPhoto: false,
      inspectInfoTestRecord: false,
      poisonTestResult: false,
      dnaTestResult: false,
      fileInspectInfoTestRecord: false,
      alcoholTestRecord: false,
      tableHead: [],
      dnaResultName: "",
      codisForm: { dnaCalcDtoList: [] }, //确认实验结果
      codisDetailDialog: false, //基因座详情记录模态框
      historyResultDialog: false, //历史实验结果信息模态框
      historyResultList: [],
      path: "ONE_PATH",
      outerVisible: false,
      recordDataForm: { arr: [] }, //检测记录数据表单,
      saveDisabledBtn: false,
      innerVisible: false,
      recordDataType: null, //检测记录数据类型
      PrintManyForm: false,
      templateList: [],
      pickedSampleId: "",
      inputContentFlag: 0,
      computedTable: [{}],
      sampleNo: "", //叔丁醇下样本编号
    };
  },
  inject: ["hasPermission"],
  methods: {
    //费用异动项目表格合计
    getYDSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (index != 2 && index != 3 && index != 4) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property === "quantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        const value = data.map((item) =>
          Number((parseInt(item.unitPrice.cent) / 100) * item.quantity)
        );
        if (column.property === "total") {
          sums[index] = value.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      this.sums = sums;
      return sums;
    },
    //收费项目表格合计
    getSFSummaries({ columns, data }) {
      /* 收费项目存在合并行，统计数据只统计第一行数据 */
      let lastname = "";
      for (let x in data) {
        if (data[x].chargingItem.name == lastname) {
          data[x].quantity = 0;
        } else {
          lastname = data[x].chargingItem.name;
        }
      }
      if (data == null) return;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (index != 2 && index != 4 && index != 6) {
          sums[index] = "";
          return;
        }
        if (column.property === "quantity") {
          const values = data.map((item) => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        if (column.property === "fiCaseChargeItem.amount.yuanFmt") {
          const value01 = data.map((item) => {
            if (item.fiCaseChargeItem != undefined) {
              return Number(parseInt(item.fiCaseChargeItem.amount.cent) / 100);
            }
          });
          console.log("value01", value01);
          sums[index] = value01.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        const value = data.map((item) =>
          Number((parseInt(item.unitPrice.cent) / 100) * item.quantity)
        );
        if (column.property === "total") {
          sums[index] = value.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      this.sums = sums;
      return sums;
    },
    getAverageContent() {
      var a, b;
      if (this.criticalRecord.tertiaryButanolTable) {
        if (this.criticalRecord.tertiaryButanolTable[0].content) {
          a = this.criticalRecord.tertiaryButanolTable[0].content.toString();
        } else {
          a = 0;
        }
        if (this.criticalRecord.tertiaryButanolTable[1].content) {
          b = this.criticalRecord.tertiaryButanolTable[1].content.toString();
        } else {
          b = 0;
        }
        var value = this.getAverageValue1(a, b, 1);
        this.computedTable[0].averageContent = value;
        if (value < 1) {
          value = "<1.0";
        }
        return value;
      }
    },
    //获取含量
    getContent(a, b, index) {
      var compareVal = this.getCompareVal(a, b);
      var arr = [].concat(this.computedTable);
      var va = arr[0].va;
      var vb = arr[0].vb;
      if (!isNaN(Number(compareVal))) {
        let content = BigDecimalUtils.getContent(compareVal, va, vb, 1);
        this.criticalRecord.tertiaryButanolTable[index].content = content;
        if (content < 1) {
          content = "<1.0";
        }
        this.getAverageContent();
        return content;
      } else {
        return;
      }
    },
    getRD() {
      var a, b;
      if (this.criticalRecord.tertiaryButanolTable[0].content) {
        a = this.criticalRecord.tertiaryButanolTable[0].content.toString();
      } else {
        a = 0;
      }
      if (this.criticalRecord.tertiaryButanolTable[1].content) {
        b = this.criticalRecord.tertiaryButanolTable[1].content.toString();
      } else {
        b = 0;
      }
      var c = this.getAverageValue1(a, b);
      var value = this.getRelativeDifference(a, b, c);
      return value;
    },
    getRD1() {
      var a, b;
      if (this.criticalRecord.tertiaryButanolTable) {
        if (this.criticalRecord.tertiaryButanolTable[0].content) {
          a = this.criticalRecord.tertiaryButanolTable[0].content.toString();
        } else {
          a = 0;
        }
        if (this.criticalRecord.tertiaryButanolTable[1].content) {
          b = this.criticalRecord.tertiaryButanolTable[1].content.toString();
        } else {
          b = 0;
        }
        var c = this.getAverageValue1(a, b);
        var value = this.getRelativeDifference1(a, b, c);
        if (value < 1) {
          value = "<1.0";
        }
        return value;
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    //获取乙醇/叔丁醇
    getCompareVal(a, b) {
      /*var m = this.getLength(a, b);*/
      var val1 = a;
      var val2 = b;
      if (isNaN(Number(val1))) {
        val1 = 0;
      }
      if (isNaN(Number(val2)) || Number(val2) == 0) {
        return;
      }
      if (!a) {
        a = 0;
      }
      if (!b) {
        b = 0;
      }
      let value = BigDecimalUtils.divide(a, b, 3);
      /*if(value < 1) {
                    value = '<1.0'
                }*/

      return value;
      /*return this.toFixed(((Number(val1) * m / Number(val2) * m)), 2)*/
    },
    dnaSampleTypeList(row) {
      let type = "";
      row.dnaSampleTypeList.forEach((item) => {
        type += item.dnaSampleType.label + ",";
      });
      type = type.substring(0, type.length - 1);
      return type;
    },
    transform(arr, obj) {
      var str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i][obj].name + ",";
      }
      return str.substr(0, str.length - 1);
    },
    divideDate(date) {
      var arr = date.split(" ");
      return arr[0];
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      var exceptColArr = [6, 7, 8, 9, 10, 11, 12];
      if (exceptColArr.indexOf(columnIndex) == -1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    arrayDnaSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    arraySpanMethodForPoison({ row, column, rowIndex, columnIndex }) {
      var exceptColArr = [0, 1, 6];
      if (exceptColArr.indexOf(columnIndex) != -1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    //获取需要合并的行
    getSpanArrForPoison(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].poSample.id === data[i - 1].poSample.id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    showReportFile(data) {
      PageOfficeApi.openDoc(data, "N");
    },
    showPdfFile(data) {
      window.location.href = data;
    },
    openPoisonForm(row) {
      //打印表单
      if (this.templateList.length == 1) {
        //直接打印表单
        PageOfficeApi.renderForm(
          this.$route.query.id,
          row.poSample.id,
          this.templateList[0].id,
          "N"
        );
      } else {
        //打开一个弹窗显示表单
        this.PrintManyForm = true;
        this.pickedSampleId = row.poSample.id;
      }
    },
    openManyForm(template, sampleId) {
      PageOfficeApi.renderForm(
        this.$route.query.id,
        sampleId,
        template.id,
        "N"
      );
    },
    handleClose() {
      this.PrintManyForm = false;
    },
    tableRowJudgeResultColor({ row }) {
      if (row.judgeResult == "肯定") {
        return "affirm-row";
      } else if (row.judgeResult == "否定") {
        return "negate-row";
      } else if (row.judgeResult == "无") {
        return "without-row";
      }
    },
    //确认实验结果
    confirmResult(index, row) {
      this.tableHead = [];
      this.$get(api.currentCodis + "/" + row.id)
        .then((res) => {
          if (res.data) {
            this.dnaResultName = res.data.dnaResultName;
            var arr = [].concat(res.data.dnaCalcDtoList);
            arr[0].dnaSampleDtoList.forEach((v, i) => {
              this.tableHead.push(v.sampleNo);
            });
            var data = JSON.parse(JSON.stringify(res.data));
            if (!data.judgeResult) {
              data.judgeResult = "肯定";
            }
            if (!data.mutation) {
              data.mutation = "Y";
            }
            this.codisForm = data;
            this.codisDetailDialog = true;
          } else {
            this.$message.error("样本未能完成结果的计算！");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //历史实验结果
    historyResult(index, row) {
      this.$refs.ResultDialog.setAttribute("index", index);
      this.$post(api.historyCodis, {
        entrustingMatterId: row.entrustingMatterId,
      })
        .then((res) => {
          if (res.data.length > 0) {
            this.dnaResultName = res.data[0].dnaResultName;
          }
          this.historyResultList = res.data;
          this.historyResultDialog = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    discountHeaderStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 1) {
        return { display: "none" };
      }
    },
    //查看历史实验结果中每条数据的详情
    checkRow(row) {
      this.tableHead = [];
      this.$get(api.currentCodis + "/" + row.id)
        .then((res) => {
          if (res.data) {
            this.dnaResultName = res.data.dnaResultName;
            var arr = [].concat(res.data.dnaCalcDtoList);
            arr[0].dnaSampleDtoList.forEach((v, i) => {
              this.tableHead.push(v.sampleNo);
            });
            var data = JSON.parse(JSON.stringify(res.data));
            this.codisForm = data;
            this.codisDetailDialog = true;
          } else {
            this.$message.error("样本未能完成结果的计算！");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOrderNumber() {
      let OrderObj = {};
      this.cnasItemList.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.name]) {
          OrderObj[element.name].push(index);
        } else {
          OrderObj[element.name] = [];
          OrderObj[element.name].push(index);
        }
      });
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    //合并行函数，不管
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 3 || columnIndex === 5) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1,
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0,
                };
              }
            }
          }
        }
      }
    },
    //table函数
    tableRowClassName({ row, rowIndex }) {
      let arr = this.hoverOrderArr;
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return "hovered-row";
        }
      }
    },
    //table函数
    cellMouseLeave(row, column, cell, event) {
      this.rowIndex = "-1";
      this.hoverOrderArr = [];
    },
    //table函数
    cellMouseEnter(row, column, cell, event) {
      this.rowIndex = row.rowIndex;
      this.hoverOrderArr = [];
      this.OrderIndexArr.forEach((element) => {
        if (element.indexOf(this.rowIndex) >= 0) {
          this.hoverOrderArr = element;
        }
      });
    },
    //合并行
    arraySpanMethodAlcohol({ row, column, rowIndex, columnIndex }) {
      let includeColArr = [0, 1, 2, 8, 9];
      if (includeColArr.indexOf(columnIndex) !== -1) {
        if (rowIndex % 2 === 0) {
          return [2, 1];
        } else {
          return [0, 0];
        }
      }
    },
    //拿到小数需要扩充的倍数
    getLength(a, b) {
      a = a + "";
      b = b + "";
      if (a && a.indexOf(".") > -1) {
        var r1 = a.split(".")[1].length;
      } else {
        r1 = 0;
      }
      if (b && b.indexOf(".") > -1) {
        var r2 = b.split(".")[1].length;
      } else {
        r2 = 0;
      }
      var m = Math.pow(10, Math.max(r1, r2));
      return m;
    },
    //获取平均值
    getAverageValue(row) {
      //行间
      var a = row.content1;
      var b = row.content2;
      var m = this.getLength(a, b);
      var val1 = a;
      var val2 = b;
      if (isNaN(Number(val1))) {
        val1 = 0;
      }
      if (isNaN(Number(val2))) {
        val2 = 0;
      }
      var value = this.toFixed(
        (Number(val1) * m + Number(val2) * m) / (2 * m),
        2
      );
      row.content = value;
      return value;
    },
    //获取相对相差
    getRelativeDifference(a, b, c) {
      var val1 = a;
      var val2 = b;
      if (!val1) {
        val1 = 0;
      }
      if (!val2) {
        val2 = 0;
      }

      return BigDecimalUtils.getRd(val1, val2, 2);
    },
    //获取丁叔醇相对相差
    getRelativeDifference1(a, b, c) {
      var val1 = a;
      var val2 = b;
      if (!val1) {
        val1 = 0;
      }
      if (!val2) {
        val2 = 0;
      }

      return BigDecimalUtils.getRd(val1, val2, 3);
    },
    getAverageValue1(a, b, point) {
      //非行间
      var val1 = a;
      var val2 = b;
      var arr = [];
      if (!val1) {
        val1 = 0;
      }
      if (!val2) {
        val2 = 0;
      }
      arr.push(val1);
      arr.push(val2);
      if (point) {
        var value = BigDecimalUtils.getAvg(arr, point);
        return value;
      } else {
        var value = BigDecimalUtils.getAvg(arr, 2);
        return value;
      }
    },
    //获取总平均
    getTotalAverageValue(index) {
      if ((index + 1) % 2 == 0) {
        var a = this.getAverageValue(
          this.criticalRecord.doubleResultList[index]
        );
        var b = this.getAverageValue(
          this.criticalRecord.doubleResultList[index - 1]
        );
        var value = this.getAverageValue1(a, b);
        return value;
      } else {
        var a = this.getAverageValue(
          this.criticalRecord.doubleResultList[index]
        );
        var b = this.getAverageValue(
          this.criticalRecord.doubleResultList[index + 1]
        );
        var value = this.getAverageValue1(a, b);
        return value;
      }
    },
    //获取总相对相差
    getTotalRelativeDifference(index) {
      if ((index + 1) % 2 == 0) {
        var a = this.getAverageValue(
          this.criticalRecord.doubleResultList[index]
        );
        var b = this.getAverageValue(
          this.criticalRecord.doubleResultList[index - 1]
        );
        var value = this.getRelativeDifference(
          a,
          b,
          this.getAverageValue1(a, b)
        );
        return value;
      } else {
        var a = this.getAverageValue(
          this.criticalRecord.doubleResultList[index]
        );
        var b = this.getAverageValue(
          this.criticalRecord.doubleResultList[index + 1]
        );
        var value = this.getRelativeDifference(
          a,
          b,
          this.getAverageValue1(a, b)
        );
        return value;
      }
    },
    toFixed(num, s) {
      //解决toFixed丢失精度问题
      var times = Math.pow(10, s);
      var des = num * times + 0.5;
      des = parseInt(des, 10) / times;
      return des + "";
    },
    //法医病理鉴定
    openAuthDataGroup() {
      if (!this.recordDataType) {
        this.$get(api.authData + "/group", {
          caseId: this.$route.query.id,
          professionCategoryId: this.proId,
        })
          .then((res) => {
            this.recordDataType = res.data;
            this.outerVisible = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.outerVisible = true;
      }
    },
    getRecordData(value, index) {
      let data = { caseId: this.$route.query.id };
      data.authDataItemGroupId = value.id;
      this.$get(api.authData, data)
        .then((res) => {
          this.recordDataForm.arr = res.data;
          this.innerVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getLabel(item) {
      if (item.authDataItemUnit) {
        return item.name + "(" + item.authDataItemUnit.label + ")";
      } else {
        return item.name;
      }
    },
  },
  watch: {
    activeName: {
      handler(newVal, oldVal) {
        switch (newVal) {
          case "processTab": //流程进度
            if (!this.process) {
              this.$get(
                "/api/flow-case-task-record/v1/list/" + this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.actList = res.data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "criticalObjTab": //鉴定对象信息
            if (JSON.stringify(this.criticalObj) == "{}") {
              this.$get(
                "/api/ca-case/v1/cases/authenticated/" + this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    let data = res.data;
                    let pc = data.professionCategory;
                    if (
                      data.authenticatedVehicleList &&
                      data.authenticatedVehicleList.length > 0
                    ) {
                      this.objActiveName = "vehicle";
                    } else if (
                      data.authenticatedPersonList &&
                      data.authenticatedPersonList.length > 0
                    ) {
                      this.objActiveName = "person";
                    } else if (
                      data.authenticatedOtherList &&
                      data.authenticatedOtherList.length > 0
                    ) {
                      this.objActiveName = "other";
                    }
                    this.$set(
                      this.criticalObj,
                      "otherTable",
                      data.authenticatedOtherList
                    );
                    this.$set(
                      this.criticalObj,
                      "vehicleTable",
                      data.authenticatedVehicleList
                    );
                    this.$set(
                      this.criticalObj,
                      "personTable",
                      data.authenticatedPersonList
                    );
                    this.$set(
                      this.criticalObj,
                      "poSampleTable",
                      data.poSampleList
                    );
                    this.$set(
                      this.criticalObj,
                      "dnaSampleTable",
                      data.dnaSampleList
                    );
                    this.$set(
                      this.criticalObj,
                      "caSampleTable",
                      data.caSampleList
                    );
                    this.criticalObj.authObjectType = pc.type.value;
                    console.log(
                      "鉴定对象信息",
                      this.criticalObj.dnaSampleTable,
                      data.dnaSampleList
                    );
                    if (pc.type.value == "DNA") {
                      this.criticalObj.typeName = "DNA样本信息";
                    } else if (pc.type.value == "POISON") {
                      this.criticalObj.typeName = "毒物样本信息";
                    } else if (
                      pc.type.value == "DOCUMENT" ||
                      pc.type.value == "TRACE_EVIDENCE" ||
                      pc.type.value == "ELECTRONIC" ||
                      pc.type.value == "ACOUSTIC_IMAGE"
                    ) {
                      this.criticalObj.typeName = "检材样本信息";
                    } else {
                      this.criticalObj.authObjectType = "GENERAL";
                      this.criticalObj.typeName = "鉴定对象信息";
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "entrustMatterTab": //委托鉴定事项
            if (
              !this.entrustMatterTable ||
              this.entrustMatterTable.length == 0
            ) {
              this.$get(
                "/api/ca-case/v1/cases/entrusting-matter/" +
                  this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.entrustMatterTable = res.data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "cnasItemListTab": //CNAS项目
            if (!this.cnasItemList || this.cnasItemList.length == 0) {
              this.$get(
                "/api/ca-case/v1/cases/cnasItemList/" + this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    let data = [];
                    if (res.data) {
                      res.data.forEach((v) => {
                        v.entrustingMatterList.forEach((item) => {
                          data.push({
                            id: v.id, //案件cans id
                            cnasId: v.cnasItem.id,
                            name: v.cnasItem.name,
                            standardList: v.standardList || [],
                            entrustingId: item.entrustingMatter.id,
                            entrustingSqlId: item.id,
                            entrustingMatterTargetList:
                              item.entrustingMatterTargetList || [],
                            entrustingName: item.entrustingMatter.name,
                            entrustingKey: item.entrustingMatter.key,
                            poSampleResultList: item.poSampleResultList || [],
                          });
                        });
                      });
                    }
                    this.cnasItemList = data;
                    this.getOrderNumber();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "criticalMaterialTab": //鉴定材料
            if (JSON.stringify(this.criticalMaterial) == "{}") {
              this.$get(
                "/api/ca-inspection-material/v1/ca-inspection-materials?caseId=" +
                  this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.$set(
                      this.criticalMaterial,
                      "normalTable",
                      res.data.inspectionMaterialListNormal
                    );
                    this.$set(
                      this.criticalMaterial,
                      "waitingTable",
                      res.data.inspectionMaterialListWaitingSend
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "giveMsgTab": //发放信息
            if (JSON.stringify(this.giveMsg.giveType) == "{}") {
              this.$get(
                "/api/ca-give-info/v1/ca-give-infos/no-return-details/" +
                  this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    var data = JSON.parse(JSON.stringify(res.data));
                    var str = "";
                    if (data.credentialList && data.credentialList.length > 0) {
                      data.credentialList.forEach((v, i) => {
                        if (v.value === "OTHER") {
                          str += data.otherCredentials + ",";
                        } else {
                          str += v.label + ",";
                        }
                      });
                      data.proof = str.substr(0, str.length - 1);
                    }
                    data.annexImages = data.annexImages.map((v, i) => {
                      var index = v.url.lastIndexOf("-");
                      var name = v.url.substring(index + 1);
                      var index2 = v.url.lastIndexOf(".");
                      var type = v.url.substring(index2 + 1);
                      return { fileType: type, name: name, url: v.url };
                    });
                    if (
                      data.otherGiveMaterials &&
                      data.otherGiveMaterials.indexOf(",") == 0
                    ) {
                      data.otherGiveMaterials = data.otherGiveMaterials.substr(
                        1,
                        data.otherGiveMaterials.length
                      );
                    }
                    this.giveMsg = data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "archivedMsgTab": //归档信息
            if (JSON.stringify(this.archivedMsg.storeTime) == "{}") {
              this.$get("/api/ca-archive/v1/archives/" + this.$route.query.id)
                .then((res) => {
                  if (res.status == 200) {
                    this.archivedMsg = res.data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "criticalRecordTab": //鉴定记录
            if (JSON.stringify(this.criticalRecord) == "{}") {
              this.$get(
                "/api/auth-record/v1/auth-records/" + this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.criticalRecord = res.data;

                    if (
                      res.data.authAlcoholResultList[0] &&
                      res.data.authAlcoholResultList[0].tertiaryButanol1 &&
                      res.data.authAlcoholResultList[0].tertiaryButanol1
                        .length > 0
                    ) {
                      //叔丁醇
                      this.computedTable =
                        this.criticalRecord.authAlcoholResultList;
                      let obj1 = {
                        alcohol: res.data.authAlcoholResultList[0].alcohol1,
                        tertiaryButanol:
                          res.data.authAlcoholResultList[0].tertiaryButanol1,
                      };

                      let obj2 = {
                        alcohol: res.data.authAlcoholResultList[0].alcohol2,
                        tertiaryButanol:
                          res.data.authAlcoholResultList[0].tertiaryButanol2,
                      };
                      this.criticalRecord.tertiaryButanolTable = [obj1, obj2];

                      console.log(
                        this.criticalRecord.tertiaryButanolTable,
                        "this.criticalRecord.tertiaryButanolTablethis.criticalRecord.tertiaryButanolTable"
                      );
                    }

                    //用来判断是否是丁叔醇
                    this.inputContentFlag =
                      this.criticalRecord.inputContentFlag;
                    if (this.inputContentFlag === "0") {
                      this.sampleNo =
                        this.criticalRecord.authAlcoholResultList &&
                        this.criticalRecord.authAlcoholResultList[0] &&
                        this.criticalRecord.authAlcoholResultList[0].sample &&
                        this.criticalRecord.authAlcoholResultList[0].sample
                          .sampleNo;
                    }
                    this.$get(api.template, {
                      professionCategoryId:
                        this.criticalRecord.professionCategory.id,
                      formLocation: "ARCHIVED_FILE",
                      templateType: "FORM",
                      formLocation: "AUTH_RECORD",
                      templateType: "FORM",
                      orgId: this.orgId,
                    })
                      .then((res) => {
                        this.templateList = res.data.list;
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    //酒精检验记录
                    if (
                      this.detailMsg.professionCategory.type.value ===
                        "POISON" &&
                      res.data.authAlcoholResultList.length > 0
                    ) {
                      if (
                        res.data.authAlcoholResultList[0] &&
                        res.data.authAlcoholResultList[0].content3 === null
                      ) {
                        //单通道时
                      } else if (res.data.authAlcoholResultList[0]) {
                        //双通道时
                        let length = res.data.authAlcoholResultList.length;
                        var doubleResultList1 = [];
                        for (let i = 0; i < length; i++) {
                          const obj1 = Object.assign(
                            {},
                            res.data.authAlcoholResultList[i],
                            {
                              content1:
                                res.data.authAlcoholResultList[i].content1,
                              content2:
                                res.data.authAlcoholResultList[i].content2,
                              content3:
                                res.data.authAlcoholResultList[i].content3,
                              content4:
                                res.data.authAlcoholResultList[i].content4,
                              time: "第一次测试值（mg/100ml）",
                              averagea:
                                res.data.authAlcoholResultList[i].averagea,
                              relativeDifferencea:
                                res.data.authAlcoholResultList[i]
                                  .relativeDifferencea,
                            }
                          );
                          const obj2 = Object.assign(
                            {},
                            res.data.authAlcoholResultList[i],
                            {
                              content1:
                                res.data.authAlcoholResultList[i].content3,
                              content2:
                                res.data.authAlcoholResultList[i].content4,
                              content3: null,
                              content4: null,
                              time: "第二次测试值（mg/100ml）",
                              averagea:
                                res.data.authAlcoholResultList[i].averageb,
                              relativeDifferencea:
                                res.data.authAlcoholResultList[i]
                                  .relativeDifferenceb,
                            }
                          );
                          doubleResultList1.push(obj1, obj2);
                        }
                        this.$set(
                          this.criticalRecord,
                          "doubleResultList",
                          doubleResultList1
                        );
                        this.getSpanArr(this.criticalRecord.doubleResultList);
                        this.path = "TWO_PATH";
                      }
                    }

                    if (!this.criticalRecord.id) {
                      this.criticalRecord.authRecordStandardList = [];
                    }
                    this.criticalRecord.authFileList =
                      this.criticalRecord.authFileList.map((v, i) => {
                        var index = v.url.lastIndexOf("-");
                        var name = v.url.substring(index + 1);
                        var index2 = v.url.lastIndexOf(".");
                        var type = v.url.substring(index2 + 1);
                        return { fileType: type, name: name, url: v.url };
                      });
                    //获取专业的显示字段
                    this.proId = res.data.professionCategory.id;
                    //获取专业的显示字段
                    this.$get("/api/param/v1/params/value", {
                      professionCategoryId: this.proId,
                      key: "inspectInfo.function.show",
                    })
                      .then((res) => {
                        if (res.status == 200) {
                          var selectFiledArr = res.data.split(",");
                          if (selectFiledArr) {
                            selectFiledArr.forEach((fv, fi) => {
                              if (fv == "function.test.time") {
                                this.functionTestTime = true;
                              } else if (fv == "function.test.site") {
                                this.functionTestSite = true;
                              } else if (fv == "function.test.equipment") {
                                this.functionTestEquipment = true;
                              } else if (fv == "function.test.method") {
                                this.functionTestMethod = true;
                              } else if (fv == "dna.test.result") {
                                this.dnaTestResult = true;
                              } else if (fv == "alcohol.test.record") {
                                this.alcoholTestRecord = true;
                              } else if (fv == "poison.test.result") {
                                this.poisonTestResult = true;
                              } else if (fv == "inspectInfo.test.record") {
                                this.inspectInfoTestRecord = true;
                              } else if (fv == "test.photo") {
                                this.testPhoto = true;
                              } else if (fv == "file.inspectInfo.test.record") {
                                this.fileInspectInfoTestRecord = true;
                              }
                            });
                          }
                          if (
                            !this.functionTestTime &&
                            !this.functionTestSite
                          ) {
                            this.functionTestInfo = false;
                          }
                        }
                      })
                      .catch((err) => console.log(err));
                    if (
                      this.criticalRecord.poSampleResultList &&
                      this.criticalRecord.poSampleResultList.length > 0
                    ) {
                      this.getSpanArrForPoison(
                        this.criticalRecord.poSampleResultList
                      );
                    } else if (
                      this.criticalRecord.dnaResultDtoList &&
                      this.criticalRecord.dnaResultDtoList.length > 0
                    ) {
                      this.getSpanArr(this.criticalRecord.dnaResultDtoList);
                    }
                    //获取标题
                    if (
                      this.criticalRecord.authResultList &&
                      this.criticalRecord.authResultList.length > 0
                    ) {
                      var professionCategoryType =
                        this.detailMsg.professionCategory.type;
                      //获取委托事项类型
                      var entrustingMatterTypeList = [];
                      this.criticalRecord.authResultList.forEach((v, i) => {
                        if (
                          v.caEntrustingMatter &&
                          v.caEntrustingMatter.entrustingMatter &&
                          v.caEntrustingMatter.entrustingMatter.key
                        ) {
                          entrustingMatterTypeList.push(
                            v.caEntrustingMatter.entrustingMatter.key.value
                          );
                        }
                      });
                      if (
                        entrustingMatterTypeList.indexOf("DAMAGE_DEGREE") > -1
                      ) {
                        //损伤程度鉴定
                        this.authResultTitle = "鉴定结果";
                      }
                      if (
                        entrustingMatterTypeList.indexOf("DISABILITY_LEVEL") >
                        -1
                      ) {
                        //伤残鉴定
                        this.authResultTitle = "鉴定结果";
                      }
                      if (professionCategoryType.value == "TRACE") {
                        //痕迹鉴定
                        this.authResultTitle = "痕迹鉴定结果";
                      }
                      if (professionCategoryType.value == "DOCUMENT") {
                        //文书鉴定
                        this.authResultTitle = "文书鉴定结果";
                      }
                      if (
                        entrustingMatterTypeList.indexOf("VEHICLE_SPEED") > -1
                      ) {
                        this.authResultTitle = "车速鉴定结果";
                      }
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "payItemTab": //收费项目
            if (!this.payItemTable) {
              this.$get(
                "/api/ca-charging-item/v1/ca-charging-items?caseId=" +
                  this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.payItemTable = [];
                    var tempItemList = [];
                    res.data.forEach((v) => {
                      if (
                        v.fiCaseChargeItemList &&
                        v.fiCaseChargeItemList.length > 0
                      ) {
                        v.fiCaseChargeItemList.forEach((v1) => {
                          if (v1.amount) {
                            var data = JSON.parse(JSON.stringify(v));
                            data.fiCaseChargeItem = v1;
                            this.payItemTable.push(data);
                          } else {
                            var data = JSON.parse(JSON.stringify(v));
                            this.payItemTable.push(data);
                          }
                        });
                      } else {
                        this.payItemTable.push(v);
                      }
                    });
                    if (tempItemList.length > 0) {
                      tempItemList.forEach((v) => {
                        var flag = true;
                        this.payItemTable.forEach((v1) => {
                          if ((v1.chargingItem.id = v.chargeItem.id)) {
                            flag = false;
                          }
                        });
                        if (flag) {
                          this.payItemTable.push(v);
                        }
                      });
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "invoiceTab": //开票情况
            if (!this.invoiceTable) {
              this.$get("/api/ca-case/v1/cases/invoice/" + this.$route.query.id)
                .then((res) => {
                  if (res.status == 200) {
                    this.invoiceTable = res.data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }

            break;
          case "flowCaseChangeTab": //费用异动
            if (!this.flowCaseChangeTable) {
              this.$get(
                "/api/flow-case-change/v1/flow-case-changes/amount/list",
                { caseId: this.$route.query.id }
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.flowCaseChangeTable = res.data.list;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "suspendTab": //案件中止
            if (!this.caseSuspendTable) {
              this.$get("/api/ca-case/v1/cases/suspend/" + this.$route.query.id)
                .then((res) => {
                  if (res.status == 200) {
                    this.caseSuspendTable = res.data;
                    this.caseSuspendTable.forEach((item) => {
                      item.files = item.files.map((v, i) => {
                        var index = v.url.lastIndexOf("-");
                        var name = v.url.substring(index + 1);
                        var index2 = v.url.lastIndexOf(".");
                        var type = v.url.substring(index2 + 1);
                        return { fileType: type, name: name, url: v.url };
                      });
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          case "chargeChangeTab": //案件交接
            if (!this.changeList) {
              this.$get(
                "/api/ca-case/v1/cases/case-hand-over/" + this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.changeList = res.data;
                    console.log("this.changeList", this.changeList);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;

          case "sysDynamicValueTab": //其他信息
            if (!this.sysDynamicFieldTable) {
              this.$get(
                "/api/ca-sys-dynamic-field-value/v1/ca-sys-dynamic-field-values/" +
                  this.$route.query.id
              )
                .then((res) => {
                  if (res.status == 200) {
                    this.sysDynamicFieldTable = res.data;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            break;
          /* 新需求 */
          case "cover": //封面
            break;
          /* 止 */
        }
      },
    },
    payItemTable: {
      handler(newVal, oldVal) {
        if (this.payItemTable) {
          this.getSpanArr(this.payItemTable);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("login/headerTitleChange", "案件详情");
    this.$get("/api/ca-case/v1/cases/entrust-info/" + this.$route.query.id)
      .then((res) => {
        if (res.status == 200) {
          this.detailMsg = res.data;
          var name = "";
          if (res.data.labStaff && res.data.labStaff.length > 0) {
            var labStaffArr = res.data.labStaff;
            labStaffArr.forEach((v, i) => {
              name = name + v.participant.hrStaff.name + ",";
            });
            name = name.substr(0, name.length - 1);
          }
          //CNAS项目
          if (res.data.entrustInfo.isCnasItem == "Y") {
            this.isCnasItem = true;
          }
          this.detailMsg.labStaffName = name;
          this.$get(api.caCase + "/association/" + this.$route.query.id).then(
            (resIn) => {
              this.$set(this.detailMsg, "associationCases", resIn.data);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //委托信息中CNAS字段是否显示
    this.$get(api.menu + "/user")
      .then((res) => {
        this.treedata = [].concat(res.data);
      })
      .catch((err) => {});
  },
  mounted() {
    //获取所有的el-tab-pane，拿到第一个的name,设置activeName的值
    let nodes = document.getElementsByClassName("el-tab-pane");
    if (nodes && nodes.length > 0) {
      this.activeName = nodes[0].id.substr(5);
    }
  },
};
</script>

<style scoped lang="less">
[v-cloak] {
  display: none;
}

.label {
  color: #1f2f3d;
  /*color:#428bca;*/
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  margin-right: 8px;
  white-space: nowrap;
  display: table-cell;

  &:after {
    content: ":";
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
}

.detail {
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  padding-bottom: 16px;
  /*color: #909399;*/
  color: #666666;
  display: table-cell;
}

#identificationRecord {
  width: 100%;
  max-width: 100%;
  background-color: transparent;
  border-collapse: collapse;
  margin: 0 auto;
  font-size: 14px;

  td {
    color: #606266;
    border: 2px solid #eee;
    padding: 12px 8px;

    #authPhoto {
      height: 100px;
      width: 100px;
      margin: 10px;
      display: inline-block;
    }
  }

  tr {
    td:nth-child(1) {
      width: 30%;
    }
  }
}

.top {
  margin-top: 1%;
}

.item {
  height: 140px;
  width: 140px;
  display: inline-block;
}

a {
  color: #666666;
}

.img_box {
  float: left;
  height: auto;

  width: 150px;
}

.img_box p {
  padding: 0 5px;
  text-align: left;
}
.detail {
  /deep/.el-image__inner {
    width: 120px;
  }
}
</style>