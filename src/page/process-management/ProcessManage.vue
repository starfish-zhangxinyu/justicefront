<template>
    <div>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="流程列表" name="list">
                <el-table
                        :data="tableData"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column prop="professionCategory" label="专业类别">
                        <template slot-scope="scope">
                            <span v-if="scope.row.professionCategory">{{scope.row.professionCategory.name}}</span>
                            <span v-if="!scope.row.professionCategory">默认</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="流程名称">
                    </el-table-column>
                    <el-table-column
                            prop="key.label"
                            label="流程Key">
                    </el-table-column>
                    <el-table-column
                            prop="published"
                            label="是否已发布">
                        <template slot-scope="scope">
                            <span v-if="scope.row.published">{{scope.row.published=='N'?'否':'是'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="publishDate"
                            label="发布时间">
                        <template slot-scope="scope">
                            <span v-if="scope.row.publishDate">{{$divideDate(scope.row.publishDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            label="创建时间">
                        <template slot-scope="scope">
                            <span v-if="scope.row.createDate">{{$divideDate(scope.row.createDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作" width="400px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" plain size="mini" @click="edit(scope.$index,scope.row)">修改
                            </el-button>
                            <el-button type="danger" plain size="mini"
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button type="primary" plain size="mini" @click="checkHistory(scope.$index, scope.row)">
                                历史版本
                            </el-button>
                            <el-button type="primary" plain size="mini" @click="checkDetail(scope.$index, scope.row)">
                                节点详情
                            </el-button>
                            <el-button type="success" plain size="mini" @click="publish(scope.$index, scope.row)">发布
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="历史版本" name="historyVersion" v-if="isShow">
                <el-table
                        :data="tableData2"
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="流程名称">
                    </el-table-column>
                    <el-table-column
                            prop="key"
                            label="流程Key">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.key.label}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="published"
                            label="是否已发布">
                        <template slot-scope="scope">
                            <span v-if="scope.row.published">{{scope.row.published=='N'?'否':'是'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="publishDate"
                            label="发布时间">
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            label="操作" width="200%">
                        <template slot-scope="scope">
                            <el-button type="warning" size="mini" @click="checkDetail(scope.$index,scope.row)">节点详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="tabLabel" :name="tabName">
                <el-form :model="addForm" size="small" ref="addForm" label-width="110px" :inline="true">
                    <el-form-item label="流程" :rules="$filter_rules({required:true, trigger: 'change'})" prop="key">
                        <el-select v-model="addForm.key" placeholder="请选择" :disabled="disabled" @change="changeKey()"
                                   :clearable="true">
                            <el-option
                                    v-for="item in processOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="流程名称" :rules="$filter_rules({required:true})" prop="name">
                        <el-input v-model.trim="addForm.name" class="w215"/>
                    </el-form-item>

                    <el-form-item label="专业类别" prop="professionCategory.id"
                                  v-show="addForm.key !=null && addForm.key.value==='MAIN'"
                    >
                        <select-from-table :model.sync="addForm.professionCategory.id" port="profession"
                                           :modelId="true" :disabled="professionCategoryDisabled"
                                           :clearable="true"></select-from-table>
                    </el-form-item>
                    <el-form-item v-show="addForm.key !=null && addForm.key.value==='MAIN'&& !isDetail">
                        <el-button type="primary" plain size="mini" @click="importDefaultMainProcess()">
                            导入默认主流程
                        </el-button>
                    </el-form-item>

                </el-form>
                <div style="width: 100%; display: flex; justify-content: space-between" v-if="isShowCanvas">
                    <div id="myPaletteDiv"
                         style="width: 200px; margin-right: 2px; background-color: whitesmoke; border: solid 1px #909399"></div>
                    <div id="myDiagramDiv" style="flex-grow: 1; height: 750px; border: solid 1px #909399"></div>
                </div>

                <el-row style="margin: 10px 0">
                    <el-col :span="2" :offset="10">
                        <el-button v-show="!isDetail" type="success" size="mini" class="save-btn"
                                   :disabled="saveDisabled" @click="save('addForm')"><i class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <!--流程节点弹出框-->
        <el-dialog title="流程节点" :visible.sync="dialogNodeVisible" width="30%">
            <el-form :model="nodeForm" size="small" ref="nodeForm" label-width="100px">
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="节点名称" prop="nodeName" :rules="$filter_rules({required:true})">
                            <el-input v-model.trim="nodeForm.nodeName" size="small" :disabled=true></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="节点关键字" prop="nodeKey" :rules="$filter_rules({required:true})">
                            <el-input v-model.trim="nodeForm.nodeKey" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="表单">
                            <el-select v-model="nodeForm.formKey" placeholder="请选择" size="small" style="width: 100%"
                                       :disabled="isDetail">
                                <el-option
                                        v-for="item in formTypeOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="负责人类型">
                            <el-select v-model="nodeForm.assigneeType" class="w100" placeholder="请选择"
                                       @change="changeAssigneeType"
                                       :disabled="isDetail">
                                <el-option
                                        v-for="item in assigneeTypeOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="负责人">
                            <Select2 :className="'w100'" :filterable="true" :model.sync="nodeForm.assignee" :port="port"
                                     v-if="nodeForm.assigneeType!='DYNAMIC_USER'"
                                     :disabled="isDetail"></Select2>
                            <el-select class="w100" filterable v-model="nodeForm.assignee" placeholder="请选择"
                                       v-if="nodeForm.assigneeType=='DYNAMIC_USER'" :disabled="isDetail">
                                <el-option
                                        v-for="item in assigneeOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogNodeVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmNode('nodeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--条件弹出框-->
        <el-dialog title="条件" :visible.sync="dialogConditionVisible" width="30%">
            <el-form :model="conditionForm" size="small" label-width="80px">
                <el-row>
                    <el-col :span="16" :offset="4">
                        <el-form-item label="条件" prop="nodeName">
                            <el-input v-model.trim="conditionForm.condition" size="small"
                                      :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogConditionVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmCondition">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/index'
    import Select2 from '../../components/common/Select2'
    import go from 'gojs'

    export default {
        name: "ProcessManage",
        components: {'Select2': Select2},
        data() {
            return {
                activeName: 'list',
                tableData: [],
                tableData2: [],
                addForm: {professionCategory: {id: ''}},
                nodeForm: {},
                conditionForm: {},
                isShow: false,
                processOpt: [],
                formTypeOpt: [],
                assigneeTypeOpt: [],
                assigneeOpt: [],
                port: null,
                isAdd: true,
                detailData: [],
                tableport: '',
                disabled: false,
                professionCategoryDisabled: false,
                dialogNodeVisible: false,
                dialogConditionVisible: false,
                Model: null,
                isShowCanvas: false,
                currentNode: null,
                currentLink: null,
                isInit: false,
                tabLabel: '新增流程',
                tabName: 'addlist',
                isDetail: false,
                saveDisabled: false,
                flowUserOpt: [],


            }
        },
        inject:["hasPermission"],
        methods: {
            filterFormTypeOpt(){
                let permission = this.hasPermission("auth:signature");
                if(!permission){
                    this.formTypeOpt = this.formTypeOpt.filter(item => item.value != 'REPORT_STAMP' && item.value != 'REPORT_SIGN'
                        && item.value != 'REPORT_SEAL'&& item.value != 'REPORT_DEMARK_STAMP');
                }
            },
            changeAssigneeType() {
                delete this.nodeForm.assignee;
                if (this.nodeForm.assigneeType) {
                    switch (this.nodeForm.assigneeType) {
                        case 'USER':
                            this.port = 'users'
                            break;
                        case 'ROLE':
                            this.port = 'role';
                            break;
                        case 'FLOW_USER':
                            this.port = 'flowUsersWithType';
                            break;

                    }
                }
            },
            init() {
                this.$get(api.flow).then((res) => {
                    this.tableData = [].concat(res.data);
                    this.activeName = 'list'
                }).catch((err) => {
                    console.log(err)
                })
            },
            changeKey() {
                if (this.addForm.key.value != 'MAIN') {
                    this.addForm.professionCategory = {id: ''};
                    this.professionCategoryDisabled = true;
                } else {
                    this.professionCategoryDisabled = false;
                }
            },
            importDefaultMainProcess() {
                this.$get(api.flow + '/main').then((res) => {
                    if (res.data) {
                        this.Model.model = go.Model.fromJson(res.data.diagramJson);
                    } else {
                        this.$message({
                            message: "默认主流程不存在，导入失败！",
                            type: 'error'
                        });
                    }
                    this.$get(api.flow + '/enum/' + this.addForm.key.value).then((res) => {
                        this.formTypeOpt = res.data;
                        this.filterFormTypeOpt();
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                    console.log(err)
                });
            },
            edit(index, row) {
                this.disabled = true;
                this.tabLabel = '修改流程';
                this.tabName = 'changelist';
                this.activeName = 'changelist';
                this.$get(api.flow + '/' + row.id).then((res) => {
                    this.addForm = {
                        key: res.data.key,
                        name: res.data.name,
                        id: res.data.id,
                        published: res.data.published,
                        professionCategory: res.data.professionCategory == null ? {id: ''} : res.data.professionCategory
                    };
                    this.professionCategoryDisabled = true;
                    this.Model.model = go.Model.fromJson(res.data.diagramJson);
                    this.$get(api.flow + '/enum/' + this.addForm.key.value).then((res) => {
                        this.formTypeOpt = res.data;
                        this.filterFormTypeOpt();
                    }).catch((err) => {
                        console.log(err)
                    });

                }).catch((err) => {
                    console.log(err)
                })
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除流程' + row.name + '?').then((res) => {
                    this.$del(api.flow + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            publish(index, row) {
                if (row.published == 'Y') {
                    this.$message.error('该流程已经发布！');
                } else {
                    this.$get(api.flow + '/publish/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '发布成功！',
                                type: 'success'


                            });
                            this.init();
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            checkHistory(index, row) {
                var profesionCategoryId = row.professionCategory ? row.professionCategory.id : '';
                this.activeName = 'historyVersion';
                this.isShow = true;
                this.$get(api.flow + '/history/' + row.id, {
                    key: row.key.value,
                    professionCategoryId: profesionCategoryId
                }).then((res) => {
                    this.tableData2 = res.data;
                }).catch((err) => {
                    console.log(err)
                })
            },
            checkDetail(index, row) {
                this.disabled = true;
                this.tabLabel = '节点详情';
                this.tabName = 'nodedetail';
                this.activeName = 'nodedetail';
                this.$get(api.flow + '/' + row.id).then((res) => {
                    this.addForm = {
                        key: res.data.key,
                        name: res.data.name,
                        id: res.data.id,
                        published: res.data.published,
                        professionCategory: res.data.professionCategory == null ? {id: ''} : res.data.professionCategory
                    }
                    // this.addForm = {key: res.data.key, name: res.data.name, id: res.data.id};
                    this.Model.model = go.Model.fromJson(res.data.diagramJson);
                    this.Model.model.isReadOnly = true;
                    this.$get(api.flow + '/enum/' + this.addForm.key.value).then((res) => {
                        this.formTypeOpt = res.data;
                        this.filterFormTypeOpt();
                    }).catch((err) => {
                        console.log(err)
                    });

                }).catch((err) => {
                    console.log(err)
                })
            },
            save(formName) {
                this.saveDisabled = true;
                var that = this;
                setTimeout(function () {
                    that.saveDisabled = false;
                }, 2000);
                var data = JSON.parse(JSON.stringify(that.addForm));
                data.diagramJson = JSON.parse(that.Model.model.toJSON());
                data.diagramJson.className = data.diagramJson.class;
                delete data.diagramJson.class;
                var str = '';
                for (var i = 0; i < data.diagramJson.nodeDataArray.length; i++) {
                    var node = data.diagramJson.nodeDataArray[i];
                    if (node.category != 'Start' && node.category != 'End') {
                        if (!node.flowNode) {
                            str += node.text + '、';
                        } else {
                            node.flowNode.nodeName = node.text;
                        }
                    }
                }

                str = str.substr(0, str.length - 1);
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (str) {
                            that.$message.error('请完善' + str + '的节点详情信息！');
                        } else {
                            if (that.activeName == 'addlist') {
                                if (data.diagramJson.nodeDataArray.length == 0) {
                                    that.$message.error('请新增流程节点！');
                                    return
                                }
                                that.$post(api.flow, data).then((res) => {
                                    if (res.status == 200) {
                                        that.$message({
                                            message: '新增成功！',
                                            type: 'success'
                                        });
                                        that.init();
                                        that.$refs[formName].resetFields();
                                    }

                                }).catch((err) => {
                                    that.$message({
                                        message: err.errMsg,
                                        type: 'error'
                                    });
                                })
                            } else {
                                that.$put(api.flow + '/' + data.id, data).then((res) => {
                                    if (res.status == 200) {
                                        that.$message({
                                            message: '修改成功！',
                                            type: 'success'
                                        });
                                        that.init();
                                        that.$refs[formName].resetFields();
                                    }
                                }).catch((err) => {
                                    console.log(err)
                                });
                            }
                        }

                    }
                });
            },
            initCanvas(obj) {
                var $ = go.GraphObject.make;
                // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
                // for conciseness in defining templates
                var myDiagram =
                    $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                        {
                            "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                            "LinkRelinked": showLinkLabel,
                            "undoManager.isEnabled": true  // enable undo & redo
                        });

                function showLinkLabel(e) {
                    var label = e.subject.findObject("LABEL");
                    if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
                }

                function nodeStyle() {
                    return [
                        // The Node.location comes from the "loc" property of the node data,
                        // converted by the Point.parse static method.
                        // If the Node.location is changed, it updates the "loc" property of the node data,
                        // converting back using the Point.stringify static method.
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        {
                            // the Node.location is at the center of each node
                            locationSpot: go.Spot.Center
                        }
                    ];
                }

                function makePort(name, align, spot, output, input) {
                    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
                    return $(go.Shape,
                        {
                            fill: "transparent",  // changed to a color in the mouseEnter event handler
                            strokeWidth: 0,  // no stroke
                            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
                            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
                            alignment: align,  // align the port on the main Shape
                            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                            portId: name,  // declare this object to be a "port"
                            fromSpot: spot,  // declare where links may connect at this port
                            fromLinkable: output,  // declare whether the user may draw links from here
                            toSpot: spot,  // declare where links may connect at this port
                            toLinkable: input,  // declare whether the user may draw links to here
                            cursor: "pointer",  // show a different cursor to indicate potential link point
                            mouseEnter: function (e, port) {  // the PORT argument will be this Shape
                                if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                            },
                            mouseLeave: function (e, port) {
                                port.fill = "transparent";
                            }
                        });
                }

                function textStyle() {
                    return {
                        font: "bold 11pt Helvetica, Arial, sans-serif",
                        stroke: "whitesmoke"
                    }
                }

                myDiagram.nodeTemplateMap.add("Next",  // the default category
                    $(go.Node, "Table", nodeStyle(),
                        {
                            fromSpot: go.Spot.AllSides,  // coming out from right side
                            toSpot: go.Spot.AllSides
                        },   // going into at left side
                        $(go.Panel, "Auto",
                            $(go.Shape, "Rectangle",
                                {fill: "#00A9C9", strokeWidth: 0, minSize: new go.Size(100, 50)},
                                new go.Binding("figure", "figure")),
                            $(go.TextBlock, textStyle(),
                                {
                                    margin: 8,
                                    maxSize: new go.Size(160, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: true
                                },

                                new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, go.Spot.AllSides, false, true),
                        makePort("L", go.Spot.Left, go.Spot.AllSides, true, true),
                        makePort("R", go.Spot.Right, go.Spot.AllSides, true, true),
                        makePort("B", go.Spot.Bottom, go.Spot.AllSides, true, false),
                    ));
                myDiagram.nodeTemplateMap.add("Start",
                    $(go.Node, "Table", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Shape, "Circle",
                                {minSize: new go.Size(50, 50), fill: "#79C900", strokeWidth: 0}),
                            $(go.TextBlock, "Start", textStyle(),
                                new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the top, all output only:
                        makePort("L", go.Spot.Left, go.Spot.Left, true, false),
                        makePort("R", go.Spot.Right, go.Spot.Right, true, false),
                        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
                    ));
                myDiagram.nodeTemplateMap.add("End",
                    $(go.Node, "Table", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Shape, "Circle",
                                {minSize: new go.Size(50, 50), fill: "#DC3C00", strokeWidth: 0}),
                            $(go.TextBlock, "End", textStyle(),
                                new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the bottom, all input only:
                        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, go.Spot.Left, false, true),
                        makePort("R", go.Spot.Right, go.Spot.Right, false, true)
                    ));

                myDiagram.linkTemplate =
                    $(go.Link,  // the whole link panel
                        {routing: go.Link.AvoidsNodes},
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5, toShortLength: 4,
                            relinkableFrom: true,
                            relinkableTo: true,
                            reshapable: true,
                            resegmentable: true,
                            // mouse-overs subtly highlight links:
                            mouseEnter: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                            },
                            mouseLeave: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "transparent";
                            },
                            doubleClick: function (e, node) {
                                obj.dialogConditionVisible = true;
                                obj.currentLink = node.part.data;
                                if (obj.currentLink.flowSequence) {
                                    obj.conditionForm = JSON.parse(JSON.stringify(obj.currentLink.flowSequence));
                                } else {
                                    obj.conditionForm = {}
                                }
                            },


                            selectionAdorned: false
                        },
                        new go.Binding("points").makeTwoWay(),
                        $(go.Shape,  // the highlight shape, normally transparent
                            {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
                        $(go.Shape,  // the link path shape
                            {isPanelMain: true, stroke: "gray", strokeWidth: 2},
                            new go.Binding("stroke", "isSelected", function (sel) {
                                return sel ? "dodgerblue" : "gray";
                            }).ofObject()),
                        $(go.Shape,  // the arrowhead
                            {toArrow: "standard", strokeWidth: 0, fill: "gray"}),
                        $(go.Panel, "Auto",  // the link label, normally not visible
                            {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                            new go.Binding("visible", "visible").makeTwoWay(),
                            $(go.Shape, "RoundedRectangle",  // the label shape
                                {fill: "#F8F8F8", strokeWidth: 0}),
                            $(go.TextBlock, "Yes",  // the label
                                {
                                    textAlign: "center",
                                    font: "10pt helvetica, arial, sans-serif",
                                    stroke: "#333333",
                                    editable: true
                                },
                                new go.Binding("text").makeTwoWay())
                        )
                    );
                // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
                myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
                myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

                var myPalette =
                    $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                        {
                            nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                            model: new go.GraphLinksModel([  // specify the contents of the Palette
                                {category: "Start", text: "开始"},
                                {category: "Next", text: "下一步"},
                                {category: "End", text: "结束"},
                            ]),
                        });
                // end init
                // Show the diagram's model in JSON format that the user may edit
                obj.Model = myDiagram;

                function load() {
                    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
                }

                // print the diagram by opening a new window holding SVG images of the diagram contents for each page

                myDiagram.addDiagramListener("ObjectDoubleClicked", function (e) {
                    var Select_Port = e.subject.part.data;
                    obj.currentNode = Select_Port;
                    if (Select_Port.category == 'Next') {
                        if (obj.addForm.key) {
                            if (Select_Port.text == '') {
                                obj.$message({
                                    message: '请填写节点名称！',
                                    type: 'warning'
                                });
                            } else {
                                if (Select_Port.flowNode) {
                                    var echoData = JSON.parse(JSON.stringify(Select_Port.flowNode));
                                    echoData.assigneeType = echoData.assigneeType;
                                    if (echoData.assigneeType) {
                                        switch (echoData.assigneeType) {
                                            case 'USER':
                                                obj.port = 'users'
                                                break;
                                            case 'ROLE':
                                                obj.port = 'role';
                                                break;
                                            case 'FLOW_USER':
                                                obj.port = "flowUsersWithType";
                                                break;
                                        }
                                    }
                                    obj.nodeForm = echoData;
                                    obj.nodeForm.nodeName = Select_Port.text;
                                } else {
                                    obj.nodeForm = {nodeName: Select_Port.text};
                                }
                                obj.dialogNodeVisible = true;
                            }

                        } else {
                            obj.$message({
                                message: '请先选择流程！',
                                type: 'warning'
                            });
                        }


                    }
                });
            },
            confirmNode(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogNodeVisible = false;
                        var data = JSON.parse(JSON.stringify(this.nodeForm));
                        this.currentNode.flowNode = data;
                    }
                })


            },
            confirmCondition() {
                this.dialogConditionVisible = false;
                var data = JSON.parse(JSON.stringify(this.conditionForm))
                this.currentLink.flowSequence = data;
            }

        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.tabLabel = '新增流程';
                    this.disabled = false;
                    this.isShow = false;
                    this.addForm = {professionCategory: {id: ''}};
                    this.isShowCanvas = false;
                    this.isDetail = false;
                    this.$refs.addForm.resetFields();
                } else {
                    this.$get(api.enum + '/flow.FlowType').then((res) => {
                        this.processOpt = res.data;
                    }).catch((err) => {
                        console.log(err)
                    });
                    this.$get(api.enum + '/flow.AssigneeType').then((res) => {
                        this.assigneeTypeOpt = res.data;
                    }).catch((err) => {
                        console.log(err)
                    });
                    this.$get(api.enum + '/flow.FlowDynamicUserType').then((res) => {
                        this.assigneeOpt = res.data;
                    }).catch((err) => {
                        console.log(err)
                    });
                    this.isShowCanvas = true;
                    var _this = this;
                    this.$nextTick(() => {
                        this.initCanvas(_this);
                    });
                    if (this.activeName == 'nodedetail') {
                        this.isDetail = true;
                    } else {
                        this.isDetail = false;
                        if (this.activeName != 'changelist') {
                            this.activeName == 'addlist';
                        }
                    }

                }

            },

            'addForm.key': {
                handler(newName, oldName) {
                    if (this.addForm.key) {
                        this.$get(api.flow + '/enum/' + this.addForm.key.value).then((res) => {
                            this.formTypeOpt = res.data;
                            this.filterFormTypeOpt();
                        }).catch((err) => {
                            console.log(err)
                        });
                    }
                    ;
                    this.nodeForm = {}
                },
                immediate: true
            }
        },
        computed: {},
        created: function () {
            this.$store.dispatch("login/headerTitleChange", "流程管理")
            this.$get(api.flow).then((res) => {
                this.tableData = [].concat(res.data);
                this.tableData.forEach((v, i) => {
                })
            }).catch((err) => {
                console.log(err)
            });

        }
    }
</script>

<style scoped>

</style>
