<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="问卷名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选问卷"></Input>
                </FormItem>
                <FormItem label="问卷状态">
                    <Select v-model="filterOpt.status.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="item.status" v-for="item, index in statusList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="_addPaperOpen">
                            <Icon type="plus-round"></Icon>
                            添加问卷
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           ref="paperList"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/questionnairepaper/getPaperList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="500"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>添加问卷</span>
                </p>
                <Form :label-width="80"
                      :model="editorSettingData"
                      ref="paperForm"
                      :rules="paperRules">
                    <FormItem label="问卷名称" prop="name">
                        <Input type="text"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_submitPaper">
                        添加问卷
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="paperSettingFlag"
                   width="1500"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>为问卷挑选试题</span>
                </p>
                <div class="">
                    <Row :gutter="16">
                        <Col :span="12">
                        <paper-question-list :id="paperId"
                                             ref="questionList"
                                             @add-success="_getPaperDetail"></paper-question-list>
                        </Col>
                        <Col :span="12">
                        <editor-paper :id="paperId"
                                      :editorabled="true"
                                      @del-question-success="_updateQuestionList"
                                      ref="paperDetail"></editor-paper>
                        </Col>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="paperSettingFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="paperCheckFlag"
                   width="1200"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>查看问卷</span>
                </p>
                <div class="">
                    <editor-paper :id="paperIdCheck"></editor-paper>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="paperCheckFlag = false">关闭</Button>
                </div>
            </Modal>
            <Modal v-model="paperNameflag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>修改问卷</span>
                </p>
                <div class="">
                    <Form :label-width="80"
                          :model="paperNameForm"
                          ref="paperNameForm"
                          :rules="paperNameRules">
                        <FormItem label="问卷名称" prop="name">
                            <Input type="text"
                                   v-model="paperNameForm.name"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="primary" style="margin-left: 8px" @click="_confirmSubmitPaperName">提交修改</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="paperNameflag = false">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import paperQuestionList from '../components/paper-question-list';
    import editorPaper from '../components/editor-paper';
    export default {
        name: 'questionnaireQuestionsManage',
        data () {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle'
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                editorSettingFlag: false,
                btnLoading: false,
                paperSettingFlag: false,
                paperCheckFlag: false,
                paperNameflag: false,
                paperId: 0,
                paperIdCheck: 0,
                postFormType: 'update',
                paperRules: {
                    name: [
                        {required: true, message: '问卷名称不能为空!', trigger: 'blur'}
                    ]
                },
                statusList: [
                    {
                        status: 0,
                        name: '未启用'
                    },
                    {
                        status: 1,
                        name: '已启用'
                    }
                ],
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    },
                    subjectPaper: {
                        value: '',
                        type: 'select'
                    }
                },
                editorSettingData: {
                    name: '',
                    isRandom: 2,
                    subject: 1,
                    subjectPaper: 1,
                    singleTypeNum: 0,
                    multiTypeNum: 0,
                    trueOrFalseTypeNum: 0,
                    fillTypeNum: 0,
                    questionTypeNum: 0
                },
                paperNameForm: {
                    name: '',
                    subjectPaper: '',
                    id: 0
                },
                paperNameRules: {
                    name: [
                        {required: true, message: '问卷名称不能为空!', trigger: 'blur'}
                    ]
                },
                postColumns: [
                    {
                        title: '问卷名称',
                        key: 'name'
                    },
                    {
                        title: '总分',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', params.row.totlemark || 0);
                        }
                    },
                    {
                        title: '状态',
                        key: 'user_name',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let status = params.row.status;
                            let color = '';
                            let content = '';
                            if (status === 0) {
                                color = 'default';
                                content = '未启用';
                            } else if (status === 1) {
                                color = 'green';
                                content = '已启用';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, content);
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createbyname',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '创建时间',
                        key: 'createbydate',
                        align: 'center',
                        width: 240
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 300,
                        render: (h, params) => {
                            let vm = this;
                            let status = params.row.status;
                            if (status === 0) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '添加试题', icon: 'plus-round', foo: vm._addQuestion}),
                                    colBtn(vm, h, params, {content: '修改问卷', icon: 'compose', foo: vm._changePaperName}),
                                    colBtn(vm, h, params, {content: '开启问卷', icon: 'play', foo: vm._publishPaper})
                                ]);
                            } else if (status === 1) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '查看问卷', icon: 'eye', foo: vm._checkPaper}),
                                    colBtn(vm, h, params, {content: '关闭问卷', icon: 'close-round', foo: vm._closePaper})
                                ]);
                            }
                        }
                    }
                ],
                tableHeight: 500,
            };
        },
        created() {
            this._setTableHeight();
        },
        watch: {

        },
        methods: {
            _updateQuestionList() {
                this.$refs.questionList._updateList();
                this._updatePaperList();
            },
            _getPaperDetail() {
                this.$refs.paperDetail._getPaperDetail();
                this._updatePaperList();
            },
            _addQuestion(data) {
                this.paperId = data.id;
                this.paperSettingFlag = true;
            },
            _changePaperName(data) {
                this.paperNameForm.name = data.name;
                this.paperNameForm.subjectPaper = data.subject;
                this.paperNameForm.id = data.id;
                this.paperNameflag = true;
            },
            _confirmSubmitPaperName() {
                let data = {};
                data.name = this.paperNameForm.name;
                data.subjectPaper = this.paperNameForm.subjectPaper;
                data.id = this.paperNameForm.id;
                this.$http.post('/questionnairepaper/add', data).then((res) => {
                    if (res.success) {
                        this.paperNameflag = false;
                        this.$Message.success('问卷名称修改成功!');
                        this._updatePaperList();
                    }
                });
            },
            _publishPaper(data) {
                this.$Modal.confirm({
                    content: `确认发布【${data.name}】问卷么？`,
                    okText: '确认发布',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 1;
                        this.$http.post('/questionnairepaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('问卷发布成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _checkPaper(data) {
                this.paperIdCheck = data.id;
                this.paperCheckFlag = true;
            },
            _closePaper(data) {
                this.$Modal.confirm({
                    content: `确认关闭【${data.name}】问卷么？`,
                    okText: '确认关闭',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 0;
                        this.$http.post('/questionnairepaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('关闭问卷成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _copyPaper(data) {
                this.$Modal.confirm({
                    content: `确认复制【${data.name}】问卷么？复制问卷进入待发布状态！！！`,
                    okText: '确认复制',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/questionnairepaper/copyPaper', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('问卷复制成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _republishPaper(data) {
                this.$Modal.confirm({
                    content: `确认重新发布【${data.name}】问卷么？`,
                    okText: '确认发布',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/questionnairepaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('重新发布问卷成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _updatePaperList() {
                this.$refs.paperList.getListData();
            },
            _initEditorSettingData() {
                this.$refs.paperForm.resetFields();
                let editorSetting = this.editorSettingData;
                editorSetting.name = '';
                editorSetting.isRandom = 2;
                // editorSetting.subject = this.subjectList[0].id;
                // editorSetting.subjectPaper = this.subjectList[0].id;
                editorSetting.singleTypeNum = 0;
                editorSetting.multiTypeNum = 0;
                editorSetting.trueOrFalseTypeNum = 0;
                editorSetting.fillTypeNum = 0;
                editorSetting.questionTypeNum = 0;
            },
            _addPaperOpen() {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _submitPaper() {
                this.$refs.paperForm.validate((valid) => {
                    if (valid) {
                        let editorSetting = this.editorSettingData;
                        if (editorSetting.isRandom === 1) {
                            let sendData = {};
                            sendData.id = 0;
                            sendData.subjectPaper = editorSetting.subjectPaper;
                            sendData.name = editorSetting.name;
                            this.$http.post('/questionnairepaper/add', sendData).then((res) => {
                                if (res.success) {
                                    this.editorSettingFlag = false;
                                    this.$Message.success('问卷添加成功!');
                                    this._updatePaperList();
                                }
                            });
                        } else {
                            let sendData = {};
                            sendData.name = editorSetting.name;
                            sendData.count1 = editorSetting.singleTypeNum;
                            this.$http.post('/questionnairepaper/addRandomPaper', sendData).then((res) => {
                                if (res.success) {
                                    this.editorSettingFlag = false;
                                    this.$Message.success('问卷添加成功!');
                                    this._updatePaperList();
                                }
                            });
                        }
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            paperQuestionList,
            editorPaper
        }
    };
</script>
