<template>
    <div class="fs-theater"
         :style="{'height': theaterHeight, 'width': theaterWidth}">
        <div class="fs-theater-main" @mousewheel="_mousewheelHandler">
            <div class="fs-theater-handler">
                <div style="width: 72px;"></div>
                <div class="number">
                    <span>{{currentIndex + 1}}</span>
                    <span>/</span>
                    <span>{{imgList.length}}</span>
                </div>
                <div class="tool-btns">
                    <span class="btn" title="关闭" @click.stop="_closeTheater">
                        <Icon type="close-round" size="32" color="rgba(255,255,255,0.6)"></Icon>
                    </span>
                </div>
            </div>
            <div class="fs-theater-swiper">
                <div class="fs-theater-swiper-scene">
                    <div class="">
                        <div class="scene-item"
                             v-for="(item, index) in imgList"
                             :class="{'prev-scene': index < currentIndex, 'next-scene': index > currentIndex}"
                             :key="'pic-' + index">
                            <img :src="item.file_path"/>
                        </div>
                    </div>
                    <a class="switch prev" @click="_prevPic" title="上一张">
                        <Icon type="ios-arrow-left" size="42" color="rgba(255,255,255,0.6)"></Icon>
                    </a>
                    <a class="switch next" @click="_nextPic" title="下一张">
                        <Icon type="ios-arrow-right" size="42" color="rgba(255,255,255,0.6)"></Icon>
                    </a>
                </div>
                <div class="fs-theater-swiper-thumb">
                    <div class="thumb-container" :style="{'transform': `translate3D(${transformX},0,0)`}">
                        <a class="thumb-item"
                           @click.stop="currentIndex = index"
                           :class="{'current': index === currentIndex}"
                           :style="{'backgroundImage': `url('${item.file_path}')`}"
                           v-for="(item, index) in imgList"
                           :key="'thumb-' + index"></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="fs-theater-aside">
            <div class="actions">
                <a class="action" @click="_thumbHandler">
                    <Icon type="heart" :color="productInfo.thumbupId ? '#ff0036' : '#fff'" size="24"></Icon>
                    <span :style="{'color': productInfo.thumbupId ? '#ff0036' : '#fff'}">{{productInfo.thumb_up_times}}</span>
                </a>
                <a class="action">
                    <Icon type="chatbox" color="#fff" size="24"></Icon>
                    <span>{{productInfo.share_comment_times}}</span>
                </a>
            </div>
            <div class="head">
                <img class="user-pic" :src="productInfo.headimagepath">
                <p class="user-name">{{productInfo.insert_username}}</p>
                <p class="desc"><time>{{productInfo.createTime}}</time></p>
            </div>
            <fs-comment :id="productInfo.id"></fs-comment>
        </div>
    </div>
</template>
<style lang="less">
    .fs-theater {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100%;
        overflow: hidden;
        &-handler {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 64px;
            width: 100%;
            padding: 19px 0;
            margin-bottom: auto;
            text-align: center;
            z-index: 999;
            .number {
                font-size: 18px;
                color: rgba(255,255,255,0.8);
            }
            .tool-btns {
                padding-right: 48px;
                .btn {
                    cursor: pointer;
                }
            }
        }
        &-swiper {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            font-size: 0;
            white-space: nowrap;
            &-scene {
                position: absolute;
                top: 0;
                bottom: 110px;
                left: 0;
                right: 0;
                .switch {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 0;
                    bottom: 0;
                    z-index: 1;
                    width: 100px;
                    &:hover {
                        background-color: rgba(0,0,0,.2);
                    }
                    &.prev {
                        left: 0;
                    }
                    &.next {
                        right: 0;
                    }
                }
                .scene-item {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    &.prev-scene {
                        transform: translateX(-100%);
                    }
                    &.next-scene {
                        transform: translateX(100%);
                    }
                    img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        max-width: 100%;
                        max-height: 100%;
                        margin: auto;
                    }
                }
            }
            &-thumb {
                position: absolute;
                padding: 20px 0;
                bottom: 0;
                width: 100%;
                height: 110px;
                .thumb-container {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-66px);
                    transition: transform .3s linear;
                    .thumb-item {
                        position: relative;
                        display: inline-block;
                        width: 106px;
                        height: 70px;
                        margin: 0 5px;
                        vertical-align: top;
                        -moz-background-size: cover;
                        background-size: cover;
                        background-position: center;
                        &.current {
                            border: 2px solid #fff;
                        }
                        &.current::after {
                            display: none;
                        }
                        &::after {
                            content: "";
                            position: absolute;
                            left: 0;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            background-color: rgba(0,0,0,.6);
                        }
                    }
                }
            }
        }
        &-main {
            position: absolute;
            top: 0;
            right: 320px;
            bottom: 0;
            left: 0;
            overflow: hidden;
            background-color: #000;
        }
        &-aside {
            position: relative;
            margin-left: auto;
            padding: 62px 0 30px 0;
            width: 320px;
            height: 100%;
            background-color: #000;
            border-left: 1px solid #1c1d1e;
            overflow-y: auto;
            color: #fff;
            .head {
                position: relative;
                height: 76px;
                padding: 20px 15px 20px 67px;
                border-bottom: 1px solid #1c1d1e;
                line-height: 1;
                background-color: #000;
                .user-pic {
                    position: absolute;
                    top: 17px;
                    left: 15px;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                }
                .desc {
                    margin: 10px 0 0;
                    font-size: 12px;
                    color: #85888a;
                }
                .user-name {
                    font-weight: 700;
                }
            }
            .actions {
                position: fixed;
                display: flex;
                right: 0;
                top: 0;
                z-index: 1;
                padding: 0 9px;
                width: 320px;
                height: 62px;
                line-height: 62px;
                border-top: 1px solid #1c1d1e;
                border-left: 1px solid #1c1d1e;
                background-color: #000;
                font-size: 18px;
                border-bottom: 1px solid #1c1d1e;
                .action {
                    display: flex;
                    align-items: center;
                    margin-right: 32px;
                    span {
                        margin-left: 8px;
                        color: #fff;
                        user-select: none;
                    }
                }
            }
        }
    }
</style>
<script>
    import {on, off} from '@/libs/dom';
    import FsComment from '../components/fs-comment';
    export default {
        name: 'FsPhotoTheater',
        props: {
            imgList: {
                type: Array,
                default: () => []
            },
            productInfo: {
                type: Object,
                default: () => {}
            },
            showTheater: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            currentIndex(val) {
                this.transformX = -66 - (val * 116) + 'px';
            }
        },
        data() {
            return {
                theaterHeight: '0px',
                theaterWidth: '0px',
                currentIndex: 0,
                transformX: '-66px',
                canWheel: true,
                timmer: null
            };
        },
        methods: {
            _initStyleObject() {
                let w = document.body.clientWidth;
                let h = document.body.clientHeight;
                this.theaterWidth = w + 'px';
                this.theaterHeight = h + 'px';
            },
            _prevPic() {
                if (this.currentIndex === 0) return;
                this.currentIndex -= 1;
            },
            _nextPic() {
                if (this.currentIndex === (this.imgList.length - 1)) return;
                this.currentIndex += 1;
            },
            _mousewheelHandler(e) {
                if (!this.canWheel) return;
                this.canWheel = false;
                this.timmer = setTimeout(() => {
                    this.canWheel = true;
                }, 400);
                if (e.wheelDelta > 0) {
                    this._prevPic();
                } else {
                    this._nextPic();
                }
            },
            _closeTheater() {
                this.$emit('close-theater');
            },
            _thumbHandler() {
                if (!this.productInfo.thumbupId) {
                    let sendData = {};
                    sendData.articleId = this.productInfo.id;
                    sendData.type = 0;
                    this.$http.post('/staffPresence/addThumbup', sendData).then((res) => {
                        console.log(res);
                        if (res.success) {
                            this.productInfo.thumbupId = res.data.id;
                            this.productInfo.thumb_up_times = res.data.thumb_up_times;
                        }
                    });
                } else {
                    let sendData = {};
                    sendData.id = this.productInfo.thumbupId;
                    this.$http.post('/staffPresence/deleteThumbup', sendData).then((res) => {
                        console.log(res);
                        if (res.success) {
                            this.productInfo.thumbupId = null;
                            this.productInfo.thumb_up_times = res.data.thumb_up_times;
                        }
                    });
                }
            }
        },
        created() {
            on(window, 'resize', () => {
                this._initStyleObject();
            });
            on(document, 'keydown', (e) => {
                if (+e.keyCode === 39 || +e.keyCode === 40) {
                    this._nextPic();
                } else if (+e.keyCode === 37 || +e.keyCode === 38) {
                    this._prevPic();
                }
            });
            this._initStyleObject();
        },
        destroyed() {
            this.timmer = null;
            this.currentIndex = 0;
            off(window, 'resize');
            off(document, 'keydown');
        },
        components: {
            FsComment
        }
    };
</script>
