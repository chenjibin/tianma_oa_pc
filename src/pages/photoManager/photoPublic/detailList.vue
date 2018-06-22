<template>
    <div id="photo-detail-list" @scroll="_scrollerHandler">
        <div class="banner">
            <div class="bg-header-large">
                <img :src="$mainHost + themeDetail.file_path" v-if="themeDetail.file_path">
            </div>
            <div class="info">
                <div class="detail">
                    <div class="detail-partial">
                        <h3>介绍</h3>
                        <div class="detail-desc">
                            <div class="desc">{{themeDetail.detail}}</div>
                        </div>
                    </div>
                </div>
                <div class="handler">
                    <div>
                        距离结束还有<span style="font-size: 18px;color: #d3ad34;font-weight: 700;"> {{themeDetail.end_day}} </span>天
                    </div>
                    <div style="margin-top: 16px">
                        主办方: <span>{{themeDetail.host_unit}}</span>
                    </div>
                    <div style="margin-top: 16px">
                        奖励说明: <span>{{themeDetail.award}}</span>
                    </div>
                    <a href="javascript:void(0)" class="publish-btn" @click.stop="_createPhoto">创建作品</a>
                </div>
            </div>
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
            :product-id="productId"
            @update-list="_getPhotoList($route.params.id)"
            v-if="showTheater"
            @close-theater="showTheater = false"></fs-photo-theater>
        <create-photo @close="showCreate = false" v-if="showCreate" @add-success="_photoAddSuccess"></create-photo>
    </div>
</template>
<style lang="less" scoped>
    #photo-detail-list {
        position: absolute;
        top: 60px;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        .banner {
            .bg-header-large {
                margin-bottom: 40px;
                img {
                    display: block;
                    width: 100%;
                }
            }
            .info {
                position: relative;
                margin: 0 40px 16px;
                overflow: hidden;
                font-size: 16px;
                line-height: 1.85;
                .detail {
                    overflow: hidden;
                    background: #fff;
                    padding: 40px;
                    margin-right: 391px;
                    min-height: 224px;
                    .detail-partial {
                        h3 {
                            letter-spacing: 10px;
                            line-height: 22px;
                            margin: 0;
                            margin-bottom: 25px;
                            font-size: 16px;
                        }
                        .detail-desc {
                            font-size: 13px;
                            position: relative;
                            display: flex;
                            align-items: center;
                            word-break: break-all;
                            min-height: 116px;
                            .desc {
                                flex: 1;
                                word-break: break-all;
                            }
                        }
                    }
                }
                .handler {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 367px;
                    line-height: 22px;
                    padding: 40px 29px 0;
                    background: #fff;
                    .publish-btn {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 48px;
                        line-height: 48px;
                        letter-spacing: 10px;
                        text-indent: 10px;
                        text-align: center;
                        color: #fff;
                        background-color: #c99a05cf;
                        transition: background-color 0.3s;
                        &:hover {
                            background-color: #c99a05;
                        }
                    }
                }
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
        name: 'photoDetailList',
        data() {
            return {
                showTheater: false,
                showCreate: false,
                canLoad: true,
                themeDetail: {},
                id: null,
                pageData: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0
                },
                photo: []
            };
        },
        methods: {
            _waterItemClickHandler(data) {
                this.productId = data.id;
                this.showTheater = true;
            },
            _createPhoto() {
                this.showCreate = true;
            },
            _photoAddSuccess() {
                this._getPhotoList(this.id);
                this.showCreate = false;
            },
            _getThemeDetail(id) {
                let sendData = {};
                sendData.id = id;
                this.$http.get('/staffPresence/getStaffPresenceDetail', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.themeDetail = res.data;
                    }
                });
            },
            _loadMoreList() {
                this.pageData.page += 1;
                if (this.pageData.page > this.pageData.totalPage) return;
                let sendData = {};
                sendData.page = this.pageData.page;
                sendData.pageSize = this.pageData.pageSize;
                sendData.staffPresenceId = this.id;
                sendData.type = 0;
                this.$http.get('/staffPresence/getArticleList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.photo = [...this.photo, ...res.data];
                        this.pageData.totalPage = Math.ceil(res.totalCount / this.pageData.pageSize);
                    }
                }).finally(() => {
                    this.canLoad = true;
                });
            },
            _scrollerHandler(e) {
                let canLoadFlag = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <= 50;
                if (canLoadFlag && this.canLoad) {
                    this.canLoad = false;
                    this._loadMoreList();
                }
            },
            _getPhotoList(id) {
                this.pageData.page = 1;
                this.canLoad = true;
                let sendData = {};
                sendData.page = this.pageData.page;
                sendData.pageSize = this.pageData.pageSize;
                sendData.staffPresenceId = id;
                sendData.type = 0;
                this.$http.get('/staffPresence/getArticleList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.photo = res.data;
                        this.pageData.totalPage = Math.ceil(res.totalCount / this.pageData.pageSize);
                    }
                });
            }
        },
        activated() {
            let staffPresenceId = this.$route.params.id;
            this.id = staffPresenceId;
            this._getThemeDetail(staffPresenceId);
            this._getPhotoList(staffPresenceId);
        },
        components: {
            FsPhotoTheater,
            FsWaterRows,
            createPhoto
        }
    };
</script>
