<template>
    <div>
        <Card>
            <Form inline :label-width="60"  @submit.native.prevent>
                <FormItem label="试题名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试题名称"></Input>
                </FormItem>
                <FormItem label="试题分类">
                    <Select v-model="filterOpt.subject.value"
                            clearable
                            placeholder="筛选分类"
                            style="width: 160px">
                        <Option :value="item.id" v-for="(item, index) in subjectList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="试题类型">
                    <Select v-model="filterOpt.type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 160px">
                        <Option :value="item.value" v-for="(item, index) in typeOptMap" :key="index">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="ghost" @click="_addQuestionOpen">
                            <Icon type="plus-round"></Icon>
                            添加试题
                        </Button>
                    </ButtonGroup>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="success"
                                @click="_openUploadModel">
                            <Icon type="ios-cloud-upload-outline"></Icon>
                            批量上传
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="tablePage"
                           url="/examquestion/getQuestionList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{postFormType === 'add' ? '添加' : '修改'}}试题</span>
                </p>
                <Form :label-width="60">
                    <FormItem label="试题名称">
                        <Input type="textarea"
                               :autosize="{minRows: 2,maxRows: 4}"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="试题图片">
                        <fs-img-upload action="/oa/examquestion/uploadfile"
                                       path="/oa/upload/exam/"
                                       ref="imgUploadFo"
                                       :upload.sync="editorSettingData.questionPic"></fs-img-upload>
                    </FormItem>
                    <Row :gutter="16">
                        <Col :span="8">
                            <FormItem label="试题分类">
                                <Select v-model="editorSettingData.subject">
                                    <Option :value="item.id" v-for="(item, index) in subjectList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="试题类型">
                                <Select v-model="editorSettingData.type">
                                    <Option :value="item.value" v-for="(item, index) in typeOptMap" :key="index">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="试题分数">
                                <InputNumber :min="0" v-model="editorSettingData.mark"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="16">
                        <Col :span="12">
                            <FormItem label="试题平台">
                                <Select v-model="editorSettingData.subject1" multiple>
                                    <Option :value="item.id" v-for="(item, index) in pingList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="12">
                            <FormItem label="知识点">
                                <Select v-model="editorSettingData.subject4" multiple>
                                    <Option :value="item.id" v-for="(item, index) in gangList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="12">
                            <FormItem label="考试类型">
                                <Select v-model="editorSettingData.subject3" multiple>
                                    <Option :value="item.id" v-for="(item, index) in nanList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="12">
                            <FormItem label="岗位">
                                <Select v-model="editorSettingData.subject2" multiple filterable>
                                    <Option :value="item.id" v-for="(item, index) in postList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="答案选项" v-show="['1', '2'].indexOf(editorSettingData.type) > -1">
                        <Table :columns="answerColumns"
                               disabled-hover
                               :data="editorSettingData.questionList"></Table>
                        <div class="" style="margin-top: 8px;text-align: right">
                            <Button type="ghost"
                                    shape="circle"
                                    @click="_addNewAnswer"
                                    icon="plus-round">新增选项</Button>
                        </div>
                    </FormItem>
                    <FormItem label="试题答案">
                        <RadioGroup v-model="editorSettingData.singleType"
                                    v-show="editorSettingData.type === '1'">
                            <Radio :label="index | indexToBigCode"
                                   v-for="(item, index) in editorSettingData.questionList"
                                   :key="index">{{index | indexToBigCode}}</Radio>
                        </RadioGroup>
                        <CheckboxGroup v-model="editorSettingData.multiType"
                                       v-show="editorSettingData.type === '2'">
                            <Checkbox :label="index | indexToBigCode"
                                      v-for="(item, index) in editorSettingData.questionList"
                                      :key="index"></Checkbox>
                        </CheckboxGroup>
                        <RadioGroup v-model="editorSettingData.trueOrFalseType"
                                    v-show="editorSettingData.type === '3'">
                            <Radio label="正确">正确</Radio>
                            <Radio label="错误">错误</Radio>
                        </RadioGroup>
                        <div class="" v-show="editorSettingData.type === '4'">
                            <InputNumber :min="0" v-model="editorSettingData.fillNumber"></InputNumber><span style="margin-left: 8px;">个空</span>
                            <Row :gutter="8" style="margin-top: 16px">
                                <Col :span="6"
                                     style="margin-bottom: 8px;"
                                     v-for="(item, index) in editorSettingData.fillType"
                                     :key="index">
                                    <Input type="text" v-model.trim="item.content"></Input>
                                </Col>
                            </Row>
                        </div>
                        <Input type="textarea"
                               v-show="editorSettingData.type === '5'"
                               v-model="editorSettingData.questionType"
                               :autosize="{minRows: 2,maxRows: 4}"
                               placeholder="得分关键字"></Input>
                    </FormItem>
                    <FormItem label="试题解析">
                        <Input type="textarea"
                               :autosize="{minRows: 2,maxRows: 4}"
                               v-model="editorSettingData.desc"
                               placeholder=""></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_addQuestionConfirm">
                        {{postFormType === 'add' ? '添加' : '修改'}}试题
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
        <Modal v-model="importModalFlag"
               width="400"
               top="250"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>批量上传试题</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadGradeMuban">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button>
            <Upload type="drag"
                    :show-upload-list="false"
                    :on-progress="_uploadProgress"
                    :on-format-error="_uploadFormatErr"
                    :on-success="_uploadSuccess"
                    :format="uploadFormat"
                    action="/oa/examquestion/import_question">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-show="spinShow">试题上传中...</Spin>
            </Upload>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    import utils from '@/libs/util';
    export default {
        name: 'questionManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                importModalFlag: false,
                postFormType: 'add',
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    subject: {
                        value: '',
                        type: 'select'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    }
                },
                answerColumns: [
                    {
                        title: '序号',
                        key: 'order',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            return h('span', String.fromCharCode(params.row._index + 65));
                        }
                    },
                    {
                        title: '答案内容',
                        key: 'answerContent',
                        render: (h, params) => {
                            let currentNow = this.editorSettingData.questionList[params.index];
                            return h('Row', {
                                props: {
                                    type: 'flex',
                                    align: 'middle'
                                }
                            }, [
                                h('Col', {
                                    props: {
                                        span: '22'
                                    }
                                }, [
                                    params.row.editorNow ? h('Input', {
                                        props: {
                                            type: 'textarea',
                                            autosize: {minRows: 2, maxRows: 4},
                                            value: params.row.answerContent
                                        },
                                        on: {
                                            'on-change' (event) {
                                                params.row.answerContent = event.target.value;
                                            }
                                        }
                                    }) : h('p', {
                                        style: {
                                            lineHeight: '1.5'
                                        }
                                    }, params.row.answerContent)
                                ]),
                                h('Col', {
                                    props: {
                                        span: '2'
                                    }
                                }, [
                                    params.row.editorNow ? h('Button', {
                                        props: {
                                            type: 'text',
                                            icon: 'checkmark'
                                        },
                                        on: {
                                            click: () => {
                                                currentNow.editorNow = false;
                                                currentNow.answerContent = params.row.answerContent;
                                            }
                                        }
                                    }) : h('Button', {
                                        props: {
                                            type: 'text',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                currentNow.editorNow = true;
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    },
                    {
                        title: '图片',
                        align: 'center',
                        width: 98,
                        render: (h, params) => {
                            let currentNow = this.editorSettingData.questionList[params.index];
                            return h('div', {
                                style: {
                                    padding: '8px 0'
                                }
                            }, [
                                h(fsImgUpload, {
                                    props: {
                                        path: '/oa/upload/exam/',
                                        action: '/oa/examquestion/uploadfile',
                                        upload: params.row.pic
                                    },
                                    on: {
                                        'update'(val) {
                                            currentNow.pic = val;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '删除',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            icon: 'trash-a',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._removeAnswerList(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                questionId: 0,
                editorSettingData: {
                    name: '',
                    questionPic: [],
                    type: '1',
                    subject: '',
                    subject1: [],
                    subject2: [],
                    subject3: [],
                    subject4: [],
                    mark: 0,
                    singleType: '',
                    multiType: [],
                    trueOrFalseType: '',
                    questionType: '',
                    fillNumber: 0,
                    fillType: [],
                    questionList: [
                        {
                            answerContent: '',
                            pic: [],
                            editorNow: false
                        }
                    ],
                    desc: '',
                    answer: ''
                },
                postColumns: [
                    {
                        title: '试题名称',
                        key: 'name'
                    },
                    {
                        title: '试题类型',
                        key: 'user_name',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', this.typeOptMap[params.row.type - 1].label);
                        }
                    },
                    {
                        title: '试题分类',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', (this.subjectList.filter(x => x.id === params.row.subject))[0].name);
                        }
                    },
                    {
                        title: '试题分数',
                        key: 'questionmark',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改试题',
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
                                            click: function () {
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                typeOptMap: [
                    {
                        value: '1',
                        label: '单选题'
                    },
                    {
                        value: '2',
                        label: '多选题'
                    },
                    {
                        value: '3',
                        label: '判断题'
                    },
                    {
                        value: '4',
                        label: '填空题'
                    },
                    {
                        value: '5',
                        label: '问答题'
                    }
                ],
                subjectList: [],
                pingList: [],
                gangList: [],
                nanList: [],
                postList: [],
                tableHeight: 300,
                timer: null
            };
        },
        watch: {
            'editorSettingData.fillNumber'(val) {
                let arr = [];
                for (let i = 0, length = val; i < length; i++) {
                    let obj = {};
                    obj.content = '';
                    arr.push(obj);
                }
                this.editorSettingData.fillType = arr;
            }
        },
        created() {
            this._getSubjectList();
            this._getPingList();
            this._getGangList();
            this._getNanList();
            this._getPostList();
            this._setTableHeight();
        },
        filters: {
            indexToBigCode(val) {
                return String.fromCharCode(val + 65);
            }
        },
        methods: {
            _retuenSendPicUrl(url) {
                let reg = /^\/upload\/exam/;
                if (reg.test(url)) {
                    return url;
                } else {
                    return '/upload/exam/' + url;
                }
            },
            _addQuestionConfirm() {
                let editorSettingData = this.editorSettingData;
                let data = {};
                if (this.postFormType === 'update') {
                    data.id = this.questionId;
                }
                data.name = editorSettingData.name;
                data.questionPic = '';
                if (editorSettingData.questionPic[0]) {
                    data.questionPic = this._retuenSendPicUrl(editorSettingData.questionPic[0].name);
                }
                data.subject = editorSettingData.subject;
                data.subject1 = editorSettingData.subject1.join(',');
                data.subject2 = editorSettingData.subject2.join(',');
                data.subject3 = editorSettingData.subject3.join(',');
                data.subject4 = editorSettingData.subject4.join(',');
                data.type = editorSettingData.type;
                data.questionMark = editorSettingData.mark;
                if (['1', '2'].indexOf(data.type) > -1) {
                    let questionList = [];
                    editorSettingData.questionList.forEach((item, index) => {
                        let obj = {};
                        obj.order = String.fromCharCode(index + 65);
                        obj.content = item.answerContent;
                        obj.pic = '';
                        if (item.pic[0]) {
                            obj.pic = this._retuenSendPicUrl(item.pic[0].name);
                        }
                        questionList.push(obj);
                    });
                    data.questionList = JSON.stringify(questionList);
                }
                switch (data.type) {
                    case '1':
                        data.answer = editorSettingData.singleType;
                        break;
                    case '2':
                        data.answer = editorSettingData.multiType.sort().join('');
                        break;
                    case '3':
                        data.answer = editorSettingData.trueOrFalseType;
                        break;
                    case '4':
                        data.answer = editorSettingData.fillType.map(x => x.content).join(',');
                        break;
                    case '5':
                        data.answer = editorSettingData.questionType;
                }
                data.analysis = editorSettingData.desc;
                this.$http.post('/examquestion/addOptions', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this.editorSettingFlag = false;
                        this.$refs.tablePage.getListData();
                    }
                });
            },
            _addQuestionOpen() {
                this.postFormType = 'add';
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _addNewAnswer() {
                let obj = {};
                obj.answerContent = '';
                obj.pic = [];
                obj.editorNow = false;
                this.editorSettingData.questionList.push(obj);
            },
            _initEditorSettingData() {
                let editorSettingData = this.editorSettingData;
                editorSettingData.name = '';
                editorSettingData.questionPic = [];
                this.$refs.imgUploadFo.removeAllPicFlie();
                editorSettingData.type = '1';
                editorSettingData.subject = this.subjectList[0].id;
                editorSettingData.subject1 = [];
                editorSettingData.subject2 = [];
                editorSettingData.subject3 = [];
                editorSettingData.subject4 = [];
                editorSettingData.mark = 0;
                editorSettingData.singleType = '';
                editorSettingData.multiType = [];
                editorSettingData.trueOrFalseType = '';
                editorSettingData.questionType = '';
                editorSettingData.fillNumber = 0;
                editorSettingData.questionList = [
                    {
                        answerContent: '',
                        pic: [],
                        editorNow: false
                    }
                ];
                editorSettingData.desc = '';
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _removeAnswerList(data) {
                let questionList = this.editorSettingData.questionList;
                if (questionList.length === 1) {
                    this.$Message.error('答案选项至少一个!');
                    return;
                }
                this.editorSettingData.singleType = '';
                this.editorSettingData.multiType = [];
                this.editorSettingData.questionList.splice(data._index, 1);
            },
            _editorSetting(data) {
                this.questionId = data.id;
                this.postFormType = 'update';
                this._initEditorSettingData();
                let editorSettingData = this.editorSettingData;
                editorSettingData.name = data.name;
                editorSettingData.subject = data.subject;
                editorSettingData.subject1 = data.subject1 ? data.subject1.split(',').map(Number) : [];
                editorSettingData.subject2 = data.subject2 ? data.subject2.split(',').map(Number) : [];
                editorSettingData.subject3 = data.subject3 ? data.subject3.split(',').map(Number) : [];
                editorSettingData.subject4 = data.subject4 ? data.subject4.split(',').map(Number) : [];

                console.log(editorSettingData);
                editorSettingData.type = data.type + '';
                editorSettingData.mark = data.questionmark;
                editorSettingData.desc = data.analysis;
                if (data.questionpic) {
                    editorSettingData.questionPic = [{url: '/oa' + data.questionpic, name: data.questionpic, status: 'finished'}];
                }
                if (['1', '2'].indexOf(editorSettingData.type) > -1) {
                    if (data.options.length) {
                        let questionList = [];
                        data.options.forEach(item => {
                            let obj = {};
                            obj.answerContent = item.content;
                            obj.editorNow = false;
                            obj.pic = [];
                            if (item.optionpic) {
                                obj.pic = [{url: '/oa' + item.optionpic, name: item.optionpic, status: 'finished'}];
                            }
                            questionList.push(obj);
                        });
                        editorSettingData.questionList = questionList;
                    }
                }
                switch (editorSettingData.type) {
                    case '1':
                        editorSettingData.singleType = data.answer;
                        break;
                    case '2':
                        editorSettingData.multiType = data.answer.split('');
                        break;
                    case '3':
                        editorSettingData.trueOrFalseType = data.answer;
                        break;
                    case '4':
                        let fillArr = data.answer.split(',');
                        editorSettingData.fillNumber = fillArr.length;
                        let cc = setInterval(function() {
                            if (editorSettingData.fillNumber === editorSettingData.fillType.length) {
                                editorSettingData.fillType.forEach((item, index) => {
                                    item.content = fillArr[index];
                                });
                                clearInterval(cc);
                            }
                        }, 10);
                        break;
                    case '5':
                        editorSettingData.questionType = data.answer;
                }
                this.editorSettingFlag = true;
            },
            _getSubjectList() {
                this.$http.get('/examquestion/question_subject_list?status=0').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                    }
                });
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
            // 批量上传试题
            _openUploadModel() {
                this.importModalFlag = true;
            },
            _downloadGradeMuban() {
                utils.downloadFile('/oa/down/question_model.xls', '批量上传试题模板.xls');
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('批量上传成功!');
                    this.importModalFlag = false;
                    this.$refs.tablePage.getListData();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            }
        },
        components: {
            fsTablePage,
            fsImgUpload
        }
    };
</script>
