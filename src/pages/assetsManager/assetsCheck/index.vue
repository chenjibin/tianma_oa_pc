<template>
    <!--资产盘点管理-->
    <div id="assetsCheck">
        <Card>
            <Form inline :label-width="50">
                <FormItem label="位置">
                    <Select type="text" style="width: 180px" clearable
                            v-model="filterOpt.positionName.value"
                            placeholder="位置名称">
                        <Option v-for="(item, index) in positionList" :key="index" :value="item.name">
                            <span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt.status.value">
                        <Option :value="0">开仓</Option>
                        <Option :value="1">关仓</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <Button type="primary" class="cusBtn" @click="_exportShow" >导出数据</Button>
                </FormItem>
            </Form>
            <fs-table-page :params="filterOpt" :columns="postColumns"
                           :height="tableHeight" url="/assetsRegister/queryCherkRecordList"></fs-table-page>
        </Card>
        <!-- 位置盘点详情 model-->
        <Modal v-model="infoModel" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{positionName}}—— 盘点详情 </span>
            </p>
            <Form inline :label-width="50">
                <FormItem label="状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt_info.status.value">
                         <!--'状态: 0.待盘点 1.正常 2.新增'-->
                        <Option :value="0">待盘点</Option>
                        <Option :value="1">正常</Option>
                        <Option :value="2">新增</Option>
                    </Select>
                </FormItem>
            </Form>
            <fs-table-page :params="filterOpt_info" :columns="postColumns_info"
                           :height="600" url="/assetsRegister/queryCheckAppList"></fs-table-page>
            <div slot="footer">
            </div>
        </Modal>
        <!-- 导出 model-->
        <Modal v-model="exportModel" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>导出所选位置盘点详情</span>
            </p>
            <Form inline :label-width="80">
                <FormItem label="关仓位置">
                    <Select type="text" style="width: 450px" multiple
                            v-model="export_postionArr"
                            placeholder="位置名称">
                        <Option v-for="(item, index_e) in export_positionList" :key="index_e" :value="item.name">
                            <span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:200px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="exportLoading" @click="_exportDataList">
                    <span v-if="!exportLoading">确认导出</span>
                    <span v-else>正在导出...</span>
                </Button>
                <Button  @click="exportModel = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsCheck',
        components: {
            fsTablePage
        },
        data() {
            return {
                tableHeight: 500,
                infoModel: false,
                exportModel: false,
                exportLoading: false,
                positionName: '',
                export_postionArr: [],
                export_positionList: [],
                positionList: [],
                filterOpt: {
                    positionName: {
                        value: '',
                        type: 'select'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    }
                },
                filterOpt_info: {
                    positionName: {
                        value: '',
                        type: 'select'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    }
                },
                // 主列表项
                postColumns: [
                    {
                        title: '资产位置',
                        align: 'center',
                        key: 'positionname'
                    },
                    {
                        title: '位置别名',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            // 0 在途 1 在用 2备用 3报废
                            let status = params.row.status;
                            let color = ['red','green'];
                            let text = ['开仓', '关仓'];
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                }
                            }, text[status]);
                        }
                    },
                    {
                        title: '盘点原总条数',
                        align: 'center',
                        key: 'total'
                    },
                    {
                        title: '盘点新总条数',
                        align: 'center',
                        key: 'totalcount'
                    },
                    {
                        title: '新增总条数',
                        align: 'center',
                        key: 'newcount'
                    },
                    {
                        title: '正常总条数',
                        align: 'center',
                        key: 'normalcount'
                    },
                    {
                        title: '未盘点总条数',
                        align: 'center',
                        key: 'defectcount'
                    },
                    {
                        title: '添加人',
                        align: 'center',
                        key: 'createbyname'
                    },
                    {
                        title: '添加日期',
                        align: 'center',
                        key: 'createbydate'
                    },
                    {
                        title: '修改人',
                        align: 'center',
                        key: 'modifybyname'
                    },
                    {
                        title: '修改日期',
                        align: 'center',
                        key: 'modifybydate'
                    },
                    {
                        title: '查看详情',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '单机查看详情',
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
                                                vm._showInfo(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                // 盘点详情列表项
                postColumns_info: [
                    {
                        title: '资产位置',
                        align: 'center',
                        key: 'positionname'
                    },
                    {
                        title: '资产名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '资产状态',
                        align: 'center',
                        key: 'appstatus',
                        render: (h, params) => {
                            // 0 在途 1 在用 2备用 3报废
                            let status = params.row.appstatus;
                            let color = ['blue', 'green', 'orange', 'red'];
                            let text = ['在途', '在用', '备用', '报废'];
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                }
                            }, text[status]);
                        }
                    },
                    {
                        title: '二维码',
                        align: 'center',
                        key: 'bar_code'
                    },
                    {
                        title: '盘点状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            // '状态: 0.待盘点 1.正常 2.新增'
                            let status = params.row.status;
                            let color = ['blue', 'green', 'orange'];
                            let text = ['待盘点', '正常', '新增'];
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                }
                            }, text[status]);
                        }
                    },
                    {
                        title: '添加日期',
                        align: 'center',
                        key: 'createbydate'
                    },
                    {
                        title: '修改日期',
                        align: 'center',
                        key: 'modifybydate'
                    }
                ]
            }
        },
        created() {
            this._getPositionList();
            this._setTableHeight();
        },
        methods: {
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 34 - 57 - 49;
            },
            // 获取盘点记录位置数据
            _getPositionList() {
                this.$http.post('assetsRegister/getCheckPositionList').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
                });
            },
            // 获取关仓位置
            _getExportPositionList() {
                this.$http.post('assetsRegister/getCheckPositionList?status=1').then((res) => {
                    if (res.success) {
                        this.export_positionList = res.data;
                    }
                });
            },
            // 打开详细列表
            _showInfo(data) {
                this.positionName = data.positionname + ' ' + data.name;
                this.filterOpt_info.positionName.value = data.positionname;
                this.infoModel = true;
            },
            // 打开导出框
            _exportShow() {
                this._getExportPositionList();
                this.export_postionArr = [];
                this.exportModel = true;
            },
            // 导出数据
            _exportDataList() {
                let sendData = {};
                this.exportLoading = true;
                sendData.positonArr = this.export_postionArr.join(',');
                this.$http.post('/assetsRegister/expore_dataList', sendData).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/down/' + res.data, res.data);
                        this.exportModel = false;
                    }
                    this.exportLoading = false;
                });
            },
            // 下载文件
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            }
        }
    }
</script>
