<template>
    <div class="food-client">
        <Row :gutter="16">
            <Col :span="12">
            <Card>
                <div class="info-inner" :style="{height: innerHeight + 'px'}">
                    <Form ref="searchData" :model="searchData" inline :label-width="80">
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
                                   url="card/myLog"></fs-table-page>
                </div>
            </Card>
            </Col>
            <Col :span="12">
            <Card>
                <div class="cash-inner" :style="{height: innerHeight + 'px'}">
                    <div class="each-line">
                        <h2 class="title">卡号</h2>
                        <p class="content">{{this.cardNumber}}</p>
                    </div>
                    <div class="each-line">
                        <h2 class="title">余额</h2>
                        <p class="content">{{this.mealFree}}元</p>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<style lang="less" scoped>
    .food-client {
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
            .each-line {
                margin-bottom: 32px;
                .title {
                    font-size: 32px;
                }
                .content {
                    font-size: 24px;
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
        name: 'myFoodCard',
        data() {
            return {
                exportLoading: false,
                totalMoney: 0,
                innerHeight: 400,
                tableHeight: 400,
                totalTitle: '今日消费总额',
                columns1: [
                    {
                        title: '内容',
                        key: 'content',
                        width: 360
                    },
                    {
                        title: '消费时间',
                        key: 'add_time',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '操作人',
                        key: 'createname',
                        align: 'center',
                        minWidth: 160
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
                    }
                }
            }
        },
        created() {
            this._setHeight()
            this._getTotalMoney()
        },
        computed: {
            cardNumber() {
                return this.$store.state.user.userInfo.cardnumber || '...';
            },
            mealFree() {
                return this.$store.state.user.userInfo.mealfee || '...';
            }
        },
        methods: {
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                let searchData = this.searchData;
                data.cardNumber = searchData.cardNumber.value;
                data.start = searchData.start.value;
                data.end = searchData.end.value;
                this.$http.post('/card/exportDetailbyShiTang', data).then((res) => {
                    console.log(res)
                    if (res.success) {
                        utils.downloadFile(res.path, res.filename)
                    }
                    this.exportLoading = false;
                }, () => {
                    this.exportLoading = false;
                })
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
                this.innerHeight = dm - 164;
                this.tableHeight = dm - 280;
            },
            _getTotalMoney() {
                let sendData = {}
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
