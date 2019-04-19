<template>
    <div>
        <Row :gutter="10">
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">授课类型</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in leftMenu_type" :key="index" :class="{'ivu-menu-item-active': item.active}" @click="changeTable_type(item, index)">{{item.name}}</li>
                        </ul>
                    </li>
                </ul>
            </Col>
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">讲师等级</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in leftMenu_post" :key="index" :class="{'ivu-menu-item-active': item.active}" @click="changeTable_post(item, index)">{{item.name}}</li>
                        </ul>
                    </li>
                </ul>
            </Col>
            <Col :span="20">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名:">
                    <Input type="text"
                           v-model="filterOpt_t.user_name.value"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="部门:">
                    <Input type="text"
                           v-model="filterOpt_t.organize_name.value"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <!--<Button type="primary" @click="checkOrgFlag = true">
                            <Icon type="eye"></Icon>
                            查看部门及其成员
                        </Button>-->
                        <Button type="primary" @click="mubanFlag = true">
                            <Icon type="gear-b"></Icon>
                            等级管理
                        </Button>
                        <Button type="primary" @click="_createClassOpen">
                            <Icon type="plus-round"></Icon>
                            新增讲师
                        </Button>
                        <Button type="error"
                                :disabled="!classChooseDataArray.length"
                                @click="_delClass">
                            <Icon type="ios-trash-outline"></Icon>
                            删除讲师
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           ref="classTable"
                           :params="filterOpt_t"
                           :choosearray.sync="classChooseDataArray"
                           url="/train/teacher_datalist"></fs-table-page>
        </Card>
            </Col>
        </Row>
         <!--培训师等级设置-->
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训师等级设置</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="postAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/postDataList"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选等级么吗？"
                        transfer
                        @on-ok="_deletePost">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除</Button>
                </Poptip>
                <Poptip placement="left" width="400">
                    <Button type="primary"
                            :disabled="!(chooseDataArray.length === 1)"
                            style="margin-left: 8px"
                            @click="_updateMubanHandler">修改</Button>
                    <Button type="primary"
                            @click="_addMubanHandler"
                            style="margin-left: 8px">添加等级</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="等级名称" prop="postName">
                                <Input v-model="banciForm.postName"></Input>
                            </FormItem>
                            <FormItem label="金币" prop="coin">
                                <input-number :precision="0"  v-model="banciForm.coin"></input-number>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="banciForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">{{mubanAddType === 'add' ? '添加': '修改'}}岗位</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <!--新建修改讲师-->
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}讲师</span>
            </p>
            <Form :label-width="100">
                <!--<FormItem label="姓名" v-show="usernameisShow" required>-->
                    <!--<Input v-model="classForm.username"></Input>-->
                <!--</FormItem>-->
                <FormItem label="姓名" v-show="isShow" required>
                    <fs-search-user v-model="classForm.user_id"
                                    :optionlist.sync="nameForm.nameOpt"
                                    :clearable="true"
                                    :label="nameForm.nameLabel"></fs-search-user>
                </FormItem>
                <FormItem label="等级名称" required>
                    <Select v-model="classForm.post_id">
                        <Option :value="item.id"
                                v-for="(item, index) in leftMenu_post"
                                :key="'teacherOpt' + index">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="classForm.remark"></Input>
                </FormItem>
                <div v-for="(item_c,index_c) in classForm.typeList">
                    <Row :gutter="16">
                        <Col :span="9">
                            <FormItem label="培训类型:" :label-width="100" required>
                                <Select v-model="item_c.type_id">
                                    <Option v-for="(item, index) in leftMenu_type"
                                            :value="item.id"
                                            :key="'type-' + index">{{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="9">
                            <FormItem label="审批人">
                                <Input v-model="item_c.approve_name"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="1">
                        <FormItem label="" >
                            <Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"
                                    @click="delForm(index_c)"></Button>
                        </FormItem>
                        </Col>
                    </Row>
                </div>
                <div class="" style="margin-top: 8px;text-align: right">
                    <Button type="ghost"
                            shape="circle"
                            @click="classForm.typeList.push({})"
                            icon="plus-round">新增类型</Button>
                </div>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'? '新建' : '修改'}}讲师</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
<!--        <Modal v-model="checkOrgFlag" width="1200" :mask-closable="false">-->
<!--            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">-->
<!--                <span>部门及其成员查看</span>-->
<!--            </p>-->
<!--            <div class="">-->
<!--                <Row :gutter="16">-->
<!--                    <Col :span="8" style="max-height: 540px;overflow: auto;">-->
<!--                    <fs-dep-tree url="/organize/organizeTree?fatherId=-1"-->
<!--                                 @node-change="_nodeChangeHandler($event)"-->
<!--                                 :defaultProps="defaultProps"></fs-dep-tree>-->
<!--                    </Col>-->
<!--                    <Col :span="16">-->
<!--                    <fs-table-page :columns="userColum"-->
<!--                                   :height="500"-->
<!--                                   :params="filterOpt"-->
<!--                                   url="/user/dataList"></fs-table-page>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--            </div>-->

<!--            <div slot="footer">-->
<!--                <Button type="ghost" style="margin-left: 8px" @click="checkOrgFlag = false">关闭</Button>-->
<!--            </div>-->
<!--        </Modal>-->
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    // import fsDepTree from '@/baseComponents/fs-dep-tree';
    import fsSearchUser from '@/baseComponents/fs-search-user';
    // import moment from 'moment';
    export default {
        name: 'internalTrainerManage',
        data () {
            return {
                isShow: true,
                usernameisShow: false,
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                checkOrgFlag: false,
                classFormType: 'add',
                mubanAddType: 'add',
                tableHeight: 300,
                mubanId: 0,
                chooseDataArray: [],
                classChooseDataArray: [],
                allPostData: [],
                nameForm: {
                    nameOpt: [],
                    nameLabel: ''
                },
                // 讲师等级
                leftMenu_post: [],
                // 培训类型
                leftMenu_type: [],
            classId: 0,
            classForm: {
                username: '',
                user_id: '',
                typeList: [
                    {
                        type_id: '',
                        approve_name: ''
                    }
                ],
                remark: '',
                post_id: '',
                level: '',
                class_type: [],
                class_name: '',
                class_years: 0,
                class_times: 0,
                comment: '',
                isDefault: 0
            },
                approvalForm: {
                name: '',
                username: '',
                user_id: '',
                class_type: []
            },
                banciRules: {
                postName: [
                    { required: true, message: '等级名称不能为空', trigger: 'blur' }
                ],
                coin: [
                    { required: true, message: '金币不能为空', type: 'number', trigger: 'blur' }
                ]
            },
            banciForm: {
                postName: '',
                remark: '',
                coin: 0
            },
            defaultProps: {
                children: 'children',
                    label: 'name'
            },
            roleData: [],
                userColum: [
                {
                    title: '姓名',
                    key: 'realname',
                    align: 'center',
                    width: 100
                },
                {
                    title: '部门',
                    key: 'organizename',
                    align: 'center'
                },
                {
                    title: '岗位',
                    key: 'postname',
                    align: 'center'
                }
            ],
                mubanColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '金币',
                    align: 'center',
                    key: 'coin'
                },
                {
                    title: '备注',
                    key: 'remark'
                }
            ],
                postColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '讲师名称',
                    key: 'user_name',
                    align: 'center'
                    // width: 160
                },
                {
                    title: '等级名称',
                    align: 'center',
                    key: 'post_name'
                    // width: 100
                },
                {
                    title: '部门',
                    align: 'center',
                    key: 'organize_name'
                },
                {
                    title: '审批人',
                    align: 'center',
                    key: 'approvename'
                },
                {
                    title: '备注',
                    align: 'center',
                    key: 'remark'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        let vm = this;
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    content: '修改',
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function() {
                                            vm._checkTest(params.row);
                                        }
                                    }
                                })
                            ])
                        ]);
                    }
                }
            ],
            filterOpt: {
                nodeId: {
                    type: 'date',
                        value: ''
                },
                states: {
                    type: 'select',
                        value: 1
                }
            },
            filterOpt_t: {
                post_id: {
                    value: '',
                    type: 'input'
                },
                type_id: {
                    value: '',
                    type: 'input'
                },
                user_name: {
                    value: '',
                    type: 'input'
                },
                organize_name: {
                    value: '',
                    type: 'input'
                }
            }
        };
        },
        created() {
            this._setTableHeight();
            this._getAllpost();
            this._getAllClassTypeOpt();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            // _nodeChangeHandler(node) {
            //     this.filterOpt.nodeId.value = node.id;
            // },
            _initClassForm() {
                this.classForm = {
                    username: '',
                    user_id: '',
                    typeList: [],
                    remark: '',
                    post_id: ''
            };
            this.nameForm.nameLabel = '';
            this.nameForm.nameOpt = [];
                // this.formReset('classForm');
            },
            change (status) {
                this.isShow = !this.isShow;
                this.usernameisShow = !this.usernameisShow;
            },
            _updateMubanHandler() {
                this.mubanAddType = 'update';
                this.formReset('banciForm');
                let fillForm = this.chooseDataArray[0];
                this.banciForm.postName = fillForm.name;
                this.banciForm.remark = fillForm.remark;
                this.banciForm.coin = fillForm.coin;
                this.mubanId = fillForm.id;
            },
            _addMubanHandler() {
                this.mubanAddType = 'add';
                this.formReset('banciForm');
            },
            _deletePost() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/deletePost', data).then((res) => {
                    if (res.success) {
                        this.$refs.postAdd.getListData();
                        this.chooseDataArray = [];
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addPost() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.postName;
                        data.remark = this.banciForm.remark;
                        data.coin = this.banciForm.coin;
                        if (!(this.mubanAddType === 'add')) data.id = this.mubanId;
                        this.$http.post('/train/addPost', data).then((res) => {
                            if (res.success) {
                                this.formReset('banciForm');
                                this.$refs.postAdd.getListData();
                                this._getAllpost();
                                this.$Message.success('操作成功！');
                            }
                            this.banciBtnLoading = false;
                        }, () => {
                            this.banciBtnLoading = false;
                        })
                    }
                });
            },
            _addClassHandler() {
                if (!this.classForm.user_id) {
                    this.$Message.error('姓名不能为空!');
                    return;
                }
                if (!this.classForm.post_id) {
                    this.$Message.error('等级不能为空!');
                    return;
                }
                let type_list = this.classForm.typeList.filter(function (item) {
                    return (item.type_id || item.approve_name);
                });
                let data = {};
                data.out_teacher = 0;
                data.user_id = this.classForm.user_id;
                data.post_id = this.classForm.post_id;
                // data.type_id = this.classForm.class_type.join(',');
                data.remark = this.classForm.remark;
                data.typeList = JSON.stringify(type_list);
                if (this.classFormType === 'update') data.id = this.classId;
                this.$http.post('/train/teacher_add', data).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this._updateClassTable();
                        this.$Message.success('操作成功!');
                    }
                });
            },
            _delClass() {
                this.$Modal.confirm({
                    content: '确认删除所选讲师么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.classChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/teacher_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updateClassTable();
                            }
                        });
                    }
                });
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.classForm.typeList.push({});
                this.modelFlag = true;
            },
            _checkTest(data) {
                this.classFormType = 'update';
                this._initClassForm();
                this.classId = data.id;
                let classForm = this.classForm;
                classForm.user_id = data.user_id;
                classForm.post_id = data.post_id;
                classForm.level = data.level;
                classForm.remark = data.remark;
                this.nameForm.nameLabel = data.user_name;
                this.nameForm.nameOpt = [
                    {
                        id: +data.user_id,
                        realname: data.user_name,
                        organizename: ''
                    }
                ];
                // 后台查询类型审批人
                this.$http.get('/train/queryTec_Type_app?id=' + data.user_id).then((res) => {
                    if (res.success) {
                        this.classForm.typeList = res.data;
                    } else {
                        this.classForm.typeList.push({});
                    }
                });
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            // 等级
            _getAllpost() {
                this.$http.get('/train/postComboxData').then((res) => {
                    if (res.success) {
                        this.allPostData = res.data;
                        this.leftMenu_post = res.data;
                    }
                });
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            },
            changeTable_post(item, index) {
                if (!item.active) {
                    // 遍历是的指定选项变成active，其余的取消active
                    this.leftMenu_post.filter((x, y) => {
                        if (y === index) {
                            if (typeof x.active === 'undefined') {
                                this.$set(x, 'active', true)
                            } else {
                                item.active = true
                            }
                        } else if (typeof x.active !== 'undefined') {
                            x.active = false
                        }
                    })
                    // 这里写指定条件的更新表格数据方法
                    this.filterOpt_t.post_id.value = item.id
                } else {
                    item.active = false
                    // 这里写一个也不选的更新表格数据方法
                    this.filterOpt_t.post_id.value = null;
                }
            },
            changeTable_type(item, index) {
                if (!item.active) {
                    // 遍历是的指定选项变成active，其余的取消active
                    this.leftMenu_type.filter((x, y) => {
                        if (y === index) {
                            if (typeof x.active === 'undefined') {
                                this.$set(x, 'active', true)
                            } else {
                                item.active = true
                            }
                        } else if (typeof x.active !== 'undefined') {
                            x.active = false
                        }
                    })
                    // 这里写指定条件的更新表格数据方法
                    console.log(item)
                    console.log(item.id)
                    this.filterOpt_t.type_id.value = item.id
                } else {
                    item.active = false
                    // 这里写一个也不选的更新表格数据方法
                    this.filterOpt_t.type_id.value = null;
                }
            },
            // 类型
            _getAllClassTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.leftMenu_type = res.data;
                    }
                });
            },
            delForm(index) {
                this.classForm.typeList.splice(index, 1);
                this.$Message.success('删除成功');
            }
        },
        components: {
            fsTablePage,
            fsSearchUser,
            // fsDepTree
        }
    };
</script>
