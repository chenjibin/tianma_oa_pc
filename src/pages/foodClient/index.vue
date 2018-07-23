<template>
    <div class="food-client">
        <Row :gutter="16">
            <Col :span="12">
            <Card>
                <div class="info-inner" :style="{height: innerHeight + 'px'}">
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="realName" label="卡号">
                            <Input type="text"
                                   v-model="searchData.cardNumber.value"
                                   clearable
                                   placeholder="筛选卡号"></Input>
                        </FormItem>
                        <FormItem prop="startDate" label="开始日期">
                            <DatePicker type="date"
                                        @on-change="_startDateChange"
                                        placeholder="开始日期"
                                        :value="searchData.start.value"></DatePicker>
                        </FormItem>
                        <FormItem prop="startDate" label="结束日期">
                            <DatePicker type="date"
                                        @on-change="_endDateChange"
                                        placeholder="结束日期"
                                        :value="searchData.end.value"></DatePicker>
                        </FormItem>
                        <FormItem label="类型" prop="type">
                            <Select v-model="searchData.type.value"
                                    clearable
                                    placeholder="筛选类型"
                                    style="width: 160px">
                                <Option v-for="item in typeStore" :value="item.value" :key="'type-log-' + item.value">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">
                                <span v-if="!exportLoading">导出</span>
                                <span v-else>导出中...</span>
                            </Button>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="columns1"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="searchData"
                                   ref="userTable"
                                   url="/card/logList"></fs-table-page>
                </div>
            </Card>
            </Col>
            <Col :span="12">
            <Card>
                <div class="tool-btn">
                    <Button type="error" @click.stop="logoutHandler">退出登录</Button>
                </div>
                <div class="cash-inner" :style="{height: innerHeight + 'px'}">
                    <div class="cash desc">
                        <span>{{totalTitle}}</span>
                        <span style="font-weight: 700">{{totalMoney}}元</span>
                    </div>
                    <div class="cash">
                        <span class="label">消费</span>
                        <fs-input-number :inputClasses="'food-input'"
                                         :inputWrapClasses="'food-input-wrapper'"
                                         @key-enter="enterHandler"
                                         v-model="cash">
                            <span class="unit">元</span>
                        </fs-input-number>
                    </div>
                    <div class="cash">
                        <span class="label">卡号</span>
                        <fs-input-number :inputClasses="'food-input'"
                                         :inputWrapClasses="'food-input-wrapper'"
                                         @key-enter="enterHandler"
                                         v-model="cardNumber"></fs-input-number>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    .food-client {
        padding: 16px;
        .tool-btn {
            position: absolute;
            right: 12px;
            top: 12px;
            z-index: 10;
        }
        .cash-btn {
            background-color: #dc0707;
            color: #fff;
            width: 300px;
            padding: 18px 0;
            font-size: 24px;
            border-radius: 16px;
            cursor: pointer;
        }
        .info-inner {
            overflow: auto;
        }
        .cash-inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            .cash {
                &.desc {
                    margin-bottom: 100px;
                    font-size: 32px;
                }
                margin-bottom: 64px;
                .food-input-wrapper {
                    position: relative;
                    margin-top: 32px;
                    .unit {
                        position: absolute;
                        font-size: 32px;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .food-input {
                    padding: 12px 24px;
                    width: 100%;
                    -webkit-appearance: none;
                    border: 0;
                    border-bottom: 2px solid #999;
                    font-size: 32px;
                    outline: none;
                    text-align: center;
                }
                .label {
                    font-size: 48px;
                    font-weight: 700;
                }
            }
        }
    }
</style>
<script>
    import fsInputNumber from '@/baseComponents/fs-input-number'
    import fsTablePage from '@/baseComponents/fs-table-page'
    import utils from '@/libs/util'

    export default {
        name: 'foodPublic',
        data() {
            return {
                exportLoading: false,
                cash: null,
                cardNumber: null,
                totalMoney: 0,
                innerHeight: 400,
                tableHeight: 400,
                totalTitle: '今日消费总额',
                canKou: true,
                typeStore: [
                    {
                        value: 1,
                        title: '消费'
                    },
                    {
                        value: 3,
                        title: '消费退款记录'
                    },
                    {
                        value: 4,
                        title: '已退款的消费记录'
                    }
                ],
                columns1: [
                    {
                        title: '内容',
                        key: 'content'
                    },
                    {
                        title: '类型',
                        key: 'type',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            return h('span', this.typeStore.filter(x => x.value === +params.row.type)[0].title)
                        }
                    },
                    {
                        title: '消费时间',
                        key: 'add_time',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '操作人',
                        key: 'createname',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '操作',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            let returnBtn = params.row.type === 1 ? h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'reply',
                                    shape: 'circle'
                                },
                                attrs: {
                                    title: '退款'
                                },
                                on: {
                                    click: function () {
                                        vm._returnMoney(params.row);
                                    }
                                },
                                style: {
                                    marginRight: '4px'
                                }
                            }) : ''
                            return h('div', [returnBtn]);
                        }
                    }
                ],
                searchData: {
                    cardNumber: {
                        value: '',
                        type: 'input'
                    },
                    start: {
                        value: '',
                        type: 'date'
                    },
                    end: {
                        value: '',
                        type: 'date'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    }
                }
            }
        },
        created() {
            this._setHeight()
            this._getTotalMoney()
        },
        computed: {},
        methods: {
            logoutHandler() {
                this.$Modal.confirm({
                    title: '退出登录提醒',
                    content: '确定退出登录？',
                    okText: '确认退出',
                    cancelText: '取消',
                    onOk: () => {
                        this.$store.commit('logout');
                    }
                });
            },
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                let searchData = this.searchData;
                data.cardNumber = searchData.cardNumber.value;
                data.start = searchData.start.value;
                data.end = searchData.end.value;
                this.$http.post('/card/exportDetailbyShiTang', data).then((res) => {
                    if (res.success) {
                        utils.downloadFile(res.path, res.filename)
                    }
                    this.exportLoading = false;
                }, () => {
                    this.exportLoading = false;
                })
            },
            _returnMoney(data) {
                this.$Modal.confirm({
                    title: '退款提醒',
                    content: `确认对（${data.content}）这条记录进行退款麽？`,
                    okText: '确认退款',
                    cancelText: '取消',
                    onOk: () => {
                        this.$http.post('/card/refund', {id: data.id}).then((res) => {
                            if (res.success) {
                                this.$Modal.success({
                                    title: '成功',
                                    content: '退款成功!'
                                });
                                this.$refs.userTable.getListData()
                                this._getTotalMoney()
                            }
                        })
                    }
                });
            },
            _initInput() {
                this.cash = null
                this.cardNumber = null
            },
            enterHandler(e) {
                const {cash, cardNumber} = this
                if (!cash) {
                    this.$Modal.error({
                        title: '提醒',
                        content: '请先输入金额，再刷卡!',
                        onOk: () => {
                            this._initInput()
                        }
                    })
                    return
                }
                if (!cardNumber) {
                    this.$Message.error('请输入卡号!')
                    return
                }
                if (!this.canKou) return
                this.canKou = false
                this.$http.post('/card/consumeByUser', {cardNumber, money: cash}).then((res) => {
                    if (res.success) {
                        this.$Message.success('扣费成功!')
                        this._getTotalMoney()
                        this.$refs.userTable.getListData()
                        this._initInput()
                    } else {
                        this.$Modal.error({
                            title: '提醒',
                            content: res.message,
                            onOk: () => {
                                this._initInput()
                            }
                        })
                    }
                    this.canKou = true
                }, () => {
                    this.canKou = true
                })
            },
            _computedTotalTitle() {
                const start = this.searchData.start.value
                const end = this.searchData.end.value
                if (start && end) {
                    this.totalTitle = `${start} 到 ${end} 的消费总额:`
                } else if (!start && end) {
                    this.totalTitle = `${end} 之前的消费总额:`
                } else if (start && !end) {
                    this.totalTitle = `${start} 至今的消费总额:`
                } else if (!start && !end) {
                    this.totalTitle = '今日消费总额:'
                }
            },
            _startDateChange(date) {
                this.searchData.start.value = date
                this._computedTotalTitle()
                this._getTotalMoney()
            },
            _endDateChange(date) {
                this.searchData.end.value = date
                this._computedTotalTitle()
                this._getTotalMoney()
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.innerHeight = dm - 64;
                this.tableHeight = dm - 240;
            },
            _getTotalMoney() {
                let sendData = {}
                sendData.cardNumber = this.searchData.cardNumber.value
                sendData.start = this.searchData.start.value
                sendData.end = this.searchData.end.value
                this.$http.get('/card/getTotal', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.totalMoney = res.data.total
                    }
                })
            }
        },
        components: {
            fsInputNumber,
            fsTablePage
        }
    }
</script>
