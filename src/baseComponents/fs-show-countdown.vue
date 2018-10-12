<template>
    <div class="fs-show-countdown" v-if="show">
        <div class="show-bg animated fadeIn delay-1s">
            <img src="../images/double11-countdown-bg.jpg" />
            <div class="number ">
                <img :src="oneImg" class="animated bounceInDown delay-my fast"/>
                <img :src="twoImg" class="animated bounceInDown delay-2s fast"/>
            </div>
            <div class="close-btn" @click="show = false">
                <Icon type="close-round"></Icon>
            </div>
        </div>
    </div>
</template>
<style scoped lang="less">
    * {
        user-select: none;
    }
    .animated.delay-my {
        animation-delay: 1.5s;
    }

    .show-bg {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1000000;
        transform: translate(-50%, -50%);
        width: 600px;
        border-radius: 10px;
        overflow: hidden;
        font-size: 0;
        overflow: hidden;
        .close-btn {
            position: absolute;
            right: 12px;
            top: 12px;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
        }
        &>img {
            width: 100%;
            height: auto;
        }
        .number {
            position: absolute;
            left: 30%;
            top: 33%;
            z-index: 1000;
            img {
                margin: 0 12px;
                width: 100px;
                opacity: 0.9;
            }
        }
    }

</style>
<script>
    export default {
        name: 'fsShowCountdown',
        data() {
            return {
                show: true,
                endData: '2018/11/11 00:00:00',
                now: Math.trunc(new Date().getTime() / 1000),
                oneImg: '/oa/static/image/count_down/0.png',
                twoImg: '/oa/static/image/count_down/0.png'
            }
        },
        mounted() {
            const endDate = Math.trunc(Date.parse(this.endData) / 1000);
            const diff = endDate - this.now;
            const day = Math.trunc(diff / 60 / 60 / 24);
            if (day === 0) {
                this.show = false
                return
            }
            let numberString = String(day);
            if (numberString.length === 1) {
                numberString = '0' + numberString
            }
            const numberArray = [...numberString]
            this.oneImg = `/oa/static/image/count_down/${numberArray[0]}.png`;
            this.twoImg = `/oa/static/image/count_down/${numberArray[1]}.png`
        }
    }
</script>
