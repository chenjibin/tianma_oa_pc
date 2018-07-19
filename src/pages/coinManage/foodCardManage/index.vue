<template>
    <div>
        <Row :gutter="6">
            <Col :span="4">
            <fs-dep-tree url="/organize/userOrganizeTree?fatherId=-1"
                         @node-change="_nodeChangeHandler($event)"
                         :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
            <Card>
                <Form ref="searchData" :model="searchData" inline :label-width="40">
                    <FormItem prop="realName" label="姓名">
                        <Input type="text"
                               v-model="searchData.realName.value"
                               placeholder="筛选姓名"></Input>
                    </FormItem>
                    <FormItem prop="postName" label="岗位">
                        <Input type="text"
                               v-model="searchData.postName.value"
                               placeholder="筛选岗位"></Input>
                    </FormItem>
                    <FormItem label="角色">
                        <Select filterable v-model="searchData.roleId.value"
                                clearable
                                :transfer="true"
                                placeholder="输入查询角色" style="width: 200px">
                            <Option :value="item.id" :label="isManger > 1 ?item.name:item.name+' '+item.companyname"
                                    v-for="(item, index) in roleCombo" :key="'role' + index">{{item.name}} <span
                                v-if="isManger == 0 || isManger == 1" :title="item.companyname"
                                style="float:right;color:#ccc;width:65px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.companyname}}</span>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="searchData.states.value"
                                clearable
                                placeholder="筛选状态"
                                style="width: 100px">
                            <Option value="1">启用</Option>
                            <Option value="0">禁用</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label-width="0.1">
                        <ButtonGroup>
                            <Button type="primary">
                                <Icon type="plus-round"></Icon>
                                新增人员
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
                <fs-table-page :columns="columns1"
                               :size="null"
                               :height="tableHeight"
                               :params="searchData"
                               ref="fsTable"
                               url="/user/dataList"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="checkLogFlag"
               :mask-closable="false"
               width="1200">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
            </p>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    export default {
        name: 'foodCardManage',
        data() {
            return {
                tableHeight: 300,
                checkLogFlag: false,
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '部门',
                        key: 'organizename',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '岗位',
                        key: 'postname',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '角色',
                        key: 'rolename',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '账户余额',
                        key: 'tm_coin',
                        sortable: true,
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '启用' : '禁用');
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'arrow-shrink',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '特殊权限设置'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._specAccessOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'key',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '用户授权'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._userAccessOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'ios-gear',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '用户设置'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._editorSetting(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                roleCombo: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                searchData: {
                    realName: {
                        value: '',
                        type: 'input'
                    },
                    postName: {
                        value: '',
                        type: 'input'
                    },
                    states: {
                        value: '1',
                        type: 'select'
                    },
                    roleId: {
                        value: '',
                        type: 'select'
                    },
                    companyId: {
                        value: '',
                        type: 'select'
                    },
                    nodeId: {
                        value: 1,
                        type: 'tree'
                    }
                }
            }
        },
        computed: {
            isManger() {
                return this.$store.state.user.userInfo.ismanger;
            }
        },
        methods: {
            _getRoleData() {
                this.$http.get('/role/getRoleCombo').then((res) => {
                    if (res.success) {
                        this.roleCombo = res.data;
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _checkLogOpen(data) {
            },
            _nodeChangeHandler(node) {
                this.searchData.nodeId.value = node.id;
            }
        },
        created() {
            this._setTableHeight();
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    }
</script>
