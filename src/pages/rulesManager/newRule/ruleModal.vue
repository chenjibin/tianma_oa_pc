<template>
    <Modal id="ruleModal" :value="showModal" :closable="canClose" @on-visible-change="changeMe" width="800">
        <div slot="header" style="color:#495060;text-align:center;font-size: 18px;font-weight:bold;">
            <span>规章制度</span>
            <span v-if="!canClose" style="position: absolute;top: 6px;right: 6px">
                <ButtonGroup>
                    <Button @click="changeType(2)" type="error">驳回</Button>
                    <Button @click="changeType(1)" type="success">通过</Button>
                </ButtonGroup>
            </span>
        </div>
        <Tabs :value="'notice-' + dataArr[0].id" v-if="dataArr.length">
            <TabPane style="overflow-x: hidden" v-for="item in dataArr" :label="item.orgname"
                     :name="'notice-' + item.id" :key="'notice-' + item.id">
                <div v-html="item.content"
                     style="margin: 0 auto;width: 790px;max-height:650px;overflow-y:auto;font-size: 16px"></div>
            </TabPane>
        </Tabs>
        <div slot="footer" class="footer">
        </div>
    </Modal>
</template>
<style lang="less">
    #ruleModal {
        .ivu-modal-header {
            border-bottom: none;
        }
        .ivu-modal-body {
            padding: 0 16px 16px 16px;
        }
        .ivu-modal-footer {
            display: none;
        }
    }
</style>
<script>
    export default {
        data() {
            return {};
        },
        props: {
            showModal: {
                type: Boolean,
                default: false
            },
            canClose: {
                type: Boolean,
                default: true
            },
            dataArr: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            changeMe(val) {
                this.$emit('update:showModal', val);
            },
            changeType(type) {
                if (this.dataArr.length <= 0) {
                    return;
                }
                let d = {};
                d.id = this.dataArr[0].id;
                d.states = type;
                this.$http.post('rugulations/updateStates', d).then((res) => {
                    this.$Message.success('审核成功！');
                    this.$emit('change', false);
                }, () => {
                    this.$emit('change', false);
                })
            }
        }
    };
</script>
