<template>
    <div class="show-rule-component">
        <Tabs value="company">
            <TabPane label="所在公司" name="company">
                <div class="tab-inner">
                    <div class="left">
                        <ul class="item-list">
                            <li v-for="(item,index) in companyRule"
                                :key="'company-' + item.id"
                                :class="{'active': index === companyIndex}"
                                @click.stop="_checkCompanyContent(item,index)"
                                class="item">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="content" v-html="companyContent">
                    </div>
                </div>
            </TabPane>
            <TabPane label="所在部门" name="department">
                <div class="tab-inner">
                    <div class="left">
                        <ul class="item-list">
                            <li v-for="item in departmentRule"
                                :key="'department-' + item.id"
                                :class="{'active': index === departmentIndex}"
                                @click.stop="_checkDepContent(item,index)"
                                class="item">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="content" v-html="departmentContent">
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>
<style lang="less">
    .show-rule-component {
        .tab-inner {
            display: flex;
            .left {
                flex: 0 0 360px;
                width: 360px;
                height: 650px;
                overflow: auto;
                .item-list {
                    padding: 8px;
                    .item {
                        padding: 6px 0;
                        font-size: 14px;
                        cursor: pointer;
                        transition: color 0.2s ease-in;
                        &.active {
                            color: #57a3f3;
                        }
                        &:hover {
                            color: #57a3f3;
                        }
                        &:not(:last-child) {
                            /*border-bottom: 1px solid #ddd;*/
                        }
                    }
                }
            }
            .content {
                flex: 1;
                height: 650px;
                overflow: auto;
            }
        }
    }

</style>
<script>
    export default {
        name: 'ShowRule',
        data() {
            return {
                companyRule: [],
                departmentRule: [],
                companyContent: '',
                departmentContent: '',
                companyIndex: 0,
                departmentIndex: 0
            }
        },
        created() {
            this._getRuleList()
        },
        methods: {
            _checkCompanyContent(data, index) {
                this.companyIndex = index
                this.companyContent = data.content
            },
            _checkDepContent(data, index) {
                this.departmentIndex = index
                this.departmentContent = data.content
            },
            _getRuleList() {
                this.$http.get('rugulations/MyList').then((res) => {
                    if (res.success) {
                        const data = res.data
                        this.companyRule = data.data1
                        this.companyContent = data.data1[0] ? data.data1[0].content : ''
                        this.departmentRule = data.data2
                        this.departmentContent = data.data2[0] ? data.data2[0].content : ''
                    }
                })
            }
        },
        components: {}
    }
</script>
