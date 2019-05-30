<template>
    <div id="assetslocation">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="月份">
                    <DatePicker type="month"
                                clearable
                                placeholder="筛选月份"
                                :editable="false"
                                @on-change="filterOpt.month.value = $event"
                                :value="filterOpt.month.value"></DatePicker>
                </FormItem>
                <Button type="primary" @click="showPerLine">年度绩效</Button>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="perTable"
                           url="/perform/queryMyPerList"></fs-table-page>
        </Card>
        <!--绩效详情查看 model-->//
        <Modal v-model="flag_model" width="1600" style="margin-top: 50px" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{per_month}}——绩效打分详情</span>
            </p>
            <Table  :height="tableHeight" :loading="loading" :columns="columns" :data="tableData"></Table>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="flag_model = false">取消</Button>
            </div>
        </Modal>
        <!-- 年度绩效 model-->
        <Modal v-model="flag_per" width="1400" style="margin-top: 50px" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{per_year}}——年度折线图</span>
            </p>
            <DatePicker type="year"
                        clearable
                        placeholder="筛选年份"
                        :editable="false"
                        @on-change="queryPerLineList($event)"
                        :value="per_year"></DatePicker>
            <div  style="width:1200px;height:500px;" id="data_source_per"></div>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="flag_per = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import echarts from 'echarts';
    import moment from 'moment';

    const NOW_YEAR = moment().format('YYYY');
    export default {
        name: 'mySalary',

        data() {
            return {
                tableHeight: 720,
                flag_model: false,
                flag_per: false,
                per_month: '',
                per_year: NOW_YEAR,
                loading: false,
                tableData: [],
                dataSourcePie: null,
                // 筛选参数
                filterOpt: {
                    month: {
                        value: '',
                        type: 'date'
                    }
                },
                // 绩效详情表格列
                columns: [
                    {
                        title: '分类',
                        align: 'center',
                        key: 'type',
                        width: 200,
                        className: 'demo-table-info-column3'
                    },
                    {
                        title: '考核指标',
                        align: 'left',
                        key: 'target',
                        width: 220
                    },
                    {
                        title: '指标说明',
                        align: 'left',
                        key: 'explain',
                        width: 500
                    },
                    {
                        title: '打分标准',
                        align: 'left',
                        key: 'standard'
                    },
                    {
                        title: '占比',
                        align: 'center',
                        key: 'proportion',
                        width: 100,
                        className: 'demo-table-info-column2',
                        render: (h, params) => {
                            if (null != params.row.proportion) {
                                return h('span', params.row.proportion + '%');
                            } else {
                                return h('span', {}, '');
                            }
                        }
                    },
                    {
                        title: '得分',
                        align: 'center',
                        key: 'score',
                        width: 100,
                        className: 'demo-table-info-column1'
                    }
                ],
                // 绩效列表格列
                postColumns: [
                    {
                        title: '月份',
                        align: 'center',
                        key: 'per_date'
                    },
                    {
                        title: '占比总分',
                        align: 'center',
                        key: 'total_proportion'
                    },
                    {
                        title: '绩效得分',
                        align: 'center',
                        key: 'total_score'
                    },
                    // {
                    //     title: '奖金绩效',
                    //     align: 'center',
                    //     key: 'total_score'
                    // },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createByDate',
                        render: (h, params) => {
                            return h('span', moment(params.row.createByDate).format('YYYY-MM-DD'));
                        }
                    },
                    // {
                    //     title: '备注',
                    //     align: 'center',
                    //     key: 'remarks'
                    // },
                    {
                        title: '查看详情',
                        align: 'center',
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
                                                vm._showPer(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                // 折线图示例数据
                option: {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['基本绩效','奖金绩效']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'基本绩效',
                            type:'line',
                            data:[],
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name:'奖金绩效',
                            type:'line',
                            data:[],
                            markPoint : {
                                data : [
                                    // {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name : '平均值'}
                                ]
                            }
                        }
                    ]
                }

            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            // 设置表格高度
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            // 打开绩效详情
            _showPer(data) {
                this.per_month = data.per_date;
                this._queryPerInfo(data);
                this.flag_model = true;
            },
            // 查询绩效详情
            _queryPerInfo(data) {
                this.loading = true;
                let sendData = {};
                sendData.userId = data.userid;
                sendData.per_record_id = data.per_record_id;
                sendData.total_proportion = data.total_proportion;
                sendData.total_score = data.total_score;
                this.$http.post('/perform/queryPerInfo', sendData).then((res) => {
                    if (res.success) {
                        this.tableData = res.data;
                    } else {
                        this.tableData = [];
                    }
                    this.loading = false;
                });
            },
            // 绩效折线图
            showPerLine() {
                this.queryPerLineList(this.per_year);
                this.flag_per = true;
            },
            // 根据年份获取绩效折线图数据
            queryPerLineList(data) {
                var vm = this;
                this.per_year = data;
                let sendData = {};
                sendData.year = data;
                this.$http.post('/perform/queryMyYearList', sendData).then((res) => {
                    if (res.success) {
                        this.option.series[0].data = res.data.arr1;
                        this.option.series[1].data = res.data.arr2;
                    } else {
                        this.option.series[0].data = [];
                        this.option.series[1].data = [];
                    }
                    vm.dataSourcePie.setOption(vm.option)
                });
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.dataSourcePie = echarts.init(document.getElementById('data_source_per'));
                this.dataSourcePie.setOption(this.option);
                window.addEventListener('resize', function () {
                    this.dataSourcePie.resize();
                });
            });
        },
        beforeDestroy() {
            if (!this.dataSourcePie) { return }
            this.dataSourcePie.dispose();
            this.dataSourcePie = null;
        },
        components: {
            fsTablePage
        }
    };

</script>

<style>
    .ivu-table td.demo-table-info-column1{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column2{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column3{
        background-color: #187;
        color: #fff;
    }
</style>
