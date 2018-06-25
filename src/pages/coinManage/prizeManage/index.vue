<template>
    <div>
        <Card>
            <Form inline :label-width="60" @submit.native.prevent>
                <FormItem label="奖品名称">
                    <Input v-model="filterOpt.name.value"
                           placeholder="筛选奖品名称"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="_createGoods">
                            <Icon type="plus-round"></Icon>
                            新增
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="priceTable"
                           url="/lottery/goodslist"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{editorType === 'create' ? '新增奖品' : '修改奖品'}}</span>
                </p>
                <Form :label-width="80"
                      :rules="formRule"
                      ref="formFo"
                      :model="editorSettingData">
                    <FormItem label="是否下架" v-show="editorType === 'update'">
                        <i-switch v-model="editorSettingData.isDown" size="large">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="奖品名称" prop="goodsName">
                        <Input type="text"
                               v-model="editorSettingData.goodsName"></Input>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Select v-model="editorSettingData.type"
                                style="width: 100px">
                            <Option value="实物类">实物类</Option>
                            <Option value="虚拟类">虚拟类</Option>
                            <Option value="金币">金币</Option>
                            <Option value="未中奖">未中奖</Option>
                            <Option value="纸品类">纸品类</Option>
                            <Option value="饮品类">饮品类</Option>
                            <Option value="食品类">食品类</Option>
                            <Option value="卡券类">卡券类</Option>
                            <Option value="服饰类">服饰类</Option>
                        </Select>
                    </FormItem>
                    <Row>
                        <Col :span="8">
                        <FormItem label="奖品数量">
                            <InputNumber :precision="0" v-model="editorSettingData.number"></InputNumber>
                        </FormItem>
                        </Col>
                        <Col :span="8">
                        <FormItem label="奖品价格">
                            <InputNumber :precision="0" v-model="editorSettingData.price"></InputNumber>
                        </FormItem>
                        </Col>
                        <Col :span="8">
                        <FormItem label="奖品概率">
                            <InputNumber :precision="0" v-model="editorSettingData.probability"></InputNumber>
                        </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="奖品图片" required>
                        <fs-img-upload action="/oa/lottery/uploadfile"
                                       path="/oa/upload/"
                                       ref="imgUploadFo"
                                       :upload.sync="imgFile"></fs-img-upload>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_confirmAddGoods">
                        {{editorType === 'create' ? '添加奖品' : '修改奖品'}}
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    export default {
        name: 'prizeManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                editorType: 'create',
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    }
                },
                editorSettingData: {
                    goodsName: '',
                    type: '卡券类',
                    number: 0,
                    price: 0,
                    probability: 0,
                    isDown: true,
                    id: 0
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '奖品名称',
                        key: 'lottery_name',
                        align: 'center'
                    },
                    {
                        title: '图片',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('img', {
                                style: {
                                    maxWidth: '100%',
                                    height: 'auto'
                                },
                                attrs: {
                                    src: '/oa/upload/' + params.row.image_path
                                }
                            });
                        }
                    },
                    {
                        title: '数量',
                        key: 'number',
                        align: 'center'
                    },
                    {
                        title: '价格',
                        key: 'price',
                        align: 'center'
                    },
                    {
                        title: '概率',
                        key: 'probability',
                        align: 'center'
                    },
                    {
                        title: '商品分类',
                        key: 'classification',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.status === '下架' ? 'red' : 'green'
                                }
                            }, params.row.status);
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
                                        content: '修改',
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
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                imgFile: [],
                formRule: {
                    goodsName: [
                        { required: true, message: '商品名称不能为空!', trigger: 'blur' }
                    ]
                },
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _confirmAddGoods() {
                let vm = this;
                vm.$refs.formFo.validate((valid) => {
                    if (valid) {
                        let data = {};
                        let settingData = vm.editorSettingData;
                        if (!this.imgFile.length) {
                            vm.$Message.error('商品图片不能为空!');
                            return;
                        }
                        data.lottery_name = settingData.goodsName;
                        data.classification = settingData.type;
                        data.price = settingData.price;
                        data.probability = settingData.probability;
                        data.uploadName = this.imgFile[0].name;
                        data.number = settingData.number;
                        if (this.editorType === 'update') {
                            data.id = settingData.id;
                            data.status = settingData.isDown ? '上架' : '下架';
                        }
                        vm.$http.post('/lottery/addGoods', data).then((res) => {
                            if (res.success) {
                                vm.editorSettingFlag = false;
                                vm.$Message.success('操作成功!');
                                vm.$refs.priceTable.getListData();
                            }
                        });
                    }
                });
            },
            _createGoods() {
                this._initEditorSettingData();
                this.editorType = 'create';
                this.editorSettingFlag = true;
            },
            _initEditorSettingData() {
                let settingData = this.editorSettingData;
                settingData.goodsName = '';
                settingData.type = '卡券类';
                settingData.price = 0;
                settingData.isDown = false;
                settingData.probability = 0;
                settingData.number = 0;
                settingData.id = 0;
                this.imgFile = [];
                this.$refs.imgUploadFo.removeAllPicFlie();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _editorSetting(data) {
                this.editorType = 'update';
                this._initEditorSettingData();
                let settingData = this.editorSettingData;
                settingData.id = data.id;
                settingData.price = data.price;
                settingData.goodsName = data.lottery_name;
                settingData.type = data.classification;
                settingData.isDown = data.status === '上架';
                settingData.probability = data.probability;
                settingData.number = data.number;
                this.imgFile = [{url: '/oa/upload/' + data.image_path, name: data.image_path, status: 'finished'}];
                this.editorSettingFlag = true;
            }
        },
        components: {
            fsImgUpload,
            fsTablePage
        }
    };
</script>
