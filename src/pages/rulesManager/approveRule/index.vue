<template>
    <div id="approveRule">
        <Card>
            <Form inline :label-width="60">
                <FormItem prop="name" label="创建人">
                    <Input type="text" clearable v-model="searchData.createName.value" placeholder="姓名"></Input>
                </FormItem>
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList" :height="tableHeight" url="/rugulations/approveList"></fs-table-page>
        </Card>
        <ruleModal :dataArr="detailRow" v-on:change="changed" :canClose="false" :showModal.sync="detailModal"></ruleModal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import ruleModal from '../newRule/ruleModal';
    import utils from '@/libs/util';
    export default {
        name: 'approveRule',
        data() {
            return {
                saveLoading: false,
                detailModal: false,
                detailRow: [],
                ruleId: '',
                searchData: {
                    createName: {
                        value: '',
                        type: 'input'
                    },
                    organizeId: {
                        value: '',
                        type: 'select'
                    }
                },
                postColumns: [
                    {
                        title: '创建人',
                        key: 'createname',
                        width: 120
                    },
                    {
                        title: '添加日期',
                        key: 'add_time',
                        width: 120
                    },
                    {
                        title: '规章内容',
                        key: 'content',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', utils.delHtmlTag(params.row.content));
                        }
                    },
                    {
                        title: '审批状态',
                        key: 'states',
                        width: 120,
                        render: (h, params) => {
                            let mapping = ['未审批', '通过', '未通过'];
                            return h('span', mapping[params.row.states]);
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            let arr = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'android-expand',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '查看'
                                    },
                                    on: {
                                        click: function () {
                                            vm.detail(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                })
                            ];
                            if (params.row.update) {
                                arr.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '编辑'
                                    },
                                    on: {
                                        click: function () {
                                            vm.edit(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }));
                            }
                            return h('div', arr);
                        }
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableHeight: 700
            };
        },
        methods: {
            _nodeChangeHandler(node) {
                this.searchData.organizeId.value = node.id;
            },
            changed() {
                this.$refs.paperList.getListData();
                this.detailModal = false;
            },
            detail(data) {
                this.detailModal = true;
                this.detailRow = [];
                this.detailRow.push(data);
            },
            save() {
                let d = {};
                d.organizeId = this.$refs.treeDom.getCheckedKeys().join(',');
                d.content = this.editorContent;
                if (this.ruleId) {
                    d.id = this.ruleId;
                }
                if (!d.content || !d.organizeId) {
                    this.$Message.info('未填写内容或未选择规章范围哦');
                    return;
                }
                this.saveLoading = true;
                this.$http.post('rugulations/addRugulations', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('新增规章成功！');
                        this.$refs.paperList.getListData();
                    }
                }).finally((res) => {
                    this.newFlag = false;
                    this.saveLoading = false;
                });
            }
        },
        created() {
        },
        computed: {
            realName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        components: {
            fsDepTree, fsTablePage, ruleModal
        }
    };
</script>

<style scoped>

</style>
