<template>
    <div id="photo-detail-list">
        <div class="banner">
            <div class="bg-header-large">
                <img src="https://s1.tuchong.com/event-banners/551509/pc.jpg?1">
            </div>
            <div class="info">
                <div class="detail">
                    <div class="detail-partial">
                        <h3>介绍</h3>
                        <div class="detail-desc">
                            <div class="desc">冷色调是“内向”的，干净、通透，独辟蹊径，让人在背景下显得尤为突出，也会给人距离感。让人物融入色彩中，感受色温的变化。</div>
                        </div>
                    </div>
                </div>
                <div class="handler">
                    <a href="" class="publish-btn" @click.stop="_createPhoto">创建相册</a>
                </div>
            </div>
        </div>
        <fs-photo-theater :img-list="imgList" v-if="showTheater" @close-theater="showTheater = false"></fs-photo-theater>
        <Button @click.native="showTheater=true">aaaa</Button>
    </div>
</template>
<style lang="less">
    #photo-detail-list {
        .banner {
            .bg-header-large {
                margin-bottom: 40px;
                img {
                    display: block;
                    width: 100%;
                }
            }
            .info {
                position: relative;
                margin: 0 40px 16px;
                overflow: hidden;
                font-size: 16px;
                line-height: 1.85;
                .detail {
                    overflow: hidden;
                    background: #fff;
                    padding: 40px;
                    margin-right: 391px;
                    min-height: 224px;
                    .detail-partial {
                        h3 {
                            letter-spacing: 10px;
                            line-height: 22px;
                            margin: 0;
                            margin-bottom: 25px;
                            font-size: 16px;
                        }
                        .detail-desc {
                            font-size: 13px;
                            position: relative;
                            display: flex;
                            align-items: center;
                            word-break: break-all;
                            min-height: 116px;
                            .desc {
                                flex: 1;
                                word-break: break-all;
                            }
                        }
                    }
                }
                .handler {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 367px;
                    line-height: 22px;
                    padding: 40px 29px 0;
                    background: #fff;
                    .publish-btn {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 48px;
                        line-height: 48px;
                        letter-spacing: 10px;
                        text-indent: 10px;
                        text-align: center;
                        color: #fff;
                        background-color: #c99a05cf;
                        transition: background-color 0.3s;
                        &:hover {
                            background-color: #c99a05;
                        }
                    }
                }
            }
        }
    }
</style>
<script>
    import FsPhotoTheater from '../components/fs-photo-theater';
    export default {
        name: 'photoDetailList',
        data() {
            return {
                showTheater: false,
                imgList: [
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607472.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1781829/f/17293684.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607474.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607476.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607473.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607475.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607477.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607478.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1111760/f/29464187.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/3402212/f/18012012.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1785450/f/20094703.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1695426/f/24638075.jpg'
                    }
                ]
            };
        },
        methods: {
            test(e) {
                console.log(e);
            },
            _createPhoto() {
            }
        },
        components: {
            FsPhotoTheater
        }
    };
</script>
