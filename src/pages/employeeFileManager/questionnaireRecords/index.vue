<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="员工姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="filterOpt.plusType"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option value="0">已取消</Option>
                        <Option value="1">已发送</Option>
                        <Option value="2">待发送</Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="开始日期">-->
                    <!--<DatePicker @on-change="filterOpt.startDate = $event"-->
                                <!--clearable-->
                                <!--:value="filterOpt.startDate"></DatePicker>-->
                <!--</FormItem>-->
                <!--<FormItem label="结束日期">-->
                    <!--<DatePicker @on-change="filterOpt.endDate = $event"-->
                                <!--clearable-->
                                <!--:value="filterOpt.endDate"></DatePicker>-->
                <!--</FormItem>-->
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'coinRecord',
        data () {
            return {
                postFormType: 'update',
                filterOpt: {
                    name: '',
                    plusType: '',
                    option: '',
                    startDate: '',
                    endDate: ''
                },
                postColumns: [
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            let statusContent = '';
                            let color = '';
                            switch (params.row.status) {
                                case 1:
                                    statusContent = '已发送';
                                    color = 'red';
                                    break;
                                case 2:
                                    statusContent = '待发送';
                                    color = 'green';
                                    break;
                                case 0:
                                    statusContent = '已取消';
                                    color = 'default';
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
                        title: '添加日期',
                        key: 'addtime',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            if (params.row.status === 1 || params.row.status === 0) return '';
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '发送',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            icon: 'checkmark-round',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._shenHe(params.row);
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '取消发送',
                                        placement: 'top',
                                        transfer: true
                                    },
                                    style: {
                                        marginLeft: '8px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            icon: 'close-round',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._shenHe1(params.row);
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
        watch: {
            'filterOpt.startDate'() {
                this._filterResultHandler();
            },
            'filterOpt.endDate'() {
                this._filterResultHandler();
            }
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _shenHe(param) {
                let sendData = {};
                sendData.id = param.id;
                this.$http.post('/examtest/shenHeWenJuan', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this._getPostData();
                    }
                });
            },
            _shenHe1(param) {
                let sendData = {};
                sendData.id = param.id;
                sendData.status = 0;
                this.$http.post('/examtest/shenHeWenJuan', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this._getPostData();
                    }
                });
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.name;
                data.exampleFlag = this.filterOpt.plusType;
                data.proper = this.filterOpt.option;
                data.startDate = this.filterOpt.startDate;
                data.endDate = this.filterOpt.endDate;
                this.getList('/user/SysmsgWenJuan', data);
            }
        },
        components: {}
    };
</script>
