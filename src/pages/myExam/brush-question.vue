<template>
    <div>
        <Button type="success" @click="shuaFormOpen">刷题</Button>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>创建刷题试卷</span>
            </p>
            <div class="">
                <Form :label-width="60">
                    <FormItem label="题型">
                        <Select v-model="type" multiple>
                            <Option :value="item.id" v-for="item in typeOption" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="试题平台">
                        <Select v-model="subject1" multiple>
                            <Option :value="item.id" v-for="item in pingOption" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="知识点">
                        <Select v-model="subject4" multiple>
                            <Option :value="item.id" v-for="item in postOption" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="试题类型">
                        <Select v-model="subject3" multiple>
                            <Option :value="item.id" v-for="item in nanOption" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                </Form>

            </div>
            <div slot="footer">
                <Button type="primary" :loading="exportLoading" @click="generateBrushPaper">
                    <span v-if="!exportLoading">创建试卷</span>
                    <span v-else>创建中...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag1" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>刷题试卷</span>
            </p>
            <div class="">
                <question-list v-if="modelFlag1" :list="questionList"></question-list>
            </div>
            <div slot="footer">
                <!--<Button type="primary" :loading="exportLoading" @click="generateBrushPaper">-->
                    <!--<span v-if="!exportLoading">创建试卷</span>-->
                    <!--<span v-else>创建中...</span>-->
                <!--</Button>-->
                <!--<Button type="ghost" style="margin-left: 8px" @click="modelFlag1 = false">取消</Button>-->
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import questionList from './question-list'
    export default {
        name: 'brushQuestion',
        data() {
            return {
                modelFlag: false,
                modelFlag1: false,
                exportLoading: false,
                pingOption: [],
                postOption: [],
                nanOption: [],
                typeOption: [
                    {
                        id: 1,
                        name: '单选'
                    },
                    {
                        id: 2,
                        name: '多选'
                    },
                    {
                        id: 3,
                        name: '判断题'
                    },
                    {
                        id: 4,
                        name: '填空题'
                    },
                    {
                        id: 5,
                        name: '问答题'
                    }
                ],
                subject1: [],
                subject2: [],
                subject3: [],
                subject4: [],
                type: [],
                questionList: []
            }
        },
        created() {
            this._getPingList();
            this._getGangList();
            this._getNanList();
        },
        methods: {
            shuaFormOpen() {
                this.modelFlag = true
            },
            generateBrushPaper() {
                this.exportLoading = true
                let type = this.type.join(',')
                let subject1 = this.subject1.join(',')
                let subject4 = this.subject4.join(',')
                let subject3 = this.subject3.join(',')
                const params = {type, subject1, subject4, subject3}
                this.$http.get('/examquestion/getQuestionBySubject', {params}).then(res => {
                    if (res.success) {
                        this.questionList = res.data
                        this.modelFlag1 = true
                    }
                    this.exportLoading = false
                }).catch(() => {
                    this.exportLoading = false
                })
            },
            _getPingList() {
                this.$http.get('/examquestion/question_subject_list?status=2').then((res) => {
                    if (res.success) {
                        this.pingOption = res.data;
                    }
                });
            },
            _getGangList() {
                this.$http.get('/examquestion/question_subject_list?status=3').then((res) => {
                    if (res.success) {
                        this.postOption = res.data;
                    }
                });
            },
            _getNanList() {
                this.$http.get('/examquestion/question_subject_list?status=1').then((res) => {
                    if (res.success) {
                        this.nanOption = res.data;
                    }
                });
            }
        },
        components: {
            questionList
        }
    }
</script>
