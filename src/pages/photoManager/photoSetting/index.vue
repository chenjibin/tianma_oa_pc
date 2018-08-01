<template>
    <div>
        <Card>
            <Form inline :label-width="100">
                <FormItem label="是否首页展示">
                    <Select v-model="filterOpt.isShowpic.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="0">否</Option>
                        <Option :value="1">是</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button  @click="_addSettingOpen" icon="md-add" type="primary">
                            新建主题
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="themeTable"
                           url="/staffPresence/getStaffPresenceList"></fs-table-page>
            <Modal v-model="depSettingFlag"
                   :mask-closable="false"
                   width="800">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{formType === 'create' ? '新增主题' : '修改主题'}}</span>
                </p>
                <Form :model="depSettingForm"
                      ref="articleForm"
                      @submit.native.prevent
                      :label-width="100"
                      :rules="articleRules">
                    <Row :gutter="16">
                        <Col :span="24">
                            <FormItem prop="item" label="主题">
                                <Input v-model="depSettingForm.item"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem prop="detail" label="主题介绍">
                                <Input v-model="depSettingForm.detail"
                                       type="textarea"
                                       :autosize="{minRows: 2,maxRows: 5}"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem prop="award" label="活动奖励">
                                <Input v-model="depSettingForm.award"
                                       type="textarea"
                                       :autosize="{minRows: 2,maxRows: 5}"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12">
                            <FormItem prop="hostUnit" label="主办方">
                                <Input v-model="depSettingForm.hostUnit"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12">
                            <FormItem prop="endTime" label="活动结束时间">
                                <DatePicker type="date"
                                            @on-change="depSettingForm.endTime = $event"
                                            :value="depSettingForm.endTime"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="主题图片" required>
                                <fs-img-upload action="/oa/staffPresence/uploadFile"
                                               :maxSize="20480"
                                               :params="{'type': 1}"
                                               ref="imgUploadFo"
                                               :upload.sync="imgFile"></fs-img-upload>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem prop="isShowpic" label="是否首页展示">
                                <i-switch v-model="depSettingForm.isShowpic" size="large" :true-value="1" :false-value="0">
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            v-show="formType === 'create'"
                            @click="_createTheme">新增主题</Button>
                    <Button type="primary"
                            @click="_updateTheme"
                            v-show="formType === 'update'">修改主题</Button>
                    <Button  style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'photoSetting',
        data() {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle'
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                depSettingFlag: false,
                formType: '',
                imgFile: [],
                tableHeight: 300,
                settingId: null,
                articleRules: {
                    item: [
                        {required: true, message: '主题不能为空！'}
                    ],
                    detail: [
                        {required: true, message: '介绍不能为空！'}
                    ],
                    // award: [
                    //     {required: true, message: '奖品不能为空！'}
                    // ],
                    hostUnit: [
                        {required: true, message: '主办方不能为空！'}
                    ],
                    endTime: [
                        {required: true, message: '结束时间不能为空！', trigger: 'change'}
                    ]
                },
                depSettingForm: {
                    isShowpic: 0,
                    item: '',
                    detail: '',
                    award: '',
                    hostUnit: '',
                    endTime: ''
                },
                filterOpt: {
                    isShowpic: {
                        value: '',
                        type: 'select'
                    }
                },
                postColumns: [
                    {
                        title: '活动主题',
                        key: 'item'
                    },
                    {
                        title: '活动介绍',
                        key: 'detail'
                    },
                    {
                        title: '主题主图',
                        key: 'states',
                        align: 'center',
                        width: 240,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    'position': 'relative',
                                    'paddingTop': '56%',
                                    'margin': '6px 0',
                                    'width': '100%'
                                }
                            }, [
                                h('img', {
                                    attrs: {
                                        src: params.row.file_path
                                    },
                                    style: {
                                        'position': 'absolute',
                                        'left': '0',
                                        'top': '0',
                                        'zIndex': '1',
                                        'height': '100%',
                                        'width': '100%'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '活动奖励',
                        key: 'award'
                    },
                    {
                        title: '主办方',
                        key: 'host_unit',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '剩余天数',
                        key: 'end_day',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '是否首页展示',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.show_pic === 1 ? '是' : '否');
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '修改主题', icon: 'md-create', foo: vm._settingEditor})
                            ]);
                        }
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _addSettingOpen() {
                this.formType = 'create';
                this._initEditorSettingData();
                this.depSettingFlag = true;
            },
            _settingEditor(data) {
                this.formType = 'update';
                this._initEditorSettingData();
                let depSettingForm = this.depSettingForm;
                depSettingForm.item = data.item;
                depSettingForm.detail = data.detail;
                depSettingForm.award = data.award;
                depSettingForm.hostUnit = data.host_unit;
                depSettingForm.endTime = data.end_time.split(' ')[0];
                depSettingForm.isShowpic = data.show_pic;
                this.imgFile = [{url: data.file_path, status: 'finished'}];
                this.settingId = data.id;
                this.depSettingFlag = true;
            },
            _createTheme() {
                if (!this.imgFile.length) {
                    this.$Message.error('主题图片不能为空!');
                }
                this.$refs.articleForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        let settingForm = this.depSettingForm;
                        data.item = settingForm.item;
                        data.detail = settingForm.detail;
                        data.award = settingForm.award;
                        data.hostUnit = settingForm.hostUnit;
                        data.endTime = settingForm.endTime;
                        data.fileName = this.imgFile[0].url;
                        data.isShowpic = settingForm.isShowpic;
                        this.$http.post('/staffPresence/addStaffPresence', data).then((res) => {
                            if (res.success) {
                                this.$refs.themeTable.getListData();
                                this.depSettingFlag = false;
                            }
                        });
                    }
                });
            },
            _updateTheme() {
                if (!this.imgFile.length) {
                    this.$Message.error('主题图片不能为空!');
                }
                this.$refs.articleForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        let settingForm = this.depSettingForm;
                        data.id = this.settingId;
                        data.item = settingForm.item;
                        data.detail = settingForm.detail;
                        data.award = settingForm.award;
                        data.hostUnit = settingForm.hostUnit;
                        data.endTime = settingForm.endTime;
                        data.fileName = this.imgFile[0].url;
                        data.isShowpic = settingForm.isShowpic;
                        this.$http.post('/staffPresence/updateStaffPresence', data).then((res) => {
                            if (res.success) {
                                this.$refs.themeTable.getListData();
                                this.depSettingFlag = false;
                            }
                        });
                    }
                });
            },
            _initEditorSettingData() {
                let settingData = this.depSettingForm;
                settingData.isShowpic = 0;
                settingData.item = '';
                settingData.detail = '';
                settingData.award = '';
                settingData.hostUnit = '';
                this.settingId = null;
                this.imgFile = [];
                this.$refs.imgUploadFo.removeAllPicFlie();
            }
        },
        components: {
            fsImgUpload,
            fsTablePage
        }
    };
</script>
