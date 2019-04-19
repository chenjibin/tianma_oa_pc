<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="试题平台">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试题平台"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" icon="plus-round" @click="_addNewCate">
                            新增
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="tablePage"
                           url="/examquestion/datalist_question_subject"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="400"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{postFormType === 'add' ? '添加试题平台' : '修改试题平台'}}</span>
                </p>
                <Form :label-width="90"
                      :model="editorSettingData"
                      ref="editorForm"
                      :rules="addRules">
                    <FormItem label="试题平台" prop="name">
                        <Input type="text"
                               v-model="editorSettingData.name"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_confirmAdd">
                        {{postFormType === 'add' ? '新增' : '修改'}}
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'questionCateOne',
        data() {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'add',
                exportLoading: false,
                addRules: {
                    name: [
                        { required: true, message: '试题平台不能为空!', trigger: 'blur' }
                    ]
                },
                editorSettingData: {
                    name: '',
                    id: ''
                },
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: 2,
                        type: 'input'
                    }
                },
                postColumns: [
                    {
                        title: '试题平台',
                        key: 'name'
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
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改试题平台',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'edit',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._changeCate(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500
            }
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _initEditorSetting() {
                this.editorSettingData.name = '';
                this.editorSettingData.id = '';
                this.$refs.editorForm.resetFields();
            },
            _changeCate(data) {
                this._initEditorSetting();
                this.postFormType = 'update';
                this.editorSettingData.id = data.id;
                this.editorSettingData.name = data.name;
                this.editorSettingFlag = true;
            },
            _addNewCate() {
                this._initEditorSetting();
                this.postFormType = 'add';
                this.editorSettingFlag = true;
            },
            _confirmAdd() {
                this.$refs.editorForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.name = this.editorSettingData.name;
                        data.id = this.editorSettingData.id;
                        data.status = 2;
                        this.$http.post('/examquestion/add_question_subject', data).then((res) => {
                            if (res.success) {
                                this.editorSettingFlag = false;
                                let content = this.postFormType === 'add' ? '添加成功!' : '修改成功!';
                                this.$Message.success(content);
                                this.$refs.tablePage.getListData();
                            }
                        });
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage
        }
    }
</script>
