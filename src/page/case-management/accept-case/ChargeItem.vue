<template>
  <div>
    <!--收费项目-->
    <Portlet title="收费项目" :isKey="true">
      <template slot="buttonGroup">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="importPayItem()"
          >标准价导入
        </el-button>
        <el-button
          v-if="basicMsg.entrustInfo.entrustingPartyType == 'UNIT'"
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          style="float: right; margin-right: 10px; margin-top: 5px"
          @click="importAgreementPrice()"
          >协议价导入
        </el-button>
      </template>
      <template slot="body">
        <el-form
          ref="form"
          label-width="0px"
          size="small"
          :model="acceptForm"
          class="demo-ruleForm"
        >
          <el-table
            fit
            :data="acceptForm.chargingItemList"
            stripe
            border
            show-summary
            :summary-method="getSummaries"
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="chargingItem.name" label="收费项目">
            </el-table-column>
            <el-table-column
              prop="chargingItem.chargingType.name"
              label="收费类别"
            >
            </el-table-column>
            <el-table-column prop="quantity" label="数量">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="'chargingItemList.' + scope.$index + '.quantity'"
                >
                  <el-input
                    v-if="
                      !(
                        ($route.query.status == 'CASE_COPY'
                          ? false
                          : isAbled || hasInvoiced) && !scope.row.isAbled
                      )
                    "
                    v-model.number="scope.row.quantity"
                    size="small"
                  ></el-input>
                  <span v-else>
                    {{ scope.row.quantity }}
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="'chargingItemList.' + scope.$index + '.unitPrice'"
                >
                  <el-input-number
                    v-if="
                      !(
                        ($route.query.status == 'CASE_COPY'
                          ? false
                          : isAbled || hasInvoiced) && !scope.row.isAbled
                      )
                    "
                    class="w100"
                    v-model="scope.row.unitPrice"
                    controls-position="right"
                    :precision="2"
                    :min="
                      scope.row.chargingItem.minPrice
                        ? scope.row.chargingItem.minPrice.cent / 100
                        : 0
                    "
                    :max="
                      scope.row.chargingItem.maxPrice
                        ? scope.row.chargingItem.maxPrice.cent / 100
                        : Number.MAX_VALUE
                    "
                  />
                  <span v-else>
                    {{ scope.row.unitPrice }}
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="金额">
              <template slot-scope="scope">
                {{ scope.row.unitPrice * scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  :prop="'chargingItemList.' + scope.$index + '.remarks'"
                >
                  <el-input v-model="scope.row.remarks" size="small"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px" align="center">
              <template slot-scope="scope">
                <el-button
                  :disabled="
                    ($route.query.status == 'CASE_COPY'
                      ? false
                      : isAbled || hasInvoiced) && !scope.row.isAbled
                  "
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deletePayRow(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </Portlet>
    <!--导入收费项目-->
    <el-dialog title="导入收费项目" :visible.sync="importPayItemDialog">
      <el-table
        :data="payArr"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
        max-height="800px;"
        @selection-change="importPaySelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="name" label="鉴定项目"> </el-table-column>
        <el-table-column prop="chargingType.name" label="收费类型">
        </el-table-column>
        <el-table-column prop="price.yuanFmt" label="价格"> </el-table-column>
        <!--<el-table-column-->
        <!--prop="remarks"-->
        <!--label="备注"-->
        <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!--div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="payArr"
                            :search.sync="searchdata"
                            :sort.sync="tablesort"
                            :port="payPort"></pagination>
                </div>-->
        <el-button @click="importPayItemDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmImportPay()" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--导入协议价-->
    <el-dialog title="导入协议价" :visible.sync="importPriceDialog">
      <el-table
        :data="agreementPriceArr"
        tooltip-effect="dark"
        stripe
        border
        size="mini"
        style="width: 100%"
        @selection-change="agreementPriceSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="baseChargingItem.name" label="鉴定项目">
        </el-table-column>
        <el-table-column
          prop="baseChargingItem.chargingType.name"
          label="收费类型"
        >
        </el-table-column>
        <el-table-column prop="agreementPrice.yuanFmt" label="协议价">
        </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importPriceDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="confirmImportAgreementPrice()"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex"; //先要引入
import Portlet from "../../layout/Portlet";
import api from "../../../api/index";

export default {
  name: "ChargeItem",
  components: { Portlet: Portlet },
  data() {
    return {
      payArr: [],
      page: { pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1 },
      tablesort: null,
      searchdata: {},
      payPort: "",
      checkedPayItem: [],
      importPayItemDialog: false,
      importPriceDialog: false,
      agreementPriceArr: [],
      checkedAgreementPrice: [],
    };
  },
  props: {
    isEdit: { type: Boolean, default: false },
    isAbled: { type: Boolean, default: false },
    hasInvoiced: { type: Boolean, default: false },
  },
  methods: {
    //表格合计
    getSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = "";
          return;
        }
        if (index === 5) {
          sums[index] = "";
          return;
        }
        if (index === 3) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property === "quantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        const value = data.map((item) =>
          Number(item.unitPrice * item.quantity)
        );
        if (column.property === "total") {
          sums[index] = value.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      this.sums = sums;
      return sums;
    },
    //导入收费项目
    importPayItem() {
      if (this.$route.query.status === "ACCEPT_EDIT") {
        if (this.isAbled) {
          this.$message.error("该案件已收费，请使用费用异动进行增加收费项目！");
          return;
        }
        if (this.hasInvoiced) {
          this.$message.error("该案件已开票，请使用费用异动进行增加收费项目！");
          return;
        }
      }

      this.importPayItemDialog = true;
      this.payPort = "chargeItem";
      this.checkedPayItem = [];
      this.searchdata = {
        professionCategoryId: this.basicMsg.professionCategory.id,
      };
      this.$get(api[this.payPort], this.searchdata).then((res) => {
        this.payArr = res.data.list;
      });
    },
    importPaySelectionChange(selection) {
      this.checkedPayItem = [].concat(selection);
    },
    confirmImportPay() {
      this.checkedPayItem.forEach((v, i) => {
        var index = this._.findIndex(
          this.acceptForm.chargingItemList,
          function (o) {
            return o.chargingItem.id == v.id;
          }
        );
        if (index == -1) {
          this.acceptForm.chargingItemList.push({
            chargingItem: {
              name: v.name,
              id: v.id,
              chargingType: v.chargingType,
              minPrice: v.minPrice,
              maxPrice: v.maxPrice,
            },
            quantity: 1,
            unitPrice: v.price.cent / 100,
            remarks: "",
            isAbled: true,
          });
        } else {
          this.acceptForm.chargingItemList[index].quantity += 1;
        }
      });
      this.importPayItemDialog = false;
    },
    //导入协议价
    importAgreementPrice() {
      if (this.$route.query.status === "ACCEPT_EDIT") {
        if (this.isAbled) {
          this.$message.error("该案件已收费，请使用费用异动进行增加收费项目！");
          return;
        }
        if (this.hasInvoiced) {
          this.$message.error("该案件已开票，请使用费用异动进行增加收费项目！");
          return;
        }
      }
      var id = this.basicMsg.entrustInfo.entrustingUnit.id;
      this.$get(api.unitAgreementPrice + id, {
        professionCategoryId: this.basicMsg.professionCategory.id,
      })
        .then((res) => {
          this.agreementPriceArr = [].concat(res.data);
          this.importPriceDialog = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    agreementPriceSelectionChange(selection) {
      this.checkedAgreementPrice = [].concat(selection);
    },
    //确认导入协议价
    confirmImportAgreementPrice() {
      this.checkedAgreementPrice.forEach((v, i) => {
        var index = this._.findIndex(
          this.acceptForm.chargingItemList,
          function (o) {
            return o.chargingItem.id == v.baseChargingItem.id;
          }
        );
        console.log(v);
        if (index == -1) {
          this.acceptForm.chargingItemList.push({
            chargingItem: {
              name: v.baseChargingItem.name,
              id: v.baseChargingItem.id,
              chargingType: v.baseChargingItem.chargingType,
              minPrice: v.baseChargingItem.minPrice,
              maxPrice: v.baseChargingItem.maxPrice,
            },
            quantity: 1,
            unitPrice: v.agreementPrice.cent / 100,
            remarks: "",
            isAbled: true,
          });
        } else {
          this.acceptForm.chargingItemList[index].quantity += 1;
        }
        this.importPriceDialog = false;
      });
    },
    deletePayRow(index, row) {
      this.acceptForm.chargingItemList.splice(index, 1);
    },
  },
  computed: {
    ...mapState("acceptCase", {
      AcceptField: "acceptField",
      acceptForm: "chargeItem",
      basicMsg: "basicMsg",
      entrustMsg: "entrustMsg",
      entrustingPartyType: "entrustingPartyType",
    }),
  },
};
</script>

<style scoped>
</style>
