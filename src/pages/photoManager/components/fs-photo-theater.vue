<template>
    <div class="fs-theater" :style="styleObject">
        <div class="fs-theater-main">
            <div class="fs-theater-handler"></div>
            <div class="fs-theater-swiper">
                <div class="fs-theater-swiper-scene">
                    <div class="">
                        <div class="scene-item prev-scene"></div>
                        <div class="scene-item">
                            <img src=""/>
                        </div>
                        <div class="scene-item next-scene"></div>
                    </div>
                    <a class="switch-prev"></a>
                    <a class="switch-next"></a>
                </div>
                <div class="fs-theater-swiper-thumb"></div>
            </div>
        </div>
        <div class="fs-theater-aside"></div>
    </div>
</template>
<style lang="less">
    .fs-theater {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        overflow: hidden;
        &-handler {
            position: relative;
            height: 64px;
            width: 100%;
            padding: 19px 0;
            margin-bottom: auto;
            text-align: center;
            z-index: 999;
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
            padding: 62px 0 0;
            width: 320px;
            height: 100%;
            background-color: #000;
            border-left: 1px solid #1c1d1e;
            overflow-y: auto;
            color: #fff;
        }
    }
</style>
<script>
    export default {
        name: 'FsPhotoTheater',
        data() {
            return {
                styleObject: {}
            };
        },
        methods: {
            _initStyleObject() {
                const w = document.body.clientWidth;
                const h = document.body.clientHeight;
                this.styleObject.width = w + 'px';
                this.styleObject.height = h + 'px';
            }
        },
        created() {
            this._initStyleObject();
        },
        components: {}
    };
</script>
