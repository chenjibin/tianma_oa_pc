<template>
    <div class="photo-web">
        <div class="photo-web-head">
            <div class="left">
                <h1>员工风采</h1>
                <nav>
                    <span @click.stop="$router.push({name: 'photoList'})">首页</span>
                </nav>
            </div>
            <div class="right">
                <div class="user-info">
                    <img :src="avatorPath" />
                    <span>{{userName}}</span>
                </div>
                <span style="cursor: pointer;" @click.stop="$router.replace({name: 'home_index'})">返回人事系统</span>
            </div>
        </div>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<style lang="less">
    .photo-web {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #f9f9f9;
        &-head {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 100%;
            height: 60px;
            margin: 0 auto;
            padding: 0 24px;
            background-color: #000;
            font-weight: 500;
            z-index: 4;
            color: #fff;
            .right {
                display: flex;
                align-items: center;
                .user-info {
                    display: flex;
                    align-items: center;
                    margin-right: 16px;
                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                    }
                    span {
                        margin-left: 8px;
                    }
                }
            }
            h1 {
                display: inline-block;
                font-size: 24px;
            }
            nav {
                display: inline-block;
                font-size: 16px;
                margin-left: 16px;
                span {
                    cursor: pointer;
                }
            }
        }
    }

</style>
<script>
    export default {
        data() {
            return {};
        },
        computed: {
            avatorPath () {
                return this.$store.state.user.userInfo.headimagepath;
            },
            userName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        components: {}
    };
</script>
