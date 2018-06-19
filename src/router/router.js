import Main from '@/views/Main.vue';
import knowledgeMain from '@/pages/knowledgeManage/knowledgePublic/route.vue';
import knowledgeIndex from '@/pages/knowledgeManage/knowledgePublic/index.vue';
import photoMain from '@/pages/photoManager/photoPublic/main.vue';
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录',
        white: true
    },
    component: () => import('@/views/login.vue')
};
export const guestRouter = {
    path: '/guest',
    name: 'guest',
    meta: {
        title: '社会招聘',
        white: true
    },
    component: () => import('@/pages/hireManager/guest/index.vue')
};
export const inExamRouter = {
    path: '/inExam/testPaperId/:testPaperId/testId/:testId',
    name: 'inExam',
    meta: {
        whiteIn: true
    },
    component: () => import('@/pages/myExam/in-exam-page.vue')
};
export const knowledgeRouter = {
    path: '/knowledgePublic',
    title: '知识库',
    name: 'knowledgePublic',
    component: knowledgeMain,
    children: [
        {
            path: 'article/:id',
            name: 'articleDetail',
            meta: {
                whiteIn: true
            },
            component: () => import('@/pages/knowledgeManage/knowledgePublic/article.vue')
        },
        {
            path: 'index',
            name: 'articleIndex',
            title: '知识库',
            meta: {
                whiteIn: true
            },
            component: knowledgeIndex,
            children: [
                {
                    path: 'home',
                    name: 'articleHome',
                    meta: {
                        whiteIn: true
                    },
                    component: () => import('@/pages/knowledgeManage/knowledgePublic/home.vue')
                },
                {
                    path: 'list',
                    name: 'articleList',
                    meta: {
                        whiteIn: true
                    },
                    component: () => import('@/pages/knowledgeManage/knowledgePublic/list.vue')
                }
            ]
        }
    ]
};
export const photoRouter = {
    path: '/photoPublic',
    title: '员工风采',
    name: 'photoPublic',
    component: photoMain,
    children: [
        {
            path: 'list',
            name: 'photoList',
            meta: {
                whiteIn: true
            },
            component: () => import('@/pages/photoManager/photoPublic/list.vue')
        },
        {
            path: 'detailList/:id',
            name: 'photoDetailList',
            meta: {
                whiteIn: true
            },
            component: () => import('@/pages/photoManager/photoPublic/detailList.vue')
        },
        {
            path: 'myPhoto',
            name: 'myPhoto',
            meta: {
                whiteIn: true
            },
            component: () => import('@/pages/photoManager/photoPublic/myPhoto.vue')
        }
    ]
};
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在',
        whiteIn: true
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足',
        whiteIn: true
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误',
        white: true
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        whiteIn: true
    },
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            title: '首页',
            meta: {
                whiteIn: true
            },
            name: 'home_index',
            component: () => import('@/pages/home/index.vue')
        },
        {
            path: 'myLog',
            title: '我的日志',
            meta: {
                whiteIn: true
            },
            name: 'myLog',
            component: () => import('@/pages/myLog/index.vue')
        },
        {
            path: 'myAttendance',
            title: '我的考勤',
            meta: {
                whiteIn: true
            },
            name: 'myAttendance',
            component: () => import('@/pages/myAttendance/index.vue')
        },
        {
            path: 'myLeave',
            title: '我的请假',
            meta: {
                whiteIn: true
            },
            name: 'myLeave',
            component: () => import('@/pages/myLeave/index.vue')
        },
        {
            path: 'myArrange',
            title: '我的排班',
            meta: {
                whiteIn: true
            },
            name: 'myArrange',
            component: () => import('@/pages/myArrange/index.vue')
        },
        {
            path: 'myExam',
            title: '我的考试',
            meta: {
                whiteIn: true
            },
            name: 'myExam',
            component: () => import('@/pages/myExam/index.vue')
        },
        {
            path: 'assetsApply',
            meta: {
                whiteIn: true
            },
            name: 'assetsApply',
            title: '我的资产',
            component: () => import('@/pages/assetsManager/assetsApply/index.vue')
        },
        {
            path: 'coinShop',
            title: '金币商城',
            meta: {
                whiteIn: true
            },
            name: 'coinShop',
            component: () => import('@/pages/coinManage/coinShop/index.vue')
        },
        {
            path: 'myTrain',
            title: '我的培训',
            meta: {
                whiteIn: true
            },
            name: 'myTrain',
            component: () => import('@/pages/myTrain/index.vue')
        }
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/logManage',
        icon: 'compose',
        name: 'logManage',
        title: '工作日志管理',
        component: Main,
        children: [
            {
                path: 'elogManage',
                icon: 'compose',
                name: 'elogManage',
                title: '员工日志管理',
                component: () => import('@/pages/logManage/elogManage/index.vue')
            },
            {
                path: 'logTotal',
                icon: 'compose',
                name: 'logTotal',
                title: '日志统计',
                component: () => import('@/pages/logManage/logTotal/index.vue')
            }
        ]
    },
    {
        path: '/attendanceAndLeave',
        icon: 'ios-folder-outline',
        name: 'attendanceAndLeave',
        title: '考勤请假管理',
        component: Main,
        children: [
            {
                path: 'attendanceManage',
                icon: 'ios-folder-outline',
                name: 'attendanceManage',
                title: '考勤管理',
                component: () => import('@/pages/attendanceAndLeave/attendanceManage')
            },
            {
                path: 'leaveApproval',
                icon: 'ios-folder-outline',
                name: 'leaveApproval',
                title: '请假审批',
                component: () => import('@/pages/attendanceAndLeave/leaveApproval')
            },
            {
                path: 'leaveManage',
                icon: 'ios-folder-outline',
                name: 'leaveManage',
                title: '请假管理',
                component: () => import('@/pages/attendanceAndLeave/leaveManage')
            },
            {
                path: 'depAttendance',
                icon: 'ios-folder-outline',
                name: 'depAttendance',
                title: '部门考勤',
                component: () => import('@/pages/attendanceAndLeave/depAttendance')
            },
            {
                path: 'depArrange',
                icon: 'ios-folder-outline',
                name: 'depArrange',
                title: '部门排班信息',
                component: () => import('@/pages/attendanceAndLeave/depArrange')
            }
        ]
    },
    {
        path: '/employeeFileManager',
        icon: 'ios-bookmarks',
        name: 'employeeFileManager',
        title: '员工档案管理',
        component: Main,
        children: [
            {
                path: 'employeeAchives',
                icon: 'ios-bookmarks',
                name: 'employeeAchives',
                title: '员工档案',
                component: () => import('@/pages/employeeFileManager/employeeAchives')
            },
            {
                path: 'employeeOrganize',
                icon: 'ios-bookmarks',
                name: 'employeeOrganize',
                title: '部门员工档案',
                component: () => import('@/pages/employeeFileManager/employeeOrganize')
            }
        ]
    },
    {
        path: '/hireManager',
        icon: 'ios-people',
        name: 'hireManager',
        title: '招聘管理',
        component: Main,
        children: [
            {
                path: 'hire',
                icon: 'ios-people',
                name: 'hire',
                title: '员工招聘',
                component: () => import('@/pages/hireManager/hire')
            },
            {
                path: 'position',
                icon: 'ios-people',
                name: 'position',
                title: '岗位设置',
                component: () => import('@/pages/hireManager/position')
            },
            {
                path: 'statistics',
                icon: 'ios-people',
                name: 'statistics',
                title: '数据统计',
                component: () => import('@/pages/hireManager/statistics')
            }
        ]
    },
    {
        path: '/assetsManager',
        icon: 'printer',
        name: 'assetsManager',
        title: '资产管理',
        component: Main,
        children: [
            {
                path: 'assetsRegister',
                icon: 'printer',
                name: 'assetsRegister',
                title: '资产查询/管理',
                component: () => import('@/pages/assetsManager/assetsRegister')
            },

            {
                path: 'assetsBuyApprove',
                icon: 'printer',
                name: 'assetsBuyApprove',
                title: '资产采购/报废审批',
                component: () => import('@/pages/assetsManager/assetsBuyApprove')
            },
            {
                path: 'assetsAllocation',
                icon: 'printer',
                name: 'assetsAllocation',
                title: '资产调拨',
                component: () => import('@/pages/assetsManager/assetsAllocation')
            },
            {
                path: 'assetsBuyManager',
                icon: 'printer',
                name: 'assetsBuyManager',
                title: '资产采购清单',
                component: () => import('@/pages/assetsManager/assetsBuyManager')
            },
            {
                path: 'assetslocation',
                icon: 'printer',
                name: 'assetslocation',
                title: '资产位置',
                component: () => import('@/pages/assetsManager/assetLocation')
            },
            {
                path: 'assetsCategory',
                icon: 'printer',
                name: 'assetsCategory',
                title: '资产分类',
                component: () => import('@/pages/assetsManager/assetsCategory')
            }
        ]
    },
    {
        path: '/examination',
        icon: 'university',
        name: 'examination',
        title: '考试管理',
        component: Main,
        children: [
            {
                path: 'examinationManage',
                icon: 'university',
                name: 'examinationManage',
                title: '考试管理',
                component: () => import('@/pages/examination/examinationManage')
            },
            {
                path: 'questionManage',
                icon: 'university',
                name: 'questionManage',
                title: '试题管理',
                component: () => import('@/pages/examination/questionManage')
            },
            {
                path: 'paperManage',
                icon: 'university',
                name: 'paperManage',
                title: '试卷管理',
                component: () => import('@/pages/examination/paperManage')
            },
            {
                path: 'gradeManage',
                icon: 'university',
                name: 'gradeManage',
                title: '成绩管理',
                component: () => import('@/pages/examination/gradeManage')
            },
            {
                path: 'depGrade',
                icon: 'university',
                name: 'depGrade',
                title: '部门成绩',
                component: () => import('@/pages/examination/depGrade')
            },
            {
                path: 'peopleCheck',
                icon: 'university',
                name: 'peopleCheck',
                title: '人工阅卷',
                component: () => import('@/pages/examination/peopleCheck')
            },
            {
                path: 'examinationCategory',
                icon: 'university',
                name: 'examinationCategory',
                title: '分类管理',
                component: () => import('@/pages/examination/examinationCategory')
            }
        ]
    },
    {
        path: '/trainManage',
        icon: 'ribbon-a',
        name: 'trainManage',
        title: '培训管理',
        component: Main,
        children: [
            {
                path: 'trainPlanManage',
                icon: 'ribbon-a',
                name: 'trainPlanManage',
                title: '培训计划管理',
                component: () => import('@/pages/trainManage/trainPlanManage')
            },
            {
                path: 'internalTrainerManage',
                icon: 'ribbon-a',
                name: 'internalTrainerManage',
                title: '内训师管理',
                component: () => import('@/pages/trainManage/internalTrainerManage')
            },
            {
                path: 'curriculumManage',
                icon: 'ribbon-a',
                name: 'curriculumManage',
                title: '课程管理',
                component: () => import('@/pages/trainManage/curriculumManage')
            },
            {
                path: 'classRecheckManage',
                icon: 'ribbon-a',
                name: 'classRecheckManage',
                title: '课程复盘管理',
                component: () => import('@/pages/trainManage/classRecheckManage')
            },
            {
                path: 'tickRecheckManage',
                icon: 'ribbon-a',
                name: 'tickRecheckManage',
                title: '周期复盘管理',
                component: () => import('@/pages/trainManage/tickRecheckManage')
            },
            {
                path: 'creditManage',
                icon: 'ribbon-a',
                name: 'creditManage',
                title: '学分管理',
                component: () => import('@/pages/trainManage/creditManage')
            }
        ]
    },
    {
        path: '/coinManage',
        icon: 'ios-pricetags',
        name: 'coinManage',
        title: '金币管理',
        component: Main,
        children: [
            {
                path: 'coinRecord',
                icon: 'ios-pricetags',
                name: 'coinRecord',
                title: '金币记录',
                component: () => import('@/pages/coinManage/coinRecord')
            },
            {
                path: 'coinStatistics',
                icon: 'ios-pricetags',
                name: 'coinStatistics',
                title: '金币分类统计',
                component: () => import('@/pages/coinManage/coinStatistics')
            },
            {
                path: 'goodsManage',
                icon: 'ios-pricetags',
                name: 'goodsManage',
                title: '商品管理',
                component: () => import('@/pages/coinManage/goodsManage')
            },
            {
                path: 'prizeManage',
                icon: 'ios-pricetags',
                name: 'prizeManage',
                title: '奖品管理',
                component: () => import('@/pages/coinManage/prizeManage')
            },
            {
                path: 'goodsExchangeManage',
                icon: 'ios-pricetags',
                name: 'goodsExchangeManage',
                title: '兑换管理',
                component: () => import('@/pages/coinManage/goodsExchangeManage')
            }
        ]
    },
    {
        path: '/knowledgeManage',
        icon: 'ios-book',
        name: 'knowledgeManage',
        title: '知识库管理',
        component: Main,
        children: [
            {
                path: 'knowledgeSetting',
                icon: 'ios-book',
                name: 'knowledgeSetting',
                title: '知识库设置',
                component: () => import('@/pages/knowledgeManage/knowledgeSetting')
            },
            {
                path: 'myKnowledge',
                icon: 'ios-book',
                name: 'myKnowledge',
                title: '我的知识',
                component: () => import('@/pages/knowledgeManage/myKnowledge')
            }
        ]
    },
    {
        path: '/photoManage',
        icon: 'images',
        name: 'photoManage',
        title: '员工风采管理',
        component: Main,
        children: [
            {
                path: 'photoSetting',
                icon: 'images',
                name: 'photoSetting',
                title: '活动设置',
                component: () => import('@/pages/photoManager/photoSetting')
            }
        ]
    },
    {
        path: '/systemManage',
        icon: 'ios-gear',
        name: 'systemManage',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'organizationManage',
                icon: 'ios-gear',
                name: 'organizationManage',
                title: '组织管理',
                component: () => import('@/pages/systemManage/organizationManage')
            },
            {
                path: 'roleManage',
                icon: 'ios-gear',
                name: 'roleManage',
                title: '角色管理',
                component: () => import('@/pages/systemManage/roleManage')
            },
            {
                path: 'levelManage',
                icon: 'ios-gear',
                name: 'levelManage',
                title: '职级管理',
                component: () => import('@/pages/systemManage/levelManage')
            },
            {
                path: 'userManage',
                icon: 'ios-gear',
                name: 'userManage',
                title: '用户管理',
                component: () => import('@/pages/systemManage/userManage')
            },
            {
                path: 'postManage',
                icon: 'ios-gear',
                name: 'postManage',
                title: '岗位管理',
                component: () => import('@/pages/systemManage/postManage')
            },
            {
                path: 'noticeManage',
                icon: 'ios-gear',
                name: 'noticeManage',
                title: '公告管理',
                component: () => import('@/pages/systemManage/noticeManage')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    guestRouter,
    knowledgeRouter,
    photoRouter,
    inExamRouter,
    locking,
    page500,
    page403
];
