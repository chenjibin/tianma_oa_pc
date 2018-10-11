<template>
    <div id="newRule">
        <Row :gutter="6">
            <Col :span="4">
            <fs-dep-tree style="max-height: 100%" url="/organize/organizeTreeCertainVm"
                         @node-change="_nodeChangeHandler($event)" :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
            <Card>
                <Form inline :label-width="60">
                    <FormItem prop="name" label="创建人">
                        <Input type="text" clearable v-model="searchData.createName.value" placeholder="姓名"></Input>
                    </FormItem>
                    <FormItem prop="title" label="标题名称">
                        <Input type="text" clearable v-model="searchData.title.value" placeholder="名称"></Input>
                    </FormItem>
                    <FormItem  prop="states" label="状态" style="width: 200px">
                        <Select v-model="searchData.states.value" placeholder="筛选优先级"
                                clearable>
                            <Option :value="0">未审批<Icon type="flag" color="#2d8cf0"></Icon></Option>
                            <Option :value="1">通过<Icon type="flag" color="#ff9900"></Icon></Option>
                            <Option :value="2">未通过<Icon type="flag" color="#ed3f14"></Icon></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label-width="0.1">
                        <Button type="primary" @click="newOne">新增制度</Button>
                    </FormItem>
                </Form>
                <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                               :height="tableHeight" url="/rugulations/chargerList"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="newFlag" :mask-closable="false" width="1100">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span v-show="!ruleId">新增制度</span>
                <span v-show="ruleId">编辑制度</span>
            </p>
            <Row :gutter="16">
                <Col :span="17">
                <Form ref="noticeFormDom" :label-width="80">
                    <FormItem label="操作人">
                        {{realName}}
                    </FormItem>
                    <FormItem label="制度标题">
                        <Input type="text"
                               v-model="ruleTitle"></Input>
                    </FormItem>
                    <FormItem label="制度内容">
                        <wang-editor
                            v-if="newFlag"
                            :width="660"
                            :max-height="550"
                            :menus="editorMeun"
                            :editorcontent.sync="editorContent"
                            defaul-text="请填写制度制度"
                            img-url="/oa/share/uploadFile"></wang-editor>
                    </FormItem>
                </Form>
                </Col>
                <Col :span="7">
                <h3>发布范围</h3>
                <div style="max-height: 490px;overflow:auto;">
                    <el-tree :data="orgTreeData"
                             ref="treeDom"
                             show-checkbox
                             :expand-on-click-node="false"
                             :default-checked-keys="strangeSettingForm.deps"
                             :highlight-current="true"
                             node-key="id"
                             style="margin-top: 10px;"
                             :props="defaultProps"></el-tree>
                </div>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="text" style="margin-right: 8px" @click="newFlag = false">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="save">确认</Button>
            </div>
        </Modal>
        <ruleModal :dataArr="detailRow" :showModal.sync="detailModal"></ruleModal>
    </div>
</template>

<script>
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import ruleModal from './ruleModal';
    import utils from '@/libs/util';

    export default {
        name: 'newRule',
        data() {
            return {
                orgSearching: false,
                saveLoading: false,
                detailModal: false,
                detailRow: [],
                ruleId: '',
                ruleTitle: '',
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
                        title: '制度标题',
                        key: 'name',
                        ellipsis: true
                    },
                    {
                        title: '制度内容',
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
                        align: 'center',
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
                orgTreeData: [],
                searchData: {
                    createName: {
                        value: '',
                        type: 'input'
                    },
                    title: {
                        value: '',
                        type: 'input'
                    },
                    states: {
                        value: '',
                        type: 'input'
                    },
                    organizeId: {
                        value: '0',
                        type: 'select'
                    }
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                editorContent: '',
                editorMeun: [
                    'bold',
                    'italic',
                    'link',
                    'list',
                    'justify',
                    'emoticon',
                    'quote',
                    'image',
                    'video',
                    'undo',
                    'redo'
                ],
                allTreeId: [],
                strangeSettingForm: {
                    title: '',
                    type: '2',
                    require: '1',
                    status: '1',
                    id: '',
                    content: '',
                    editorContent: ''
                },
                newFlag: false,
                tableHeight: 800
            };
        },
        methods: {
            _nodeChangeHandler(node) {
                this.searchData.organizeId.value = node.id;
            },
            detail(data) {
                this.detailModal = true;
                this.detailRow = [];
                this.detailRow.push(data);
            },
            edit(data) {
                this.editorContent = data.content;
                this.ruleId = data.id;
                this.ruleTitle = data.name;
                this.$refs.treeDom.setCheckedKeys(data.organizeid ? data.organizeid.split(',').filter(x => !!x) : []);
                this.newFlag = true;
            },
            newOne() {
                this.editorContent = '';
                this.ruleId = '';
                this.ruleTitle = '';
                this.$refs.treeDom.setCheckedKeys([]);
                this.newFlag = true;
            },
            save() {
                let d = {};
                d.organizeId = this.$refs.treeDom.getCheckedKeys().join(',');
                d.content = this.editorContent;
                d.name = this.ruleTitle || '';
                if (this.ruleId) {
                    d.id = this.ruleId;
                }
                if (!d.content || !d.organizeId) {
                    this.$Message.info('未填写内容或未选择制度范围哦');
                    return;
                }
                this.saveLoading = true;
                this.$http.post('rugulations/addRugulations', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('新增制度成功！');
                        this.$refs.paperList.getListData();
                    }
                    this.newFlag = false;
                    this.saveLoading = false;
                }, () => {
                    this.newFlag = false;
                    this.saveLoading = false;
                })
            },
            _getAllDepIds(data) {
                data.forEach((item) => {
                    this.allTreeId.push(item.id);
                    if (item.children) this._getAllDepIds(item.children);
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _getOrgTree() {
                return new Promise((resolve) => {
                    this.$http.get('/organize/organizeTreeCertainVm?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            resolve(res.data);
                        }
                    });
                });
            }
        },
        created() {
            this._setTableHeight();
            this._getOrgTree().then((res) => {
                this._getAllDepIds(res);
            });
        },
        computed: {
            realName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        components: {
            fsDepTree,
            WangEditor,
            fsTablePage,
            ruleModal
        }
    };
</script>

<style scoped>

</style>
