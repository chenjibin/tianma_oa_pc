<template>
    <div id="newSalary">
        <Card>
            <Form inline :label-width="40">
                <FormItem label="月份">
                    <DatePicker type="month" placeholder="月份" @on-change="_monthChangeHanfler"
                                :value="searchData.month.value"></DatePicker>
                </FormItem>
                <FormItem label="名称">
                    <Input type="text" placeholder="方案名" clearable v-model="searchData.name.value"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="initNew">新增考核方案</Button>
                    <Button @click="_downloadGrade1">导出月度方案</Button>
                    <Button v-if="showCopyNew" @click="copyNew">复制上月考核方案</Button>
                </FormItem>
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                           @empty="onEmpty"
                           :height="tableHeight" url="/perform/findAllKeyAndValues"></fs-table-page>
        </Card>
        <Modal v-model="showTable" id="newSalary-showTable" :mask-closable="false" :closable="false" width="1200">
            <div slot="header">
                <Button :loading="saveLoading" :disabled="header.columns.length === 0 || !header.name" @click="saveTable"
                        style="float: right;border-radius: 0" type="success">保存
                </Button>
                <Button @click="showTable = false" style="float: right;border-radius: 0" type="ghost">取消</Button>
            </div>
            <div style="width: 1100px;position: relative;margin-top: 20px" v-if="showTable">
                <Form inline style="margin-bottom: 10px" :label-width="50" @submit.native.prevent>
                    <FormItem label="方案名">
                        <Input v-model="header.name" placeholder="eg.商品小组绩效方案"></Input>
                    </FormItem>
                    <!--<Button type="success" @click="addNewColumns = true">增加列</Button>-->
                    <Button type="success" @click="editorColumns = true">编辑列</Button>
                    <Button :disabled="header.columns.length === 0" @click="delTarget">删除选中</Button>
                    <!--<Button :disabled="header.columns.length === 0" @click="delColumn">删除列</Button>-->
                </Form>
                <div
                    style="position: absolute;right: 0;bottom: 0;transition: right 1s cubic-bezier(0.175, 0.885, 0.32, 1.575);"
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
                <Button v-show="newColumns.length === 0" icon="plus"
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
                                v-show="index === (newColumns.length - 1)" title="新增" type="success" icon="plus"
                                @click="newColumns.push({'title':'','field':'', 'titleAlign': 'center', 'width': 100, 'columnAlign': 'center','isResize':true, 'isEdit': true})"></Button>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button type="text" @click="addNewColumns = false">取消</Button>
                <Button type="primary" @click="addColumn">确定</Button>
            </div>
        </Modal>
        <Modal v-model="editorColumns" :mask-closable="false" width="500" style="font-size: 0">
            <Form inline :label-with="60" style="margin-top:18px;width:100%;max-height: 556px;overflow-y: auto">
                <Button v-show="newColumns.length === 0" icon="plus"
                        @click="openColumns.push({'title':'','field':'', 'titleAlign': 'center', 'width': 100, 'columnAlign': 'center','isResize':true, 'isEdit': true})">
                    新增一条
                </Button>
                <div v-for="(item, index) in openColumns" :key="index" style="font-size: 0px">
                    <FormItem label="列名" style="width: 174px">
                        <Input placeholder="中文列名 eg.分类1" v-model="item.title"></Input>
                    </FormItem>
                    <FormItem label="拼音/英文" style="width: 174px;">
                        <Input placeholder="本方案内唯一标识" v-model="item.field"></Input>
                    </FormItem>
                    <FormItem label="" style="width: 70px;font-size: 0;">
                        <div style="display: block;height: 31px"></div>
                        <Button style="display: inline-block;float: right;padding: 6px 11px;margin-left: 3px" title="删除"
                                type="primary" icon="close" @click="openColumns.splice(index,1)"></Button>
                        <Button style="display: inline-block;float: right;padding: 6px 11px;"
                                v-show="index === (openColumns.length - 1)" title="新增" type="success" icon="plus"
                                @click="openColumns.push({'title':'','field':'', 'titleAlign': 'center', 'width': 100, 'columnAlign': 'center','isResize':true, 'isEdit': true})"></Button>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editorColumns = false">取消</Button>
                <Button type="primary" @click="updateColumn">确定</Button>
            </div>
        </Modal>
        <Modal v-model="editUserModel" :width="1500">
            <div slot="header">
                <p style="color:#495060;text-align:center;font-size: 18px">绩效绑定</p>
            </div>
            <Row :gutter="16">
                <Col :span="14">
                    <div style="max-height: 606px;overflow:auto;">
                        <Input v-model="filterText"  placeholder="快速查找部门"></Input>
                        <el-tree :data="orgTreeData"
                                 ref="treeDom"
                                 show-checkbox
                                 :filter-node-method="filterNode"
                                 :expand-on-click-node="false"
                                 :highlight-current="true"
                                 node-key="id"
                                 style="margin-top: 10px;width : 300px"
                                 :props="defaultProps"></el-tree>
                    </div>
                </Col>
                <Col :span="10">
                    <Form inline :label-width="90">
                        <FormItem label="独立绑定人员">
                            <Select v-model="bindUser.usersIds" multiple filterable remote
                                    :label="bindUser.remoteLabel2" :remote-method="_filterPeopleRemote">
                                <Option v-for="(option) in bindUser.filterPeopleOpt" :value="option.id"
                                        :key="'user' + option.id">{{option.realname + '(' +option.postname+')'}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="editUserModel = false">取消</Button>
                <Button type="primary" @click="bind">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import 'vue-easytable/libs/themes-base/index.css';
    import _differenceWith from 'lodash/differenceWith';
    import _uniqWith from 'lodash/uniqWith';
    import _isEqual from 'lodash/isEqual';
    import {VTable, VPagination} from 'vue-easytable';
    import moment from 'moment';
    import utils from '@/libs/util.js';
    import fsTablePage from '@/baseComponents/fs-table-page';

    const NOW_MONTH = moment().format('YYYY-MM')

    export default {
        name: 'newSalary',
        components: {
            VTable, VPagination, fsTablePage
        },
        data() {
            return {
                now_month: NOW_MONTH,
                editorColumns: false,
                showTable: false,
                saveLoading: false,
                addNewColumns: false,
                editUserModel: false,
                showCopyNew: false,
                filterText: '',
                bindType: '',
                delselect: '',
                openColumns: [],
                searchData: {
                    month: {
                        value: NOW_MONTH,
                        type: 'select'
                    },
                    name: {
                        value: '',
                        type: 'input'
                    }
                },
                bindUser: {
                    key_id: '',
                    filterPeopleOpt: [],
                    remoteLabel2: [],
                    usersIds: [],
                    orgIds: []
                },
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
                        title: '月度',
                        key: 'time',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '绑定状态',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let row = params.row;
                            if (row.organizeids || row.userids) {
                                return h('span', '已绑定');
                            } else {
                                return h('span', '未绑定');
                            }
                        }
                    },
                    {
                        title: '编辑',
                        width: 140,
                        align: 'center',
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
                                        title: '查看编辑'
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
                    },
                    {
                        title: '操作',
                        width: 140,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let arr = [
                                // 这里是为了从已有的方案中快速的建立一份副本来修改，满足某些方案很类似但是有少许不一致的情况
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'plus',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '快速复制'
                                    },
                                    on: {
                                        click: function () {
                                            vm.quickNew(JSON.stringify(params.row));
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'close',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '删除'
                                    },
                                    on: {
                                        click: function () {
                                            vm.delOne(params.row);
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
            _monthChangeHanfler(val) {
                this.searchData.month.value = val
                this.showCopyNew = false
            },
            initNew() {
                this.header.name = '';
                this.header.id = '';
                this.header.columns = [];
                this.tableData.data = [];
                this.tableData.key_id = '';
                this.showTable = true;
            },
            delColumn() {
                let that = this;
                let c = that.header.columns;
                this.delselect = '';
                this.$Modal.confirm({
                    render: (h) => {
                        let arr = [];
                        for (let i = 1; i < c.length; i++) {
                            let temp = c[i];
                            arr.push(
                                h('Option', {
                                    props: {
                                        value: i,
                                        label: temp.title
                                    }
                                })
                            );
                        }
                        return h('Select', {
                            props: {
                                value: that.delselect
                            },
                            on: {
                                'on-change': (val) => {
                                    that.delselect = val;
                                }
                            }
                        }, arr);
                    },
                    onOk: () => {
                        that.header.columns.splice(that.delselect, 1);
                        that.$refs.vt.resize();
                    }
                })
            },
            // 已有的方案选定一个快速复制
            quickNew(p) {
                let row = JSON.parse(p);
                row.id = '';
                row.name = row.name + ' 副本';
                this.detail(row);
            },
            // 查不到数据时触发
            onEmpty() {
                if (this.searchData.month.value === this.now_month) {
                    this.showCopyNew = true;
                    return;
                }
                this.showCopyNew = false;
            },
            // 快速复制一份上月的方案
            copyNew() {
                let d = {};
                d.time = this.now_month;
                this.$http.post('/perform/copyAllSalary', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('新建成功！');
                        this.$refs.paperList.getListData();
                    }
                });
            },
            _downloadGrade1() {
                let sendData = {};
                sendData.time = this.now_month;
                this.$http.post('/perform/exportDetail', sendData).then((res) => {
                    if (res.success) {
                        utils.downloadFile(res.path, res.path);
                    }
                }, () => {
                })
            },
            // 判断数组中是否有重复元素
            adjReArray(array) {
                let nowArrayLength = array.length;
                let afterArrayLength = [...new Set(array)].length;
                return nowArrayLength === afterArrayLength;
            },
            // 更新动态列
            updateColumn() {
                const keyArray = this.openColumns.map(x => x.field)
                const flag = this.adjReArray(keyArray)
                if (!flag) {
                    this.$Message.error('想要新建的字段已经存在。请检查或修改拼音，避免完全重复。');
                    return;
                }
                let that = this;
                let newArray = [{
                    'width': 60,
                    'titleAlign': 'center',
                    'columnAlign': 'center',
                    'type': 'selection'
                }];
                this.header.columns = newArray.concat(this.openColumns)
                this.header.columns.forEach((res) => {
                    if (res.type !== 'selection') {
                        this.rowColumn[res.field] = '';
                    }
                });
                // 新建的列在表单已有的数据中不能直接使用，双向绑定无效。这里做一个初始化
                let d = JSON.parse(JSON.stringify(that.tableData.data));
                if (d.length >= 1) {
                    for (let i = 0, dl = d.length; i < dl; i++) {
                        let temp = d[i];
                        for (let key in this.rowColumn) {
                            if (!temp.hasOwnProperty(key)) {
                                temp[key] = '';
                            }
                        }
                    }
                }
                this.tableData.data = d;
                this.editorColumns = false;
                this.$refs.vt.resize();
            },
            // 增加动态列
            addColumn() {
                let that = this;
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
                this.openColumns = [];
                this.header.columns = [{
                    'width': 60,
                    'titleAlign': 'center',
                    'columnAlign': 'center',
                    'type': 'selection'
                }];
                this.tableData.data = [];
                let columnObj = {};
                let tableData = [];
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
                    this.openColumns.push({
                        'title': columnObj[key],
                        'field': key,
                        'titleAlign': 'center',
                        'width': 100,
                        'columnAlign': 'center',
                        'isResize': true,
                        'isEdit': true
                    })
                    this.rowColumn[key] = '';
                }
                if (tableData === null) {
                    tableData = [];
                }
                for (let i = 0, tl = tableData.length; i < tl; i++) {
                    let d = tableData[i].values;
                    d.id = tableData[i].id;
                    this.tableData.data.push(d);
                }
                this.showTable = true;
            },
            // 保存表格
            saveTable() {
                let that = this;
                if (this.header.columns.length > 0) {
                    let d = {};
                    this.saveLoading = true;
                    d.id = this.header.id;
                    d.name = this.header.name;
                    let kv = {};
                    for (let i = 0, hcl = this.header.columns.length; i < hcl; i++) {
                        let re = this.header.columns[i];
                        if (re.type === 'selection') continue
                        kv[re.field] = re.title;
                    }
                    d.kv = JSON.stringify(kv);
                    // 保存表头
                    this.$http.post('/perform/saveMainColumns', d).then((res) => {
                        if (res.success) {
                            this.header.id = res.message;
                            this.tableData.key_id = res.message;
                            // 保存表数据
                            if (this.tableData.data.length > 0) {
                                // 拼出我需要的数据
                                // [key_id:1,arr:{id:xx,values:{}},{id:xx2,values:{}}]
                                let d2 = {};
                                d2.key_id = this.tableData.key_id;
                                let arr = [];
                                this.tableData.data.forEach((res) => {
                                    arr.push({'id': res.id, values: res});
                                });
                                d2.arr = JSON.stringify(arr);
                                that.$http.post('/perform/addValueArrays', d2).then(res => {
                                    if (res.success) {
                                        that.$Message.success('成功');
                                        that.$refs.paperList.getListData();
                                        that.showTable = false;
                                    }
                                });
                            } else {
                                that.$Message.success('保存成功');
                            }
                        }
                        that.saveLoading = false;
                    }, () => {
                        that.saveLoading = false;
                    })
                }
            },
            delTarget() {
                let that = this;
                if (this.selection.length <= 0) {
                    this.$Message.info('想删除什么？请选中');
                } else {
                    let arr = this.selection.filter((res) => {
                        return res.id;
                    }).map((res2) => {
                        return res2.id;
                    });
                    if (arr.length === 0) {
                        that.tableData.data = _differenceWith(that.tableData.data, that.selection, _isEqual);
                        return;
                    }
                    if (arr.length > 0) {
                        that.$Modal.confirm({
                            title: '删除提醒',
                            content: '是否确认删除？',
                            okText: '删除',
                            cancelText: '取消',
                            loading: true,
                            onOk() {
                                that.$http.post('/perform/deleteValuesArr', {ids: arr.join(',')}).then((res2) => {
                                    if (res2.success) {
                                        that.tableData.data = _differenceWith(that.tableData.data, that.selection, _isEqual);
                                    }
                                    that.$Modal.remove();
                                }, () => {
                                    that.$Modal.remove();
                                })
                            }
                        });
                    }
                }
            },
            bind() {
                let d = {};
                d.organizeIds = this.$refs.treeDom.getCheckedKeys().join(',');
                d.userIds = this.bindUser.usersIds.join(',');
                d.id = this.bindUser.key_id;
                this.$http.post('/perform/bindKey', d).then((res) => {
                    if (res.success) {
                        this.editUserModel = false;
                        this.$refs.paperList.getListData();
                        this.$Message.success('绑定部门、人员修改成功');
                    }
                });
            },
            editUserMapping(param) {
                let vm = this;
                vm.bindUser.usersIds = [];
                vm.bindUser.remoteLabel2 = [];
                this.editUserModel = true;
                this.bindUser.key_id = param.id;
                this.$http.post('/perform/getUserList', {id: param.id}).then((res) => {
                    if (res.success) {
                        let d = res.data;
                        d.forEach((item) => {
                            vm.bindUser.usersIds.push(item.id);
                            vm.bindUser.remoteLabel2.push(item.realname);
                        });
                    }
                });
                if (param.usersids) {
                    this.bindUser.usersIds = param.usersids.substring(1, param.usersids.length - 1).split(',');
                }
                this.$refs.treeDom.setCheckedKeys(param.organizeids ? param.organizeids.split(',').filter(x => !!x) : []);
            },
            delOne(row) {
                let that = this;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk() {
                        that.$http.post('/perform/deleteKey', {id: row.id}).then((res2) => {
                            if (res2.success) {
                                that.$refs.paperList.getListData();
                                that.$Message.success('删除成功');
                            }
                            that.$Modal.remove();
                        }, () => {
                            that.$Modal.remove();
                        })
                    }
                });
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
                this.selection = selection;
            },
            _selectGroupChange(selection) {
                this.selection = selection;
            },
            _cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                this.tableData.data[rowIndex][field] = newValue;
            },
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.bindUser.filterPeopleOpt = [];
                this.$http.post('/user/getCheckUserAndPost', data).then((res) => {
                    if (res.success) {
                        this.bindUser.filterPeopleOpt = res.data;
                    }
                });
            }
        },
        created() {
            this._getOrgTree().then((res) => {
                this._getAllDepIds(res);
            });
            this._filterPeopleRemote();
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
    #newSalary-showTable {
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
