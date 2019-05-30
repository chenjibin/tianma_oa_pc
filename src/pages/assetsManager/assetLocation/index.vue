<template>
    <!--资产位置-->
    <div id="assetslocation">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="位置名称">
                    <Select type="text" style="width: 180px"
                            @on-change="_inputDebounce"
                            :clearable="true"
                            v-model="filterOpt.name"
                            placeholder="位置名称">
                        <Option v-for="(item, index) in positionList" :key="index" :value="item.name">
                            <span>{{item.name}}</span>
                            <span :title="item.remarks"
                                  style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增</span>
                </Button>
            </Form>
            <Table :columns="postColumns"
                   ref="attendanceTable"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list">
            </Table>
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
        <Modal v-model="changeInfoModal" width="400">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                {{flag_form == 'add' ? '新增' : '修改'}}资产位置
            </p>
            <Form style="margin-top: 20px" :label-width="80" ref="modeFrom" :model="baseInfo" :rules="formRules" >
                <input style="display: none" v-model="baseInfo.id"/>
                <FormItem label="位置名称" prop="name">
                    <Input type="text" style="width: 100%"
                           v-model="baseInfo.name"
                           placeholder="位置名称"></Input>
                </FormItem>
                <FormItem label="位置备注" prop="remarks">
                    <Input type="text" style="width: 100%"
                           v-model="baseInfo.remarks"
                           placeholder="位置备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"  @click="saveInfo">提交</Button>
                <Button  @click="changeInfoModal = false">取消</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';

    export default {
        name: 'assetslocation',
        data() {
            return {
                tableHeight: 500,
                flag_form: 'add',
                filterOpt: {
                    name: ''
                },
                positionList: [],
                baseInfo: {
                    name: '',
                    remarks: ''
                },
                changeInfoModal: false,
                formRules: {
                    name: [
                        {required: true, message: '请填写名称', trigger: 'blur'}
                    ],
                    remarks: [
                        {required: true, message: '请填写备注', trigger: 'blur'}
                    ]
                },
                postColumns: [
                    {
                        title: '位置名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '位置备注',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            return h('div', {}, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    style: {
                                        marginRight: '20px'
                                    },
                                    on: {
                                        click: function () {
                                            vm.changeInfo(params.row);
                                            vm.changeInfoModal = true;
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'close',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function () {
                                            vm.delInfo(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
            };
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
            this.getPositionList();
        },
        methods: {
            changeInfo(data) {
                this.$refs.modeFrom.resetFields();
                this.flag_form = 'update';
                this.baseInfo = data;
            },
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
                });
            },
            saveInfo() {
                let vm = this;
                vm.$refs.modeFrom.validate((valid) => {
                    if (valid) {
                        vm.$http.post('/assets/add', vm.baseInfo).then((res) => {
                            if (res.success) {
                                vm.$Message.success('保存成功');
                                vm.changeInfoModal = false;
                                vm._filterResultHandler();
                            }
                        });
                    }
                })
            },
            addInfo() {
                this.baseInfo = {};
                this.flag_form = 'add';
                this.changeInfoModal = true;
            },
            delInfo(data) {
                let vm = this;
                this.baseInfo = data;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk() {
                        this.$http.post('/assets/delete', {id: vm.baseInfo.id}).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 200),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
                this.getPositionList();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 34 - 57 - 49;
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
                this.getList('/assets/datalist', this.filterOpt);
            }
        }
    };
</script>

<style scoped>

</style>
