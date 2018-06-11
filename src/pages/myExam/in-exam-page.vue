<template>
    <div class="in-exam">
        <div class="inner">
            <in-exam :id="testPaperId"
                     :paper-id="testId"
                     @submit-paper-success="_submitSuccessHandler"></in-exam>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .in-exam {
        width: 100%;
        height: 100%;
        background-color: #333;
        overflow-y: auto;
        padding: 50px 0;
        .inner {
            width: 1200px;
            margin: 0 auto;
        }
    }
</style>
<script>
    import inExam from './in-exam'

    export default {
        name: 'inExamPage',
        data() {
            return {
                testPaperId: null,
                testId: null
            }
        },
        methods: {
            _submitSuccessHandler() {
                this.$router.replace({name: 'myExam'});
            }
        },
        created() {
            this.testPaperId = +this.$route.params.testPaperId;
            this.testId = +this.$route.params.testId;
            // document.addEventListener('keydown', function (e) {
            //     if (e.keyCode === 122) {
            //         e.preventDefault();
            //     }
            // })
        },
        components: {
            inExam
        }
    }
</script>
