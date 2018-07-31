<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="考试名称">
                    <Input type="text"
                           v-model="filterOpt.paperName.value"
                           placeholder="筛选考试"></Input>
                </FormItem>
                <FormItem label="部门名称">
                    <Input type="text"
                           v-model="filterOpt.orgName.value"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="参考人">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选参考人"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">
                            <span v-if="!exportLoading">导出</span>
                            <span v-else>导出中...</span>
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/examtest/getScoreManageList"></fs-table-page>
        </Card>
        <Modal v-model="modelFlag" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{testPeople}}试卷详情</span>
            </p>
            <test-result :id="testCheckId"></test-result>
            <div slot="footer">
                <!--<Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">-->
                    <!--<span v-if="!exportLoading">导出试卷</span>-->
                    <!--<span v-else>导出中...</span>-->
                <!--</Button>-->
                <Button  style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import testResult from '../components/test-result';
    export default {
        name: 'gradeManage',
        data () {
            return {
                editorSettingFlag: false,
                modelFlag: false,
                btnLoading: false,
                postFormType: 'update',
                exportLoading: false,
                testCheckId: 0,
                filterOpt: {
                    paperName: {
                        value: '',
                        type: 'input'
                    },
                    orgName: {
                        value: '',
                        type: 'input'
                    },
                    name: {
                        value: '',
                        type: 'input'
                    }
                },
                postColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '部门名称',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '考试人',
                        key: 'stuname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时长(分钟)',
                        key: 'totletime',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '总分',
                        key: 'score',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '排名',
                        key: 'ranking',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '查看试卷',
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
                                            click: function() {
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                let filterOpt = this.filterOpt;
                data.paperName = filterOpt.paperName.value;
                data.orgName = filterOpt.orgName.value;
                data.name = filterOpt.name.value;
                this.$http.post('/examtest/export', data).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/upload/' + res.data, res.data);
                    }
                    this.exportLoading = false;
                }, () => {
                    this.exportLoading = false;
                })
            },
            _checkTest(data) {
                this.testCheckId = data.id;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage,
            testResult
        }
    };
</script>
