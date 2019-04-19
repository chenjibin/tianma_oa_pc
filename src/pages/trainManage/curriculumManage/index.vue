<template>
    <div>
        <Row :gutter="10">
            <Col :span="2">
                <ul class="ivu-menu ivu-menu-light ivu-menu-vertical" style="width: 100%;">
                    <li class="ivu-menu-item-group">
                        <div class="ivu-menu-item-group-title">授课类型</div>
                        <ul>
                            <li class="ivu-menu-item" v-for="(item, index) in trainTypeOpt" :key="index" :class="{'ivu-menu-item-active': item.active}" @click="changeTable_type(item, index)">{{item.name}}</li>
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
                        <FormItem label="名称:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.title.value"
                                   placeholder="筛选名称"></Input>
                        </FormItem>
                        <FormItem label="地点:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.position.value"
                                   placeholder="筛选名称"></Input>
                        </FormItem>
                        <FormItem label="讲师:" :label-width="60">
                            <Input type="text" clearable
                                   v-model="filterOpt.teacher_name.value"
                                   placeholder="筛选讲师"></Input>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <ButtonGroup>
                                <Button type="primary" @click="mubanFlag = true">
                                    <Icon type="gear-b"></Icon>
                                    培训类型设置
                                </Button>
                                <Button type="primary" @click="_createClassOpen">
                                    <Icon type="plus-round"></Icon>
                                    新建课程
                                </Button>
                                <Button type="error"
                                        :disabled="!classChooseDataArray.length"
                                        @click="_delClass">
                                    <Icon type="ios-trash-outline"></Icon>
                                    删除课程
                                </Button>
                                <!--<Button type="success"-->
                                <!--:disabled="classChooseDataArray.length !== 1"-->
                                <!--:loading="downloadLoading"-->
                                <!--@click="_downloadGrade">-->
                                <!--<Icon type="ios-cloud-download-outline"></Icon>-->
                                <!--下载成绩-->
                                <!--</Button>-->
                                <!--<Button type="success"-->
                                <!--:disabled="classChooseDataArray.length !== 1"-->
                                <!--@click="_openUploadModel">-->
                                <!--<Icon type="ios-cloud-upload-outline"></Icon>-->
                                <!--上传成绩-->
                                <!--</Button>-->
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   ref="classTable"
                                   :choosearray.sync="classChooseDataArray"
                                   url="/train/class_datalist"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <!--培训类型模块-->
        <Modal v-model="mubanFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训类型设置</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="postAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/class_type_datalist"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选类型吗？"
                        transfer
                        @on-ok="_deletePost">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除
                    </Button>
                </Poptip>
                <Poptip placement="left" width="400">
                    <Button type="primary"
                            :disabled="!(chooseDataArray.length === 1)"
                            style="margin-left: 8px"
                            @click="_updateMubanHandler">修改类型
                    </Button>
                    <Button type="primary"
                            @click="_addMubanHandler"
                            style="margin-left: 8px">添加类型
                    </Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="名称" prop="name">
                                <Input v-model="banciForm.name"></Input>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="banciForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">{{mubanAddType === 'add' ? '添加': '修改'}}类型
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <!--新建修改课程-->
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}课程</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="9">
                    <Col :span="12">
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
                    <Col :span="12">
                        <FormItem label="培训日期" prop="class_date" required>
                            <DatePicker @on-change="classForm.class_date = $event"
                                        :editable="false"
                                        :value="classForm.class_date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="培训名称" prop="title">
                            <Input v-model="classForm.title"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="外部讲师" prop="out_teacher" required>
                            <i-switch v-model="classForm.out_teacher" size="large" :true-value="1" :false-value="0"
                                      @on-change="change">
                                <span slot="open">选中</span>
                                <span slot="close">不选</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="讲师" v-show="usernameisShow" required>
                            <Input v-model="classForm.username"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
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
                    <Col :span="12">
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
                    <Col :span="12">
                        <FormItem label="责任人" prop="dutyer">
                            <Input v-model="classForm.dutyer" placeholder="填写责任人"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="培训地点" prop="position">
                            <Select filterable v-model="classForm.position" clearable
                                   :transfer="true"
                                   placeholder="选择会议室">
                                <Option :value="item.id"
                                        v-for="(item,index) in postionArr"
                                        :key="'postionArr' + index">{{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <!--<Col :span="8">-->
                        <!--<FormItem label="学分">-->
                            <!--<InputNumber :min="0" v-model="classForm.credit"></InputNumber>-->
                        <!--</FormItem>-->
                    <!--</Col>-->
                    <Col :span="24">
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
                    <Col :span="12">
                        <FormItem label="讲师金币" prop="teacher_coin" required>
                            <InputNumber :min="0" v-model="classForm.teacher_coin"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="人数限制" prop="trainee_max_num" required>
                            <InputNumber :min="0" v-model="classForm.trainee_max_num"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="内容简介">
                            <Input v-model="classForm.about" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'?
                    '新建' : '修改'}}课程
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="importModalFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>上传成绩({{uploadForm.title}})</span>
            </p>
            <Button type="success"
                    :loading="mubanDownloadLoading"
                    style="margin-bottom: 10px;"
                    @click="_downloadGradeMuban">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button>
            <Upload type="drag"
                    :show-upload-list="false"
                    :data="uploadForm"
                    :on-progress="_uploadProgress"
                    :on-format-error="_uploadFormatErr"
                    :on-success="_uploadSuccess"
                    :format="uploadFormat"
                    action="/oa/train/trainee_credit_modoexcel">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">成绩上传中...</Spin>
            </Upload>
            <div slot="footer"></div>
        </Modal>
        <Modal title="签到/评论二维码" v-model="visible" width="600">
            <div style="max-height: 500px;overflow-y: auto;:overflow-x hidden;">
                <Row type="flex" justify="center" class="code-row-bg">
                    <Col span="12">
                    <img :src="$mainHost + '/oa/upload/' + item.signinpicname"
                         v-for="(item, index) in imgArr"
                         :key="'prewimg-' + index"
                         :style="{transform: `rotateZ(${item.deg}deg)`}"
                         style="display: block;margin:auto; text-align: center;"/>
                    </Col>
                </Row>
                <Row type="flex" justify="center" class="code-row-bg">
                    <Col span="12">
                    <span style="text-align: center;display:block;">签到/反馈二维码</span></Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="visible = false">关闭</Button>
            </div>
        </Modal>
<!--        综合反馈-->
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
                    <div  style="width:500px;height:300px;" id="data_source_curr"></div>
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
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import echarts from 'echarts/lib/echarts';
    import funnel from 'echarts/lib/chart/funnel';
    import tooltip from 'echarts/lib/component/tooltip';
    import legendScroll from 'echarts/lib/component/legendScroll';
    import title from 'echarts/lib/component/title';
    import pie from 'echarts/lib/chart/pie';
    import moment from 'moment';
    import utils from '@/libs/util.js';
    import editorPaper from '../components/editor-paper-t';
    const NOW_DAY = moment().format('YYYY-MM-DD');
    export default {
        name: 'curriculumManage',
        data() {
            return {
                imgArr: [],
                isShow: true,
                usernameisShow: false,
                visible: false,
                scoreDescFlag: false,
                score_flag: false,
                paperCheckFlag: false,
                paperIdCheck: 0,
                orderList: [],
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
                pageData: {
                    page: 1,
                    pageSize: 20,
                    totalCount: 0,
                    status: '3'
                },
                postionArr: [
                    {id: '1', name: '101'},
                    {id: '2', name: '301'},
                    {id: '3', name: '302'},
                    {id: '4', name: '307'},
                    {id: '5', name: '407'},
                    {id: '6', name: '门店'}
                ],
                evaScroll: false,
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                downloadLoading: false,
                importModalFlag: false,
                spinShow: false,
                mubanDownloadLoading: false,
                mubanAddType: 'add',
                classFormType: 'add',
                planid: '',
                uploadFormat: ['xls'],
                uploadForm: {
                    id: '',
                    title: '',
                    teacher_id: '',
                    questionnaire_temp: ''
                },
                mubanId: 0,
                tableHeight: 300,
                chooseDataArray: [],
                classChooseDataArray: [],
                banciRules: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ]
                },
                banciForm: {
                    name: '',
                    remark: ''
                },
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
                    class_date: NOW_DAY,
                    period: [],
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: '',
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: '',
                    dutyer: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanColumns: [
                    {
                        type: 'selection',
                        width: 30,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    }
                ],
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
                        title: '日期',
                        key: 'user_name',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('span', moment(params.row.class_date).format('YYYY-MM-DD'));
                        }
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'period',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.period) {
                                return h('span', params.row.period);
                            } else {
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: 'blue'
                                    }
                                }, "未设置");
                            }
                        }
                    },
                    {
                        title: '培训类型',
                        key: 'type_name'
                        // width: 100
                    },
                    {
                        title: '培训名称',
                        key: 'title'
                        // minWidth: 120
                    },
                    {
                        title: '地点',
                        align: 'center',
                        key: 'position',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.position) {
                                let name = '异常';
                                this.postionArr.forEach(item => {
                                    if (item.id === params.row.position) {
                                        name = item.name;
                                    }
                                })
                                return h('span', name);
                            } else {
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: 'blue'
                                    }
                                }, "未设置");
                            }
                        }
                    },
                    // {
                    //     title: '学分',
                    //     align: 'center',
                    //     key: 'credit',
                    //     width: 80
                    // },
                    {
                        title: '讲师',
                        key: 'teacher_name'
                        // width: 80
                    },
                    {
                        title: '讲师金币',
                        align: 'center',
                        key: 'teacher_coin'
                        // width: 100
                    },
                    {
                        title: '人数限制',
                        align: 'center',
                        key: 'trainee_max_num',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.trainee_max_num) {
                                return h('span', params.row.trainee_max_num);
                            } else {
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: 'blue'
                                    }
                                }, "未设置");
                            }
                        }
                    },
                    {
                        title: '报名人数',
                        key: 'has_baoming',
                        align: 'center',
                        // width: 100,
                        render: (h, params) => {
                            return h('span', params.row.has_baoming || 0);
                        }
                    }, {
                        title: '签到人数',
                        key: 'sign_in',
                        align: 'center',
                        // width: 100,
                        render: (h, params) => {
                            return h('span', params.row.sign_in || 0);
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        width: 120,
                        render: (h, params) => {
                            // 0.未设置 1.待审核 2.审核失败 3.审核成功 4.已排期 5.已完成
                            let status = '';
                            let s_c = '';
                            if (params.row.status === 3) {
                                status = '未排期';
                                s_c = 'red';
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
                                }
                            }, status);
                        }
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
                    }, {
                        title: '签到/评论二维码',
                        width: 90,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = '';
                            if (params.row.signinpicname) {
                                lookBtn = h('Tooltip', {
                                    props: {
                                        content: '查看二维码',
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
                                                vm._prewImg(params.row);
                                            }
                                        }
                                    })
                                ]);
                            }
                            return h('div', [lookBtn]);
                        }
                    },
                     {
                        title: '责任人',
                        key: 'dutyer',
                        align: 'center'
                        // width: 100,
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
                        title: '操作',
                        align: 'center',
                        width: 80,
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
                                            icon: 'edit',
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
                filterOpt: {
                    class_type: {
                        value: '',
                        type: 'input'
                    },
                    teacher_name: {
                        value: '',
                        type: 'input'
                    },
                    title: {
                        value: '',
                        type: 'input'
                    },
                    position: {
                        value: '',
                        type: 'input'
                    },
                    planMonth: {
                        value: '',
                        type: 'date'
                    }
                },
                trainTypeOpt: [],
                questionList: [],
                questionnaire: [],
                teacherOpt: [],
                compangsList: [],
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
            this._getTrainTypeOpt();
            this._getQuestionnaire();
            this._getTeacherOpt();
            this._getAllCompangsList();
        },
        methods: {
            formReset(name) {
                this.$refs[name].resetFields();
            },
            _downloadGrade() {
                this.downloadLoading = true;
                let sendData = {};
                sendData.id = this.classChooseDataArray[0].id;
                sendData.title = this.classChooseDataArray[0].title;
                this.$http.post('/train/trainee_class_crdit_excel', sendData).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/download/' + res.data, res.data);
                    }
                    this.downloadLoading = false;
                }, () => {
                    this.downloadLoading = false;
                })
            },
            _downloadGrade1(data) {
                let sendData = {};
                sendData.id = data.value;
                data.loading = true;
                this.$http.post('/train/exportDetail', sendData).then((res) => {
                    if (res.success) {
                        utils.downloadFile(res.path, res.path);
                    }
                    data.loading = false;
                }, () => {
                    data.loading = false;
                })
            },
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _rotateImg(index) {
                this.imgArr[index].deg += 90;
            },
            // 外部内部讲师开关操作
            change(status) {
                this.isShow = !this.isShow;
                this.usernameisShow = !this.usernameisShow;
                // if (+status === 1) {
                //     this.classForm.teacher_id = 1019
                // }
            },
            _prewImg(data) {
                this.visible = true;
                let storeArr = [];
                if (data.signinpicname) {
                    let obj = {};
                    obj.signinpicname = data.signinpicname;
                    obj.evaluatepicname = data.evaluatepicname;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                this.imgArr = storeArr;
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
            _openUploadModel() {
                this.importModalFlag = true;
                this.uploadForm.id = this.classChooseDataArray[0].id;
                this.uploadForm.title = this.classChooseDataArray[0].title;
                this.uploadForm.teacher_id = this.classChooseDataArray[0].teacher_id;
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('成绩上传成功!');
                    this.importModalFlag = false;
                    this.$refs.classTable.getListData();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _downloadGradeMuban() {
                this.downloadFile('/oa/down/成绩单模板.xls', '成绩单模板.xls');
            },
            _updateMubanHandler() {
                this.mubanAddType = 'update';
                this.formReset('banciForm');
                let fillForm = this.chooseDataArray[0];
                this.banciForm.name = fillForm.name;
                this.banciForm.remark = fillForm.remark;
                this.mubanId = fillForm.id;
            },
            _addMubanHandler() {
                this.mubanAddType = 'add';
                this.formReset('banciForm');
            },
            _initClassForm() {
                this.formReset('classForm');
                this.classForm = {
                    out_teacher: 0,
                    username: '',
                    type: '',
                    title: '',
                    class_date: NOW_DAY,
                    period: [],
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    questionnaire_temp: '',
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: '',
                    dutyer: ''
                };
            },
            _delClass() {
                this.$Modal.confirm({
                    content: '确认删除所选课程么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.classChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/ever_para_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updateClassTable();
                            }
                        });
                    }
                });
            },
            _addClassHandler() {
                this.$refs.classForm.validate((valid) => {
                    if (valid) {
                        if (0 >= this.classForm.trainee_max_num){
                            this.$Message.error("请填写最大人数");
                            return;
                        }
                        if (0 >= this.classForm.period.length){
                            this.$Message.error("请填写培训时间");
                            return;
                        }
                        let data = JSON.parse(JSON.stringify(this.classForm));
                        if (this.classFormType === 'update') data.id = this.classId;
                        this.$http.post('/train/class_add', data).then((res) => {
                            if (res.success) {
                                this.modelFlag = false;
                                this._updateClassTable();
                                this.$Message.success('操作成功!');
                            }
                        });
                    }
                });
            },
            _getTeacherOpt() {
                this.$http.get('/train/teacher_comboxData').then((res) => {
                    if (res.success) {
                        this.teacherOpt = res.data;
                    }
                });
            },
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
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
            _deletePost() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/class_type_delete', data).then((res) => {
                    if (res.success) {
                        this.$refs.postAdd.getListData();
                        this.chooseDataArray = [];
                        this._getTrainTypeOpt();
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addPost() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.name;
                        data.remark = this.banciForm.remark;
                        if (!(this.mubanAddType === 'add')) data.id = this.mubanId;
                        this.$http.post('/train/class_type_add', data).then((res) => {
                            if (res.success) {
                                this.formReset('banciForm');
                                this.$refs.postAdd.getListData();
                                this._getTrainTypeOpt();
                                this.$Message.success('课程类型加成功！');
                            }
                            this.banciBtnLoading = false;
                        }, () => {
                            this.banciBtnLoading = false;
                        })
                    }
                });
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.modelFlag = true;
            },
            _checkTest(data) {
                this.classFormType = 'update';
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
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            },
            _getAllCompangsList() {
                this.$http.get('/user/getCompanys').then((res) => {
                    if (res.success) {
                        this.compangsList = res.data;
                    }
                });
            },
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
                var dataSourcePie2 = echarts.init(document.getElementById('data_source_curr'));
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
            fsDepTree,
            editorPaper
        }
    };
</script>
