<template>
    <div class="photo-web">
        <div class="photo-web-head">
            <div class="">
                <h1>员工风采</h1>
                <nav>
                    <span @click.stop="$router.push({name: 'photoList'})">首页</span>
                </nav>
            </div>
            <div class="">
                <span style="cursor: pointer;" @click.stop="$router.replace({name: 'home_index'})">返回人事系统</span>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<style lang="less">
    .photo-web {
        width: 100%;
        height: 100%;
        overflow-y: auto;
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
        components: {}
    };
</script>
