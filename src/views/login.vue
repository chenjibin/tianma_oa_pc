<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <particles-bg></particles-bg>
        <!--<div class="fs-login-block">-->
            <!--<h1 class="title">欢迎登录天马人事系统</h1>-->

        <!--</div>-->
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录天马人事系统
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" size="large">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="passWord">
                            <Input type="password" v-model="form.passWord" placeholder="请输入密码" size="large">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Input v-model="form.code" placeholder="请输入验证码" size="large">
                            <span slot="prepend">
                                    <Icon :size="16" type="android-checkmark-circle"></Icon>
                                </span>
                            </Input>
                            <img src="/oa/login/geneCode"
                                 id="validate-code-img"
                                 @click="getCode"
                                 ref="codeImg" style="cursor: pointer;"/>
                        </FormItem>
                        <Checkbox label="twitter" style="margin-bottom: 16px;" v-model="form.rememberMe" :true-value="1" :false-value="0">
                            <span>记住密码</span>
                        </Checkbox>
                        <FormItem>
                            <Button @click="handleSubmit"
                                    type="primary"
                                    :loading="loading"
                                    long size="large">
                                <span v-if="!loading">登录</span>
                                <span v-else>登录中...</span>
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
        <h1 class="copy-right">
            TIAN MA OA 2.0
            <span style="font-size: 16px">copyright © 2007-2018 江苏天马网络科技集团 版权所有</span>
        </h1>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import MD5 from 'crypto-js/md5';
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
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$http.post('/login/login', this.form).then((res) => {
                        if (res.success) {
                            // Cookies.set('user', this.form.userName);
                            // Cookies.set('password', MD5(this.form.passWord).toString());
                            this.$router.push({
                                name: 'home_index'
                            });
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            });
        }
    }
};
</script>

<style>
    input:-webkit-autofill {
        background-color: #ffffff !important;
        background-image: none !important;
        color: #000;
    }

</style>
