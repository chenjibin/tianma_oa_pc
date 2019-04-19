<template>
    <div>
        <Row :gutter="10">
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">授课类型</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in trainTypeOpt" :key="index"
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
                        <FormItem label="课程:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.title.value"
                                   placeholder="筛选名称"></Input>
                        </FormItem>
                        <FormItem label="讲师:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.teacher_name.value"
                                   placeholder="筛选讲师"></Input>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <!--                            <ButtonGroup>-->
                            <Button type="success" title="请选择左侧的月份导出数据"
                                    :disabled="null === filterOpt.planMonth.value || '' === filterOpt.planMonth.value"
                                    :loading="downloadLoading"
                                    @click="_downloadGrade">
                                <Icon type="ios-cloud-download-outline"></Icon>
                                导出课程
                            </Button>
                            <!--                            </ButtonGroup>-->
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   ref="classTable"
                                   :choosearray.sync="classChooseDataArray"
                                   url="/train/review_class_datalist"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="1000" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <!--                <span>{{classFormType === 'add'? '新建' : '修改'}}复盘</span>-->
                <span>{{className}} — {{typeName}} — 点评</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="6">
                    <Col :span="12">
                        <FormItem label="课程状态:" required>
                            <Select v-model="classForm.status" style="color: red">
                                <Option :value="4">未完成</Option>
                                <Option :value="5">已完成</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="培训日期:" required>
                            <DatePicker :value="classForm.class_date"
                                        :clearable="false"
                                        :editable="false"
                                        @on-change="formPlan.class_date = $event"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="讲师:">
                            <Input v-model="classForm.teacher_name" readonly></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="培训时间:" required>
                            <TimePicker @on-change="classForm.period = $event"
                                        :value="classForm.period"
                                        :clearable="false"
                                        format="HH:mm"
                                        :editable="false"
                                        type="timerange"
                                        placement="bottom-end"
                                        placeholder="选择时间"
                                        style="width: 168px"></TimePicker>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="责任人:" required>
                            <Input v-model="classForm.dutyer" clearable placeholder="输入责任人"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="培训标签:" required>
                            <RadioGroup v-model="classForm.label" type="button" size="large">
                                <Radio :label="1">优秀</Radio>
                                <Radio :label="2">普通</Radio>
                                <Radio :label="3">需改进</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col :span="6">
                        <FormItem label="1:" required>
                            <span class="spanStyle">讲师礼仪/精神面貌</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm.score1" clearable placeholder="请选择">
                                <Option :value="0">仪容仪表不整洁、精神状态太过负面__0</Option>
                                <Option :value="2">仪容仪表不整洁、精神状态较萎靡__2</Option>
                                <Option :value="4">仪容仪表整洁、精神状态较萎靡__4</Option>
                                <Option :value="6">仪容仪表整洁、精神状态一般__6</Option>
                                <Option :value="8">仪容仪表整洁、具有个人亲和力、精神状态有活力__8</Option>
                                <Option :value="10">仪容仪表整洁、具有较强个人亲和力、精神状态有活力__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="6">
                        <FormItem label="2:" required>
                            <span class="spanStyle">讲师语言表达能力</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm.score2" clearable placeholder="请选择">
                                <Option :value="0">表述不通顺，经常磕磕绊绊，影响理解，没有逻辑__0</Option>
                                <Option :value="2">表述不通顺，经常磕磕绊绊，具有基本逻辑，但有点影响理解__2</Option>
                                <Option :value="4">能够通顺表述，逻辑清楚，没有故事案例说明__4</Option>
                                <Option :value="6">能够通顺表述，逻辑清楚，会使用案例说明__6</Option>
                                <Option :value="8">表述通顺简单，逻辑清楚，能够列举多个相关案例__8</Option>
                                <Option :value="10">表述清晰，用词能够准确达意，能够通过案例、故事等方式说明__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="6">
                        <FormItem label="3:" required>
                            <span class="spanStyle">学员参与度</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm.score3" clearable placeholder="请选择">
                                <Option :value="0">基本没有人听课__0</Option>
                                <Option :value="2">学员有大部分长时间在玩手机__2</Option>
                                <Option :value="4">学员有小部分长时间在玩手机/有学员拒绝回答提问__4</Option>
                                <Option :value="6">有提问等互动，学员大多数能够参与回答__6</Option>
                                <Option :value="8">有提问等互动，学员能够自发参与回答__8</Option>
                                <Option :value="10">有案例分析和讲解，能有效鼓励学员主动参与分析__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="6">
                        <FormItem label="4:" required>
                            <span class="spanStyle">讲师控场能力</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm.score4" clearable placeholder="请选择">
                                <Option :value="0">有学员扰乱课堂秩序，讲师没有做任何应对__0</Option>
                                <Option :value="2">有不只一位学员扰乱课堂秩序，讲师提醒后没有效果__2</Option>
                                <Option :value="4">课堂秩序受到学员扰乱，讲师提醒后有所缓和__4</Option>
                                <Option :value="6">课堂秩序正常，讲师能够处理学员疑问__6</Option>
                                <Option :value="8">讲师能够对学员稍有难度的问题讲解清楚__8</Option>
                                <Option :value="10">讲师对稍有难度的问题能够讲解清楚，并且对学员的不同意见予以接纳__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="6">
                        <FormItem label="5:" required>
                            <span class="spanStyle">课件讲义视觉效果</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm.score5" clearable placeholder="请选择">
                                <Option :value="0">没有任何视觉辅助工具__0</Option>
                                <Option :value="2">课件讲义全部都是大段文字__2</Option>
                                <Option :value="4">课件讲义以文字为主__4</Option>
                                <Option :value="6">课件讲义能够简洁表达授课内容(PPT没有大段文字,脑图等文字讲义重点结构清晰)__6</Option>
                                <Option :value="8">课件讲义图文并茂，视觉上较为舒适__8</Option>
                                <Option :value="10">课件讲义图文并茂,具有专业性，视觉美观__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="22">
                        <FormItem label="培训点评:" required>
                            <Input v-model="classForm.comment" type="textarea"
                                   :autosize="{minRows: 4,maxRows: 6}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <!--                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'? '新建' : '修改'}}复盘</Button>-->
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">提交点评</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>
    .spanStyle {
        font-size: 14px;
        color: #495060;
        line-height: 24px;
    }
</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import moment from 'moment';

    export default {
        name: 'classRecheckManage',
        data() {
            return {
                modelFlag: false,
                classFormType: 'add',
                className: '',
                typeName: '',
                tableHeight: 300,
                classChooseDataArray: [],
                classId: 0,
                classRules: {},
                downloadLoading: false,
                classForm: {
                    status: '',
                    comment: '',
                    period: [],
                    teacher_name: '',
                    class_date: '',
                    dutyer: '',
                    label: '',
                    score1: '',
                    score2: '',
                    score3: '',
                    score4: '',
                    score5: ''
                },
                postColumns: [
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
                    {
                        title: '日期',
                        key: 'user_name',
                        align: 'center',
                        // width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.class_date).format('YYYY-MM-DD'));
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                        // width: 80
                    },
                    {
                        title: '讲师',
                        align: 'center',
                        key: 'teacher_name'
                        // width: 80
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type_name'
                        // width: 100
                    },
                    {
                        title: '课程',
                        align: 'center',
                        key: 'title'
                    },
                    {
                        title: '对象',
                        align: 'center',
                        key: 'object'
                    },
                    {
                        title: '目标',
                        align: 'center',
                        key: 'target'
                    },
                    {
                        title: '时长（分钟）',
                        align: 'center',
                        key: 'duration',
                        sortable: true,
                        width: 150
                    },
                    {
                        title: '人数',
                        align: 'center',
                        key: 'sign_in',
                        sortable: true
                    },
                    {
                        title: '学员打分',
                        align: 'center',
                        key: 'stu_score',
                        sortable: true
                    },
                    {
                        title: '授课打分',
                        align: 'center',
                        key: 'score',
                        sortable: true
                    },
                    {
                        title: '考试通过率',
                        align: 'center',
                        key: 'pass_rate',
                        sortable: true,
                        width: 150,
                        render: (h, params) => {
                            if (params.row.pass_rate) {
                                return h('span', params.row.pass_rate + '%');
                            } else {
                                return h('span', params.row.pass_rate);
                            }
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            // 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成
                            let status = '';
                            let s_c = '';
                            if (params.row.status === 4) {
                                status = '未完成';
                                s_c = 'red';
                            } else if (params.row.status === 5) {
                                status = '已完成';
                                s_c = 'green';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: s_c
                                }
                            }, status);
                        }
                    },
                    {
                        title: '评价',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '点击评价',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'chevron-left',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                filterOpt: {
                    class_type: {
                        value: '',
                        type: 'select'
                    },
                    teacher_name: {
                        value: '',
                        type: 'input'
                    },
                    title: {
                        value: '',
                        type: 'input'
                    },
                    planMonth: {
                        value: '',
                        type: 'date'
                    }
                },
                trainTypeOpt: [],
                teacherOpt: []
            };
        },
        created() {
            this._setTableHeight();
            this._getTrainTypeOpt();
            this._getTeacherOpt();
        },
        methods: {
            // 页面左侧点击切换数据 事件
            changeTable_type(item, index) {
                if (!item.active) {
                    // 遍历是的指定选项变成active，其余的取消active
                    this.trainTypeOpt.filter((x, y) => {
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
            formReset(name) {
                this.$refs[name].resetFields();
            },
            // 下载文件方法
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            // 初始化
            _initClassForm() {
                this.classForm = {
                    status: '',
                    comment: '',
                    period: [],
                    teacher_name: '',
                    class_date: '',
                    label: '',
                    dutyer: '',
                    score1: '',
                    score2: '',
                    score3: '',
                    score4: '',
                    score5: ''
                };
            },
            // 选择月份下载课程信息
            _downloadGrade() {
                this.downloadLoading = true;
                let sendData = {};
                sendData.month = this.filterOpt.planMonth.value;
                this.$http.post('/train/export_review_month', sendData).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/download/' + res.data, res.data);
                    }
                    this.downloadLoading = false;
                }, () => {
                    this.downloadLoading = false;
                })
            },
            // 添加
            _addClassHandler() {
                let data = JSON.parse(JSON.stringify(this.classForm));
                data.id = this.classId;
                this.$http.post('/train/review_class_add', data).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this._updateClassTable();
                        this.$Message.success('操作成功!');
                    }
                });
            },
            // 获取培训师下拉框
            _getTeacherOpt() {
                this.$http.get('/train/teacher_comboxData').then((res) => {
                    if (res.success) {
                        this.teacherOpt = res.data;
                    }
                });
            },
            // 获取培训类型下拉框
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.modelFlag = true;
            },
            // 修改
            _checkTest(data) {
                this._initClassForm();
                this.classId = data.id;
                this.className = data.title;
                this.typeName = data.type_name;
                let classForm = this.classForm;
                classForm.status = data.status;
                classForm.period = data.period.split('-');
                classForm.teacher_name = data.teacher_name;
                classForm.class_date = data.class_date;
                classForm.dutyer = data.dutyer;
                classForm.label = data.label;
                classForm.comment = data.comment;
                classForm.score1 = data.score1;
                classForm.score2 = data.score2;
                classForm.score3 = data.score3;
                classForm.score4 = data.score4;
                classForm.score5 = data.score5;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
