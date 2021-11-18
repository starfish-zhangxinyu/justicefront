<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="物证样本关系列表" name="list">
      <Table
        :data.sync="tableData"
        :page.sync="page"
        port="dnaRelationListApi"
        @edit="edit"
        :hasPaging="true"
        @deleteRow="deleteRow"
        :selfDefinedBtn="false"
        :isDragdrop="true"
        @dragdropCb="dragdropCb"
      >
        <template solt>
          <el-table-column prop="name" label="关系名称"> </el-table-column>
          <el-table-column prop="sampleRelationType.label" label="关系类型">
          </el-table-column>
          <el-table-column prop="letter" label="携带的字母"> </el-table-column>
          <el-table-column prop="sort" label="排列顺序"> </el-table-column>
        </template>
      </Table>
    </el-tab-pane>
    <el-tab-pane label="物证样本关系添加" name="form"></el-tab-pane>
  </el-tabs>
</template>

<script>
import api from "../../../api/index.js";
export default {
  name: "MESMIList",
  data() {
    return {
      activeName: "list",
      tableData: [],
      tablesort: null,
      searchdata: {},
      page: { current: 1, pageSize: 30, total: 0 }
    };
  },
  methods: {
    dragdropCb(json){
       this.$put(api.tablesSortApi,{...json,...{tableName:'dna_sample_relation'}})
       .catch(err =>console.log(err));
    },
    init() {
      this.$get(api.dnaRelationListApi, {
        "page.current": this.page.current,
        "page.pageSize": this.page.pageSize
      })
        .then(res => {
          this.tableData = res.data.list;
          this.page.pageSize = res.data.pageSize;
          this.page.current = res.data.current;
          this.page.total = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteRow(index, row) {
      this.$confirmBox("确定删除该物证样本关系?")
        .then(res => {
          this.$del(api.dnaRelationDelApi + "/" + row.id)
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });
                this.init();
              } else {
                this.$message({
                  message: "删除失败！",
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {});
    },
    edit(index, row) {
      this.$router.push({
        path: "/auth/MaterialEvidenceSample/form",
        query: { id: row.id }
      });
    }
  },
  watch: {
    activeName: function(newval, oldval) {
      if (newval == "list") {
        this.$router.push({ path: "/auth/MaterialEvidenceSample/list" });
      } else {
        this.$router.push({ path: "/auth/MaterialEvidenceSample/form" });
      }
    }
  },
  created() {}
};
</script>

<style scoped></style>
