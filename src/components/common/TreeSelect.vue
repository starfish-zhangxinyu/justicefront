<template>
    <!--树形结构选择器-->
    <div id="caseStatType">
        <el-row>
            <el-col>
                <el-input v-model="obj.name" :readonly="true">
                    <el-button slot="append" icon="el-icon-close" @click="clearContent"/>
                    <el-button slot="append" icon="el-icon-search" @click="selectDepartmentDialog= true"/>
                </el-input>
            </el-col>
            <!-- <el-col style="width:88px">
                <el-button type="primary" icon="el-icon-close" @click="clearContent" style="margin: 0px"
                           plain></el-button>
                <el-button type="primary" icon="el-icon-search" @click="selectDepartmentDialog= true"
                           style="margin: 0px" plain></el-button>
            </el-col> -->
        </el-row>
        <el-dialog :title="title" :visible.sync="selectDepartmentDialog" append-to-body width="30%">

            <el-tree
                    class="filter-tree"
                    ref="tree"
                    :data="treeData"
                    highlight-current
                    node-key="id"
                    :expand-on-click-node="false"
                    :default-expand-all="showUntilThree ? false : true"
                    :default-expanded-keys="showUntilThree ? expandRowKeys:[]"
                    @node-click="currentClick"
                    >
          <span class="custom-tree-node" slot-scope="{ node, data }">
               <i class="fa fa-folder" style="font-size: 18px;margin: 0 5px;color: #DBC056"></i>{{ node.label }}
                        </span>
            </el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmImport">确 定</el-button>
                <el-button @click="selectDepartmentDialog= false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/index.js'

    export default {
        name: "Test",
        // props: ['model', 'title', 'name','showUntilThree','expandRowKeys'],
        props:{
            model:{

            },
            title: {

            },
            name: {

            },
            showUntilThree:{
                type: Boolean
            },
            expandRowKeys:{
                default(){
                    return []
                }
            },
            isTitleChoose: {
                type: Boolean
            }
        },
        data() {
            return {
                obj: this.model || {},
                selectDepartmentDialog: false,
                treeData: [],
                treeVal: {},

            }
        },
        methods: {
            currentClick(item, node, self) {
                    if(this.isTitleChoose) {
                        this.treeVal = item;
                    }else {
                        if (!(item.children && item.children.length > 0)) {
                            this.treeVal = '';
                            this.treeVal = item;
                        } else {
                            this.treeVal = '';
                            let nodes = document.getElementsByClassName("el-tree-node");
                            for (let i = 0; i < nodes.length; i++) {
                                if(nodes[i].childNodes[0].innerText.trim() == node.data.label.trim()){
                                    this.$nextTick(()=>{
                                        nodes[i].classList.add("noneBack");
                                    })
                                }
                            }
                        }
                    }


            },
            confirmImport() {
                this.obj = this.treeVal;
                this.selectDepartmentDialog = false;
            },
            clearContent() {
                this.obj = {};
            },
            initData() {
                this.$get(api[this.name]).then((res) => {
                    this.treeData = res.data;
                    this.$emit('hasLoadedTree', this.treeData);
                }).catch((err) => {
                })
            }

        },
        watch: {
            'model': function (newval, oldval) {
                if (newval) {
                    this.obj = newval;
                } else {
                    this.obj = {};
                }

            },
            obj: function (newval, oldval) {
                this.$emit("update:model", newval);
            },
            deep: true
        },
        created: function () {
            this.initData();

        }
    }
</script>

<style scoped>

</style>
