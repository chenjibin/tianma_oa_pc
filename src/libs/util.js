import axios from 'axios';
import semver from 'semver';
import packjson from '../../package.json';
import store from '../store';
import {appRouter, page404} from '../router/router';

let util = {

};
util.title = function (title) {
    title = title || '天马人事系统';
    window.document.title = title;
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, to, route, next) {
    if (!to.meta.whiteIn) {
        let aa = setInterval(function () {
            if (store.state.app.premissionMenuStringLoaded) {
                if (!(store.state.app.premissionMenuString.indexOf(to.name || to.path.split('/')[to.path.split('/').length - 1]) > -1)) {
                    next({
                        name: 'error-403'
                    });
                } else {
                    let len = routers.length;
                    let i = 0;
                    let notHandle = true;
                    while (i < len) {
                        if (routers[i].name === to.name && routers[i].children && routers[i].redirect === undefined) {
                            route.replace({
                                name: routers[i].children[0].name
                            });
                            notHandle = false;
                            next();
                            break;
                        }
                        i++;
                    }
                    if (!to.name) {
                        next({
                            name: localStorage.currentPageName || 'home_index'
                        });
                    }
                    if (notHandle) {
                        next();
                    }
                }
                clearInterval(aa);
            }
        }, 10);
    } else {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};

util.getNeedRouter = function (routeData) {
    let storePressionString = [];
    appRouter.forEach((item) => {
        item.children = item.children.filter((val) => {
            for (let i = 0, length = routeData.length; i < length; i++) {
                if (val.name === routeData[i].name) {
                    storePressionString.push(val.name);
                    let obj = {};
                    obj.id = routeData[i].id;
                    obj.btn = routeData[i].btn || [];
                    val.meta = Object.assign(val.meta || {}, obj);
                    return true;
                }
            }
        });
    });
    store.commit('setPremissionMenuString', storePressionString);
    return appRouter.filter(val => val.children.length > 0);
};

util.initMenu = function (router, store, routeData) {
    let syncRouterAll = util.getNeedRouter(routeData);
    router.addRoutes(syncRouterAll.concat([page404]));
    let tagsList = [];
    syncRouterAll.map((item) => {
        if (item.children.length <= 1) {
            tagsList.push(item.children[0]);
        } else {
            tagsList.push(...item.children);
        }
    });
    store.commit('setTagsList', tagsList);
    store.commit('setRouters', syncRouterAll);
    store.commit('setPremissionMenu', syncRouterAll);
    store.commit('updateMenulist');
};
util.getPermissionData = function() {
    return new Promise((resolve, reject) => {
        axios.get('/jurisdiction/getMyMenu').then((res) => {
            resolve(res.data);
        });
    });
};

util.delHtmlTag = function (str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp[;]/g, '');
};

util.downloadFile = function (url, name) {
    let downloadDom = document.createElement('a');
    downloadDom.href = url;
    downloadDom.download = name;
    downloadDom.style.display = 'none';
    document.body.appendChild(downloadDom);
    downloadDom.click();
    document.body.removeChild(downloadDom);
};
export default util;
