/* eslint-disable */
require('es6-promise').polyfill();
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'wangeditor/release/wangEditor.css';
import 'animate.css';
import { Tree, Cascader, Checkbox} from 'element-ui';
import fsIcon from './baseComponents/fs-icon';
import { router } from './router/index';
import store from './store';
import '@/locale';
import App from './app.vue';
import VueI18n from 'vue-i18n';
import request from './libs/request';
import VueLazyload from 'vue-lazyload';
import FsNotice from '@/baseComponents/fs-notice';

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/oa/upload/initListImage.png',
    attempt: 3,
    throttleWait: 300
});
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.component('fsIcon', fsIcon);
Vue.prototype.$FsNotice = FsNotice;
Vue.prototype.$http = request;
Vue.prototype.$mainHost = '';
Vue.config.productionTip = false;
Vue.config.keyCodes = {
    f11: 122
};
if (process.env.NODE_ENV !== 'production') {
    const Mock = require('mockjs');
    Vue.prototype.$mock = Mock;
}
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
});
