<template>
    <div>
        <Card>
            <fs-table-page :columns="postColumns"
                           :height="tableHeight"
                           ref="leaveTableDom"
                           :params="filterOpt"
                           url="/journey/checkList"></fs-table-page>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import tableExpend from './table-expend';
    export default {
        name: 'myZz',
        data () {
            return {
                visible: false,
                imgArr: [],
                filterOpt: {
                    user_name: {
                        value: '',
                        type: 'input'
                    },
                    applyDate: {
                        value: '',
                        type: 'date'
                    },
                    odstates: {
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
                                }, '立即填写');
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, contont), renderDom
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
