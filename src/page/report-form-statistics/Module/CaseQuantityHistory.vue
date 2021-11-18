<template>
  <el-dialog title="委托单位名称变更历史" width="600px" :visible.sync="CaseQuantityHistoryDia">
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="单位名称" prop="name" width="180" />
      <el-table-column label="修改时间" prop="nameChangeDate" width="180" />
      <el-table-column label="状态" prop="status" width="180">
        <template slot-scope="scope">
          {{scope.row.status=="NOR"?'正常':'过期'}}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">关 闭</el-button>
      <!-- <el-button type="primary" @click="submit('TimeExtendForm')" size="small">保 存</el-button> -->
    </div>
  </el-dialog>
</template>
 <!-- 案件时效延长 -->
<script>
import Collapse from "@/page/layout/Collapse";
import api from "@/api/index";

export default {
  name: "CaseQuantityHistoryDia",
  data() {
    return {
      tableData: [],
      CaseQuantityHistoryDia: false
    };
  },
  methods: {
    init(item) {
      let { entrustInfoId: unitId } = item;
      this.$get(api.getUnitChangeApi, { unitId: unitId })
        .then(({ data }) => {
          this.tableData = data;
        })
        .catch(err => console.log(err));
      this.CaseQuantityHistoryDia = true;
    },
    cancel() {
      this.CaseQuantityHistoryDia = false;
    }
  },
  components: {
    Collapse
  }
};
</script>

<style lang="less" scoped></style>
