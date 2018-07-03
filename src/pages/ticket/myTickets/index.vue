<template>
    <div id="myTickets">
        <Card>
            <Form inline style="width: 100%" :label-width="90">
                <FormItem label="状态" style="width: 250px">
                    <Select v-model="filterOpt.type.value"  placeholder="筛选状态"  clearable>
                        <Option value="1">处理中</Option>
                        <Option value="2">已完成</Option>
                        <Option value="3">已暂停</Option>
                        <Option value="4">不处理</Option>
                    </Select>
                </FormItem>
                <FormItem label="优先级" style="width: 250px">
                    <Select v-model="filterOpt.priority.value" placeholder="筛选优先级"
                            clearable>
                        <Option :value="1">普通 <Icon type="flag" color="#2d8cf0"></Icon></Option>
                        <Option :value="2">重要 <Icon type="flag" color="#ff9900"></Icon></Option>
                        <Option :value="3">加急 <Icon type="flag" color="#ed3f14"></Icon></Option>
                    </Select>
                </FormItem>
                <FormItem label="权重" style="width: 250px">
                    <Select v-model="filterOpt.weight.value" placeholder="筛选状态"
                            clearable>
                        <Option value="0.1">0.1</Option>
                        <Option value="0.2">0.2</Option>
                        <Option value="0.3">0.3</Option>
                        <Option value="0.4">0.4</Option>
                        <Option value="0.5">0.5</Option>
                        <Option value="0.6">0.6</Option>
                        <Option value="0.7">0.7</Option>
                        <Option value="0.8">0.8</Option>
                        <Option value="0.9">0.9</Option>
                        <Option value="1">1</Option>
                    </Select>
                </FormItem>
                <FormItem label="提交人" style="width: 250px">
                    <Input v-model="filterOpt.add_user_name.value" placeholder="筛选状态" clearable></Input>
                </FormItem>
                <FormItem label="开始日期" style="width: 250px">
                    <DatePicker type="date" @on-change="changeDate(1, 'start_time', $event)" :value="filterOpt.start_time.value" placeholder="开始日期" ></DatePicker>
                </FormItem>
                <FormItem label="结束日期" style="width: 250px">
                    <DatePicker type="date" @on-change="changeDate(1, 'end_time', $event)" :value="filterOpt.end_time.value" placeholder="结束日期" ></DatePicker>
                </FormItem>
                <Button @click="monthSalaryModal = true">查看：绩效</Button>
            </Form>
            <Modal v-model="monthSalaryModal" width="360">
                <p slot="header" style="color:#2d8cf0;text-align:center">
                    <span>查询绩效</span>
                </p>
                <Form :label-width="90">
                    <FormItem label="指定月份">
                        <DatePicker type="month" @on-change="searchSalary" placeholder="开始日期" style="width: 150px"></DatePicker>
                    </FormItem>
                    <FormItem label="明细">
                        <p>
                            <span style="width: 100px;display: inline-block;">总绩效分：</span><span title="双击打开计算器" v-on:dblclick="showcalc = !showcalc">{{totalComputed}} 分</span>
                        </p>
                        <p>
                            <span style="width: 100px;display: inline-block;">团队完成需求数：</span><span>{{monthSalary.allcount}} 个</span>
                        </p>
                        <p>
                            <span style="width: 100px;display: inline-block;">团队扣分需求数：</span><span>{{monthSalary.lesscount}} 个</span>
                        </p>
                        <p>
                            <span style="width: 100px;display: inline-block;">我贡献的需求数：</span><span>{{monthSalary.myaccount}} 个</span>
                        </p>
                        <p>
                            <span style="width: 100px;display: inline-block;">我扣分的需求数：</span><span>{{monthSalary.mylessaccount}} 个</span>
                        </p>
                    </FormItem>
                    <FormItem v-show="showcalc" label="简易计算器" style="width: 240px">
                        <InputNumber style="width: 100%" @on-change="changeMoney" :value="1000" :step="1000" :min="0" placeholder="输入绩效基本金"></InputNumber>
                    </FormItem>
                    <FormItem v-show="showcalc"  label="浮动" style="width: 240px">
                        <span>{{money}}</span>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="monthSalaryModal = false">关闭</Button>
                </div>
            </Modal>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           ref="paperList"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/workOrder/myOrder"></fs-table-page>
        </Card>
    </div>
</template>

<script>
    import pageMixin from '@/mixins/pageMixin';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import expandRow from '../myCreateTickets/table-expand';
    import moment from 'moment';
    import FsForm from '../../../baseComponents/fs-form/form';

    export default {
        name: 'myTickets',
        data() {
            return {
                monthSalaryModal: false,
                filterPeopleOpt: [],
                typeMapping: ['待处理', '处理中', '已完成', '已暂停', '不处理'],
                typeIconMapping: ['pull-request', 'compose', 'android-checkbox-outline', 'ios-pause', 'android-close'],
                typeColorMapping: ['#2d8cf0', '#2d8cf0', '#19be6b', '#2d8cf0', '#ccc'],
                tableLoading: false,
                remoteLabel: [],
                remoteLabel2: [],
                money: 0,
                showcalc: false,
                monthSalary: {
                    total: 100,
                    allcount: 0,
                    weight: 1,
                    lesscount: 0,
                    myaccount: 0,
                    mylessaccount: 0
                },
                filterOpt: {
                    weight: {
                        value: '',
                        type: 'select'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    },
                    start_time: {
                        value: '',
                        type: 'datepicker'
                    },
                    end_time: {
                        value: '',
                        type: 'datepicker'
                    },
                    priority: {
                        value: '',
                        type: 'select'
                    },
                    add_user_name: {
                        value: '',
                        type: 'input'
                    }
                },
                postColumns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        title: '工单名',
                        key: 'demand',
                        minWidth: 150
                    },
                    {
                        title: '提单人',
                        key: 'add_user_name',
                        width: 90
                    },
                    {
                        title: '状态',
                        key: 'type',
                        width: 70,
                        align: 'center',
                        render: (h, params) => {
                            let type = params.row.type;
                            let typeText = this.typeMapping[type];
                            let typeIcon = this.typeIconMapping[type];
                            let typeColor = this.typeColorMapping[type];
                            return h('Icon', {
                                props: {
                                    type: typeIcon,
                                    size: '26',
                                    color: typeColor
                                },
                                attrs: {
                                    title: typeText
                                }
                            });
                        }
                    },
                    {
                        title: '开始日期',
                        key: 'start_time',
                        align: 'center',
                        width: 190,
                        render: (h, params) => {
                            let time = params.row.start_time;
                            if (!time) {
                                return h('span', '未设置');
                            } else {
                                return h('span', moment(time).format('YYYY年MM月DD日'));
                            }
                        }
                    },
                    {
                        title: '结束日期',
                        key: 'end_time',
                        align: 'center',
                        sortable: true,
                        width: 190,
                        render: (h, params) => {
                            let time = params.row.end_time;
                            if (!time) {
                                return h('span', '未设置');
                            } else {
                                return h('span', moment(time).format('YYYY年MM月DD日'));
                            }
                        }
                    },
                    {
                        title: '剩余时间',
                        className: 'noPadding',
                        align: 'center',
                        width: 95,
                        render: (h, params) => {
                            let mo1 = params.row.start_time;
                            let mo2 = params.row.end_time;

                            if (!mo1 || !mo2) {
                                return h('span', '未开始');
                            } else {
                                if (moment(mo2).hour(24).isBefore(moment())) {
                                    return h('span', '已结束');
                                } else {
                                    return h('span', moment(mo2).hour(24).fromNow());
                                }
                            }
                        }
                    },
                    {
                        title: '权重',
                        key: 'weight',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '优先级',
                        key: 'priority',
                        align: 'center',
                        width: 75,
                        render: (h, params) => {
                            let priority = params.row.priority;
                            let priorityMapping = ['', '普通', '重要', '加急'];
                            let priorityColorMapping = ['', '#2d8cf0', '#ff9900', '#ed3f14'];
                            let priorityText = priorityMapping[priority];
                            let priorityColor = priorityColorMapping[priority];
                            return h('Icon', {
                                props: {
                                    type: 'flag',
                                    size: '26',
                                    color: priorityColor
                                },
                                attrs: {
                                    title: priorityText
                                }
                            });
                        }
                    },
                    {
                        title: '业务质量分',
                        align: 'center',
                        width: 97,
                        key: 'business_qualityscore'
                    },
                    {
                        title: '业务进度分',
                        align: 'center',
                        width: 97,
                        key: 'business_planscore'
                    },
                    {
                        title: '上级质量分',
                        align: 'center',
                        width: 97,
                        key: 'superior_qualityscore'
                    },
                    {
                        title: '上级进度分',
                        align: 'center',
                        width: 97,
                        key: 'superior_planscore'
                    },
                    {
                        title: '合计',
                        align: 'center',
                        width: 97,
                        key: 'total_score',
                        render: (h, params) => {
                            let row = params.row;
                            if (row.business_qualityscore && row.business_planscore && row.superior_qualityscore && row.superior_planscore) {
                                if (row.total_score) {
                                    return h('span', row.total_score * 1.0 / 100);
                                }
                            } else {
                                return h('span', '未评分');
                            }
                        }
                    }
                ],
                tableHeight: 700
            };
        },
        components: {FsForm, fsTablePage, expandRow},
        mixins: [pageMixin],
        methods: {
            changeDate(type, name, time) {
                if (type === 1) {
                    this.filterOpt[name].value = time;
                } else if (type === 2) {
                    this.editTickets[name] = time;
                }
            },
            changeMoney(val) {
                let t = this.totalComputed;
                this.money = (t / 100 - 1) * val;
            },
            searchSalary(val) {
                console.log(val);
                let d = {}, vm = this;
                d.time = val;
                d.user_id = this.user_id;
                this.$http.post('/workOrder/total', d).then((res) => {
                    vm.monthSalary.allcount = res.data.allcount;
                    vm.monthSalary.lesscount = res.data.lesscount;
                    vm.monthSalary.total = res.data.total;
                    vm.monthSalary.weight = res.data.weight;
                    vm.monthSalary.myaccount = res.data.myaccount;
                    vm.monthSalary.mylessaccount = res.data.mylessaccount;
                });
            }
        },
        created() {
            moment.locale('zh-cn', {
                relativeTime: {
                    future: '%s 后',
                    past: '%s 前',
                    s: '秒',
                    m: '1 分钟',
                    mm: '%d 分钟',
                    h: '1 小时',
                    hh: '%d 小时',
                    d: '1 天',
                    dd: '%d 天',
                    M: '1 月',
                    MM: '%d 月',
                    y: '1 年',
                    yy: '%d 年'
                }
            });
        },
        computed: {
            nickName() {
                return this.$store.state.user.userInfo.realname;
            },
            user_id() {
                return this.$store.state.user.userInfo.id;
            },
            totalComputed() {
                let weight = this.monthSalary.weight;
                let total = this.monthSalary.total || 0.0;
                if (weight >= 1) {
                    return (total / 100).toFixed(2);
                } else {
                    let last = 10000 * (1 - weight);
                    return ((last + total) / 100).toFixed(2);
                }
            }
        }
    };
</script>

<style scoped>

</style>
