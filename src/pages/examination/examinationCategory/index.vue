<template>
    <div>
        <Row :gutter="12">
            <Col :span="8">
                <question-cate-one></question-cate-one>
            </Col>
            <Col :span="8">
                <question-cate-two></question-cate-two>
            </Col>
            <Col :span="8">
                <question-cate-three></question-cate-three>
            </Col>
        </Row>
    </div>
</template>
<script>
    import questionCateOne from './questionCateOne'
    import questionCateTwo from './questionCateTwo'
    import questionCateThree from './questionCateThree'
    export default {
        name: 'examinationCategory',
        data () {
            return {
            };
        },
        components: {
            questionCateOne,
            questionCateTwo,
            questionCateThree
        }
    };
</script>
