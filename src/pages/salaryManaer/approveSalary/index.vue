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
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                           :height="tableHeight" url="/perform/getEmployee"></fs-table-page>
        </Card>
        <Modal v-model="markModal" :width="1100">
            <Table :height="600"
                   :columns="markColumns"
                   :data="tableData"
            ></Table>
            <div slot="footer">
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
                    month: {
                        value: moment().format('YYYY-MM'),
                        type: 'select'
                    }
                },
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
                        title: '月度',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', this.searchData.month.value);
                        }
                    },
                    {
                        title: '操作',
                        width: 180,
                        render: (h, params) => {
                            let vm = this;
                            let cnt = params.row.cnt;
                            let text = '打分';
                            let color = 'green';
                            if (cnt > 0) {
                                text = '查看';
                                color = 'blue';
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
                                this.$Message.info('指定月他没有被绑定绩效方案，请联系人事');
                                return;
                            }
                            // 打分不全,补全数组
                            debugger;
                            if (vm.score.length < val.length) {
                                let num = val.length - vm.score.length;
                                let time = d.time;
                                for (let i = 0; i < num; i++) {
                                    vm.score.push({id: '', time: time, score: 100, valuesId: '', userId: d.id, userName: params.realName});
                                }
                            }
                            let score = data0.score;
                            for (let key in columnObj) {
                                vm.markColumns.push({
                                    'title': columnObj[key],
                                    'key': key,
                                    'align': 'center'
                                });
                            }
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
                                                console.log(params.row);
                                                vm.score[params.index].valuesId = params.row.id;
                                            }
                                        }
                                    });
                                }
                            });
                            for (let i = 0; i < val.length; i++) {
                                vm.tableData.push(val[i].values);
                            }
                            vm.markModal = true;
                        }
                    });
                });
            },
            saveScore() {
                this.$http.post('/perform/addUsersScoreArray', {scoreArr: JSON.stringify(this.score)}).then((res) => {
                    if (res.success) {
                        this.$Message.success('保存成功');
                        this.markModal = false;
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
