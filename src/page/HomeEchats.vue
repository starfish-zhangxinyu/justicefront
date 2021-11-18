<template>
  <div>
    <el-row>
      <el-col :class="isMobile ? '' : 'chartsW50'">
        <Collapse
          title="机构案件量统计"
          class=""
          :active="true"
          v-if="hasPermission('dashboard:stat:caseCntByOrg')"
        >
          <template>
            <el-form
              :model="charts1Form"
              size="small"
              :inline="true"
              :label-width="labelWidth"
            >
              <el-form-item label="登记日期" class="margin0 marginTop20">
                <DataPicker
                  style="width: 260px"
                  :startValue.sync="charts1Form.from"
                  :endValue.sync="charts1Form.to"
                  valueFormat="yyyy-MM-dd"
                />
              </el-form-item>
              <el-button
                class="marginTop20"
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="search1"
                >查询
              </el-button>
            </el-form>
            <div class="box" id="echarts1"></div>
          </template>
        </Collapse>
      </el-col>
      <el-col :class="isMobile ? '' : 'chartsW50'">
        <Collapse
          title="案件量统计（按专业类别）"
          v-if="hasPermission('dashboard:stat:caseCntByPc')"
          :active="true"
        >
          <template>
            <el-form
              :model="charts2Form"
              size="small"
              :inline="true"
              :label-width="labelWidth"
            >
              <el-form-item label="登记日期" class="margin0 marginTop20">
                <DataPicker
                  style="width: 260px"
                  :startValue.sync="charts2Form.from"
                  :endValue.sync="charts2Form.to"
                  valueFormat="yyyy-MM-dd"
                />
              </el-form-item>
              <el-button
                type="primary"
                class="marginTop20"
                size="small"
                style="margin-left: 10px"
                @click="search2"
                >查询
              </el-button>
            </el-form>
            <div class="box" id="echarts2"></div>
          </template>
        </Collapse>
      </el-col>
      <el-col :class="isMobile ? '' : 'chartsW50'">
        <Collapse
          title="机构费用统计"
          :active="true"
          v-if="hasPermission('dashboard:stat:chargeByOrg')"
        >
          <template>
            <el-form
              :model="charts3Form"
              size="small"
              :inline="true"
              :label-width="labelWidth"
            >
              <el-form-item label="登记日期" class="margin0 marginTop20">
                <DataPicker
                  :startValue.sync="charts3Form.from"
                  style="width: 260px"
                  :endValue.sync="charts3Form.to"
                  valueFormat="yyyy-MM-dd"
                />
              </el-form-item>
              <el-button
                type="primary"
                size="small"
                class="marginTop20"
                style="margin-left: 10px"
                @click="search3"
                >查询
              </el-button>
            </el-form>
            <div class="box" id="echarts3"></div>
          </template>
        </Collapse>
      </el-col>
      <el-col :class="isMobile ? '' : 'chartsW50'">
        <Collapse
          title="费用统计（按专业类别）"
          :active="true"
          v-if="hasPermission('dashboard:stat:chargeByPc')"
        >
          <template>
            <el-form
              :model="charts4Form"
              size="small"
              :inline="true"
              :label-width="labelWidth"
            >
              <el-form-item label="登记日期" class="margin0 marginTop20">
                <DataPicker
                  :startValue.sync="charts4Form.from"
                  style="width: 260px"
                  :endValue.sync="charts4Form.to"
                  valueFormat="yyyy-MM-dd"
                />
              </el-form-item>
              <el-button
                type="primary"
                class="marginTop20"
                size="small"
                style="margin-left: 10px"
                @click="search4"
                >查询
              </el-button>
            </el-form>
            <div class="box" id="echarts4"></div>
          </template>
        </Collapse>
      </el-col>
    </el-row>
  </div>
</template>
<!-- 首页echarts -->
<script>
import api from "./../api/index";
import Collapse from "./layout/Collapse";
import { mapState } from "vuex";

export default {
  name: "",
  data() {
    return {
      labelWidth: "80px",
      charts1Form: {},
      charts2Form: {},
      charts3Form: {},
      charts4Form: {},
      charts1List: [],
      charts2List: [],
      charts3List: [],
      charts4List: [],
    };
  },
  inject: ["hasPermission"],
  methods: {
    //获取昨天和上个月
    getTime() {
      let yesterday = new Date();
      let lastMonth = new Date();
      yesterday.setTime(yesterday.getTime()); //今天
      lastMonth.setTime(lastMonth.getTime() - 24 * 60 * 60 * 1000 * 32); //上个月
      let s1 = `${yesterday.getFullYear()}-${
        yesterday.getMonth() + 1
      }-${yesterday.getDate()}`; //昨天
      let s2 = `${lastMonth.getFullYear()}-${
        lastMonth.getMonth() + 1
      }-${lastMonth.getDate()}`; //上个月
      Object.assign(this.charts1Form, { from: s2, to: s1 });
      Object.assign(this.charts2Form, { from: s2, to: s1 });
      Object.assign(this.charts3Form, { from: s2, to: s1 });
      Object.assign(this.charts4Form, { from: s2, to: s1 });
    },
    tooltipCustom(res) {
      return ` <div class='tooltipDemo1'>
                            <span>${res.data}</span>
                            <span>(件)</span>
                        </div>`;
    },
    //自定义tooltips
    //单柱
    optionty1({ xAxisTit, maxData, data }) {
      let { tooltipCustom } = this;
      return {
        color: ["#428bca", "#dfebff"],
        tooltip: {
          formatter(params) {
            return tooltipCustom(params);
          },
          backgroundColor: "transparent",
        },
        grid: {
          left: "0",
          right: "60",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xAxisTit, //--------------------------- x轴参数
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
            },
            axisLabel: {
              interval: 0,
              rotate: -30,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
            },
            minInterval: 1 /*     统计图间隔*/,
          },
        ],
        series: [
          {
            type: "bar",
            barGap: "-100%",
            barCategoryGap: "40%",
            data: maxData, //设置最大高度
            animation: false,
            barWidth: 10,
            cursor: "default",
            z: 1,
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                opacity: 0.85,
                color: "#dfebff",
              },
              emphasis: {
                label: {
                  show: false,
                },
                show: false,
                color: "#dfebff",
              },
            },
            tooltip: {
              formatter(params) {
                return "";
              },
              backgroundColor: "transparent",
            },
          },
          {
            name: "直接访问",
            type: "bar",
            z: 66,
            barWidth: "60%",
            data: data, //----------------柱状图参数
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                opacity: 0.85,
                color: "#324A90",
              },
            },
          },
        ],
      };
    },
    //双柱
    optionty2({ xAxisTit, data, data2 }) {
      let { tooltipCustom } = this;
      return {
        color: ["#428bca", "#324A90"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "0",
          right: "65",
          // top: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xAxisTit, //--------------------------- x轴参数
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
            },
            axisLabel: {
              interval: 0,
              rotate: -30,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            name: "       万元",

            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
            },
            /* axisLabel: {
                                formatter: '{value}(万元)'
                            }, */
            /* minInterval: 10000 */
            nameTextStyle: {
              padding: [5, 38, 5, 5],
            },
          },
        ],
        series: [
          {
            name: "实收金额",
            type: "bar",
            data: data, //----------------柱状图参数
            barWidth: 20,
            barGap: 0,
            itemStyle: {
              normal: {
                opacity: 0.85,
              },
            },
          },
          {
            name: "合同金额",
            type: "bar",

            data: data2, //----------------柱状图参数
            barWidth: 20,
          },
        ],
      };
    },
    charts1() {
      if (!this.hasPermission("dashboard:stat:caseCntByOrg")) return;
      let list = this.charts1List;
      let myChart = this.$echarts.init(document.getElementById("echarts1"));
      /* var xAxisTit = list.map(item => item.orgName);
                var data = list.map(item => item.caseCnt);
                var max2 = data.sort((a, b) => b - a)[0];
                var yhShadow = data.map(item => max2); */

      let xAxisTit = list.map((item) => item.orgName);
      let yhShadow = list.map((item) => list[0].caseCnt);
      let data = list.map((item) => item.caseCnt);
      myChart.setOption(
        this.optionty1({
          xAxisTit: xAxisTit,
          maxData: yhShadow,
          data: data,
        })
      );
    },
    charts2() {
      if (!this.hasPermission("dashboard:stat:caseCntByPc")) return;
      let list = this.charts2List;
      let myChart = this.$echarts.init(document.getElementById("echarts2"));
      /* var xAxisTit = list.map(item => item.professionCategoryName);
                var data = list.map(item => item.caseCnt);
                console.log('data',data)
                console.log('xAxisTit',xAxisTit)
                var max2 = data.sort((a, b) => b - a)[0];
                var yhShadow = data.map(item => max2); */

      let xAxisTit = list.map((item) => item.professionCategoryName);
      let yhShadow = list.map((item) => list[0].caseCnt);
      let data = list.map((item) => item.caseCnt);

      myChart.setOption(
        this.optionty1({
          xAxisTit: xAxisTit,
          maxData: yhShadow,
          data: data,
        })
      );
    },
    charts3() {
      if (!this.hasPermission("dashboard:stat:chargeByOrg")) return;
      let list = this.charts3List;
      let myChart = this.$echarts.init(document.getElementById("echarts3"));
      let xAxisTit = list.map((item) => item.orgName);
      let data2 = list.map((item) => item.amount.cent / 1000000);
      let data = list.map((item) => item.realReceived.cent / 1000000);
      let yhShadow = list.map((item) => list[0].amount.cent);
      myChart.setOption(
        this.optionty2({
          xAxisTit: xAxisTit,
          data: data,
          data2: data2,
        })
      );
    },
    charts4() {
      if (!this.hasPermission("dashboard:stat:chargeByPc")) return;
      let list = this.charts4List;
      let myChart = this.$echarts.init(document.getElementById("echarts4"));
      let xAxisTit = list.map((item) => item.professionCategoryName);
      let data2 = list.map((item) => item.amount.cent / 1000000);
      let data = list.map((item) => item.actualReceivable.cent / 1000000);
      let yhShadow = list.map((item) => list[0].amount.cent);
      myChart.setOption(
        this.optionty2({
          xAxisTit: xAxisTit,
          data: data,
          data2: data2,
        })
      );
    },
    search1() {
      let { from, to } = this.charts1Form;
      /*if (!from || !to) {
                    this.$message.error("日期不能为空!");
                    return;
                }*/

      if (!to) {
        let today = new Date();
        to = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`; //今天
      }
      if (!from) {
        from = "2019-01-01";
      }

      this.$get(api.orgCaseCntApi, { from: from, to: to })
        .then((res) => {
          if (res.status === 200) {
            this.charts1List = res.data;
            this.$nextTick(() => this.charts1());
          }
        })
        .catch((err) => console.log(err));
    },
    search2() {
      let { from, to } = this.charts2Form;
      /* if (!from || !to || !this.orgId) {
                    this.$message.error("日期及机构不能为空!");
                    return;
                }*/
      if (!this.orgId) {
        this.$message.error("机构不能为空!");
        return;
      }
      if (!to && this.orgId) {
        let today = new Date();
        to = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`; //今天
      }
      if (!from && this.orgId) {
        from = "2019-01-01";
      }

      this.$get(api.pcCaseCntApi, { from: from, to: to, orgId: this.orgId })
        .then((res) => {
          if (res.status === 200) {
            this.charts2List = res.data;
            this.$nextTick(() => this.charts2());
          }
        })
        .catch((err) => console.log(err));
    },
    search3() {
      let { from, to } = this.charts3Form;
      /*if (!from || !to) {
                    
                    this.$message.error("日期不能为空!");
                    return;
                }*/

      if (!to) {
        let today = new Date();
        to = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`; //今天
      }
      if (!from) {
        from = "2019-01-01";
      }
      this.$get(api.orgAmountApi, { from: from, to: to })
        .then((res) => {
          if (res.status === 200) {
            this.charts3List = res.data;
            this.$nextTick(() => this.charts3());
          }
        })
        .catch((err) => console.log(err));
    },
    search4() {
      let { from, to } = this.charts4Form;
      /*if (!from || !to || !this.orgId) {
                    this.$message.error("日期及机构不能为空ss!");
                    return;
                }*/
      if (!this.orgId) {
        this.$message.error("机构不能为空!");
        return;
      }
      if (!to && this.orgId) {
        let today = new Date();
        to = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`; //今天
      }
      if (!from && this.orgId) {
        from = "2019-01-01";
      }
      let data = { from: from, to: to };
      this.$get(api.pcAmountApi, data)
        .then((res) => {
          if (res.status === 200) {
            this.charts4List = res.data.list;
            this.$nextTick(() => this.charts4());
          }
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.getTime();
    Object.assign(this.charts1Form, { from: "2019-01-01" });
    Object.assign(this.charts2Form, { from: "2019-01-01" });
    Object.assign(this.charts3Form, { from: "2019-01-01" });
    Object.assign(this.charts4Form, { from: "2019-01-01" });
    this.search2();
    this.$get(api.myInfo).then((res) => {
      if (res.data.orgId == null || res.data.orgId.length == 0) {
        this.$get(api.org + "/setOrgId?orgId=" + null)
          .then((res) => {
            this.search1(); //集团才有
            this.search3(); //集团才有
          })
          .catch((e) => console.log(e));
      }
    });
    this.search4();
  },
  watch: {
    orgId: function () {
      this.search2();
      this.search4();
    },
  },
  computed: {
    ...mapState("login", ["orgId", "isMobile"]),
  },
  components: {
    Collapse,
  },
};
</script>

<style lang='less' scoped>
.bgFFF {
  background: #ffffff;
}

.marginTop20 {
  margin-top: 10px !important;
}

.marginR20 {
  margin-right: 20px;
}

.chartsW50 {
  width: calc(50% - 10px);
}

.top {
  border-bottom: 1px solid #e5e5e5;
  height: 70px;
  padding: 28px 0 0 28px;
  font-size: 20px;
  color: #2b2b2b;
  line-height: 20px;
  box-sizing: border-box;
}

.top img,
.top span {
  float: left;
}

.top span {
  font-weight: 600;
}

.top img {
  margin-right: 5px;
  height: 18px;
  width: 5px;
  margin-top: 1px;
}

.box {
  padding: 0 20px;
  box-sizing: border-box;
  height: 450px;
  width: 100%;
}
</style>