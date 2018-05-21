<template>
    <div id="fs-photo-upload">
        <ul style="width: 100%;">
            <li class="demo-upload-list" v-for="item in upload">
                <div class="inner">
                    <template v-if="item.status === 'finished'">
                        <img :src="$mainHost + item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-trash-outline" size="24" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
            </li>
        </ul>
        <Upload
            ref="uploadDom"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg']"
            accept="image/jpg, image/jpeg"
            :max-size="20480"
            :on-error="handleError"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :data="{'type': 2}"
            multiple
            type="drag"
            :action="$mainHost + action" style="display: flex;justify-content: center;align-items: center;margin-left: 40px">
            <div style="padding: 20px 8px;width: 300px">
                <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                <p>点击或者拖拽图片上传</p>
                <p>最大支持20M的JEPG格式的照片</p>
            </div>
        </Upload>
    </div>
</template>
<script>
    export default {
        name: 'FsPhotoUpload',
        props: {
            action: String,
            upload: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data () {
            return {};
        },
        methods: {
            updateUploadList() {
                let fileList = this.$refs.uploadDom.fileList;
                this.$emit('update:upload', fileList);
                this.$emit('update', fileList);
            },
            handleError() {
                this.$Message.error('系统错误，请重新上传!');
            },
            handleRemove (file) {
                const fileList = this.$refs.uploadDom.fileList;
                this.$refs.uploadDom.fileList.splice(fileList.indexOf(file), 1);
                this.updateUploadList();
            },
            removeAllPicFlie() {
                this.$refs.uploadDom.fileList = [];
            },
            handleSuccess (res, file) {
                file.url = res.data.filename;
                this.updateUploadList();
            },
            handleFormatError () {
                this.$Message.error('图片格式只能为.jpg 或者 .jpeg!');
            },
            handleMaxSize () {
                this.$Message.error('图片大小不能超过20M!');
            },
            handleBeforeUpload () {
            }
        },
        mounted () {
            this.$refs.uploadDom.fileList = this.upload;
        }
    };
</script>
<style lang="less">
    #fs-photo-upload {
        .demo-upload-list {
            display: inline-block;
            width: 260px;
            height: 260px;
            margin-left: 40px;
            margin-bottom: 40px;
            overflow: hidden;
            position: relative;
            .inner {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                max-width: 260px;
                max-height: 260px;
                margin: auto;
            }
            &-cover {
                display: none;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 10;
                background: rgba(0,0,0,.6);
                i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                }
            }
            &:hover .demo-upload-list-cover{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

    }
</style>
