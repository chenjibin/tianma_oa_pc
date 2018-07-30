<template>
    <div class="system-info">
        <div class="content-block" style="margin-bottom: 6px">
            <Table height="254"
                   :columns="columns"
                   :data="pageData.list"
                   @on-row-click="rowClickHandler"
                   :loading="tableLoading"></Table>
        </div>
        <Page
            :total="pageData.totalCount"
            size="small"
            :page-size="pageData.pageSize"
            @on-change="pageChangeHandler"></Page>
        <Modal v-model="checkLogFlag"
               :mask-closable="false"
               @on-visible-change="canReply = false"
               width="800">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{journal.writedate || ''}}日志</span>
            </p>
            <div id="log-reply-modal">
                <Spin fix v-show="loadingShow"></Spin>
                <Row>
                    <Col :span="24">
                    <h3>日志内容</h3>
                    <div class="w-e-text" style="overflow: auto;" v-html="journal.content || ''"></div>
                    </Col>
                    <Col :span="24">
                    <h3>上级指导</h3>
                    <div class="each-guide" v-for="item in guider" :key="'guide-' + item.id">
                        <div class="guide-detail">
                            <span class="name">{{item.guider}}:</span>
                            <span class="content">{{item.content}}</span>
                            <span class="reply" @click="_replyUp(item)">回复</span>
                        </div>
                        <ul class="child-guide" v-if="item.childguide">
                            <li class="child-guide-item guide-detail" v-for="child in item.childguide" :key="'guide-' + child.id">
                                <span class="name">{{child.guider}}</span>
                                <span style="margin: 0 2px">回复</span>
                                <span class="name">{{child.tousername}}:</span>
                                <span class="content">{{child.content}}</span>
                                <span class="reply" @click="_replyUp(child, item.id)">回复</span>
                                <span class="del" @click="_delReply(child)" v-if="child.states === 1">删除</span>
                            </li>
                        </ul>
                    </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <div class="" v-show="canReply" style="text-align: left">
                    <Input type="textarea"
                           ref="replyTextarea"
                           v-model="replyData.content"></Input>
                    <Button type="primary" style="margin-top: 16px" @click="confirmReply">回复</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    #log-reply-modal {
        position: relative;
        font-size: 14px;
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
    }
    .system-info {
        margin-left: 12px;
        h3 {
            font-size: 14px;
        }
        .list-wrapper {
            margin-top: 8px;
            padding: 8px 0;
            height: 220px;
            overflow: auto;
        }
        time {
            margin-right: 4px;
        }
        .content-block {
            position: relative;
        }
    }
</style>
<script>
    import pageMixin from '@/mixins/pageMixin';

    export default {
        name: 'systemInfo',
        mixins: [pageMixin],
        data() {
            return {
                loadingShow: false,
                checkLogFlag: false,
                canReply: false,
                columns: [
                    {
                        title: '系统消息',
                        render: (h, params) => {
                            let type = params.row.type;
                            let content = '';
                            let addtime = params.row.addtime;
                            let pcontent = params.row.content;
                            switch (type) {
                                case 2:
                                    content = `${addtime} 【${pcontent}】 对你的日志进行指导 【点击查看】`;
                                    break;
                                case 3:
                                    content = `${addtime} 【${pcontent}】 查看了你的日志`;
                                    break;
                                case 6:
                                    content = pcontent + '【点击查看】';
                                    break;
                                case 5:
                                case 9:
                                    content = pcontent;
                            }
                            return h('span', {
                                style: {
                                    'cursor': type === 2 || type === 6 ? 'pointer' : ''
                                }
                            }, content);
                        }
                    }
                ],
                guider: [],
                journal: {},
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
            'replyData.content'(val) {
                if (val.length < this.preContent.length) {
                    this.canReply = false
                }
            }
        },
        created() {
            this._getSysInfo();
        },
        methods: {
            _delReply(child) {
                let id = child.id
                this.$http.post('/journal/deleteGuide', {id}).then((res) => {
                    if (res.success) {
                        this._getLogInfo()
                    }
                })
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
                        this._getLogInfo()
                    }
                })
            },
            _replyUp(item, id = 0) {
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
            _getLogInfo() {
                this.loadingShow = true
                let id = this.logIdObjId
                let params = {id}
                this.$http.get('/journal/getJournalById', {params}).then((res) => {
                    if (res.success) {
                        const {guide, journal} = res.data
                        this.guider = guide
                        this.journal = journal
                    }
                    this.loadingShow = false
                }, () => {
                    this.loadingShow = false
                })
            },
            rowClickHandler(row) {
                if (+row.type === 2 || +row.type === 6) {
                    this.checkLogFlag = true
                    this.logIdObjId = +row.objid
                    this._getLogInfo()
                }
                console.log(row)
            },
            pageChangeHandler(page) {
                this.pageData.page = page;
                this._getSysInfo();
            },
            _getSysInfo() {
                this.loading = true;
                this.getList('/main/PersonalDynamic');
            }
        },
        components: {}
    };
</script>
