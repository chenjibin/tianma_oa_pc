<template>
    <div class="food-client">
        <Row :gutter="8">
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
                    <div class="each-line yuding">
                        <p class="title">今日预定数据</p>
                        <div class="yuding-content-block">
                            <div class="yuding-content-item">
                                <span>早餐:</span>
                                <span>{{morningToday}}</span>
                            </div>
                            <div class="yuding-content-item">
                                <span>中餐:</span>
                                <span>{{afternoonToday}}</span>
                            </div>
                            <div class="yuding-content-item">
                                <span>晚餐:</span>
                                <span>{{dinnerToday}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="each-line yuding">
                        <p class="title">明日预定数据</p>
                        <div class="yuding-content-block">
                            <div class="yuding-content-item">
                                <span>早餐:</span>
                                <span>{{morningTomorrow}}</span>
                            </div>
                            <div class="yuding-content-item">
                                <span>中餐:</span>
                                <span>{{afternoonTomorrow}}</span>
                            </div>
                            <div class="yuding-content-item">
                                <span>晚餐:</span>
                                <span>{{dinnerTomorrow}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="each-line">
                        <h2 class="title">明日预约</h2>
                        <div class="btb-group">
                            <fs-appointment-btn
                                :states="morningStates"
                                type="morning"
                                :id="appointmentId"
                                type-title="早餐"
                                @states-change="_statesChangeHandler"></fs-appointment-btn>
                            <fs-appointment-btn
                                :states="afternoonStates"
                                :id="appointmentId"
                                type="afternoon"
                                type-title="午餐"
                                @states-change="_statesChangeHandler"></fs-appointment-btn>
                            <fs-appointment-btn
                                :states="dinnerStates"
                                :id="appointmentId"
                                type="dinner"
                                type-title="晚餐"
                                @states-change="_statesChangeHandler"></fs-appointment-btn>
                        </div>
                        <div class="beizhu">
                            <span>备注:预定没去或去了没预定，很容易造成食物浪费或紧缺，为了大家更好的就餐，请酌情而定哦（周六周日请务必认真填写，谢谢您的帮忙）。
</span>
                        </div>
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
                &.yuding {
                    .title {
                        font-size: 24px;
                        font-weight: 700;
                    }
                    .yuding-content-block {
                        display: flex;
                        margin-top: 8px;
                        font-size: 18px;
                    }
                    .yuding-content-item {
                        margin: 0 8px;
                    }
                }
                .btb-group {
                    margin-top: 24px;
                    display: flex;
                    justify-content: center;
                }
                .beizhu {
                    margin-top: 16px;
                    text-align: left;
                }
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
    import fsAppointmentBtn from './fs-appointment-btn'
    import utils from '@/libs/util'

    export default {
        name: 'myFoodCard',
        data() {
            return {
                exportLoading: false,
                totalMoney: 0,
                innerHeight: 400,
                tableHeight: 400,
                appointmentId: 0,
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
                },
                morningStates: 0,
                afternoonStates: 0,
                dinnerStates: 0,
                afternoonToday: 0,
                afternoonTomorrow: 0,
                dinnerToday: 0,
                dinnerTomorrow: 0,
                morningToday: 0,
                morningTomorrow: 0
            }
        },
        created() {
            this._setHeight()
            this._getAppointmentTotal()
            this._getMyAppintment()
        },
        computed: {
            cardNumber() {
                return this.$store.state.user.userInfo.cardnumber || '...';
            },
            mealFree() {
                return this.$store.state.user.userInfo.mealfee;
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
            _getMyAppintment() {
                this.$http.get('card/getMyAppintment').then((res) => {
                    const data = res.data
                    this.appointmentId = data.id
                    this.morningStates = data.morning
                    this.afternoonStates = data.afternoon
                    this.dinnerStates = data.dinner
                })
            },
            _getAppointmentTotal() {
                this.$http.get('card/getAppointmentTotal').then((res) => {
                    if (res.success) {
                        const data = res.data
                        this.morningToday = data.morning_today
                        this.morningTomorrow = data.morning_tomorrow
                        this.afternoonToday = data.afternoon_today
                        this.afternoonTomorrow = data.afternoon_tomorrow
                        this.dinnerToday = data.dinner_today
                        this.dinnerTomorrow = data.dinner_tomorrow
                    }
                })
            },
            _statesChangeHandler() {
                this._getAppointmentTotal()
                this._getMyAppintment()
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
            fsTablePage,
            fsAppointmentBtn
        }
    }
</script>
