<template>
    <div>
        <Card>
            <Row type="flex" class="user-infor">
                <Col span="8">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <Tooltip :content="'修改头像'" style="width: 120px">
                        <img class="avator-img"
                             :src="avatorPath"
                             @click="changeAvatorFlag = true"
                             style="border-radius: 50%;"/>
                   </Tooltip>
                </Row>
                </Col>
                <Col span="16" style="padding-left:6px;">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                        <strong class="card-user-infor-name">
                            <span>{{userName}}</span>
                            <span class="level-block">
                                <fs-show-level></fs-show-level>
                            </span>
                        </strong>
                        <p style="font-size: 1.3em;color: #666">{{organizeName + '（' + postName + '）'}}</p>
                        <p style="font-size: 1.1em;line-height: 1;color: #999;letter-spacing: 2px;">{{companyName}}</p>
                    </div>
                </Row>
                </Col>
            </Row>
            <div class="line-gray"></div>
            <Row class="margin-top-8">
                <Col span="8">
                <span style="font-weight: 700;">金币余额:</span>
                <span style="font-size: 24px;">{{tmCoin}}</span>
                <Poptip placement="right-start" width="1200" v-model="coinDescFlag" :transfer="true">
                    <div slot="content" style="white-space: normal;max-height: 600px;overflow: auto;">
                        <img src="../../../images/coin_rule_01.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_02.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_03.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_04.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_05.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_06.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_07.jpg" style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_08.jpg" style="max-width: 100%;"/>
                    </div>
                    <span style="cursor: pointer;" @click="coinDescFlag = true">
                        <Icon type="help-circled"></Icon>
                    </span>
                </Poptip>
                </Col>
                <Col span="8" class="padding-left-8">
                <Tooltip placement="top" content="我的档案" :transfer="true">
                    <Button type="ghost"
                            @click="openById"
                            shape="circle" icon="person"></Button>
                </Tooltip>
                <Poptip placement="right" width="400" v-model="pwsFlag">
                    <div slot="content">
                        <Form :label-width="80"
                              :model="passWordForm"
                              ref="psdForm"
                              :rules="passWordRule">
                            <FormItem label="原始密码" prop="oldPwd">
                                <Input v-model="passWordForm.oldPwd"
                                       type="password"
                                       placeholder="请输入原始密码"></Input>
                            </FormItem>
                            <FormItem label="新密码" prop="newPwd">
                                <Input v-model="passWordForm.newPwd"
                                       type="password"
                                       placeholder="请输入新密码"></Input>
                            </FormItem>
                            <FormItem label="重复新密码" prop="newPwdCheck">
                                <Input v-model="passWordForm.newPwdCheck"
                                       type="password"
                                       placeholder="请输重复新密码"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_submitChangePwd">提交修改</Button>
                                <Button type="ghost" style="margin-left: 8px" @click="_cancelResetPwd">取消</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <Tooltip placement="top" content="修改密码" :transfer="true">
                        <Button type="ghost" shape="circle" icon="lock-combination"></Button>
                    </Tooltip>
                </Poptip>
                <Poptip placement="right-start"
                        width="500"
                        v-model="lotteryFlag">
                    <div slot="content">
                        <fs-lottery v-if="lotteryFlag" :lotteryflag.sync="lotteryFlag"></fs-lottery>
                    </div>
                    <Tooltip placement="top" content="抽奖" :transfer="true">
                        <Button type="ghost"
                                shape="circle"
                                icon="happy-outline"></Button>
                    </Tooltip>
                </Poptip>
                </Col>
                <Col span="5" style="right: -13%">
                    <span style="font-weight: 700;">我在天马的第</span>
                    <span style="font-size: 24px;">{{this.$store.state.user.userInfo.days}}</span>
                    <span style="font-weight: 700;">天</span>
                </Col>
            </Row>
            <Modal title="修改头像" v-model="changeAvatorFlag" width="800">
                <div id="change-avator-block">
                    <div class="img-wrapper">
                        <div class="fs-square-img">
                            <img :src="avatorPath" style="border-radius: 50%;"/>
                        </div>
                    </div>
                    <p style="margin-top: 8px;font-weight: 700;">当前头像</p>
                    <fs-cropper-img @change-success="changeAvatorFlag = false"></fs-cropper-img>
                </div>
                <div slot="footer">
                    <Button type="ghost" @click="changeAvatorFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal id="rule-modal-new" v-model="showRuleModal" width="1200">
                <div slot="header" style="color:#495060;text-align:center;font-size: 18px;font-weight:bold;">
                    <span>制度</span>
                </div>
                <show-rule v-if="showRuleModal"></show-rule>
                <div slot="footer" class="footer">
                </div>
            </Modal>
        </Card>
        <Modal v-model="settingModalFlag"
               width="1000"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>我的档案</span>
            </p>
            <div class="" v-if="settingModalFlag">
                <Tabs type="card">
                    <TabPane label="基本信息">
                        <Form ref="baseForm" :label-width="100" inline style="font-size: 0px">
                            <FormItem label="姓名" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="20" v-model="baseForm.name"></Input>
                            </FormItem>
                            <FormItem label="性别" style="width:49%;margin-right:1%;">
                                <Input type="text" v-model="baseForm.sex" ></Input>
                            </FormItem>
                            <FormItem label="手机" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="11" v-model="baseForm.cellphone" ></Input>
                            </FormItem>
                            <FormItem label="QQ" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="20" v-model="baseForm.inphone" ></Input>
                            </FormItem>
                            <FormItem label="电子邮箱" style="width:49%;margin-right:1%;">
                                <Input type="text" v-model="baseForm.email" ></Input>
                            </FormItem>
                            <FormItem label="身份证号码" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="18" v-model="baseForm.idcard" ></Input>
                            </FormItem>
                            <FormItem label="出生日期" style="width:49%;margin-right:1%;">
                                <Input type="text" v-model="baseForm.birthday" disabled></Input>
                            </FormItem>
                            <FormItem label="籍贯" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="50" v-model="baseForm.origin"></Input>
                            </FormItem>
                            <FormItem label="入职时间" style="width:49%;margin-right:1%;">
                                <Input type="text" :maxlength="50" v-model="joinDates"></Input>
                            </FormItem>
                            <FormItem label="年龄" style="width:49%;margin-right:1%;">
                                <InputNumber :min="18" style="width: 100%" type="text" v-model="baseForm.nation"></InputNumber>
                            </FormItem>
                            <FormItem label="政治面貌" style="width:49%;margin-right:1%;">
                                <Select style="width: 100%" v-model="baseForm.party" >
                                    <Option value="党员">党员</Option>
                                    <Option value="预备党员">预备党员</Option>
                                    <Option value="入党积极分子">入党积极分子</Option>
                                    <Option value="团员">团员</Option>
                                    <Option value="群众">群众</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="婚姻状况" style="width:49%;margin-right:1%;">
                                <Select type="text" style="width: 100%" v-model="baseForm.marryage">
                                    <Option value="已婚">已婚</Option>
                                    <Option value="未婚">未婚</Option>
                                </Select>
                            </FormItem>
                            <!--<FormItem label="档案编号" style="width:49%;margin-right:1%;">-->
                            <!--<Input type="text" v-model="baseForm.filenum"></Input>-->
                            <!--</FormItem>-->
                            <FormItem label="详细住址" style="width:49%;margin-right:2%;">
                                <Input type="textarea" :maxlength="255" :autosize="{minRows: 3,maxRows: 5}" v-model="baseForm.address"></Input>
                            </FormItem>
                            <FormItem label="部门经历" style="width:49%;margin-right:1%;">
                                <Input type="textarea" :autosize="{minRows: 6,maxRows: 15}" v-model="baseForm.organizehistory"></Input>
                            </FormItem>
                            <FormItem label="岗位经历" style="width:49%;margin-right:1%;">
                                <Input type="textarea" :autosize="{minRows: 6,maxRows: 15}" v-model="baseForm.posthistory"></Input>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane label="教育状况">
                        <Form ref="educationForm" inline>
                            <div :key="'edu'+item.id" v-for="(item,index) in educationForm">
                                <FormItem label="时间" style="width:22%">
                                    <Input type="text" :maxlength="50" placeholder="2012.09 - 2016.06" v-model="item.workingtime" ></Input>
                                </FormItem>
                                <FormItem label="毕业院校" style="width:22%">
                                    <Input type="text" :maxlength="50" v-model="item.graduationschool" ></Input>
                                </FormItem>
                                <FormItem label="专业" style="width:22%">
                                    <Input type="text" :maxlength="20" v-model="item.profession" ></Input>
                                </FormItem>
                                <FormItem label="学历" style="width:22%">
                                    <Select type="text" v-model="item.education">
                                        <Option value="博士研究生">博士研究生</Option>
                                        <Option value="硕士研究生">硕士研究生</Option>
                                        <Option value="本科">本科</Option>
                                        <Option value="专科">专科</Option>
                                        <Option value="中专">中专</Option>
                                        <Option value="高中">高中</Option>
                                        <Option value="初中">初中</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="baseForm.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane label="工作经历">
                        <Form ref="workingForm" inline>
                            <div :key="item.id" v-for="(item,index) in workingForm">
                                <FormItem label="时间" style="width:12%">
                                    <Input type="text" placeholder="2012.09 - 2014.09" :maxlength="50" v-model="item.workingtime" ></Input>
                                </FormItem>
                                <FormItem label="单位" style="width:12%">
                                    <Input type="text" :maxlength="50"  v-model="item.employer" ></Input>
                                </FormItem>
                                <FormItem label="职务" style="width:12%">
                                    <Input type="text" :maxlength="20"  v-model="item.duties" ></Input>
                                </FormItem>
                                <FormItem label="月薪" style="width:12%">
                                    <Input style="width: 100%" :maxlength="20" type="text" v-model="item.monthlysalary" ></Input>
                                </FormItem>
                                <FormItem label="离职原因" style="width:12%">
                                    <Input type="text" :maxlength="50" v-model="item.reasonleaving"></Input>
                                </FormItem>
                                <FormItem label="证明人" style="width:12%">
                                    <Input type="text" :maxlength="10" v-model="item.witness"></Input>
                                </FormItem>
                                <FormItem label="公司号码" style="width:12%">
                                    <Input type="text" :maxlength="11" v-model="item.phone"></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="baseForm.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane label="奖惩记录">
                        <Form ref="rewardForm" inline>
                            <div :key="item.id" v-for="(item,index) in rewardForm" style="font-size: 0">
                                <FormItem label="时间" style="width:46%">
                                    <DatePicker style="width: 100%" type="date" v-model="item.rewarddate"></DatePicker>
                                </FormItem>
                                <FormItem label="类型" style="width:46%">
                                    <Select style="width: 100%" v-model="item.rewardtype" >
                                        <Option :value="0">奖励</Option>
                                        <Option :value="1">惩罚</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="奖惩原因" style="width:46%">
                                    <Input type="textarea" :maxlength="200" placeholder="奖励明细，尽量简短" v-model="item.rewardcontent"></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="baseForm.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane label="社会关系">
                        <Form ref="socailShipForm"  inline>
                            <div v-for="(item,index) in socailShipForm" :key="item.id">
                                <FormItem label="关系" style="width:13%">
                                    <Input type="text" :maxlength="20"  v-model="item.relationship" ></Input>
                                </FormItem>
                                <FormItem label="姓名" style="width:13%">
                                    <Input type="text" :maxlength="20"  v-model="item.name" ></Input>
                                </FormItem>
                                <FormItem label="年龄" style="width:13%">
                                    <InputNumber :min="10" :step="1" style="width: 100%" type="text" v-model="item.age" ></InputNumber>
                                </FormItem>
                                <FormItem label="工作单位" style="width:13%">
                                    <Input type="text" :maxlength="50" v-model="item.employer" ></Input>
                                </FormItem>
                                <FormItem label="职务" style="width:13%">
                                    <Input type="text" :maxlength="20" v-model="item.duties"></Input>
                                </FormItem>
                                <FormItem label="手机" style="width:13%">
                                    <Input type="text" :maxlength="11" v-model="item.phone"></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="baseForm.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                            </div>
                            <FormItem label="紧急联系人" style="width:30%">
                                <Input type="text" :maxlength="50" v-model="emergency.emergencycontact" ></Input>
                            </FormItem>
                            <FormItem label="联系人关系" style="width:30%">
                                <Input type="text" :maxlength="50" v-model="emergency.contactrelationship" ></Input>
                            </FormItem>
                            <FormItem label="联系人手机" style="width:30%">
                                <Input type="text" :maxlength="11" v-model="emergency.contactnumber" ></Input>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>
<style lang="less" scoped>
    @import "../home.less";
    @import "../../../styles/common.less";

    .level-block {
        width: 50px;
        margin-left: 6px;
    }

    #change-avator-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img-wrapper {
            width: 100px;
        }
    }
</style>
<script>
    import FsShowLevel from '@/baseComponents/fs-level-show'
    import fsCropperImg from '@/baseComponents/fs-cropper-img/fs-cropper-img'
    import ruleModal from '@/pages/rulesManager/newRule/ruleModal';
    import FsLottery from '@/baseComponents/lottery'
    import ShowRule from '../../rulesManager/components/show-rule';
    import moment from 'moment';

    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新的密码!'));
                } else {
                    if (this.passWordForm.newPwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.psdForm.validateField('newPwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新的密码!'));
                } else if (value !== this.passWordForm.newPwd) {
                    callback(new Error('两次输入的密码不匹配!'));
                } else {
                    callback();
                }
            };
            return {
                settingModalFlag: false,
                changeAvatorFlag: false,
                detailModal: false,
                showRuleModal: false,
                joinDates: '',
                rulesArr: [],
                pwsFlag: false,
                lotteryFlag: false,
                coinDescFlag: false,
                baseForm: {},
                rewardForm: [{
                    rewardcontent: '',
                    rewardtype: 0,
                    rewarddate: moment().format('YYYY-MM-DD')
                }],
                visible: false,
                imgsrc: '',
                fileList: [],
                educationForm: [
                    {
                        graduationtime: '',
                        graduationschool: '',
                        profession: '',
                        education: ''
                    }
                ],
                workingForm: [
                    {
                        workingtime: '',
                        employer: '',
                        duties: '',
                        monthlysalary: 500,
                        reasonleaving: '',
                        witness: ''
                    }
                ],
                socailShipForm: [],
                emergency: {
                    emergencycontact: '',
                    contactrelationship: '',
                    contactnumber: ''
                },
                tableLoading: true,
                filterOpt: {
                    name: '', // 员工姓名
                    rewardDate: [],
                    hasPunished: '',
                    hasReward: '',
                    monthDate: '', // 入职日期左区间
                    endmonthDate: '', // 入职日期右区间
                    kqstates: '1', // 在职状态
                    organizeId: '', // 部门名称
                    postId: '', // 岗位
                    xueli: '', // 学历
                    birthday: '', // 出生日期
                    sex: '',
                    marryage: '', //  婚否
                    party: '', // 政治面貌
                    company: '', // 工作单位
                    job: '', // 工作岗位
                    school: '', // 毕业院校
                    profession: '', // 专业
                    address: '', // 住址
                    reasonLeaving: '', // 离职原因
                    gradeLeaving: '' // 离职级别
                },

                passWordForm: {
                    oldPwd: '',
                    newPwd: '',
                    newPwdCheck: ''
                },
                passWordRule: {
                    oldPwd: [
                        {required: true, message: '原始密码不能为空!', trigger: 'blur'}
                    ],
                    newPwd: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    newPwdCheck: [
                        {required: true, validator: validatePassCheck, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
        },
        methods: {
            showRule() {
                this.$http.get('rugulations/MyList').then((res) => {
                    if (res.success) {
                        this.rulesArr = res.data;
                    }
                    this.detailModal = true;
                }, () => {
                    this.detailModal = true;
                })
            },
            _cancelResetPwd() {
                this.$refs.psdForm.resetFields();
                this.pwsFlag = false;
            },
            getUsersInfo(id) {
                let that = this;
                if (id === 0) {
                    return false;
                }
                let d = {};
                d.userId = id;
                this.$http.post('/employees/findEmployee', d).then((res) => {
                    if (res) {
                        this.baseForm = res;
                    }
                });
                console.log(this.$store.state.user.userInfo);
                this.joinDates = this.$store.state.user.userInfo.joindate;
                console.log(this.joinDates);
                // 社会关系
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 1}).then((res) => {
                    if (res.success) {
                        that.socailShipForm = res.data;
                        that.emergency.contactrelationship = res.emRelate;
                        that.emergency.emergencycontact = res.emPerson;
                        that.emergency.contactnumber = res.emPhone;
                    }
                });
                // 教育情况
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 2}).then((res) => {
                    if (res.success) {
                        that.educationForm = res.data;
                    }
                });
                // 工作经历
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 3}).then((res) => {
                    if (res.success) {
                        that.workingForm = res.data;
                    }
                });
                // 奖惩记录
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 4}).then((res) => {
                    if (res.success) {
                        that.rewardForm = res.data;
                    }
                });
                // 附件列表
                this.getTicketList(id);
            },
            getTicketList(id) {
                let that = this;
                this.$http.post('/ticket/ticketFileslist', {'ticketno': id}).then((res) => {
                    if (res.success) {
                        let d = res.data;
                        for (let i = 0; i < d.length; i++) {
                            d[i].file_path = d[i].file_path.replace('\\..', '\\oa');
                            if (d[i].file_path.indexOf('/oa') < 0) {
                                d[i].file_path = '/oa' + d[i].file_path;
                            }
                        }
                        that.fileList = res.data;
                    }
                });
            },
            cancel() {
                this.settingModalFlag = false;
                let d = this.educationForm;
                let d2 = this.workingForm;
                let d3 = this.rewardForm;
                let d4 = this.socailShipForm;
                // 删除自己新增的空数据
                // 教育经历
                for (let i = d.length - 1; i > 0; i--) {
                    if (!d[i].graduationtime && !d[i].education && !d[i].profession && !d[i].graduationschool) {
                        d.splice(i, 1);
                    }
                }
                // 工作经历
                for (let i = d2.length - 1; i > 0; i--) {
                    if (!d2[i].workingtime && !d2[i].employer && !d2[i].duties && !d[i].monthlysalary) {
                        d2.splice(i, 1);
                    }
                }
                // 奖惩记录
                for (let i = d3.length - 1; i > 0; i--) {
                    if (!d3[i].rewarddate && !d3[i].rewardtype && !d3[i].rewardcontent) {
                        d3.splice(i, 1);
                    }
                }
                // 社会关系
                for (let i = d4.length - 1; i > 0; i--) {
                    if (!d4[i].relationship && !d4[i].name) {
                        d4.splice(i, 1);
                    }
                }
            },
            openById() {
                this.getUsersInfo(this.$store.state.user.userInfo.id);
                this.settingModalFlag = true;
            },
            _submitChangePwd() {
                let vm = this;
                this.$refs.psdForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.oldPwd = this.passWordForm.oldPwd;
                        data.newPwd = this.passWordForm.newPwd;
                        data.newPwdCheck = this.passWordForm.newPwdCheck;
                        this.$http.post('/main/updatePwd', data).then((res) => {
                            if (res.success) {
                                this.$Modal.success({
                                    content: '密码重置成功,请重新登录!',
                                    okText: '重新登录',
                                    onOk: function () {
                                        vm.$store.commit('logout');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },
        computed: {
            avatorPath() {
                return this.$store.state.user.userInfo.headimagepath;
            },
            userName() {
                return this.$store.state.user.userInfo.realname;
            },
            organizeName() {
                return this.$store.state.user.userInfo.organizename;
            },
            companyName() {
                return this.$store.state.user.userInfo.companyname;
            },
            postName() {
                return this.$store.state.user.userInfo.postname;
            },
            tmCoin() {
                return this.$store.state.user.userInfo.tm_coin;
            }
        },
        components: {
            ShowRule,
            fsCropperImg,
            ruleModal,
            FsShowLevel,
            FsLottery
        }
    };
</script>
