<template>
    <div>
        <Row :gutter="10">
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">授课类型</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in allClassTypeOpt" :key="index" :class="{'ivu-menu-item-active': item.active}" @click="changeTable_type(item, index)">{{item.name}}</li>
                        </ul>
                    </li>
                </ul>
            </Col>
            <Col :span="22">
            <Card>
                <Form inline :label-width="60">
                    <FormItem label="月份:" :label-width="60">
                            <DatePicker type="month"
                                        placeholder="筛选月份"
                                        :editable="false"
                                        @on-change="filterOpt_p.planMonth.value = $event"
                                        :value="filterOpt_p.planMonth.value"></DatePicker>
                    </FormItem>
                    <FormItem label="创建人:" :label-width="80">
                        <Input type="text" clearable
                               v-model="filterOpt_p.createBy.value"
                               placeholder="筛选创建人"></Input>
                    </FormItem>
                    <FormItem :label-width="0.1">
                        <ButtonGroup>
                            <!--<Button type="primary" @click="mubanFlag = true">
                                <Icon type="gear-b"></Icon>
                                模板设置
                            </Button>-->
                            <Button type="primary" @click="_openTrainPlan">
                                <Icon type="plus-round"></Icon>
                                创建培训计划
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
                <fs-table-page :columns="postColumns"
                               :size="null"
                               :height="tableHeight"
                               :params="filterOpt_p"
                               ref="planList"
                               url="/train/ever_plan_datalist"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训计划模板设置</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="mubanAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/ever_para_datalist"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选项目吗？"
                        transfer
                        @on-ok="_deleteMuban">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除</Button>
                </Poptip>

                <Poptip placement="left"
                        width="400">
                    <Button type="primary"
                            :disabled="!(chooseDataArray.length === 1)"
                            style="margin-left: 8px"
                            @click="_updateMubanHandler">修改模板</Button>
                    <Button type="primary"
                            @click="_addMubanHandler"
                            style="margin-left: 8px">添加模板</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="mubanRules"
                              :model="mubanForm"
                              ref="mubanForm"
                              :label-width="100">
                            <FormItem label="项目名称" prop="name">
                                <Input v-model="mubanForm.name"></Input>
                            </FormItem>
                            <FormItem label="英文key_text" prop="keyText">
                                <Input v-model="mubanForm.keyText"></Input>
                            </FormItem>
                            <FormItem label="字段类型" style="text-align: left;">
                                <Select v-model="mubanForm.keyType"
                                        style="width: 100px">
                                    <Option value="textfield" >文本</Option>
                                    <Option value="textarea" >文本域</Option>
                                    <Option value="numberfield" >数字</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="mubanForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addMuban" :loading="mubanBtnLoading">{{mubanAddType === 'add' ? '添加' : '修改'}}模板</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <!--培训计划列表-->
        <Modal v-model="planFlag" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{month_p}} — {{type_p}} 计划列表</span>
            </p>
            <Form inline :label-width="60">
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                         <Button type="error"
                                 :disabled="!planChooseDataArray.length"
                                 @click="_delPlan">
                             <Icon type="ios-trash-outline"></Icon>
                             删除计划
                         </Button>
                        <!--<Button type="primary"
                                @click="addDepModalFlag = true">
                            <Icon type="ios-trash-outline"></Icon>
                            导出
                        </Button>-->
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns_pid"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           :choosearray.sync="planChooseDataArray"
                           ref="planList_pid"
                           url="/train/plan_id_dataList"
            ></fs-table-page>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训计划</span>
            </p>
            <Form :model="formPlan" :label-width="100">
                <FormItem label="培训日期:" :label-width="100">
                    <DatePicker :value="formPlan.class_date"
                                :clearable="false"
                                :editable="false"
                                @on-change="formPlan.class_date = $event"></DatePicker>
                </FormItem>
                <FormItem label="培训名称:" :label-width="100">
                    <Input v-model="formPlan.title"></Input>
                </FormItem>
                <FormItem label="培训对象:" :label-width="100">
                    <Input v-model="formPlan.object"></Input>
                </FormItem>
                <FormItem label="培训目标:" :label-width="100">
                    <Input v-model="formPlan.target"></Input>
                </FormItem>
                <FormItem label="是否公开:" :label-width="100">
                    <input type="radio" v-model="formPlan.open_status" value="0"  style="margin-left: 8px">
                    <span style="color: red;font-size: small">不开放</span>
                    <input type="radio" v-model="formPlan.open_status" value="1" >
                    <span style="color: green;font-size: small">开放</span>
                </FormItem>
            </Form>
            <!--<fs-form :label-width="120"-->
                     <!--:item-list="itemList"-->
                     <!--ref="formPlan"-->
                     <!--v-model="trainData"></fs-form>-->
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" v-show="examine"  @click="_approvalPlan(3)" id="sh">审核通过</Button>
                <Button type="primary" style="margin-left: 8px" v-show="examine"  @click="_checkApp">审核拒绝</Button>
                <!--<Button type="primary" style="margin-left: 8px" v-show="subplan"  @click="_submitPlan" id="tijh">提交计划</Button>-->
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="addDepModalFlag"
               width="300"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>导出培训计划</span>
            </p>
            <Form :label-width="80">
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="月份"
                                :editable="false"
                                @on-change="_addDepMonthChange"
                                :value="addDepForm.month"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :loading="deleteLoading"
                        @click="_downloadGrade">
                    <span v-if="!deleteLoading">确认导出</span>
                    <span v-else>正在导出...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="addDepModalFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="createPlanFlag" width="700" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>创建培训计划</span>
            </p>
            <Form :model="mubanForm"
                  :label-width="100">
                <FormItem label="计划月份:" :label-width="100">
                    <DatePicker :value="planForm.planMonth"
                                :clearable="false"
                                type="month"
                                :editable="false"
                                @on-change="planForm.planMonth = $event"></DatePicker>
                </FormItem>
                <FormItem label="培训类型:" :label-width="100">
                    <span style="color: red">根据类型筛选培训师</span>
                    <Select v-model="planForm.class_type">
                        <Option v-for="(item, index) in allClassTypeOpt"
                                :value="item.id"
                                :key="'type-' + index">{{ item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="培训师:">
                    <span style="color: red">选填（补充不在培训类型里的培训师）</span>
                    <Select v-model="planForm.people" multiple>
                        <Option v-for="(item, index) in allTeacherOpt"
                                :value="item.user_id"
                                :key="'charge-' + index">{{ item.user_name + '(' + item.organize_name + ')'}}</Option>
                    </Select>
                    <Poptip
                        confirm
                        title="您确清空当前选中的负责人么？"
                        @on-ok="planForm.people = []">
                        <Button type="ghost"
                                icon="trash-a"
                                style="margin-top: 8px;">一键清空负责人</Button>
                    </Poptip>
                </FormItem>
                <!--<FormItem label="项目:">
                    <CheckboxGroup v-model="planForm.project">
                        <Checkbox :label="item.id"
                                  :key="'project' + index"
                                  v-for="(item,index) in allProjectOpt">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>-->
            </Form>
            <div slot="footer">
                <Button type="primary" @click="_addPlan">创建计划</Button>
                <Button type="ghost" style="margin-left: 8px" @click="createPlanFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="errMsgFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>审核失败原因</span>

            </p>
            <Input v-model="errMsg" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="输入审核失败原因" />
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" v-show="examine"  @click="_approvalPlan(2)">提交原因</Button>
                <Button type="ghost" style="margin-left: 8px" @click="errMsgFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import fsSearchUser from '@/baseComponents/fs-search-user';
    import fsForm from '@/baseComponents/fs-form/form';
    import moment from 'moment';
    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'trainPlanManage',
        data () {
            return {
                modelFlag: false,
                planFlag: false,
                mubanFlag: false,
                deleteModalFlag: false,
                addDepModalFlag: false,
                errMsgFlag: false,
                examine: true,
                subplan: true,
                errMsg: '',
                deleteLoading: false,
                mubanBtnLoading: false,
                deleteMonth: NOW_MONTH,
                month_p: '',
                type_p: '',
                addDepForm: {
                    month: NOW_MONTH,
                    organizeName: ''
                },
                createPlanFlag: false,
                tableHeight: 300,
                planId: 0,
                mubanAddType: 'add',
                chooseDataArray: [],
                planChooseDataArray: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanId: 0,
                mubanForm: {
                    name: '',
                    keyText: '',
                    keyType: 'textfield',
                    remark: ''
                },
                mubanRules: {
                    name: [
                        {required: true, message: '项目名称不能为空', trigger: 'blur'}
                    ],
                    keyText: [
                        {required: true, message: '英文key_text不能为空', trigger: 'blur'}
                    ]
                },
                mubanColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '英文key_text',
                        align: 'center',
                        key: 'key_text'
                    },
                    {
                        title: '参数类型',
                        align: 'center',
                        key: 'key_type',
                        render: (h, params) => {
                            if (params.row.key_type == "textfield") {
                                return h('span', '文本');
                            } else if (params.row.key_type == "textarea") {
                                return h('span', '文本域');
                            } else if(params.row.key_type == "numberfield"){
                                return h('span', '数字');
                            }
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    }
                ],
                planForm: {
                    people: [],
                    project: [],
                    planMonth: NOW_MONTH,
                    class_type: []
                },
                formPlan: {
                    title: '',
                    object: '',
                    class_date: '',
                    target: '',
                    open_status: 0
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'traindate',
                        align: 'center',
                        // width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.traindate).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '培训类型',
                        align: 'center',
                        key: 'type'
                    },
                    {
                        title: '创建人',
                        align: 'center',
                        key: 'createby'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createdate'

                    },
                    {
                        title: '培训计划',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '点击查看',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'eye',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function(e) {
                                                e.stopPropagation();
                                                vm._showPlan(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                postColumns_pid: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '培训日期',
                        key: 'user_name',
                        align: 'center',
                        // width: 120,
                        render: (h, params) => {
                            if (params.row.class_date) {
                                return h('span', moment(params.row.class_date).format('YYYY-MM-DD'));
                            } else {
                                return h('span', '');
                            }
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
                    {
                        title: '培训师',
                        align: 'center',
                        key: 'teacher_name'
                        // width: 120
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        // width: 120,
                        render: (h, params) => {
                            // 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成
                            let status = '';
                            let s_c = '';
                            let approvalreason = '';
                            if (params.row.status === 0) {
                                status = '未设置';
                                s_c = 'red';
                            } else if (params.row.status === 1) {
                                status = '待审核';
                                s_c = 'red';
                            } else if (params.row.status === 2) {
                                status = '审核失败';
                                s_c = 'gray';
                                approvalreason = params.row.approvalreason;
                            } else if (params.row.status === 3) {
                                status = '已审核';
                                s_c = 'blue';
                            } else if (params.row.status === 4) {
                                status = '已排期';
                                s_c = 'blue';
                            } else if (params.row.status === 5) {
                                status = '已完成';
                                s_c = 'green';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: s_c
                                },
                                attrs: {
                                    title: approvalreason
                                }
                            }, status);
                        }
                    },
                    {
                        title: '审批者',
                        align: 'center',
                        key: 'approvaler'
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'update_time'
                    },
                    {
                        title: '计划详情',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '点击查看',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'eye',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function(e) {
                                                e.stopPropagation();
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                filterOpt_p: {
                    type_id: {
                        value: '',
                        type: 'input'
                    },
                    planMonth: {
                        value: '',
                        type: 'input'
                    },
                    createBy: {
                        value: '',
                        type: 'input'
                    }
                },
                filterOpt: {
                    plan_id: {
                        value: '',
                        type: 'input'
                    }
                },
                itemList: [],
                trainData: {},
                allProjectOpt: [],
                allTeacherOpt: [],
                defaultPeople: [],
                allClassTypeOpt: []
            };
        },
        watch: {
            allProjectOpt(val) {
                this.planForm.project = val.map(x => x.id);
            }
        },
        created() {
            this._setTableHeight();
            this._getRoleData();
            this._getAllProjectOpt();
            this._getAllTeacherOpt();
            this._getAllClassTypeOpt();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _deleteMonthChange(date) {
                this.deleteMonth = date;
            },
            _addDepMonthChange(date) {
                this.addDepForm.month = date;
            },
            _updateMubanHandler() {
                this.mubanAddType = 'update';
                this.formReset('mubanForm');
                let fillForm = this.chooseDataArray[0];
                this.mubanForm.name = fillForm.name;
                this.mubanForm.keyText = fillForm.key_text;
                this.mubanForm.keyType = fillForm.key_type;
                this.mubanForm.remark = fillForm.remark;
                this.mubanId = fillForm.id;
            },
            _addMubanHandler() {
                this.mubanAddType = 'add';
                this.formReset('mubanForm');
            },
            _submitPlan() {
                this.$refs.formPlan.validForm(() => {
                    let sendData = JSON.parse(JSON.stringify(this.trainData));
                    sendData.id = this.planId;
                    sendData.planstatus = 2;
                    this.$http.post('/train/ever_plan_para_add', sendData).then((res) => {
                        if (res.success) {
                            this.modelFlag = false;
                            this.$Message.success('计划提交成功!');
                            this._updatePlanList();
                        }
                    });
                });
            },
            _checkApp() {
                this.errMsg = '';
                this.errMsgFlag = true;
            },
            _approvalPlan(data) {
                // 状态: -1.删除 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成
                let sendData = {};
                if (2 === data) {
                    if (0 >= this.errMsg.trim().length) {
                        this.$Message.error('请填写审核失败原因');
                        return;
                    }
                }
                sendData.reason = this.errMsg;
                sendData.id = this.planId;
                sendData.planstatus = data;// 提交审批
                this.$http.post('/train/change_plan_status', sendData).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this.errMsgFlag = false;
                        this.$Message.success('审批完成!');
                        this.$refs.planList_pid.getListData();
                    }
                });
            },
            _openTrainPlan() {
                this.planForm.people = [];
                this.planForm.class_type = '';
                this.createPlanFlag = true;
            },
            _addPlan() {
                let data = {};
                data.ids = this.planForm.people.join(',');
                // data.paraIds = this.planForm.project.join(',');
                data.month = this.planForm.planMonth;
                data.typeId = this.planForm.class_type;
                this.$http.post('/train/ever_plan_add', data).then((res) => {
                    if (res.success) {
                        this.createPlanFlag = false;
                        this.$Message.success('创建计划成功!');
                        this._updatePlanList();
                    }
                });
            },
            _delPlan() {
                this.$Modal.confirm({
                    content: '确认删除所选计划么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.planChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/ever_para_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updatePlanList_pid();
                            }
                        });
                    }
                });
            },
            _deleteMuban() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/ever_para_delete', data).then((res) => {
                    if (res.success) {
                        this.$refs.mubanAdd.getListData();
                        this._getAllProjectOpt();
                        this.chooseDataArray = [];
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addMuban() {
                this.$refs.mubanForm.validate((valid) => {
                    if (valid) {
                        this.mubanBtnLoading = true;
                        let data = {};
                        if (!(this.mubanAddType === 'add')) data.id = this.mubanId;
                        data.name = this.mubanForm.name;
                        data.key_text = this.mubanForm.keyText;
                        data.key_type = this.mubanForm.keyType;
                        data.remark = this.mubanForm.remark;
                        this.$http.post('/train/ever_para_add', data).then((res) => {
                            if (res.success) {
                                this.formReset('mubanForm');
                                this._getAllProjectOpt();
                                this.$refs.mubanAdd.getListData();
                                this.$Message.success('操作成功！');
                            }
                            this.mubanBtnLoading = false;
                        }, () => {
                            this.mubanBtnLoading = false;
                        })
                    }
                });
            },
            _downloadGrade() {
                let sendData = {};
                sendData.month = this.addDepForm.month;
                this.$http.post('/train/plan_para_export', sendData).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/down/' + res.data, res.data);
                        this.addDepModalFlag = false;
                    }
                });
            },
            _createMonthOpen() {
                this.deleteModalFlag = true;
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.modelFlag = true;
                console.log(data)
                this.formPlan.title = data.title;
                this.formPlan.object = data.object;
                this.formPlan.class_date = data.class_date;
                this.formPlan.target = data.target;
                this.formPlan.open_status = data.open_status;
                this.planId = data.id;
                if (1 === data.status) {
                    this.examine = true;
                } else {
                    this.examine = false;
                }
                // let sendData = {};
                // sendData.id = data.id;
                // sendData.user_id = data.user_id;
                // this.planId = data.id;
                // this.$http.post('/train/plan_para_select', sendData).then((res) => {
                //     if (res.success) {
                //         if (!res.oneself) {
                //             this.examine = true;
                //             this.subplan = false;
                //         } else {
                //             this.examine = false;
                //             this.subplan = true;
                //         }
                //         let formItems = res.data.field;
                //         let formList = [];
                //         let trainData = {};
                //         formItems.forEach(item => {
                //             let obj = {};
                //             obj.type = 'input';
                //             trainData[item.name] = item.value;
                //             obj.value = item.value || '';
                //             switch (item.xtype) {
                //                 case 'numberfield':
                //                     obj.type = 'number';
                //                     obj.value = +item.value;
                //                     break;
                //                 case 'textarea':
                //                     obj.type = 'textarea';
                //                     break;
                //             }
                //             obj.label = item.fieldLabel;
                //             obj.key = item.name;
                //             obj.required = true;
                //             formList.push(obj);
                //         });
                //         this.itemList = formList;
                //         this.trainData = trainData;
                //     }
                // });
                // this.modelFlag = true;
            },
            // 打开计划列表
            _showPlan(data) {
                this._updatePlanList_pid();
                this.filterOpt.plan_id.value = data.id;
                this.month_p = data.traindate;
                this.type_p = data.type;
                this.planFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _getAllProjectOpt() {
                this.$http.get('/train/ever_para_datalist?page=1&pageSize=20').then((res) => {
                    if (res.success) {
                        this.allProjectOpt = res.data;
                    }
                });
            },
            _getRoleData() {
                this.$http.get('/role/getAllRole').then((res) => {
                    if (res.success) {
                        this.roleData = res.data;
                    }
                });
            },
            _updatePlanList() {
                this.$refs.planList.getListData();
            },
            _updatePlanList_pid() {
                this.$refs.planList_pid.getListData();
            },
            _getAllTeacherOpt() {
                let data = {};
                data.page = 1;
                data.pageSize = 10000;
                this.$http.get('/train/teacher_datalist', {params: data}).then((res) => {
                    if (res.success) {
                        this.allTeacherOpt = res.data;
                        this.defaultPeople = this.allTeacherOpt.filter(x => x.isdefault === 1).map(x => x.user_id);
                    }
                });
            },
            _getAllClassTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.allClassTypeOpt = res.data;
                    }
                });
            },
            changeTable_type(item, index) {
                if (!item.active) {
                    // 遍历是的指定选项变成active，其余的取消active
                    this.allClassTypeOpt.filter((x, y) => {
                        if (y === index) {
                            if (typeof x.active === 'undefined') {
                                this.$set(x, 'active', true)
                            } else {
                                item.active = true
                            }
                        } else if (typeof x.active !== 'undefined') {
                            x.active = false
                        }
                    })
                    // 这里写指定条件的更新表格数据方法
                    this.filterOpt_p.type_id.value = item.id
                } else {
                    item.active = false
                    // 这里写一个也不选的更新表格数据方法
                    this.filterOpt_p.type_id.value = null;
                }
            }
        },
        components: {
            fsTablePage,
            fsDepTree,
            fsSearchUser,
            fsForm
        }
    };
</script>
