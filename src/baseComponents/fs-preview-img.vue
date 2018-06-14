<template>
    <div>
        <transition name="fade-page">
            <div class="prew-img" v-show="prewOpen" @click.stop="_hidePrewImg">
                <div class="pic-wrapper">
                    <img :src="imgUrl" />
                </div>
            </div>
        </transition>
    </div>
</template>
<style lang="less">
    .prew-img {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 10000;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: rgba(0,0,0,0.6);
        cursor: zoom-out;
        user-select: none;
        .pic-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100%;
            padding: 92px 40px 40px 40px;
            img {
                max-width: 100%;
            }
        }
    }
</style>
<script>
    export default {
        name: 'fsPreviewImg',
        props: {
            prewOpen: {
                type: Boolean,
                defalut: false
            },
            imgUrl: String
        },
        data() {
            return {}
        },
        methods: {
            _hidePrewImg() {
                this.$emit('update:prewOpen', false)
            }
        },
        components: {}
    }
</script>
