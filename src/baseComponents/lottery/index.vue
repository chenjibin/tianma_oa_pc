<template>
    <div id="lottery-square">
        <div class="close-btn" @click.stop="hideLottery">
            <Icon type="android-close" :size="18"></Icon>
        </div>
        <div class="title-wrapper">
            <img src="./oa_lottery_title.png"/>
        </div>
        <div class="marquee-wrapper">
            <marquee
                :list-arr="getPriceNameList"></marquee>
        </div>
        <div class="lottery-content">
            <lottery @start-roll="_startRoll"
                     @roll-down="_rollDownHandler"
                     :price-index="priceIndex"
                     :price-list="priceInfo"
                     :lottery-type="lotteryType"
                     ref="lottery"></lottery>
        </div>
        <div class="rule-list">
            <p class="title">活动规则</p>
            <ul>
                <li>1、每次抽奖需扣除10个金币，扣除金币不退还，每天参与抽奖次数不限。</li>
                <li>2、奖品可直接到人事部领取，有效期至当月月底，预期作废！</li>
                <li>3、活动解释权归天马人事部所有。</li>
            </ul>
        </div>
        <transition name="fade-page">
            <div class="new-lottery-mask" v-show="isConfirmShow">
                <div class="fs-dialog-block">
                    <div class="top-wrapper">
                        <div class="close-btn" @click.stop="close">
                            <Icon type="android-close" :size="18"></Icon>
                        </div>
                        <div class="price-name" v-show="isPrice === 1">
                            <p>{{confirmContent}}</p>
                        </div>
                        <div class="fs-square-img top">
                            <img src="./oa_lottery_pop_nocoin.png" v-show="isPrice === 2"/>
                            <img src="./oa_lottery_popbg_yes.png" v-show="isPrice === 1"/>
                            <img src="./oa_lottery_popbg_no.png" v-show="isPrice === 0"/>
                        </div>
                    </div>
                    <div class="bottom-wrapper">
                        <div class="fs-square-img bottom">
                            <img src="./oa_lottery_popbg_btn.png" @click.stop="_continueRoll" v-show="isPrice !== 2"/>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="less">
    .marquee-wrapper {
        margin-bottom: 20px;
    }
    #lottery-square {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        overflow-y: auto;
        background-size: 100% 100%;
        background-image: url(./oa_mobil_lottery_bg.png);
        background-repeat: no-repeat;
        background-position: center;
        & > .close-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 12px;
            top: 12px;
            color: #fff;
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
        .rule-list {
            .title {
                font-size: 14px;
            }
            padding: 12px 0;
            width: 90%;
            margin: 0 auto;
            color: #fff;
        }
        .fs-dialog-block {
            width: 50%;
            background: #fff;
            border-radius: 30px;
            .top-wrapper {
                position: relative;
                .close-btn {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 30px;
                    height: 30px;
                    border: 1px solid #fff;
                    border-radius: 50%;
                    color: #fff;
                    cursor: pointer;
                }
                .price-name {
                    position: absolute;
                    z-index: 1000;
                    width: 100%;
                    text-align: center;
                    top: 50%;
                    font-size: 20px;
                    font-weight: 700;
                    color: #dc0707;
                    text-shadow: 0 0 5px #fff;
                    p {
                        width: 66%;
                        margin: 0 auto;
                    }
                }
                .top {
                    border-top-left-radius: 25px;
                    overflow: hidden;
                    border-top-right-radius: 25px;
                    padding-top: 82%;
                }
            }
            .bottom-wrapper {
                padding: 16px 0;
                .bottom {
                    margin: 0 auto;
                    padding-top: 20%;
                    width: 60%;
                    cursor: pointer;
                    .to-editor-btn {
                        position: absolute;
                        left: 4%;
                        top: 12%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 92%;
                        height: 75%;
                        background-color: #f33401;
                        color: #fff;
                        border-radius: 30px;
                        box-shadow: 0 0 0 4px #ffd864;
                        font-weight: 700;
                    }
                }
            }
        }
        .new-lottery-mask {
            position: absolute;
            z-index: 100;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .btn-wrapper {
            padding: 20px 0;
            text-align: center;
            .btn {
                display: inline-block;
                padding: 8px 20px;
                border-radius: 20px;
                background-color: #ff0036;
                color: #fff;
                font-weight: 700;
                box-shadow: 0 0 0 2px #fff;
            }
        }
        .title-wrapper {
            padding: 20px 0;
            width: 100%;
            text-align: center;
            img {
                width: 40%;
            }
        }
        .lottery-content {
            width: 90%;
            margin: 0 auto;
        }
    }
</style>

<script>
    import lottery from './lotterySquare'
    import marquee from './marquee'

    export default {
        props: {
            lotteryflag: Boolean
        },
        data() {
            return {
                priceIndex: 0,
                lotteryType: 5,
                priceInfo: [],
                isPrice: 0,
                confirmTitle: '恭喜你，中奖啦！',
                confirmContent: '10个金币',
                isConfirmShow: false,
                getPriceNameList: []
            }
        },
        methods: {
            hideLottery() {
                this.$emit('update:lotteryflag', false)
            },
            _startRoll() {
                this.$http.get('/lottery/shakeItUp').then((res) => {
                    if (res.status_code === 'success') {
                        this.$store.commit('updateUserInfo')
                        if (+res.type === 0) {
                            setTimeout(() => {
                                this.isPrice = 0
                            }, 100)
                            this.priceIndex = this._returnGetNoPriceIndex()
                        } else {
                            setTimeout(() => {
                                this.isPrice = 1
                                this.confirmContent = res.name
                            }, 100)
                            this.priceIndex = this._returnGetPriceIndex(res.id)
                        }
                        this.$refs.lottery._roll()
                    } else {
                        this.$refs.lottery.canClick = true
                        this.isPrice = 2
                        this.isConfirmShow = true
                    }
                })
            },
            _continueRoll() {
                this.close()
                this.$refs.lottery._startRoll()
            },
            _rollDownHandler() {
                this.isConfirmShow = true
            },
            close() {
                this.isConfirmShow = false
            },
            _returnGetNoPriceIndex() {
                let arr = []
                this.priceInfo && this.priceInfo.forEach((item, index) => {
                    if (item.type === 0) arr.push(index)
                })
                arr.sort(() => {
                    return Math.floor(Math.random() * 3) - 1
                })
                return arr[0]
            },
            _returnGetPriceIndex(id) {
                let priceIndex
                this.priceInfo && this.priceInfo.forEach((item, index) => {
                    if (+item.id === +id) priceIndex = index
                })
                return priceIndex || 0
            }
        },
        created() {
            this.$http.get('/lottery/ImageList').then((res) => {
                if (res.status_code === 'success') {
                    this.priceInfo = res.result
                    this.getPriceNameList = res.orderlist
                }
            })
        },
        components: {
            lottery,
            marquee
        }
    }
</script>
