<template>
    <div class="level-show">
        <Tooltip :content="'综合能力值:' + levelNumber + ' ( ' + levelDesc + ' ) '" placement="top">
            <img :src="'/oa/static/image/level_' + level + '.png'" v-if="level !== 0"/>
        </Tooltip>
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
    import {mapGetters} from 'vuex'
    export default {
        name: 'FsLevelShow',
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'level',
                'levelNumber',
                'levelDesc'
            ])
        }
    }
</script>
