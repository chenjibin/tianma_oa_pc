import Cookies from 'js-cookie';
import store from '../index';
import axios from 'axios';

const user = {
    state: {
        userInfo: {
            headimagepath: '/oa/upload/init/initHead.png',
            realname: '...',
            tm_coin: '...',
            organizename: '...',
            postname: '...'
        },
        currentcompanyname: '',
        companyList: [],
        mustRead: []
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setCurrentCompanyName(state, name) {
            state.currentcompanyname = name;
        },
        getNoticeMustRead(state) {
            axios.get('/notice/mustRead').then((res) => {
                if (res.success) {
                    state.mustRead = res.data;
                }
            });
        },
        updateUserInfo(state) {
            axios.get('/user/myUserInfo').then((res) => {
                if (res.success) {
                    if (!res.data.headimagepath) res.data.headimagepath = '/oa/upload/init/initHead.png';
                    res.data.headimagepath = '/oa/upload/head/' + res.data.headimagepath;
                    state.userInfo = res.data;
                    if (+res.data.ismanger === 0 || +res.data.ismanger === 1) {
                        store.commit('getCompanyList');
                    }
                }
            });
        },
        getCompanyList(state) {
            axios.post('/company/lists').then((res) => {
                state.companyList = res.data;
                let cid = state.userInfo.companyid;
                for (let i = 0; i < res.data.length; i++) {
                    let item = res.data[i];
                    if (cid === item.id) {
                        state.currentcompanyname = item.name;
                        break;
                    }
                }
            });
        },
        logout () {
            axios.get('/login/logout').then((res) => {
                if (res.success) {
                    // Cookies.remove('user');
                    // Cookies.remove('userInfo');
                    // Cookies.remove('password');
                    store.commit('setPremissionMenu', []);
                    store.commit('clearAllTags');
                    window.location.reload();
                    // 恢复默认样式
                    let themeLink = document.querySelector('link[name="theme"]');
                    themeLink.setAttribute('href', '');
                    // 清空打开的页面等数据，但是保存主题数据
                    let theme = '';
                    if (localStorage.theme) {
                        theme = localStorage.theme;
                    }
                    localStorage.clear();
                    if (theme) {
                        localStorage.theme = theme;
                    }
                }
            });
        }
    }
};

export default user;
