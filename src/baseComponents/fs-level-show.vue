<template>
    <div class="level-show">
        <Poptip placement="bottom" width="400">
            <div slot="content">
               <div class="level-data">
                   <div class="level-data-item" v-for="(item,index) in userProperty" :key="'level-data-' + index">
                       <div class="level-year">{{item.date}}</div>
                       <div class="level-option">
                           <div class="each-option">
                               <span class="label">财富:</span><span>{{item.treasure}}</span>
                           </div>
                           <div class="each-option">
                               <span class="label">技能:</span><span>{{item.skill}}</span>
                           </div>
                           <div class="each-option">
                               <span class="label">伯乐:</span><span>{{item.talentscout}}</span>
                           </div>
                           <div class="each-option">
                               <span class="label">智慧:</span><span>{{item.wisdom}}</span>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
            <Tooltip :content="'综合能力值:' + levelNumber + ' ( ' + levelDesc + ' ) '" placement="top">
                <img :src="'/oa/static/image/level_' + level + '.png'" v-if="level !== 0" style="cursor: pointer;"/>
            </Tooltip>
        </Poptip>
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
    .level-data {
        text-align: left;
        .level-data-item {
            margin-bottom: 12px;
            .level-year {
                font-size: 16px;
                color: #333;
            }
            .each-option {
                margin-right: 16px;
                display: inline-block;
                color: #333;
                .label {
                    margin-right: 4px;
                }
            }
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
                'levelDesc',
                'userProperty'
            ])
        }
    }
</script>
