<template>
    <div class="" style="overflow: auto;" :style="{width: domWidth}">
        <el-tree class="fs-tree"
                 :data="dataList"
                 :props="defaultProps"
                 :node-key="nodeKey"
                 :default-expand-all="expanded"
                 highlight-current
                 :expand-on-click-node="false"
                 :render-content="renderContent"
                 :check-strictly="true"
                 :show-checkbox="showCheckBox"
                 @current-change="checkmea">
        </el-tree>
        <!--上传删除图片-->
        <Modal v-model="modeFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>预览上传图片</span>
            </p>
            <div style="align-content: center">
                <fs-img-upload action="/oa/assetsCategory/uploadfile"
                               path="/oa/upload/assets/"
                               ref="imgUploadAssets"
                               :upload.sync="imgFile"></fs-img-upload>
            </div>

            <div slot="footer">
                <Button type="primary" :loading="btnLoading" @click="_confirmFile"> 提交图片</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modeFlag = false">取消</Button>
            </div>

        </Modal>
    </div>
</template>

<script>
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    export default {
        name: 'assetsTree',
        props: {
            domWidth: {
                type: String,
                default: '100%'
            },
            expanded: {
                type: Boolean,
                default: true
            },
            showCheckBox: {
                type: Boolean,
                default: false
            },
            nodeKey: {
                type: String,
                default: 'id'
            },
            defaultProps: {
                type: Object,
                default() {
                    return {
                        children: 'children',
                        label: 'name',
                        isLeaf: 'leaf'
                    };
                }
            }
        },
        created () {
            this._getPostData();
            // this._setTableHeight();
        },
        data () {
            return {
                modeFlag: false,
                imgFile: [],
                assetsPic: '',
                btnLoading: false,
                customerForm: {
                    addForm: {
                        fname: '',
                        pid: -1
                    },
                    modifyInfo: {
                        pid: -1,
                        name: '',
                        id: -1,
                        filePath: '',
                        lv: ''
                    }

                },
                dataList: []
            };
        },
        watch: {
            imgFile: {
                handler(val) {
                    // console.log(val[0].name)
                    this.assetsPic = val.length ? val[0].name : '';
                },
                deep: true
            }
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                        <span class="title">{data.name}</span>
                        <span class="buttons"></span>
                        <img   src={data.filePath}  style="width:30px;height:30px" on-click={()=>this.showImg()} />
                    </span>
            );
            },
            _getPostData () {
                this.$http.post('/assetsCategory/categoryList', {pid: -1}).then((res) => {
                    this.dataList = res.data;
                });
            },
            checkmea(data, node) {
                // console.log(data);
                this.customerForm.addForm.fname = data.name;
                this.customerForm.addForm.pid = data.id;
                this.customerForm.addForm.leaf = data.leaf;
                this.customerForm.modifyInfo.pid = data.pid;
                this.customerForm.modifyInfo.name = data.name;
                this.customerForm.modifyInfo.id = data.id;
                this.customerForm.modifyInfo.leaf = data.leaf;
                this.customerForm.modifyInfo.lv = data.lv;
                this.customerForm.modifyInfo.filePath = data.filePath;
                this.$emit('customerForm', this.customerForm);
            },
            // 添加图片
            showImg() {
                this.imgFile = [];
                this.$refs.imgUploadAssets.removeAllPicFlie();
                if (this.customerForm.modifyInfo.name) {
                    if (4 !== this.customerForm.modifyInfo.lv) {
                        this.$Message.warning('只有三级名称才可上传图片')
                        return;
                    }
                    this.imgFile = [{url: this.customerForm.modifyInfo.filePath, name: this.customerForm.modifyInfo.filePath, status: 'finished'}]
                    this.modeFlag = true;
                } else {
                    this.$Message.warning('请先选中在点击查看图片')
                }
            },
            _confirmFile() {
                if (this.assetsPic) {
                    // this.$Message.warning(this.customerForm.modifyInfo.id)
                    console.log(this.customerForm.modifyInfo.id)
                    let data = {};
                    data.id = this.customerForm.modifyInfo.id;
                    data.imgPath = this.assetsPic;
                    this.$http.post('/assetsCategory/addPicPath', data).then((res) => {
                        if (res.success) {
                            this._getPostData();
                            this.modeFlag = false;
                        }
                        this.$Message.info(res.message);
                    });
                } else {
                    this.$Message.warning('图片不存在')
                }
            }
        },
        components: {
            fsImgUpload
        }
    };
</script>

<style lang="less">
    .custom-tree-node {
        position: relative;
    span.title {
        font-size: 14px;
        word-spacing: 8px;
        letter-spacing: 6px;
    }
    .buttons{
        position: absolute;
        left: 160px;
        top: 1px;
    .oneBtn{
        margin-left: 10px;
        font-size: 12px;
    }
    }
    .Lv1{
        color: #f7b84f;
    }
    }
    img[src=""],img:not([src]){
        opacity:0;
    }
</style>
