<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           v-model="filterOpt.userName.value"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="申请日期">
                    <DatePicker placeholder="筛选申请日期"
                                @on-change="filterOpt.addTime.value = $event"
                                :value="filterOpt.addTime.value"></DatePicker>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="filterOpt.status.value"
                            placeholder="筛选审核状态"
                            clearable>
                        <Option :value="0">审核中</Option>
                        <Option :value="1">转正成功</Option>
                        <Option :value="2">转正失败</Option>
                    </Select>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :height="tableHeight"
                           ref="leaveTableDom"
                           :params="filterOpt"
                           url="/journey/manageList"></fs-table-page>
            <Modal v-model="settingModalFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>转正设置</span>
                </p>
                <Form :label-width="80">
                    <Row>
                        <Col :span="12">
                            <FormItem label="上班天数:"  style="font-weight: 700;">
                                <InputNumber :min="18" style="width: 30%" type="text" v-model="postSettingForm.days"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="12">
                            <FormItem label="动态设置">
                                <Select v-model="postSettingForm.state">
                                    <Option :value="0">待新人填写</Option>
                                    <Option :value="1">待部门上级评语</Option>
                                    <Option :value="2">待人事经理审批</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="状态设置">
                                <Select v-model="postSettingForm.status">
                                    <Option :value="0">审核中</Option>
                                    <Option :value="1">转正成功</Option>
                                    <Option :value="2">转正失败</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            @click="_update_log">设置</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import tableExpend from './table-expend';
    export default {
        name: 'manageLog',
        data () {
            return {
                settingModalFlag: false,
                visible: false,
                imgArr: [],
                SettingForm: false,
                postSettingForm: {
                    id: '',
                    state: '',
                    status: '',
                    days: 0
                },
                filterOpt: {
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    addTime: {
                        value: '',
                        type: 'date'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    }
                },
                postColumns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            let vm = this;
                            return h(tableExpend, {
                                props: {
                                    row: params.row
                                },
                                on: {
                                    'op-success': function () {
                                        vm._getPostData();
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
                    {
                        title: '新人姓名',
                        align: 'center',
                        key: 'username'
                    },
                    {
                        title: '申请时间',
                        align: 'center',
                        key: 'addtime'
                    },
                    {
                        title: '部门负责人',
                        align: 'center',
                        key: 'chargername'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'postname'
                    },
                    {
                        title: '缴纳公积金',
                        align: 'center',
                        key: 'accumulation'
                    },
                    {
                        title: '延期天数',
                        align: 'center',
                        key: 'adddays'
                    },
                    {
                        title: '进度',
                        key: 'status',
                        align: 'center',
                        width: 170,
                        render: (h, params) => {
                            let statusContent = '';
                            let color = '';
                            switch (params.row.state) {
                                case 0:
                                    statusContent = '待新人填写';
                                    color = 'red';
                                    break;
                                case 1:
                                    if (params.row.status !== 0){
                                        statusContent = '已结束';
                                    } else {
                                        statusContent = '待部门上级评语';
                                    }
                                    color = 'green';
                                    break;
                                case 2:
                                    if (params.row.status !== 0){
                                        statusContent = '已结束';
                                    } else {
                                        statusContent = '待人事经理审核';
                                    }
                                    color = 'blue';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, statusContent);
                        }
                    },
                    {
                        title: '审核状态',
                        width: 180,
                        render: (h, params) => {
                            let color = '';
                            let contont = '';
                            switch (params.row.status) {
                                case 0:
                                    contont = '审核中';
                                    color = 'red';
                                    break;
                                case 1:
                                    contont = '转正成功';
                                    color = 'green';
                                    break;
                                case 2:
                                    contont = '转正失败';
                                    color = 'blue';
                                    break;
                            }
                            let renderDom = '';
                            if (this.userName === params.row.waitusername && params.row.status === 0) {
                                renderDom = h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, '立即审批');
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, contont)
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '转正设置',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'ios-gear',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
        },
        computed: {
            userName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        methods: {
            _rotateImg(index) {
                this.imgArr[index].deg += 90;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _update_log() {
                let data = {};
                data = this.postSettingForm;
                this.$http.post('/journey/manageSet', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this.$emit('op-success');
                    }
                    this._getPostData();
                    this.settingModalFlag = false;
                }, () => {
                    this.settingModalFlag = false;
                })
            },
            _editorSetting(data) {
                this.postSettingForm.id = data.id;
                this.postSettingForm.status = data.status;
                this.postSettingForm.state = data.state;
                this.postSettingForm.days = 0;
                this.settingModalFlag = true;
            },
            _getPostData() {
                this.$refs.leaveTableDom.getListData();
            }
        },
        components: {
            tableExpend,
            fsTablePage
        }
    };
</script>
