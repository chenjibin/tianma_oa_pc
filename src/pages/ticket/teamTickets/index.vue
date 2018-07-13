<template>
    <!--项目组看到的页面，可以指派，选择项目周期-->
    <div id="teamTickets">
        <Card>
            <Form inline style="width: 100%" :label-width="90">
                <FormItem label="状态">
                    <Select v-model="filterOpt.type.value" style="width: 150px" placeholder="筛选状态" clearable>
                        <Option value="0">待处理</Option>
                        <Option value="1">处理中</Option>
                        <Option value="2">已完成</Option>
                        <Option value="3">已暂停</Option>
                        <Option value="4">不处理</Option>
                    </Select>
                </FormItem>
                <FormItem label="接单人">
                <Input v-model="filterOpt.user_name.value" style="width: 150px" placeholder="筛选状态"
                       clearable></Input>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker type="date" @on-change="changeDate(1, 'start_time', $event)"
                                :value="filterOpt.start_time.value" placeholder="开始日期"
                                style="width: 150px"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="date" @on-change="changeDate(1, 'end_time', $event)"
                                :value="filterOpt.end_time.value" placeholder="结束日期" style="width: 150px"></DatePicker>
                </FormItem>
                <FormItem label="提交人">
                    <Input v-model="filterOpt.add_user_name.value" style="width: 150px" placeholder="筛选状态"
                           clearable></Input>
                </FormItem>
                <FormItem label="关键词">
                    <Input v-model="filterOpt.detail.value" style="width: 150px" placeholder="筛选标题或详情"
                           clearable></Input>
                </FormItem>
                <FormItem label="优先级">
                    <Select v-model="filterOpt.priority.value" style="width: 150px" placeholder="筛选优先级"
                            clearable>
                        <Option :value="1">普通
                            <Icon type="flag" color="#2d8cf0"></Icon>
                        </Option>
                        <Option :value="2">重要
                            <Icon type="flag" color="#ff9900"></Icon>
                        </Option>
                        <Option :value="3">加急
                            <Icon type="flag" color="#ed3f14"></Icon>
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null" ref="paperList" :height="tableHeight" :params="filterOpt"
                           url="/workOrder/chargerWorkOrderList"></fs-table-page>
        </Card>

        <Modal v-model="editTicketsModal" :mask-closable="false" :closable="false" :width="400"
               class-name="vertical-center-modal">
            <Form :label-width="60" style="padding: 5px">
                <input style="display: none" v-model="editTicketsModal.id"/>
                <FormItem label="需求名">
                    <span v-text="editTickets.demand" :title="editTickets.demand"
                          style="width: 300px;overflow: hidden;display: inline-block;white-space: nowrap;text-overflow: ellipsis;"></span>
                </FormItem>
                <FormItem label="创建人" style="width: 270px">
                    <span v-text="editTickets.add_user_name"></span>
                </FormItem>
                <FormItem label="开始时间" style="width: 340px;display: inline-block">
                    <DatePicker type="date" style="width: 100%" @on-change="changeDate(2, 'start_time',$event)"
                                :value="editTickets.start_time"></DatePicker>
                </FormItem>
                <FormItem label="结束时间" style="width: 340px;display: inline-block">
                    <DatePicker type="date" style="width: 100%" @on-change="changeDate(2, 'end_time', $event)"
                                :value="editTickets.end_time"></DatePicker>
                </FormItem>
                <FormItem label="特殊调整" style="width: 340px;display: inline-block">
                    <Select style="width: 100%" v-model="editTickets.type" @on-change="changeType" placeholder="默认不填">
                        <Option :value="1">处理中</Option>
                        <Option :value="3">暂停</Option>
                        <Option :value="4">驳回</Option>
                    </Select>
                </FormItem>
                <FormItem label="指派人员" style="width: 340px;display: inline-block">
                    <Select v-model="usersIds" multiple>
                        <Option v-for="option in teamOpt" v-if="option.pid === editTickets.team_id" :value="option.uid"
                                :key="'user2' + option.uid">{{option.uname}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="历史" style="width: 340px;">
                    <div style="width: 100%;max-height: 250px;overflow-x: hidden;overflow-y: auto">
                        <p :key="item.id" v-for="item in logs" v-if="+item.type === 0">
                            {{item.content}}
                        </p>
                    </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editTicketsModal = false">取消</Button>
                <Button :disabled="+editTickets.type === 2" type="primary" :loading="saveLoading" @click="save">保存
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import pageMixin from '@/mixins/pageMixin';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import expandRow from '../myCreateTickets/table-expand';
    import moment from 'moment';

    export default {
        name: 'teamTickets',
        data: function () {
            return {
                editTicketsModal: false,
                saveLoading: false,
                logs: [],
                usersIds: [],
                userslabels: [],
                editTickets: {
                    id: '',
                    start_time: '',
                    end_time: '',
                    team_id: 1,
                    add_user_name: '',
                    type: 0,
                    demand: '',
                    priority: 1
                },
                teamOpt: [],
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
                        type: 'input',
                        value: ''
                    },
                    detail: {
                        type: 'input',
                        value: ''
                    },
                    user_name: {
                        type: 'input',
                        value: ''
                    }
                },
                typeMapping: ['待处理', '处理中', '已完成', '已暂停', '不处理'],
                typeIconMapping: ['pull-request', 'compose', 'android-checkbox-outline', 'ios-pause', 'android-close'],
                typeColorMapping: ['#2d8cf0', '#2d8cf0', '#19be6b', '#2d8cf0', '#ccc'],
                tableLoading: false,
                remoteLabel: [],
                remoteLabel2: [],
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
                        minWidth: 100
                    },
                    {
                        title: '提单人',
                        key: 'add_user_name',
                        width: 90
                    },
                    {
                        title: '接单人',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let users = '';
                            params.row.childids.forEach((item) => {
                                users += item.user_name + ' ';
                            });
                            if (users) {
                                return h('span', users);
                            } else {
                                return h('span', '未指派');
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'type',
                        width: 75,
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
                        title: '添加时间',
                        className: 'noPadding',
                        key: 'add_time',
                        align: 'center',
                        width: 190
                    },
                    {
                        title: '开始日期',
                        className: 'noPadding',
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
                        className: 'noPadding',
                        align: 'center',
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
                        title: '操作',
                        key: 'action',
                        width: 160,
                        align: 'left',
                        className: 'noPadding',
                        render: (h, params) => {
                            let vm = this;
                            let row = params.row;
                            let disable = row.type === 2;
                            return h('ButtonGroup', [
                                h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            disabled: disable
                                        },
                                        attrs: {
                                            title: '点击调整'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm.editTicketsModal = true;
                                                vm.logs = row.logs;
                                                vm.usersIds = [];
                                                vm.editTickets.id = row.id;
                                                vm.editTickets.demand = row.demand;
                                                vm.editTickets.team_id = row.team_id;
                                                vm.editTickets.start_time = row.start_time;
                                                vm.editTickets.end_time = row.end_time;
                                                vm.editTickets.add_user_name = row.add_user_name;
                                                vm.editTickets.type = row.type;
                                                vm.editTickets.priority = row.priority;
                                                console.log(row.childids);
                                                row.childids.forEach((item) => {
                                                    vm.usersIds.push(item.userid);
                                                });
                                            }
                                        }
                                    }, '调整'
                                )
                            ]);
                        }
                    }
                ],
                tableHeight: 700
            };
        },
        components: {fsTablePage, expandRow, WangEditor},
        mixins: [pageMixin],
        methods: {
            changeType(val) {
                let vm = this;
                // 未指派
                if (val === 0) {
                    vm.usersIds = [];
                } else if (val === 1) {
                    this.$Modal.info('一般不需要手动调整，别忘记指派人哦！');
                }
            },
            save() {
                let vm = this;
                let d = this.editTickets;
                if (d.type === 0 || d.type === 1 || d.type === 2 || d.type === 3) {
                    if (!d.start_time || !d.end_time) {
                        this.$Message.info('未选择时间');
                        return false;
                    }
                    if (moment(d.start_time).isAfter(d.end_time)) {
                        this.$Message.info('开始时间晚于结束时间，请检查');
                        return false;
                    }
                    if (!vm.usersIds || vm.usersIds.length === 0) {
                        this.$Message.info('未选择成员');
                        return false;
                    }
                }
                if (d.type === 0) {
                    d.type = 1;
                }
                d.ids = vm.usersIds.join(',');
                this.saveLoading = true;
                this.$http.post('/workOrder/addOrder', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('调整需求成功');
                        this.$refs.paperList.getListData();
                        // 数据还原
                        this.editTickets.id = '';
                        this.editTickets.detail = '';
                        this.editTickets.team_id = '';
                        this.editTickets.team_name = '';
                        this.editTickets.demand = '';
                        this.editTickets.accessory = '';
                        this.editTickets.priority = 1;
                    }
                    this.saveLoading = false;
                    this.editTicketsModal = false;
                }, () => {
                    this.saveLoading = false;
                    this.editTicketsModal = false;
                })
            },
            changeDate(type, name, time) {
                if (type === 1) {
                    this.filterOpt[name].value = time;
                } else if (type === 2) {
                    this.editTickets[name] = time;
                }
            },
            _filterPeopleRemote(val) {
                let data = {};
                data.page = 1;
                data.pageSize = 99;
                data.me = 1;
                this.$http.get('/workOrder/teamList', {params: data}).then((res) => {
                    if (res.success) {
                        let d = res.data;
                        let users = [];
                        d.forEach((item) => {
                            if (item.childids) {
                                users = users.concat(item.childids);
                            }
                        });
                        this.teamOpt = users;
                    }
                });
            }
        },
        created() {
            this._filterPeopleRemote();
        }
    };
</script>

<style lang="less">
    #myCreateTickets {
        .noPadding div {
            padding: 0;
        }
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal {
            top: 0;
        }
    }
</style>
