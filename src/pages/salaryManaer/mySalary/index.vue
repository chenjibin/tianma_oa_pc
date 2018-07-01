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

        </Form>
        <Table :loading="tableLoading"
               :height="tableHeight"
               :columns="header.columns"
               :data="tableData.data"
        ></Table>
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
                }).finally(() => {
                    this.tableLoading = false;
                });
            },
            getPositionList() {
                let data = {};
                data.time = this.addDepForm.month;
                this.$http.post('/perform/getMyAllList', data).then((res) => {
                    if (res.success) {
                        this.detail(res.data);

                    }
                });
            },
            _addDepMonthChange(date) {
                this.addDepForm.month = date;
                this._getAttendanceData();
            },
            _getAttendanceData() {
                let data = {};
                data.time = this.addDepForm.month;
                this.getList('/perform/getMyAllList', data);
            },
            detail(data) {
                this.tableData.data = [];
                var columnObj = {};
                var tableData = {};
                var tableData1 = {};
                data.forEach((item, index) => {
                    console.log(item)
                    let params = item;
                try {
                    columnObj = eval('(' + params.kv + ')');
                    tableData = eval('(' + params.values + ')');

                    tableData.score = item.score;
                } catch (e) {
                    this.$Message.error('数据格式不规范');
                }
                this.header.id = params.id;
                this.header.name = params.name;
                // this.tableData.key_id = params.id;
                    var ab= '';
                for (let key in columnObj) {
                    this.header.columns.push({
                        'title': columnObj[key],
                        'key': key,
                        'align': 'center'
                    });
                    ab = key;

                }
                    this.header.columns.push({
                        'title': '得分',
                        'key': 'score',
                        'align': 'center'
                    });
                if (tableData === null) {
                    tableData = [];
                }
                })


                this.tableData.data.push(tableData);
            }

        }
    };

</script>

<style scoped>

</style>
