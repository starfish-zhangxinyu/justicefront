<template>
  <div>
    <el-select
      v-model="value"
      size="small"
      :filterable="filterable"
      clearable
      :multiple="multiple"
      :class="className"
      :disabled="isDisabled || false"
      value-key="id"
      @change="changeValue"
    >
      <slot></slot>
      <div v-if="options.length > 0">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.hrStaff ? item.hrStaff.name : item.name"
          :value="isObject ? item : item.id"
          :disabled="item.id == userId"
        >
          <span style="float: left">{{
            (item.hrStaff && item.hrStaff.name) || item.name
          }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.loginName
          }}</span>
          <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>-->
        </el-option>
      </div>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "SelectFromQualification",
  props: [
    "qualification_type",
    "profession_category",
    "model",
    "filterable",
    "multiple",
    "className",
    "isObject",
    "isDisabled",
    "userId",
    "changeSelect",
    "dataScope",
    "orgId",
    "status",
  ],
  data() {
    return {
      options: [],
      value: this.model,
      temp: "",
      index: 0,
      pageFrom: this.status,
    };
  },
  methods: {
    init() {
      var data = {};
      data.professionCategoryId = this.profession_category;
      data.qualificationType = this.qualification_type;
      if (data.professionCategoryId && data.qualificationType) {
        if (data.qualificationType == "SALES") {
          data.enName = "MARKET";
          this.$get("/api/hr-staff/v1/hr-staffs/list", data)
            .then((res) => {
              this.options = res.data;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          if (!this.dataScope) {
            this.$get("/api/hr-staff/v1/hr-staffs/qualification", data)
              .then((res) => {
                this.options = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            data.dataScope = this.dataScope;
            this.$get(
              "/api/hr-staff/v1/hr-staffs/qualification/dataScope",
              data
            )
              .then((res) => {
                this.options = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    },
    init2(newVal, oldVal) {
      var data = {};
      if (this.qualification_type && this.profession_category) {
        data.qualificationType = this.qualification_type;
        data.professionCategoryId = newVal;
        if (newVal == "ALL") {
          data.professionCategoryId = "";
        }
        if (data.qualificationType) {
          if (data.qualificationType == "SALES") {
            data.enName = "MARKET";
            this.$get("/api/hr-staff/v1/hr-staffs/list", data)
              .then((res) => {
                this.options = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            data.qualificationType = this.qualification_type;
            if (!this.dataScope) {
              this.$get("/api/hr-staff/v1/hr-staffs/qualification", data)
                .then((res) => {
                  this.options = res.data;
                  this.value = this.model;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              data.dataScope = this.dataScope;
              this.$get(
                "/api/hr-staff/v1/hr-staffs/qualification/dataScope",
                data
              )
                .then((res) => {
                  this.options = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        }
      }
    },
    orgIdChangeinit(newVal, oldVal) {
      var data = {};
      if (this.qualification_type && this.profession_category) {
        data.qualificationType = this.qualification_type;
        /*data.professionCategoryId = newVal;
                    if (newVal == 'ALL' || newVal==undefined) {
                        data.professionCategoryId = '';
                    }*/
        if (
          this.profession_category == "ALL" ||
          this.profession_category == undefined
        ) {
          data.professionCategoryId = "";
        }
        if (data.qualificationType) {
          if (data.qualificationType == "SALES") {
            data.enName = "MARKET";
            this.$get("/api/hr-staff/v1/hr-staffs/list", data)
              .then((res) => {
                this.options = res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            data.qualificationType = this.qualification_type;
            if (!this.dataScope) {
              this.$get("/api/hr-staff/v1/hr-staffs/qualification", data)
                .then((res) => {
                  this.options = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              data.dataScope = this.dataScope;
              this.$get(
                "/api/hr-staff/v1/hr-staffs/qualification/dataScope",
                data
              )
                .then((res) => {
                  this.options = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        }
      }
    },
    changeValue() {
      this.$emit("update:model", this.value);
    },
  },
  watch: {
    deep: true,
    options: function (val) {
      //当model值与选项不符时，清空model
      if (this.model && val) {
        for (let i = 0; i < val.length; i++) {
          if (typeof this.model != "object" && this.model == val[i].id) {
            this.index++;
          } else if (
            typeof this.model == "object" &&
            this.model.indexOf(val[i].id) == 0
          ) {
            this.index++;
          }
        }
        if (this.index == 0) {
          this.value = undefined;
        } else if (this.index > 0) {
          this.value = this.model;
        }
      }
    },
    model: function (newval, oldval) {
      this.value = newval;
    },
    value: function (newval, oldval) {
      if (newval === "") {
        newval = null;
      }
      if (this.pageFrom != "CASE_COPY") {
        this.$emit("update:model", newval);
      }
    },
    profession_category: {
      handler(newVal, oldVal) {
        this.init2(newVal, oldVal);
        this.value = this.model;
      },
      immediate: true,
    },
    changeSelect: {
      handler(newVal, oldVal) {
        if (oldVal) {
          this.orgIdChangeinit(newVal, oldVal);
          this.init();
        }
      },
    },
    orgId(newVal, oldVal) {
      //机构变化时
      this.orgIdChangeinit(newVal, oldVal);
    },
  },
  created: function () {
    this.init();
    /*this.$watch('changeSelect',(newVal, oldVal) => {
                this.orgIdChangeinit(newVal,oldVal);
                console.log('ggggg',this.changeSelect)
                this.init();
            })*/
  },
};
</script>

<style scoped>
.multiple-select {
  width: 100%;
}
</style>
