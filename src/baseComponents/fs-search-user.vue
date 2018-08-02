<template>
    <Select :value="value"
            :multiple="multiple"
            filterable
            remote
            :clearable="clearable"
            :label="label"
            :remote-method="_filterPeopleRemote"
            :loading="filterPeopleLoading">
        <Option v-for="option in optionlist"
                :value="option.id"
                :label="option.realname"
                :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
    </Select>
</template>
<script>
    export default {
        name: 'fsSearchUser',
        model: {
            prop: 'value',
            event: 'on-change'
        },
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            optionlist: Array,
            label: [String, Number, Array],
            value: {
                type: [String, Number, Array],
                default: ''
            }
        },
        // watch: {
        //     valueData(val) {
        //         this.$emit('change', val);
        //     },
        //     value(val) {
        //         console.log(val)
        //         this.valueData = val;
        //     }
        // },
        data () {
            return {
                filterPeopleLoading: false,
                valueData: this.value
            };
        },
        methods: {
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.filterPeopleLoading = true;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.$emit('update:optionlist', res.data);
                    }
                    this.filterPeopleLoading = false;
                }, () => {
                    this.filterPeopleLoading = false;
                })
            }
        }
    };
</script>
