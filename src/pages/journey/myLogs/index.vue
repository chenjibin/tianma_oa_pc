<template>
    <div>
        <Card>
            <fs-table-page :columns="postColumns"
                           :height="tableHeight"
                           ref="leaveTableDom"
                           :params="filterOpt"
                           url="/journey/checkList"></fs-table-page>
            <Modal title="查看图片证明" v-model="visible" width="800">
                <div style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
                    <img :src="$mainHost + '/oa/upload/' + item.pic"
                         v-for="(item, index) in imgArr"
                         :key="'prewimg-' + index"
                         title="点击图片可以旋转"
                         :style="{transform: `rotateZ(${item.deg}deg)`}"
                         @click="_rotateImg(index)"
                         style="width: 100%; cursor: pointer;">
                </div>
                <div slot="footer">
                    <Button type="ghost" @click="visible = false">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import tableExpend from './table-expend';
    export default {
        name: 'mylogs',
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
            _prewImg(data) {
                this.visible = true;
                let storeArr = [];
                if (data.imageproof) {
                    let obj = {};
                    obj.pic = data.imageproof;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof1) {
                    let obj = {};
                    obj.pic = data.imageproof1;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof2) {
                    let obj = {};
                    obj.pic = data.imageproof2;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof3) {
                    let obj = {};
                    obj.pic = data.imageproof3;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof4) {
                    let obj = {};
                    obj.pic = data.imageproof4;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                this.imgArr = storeArr;
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
