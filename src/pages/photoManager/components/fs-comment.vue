<template>
    <div class="fs-comment-photo">
        <form class="comment-form">
            <a class="site-icon">
                <img :src="avatorPath"/>
            </a>
            <textarea placeholder="喜欢？摸着我的良心说两句…" v-model.trim="commentContent" ref="replyTextarea"></textarea>
            <div class="form-action">
                <span class="btn" @click="_submitComment" v-show="canComment">评论</span>
                <span class="btn" v-show="!canComment">提交中...</span>
            </div>
        </form>
        <ul class="comment-list">
            <li class="main-comment"
                v-for="item in commentList"
                :key="'comment-list-' + item.id">
                <div class="comment-content">
                    <a class="site-icon">
                        <img :src="item.headimagepath"/>
                    </a>
                    <p style="color: #fff;" class="name">{{item.username}}</p>
                    <p>{{item.content}}</p>
                    <div class="comment-foot">
                        <time>{{item.insert_time.split(' ')[0]}}</time>
                        <a class="" @click.stop="_replyComment(item)">回复</a>
                        <a class="delete" v-if="item.status" @click.stop="_removeCommentHandler(item.id)">删除</a>
                        <a class="like" @click.stop="_thumbComment(item)">
                            <Icon type="thumbsup" size="18" :color="item.thumbupid ? '#ff0036' : '#b0b5b8'"></Icon>
                            <span :style="{'color': item.thumbupid ? '#ff0036' : '#b0b5b8'}"
                                  v-if="item.thumb_up_times > 0">{{item.thumb_up_times}}</span>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list" v-if="item.childcomment.length">
                    <li class="vice-comment"
                        v-for="child in item.childcomment"
                        :key="'child-comment-' + child.id">
                        <div class="comment-content">
                            <span class="name">{{child.username}}</span>
                            <span v-if="child.to_username">回复</span>
                            <span class="name" v-if="child.to_username">{{child.to_username}}</span>
                            <span>{{child.content}}</span>
                        </div>
                        <div class="comment-foot">
                            <time>{{child.insert_time.split(' ')[0]}}</time>
                            <a class="" @click.stop="_innerReply(child)">回复</a>
                            <a class="delete" v-if="child.status" @click.stop="_removeCommentHandler(child.id)">删除</a>
                            <a class="like" @click.stop="_thumbComment(child)">
                                <Icon type="thumbsup" size="18" :color="child.thumbupid ? '#ff0036' : '#b0b5b8'"></Icon>
                                <span :style="{'color': child.thumbupid ? '#ff0036' : '#b0b5b8'}"
                                      v-if="child.thumb_up_times > 0">{{child.thumb_up_times}}</span>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<style lang="less">
    .fs-comment-photo {
        padding: 20px 15px 0 15px;
        .site-icon {
            position: absolute;
            left: 0;
            top: 0;
            width: 26px;
            height: 26px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .comment-form {
            position: relative;
            padding-left: 36px;
            .form-action {
                text-align: right;
                .btn {
                    display: inline-block;
                    padding: 6px 8px;
                    cursor: pointer;
                    color: #c99a05;
                    font-size: 14px;
                }
            }
            .site-icon {
                top: 3px;
            }
            textarea {
                height: 64px;
                padding: 7px 40px 9px 8px;
                font-size: 13px;
                border: 0;
                color: #fff;
                background-color: #1c1d1e;
                width: 100%;
                outline: 0;
                resize: vertical;
            }
        }
        .comment-list {
            .name {
                color: #fff;
            }
            li {
                position: relative;
                margin: 20px 0 0;
            }
            .main-comment {
                padding: 3px 0 4px 36px;
                font-size: 13px;
                color: #b0b5b8;
                .vice-comments-list {
                    border-left: 4px solid #85888a;
                    padding-left: 8px;
                    .vice-comment {
                        padding-left: 0;
                    }
                }
                .comment-foot {
                    margin-top: 4px;
                    position: relative;
                    font-size: 12px;
                    a {
                        color: #b0b5b8;
                    }
                    a.delete {
                        color: #e60a05;
                    }
                    a.like {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
            }
        }
    }

</style>
<script>
    export default {
        name: 'FsComment',
        props: {
            id: {
                type: Number
            }
        },
        data() {
            return {
                canComment: true,
                commentContent: '',
                preContent: '',
                toUserName: '',
                toUserId: null,
                hasLiked: true,
                pageData: {
                    page: 1,
                    pageSize: 100
                },
                parentId: 0,
                commentList: []
            };
        },
        computed: {
            avatorPath () {
                return this.$store.state.user.userInfo.headimagepath;
            }
        },
        watch: {
            'commentContent'(val) {
                if (this.parentId) {
                    if (val.length < this.preContent.length) {
                        this.commentContent = '';
                        this.preContent = '';
                        this.parentId = 0;
                        this._initToUserInfo();
                    }
                }
            }
        },
        created() {
            this._getCommentList();
        },
        methods: {
            _removeCommentHandler(id) {
                let sendData = {};
                sendData.id = id;
                this.$http.post('/staffPresence/deleteArticleComment', sendData).then((res) => {
                    if (res.success) {
                        this._getCommentList();
                    }
                });
            },
            _initToUserInfo() {
                this.toUserName = '';
                this.toUserId = null;
            },
            _getCommentList() {
                let sendData = {};
                sendData.articleId = this.id;
                sendData.page = this.pageData.page;
                sendData.pageSize = this.pageData.pageSize;
                this.$http.get('/staffPresence/getArticleCommentList', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.commentList = res.data;
                    }
                });
            },
            _innerReply(data) {
                this._initToUserInfo();
                this.preContent = `回复 ${data.username}:`;
                this.parentId = data.parent_id;
                this.commentContent = this.preContent;
                this.toUserName = data.username;
                this.toUserId = data.userid;
                this.$refs.replyTextarea.focus();
            },
            _replyComment(data) {
                this._initToUserInfo();
                this.preContent = `回复 ${data.username}:`;
                this.parentId = data.id;
                this.commentContent = this.preContent;
                this.$refs.replyTextarea.focus();
            },
            _submitComment() {
                let sendData = {};
                sendData.articleId = this.id;
                sendData.parentId = this.parentId;
                if (this.parentId) {
                    sendData.content = this.commentContent.replace(this.preContent, '');
                    console.log(this.commentContent.replace(this.preContent, ''));
                } else {
                    sendData.content = this.commentContent;
                }
                if (!sendData.content) {
                    this.$Message.error('评论内容不能为空!');
                    return;
                }
                if (this.toUserName) sendData.toUserName = this.toUserName;
                if (this.toUserId) sendData.toUserId = this.toUserId;
                this.canComment = false;
                this.$http.post('/staffPresence/addArticleComment', sendData).then((res) => {
                    if (res.success) {
                        this.commentContent = '';
                        this._initToUserInfo();
                        this._getCommentList();
                    }
                }).finally(() => {
                    this.canComment = true;
                });
            },
            _thumbComment(data) {
                if (data.thumbupid) {
                    let sendData = {};
                    sendData.id = data.thumbupid;
                    this.$http.post('/staffPresence/deleteThumbup', sendData).then((res) => {
                        if (res.success) {
                            this._getCommentList();
                        }
                    });
                } else {
                    let sendData = {};
                    sendData.articleId = data.article_id;
                    sendData.type = 1;
                    sendData.commentId = data.id;
                    this.$http.post('/staffPresence/addThumbup', sendData).then((res) => {
                        if (res.success) {
                            this._getCommentList();
                        }
                    });
                }
                console.log(data);
            }
        },
        components: {}
    };
</script>
