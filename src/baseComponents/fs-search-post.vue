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
                :label="option.name"
                :key="'post' + option.id">{{option.name + '(' + option.organizename + ')'}}</Option>
    </Select>
</template>
<script>
    export default {
        name: 'fsSearchPost',
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
        data () {
            return {
                filterPeopleLoading: false,
                valueData: this.value
            };
        },
        methods: {
            _filterPeopleRemote(val) {
                if (!isNaN(val)) return
                let data = {};
                data.postName = val;
                this.filterPeopleLoading = true;
                this.$http.get('post/findPost', {params: data}).then((res) => {
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
