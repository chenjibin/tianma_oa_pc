<template>
    <div class="system-info">
        <div class="content-block" style="margin-bottom: 6px">
            <Table height="254"
                   :columns="columns"
                   :data="pageData.list"
                   :loading="tableLoading"></Table>
        </div>
        <Page
            :total="pageData.totalCount"
            size="small"
            :page-size="pageData.pageSize"
            @on-change="pageChangeHandler"></Page>
    </div>
</template>
<style lang="less">
    .system-info {
        margin-left: 12px;
        h3 {
            font-size: 14px;
        }
        .list-wrapper {
            margin-top: 8px;
            padding: 8px 0;
            height: 220px;
            overflow: auto;
        }
        time {
            margin-right: 4px;
        }
        .content-block {
            position: relative;
        }
    }
</style>
<script>
    import pageMixin from '@/mixins/pageMixin';

    export default {
        name: 'systemInfo',
        mixins: [pageMixin],
        data() {
            return {
                columns: [
                    {
                        title: '系统消息',
                        render: (h, params) => {
                            let type = params.row.type;
                            let content = '';
                            let addtime = params.row.addtime;
                            let pcontent = params.row.content;
                            switch (type) {
                                case 2:
                                    content = `${addtime} 【${pcontent}】 对你的日志进行指导`;
                                    break;
                                case 3:
                                    content = `${addtime} 【${pcontent}】 查看了你的日志`;
                                    break;
                                case 5:
                                case 9:
                                    content = pcontent;
                            }
                            return h('span', content);
                        }
                    }
                ]
            };
        },
        created() {
            this._getSysInfo();
        },
        methods: {
            pageChangeHandler(page) {
                this.pageData.page = page;
                this._getSysInfo();
            },
            _getSysInfo() {
                this.loading = true;
                this.getList('/main/PersonalDynamic');
            }
        },
        components: {}
    };
</script>
