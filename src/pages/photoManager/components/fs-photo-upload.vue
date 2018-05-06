<template>
    <div id="fs-photo-upload">
        <Upload
            ref="uploadDom"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg']"
            :max-size="20480"
            :on-error="handleError"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="action">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                <p>点击或者拖拽图片上传,最大支持20M的JEPG格式的照片</p>
            </div>
        </Upload>
        <ul style="display: inline-block">
            <li class="demo-upload-list" v-for="item in upload">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'FsPhotoUpload',
        props: {
            path: {
                type: String,
                default: ''
            },
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
                file.url = this.path + res.data.filename;
                file.name = res.data.filename;
                this.updateUploadList();
            },
            handleFormatError () {
                this.$Message.error('图片格式只能为.jpg 或者 .png!');
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
        display: flex;
        .demo-upload-list {
            display: inline-block;
            width: 260px;
            height: 260px;
            margin-left: 40px;
            margin-bottom: 40px;
            overflow: hidden;
            background: #fff;
            position: relative;
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
                display: block;
            }
        }

    }
</style>
