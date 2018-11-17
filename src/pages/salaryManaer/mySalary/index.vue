<style>
    .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-column td{
        background-color: #D9EDF7;
        color: #000000;
    }
    .ivu-table .demo-table-info-cell-name td {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address  td{
        background-color: #187;
        color: #fff;
    }
</style>
<template>
    <div id="assetslocation">
        <Card>
        <Form ref="searchData" :model="addDepForm" inline :label-width="60">
            <FormItem label="月份">
                <DatePicker type="month"
                            placeholder="月份"
                            @on-change="_addDepMonthChange"
                            :value="addDepForm.month"></DatePicker>
            </FormItem>
            <!--<Button  v-if="showWarning" type="warning"  @click="_updateType(4)">打分有异议</Button>-->
            <!--<Button  v-if="showSuccess" type="success"  @click="_updateType(5)">确认无异议</Button>-->
            <!--<span v-if="showSuccess">总绩效：{{allScore}}</span>-->
        </Form>
        <Table border :columns="header.columns"
               :row-class-name="rowClassName"
               :loading="tableLoading"
               :height="tableHeight"
               :data="tableData.data"></Table>
        </Card>
    </div>
</template>

<script>
    import moment from 'moment';
    import pageMixin from '@/mixins/pageMixin';

    import 'vue-easytable/libs/themes-base/index.css';
    import {VTable, VPagination} from 'vue-easytable';
    import fsTablePage from '@/baseComponents/fs-table-page';
    const NOW_MONTH = moment().format('YYYY-MM');

    export default {
        name: 'mySalary',
        components: {
            VTable, VPagination, fsTablePage
        },
        data() {
            return {
                tableHeight: 720,
                filterOpt: {
                    name: ''
                },
                showWarning: false,
                showSuccess: false,
                allScore: [],
                addDepForm: {
                    month: NOW_MONTH,
                    organizeName: ''
                },
                positionList: [],
                baseInfo: {
                    name: '',
                    remarks: ''
                },
                rowColumn: {},
                header: {
                    id: '',
                    columns: [],
                    name: ''
                },
                tableData: {
                    data: []
                },
                params: '',
                changeInfoModal: false,
                tableLoading: false,
                pageData: {
                    list: [],
                    page: 1,
                    pageSize: 20,
                    totalCount: 0
                }

            };
        },

        mixins: [pageMixin],
        created () {
            this.getPositionList();
        },
        methods: {
            initPage() {
                this.pageData.page = 1;
            },
            rowClassName (row, index) {
                if (this.tableData.data[index].color === 1) {
                    return 'demo-table-info-column';
                }
                return '';
            },
            setPage(page) {
                this.pageData.page = page;
            },
            setPageSize(size) {
                this.pageData.pageSize = size;
            },
            getList(url, params) {
                this.tableLoading = true;
                let data = Object.assign({
                    page: this.pageData.page,
                    pageSize: this.pageData.pageSize
                }, params || {});
                this.$http.post(url, data).then((res) => {
                    if (res.success) {
                        this.detail(res.data);
                        this.pageData.totalCount = res.totalCount;
                        this.pageData.list = res.data.map(x => {
                            if (this.isExpend) {
                                x._expanded = false;
                            }
                            if (this.isSelection) {
                                x._checked = false;
                            }
                            return x;
                        });
                    }
                    this.tableLoading = false;
                }, () => {
                    this.tableLoading = false;
                })
            },
            getPositionList() {
                let data = {};
                data.time = this.addDepForm.month;
                this.$http.post('/perform/getMyAllList', data).then((res) => {
                    if (res.success) {
                        this.detail(res.data);
                        if(res.type >= 3 ) {
                            this.showWarning = true;
                            this.showSuccess = true;
                            this.allScore = res.score;
                        }
                    }
                });
            },
            _addDepMonthChange(date) {
                this.addDepForm.month = date;
                this._getAttendanceData();
            },
            _updateType(date) {
                let h = {};
                h.time = this.addDepForm.month;
                h.type = date;
                this.$http.post('/perform/comment', h).then((res) => {
                    if (res.success) {
                        this.$Message.success('反馈成功!');
                    }
                });
            },
            _getAttendanceData() {
                let data = {};
                data.time = this.addDepForm.month;
                this.getList('/perform/getMyAllList', data);
            },
            detail(data) {
                this.header.id = '';
                this.header.name = '';
                this.header.columns = [];
                this.tableData.data = [];
                let columnObj = {};
                let tableData = {};
                data.forEach((item, index) => {
                    console.log(item)
                    this.params = item;
                try {
                    columnObj = eval('(' + this.params.kv + ')');
                    tableData = eval('(' + this.params.values + ')');
                    tableData.score = item.score;
                    tableData.color = item.color;
                    tableData.target = item.target;
                    tableData.real = item.real;
                    tableData.remark = item.remark;
                } catch (e) {
                    this.$Message.error('数据格式不规范');
                }

                if (tableData === null) {
                    tableData = [];
                }
                    this.tableData.data.push(tableData);
                })
                this.header.id = this.params.id;
                this.header.name = this.params.name;
                for (let key in columnObj) {
                    this.header.columns.push({
                        'title': columnObj[key],
                        'key': key,
                        'align': 'center'
                    });
                }
                this.header.columns.push({
                    'title': '备注',
                    'key': 'remark',
                    'align': 'center'
                });
            }
        }
    };

</script>

<style scoped>

</style>
