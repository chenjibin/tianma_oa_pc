<template>
    <div class="fs-create-photo" :style="{'height': theaterHeight, 'width': theaterWidth}">
        <div class="main-zone">
            <div class="close-btn" @click.stop="closeHandler">
                <Icon type="close-round" size="32" color="rgba(0,0,0,0.6)"></Icon>
            </div>
            <fs-photo-upload  action="/oa/staffPresence/uploadFile" :upload.sync="photoList"></fs-photo-upload>
        </div>
        <div class="aside-zone">
            <div class="item">
                <p class="title">作品主题</p>
                <textarea v-model="photoTitle"></textarea>
            </div>
            <div class="item">
                <p class="title">作品简介</p>
                <textarea v-model="photoDesc"></textarea>
            </div>
            <div class="submit-btn" @click.stop="createPhotoHandler">创建作品</div>
        </div>
    </div>
</template>
<style lang="less">
    .fs-create-photo {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 900;
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
            background-color: #f9f9f9;
            .close-btn {
                cursor: pointer;
            }
        }
        .aside-zone {
            position: relative;
            width: 340px;
            height: 100%;
            padding: 18px 20px 140px;
            margin-left: auto;
            font-size: 13px;
            line-height: 18px;
            overflow-y: auto;
            color: #222;
            background-color: #fff;
            .item {
                .title {
                }
                textarea {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    margin: 12px 0 28px;
                    outline: 0;
                    font-size: 13px;
                    height: 100px;
                    resize: vertical;
                }
            }
            .submit-btn {
                position: absolute;
                bottom: 0;
                right: 0;
                z-index: 1;
                width: 340px;
                height: 48px;
                padding: 13px 0;
                border: 0;
                text-align: center;
                outline: 0;
                color: #fff;
                font-size: 16px;
                line-height: 22px;
                letter-spacing: 10px;
                text-indent: 10px;
                background-color: #c99a05;
                cursor: pointer;
            }
        }
    }
</style>
<script>
    import FsPhotoUpload from './fs-photo-upload';
    import {on, off} from '@/libs/dom';
    export default {
        name: 'createPhoto',
        data() {
            return {
                theaterHeight: '0px',
                theaterWidth: '0px',
                photoList: [],
                photoDesc: '',
                photoTitle: ''
            };
        },
        created() {
            this._initStyleObject();
        },
        mounted() {
            on(window, 'resize', () => {
                this._initStyleObject();
            });
        },
        watch: {
            photoList(val) {
                console.log(val);
            }
        },
        methods: {
            _initStyleObject() {
                let w = document.body.clientWidth;
                let h = document.body.clientHeight;
                this.theaterWidth = w + 'px';
                this.theaterHeight = h + 'px';
            },
            createPhotoHandler() {
                let sendData = {};
                sendData.staffPresenceId = this.$route.params.id;
                sendData.item = this.photoTitle;
                sendData.detail = this.photoDesc;
                sendData.fileNames = this.photoList.map(x => x.url).join(',');
                console.log(sendData);
            },
            closeHandler() {
                this.$emit('close');
            }
        },
        destroyed() {
            off(window, 'resize');
        },
        components: {
            FsPhotoUpload
        }
    };
</script>
