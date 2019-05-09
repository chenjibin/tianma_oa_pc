<template>
    <div>
        <Card>
            <Form ref="searchData" :model="searchData" inline :label-width="65">
                <FormItem prop="cardNumber" label="卡号">
                    <Input type="text"
                           clearable
                           v-model="searchData.cardNumber.value"
                           placeholder="筛选卡号"></Input>
                </FormItem>
                <FormItem prop="realName" label="姓名">
                    <Input type="text"
                           clearable
                           v-model="searchData.userName.value"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem prop="good_name" label="商品名称">
                    <Input type="text"
                           clearable
                           v-model="searchData.good_name.value"
                           placeholder="筛选商品名称"></Input>
                </FormItem>
                <FormItem label="类型" prop="type" >
                    <Select v-model="searchData.type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 160px">
                        <Option v-for="(item,index) in typeStore" :value="index" :key="'type-log-' + index">{{item}}</Option>
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
                <FormItem :label-width="0.1">
                    <Button type="primary" :loading="exportLoading" :disabled="'' == searchData.start.value || '' == searchData.end.value" icon="ios-cloud-download-outline" @click="_exportGrade">
                        <span v-if="!exportLoading">导出</span>
                        <span v-else>导出中...</span>
                    </Button>
                    <Button type="primary" :loading="exportLoading" :disabled="'' == searchData.start.value" icon="ios-cloud-download-outline" @click="_exportMoney">
                        <span v-if="!exportLoading">补贴导出</span>
                        <span v-else>导出中...</span>
                    </Button>
                </FormItem>
                <FormItem :label-width="0.1">
                    <div class="" style="font-size: 16px;font-weight: 700;">
                        <span>消费金额:</span>
                        <span style="color: green">{{totalMoney}}</span>元 (<span STYLE="color: red">不选时间计算当天</span>)
                    </div>
                </FormItem>
            </Form>
            <fs-table-page :columns="columns1"
                           :size="null"
                           :height="tableHeight"
                           :params="searchData"
                           @get-list="_getTotalMoney"
                           ref="userTable"
                           url="/card/logList"></fs-table-page>
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
                tableHeight: 500,
                totalMoney: 0,
                typeStore: [
                    '充值(支付宝)',
                    '食堂消费',
                    '餐卡状态变更',
                    '食堂退款',
                    '',
                    '',
                    '',
                    '',
                    '补贴(公司)',
                    '初始值(100)',
                    '小超市消费',
                    '小超市退款'
                ],
                columns1: [
                    {
                        title: '姓名',
                        key: 'username',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '卡号',
                        key: 'cardnumber',
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
                        title: '金额',
                        key: 'money',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '类型',
                        key: 'type',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            return h('span', this.typeStore[+params.row.type])
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'good_name',
                        align: 'center',
                        width: 350
                    },
                    {
                        title: '消费时间',
                        key: 'add_time',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '备注',
                        key: 'beizhu',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '操作人',
                        key: 'createname',
                        align: 'center',
                        minWidth: 160
                    }
                    // ,
                    // {
                    //     title: '操作',
                    //     width: 80,
                    //     render: (h, params) => {
                    //         let vm = this;
                    //         let returnBtn = params.row.type === 0 ? h('Button', {
                    //             props: {
                    //                 type: 'primary',
                    //                 icon: 'reply',
                    //                 shape: 'circle'
                    //             },
                    //             attrs: {
                    //                 title: '退款'
                    //             },
                    //             on: {
                    //                 click: function () {
                    //                     vm._returnMoney(params.row);
                    //                 }
                    //             },
                    //             style: {
                    //                 marginRight: '4px'
                    //             }
                    //         }) : ''
                    //         return h('div', [returnBtn]);
                    //     }
                    // }
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
                    good_name: {
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
        },
        methods: {
            // 导出消费明细
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
            // 补贴导出
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
                this.tableHeight = dm - 330;
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
