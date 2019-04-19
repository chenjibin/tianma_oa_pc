<template>
    <div>
        <Row :gutter="6">
            <Col :span="4">
            <fs-dep-tree url="/organize/userOrganizeTreeByCard?fatherId=-1"
                         @node-change="_nodeChangeHandler($event)"
                         :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
            <Card>
                <Form ref="searchData" :model="searchData" inline :label-width="40">
                    <FormItem prop="realName" label="姓名">
                        <Input type="text" clearable
                               v-model="searchData.realName.value"
                               placeholder="筛选姓名"></Input>
                    </FormItem>
                    <FormItem prop="postName" label="岗位">
                        <Input type="text" clearable
                               v-model="searchData.postName.value"
                               placeholder="筛选岗位"></Input>
                    </FormItem>
                    <FormItem label="角色">
                        <Select filterable v-model="searchData.roleId.value"
                                clearable
                                :transfer="true"
                                placeholder="输入查询角色" style="width: 200px">
                            <Option :value="item.id" :label="isManger > 1 ?item.name:item.name+' '+item.companyname"
                                    v-for="(item, index) in roleCombo" :key="'role' + index">
                                {{item.name}}
                                <span v-if="isManger == 0 || isManger == 1" :title="item.companyname"
                                style="float:right;color:#ccc;width:65px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.companyname}}</span>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="searchData.card_states.value"
                                clearable
                                placeholder="筛选状态"
                                style="width: 100px">
                            <Option value="0">注销</Option>
                            <Option value="1">使用中</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="在职">
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
                            <Button type="success"
                                    @click="_openUploadModel">
                                <Icon type="ios-cloud-upload-outline"></Icon>
                                批量充值
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                    <FormItem :label-width="0.1">
                        <div class="" style="font-size: 16px;font-weight: 700;">
                            <span>账户余额汇总:</span>
                            <span>{{totalMoney}}元</span>
                        </div>
                    </FormItem>
                </Form>
                <fs-table-page :columns="columns1"
                               :size="null"
                               :height="tableHeight"
                               :params="searchData"
                               @get-list="_getMoney"
                               ref="fsTable"
                               url="/user/dataList"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="checkLogFlag"
               :mask-closable="false"
               width="800">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>（{{realName}}）饭卡设置</span>
            </p>
            <div id="food-setting-modal">
                <div class="food-set-line">
                    <h3>饭卡状态:</h3>
                    <i-switch v-model="cardStates"
                              size="large"
                              :true-value="1"
                              :false-value="0"
                              @on-change="cardStatesChange">
                        <span slot="open">使用</span>
                        <span slot="close">注销</span>
                    </i-switch>
                </div>
                <div class="food-set-line">
                    <h3>饭卡卡号:</h3>
                    <template v-if="cardNumber">
                        <Input v-model="cardNumber" size="large" readonly style="width: 240px" ></Input>
                        <Button type="primary" @click.stop="bindOpen = true">绑定新饭卡</Button>
                    </template>
                    <Button type="primary" v-else @click.stop="bindOpen = true">绑定饭卡</Button>
                    <div class="expend-block" v-show="bindOpen" style="margin-top: 8px">
                        <Input v-model="newCardNumber" size="large" style="width: 240px" ></Input>
                        <Button type="primary" @click.stop="confirmBindCard">确认绑定</Button>
                        <Button @click.stop="bindOpen = false">取消</Button>
                    </div>
                </div>
                <div class="food-set-line">
                    <h3>饭卡餐费:</h3>
                    <div class="">
                        <span>余额:</span>
                        <span>{{mealfee}}</span>
                        <Button type="text" @click.stop="cashInOpen = true">充值</Button>
                    </div>
                    <div class="expend-block" v-show="cashInOpen" style="margin-top: 8px">
                        <Input v-model="cashIn" size="large" style="width: 240px" ></Input>
                        <Button type="primary" @click.stop="confirmCashIn">确认充值</Button>
                        <Button @click.stop="cashInOpen = false">取消</Button>
                    </div>
                    <div class="expend-block" v-show="cashInOpen" style="margin-top: 8px">
                        <span>充值方式: </span>
                        <input type="radio" v-model="type_c" value="0"  style="margin-left: 8px">
                        <span style="color: green;font-size: small">支付宝</span>
                        <input type="radio" v-model="type_c" value="1" >
                        <span style="color: red;font-size: small">初始值</span>
                    </div>
                    <div class="expend-block" v-show="cashInOpen" style="margin-top: 8px">
                        <Input v-model="beizhu" size="large" placeholder="备注(非必填)" style="width: 240px" ></Input>
                    </div>
                </div>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="importModalFlag"
               width="400"
               top="250"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>批量充值</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadGradeMuban">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button>
            <Upload type="drag"
                    :show-upload-list="false"
                    :on-progress="_uploadProgress"
                    :on-format-error="_uploadFormatErr"
                    :on-success="_uploadSuccess"
                    :format="uploadFormat"
                    action="/oa/card/bulkImport">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-show="spinShow">成绩上传中...</Spin>
            </Upload>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<style lang="less">
    #food-setting-modal {
        .food-set-line {
            margin-bottom: 32px;
            font-size: 16px;
            h3 {
                margin-bottom: 8px;
                font-size: 18px;
            }
        }
    }
</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page'
    import fsDepTree from '@/baseComponents/fs-dep-tree'
    import utils from '@/libs/util'

    export default {
        name: 'foodCardManage',
        data() {
            return {
                tableHeight: 300,
                checkLogFlag: false,
                bindOpen: false,
                cashInOpen: false,
                importModalFlag: false,
                spinShow: false,
                uploadFormat: ['xls'],
                newCardNumber: null,
                cashIn: null,
                beizhu: '',
                id: null,
                totalMoney: 0,
                realName: '',
                cardStates: 0,
                cardNumber: 0,
                mealfee: 0,
                type_c: 0,
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户ID',
                        key: 'id',
                        align: 'center',
                        width: 80
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
                        title: '卡号',
                        key: 'cardnumber',
                        width: 160
                    },
                    {
                        title: '餐费',
                        key: 'mealfee',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '状态',
                        key: 'card_states',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.card_states === 0 ? 'red' : 'green'
                                }
                            }, +params.row.card_states === 0 ? '注销' : '使用中');
                        }
                    },
                    {
                        title: '在职',
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
                        width: 90,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
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
                    states: {
                        value: 1,
                        type: 'select'
                    },
                    postName: {
                        value: '',
                        type: 'input'
                    },
                    card_states: {
                        value: '',
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
            _downloadGradeMuban() {
                utils.downloadFile('/oa/down/批量充值模板.xls', '批量充值模板.xls');
            },
            _openUploadModel() {
                this.importModalFlag = true;
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('批量充值成功!');
                    this.importModalFlag = false;
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            confirmBindCard() {
                const {id, newCardNumber} = this
                this.$http.post('/card/bindCardNumber', {id, cardNumber: newCardNumber}).then((res) => {
                    if (res.success) {
                        this._updateTable()
                        this._getNewUserInfo()
                        this._initEditorField()
                    }
                    console.log(res)
                })
            },
            confirmCashIn() {
                const {id, cashIn, beizhu, type_c} = this
                this.$http.post('/card/recharge', {id, money: cashIn, beizhu, type_c}).then((res) => {
                    if (res.success) {
                        this.$Message.success('充值成功！')
                        this._updateTable()
                        this._getNewUserInfo()
                        this._initEditorField()
                    }
                    console.log(res)
                })
            },
            cardStatesChange(val) {
                let sendData = {}
                sendData.id = this.id
                sendData.cardStates = val
                this.$http.post('/card/updateCardStates', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('饭卡状态设置成功！')
                        this._updateTable()
                        this._getNewUserInfo()
                        this._initEditorField()
                    }
                    console.log(res)
                })
            },
            _initEditorField() {
                this.bindOpen = false
                this.cashInOpen = false
                this.newCardNumber = null
                this.cashIn = null
            },
            _editorSetting(data) {
                console.log(data)
                this._initEditorField()
                this.realName = data.realname
                this.cardStates = data.card_states
                this.id = data.id
                this.mealfee = data.mealfee
                this.cardNumber = data.cardnumber
                this.checkLogFlag = true
            },
            _getRoleData() {
                this.$http.get('/role/getRoleCombo').then((res) => {
                    if (res.success) {
                        this.roleCombo = res.data;
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _checkLogOpen(data) {
            },
            _nodeChangeHandler(node) {
                this.searchData.nodeId.value = node.id;
                this._getMoney();
            },
            _getNewUserInfo() {
                this.$http.get('/user/getUserById', {params: {id: this.id}}).then((res) => {
                    if (res.success) {
                        const data = res.data
                        this.realName = data.realname
                        this.cardStates = data.card_states
                        this.id = data.id
                        this.mealfee = data.mealfee
                        this.cardNumber = data.cardnumber
                    }
                })
            },
            _updateTable() {
                this.$refs.fsTable.getListData()
                this._getMoney();
            },
            _getMoney() {
                let date = {};
                date.realName = this.searchData.realName.value;
                date.states = this.searchData.states.value;
                date.postName = this.searchData.postName.value;
                date.card_states = this.searchData.card_states.value;
                date.roleId = this.searchData.roleId.value;
                date.nodeId = this.searchData.nodeId.value;
                this.$http.post('/user/dataListSum', date).then((res) => {
                    if (res.success) {
                        this.totalMoney = res.money;
                    }
                })
            }
        },
        created() {
            this._setTableHeight()
            this._getRoleData()
            this._getMoney();
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    }
</script>
