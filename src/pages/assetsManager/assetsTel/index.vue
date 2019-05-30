<template>
    <!--资产盘点管理-->
    <div id="assetsTel">
        <Card>
            <Form inline :label-width="50">
                <FormItem label="号码">
                    <Input type="text" clearable
                           v-model="filterOpt.tel.value"  placeholder="筛选号码"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt.status.value">
                        <Option :value="0">正常</Option>
                        <Option :value="1">删除</Option>
                    </Select>
                </FormItem>
                <FormItem label="月费用">
                    <Input type="text" clearable
                           v-model="filterOpt.money.value"  placeholder="筛选套餐费用"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text" clearable
                           v-model="filterOpt.orangeName.value"  placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="使用者">
                    <Input type="text" clearable
                           v-model="filterOpt.use_name.value"  placeholder="筛选使用者"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(40) > -1" @click="_showModel" >新增套餐</Button>
                </FormItem>
            </Form>
            <fs-table-page :params="filterOpt" :columns="postColumns" ref="telInfoForm"
                           :height="tableHeight" url="/assetsTelCard/queryDataList"></fs-table-page>
        </Card>
        <!-- 添加修改 model-->
        <Modal v-model="telModal" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新增' : '修改'}}套餐</span>
            </p>
            <Form style="margin-top: 20px" :label-width="100"
                  ref="telForm" :model="telInfo"
                  :rules="telRules">
                <Input type="text" style="display: none" v-model="telInfo.id"></Input>
                <Row :gutter="9">
                    <Col :span="12">
                        <FormItem label="电话号码" prop="tel">
                            <Input style="width: 100%" v-model="telInfo.tel" placeholder="电话号码" clearable />
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="月消费" prop="money">
                            <InputNumber type="text" :min="1" :max="999" style="width: 100%"
                                         v-model="telInfo.money" placeholder="月消费金额" clearable />
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="使用者" v-show="usernameisShow">
                            <Input style="width: 100%" v-model="telInfo.use_name" clearable @on-focus="changeShow"/>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="使用者" v-show="!usernameisShow" prop="use_id">
                            <Select v-model="telInfo.use_id"
                                    filterable
                                    remote
                                    :label="userLabel"
                                    :remote-method="_filterPeopleRemote">
                                <Option v-for="option in filterPeopleOpt" :value="option.id" :key="'user' + option.id">
                                    {{option.realname + '(' + option.organizename + ')'}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="状态: " prop="status">
                            <Select style="width: 100%" v-model="telInfo.status" clearable>
                                <Option :value="0">正常</Option>
                                <Option :value="1">删除</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="部门" prop="dep">
                            <el-cascader
                                :options="orgComboList"
                                :props="depProps"
                                v-model="telInfo.dep"
                                change-on-select
                                size="small"
                                style="width: 100%"
                            ></el-cascader>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="套餐详情" prop="info">
                            <Input type="textarea" style="width: 100%" v-model="telInfo.info" clearable
                                   placeholder="套餐详情"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="业务备注">
                            <Input type="textarea" style="width: 100%" v-model="telInfo.busRemarks" clearable
                                   placeholder="业务备注"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="备注">
                            <Input type="textarea" style="width: 100%" v-model="telInfo.remarks" clearable
                                   placeholder="备注"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveInfo" >{{classFormType === 'add'? '新增' : '修改'}}套餐</Button>
                <Button  @click="telModal = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsTel',
        components: {
            fsTablePage
        },
        data() {
            return {
                tableHeight: 500,
                telModal: false,
                classFormType: 'add',
                orgComboList: [],
                telInfoId: '',
                filterPeopleOpt: [],
                userLabel: false,
                usernameisShow: false,
                accessBtn: [],
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                filterOpt: {
                    tel: {
                        value: '',
                        type: 'input'
                    },
                    money: {
                        value: '',
                        type: 'input'
                    },
                    orangeName: {
                        value: '',
                        type: 'input'
                    },
                    use_name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    }
                },
               telInfo: {
                   id: '',
                   tel: '',
                   money: 1,
                   info: '',
                   busRemarks: '',
                   use_name: '',
                   use_id: '',
                   status: '',
                   remarks: '',
                   dep: []
                },
                // 表格验证
                telRules: {
                    tel: [
                        {required: true, message: '请填写电话号码', trigger: 'blur'}
                    ],
                    money: [
                        {required: true, message: '请填写月套餐金额', type: 'number', trigger: 'blur'}
                    ],
                    info: [
                        {required: true, message: '请填写套餐明细', trigger: 'blur'}
                    ],
                    use_name: [
                        {required: true, message: '请填写使用者', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', type: 'number', trigger: 'change'}
                    ],
                    dep: [
                        {type: 'array', required: true, message: '部门不能为空', trigger: 'blur'}
                    ],
                    use_id: [
                        {required: true, message: '请填写使用者', type: 'number', trigger: 'change'}
                    ]
                },
                // 主列表项
                postColumns: [
                    {
                        title: '部门名称',
                        align: 'center',
                        key: 'orangename'
                    },
                    {
                        title: '使用者',
                        align: 'center',
                        key: 'use_name'
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        key: 'tel'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            // 0. 正常，1 删除'
                            let status = params.row.status;
                            let color = ['green','red'];
                            let text = ['正常', '删除'];
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                }
                            }, text[status]);
                        }
                    },
                    {
                        title: '套餐(元/月)',
                        align: 'center',
                        key: 'money'
                    },
                    {
                        title: '套餐详情',
                        align: 'center',
                        key: 'info'
                    },
                    {
                        title: '业务备注',
                        align: 'center',
                        key: 'busremarks'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remarks'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '单击修改',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'compose',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function(e) {
                                                e.stopPropagation();
                                                vm._showInfo(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ]
            }
        },
        created() {
            this._setTableHeight();
            this._getOrgComboList();
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(40) < 0) {
                this.postColumns.splice(8, 1);
            }
        },
        methods: {
            changeShow() {
              this.usernameisShow = false;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 270;
            },
            _initTelInfo() {
                this.telInfo = {
                    id: '',
                    tel: '',
                    money: 1,
                    info: '',
                    busRemarks: '',
                    use_name: '',
                    use_id: '',
                    status: '',
                    remarks: '',
                    dep: []
                }
            },
            _showModel() {
                this.usernameisShow = false;
                this._initTelInfo();
                this.$refs.telForm.resetFields();
                this.classFormType = 'add';
                this.telModal = true;
            },
            // 获取部门列表
            _getOrgComboList() {
                this.$http.get('/organize/organizeTreeCertainVmC?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgComboList = res.data;
                    }
                });
            },
            // 远程用户筛选
            _filterPeopleRemote(val) {
                if (val !== '') {
                    this.userLabel = true;
                    setTimeout(() => {
                        this.userLabel = false;
                        let data = {};
                        data.name = val;
                        this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                            if (res.success) {
                                this.filterPeopleOpt = res.data;
                            }
                        });
                    }, 200);
                } else {
                    this.filterPeopleOpt = [];
                }
            },
            // 提交
            saveInfo() {
                this.$refs.telForm.validate((valid) => {
                    if (valid) {
                        let data = this.telInfo;
                        data.orangeId = data.dep.slice(-1)[0] || '';
                        if (this.classFormType !== 'add') {
                            data.id = this.telInfoId;
                        }
                        this.$http.post('/assetsTelCard/addUpdateInfo ', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this.$refs.telInfoForm.getListData();
                                this.telModal = false;
                            }
                        });
                    }
                })
            },
            // 展示修改弹框数据
            _showInfo(data) {
                var vm = this;
                this.usernameisShow = true;
                vm.classFormType = 'update';
                vm.telInfoId = data.id;
                vm.telInfo.tel = data.tel;
                vm.telInfo.use_name = data.use_name;
                vm.telInfo.use_id = data.use_id;
                vm.telInfo.busRemarks = data.busremarks;
                vm.telInfo.info = data.info;
                vm.telInfo.status = data.status;
                vm.telInfo.remarks = data.remarks;
                vm.telInfo.dep = vm._returnOrgIds(data.orangeid);
                this.telModal = true;
             },
            _returnOrgIds(id) {
                if (!this.orgComboList[0]) return [];
                let depsStore = this.orgComboList;
                let path = [];
                this.storePath = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            }
        }
    }
</script>
