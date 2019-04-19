<template>
    <div>
        <Card>
            <Form ref="searchData" :model="searchData" inline :label-width="60">
                <FormItem prop="good_name" label="商品名称">
                    <Input type="text"
                           clearable
                           v-model="searchData.good_name.value"
                           placeholder="筛选商品名称"></Input>
                </FormItem>
                <FormItem prop="realName" label="操作人">
                    <Input type="text"
                           clearable
                           v-model="searchData.userName.value"
                           placeholder="筛选操作人"></Input>
                </FormItem>
                <FormItem prop="realName" label="内容">
                    <Input type="text"
                           clearable
                           v-model="searchData.content.value"
                           placeholder="筛选内容"></Input>
                </FormItem>
                <FormItem label="属性" prop="states">
                    <Select v-model="searchData.states.value"
                            clearable
                            placeholder="筛选属性"
                            style="width: 160px">
                        <Option value="增加">增加</Option>
                        <Option value="减少">减少</Option>
                        <Option value="初始值">初始值</Option>
                        <Option value="删除">删除</Option>
                    </Select>
                </FormItem>
                <FormItem prop="start" label="开始日期">
                    <DatePicker type="date"
                                @on-change="_startDateChange"
                                placeholder="开始日期"
                                :value="searchData.start.value"></DatePicker>
                </FormItem>
                <FormItem prop="end" label="结束日期">
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
                           @get-list="_getTotalMoney"
                           ref="userTable"
                           url="/card/mallLogList"></fs-table-page>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page'
    import utils from '@/libs/util'
    export default {
        name: 'foodCardLog',
        data() {
            return {
                exportLoading: false,
                tableHeight: 400,
                totalMoney: 0,
                typeStore: [
                    '充值',
                    '消费',
                    '餐卡状态变更信息',
                    '消费退款记录',
                    '已退款的消费记录',
                    '充值退款记录',
                    '已退款的充值记录',
                    '异常记录',
                    '补贴',
                    '初始值',
                    '小超市消费',
                    '小超市退款',
                    '商品变更信息'
                ],
                columns1: [
                    {
                        title: '商品名称',
                        key: 'good_name',
                        align: 'center',
                        width: 350
                    },
                    {
                        title: '属性',
                        key: 'states',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '变动数量',
                        key: 'money',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        width: 400
                    },
                    {
                        title: '变更时间',
                        key: 'add_time',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '操作人',
                        key: 'createname',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '备注',
                        key: 'beizhu',
                        align: 'center',
                        minWidth: 160
                    }
                ],
                searchData: {
                    cardNumber: {
                        value: '',
                        type: 'input'
                    },
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    content: {
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
                    },
                    states: {
                        value: '',
                        type: 'select'
                    },
                    good_name: {
                        value: '',
                        type: 'input'
                    }
                }
            }
        },
        created() {
            this._setHeight()
        },
        methods: {
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                let searchData = this.searchData;
                data.userName = searchData.userName.value;
                data.cardNumber = searchData.cardNumber.value;
                data.start = searchData.start.value;
                data.end = searchData.end.value;
                data.type = searchData.type.value;
                this.$http.post('/card/exportDetail', data).then((res) => {
                    if (res.success) {
                        utils.downloadFile(res.path, res.filename)
                    }
                    this.exportLoading = false;
                }, () => {
                    this.exportLoading = false;
                })
            },
            _exportMoney() {
                this.exportLoading = true;
                let data = {};
                let searchData = this.searchData;
                data.userName = searchData.userName.value;
                data.cardNumber = searchData.cardNumber.value;
                data.start = searchData.start.value;
                data.end = searchData.end.value;
                data.type = searchData.type.value;
                this.$http.post('/card/exportSubsidy', data).then((res) => {
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
            },
            _endDateChange(date) {
                this.searchData.end.value = date
            },
            _returnMoney(data) {
                this.$Modal.confirm({
                    title: '退款提醒',
                    content: `确认对（${data.content}）这条记录进行退款麽？`,
                    okText: '确认退款',
                    cancelText: '取消',
                    onOk: () => {
                        this.$http.post('/card/refundByAdmin', {id: data.id}).then((res) => {
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
            _setHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _getTotalMoney(params) {
                this.$http.get('/card/getTotal', {params: params}).then((res) => {
                    if (res.success) {
                        this.totalMoney = res.data.total
                    }
                })
            }
        },
        components: {
            fsTablePage
        }
    }
</script>
