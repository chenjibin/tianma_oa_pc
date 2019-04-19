<template>
    <div>
        <Row :gutter="10">
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">授课类型</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in allClassTypeOpt" :key="index"
                                :class="{'ivu-menu-item-active': item.active}" @click="changeTable_type(item, index)">
                                {{item.name}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </Col>
            <Col :span="22">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem label="月份:" :label-width="60">
                            <DatePicker type="month"
                                        clearable
                                        placeholder="筛选月份"
                                        :editable="false"
                                        @on-change="filterOpt.planMonth.value = $event"
                                        :value="filterOpt.planMonth.value"></DatePicker>
                        </FormItem>
                        <FormItem label="部门:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.organizeName.value"
                                   placeholder="筛选部门"></Input>
                        </FormItem>
                        <FormItem label="讲师:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.teacher_name.value"
                                   placeholder="筛选讲师"></Input>
                        </FormItem>
                        <FormItem label="状态:" :label-width="60">
                            <Select v-model="filterOpt.class_status.value"
                                    clearable
                                    placeholder="筛选状态"
                                    style="width: 200px">
                                <Option value="0">未设置</Option>
                                <Option value="1">待审核</Option>
                                <Option value="2">审核失败</Option>
                                <Option value="3">已审核</Option>
                                <Option value="4">已排期</Option>
                                <Option value="5">已完成</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   ref="planList"
                                   url="/train/plan_appvoer_dataList"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训计划</span>
            </p>
            <Form :model="planFrom" :label-width="100">
                <FormItem label="培训日期:" :label-width="100">
                    <DatePicker :value="planFrom.class_date"
                                :clearable="false"
                                readonly
                                @on-change="planFrom.class_date = $event"></DatePicker>
                </FormItem>
                <FormItem label="培训名称:" :label-width="100">
                    <Input v-model="planFrom.title" readonly ></Input>
                </FormItem>
                <FormItem label="培训对象:" :label-width="100">
                    <Input v-model="planFrom.object" readonly ></Input>
                </FormItem>
                <FormItem label="培训目标:" :label-width="100">
                    <Input v-model="planFrom.target" readonly ></Input>
                </FormItem>
                <FormItem label="是否公开:" :label-width="100">
                    <input type="radio" disabled  v-model="planFrom.open_status" value="0" style="margin-left: 8px">
                    <span style="color: red;font-size: small">不开放</span>
                    <input type="radio" disabled  v-model="planFrom.open_status" value="1">
                    <span style="color: green;font-size: small">开放</span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" v-show="examine"  @click="_approvalPlan(3)" id="sh">审核通过</Button>
                <Button type="primary" style="margin-left: 8px" v-show="examine"  @click="_checkApp">审核拒绝</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
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
        <Modal v-model="evaScroll" title="综合反馈" width="1200" :mask-closable="false">
            <Row :gutter="16">
                <Col :span="12">
                    <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;height: 300px">
                        <li class="ivu-menu-item-group">
                            <div class="ivu-menu-item-group-title">学员评价 {{stu_score}} (均分)</div>
                            <ul>
                                <li class="ivu-menu-item" v-for="(item, index) in questionList" :key="index"
                                    :class="{'ivu-menu-item-active': item.active}"
                                    @click="changeTable_question(item, index)">{{item.name}}
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div  style="width:500px;height:300px;" id="data_source_app"></div>
                </Col>
                <Col :span="12">
                    <fs-table-page :columns="evaluatePostColumns"
                                   :size="null"
                                   :height="500"
                                   v-if="evaScroll"
                                   :params="evaluateFilterOpt"
                                   url="/train/show_signin_evaluate">
                    </fs-table-page>
                </Col>
            </Row>
            <Row :gutter="16" style="margin-top: 5px">
                <hr />
                <Col :span="12">
                    <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;height: 320px">
                        <li class="ivu-menu-item-group">
                            <div class="ivu-menu-item-group-title"> 授课评价 {{tec_score}} （均分）
                                <Poptip placement="right-start" width="1200" v-model="scoreDescFlag" :transfer="true">
                                    <div slot="content" style="white-space: normal;max-height: 600px;overflow: auto;">
                                        <img src="../../../images/scoreDesc1.png" style="max-width: 100%;"/>
                                        <img src="../../../images/scoreDesc2.png" style="max-width: 100%;"/>
                                        <img src="../../../images/scoreDesc3.png" style="max-width: 100%;"/>
                                    </div>
                                    <span style="cursor: pointer;" @click="scoreDescFlag = true">
                                        <Icon type="help-circled"></Icon>
                                    </span>
                                </Poptip>
                            </div>
                            <ul class="ivu-menu ivu-menu-light ivu-menu-vertical">
                                <li class="ivu-menu-item" >讲师礼仪/精神面貌&nbsp;&nbsp;&nbsp;&nbsp;  {{score1}}</li>
                                <li class="ivu-menu-item">讲师语言表达能力&nbsp;&nbsp;&nbsp;&nbsp;  {{score2}}</li>
                                <li class="ivu-menu-item">学员参与度&nbsp;&nbsp;&nbsp;&nbsp;  {{score3}}</li>
                                <li class="ivu-menu-item">讲师控场能力&nbsp;&nbsp;&nbsp;&nbsp;  {{score4}}</li>
                                <li class="ivu-menu-item">课件讲义的视觉效果&nbsp;&nbsp;&nbsp;&nbsp;  {{score5}}</li>
                            </ul>
                        </li>
                    </ul>
                </Col>
                <Col :span="12">
                    <div class="ivu-menu-item-group-title" style="margin-top: 15px">课程点评：
                        <span style="margin-left: 150px">培训标签:</span>
                        <RadioGroup v-model="label" type="button" size="large">
                            <Radio :label="1" :disabled="label !== 1">优秀</Radio>
                            <Radio :label="2" :disabled="label !== 2">普通</Radio>
                            <Radio :label="3" :disabled="label !== 3">需改进</Radio>
                        </RadioGroup>
                    </div>
                    <Input type="textarea" v-model="comment" readonly
                           :autosize="{minRows: 10,maxRows: 20}" style="margin-top: 15px"></Input>
                </Col>
            </Row>
            <Row :gutter="16" style="margin-top: 0px" v-show="score_flag">
                <hr />
                <Col :span="12">
                    <div class="ivu-menu-item-group-title" style="margin-top: 15px"> 考试情况： {{pass_rate}}% （通过率）合格线：{{qualified_line}}</div>
                    <fs-table-page :columns="scoreColumns"
                                   :size="null"
                                   :height="500"
                                   v-if="score_flag"
                                   :params="scoreFilterOpt"
                                   url="/train/show_exam_score">
                    </fs-table-page>
                </Col>
            </Row>
            <div slot="footer">
                <!--                <Button type="button" class="btn ivu-btn-primary" @click="_downloadGrade1(evaluateFilterOpt.id)">导出</Button>-->
                <Button type="ghost" @click="evaScroll = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="paperCheckFlag"
               width="1200"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>查看考试</span>
            </p>
            <div class="">
                <editor-paper :id="paperIdCheck"></editor-paper>
            </div>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="paperCheckFlag = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsForm from '@/baseComponents/fs-form/form';
    import echarts from 'echarts/lib/echarts';
    import funnel from 'echarts/lib/chart/funnel';
    import tooltip from 'echarts/lib/component/tooltip';
    import legendScroll from 'echarts/lib/component/legendScroll';
    import editorPaper from '../components/editor-paper-t';
    import title from 'echarts/lib/component/title';
    import pie from 'echarts/lib/chart/pie';
    import moment from 'moment';

    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'trainPlanManage',
        data() {
            return {
                modelFlag: false,
                scoreDescFlag: false,
                examine: true,
                errMsgFlag: false,
                paperCheckFlag: false,
                paperIdCheck: 0,
                questionList: [],
                classId: 0,
                evaScroll: false,
                score_flag: false,
                pass_rate: '',
                qualified_line: '',
                stu_score: '',
                tec_score: '',
                comment: '',
                label: '',
                score1: '',
                score2: '',
                score3: '',
                score4: '',
                score5: '',
                errMsg: '',
                tableHeight: 300,
                planId: 0,
                allClassTypeOpt: [],
                filterOpt: {
                    class_type: {
                        value: '',
                        type: 'input'
                    },
                    planMonth: {
                        value: '',
                        type: 'input'
                    },
                    class_status: {
                        value: '',
                        type: 'select'
                    },
                    teacher_name: {
                        value: '',
                        type: 'input'
                    },
                    organizeName: {
                        value: '',
                        type: 'input'
                    }
                },
                planFrom: {
                    title: '',
                    object: '',
                    class_date: '',
                    target: '',
                    open_status: 0
                },
                evaluateFilterOpt: {
                    id: {
                        value: '',
                        type: 'normal'
                    }
                },
                scoreFilterOpt: {
                    examId: {
                        value: '',
                        type: 'normal'
                    }
                },
                evaluatePostColumns: [
                    {
                        title: '反馈内容',
                        align: 'center',
                        key: 'answer'
                    },
                    // {
                    //     title: '反馈人',
                    //     align: 'center',
                    //     key: 'realname',
                    //     width: 80
                    // },
                    // {
                    //     title: '日期',
                    //     align: 'center',
                    //     key: 'createdate',
                    //     width: 160
                    // },
                    {
                        title: '总分',
                        align: 'center',
                        key: 'evaluate_score',
                        width: 60
                    }
                ],
                scoreColumns: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'stuname'
                    },
                    {
                        title: '成绩',
                        align: 'center',
                        key: 'score'
                        // width: 80
                    },
                    {
                        title: '排名',
                        align: 'center',
                        key: 'ranking'
                        // width: 60
                    }
                ],
                postColumns: [
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
                        title: '培训名称',
                        key: 'title',
                        minWidth: 120
                    },
                    {
                        title: '培训类型',
                        align: 'center',
                        key: 'type_name'
                        // width: 120
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
                        title: '更新时间',
                        align: 'center',
                        key: 'update_time'
                    },
                    {
                        title: '反馈',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = [];
                            if (params.row.status == 5) {
                                lookBtn = h('Tooltip', {
                                    props: {
                                        content: '反馈',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'drag',

                                            size: 'small'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm._showEvaluate(params.row);
                                            }
                                        }
                                    })
                                ]);
                            }
                            return h('div', [lookBtn]);
                        }
                    },
                    {
                        title: '附件',
                        align: 'center',
                        key: 'filepath',
                        // width: 100
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = '';
                            if (params.row.filepath) {
                                lookBtn = h('Tooltip', {
                                    props: {
                                        content: '下载附件',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'ios-cloud-download',
                                            shape: 'circle',
                                            size: 'small'
                                        },
                                        on: {
                                            click: function (e) {
                                                vm.downloadFile('/oa/upload/trainPlan/' + params.row.filepath, params.row.title + '—培训附件');
                                            }
                                        }
                                    })
                                ]);
                            }
                            return h('div', [lookBtn]);
                        }
                    },
                    {
                        title: '考试',
                        key: 'sign_in',
                        align: 'center',
                        // width: 100,
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = '';
                            if (params.row.exam_id != null) {
                                lookBtn = h('Tooltip', {
                                    props: {
                                        content: '查看考试',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'ios-eye',
                                            shape: 'circle',
                                            size: 'small'
                                        },
                                        on: {
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm._checkPaper(params.row);
                                            }
                                        }
                                    })
                                ]);
                            }
                            return h('div', [lookBtn]);
                        }
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
                                            click: function (e) {
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
                // dataSourcePie: '',
                dataSourcePie2: '',
                // dataSourcePieData: {
                //     legendData: [],
                //     seriesData: [],
                //     selected: {}
                // },
                dataSourcePie2Data: {
                    legendData: [],
                    seriesData: [],
                    selected: {}
                },
                // option: {
                //     title: {
                //         text: '题目选项统计占比',
                //         subtext: '',
                //         x: 'center'
                //     },
                //     tooltip: {
                //         trigger: 'item',
                //         formatter: '{a} <br/>{b} : {c}人 ({d}%)'
                //     },
                //     legend: {
                //         orient: 'vertical',
                //         right: 'right',
                //         data: ['示例状态1', '示例状态2'],
                //         selected: {}
                //     },
                //     series: [
                //         {
                //             name: '选项',
                //             type: 'pie',
                //             radius: '55%',
                //             center: ['40%', '50%'],
                //             data: [
                //                 {name: '示例状态1', value: 1},
                //                 {name: '示例状态2', value: 2}
                //             ],
                //             itemStyle: {
                //                 emphasis: {
                //                     shadowBlur: 10,
                //                     shadowOffsetX: 0,
                //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
                //                 }
                //             }
                //         }
                //     ]
                // },
                option2: {
                    title: {
                        text: '问题选项占比',
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}个 ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['示例1', '示例2', '示例3'],
                        selected: {}
                    },
                    series: [
                        {
                            name: '选项占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: [
                                {name: '示例1', value: Math.round(Math.random() * 10)},
                                {name: '示例2', value: Math.round(Math.random() * 10)},
                                {name: '示例3', value: Math.round(Math.random() * 10)}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                nameMapping: {
                    invite_num: '预约',
                    notcome_num: '预约未到达',
                    interview_num: '面试',
                    interview_pass_num: '面试通过',
                    interview_no_passnum: '面试不通过',
                    interview_wait_num: '面试待选',
                    test_num: '试岗',
                    test_pass_num: '试岗通过',
                    test_no_passnum: '试岗不通过'
                }
            };
        },
        created() {
            this._setTableHeight();
            this._getAllClassTypeOpt();
        },
        methods: {
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
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
                        this._updatePlanList();
                    }
                });
            },
            _checkTest(data) {
                this.modelFlag = true;
                console.log(data)
                this.planFrom.title = data.title;
                this.planFrom.object = data.object;
                this.planFrom.class_date = data.class_date;
                this.planFrom.target = data.target;
                this.planFrom.open_status = data.open_status;
                this.planId = data.id;
                if (1 === data.status) {
                    this.examine = true;
                } else {
                    this.examine = false;
                }
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _updatePlanList() {
                this.$refs.planList.getListData();
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
                    this.filterOpt.class_type.value = item.id
                } else {
                    item.active = false
                    // 这里写一个也不选的更新表格数据方法
                    this.filterOpt.class_type.value = null;
                }
            },
            _showEvaluate(data) {
                this.classId = data.id;
                // 获取学员反馈内容与分数列表
                this.evaluateFilterOpt.id.value = data.id;
                // 查询问卷问题列表
                this._getQuestionAnswer(data.questionnaire_id);
                // 查询课程学员所打均分 课程 点评分数 与 评论
                this._getAvgScoreComment();
                this._getData(data.id, 1);
                // 是否有考试
                if (data.exam_id) {
                    // 获取学员考试分数
                    this.scoreFilterOpt.examId.value = data.exam_id; // 获取学员考试分数
                    // 获取考试 合格线 与 合格率
                    this.pass_rate = '';
                    this.qualified_line = '';
                    let sendData = {};
                    sendData.examId = data.exam_id;
                    this.$http.post('/train/query_exam_pass', sendData).then((res) => {
                        if (res.success) {
                            this.pass_rate = res.data.pass_rate;
                            this.qualified_line = res.data.qualified_line;
                        }
                    });
                    this.score_flag = true;
                } else {
                    this.score_flag = false;
                }
                this.evaScroll = true;
            },
            // 查询培训课程绑定的试题题目
            _getQuestionAnswer(id) {
                let sendData = {};
                sendData.id = id;
                this.$http.post('/train/query_id_question', sendData).then((res) => {
                    if (res.success) {
                        this.questionList = res.data;
                    }
                });
            },
            _getAvgScoreComment() {
                this.label = '';
                let sendData = {};
                sendData.id = this.classId;
                this.$http.post('/train/query_id_comment', sendData).then((res) => {
                    if (res.success) {
                        this.stu_score = res.data.stu_score;
                        this.tec_score = res.data.tec_score;
                        this.comment = res.data.comment;
                        this.label = res.data.label;
                        this.score1 = res.data.score1;
                        this.score2 = res.data.score2;
                        this.score3 = res.data.score3;
                        this.score4 = res.data.score4;
                        this.score5 = res.data.score5;
                    }
                });
            },
            // 查询题目选择项占比
            _getData(c_id, q_id) {
                var vm = this;
                // vm.dataSourcePieData.legendData = [];
                vm.dataSourcePie2Data.legendData = [];
                // vm.dataSourcePieData.seriesData = [];
                vm.dataSourcePie2Data.seriesData = [];
                var d = {};
                d.id = c_id;
                d.q_id = q_id;
                this.$http.post('/train/query_id_answer', d).then((res) => {
                    if (res.success) {
                        var d = res.data;
                        for (let key in d) {
                            vm.dataSourcePie2Data.legendData.push(key);
                            vm.dataSourcePie2Data.selected[key] = true;
                            vm.dataSourcePie2Data.seriesData.push({
                                name: key,
                                value: d[key]
                            });
                        }
                        vm.option2.legend.data = vm.dataSourcePie2Data.legendData;
                        vm.option2.legend.selected = vm.dataSourcePie2Data.selected;
                        vm.option2.series[0].data = vm.dataSourcePie2Data.seriesData;
                        vm.dataSourcePie2.setOption(vm.option2);
                    }
                });
            },
            changeTable_question(item, index) {
                if (!item.active) {
                    // 遍历是的指定选项变成active，其余的取消active
                    this.questionList.filter((x, y) => {
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
                    // this.filterOpt.class_type.value = item.id
                    this._getData(this.classId, item.id);
                } else {
                    item.active = false;
                    // 这里写一个也不选的更新表格数据方法
                    this._getData(null, null);
                }
            },
            // 查看试卷
            _checkPaper(data) {
                if (data.exam_id) {
                    this.paperIdCheck = data.exam_id;
                } else {
                    this.paperIdCheck = 0;
                }
                this.paperCheckFlag = true;
            }
        },
        mounted () {
            this.$nextTick(() => {
                // var dataSourcePie = echarts.init(document.getElementById('data_source1'));
                var dataSourcePie2 = echarts.init(document.getElementById('data_source_app'));
                // this.dataSourcePie = dataSourcePie;
                this.dataSourcePie2 = dataSourcePie2;
                // this.dataSourcePie.setOption(this.option);
                dataSourcePie2.setOption(this.option2);
                window.addEventListener('resize', function () {
                    // dataSourcePie.resize();
                    dataSourcePie2.resize();
                });
            });
        },
        components: {
            fsTablePage,
            fsForm,
            editorPaper
        }
    };
</script>
