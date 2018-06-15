<template>
    <div>
        <Card :dis-hover="true">
            <Row :gutter="16">
                <Col :span="2">
                    <div style="text-align: center">
                        <h3 style="margin-bottom: 20px">扣分细则</h3>
                    </div>
                </Col>
                <Col :span="22" v-html="logs">
                </Col>
            </Row>
            <Row :gutter="16">
                <Col :span="2">
                    <div style="text-align: center">
                        <h3 style="margin-bottom: 20px">详细说明</h3>
                        <Button :disabled="!row.accessory" type="ghost" @click="downloadfile">下载附件</Button>
                    </div>
                </Col>
                <Col :span="22" v-html="row.detail"></Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'table-expand',
        props: {
            row: Object
        },
        methods: {
            downloadfile() {
                console.log(this.row);
                let downloadDom = document.createElement('a');
                downloadDom.href = '/oa/upload/work/' + this.row.add_user_id + '/' + this.row.accessory;
                downloadDom.download = this.row.accessory;
                downloadDom.click();
            }
        },
        computed: {
            logs() {
                let maps = this.row.logs.filter((item) => {
                    return item.type === 1;
                });
                let str = '';
                maps.forEach((item) => {
                    str += `<p style="line-height: 1.5;margin-bottom: 5px;"><span style="font-weight: 600">${item.createname}</span>  ： <span>${item.content}</span></p>`;
                });
                return str;
            }
        }
    };
</script>

<style scoped>

</style>
