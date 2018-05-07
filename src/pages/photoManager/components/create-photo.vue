<template>
    <div class="fs-create-photo" :style="{'height': theaterHeight, 'width': theaterWidth}">
        <div class="main-zone">
            <fs-photo-upload :upload="photoList"></fs-photo-upload>
        </div>
        <div class="aside-zone">
        </div>
    </div>
</template>
<style lang="less">
    .fs-create-photo {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        overflow: hidden;
        .main-zone {
            position: absolute;
            left: 0;
            top: 0;
            right: 340px;
            bottom: 0;
            height: 100%;
            padding: 22px 30px 80px;
            overflow-y: auto;
        }
        .aside-zone {
            width: 340px;
            height: 100%;
            padding: 18px 20px 140px;
            margin-left: auto;
            font-size: 13px;
            line-height: 18px;
            overflow-y: scroll;
            color: #222;
            background-color: #fff;
        }
    }
</style>
<script>
    import FsPhotoUpload from './fs-photo-upload';
    export default {
        name: 'createPhoto',
        data() {
            return {
                theaterHeight: '0px',
                theaterWidth: '0px',
                photoList: []
            };
        },
        created() {
            this._initStyleObject();
        },
        methods: {
            _initStyleObject() {
                let w = document.body.clientWidth;
                let h = document.body.clientHeight;
                this.theaterWidth = w + 'px';
                this.theaterHeight = h + 'px';
            }
        },
        components: {
            FsPhotoUpload
        }
    };
</script>
