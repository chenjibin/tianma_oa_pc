<template>
    <div class="fs-comment-photo">
        <form class="comment-form">
            <a class="site-icon">
                <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
            </a>
            <textarea placeholder="楼主辛苦了，我想说两句…"></textarea>
            <div class="form-action">
                <div class="">评论</div>
            </div>
        </form>
        <ul class="comment-list">
            <li class="main-comment">
                <div class="comment-content">
                    <a class="site-icon">
                        <img src="https://s1.tuchong.com/sites/344/3446572/logo_small.jpg?1" />
                    </a>
                    <p>构图很好，很有想法.</p>
                    <div class="comment-foot">
                        <time>5月4日</time>
                        <a class="">回复</a>
                        <a class="delete">删除</a>
                        <a class="like">
                            <Icon type="thumbsup"></Icon>
                        </a>
                    </div>
                </div>
                <ul class="vice-comments-list">
                    <li class="vice-comment">
                        <div class="comment-content">
                            <span>ssss</span>
                            <span>回复</span>
                            <span>是是是</span>
                            <span>谢谢</span>
                        </div>
                        <div class="comment-foot">
                            <time>5月4日</time>
                            <a class="">回复</a>
                            <a class="delete">删除</a>
                            <a class="like">
                                <Icon type="thumbsup"></Icon>
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
            return {};
        },
        components: {}
    };
</script>
