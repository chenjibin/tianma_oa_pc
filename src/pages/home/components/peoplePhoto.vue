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
        <div class="people-photo-list">
            <div class="item" @click.stop="$router.push({name: 'photoDetailList',  params: { id: '1' }})">
                <img src="https://s1.tuchong.com/event-banners/551509/pc.jpg?1">
            </div>
        </div>
    </Card>
</template>
<style lang="less">
    .people-photo {
        user-select: none;
        margin-bottom: 10px;
        &-list {
            margin-top: 8px;
            .item {
                padding: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                background-color: #000;
                font-size: 0;
                img {
                    max-width: 100%;
                    height: auto;
                }
            }
        }
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
