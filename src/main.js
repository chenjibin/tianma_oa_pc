// const promiseFinally = require('promise.prototype.finally');
require('es6-promise').polyfill();
// import 'es6-promise/auto'
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// import ElementUI from 'element-ui';
import {Tree, Cascader, Checkbox} from 'element-ui';
import fsIcon from './baseComponents/fs-icon';
import router from './router/index';
import store from './store';
import App from './App.vue';
import i18n from '@/locale'
import request from './libs/request';
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/oa/upload/initListImage.png',
    attempt: 3,
    throttleWait: 1000
});
// Vue.use(VueI18n);
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
// Vue.use(ElementUI);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.component('fsIcon', fsIcon);
Vue.prototype.$http = request;
Vue.prototype.$mainHost = '';
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    methods: {
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})
