<template>
  <div class="signature-box">
    <el-button
      type="primary"
      size="small"
      style="margin-bottom: 10px"
      @click="save('sealform')"
    >
      盖骑缝章
    </el-button>
    <el-button
      size="small"
      type="primary"
      @click="reSign"
      :disabled="reSignDisabled"
      >重新盖章</el-button
    >
    <el-form
      :model="form"
      size="small"
      :inline="true"
      label-width="130px"
      ref="sealform"
    >
      <el-form-item
        label="骑缝章位置类型"
        prop="pagingSealLocationType"
        :rules="$filter_rules({ required: true })"
      >
        <el-select
          v-model="form.pagingSealLocationType"
          placeholder="请选择"
          :disabled="isDisabled"
        >
          <el-option label="双面盖章" value="ALL"></el-option>
          <el-option label="奇数页盖章" value="ODD"></el-option>
          <el-option label="偶数页盖章" value="EVEN"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-box">
      <div class="pdf-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :style="{ width: pageCount * 40 + 80 + 'px' }"
          layout="prev, pager, next"
          :page-size="1"
          :current-page.sync="currentPage"
          :total="pageCount"
        >
        </el-pagination>
      </div>
      <div
        style="margin: 0 auto; height: 1123px; width: 794px"
        id="pdf-box"
        ref="pdfBox"
      >
        <pdf
          :src="pdfUrl"
          class="pdf"
          :page="currentPage"
          @num-pages="pageCount = $event"
        ></pdf>
      </div>
      <!-- -->
    </div>
    <div class="search-box" style="text-align: center">
      <!--<el-button size="small" type="primary" @click="save('sealform')">保存</el-button>-->
      <el-button size="small" type="success" @click="complete('sealform')"
        >完成</el-button
      >
    </div>
  </div>
</template>
<script>
import api from "../../api/index";
import pdf from "vue-pdf";
import VueDragResize from "vue-drag-resize";

export default {
  name: "Seal",
  components: { pdf: pdf, VueDragResize: VueDragResize },
  data() {
    return {
      form: {},
      isDisabled: false,
      currentPage: 1,
      pdfUrl: "",
      imageUrl: "",
      signDisabled: false,
      reSignDisabled: false,
      pageCount: 0,
    };
  },
  methods: {
    handleCurrentChange(current) {
      this.currentPage = current;
    },

    //重新签章
    reSign() {
      this.$get(api.getPdfUrl + "?caseId=" + this.$route.query.caseId)
        .then((res) => {
          this.pdfUrl = res.data.pdfUrl;
          this.imageUrl = res.data.imageUrl;
          this.isDisabled = false;
          this.form = { pagingSealLocationType: "" };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //完成
    complete(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            pdfUrl: this.pdfUrl,
            imageUrl: this.imageUrl,
            pagingSealLocationType: this.form.pagingSealLocationType,
          };
          this.$put(
            api.completeSeal +
              "?taskId=" +
              this.$route.query.taskId +
              "&procInsId=" +
              this.$route.query.procInsId +
              "&caseId=" +
              this.$route.query.caseId,
            data
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "已完成！",
                  type: "success",
                });
                /* this.$router.push({
                                    path: '/mydashboard',
                                }); */
                this.$router.go(-1); //为了保持筛选状态
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            pdfUrl: this.pdfUrl,
            imageUrl: this.imageUrl,
            pagingSealLocationType: this.form.pagingSealLocationType,
          };
          this.$put(
            api.pdfSeal +
              "?taskId=" +
              this.$route.query.taskId +
              "&procInsId=" +
              this.$route.query.procInsId +
              "&caseId=" +
              this.$route.query.caseId,
            data
          )
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                });
                this.$get(
                  api.getPdfUrl +
                    "?caseId=" +
                    this.$route.query.caseId +
                    "&taskId=" +
                    this.$route.query.taskId
                )
                  .then((res) => {
                    this.isDisabled = true;
                    this.pdfUrl = res.data.pdfUrl;
                    this.imageUrl = res.data.imageUrl;
                    this.form = {
                      pagingSealLocationType: res.data.pagingSealLocationType,
                    };
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
  created() {
    this.$get(
      api.getPdfUrl +
        "?caseId=" +
        this.$route.query.caseId +
        "&taskId=" +
        this.$route.query.taskId
    )
      .then((res) => {
        this.pdfUrl = res.data.pdfUrl;
        this.imageUrl = res.data.imageUrl;
        if (res.data.pagingSealLocationType) {
          this.isDisabled = true;
        }
        this.form = { pagingSealLocationType: res.data.pagingSealLocationType };
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>


<style scoped>
#pdf-box {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.pdf {
  border: 1px solid gainsboro;
  overflow: hidden;
  height: 1123px;
  width: 794px;
}

.picture {
  height: 100%;
  width: 100%;
}

.pdf-pagination {
  width: 250px;
  overflow: auto;
  margin: 0 auto;
  margin-bottom: 10px;
}

.box {
  border-radius: 50%;
}
</style>