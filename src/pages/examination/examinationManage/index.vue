<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="考试名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选考试"></Input>
                </FormItem>
                <FormItem label="考试状态">
                    <Select v-model="filterOpt.status.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="item.status" v-for="(item, index) in statusList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="考试分类">
                    <Select v-model="filterOpt.subject.value"
                            style="width: 200px"
                            clearable>
                        <Option :value="item.id" v-for="(item, index) in subjectList" :key="index">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="ghost" @click="_addExamOpen">
                            <Icon type="plus-round"></Icon>
                            添加考试
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="examList"
                           url="/examtestpaper/getTestPaperList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{editorSettingData.id === 0 ? '添加' : '修改'}}考试</span>
                </p>
                <Form :label-width="80"
                      :model="editorSettingData"
                      ref="examForm"
                      :rules="examRules">
                    <FormItem label="考试名称" prop="name">
                        <Input type="text"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="考试类型" v-show="editorSettingData.isRandom === 0" required>
                        <Select v-model="editorSettingData.subjectExam">
                            <Option :value="item.id" v-for="(item, index) in subjectList" :key="index">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="人工阅卷" style="..." prop="states" v-show="editorSettingData.isRandom !== 0">
                        <Select v-model="editorSettingData.states">
                            <Option :value="1">
                                <span style="display:inline-block;margin:0 auto;color:#fff;line-height:22px;border-radius:3px;background-color:#2d8cf0;height:22px;padding:0 8px">需要</span>
                            </Option>
                            <Option :value="2">
                                <span style="display:inline-block;color:#fff;line-height:22px;border-radius:3px;background-color:#ff9900;height:22px;padding:0 8px">不需要</span>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否随机" required>
                        <RadioGroup v-model="editorSettingData.isRandom">
                            <Radio :label="0">正常</Radio>
                            <Radio :label="1">随机多套</Radio>
                            <Radio :label="2">随机一套</Radio>
                        </RadioGroup>
                    </FormItem>
                    <div class="" v-show="editorSettingData.isRandom !== 0">
                        <FormItem label="单选题">
                            <InputNumber :min="0" v-model="editorSettingData.randomXuanZeNum"></InputNumber>
                            <span>每题分数:</span>
                            <InputNumber :min="0" v-model="editorSettingData.randomXuanZeScore"></InputNumber>
                        </FormItem>
                        <FormItem label="多选题">
                            <InputNumber :min="0" v-model="editorSettingData.randomDuoXuanNum"></InputNumber>
                            <span>每题分数:</span>
                            <InputNumber :min="0" v-model="editorSettingData.randomDuoXuanScore"></InputNumber>
                        </FormItem>
                        <FormItem label="判断题">
                            <InputNumber :min="0" v-model="editorSettingData.randomPanDuanNum"></InputNumber>
                            <span>每题分数:</span>
                            <InputNumber :min="0" v-model="editorSettingData.randomPanDuanScore"></InputNumber>
                        </FormItem>
                        <FormItem label="填空题">
                            <InputNumber :min="0" v-model="editorSettingData.randomTianKongNum"></InputNumber>
                            <span>每题分数:</span>
                            <InputNumber :min="0" v-model="editorSettingData.randomTianKongScore"></InputNumber>
                        </FormItem>
                        <FormItem label="问答题">
                            <InputNumber :min="0" v-model="editorSettingData.randomWenDaNum"></InputNumber>
                            <span>每题分数:</span>
                            <InputNumber :min="0" v-model="editorSettingData.randomWenDaScore"></InputNumber>
                        </FormItem>
                    </div>
                    <Row :gutter="16" v-if="editorSettingData.isRandom !== 0">
                        <Col :span="24">
                            <FormItem label="试题平台">
                                <Select v-model="editorSettingData.subject1" multiple>
                                    <Option :value="item.id" v-for="(item, index) in pingList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="知识点">
                                <Select v-model="editorSettingData.subject4" multiple>
                                    <Option :value="item.id" v-for="(item, index) in gangList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="考试类型" >
                                <Select v-model="editorSettingData.subject3" multiple>
                                    <Option :value="item.id" v-for="(item, index) in nanList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="岗位">
                                <Select v-model="editorSettingData.subject2" multiple filterable>
                                    <Option :value="item.id" v-for="(item, index) in postList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="开始时间" prop="startTime" required>
                        <DatePicker type="datetime"
                                    :value="editorSettingData.startTime"
                                    @on-change="editorSettingData.startTime = $event"
                                    :clearable="false"
                                    format="yyyy-MM-dd HH:mm"></DatePicker>
                    </FormItem>
                    <FormItem label="考试时长" required>
                        <InputNumber :min="0" v-model="editorSettingData.totalTime"></InputNumber>
                        <span style="margin-left: 4px">分钟</span>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_addExam">
                        {{editorSettingData.id === 0 ? '添加' : '修改'}}
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="examSettingFlag"
                   width="1500"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>添加考试【{{examName}}】人员</span>
                </p>
                <div class="">
                    <Row :gutter="16">
                        <Col :span="12">
                            <people-choose :id="examId"
                                           ref="peopleChoose"
                                           @add-success="_updatePeopleList"></people-choose>
                        </Col>
                        <Col :span="12">
                            <people-show :id="examId"
                                         @del-people-success="_updateUserList"
                                         :editorabled="true"
                                         ref="peopleShow"></people-show>
                        </Col>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="examSettingFlag = false">关闭</Button>
                </div>
            </Modal>
            <Modal v-model="bindPaperFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>绑定试卷</span>
                </p>
                <Form :label-width="80"
                      :model="bindForm"
                      ref="bindForm"
                      :rules="examRules">
                    <FormItem label="试卷名称" prop="paperName" v-show="flag_paper">
                        <Input v-model="bindForm.paper_name" placeholder="请选择" style="width: 100%" @on-focus="changePaper" />
                    </FormItem>
                    <FormItem label="试卷名称" prop="paperName" v-show="!flag_paper">
<!--                        <Select v-model="bindForm.paperName" filterable>-->
<!--                            <div class="" v-for="(item, index) in paperList" :key="'paper-list-' + index" v-if="item.paper.length">-->
<!--                                <h4 style="padding-left: 16px;font-size: 12px;font-weight:500;color: #909399;line-height: 30px;">{{item.name}}</h4>-->
<!--                                <Option v-for="(paper, pindex) in item.paper" :value="paper.id"  :key="'paper-list-' + index + '-' + pindex" >-->
<!--                                    <div class="fs-paper-item">-->
<!--                                        <span>{{paper.name}}</span>-->
<!--                                        <span>{{paper.createbydate}}创建</span>-->
<!--                                    </div>-->
<!--                                </Option>-->
<!--                            </div>-->
<!--                        </Select>-->
                        <Select v-model="bindForm.paperName" filterable v-if="bindPaperFlag">
                            <OptionGroup :label="item.name" v-for="(item, index) in paperList" :key="'paper-list-' + index" v-if="item.paper.length">
                                <Option v-for="(paper, pindex) in item.paper" :value="paper.id"  :key="'paper-list-' + index + '-' + pindex" >
                                    <div class="fs-paper-item">
                                        <span>{{paper.name}}</span>
                                        <span>{{paper.createbydate}}创建</span>
                                    </div>
                                </Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_bindExamConfirm">
                        绑定试卷
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="bindPaperFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="checkPeopleFlag"
                   width="700"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>查看考试【{{examCheckName}}】人员</span>
                </p>
                <div class="">
                    <people-show :id="examCheckId"></people-show>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="checkPeopleFlag = false">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>
    .fs-paper-item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }
</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import peopleChoose from '../components/people-choose';
    import peopleShow from '../components/people-show';
    import moment from 'moment';
    const NOW_TIME = moment().format('YYYY-MM-DD HH:mm');
    export default {
        name: 'examinationManage',
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
                flag_paper: true,
                editorSettingFlag: false,
                bindPaperFlag: false,
                examSettingFlag: false,
                checkPeopleFlag: false,
                btnLoading: false,
                postFormType: 'update',
                examId: 0,
                examName: '',
                examCheckId: 0,
                examCheckName: '',
                bindForm: {
                    paperName: '',
                    paper_name: '',
                    examId: 0
                },
                examRules: {
                    name: [
                        {required: true, message: '考试名称不能为空!', trigger: 'blur'}
                    ]
                },
                statusList: [
                    {
                        status: 1,
                        name: '待发布'
                    },
                    {
                        status: 2,
                        name: '已发布'
                    },
                    {
                        status: 3,
                        name: '已结束'
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
                    subject: {
                        value: '',
                        type: 'select'
                    }
                },
                editorSettingData: {
                    name: '',
                    subjectExam: '',
                    startTime: NOW_TIME,
                    totalTime: 30,
                    states: 1,
                    subject1: [],
                    subject2: [],
                    subject3: [],
                    subject4: [],
                    isRandom: 0,
                    randomDuoXuanNum: 0,
                    randomDuoXuanScore: 0,
                    randomPanDuanNum: 0,
                    randomPanDuanScore: 0,
                    randomTianKongNum: 0,
                    randomTianKongScore: 0,
                    randomWenDaNum: 0,
                    randomWenDaScore: 0,
                    randomXuanZeNum: 0,
                    randomXuanZeScore: 0,
                    id: 0

                },
                paperList: [],
                subjectList: [],
                postColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '考试类型',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            let resultList = this.subjectList.filter(x => x.id === params.row.subject);
                            if (resultList.length) {
                                return h('span', resultList[0].name);
                            } else {
                                return h('span', params.row.subject);
                            }
                        }
                    },
                    {
                        title: '试卷名称',
                        key: 'papername'
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        width: 160
                    },
                    {
                        title: '考试时长',
                        key: 'totletime',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '总分',
                        key: 'totlemark',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '状态',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', this.statusList[params.row.status - 1].name);
                        }
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        fixed: 'right',
                        align: 'center',
                        width: 300,
                        render: (h, params) => {
                            let vm = this;
                            let status = params.row.status;
                            let isRandom = params.row.israndom;
                            if (status === 1) {
                                if (isRandom !== 0) {
                                    return h('div', [
                                        colBtn(vm, h, params, {content: '添加考生', icon: 'person-add', foo: vm._addQuestion}),
                                        colBtn(vm, h, params, {content: '修改考试', icon: 'compose', foo: vm._changePaperName}),
                                        colBtn(vm, h, params, {content: '发布考试', icon: 'play', foo: vm._publishPaper})
                                    ]);
                                } else {
                                    return h('div', [
                                        colBtn(vm, h, params, {content: '绑定试卷', icon: 'plus-round', foo: vm._bindPaper}),
                                        colBtn(vm, h, params, {content: '添加考生', icon: 'person-add', foo: vm._addQuestion}),
                                        colBtn(vm, h, params, {content: '修改考试', icon: 'compose', foo: vm._changePaperName}),
                                        colBtn(vm, h, params, {content: '发布考试', icon: 'play', foo: vm._publishPaper})
                                    ]);
                                }
                            } else if (status === 2) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '添加考生', icon: 'person-add', foo: vm._addQuestion}),
                                    colBtn(vm, h, params, {content: '结束考试', icon: 'stop', foo: vm._closePaper})
                                ]);
                            } else if (status === 3) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '查看考生', icon: 'eye', foo: vm._checkTestPeople}),
                                    colBtn(vm, h, params, {content: '重开考试', icon: 'arrow-return-left', foo: vm._backPaper})
                                ]);
                            }
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        watch: {
            bindPaperFlag: function (val) {
                if (!val) {
                    this.flag_paper = true;
                }
            }
        },
        created() {
            this._setTableHeight();
            this._getSubjectList();
            // this._getAllPaperList();
            this._getPingList();
            this._getGangList();
            this._getNanList();
            this._getPostList();
        },
        methods: {
            changePaper() {
                this.flag_paper = false;
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            _initEditorSettingData() {
                this.handleReset('examForm');
                this.editorSettingData.name = '';
                this.editorSettingData.subjectExam = this.subjectList[0].id;
                this.editorSettingData.startTime = NOW_TIME;
                this.editorSettingData.totalTime = 30;
                this.editorSettingData.id = 0;
                this.editorSettingData.isRandom = 0;
                this.editorSettingData.randomDuoXuanNum = 0;
                this.editorSettingData.randomDuoXuanScore = 0;
                this.editorSettingData.randomPanDuanNum = 0;
                this.editorSettingData.randomPanDuanScore = 0;
                this.editorSettingData.randomTianKongNum = 0;
                this.editorSettingData.randomTianKongScore = 0;
                this.editorSettingData.randomWenDaNum = 0;
                this.editorSettingData.randomWenDaScore = 0;
                this.editorSettingData.randomXuanZeNum = 0;
                this.editorSettingData.randomXuanZeScore = 0;
                this.editorSettingData.subject1 = [];
                this.editorSettingData.subject2 = [];
                this.editorSettingData.subject3 = [];
                this.editorSettingData.subject4 = [];
            },
            _addQuestion(data) {
                this.examId = data.id;
                this.examName = data.name;
                this.examSettingFlag = true;
            },
            _bindPaper(data) {
                console.log('data:' + data)
                this.bindForm.examId = data.id;
                this.bindForm.paperName = data.paperid || '';
                this.bindForm.paper_name = data.papername;
                this._getAllPaperList();
                this.bindPaperFlag = true;
            },
            _getPingList() {
                this.$http.get('/examquestion/question_subject_list?status=2').then((res) => {
                    if (res.success) {
                        this.pingList = res.data;
                    }
                });
            },
            _getGangList() {
                this.$http.get('/examquestion/question_subject_list?status=3').then((res) => {
                    if (res.success) {
                        this.gangList = res.data;
                    }
                });
            },
            _getNanList() {
                this.$http.get('/examquestion/question_subject_list?status=1').then((res) => {
                    if (res.success) {
                        this.nanList = res.data;
                    }
                });
            },
            _getPostList() {
                this.$http.get('/post/findByPostName').then((res) => {
                    if (res.success) {
                        this.postList = res.data;
                    }
                });
            },
            _bindExamConfirm() {
                if (!this.bindForm.paperName) {
                    this.$Message.error('绑定试卷不能为空！');
                    return;
                }
                let data = {};
                data.pid = this.bindForm.paperName;
                data.id = this.bindForm.examId;
                this.$http.post('/examtestpaper/testAddPaper', data).then((res) => {
                    if (res.success) {
                        this.bindPaperFlag = false;
                        this._updateExamList();
                    }
                });
            },
            _changePaperName(data) {
                this._initEditorSettingData();
                console.log(data);
                this.editorSettingData.name = data.name;
                this.editorSettingData.subjectExam = data.subject;
                this.editorSettingData.startTime = moment(data.starttime).format('YYYY-MM-DD HH:mm');
                this.editorSettingData.totalTime = data.totletime;
                this.editorSettingData.id = data.id;
                this.editorSettingData.isRandom = data.israndom;
                this.editorSettingData.randomDuoXuanNum = data.randomduoxuannum;
                this.editorSettingData.randomDuoXuanScore = data.randomduoxuanscore;
                this.editorSettingData.randomPanDuanNum = data.randompanduannum;
                this.editorSettingData.randomPanDuanScore = data.randompanduanscore;
                this.editorSettingData.randomTianKongNum = data.randomtiankongnum;
                this.editorSettingData.randomTianKongScore = data.randomtiankongscore;
                this.editorSettingData.randomWenDaNum = data.randomwendanum;
                this.editorSettingData.randomWenDaScore = data.randomwendascore;
                this.editorSettingData.randomXuanZeNum = data.randomxuanzenum;
                this.editorSettingData.randomXuanZeScore = data.randomxuanzescore;
                this.editorSettingData.subject1 = data.subject1 ? data.subject1.split(',').map(Number) : [];
                this.editorSettingData.subject2 = data.subject2 ? data.subject2.split(',').map(Number) : [];
                this.editorSettingData.subject3 = data.subject3 ? data.subject3.split(',').map(Number) : [];
                this.editorSettingData.subject4 = data.subject4 ? data.subject4.split(',').map(Number) : [];
                this.editorSettingFlag = true;

            },
            _publishPaper(data) {
                this.$Modal.confirm({
                    content: `确认发布【${data.name}】考试么？`,
                    okText: '确认发布',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/examtestpaper/editTestPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('考试发布成功!');
                                this._updateExamList();
                            }
                        });
                    }
                });
            },
            _closePaper(data) {
                this.$Modal.confirm({
                    content: `确认结束【${data.name}】考试么？`,
                    okText: '确认结束',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 3;
                        this.$http.post('/examtestpaper/editTestPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('结束考试成功!');
                                this._updateExamList();
                            }
                        });
                    }
                });
            },
            _backPaper(data) {
                this.$Modal.confirm({
                    content: `确认重开【${data.name}】考试么？`,
                    okText: '确认重开',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/examtestpaper/editTestPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('重开考试成功!');
                                this._updateExamList();
                            }
                        });
                    }
                });
            },
            _checkTestPeople(data) {
                this.examCheckId = data.id;
                this.examCheckName = data.name;
                this.checkPeopleFlag = true;
            },
            _addExamOpen() {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _addExam() {
                this.$refs.examForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        let editorSettingData = this.editorSettingData;
                        data.id = editorSettingData.id;
                        data.subjectExam = editorSettingData.subjectExam;
                        data.startTime = editorSettingData.startTime;
                        data.totleTime = editorSettingData.totalTime;
                        data.states = editorSettingData.states;
                        data.name = editorSettingData.name;
                        data.isRandom = editorSettingData.isRandom;
                        if(editorSettingData.isRandom !=0){
                            editorSettingData.states = 1;
                        }
                        data.randomDuoXuanNum = editorSettingData.randomDuoXuanNum;
                        data.randomDuoXuanScore = editorSettingData.randomDuoXuanScore;
                        data.randomPanDuanNum = editorSettingData.randomPanDuanNum;
                        data.randomPanDuanScore = editorSettingData.randomPanDuanScore;
                        data.randomTianKongNum = editorSettingData.randomTianKongNum;
                        data.randomTianKongScore = editorSettingData.randomTianKongScore;
                        data.randomWenDaNum = editorSettingData.randomWenDaNum;
                        data.randomWenDaScore = editorSettingData.randomWenDaScore;
                        data.randomXuanZeNum = editorSettingData.randomXuanZeNum;
                        data.randomXuanZeScore = editorSettingData.randomXuanZeScore;
                        data.subject1 = editorSettingData.subject1.join(',');
                        data.subject2 = editorSettingData.subject2.join(',');
                        data.subject3 = editorSettingData.subject3.join(',');
                        data.subject4 = editorSettingData.subject4.join(',');
                        this.$http.post('/examtestpaper/add', data).then((res) => {
                            if (res.success) {
                                this.editorSettingFlag = false;
                                this.$Message.success('操作成功!');
                                this._updateExamList();
                            }
                        });
                    }
                });
            },
            _getAllPaperList() {
                this.$http.get('/exampaper/getSubjectPaperList').then((res) => {
                    console.log('paperList: ' + res.data);
                    if (res.success) {
                        this.paperList = res.data;
                    }
                    console.log('paper: ' + this.paperList)
                });
            },
            _updatePeopleList() {
                this.$refs.peopleShow._getPeopleList();
            },
            _updateUserList() {
                this.$refs.peopleChoose._updateList();
            },
            _updateExamList() {
                this.$refs.examList.getListData();
            },
            _getSubjectList() {
                this.$http.get('/examquestion/question_subject_list?status=0').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                        this.editorSettingData.subjectExam = this.subjectList[0].id;
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
            peopleChoose,
            peopleShow
        }
    };
</script>
