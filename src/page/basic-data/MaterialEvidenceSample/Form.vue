<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="物证样本关系列表" name="list"></el-tab-pane>
    <el-tab-pane
      :label="isAdd ? '物证样本关系添加' : '物证样本关系修改'"
      name="form"
    >
      <el-form :model="addForm" size="small" ref="wzybform" label-width="150px">
        <el-row>
          <el-col :lg="{ span: 16}">
            <el-form-item
              label="关系名称"
              prop="name"
              :rules="$filter_rules({ required: true, maxLength: 50 })"
            >
              <el-input v-model.trim="addForm.name" />
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="关系类型"
              prop="sampleRelationType"
              :rules="$filter_rules({ required: true })"
            >
              <select-from-enum
                className="w100"
                :model.sync="addForm.sampleRelationType"
                :clearable="true"
                type="dna.SampleRelationType"
              />
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item label="携带的字母">
              <el-input v-model="addForm.letter" />
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item
              label="排列顺序"
              prop="sort"
              :rules="$filter_rules({ required: true, type: 'number' })"
            >
              <el-input v-model.number="addForm.sort" />
            </el-form-item>
          </el-col>

          <el-col :lg="{ span: 16 }">
            <el-form-item label="备注" :lg="{ span: 16 }">
              <el-input v-model="addForm.remarks" type="textarea" />
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
            @click="save('wzybform')"
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
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";

export default {
  name: "MESMIForm",
  data() {
    return {
      activeName: "",
      isAdd: null,
      addForm: {}
    };
  },
  methods: {
    save(formName) {
      let {
        id,
        remarks,
        name,
        sampleRelationType,
        letter,
        sort
      } = this.addForm;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            id: id,
            remarks: remarks,
            name: name,
            sampleRelationType: sampleRelationType,
            letter: letter,
            sort: sort
          };
          if (this.isAdd) {
            //新增
            delete data.id;
          }
          this.$post(api.dnaRelationSaveApi, data)
            .then(res => {
              if (res.status == 200) {
                if (this.isAdd) {
                  this.$message({
                    message: "新增成功！",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: "修改成功！",
                    type: "success"
                  });
                }
                this.$router.push({
                  path: "/auth/MaterialEvidenceSample/list"
                });
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  message: "操作失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              if (err.errCode =='message.160003') {
                this.$message.error(err.errMsg);
              }else {
                console.log(err)
              }
            });
        }
      });
    }
  },
  created() {
    this.activeName = "form";
    if (this.$route.query.id) {
      this.isAdd = false;
      this.$get(api.dnaRelationDetailApi + "/" + this.$route.query.id).then(
        res => {
          var data = JSON.parse(JSON.stringify(res.data));
          this.addForm = data;
        }
      );
    } else {
      this.isAdd = true;
    }
  },
  watch: {
    activeName: function(newval, oldval) {
      if (newval == "list") {
        this.$router.push({ path: "/auth/MaterialEvidenceSample/list" });
      }
    }
  }
};
</script>

<style scoped></style>
