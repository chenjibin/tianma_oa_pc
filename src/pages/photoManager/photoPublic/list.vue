<template>
    <div class="photo-list-page">
        <div class="list-wrapper">
            <div class="list-block"
                 v-for="item in photoList"
                 @click.stop="$router.push({name: 'photoDetailList',  params: { id: item.id }})">
                 :key="'photo-' + item.id">
                <div class="left">
                    <img v-lazy="item.file_path" />
                </div>
                <div class="right">
                    <div class="top">
                        <p>活动主题: {{item.item}}</p>
                        <p>活动介绍: {{item.detail}}</p>
                        <p>活动奖励: {{item.award}}</p>
                    </div>
                    <div class="bottom">
                        活动还有<span>{{item.end_day}}</span>天结束
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .photo-list-page {
        position: absolute;
        top: 60px;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        .list-wrapper {
            margin: 20px auto 0 auto;
            width: 900px;
            font-size: 0;
        }
        .list-block {
            display: flex;
            margin-bottom: 16px;
            background-color: #fff;
            cursor: pointer;
            .left {
                flex: 0 0 400px;
                width: 400px;
            }
            .right {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 16px 0;
                margin-left: 16px;
                font-size: 14px;
            }
            img {
                width: 100%;
                height: auto;
            }
        }
    }
</style>
<script>
    export default {
        name: 'photoList',
        data() {
            return {
                photoList: []
            };
        },
        created() {
            this._getList();
        },
        methods: {
            _getList() {
                let sendData = {};
                sendData.page = 1;
                sendData.pageSize = 100;
                this.$http.get('/staffPresence/getStaffPresenceList', {params: sendData}).then((res) => {
                    console.log(res);
                    if (res.success) {
                        this.photoList = res.data;
                    }
                });
            }
        },
        components: {}
    };
</script>
