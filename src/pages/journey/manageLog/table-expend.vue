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
                    <div class="">
                        <div class="" style="margin-top: 8px;">
                            <Poptip placement="left"
                                    v-model="visible"
                                    width="800">
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
