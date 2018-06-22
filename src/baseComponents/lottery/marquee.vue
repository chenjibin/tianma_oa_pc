<template>
    <div class="fs-mqrquee-component">
        <ul class="inner-wrapper" ref="innerDom"
            :style="{width: innerWidth + 'px'}"
            :class="{show: canShow}">
            <li class="mqrquee-item">
                <span v-for="(item,index) in listArr"
                      :key="'mar-item-' + index">{{item.Str}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
    import {prefixStyle} from '@/libs/dom'

    const transform = prefixStyle('transform')

    export default {
        name: 'lottery',
        props: {
            listArr: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                animationWidthNo: 0,
                innerWidth: null,
                animationWidth: 0,
                canShow: false,
                animationFram: null
            }
        },
        watch: {
            'listArr'(val) {
                this._initDom()
            }
        },
        methods: {
            _initDom() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        let innerDom = this.$refs.innerDom
                        let outerDom = this.$el
                        let outerWidth = outerDom.clientWidth
                        let children = innerDom.children
                        let length = 0
                        Array.from(children).forEach((item, index) => {
                            let width = Math.ceil(item.clientWidth)
                            length += width
                        })
                        this.innerWidth = length
                        if (length > outerWidth) {
                            this.animationWidth = this.$el.clientWidth
                            this.animationWidthNo = this.$el.clientWidth
                            this._run()
                            this.canShow = true
                        }
                    }, 60)
                })
            },
            _run() {
                let innerDom = this.$refs.innerDom
                this.animationWidth -= 1
                innerDom.style.transform = `translate3d(${this.animationWidth}px, 0px, 0px)`
                if (Math.abs(this.animationWidth) > this.innerWidth) this.animationWidth = this.animationWidthNo
                this.animationFram = requestAnimationFrame(this._run)
            }
        },
        mounted() {
        },
        destroyed() {
            cancelAnimationFrame(this.animationFram)
        }
    }
</script>

<style lang="less">
    .fs-mqrquee-component {
        position: relative;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 90%;
        overflow: hidden;
        height: 34px;
        .border-1px {
            background-color: rgba(255, 255, 255, 0.6);
        }
        .inner-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 100;
            padding: 6px 0;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0;
            opacity: 0;
            &.show {
                opacity: 1;
            }
            .mqrquee-item {
                display: inline-block;
                font-size: 14px;
                white-space: nowrap;
                span {
                    margin-right: 20px;
                }
            }
        }
    }
</style>
