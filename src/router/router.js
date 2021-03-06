import Main from '@/views/Main.vue';
const _import = require('./_import_' + process.env.NODE_ENV);
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录',
        white: true
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};
// export const test = {
//     path: '/meetingRecord',
//     title: '会议室排期',
//     meta: {
//         white: true
//     },
//     name: 'meetingRecordTest',
//     component: _import('coinManage/meetingRecord')
// }
export const guestRouter = {
    path: '/guest',
    name: 'guest',
    meta: {
        title: '社会招聘',
        white: true
    },
    component: resolve => { require(['@/pages/hireManager/guest/index.vue'], resolve); }
};
export const inExamRouter = {
    path: '/inExam/testPaperId/:testPaperId/testId/:testId',
    name: 'inExam',
    meta: {
        whiteIn: true
    },
    component: resolve => { require(['@/pages/myExam/in-exam-page.vue'], resolve); }
};
export const foodRouter = {
    path: '/foodPublic',
    title: '食堂',
    name: 'foodPublic',
    meta: {
        whiteIn: true
    },
    component: resolve => { require(['@/pages/foodClient/index.vue'], resolve); }
}
export const knowledgeRouter = {
    path: '/knowledgePublic',
    title: '知识库',
    name: 'knowledgePublic',
    component: resolve => { require(['@/pages/knowledgeManage/knowledgePublic/route.vue'], resolve); },
    children: [
        {
            path: 'article/:id',
            name: 'articleDetail',
            meta: {
                whiteIn: true
            },
            component: resolve => { require(['@/pages/knowledgeManage/knowledgePublic/article.vue'], resolve); }
        },
        {
            path: 'index',
            name: 'articleIndex',
            title: '知识库',
            component: resolve => { require(['@/pages/knowledgeManage/knowledgePublic/index.vue'], resolve); },
            children: [
                {
                    path: 'home',
                    name: 'articleHome',
                    meta: {
                        whiteIn: true
                    },
                    component: resolve => { require(['@/pages/knowledgeManage/knowledgePublic/home.vue'], resolve); }
                },
                {
                    path: 'list',
                    name: 'articleList',
                    meta: {
                        whiteIn: true
                    },
                    component: resolve => { require(['@/pages/knowledgeManage/knowledgePublic/list.vue'], resolve); }
                }
            ]
        }
    ]
};
export const photoRouter = {
    path: '/photoPublic',
    title: '员工风采',
    name: 'photoPublic',
    component: resolve => { require(['@/pages/photoManager/photoPublic/main.vue'], resolve); },
    children: [
        {
            path: 'list',
            name: 'photoList',
            meta: {
                whiteIn: true
            },
            component: resolve => { require(['@/pages/photoManager/photoPublic/list.vue'], resolve); }
        },
        {
            path: 'detailList/:id',
            name: 'photoDetailList',
            meta: {
                whiteIn: true
            },
            component: resolve => { require(['@/pages/photoManager/photoPublic/detailList.vue'], resolve); }
        },
        {
            path: 'myPhoto',
            name: 'myPhoto',
            meta: {
                whiteIn: true
            },
            component: resolve => { require(['@/pages/photoManager/photoPublic/myPhoto.vue'], resolve); }
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
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足',
        whiteIn: true
    },
    name: 'error-403',
    component: resolve => { require(['@/views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误',
        white: true
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        whiteIn: true
    },
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
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
            title: {i18n: 'home'},
            meta: {
                whiteIn: true
            },
            name: 'home_index',
            component: _import('home')
        },
        {
            path: 'myLog',
            title: '我的日志',
            meta: {
                whiteIn: true
            },
            name: 'myLog',
            component: _import('myLog')
        },
        {
            path: 'myAttendance',
            title: '我的考勤',
            meta: {
                whiteIn: true
            },
            name: 'myAttendance',
            component: _import('myAttendance')
        },
        {
            path: 'myLeave',
            title: '我的请假',
            meta: {
                whiteIn: true
            },
            name: 'myLeave',
            component: _import('myLeave')
        },
        {
            path: 'myArrange',
            title: '我的排班',
            meta: {
                whiteIn: true
            },
            name: 'myArrange',
            component: _import('myArrange')
        },
        {
            path: 'myExam',
            title: '我的考试',
            meta: {
                whiteIn: true
            },
            name: 'myExam',
            component: _import('myExam')
        },
        {
            path: 'assetsApply',
            meta: {
                whiteIn: true
            },
            name: 'assetsApply',
            title: '我的资产',
            component: _import('assetsManager/assetsApply')
        },
        {
            path: 'coinShop',
            title: '金币商城',
            meta: {
                whiteIn: true
            },
            name: 'coinShop',
            component: _import('coinManage/coinShop')
        },
        {
            path: 'myTrain',
            title: '培训列表',
            meta: {
                whiteIn: true
            },
            name: 'myTrain',
            component: _import('myTrain')
        },
        {
            path: 'mySalary',
            title: '我的绩效',
            meta: {
                whiteIn: true
            },
            name: 'mySalary',
            component: _import('salaryManaer/mySalary')
        },
        {
            path: 'myFoodCard',
            title: '我的餐卡',
            meta: {
                whiteIn: true
            },
            name: 'myFoodCard',
            component: _import('myFoodCard')
        },
        {
            path: 'myZz',
            title: '我的转正',
            meta: {
                whiteIn: true
            },
            name: 'myZz',
            component: _import('myZz')
        },
        {
            path: 'meetingRecord',
            title: '会议室预定',
            meta: {
                whiteIn: true
            },
            name: 'meetingRecord',
            component: _import('coinManage/meetingRecord')
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
                component: _import('logManage/elogManage')
            },
            {
                path: 'logTotal',
                icon: 'compose',
                name: 'logTotal',
                title: '日志统计',
                component: _import('logManage/logTotal')
            }
        ]
    },
    {
        path: '/journey',
        icon: 'flag',
        name: 'journey',
        title: '转正管理',
        component: Main,
        children: [
            {
                path: 'checkLog',
                icon: 'flag',
                name: 'checkLog',
                title: '转正审批',
                component: _import('journey/checkLog')
            },
            {
                path: 'manageLog',
                icon: 'flag',
                name: 'manageLog',
                title: '转正管理',
                component: _import('journey/manageLog')
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
                component: _import('attendanceAndLeave/attendanceManage')
            },
            {
                path: 'leaveApproval',
                icon: 'ios-folder-outline',
                name: 'leaveApproval',
                title: '请假审批',
                component: _import('attendanceAndLeave/leaveApproval')
            },
            {
                path: 'leaveManage',
                icon: 'ios-folder-outline',
                name: 'leaveManage',
                title: '请假管理',
                component: _import('attendanceAndLeave/leaveManage')
            },
            {
                path: 'depAttendance',
                icon: 'ios-folder-outline',
                name: 'depAttendance',
                title: '部门考勤',
                component: _import('attendanceAndLeave/depAttendance')
            },
            {
                path: 'depArrange',
                icon: 'ios-folder-outline',
                name: 'depArrange',
                title: '部门排班信息',
                component: _import('attendanceAndLeave/depArrange')
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
                component: _import('employeeFileManager/employeeAchives')
            },
            {
                path: 'employeeOrganize',
                icon: 'ios-bookmarks',
                name: 'employeeOrganize',
                title: '部门员工档案',
                component: _import('employeeFileManager/employeeOrganize')
            },
            {
                path: 'wenLog',
                icon: 'ios-bookmarks',
                name: 'wenLog',
                title: '部门问卷汇总',
                component: _import('employeeFileManager/wenLog')
            },
            {
                path: 'questionnaireRecords',
                icon: 'ios-bookmarks',
                name: 'questionnaireRecords',
                title: '问卷发送审批',
                component: _import('employeeFileManager/questionnaireRecords')
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
                component: _import('hireManager/hire')
            },
            {
                path: 'position',
                icon: 'ios-people',
                name: 'position',
                title: '岗位设置',
                component: _import('hireManager/position')
            },
            {
                path: 'statistics',
                icon: 'ios-people',
                name: 'statistics',
                title: '数据统计',
                component: _import('hireManager/statistics')
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
                component: _import('assetsManager/assetsRegister')
            },

            {
                path: 'assetsBuyApprove',
                icon: 'printer',
                name: 'assetsBuyApprove',
                title: '资产采购/报废审批',
                component: _import('assetsManager/assetsBuyApprove')
            },
            {
                path: 'assetsAllocation',
                icon: 'printer',
                name: 'assetsAllocation',
                title: '资产调拨',
                component: _import('assetsManager/assetsAllocation')
            },
            {
                path: 'assetsBuyManager',
                icon: 'printer',
                name: 'assetsBuyManager',
                title: '资产采购清单',
                component: _import('assetsManager/assetsBuyManager')
            },
            {
                path: 'assetslocation',
                icon: 'printer',
                name: 'assetslocation',
                title: '资产位置',
                component: _import('assetsManager/assetLocation')
            },
            {
                path: 'assetsCategory',
                icon: 'printer',
                name: 'assetsCategory',
                title: '资产分类',
                component: _import('assetsManager/assetsCategory')
            },
            {
                path: 'assetsCheck',
                icon: 'printer',
                name: 'assetsCheck',
                title: '资产盘点管理',
                component: _import('assetsManager/assetsCheck')
            },
            {
                path: 'assetsTel',
                icon: 'printer',
                name: 'assetsTel',
                title: '电话卡管理',
                component: _import('assetsManager/assetsTel')
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
                component: _import('examination/examinationManage')
            },
            {
                path: 'examTechManage',
                icon: 'university',
                name: 'examTechManage',
                title: '培训考试管理',
                component: _import('examination/examTechManage')
            },
            {
                path: 'questionManage',
                icon: 'university',
                name: 'questionManage',
                title: '试题管理',
                component: _import('examination/questionManage')
            },
            {
                path: 'paperManage',
                icon: 'university',
                name: 'paperManage',
                title: '试卷管理',
                component: _import('examination/paperManage')
            },
            {
                path: 'gradeManage',
                icon: 'university',
                name: 'gradeManage',
                title: '成绩管理',
                component: _import('examination/gradeManage')
            },
            {
                path: 'depGrade',
                icon: 'university',
                name: 'depGrade',
                title: '部门成绩',
                component: _import('examination/depGrade')
            },
            {
                path: 'peopleCheck',
                icon: 'university',
                name: 'peopleCheck',
                title: '人工阅卷',
                component: _import('examination/peopleCheck')
            },
            {
                path: 'examinationCategory',
                icon: 'university',
                name: 'examinationCategory',
                title: '分类管理',
                component: _import('examination/examinationCategory')
            }
        ]
    },
    {
        path: '/ticket',
        icon: 'briefcase',
        name: 'ticket',
        title: '工单管理',
        component: Main,
        children: [
            {
                path: 'managerTeams',
                icon: 'briefcase',
                name: 'managerTeams',
                title: '团队管理',
                component: _import('ticket/managerTeams')
            },
            {
                path: 'myTickets',
                icon: 'briefcase',
                name: 'myTickets',
                title: '我的工单(开发)',
                component: _import('ticket/myTickets')
            },
            {
                path: 'myCreateTickets',
                icon: 'briefcase',
                name: 'myCreateTickets',
                title: '我的工单(业务)',
                component: _import('ticket/myCreateTickets')
            },
            {
                path: 'superiorManager',
                icon: 'briefcase',
                name: 'superiorManager',
                title: '管理工单(上级)',
                component: _import('ticket/superiorManager')
            },
            {
                path: 'teamTickets',
                icon: 'briefcase',
                name: 'teamTickets',
                title: '管理工单(项目组)',
                component: _import('ticket/teamTickets')
            }
        ]
    },
    {
        path: '/salaryManaer',
        icon: 'android-contacts',
        name: 'salaryManaer',
        title: '绩效管理',
        component: Main,
        children: [
            {
                path: 'approveSalary',
                icon: 'ios-folder-outline',
                name: 'approveSalary',
                title: '部门绩效',
                component: _import('salaryManaer/approveSalary')
            }
            // ,
            // {
            //     path: 'perAssessment',
            //     icon: 'ios-folder-outline',
            //     name: 'perAssessment',
            //     title: '绩效管理',
            //     component: _import('salaryManaer/perAssessment')
            // }
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
                path: 'trainDayManage',
                icon: 'ribbon-a',
                name: 'trainDayManage',
                title: '培训日程管理',
                component: _import('trainManage/trainDayManage')
            },
            {
                path: 'trainPlanManage',
                icon: 'ribbon-a',
                name: 'trainPlanManage',
                title: '培训计划管理',
                component: _import('trainManage/trainPlanManage')
            },
            {
                path: 'trainMyPlan',
                icon: 'ribbon-a',
                name: 'trainMyPlan',
                title: '我的培训计划',
                component: _import('trainManage/trainMyPlan')
            },
            {
                path: 'apporovaPlan',
                icon: 'ribbon-a',
                name: 'apporovaPlan',
                title: '审批计划管理',
                component: _import('trainManage/apporovaPlan')
            },
            {
                path: 'internalTrainerManage',
                icon: 'ribbon-a',
                name: 'internalTrainerManage',
                title: '讲师库管理',
                component: _import('trainManage/internalTrainerManage')
            },
            {
                path: 'curriculumManage',
                icon: 'ribbon-a',
                name: 'curriculumManage',
                title: '课程管理',
                component: _import('trainManage/curriculumManage')
            },
            {
                path: 'classRecheckManage',
                icon: 'ribbon-a',
                name: 'classRecheckManage',
                title: '课程反馈管理',
                component: _import('trainManage/classRecheckManage')
            },
            {
                path: 'tickRecheckManage',
                icon: 'ribbon-a',
                name: 'tickRecheckManage',
                title: '周期反馈管理',
                component: _import('trainManage/tickRecheckManage')
            },
            // {
            //     path: 'creditManage',
            //     icon: 'ribbon-a',
            //     name: 'creditManage',
            //     title: '学分管理',
            //     component: _import('trainManage/creditManage')
            // },
            {
                path: 'questionnaireManage',
                icon: 'ribbon-a',
                name: 'questionnaireManage',
                title: '问卷管理',
                component: _import('trainManage/questionnaireManage')
            },
            {
                path: 'questionnaireQuestionsManage',
                icon: 'ribbon-a',
                name: 'questionnaireQuestionsManage',
                title: '问卷题管理',
                component: _import('trainManage/questionnaireQuestionsManage')
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
                component: _import('coinManage/coinRecord')
            },
            {
                path: 'coinStatistics',
                icon: 'ios-pricetags',
                name: 'coinStatistics',
                title: '金币分类统计',
                component: _import('coinManage/coinStatistics')
            },
            {
                path: 'goodsManage',
                icon: 'ios-pricetags',
                name: 'goodsManage',
                title: '商品管理',
                component: _import('coinManage/goodsManage')
            },
            {
                path: 'prizeManage',
                icon: 'ios-pricetags',
                name: 'prizeManage',
                title: '奖品管理',
                component: _import('coinManage/prizeManage')
            },
            {
                path: 'goodsExchangeManage',
                icon: 'ios-pricetags',
                name: 'goodsExchangeManage',
                title: '兑换管理',
                component: _import('coinManage/goodsExchangeManage')
            }
        ]
    },
    {
        path: '/mallAllManage',
        icon: 'beer',
        name: 'mallAllManage',
        title: '餐卡小超市',
        component: Main,
        children: [
            {
                path: 'mallManage',
                icon: 'beer',
                name: 'mallManage',
                title: '小超市商品',
                component: _import('mallCardManager/goodsManage')
            },
            {
                path: 'mallExchangeManage',
                icon: 'beer',
                name: 'mallExchangeManage',
                title: '小超市兑换',
                component: _import('mallCardManager/goodsExchangeManage')
            },
            {
                path: 'mallLog',
                icon: 'beer',
                name: 'mallLog',
                title: '小超市变更记录',
                component: _import('mallCardManager/mallLog')
            },
            {
                path: 'foodCardManage',
                icon: 'beer',
                name: 'foodCardManage',
                title: '餐卡管理',
                component: _import('mallCardManager/foodCardManage')
            },
            {
                path: 'foodCardLog',
                icon: 'beer',
                name: 'foodCardLog',
                title: '餐卡记录',
                component: _import('mallCardManager/foodCardLog')
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
                component: _import('knowledgeManage/knowledgeSetting')
            },
            {
                path: 'myKnowledge',
                icon: 'ios-book',
                name: 'myKnowledge',
                title: '我的知识',
                component: _import('knowledgeManage/myKnowledge')
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
                component: _import('photoManager/photoSetting')
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
                component: _import('systemManage/organizationManage')
            },
            {
                path: 'roleManage',
                icon: 'ios-gear',
                name: 'roleManage',
                title: '角色管理',
                component: _import('systemManage/roleManage')
            },
            {
                path: 'levelManage',
                icon: 'ios-gear',
                name: 'levelManage',
                title: '职级管理',
                component: _import('systemManage/levelManage')
            },
            {
                path: 'userManage',
                icon: 'ios-gear',
                name: 'userManage',
                title: '用户管理',
                component: _import('systemManage/userManage')
            },
            {
                path: 'postManage',
                icon: 'ios-gear',
                name: 'postManage',
                title: '岗位管理',
                component: _import('systemManage/postManage')
            },
            {
                path: 'noticeManage',
                icon: 'ios-gear',
                name: 'noticeManage',
                title: '公告管理',
                component: _import('systemManage/noticeManage')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    // test,
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
