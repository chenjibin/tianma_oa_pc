<template>
    <Card class="todo">
        <p class="todo-title">待办事项</p>
        <ul class="todo-list">
            <li v-if="odmsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【请假】</span><span>您有{{odmsgNumber}}条请假申请待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('leaveApproval')">立即处理</Button>
                </div>
            </li>
            <li v-if="compactMsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【合同】</span><span>您有{{compactMsgNumber}}条请合同待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c">立即处理</Button>
                </div>
            </li>
            <li v-if="purchaseMsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【资产】</span><span>您有{{purchaseMsgNumber}}条资产申请待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('assetsBuyApprove')">立即处理</Button>
                </div>
            </li>
            <li v-if="zhuanNumber" class="todo-list-item">
            <div class="todo-list-item-left">
                <span>【转正】</span><span>您有{{zhuanNumber}}条转正申请需要处理</span>
            </div>
            <div class="todo-list-item-right">
                <Button type="ghost" icon="arrow-right-c" @click="toPage('checkLog')">立即处理</Button>
            </div>
            </li>
            <li v-if="xinZhuangNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【转正】</span><span>您有条转正申请正在处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="$router.push({name: 'myZz'})">立即查看</Button>
                </div>
            </li>
            <li v-if="workNotScoredNumber1" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【工单】</span><span>您有{{workNotScoredNumber1}}条工单到期未打分待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('myCreateTickets')">立即处理</Button>
                </div>
            </li>
            <li v-if="workNotScoredNumber2" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【工单】</span><span>您有{{workNotScoredNumber2}}条已完成工单未打分待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('superiorManager')">立即处理</Button>
                </div>
            </li>
            <li v-if="plan_wait_sumbit" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【培训】</span><span>您有{{plan_wait_sumbit}}条培训计划待提交</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('trainMyPlan')">立即查看</Button>
                </div>
            </li>
            <li v-if="plan_approval_fail" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【培训】</span><span>您有{{plan_approval_fail}}条培训计划审核失败</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('trainMyPlan')">立即查看</Button>
                </div>
            </li>
            <li v-if="plan_approval_success" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【培训】</span><span>您有{{plan_approval_success}}条培训计划审核成功</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('trainMyPlan')">立即完善</Button>
                </div>
            </li>
            <li v-if="plan_wait_approval" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【培训】</span><span>您有{{plan_wait_approval}}条培训计划待审核</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('apporovaPlan')">立即审核</Button>
                </div>
            </li>
            <!--<li v-if="wenNumber" class="todo-list-item">-->
                <!--<div class="todo-list-item-left">-->
                    <!--<span>【问卷】</span><span>您有{{wenNumber}}条问卷需要填写</span>-->
                <!--</div>-->
                <!--<div class="todo-list-item-right">-->
                    <!--<Button type="ghost" icon="arrow-right-c" @click="$router.push('myExam')">立即处理</Button>-->
                <!--</div>-->
            <!--</li>-->
            <li v-if="!purchaseMsgNumber && !compactMsgNumber && !odmsgNumber && !wenNumber && !zhuanNumber && !xinZhuangNumber && !workNotScoredNumber1 && !workNotScoredNumber2
                        && !plan_wait_sumbit && !plan_approval_fail && !plan_approval_success && !plan_wait_approval">
                暂无待办事项
            </li>
        </ul>
    </Card>
</template>
<style lang="less">
    .todo {
        user-select: none;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-list {
            &-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                &-left {

                }
                &-right {

                }
            }

        }
    }
</style>
<script>
    export default {
        data() {
            return {
                compactMsgNumber: 0,
                odmsgNumber: 0,
                purchaseMsgNumber: 0,
                wenNumber: 0,
                zhuanNumber: 0,
                xinZhuangNumber: 0,
                workNotScoredNumber1: 0,
                workNotScoredNumber2: 0,
                plan_wait_sumbit: 0,
                plan_approval_fail: 0,
                plan_approval_success: 0,
                plan_wait_approval: 0
            };
        },
        created() {
            this._toDoData();
        },
        methods: {
            toPage(page) {
                this.$router.push({
                    name: page
                });
            },
            _toDoData() {
                this.$http.get('/od/notifyMsgWindow').then((res) => {
                    if (res.success) {
                        let resData = res.data;
                        this.compactMsgNumber = resData.compactMsgNumber;
                        this.odmsgNumber = resData.odmsgNumber;
                        this.purchaseMsgNumber = resData.purchaseMsgNumber;
                        this.wenNumber = resData.wenNumber;
                        this.zhuanNumber = resData.zhuanNumber;
                        this.xinZhuangNumber = resData.xinZhuangNumber;
                        this.workNotScoredNumber1 = resData.workNotScoredNumber1;
                        this.workNotScoredNumber2 = resData.workNotScoredNumber2;
                        this.plan_wait_sumbit = resData.plan_wait_sumbit;
                        this.plan_approval_fail = resData.plan_approval_fail;
                        this.plan_approval_success = resData.plan_approval_success;
                        this.plan_wait_approval = resData.plan_wait_approval;
                    }
                });
            }
        }
    };
</script>
