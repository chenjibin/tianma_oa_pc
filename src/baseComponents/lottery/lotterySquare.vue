<template>
    <ul class="fs-square-lottery-component">
        <li class="price-item"
            v-for="(item,index) in listArr"
            :key="'lottery-item-' + index"
            :class="{active: +activeIndex === index, animate: isAnimate}"
            :style="{width: item.width + 'px', left: item.left + 'px', top: item.top + 'px'}">
            <div class="inner">
                <div class="fs-square-img">
                    <img :src="'/oa' + priceList[index]['pic']" v-if="priceList[index]"/>
                </div>
            </div>
        </li>
        <li class="price-item"
            @click.stop="_startRoll"
            :style="{width: centerBtn.width + 'px', left: centerBtn.left + 'px', top: centerBtn.top + 'px'}">
            <div class="fs-square-img btn-img" style="cursor:pointer;">
                <img src="./oa_lottery_btn.png"/>
            </div>
        </li>
    </ul>
</template>
<script>
    export default {
        name: 'lottery',
        props: {
            lotteryType: {
                type: Number,
                default: 3
            },
            priceList: {
                type: Array,
                default: () => []
            },
            priceIndex: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                listArr: [],
                isAnimate: false,
                activeIndex: -1,
                timer: null,
                num: null,
                circle: 3,
                nowCircle: 0,
                speed: 500,
                totalIndex: -1,
                canClick: true,
                centerBtn: {}
            }
        },
        watch: {
            'activeIndex': function (val) {
                if (val === 0) this.nowCircle += 1
            }
        },
        methods: {
            _initListArr() {
                let arr = []
                this.num = Math.pow(this.lotteryType, 2) - Math.pow(this.lotteryType - 2, 2)
                let parentWidth = this.$el.clientWidth
                let itemWidth = parentWidth / this.lotteryType
                this.centerBtn['width'] = itemWidth * (this.lotteryType - 2)
                this.centerBtn['left'] = itemWidth
                this.centerBtn['top'] = itemWidth
                let typeMone = this.lotteryType - 1
                for (let i = 0; i < this.num; i++) {
                    let obj = {}
                    if (i <= typeMone) {
                        obj.left = i * itemWidth
                        obj.top = 0
                    } else if (i <= typeMone * 2) {
                        obj.left = typeMone * itemWidth
                        obj.top = (i - typeMone) * itemWidth
                    } else {
                        obj.left = arr[typeMone * 4 - i]['top']
                        obj.top = arr[typeMone * 4 - i]['left']
                    }
                    obj.width = itemWidth
                    arr.push(obj)
                }
                return arr
            },
            _startRoll() {
                if (!this.canClick) return
                this.canClick = false
                this.nowCircle = 0
                this.speed = 300
                this.$emit('start-roll')
            },
            _roll() {
                this.totalIndex += 1
                this.activeIndex = this.totalIndex % this.num

                if (this.nowCircle > (this.circle + 1) && this.activeIndex === this.priceIndex) {
                    clearTimeout(this.timer)
                    this.isAnimate = true
                    setTimeout(() => {
                        this.$emit('roll-down')
                        this.canClick = true
                        this.isAnimate = false
                    }, 100)
                } else {
                    if (this.nowCircle > this.circle) {
                        this.speed += 2
                    } else {
                        this.speed -= 40
                        if (this.speed < 30) this.speed = 30
                    }
                    this.timer = setTimeout(this._roll, this.speed)
                }
            }
        },
        mounted() {
            this.listArr = this._initListArr()
        }
    }

</script>

<style lang="less">
    .fs-square-lottery-component {
        padding-top: 100%;
        margin: 0;
        width: 100%;
        position: relative;
        list-style: none;
        .price-item {
            position: absolute;
            z-index: 100;
            padding: 2px;
            transition: all 0.1s;
            .btn-img {
                img {
                    transition: transform 0.1s;
                    &:active {
                        transform: scale3d(0.9,0.9,0.9);
                    }
                }
            }

            .inner {
                background-color: #f1a620;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: inset 0 0 20px 5px orangered;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            &.active .inner {
                transform: scale3d(0.95,0.95,0.95);
            }
            &.active .inner::before {
                content: '';
                display: block;
                position: absolute;
                z-index: 200;
                left: 2px;
                top: 2px;
                bottom: 2px;
                right: 2px;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 10px;
                box-shadow: inset 0 0 5px 2px #fff, 0 0 10px 0 #fff;
            }
            &.active.animate .inner::before {
                animation: flash 0.8s;
            }
        }
    }
</style>
