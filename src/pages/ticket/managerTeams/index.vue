<template>
    <!--项目组管理页面-->
    <div id="managerTeams">
        <Card>
            <Form inline v-if="accessBtn.indexOf(35) > -1">
                <FormItem>
                    <Button type="primary" @click="_addTicketHandle" icon="md-add">
                        新增小组
                    </Button>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           ref="attendanceTable"
                           url="/workOrder/teamList"></fs-table-page>
        </Card>
        <Modal v-model="addModal" :width="500" @submit.native.prevent>
            <Form inline :label-width="80" style="margin-top: 30px">
                <FormItem label="项目组名称" style="width: 310px">
                    <Input v-model="team.name"></Input>
                </FormItem>
                <FormItem label="项目组组长" style="width: 310px">
                    <fs-search-user v-model="team.uid"
                                    :optionlist.sync="filterPeopleOpt"
                                    :clearable="true"
                                    :label="remoteLabel"></fs-search-user>
                </FormItem>
                <FormItem label="项目组组员" style="width: 310px;margin-bottom: 12px">
                    <Select v-model="team.childids"
                            multiple
                            filterable
                            transfer
                            :label="remoteLabel2"
                            :remote-method="_filterPeopleRemote2">
                        <Option v-for="option in filterPeopleOpt2"
                                :value="option.id"
                                :key="'user-' + option.id"
                                :label="option.realname">
                            {{option.realname + '(' + option.organizename + ')'}}
                        </Option>
                    </Select>
                </FormItem>
                <input v-model="team.id" style="display: none"/>
                <input v-model="team.type" style="display: none"/>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveTeam" long>确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsSearchUser from '@/baseComponents/fs-search-user';

    export default {
        name: 'managerTeams',
        components: {
            fsTablePage,
            fsSearchUser
        },
        data() {
            return {
                addModal: false,
                team: {
                    id: '',
                    name: '',
                    type: 0,
                    uid: 0,
                    childids: []
                },
                accessBtn: [],
                filterPeopleOpt: [],
                filterPeopleOpt2: [],
                remoteLabel: '',
                remoteLabel2: [],
                postColumns: [
                    {
                        title: '项目组名',
                        key: 'name'
                    },
                    {
                        title: '项目组长',
                        key: 'uname'
                    },
                    {
                        title: '建立日期',
                        key: 'add_time'
                    },
                    {
                        title: '小组成员',
                        render: (h, params) => {
                            let users = '';
                            params.row.childids.forEach((item) => {
                                users += item.uname + ' ';
                            });
                            if (users) {
                                return h('span', users);
                            } else {
                                return h('span', '未指派');
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        render: (h, params) => {
                            const vm = this;
                            const row = params.row;
                            return h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'md-create',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function (event) {
                                            event.stopPropagation()
                                            vm._editorOpen(row)
                                        }
                                    }
                                }
                            );
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        methods: {
            _initRemoeForm() {
                this.team.name = '';
                this.team.type = 0;
                this.team.uid = 0;
                this.team.childids = [];
                this.filterPeopleOpt = [];
                this.filterPeopleOpt2 = [];
                this.remoteLabel = '';
                this.remoteLabel2 = [];
                this.team.id = '';
            },
            _addTicketHandle() {
                this._initRemoeForm()
                this.addModal = true
            },
            _editorOpen(row) {
                this.addModal = true;
                this.team.name = row.name;
                this.remoteLabel = row.uname
                this.team.id = row.id;
                this.team.uid = row.uid
                this.filterPeopleOpt = [{id: row.uid, realname: row.uname, organizename: ''}]
                this.remoteLabel2 = row.childids.map(x => x.uname)
                this.team.childids = row.childids.map(x => x.uid)
                this.filterPeopleOpt2 = row.childids.map(x => {
                    let obj = {}
                    obj.id = x.uid
                    obj.realname = x.uname
                    obj.organizename = ''
                    return obj
                });
                console.log(this.team.childids)
            },
            saveTeam() {
                if (!this.team.name || !this.team.uid) {
                    this.$Message.error('未填写组名或负责人哦');
                    return false;
                }
                if (this.team.id && this.team.childids.length < 1) {
                    this.$Message.error('修改分组，组员不能为空');
                    return false;
                }
                let d = JSON.parse(JSON.stringify(this.team));
                d.childids = d.childids.join(',');
                this.$http.post('/workOrder/addProjectTeam', d).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功');
                        this._initRemoeForm()
                        this.$refs.attendanceTable.getListData()
                    }
                    this.addModal = false;
                }, () => {
                    this.addModal = false;
                })
            },
            _filterPeopleRemote2(val) {
                let data = {};
                data.name = val;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.filterPeopleOpt2 = res.data;
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        created() {
            console.log(this)
            this._setTableHeight();
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
        }
    };
</script>

<style scoped>

</style>
