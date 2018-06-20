<template>
    <div class="level-show">
        <Tooltip :content="'综合能力值:' + myLevelPoint + ' ( ' + levelInfo.levelDesc + ' ) '" placement="top">
            <img :src="'/oa/static/image/level_' + levelInfo.level + '.png'"/>
        </Tooltip>
        <!--<p>{{levelInfo.levelDesc}}</p>-->
    </div>
</template>
    <style lang="less">
    .level-show {
        text-align: center;
        font-size: 0;
        img {
            max-width: 100%;
        }
    }
</style>
<script>
    export default {
        name: 'FsLevelShow',
        data() {
            return {
                levelNum: [
                    {
                        number: 350,
                        title: '热血青铜'
                    },
                    {
                        number: 450,
                        title: '不屈白银'
                    },
                    {
                        number: 1300,
                        title: '英勇黄金'
                    },
                    {
                        number: 2700,
                        title: '坚韧铂金'
                    },
                    {
                        number: 4900,
                        title: '不朽星钻'
                    },
                    {
                        number: 7700,
                        title: '荣耀皇冠'
                    },
                    {
                        number: 11700,
                        title: '超级王牌'
                    },
                    {
                        number: 16500,
                        title: '无敌战神'
                    }
                ],
                levelInfo: {
                    level: 0,
                    levelDesc: '...'
                }
            }
        },
        watch: {
            myLevelPoint(val) {
                for (let i = 1, length = this.levelNum.length; i <= length; i++) {
                    if (this.levelNum[i].number > val) {
                        this.levelInfo.level = i
                        this.levelInfo.levelDesc = this.levelNum[i - 1].title
                        break
                    }
                }
            }
        },
        computed: {
            myLevelPoint() {
                return this.$store.state.user.userInfo.totalcoin || 0
            }
        },
        components: {}
    }
</script>
