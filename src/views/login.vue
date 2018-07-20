<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <particles-bg></particles-bg>
        <div class="fs-login-block">
            <h1 class="title"><img src="../images/tianma_logo_new.png" style="position: relative;top: 3px;"/><span>欢迎登录天马人事系统</span></h1>
            <div class="fs-input-wrapper">
                <input class="fs-input" placeholder="用户名" v-model="form.userName"/>
            </div>
            <div class="fs-input-wrapper">
                <input class="fs-input" type="password" placeholder="密码" v-model="form.passWord"/>
            </div>
            <div class="fs-input-wrapper">
                <input class="fs-input" placeholder="验证码" v-model="form.code"/>
                <img src="/oa/login/geneCode"
                     id="validate-code-img"
                     @click="getCode"
                     ref="codeImg" style="cursor: pointer;"/>
            </div>
            <div class="" style="padding-top: 8px;width: 280px;color: #fff;">
                <Checkbox label="twitter" style="margin-bottom: 16px;font-size: 14px;" v-model="form.rememberMe" :true-value="1" :false-value="0">
                    <span>记住密码</span>
                </Checkbox>
            </div>
            <div class="fs-submit-btn" @click="handleSubmit">LOGIN</div>
        </div>
        <!--<div class="login-con">-->
            <!--<Card :bordered="false">-->
                <!--<p slot="title">-->
                    <!--<Icon type="log-in"></Icon>-->
                    <!--欢迎登录天马人事系统-->
                <!--</p>-->
                <!--<div class="form-con">-->
                    <!--<Form ref="loginForm" :model="form" :rules="rules">-->
                        <!--<FormItem prop="userName">-->
                            <!--<Input v-model="form.userName" placeholder="请输入用户名" size="large">-->
                                <!--<span slot="prepend">-->
                                    <!--<Icon :size="16" type="person"></Icon>-->
                                <!--</span>-->
                            <!--</Input>-->
                        <!--</FormItem>-->
                        <!--<FormItem prop="passWord">-->
                            <!--<Input type="password" v-model="form.passWord" placeholder="请输入密码" size="large">-->
                                <!--<span slot="prepend">-->
                                    <!--<Icon :size="14" type="locked"></Icon>-->
                                <!--</span>-->
                            <!--</Input>-->
                        <!--</FormItem>-->
                        <!--<FormItem prop="code">-->
                            <!--<Input v-model="form.code" placeholder="请输入验证码" size="large">-->
                            <!--<span slot="prepend">-->
                                    <!--<Icon :size="16" type="android-checkmark-circle"></Icon>-->
                                <!--</span>-->
                            <!--</Input>-->
                            <!--<img src="/oa/login/geneCode"-->
                                 <!--id="validate-code-img"-->
                                 <!--@click="getCode"-->
                                 <!--ref="codeImg" style="cursor: pointer;"/>-->
                        <!--</FormItem>-->
                        <!--<Checkbox label="twitter" style="margin-bottom: 16px;" v-model="form.rememberMe" :true-value="1" :false-value="0">-->
                            <!--<span>记住密码</span>-->
                        <!--</Checkbox>-->
                        <!--<FormItem>-->
                            <!--<Button @click="handleSubmit"-->
                                    <!--type="primary"-->
                                    <!--:loading="loading"-->
                                    <!--long size="large">-->
                                <!--<span v-if="!loading">登录</span>-->
                                <!--<span v-else>登录中...</span>-->
                            <!--</Button>-->
                        <!--</FormItem>-->
                    <!--</Form>-->
                <!--</div>-->
            <!--</Card>-->
        <!--</div>-->
        <div class="copy-right">
            <h2>TIAN MA OA 2.0</h2>
            <p style="margin-bottom: 8px;font-size: 16px">copyright © 2007-2018</p>
            <p style="font-size: 16px">江苏天马网络科技集团 版权所有</p>
        </div>
    </div>
</template>

<script>
import ParticlesBg from '@/baseComponents/particles-bg';
export default {
    components: {ParticlesBg},
    data () {
        return {
            loading: false,
            form: {
                userName: '',
                passWord: '',
                code: '',
                rememberMe: 0
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                code: [
                    {required: true, message: '验证码不能为空', trigger: 'blur'}
                ]
            }
        };
    },
    mounted() {
        this.getCode();
    },
    methods: {
        getCode() {
            let time = +(new Date());
            let picUrl = '/oa/login/geneCode?t=' + time;
            this.$refs.codeImg.setAttribute('src', picUrl);
        },
        handleSubmit () {
            if (!this.form.userName) {
                this.$Message.error('用户名不能为空!');
                return;
            }
            if (!this.form.passWord) {
                this.$Message.error('密码不能为空!');
                return;
            }
            if (!this.form.code) {
                this.$Message.error('验证码不能为空!');
                return;
            }
            this.$http.post('/login/login', this.form).then((res) => {
                if (res.success) {
                    const roelName = res.data[0].rolename
                    if (roelName !== '食堂') {
                        this.$router.push({
                            name: 'home_index'
                        });
                    } else {
                        this.$router.push({
                            name: 'foodPublic'
                        });
                    }
                }
            });
        }
    }
};
</script>
