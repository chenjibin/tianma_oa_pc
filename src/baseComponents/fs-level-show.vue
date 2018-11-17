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
                   <div >规则：</div>
                   <div >
                       <div >
                           <span>热血青铜</span><span>0~350</span>
                           <span style="margin-left: 13%">不屈白银</span><span>350~450  </span>
                       </div>
                       <div >
                           <span>英勇黄金</span><span>1300~2700</span>
                           <span  style="margin-left: 6%">坚韧铂金</span><span>2700~4900</span>
                       </div>
                       <div>
                           <span>不朽星钻</span><span>4900~7700</span>
                           <span  style="margin-left: 6%">荣耀皇冠</span><span>7700~11700</span>
                       </div>
                       <div>
                           <span>超级王牌</span><span>11700~16500</span>
                           <span  style="margin-left: 3%">无敌战神</span><span>16500~100000</span>
                       </div>
                       <div>
                           <span>无敌</span><span>100000~</span>
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
    .duiqi {
        left: 13%;
    }
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
