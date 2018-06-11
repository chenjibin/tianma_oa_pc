<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="培训类型">
                    <Select v-model="filterOpt.class_type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option :value="item.id"
                                v-for="(item,index) in trainTypeOpt"
                                :key="'trainTypeOpt' + index">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="mubanFlag = true">
                            <Icon type="gear-b"></Icon>
                            课程类型
                        </Button>
                        <Button type="primary" @click="_createClassOpen">
                            <Icon type="plus-round"></Icon>
                            新建课程
                        </Button>
                        <Button type="error"
                                :disabled="!classChooseDataArray.length"
                                @click="_delClass">
                            <Icon type="ios-trash-outline"></Icon>
                            删除课程
                        </Button>
                        <Button type="success"
                                :disabled="classChooseDataArray.length !== 1"
                                :loading="downloadLoading"
                                @click="_downloadGrade">
                            <Icon type="ios-cloud-download-outline"></Icon>
                            下载成绩
                        </Button>
                        <Button type="success"
                                :disabled="classChooseDataArray.length !== 1"
                                @click="_openUploadModel">
                            <Icon type="ios-cloud-upload-outline"></Icon>
                            上传成绩
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="classTable"
                           :choosearray.sync="classChooseDataArray"
                           url="/train/class_datalist"></fs-table-page>
        </Card>
        <Modal v-model="mubanFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>课程类型</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="postAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/class_type_datalist"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选类型吗？"
                        transfer
                        @on-ok="_deletePost">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除
                    </Button>
                </Poptip>
                <Poptip placement="left" width="400">
                    <Button type="primary"
                            :disabled="!(chooseDataArray.length === 1)"
                            style="margin-left: 8px"
                            @click="_updateMubanHandler">修改类型
                    </Button>
                    <Button type="primary"
                            @click="_addMubanHandler"
                            style="margin-left: 8px">添加类型
                    </Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="名称" prop="name">
                                <Input v-model="banciForm.name"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">{{mubanAddType ===
                                    'add' ? '添加': '修改'}}类型
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}课程</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="9">
                    <Col :span="24">
                    <FormItem label="培训名称" prop="title">
                        <Input v-model="classForm.title"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">

                    <FormItem label="外部讲师" prop="out_teacher" required>
                        <i-switch v-model="classForm.out_teacher" size="large" :true-value="1" :false-value="0"
                                  @on-change="change">
                            <span slot="open">选中</span>
                            <span slot="close">不选</span>
                        </i-switch>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="讲师" v-show="usernameisShow" required>
                        <Input v-model="classForm.username"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="讲师" v-show="isShow" prop="teacher_id" required>
                        <Select v-model="classForm.teacher_id">
                            <Option :value="item.user_id"
                                    v-for="(item,index) in teacherOpt"
                                    :key="'teacherOpt' + index">{{item.user_name}}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="反馈模板" prop="type">
                        <Select v-model="classForm.questionnaire_temp"
                                clearable>
                            <Option :value="item.id"
                                    v-for="(item,index) in questionnaire"
                                    :key="'questionnaire' + index">{{item.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="培训类型" prop="type">
                        <Select v-model="classForm.type"
                                clearable>
                            <Option :value="item.id"
                                    v-for="(item,index) in trainTypeOpt"
                                    :key="'trainTypeOpt' + index">{{item.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="培训日期">
                        <DatePicker @on-change="classForm.class_date = $event"
                                    :clearable="false"
                                    :value="classForm.class_date"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="上课时间" prop="period">
                        <Input v-model="classForm.period"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="培训地点" prop="position">
                        <Input v-model="classForm.position"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="学分">
                        <InputNumber :min="0" v-model="classForm.credit"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="讲师金币">
                        <InputNumber :min="0" v-model="classForm.teacher_coin"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="人数限制">
                        <InputNumber :min="0" v-model="classForm.trainee_max_num"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="内容简介">
                        <Input v-model="classForm.about" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'?
                    '新建' : '修改'}}课程
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="importModalFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>上传成绩({{uploadForm.title}})</span>
            </p>
            <Button type="success"
                    :loading="mubanDownloadLoading"
                    style="margin-bottom: 10px;"
                    @click="_downloadGradeMuban">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button>
            <Upload type="drag"
                    :show-upload-list="false"
                    :data="uploadForm"
                    :on-progress="_uploadProgress"
                    :on-format-error="_uploadFormatErr"
                    :on-success="_uploadSuccess"
                    :format="uploadFormat"
                    action="/oa/train/trainee_credit_modoexcel">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">成绩上传中...</Spin>
            </Upload>
            <div slot="footer"></div>
        </Modal>
        <Modal title="签到/评论二维码" v-model="visible" width="600">
            <div style="max-height: 500px;overflow-y: auto;:overflow-x hidden;">
                <Row type="flex" justify="center" class="code-row-bg">
                    <Col span="12">
                    <img :src="$mainHost + '/oa/upload/' + item.signinpicname"
                         v-for="(item, index) in imgArr"
                         :key="'prewimg-' + index"
                         :style="{transform: `rotateZ(${item.deg}deg)`}"
                         style="display: block;margin:auto; text-align: center;"/>
                    </Col>
                </Row>
                <Row type="flex" justify="center" class="code-row-bg">
                    <Col span="12">
                    <span style="text-align: center;display:block;">签到二维码</span></Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="visible = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="evaScroll" title="反馈内容" width="1000" :mask-closable="false">
            <fs-table-page :columns="evaluatePostColumns"
                           :size="null"
                           :height="500"
                           :params="evaluateFilterOpt"
                           url="/train/show_signin_evaluate"></fs-table-page>
            <div slot="footer">
                <Button type="ghost" @click="evaScroll = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import moment from 'moment';
    const NOW_DAY = moment().format('YYYY-MM-DD');
    export default {
        name: 'curriculumManage',
        data() {
            return {
                imgArr: [],
                isShow: true,
                usernameisShow: false,
                visible: false,
                orderList: [],
                pageData: {
                    page: 1,
                    pageSize: 20,
                    totalCount: 0,
                    status: '3'
                },
                evaScroll: false,
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                downloadLoading: false,
                importModalFlag: false,
                spinShow: false,
                mubanDownloadLoading: false,
                mubanAddType: 'add',
                classFormType: 'add',
                planid: '',
                uploadFormat: ['xls'],
                uploadForm: {
                    id: '',
                    title: '',
                    teacher_id: '',
                    questionnaire_temp: ''
                },
                mubanId: 0,
                tableHeight: 300,
                chooseDataArray: [],
                classChooseDataArray: [],
                banciRules: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ]
                },
                banciForm: {
                    name: ''
                },
                classId: 0,
                classRules: {
                    title: [
                        {required: true, message: '培训名名称不能为空', trigger: 'blur'}
                    ],
                    teacher_id: [
                        {required: true, message: '讲师不能为空', type: 'number', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '培训类型不能为空', type: 'number', trigger: 'change'}
                    ],
                    period: [
                        {required: true, message: '上课时间不能为空', trigger: 'change'}
                    ],
                    position: [
                        {required: true, message: '培训地点不能为空', trigger: 'change'}
                    ]
                },
                classForm: {
                    out_teacher: '0',
                    username: '',
                    type: '',
                    title: '',
                    class_date: NOW_DAY,
                    period: '',
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: 1,
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
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
                    }
                ],
                evaluatePostColumns: [
                    {
                        title: '反馈',
                        key: 'evaluate_context'
                    },
                    {
                        title: '日期',
                        align: 'center',
                        key: 'evaluate_time',
                        width: 160
                    },
                    {
                        title: '反馈人',
                        align: 'center',
                        key: 'user_name',
                        width: 120
                    },
                    {
                        title: '评分',
                        align: 'center',
                        key: 'evaluate_score',
                        width: 80
                    }
                ],
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '日期',
                        key: 'user_name',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.class_date).format('YYYY-MM-DD'));
                        }
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'period',
                        width: 200
                    },
                    {
                        title: '培训名称',
                        key: 'title'
                    },
                    {
                        title: '培训类型',
                        key: 'type_name',
                        width: 100
                    },
                    {
                        title: '地点',
                        align: 'center',
                        key: 'position',
                        width: 100
                    },
                    {
                        title: '学分',
                        align: 'center',
                        key: 'credit',
                        width: 80
                    },
                    {
                        title: '讲师',
                        key: 'teacher_name',
                        width: 80
                    },
                    {
                        title: '讲师金币',
                        align: 'center',
                        key: 'teacher_coin',
                        width: 100
                    },
                    {
                        title: '人数限制',
                        align: 'center',
                        key: 'trainee_max_num',
                        width: 100
                    },
                    {
                        title: '已参人数',
                        key: 'has_baoming',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.has_baoming || 0);
                        }
                    }, {
                        title: '签到人数',
                        key: 'sign_in',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.has_baoming || 0);
                        }
                    }, {
                        title: '反馈',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = h('Tooltip', {
                                props: {
                                    content: '反馈',
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'ios-eye',
                                        shape: 'circle',
                                        size: 'small'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._showEvaluate(params.row);
                                        }
                                    }
                                })
                            ]);
                            return h('div', [lookBtn]);
                        }
                    }, {
                        title: '签到/评论二维码',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = '';
                            // if (params.row.imageproof) {
                            lookBtn = h('Tooltip', {
                                props: {
                                    content: '查看二维码',
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'ios-eye',
                                        shape: 'circle',
                                        size: 'small'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._prewImg(params.row);
                                        }
                                    }
                                })
                            ]);

                            return h('div', [lookBtn]);
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
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
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                evaluateFilterOpt: {
                    id: {
                        value: '',
                        type: 'trigger'
                    }
                },
                filterOpt: {
                    class_type: {
                        value: '',
                        type: 'input'
                    }
                },
                trainTypeOpt: [],
                questionnaire: [],
                teacherOpt: [],
                compangsList: []
            };
        },
        created() {
            this._setTableHeight();
            this._getTrainTypeOpt();
            this._getQuestionnaire();
            this._getTeacherOpt();
            this._getAllCompangsList();
        },
        methods: {
            formReset(name) {
                this.$refs[name].resetFields();
            },
            _downloadGrade() {
                this.downloadLoading = true;
                let sendData = {};
                sendData.id = this.classChooseDataArray[0].id;
                sendData.title = this.classChooseDataArray[0].title;
                this.$http.post('/train/trainee_class_crdit_excel', sendData).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/download/' + res.data, res.data);
                    }
                }).finally(() => {
                    this.downloadLoading = false;
                });
            },
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _rotateImg(index) {
                this.imgArr[index].deg += 90;
            },
            change(status) {
                this.isShow = !this.isShow;
                this.usernameisShow = !this.usernameisShow;
                if (+status === 1) {
                    this.classForm.teacher_id = 1019
                }
            },
            _prewImg(data) {
                this.visible = true;
                let storeArr = [];
                if (data.signinpicname) {
                    let obj = {};
                    obj.signinpicname = data.signinpicname;
                    obj.evaluatepicname = data.evaluatepicname;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                this.imgArr = storeArr;
            },
            _showEvaluate(data) {
                this.evaluateFilterOpt.id.value = data.id;
                this.evaScroll = true;
            },
            _openUploadModel() {
                this.importModalFlag = true;
                this.uploadForm.id = this.classChooseDataArray[0].id;
                this.uploadForm.title = this.classChooseDataArray[0].title;
                this.uploadForm.teacher_id = this.classChooseDataArray[0].teacher_id;
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('成绩上传成功!');
                    this.importModalFlag = false;
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _downloadGradeMuban() {
                this.downloadFile('/oa/down/成绩单模板.xls', '成绩单模板.xls');
            },
            _updateMubanHandler() {
                this.mubanAddType = 'update';
                this.formReset('banciForm');
                let fillForm = this.chooseDataArray[0];
                this.banciForm.name = fillForm.name;
                this.mubanId = fillForm.id;
            },
            _addMubanHandler() {
                this.mubanAddType = 'add';
                this.formReset('banciForm');
            },
            _initClassForm() {
                this.formReset('classForm');
                this.classForm = {
                    out_teacher: 0,
                    username: '',
                    type: '',
                    title: '',
                    class_date: NOW_DAY,
                    period: '',
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: 1,
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: ''
                };
            },
            _delClass() {
                this.$Modal.confirm({
                    content: '确认删除所选课程么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.classChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/class_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updateClassTable();
                            }
                        });
                    }
                });
            },
            _addClassHandler() {
                this.$refs.classForm.validate((valid) => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.classForm));
                        if (this.classFormType === 'update') data.id = this.classId;
                        this.$http.post('/train/class_add', data).then((res) => {
                            if (res.success) {
                                this.modelFlag = false;
                                this._updateClassTable();
                                this.$Message.success('操作成功!');
                            }
                        });
                    }
                });
            },
            _getTeacherOpt() {
                this.$http.get('/train/teacher_comboxData').then((res) => {
                    if (res.success) {
                        this.teacherOpt = res.data;
                    }
                });
            },
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
            _getQuestionnaire() {
                let data = {};
                data.page = 1;
                data.pageSize = 10000;
                data.status = '1';
                this.$http.post('/questionnairepaper/getPaperList', data).then((res) => {
                    if (res.success) {
                        this.questionnaire = res.data;
                    }
                });
            },
            _deletePost() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/class_type_delete', data).then((res) => {
                    if (res.success) {
                        this.$refs.postAdd.getListData();
                        this.chooseDataArray = [];
                        this._getTrainTypeOpt();
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addPost() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.name;
                        if (!(this.mubanAddType === 'add')) data.id = this.mubanId;
                        this.$http.post('/train/class_type_add', data).then((res) => {
                            if (res.success) {
                                this.formReset('banciForm');
                                this.$refs.postAdd.getListData();
                                this._getTrainTypeOpt();
                                this.$Message.success('课程类型加成功！');
                            }
                        }).finally(() => {
                            this.banciBtnLoading = false;
                        });
                    }
                });
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.modelFlag = true;
            },
            _checkTest(data) {
                this.classFormType = 'update';
                this._initClassForm();
                this.classId = data.id;
                let classForm = this.classForm;
                if (data.teacher_id === null) {
                    classForm.out_teacher = 1;
                    this.isShow = false;
                    this.usernameisShow = true;
                } else {
                    classForm.out_teacher = 0;
                    this.isShow = true;
                    this.usernameisShow = false;
                }
                classForm.username = data.teacher_name;
                classForm.type = data.type;
                classForm.title = data.title;
                classForm.class_date = data.class_date;
                classForm.period = data.period;
                classForm.position = data.position;
                classForm.credit = data.credit;
                classForm.teacher_id = data.teacher_id;
                classForm.teacher_coin = data.teacher_coin;
                classForm.trainee_max_num = data.trainee_max_num;
                classForm.about = data.about;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            },
            _getAllCompangsList() {
                this.$http.get('/user/getCompanys').then((res) => {
                    if (res.success) {
                        this.compangsList = res.data;
                    }
                });
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
