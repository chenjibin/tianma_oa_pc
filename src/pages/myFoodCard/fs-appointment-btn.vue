<template>
    <div class="fs-appointment-btn">
        <Button type="primary" size="large" :disabled="states === 1" @click.stop="_appointmentHandler">
            <span v-if="states === 0">预约{{typeTitle}}</span>
            <span v-else>{{typeTitle}}已预约</span>
        </Button>
        <Tooltip content="取消预约" v-if="states === 1">
            <Button type="error"
                    shape="circle"
                    icon="close"
                    style="margin-top: 12px"
                    @click="_cancelAppointment"></Button>
        </Tooltip>
    </div>
</template>
<style lang="less">
    .fs-appointment-btn {
        margin: 0 16px;
        display: flex;
        flex-direction: column;
    }
</style>
<script>
    export default {
        name: 'FsAppointmentBtn',
        props: {
            states: {
                type: Number,
                required: true
            },
            id: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            typeTitle: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            }
        },
        data() {
            return {}
        },
        methods: {
            _cancelAppointment() {
                this.$Modal.confirm({
                    title: '确认取消预约提醒',
                    content: `确定取消预约${this.date}${this.typeTitle}？`,
                    okText: '确认取消',
                    cancelText: '关闭',
                    onOk: () => {
                        let sendData = {}
                        sendData.id = this.id
                        sendData[this.type] = 0
                        sendData.date = this.date
                        this.$http.post('card/addAppointment', sendData).then((res) => {
                            if (res.success) {
                                this.$emit('states-change')
                            }
                        })
                    }
                });
            },
            _appointmentHandler() {
                this.$Modal.confirm({
                    title: '确认预约提醒',
                    content: `确定预约${this.date}${this.typeTitle}？`,
                    okText: '确认预约',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {}
                        sendData.id = this.id
                        sendData[this.type] = 1
                        sendData.date = this.date
                        this.$http.post('card/addAppointment', sendData).then((res) => {
                            if (res.success) {
                                this.$emit('states-change')
                            }
                        })
                    }
                });
            }
        },
        components: {}
    }
</script>
