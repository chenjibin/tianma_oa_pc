<template>
    <div id="myCreateTickets">
        <Card>
            <Form inline style="width: 100%" :label-width="90">
                <FormItem label="状态" style="width: 200px">
                    <Select v-model="filterOpt.type.value" style="width: 100%"  placeholder="筛选状态"  clearable>
                        <Option value="0">待处理</Option>
                        <Option value="1">处理中</Option>
                        <Option value="2">已完成</Option>
                        <Option value="3">已暂停</Option>
                        <Option value="4">不处理</Option>
                    </Select>
                </FormItem>
                <FormItem label="只看自己" style="width: 200px" v-if="accessBtn.indexOf(37) > -1">
                    <Select v-model="filterOpt.me.value" style="width: 100%"  placeholder="筛选状态"  clearable>
                        <Option value="0">看所有人</Option>
                        <Option value="1">只看自己</Option>
                    </Select>
                </FormItem>
                <FormItem label="优先级" style="width: 200px">
                    <Select v-model="filterOpt.priority.value" style="width: 100%"  placeholder="筛选优先级"
                            clearable>
                        <Option :value="1">普通 <Icon type="flag" color="#2d8cf0"></Icon></Option>
                        <Option :value="2">重要 <Icon type="flag" color="#ff9900"></Icon></Option>
                        <Option :value="3">加急 <Icon type="flag" color="#ed3f14"></Icon></Option>
                    </Select>
                </FormItem>
                <FormItem label="权重" style="width: 200px">
                    <Select v-model="filterOpt.weight.value" style="width: 100%" placeholder="筛选状态" clearable>
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
                <FormItem label="提交人" style="width: 200px">
                    <Input style="width: 100%"  v-model="filterOpt.add_user_name.value"  placeholder="筛选状态" clearable></Input>
                </FormItem>
                <FormItem label="开始日期" style="width: 200px">
                    <DatePicker  style="width: 100%" type="date" @on-change="changeDate(1, 'start_time', $event)" :value="filterOpt.start_time.value" placeholder="开始日期"></DatePicker>
                </FormItem>
                <FormItem label="结束日期" style="width: 200px">
                    <DatePicker style="width: 100%"  type="date" @on-change="changeDate(1, 'end_time', $event)" :value="filterOpt.end_time.value" placeholder="结束日期"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button style="width: 100%" type="primary" @click="newTicketsModal = true">新增需求</Button>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null" ref="paperList" :height="tableHeight" :params="filterOpt" url="/workOrder/myCreateOrder"></fs-table-page>
        </Card>
        <Modal v-model="newTicketsModal" :closable="false"  :width="650" :height="887" :mask-closable="false">
            <Form :label-width="60" style="padding: 5px">
                <input style="display: none" v-model="newTickets.id" />
                <FormItem label="需求名">
                    <input v-model="newTickets.demand" style="border: none;border-bottom: solid 1px #c3c3c3;width: 520px;outline: none"></input>
                </FormItem>
                <FormItem label="创建人">
                    <span v-text="newTickets.add_user_name"></span>
                </FormItem>
                <FormItem label="详细需求">
                    <wang-editor v-if="newTicketsModal" :width="520"
                        :menus="['head', 'bold', 'fontSize','list','backColor','link','quote','table','image']"
                        :min-height="200" :max-height="350"
                        defaul-text="描述你的需求"
                        ref="wangEditor"
                        :editorcontent.sync="newTickets.detail"></wang-editor>
                </FormItem>
                <FormItem label="优先级" style="width: 290px;display: inline-block">
                    <Select v-model="newTickets.priority" placement="bottom">
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
                <!--<FormItem label="权重" style="width: 290px;display: inline-block">-->
                    <!--<InputNumber :min="0.05" style="width: 100%" :max="1" :step="0.10" :precision="2"  v-model="newTickets.weight"></InputNumber>-->
                <!--</FormItem>-->
                <FormItem label="项目组" style="width: 290px;display: inline-block">
                    <Select v-model="newTickets.team_id" placement="bottom" filterable>
                        <Option v-for="(option, index) in teamOpt" :value="option.id" :key="'user' + option.id">{{option.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="附件" style="width: 290px;display: inline-block">
                    <Upload  :max-size="20480" ref="uploadEdit" :on-remove="removeFile" action="/oa/workOrder/uploadfile" :on-success="handleSuccess" :on-error="uploaderror" style="width: 100%" name="File">
                        <div style="width: 100%">
                            <Button :disabled="!!newTickets.accessory" type="ghost"><Icon type="paper-airplane" :size="20" style="vertical-align: middle;"></Icon><span style="margin-left: 10px;font-size: 15px;vertical-align: middle">文 件 上 传</span></Button>
                        </div>
                    </Upload>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="newTicketsModal = false">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="save(1)">保存</Button>
            </div>
        </Modal>

        <Modal v-model="editTicketsModal" :mask-closable="false" :closable="false" :width="650" class-name="vertical-center-modal" >
            <Form :label-width="60" style="padding: 5px">
                <input style="display: none" v-model="editTicketsModal.id" />
                <FormItem label="需求名">
                    <input v-model="editTickets.demand" style="border: none;border-bottom: solid 1px #c3c3c3;width: 500px;outline: none"></input>
                </FormItem>
                <FormItem label="创建人" style="width: 270px;display: inline-block">
                    <span v-text="editTickets.add_user_name"></span>
                </FormItem>
                <FormItem label="详细需求">
                    <wang-editor v-if="editTicketsModal" :width="565" :menus="['head', 'bold', 'fontSize','list','backColor','link','quote','table','image']"
                                 :min-height="200" :max-height="250" defaul-text="描述你的需求"  ref="wangEditor" :editorcontent.sync="editTickets.detail"></wang-editor>
                </FormItem>
                <FormItem label="优先级" style="width: 270px;display: inline-block">
                    <Select v-model="editTickets.priority" placement="bottom">
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
                <FormItem label="项目组" style="width: 270px;display: inline-block">
                    <Select v-model="editTickets.team_id" placement="bottom" filterable>
                        <Option v-for="(option, index) in teamOpt" :value="option.id" :key="'user2' + option.id">{{option.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="附件" style="width: 270px;display: inline-block;">
                    <Upload :show-upload-list="false" :max-size="20480" ref="uploadEdit" :on-remove="removeFile" action="/oa/workOrder/uploadfile" :on-success="handleSuccess" :on-error="uploaderror" style="width: 100%" name="File">
                        <div>
                            <Button :disabled="!!editTickets.accessory" type="ghost"><Icon type="paper-airplane" :size="20" style="vertical-align: middle;"></Icon><span style="margin-left: 10px;font-size: 15px;vertical-align: middle">文 件 上 传</span></Button>
                        </div>
                    </Upload>
                </FormItem>
                <span style="display: inline-block" v-if="editTickets.accessory">{{editTickets.accessory}} <Button type="text" @click.prevent="removeFile({name:accessory})">删除</Button></span>
                <FormItem label="历史" style="width: 565px;">
                    <div style="width: 100%;max-height: 250px;overflow-x: hidden;overflow-y: auto">
                        <p :key="item.id" v-for="item in logs" v-if="item.type==0">
                            {{item.content}}
                        </p>
                    </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editTicketsModal = false;">取消</Button>
                <Button :disabled="editTickets.type == 2" type="primary" :loading="saveLoading" @click="save(2)">保存</Button>
            </div>
        </Modal>
        <Modal v-model="commitModal" :closable="false"  :width="430" :mask-closable="false">
            <Form :label-width="90" style="padding: 5px;margin-top: 10px">
                <input style="display: none" v-model="commitForm.id" />
                <FormItem label="进度分数" style="width: 350px;">
                    <InputNumber :min="1" style="width: 100%" :max="100" :step="1" :precision="0" v-model="commitForm.business_planScore"></InputNumber>
                </FormItem>
                <FormItem label="质量分数" style="width: 350px;">
                    <InputNumber :min="1" style="width: 100%" :max="100" :step="1" :precision="0" v-model="commitForm.business_qualityScore"></InputNumber>
                </FormItem>
                <FormItem v-if="commitForm.business_planScore !== 100 || commitForm.business_qualityScore !== 100" label="扣分原因" style="width: 350px;">
                    <Input type="textarea" placeholder="写出扣分原因用以留档。尽量简洁明了" :autosize="{minRows: 4,maxRows: 8}" v-model="commitForm.reason"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="commitModal = false">取消</Button>
                <Button type="success" :loading="saveLoading" @click="commit">完成</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import pageMixin from '@/mixins/pageMixin';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import expandRow from './table-expand';
    import moment from 'moment';

    export default {
        name: 'myCreateTickets',
        data() {
            return {
                addModal: false,
                newTicketsModal: false,
                editTicketsModal: false,
                saveLoading: false,
                commitModal: false,
                logs: [],
                accessBtn: [],
                commitForm: {
                    id: '',
                    business_planScore: 100,
                    business_qualityScore: 100,
                    reason: ''
                },
                newTickets: {
                    id: '',
                    detail: '',
                    add_user_id: this.$store.state.user.userInfo.id,
                    add_user_name: this.$store.state.user.userInfo.realname,
                    type: 0,
                    team_id: '',
                    team_name: '',
                    demand: '',
                    accessory: '',
                    priority: 1
                },
                editTickets: {
                    id: '',
                    detail: '',
                    add_time: '',
                    start_time: '',
                    end_time: '',
                    add_user_id: 0,
                    add_user_name: '',
                    type: 0,
                    team_id: '',
                    team_name: '',
                    business_qualityScore: 100,
                    business_planScore: 100,
                    superior_qualityScore: 100,
                    superior_planScore: 100,
                    demand: '',
                    accessory: '',
                    total_score: 100,
                    priority: 1
                },
                teamOpt: [],
                filterOpt: {
                    weight: {
                        value: '',
                        type: 'select'
                    },
                    me: {
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
                        key: 'superior_qualityscore',
                        render: (h, params) => {
                            let sQs = params.row.superior_qualityscore;
                            let bQs = params.row.business_qualityscore;
                            let bPs = params.row.business_planscore;
                            if (!bPs || !bQs) {
                                return h('span', '完成可见');
                            } else {
                                return h('span', sQs);
                            }
                        }
                    },
                    {
                        title: '上级进度分',
                        align: 'center',
                        width: 97,
                        key: 'superior_planscore',
                        render: (h, params) => {
                            let sPs = params.row.superior_planscore;
                            let bQs = params.row.business_qualityscore;
                            let bPs = params.row.business_planscore;
                            if (!bPs || !bQs) {
                                return h('span', '完成可见');
                            } else {
                                return h('span', sPs);
                            }
                        }
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
                            let disable = row.type > 0;
                            let disable2 = row.type === 2 || row.type === 0;
                            let deleted = row.type === 4;
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
                                                console.log(row);
                                                vm.editTickets.id = row.id;
                                                vm.logs = row.logs;
                                                vm.editTickets.detail = row.detail;
                                                vm.editTickets.team_id = row.team_id;
                                                vm.editTickets.team_name = row.team_name;
                                                vm.editTickets.demand = row.demand;
                                                vm.editTickets.accessory = row.accessory;
                                                vm.editTickets.start_time = row.start_time;
                                                vm.editTickets.end_time = row.end_time;
                                                vm.editTickets.add_user_id = row.add_user_id;
                                                vm.editTickets.add_user_name = row.add_user_name;
                                                vm.editTickets.type = row.type;
                                                vm.editTickets.business_qualityScore = row.business_qualityScore;
                                                vm.editTickets.business_planScore = row.business_planScore;
                                                vm.editTickets.superior_qualityScore = row.superior_qualityScore;
                                                vm.editTickets.superior_planScore = row.superior_planScore;
                                                vm.editTickets.total_score = row.total_score;
                                                vm.editTickets.priority = row.priority;
                                            }
                                        }
                                    }, '编辑'
                                ),
                                h('Button', {
                                        props: {
                                            type: 'default',
                                            size: 'small',
                                            disabled: disable
                                        },
                                        style: {
                                            display: deleted ? 'none' : 'block'
                                        },
                                        attrs: {
                                            title: disable ? '接单不可删除' : '点我删除'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm.$Modal.confirm({
                                                    title: '删除提醒',
                                                    content: '是否确认删除？',
                                                    okText: '删除',
                                                    cancelText: '取消',
                                                    loading: true,
                                                    onOk() {
                                                        this.$http.post('/workOrder/deleteOrder', {id: row.id}).then((res) => {
                                                            if (res.success) {
                                                                vm.$Message.success('删除成功');
                                                                vm.$refs.paperList.getListData();
                                                            } else {
                                                                vm.$Message.error('删除失败');
                                                            }
                                                            vm.$Modal.remove();
                                                        }, () => {
                                                            vm.$Modal.remove();
                                                        })
                                                    }
                                                });
                                            }
                                        }
                                    }, '删除'
                                ),
                                h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        },
                                        style: {
                                            display: (deleted || disable2) ? 'none' : 'block'
                                        },
                                        attrs: {
                                            title: '点我完成'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm.commitForm.id = row.id;
                                                vm.commitModal = true;
                                            }
                                        }
                                    }, '完成'
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
            save(type) {
                let vm = this;
                if (type === 1) {
                    if (!this.newTickets.detail || !this.newTickets.demand) {
                        this.$Message.info('未填写需求名或详细需求');
                        return false;
                    }
                    if (!this.newTickets.team_id || !this.newTickets.priority) {
                        this.$Message.info('未选择分组或优先级');
                        return false;
                    }
                    this.saveLoading = true;
                    this.$http.post('/workOrder/addOrder', this.newTickets).then((res) => {
                        if (res.success) {
                            vm.$Message.success('新建需求成功');
                            vm.$refs.paperList.getListData();
                            vm.$refs.uploadEdit.clearFiles();
                            // 数据还原
                            vm.newTickets.id = '';
                            vm.newTickets.detail = '';
                            vm.newTickets.team_id = '';
                            vm.newTickets.team_name = '';
                            vm.newTickets.demand = '';
                            vm.newTickets.accessory = '';
                            vm.newTickets.priority = 1;
                        }
                        this.saveLoading = false;
                        this.newTicketsModal = false;
                    }, () => {
                        this.saveLoading = false;
                        this.newTicketsModal = false;
                    })
                } else if (type === 2) {
                    this.saveLoading = true;
                    this.$http.post('/workOrder/addOrder', this.editTickets).then((res) => {
                        if (res.success) {
                            this.$Message.success('修改需求成功');
                            this.$refs.paperList.getListData();
                            // 数据还原
                            this.editTickets.id = '';
                            this.editTickets.detail = '';
                            this.editTickets.team_id = '';
                            this.editTickets.team_name = '';
                            this.editTickets.demand = '';
                            this.editTickets.accessory = '';
                            this.$refs.uploadEdit.clearFiles();
                            this.editTickets.priority = 1;
                        }
                        this.saveLoading = false;
                        this.editTicketsModal = false;
                    }, () => {
                        this.saveLoading = false;
                        this.editTicketsModal = false;
                    })
                }
            },
            changeDate(type, name, time) {
                if (type === 1) {
                    this.filterOpt[name].value = time;
                } else if (type === 2) {
                    this.editTickets[name] = time;
                }
            },
            commit() {
                let f = this.commitForm;
                if (!f.business_planScore || !f.business_qualityScore) {
                    this.$Message.info('还未打分');
                    return;
                }
                // 不是满分
                if (f.business_planScore < 100 || f.business_qualityScore < 100) {
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
            _filterPeopleRemote(val) {
                this.$http.get('/workOrder/teamAll').then((res) => {
                    if (res.success) {
                        this.teamOpt = res.data;
                    }
                });
            },
            handleSuccess(response, file, fileList) {
                console.log(file);
                this.newTickets.accessory = file.name;
                this.editTickets.accessory = file.name;
            },
            removeFile(file, fileList) {
                this.$http.get('/workOrder/delfile?name=' + file.name).then((res) => {
                    this.newTickets.accessory = '';
                    this.editTickets.accessory = '';
                    this.$refs.uploadEdit.clearFiles();
                });
            },
            uploaderror() {
                this.$Message.info('只能上传一个文件，更多文件请打压缩包(20M)');
            }
        },
        created() {
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
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
