<template>
    <div id="approveSalary">
        <Card>
            <Form inline :label-width="90">
                <FormItem label="月份">
                    <DatePicker type="month" placeholder="月份" @on-change="_addDepMonthChange"
                                :value="searchData.month.value"></DatePicker>
                </FormItem>
                <FormItem label="姓名">
                    <Input type="text" placeholder="姓名" v-model="searchData.name.value"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text" placeholder="部门" v-model="searchData.organizeName.value"></Input>
                </FormItem>
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                           :height="tableHeight" url="/perform/getEmployee"></fs-table-page>
        </Card>
        <Modal v-model="markModal" :width="1300">
            <Table :height="600"
                   :columns="markColumns"
                   :data="tableData"></Table>
            <div slot="footer">
                <template>
                    <Select v-model="model1" style="width:200px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </template>
                <Button type="text" @click="markModal = false">取消</Button>
                <Button type="primary" @click="saveScore">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import fsTablePage from '@/baseComponents/fs-table-page';

    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'approveSalary',
        components: {fsTablePage},
        data() {
            return {
                searchData: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    organizeName: {
                        value: '',
                        type: 'input'
                    },
                    month: {
                        value: NOW_MONTH,
                        type: 'select'
                    }
                },
                cityList: [
                    {
                        value: 1,
                        label: '指标已设置'
                    },
                    {
                        value: 2,
                        label: '待打分'
                    },
                    {
                        value: 3,
                        label: '已打分'
                    }
                ],
                model1: [],
                markColumns: [],
                tableData: [],
                score: [],
                markModal: false,
                tableHeight: 720,
                postColumns: [
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center'
                    },
                    {
                        title: '部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '分数',
                        key: 'score',
                        align: 'center'
                    },
                    {
                        title: '月度',
                        align: 'center',
                        minWidth: 100,
                        render: (h) => {
                            return h('span', this.searchData.month.value);
                        }
                    },
                    {
                        title: '操作',
                        width: 180,
                        render: (h, params) => {
                            let vm = this;
                            let type = params.row.type;
                            let text = '打分';
                            let color = 'green';
                            if (type == 0) {
                                text = '指标待设置';
                                color = 'blue';
                            }
                            if (type == 1) {
                                text = '指标已设置';
                                color = 'orange';
                            }
                            if (type == 2) {
                                text = '待打分';
                                color = 'purple';
                            }
                            if (type == 3) {
                                text = '已打分';
                                color = 'yellow';
                            }
                            if (type == 4) {
                                text = '有异议';
                                color = 'red';
                            }
                            if (type == 5) {
                                text = '无异议';
                                color = 'suntan';
                            }
                            let arr = [
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: color
                                    },
                                    attrs: {
                                        title: '考核'
                                    },
                                    nativeOn: {
                                        click: function () {
                                            vm.markUser(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }, text)
                            ];
                            return h('div', arr);
                        }
                    }]
            };
        },
        methods: {
            markUser(params) {
                let vm = this;
                let d = {};
                d.id = params.id;
                d.userid = params.id;
                d.time = this.searchData.month.value;
                this.tableData = [];
                this.markColumns = [];
                vm.score = [];
                this.$http.post('/perform/findUserKeyAndValues', d).then((res) => {
                    vm.$http.post('/perform/getUsersScoreArray', d).then((res2) => {
                        if (res2.success && res.success) {
                            vm.score = res2.data;
                            let data0 = res.data;
                            let records = data0.records;
                            if (records === null) {
                                this.$Message.info('指定月他没有被绑定绩效方案，请联系人事');
                                return;
                            }
                            let columnObj = eval('(' + records.kv + ')');
                            let val = eval('(' + records.val + ')');
                            if (val === null) {
                                this.$Message.info('指定月他绑定的绩效方案没有可打分项，请联系人事');
                                return;
                            }
                            // 打分不全,补全数组
                            let time = d.time;
                            if (vm.score.length < val.length) {
                                for (let i = 0; i < val.length; i++) {
                                    let obj = val[i];
                                    let flag = false;
                                    for (let j = 0; j < vm.score.length; j++) {
                                        if (obj.id === vm.score[j].valuesId) {
                                            flag = true;
                                            continue;
                                        }
                                    }
                                    if (!flag) {
                                        vm.score.push({id: '', time: time, score: 100, valuesId: obj.id, userId: d.id, userName: params.realName});
                                    }
                                }
                            }
                            for (let key in columnObj) {
                                vm.markColumns.push({
                                    'title': columnObj[key],
                                    'key': key,
                                    'align': 'center'
                                });
                            }

                            vm.markColumns.push({
                                'title': '目标值',
                                'align': 'center',
                                'width': 110,
                                render: (h, params) => {
                                    return h('Input', {
                                        props: {
                                            value: vm.score[params.index].target
                                        },
                                        style: {
                                            width: '100%'
                                        },
                                        on: {
                                            input: (val) => {
                                                vm.score[params.index].target = val;
                                            }
                                        }
                                    });
                                }
                            });
                            vm.markColumns.push({
                                'title': '实际值',
                                'align': 'center',
                                'width': 110,
                                render: (h, params) => {
                                    return h('Input', {
                                        props: {
                                            value: vm.score[params.index].real
                                        },
                                        style: {
                                            width: '100%'
                                        },
                                        on: {
                                            input: (val) => {
                                                vm.score[params.index].real = val;
                                            }
                                        }
                                    });
                            }
                            });
                            vm.markColumns.push({
                                'title': '分数',
                                'align': 'center',
                                'width': 110,
                                render: (h, params) => {
                                    return h('InputNumber', {
                                        props: {
                                            min: 0,
                                            max: 100,
                                            value: vm.score[params.index].score
                                        },
                                        style: {
                                            width: '100%'
                                        },
                                        on: {
                                            input: (val) => {
                                                vm.score[params.index].score = val;
                                            }
                                        }
                                    });
                                }
                            });
                            vm.markColumns.push({
                                'title': '备注',
                                'align': 'center',
                                'width': 300,
                                render: (h, params) => {
                                    console.log( vm.score[params.index]);
                                    return h('Input', {
                                        props: {
                                            value: vm.score[params.index].remark
                                        },
                                        style: {
                                            width: '100%'
                                        },
                                        on: {
                                            input: (val) => {
                                                vm.score[params.index].remark = val;
                                            }
                                        }
                                    });
                                }
                            });
                            for (let i = 0; i < val.length; i++) {
                                vm.tableData.push(val[i].values);
                            }
                            this.model1 = [];
                            vm.markModal = true;
                        }
                    });
                });
            },
            saveScore() {
                let pr = {};
                pr.scoreArr = JSON.stringify(this.score);
                pr.type = this.model1;
                this.$http.post('/perform/addUsersScoreArray', pr).then((res) => {
                    if (res.success) {
                        this.$Message.success('保存成功');
                        this.markModal = false;
                        this.$refs.paperList.getListData();
                    }
                });
            },
            _addDepMonthChange(date) {
                this.searchData.month.value = date;
            }
        }
    };
</script>

<style scoped>

</style>
