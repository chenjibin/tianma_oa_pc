<template>
    <Card class="people-photo">
        <Row type="flex" justify="space-between">
            <Col>
                <p class="people-photo-title">员工风采</p>
            </Col>
            <Col>
                <Button type="primary"
                        shape="circle"
                        icon="eye"
                        @click.stop="$router.push({name: 'photoList'})"
                        style="margin-right: 8px;">查看更多</Button>
            </Col>
        </Row>
    </Card>
</template>
<style lang="less">
    .people-photo {
        user-select: none;
        margin-bottom: 10px;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
    }

</style>
<script>
    export default {
        data () {
            return {
                inJobData: []
            };
        },
        created () {
            this._getInJobData();
        },
        methods: {
            _getInJobData () {
            }
        }
    };
</script>
