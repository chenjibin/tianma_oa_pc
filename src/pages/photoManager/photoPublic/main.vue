<template>
    <div class="photo-web">
        <div class="photo-web-head">
            <div class="left">
                <h1>员工风采</h1>
                <nav>
                    <span @click.stop="$router.go(-1)">返回</span>
                    <span @click.stop="$router.push({name: 'myPhoto'})">我的作品</span>
                </nav>
            </div>
            <div class="right">
                <div class="user-info">
                    <img :src="avatorPath" />
                    <Dropdown @on-click="_dropHandler" :transfer="true">
                        <span class="name" href="javascript:void(0)">
                            {{userName}}
                            <Icon type="arrow-down-b"></Icon>
                        </span>
                        <DropdownMenu slot="list">
                            <DropdownItem name="myProduct">我的作品</DropdownItem>
                            <DropdownItem name="backSys">返回人事系统</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <!--<span style="cursor: pointer;" @click.stop="$router.replace({name: 'home_index'})">返回人事系统</span>-->
            </div>
        </div>
        <transition name="fade-page">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<style lang="less" scoped>
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
                    .name {
                        margin-left: 8px;
                        cursor: pointer;
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
                    display: inline-block;
                    padding: 6px 12px;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    &:hover {
                        color: rgba(255, 202, 5, 0.81);
                    }
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
        methods: {
            _dropHandler(name) {
                if (name === 'backSys') {
                    this.$router.replace({name: 'home_index'});
                } else if (name === 'myProduct') {
                    this.$router.push({name: 'myPhoto'});
                }
            }
        }
    };
</script>
