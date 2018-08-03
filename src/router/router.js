import Main from '@/pages/main/index.vue';
import knowledgeMain from '@/pages/knowledgeManage/knowledgePublic/route.vue';
import knowledgeIndex from '@/pages/knowledgeManage/knowledgePublic/index.vue';
import photoMain from '@/pages/photoManager/photoPublic/main.vue';
function loadView(url) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/pages/${url}`)
}
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录',
        white: true
    },
    component: loadView('login/index.vue')
};
export const guestRouter = {
    path: '/guest',
    name: 'guest',
    meta: {
        title: '社会招聘',
        white: true
    },
    component: loadView('hireManager/guest/index.vue')
};
export const inExamRouter = {
    path: '/inExam/testPaperId/:testPaperId/testId/:testId',
    name: 'inExam',
    meta: {
        whiteIn: true
    },
    component: loadView('myExam/in-exam-page.vue')
};
export const foodRouter = {
    path: '/foodPublic',
    title: '食堂',
    name: 'foodPublic',
    meta: {
        whiteIn: true
    },
    component: loadView('foodClient/index.vue')
}
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
            component: loadView('knowledgeManage/knowledgePublic/article.vue')
        },
        {
            path: 'index',
            name: 'articleIndex',
            title: '知识库',
            component: knowledgeIndex,
            children: [
                {
                    path: 'home',
                    name: 'articleHome',
                    meta: {
                        whiteIn: true
                    },
                    component: loadView('knowledgeManage/knowledgePublic/home.vue')
                },
                {
                    path: 'list',
                    name: 'articleList',
                    meta: {
                        whiteIn: true
                    },
                    component: loadView('knowledgeManage/knowledgePublic/list.vue')
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
            component: loadView('photoManager/photoPublic/list.vue')
        },
        {
            path: 'detailList/:id',
            name: 'photoDetailList',
            meta: {
                whiteIn: true
            },
            component: loadView('photoManager/photoPublic/detailList.vue')
        },
        {
            path: 'myPhoto',
            name: 'myPhoto',
            meta: {
                whiteIn: true
            },
            component: loadView('photoManager/photoPublic/myPhoto.vue')
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
    component: loadView('error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足',
        whiteIn: true
    },
    name: 'error-403',
    component: loadView('error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误',
        white: true
    },
    name: 'error-500',
    component: loadView('error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        whiteIn: true
    },
    component: loadView('lockPage/locking-page.vue')
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
            component: loadView('home/index.vue')
        },
        {
            path: 'myLog',
            title: '我的日志',
            meta: {
                whiteIn: true
            },
            name: 'myLog',
            component: loadView('myLog/index.vue')
        },
        {
            path: 'myAttendance',
            title: '我的考勤',
            meta: {
                whiteIn: true
            },
            name: 'myAttendance',
            component: loadView('myAttendance/index.vue')
        },
        {
            path: 'myLeave',
            title: '我的请假',
            meta: {
                whiteIn: true
            },
            name: 'myLeave',
            component: loadView('myLeave/index.vue')
        },
        {
            path: 'myArrange',
            title: '我的排班',
            meta: {
                whiteIn: true
            },
            name: 'myArrange',
            component: loadView('myArrange/index.vue')
        },
        {
            path: 'myExam',
            title: '我的考试',
            meta: {
                whiteIn: true
            },
            name: 'myExam',
            component: loadView('myExam/index.vue')
        },
        {
            path: 'assetsApply',
            meta: {
                whiteIn: true
            },
            name: 'assetsApply',
            title: '我的资产',
            component: loadView('assetsManager/assetsApply/index.vue')
        },
        {
            path: 'coinShop',
            title: '金币商城',
            meta: {
                whiteIn: true
            },
            name: 'coinShop',
            component: loadView('coinManage/coinShop/index.vue')
        },
        {
            path: 'myTrain',
            title: '我的培训',
            meta: {
                whiteIn: true
            },
            name: 'myTrain',
            component: loadView('myTrain/index.vue')
        },
        {
            path: 'mySalary',
            title: '我的绩效',
            meta: {
                whiteIn: true
            },
            name: 'mySalary',
            component: loadView('salaryManaer/mySalary/index.vue')
        },
        {
            path: 'myFoodCard',
            title: '我的餐卡',
            meta: {
                whiteIn: true
            },
            name: 'myFoodCard',
            component: loadView('myFoodCard/index.vue')
        }
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/logManage',
        icon: 'md-create',
        name: 'logManage',
        title: '工作日志管理',
        component: Main,
        children: [
            {
                path: 'elogManage',
                icon: 'md-create',
                name: 'elogManage',
                title: '员工日志管理',
                component: loadView('logManage/elogManage/index.vue')
            },
            {
                path: 'logTotal',
                icon: 'md-create',
                name: 'logTotal',
                title: '日志统计',
                component: loadView('logManage/logTotal/index.vue')
            }
        ]
    },
    {
        path: '/attendanceAndLeave',
        icon: 'md-briefcase',
        name: 'attendanceAndLeave',
        title: '考勤请假管理',
        component: Main,
        children: [
            {
                path: 'attendanceManage',
                icon: 'md-briefcase',
                name: 'attendanceManage',
                title: '考勤管理',
                component: loadView('attendanceAndLeave/attendanceManage/index.vue')
            },
            {
                path: 'leaveApproval',
                icon: 'md-briefcase',
                name: 'leaveApproval',
                title: '请假审批',
                component: loadView('attendanceAndLeave/leaveApproval/index.vue')
            },
            {
                path: 'leaveManage',
                icon: 'md-briefcase',
                name: 'leaveManage',
                title: '请假管理',
                component: loadView('attendanceAndLeave/leaveManage/index.vue')
            },
            {
                path: 'depAttendance',
                icon: 'md-briefcase',
                name: 'depAttendance',
                title: '部门考勤',
                component: loadView('attendanceAndLeave/depAttendance/index.vue')
            },
            {
                path: 'depArrange',
                icon: 'md-briefcase',
                name: 'depArrange',
                title: '部门排班信息',
                component: loadView('attendanceAndLeave/depArrange/index.vue')
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
                component: loadView('employeeFileManager/employeeAchives/index.vue')
            },
            {
                path: 'employeeOrganize',
                icon: 'ios-bookmarks',
                name: 'employeeOrganize',
                title: '部门员工档案',
                component: loadView('employeeFileManager/employeeOrganize/index.vue')
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
                component: loadView('hireManager/hire/index.vue')
            },
            {
                path: 'position',
                icon: 'ios-people',
                name: 'position',
                title: '岗位设置',
                component: loadView('hireManager/position/index.vue')
            },
            {
                path: 'statistics',
                icon: 'ios-people',
                name: 'statistics',
                title: '数据统计',
                component: loadView('hireManager/statistics/index.vue')
            }
        ]
    },
    {
        path: '/assetsManager',
        icon: 'md-print',
        name: 'assetsManager',
        title: '资产管理',
        component: Main,
        children: [
            {
                path: 'assetsRegister',
                icon: 'md-print',
                name: 'assetsRegister',
                title: '资产查询/管理',
                component: loadView('assetsManager/assetsRegister/index.vue')
            },

            {
                path: 'assetsBuyApprove',
                icon: 'md-print',
                name: 'assetsBuyApprove',
                title: '资产采购/报废审批',
                component: loadView('assetsManager/assetsBuyApprove/index.vue')
            },
            {
                path: 'assetsAllocation',
                icon: 'md-print',
                name: 'assetsAllocation',
                title: '资产调拨',
                component: loadView('assetsManager/assetsAllocation/index.vue')
            },
            {
                path: 'assetsBuyManager',
                icon: 'md-print',
                name: 'assetsBuyManager',
                title: '资产采购清单',
                component: loadView('assetsManager/assetsBuyManager/index.vue')
            },
            {
                path: 'assetslocation',
                icon: 'md-print',
                name: 'assetslocation',
                title: '资产位置',
                component: loadView('assetsManager/assetLocation/index.vue')
            },
            {
                path: 'assetsCategory',
                icon: 'md-print',
                name: 'assetsCategory',
                title: '资产分类',
                component: loadView('assetsManager/assetsCategory/index.vue')
            }
        ]
    },
    {
        path: '/examination',
        icon: 'md-school',
        name: 'examination',
        title: '考试管理',
        component: Main,
        children: [
            {
                path: 'examinationManage',
                icon: 'md-school',
                name: 'examinationManage',
                title: '考试管理',
                component: loadView('examination/examinationManage/index.vue')
            },
            {
                path: 'questionManage',
                icon: 'md-school',
                name: 'questionManage',
                title: '试题管理',
                component: loadView('examination/questionManage/index.vue')
            },
            {
                path: 'paperManage',
                icon: 'md-school',
                name: 'paperManage',
                title: '试卷管理',
                component: loadView('examination/paperManage/index.vue')
            },
            {
                path: 'gradeManage',
                icon: 'md-school',
                name: 'gradeManage',
                title: '成绩管理',
                component: loadView('examination/gradeManage/index.vue')
            },
            {
                path: 'depGrade',
                icon: 'md-school',
                name: 'depGrade',
                title: '部门成绩',
                component: loadView('examination/depGrade/index.vue')
            },
            {
                path: 'peopleCheck',
                icon: 'md-school',
                name: 'peopleCheck',
                title: '人工阅卷',
                component: loadView('examination/peopleCheck/index.vue')
            },
            {
                path: 'examinationCategory',
                icon: 'md-school',
                name: 'examinationCategory',
                title: '分类管理',
                component: loadView('examination/examinationCategory/index.vue')
            }
        ]
    },
    {
        path: '/ticket',
        icon: 'md-albums',
        name: 'ticket',
        title: '工单管理',
        component: Main,
        children: [
            {
                path: 'managerTeams',
                icon: 'ios-people',
                name: 'managerTeams',
                title: '团队管理',
                component: loadView('ticket/managerTeams/index.vue')
            },
            {
                path: 'myTickets',
                icon: 'md-checkbox-outline',
                name: 'myTickets',
                title: '我的工单(开发)',
                component: loadView('ticket/myTickets/index.vue')
            },
            {
                path: 'myCreateTickets',
                icon: 'md-checkbox-outline',
                name: 'myCreateTickets',
                title: '我的工单(业务)',
                component: loadView('ticket/myCreateTickets/index.vue')
            },
            {
                path: 'superiorManager',
                icon: 'md-time',
                name: 'superiorManager',
                title: '管理工单(上级)',
                component: loadView('ticket/superiorManager/index.vue')
            },
            {
                path: 'teamTickets',
                icon: 'md-time',
                name: 'teamTickets',
                title: '管理工单(项目组)',
                component: loadView('ticket/teamTickets/index.vue')
            }
        ]
    },
    {
        path: '/rulesManager',
        icon: 'md-star',
        name: 'rulesManager',
        title: '规章管理',
        component: Main,
        children: [
            {
                path: 'newRule',
                icon: 'md-star',
                name: 'newRule',
                title: '新增规章',
                component: loadView('rulesManager/newRule/index.vue')
            },
            {
                path: 'approveRule',
                icon: 'md-star',
                name: 'approveRule',
                title: '规章审批',
                component: loadView('rulesManager/approveRule/index.vue')
            }
        ]
    },
    {
        path: '/salaryManaer',
        icon: 'md-contacts',
        name: 'salaryManaer',
        title: '绩效管理',
        component: Main,
        children: [
            {
                path: 'newSalary',
                icon: 'md-contacts',
                name: 'newSalary',
                title: '绩效方案管理',
                component: loadView('salaryManaer/newSalary/index.vue')
            },
            {
                path: 'approveSalary',
                icon: 'md-contacts',
                name: 'approveSalary',
                title: '绩效打分',
                component: loadView('salaryManaer/approveSalary/index.vue')
            }
        ]
    },
    {
        path: '/trainManage',
        icon: 'md-ribbon',
        name: 'trainManage',
        title: '培训管理',
        component: Main,
        children: [
            {
                path: 'trainPlanManage',
                icon: 'md-ribbon',
                name: 'trainPlanManage',
                title: '培训计划管理',
                component: loadView('trainManage/trainPlanManage/index.vue')
            },
            {
                path: 'internalTrainerManage',
                icon: 'md-ribbon',
                name: 'internalTrainerManage',
                title: '内训师管理',
                component: loadView('trainManage/internalTrainerManage/index.vue')
            },
            {
                path: 'curriculumManage',
                icon: 'md-ribbon',
                name: 'curriculumManage',
                title: '课程管理',
                component: loadView('trainManage/curriculumManage/index.vue')
            },
            {
                path: 'classRecheckManage',
                icon: 'md-ribbon',
                name: 'classRecheckManage',
                title: '课程复盘管理',
                component: loadView('trainManage/classRecheckManage/index.vue')
            },
            {
                path: 'tickRecheckManage',
                icon: 'md-ribbon',
                name: 'tickRecheckManage',
                title: '周期复盘管理',
                component: loadView('trainManage/tickRecheckManage/index.vue')
            },
            {
                path: 'creditManage',
                icon: 'md-ribbon',
                name: 'creditManage',
                title: '学分管理',
                component: loadView('trainManage/creditManage/index.vue')
            },
            {
                path: 'questionnaireManage',
                icon: 'md-ribbon',
                name: 'questionnaireManage',
                title: '问卷管理',
                component: loadView('trainManage/questionnaireManage/index.vue')
            },
            {
                path: 'questionnaireQuestionsManage',
                icon: 'md-ribbon',
                name: 'questionnaireQuestionsManage',
                title: '问卷题管理',
                component: loadView('trainManage/questionnaireQuestionsManage/index.vue')
            }
        ]
    },
    {
        path: '/coinManage',
        icon: 'ios-pricetags',
        name: 'coinManage',
        title: '员工财富管理',
        component: Main,
        children: [
            {
                path: 'coinRecord',
                icon: 'ios-pricetags',
                name: 'coinRecord',
                title: '金币记录',
                component: loadView('coinManage/coinRecord/index.vue')
            },
            {
                path: 'coinStatistics',
                icon: 'ios-pricetags',
                name: 'coinStatistics',
                title: '金币分类统计',
                component: loadView('coinManage/coinStatistics/index.vue')
            },
            {
                path: 'goodsManage',
                icon: 'ios-pricetags',
                name: 'goodsManage',
                title: '商品管理',
                component: loadView('coinManage/goodsManage/index.vue')
            },
            {
                path: 'prizeManage',
                icon: 'ios-pricetags',
                name: 'prizeManage',
                title: '奖品管理',
                component: loadView('coinManage/prizeManage/index.vue')
            },
            {
                path: 'goodsExchangeManage',
                icon: 'ios-pricetags',
                name: 'goodsExchangeManage',
                title: '兑换管理',
                component: loadView('coinManage/goodsExchangeManage/index.vue')
            },
            {
                path: 'foodCardManage',
                icon: 'md-card',
                name: 'foodCardManage',
                title: '餐卡管理',
                component: loadView('coinManage/foodCardManage/index.vue')
            },
            {
                path: 'foodCardLog',
                icon: 'md-card',
                name: 'foodCardLog',
                title: '餐卡记录',
                component: loadView('coinManage/foodCardLog/index.vue')
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
                component: loadView('knowledgeManage/knowledgeSetting/index.vue')
            },
            {
                path: 'myKnowledge',
                icon: 'ios-book',
                name: 'myKnowledge',
                title: '我的知识',
                component: loadView('knowledgeManage/myKnowledge/index.vue')
            }
        ]
    },
    {
        path: '/photoManage',
        icon: 'md-images',
        name: 'photoManage',
        title: '员工风采管理',
        component: Main,
        children: [
            {
                path: 'photoSetting',
                icon: 'md-images',
                name: 'photoSetting',
                title: '活动设置',
                component: loadView('photoManager/photoSetting/index.vue')
            }
        ]
    },
    {
        path: '/systemManage',
        icon: 'md-settings',
        name: 'systemManage',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'organizationManage',
                icon: 'md-settings',
                name: 'organizationManage',
                title: '组织管理',
                component: loadView('systemManage/organizationManage/index.vue')
            },
            {
                path: 'roleManage',
                icon: 'md-settings',
                name: 'roleManage',
                title: '角色管理',
                component: loadView('systemManage/roleManage/index.vue')
            },
            {
                path: 'levelManage',
                icon: 'md-settings',
                name: 'levelManage',
                title: '职级管理',
                component: loadView('systemManage/levelManage/index.vue')
            },
            {
                path: 'userManage',
                icon: 'md-settings',
                name: 'userManage',
                title: '用户管理',
                component: loadView('systemManage/userManage/index.vue')
            },
            {
                path: 'postManage',
                icon: 'md-settings',
                name: 'postManage',
                title: '岗位管理',
                component: loadView('systemManage/postManage/index.vue')
            },
            {
                path: 'noticeManage',
                icon: 'md-settings',
                name: 'noticeManage',
                title: '公告管理',
                component: loadView('systemManage/noticeManage/index.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    guestRouter,
    foodRouter,
    knowledgeRouter,
    photoRouter,
    inExamRouter,
    locking,
    page500,
    page403
];
