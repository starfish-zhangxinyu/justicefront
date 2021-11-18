<template>
  <el-dialog title="委托单位添加" width="700px" :visible.sync="EntrustedAddDia">
    <el-form
      :model="addForm"
      size="small"
      ref="entrustingUnitForm"
      label-width="100px"
      :rules="rule"
    >
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="委托单位辖区">
            <select-from-dict :model.sync="addForm.prefectureId"
                              :has-default="true"
                              className="w100"
                              data_type="prefecture_id"></select-from-dict>
<!--            <el-input v-model.trim="addForm.prefectureId" />-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item
            label="单位名称"
            prop="name"
          >
            <el-input v-model.trim="addForm.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="委托单位类别">
            <el-select v-model="addForm.type" class="w100" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="所属区域">
            <treeSelect title="区域" :model.sync="addForm.area" name="area" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="地址">
            <el-input v-model.trim="addForm.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="电话">
            <el-input v-model.trim="addForm.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="传真">
            <el-input v-model.trim="addForm.fax" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{ span: 16, offset: 4 }">
          <el-form-item label="备注">
            <el-input v-model="addForm.remarks" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button type="primary" @click="submit" size="small">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Test from "@/components/common/TreeSelect";
import api from "@/api/index";

export default {
  name: "",
  data() {
    var nameDistinct = (rule, value, callback) =>{
      this.$get(api.entrustingUnitNameValidate, {"newName":value,"id":this.addForm.id}).then(res=>{
        if(!res.data){
          callback(new Error("'"+value+"'已经存在！"))
        } else {
          callback();
        }
      }).catch(err=>{
        callback(new Error('服务器错误！'));
      })
    };
    return {
      addForm: {
        prefectureId:'',
        name:'',
        type:'',
        area:{},
        address:'',
        fax:'',
        phone:'',
        remarks:'',
      },
      rule:{
        name: [
          { required: true, message: '该输入项为必填项!', trigger: 'blur'},
          {min: 1, max: 50, message: '最多输入50个字符!', trigger:'blur'},
          { validator: nameDistinct, trigger: 'blur'  },
        ]
      },
      options: [],
      EntrustedAddDia: false
    };
  },
  methods: {
    init() {
      this.$get(api.dict, {
        "page.pageSize": "1000",
        "page.current": "1",
        type: "ex_unit_type"
      })
        .then(({ data }) => (this.options = data.list))
        .catch(err => console.log(err));
      this.EntrustedAddDia = true;
    },
    cancel() {
      Object.assign(this.addForm,{
        superiorDepartment:'',
        name:'',
        type:'',
        area:{},
        address:'',
        fax:'',
        phone:'',
        remarks:'',
      })
      this.EntrustedAddDia = false;
    },
    submit() {
      this.save("entrustingUnitForm");
    },
    save(formName) {
      var data = JSON.parse(JSON.stringify(this.addForm));
      data.externalPersonDtoList = [].concat(data.externalPersonDtoList || []);
      data.agreementPriceDtoList = [].concat(data.agreementPriceDtoList || []);
      data.externalPersonDtoList.forEach((v, i) => {
        v.type = "UNIT_CONTACT";
      });
      data.agreementPriceDtoList.forEach(item => {
        if (item.agreementPrice.yuanFmt !== 0) {
          item.agreementPrice.cent = item.agreementPrice.yuanFmt * 100;
        }
      });
      data.type = this.options.filter((v, i) => {
        return v.id == data.type;
      })[0];
      this.$refs[formName].validate(valid => {
        if (valid) {
          let loadingInstance = this.$loading({ fullscreen: true });
          this.$post(api.entrustingUnit, data)
            .then(res => {
              debugger
              if (res.status == 200) {
                this.$message({
                  message: "新增成功！",
                  type: "success"
                });
                this.cancel();
                this.$refs[formName].resetFields();
                this.$emit('addOk',res.data);
              }
              loadingInstance.close();
            })
            .catch(err => {
              console.log(err);
              loadingInstance.close();
            });
        }
      });
    }
  },
  components: {
    treeSelect: Test
  }
};
</script>

<style lang="less" scoped></style>
