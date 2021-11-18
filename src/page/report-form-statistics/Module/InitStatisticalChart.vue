<template>
  <div>
    <el-dialog
      title="统计图表"
      :visible.sync="initChartDia"
      width="800px"
      :before-close="cancel"
    >
      <div>
        <el-form :model="searchForm" size="small">
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="统计维度" :label-width="labelWidth">
                <Select2
                  :model.sync="searchForm.professionCategoryId"
                  port="profession"
                  className="multiple-select w100"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="纵轴" :label-width="labelWidth">
                <el-select
                  v-model="searchForm.value"
                  class="w100"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="横轴（一级）" :label-width="labelWidth">
                <Select2
                  :model.sync="searchForm.professionCategoryId"
                  port="profession"
                  className="multiple-select w100"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="横轴（二级）" :label-width="labelWidth">
                <Select2
                  :model.sync="searchForm.professionCategoryId"
                  port="profession"
                  className="multiple-select w100"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="同比（月）" :label-width="labelWidth">
                <el-select
                  v-model="searchForm.value"
                  class="w100"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="同比（年）" :label-width="labelWidth">
                <el-date-picker
                  v-model="searchForm.value3"
                  class="w100"
                  type="year"
                  placeholder="选择年"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="环比类型" :label-width="labelWidth">
                <el-select
                  v-model="searchForm.value"
                  class="w100"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
              <el-form-item label="环比时间" :label-width="labelWidth">
                <el-col :span="11">
                  <el-form-item prop="beginRegisterDate">
                    <el-date-picker
                      class="w100"
                      v-model="searchForm.beginRegisterDate"
                      type="year"
                      placeholder="开始日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center"
                  >-</el-col
                >
                <el-col :span="11">
                  <el-form-item prop="endRegisterDate">
                    <el-date-picker
                      class="w100"
                      v-model="searchForm.endRegisterDate"
                      type="year"
                      placeholder="结束日期"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Select2 from "../../../components/common/Select2";

export default {
  name: "",
  data() {
    return {
      labelWidth: "100px",
      panClass: {
        sm: { span: 12 },
        md: { span: 12 },
        xl: { span: 11, offset: 1 }
      },
      initChartDia: false,
      searchForm: {},
      options: [
        {
          value: "选项1",
          label: "案件量"
        },
        {
          value: "选项2",
          label: "合同金额（万）"
        },
        {
          value: "选项3",
          label: "已收金额（万）"
        },
        {
          value: "选项34",
          label: "未收金额（万）"
        }
      ],
      options2: [
        {
          value: "选项1",
          label: "一月"
        },
        {
          value: "选项21",
          label: "二月"
        },
         {
          value: "选项22",
          label: "三月"
        },
         {
          value: "选项23",
          label: "四月"
        },
         {
          value: "选项24",
          label: "五月"
        },
         {
          value: "选项25",
          label: "六月"
        },
         {
          value: "选项26",
          label: "七月"
        },
         {
          value: "选项27",
          label: "八月"
        },
         {
          value: "选项28",
          label: "九月"
        }, {
          value: "选项29",
          label: "十月"
        },
         {
          value: "选项200",
          label: "十一月"
        }, {
          value: "选项211",
          label: "十二月"
        }
      ],
      options4: [
        {
          value: "选项1",
          label: "月环比"
        },
        {
          value: "选项2",
          label: "年环比"
        }
      ]
    };
  },
  methods: {
    init() {
      this.initChartDia = true;
    },
    cancel() {
      this.initChartDia = false;
    },
    submit() {
       this.cancel(); 
    }
  },
  components: { Select2 }
};
</script>

<style lang="" scoped></style>
