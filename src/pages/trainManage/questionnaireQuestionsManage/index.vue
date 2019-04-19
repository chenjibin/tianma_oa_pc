<template>
    <div>
        <Card>
            <Form inline :label-width="60" @submit.native.prevent>
                <FormItem label="试题名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试题名称"></Input>
                </FormItem>
                <FormItem label="试题类型">
                    <Select  v-model="filterOpt.type.value" clearable
                             placeholder="筛选类型" style="width: 100px">
                        <Option :value="1">单选题</Option>
                        <Option :value="5">问答题</Option>
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
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="tablePage"
                           url="/questionnairequest/getQuestionList"></fs-table-page>
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
                    <Row :gutter="16">
                        <Col :span="8">
                        <FormItem label="试题类型">
                            <Select v-model="editorSettingData.type">
                                <Option :value="item.value" v-for="(item, index) in typeOptMap" :key="index">
                                    {{item.label}}
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col :span="8">
                        <FormItem label="满分">
                            <InputNumber type="InputNumber"
                                         v-model="editorSettingData.mark"
                                         placeholder=""></InputNumber>
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
                                    icon="plus-round">新增选项
                            </Button>
                        </div>
                    </FormItem>
                    <!--<FormItem label="试题答案">-->
                    <!--<Input type="textarea"-->
                    <!--v-show="editorSettingData.type === '5'"-->
                    <!--v-model="editorSettingData.questionType"-->
                    <!--:autosize="{minRows: 2,maxRows: 4}"-->
                    <!--placeholder="得分关键字"></Input>-->
                    <!--</FormItem>-->
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
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';

    export default {
        name: 'questionnaireManage',
        data() {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                xx: '123a',
                postFormType: 'add',
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
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
                                            'on-change'(event) {
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
                    }, {
                        title: '分数',
                        key: 'score',
                        align: 'center',
                        width: 98,
                        render: (h, params) => {
                            var vm = this;
                            return h('InputNumber', {
                                props: {
                                    value: !params.row.score ? 0 : params.row.score,
                                    max: 100,
                                    min: 0,
                                    precision: 1,
                                    step: 0.5
                                },
                                on: {
                                    'on-change': (value) => {
                                        params.row.score = value;
                                        vm.editorSettingData.questionList[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    }, {
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
                                                console.log(vm.xx);
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
                            score: 0,
                            editorNow: false
                        }
                    ],
                    desc: '',
                    type: '1',
                    answer: ''
                },
                postColumns: [
                    {
                        title: '试题名称',
                        key: 'name'
                        // align: 'center'
                    },
                    {
                        title: '试题类型',
                        key: 'type',
                        align: 'center',
                        render: (h, params) => {
                            let test = '';
                            if (1 === params.row.type) {
                                test = '单选题';
                            } else if (5 === params.row.type) {
                                test = '问答题';
                            }
                            return h('span', test);
                        }
                    },
                    {
                        title: '满分',
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
                        value: '5',
                        label: '问答题'
                    }
                ],

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
            this._setTableHeight();
        },
        filters: {
            indexToBigCode(val) {
                return String.fromCharCode(val + 65);
            }
        },
        methods: {
            _addQuestionConfirm() {
                let editorSettingData = this.editorSettingData;
                let data = {};
                if (this.postFormType === 'update') {
                    data.id = this.questionId;
                }
                data.name = editorSettingData.name;
                data.type = editorSettingData.type;
                data.questionMark = editorSettingData.mark;
                if (['1'].indexOf(data.type) > -1) {
                    let questionList = [];
                    editorSettingData.questionList.forEach((item, index) => {
                        let obj = {};
                        obj.order = String.fromCharCode(index + 65);
                        obj.content = item.answerContent;
                        obj.score = item.score;
                        questionList.push(obj);
                    });
                    data.questionList = JSON.stringify(questionList);
                }
                switch (data.type) {
                    case '1':
                        data.answer = editorSettingData.singleType;
                        break;
                    case '5':
                        data.answer = editorSettingData.questionType;
                }
                data.analysis = editorSettingData.desc;
                this.$http.post('/questionnairequest/addOptions', data).then((res) => {
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
                obj.score = 0;
                obj.editorNow = false;
                this.editorSettingData.questionList.push(obj);
            },
            _initEditorSettingData() {
                let editorSettingData = this.editorSettingData;
                editorSettingData.name = '';
                editorSettingData.mark = 0;
                editorSettingData.singleType = '';
                editorSettingData.multiType = [];
                editorSettingData.type = '1';
                editorSettingData.trueOrFalseType = '';
                editorSettingData.questionType = '';
                editorSettingData.fillNumber = 0;
                editorSettingData.questionList = [
                    {
                        answerContent: '',
                        score: '',
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
                console.log(data);
                this.questionId = data.id;
                this.postFormType = 'update';
                this._initEditorSettingData();
                let editorSettingData = this.editorSettingData;
                editorSettingData.name = data.name;
                editorSettingData.type = data.type + '';
                editorSettingData.mark = data.questionmark;

                if (['1', '2'].indexOf(editorSettingData.type) > -1) {
                    if (data.options.length) {
                        let questionList = [];
                        data.options.forEach(item => {
                            let obj = {};
                            obj.answerContent = item.content;
                            obj.score = item.score;
                            obj.editorNow = false;
                            questionList.push(obj);
                        });
                        editorSettingData.questionList = questionList;
                    }
                }

                this.editorSettingFlag = true;
            }
        },
        components: {
            fsTablePage,
            fsImgUpload
        }
    };
</script>
