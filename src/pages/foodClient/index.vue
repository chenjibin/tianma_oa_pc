<template>
    <div class="food-client">
        <Row :gutter="16">
            <Col :span="10">
            <Card>
                <div class="info-inner" :style="{height: innerHeight + 'px'}">
                    <ul>
                        <li>
                        </li>
                    </ul>
                </div>
            </Card>
            </Col>
            <Col :span="14">
            <Card>
                <div class="cash-inner" :style="{height: innerHeight + 'px'}">
                    <div class="cash">
                        <span class="label">消费</span>
                        <fs-input-number :inputClasses="'food-input'"
                                         :inputWrapClasses="'food-input-wrapper'"
                                         @key-enter="enterHandler"
                                         v-model="cash">
                            <span class="unit">元</span>
                        </fs-input-number>
                    </div>
                    <div class="cash">
                        <span class="label">卡号</span>
                        <fs-input-number :inputClasses="'food-input'"
                                         :inputWrapClasses="'food-input-wrapper'"
                                         @key-enter="enterHandler"
                                         v-model="cardNumber"></fs-input-number>
                    </div>
                    <div class="cash-btn">扣费</div>
                </div>
            </Card>
            </Col>
        </Row>
        <input/>
    </div>
</template>
<style lang="less">
    .food-client {
        padding: 16px;
        .cash-btn {
            background-color: #dc0707;
            color: #fff;
            width: 300px;
            padding: 18px 0;
            font-size: 24px;
            border-radius: 16px;
            cursor: pointer;
        }
        .info-inner {
            overflow: auto;
        }
        .cash-inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            .cash {
                margin-bottom: 64px;
                .food-input-wrapper {
                    position: relative;
                    margin-top: 32px;
                    .unit {
                        position: absolute;
                        font-size: 32px;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .food-input {
                    padding: 12px 24px;
                    width: 100%;
                    -webkit-appearance: none;
                    border: 0;
                    border-bottom: 2px solid #999;
                    font-size: 32px;
                    outline: none;
                    text-align: center;
                }
                .label {
                    font-size: 48px;
                    font-weight: 700;
                }
            }
        }
    }
</style>
<script>
    import fsInputNumber from '@/baseComponents/fs-input-number'

    export default {
        name: 'foodPublic',
        data() {
            return {
                cash: 0,
                cardNumber: null,
                innerHeight: 400
            }
        },
        created() {
            this._setHeight()
        },
        methods: {
            enterHandler(e) {
                const {cash, cardNumber} = this

                console.log(cash, cardNumber)
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.innerHeight = dm - 64;
            }
        },
        components: {
            fsInputNumber
        }
    }
</script>
