<template>
    <div :class="inputWrapClasses">
        <input
            :class="inputClasses"
            autocomplete="off"
            spellcheck="false"
            @input="change"
            @change="change"
            @keydown.stop="keyDown"
            :value="currentValue">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'fsInputNumber',
        props: {
            value: {
                type: Number,
                default: 1
            },
            inputClasses: {
                type: String,
                default: ''
            },
            inputWrapClasses: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                currentValue: this.value
            }
        },
        methods: {
            change (event) {
                let val = event.target.value.trim();
                const isEmptyString = val.length === 0;
                if (isEmptyString) {
                    this.setValue(0);
                    return;
                }
                val = Number(val);
                if (!isNaN(val) && !isEmptyString) {
                    this.currentValue = val
                    this.setValue(val)
                } else {
                    event.target.value = this.currentValue;
                }
            },
            keyDown (e) {
                if (e.keyCode === 13) {
                    this.$emit('key-enter', e)
                }
            },
            setValue (val) {
                this.$nextTick(() => {
                    this.currentValue = val
                    this.$emit('input', val);
                    this.$emit('on-change', val);
                });
            }
        }
    }
</script>
