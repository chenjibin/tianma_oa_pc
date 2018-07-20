<template>
    <div class="food-client">
        <Row :gutter="16">
            <Col :span="12">
            <Card>
                <div class="info-inner" :style="{height: innerHeight + 'px'}">
                    <Form ref="searchData" :model="searchData" inline :label-width="80">
                        <FormItem prop="realName" label="姓名">
                            <Input type="text"
                                   v-model="searchData.userName.value"
                                   placeholder="筛选姓名"></Input>
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
                <div class="cash-inner" :style="{height: innerHeight + 'px'}">
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
                    <div class="cash desc">
                        <span>{{totalTitle}}</span>
                        <span style="font-weight: 700">{{totalMoney}}元</span>
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
                    font-size: 18px;
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

    export default {
        name: 'foodPublic',
        data() {
            return {
                cash: null,
                cardNumber: null,
                totalMoney: 0,
                innerHeight: 400,
                tableHeight: 400,
                totalTitle: '今日消费总额',
                columns1: [
                    {
                        title: '内容',
                        key: 'content'
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
                    userName: {
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
                    }
                }
            }
        },
        created() {
            this._setHeight()
        },
        computed: {},
        methods: {
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
                this.$http.post('/card/consumeByUser', {cardNumber, money: cash}).then((res) => {
                    if (res.success) {
                        this.$Message.success('扣费成功!')
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
                console.log(date)
            },
            _endDateChange(date) {
                this.searchData.end.value = date
                this._computedTotalTitle()
                console.log(date)
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.innerHeight = dm - 64;
                this.tableHeight = dm - 240;
            }
        },
        components: {
            fsInputNumber,
            fsTablePage
        }
    }
</script>
