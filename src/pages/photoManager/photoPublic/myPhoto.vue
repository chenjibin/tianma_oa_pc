<template>
    <div id="my-photo-page" @scroll="_scrollerHandler">
        <div class="personal-banner" style="background-image:url(https://static.tuchong.net/images/site-bg-2.jpg)">
            <div class="head-img">
                <img :src="avatorPath" />
            </div>
            <div class="title">我的作品</div>
        </div>
        <div class="container">
            <div class="post-wrap">
                <fs-water-rows
                    :photos="photo"
                    v-if="photo.length"
                    @item-click="_waterItemClickHandler"></fs-water-rows>
                <div class="end" v-if="pageData.page >= pageData.totalPage && pageData.totalPage !== 0">END</div>
            </div>
        </div>
        <fs-photo-theater
            :img-list="imgList"
            :product-info="productInfo"
            :show-editor="true"
            v-if="showTheater"
            @update-list="_getPhotoList"
            @editor-open="_photoEditorHandler"
            @close-theater="showTheater = false"></fs-photo-theater>
        <create-photo @close="showCreate = false"
                      :editable="true"
                      :productInfo="productInfo"
                      v-if="showCreate" @add-success="_photoAddSuccess"></create-photo>
    </div>
</template>
<style lang="less" scoped>
    #my-photo-page {
        position: absolute;
        top: 60px;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        .personal-banner {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #000;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 100%;
            height: 320px;
            font-size: 14px;
            line-height: 20px;
            color: #f9f9f9;
            &::before {
                position: absolute;
                content: '';
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: -webkit-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.5));
                background: -moz-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.5));
                background: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,.5));
            }
            .head-img {
                position: relative;
                z-index: 10;
                img {
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                }
            }
            .title {
                position: relative;
                z-index: 10;
                margin-top: 24px;
                font-size: 24px;
                letter-spacing: 4px;
            }
        }
        .container {
            position: relative;
            margin: 0 40px;
            .post-wrap {
                min-width: 1200px;
                max-width: 1880px;
                padding: 16px 0 25px;
                margin: 0 auto;
                font-size: 0;
                .end {
                    user-select: none;
                    margin-top: 42px;
                    padding: 16px 0;
                    font-size: 24px;
                    text-align: center;
                }
            }
        }
    }
</style>
<script>
    import FsPhotoTheater from '../components/fs-photo-theater';
    import FsWaterRows from '@/baseComponents/fs-water-rows';
    import createPhoto from '../components/create-photo';
    export default {
        name: 'myPhoto',
        data() {
            return {
                showTheater: false,
                showCreate: false,
                canLoad: true,
                photo: [],
                imgList: [],
                productInfo: {},
                pageData: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0
                }
            };
        },
        activated() {
            this._getPhotoList();
        },
        methods: {
            _photoAddSuccess() {
                this.showCreate = false;
                this._getPhotoList();
            },
            _photoEditorHandler() {
                this.showTheater = false;
                this.showCreate = true;
            },
            _waterItemClickHandler(data) {
                this.imgList = data.files;
                this.productInfo = {
                    headimagepath: data.headimagepath,
                    id: data.id,
                    createTime: data.insert_time.split(' ')[0],
                    insert_username: data.insert_username,
                    share_comment_times: data.share_comment_times,
                    thumb_up_times: data.thumb_up_times,
                    thumbupId: data.thumbupid || null,
                    files: data.files,
                    item: data.item,
                    detail: data.detail
                };
                this.showTheater = true;
            },
            _scrollerHandler(e) {
                let canLoadFlag = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <= 50;
                if (canLoadFlag && this.canLoad) {
                    this.canLoad = false;
                    this._loadMoreList();
                }
            },
            _loadMoreList() {
                this.pageData.page += 1;
                if (this.pageData.page > this.pageData.totalPage) return;
                let sendData = {};
                sendData.page = this.pageData.page;
                sendData.pageSize = this.pageData.pageSize;
                sendData.type = 2;
                this.$http.get('/staffPresence/getArticleList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.photo = [...this.photo, ...res.data];
                        this.pageData.totalPage = Math.ceil(res.totalCount / this.pageData.pageSize);
                    }
                }).finally(() => {
                    this.canLoad = true;
                });
            },
            _getPhotoList() {
                this.pageData.page = 1;
                this.canLoad = true;
                let sendData = {};
                sendData.page = this.pageData.page;
                sendData.pageSize = this.pageData.pageSize;
                sendData.type = 2;
                this.$http.get('/staffPresence/getArticleList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.photo = res.data;
                        this.pageData.totalPage = Math.ceil(res.totalCount / this.pageData.pageSize);
                    }
                });
            }
        },
        computed: {
            avatorPath () {
                return this.$store.state.user.userInfo.headimagepath;
            }
        },
        components: {
            FsPhotoTheater,
            FsWaterRows,
            createPhoto
        }
    };
</script>
