<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           clearable
                           v-model="filterOpt.name.value"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="筛选月份"
                                @on-change="filterOpt.startDate.value = $event"
                                :value="filterOpt.startDate.value"></DatePicker>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           v-model="filterOpt.dpname.value"
                           placeholder="筛选部门"></Input>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/statistics/logList"></fs-table-page>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'logTotal',
        data () {
            return {
                tableHeight: 300,
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    startDate: {
                        value: '',
                        type: 'date'
                    },
                    dpname: {
                        value: '',
                        type: 'date'
                    }
                },
                postColumns: [
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center'
                    },
                    {
                        title: '所在部门',
                        key: 'department',
                        align: 'center'
                    },
                    {
                        title: '当月已写日志',
                        key: 'number',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '统计月份',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '最近检索时间',
                        key: 'updatebydate',
                        align: 'center',
                        width: 180
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
