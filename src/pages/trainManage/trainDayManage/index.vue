<template>
    <div class="train-day-plan-page">
        <div class="left-part">
            <Button type="primary" style="margin-left: 8px" @click="_changrAll(1)">全选</Button>
            <Button  style="margin-left: 8px" @click="_changrAll(2)">取消</Button>
            <div class="ivu-menu-item-group-title">状态筛选</div>
            <CheckboxGroup v-model="selectedStatus" @on-change="checkAllGroupChange_s" class="l-check-group">
                <Checkbox v-for="item in statusList" :key="item.id" :label="item.id">
                    <span>{{item.name}}</span>
                    <!-- 名称缩写和头像2选一  -->
                </Checkbox>
            </CheckboxGroup>
            <div class="ivu-menu-item-group-title">执行者筛选</div>
            <CheckboxGroup v-model="selectedExecutors" @on-change="checkAllGroupChange" class="l-check-group">
                <Checkbox v-for="item in executorsList" :key="item.id" :label="item.id">
                    <span>{{item.name}}</span>
                    <!-- 名称缩写和头像2选一  -->
                    <Avatar :src="$mainHost + '/oa/upload/head/' + item.pic" size="small" style="float: right;" />
<!--                    <Avatar style="color: #f56a00;background-color: #fde3cf;float: right;" size="small" >{{item.name}}</Avatar>-->
                </Checkbox>
            </CheckboxGroup>
        </div>
        <div class="main-content">
            <Card>
                <a-calendar v-if="showCalendar"
                            class="a-calendar"
                            ref="aCalendar"
                            @select="selectDate"
                            @panelChange="panelChange"
                            @change="dateChange">
                    <div slot="dateCellRender" slot-scope="value" class="day-cell">
                        <Poptip placement="right-end">
                            <div class="cell-back"></div>
                            <div class="api" slot="content">
                                <Button type="primary" long @click.stop="addTrainPlan">新增课程</Button>
                            </div>
                        </Poptip>
                        <ul class="day-plans">
                            <li class="plan-item" :class="item.status == 5 ?  ' finished' : ''"
                                v-for="(item, index) in getData(value)" :key="index" @click.stop="planClick(item)" :title="item.teacher_name + '-' + item.title + (item.period == null ? '': '-' + item.period)">
                                <div class="left-text">
                                    <!-- 点的颜色有多种 下边status中可以填 Success, Error, Default, Processing, warning -->
                                    <a-badge :status="item.status == 5 ?  'success' : 'warning'" />
                                    {{item.teacher_name + '-' + item.title + (item.period == null ? '': '-' + item.period)}}
                                </div>
                                <div class="right-avatar">
                                    <!-- 名称缩写和头像2选一  -->
                                    <Avatar :src="$mainHost + '/oa/upload/head/' + item.pic" size="small" style="float: right;" />
                                    <!-- <Avatar style="color: #f56a00;background-color: #fde3cf;float: right;" size="small" >申老师</Avatar> -->
                                </div>
                            </li>
                        </ul>
                    </div>
                </a-calendar>
            </Card>
        </div>
        <!--课程反馈-->
        <Modal v-model="evaScroll" title="" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建课程' : '修改——课程反馈'}}</span>
            </p>
            <p style="color:#40a9ff;text-align:left;font-size: 15px">
                <span>课程信息:</span>
            </p>
            <Row :gutter="16">
                <Form :rules="classRules"
                      :model="classForm"
                      ref="classForm"
                      :label-width="100">
                    <Row :gutter="9">
                        <Col :span="8">
                            <FormItem label="培训类型" prop="type">
                                <Select v-model="classForm.type"
                                        clearable>
                                    <Option :value="item.id"
                                            v-for="(item,index) in trainTypeOpt"
                                            :key="'trainTypeOpt' + index">{{item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="培训日期" prop="class_date" required>
                                <DatePicker @on-change="classForm.class_date = $event"
                                            :editable="false"
                                            :value="classForm.class_date"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="上课时间" prop="period" required>
                                <!--<Input v-model="classForm.period"></Input>-->
                                <TimePicker @on-change="classForm.period = $event"
                                            :value="classForm.period"
                                            clearable
                                            format="HH:mm"
                                            :editable="false"
                                            type="timerange"
                                            placement="bottom-end"
                                            placeholder="选择时间"
                                            style="width: 168px"></TimePicker>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="培训名称" prop="title">
                                <Input v-model="classForm.title"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="外部讲师" prop="out_teacher" required>
                                <i-switch v-model="classForm.out_teacher" size="large" :true-value="1" :false-value="0"
                                          @on-change="change">
                                    <span slot="open">选中</span>
                                    <span slot="close">不选</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="讲师" v-show="usernameisShow" required>
                                <Input v-model="classForm.username"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="讲师" v-show="isShow" prop="teacher_id" required>
                                <Select filterable v-model="classForm.teacher_id" clearable
                                        :transfer="true"
                                        placeholder="输入查询">
                                    <Option :value="item.user_id"
                                            v-for="(item,index) in teacherOpt"
                                            :key="'teacherOpt' + index">{{item.user_name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>

                        <Col :span="8">
                            <FormItem label="责任人" prop="dutyer">
                                <Input v-model="classForm.dutyer" placeholder="填写责任人"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="培训地点" prop="position">
                                <Select filterable v-model="classForm.position" clearable
                                        :transfer="true"
                                        placeholder="选择会议室">
                                    <Option :value="item.id"
                                            v-for="(item,index) in postionArr"
                                            :key="'teacherOpt' + index">{{item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="反馈模板" prop="type">
                                <Select v-model="classForm.questionnaire_temp"
                                        clearable>
                                    <Option :value="item.id"
                                            v-for="(item,index) in questionnaire"
                                            :key="'questionnaire' + index">{{item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8" >
                            <FormItem label="课程状态:" required>
                                <Select v-model="classForm.status" style="color: red">
                                    <!--状态: -1.删除 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成-->
                                    <Option :value="-1" disabled>删除</Option>
                                    <Option :value="0" disabled>未设置</Option>
                                    <Option :value="1" disabled>待审核</Option>
                                    <Option :value="2" disabled>审核失败</Option>
                                    <Option :value="3" disabled>审核成功</Option>
                                    <Option :value="4">已排期</Option>
                                    <Option :value="5">已完成</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="讲师金币" prop="teacher_coin" required>
                                <InputNumber :min="0" v-model="classForm.teacher_coin"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="人数限制" prop="trainee_max_num" required>
                                <InputNumber :min="0" v-model="classForm.trainee_max_num"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="内容简介">
                                <Input v-model="classForm.about" type="textarea"
                                       :autosize="{minRows: 5,maxRows: 10}"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <Button type="success" style="float:right" @click="_addClassHandler">
                                {{classFormType === 'add'? '新建' : '修改'}}课程</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <p style="color:#40a9ff;text-align:left;font-size: 15px" v-show="flag_comment">
                <span>总结点评:</span>
            </p>
            <Row :gutter="16" style="margin-top: 5px" v-show="flag_comment">
                <Col :span="24">
<!--                    <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;height: 320px;z-index: 0;" >-->
<!--                        <li class="ivu-menu-item-group">-->
                            <div class="ivu-menu-item-group-title" style="z-index: 0;"> 授课评价 {{tec_score}} （均分）
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
                </Col>
<!--            <Col :span="24">-->
<!--                    <span class="spanStyle">1:讲师礼仪/精神面貌</span>-->
<!--            </Col>-->
<!--                            <ul class="ivu-menu ivu-menu-light ivu-menu-vertical">-->
<!--                                <li class="ivu-menu-item" >讲师礼仪/精神面貌&nbsp;&nbsp;&nbsp;&nbsp;  {{score1}}</li>-->
<!--                                <li class="ivu-menu-item">讲师语言表达能力&nbsp;&nbsp;&nbsp;&nbsp;  {{score2}}</li>-->
<!--                                <li class="ivu-menu-item">学员参与度&nbsp;&nbsp;&nbsp;&nbsp;  {{score3}}</li>-->
<!--                                <li class="ivu-menu-item">讲师控场能力&nbsp;&nbsp;&nbsp;&nbsp;  {{score4}}</li>-->
<!--                                <li class="ivu-menu-item">课件讲义的视觉效果&nbsp;&nbsp;&nbsp;&nbsp;  {{score5}}</li>-->
<!--                            </ul>-->
<!--                        </li>-->
                <Form :model="classForm_r"
                      ref="classForm_r"
                      :label-width="100" >
                    <Col :span="6">
                        <FormItem label="1:" required>
                            <span class="spanStyle">讲师礼仪/精神面貌</span>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="点评:">
                            <Select v-model="classForm_r.score1" clearable placeholder="请选择">
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
                            <Select v-model="classForm_r.score2" clearable placeholder="请选择">
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
                            <Select v-model="classForm_r.score3" clearable placeholder="请选择">
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
                            <Select v-model="classForm_r.score4" clearable placeholder="请选择">
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
                            <Select v-model="classForm_r.score5" clearable placeholder="请选择">
                                <Option :value="0">没有任何视觉辅助工具__0</Option>
                                <Option :value="2">课件讲义全部都是大段文字__2</Option>
                                <Option :value="4">课件讲义以文字为主__4</Option>
                                <Option :value="6">课件讲义能够简洁表达授课内容(PPT没有大段文字,脑图等文字讲义重点结构清晰)__6</Option>
                                <Option :value="8">课件讲义图文并茂，视觉上较为舒适__8</Option>
                                <Option :value="10">课件讲义图文并茂,具有专业性，视觉美观__10</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <div class="ivu-menu-item-group-title" style="margin-top: 15px">课程点评：
                            <span style="margin-left: 150px">培训标签:</span>
                            <RadioGroup v-model="classForm_r.label" type="button" size="large">
                                <Radio :label="1" >优秀</Radio>
                                <Radio :label="2" >普通</Radio>
                                <Radio :label="3" >需改进</Radio>
                            </RadioGroup>
                        </div>
                        <Input type="textarea" v-model="classForm_r.comment"
                               :autosize="{minRows: 5,maxRows: 10}" style="margin-top: 15px"></Input>
                    </Col>
                </Form>
                <Col :span="24">
                    <Button type="success" style="float:right;margin-top: 20px" @click="_addClassReviews">提交反馈</Button>
                </Col>
            </Row>
            <p style="color:#40a9ff;text-align:left;font-size: 15px;margin-top: 10px" v-show="flag_stu">
                <span>学员反馈:</span>
            </p>
            <Row :gutter="16" style="margin-top: 10px" v-show="flag_stu">
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
                    <div  style="width:500px;height:300px;" id="data_source_trainDay"></div>
                </Col>
                <Col :span="12">
                    <fs-table-page :columns="evaluatePostColumns"
                                   :size="null"
                                   :height="500"
                                   v-if="flag_stu"
                                   :params="evaluateFilterOpt"
                                   url="/train/show_signin_evaluate">
                    </fs-table-page>
                </Col>
            </Row>
            <p style="color:#40a9ff;text-align:left;font-size: 15px" v-show="flag_score">
                <span>考试信息:</span>
            </p>
            <Row :gutter="16" style="margin-top: 0px" v-show="flag_score">
                <hr />
                <Col :span="12">
                    <div class="ivu-menu-item-group-title" style="margin-top: 15px"> 考试情况： {{pass_rate}}% （通过率）合格线：{{qualified_line}}</div>
                    <fs-table-page :columns="scoreColumns"
                                   :size="null"
                                   :height="500"
                                   v-if="flag_score"
                                   :params="scoreFilterOpt"
                                   url="/train/show_exam_score">
                    </fs-table-page>
                </Col>
            </Row>
            <div slot="footer">
<!--                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'?-->
<!--                    '新建课程' : '修改课程反馈'}}-->
                </Button>
                <Button type="ghost" @click="evaScroll = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    /*
    *  张廷旭
    */

    import Vue from 'vue'
    import { Calendar, Badge } from 'ant-design-vue'
    Vue.use(Calendar)
    Vue.use(Badge)
    import 'ant-design-vue/dist/antd.css'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import echarts from 'echarts/lib/echarts';
    import funnel from 'echarts/lib/chart/funnel';
    import tooltip from 'echarts/lib/component/tooltip';
    import legendScroll from 'echarts/lib/component/legendScroll';
    import title from 'echarts/lib/component/title';
    import pie from 'echarts/lib/chart/pie';
    moment.locale('zh-cn');
    // const NOW_DAY = moment().format('YYYY-MM-DD');
    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'trainDayManage',
        data() {
            return {
                isShow: true,
                evaScroll: false,
                usernameisShow: false,
                scoreDescFlag: false,
                flag_score: false,
                flag_comment: false,
                flag_stu: false,
                classFormType: 'add',
                className: '',
                teacherOpt: [],
                trainTypeOpt: [],
                questionList: [],
                questionnaire: [],
                classId: 0,
                classRules: {
                    title: [
                        {required: true, message: '培训名称不能为空', trigger: 'blur'}
                    ],
                    teacher_id: [
                        {required: true, message: '讲师不能为空', type: 'number', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '培训类型不能为空', type: 'number', trigger: 'change'}
                    ],
                    position: [
                        {required: true, message: '培训地点不能为空', trigger: 'change'}
                    ],
                    dutyer: [
                        {required: true, message: '责任人不能为空', trigger: 'blur'}
                    ]
                },
                classForm: {
                    out_teacher: '0',
                    username: '',
                    type: '',
                    title: '',
                    class_date: '',
                    period: [],
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: '',
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: '',
                    dutyer: '',
                    status: ''
                },
                classForm_r: {
                    comment: '',
                    label: '',
                    score1: '',
                    score2: '',
                    score3: '',
                    score4: '',
                    score5: ''
                },
                // 地点
                postionArr: [
                    {id: '1', name: '101'},
                    {id: '2', name: '301'},
                    {id: '3', name: '302'},
                    {id: '4', name: '307'},
                    {id: '5', name: '407'},
                    {id: '6', name: '门店'},
                    {id: '7', name: '天马云仓'}
                ],
                pass_rate: '',
                qualified_line: '',
                stu_score: '',
                tec_score: '',
                // comment: '',
                // label: '',
                // score1: '',
                // score2: '',
                // score3: '',
                // score4: '',
                // score5: '',
                // 学院反馈
                evaluateFilterOpt: {
                    id: {
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
                    {
                        title: '反馈人',
                        align: 'center',
                        key: 'realname',
                        width: 80
                    },
                    {
                        title: '总分',
                        align: 'center',
                        key: 'evaluate_score',
                        width: 60
                    }
                ],
                scoreFilterOpt: {
                    examId: {
                        value: '',
                        type: 'normal'
                    }
                },
                // 考试成绩列表
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
                // 饼图
                dataSourcePie2: '',
                dataSourcePie2Data: {
                    legendData: [],
                    seriesData: [],
                    selected: {}
                },
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
                classDataList: '', // 计划数据列表
                dayObject: {}, // 符合日历格式的计划数据展示格式
                showCalendar: false, // 是否显示日历flag
                chosedDate: '', // 存放当前选中的日期，格式是13位的时间戳
                chosedDateDay: '', // 选中的 日期
                executorsList: [], // 执行人列表
                selectedExecutors: [],
                // <!--状态: -1.删除 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成-->
                statusList: [
                    {id: -1, name: '已删除'},
                    {id: 0, name: '未设置'},
                    {id: 1, name: '待审核'},
                    {id: 2, name: '审核失败'},
                    {id: 3, name: '审核成功'},
                    {id: 4, name: '已排期'},
                    {id: 5, name: '已完成'}
                ], // 多选框状态列表
                selectedStatus: [-1, 0, 1, 2, 3, 4, 5] // 多选框选中的状态
            }
        },
        created() {
            this._getClassData(NOW_MONTH);
            this._getExecutorsList();
            this._getTeacherOpt();
            this._getTrainTypeOpt();
            this._getQuestionnaire()
        },
        methods: {
            // 监听左侧执行人变化
            checkAllGroupChange(data) {
                let classData = this.classDataList.concat();
                if (data.length !== this.executorsList.length || this.selectedStatus.length !== this.statusList.length) {
                    for (var i = classData.length - 1; i >= 0; i--) {
                        // 执行者为 空时 状态不为空
                        if (0 === data.length) {
                            // 状态
                            if (!this.selectedStatus.includes(classData[i].status)) {
                                classData.splice(i, 1);
                                continue;
                            }
                            continue;
                        }
                        if (classData[i].dutyid) {
                            // 执行者
                            if (!data.includes(classData[i].dutyid)) {
                                classData.splice(i, 1);
                                continue;
                            }
                            // 状态
                            if (!this.selectedStatus.includes(classData[i].status)) {
                                classData.splice(i, 1);
                                continue;
                            }
                        } else {
                            classData.splice(i, 1);
                        }
                    }
                }
                // 遍历并以时间戳为键存入dayObject中
                this.dayObject = [];
                classData.filter(x => {
                    let dayTimestamp = moment(x.class_date).valueOf()
                    x.timestamp = dayTimestamp
                    if (this.dayObject[dayTimestamp]) {
                        this.dayObject[dayTimestamp].push(x)
                    } else {
                        this.dayObject[dayTimestamp] = [x]
                    }
                })
            },
            // 监听左侧状态
            checkAllGroupChange_s(data) {
                let classData = this.classDataList.concat();
                if (data.length !== this.statusList.length || this.selectedExecutors.length !== this.executorsList.length) {
                    for (var i = classData.length - 1; i >= 0; i--) {
                        if (classData[i].status) {
                            // 状态
                            if (!data.includes(classData[i].status)) {
                                classData.splice(i, 1);
                                continue;
                            }
                            ;
                            // 执行者
                            if (0 === this.selectedExecutors.length) {
                                continue;
                            }
                            if (this.selectedExecutors.length !== this.executorsList.length) {
                                if (!this.selectedExecutors.includes(classData[i].dutyid)) {
                                    classData.splice(i, 1);
                                }
                            }
                        } else {
                            classData.splice(i, 1);
                        }
                    }
                }
                // 遍历并以时间戳为键存入dayObject中
                this.dayObject = [];
                classData.filter(x => {
                    let dayTimestamp = moment(x.class_date).valueOf()
                    x.timestamp = dayTimestamp
                    if (this.dayObject[dayTimestamp]) {
                        this.dayObject[dayTimestamp].push(x)
                    } else {
                        this.dayObject[dayTimestamp] = [x]
                    }
                })
            },
            // 年月发生变化触发 可以根据这个方法调接口拿指定日期的数据
            panelChange(moment, type) {
                this._getClassData(moment.format('YYYY-MM'));
            },
            // 获取课程计划列表
            _getClassData(month) {
                this.classDataList = [];
                this.dayObject = [];
                const params = {
                    month: month
                }
                this.$http.post('/train/class_month_datalist', params).then((res) => {
                    if (res.length === 0) {
                        this.$emit('empty', [])
                        this.classDataList = []
                    } else {
                        this.classDataList = res.data;
                        // 遍历并以时间戳为键存入dayObject中
                        this.classDataList.filter(x => {
                            let dayTimestamp = moment(x.class_date).valueOf()
                            x.timestamp = dayTimestamp
                            if (this.dayObject[dayTimestamp]) {
                                this.dayObject[dayTimestamp].push(x)
                            } else {
                                this.dayObject[dayTimestamp] = [x]
                            }
                        })
                        this.showCalendar = true;
                    }
                });
            },
            // 获取时间戳
            getTimestamp(value) {
                return moment(value.format('YYYY MM DD'), 'YYYY-MM-DD').valueOf()
            },
            // 获取每个日历格子中的数据
            getData(value) {
                // let listData
                // 返回对应日期的计划列表
                let dayItem = this.dayObject[this.getTimestamp(value)]
                return dayItem ? dayItem : []
            },
            // 点击日历格子，保存当前选中的日期
            selectDate(value) {
                this.chosedDate = value.format('YYYY-MM');
                this.chosedDateDay = value.format('YYYY-MM-DD');
                // 点击日历格子 跨月请求 后台数据
                if (moment(this.$refs.aCalendar.sValue).format('YYYY-MM') !== value.format('YYYY-MM')) {
                    this._getClassData(value.format('YYYY-MM')); // 刷新日历数据
                    this._getExecutorsList(); // 刷新左侧责任人
                }
            },
            // 点击日历格子里的每条记录 item为培训计划的详情
            planClick(data) {
                // 赋值查询日期
                this.chosedDate = data.class_date.substring(0, 7);
                // 点击一条培训计划
                this.classFormType = 'update';
                this.flag_comment = true;
                this._initClassForm();
                this.classId = data.id;
                let classForm = this.classForm;
                if (data.teacher_id === null) {
                    classForm.out_teacher = 1;
                    this.isShow = false;
                    this.usernameisShow = true;
                } else {
                    classForm.out_teacher = 0;
                    this.isShow = true;
                    this.usernameisShow = false;
                }
                classForm.username = data.teacher_name;
                classForm.type = data.type;
                classForm.title = data.title;
                classForm.class_date = data.class_date;
                if (data.period) {
                    classForm.period = data.period.split('-');
                }
                classForm.position = data.position;
                classForm.credit = data.credit;
                classForm.teacher_id = data.teacher_id;
                classForm.teacher_coin = data.teacher_coin;
                classForm.trainee_max_num = data.trainee_max_num;
                classForm.about = data.about;
                classForm.questionnaire_temp = data.questionnaire_id;
                classForm.dutyer = data.dutyer;
                classForm.status = data.status;
                this.className = data.title;
                // 已排期以后才会有后面数据
                if (4 <= data.status) {
                    // 查询问卷问题列表
                    if (data.questionnaire_id) {
                        this._getQuestionAnswer(data.questionnaire_id);
                        // 获取学员反馈内容与分数列表
                        this.evaluateFilterOpt.id.value = data.id;
                        this._getData(data.id, 1);
                        this.flag_stu = true;
                    } else {
                        this.flag_stu = false;
                    }
                    // 查询课程学员所打均分 课程 点评分数 与 评论
                    this._getAvgScoreComment();
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
                        this.flag_score = true;
                    } else {
                        this.flag_score = false;
                    }
                } else {
                    this.flag_comment = false;
                    this.flag_score = false;
                    this.flag_stu = false;
                }
                this.evaScroll = true;
            },
            // 重置表格
            formReset(name) {
                this.$refs[name].resetFields();
            },
            // 重置表格
            _initClassForm() {
                this.formReset('classForm');
                this.classForm = {
                    out_teacher: 0,
                    username: '',
                    type: '',
                    title: '',
                    class_date: this.chosedDateDay,
                    period: [],
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: '',
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: '',
                    dutyer: '',
                    status: ''
                };
            },
            // 添加课程计划
            addTrainPlan() {
                // 打开培训计划新增弹窗
                this.classFormType = 'add';
                this._initClassForm();
                // 新增课程关闭下边展示
                this.flag_score = false;
                this.flag_stu = false;
                this.flag_comment = false;
                this.classForm.status = 4;
                this.evaScroll = true;
                // console.log(this.chosedDate);
                // chosedDate就是要添加计划的日期时间戳
                // this.inserData(this.chosedDate)
            },
            // 新建计划后将数据存入对应日历格子方法 item为计划的数据
            // inserData(timestamp) {
            //     if (this.dayObject[timestamp]) {
            //         // 已存在当天数据
            //         this.dayObject[timestamp].push({
            //             approvaler: '王老师',
            //             class_date: '2019-04-28 00:00:00',
            //             timestamp: timestamp,
            //             title: '测试002',
            //             period: '03:00-07:00'
            //         })
            //     } else {
            //         // 不存在 新增
            //         this.dayObject[timestamp] = [{
            //             approvaler: '王老师',
            //             class_date: '2019-04-28 00:00:00',
            //             timestamp: timestamp,
            //             title: '测试002',
            //             period: '03:00-07:00'
            //         }]
            //     }
            //     this.updateCalendar();
            // },
            // 更新日历上计划的方法
            updateCalendar() {
                const _do = JSON.parse(JSON.stringify(this.dayObject)); // 深拷贝，否则日历上的视图不会更新
                this.dayObject = _do;
                // this.$Message.success('你新增了一个计划！');
            },
            // 日期变化，与上边selectDate方法重复，不使用
            dateChange(moment) {
                // console.log(moment.format('YYYY-MM'));
            },
            // 查询  责任人
            _getExecutorsList() {
                this.$http.post('/train/getExecutorsList').then((res) => {
                    if (res.success) {
                        this.executorsList = res.data;
                        for (var i in res.data) {
                            this.selectedExecutors.push(res.data[i].id);
                        };
                    }
                });
            },
            // 添加课程
            _addClassHandler() {
                this.$refs.classForm.validate((valid) => {
                    if (valid) {
                        if (0 >= this.classForm.trainee_max_num) {
                            this.$Message.error('请填写最大人数');
                            return;
                        }
                        if (0 >= this.classForm.period.length) {
                            this.$Message.error('请填写培训时间');
                            return;
                        }
                        let data = JSON.parse(JSON.stringify(this.classForm));
                        if (this.classFormType === 'update') {
                            data.id = this.classId;
                        }
                        this.$http.post('/train/class_add', data).then((res) => {
                            if (res.success) {
                                if (this.classFormType === 'add') {
                                    this.evaScroll = false;
                                }
                                this._getClassData(this.chosedDate); // 刷新日历数据
                                this._getExecutorsList(); // 刷新左侧责任人
                                this.$Message.success('添加成功!');
                            }
                        });
                    }
                });
            },
            // 重置表格
            _initClassForm_r() {
                this.formReset('classForm_r');
                this.classForm_r = {
                    comment: '',
                    label: '',
                    score1: '',
                    score2: '',
                    score3: '',
                    score4: '',
                    score5: ''
                }
            },
            // 添加反馈信息
            _addClassReviews() {
                // this._initClassForm_r();
                let data1 = JSON.parse(JSON.stringify(this.classForm));
                let data2 = JSON.parse(JSON.stringify(this.classForm_r));
                let data = Object.assign(data1, data2);
                data.id = this.classId;
                this.$http.post('/train/review_class_add', data).then((res) => {
                    if (res.success) {
                        this.evaScroll = false;
                        this._getClassData(this.chosedDate); // 刷新日历数据
                        this._getExecutorsList(); // 刷新左侧责任人
                        this.$Message.success('操作成功!');
                    }
                });
            },
            // 讲师下拉框
            _getTeacherOpt() {
                this.$http.get('/train/teacher_comboxData').then((res) => {
                    if (res.success) {
                        this.teacherOpt = res.data;
                    }
                });
            },
            // 培训类型下拉框
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
            // 反馈问卷列表
            _getQuestionnaire() {
                let data = {};
                data.page = 1;
                data.pageSize = 10000;
                data.status = '1';
                this.$http.post('/questionnairepaper/getPaperList', data).then((res) => {
                    if (res.success) {
                        this.questionnaire = res.data;
                    }
                });
            },
            // 外部内部讲师开关操作
            change(status) {
                this.isShow = !this.isShow;
                this.usernameisShow = !this.usernameisShow;
            },
            // 左侧筛选全部或是取消
            _changrAll(data) {
                console.log(data)
                this.selectedExecutors = [];
                this.selectedStatus = [-1, 0, 1, 2, 3, 4, 5];
                if (1 === data) {
                    for (var i in this.executorsList) {
                        this.selectedExecutors.push(this.executorsList[i].id);
                    };
                    this.checkAllGroupChange(this.selectedExecutors);
                } else {
                    this.selectedExecutors = [];
                    this.selectedStatus = [];
                    this.dayObject = [];
                }
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
            // 查询反馈
            _getAvgScoreComment() {
                this.label = '';
                let sendData = {};
                sendData.id = this.classId;
                this.$http.post('/train/query_id_comment', sendData).then((res) => {
                    if (res.success) {
                        this.stu_score = res.data.stu_score;
                        this.tec_score = res.data.tec_score;
                        this._initClassForm_r();
                        this.classForm_r.comment = res.data.comment;
                        this.classForm_r.label = res.data.label;
                        this.classForm_r.score1 = res.data.score1;
                        this.classForm_r.score2 = res.data.score2;
                        this.classForm_r.score3 = res.data.score3;
                        this.classForm_r.score4 = res.data.score4;
                        this.classForm_r.score5 = res.data.score5;
                    }
                });
            },
            // 查询题目选择项占比
            _getData(c_id, q_id) {
                var vm = this;
                vm.dataSourcePie2Data.legendData = [];
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
            // 点击试题查看选项 饼图
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
            }
        },
        mounted () {
            this.$nextTick(() => {
                // var dataSourcePie = echarts.init(document.getElementById('data_source1'));
                var dataSourcePie2 = echarts.init(document.getElementById('data_source_trainDay'));
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
            fsTablePage
        }
    };
</script>
<style scoped>
    .a-calendar >>> .ant-radio-group{
        display: none;
    }

    .train-day-plan-page >>> .a-calendar .ant-fullcalendar-date{
        height: 200px;
    }

    .train-day-plan-page >>> .ant-fullcalendar-header{
        text-align: left;
    }

    .train-day-plan-page >>> .a-calendar .ant-fullcalendar-content{
        height: 164px;
    }

    .train-day-plan-page >>> .a-calendar .ant-fullcalendar-content .ant-badge-status-text{
        font-size: 12px;
    }

    .train-day-plan-page >>> .a-calendar .ant-fullcalendar-content::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    .train-day-plan-page >>> .a-calendar .ant-fullcalendar-content::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .train-day-plan-page >>>  .a-calendar .ant-fullcalendar-content::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
    }

    .day-cell{
        width: 100%;
        height: 160px;
    }
    .day-cell >>> .ivu-poptip{
        width: 100%;
        height: 100%;
    }

    .day-cell >>> .ivu-poptip .ivu-poptip-rel{
        width: 100%;
        height: 100%;
    }

    .day-cell >>> .ivu-poptip .ivu-poptip-inner .ivu-poptip-body{
        padding: 4px;
    }

    .day-cell >>> .cell-back{
        width: 100%;
        height: 100%;
    }

    .day-plans {
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        left: 12px;
        right: 12px;
        top: 24px;
        z-index: 1;
        max-height: 160px;
        overflow-y: auto;
    }

    .day-plans::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    .day-plans::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .day-plans::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
    }

    .day-plans .plan-item{
        position: relative;
        padding-right: 24px;
        height: 24px;
    }

    .day-plans .plan-item >>> .ant-badge-not-a-wrapper{
        height: 16px;
        line-height: 16px;
        vertical-align: baseline;
    }

    .day-plans .plan-item >>> .ant-badge-not-a-wrapper .ant-badge-status-text{
        margin-left: 0;
    }

    .day-plans .plan-item .left-text{
        font-size: 12px;
        line-height: 24px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .day-plans .plan-item.finished .left-text{
        text-decoration: line-through;
        color: #999;
    }

    .day-plans .plan-item:hover .left-text{
        color: #1890ff;
    }

    .day-plans .plan-item .right-avatar{
        position: absolute;
        right: 0;
        top: 3px;
    }

    .day-plans .plan-item .right-avatar >>> .ivu-avatar-small{
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
    }

    .notes-month {
        text-align: center;
        font-size: 28px;
    }
    .notes-month section {
        font-size: 28px;
    }

    .train-day-plan-page{
        position: relative;
        width: 100%;
        padding-left: 180px;
        background-color: #fff;
    }
    .train-day-plan-page .left-part{
        width: 160px;
        position: absolute;
        left: 10px;
        top: 0;
        padding: 10px;
        border: 1px solid #dddee1;
        border-color: #e9eaec;
    }
    .train-day-plan-page .main-content{
        width: 100%;
        min-width: 1200px;
        overflow-x: auto;
    }

    .l-check-group >>> .ivu-checkbox-group-item{
        margin-right: 0;
        padding: 6px 8px;
        width: 100%;
        display: block;
    }

    .l-check-group >>> .ivu-checkbox+span{
        vertical-align: middle;
        line-height: 24px;
    }

    .spanStyle {
        font-size: 14px;
        color: #495060;
        line-height: 24px;
    }
</style>
