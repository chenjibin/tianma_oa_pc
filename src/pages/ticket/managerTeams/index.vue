<template>
    <!--项目组管理页面-->
    <div id="managerTeams">
        <Card>
            <Form inline v-if="accessBtn.indexOf(35) > -1">
                <FormItem>
                    <Button type="primary" @click="addModal = true">
                        <Icon type="plus-round"></Icon>
                        新增小组
                    </Button>
                </FormItem>
            </Form>
            <Table :columns="postColumns" ref="attendanceTable" :loading="tableLoading" :height="tableHeight" :data="pageData.list">
            </Table>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
        <Modal v-model="addModal" :width="360">
            <Form inline :label-width="80" style="margin-top: 30px">
                <FormItem label="项目组名称" style="width: 310px">
                    <Input v-model="team.name"></Input>
                </FormItem>
                <FormItem label="项目组组长" style="width: 310px" >
                    <Select v-model="team.uid"
                            filterable
                            remote
                            :label="remoteLabel"
                            :remote-method="_filterPeopleRemote">
                        <Option v-for="(option, index) in filterPeopleOpt" :value="option.id" :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="项目组组员" style="width: 310px;margin-bottom: 12px">
                    <Select v-model="team.childids"
                            multiple
                            filterable
                            remote
                            :label="remoteLabel2"
                            :remote-method="_filterPeopleRemote2">
                        <Option v-for="(option, index) in filterPeopleOpt2" :value="option.id" :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
                    </Select>
                </FormItem>
                <input v-model="team.id" style="display: none"/>
                <input v-model="team.type" style="display: none"/>
            </Form>
            <div slot="footer">
                <Button type="success" size="large" @click="saveTeam" long>确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import pageMixin from '@/mixins/pageMixin';
    export default {
        name: 'managerTeams',
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
              tableLoading: false,
              remoteLabel: [],
              remoteLabel2: [],
              filterOpt: {
                  name: '', // 员工姓名
                  monthDate: '', // 入职日期左区间
                  endmonthDate: '', // 入职日期右区间
                  kqstates: '1', // 在职状态
                  organizeId: '', // 部门名称
                  postId: '', // 岗位
                  xueli: '', // 学历
                  birthday: '', // 出生日期
                  sex: '',
                  marryage: '', //  婚否
                  party: '', // 政治面貌
                  company: '', // 工作单位
                  job: '', // 工作岗位
                  school: '', // 毕业院校
                  profession: '', // 专业
                  address: '', // 住址
                  reasonLeaving: '', // 离职原因
                  gradeLeaving: '' // 离职级别
              },
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
                          let vm = this;
                          let row = params.row;
                          return h('Button', {
                                  props: {
                                      type: 'primary',
                                      icon: 'edit',
                                      shape: 'circle'
                                  },
                                  on: {
                                      click: function () {
                                          vm.remoteLabel = [];
                                          vm.remoteLabel2 = [];
                                          vm.team.childids = [];
                                          vm.team.id = row.id;
                                          vm.team.name = row.name;
                                          vm.team.uname = row.uname;
                                          // 项目负责人
                                          vm.remoteLabel.push(row.uname);
                                          row.childids.forEach((item) => {
                                              vm.remoteLabel2.push(item.uname);
                                              vm.team.childids.push(item.uid);
                                          });
                                          vm.team.filterPeopleOpt = row.childids;
                                          vm.team.uid = row.uid;
                                          vm.addModal = true;
                                      }
                                  }
                              }
                          );
                      }
                  }
              ],
              tableList: [{id: 1, name: 'java项目组', type: 0, uid: 1324, uname: '张三', add_time: '2018-05-31 12:00:01'}, {id: 1, name: 'java项目组', type: 0, uid: 1324, uname: '王五', 'add_time': '2018-05-31 12:00:01'}],
              tableHeight: 500
          };
        },
        mixins: [pageMixin],
        methods: {
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
                        this.team.name = '';
                        this.team.type = 0;
                        this.team.uid = 0;
                        this.team.childids = [];
                        this.team.id = '';
                        this._filterResultHandler();
                    }
                }).finally((res2) => {
                    this.addModal = false;
                });
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            initPage() {
                this.pageData.page = 1;
            },
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.filterPeopleOpt = res.data;
                    }
                });
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
            },
            _getPostData() {
                this.getList('/workOrder/teamList');
            }
        },
        created() {
            this._setTableHeight();
            this._getPostData();
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
        }
    };
</script>

<style scoped>

</style>
