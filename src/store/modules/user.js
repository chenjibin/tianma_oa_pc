import store from '../index';
import axios from 'axios';
import Vue from 'vue';
const returnNeedLevelInfo = function (val) {
    const levelArr = [
        {
            number: 350,
            title: '热血青铜'
        },
        {
            number: 450,
            title: '不屈白银'
        },
        {
            number: 1300,
            title: '英勇黄金'
        },
        {
            number: 2700,
            title: '坚韧铂金'
        },
        {
            number: 4900,
            title: '不朽星钻'
        },
        {
            number: 7700,
            title: '荣耀皇冠'
        },
        {
            number: 11700,
            title: '超级王牌'
        },
        {
            number: 16500,
            title: '无敌战神'
        },
        {
            number: 100000000,
            title: '无敌'
        }
    ]
    for (let i = 1, length = levelArr.length; i <= length; i++) {
        if (levelArr[i].number > val) {
            let level = i;
            let levelDesc = levelArr[i - 1].title
            return {level, levelDesc}
        }
    }
}
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
        mustRead: [],
        level: 0,
        levelNumber: 0,
        levelDesc: '...'
    },
    getters: {
        level: state => state.level,
        levelNumber: state => state.levelNumber,
        levelDesc: state => state.levelDesc
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
                    if (!res.data.headimagepath) res.data.headimagepath = Vue.prototype.$mainHost + '/oa/upload/init/initHead.png';
                    res.data.headimagepath = Vue.prototype.$mainHost + '/oa/upload/head/' + res.data.headimagepath;
                    state.userInfo = res.data;
                    state.levelNumber = res.data.totalcoin;
                    if (state.userInfo.lv === 29) {
                        state.level = 8
                        state.levelDesc = '无敌战神'
                    } else {
                        let levelObj = returnNeedLevelInfo(state.levelNumber);
                        state.level = levelObj.level
                        state.levelDesc = levelObj.levelDesc
                    }
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
