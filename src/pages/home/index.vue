<template>
    <div class="home-main">
        <Row :gutter="3">
            <Col :md="24" :lg="12">
            <Row class-name="home-page-row1">
                <Col :md="24" :lg="24" :style="{marginBottom: '3px'}">
                <user-info></user-info>
                </Col>
                <Col :md="24" :lg="24">
                <Row :gutter="3">
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="edit"
                        color="#2d8cf0"
                        btn-text="日志"
                        @card-click="$router.push('myLog')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="clipboard"
                        color="#19be6b"
                        btn-text="考勤"
                        @card-click="$router.push('myAttendance')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="compose"
                        color="#2d8cf0"
                        btn-text="请假"
                        @card-click="$router.push('myLeave')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="navicon"
                        color="#19be6b"
                        btn-text="排班"
                        @card-click="$router.push('myArrange')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="university"
                        color="#2d8cf0"
                        btn-text="考试"
                        @card-click="$router.push('myExam')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="ribbon-a"
                        color="#19be6b"
                        btn-text="培训"
                        @card-click="$router.push('myTrain')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="printer"
                        color="rgb(242, 94, 67)"
                        btn-text="资产"
                        @card-click="$router.push('assetsApply')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="cash"
                        color="rgb(255, 153, 0)"
                        btn-text="商城"
                        @card-click="$router.push('coinShop')"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn
                        iconType="ios-book"
                        color="rgb(242, 94, 67)"
                        btn-text="知识"
                        @card-click="_see"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}">
                    <info-btn iconType="android-contacts"
                              color="rgb(255, 153, 0)" btn-text="绩效"
                              @card-click="$router.replace({name: 'mySalary'})"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}" v-if="foodCardNumber">
                    <info-btn iconType="card"
                              color="rgb(242, 94, 67)" btn-text="餐卡"
                              @card-click="$router.replace({name: 'myFoodCard'})"></info-btn>
                    </Col>
                    <Col :xs="12" :sm="6" :md="6" :lg="4" :style="{marginBottom: '3px'}" v-if="userInfo.companyid && userInfo.companyid === 1">
                        <info-btn iconType="card"
                                  color="rgb(242, 94, 67)" btn-text="会议"
                                  @card-click="$router.replace({name: 'meetingRecord'})"></info-btn>
                    </Col>
                </Row>
                </Col>
                <Col :md="24" :lg="24" :style="{marginBottom: '3px'}">
                <things-to-do></things-to-do>
                </Col>
                <Col :md="24" :lg="24" :style="{marginBottom: '3px'}">
                <coin-change></coin-change>
                </Col>
                <Col :md="24" :lg="24" :style="{marginBottom: '3px'}">
                <people-change></people-change>
                </Col>
            </Row>
            </Col>
            <Col :md="24" :lg="12">
            <div>
                <Notice></Notice>
            </div>
            <div>
                <people-photo></people-photo>
            </div>
            <div>
                <injob-commemorate></injob-commemorate>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import infoBtn from './components/infoBtn';
    import userInfo from './components/userInfo';
    import Notice from './components/notice';
    import peopleChange from './components/peopleChange';
    import injobCommemorate from './components/injobCommemorate';
    import coinChange from './components/coinChange';
    import thingsToDo from './components/thingsToDo';
    import peoplePhoto from './components/peoplePhoto';

    export default {
        name: 'home_index',
        computed: {
            userInfo() {
                return this.$store.state.user.userInfo
            },
            foodCardNumber() {
                return this.$store.state.user.userInfo.cardnumber
            }
        },
        components: {
            infoBtn,
            Notice,
            peopleChange,
            injobCommemorate,
            coinChange,
            userInfo,
            thingsToDo,
            peoplePhoto
        },
        methods: {
            _see() {
                let date = {};
                date.admin = 'login';
                let string;
                var w = window.open();
                this.$http.post('/user/getXwikiInfo').then((res) => {
                    if (res.success) {
                        string = 'http://192.168.18.192:8089/xwiki/bin/loginsubmit/XWiki/XWikiLogin?xredirect=%2Fxwiki%2Fbin%2Fview%2FMain%2F%3Fsrid%3DTqPFhflK&srid=TqPFhflK&form_token=g37q7L75IvfwaCfuYze1ig&j_username=' + res.username + '&j_password=' + res.password;
                        w.location.href = string;
                    }
                })
            }
        }
    };
</script>
