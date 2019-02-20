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
    <div id="approveSalary">
        <Col :span="4">
            <Card style="height: 819px;overflow: auto;" :style="{'height':(tableHeight + 138)+'px'}">
                <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                <el-tree :data="orgTreeData"
                         ref="treeDom"
                         :filter-node-method="filterNode"
                         :expand-on-click-node="false"
                         :highlight-current="true"
                         @node-click="_treeNodeClickHandler"
                         style="margin-top: 10px;"
                         :props="defaultProps"></el-tree>
            </Card>
        </Col>
        <Col :span="20">
        <Card>
            <Form inline :label-width="90">
                <FormItem label="月份">
                    <DatePicker type="month" placeholder="月份" @on-change="_addDepMonthChange"
                                :value="searchData.month.value"></DatePicker>
                </FormItem>
                <FormItem label="姓名">
                    <Input type="text" placeholder="姓名" v-model="searchData.name.value"></Input>
                </FormItem>
                <FormItem label="状态"  style="width: 240px">
                    <Select v-model="searchData.states.value"
                            clearable>
                        <Option :value="2">已打分</Option>
                        <Option :value="1">未打分</Option>
                        <Option :value="0"><span style="color: #ff8766;">未导入</span></Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="importModalFlag = true">
                    <Icon type="ios-cloud-download-outline"></Icon>
                    导入
                </Button>
                <Button type="ghost"  @click="uploadFeil">
                    <Icon type="ios-cloud-upload-outline"></Icon>
                    导出
                </Button>
            </Form>
            <fs-table-page :params="searchData" :columns="postColumns" :size="null" ref="paperList"
                           :height="tableHeight" url="/perform/getEmployee"></fs-table-page>
        </Card>
        </Col>
        <Modal v-model="markModal" :width="1300">
            <Table :height="600"
                   border :columns="markColumns"
                   :row-class-name="rowClassName"
                   :data="tableData"></Table>
            <div slot="footer">
                <Button type="text" @click="markModal = false">取消</Button>
                <Button type="primary" @click="saveScore">保存</Button>
            </div>
        </Modal>
        <Modal v-model="importModalFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>导入绩效表</span>
            </p>
            <Upload
                type="drag"
                :show-upload-list="false"
                :on-progress="_uploadProgress"
                :on-format-error="_uploadFormatErr"
                :on-success="_uploadSuccess"
                :on-error="_uploadFail"
                :format="uploadOpt.format"
                action="/oa/perform/importDe">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                </div>
                <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
            </Upload>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import fsTablePage from '@/baseComponents/fs-table-page';
    import utils from '@/libs/util'

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
                    states: {
                        value: '',
                        type: 'input'
                    },
                    month: {
                        value: NOW_MONTH,
                        type: 'select'
                    },
                    nodeId: {
                        value: 1,
                            type: 'tree'
                    },
                    orName: {
                        value: '',
                        type: 'input'
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
                spinShow: false,
                importModalFlag: false,
                orgTreeData: [],
                filterText: '',
                score: [],
                markModal: false,
                tableHeight: 720,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                uploadOpt: {
                    format: ['xls']
                },
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
                                text = '未导入';
                                color = 'blue';
                            }
                            if (type == 1) {
                                text = '未打分';
                                color = 'orange';
                            }
                            if (type == 2) {
                                text = '已打分';
                                color = 'yellow';
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
        created() {
            this._getOrgTree();
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
            uploadFeil() {
                utils.downloadFile('/oa/down/' + this.searchData.name.value + this.searchData.month.value + '.xls', this.searchData.name.value + this.searchData.month.value + '.xls')
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            rowClassName (row, index) {
                // if (this.tableData.data[index].color === 1) {
                //     return 'demo-table-info-column';
                // }
                return '';
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
            _treeNodeClickHandler(data) {
                this.searchData.nodeId.value = data.id;
                this.searchData.orName.value = data.name;
            },
            _getOrgTree() {
                // 同一个接口调用两次是因为左侧的树和下拉输入框是同一个接口，存在不合理的地方
                // 为未来分割独立保留一个方法
                return new Promise((resolve) => {
                    this.$http.get('/organize/userSalaryOrganizeTree?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            this.searchData.nodeId.value = res.data[0].id;
                            this.searchData.orName.value = res.data[0].name;
                            resolve(res.data[0].id);
                        }
                    });
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
