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
                            <span style="font-weight: 700;">总消费：</span>
                            <span style="font-size: 24px;">{{this.totalMoney}}</span>
                            <span style="font-weight: 700;">元</span>
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
                        <div class="food-card-info-wrap">
                            <div class="food-card-info"></div>
                            <div class="info-block">
                                <div class="info-item">
                                    <span>卡号:</span>
                                    <span>{{cardNumber}}</span>
                                </div>
                                <div class="info-item">
                                    <span>余额:</span>
                                    <span>{{mealFree}}</span>
                                </div>
                            </div>
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
                            <div >
                                <DatePicker
                                    :open="dateOpen"
                                    :value="appintmentTime"
                                    :options="detailOptions"
                                    type="date"
                                    @on-change="dateChangeHandler">
                                    <a href="javascript:void(0)" v-clickoutside="dateClose" @click="dateOpen = true" style="font-size: 22px; font-weight: 700;">
                                        <Icon type="ios-calendar-outline"></Icon>
                                        <template>{{ appintmentTime }}</template>
                                    </a>
                                </DatePicker>
                                <span style="font-size: 22px; font-weight: 700;">预约</span>
                            </div>
                            <div class="btb-group">
                                <fs-appointment-btn
                                    :states="morningStates"
                                    type="morning"
                                    :date="appintmentTime"
                                    :id="appointmentId"
                                    type-title="早餐(06:30-08:30)"
                                    @states-change="_statesChangeHandler"></fs-appointment-btn>
                                <fs-appointment-btn
                                    :states="afternoonStates"
                                    :id="appointmentId"
                                    type="afternoon"
                                    :date="appintmentTime"
                                    type-title="午餐(11:20-13:00)"
                                    @states-change="_statesChangeHandler"></fs-appointment-btn>
                                <fs-appointment-btn
                                    :states="dinnerStates"
                                    :id="appointmentId"
                                    type="dinner"
                                    :date="appintmentTime"
                                    type-title="晚餐(17:30-19:30)"
                                    @states-change="_statesChangeHandler"></fs-appointment-btn>
                            </div>
                            <div class="beizhu">
                                <span>下午一点前可预约当日晚餐，下午七点前可预约明日就餐，最多可预约未来七天的就餐哦</span>
                            </div>
                            <div class="beizhu" style="margin-top: 4px;">
                                <span>备注:预定没去或去了没预定，很容易造成食物浪费或紧缺，为了大家更好的就餐，请酌情而定哦（周六周日请务必认真填写，谢谢您的配合）。</span>
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
            .food-card-info-wrap {
                position: relative;
                margin-bottom: 24px;
                width: 60%;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 1px 1px 4px 2px #c0c4cc;
                .info-block {
                    padding: 12px;
                    position: absolute;
                    display: flex;
                    justify-content: space-around;
                    left: 0;
                    width: 100%;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.8);
                    .info-item {
                        font-size: 16px;
                        font-weight: 700;
                        color: #fff;
                    }
                }
            }
            .food-card-info {
                position: relative;
                width: 100%;
                padding-top: 65%;
                background-image: url(../../images/food_card_bg.jpg);
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .each-line {
                margin-bottom: 32px;
                &.yuding {
                    display: flex;
                    align-items: center;
                    .title {
                        font-size: 20px;
                        font-weight: 700;
                    }
                    .yuding-content-block {
                        display: flex;
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
                    margin: 24px auto 0 auto;
                    width: 80%;
                    text-align: left;
                }
                .title {
                    font-size: 24px;
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
    import moment from 'moment'
    import clickoutside from '@/directives/click-outside'

    const TOMORROW = moment().add(1, 'days').format('YYYY-MM-DD')

    export default {
        name: 'myFoodCard',
        data() {
            return {
                exportLoading: false,
                dateOpen: false,
                totalMoney: 0,
                innerHeight: 400,
                tableHeight: 400,
                appointmentId: 0,
                totalTitle: '今日消费总额',
                columns1: [
                    // {
                    //     title: '商品名称',
                    //     key: 'good_name',
                    //     width: 200
                    // },
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
                appintmentTime: TOMORROW,
                morningStates: 0,
                afternoonStates: 0,
                dinnerStates: 0,
                afternoonToday: 0,
                afternoonTomorrow: 0,
                dinnerToday: 0,
                dinnerTomorrow: 0,
                morningToday: 0,
                morningTomorrow: 0,
                detailOptions: {
                    disabledDate: function(date) {
                        return moment(date).isBefore(moment(), 'day') || moment(date).isAfter(moment().add(7, 'days'), 'day')
                    }
                }
            }
        },
        directives: {clickoutside},
        created() {
            this._setHeight()
            this._getAppointmentTotal()
            this._getMyAppintment()
            this._getTotalMoney()
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
            dateClose() {
                this.dateOpen = false
            },
            dateChangeHandler(date) {
                this.appintmentTime = date
                this._getMyAppintment()
                this.dateOpen = false
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
            _startDateChange(date) {
                this.searchData.start.value = date
                this._getTotalMoney()
            },
            _endDateChange(date) {
                this.searchData.end.value = date
                this._getTotalMoney()
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.innerHeight = dm - 164;
                this.tableHeight = dm - 280;
            },
            _getMyAppintment() {
                let params = {}
                this._getTotalMoney()
                params.date = this.appintmentTime
                this.$http.get('card/getMyAppintment', {params}).then((res) => {
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
                this.$http.get('/card/getMyTotal', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.totalMoney = res.data
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
