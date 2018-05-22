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
        <Carousel v-model="value1" class="people-photo-list" autoplay :autoplay-speed="3000">
            <CarouselItem v-for="item in photoData"
                          :key="'photo-' + item.id">
                <div class="item"  @click.stop="$router.push({name: 'photoDetailList',  params: { id: item.id }})">
                    <img :src="$mainHost + item.file_path">
                    <div class="info">
                        <div class="">
                            {{item.item}}
                        </div>
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
    </Card>
</template>
<style lang="less">
    .people-photo {
        user-select: none;
        margin-bottom: 6px;
        &-list {
            margin-top: 8px;
            .item {
                padding: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                background-color: #fff;
                font-size: 0;
                .info {
                    padding: 16px 0;
                    font-size: 16px;
                    text-align: center;
                    font-weight: 700;
                }
                img {
                    display: block;
                    margin: auto;
                    width: auto;
                    height: 260px;
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
                value1: 0,
                photoData: []
            };
        },
        created () {
            this._getShowPhotoData();
        },
        methods: {
            _getShowPhotoData () {
                let sendData = {};
                sendData.page = 1;
                sendData.pageSize = 1000;
                sendData.isShowpic = 1;
                this.$http.get('/staffPresence/getStaffPresenceList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.photoData = res.data;
                    }
                });
            }
        }
    };
</script>
