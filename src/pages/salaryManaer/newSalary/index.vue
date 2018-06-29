<template>
    <div id="newSalary">
        <Card>
            <Form>
                <FormItem>
                    <Button @click="initNew">新增考核方案</Button>
                </FormItem>
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                           :height="tableHeight" url="/perform/findAllKeyAndValues"></fs-table-page>
        </Card>
        <Modal v-model="showTable" id="showTable" :mask-closable="false" :closable="false" width="1200">
            <div slot="header">
                <Button :loading="saveLoading" :disabled="header.columns.length ===0 || !header.name" @click="saveTable"
                        style="float: right;border-radius: 0" type="success">保存
                </Button>
                <Button @click="showTable = false" style="float: right;border-radius: 0" type="ghost">取消</Button>
            </div>
            <div style="width: 1100px;position: relative;margin-top: 20px" v-if="showTable">
                <Form inline style="margin-bottom: 10px" :label-width="50">
                    <FormItem label="方案名">
                        <Input v-model="header.name" placeholder="eg.商品小组绩效方案"></Input>
                    </FormItem>
                    <Button type="success" @click="addNewColumns = true;">增加列</Button>
                    <Button :disabled="header.columns.length === 0"
                            @click="tableData.data.push(JSON.parse(JSON.stringify(tableData.data[tableData.data.length - 1])))">
                        克隆最后一行
                    </Button>
                    <Button :disabled="header.columns.length === 0" @click="delTarget">删除选中</Button>
                </Form>
                <div
                    style="position: absolute;right: 0px;bottom: 0;transition: right 600ms cubic-bezier(0.175, 0.885, 0.32, 1.575);"
                    :style="{right:header.columns.length?'-41px':'0px'}">
                    <Button title="加一行数据" :disabled="header.columns.length === 0" type="ghost"
                            style="height: 41px;padding: 6px 12px"
                            @click="tableData.data.push(JSON.parse(JSON.stringify(rowColumn)))" icon="plus"></Button>
                </div>
                <v-table ref="vt"
                         :select-all="_selectALL"
                         :select-change="_selectChange"
                         :select-group-change="_selectGroupChange"
                         :min-height='200'
                         is-horizontal-resize columns-width-drag is-vertical-resize
                         style="width:100%;"
                         :cell-edit-done="_cellEditDone"
                         :columns="header.columns"
                         :table-data="tableData.data"
                         :show-vertical-border="false"
                         row-hover-color="#eee"
                         row-click-color="#edf7ff"
                ></v-table>
            </div>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="addNewColumns" :mask-closable="false" width="500" style="font-size: 0px">
            <Form inline :label-with="60" style="margin-top:18px;width:100%;max-height: 556px;overflow-y: auto">
                <Button v-show="newColumns.length == 0" icon="plus"
                        @click="newColumns.push({'title':'','field':'', 'titleAlign': 'center', 'width': 100, 'columnAlign': 'center','isResize':true, 'isEdit': true})">
                    新增一条
                </Button>
                <div v-for="(item, index) in newColumns" :key="index" style="font-size: 0px">
                    <FormItem label="列名" style="width: 174px">
                        <Input placeholder="中文列名 eg.分类1" v-model="item.title"></Input>
                    </FormItem>
                    <FormItem label="拼音/英文" style="width: 174px;">
                        <Input placeholder="本方案内唯一标识" v-model="item.field"></Input>
                    </FormItem>
                    <FormItem label="" style="width: 70px;font-size: 0;">
                        <div style="display: block;height: 31px"></div>
                        <Button style="display: inline-block;float: right;padding: 6px 11px;margin-left: 3px" title="删除"
                                type="primary" icon="close" @click="newColumns.splice(index,1)"></Button>
                        <Button style="display: inline-block;float: right;padding: 6px 11px;"
                                v-show="index == (newColumns.length - 1)" title="新增" type="success" icon="plus"
                                @click="newColumns.push({'title':'','field':'', 'titleAlign': 'center', 'width': 100, 'columnAlign': 'center','isResize':true, 'isEdit': true})"></Button>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button type="text" @click="addNewColumns = false">取消</Button>
                <Button type="primary" @click="addColumn">确定</Button>
            </div>
        </Modal>
        <Modal v-model="editUserModel" :width="1000">
            <div slot="header">
                <p style="color:#495060;text-align:center;font-size: 18px">绩效绑定</p>
            </div>
            <Row :gutter="16">
                <Col :span="10">
                    <Form inline :label-width="60">
                        <FormItem label="姓名">
                            <Input type="text"
                                   v-model="filterOpt.realName.value"
                                   placeholder="筛选姓名"></Input>
                        </FormItem>
                    </Form>
                    <fs-table-page v-if="editUserModel" :columns="userColumns"
                                   :size="null"
                                   :height="500"
                                   :params="filterOpt"
                                   :pageSizeOpt="[20, 60, 100, 1000]"
                                   :choosearray.sync="chooseDataArr"
                                   ref="tablePage"
                                   url="/perform/getUserList"></fs-table-page>
                </Col>
                <Col :span="14">
                    <div style="max-height: 606px;overflow:auto;">
                        <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                        <el-tree :data="orgTreeData"
                                 ref="treeDom"
                                 show-checkbox
                                 :filter-node-method="filterNode"
                                 :expand-on-click-node="false"
                                 :highlight-current="true"
                                 node-key="id"
                                 style="margin-top: 10px;"
                                 :props="defaultProps"></el-tree>
                    </div>
                </Col>
            </Row>
        </Modal>
        <div slot="footer"></div>
    </div>
</template>

<script>
    import 'vue-easytable/libs/themes-base/index.css';
    import _differenceWith from 'lodash/differenceWith';
    import _uniqWith from 'lodash/uniqWith';
    import _isEqual from 'lodash/isEqual';
    import {VTable, VPagination} from 'vue-easytable';
    import fsTablePage from '@/baseComponents/fs-table-page';

    export default {
        name: 'newSalary',
        components: {
            VTable, VPagination, fsTablePage
        },
        data() {
            return {
                showTable: false,
                saveLoading: false,
                addNewColumns: false,
                editUserModel: false,
                filterText: '',
                bindType: '',
                searchData: {},
                chooseDataArr: [],
                filterOpt: {
                    organizeName: {
                        value: '',
                        type: 'input'
                    },
                    realName: {
                        value: '',
                        type: 'input'
                    },
                    id: {
                        value: this.id,
                        type: 'select'
                    }
                },
                userColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        width: 100
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
                    {
                        title: '岗位',
                        key: 'postname',
                        align: 'center'
                    }
                ],
                newColumns: [],
                selection: [],
                tableData: {
                    key_id: '',
                    data: []
                },
                allTreeId: [],
                orgTreeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rowColumn: {},
                header: {
                    id: '',
                    columns: [],
                    name: ''
                },
                postColumns: [
                    {
                        title: '方案名',
                        key: 'name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        width: 160,
                        render: (h, params) => {
                            let vm = this;
                            let arr = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'person-add',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '指派'
                                    },
                                    on: {
                                        click: function () {
                                            vm.editUserMapping(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'android-expand',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '查看'
                                    },
                                    on: {
                                        click: function () {
                                            vm.detail(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'trash-a',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '删除'
                                    },
                                    on: {
                                        click: function () {
                                            vm.detail(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                })
                            ];
                            return h('div', arr);
                        }
                    }
                ],
                tableHeight: 700
            };
        },
        methods: {
            initNew() {
                this.header.name = '';
                this.header.id = '';
                this.header.columns = [];
                this.tableData.data = [];
                this.tableData.key_id = '';
                this.showTable = true;
            },
            // 增加动态列
            addColumn() {
                var that = this;
                if (this.newColumns.length >= 1 && this.newColumns[0].title) {
                    let arr = [].concat(this.header.columns).concat(this.newColumns);
                    let arr2 = _uniqWith(arr, _isEqual);
                    if (arr2.length < arr.length) {
                        this.$Message.info('想要新建的字段已经存在。请检查或修改拼音，避免完全重复。');
                        return;
                    }
                    // 确保第一个是多选框
                    if (this.header.columns.length === 0 || this.header.columns[0].type !== 'selection') {
                        this.header.columns.splice(0, 0, {
                            'width': 60,
                            'titleAlign': 'center',
                            'columnAlign': 'center',
                            'type': 'selection'
                        });
                    }

                    // 给已有的列附上新的值
                    this.header.columns = this.header.columns.concat(this.newColumns);
                    this.header.columns.forEach((res) => {
                        if (res.type !== 'selection') {
                            this.rowColumn[res.field] = '';
                        }
                    });
                    console.log(this.header.columns);
                    // 新建的列在表单已有的数据中不能直接使用，双向绑定无效。这里做一个初始化
                    let d = JSON.parse(JSON.stringify(that.tableData.data));
                    if (d.length >= 1) {
                        for (let i = 0; i < d.length; i++) {
                            let temp = d[i];
                            for (let key in this.rowColumn) {
                                if (!temp.hasOwnProperty(key)) {
                                    temp[key] = '';
                                }
                            }
                        }
                    }
                    this.tableData.data = d;
                    this.newColumns = [];
                    this.addNewColumns = false;
                    this.$refs.vt.resize();
                }
            },
            //
            detail(params) {
                console.log(params);
                this.header.columns = [{
                    'width': 60,
                    'titleAlign': 'center',
                    'columnAlign': 'center',
                    'type': 'selection'
                }];
                this.tableData.data = [];
                var columnObj = {};
                var tableData = [];
                try {
                    tableData = eval('(' + params.val + ')');
                    columnObj = eval('(' + params.kv + ')');
                } catch (e) {
                    this.$Message.error('数据格式不规范');
                }
                this.header.id = params.id;
                this.header.name = params.name;
                this.tableData.key_id = params.id;
                for (let key in columnObj) {
                    this.header.columns.push({
                        'title': columnObj[key],
                        'field': key,
                        'titleAlign': 'center',
                        'width': 100,
                        'columnAlign': 'center',
                        'isResize': true,
                        'isEdit': true
                    });
                }
                if (tableData == null) {
                    tableData = [];
                }
                for (let i = 0; i < tableData.length; i++) {
                    let d = tableData[i].values;
                    d.id = tableData[i].id;
                    this.tableData.data.push(d);
                }
                this.showTable = true;
            },
            // 保存表格
            saveTable() {
                var that = this;
                if (this.header.columns.length > 0) {
                    let d = {};
                    this.saveLoading = true;
                    d.id = this.header.id;
                    d.name = this.header.name;
                    let kv = {};
                    for (let i = 0; i < this.header.columns.length; i++) {
                        let re = this.header.columns[i];
                        if (re.type === 'selection') {
                            continue;
                        }
                        kv[re.field] = re.title;
                    }
                    d.kv = JSON.stringify(kv);
                    this.$http.post('/perform/saveMainColumns', d).then((res) => {
                        if (res.success) {
                            this.header.id = res.message;
                            if (this.tableData.data.length > 0) {
                                let d2 = {};
                                d2.key_id = this.tableData;
                                d2.arr = JSON.stringify(this.tableData.data);
                                that.$http.post('/perform/addValueArrays', d2).then(res => {
                                });
                            }
                        }
                    }).finally(() => {
                        that.saveLoading = false;
                    });
                }
            },
            delTarget() {
                let that = this;
                if (this.selection.length <= 0) {
                    this.$Message.info('想删除什么？请选中');
                } else {
                    console.log(this.selection);
                    let arr = this.selection.filter((res) => {
                        return res.id;
                    });
                    if (arr.length > 0) {
                        that.$Modal.confirm({
                            title: '删除提醒',
                            content: '是否确认删除？',
                            okText: '删除',
                            cancelText: '取消',
                            loading: true,
                            onOk() {
                                that.$http.post('/perform/deleteValues', {id: row.id}).then((res) => {
                                    if (res.success) {
                                        that.tableData.data = _differenceWith(this.tableData.data, this.selection, _isEqual);
                                    }
                                }).finally(() => {
                                    that.$Modal.remove();
                                });
                            }
                        });
                    }
                }
            },
            searchAllData() {
                this.$http.post('/salary/findAllKeyAndValues').then((res) => {

                });
            },
            editUserMapping(param) {
                this.editUserModel = true;
                this.$refs.treeDom.setCheckedKeys(param.organizeid ? param.organizeid.split(',').filter(x => !!x) : []);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _getOrgTree() {
                return new Promise((resolve) => {
                    this.$http.get('/organize/organizeTreeCertainVm?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            resolve(res.data);
                        }
                    });
                });
            },
            _getAllDepIds(data) {
                data.forEach((item) => {
                    this.allTreeId.push(item.id);
                    if (item.children) this._getAllDepIds(item.children);
                });
            },
            _selectALL(selection) {
                this.selection = selection;
            },
            _selectChange(selection, rowData) {
                console.log(selection);
                this.selection = selection;
            },
            _selectGroupChange(selection) {
                this.selection = selection;
            },
            _cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                this.tableData.data[rowIndex][field] = newValue;
                // this.$refs.v
                // 接下来处理你的业务逻辑，数据持久化等...
            }

        },
        created() {
            this._getOrgTree().then((res) => {
                this._getAllDepIds(res);
            });
        },
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            }
        }
    }
    ;
</script>

<style lang="less">
    #showTable {
        .ivu-modal-header {
            border-bottom: none;
            padding: 0;
        }
        .ivu-modal-footer {
            border: none;
            padding: 0;
        }
    }

</style>
