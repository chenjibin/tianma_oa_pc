<template>
    <div class="#dep-grade">
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem label="问卷名称">
                        <Input type="text"
                               v-model="filterOpt.name.value"
                               placeholder="筛选考试"></Input>
                        </FormItem>
                        <FormItem label="答卷人名">
                            <Input type="text"
                                   v-model="filterOpt.userName.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem label="所属人员">
                            <Input type="text"
                                   v-model="filterOpt.realName.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   url="/examtest/depWenList"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{testPeople}}试卷详情</span>
            </p>
            <test-result :id="testCheckId"></test-result>
            <div slot="footer">
                <Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">
                    <span v-if="!exportLoading">导出试卷</span>
                    <span v-else>导出中...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import testResult from '../../examination/components/test-result';
    import utils from '@/libs/util.js';
    export default {
        name: 'depGrade',
        data () {
            return {
                modelFlag: false,
                tableHeight: 300,
                exportLoading: false,
                testPeople: '',
                testId: null,
                testCheckId: 0,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                postColumns: [
                    {
                        title: '问卷名称',
                        key: 'name',
                    },
                    {
                        title: '答卷人名',
                        key: 'stuname',
                        align: 'center',
                    },
                    {
                        title: '所属人员',
                        key: 'realname',
                        align: 'center',
                    },
                    {
                        title: '提交日期',
                        align: 'center',
                        key: 'createbydate',
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
                filterOpt: {
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    name: {
                        value: '',
                        type: 'input'
                    },
                    realName: {
                        value: '',
                        type: 'input'
                    },
                    organizeId: {
                        value: '',
                        type: 'tree'
                    }
                }
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
                data.id = this.testCheckId;
                data.pid = 1;
                this.$http.post('/examtest/exportPaperPdf', data).then((res) => {
                    if (res.success) {
                        utils.downloadFile('/oa/download/' + res.data, res.data);
                    }
                    this.exportLoading = false;
                }, () => {
                    this.exportLoading = false;
                })
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.testCheckId = data.id;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            fsDepTree,
            testResult
        }
    };
</script>
