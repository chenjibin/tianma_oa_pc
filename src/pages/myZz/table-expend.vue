<template>
    <div>
        <Card :dis-hover="true">
            <Row :gutter="16">
                <Col :span="16">
                    <Row class="expand-row">
                        <Col span="24">
                        <template v-if="1 === 1">
                            <span class="expand-key" style="color:#19be6b;font-weight: 700;">成绩自评: </span>
                            <span class="expand-value" v-html="row.newcontent1"></span>
                        </template>
                        </Col>
                        <Col span="24">
                            <template v-if="1 === 1">
                                <span class="expand-key" style="color:#19be6b;font-weight: 700;">未来规划: </span>
                                <span class="expand-value">{{row.newcontent2}}</span>
                            </template>
                        </Col>
                        <Col span="24">
                            <span class="expand-key" style="font-weight: 700;">上班天数: </span>
                            <span class="expand-value">{{ row.workdays}}</span>
                            <span class="expand-key" style="font-weight: 700;">请假天数: </span>
                            <span class="expand-value">{{ row.leavedays}}</span>
                            <span class="expand-key" style="font-weight: 700;">迟到天数: </span>
                            <span class="expand-value">{{ row.latedays}}</span>
                            <span class="expand-key" style="font-weight: 700;">旷工天数: </span>
                            <span class="expand-value">{{ row.absenteeismdays}}</span>
                        </Col>
                        <Col span="24">
                            <template v-if="1 === 1">
                                <span class="expand-key" style="color:#19be6b;font-weight: 700;">部门负责人评语: </span>
                                <span class="expand-value">{{row.chargercontent1}}</span>
                            </template>
                        </Col>
                        <Col span="24">
                            <template v-if="1 === 1">
                                <span class="expand-key" style="color:#19be6b;font-weight: 700;">人事部意见: </span>
                                <span class="expand-value">{{row.leadercontent1}}</span>
                            </template>
                        </Col>
                    </Row>
                </Col>
                <Col :span="8">
                    <div style="color:#19be6b;font-weight: 700;">操作:</div>
                    <div class="">
                        <div class="" style="margin-top: 8px;">
                            <Poptip placement="left"
                                    v-model="visible"
                                    width="1000">
                                <Button  v-if="userName === row.waitusername && row.state !== 0" type="primary" size="small">立即审核</Button>
                                <Button  v-if="userName === row.waitusername && row.state === 0" type="primary" size="small">立即填写</Button>
                                <div class="" slot="content" >
                                    <Form :label-width="100"
                                          :model="odForm"
                                          ref="odFormFo"
                                          :rules="odFormRules">
                                            <FormItem label="部门上级" style="width:49%;margin-right:1%;" v-if="row.state === 0">
                                                <Select v-model="odForm.chargerId"
                                                        filterable
                                                        placeholder="选择部门负责人"
                                                        remote
                                                        style="width:40%"
                                                        :label="daoshilabel"
                                                        :remote-method="_filterPeopleRemote"
                                                        :loading="filterPeopleLoading">
                                                    <Option v-for="(option, index) in optionlist" :value="option.id" :key="option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
                                                </Select>
                                                <span class="expand-key" style="font-weight: 700;">是否缴纳公积金: </span>
                                                <Select v-model="odForm.accumulation"
                                                        style="width: auto"
                                                        placeholder="公积金缴纳将扣个人部分：184元 公积金不缴纳将补贴个人：100元 "
                                                        clearable>
                                                    <Option value="是">是</Option>
                                                    <Option value="否">否</Option>
                                                </Select>
                                            </FormItem>
                                            <!--<FormItem label="是否缴纳公积金" v-if="row.state === 0">-->
                                                <!--<Select v-model="odForm.accumulation"-->
                                                        <!--placeholder="公积金缴纳将扣个人部分：184元 公积金不缴纳将补贴个人：100元 "-->
                                                        <!--clearable>-->
                                                    <!--<Option value="是">是</Option>-->
                                                    <!--<Option value="否">否</Option>-->
                                                <!--</Select>-->
                                            <!--</FormItem>-->
                                        <FormItem label="工作成绩自评" prop="content" v-if="row.state === 0">
                                            <Input v-model="odForm.newContent1"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="可从工作的回顾、总结，对公司企业文化的认知、工作业绩、岗位适应性、个人能力等"></Input>
                                        </FormItem>
                                        <FormItem label="未来工作计划" prop="content" v-if="row.state === 0">
                                            <Input v-model="odForm.newContent2"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="1：你认为你需要怎么做，才能为天马的发展做出你的贡献。2.随着对天马以及自身工作岗位的熟悉，简单说下你的近期和长期的规划（包括你想从事的岗位或者未来的目标岗位）"></Input>
                                        </FormItem>
                                        <FormItem label="上班天数:"  style="font-weight: 700;" v-if="row.state === 0">
                                            <Input v-model="odForm.workDays"
                                                   type="Number" style="width: 10%"></Input>
                                            <span class="expand-key" style="font-weight: 700;">请假天数: </span>
                                            <Input v-model="odForm.leaveDays"
                                                   type="Number" style="width: 10%"></Input>
                                            <span class="expand-key" style="font-weight: 700;">迟到天数: </span>
                                            <Input v-model="odForm.lateDays"
                                                   type="Number" style="width: 10%"></Input>
                                            <span class="expand-key" style="font-weight: 700;">旷工天数: </span>
                                            <Input v-model="odForm.absenteeismDays"
                                                   type="Number" style="width: 10%"></Input>
                                        </FormItem>
                                        <FormItem label="本部门意见" prop="content" v-if="row.state === 1">
                                            <Input v-model="odForm.chargerContent1"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="对员工的评述、指导，指出是否给予转正的原因"></Input>
                                        </FormItem>
                                        <FormItem label="人事部意见" prop="content" v-if="row.state === 2">
                                            <Input v-model="odForm.leaderContent1"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="对员工的评述、指导，指出是否给予转正的原因"></Input>
                                        </FormItem>
                                        <FormItem label="是否同意其转正" v-if="row.state !== 0">
                                            <Select v-model="odForm.status"
                                                    style="width: 30%"
                                                    placeholder="公积金缴纳将扣个人部分：184元 公积金不缴纳将补贴个人：100元 "
                                                    clearable>
                                                <Option value="1">是</Option>
                                                <Option value="2">否</Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem>
                                            <Button :loading="btnLoading" type="primary" @click="_submitOdResult">提交</Button>
                                            <Button type="ghost" @click="visible = false" style="margin-left: 8px">取消</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Poptip>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    export default {
        props: {
            row: Object
        },
        data() {
            return {
                visible: false,
                visible2: false,
                btnLoading: false,
                filterPeopleLoading: false,
                optionlist: [],
                odChangeForm: {
                    content: this.row.content,
                    workDesc: this.row.workcontent
                },
                daoshilabel: '',
                odForm: {
                    status: 0,
                    newContent1: '',
                    newContent2: '',
                    chargerContent1: '',
                    leaderContent1: '',
                    accumulation: '',
                    workDays: 0,
                    leaveDays: 0,
                    lateDays: 0,
                    chargerId: '',
                    absenteeismDays: 0
                },
                odFormRules: {
                    content: [
                        {validator: this.validaContent, required: true, trigger: 'blur'}
                    ],
                    workDesc: [
                        {validator: this.validaWorkDesc, required: true, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
        },
        computed: {
            userName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        methods: {
            validaContent(rule, value, callback) {
                if (value === '') {
                    callback(new Error('备注留言不能为空!'));
                } else {
                    callback();
                }
            },
            validaWorkDesc(rule, value, callback) {
                if (value === '' && this.row.numberday >= 3 && this.odForm.agree === '同意') {
                    callback(new Error('排班说明不能为空!'));
                } else {
                    callback();
                }
            },
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.filterPeopleLoading = true;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        var d = res.data;
                        this.optionlist = d.map(item => {
                            return {
                                'label': item.realname,
                                'value': item.id,
                                'id': item.id,
                                'realname': item.realname,
                                'organizename': item.organizename
                            };
                        });
                    }
                    this.filterPeopleLoading = false;
                }, () => {
                    this.filterPeopleLoading = false;
                })
            },
            _submitOdChange() {
                this.$refs.odFormFoC.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.id = this.row.id;
                        data.content = this.odChangeForm.content;
                        data.workcontent = this.odChangeForm.workDesc;
                        this.btnLoading = true;
                        this.$http.post('/od/editContent', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this.$emit('op-success');
                            }
                            this.btnLoading = false;
                        }, () => {
                            this.btnLoading = false;
                        })
                    }
                });
            },
            _submitOdResult() {
                this.$refs.odFormFo.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data = this.odForm;
                        data.id = this.row.id;
                        this.btnLoading = true;
                        this.$http.post('/journey/setJourneyInfo', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this.$emit('op-success');
                            }
                            this.btnLoading = false;
                        }, () => {
                            this.btnLoading = false;
                        })
                    }
                });
            }
        }
    };
</script>
