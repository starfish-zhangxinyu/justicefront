<template>
    <div>
        <el-table
                :data="tableData"
                stripe
                fit
                border
                :resizable="false"
                row-key="id"
                size="mini"
                style="width: 100%"
                max-height="500px"
                ref="statTable">
            <slot></slot>
        </el-table>
        <div style="overflow: hidden" class="pagination-footer">
            <el-pagination
                    style="float:right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pages.current"
                    :page-sizes="pageSizes"
                    :page-size.sync="pages.pageSize"
                    :layout="layout"
                    :total="pages.total"
                    background>
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import api from "../../../api/index";
    export default{
        name: 'StatDetail',
        data() {
            return {
                tableData:[],
                pageSizes: [30, 50, 80, 100],
                pages: this.page,
                layout:'total,sizes,prev, pager, next'
            }
        },
        props:{
            port:{
                type:String
            },
            page: {//页码信息
                type: Object,
                default() {
                    return {current: 1, pageSize: 30, total:0};
                }
            },
        },
        methods:{
            init(planYear, staffId, pages) {
                /*getSpecificRecords*/
                this.searchForm = {planYear, staffId};
                this.$get(api[this.port], {
                    planYear,
                    staffId,
                    "pageDto.current":pages ? pages.current : 1,
                    "pageDto.pageSize":pages ? pages.pageSize : 30
                }).then((res) => {
                    this.tableData = res.data.list;
                    let {total, pageSize} = res.data;
                    this.pages.total = total;
                    this.pages.pageSize = pageSize;
                    console.log(res.data, "具体的统计培训记录");
                });
            },
            handleSizeChange(pageSize) {
                const {planYear, staffId} = this.searchForm;
                let pages = {current:this.pages.current, pageSize};
                this.init(planYear, staffId, pages);
            },
            handleCurrentChange(current) {
                const {planYear, staffId} = this.searchForm;
                let pages = {current, pageSize:this.pages.pageSize};
                this.init(planYear, staffId, pages);
            }
        }
    }
</script>