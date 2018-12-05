<template>
    <div class="meeting-schedule">
        <header>
            <div class="btn-group">
                <Button type="ghost" shape="circle" icon="ios-arrow-left" @click="toPrew" style="margin-right: 6px;"></Button>
                <Button type="ghost" shape="circle" icon="ios-arrow-right" @click="toNext"></Button>
            </div>
            <div class="flex-one text">{{rangeText}}</div>
        </header>
        <aside>
            <div class="fs-checkbox" style="margin-bottom: 16px;padding-bottom: 8px;border-bottom: 1px solid #ddd;">
                <label>
                    <input type="checkbox" class="check-all" @change="checkallChange" v-model="isAll"/>
                    <span></span>
                    <strong>全部</strong>
                </label>
            </div>
            <div class="fs-checkbox" v-for="item in checkOption" :key="'item-id-' + item.id">
                <label>
                    <input type="checkbox" class="check-item" v-model="checkedArr" :value="item.id"/>
                    <span :style="{'color': item.bgColor}"></span>
                    <strong>{{item.name}}</strong>
                </label>
            </div>
        </aside>
        <vue-tuicalendar
            ref="calendar"
            :options="options"
            :schedules="schedules"
            @before-update-schedule = "updateScheduleHandler"
            @before-delete-schedule="deleteScheduleHandler"
            @before-create-schedule="beforeCreateScheduleHandler"
            class="schedule-wrap"
            style="">
        </vue-tuicalendar>
    </div>
</template>
<style lang="less" scoped>
    .fs-checkbox {
        margin-bottom: 8px;
        label {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            cursor: pointer;
        }
        input {
            display: none;
        }
        input[type='checkbox'].check-item + span {
            cursor: pointer;
            width: 20px;
            height: 20px;
            line-height: 20px;
            margin-right: 8px;
            border-radius: 50%;
            border: solid 3px;
            background: transparent;
            border-color: currentColor;
            transition: all 0.2s ease-in-out;
        }
        input[type='checkbox'].check-item:checked + span {
            background: currentColor;
        }
        input[type='checkbox'].check-all + span {
            cursor: pointer;
            line-height: 14px;
            margin-right: 8px;
            width: 14px;
            height: 14px;
            background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAADpJREFUKBVjPHfu3O5///65MJAAmJiY9jCcOXPmP6kApIeJBItQlI5qRAkOVM5o4KCGBwqPkcxEvhsAbzRE+Jhb9IwAAAAASUVORK5CYII=) no-repeat;
            vertical-align: middle;
        }
        input[type='checkbox'].check-all:checked + span {
        background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAMBJREFUKBWVkjEOwjAMRe2WgZW7IIHEDdhghhuwcQ42rlJugAQS54Cxa5cq1QM5TUpByZfS2j9+dlJVt/tX5ZxbS4ZU9VLkQvSHKTIGRaVJYFmKrBbTCJxE2UgCdDzMZDkHrOV6b95V0US6UmgKodujEZbJg0B0ZgEModO5lrY1TMQf1TpyJGBEjD+E2NPN7ukIUDiF/BfEXgRiGEw8NgkffYGYwCi808fpn/6OvfUfsDr/Vc1IfRf8sKnFVqeiVQfDu0tf/nWH9gAAAABJRU5ErkJggg==) no-repeat;
        }
    }
    .meeting-schedule {
        header {
            padding: 0 24px;
            display: flex;
            align-items: center;
            position: absolute;
            right: 252px;
            left: 12px;
            top: 12px;
            height: 60px;
            z-index: 1000;
            background-color: #fff;
            .btn-group {
                margin-right: 12px;
            }
            .text {
                font-size: 20px;
                font-weight: 700;
            }
        }
        aside {
            padding: 100px 24px 0 24px;
            position: absolute;
            right: 12px;
            top: 12px;
            bottom: 24px;
            width: 240px;
            z-index: 1000;
            background-color: #fff;
            border-right: 1px solid #ddd;
            user-select: none;
        }
        .schedule-wrap {
            position: absolute;
            right: 252px;
            left: 12px;
            top: 72px;
            bottom: 24px;
            z-index: 1000;
        }
    }
</style>
<script>
    import VueTuicalendar from '@/baseComponents/TuiCalendar'
    import 'tui-calendar/dist/tui-calendar.min.css'
    import moment from 'moment'
    const calendarsGlobal = [
        {
            id: '1',
            name: '会议室101',
            color: '#ffffff',
            bgColor: '#00a9ff',
            dragBgColor: '#00a9ff',
            borderColor: '#00a9ff'
        },
        {
            id: '2',
            name: '会议室301',
            color: '#ffffff',
            bgColor: '#9e5fff',
            dragBgColor: '#9e5fff',
            borderColor: '#9e5fff'
        },
        {
            id: '3',
            name: '会议室302',
            color: '#ffffff',
            bgColor: '#ff4040',
            dragBgColor: '#ff4040',
            borderColor: '#ff4040'
        },
        {
            id: '4',
            name: '会议室307',
            color: '#ffffff',
            bgColor: '#03bd9e',
            dragBgColor: '#03bd9e',
            borderColor: '#03bd9e'
        },
        {
            id: '5',
            name: '会议室407',
            color: '#ffffff',
            bgColor: '#8ba017',
            dragBgColor: '#8ba017',
            borderColor: '#8ba017'
        }
    ]
    export default {
        name: 'meetingRecord',
        components: {VueTuicalendar},
        data() {
            return {
                checkedArr: ['1', '2', '3', '4', '5'],
                isAll: true,
                rangeText: '',
                checkOption: calendarsGlobal,
                options: {
                    defaultView: 'week',
                    useCreationPopup: true,
                    useDetailPopup: true,
                    taskView: false,
                    scheduleView: ['time'],
                    calendars: calendarsGlobal,
                    template: {
                        time: function(schedule) {
                            let startTime = moment(schedule.start._date).format('HH:mm')
                            let endTime = moment(schedule.end._date).format('HH:mm')
                            return `<dl class="sec-dl"><dt class="sec-dt">创建人</dt><dd class="sec-dd">${schedule.raw.creator.name}</dd></dl><dl class="sec-dl"><dt class="sec-dt">会议名称</dt><dd class="sec-dd">${schedule.title}</dd></dl><dl class="sec-dl"><dt class="sec-dt">会议时间</dt><dd class="sec-dd">${startTime} - ${endTime}</dd></dl>`
                        }
                    },
                    timezones: [{
                        timezoneOffset: 480,
                        displayLabel: 'GMT+08:00'
                    }],
                    week: {
                        daynames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                    }
                },
                schedulesAll: [],
                schedules: [],
                rangeStartDate: '2018-11-11',
                rangeEndDate: '2018-11-17'
            }
        },
        watch: {
            checkedArr(val) {
                const valueLen = val.length
                this.isAll = valueLen === calendarsGlobal.length;
                this.setNeedSchedules()
            }
        },
        mounted() {
            setTimeout(() => {
                this.setRenderRangeText()
                this.setNeedSchedules()
            }, 20)
        },
        methods: {
            findCalendar(id) {
                return calendarsGlobal.find(x => x.id === id)
            },
            thisFireMethods(method, ...args) {
                return this.$refs.calendar.fireMethod(method, ...args)
            },
            beforeCreateScheduleHandler(scheduleData) {
                this.createNewSchedule(scheduleData)
            },
            updateScheduleHandler(schedule) {
                const scheduleData = schedule.schedule
                let obj = {}
                obj.id = scheduleData.id
                obj.meetingRoomId = scheduleData.calendarId
                obj.startTime = moment(schedule.start.getTime()).format('YYYY-MM-DD HH:mm:ss')
                obj.endTime = moment(schedule.end.getTime()).format('YYYY-MM-DD HH:mm:ss')
                obj.location = scheduleData.location
                obj.title = scheduleData.title
                this.$http.post('meeting/addLog', obj).then((res) => {
                    if (res.success) {
                        this.getRangeScheduleData()
                    }
                })
            },
            deleteScheduleHandler({schedule}) {
                let data = {
                    id: schedule.id
                }
                this.$http.post('meeting/deleteMeeting', data).then((res) => {
                    if (res.success) {
                        this.getRangeScheduleData()
                    }
                })
            },
            setRenderRangeText() {
                let html = [];
                html.push(moment(this.thisFireMethods('getDateRangeStart').getTime()).format('YYYY.MM.DD'));
                html.push(' ~ ');
                html.push(moment(this.thisFireMethods('getDateRangeEnd').getTime()).format(' MM.DD'));
                this.rangeStartDate = moment(this.thisFireMethods('getDateRangeStart').getTime()).format('YYYY-MM-DD');
                this.rangeEndDate = moment(this.thisFireMethods('getDateRangeEnd').getTime()).format('YYYY-MM-DD');
                this.rangeText = html.join('');
                this.getRangeScheduleData()
            },
            toPrew() {
                this.thisFireMethods('prev')
                this.setRenderRangeText()
            },
            toNext() {
                this.thisFireMethods('next')
                this.setRenderRangeText()
            },
            checkallChange(e) {
                const isChecked = e.target.checked
                if (isChecked) {
                    this.checkedArr = calendarsGlobal.map(x => x.id)
                } else {
                    this.checkedArr = []
                }
            },
            setNeedSchedules() {
                this.schedules = this.schedulesAll.filter((item) => {
                    return this.checkedArr.indexOf(item.calendarId) > -1
                })
            },
            createNewSchedule(scheduleData) {
                let obj = {}
                obj.meetingRoomId = scheduleData.calendarId
                obj.startTime = moment(scheduleData.start.getTime()).format('YYYY-MM-DD HH:mm:ss')
                obj.endTime = moment(scheduleData.end.getTime()).format('YYYY-MM-DD HH:mm:ss')
                obj.location = scheduleData.location
                obj.title = scheduleData.title
                this.$http.post('meeting/addLog', obj).then((res) => {
                    if (res.success) {
                        this.getRangeScheduleData()
                    }
                })
            },
            generateSchedules(data) {
                let storeArr = []
                data.forEach((item) => {
                    let calendar = this.findCalendar(item.meetingroomid + '')
                    let obj = {}
                    obj.id = item.id
                    obj.calendarId = item.meetingroomid + ''
                    obj.title = item.title
                    obj.category = 'time'
                    obj.start = item.starttime
                    obj.end = item.endtime
                    obj.isReadOnly = !item.caneditor
                    obj.location = item.location
                    obj.color = '#fff'
                    obj.bgColor = calendar.bgColor
                    obj.borderColor = calendar.borderColor
                    obj.dragBgColor = calendar.dragBgColor
                    obj.raw = {
                        location: item.location,
                        creator: {
                            name: item.creater
                        }
                    }
                    storeArr.push(obj)
                })
                return storeArr
            },
            getRangeScheduleData() {
                let {rangeStartDate, rangeEndDate} = this
                let params = {
                    rangeStartDate,
                    rangeEndDate
                }
                this.$http.get('meeting/meetingList', {params}).then((res) => {
                    if (res.success) {
                        this.schedulesAll = this.generateSchedules(res.data);
                        this.setNeedSchedules()
                    }
                })
            }
        }
    }
</script>
