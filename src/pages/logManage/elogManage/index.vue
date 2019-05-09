<template>
    <div>
        <Row :gutter="6">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
                <Card class="no-write" style="margin-top: 6px">
                    <h3>昨日没写日志人员</h3>
                    <ul style="margin-top: 8px;">
                        <li v-for="item in noWritePeople" :key="'people-' + item.id">{{item.name}}</li>
                    </ul>
                </Card>
                <Card class="no-write" style="margin-top: 6px">
                    <h3>日志未指导人员</h3>
                    <ul style="margin-top: 8px;">
                        <li v-for="item in noGuidePeople" :key="'people-' + item.id">{{item.name}}</li>
                    </ul>
                </Card>
            </Col>
            <Col :span="20">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text"
                                   clearable
                                   v-model="searchData.userName.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem prop="startDate" label="开始日期">
                            <DatePicker type="date"
                                        @on-change="searchData.startDate.value = $event"
                                        placeholder="开始日期"
                                        :value="searchData.startDate.value"></DatePicker>
                        </FormItem>
                        <FormItem prop="endDate" label="结束日期">
                            <DatePicker type="date"
                                        @on-change="searchData.endDate.value = $event"
                                        placeholder="结束日期"
                                        :value="searchData.endDate.value"></DatePicker>
                        </FormItem>
                        <FormItem label="指导状态">
                            <Select v-model="searchData.states.value"
                                    clearable>
                                <Option value="1">已指导</Option>
                                <Option value="0">未指导</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="评级结果">
                            <Select v-model="searchData.resultType.value"
                                    clearable>
                                <Option value="1">优秀</Option>
                                <Option value="2">合格</Option>
                                <Option value="3">不合格</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="日志类型">
                            <Select v-model="searchData.type.value"
                                    clearable>
                                <Option value="1">休息</Option>
                                <Option value="0">出勤</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="columns1"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="searchData"
                                   ref="fsTable"
                                   url="/journal/maglist"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="checkLogFlag"
               :mask-closable="false"
               width="1200">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>({{organizeLoop}}) {{logModalData.name + ' ' + logModalData.date}}日志</span>
            </p>
            <div id="check-log-modal-content">
                <Row :gutter="24">
                    <Col :span="16">
                        <h3>日志内容</h3>
                        <div class="w-e-text" style="margin-top: 16px;overflow: auto;"
                             v-html="logModalData.content"></div>
                    </Col>
                    <Col :span="8">
                        <h3>上级指导</h3>
                        <div class="log-guider-wrapper">
                            <transition name="down">
                                <div class="log-reply-block" v-show="canReply">
                                    <Input type="textarea"
                                           ref="replyTextarea"
                                           v-model="replyData.content"></Input>
                                    <Button type="primary" style="margin-top: 16px" @click="confirmReply">回复</Button>
                                    <Button style="margin-top: 16px;margin-left: 16px" @click="canReply = false">取消
                                    </Button>
                                </div>
                            </transition>
                            <div class="each-guide" v-for="item in upGuider" :key="'guide-' + item.id"
                                 v-if="!!upGuider.length">
                                <div class="guide-detail">
                                    <span class="name">{{item.guider}}:</span>
                                    <span class="content">{{item.content}}</span>
                                    <span class="reply" @click="_replyUp(item)">回复</span>
                                </div>
                                <ul class="child-guide" v-if="item.childguide">
                                    <li class="child-guide-item guide-detail" v-for="child in item.childguide"
                                        :key="'guide-' + child.id">
                                        <span class="name">{{child.guider}}</span>
                                        <span style="margin: 0 2px">回复</span>
                                        <span class="name">{{child.tousername}}:</span>
                                        <span class="content">{{child.content}}</span>
                                        <span class="reply" @click="_replyUp(child, item.id)">回复</span>
                                        <span class="del" @click="_delReply(child)" v-if="child.states === 1">删除</span>
                                    </li>
                                </ul>
                            </div>
                            <p v-else>暂无指导</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Form :model="commentData"
                      style="text-align: left"
                      :rules="commentRules"
                      ref="commentForm"
                      :label-width="60">
                    <FormItem label="指导" prop="advice">
                        <Input v-model.trim="commentData.advice"
                               type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="指导建议..."></Input>
                    </FormItem>
                    <FormItem label="评价" prop="result">
                        <Select v-model="commentData.result" style="width: 80px;">
                            <Option value="1">优秀</Option>
                            <Option value="2">合格</Option>
                            <Option value="3">不合格</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="_submitComment">提交评价</Button>
                        <Button type="ghost" @click="checkLogFlag = false">关闭</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    .log-reply-block {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        width: 100%;
        background-color: #eee;
        padding: 16px;
    }

    .each-guide {
        margin-top: 8px;

        .child-guide {
            margin-left: 32px;
            padding-left: 12px;
            border-left: 2px solid #999;
            margin-top: 12px;
        }

        .guide-detail {
            &:hover > .reply,
            &:hover > .del {
                display: inline-block;
            }

            & > .reply,
            & > .del {
                display: none;
            }

            .reply {
                margin-left: 8px;
                cursor: pointer;
                color: #2d8cf0;
            }

            .del {
                color: #dc0707;
                margin-left: 4px;
                cursor: pointer;
            }

            .name {
                font-weight: 700;
            }

            .content {
                margin-left: 4px;
            }
        }
    }

    #check-log-modal-content {
        font-size: 14px;

        .log-guider-wrapper {
            position: relative;
            margin-top: 16px;
            overflow: hidden;
            min-height: 200px;

            .log-guider-list {
                .log-guider-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import utils from '@/libs/util';
    import moment from 'moment';

    export default {
        name: 'elogManage',
        watch: {
            userName(val) {
                if (val === 'sun') {
                    this.this._getNoWritePeoloe();
                }
            }
        },
        data() {
            const validateContentLength = (rule, value, callback) => {
                if (value.length < 2) {
                    callback(new Error('指导内容不能少于两个字！'));
                } else {
                    callback();
                }
            };
            return {
                tableLoading: false,
                checkLogFlag: false,
                canReply: false,
                organizeLoop: '',
                storeData: {},
                commentData: {
                    advice: '',
                    result: '2'
                },
                commentRules: {
                    advice: [
                        {required: true, message: '评语不能为空！', trigger: 'blur'},
                        {validator: validateContentLength, trigger: 'blur'}
                    ],
                    result: [
                        {required: true, message: '评价不能为空！', trigger: 'change'}
                    ]
                },
                upGuider: [],
                logModalData: {
                    name: '',
                    content: '',
                    date: '',
                    id: ''
                },
                searchData: {
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    startDate: {
                        value: '',
                        type: 'date'
                    },
                    endDate: {
                        value: '',
                        type: 'date'
                    },
                    states: {
                        value: '',
                        type: 'select'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    },
                    organizeId: {
                        value: '',
                        type: 'tree'
                    },
                    resultType: {
                        value: '',
                        type: 'select'
                    }
                },
                columns1: [
                    {
                        title: '员工姓名',
                        key: 'username',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '提交日期',
                        key: 'writedate',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '日志内容',
                        key: 'content',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', utils.delHtmlTag(params.row.content));
                        }
                    },
                    {
                        title: '指导状态',
                        key: 'states',
                        align: 'center',
                        width: 110,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '已指导' : '未指导');
                        }
                    },
                    {
                        title: '评级结果',
                        key: 'level',
                        align: 'center',
                        width: 110,
                        render: (h, params) => {
                            let bgColor = '';
                            let content = '';
                            switch (params.row.level) {
                                case 0:
                                    bgColor = 'default';
                                    content = '未评价';
                                    break;
                                case 1:
                                    bgColor = 'green';
                                    content = '优秀';
                                    break;
                                case 2:
                                    bgColor = 'green';
                                    content = '合格';
                                    break;
                                case 3:
                                    bgColor = 'red';
                                    content = '不合格';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: bgColor
                                }
                            }, content);
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'eye',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '查看'
                                    },
                                    on: {
                                        click: function () {
                                            vm._checkLogOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                tableHeight: 300,
                noWritePeople: [],
                noGuidePeople: [],
                userName: this.$store.state.user.userInfo.username,
                preContent: '',
                logIdObjId: 0,
                replyData: {
                    id: null,
                    toUserId: null,
                    guildId: null,
                    content: '',
                    guiderName: ''
                }
            };
        },
        created() {
            this._setTableHeight();
            this._getNoWritePeoloe();
        },
        filters: {
            dateFormatter(val) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        methods: {
            _delReply(child) {
                let id = child.id
                this.$http.post('/journal/deleteGuide', {id}).then((res) => {
                    if (res.success) {
                        this._checkLogOpen(this.storeData)
                    }
                })
            },
            _replyUp(item, id = 0) {
                let replyData = this.replyData
                this.preContent = `回复 ${item.guider}:`
                replyData.id = item.journalid
                replyData.toUserId = item.guiderid
                if (id !== 0) {
                    replyData.guildId = id
                } else {
                    replyData.guildId = item.id
                }
                replyData.guiderName = item.guider
                replyData.content = this.preContent
                this.canReply = true
                setTimeout(() => {
                    this.$refs.replyTextarea.focus()
                }, 20)
            },
            confirmReply() {
                let sendData = {}
                let replyData = this.replyData
                sendData.id = replyData.id
                sendData.toUserId = replyData.toUserId
                sendData.guildId = replyData.guildId
                sendData.content = replyData.content.replace(this.preContent, '')
                this.$http.post('/journal/addGuide', sendData).then((res) => {
                    if (res.success) {
                        this.canReply = false
                        this._checkLogOpen(this.storeData)
                    }
                })
            },
            _getNoWritePeoloe() {
                this.$http.get('/journal/getNoWriteAll').then((res) => {
                    if (res.success) {
                        this.noWritePeople = res.data.filter(x => x.states === 0)
                        this.noGuidePeople = res.data.filter(x => x.states === 1)
                    }
                });
            },
            _nodeChangeHandler(node) {
                this.searchData.organizeId.value = node.id;
            },
            _initCommentData() {
                this.commentData.advice = '';
                this.commentData.result = '2';
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _checkLogOpen(data) {
                this.storeData = {...data}
                this.upGuider = [];
                this.logModalData.date = data.writedate;
                this.logModalData.name = data.username;
                this.logModalData.content = data.content;
                this.logModalData.id = data.id;
                this._getUpGuiderData();
                this.$refs.commentForm.resetFields();
                this._initCommentData();
                this.checkLogFlag = true;
            },
            _getUpGuiderData() {
                let data = {
                    id: this.logModalData.id
                };
                this.$http.get('/journal/guideJson', {params: data}).then((res) => {
                    if (res.success) {
                        this.upGuider = res.data.guides;
                        this.organizeLoop = res.data.organize || '';
                    }
                });
            },
            _submitComment() {
                this.$refs.commentForm.validate((val) => {
                    if (val) {
                        let data = {};
                        data.content = this.commentData.advice;
                        data.type = this.commentData.result;
                        data.id = this.logModalData.id;
                        this.$http.post('/journal/addGuide', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('评价成功!');
                                this.$refs.fsTable.getListData();
                                this._getNoWritePeoloe();
                                this.checkLogFlag = false;
                            }
                        });
                    }
                });
            }
        },
        components: {
            fsDepTree,
            fsTablePage
        }
    };
</script>
