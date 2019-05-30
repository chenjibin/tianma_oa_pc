<template>
    <div id="assetsAllocation">
        <Card v-if="!isCommon">
            <Form inline :label-width="90">
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" :data="cat1" @on-change="changeCataName(1, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="移入位置">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.inPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="(item, index_si) in positionList" :key="index_si" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <Input style="display: none" v-model="filterOpt.type.value"></Input>
                <FormItem label="移出位置">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.outPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="(item, index_so) in positionList" :key="index_so" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="审批状态">
                    <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true"  style="width: 160px">
                        <Option :value="0">待审批</Option>
                        <Option :value="1">已审核</Option>
                        <Option :value="2">已拒绝</Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>调拨申请</span>
                </Button>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" :url="getListUrl"></fs-table-page>
        </Card>
        <div class="" v-else>
            <Form inline :label-width="90">
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" :data="cat1" @on-change="changeCataName(1, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="移入位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.inPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <Input style="display: none" v-model="filterOpt.type.value"></Input>
                <FormItem label="移出位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.outPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="审批状态">
                    <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true"  style="width: 160px">
                        <Option :value="0">待审批</Option>
                        <Option :value="1">已审批</Option>
                        <Option :value="2">已拒绝</Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>调拨申请</span>
                </Button>
                <Button type="primary" @click="$emit('to-bf')">
                    <span>进入资产采购/报废申请</span>
                    <Icon type="arrow-right-c"></Icon>
                </Button>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" :url="getListUrl"></fs-table-page>
        </div>
        <Modal v-model="addInfoModal" width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                新增/修改资产调拨申请
            </p>
            <Form style="margin-top: 20px" :label-width="120" ref="newApplyForm" :model="newApply" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="newApply.id"></Input>
                <FormItem label="资产名称" v-show="!newApply.id" prop="categoryName" >
                    <Cascader style="width: 100%" v-model="selectArr" :data="cat1" :clearable="true" @on-change="changeCataName(2, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="资产名称" v-if="newApply.id">
                    <Input style="width: 100%" v-model="newApply.categoryName" readonly></Input>
                </FormItem>
                <FormItem label="申请数量" prop="num">
                    <InputNumber :min="1" :max="999" style="width: 100%" v-model="newApply.num"></InputNumber>
                </FormItem>
                <FormItem label="资产条码" prop="bar_code" >
                    <Input type="textarea" placeholder="最大10个;请用逗号隔开,示例:1001,1002,1003" style="width: 100%" clearable v-model="newApply.bar_code"></Input>
                </FormItem>
                <FormItem label="移入位置" prop="inPositionName">
                    <Select type="text"  style="width: 100%" v-model="newApply.inPositionName" placeholder="位置名称">
                        <Option v-for="(item, index_i) in positionList" :key="index_i" :value="item.name">{{item.name}}<span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="移出位置" prop="outPositionName">
                    <Select type="text"  style="width: 100%" v-model="newApply.outPositionName" placeholder="位置名称">
                        <Option v-for="(item, index_o) in positionList" :key="index_o" :value="item.name">{{item.name}}<span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="申请原因" prop="remarks">
                    <Input type="text" style="width: 100%" v-model="newApply.remarks" prop="remarks" placeholder="申请原因"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">提交</Button>
                <Button size="large" @click="addInfoModal = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="approvalInfoModal" width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                审批资产调拨申请
            </p>
            <Form style="margin-top: 20px" :label-width="120" ref="approveForm" :model="approvalInfo" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="approvalInfo.id"></Input>
                <Input type="text" style="display: none" v-model="approvalInfo.approvalStatus"></Input>
                <FormItem label="资产名称">
                    <Input style="width: 100%" v-model="approvalInfo.cname" readonly></Input>
                </FormItem>
                <FormItem label="申请数量" >
                    <Input style="width: 100%" v-model="approvalInfo.num" readonly></Input>
<!--                    <InputNumber type="text" :min="1" :max="999" style="width: 100%" readonly v-model="approvalInfo.num"></InputNumber>-->
                </FormItem>
                <FormItem label="资产条码">
                    <Input type="textarea" style="width: 100%" v-model="approvalInfo.bar_code" readonly></Input>
<!--                    <Input type="textarea" placeholder="最大10个;请用逗号隔开,示例:1001,1002,1003" style="width: 100%" clearable v-model="newApply.bar_code"></Input>-->
                </FormItem>
                <FormItem label="移入位置">
                    <Input style="width: 100%" v-model="approvalInfo.inname" readonly></Input>
                </FormItem>
                <FormItem label="移出位置">
                    <Input style="width: 100%" v-model="approvalInfo.outname" readonly></Input>
                </FormItem>
                <FormItem label="审批意见" prop="content">
                    <Input type="textarea" style="width: 100%" v-model="approvalInfo.content"  placeholder="审批意见"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="success" @click="approval(1)" :disabled="isDisable">审核通过</Button>
                <Button type="warning" @click="approval(2)" :disabled="isDisable">审核拒绝</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsAllocation',
        props: {
            isCommon: {
                type: Boolean,
                default: false
            }
        },
        components: {fsTablePage},
        data() {
            return {
                isDisable: false,
                filterOpt: {
                    categoryName: {
                        value: '',
                        type: 'input'
                    },
                    type: {
                        value: 1,
                        type: 'input'
                    },
                    inPositionName: {
                        value: '',
                        type: 'select'
                    },
                    outPositionName: {
                        value: '',
                        type: 'select'
                    },
                    remarks: {
                        value: '',
                        type: 'select'
                    },
                    approvalStatus: {
                        value: 0,
                        type: 'select'
                    }
                },
                statusInfo: false,
                cat1: [],
                getListUrl: '/assetsAllocation/dataList',
                itemsType: 0, // 1查询 2采购申请
                newApplyModal: false,
                positionList: [],
                postColumns: [
                    {
                        title: '名称',
                        key: 'categoryname',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '移入位置',
                        key: 'inpositionname',
                        align: 'center'
                    },
                    {
                        title: '移入名称',
                        key: 'remark',
                        align: 'center'
                    },
                    {
                        title: '移出位置',
                        key: 'outpositionname',
                        align: 'center'
                    },
                    {
                        title: '移出名称',
                        key: 'remark1',
                        align: 'center'
                    },
                    {
                        title: '申请原因',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '申请人',
                        key: 'createbyname',
                        align: 'center'
                    },
                    {
                        title: '申请日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '调拨状态',
                        key: 'approvalstatus',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            let vm = this;
                            let row = params.row;
                            var appBtnStatus = (vm.accessBtn.indexOf(33) > -1) && (row.approvalstatus === 0);
                            switch (row.approvalstatus) {
                                case 0:
                                    color = 'blue';
                                    text = '审核中';
                                    break;
                                case 1:
                                    color = 'green';
                                    text = '已批准';
                                    break;
                                case 2:
                                    color = 'red';
                                    text = '已拒绝';
                                    break;
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    },
                                    attrs: {
                                        title: '点击查看审批流程'
                                    },
                                    nativeOn: {
                                        click: function() {
                                            vm.$http.get('assetsAllocation/reviewProcess?id=' + row.id).then((res) => {
                                                if (res.success) {
                                                    let data = res.data;
                                                    let msg = '';
                                                    let ops = ['审核中', '批准了', '拒绝了'];
                                                    if (data.length <= 0) {
                                                        msg = '<p style="font-size: 16px;">资产审批中，耐心等待</p>';
                                                    } else {
                                                        for (let i = 0; i < data.length; i++) {
                                                            let name = data[i].approvalbyname;
                                                            let time = data[i].modifybydate;
                                                            let opt = ops[data[i].approvalstatus];
                                                            msg += `<p style='font-size: 16px;'>${name || ''}<span style="margin: 0 10px 0 10px">${time || ''}</span>${opt} 此资产</p>`;
                                                        }
                                                    }
                                                    vm.$Modal.info({
                                                        title: '操作记录',
                                                        content: msg
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, text),
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: color
                                    },
                                    style: {
                                        display: appBtnStatus ? 'inline-block' : 'none'
                                    },
                                    attrs: {
                                        title: '点击开始审批'
                                    },
                                    nativeOn: {
                                        click: function() {
                                            vm.$refs.approveForm.resetFields();
                                            if (appBtnStatus) {
                                                vm.approvalInfo.id = row.id;
                                                vm.approvalInfo.num = row.num;
                                                vm.approvalInfo.bar_code = row.bar_code;
                                                vm.approvalInfo.cname = row.categoryname;
                                                vm.approvalInfo.inname = row.inpositionname + '  ' + row.remark;
                                                vm.approvalInfo.outname = row.outpositionname + '  ' + row.remark1;
                                                vm.approvalInfo.approvalStatus = row.approvalstatus;
                                                vm.approvalInfoModal = true;
                                            }
                                        }
                                    }
                                }, '审批我')
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            var row = params.row;
                            var disable = row.approvalstatus > 0;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle',
                                        disabled: disable
                                    },
                                    attrs: {
                                        title: '单击编辑'
                                    },
                                    on: {
                                        click: function() {
                                            vm.newApply.id = row.id;
                                            vm.newApply.categoryName = row.categoryname;
                                            vm.newApply.num = row.num;
                                            vm.newApply.remarks = row.remarks;
                                            vm.newApply.inPositionName = row.inpositionname;
                                            vm.newApply.outPositionName = row.outpositionname;
                                            vm.newApply.bar_code = row.bar_code;
                                            vm.addInfoModal = true;
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        icon: 'close',
                                        shape: 'circle',
                                        disabled: disable
                                    },
                                    attrs: {
                                        title: '单击删除'
                                    },
                                    style: {
                                        marginLeft: '10px'
                                    },
                                    on: {
                                        click: function() {
                                            vm.delInfo(row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                changeInfoModal: false,
                addInfoModal: false,
                approvalInfoModal: false,
                dataList: [],
                selectArr: [],
                accessBtn: [],
                newApply: {
                    id: '',
                    categoryName: '',
                    num: 1,
                    inPositionName: '',
                    outPositionName: '',
                    remarks: '',
                    bar_code: ''
                },
                approvalInfo: {
                    id: '',
                    num: 1,
                    cname: '',
                    inname: '',
                    outname: '',
                    approvalStatus: 0,
                    content: '',
                    bar_code: ''
                },
                newApplyRules: {
                    categoryName: [
                        {required: true, message: '资产名称不能为空!', trigger: 'change'}
                    ],
                    num: [
                        {type: 'number', required: true, message: '数量不能为空!', trigger: 'blur'}
                    ],
                    inPositionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'change'}
                    ],
                    outPositionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'change'}
                    ],
                    remarks: [
                        {required: true, message: '请填写原因', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请填写审批内容', trigger: 'blur'}
                    ],
                    bar_code: [
                        {required: true, message: '请填写条码', trigger: 'blur'}
                    ]
                },
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
            this.getPositionList();
            this.loadData();
            if (!this.isCommon) this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(33) > -1) {
                this.filterOpt.type.value = 0;
            }
        },
        methods: {
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
                });
            },
            changeCataName(type, arg) {
                var [value, selectedData] = arg;
                if (selectedData.length === 0) {
                    this.filterOpt.categoryName.value = undefined;
                    this.newApply.categoryName = undefined;
                    return;
                }
                if (type === 1) {
                    this.filterOpt.categoryName.value = selectedData[2].label;
                } else {
                    this.newApply.categoryName = selectedData[2].label;
                }
            },
            loadData(item, callback) {
                let type;
                if (item) {
                    type = item.value;
                    item.loading = true;
                } else {
                    type = 1;
                }
                let vm = this;
                let d = [];
                this.$http.post('assetsCategory/queryCategoryFather?pid=' + type).then((res) => {
                    let data = res.data;
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
            saveInfo() {
                let vm = this;
                let refT = this.$refs.fsTable;
                let newApplyForm = this.$refs.newApplyForm;
                newApplyForm.validate((vpass) => {
                    if (vpass) {
                        vm.$http.post('/assetsAllocation/add', this.newApply).then((res) => {
                            if (res.success) {
                                vm.$Message.success('保存成功');
                                vm.addInfoModal = false;
                                newApplyForm.resetFields();
                                refT._filterResultHandler();
                            }
                        });
                    }
                });
            },
            // 提交审批
            approval(type) {
                if (!type) {
                    return;
                }
                this.approvalInfo.approvalStatus = type;
                let vm = this;
                let refT = this.$refs.fsTable;
                this.isDisable = true;
                this.$refs.approveForm.validate((valid) => {
                    if (valid) {
                        this.$http.post('assetsAllocation/approval', vm.approvalInfo).then((res) => {
                            if (res.success) {
                                vm.$Message.success('审批成功');
                                vm.approvalInfoModal = false;
                                refT._filterResultHandler();
                            }
                            this.isDisable = false;
                        });
                    } else {
                        this.isDisable = false;
                    }
                })
            },
            addInfo() {
                this.newApply.id = '';
                this.newApply.categoryName = '';
                this.newApply.num = 1;
                this.newApply.inPositionName = '';
                this.newApply.outPositionName = '';
                this.newApply.remarks = '';
                this.newApply.bar_code = '';
                this.selectArr = [];
                this.addInfoModal = true;
            },
            delInfo(row) {
                let vm = this;
                let refT = this.$refs.fsTable;
                let d = {};
                d.id = row.id;
                if (row.approvalstatus > 0) {
                    this.$Message.info('审批中的资产不能删除');
                    return;
                }
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/assetsAllocation/delete', d).then((res) => {
                            if (res.success) {
                                refT._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        }
    };
</script>

<style lang="less">
</style>
