<template>
    <!--资产管理-->
    <div id="assetsRegister">
        <Card>
            <Form inline :label-width="50">
                <FormItem label="名称">
                    <Cascader style="width: 180px" change-on-select :data="cat1" v-model="selectArr"
                              :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="位置">
                    <Select type="text" style="width: 180px"
                            @on-change="_inputDebounce"
                            :clearable="true"
                            v-model="filterOpt.positionName"
                            placeholder="位置名称">
                        <Option v-for="(item, index) in positionList" :key="index" :value="item.name">
                            <span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt.approvalStatus"
                            @on-change="_inputDebounce">
                        <Option :value="0">在途</Option>
                        <Option :value="1">在用</Option>
                        <Option :value="2">备用</Option>
                        <Option :value="3">报废</Option>
                    </Select>
                </FormItem>
                <FormItem label="条码">
                    <Input type="text" clearable
                           v-model="filterOpt.bar_code"
                           @on-change="_inputDebounce"
                           placeholder="筛选条码"></Input>
                </FormItem>
                <FormItem label="使用者">
                    <Input type="text" clearable
                           v-model="filterOpt.use_name"
                           @on-change="_inputDebounce"
                           placeholder="筛选使用者"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <Button type="primary" v-if="accessBtn.indexOf(29) > -1" @click="addInfo">新增</Button>
                    <Button type="success" class="cusBtn" @click="_showCollext">
                        汇总
                    </Button>
<!--                    <Button type="error" class="cusBtn" :disabled="!checkedData.length" @click="_delApp">-->
<!--                        批量报废-->
<!--                    </Button>-->
                    <Button type="warning" class="cusBtn" v-if="accessBtn.indexOf(32) > -1" icon="upload" @click="appModal = true">资产导入</Button>
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(39) > -1" icon="upload" @click="allocationModal = true">调拨导入</Button>
                    <Button type="error" class="cusBtn" v-if="accessBtn.indexOf(38) > -1" icon="upload" @click="scrapModal = true">报废导入</Button>
<!--                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(31) > -1" @click="exportExcel"-->
<!--                            icon="code-download">-->
<!--                        导出-->
<!--                    </Button>-->
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   ref="attendanceTable"
                   :loading="tableLoading"
                   :height="tableHeight"
                   @on-selection-change="selectionChange"
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
        <!-- 添加修改 model-->
        <Modal v-model="addAssetsModal" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新增' : '修改'}}资产</span>
            </p>
            <Form style="margin-top: 20px" :label-width="100"
                  ref="addAssetsInfoForm" :model="addAssetsInfo"
                  :rules="addAssetsInfoRules">
                <Input type="text" style="display: none" v-model="addAssetsInfo.id"></Input>
                <Row :gutter="9">
                    <Col :span="12">
                        <FormItem label="名称: " v-if="!addAssetsInfo.id" prop="nameId">
                            <Cascader style="width: 100%" :data="cat1" v-model="selectArr2"
                                      :load-data="loadData"></Cascader>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="名称: " v-show="addAssetsInfo.id">
                            <Input style="width: 100%" v-model="addAssetsInfo.name" readonly></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="数量: " prop="num" v-if="!addAssetsInfo.id">
                            <InputNumber type="text" :min="1" :max="999" style="width: 100%"
                                         v-model="addAssetsInfo.num"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="状态: " prop="appStatus">
                            <Select style="width: 100%" v-model="addAssetsInfo.appStatus">
                                <Option :value="0">在途</Option>
                                <Option :value="1">在用</Option>
                                <Option :value="2">备用</Option>
                                <Option :value="3">报废</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="位置: " prop="positionName">
                            <Select type="text" style="width: 100%" v-model="addAssetsInfo.positionName"
                                    placeholder="位置名称">
                                <Option v-for="(item, index) in positionList" :label="item.name" :key="index"
                                        :value="item.name">
                                    <span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="规格: " prop="remarks">
                            <Input type="text" style="width: 100%" v-model="addAssetsInfo.remarks" placeholder="规格"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="使用者: " >
                            <Input type="text" style="width: 100%" v-model="addAssetsInfo.use_name" placeholder="使用者"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="条码: " prop="bar_code" v-if="addAssetsInfo.id">
                            <Input type="text" style="width: 100%" v-model="addAssetsInfo.bar_code" placeholder="条码"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="备注: " >
                            <Input type="text" style="width: 100%" v-model="addAssetsInfo.remark_c" placeholder="备注"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveInfo">
                    <span>{{classFormType === 'add'? '新增' : '修改'}}资产</span>
                </Button>
                <Button  @click="addAssetsModal = false">取消</Button>
            </div>
        </Modal>
        <!--资产批量导入-->
        <Modal v-model="appModal"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>资产批量导入</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadMuban(1)">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button><br>
            <Upload
                type="drag"
                :show-upload-list="false"
                :on-progress="_uploadProgress"
                :data="uploadData"
                :on-format-error="_uploadFormatErr"
                :on-success="_uploadSuccess1"
                :on-error="_uploadFail"
                :format="uploadOpt.format"
                action="/oa/assetsRegister/importAssetsRecord">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls/.xlsx的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
            </Upload>
            <div slot="footer">
                <Button type="primary" @click="appModal = false">取消</Button>
            </div>
        </Modal>
        <!--资产批量报废导入-->
        <Modal v-model="scrapModal"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>资产批量报废导入</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadMuban(2)">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button><br>
            <Upload
                type="drag"
                :show-upload-list="false"
                :on-progress="_uploadProgress"
                :data="uploadData"
                :on-format-error="_uploadFormatErr"
                :on-success="_uploadSuccess2"
                :on-error="_uploadFail"
                :format="uploadOpt.format"
                action="/oa/assetsRegister/importAppScrap">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls/.xlsx的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
            </Upload>
            <div slot="footer">
                <Button type="primary" @click="scrapModal = false">取消</Button>
            </div>
        </Modal>
        <!--资产批量调拨导入-->
        <Modal v-model="allocationModal"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>资产批量调拨导入</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadMuban(3)">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button><br>
            <Upload
                type="drag"
                :show-upload-list="false"
                :on-progress="_uploadProgress"
                :data="uploadData"
                :on-format-error="_uploadFormatErr"
                :on-success="_uploadSuccess3"
                :on-error="_uploadFail"
                :format="uploadOpt.format"
                action="/oa/assetsRegister/importAppAllocation">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls/.xlsx的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
            </Upload>
            <div slot="footer">
                <Button type="primary" @click="allocationModal = false">取消</Button>
            </div>
        </Modal>
        <!--根据条件汇总-->
        <Modal v-model="collectFlag" title="资产汇总" width="1000" :mask-closable="false">
            <Table :columns="collectColumns"
                   :height="tableHeight"
                   :data="collectData">
            </Table>
            <div slot="footer">
                <Button type="primary" @click="collectFlag = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import utils from '@/libs/util'

    export default {
        name: 'assetsRegister',
        data() {
            return {
                tableHeight: 500,
                addAssetsModal: false,
                appModal: false,
                allocationModal: false,
                scrapModal: false,
                collectFlag: false,
                classFormType: 'add',
                uploadOpt: {
                    format: ['xls','xlsx']
                },
                filterOpt: {
                    category1_id: '',
                    category2_id: '',
                    category3_id: '',
                    date: '',
                    approvalStatus: '',
                    positionName: '',
                    bar_code: '',
                    use_name: ''
                },
                selectArr2: [],
                checkedData: [],
                addAssetsInfo: {
                    id: 0,
                    name: '',
                    nameId: '',
                    positionName: 0,
                    appStatus: 0,
                    num: 1,
                    remarks: '',
                    bar_code: '',
                    use_name: '',
                    remark_c: ''
                },
                addAssetsInfoRules: {
                    nameId: [
                        {required: true, message: '资产名称不能为空!', type: 'number', trigger: 'blur'}
                    ],
                    num: [
                        {required: true, message: '数量不能为空!', type: 'number', trigger: 'blur'}
                    ],
                    positionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'blur'}
                    ],
                    remarks: [
                        {required: true, message: '请填写规格', trigger: 'blur'}
                    ],
                    appStatus: [
                        {required: true, message: '请选择状态', type: 'number', trigger: 'change'}
                    ],
                    bar_code: [
                        {required: true, message: '请填写条码', trigger: 'blur'}
                    ]
                },
                accessBtn: [],
                cat1: [],
                selectArr: [],
                positionList: [],
                collectData: [],
                changeInfoModal: false,
                idFlag: {
                    type: String,
                    default: 'id'
                },
                postColumns: [
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
                    {
                        title: '大类',
                        key: 'name1',
                        align: 'center'
                    },
                    {
                        title: '小类',
                        key: 'name2',
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'appstatus',
                        align: 'center',
                        render: (h, params) => {
                            // 0 在途 1 在用 2备用 3报废
                            let status = params.row.appstatus;
                            let color = ['blue', 'green', 'blue', 'red'];
                            let text = ['在途', '在用', '备用', '报废'];
                            let vm = this;
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                },
                                attrs: {
                                    title: '单击查看资产轨迹'
                                },
                                nativeOn: {
                                    click: () => {
                                        if (this.accessBtn.indexOf(30) > -1) {
                                            this.$http.get('assetsOperateLog/reviewProcess?id=' + params.row.id).then((res) => {
                                                if (res.success) {
                                                    let data = res.data;
                                                    let msg = '';
                                                    if (data.length <= 0) {
                                                        vm.$Message.info('不存在操作记录哦');
                                                        return;
                                                    }
                                                    for (let i = 0; i < data.length; i++) {
                                                        let name = data[i].operater_name;
                                                        let time = data[i].opt_time;
                                                        let opt = data[i].assets_type;
                                                        if (data[i].context) {
                                                            let context = data[i].context;
                                                            msg += `<p style='font-size: 16px;'>${name}<span style="margin: 0 10px 0 10px">${time}</span>${opt} ${context}`;
                                                        } else {
                                                            msg += `<p style='font-size: 16px;'>${name}<span style="margin: 0 10px 0 10px">${time}</span>${opt}`;
                                                        }
                                                        if (data[i].inpositionname) {
                                                            let inpositionname = data[i].inpositionname;
                                                            let outpositionname = data[i].outpositionname;
                                                            msg += `<span style="margin: 0 10px 0 10px">由${outpositionname}</span>到<span style="margin: 0 10px 0 10px">${inpositionname}</span>`;
                                                        }
                                                        msg += `</p>`;
                                                    }
                                                    vm.$Modal.info({
                                                        title: '操作记录',
                                                        width: 600,
                                                        content: msg
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            }, text[status]);
                        }
                    },
                    {
                        title: '位置',
                        key: 'positionname',
                        align: 'center'
                    },
                    {
                        title: '房间名',
                        key: 'remark',
                        align: 'center'
                    },
                    {
                        title: '规格',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '条码',
                        key: 'bar_code',
                        align: 'center'
                    },
                    {
                        title: '添加日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '报废方式',
                        key: 'scrappedtype',
                        align: 'center',
                         width: 100,
                        render: (h, params) => {
                            var status = params.row.scrappedtype;
                            if (status === 1) {
                                return h('span', '直接销毁');
                            }
                            if (status === 2) {
                                return h('span', '废品处理');
                            }
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark_c',
                        align: 'center'
                    },
                    {
                        title: '使用者',
                        key: 'use_name',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                         width: 100,
                        render: (h, params) => {
                            let row = params.row;
                            var vm = this;
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'edit',
                                    shape: 'circle'

                                },
                                attrs: {
                                    title: '单击修改资产'
                                },
                                on: {
                                    click: function () {
                                        vm.classFormType = 'update';
                                        vm.$refs.addAssetsInfoForm.resetFields();
                                        vm.addAssetsInfo.appStatus = row.appstatus;
                                        vm.addAssetsInfo.id = row.id;
                                        vm.addAssetsInfo.name = row.name;
                                        vm.addAssetsInfo.num = 1;
                                        vm.addAssetsInfo.remarks = row.remarks;
                                        vm.addAssetsInfo.positionName = row.positionname;
                                        vm.addAssetsInfo.use_name = row.use_name;
                                        vm.addAssetsInfo.remark_c = row.remark_c;
                                        vm.addAssetsInfo.bar_code = row.bar_code;
                                        vm.addAssetsModal = true;
                                    }
                                }
                            });
                        }
                    }
                ],
                collectColumns: [
                    {
                        title: '资产大类',
                        key: 'name1',
                        align: 'center'
                    },
                    {
                        title: '资产小类',
                        key: 'name2',
                        align: 'center'
                    },
                    {
                        title: '资产名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center'
                    },
                    {
                        title: '房间名',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'totalnum',
                        align: 'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: 'red'
                                }
                            }, params.row.totalnum);
                        }
                    },
                    {
                        title: '资产状态',
                        key: 'appstatus',
                        align: 'center',
                        render: (h, params) => {
                            // 0 在途 1 在用 2备用 3报废
                            let status = params.row.appstatus;
                            let color = ['blue', 'green', 'blue', 'red'];
                            let text = ['在途', '在用', '备用', '报废'];
                            // let vm = this;
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                }
                            }, text[status]);
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
            // console.log('btn:'  + this.$route.meta.btn.map(x => x.id))
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(30) < 0) {
                this.postColumns.splice(9, 1);
            }
            this.loadData(null, null, 1);
        },
        watch: {
            selectArr(arr) {
                [this.filterOpt.category1_id, this.filterOpt.category2_id, this.filterOpt.category3_id] = arr;
                this._inputDebounce();
            },
            selectArr2(arr) {
                [, , this.addAssetsInfo.nameId] = arr;
            }
        },
        methods: {
            // 初始化表格
            _initFormInfo() {
                this.addAssetsInfo = {
                    id: '',
                    name: '',
                    nameId: '',
                    positionName: 0,
                    appStatus: 0,
                    num: 1,
                    remarks: '',
                    bar_code: '',
                    use_name: '',
                    remark_c: ''
                }
                this.selectArr2 = [];
            },
            changeInfo(data) {
                this.baseInfo = data;
            },
            exportExcel() {
                var vm = this;
                this.$Modal.confirm({
                    title: '导出资产',
                    okText: '导出',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                margin: '30px auto',
                                width: '280px'
                            }
                        }, [
                            h('span', {
                                style: {
                                    marginRight: '10px'
                                }
                            }, '选择月份'),
                            h('DatePicker', {
                                props: {
                                    type: 'month',
                                    clearable: true,
                                    value: vm.filterOpt.date
                                },
                                on: {
                                    'on-change': (val) => {
                                        vm.filterOpt.date = val;
                                    }
                                }
                            }),
                            h('p', {
                                style: {
                                    color: '#ccc'
                                }
                            }, '不选月份下载全部')
                        ]);
                    },
                    onOk: () => {
                        let strExport = (vm.filterOpt.category1_id || '') + ',' +
                            (vm.filterOpt.category2_id || '') + ',' +
                            (vm.filterOpt.category3_id || '') + ',' +
                            (vm.filterOpt.approvalStatus || '') + ',' +
                            (vm.filterOpt.positionName || '');
                        var a = document.createElement('a');
                        a.type = 'download';
                        a.href = '/oa/assetsRegister/export?date=' + vm.filterOpt.date + '&strExport=' + strExport;
                        a.style.display = 'none';
                        a.id = 'temp1';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            },
            // uploadInfo(response, file, fileList) {
            //     if (response.success) {
            //         this._filterResultHandler();
            //         this.$Message.success('导入成功');
            //         this.appModal = false;
            //     } else {
            //         this.$Message.error('导入失败' + response.message);
            //     }
            // },
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
                });
            },
            // 加载资产名称
            loadData(item, callback, type) {
                if (item) {
                    item.loading = true;
                }
                if (!type) {
                    type = item.value;
                }
                let vm = this;
                let d = [];
                this.$http.post('assetsCategory/queryCategoryFather?pid=' + type).then((res) => {
                    var data = res.data;
                    if (res.success) {
                        for (let i = 0; i < data.length; i++) {
                            let tmp = data[i];
                            let obj = {'label': tmp.name, 'value': tmp.id};
                            if (tmp.leaf > 0) {
                                obj.children = [];
                                obj.loading = false;
                            }
                            d.push(obj);
                        }
                        if (item) {
                            item.children = d;
                        } else {
                            vm.cat1 = d;
                        }
                    }
                    if (item) {
                        item.loading = false;
                        callback();
                    }
                }, () => {
                    if (item) {
                        item.loading = false;
                        callback();
                    }
                })
            },
            // 提交添加、修改资产
            saveInfo() {
                let vm = this;
                this.$refs.addAssetsInfoForm.validate((isPass) => {
                    if (isPass) {
                        vm.$http.post('assetsRegister/addAndUpdate', vm.addAssetsInfo).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
                                vm.$Message.success('保存成功');
                                vm.addAssetsModal = false;
                            }
                        });
                    }
                });
            },
            // 打开新增资产弹框
            addInfo() {
                this.classFormType = 'add';
                this._initFormInfo();
                this.addAssetsModal = true;
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
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
                this.getList('/assetsRegister/appDateList', this.filterOpt);
            },
            _showCollext() {
                this.collectData = [];
                this.$http.post('assetsRegister/getCollectDatalist', this.filterOpt).then((res) => {
                    if (res.success) {
                        this.collectData = res.data;
                        this.collectFlag = true;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            // 批量报废
            _delApp() {
                if (this.checkedData.length) {
                    let sendDate = {};
                    sendDate.ids = this.checkedData.join(',');
                    this.$http.post('assetsRegister/getCollectDatalist', sendDate).then((res) => {
                        if (res.success) {
                            this._filterResultHandler();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else {
                    this.$Message.error('请选中行数据在进行操作');
                }
            },
            // 选择表格返回值方法
            selectionChange(data) {
                data.forEach(item => {
                    item._checked = true;
                });
                let chooseIdArr = data.map(x => x[this.idFlag]);
                this.pageData.list.forEach(item => {
                    item._checked = chooseIdArr.indexOf(item[this.idFlag]) > -1;
                });
                this.checkedData = data.map(x => x.id);
                console.log('checkedData:' + this.checkedData);
                // this.checkedData = data.map(x => x.id).join(',');
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadSuccess1(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('数据导入成功!');
                    this.appModal = false;
                    this._inputDebounce();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _uploadSuccess2(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('数据导入成功!');
                    this.scrapModal = false;
                    this._inputDebounce();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _uploadSuccess3(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('数据导入成功!');
                    this.allocationModal = false;
                    this._inputDebounce();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _uploadFail (error, file, fileList) {
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls/.xlsx');
            },
            // 下载导入模版
            _downloadMuban(type) {
                    if (1 === type) {
                        utils.downloadFile('/oa/down/importApp.xlsx', '批量上传资产模板.xlsx');
                    }
                    if (2 === type) {
                        utils.downloadFile('/oa/down/importAppScrap.xlsx', '批量上传资产报废模板.xlsx');
                    }
                    if (3 === type) {
                    utils.downloadFile('/oa/down/importAppAllcoation.xlsx', '批量上传资产调拨模板.xlsx');
                }
            }
        }
    };
</script>

<style lang="less">
    #assetsRegister {
        .cusBtn {
            span {
                vertical-align: middle;
            }

            i {
                vertical-align: middle;
                font-size: 19px;
            }
        }

    }
</style>
