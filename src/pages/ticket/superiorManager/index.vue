<template>
    <!--直属上级看到的页面 可以打分，设置权重-->
    <div id="superiorManager">
        <Card>
            <Form inline style="width: 100%" :label-width="90">
                <FormItem label="工单id" style="width: 220px">
                    <Input v-model="filterOpt.id.value" style="width: 150px" placeholder="筛选id" clearable></Input>
                </FormItem>
                <FormItem label="状态" style="width: 220px">
                    <Select style="width: 100%" v-model="filterOpt.type.value" placeholder="筛选状态"  clearable>
                        <Option value="0">待处理</Option>
                        <Option value="1">处理中</Option>
                        <Option value="2">已完成</Option>
                        <Option value="3">已暂停</Option>
                        <Option value="4">不处理</Option>
                    </Select>
                </FormItem>
                <FormItem label="优先级" style="width: 220px">
                    <Select style="width: 100%" v-model="filterOpt.priority.value" placeholder="筛选优先级" clearable>
                        <Option :value="1">普通 <Icon type="flag" color="#2d8cf0"></Icon></Option>
                        <Option :value="2">重要 <Icon type="flag" color="#ff9900"></Icon></Option>
                        <Option :value="3">加急 <Icon type="flag" color="#ed3f14"></Icon></Option>
                    </Select>
                </FormItem>
                <FormItem label="项目组" style="width: 220px">
                    <Select v-model="filterOpt.team_id.value" filterable clearable>
                        <Option style="width: 100%" v-for="option in teamOpt" :value="option.id" :key="'user11' + option.id">{{option.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始日期" style="width: 220px">
                    <DatePicker type="date" @on-change="changeDate(1, 'start_time', $event)" :value="filterOpt.start_time.value" placeholder="开始日期" style="width: 150px"></DatePicker>
                </FormItem>
                <FormItem label="结束日期" style="width: 220px">
                    <DatePicker type="date" @on-change="changeDate(1, 'end_time', $event)" :value="filterOpt.end_time.value" placeholder="结束日期" style="width: 150px"></DatePicker>
                </FormItem>
                <FormItem label="权重日期" style="width: 220px">
                    <DatePicker type="month" @on-change="changeDate(1, 'weight_time', $event)" :value="filterOpt.weight_time.value" placeholder="权重日期" style="width: 150px"></DatePicker>
                </FormItem>
                <FormItem label="提交人" style="width: 220px">
                    <Input v-model="filterOpt.add_user_name.value" style="width: 150px" placeholder="筛选状态" clearable></Input>
                </FormItem>
                <FormItem label="关键词" style="width: 220px">
                    <Input v-model="filterOpt.detail.value" style="width: 150px" placeholder="筛选标题或详情" clearable></Input>
                </FormItem>
                <FormItem label="接单人" style="width: 220px">
                    <Input v-model="filterOpt.manage.value" style="width: 150px" placeholder="筛选处理人" clearable></Input>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null" ref="paperList" :height="tableHeight" :params="filterOpt" url="/workOrder/adminWorkOrderList"></fs-table-page>
        </Card>
        <Modal v-model="editTicketsModal" :mask-closable="false" :closable="false" :width="400" class-name="vertical-center-modal" >
            <Form :label-width="60" style="padding: 5px">
                <input style="display: none" v-model="editTicketsModal.id" />
                <FormItem label="需求名">
                    <span v-text="editTickets.demand" :title="editTickets.demand" style="width: 300px;overflow: hidden;display: inline-block;white-space: nowrap;text-overflow: ellipsis;"></span>
                </FormItem>
                <FormItem label="创建人" style="width: 340px;display: inline-block">
                    <span v-text="editTickets.add_user_name"></span>
                </FormItem>
                <FormItem label="优先级" style="width: 340px;">
                    <Select v-model="editTickets.priority">
                        <Option :value="1">
                            <span style="display:inline-block;margin:0 auto;color:#fff;line-height:22px;border-radius:3px;background-color:#2d8cf0;height:22px;padding:0 8px">普通</span>
                        </Option>
                        <Option :value="2">
                            <span style="display:inline-block;color:#fff;line-height:22px;border-radius:3px;background-color:#ff9900;height:22px;padding:0 8px">重要</span>
                        </Option>
                        <Option :value="3">
                            <span style="display:inline-block;color:#fff;line-height:22px;border-radius:3px;background-color:#ed3f14;height:22px;padding:0 8px">加急</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="权重" v-if="editTickets.time1==null" style="width: 340px;display: inline-block">
                    <InputNumber :min="0.00" style="width: 60%" :max="1" :step="0.01" :precision="2"  v-model="editTickets.weight"></InputNumber>
                </FormItem>
                <FormItem label="权重1" v-if="editTickets.time1!=null" style="width: 340px;display: inline-block">
                    <InputNumber :min="0.00" style="width: 60%" :max="1" :step="0.01" :precision="2"  v-model="editTickets.weight1"></InputNumber>
                    <span>{{editTickets.time1}}</span>
                </FormItem>
                <FormItem label="权重2" v-if="editTickets.time2!=null" style="width: 340px;display: inline-block">
                    <InputNumber :min="0.00" style="width: 60%" :max="1" :step="0.01" :precision="2"  v-model="editTickets.weight2"></InputNumber>
                    <span>{{editTickets.time2}}</span>
                </FormItem>
                <FormItem label="权重3" v-if="editTickets.time3!=null" style="width: 340px;display: inline-block">
                    <InputNumber :min="0.00" style="width: 60%" :max="1" :step="0.01" :precision="2"  v-model="editTickets.weight3"></InputNumber>
                    <span>{{editTickets.time3}}</span>
                </FormItem>
                <FormItem label="开始时间" style="width: 340px;display: inline-block">
                    <DatePicker type="date" style="width: 100%" @on-change="changeDate(2, 'start_time',$event)"
                                :value="editTickets.start_time"></DatePicker>
                </FormItem>
                <FormItem label="结束时间" style="width: 340px;display: inline-block">
                    <DatePicker type="date" style="width: 100%" @on-change="changeDate(2, 'end_time', $event)"
                                :value="editTickets.end_time"></DatePicker>
                </FormItem>
                <FormItem label="项目组" style="width: 340px;display: inline-block">
                    <Select v-model="editTickets.team_id" filterable>
                        <Option  v-for="option in teamOpt" :value="option.id" :key="'team' + option.id">{{option.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="指派人员" style="width: 340px;display: inline-block">
                    <Select v-model="usersIds" multiple>
                        <Option v-for="option in teamUser"  v-if="option.pid === editTickets.team_id" :value="option.uid" :key="'user3' + option.id">{{option.uname}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="历史" style="width: 340px;">
                    <div style="width: 100%;max-height: 250px;overflow-x: hidden;overflow-y: auto">
                        <p v-for="item in logs" v-if="+item.type === 0">
                            {{item.content}}
                        </p>
                    </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editTicketsModal = false">取消</Button>
                <Button  type="primary" :loading="saveLoading" @click="save(2)">保存</Button>
            </div>
        </Modal>
        <Modal v-model="commitModal" :closable="false"  :width="430" :mask-closable="false">
            <Form :label-width="90" style="padding: 5px;margin-top: 10px">
                <input style="display: none" v-model="commitForm.id" />
                <FormItem label="进度分数" style="width: 350px;">
                    <InputNumber :min="1" style="width: 100%" :max="100" :precision="0" :step="1" v-model="commitForm.superior_planScore"></InputNumber>
                </FormItem>
                <FormItem label="质量分数" style="width: 350px;">
                    <InputNumber :min="1" style="width: 100%" :max="100" :precision="0" :step="1" v-model="commitForm.superior_qualityScore"></InputNumber>
                </FormItem>
                <FormItem v-if="commitForm.superior_planScore !== 100 || commitForm.superior_qualityScore !== 100" label="扣分原因" style="width: 350px;">
                    <Input type="textarea" placeholder="写出扣分原因用以留档。尽量简洁明了" :autosize="{minRows: 4,maxRows: 8}" v-model="commitForm.reason"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="commitModal = false">取消</Button>
                <Button type="success" :loading="saveLoading" @click="commit">完成</Button>
            </div>
        </Modal>
        <Modal v-model="commitModals" :closable="true" :width="430" :mask-closable="false">
            <Form :label-width="90" style="padding: 5px;margin-top: 10px">
                <input style="display: none" v-model="commitForms.id"/>
                <FormItem label="备注" style="width: 350px;">
                    <Input type="textarea" placeholder="写出任务解析。尽量简洁明了" :autosize="{minRows: 4,maxRows: 8}"
                           v-model="commitForms.content"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="success" @click="commitModals = false">取消</Button>
                <Button type="success" :loading="saveLoading" @click="commits">完成</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import pageMixin from '@/mixins/pageMixin';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import expandRow from '../myCreateTickets/table-expand';
    import moment from 'moment';

    export default {
        name: 'superiorManager',
        data() {
            return {
                editTicketsModal: false,
                saveLoading: false,
                commitModal: false,
                commitModals: false,
                isManager: true,
                logs: [],
                teamOpt: [],
                teamUser: [],
                usersIds: [],
                commitForm: {
                    id: '',
                    superior_qualityScore: 100,
                    superior_planScore: 100,
                    reason: ''
                },
                commitForms: {
                    id: '',
                    content: ''
                },
                editTickets: {
                    id: '',
                    weight: 0.1,
                    weight1: 0,
                    weight2: 0,
                    weight3: 0,
                    time1: '',
                    time2: '',
                    time3: '',
                    add_user_name: '',
                    start_time: '',
                    end_time: '',
                    team_id: '',
                    type: 0,
                    team_name: '',
                    superior_qualityScore: 100,
                    superior_planScore: 100,
                    demand: '',
                    priority: 1
                },
                filterOpt: {
                    weight: {
                        value: '',
                        type: 'select'
                    },
                    team_id: {
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
                    weight_time: {
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
                    id: {
                        type: 'input',
                        value: ''
                    },
                    detail: {
                        type: 'input',
                        value: ''
                    },
                    manage: {
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
                        title: '操作',
                        key: 'action',
                        width: 160,
                        align: 'center',
                        className: 'noPadding',
                        render: (h, params) => {
                            let vm = this;
                            let row = params.row;
                            let deleted = row.type === 4;
                            let showCommit = (row.type === 2) && !(row.superior_qualityscore && row.superior_qualityscore); // 状态已完成且未打分
                            let disableTitle = row.type > 0 ? '不可操作' : '点我编辑';
                            return h('ButtonGroup', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        title: disableTitle
                                    },
                                    style: {
                                        display: deleted ? 'none' : 'block'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm.editTicketsModal = true;
                                            vm.logs = row.logs;
                                            vm.editTickets.id = row.id;
                                            vm.usersIds = [];
                                            vm.editTickets.type = row.type;
                                            vm.editTickets.weight = row.weight;
                                            vm.editTickets.weight1 = row.weight1;
                                            vm.editTickets.weight2 = row.weight2;
                                            vm.editTickets.weight3 = row.weight3;
                                            vm.editTickets.team_id = row.team_id;
                                            vm.editTickets.time1 = row.time1;
                                            vm.editTickets.time2 = row.time2;
                                            vm.editTickets.time3 = row.time3;
                                            vm.editTickets.team_name = row.team_name;
                                            vm.editTickets.start_time = row.start_time;
                                            vm.editTickets.end_time = row.end_time;
                                            vm.editTickets.demand = row.demand;
                                            vm.editTickets.add_user_name = row.add_user_name;
                                            vm.editTickets.superior_qualityScore = row.superior_qualityScore;
                                            vm.editTickets.superior_planScore = row.superior_planScore;
                                            vm.editTickets.priority = row.priority;
                                            row.childids.forEach((item) => {
                                                vm.usersIds.push(item.userid);
                                            });
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    attrs: {
                                        title: '点我打分'
                                    },
                                    style: {
                                        display: showCommit ? 'blobk' : 'none'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm.commitForm.id = row.id;
                                            vm.commitForm.superior_planScore = 100;
                                            vm.commitForm.superior_qualityScore = 100;
                                            vm.commitForm.reason = '';
                                            vm.commitModal = true;
                                        }
                                    }
                                }, '打分'),
                                h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        },
                                        attrs: {
                                            title: '点我备注'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm.commitForms.id = row.id;
                                                vm.commitForms.content = '';
                                                vm.commitModals = true;
                                            }
                                        }
                                    }, '备注'
                                )
                            ]);
                        }
                    },
                    {
                        title: '工单id',
                        key: 'id',
                        minWidth: 70
                    },
                    {
                        title: '工单名',
                        key: 'demand',
                        minWidth: 200
                    },
                    {
                        title: '提单人',
                        key: 'add_user_name',
                        width: 80
                    },
                    {
                        title: '接单人',
                        align: 'center',
                        width: 80,
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
                        title: '项目组',
                        key: 'team_name',
                        align: 'center',
                        width: 120
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
                        title: '开始日期',
                        className: 'noPadding',
                        key: 'start_time',
                        align: 'center',
                        width: 130,
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
                        width: 130,
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
                        key: 'business_qualityscore',
                        render: (h, params) => {
                            let sQs = params.row.superior_qualityscore;
                            let sPs = params.row.superior_planscore;
                            let bQs = params.row.business_qualityscore;
                            if (!sPs || !sQs) {
                                return h('span', '打分可见');
                            } else {
                                return h('span', bQs);
                            }
                        }
                    },
                    {
                        title: '业务进度分',
                        align: 'center',
                        width: 97,
                        key: 'business_planscore',
                        render: (h, params) => {
                            let sQs = params.row.superior_qualityscore;
                            let sPs = params.row.superior_planscore;
                            let bPs = params.row.business_planscore;
                            if (!sPs || !sQs) {
                                return h('span', '打分可见');
                            } else {
                                return h('span', bPs);
                            }
                        }
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
                    }

                ],
                tableHeight: 700
            };
        },
        components: {fsTablePage, expandRow, WangEditor},
        mixins: [pageMixin],
        methods: {
            save(type) {
                let vm = this;
                let d = this.editTickets;
                if (!this.editTickets.priority) {
                    this.$Message.info('优先级未设置');
                    return;
                }
                // 三个都存在
                if ((vm.usersIds || vm.usersIds.length > 0) && d.start_time && d.end_time) {
                    if (moment(d.start_time).isAfter(d.end_time)) {
                        this.$Message.info('开始时间晚于结束时间，请检查');
                        return false;
                    }
                    // 都不存在
                } else if ((!vm.usersIds || vm.usersIds.length === 0) && !d.start_time && !d.end_time) {
                    d.type = 0;
                } else {
                    this.$Message.info('时间和人员都不设置或者都要设置');
                    return;
                }
                this.saveLoading = true;
                d.ids = vm.usersIds.join(',');
                this.$http.post('/workOrder/addOrder', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('修改需求成功');
                        this.$refs.paperList.getListData();
                        // 数据还原
                        this.editTickets.id = '';
                        this.editTickets.weight = 0.1;
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
            commits() {
                let f = this.commitForms;
                let length = f.content.trim();
                if (length < 8) {
                    this.$Message.info('不是有效的备注,至少大于八个字符');
                    return;
                }
                this.saveLoading = true;
                this.$http.post('workOrder/addLogByCharger', this.commitForms).then((res) => {
                    if (res.success) {
                        this.$Message.success('指导备注添加成功');
                        this.$refs.paperList.getListData();
                    }
                    this.saveLoading = false;
                    this.commitModals = false;
                }, () => {
                    this.saveLoading = false;
                    this.commitModals = false;
                })
            },
            commit() {
                let f = this.commitForm;
                if (!f.superior_planScore || !f.superior_qualityScore) {
                    this.$Message.info('还未打分');
                    return;
                }
                // 不是满分
                if (f.superior_planScore < 100 || f.superior_qualityScore < 100) {
                    let length = f.reason.trim();
                    if (length <= 10) {
                        this.$Message.info('不是有效的备注,至少大于十个字符');
                        return;
                    }
                }
                this.saveLoading = true;
                this.$http.post('workOrder/updateCoin', this.commitForm).then((res) => {
                    if (res.success) {
                        this.$Message.success('修改成功');
                        this.$refs.paperList.getListData();
                    }
                    this.saveLoading = false;
                    this.commitModal = false;
                }, () => {
                    this.saveLoading = false;
                    this.commitModal = false;
                })
            },
            update1(){
                this.$http.post('/workOrder/adminWorkOrderList', this.filterOpt).then((res) => {
                    if (res.success) {
                    }
                }, () => {
                })
            },
            _filterPeopleRemote(val) {
                this.teamUser = [];
                this.usersIds = [];
                let vm = this;
                this.$http.get('/workOrder/teamAll').then((res) => {
                    if (res.success) {
                        vm.teamOpt = res.data;
                        for (let i = 0; i < vm.teamOpt.length; i++) {
                            let arr = vm.teamOpt[i].childids;
                            vm.teamUser = vm.teamUser.concat(arr);
                        }
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
    #myCreateTickets{
        .noPadding div{
            padding: 0;
        }
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
</style>
