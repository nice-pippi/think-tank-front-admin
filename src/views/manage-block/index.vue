<template>
    <div class="app-container">
        <block-classify @bigTypeChange="handleBigTypeChange" @smallTypeChange="handleSmallTypeChange"
            style="float: left;"></block-classify>
        <el-input v-model="page.blockName" placeholder="请输入板块名称" style="margin-left: 20px;width: 200px;"
            clearable></el-input>
        <el-button icon="el-icon-search" circle style="margin: 0 10px 0 20px;" @click="search"></el-button>
        <el-button type="primary" @click="openAddBlockDialog">新建板块</el-button>
        <el-dialog title="新增板块" :visible.sync="addBlockDialog" width="500px">
            <el-form :model="blockForm">

                <el-form-item label="板块分类" :label-width="formLabelWidth">
                    <el-cascader v-model="blockForm.smallTypeId" :options="options" @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="板块名称" :label-width="formLabelWidth">
                    <el-input v-model="blockForm.blockName"></el-input>
                </el-form-item>
                <el-form-item label="板块介绍" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" maxlength="50" placeholder="请输入内容" v-model="blockForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBlockDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitAddBlock">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="更改板块信息" :visible.sync="updateBlockDialog" width="500px">
            <el-form :model="blockForm">
                <el-form-item label="板块头像" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" action="http://localhost:60100/file/blockAvatar"
                        :show-file-list="false" :on-success="onSuccess" :before-upload="beforeAvatarUpload"
                        :headers="headers" :data="{ id: updateBlockForm.id }">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="板块分类" :label-width="formLabelWidth">
                    <el-cascader v-model="updateBlockForm.smallTypeId" :options="options"
                        @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="板块名称" :label-width="formLabelWidth">
                    <el-input v-model="updateBlockForm.blockName"></el-input>
                </el-form-item>
                <el-form-item label="板块介绍" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" maxlength="50" placeholder="请输入内容"
                        v-model="updateBlockForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateBlockDialog = false">取 消</el-button>
                <el-button type="primary" @click="submiUpdateBlock">确 定</el-button>
            </div>
        </el-dialog>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column label="大板块" width="150" align="center">
                <template slot-scope="scope">
                    {{ scope.row.bigTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="小板块" width="150" align="center">
                <template slot-scope="scope">
                    {{ scope.row.smallTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="板块名称" width="150" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.blockName }}
                </template>
            </el-table-column>
            <el-table-column label="板块描述" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.description }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="更改时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" type="success"
                        @click="openUpdateBlockDialog(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
                :page-size="page.size" layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
  
<script>
import BlockClassify from "@/components/BlockClassify";
import { getList, addBlock, updateBlock, deleteById } from '@/api/manage-block'
import { getBlockClassify, getBlockInfo } from '@/api/block'
import { getToken } from "@/utils/auth";
import { processUrl } from "@/utils/ImageUtil";

export default {
    components: { 'block-classify': BlockClassify },
    data() {
        return {
            list: null,
            listLoading: true,
            page: {
                currentPage: 1,
                size: 10,
                bigTypeId: null,
                smallTypeId: null,
                blockName: null
            },
            total: null,
            options: [],
            addBlockDialog: false,
            updateBlockDialog: false,
            formLabelWidth: '80px',
            blockForm: {
                bigTypeId: 0,
                smallTypeId: 0,
                blockName: '',
                description: ''
            },
            updateBlockForm: {
                id: 0,
                bigTypeId: 0,
                smallTypeId: 0,
                avatar: '',
                blockName: '',
                description: ''
            },
            imageUrl: ''
        }
    },
    created() {
        this.getAllBlockClassify()
        this.fetchData()
    },
    methods: {
        getAllBlockClassify() {
            // 检查 localStorage 中是否已存在 blockClassify
            const blockClassify = localStorage.getItem("blockClassify");
            if (!blockClassify) {
                getBlockClassify().then(response => {
                    localStorage.setItem("blockClassify", JSON.stringify(response.data));
                });
            }
        },
        handleBigTypeChange(value) {
            this.page.bigTypeId = value
            this.fetchData()
        },
        handleSmallTypeChange(value) {
            this.page.smallTypeId = value
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.fetchData()
        },
        fetchData() {
            this.listLoading = true
            getList(this.page).then(response => {
                this.list = response.data.records
                this.listLoading = false
                this.page.currentPage = Number(response.data.current)
                this.total = Number(response.data.total)
            })
        },
        search() {
            this.page.current = 1
            this.fetchData()
        },
        handleDelete(index, row) {
            deleteById(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list.splice(index, 1)
                this.total = this.total - 1
            })
        },
        openAddBlockDialog() {
            this.addBlockDialog = true
            this.options = this.formatData(JSON.parse(localStorage.getItem("blockClassify")))
            this.blockForm.bigTypeId = 0
            this.blockForm.smallTypeId = 0
            this.blockForm.blockName = ''
            this.blockForm.description = '暂无'
        },
        openUpdateBlockDialog(index, row) {
            this.updateBlockDialog = true
            this.options = this.formatData(JSON.parse(localStorage.getItem("blockClassify")))
            getBlockInfo(row.id).then(response => {
                this.updateBlockForm.id = response.data.id
                this.updateBlockForm.bigTypeId = response.data.bigTypeId
                this.updateBlockForm.smallTypeId = response.data.smallTypeId
                this.updateBlockForm.blockName = response.data.blockName
                this.updateBlockForm.description = response.data.description
                this.updateBlockForm.avatar = response.data.avatar
                this.imageUrl = processUrl(response.data.avatar)
            })
        },
        // 格式转换函数，使得格式符合el-cascader的options
        formatData(data) {
            return data.map((item) => {
                const id = item.id
                const bigTypeName = item.bigTypeName
                const children = item.subCategories.map((subItem) => {
                    const subId = subItem.id;
                    const smallTypeName = subItem.smallTypeName;
                    return { value: subId, label: smallTypeName }
                })
                return { value: id, label: bigTypeName, children }
            });
        },
        submitAddBlock() {
            addBlock(this.blockForm).then(response => {
                this.$message({ message: response.data, type: 'success' });
                setTimeout(() => {
                    location.reload()
                }, 700);
            })

        },
        submiUpdateBlock() {
            updateBlock(this.updateBlockForm).then(() => {
                this.$message({ message: '更改成功', type: 'success' });
                setTimeout(() => {
                    location.reload()
                }, 700);
            })
        },
        // 选中子节点后的操作
        handleChange(value) {
            this.blockForm.bigTypeId = value[0]
            this.blockForm.smallTypeId = value[1]
            this.updateBlockForm.bigTypeId = value[0]
            this.updateBlockForm.smallTypeId = value[1]
        },
        // 头像上传成功操作
        onSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.updateBlockForm.avatar = res.data
        },
        // 头像上传前操作
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        }
    },
    computed: {
        headers: function () {
            return { satoken: getToken() };
        }
    }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>