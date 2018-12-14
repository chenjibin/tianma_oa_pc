<template>
    <div>
        <div class="" v-for="(item,index) in questionList" :key="index">
            <h3>
                <span>{{numMap[index]}}、</span>
                <span>{{typeMap[item.type - 1]}}:</span>
            </h3>
            <div class="fs-list-item"
                 v-for="(question,qindex) in item.questionList"
                 style="margin-bottom:16px;font-weight: 700;"
                 :key="'question-' + index + '-' + qindex">
                <p class="exam-name">
                    <span class="fs-badge">{{qindex + 1}}、</span>
                    <span>{{question.name}}</span>
                    <span>({{question.questionmark}}分)</span>
                    <Button icon="ios-eye" type="text" @click="_toggleAnswer(index, qindex)" title="查看答案"></Button>
                </p>
                <img :src="question.questionpic | _returnPicUrl"
                     v-if="question.questionpic"
                     class="exam-pic"
                     style="margin: 8px 0 16px 0;max-width: 100%;"/>
                <div class="">
                    <RadioGroup v-model="question.answerNew"
                                vertical
                                v-if="question.type === 1">
                        <div v-for="option in question.optionlist"
                             style="margin-bottom: 8px"
                             :key="'option' + option.id">
                            <Radio :label="option.optionnum">
                                <span>{{option.optionnum}}.</span>
                                <span>{{option.content}}</span>
                            </Radio>
                            <img :src="option.optionpic | _returnPicUrl"
                                 style="max-width: 100%;"
                                 v-if="option.optionpic"/>
                        </div>
                    </RadioGroup>
                    <CheckboxGroup v-model="question.answerNew"
                                   vertical
                                   v-if="question.type === 2">
                        <div v-for="option in question.optionlist"
                             style="margin-bottom: 8px"
                             :key="'option' + option.id">
                            <Checkbox :label="option.optionnum" style="display: block;">
                                <span>{{option.optionnum}}.</span>
                                <span>{{option.content}}</span>
                            </Checkbox>
                            <img :src="option.optionpic | _returnPicUrl"
                                 style="max-width: 100%;"
                                 v-if="option.optionpic"/>
                        </div>
                    </CheckboxGroup>
                    <RadioGroup v-model="question.answerNew" v-if="question.type === 3">
                        <Radio label="正确">正确</Radio>
                        <Radio label="错误">错误</Radio>
                    </RadioGroup>
                    <Input v-model="question.answerNew"
                           type="textarea"
                           :autosize="{minRows: 2,maxRows: 5}"
                           onpaste="return false"
                           style="width: 500px;"
                           v-if="question.type === 4"
                           placeholder="填空答案用,号隔开"></Input>
                    <Input v-model="question.answerNew"
                           type="textarea"
                           :autosize="{minRows: 2,maxRows: 5}"
                           @paste.native.prevent
                           style="width: 500px;"
                           v-if="question.type === 5"
                           placeholder="问答题按关键点得分"></Input>
                </div>
                <div class="" :ref="'answer' + index + qindex" style="display: none;margin-top: 12px">
                    <span>正确答案:</span>
                    <span>{{question.answer}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'new-question-list',
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                numMap: ['一', '二', '三', '四', '五'],
                typeMap: ['单选题', '多选题', '判断题', '填空题', '问答题'],
                questionList: []
            }
        },
        filters: {
            _returnPicUrl(val) {
                return '/oa' + val;
            }
        },
        created() {
            this.questionList = this.returnNeedList(this.list)
        },
        methods: {
            returnNeedList(data) {
                let allType = [...(new Set(data.map(x => x.type)))].sort((x, y) => {
                    return x - y > 0;
                });
                let storeArray = [];
                allType.forEach((item) => {
                    let obj = {};
                    let questionList = data.filter(x => x.type === item);
                    questionList.forEach((item, index, array) => {
                        if (item.type === 2) {
                            array[index].answerNew = [];
                        } else {
                            array[index].answerNew = '';
                        }
                    });
                    obj.type = questionList[0].type;
                    obj.questionList = questionList;
                    storeArray.push(obj);
                });
                console.log(storeArray)
                return storeArray;
            },
            _toggleAnswer(index, qindex) {
                let dom = this.$refs['answer' + index + qindex][0]
                if (dom.style.display === 'none') {
                    dom.style.display = 'block'
                } else {
                    dom.style.display = 'none'
                }
            }
        },
        components: {}
    }
</script>
