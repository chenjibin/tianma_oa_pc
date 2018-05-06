<template>
    <div>
        <fs-photo-theater :img-list="imgList" v-if="showTheater" @close-theater="showTheater = false"></fs-photo-theater>
        <Button @click.native="showTheater=true">aaaa</Button>
    </div>
</template>
<style>

</style>
<script>
    import FsPhotoTheater from '../components/fs-photo-theater';
    export default {
        name: 'photoDetailList',
        data() {
            return {
                showTheater: false,
                imgList: [
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607472.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1781829/f/17293684.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607474.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607476.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607473.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607475.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607477.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/2740904/f/28607478.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1111760/f/29464187.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/3402212/f/18012012.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1785450/f/20094703.jpg'
                    },
                    {
                        pic: '//photo.tuchong.com/1695426/f/24638075.jpg'
                    }
                ]
            };
        },
        methods: {
            test(e) {
                console.log(e);
            }
        },
        components: {
            FsPhotoTheater
        }
    };
</script>
