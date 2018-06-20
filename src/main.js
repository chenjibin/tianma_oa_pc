/* eslint-disable */
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import {Tree, Cascader, Checkbox} from 'element-ui';
import fsIcon from './baseComponents/fs-icon';
import router from './router/index';
import store from './store';
import App from './app.vue';
import i18n from '@/locale'
import request from './libs/request';
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/oa/upload/initListImage.png',
    attempt: 3,
    throttleWait: 1000
});
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.component('fsIcon', fsIcon);
Vue.prototype.$http = request;
Vue.prototype.$mainHost = '';
Vue.config.productionTip = false;

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
