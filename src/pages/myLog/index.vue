<template>
    <div id="my-log">
        <Row :gutter="10">
            <Col :lg="14" :md="14">
            <Card style="margin-bottom: 10px;">
                <Row type="flex" justify="center" align="middle" style="margin-bottom: 10px">
                        <span style="font-size: 18px;cursor: pointer;">
                            <Button type="primary"
                                    shape="circle"
                                    @click.stop="_preMonth"
                                    :disabled="btnDisabled"
                                    icon="chevron-left"></Button>
                        </span>
                    <DatePicker
                        :open="datePickerFlag"
                        :value="dateData"
                        size="large"
                        @on-change="_dateChange"
                        type="month">
                        <span style="padding:0 16px;font-size: 18px;cursor: pointer;"
                              @click="datePickerFlag = !datePickerFlag">{{dateData}}</span>
                    </DatePicker>
                    <span style="font-size: 18px;cursor: pointer;">
                             <Button type="primary"
                                     @click.stop="_nextMonth"
                                     shape="circle"
                                     :disabled="btnDisabled"
                                     icon="chevron-right"></Button>
                        </span>
                </Row>
                <Table :columns="columnsData"
                       :data="tableData"
                       :loading="loading"
                       :row-class-name="_rowClassName"
                       :disabled-hover="true"></Table>
                <Modal v-model="modelFlag"
                       width="740"
                       :mask-closable="false">
                    <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                        <span>{{logDetail.date}} 日志</span>
                    </p>
                    <div class="" v-if="modelFlag">
                        <div class="w-e-text" style="min-height: 100px;font-size: 16px;overflow:auto;"
                             v-html="editorContent"
                             v-show="[5,6].indexOf(logDetail.type) > -1 && nowDate !== logDetail.date"></div>
                        <div class="" style="font-size: 14px;"
                             v-show="[5,6].indexOf(logDetail.type) > -1 && nowDate !== logDetail.date">
                            <div class="guider-block" v-if="upguiders && upguiders.length">
                                <h4>上级指导:</h4>
                                <div class="each-guide" v-for="item in upguiders" :key="'guide-' + item.id">
                                    <div class="guide-detail">
                                        <span class="name">{{item.guider}}:</span>
                                        <span class="content">{{item.content}}</span>
                                        <!--<span class="reply" @click="_replyUp(item)">回复</span>-->
                                    </div>
                                    <ul class="child-guide" v-if="item.childguide">
                                        <li class="child-guide-item guide-detail" v-for="child in item.childguide" :key="'guide-' + child.id">
                                            <span class="name">{{child.guider}}</span>
                                            <span style="margin: 0 2px">回复</span>
                                            <span class="name">{{child.tousername}}:</span>
                                            <span class="content">{{child.content}}</span>
                                            <!--<span class="reply" @click="_replyUp(child, item.id)">回复</span>-->
                                            <!--<span class="del" @click="_delReply(child)" v-if="child.states === 1">删除</span>-->
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="guider-block" v-if="upchecks && upchecks.length">
                                <h4>备注:</h4>
                                <ul class="guider-list">
                                    <li class="guider-item" v-for="item in upchecks" :key="'checks-' + item.id"
                                        style="position: relative;left: -6px;">
                                        <span class="guider-name" style="width: auto">【{{item.content}}】</span><span>{{item.addtime}} 查看了你的日志</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="[0,1,2,3].indexOf(logDetail.type) > -1 || nowDate === logDetail.date">
                            <span
                                style="display: inline-block;margin-right: 10px;height: 30px;line-height: 30px;vertical-align: top;">日志类型</span>
                            <Select v-model="logDetail.logType"
                                    placeholder="日志类型"
                                    transfer
                                    style="margin-bottom: 10px;width:200px">
                                <Option v-for="item in logTypeList"
                                        :value="item.value"
                                        :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                            <wang-editor
                                :menus="editorMeun"
                                :editorcontent.sync="editorContent"
                                :defaul-text="'日志内容...'"
                                img-url="/oa/share/uploadFile"></wang-editor>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="" v-if="[0,1,2,3].indexOf(logDetail.type) > -1 || nowDate === logDetail.date">
                            <Button type="primary" :loading="submitLoading" @click="_submitLog">
                                <span v-if="!submitLoading">提交日志</span>
                                <span v-else>提交中...</span>
                            </Button>
                        </div>
                        <div class="" v-if="[5,6].indexOf(logDetail.type) > -1  && nowDate !== logDetail.date">
                            <span>指导状态:</span>
                            <Tag color="green">已指导</Tag>
                            <span>类型:</span>
                            <Tag color="blue">{{logDetail.logType1 | _returnLogType}}</Tag>
                            <span>评级结果:</span>
                            <Tag color="blue">{{logDetail.commentResult | _returnCommentResult}}</Tag>
                        </div>
                    </div>
                </Modal>
            </Card>
            </Col>
            <Col :lg="10" :md="10">
            <Card>
                <Spin fix v-show="loading"></Spin>
                <p class="log-title">{{dateData}} 日志概览</p>
                <transition name="down">
                    <div class="log-reply-block" v-show="canReply">
                        <Input type="textarea"
                               ref="replyTextarea"
                               v-model="replyData.content"></Input>
                        <Button type="primary" style="margin-top: 16px" @click="confirmReply">回复</Button>
                        <Button style="margin-top: 16px;margin-left: 16px" @click="canReply = false">取消</Button>
                    </div>
                </transition>
                <div class="each-log-wrapper w-e-text" :style="{maxHeight: logMaxHeight}">
                    <div class="each-log-look" v-for="item in logLookList" :key="item.date">
                        <p class="time-title">{{item.date}}</p>
                        <div class="" v-html="item.content"></div>
                        <div class="guider-block" v-if="item.guide && item.guide.length">
                            <h4>上级指导:</h4>
                            <div class="each-guide" v-for="itemone in item.guide" :key="'guide-' + itemone.id">
                                <div class="guide-detail">
                                    <span class="name">{{itemone.guider}}:</span>
                                    <span class="content">{{itemone.content}}</span>
                                    <span class="reply" @click="_replyUp(itemone)">回复</span>
                                </div>
                                <ul class="child-guide" v-if="itemone.childguide">
                                    <li class="child-guide-item guide-detail" v-for="child in itemone.childguide" :key="'guide-' + child.id">
                                        <span class="name">{{child.guider}}</span>
                                        <span style="margin: 0 2px">回复</span>
                                        <span class="name">{{child.tousername}}:</span>
                                        <span class="content">{{child.content}}</span>
                                        <span class="reply" @click="_replyUp(child, itemone.id)">回复</span>
                                        <span class="del" @click="_delReply(child)" v-if="child.states === 1">删除</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="guider-block" v-if="item.sysmsg && item.sysmsg.length">
                            <h4>备注:</h4>
                            <ul class="guider-list">
                                <li class="guider-item" style="position: relative; left: -6px;"
                                    v-for="sysmsgItem in item.sysmsg" :key="'sysmsg' + sysmsgItem.id">
                                    <span class="guider-name" style="width: auto">【{{sysmsgItem.content}}】</span><span>{{sysmsgItem.addtime}} 查看了你的日志</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    @import "../../styles/fsBase";
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
            &:hover > .del{
                display: inline-block;
            }
            & > .reply,
            & > .del{
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
    #my-log {
        .each-log-wrapper {
            position: relative;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .log-title {
            color: @fs-title-color;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
        }
        .each-log-look {
            margin-top: 10px;
            padding: 8px 0;
            .guider-block {
                margin-top: 8px;
                .guider-item {
                    display: flex;
                    margin-bottom: 4px;
                }
            }
            &:not(:last-child) {
                border-bottom: 1px solid @fs-divider-color;
            }
            .time-title {
                color: @fs-title-color;
                font-weight: 700;
            }
        }
    }

    .ivu-table .mylog-table-row {
        td {
            .ivu-table-cell {
                position: relative;
                padding: 0;
                padding-top: 80%;
                .inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    font-size: 16px;
                    font-weight: 700;
                    transition: all 0.2s ease-in-out;
                    &:hover {
                        cursor: pointer;
                        background-color: rgba(92, 173, 255, 0.6);
                        color: #fff
                    }
                }
            }
            .fs-tag {
                display: inline-block;
                height: 22px;
                line-height: 22px;
                margin: 2px 4px 2px 0;
                padding: 0 8px;
                border-radius: 3px;
                font-size: 12px;
                vertical-align: middle;
                opacity: 1;
                overflow: hidden;
            }
        }
    }
</style>
<script>
    import moment from 'moment';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import dateMixin from '@/mixins/dateMixin';
    // import clickoutside from '@/directives/click-outside';

    const NOW_DATE = moment().format('YYYY-MM-DD');
    export default {
        name: 'myLog',
        mixins: [dateMixin],
        // directives: {clickoutside},
        data() {
            return {
                datePickerFlag: false,
                submitLoading: false,
                modelFlag: false,
                loading: false,
                open: true,
                btnDisabled: false,
                dateData: null,
                canReply: false,
                nowDate: NOW_DATE,
                logMaxHeight: '300px',
                editorContent: '',
                editorMeun: [
                    'bold',
                    'italic',
                    'link',
                    'list',
                    'justify',
                    'emoticon',
                    'quote',
                    'image',
                    'video',
                    'table',
                    'undo',
                    'redo'
                ],
                logLookList: [],
                logDetail: {
                    logType: '0',
                    date: '',
                    type: 0,
                    logType1: '',
                    commentResult: '0'
                },
                logTypeList: [
                    {
                        value: '0',
                        label: '出勤'
                    },
                    {
                        value: '1',
                        label: '休息'
                    }
                ],
                columnsData: [
                    {
                        title: '周日',
                        render: this._rowRender(0),
                        align: 'center'
                    },
                    {
                        title: '周一',
                        render: this._rowRender(1),
                        align: 'center'
                    },
                    {
                        title: '周二',
                        render: this._rowRender(2),
                        align: 'center'
                    },
                    {
                        title: '周三',
                        render: this._rowRender(3),
                        align: 'center'
                    },
                    {
                        title: '周四',
                        render: this._rowRender(4),
                        align: 'center'
                    },
                    {
                        title: '周五',
                        render: this._rowRender(5),
                        align: 'center'
                    },
                    {
                        title: '周六',
                        render: this._rowRender(6),
                        align: 'center'
                    }
                ],
                tableData: [],
                upguiders: [],
                upchecks: [],
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
        watch: {
            dateData(val) {
                this._getLogInfo(val);
            },
            'replyData.content'(val) {
                if (val.length < this.preContent.length) {
                    this.canReply = false
                }
            }
        },
        created() {
            this.dateData = moment().format('YYYY-MM');
            this._setHeight();
        },
        filters: {
            _returnCommentResult(val) {
                let text = '';
                switch (+val) {
                    case 0:
                        text = '未评价';
                        break;
                    case 1:
                        text = '优秀';
                        break;
                    case 2:
                        text = '合格';
                        break;
                    case 3:
                        text = '不合格';
                        break;
                }
                return text;
            },
            _returnLogType(val) {
                let text = '';
                switch (+val) {
                    case 0:
                        text = '出勤';
                        break;
                    case 1:
                        text = '休息';
                        break;
                }
                return text;
            }
        },
        methods: {
            _delReply(child) {
                let id = child.id
                this.$http.post('/journal/deleteGuide', {id}).then((res) => {
                    if (res.success) {
                        this._getLogInfo(this.dateData)
                    }
                })
            },
            _replyUp(item, id = 0) {
                console.log(item, id)
                let replyData = this.replyData
                this.preContent = `回复 ${item.guider}:`
                replyData.id = item.journalid
                replyData.toUserId = item.guiderid
                if (id !== 0) replyData.guildId = id
                else replyData.guildId = item.id
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
                        this._getLogInfo(this.dateData)
                    }
                })
            },
            _returnRealContent(str) {
                return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, '');
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.logMaxHeight = dm - 190 + 'px';
            },
            _getLogInfo(ym) {
                this.loading = true;
                this.btnDisabled = true;
                this.$http.get('/journal/typeList', {params: {time: ym}}).then((res) => {
                    if (res.success) {
                        let storeArr = res.data.slice(0);
                        this._setLogList(storeArr);
                        let year = moment(ym).year();
                        let month = moment(ym).month();
                        this.tableData = this.returnDateDetail(year, month, res.data);
                    }
                    this.loading = false;
                    this.btnDisabled = false;
                }, () => {
                    this.loading = false;
                    this.btnDisabled = false;
                })
            },
            _dateChange(date) {
                this.dateData = date;
                this.datePickerFlag = false;
            },
            _preMonth() {
                this.dateData = moment(this.dateData).subtract(1, 'M').format('YYYY-MM');
            },
            _nextMonth() {
                this.dateData = moment(this.dateData).add(1, 'M').format('YYYY-MM');
            },
            _rowClassName() {
                return 'mylog-table-row';
            },
            _setSelectOpt(type, date, logType) {
                if (type === 0 && date !== NOW_DATE) {
                    this.logTypeList = [
                        {
                            value: '1',
                            label: '休息'
                        }
                    ];
                    this.logDetail.logType = '1';
                    this.editorContent = '<p>休息</p>';
                } else {
                    this.logTypeList = [
                        {
                            value: '0',
                            label: '出勤'
                        },
                        {
                            value: '1',
                            label: '休息'
                        }
                    ];
                    this.logDetail.logType = logType ? logType + '' : '0';
                }
            },
            _setLogList(arr) {
                this.logLookList = arr.filter((item) => {
                    return !!item.content;
                }).reverse();
            },
            _logRowClick(obj) {
                if (obj.type === 4) {
                    this.$Message.error('超过48小时不可再补写日志！');
                    return;
                }
                this.upguiders = obj.guide || [];
                this.upchecks = obj.sysmsg || [];
                this.logDetail.date = obj.date;
                this.logDetail.type = obj.type;
                this.logDetail.commentResult = obj.commentResult;
                this.editorContent = obj.content || '';
                this.logDetail.logType = obj.logType ? obj.logType + '' : '0';
                this.logDetail.logType1 = obj.logType || '';
                this._setSelectOpt(obj.type, obj.date, obj.logType);
                this.modelFlag = true;
            },
            _submitLog() {
                if (this.logDetail.logType === '0') {
                    let realContent = this._returnRealContent(this.editorContent);
                    if (realContent.length < 10) {
                        this.$Message.error('出勤日志不能少于10个字!');
                        return;
                    }
                }
                this.submitLoading = true;
                let data = {
                    type: this.logDetail.logType,
                    time: this.logDetail.date,
                    content: this.editorContent
                };
                this.$http.post('/journal/addJournal', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('日志提交成功！');
                        this._getLogInfo(this.dateData);
                    }
                    this.modelFlag = false;
                    this.submitLoading = false;
                }, () => {
                    this.modelFlag = false;
                    this.submitLoading = false;
                })
            },
            _rowRender(i) {
                return (h, params) => {
                    let typeDom;
                    let type = params.row['day' + i].type;
                    if (type === 0) {
                        typeDom = '';
                    } else if (type === 1 || type === 5) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#19be6b',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '已写');
                    } else if (type === 2) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#ed3f14',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '补写');
                    } else if (type === 3) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#f90',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '待写');
                    } else if (type === 4) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#80848f',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '未写');
                    } else if (type === 6) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#2b85e4',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '休息');
                    }
                    return h('div', {
                        class: [params.row['day' + i].day ? 'inner' : ''],
                        on: {
                            click: () => {
                                this._logRowClick(params.row['day' + i]);
                            }
                        }
                    }, [
                        h('span', params.row['day' + i].day),
                        typeDom
                    ]);
                };
            }
        },
        components: {
            WangEditor
        }
    };
</script>
