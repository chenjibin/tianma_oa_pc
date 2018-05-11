<template>
    <div class="fs-comment-photo">
        <form class="comment-form">
            <a class="site-icon">
                <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1"/>
            </a>
            <textarea placeholder="喜欢？摸着我的良心说两句…"></textarea>
            <div class="form-action">
                <span class="btn" @click="_submitComment">评论</span>
            </div>
        </form>
        <ul class="comment-list">
            <li class="main-comment">
                <div class="comment-content">
                    <a class="site-icon">
                        <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
                    </a>
                    <p style="color: #fff;" class="name">我的一天成绩</p>
                    <p>构图很好，很有想法.</p>
                    <div class="comment-foot">
                        <time>5月4日</time>
                        <a class="">回复</a>
                        <a class="delete">删除</a>
                        <a class="like" @click="_thumbComment">
                            <Icon type="thumbsup" size="18" :color="hasLiked ? '#ff0036' : '#b0b5b8'"></Icon>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list">
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18" :color="hasLiked ? '#ff0036' : '#b0b5b8'"></Icon>
                                <span :style="{'color': hasLiked ? '#ff0036' : '#b0b5b8'}">13</span>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="main-comment">
                <div class="comment-content">
                    <a class="site-icon">
                        <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
                    </a>
                    <p style="color: #fff;" class="name">我的一天成绩</p>
                    <p>构图很好，很有想法.</p>
                    <div class="comment-foot">
                        <time>5月4日</time>
                        <a class="">回复</a>
                        <a class="delete">删除</a>
                        <a class="like">
                            <Icon type="thumbsup" size="18"></Icon>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list">
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18" ></Icon>
                                <span>13</span>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="main-comment">
                <div class="comment-content">
                    <a class="site-icon">
                        <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
                    </a>
                    <p style="color: #fff;" class="name">我的一天成绩</p>
                    <p>构图很好，很有想法.</p>
                    <div class="comment-foot">
                        <time>5月4日</time>
                        <a class="">回复</a>
                        <a class="delete">删除</a>
                        <a class="like" @click="_thumbComment">
                            <Icon type="thumbsup" size="18" :color="hasLiked ? '#ff0036' : '#b0b5b8'"></Icon>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list">
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18" :color="hasLiked ? '#ff0036' : '#b0b5b8'"></Icon>
                                <span :style="{'color': hasLiked ? '#ff0036' : '#b0b5b8'}">13</span>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="main-comment">
                <div class="comment-content">
                    <a class="site-icon">
                        <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
                    </a>
                    <p style="color: #fff;" class="name">我的一天成绩</p>
                    <p>构图很好，很有想法.</p>
                    <div class="comment-foot">
                        <time>5月4日</time>
                        <a class="">回复</a>
                        <a class="delete">删除</a>
                        <a class="like">
                            <Icon type="thumbsup" size="18"></Icon>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list">
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18" ></Icon>
                                <span>13</span>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
                            </a>
                        </div>
                    </li>
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span class="name">ssss</span>
                            <span>回复</span>
                            <span class="name">是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup" size="18"></Icon>
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
        data() {
            return {
                hasLiked: true
            };
        },
        methods: {
            _submitComment() {
            },
            _thumbComment() {
                this.hasLiked = !this.hasLiked;
            }
        },
        components: {}
    };
</script>
