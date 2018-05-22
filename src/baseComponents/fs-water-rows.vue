<template>
    <div id="list-wrap">
        <div class="gallery-row"
             v-for="item in photoRows">
            <div class="gallery-item-wrapper"
                 :key="'photo-' + photo.id"
                 v-for="photo in item.photos">
                <div class="gallery-item" :style="{'height': item.height}">
                    <img class="gallery-image" v-lazy="$mainHost + photo.files[0].file_path" v-if="photo.files[0]"/>
                    <div class="mask" @click.stop="galleryItemClickHandler(photo)">
                        <div class="user-info">
                            <img :src="$mainHost + photo.headimagepath" class="user-head"/>
                            <span class="user-name">{{photo.insert_username}}</span>
                        </div>
                        <div class="photo-title">
                            <p style="margin-bottom: 8px;font-size: 16px;font-weight: 700;">{{photo.item}}</p>
                            <span>{{photo.detail}}</span>
                        </div>
                        <div class="tool-show">
                            <div class="item">
                                <Icon type="heart" color="rgba(255,255,255,0.8)" size="20"></Icon>
                                <span style="color: rgba(255,255,255,0.8)">{{photo.thumb_up_times}}</span>
                            </div>
                            <div class="item">
                                <Icon type="chatbox" color="rgba(255,255,255,0.8)" size="20"></Icon>
                                <span style="color: rgba(255,255,255,0.8)">{{photo.share_comment_times}}</span>
                            </div>
                        </div>
                    </div>
                    <span class="img-number" v-if="photo.files.length > 1">组图 {{photo.files.length}} 张</span>
                </div>
                <div class="info-foot" style="padding: 12px 8px">
                    <div class="user-info">
                        <img :src="$mainHost + photo.headimagepath" class="user-head"/>
                        <span class="user-name">{{photo.insert_username}}</span>
                    </div>
                    <div class="tool-show">
                        <div class="item">
                            <Icon type="heart" color="#666" size="20"></Icon>
                            <span style="color: #666">{{photo.thumb_up_times}}</span>
                        </div>
                        <div class="item">
                            <Icon type="chatbox" color="#666" size="20"></Icon>
                            <span style="color: #666">{{photo.share_comment_times}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .gallery-row {
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 8px;
    }
    .gallery-item-wrapper {
        display: inline-block;
        position: relative;
        height: 100%;
        margin: 0 4px;
        background-color: #fff;
        .info-foot {
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .tool-show {
                display: flex;
                align-items: center;
                color: #666;
                font-size: 14px;
                .item {
                    margin-left: 16px;
                }
            }
            .user-info {
                display: flex;
                flex: 1;
                align-items: center;
                .user-name {
                    font-size: 14px;
                    font-weight: 700;
                    margin-left: 8px;
                    flex: 1;
                }
                .user-head {
                    flex: 0 0 48px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                }
            }
        }
        &:hover .mask {
            opacity: 1;
        }
        .mask {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            padding: 16px;
            background-color: rgba(0,0,0,0.6);
            color: rgba(255,255,255,0.8);
            opacity: 0;
            transition: opacity 0.5s;
            &:hover {
                cursor: zoom-in;
            }
            .tool-show {
                display: flex;
                font-size: 14px;
                .item {
                    margin-right: 16px;
                }
            }
            .photo-title {
                font-size: 14px;
                color: rgba(255,255,255,0.8);
                white-space: normal;
            }
            .user-info {
                display: flex;
                align-items: center;
            }
            .user-name {
                margin-left: 8px;
                font-size: 14px;
                font-weight: 700;
            }
            .user-head {
                width: 48px;
                height: 48px;
                border-radius: 50%;
            }
        }
        .img-number {
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 9;
            display: inline-block;
            padding: 6px 8px;
            font-size: 14px;
            color: rgba(255,255,255,0.8);
            background-color: rgba(0,0,0,0.6);
        }
    }
    .gallery-item {
        position: relative;
    }
    .gallery-image {
        height: 100%;
    }
</style>
<script>
    import {on, off} from '@/libs/dom';
    export default {
        name: 'FsWaterRows',
        props: {
            photos: {
                type: Array,
                default: () => []
            },
            padding: {
                type: Number,
                default: 8
            },
            minHeight: {
                type: Number,
                default: 400
            }
        },
        data() {
            return {
                photoRows: []
            };
        },
        watch: {
            photos(val) {
                this._getRows(val);
            }
        },
        mounted() {
            this._getRows(this.photos);
            on(window, 'resize', () => {
                this._getRows(this.photos);
            });
        },
        destroyed() {
            off(window, 'resize');
        },
        methods: {
            galleryItemClickHandler(photo) {
                this.$emit('item-click', photo);
            },
            _getRows(photos) {
                let aspectRatio = 0;
                let rows = [];
                let _photos = [];

                for (let i = 0, plength = photos.length; i < plength; i++) {
                    _photos.push(photos[i]);
                    aspectRatio += photos[i].files[0].image_width / photos[i].files[0].image_height;
                    if (aspectRatio > (this.$el.clientWidth / this.minHeight)) {
                        let totalWidth = this.$el.clientWidth - (_photos.length - 1) * this.padding;
                        rows.push({
                            photos: _photos,
                            height: parseInt(totalWidth / aspectRatio) + 'px'
                        });
                        _photos = [];
                        aspectRatio = 0;
                    }
                    if (i === (photos.length - 1) && _photos.length) {
                        rows.push({
                            photos: _photos,
                            height: this.minHeight - 20 + 'px'
                        });
                    }
                }
                this.photoRows = rows;
            }
        }
    };
</script>
