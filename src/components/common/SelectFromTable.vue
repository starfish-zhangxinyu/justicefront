<template>
  <div id="testStandard">
    <el-select
      @change="change"
      @keyup.enter.native="handleKeyUp"
      value-key="id"
      v-model="value"
      size="small"
      :filterable="filterable"
      :filter-method="pinyinMatch"
      :disabled="disabled"
      :clearable="clearable"
      @clear="clear"
      :multiple="multiple"
      :allow-create="allowCreate"
      :class="className"
    >
      <slot></slot>
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="
          port == 'register'
            ? item.hrStaff
              ? item.hrStaff.name
              : item.name
            : item.name
        "
        :value="modelId ? item.id : item"
      >
        <span style="float: left">{{
          (item.hrStaff && item.hrStaff.name) || item.name
        }}</span>
        <span
          style="float: right; color: #8492a6; font-size: 13px"
          v-if="item.code != null"
          >{{ item.code }}</span
        >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import api from "../../api/index";

export default {
  name: "SelectFromTable",
  // props:['model','filterable','multiple','className','port','disabled','clearable','condition'],
  props: {
    model: {
      required: true,
    },
    defaultValue: {
      type: String, //默认值的name
    },
    hasDefault: {
      type: Boolean,
      required: false,
    },
    modelId: {
      type: Boolean,
      required: false,
    },
    port: {
      required: true,
    },
    filterable: { required: false },
    multiple: { required: false },
    disabled: { required: false },
    clearable: { required: false },
    allowCreate: { required: false },
    className: { required: false },
    condition: {
      type: Object,
      required: false,
    },
    changeSelect: {
      type: String,
    },
    orgId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      options: [],
      copyOptions: [],
      value: this.model,
      timer: null,
    };
  },
  methods: {
    clear() {
      this.options = this.copyOptions;
    },
    change(val) {
      this.$emit("change", val);
    },
    handleKeyUp() {
      this.$emit("keyup");
    },
    init(_this) {
      _this = this; // 不知this干嘛
      if (_this.port) {
        var data = {};
        data["page.pageSize"] = 1000;
        data["page.current"] = 1;
        if (_this.condition) {
          for (var key in _this.condition) {
            data[key] = _this.condition[key];
          }
        }
        if (_this.orgId && _this.port == "register") {
          data["orgId"] = _this.orgId;
        }
        clearTimeout(_this.timer);
        _this.timer = setTimeout(() => {
          _this
            .$get(api[_this.port], data)
            .then((res) => {
              _this.options = res.data.list || res.data;
              _this.copyOptions = res.data.list || res.data;
              if (_this.hasDefault && !_this.multiple) {
                if (!_this.model || !_this.model.id) {
                  var defaultVal = JSON.parse(JSON.stringify(_this.options[0]));
                  _this.value = defaultVal;
                }
              }
              if (_this.hasDefault && _this.multiple) {
                if (!_this.model.length) {
                  var defaultVal = JSON.parse(JSON.stringify(_this.options[0]));
                  _this.value.push(defaultVal);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }, 300);
      }
    },
    pinyinMatch(val) {
      const PinyinMatch = require("pinyin-match");
      if (val) {
        var result = [];
        this.copyOptions.forEach((i) => {
          var m = PinyinMatch.match(i.name, val);
          if (m) {
            result.push(i);
          }
        });
        this.options = result;
      } else {
        this.options = this.copyOptions;
      }
    },
  },
  watch: {
    deep: true,
    model: function (newval, oldval) {
      this.value = newval;
      this.$emit("valueChange", newval);
    },
    port: function (newval, oldval) {
      this.init(this);
    },
    //查询表格的条件
    changeSelect: {
      handler(newval, oldval) {
        this.init(this);
      },
      deep: true,
    },
    value: function (newval, oldval) {
      this.$emit("update:model", newval);
    },
    orgId(newVal, oldVal) {
      this.init(this);
    },
    condition(newVal, oldVal) {
      this.init(this);
    },
  },
  created: function () {
    this.init(this); // ???
  },
};
</script>

<style scoped lang="less">
.multiple-select {
  width: 100%;
}
</style>