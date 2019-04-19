<template>
    <div>
        <Row :gutter="6">
            <Col :span="6">
                <question-cate-four></question-cate-four>
            </Col>
            <Col :span="6">
                <question-cate-one></question-cate-one>
            </Col>
            <Col :span="6">
                <question-cate-two></question-cate-two>
            </Col>
            <Col :span="6">
                <question-cate-three></question-cate-three>
            </Col>
        </Row>
    </div>
</template>
<script>
    import questionCateOne from './questionCateOne'
    import questionCateTwo from './questionCateTwo'
    import questionCateThree from './questionCateThree'
    import questionCateFour from './questionCateFour'
    export default {
        name: 'examinationCategory',
        data () {
            return {
            };
        },
        components: {
            questionCateOne,
            questionCateTwo,
            questionCateThree,
            questionCateFour
        }
    };
</script>
