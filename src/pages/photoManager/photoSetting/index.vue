<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="是否首图">
                    <Select v-model="filterOpt.isShowpic.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="0">否</Option>
                        <Option :value="1">是</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="ghost" @click="_addArticleOpen">
                            <Icon type="plus-round"></Icon>
                            新建主题
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           :choosearray.sync="chooseDataArr"
                           ref="attendanceTable"
                           url="/share/getShareList"></fs-table-page>
            <Modal v-model="depSettingFlag"
                   :mask-closable="false"
                   width="1200">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{formType === 'create' ? '新增文章' : '修改文章'}}</span>
                </p>
                <Form :model="depSettingForm"
                      ref="articleForm"
                      @submit.native.prevent
                      v-if="depSettingFlag"
                      :rules="articleRules">
                    <Row :gutter="16">
                        <Col :span="6">
                        <FormItem prop="isCarousel" label="是否首页展示">
                            <i-switch v-model="depSettingForm.isCarousel" size="large" :true-value="1" :false-value="0">
                                <span slot="open">是</span>
                                <span slot="close">否</span>
                            </i-switch>
                        </FormItem>
                        <div class="" style="margin-bottom: 16px;">
                            <span>文章主图</span>
                        </div>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            v-show="formType === 'create'"
                            @click="_createArticle">新增主题</Button>
                    <Button type="primary"
                            @click="_updateArticle"
                            v-show="formType === 'update'">修改主题</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'photoSetting',
        data() {
            return {};
        },
        components: {}
    };
</script>
