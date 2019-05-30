<template>
    <div id="approveSalary">
        <Col :span="4">
            <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                         @node-change="_nodeChangeHandler($event)"
                         :defaultProps="defaultProps"></fs-dep-tree>
        </Col>
        <Col :span="20">
            <Card>
                <Form inline :label-width="90">
                    <FormItem label="月份">
                        <DatePicker type="month" placeholder="月份" :editable="false"
                                    @on-change="filterOpt.month.value = $event"
                                    :value="filterOpt.month.value" ></DatePicker>
                    </FormItem>
                    <FormItem label="姓名">
                        <Input type="text" placeholder="姓名" clearable v-model="filterOpt.name.value" ></Input>
                    </FormItem>
                    <FormItem label="状态"  style="width: 240px">
                        <Select v-model="filterOpt.status.value" clearable>
                            <Option :value="0"><span style="color: #ff8766;">未导入</span></Option>
                            <Option :value="1">已导入</Option>
                        </Select>
                    </FormItem>
                    <Button type="primary" @click="showPerLine">部门年度绩效</Button>
                    <Button type="warning" @click="importModalFlag = true">
                        <Icon type="ios-cloud-download-outline"></Icon>导入绩效</Button>
                    <!--                <Button type="ghost"  @click="uploadFeil">-->
                    <!--                    <Icon type="ios-cloud-upload-outline"></Icon>-->
                    <!--                    导出-->
                    <!--                </Button>-->
                </Form>
                <fs-table-page :params="filterOpt" :columns="postColumns" :size="null" ref="paperList"
                               :height="tableHeight" url="/perform/queryDepPer"></fs-table-page>
            </Card>
        </Col>
        <!--导入绩效 model-->
        <Modal v-model="importModalFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>导入绩效表</span>
            </p>
            <Button type="success"
                    style="margin-bottom: 10px;"
                    @click="_downloadMuban">
                <Icon type="ios-cloud-download-outline"></Icon>
                下载模板
            </Button><br>
            <span style="color: red;">请选择导入月份</span>:
            <DatePicker type="month" placeholder="月份" style="margin-bottom: 15px" :editable="false"
                        @on-change="uploadData.month = $event" :value="uploadData.month"></DatePicker>
            <Upload
                type="drag"
                :show-upload-list="false"
                :on-progress="_uploadProgress"
                :data="uploadData"
                :on-format-error="_uploadFormatErr"
                :on-success="_uploadSuccess"
                :on-error="_uploadFail"
                :format="uploadOpt.format"
                action="/oa/perform/importPerData">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
            </Upload>
            <div slot="footer">
                <Button type="primary" @click="importModalFlag = false">取消</Button>
            </div>
        </Modal>
        // 绩效详情查看 model
        <Modal v-model="flag_model" width="1600" style="margin-top: 50px" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{per_month}} — {{per_stu}} — 绩效打分详情</span>
            </p>
            <Table  :height="tableHeight" :loading="loading" :columns="columns" :data="tableData"></Table>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="flag_model = false">取消</Button>
            </div>
        </Modal>
        <!-- 年度绩效 model-->
        <Modal v-model="flag_per" width="1400" style="margin-top: 50px" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{per_year}} — {{organizeName}} — {{postName}} — 年度折线图</span>
            </p>
            年度：<DatePicker type="year"
                        clearable
                        placeholder="筛选年份"
                        :editable="false"
                        @on-change="queryPerLineList($event)"
                        :value="per_year"></DatePicker>
<!--            岗位：-->
<!--            <Select v-model="postName"  filterable style="width: 200px" clearable>-->
<!--                <Option :value="item.id" v-for="(item, index) in postList" :key="index">{{item.name}}</Option>-->
<!--            </Select>-->
            <div  style="width:1200px;height:500px;" id="data_source_dep"></div>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="flag_per = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import utils from '@/libs/util'
    import echarts from 'echarts';

    const NOW_MONTH = moment().format('YYYY-MM');
    const NOW_YEAR = moment().format('YYYY');
    export default {
        name: 'approveSalary',
        components: {
            fsTablePage,
            fsDepTree
        },
        data() {
            return {
                spinShow: false,
                flag_per: false,
                per_month: '',
                per_stu: '',
                per_year: NOW_YEAR,
                flag_model: false,
                loading: false,
                tableData: [],
                // 导入绩效选择月份
                uploadData: {
                    month: NOW_MONTH
                },
                filterOpt: {
                    month: {
                        value: NOW_MONTH,
                        type: 'select'
                    },
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: '',
                        type: 'input'
                    },
                    organizeId: {
                        value: 1,
                        type: 'tree'
                    }
                },
                importModalFlag: false,
                tableHeight: 720,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                uploadOpt: {
                    format: ['xls']
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
                // 主列表项
                postColumns: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'realname'
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
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
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createbydate',
                        render: (h, params) => {
                            if (null != params.row.createbydate) {
                                return h('span', moment(params.row.createByDate).format('YYYY-MM-DD'));
                            } else {
                                return h('span', {}, '');
                            }
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
                            if (null == params.row.per_date) {
                                return h('span', {style: {color: '#ed3f14'}}, '未导入');
                            } else {
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
                    }
                ],

                organizeName: '',
                postName: '',
                postList: [],
                // 折线图示例数据
                dataSourcePie: null,
                option: {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['基本绩效', '奖金绩效']
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
            // 左侧栏部门
            _nodeChangeHandler(node) {
                // console.log(node)
                this.filterOpt.organizeId.value = node.id;
                this.organizeName = node.text;
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('数据导入成功!');
                    this.importModalFlag = false;
                    this._getOrgTree();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _uploadFail(error, file, fileList) {
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            // 下载导入模版
            _downloadMuban() {
                utils.downloadFile('/oa/down/perAppModel.xls', '批量上传绩效模板.xls');
            },
            // 打开绩效详情
            _showPer(data) {
                this.per_month = data.per_date;
                this.per_stu = data.realname;
                this._queryPerInfo(data);
                this.flag_model = true;
            },
            // 查询绩效详情
            _queryPerInfo(data) {
                this.loading = true;
                let sendData = {};
                sendData.userId = data.id;
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
                var vm = this;
                var organizeId = vm.filterOpt.organizeId.value
                if (0 === organizeId || 1 === organizeId || 133 === organizeId || 285 === organizeId || 9999 === organizeId) {
                    vm.$Message.error('请选择有效部门');
                    return;
                }
                // // 根据部门查询所有岗位
                // let sendData = {};
                // sendData.organizeId = organizeId;
                // this.$http.post('/perform/queryPost', sendData).then((res) => {
                //     if (res.success) {
                //         this.postList = res.data;
                //     } else {
                //         this.postList = [];
                //     }
                // });
                this.queryPerLineList(this.per_year);
                this.flag_per = true;
            },
            // 根据年份获取绩效折线图数据
            queryPerLineList(per_year) {
                var vm = this;
                let sendData = {};
                sendData.organizeId = this.filterOpt.organizeId.value;
                sendData.per_year = per_year;
                this.$http.post('/perform/queryDepYearList', sendData).then((res) => {
                    if (res.success) {
                        vm.option.series[0].data = res.data.arr1;
                        vm.option.series[1].data = res.data.arr2;
                    } else {
                        vm.option.series[0].data = [];
                        vm.option.series[1].data = [];
                    }
                    vm.dataSourcePie.setOption(vm.option)
                });
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.dataSourcePie = echarts.init(document.getElementById('data_source_dep'));
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
