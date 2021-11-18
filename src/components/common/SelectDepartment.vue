<template>
  <!--选择部门-->
  <div v-if="office">
    <el-input v-model="office.name" :disabled="true" style="width: 100%">
      <el-button
        icon="el-icon-close"
        slot="append"
        @click="clearContent"
      ></el-button>
      <el-button
        icon="el-icon-search"
        slot="append"
        @click="selectDepartment"
      ></el-button>
    </el-input>
    <el-dialog
      title="部门选择"
      :visible.sync="selectDepartmentDialog"
      width="30%"
    >
      <!--<div style="height: 400px;overflow-y:scroll;color:#606266">-->
      <!--<v-jstree :data="treeData"-->
      <!--v-if="isShow"-->
      <!--@item-click="itemClick"-->
      <!--collapse allow-batch>-->
      <!--</v-jstree>-->
      <!--</div>-->
      <el-tree
        class="filter-tree"
        :data="treeData"
        default-expand-all
        @node-click="currentClick"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <i
            class="fa fa-folder"
            aria-hidden="true"
            style="font-size: 18px; margin: 0 5px; color: #dbc056"
          ></i
          >{{ node.label }}
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport">确 定</el-button>
        <el-button @click="selectDepartmentDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VJstree from "vue-jstree";
import api from "../../api/index.js";

export default {
  name: "SelectDepartment",
  components: { "v-jstree": VJstree },
  props: ["model"],
  data() {
    return {
      office: { name: "" },
      selectDepartmentDialog: false,
      treeData: [],
      treeVal: {},
    };
  },
  methods: {
    hanveChild(n, d) {
      if (n.childNodes.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    selectDepartment() {
      this.$get(api.offices)
        .then((res) => {
          this.treeData = [].concat(res.data);
          this.selectDepartmentDialog = true;
        })
        .catch((err) => {});
    },
    currentClick(a, b, c) {
      this.treeVal = "";
      this.treeVal = a;
    },
    confirmImport() {
      this.office = this.treeVal;
      this.selectDepartmentDialog = false;
    },
    clearContent() {
      this.office = {};
    },
  },
  watch: {
    model: function (newval, oldval) {
      if (newval) {
        this.office = newval;
      } else {
        this.office = { name: "" };
      }
    },
    office: function (newval, oldval) {
      this.$emit("update:model", newval);
    },
    deep: true,
  },
};
</script>

<style scoped>
</style>
