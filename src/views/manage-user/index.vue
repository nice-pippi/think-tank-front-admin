<template>
    <div class="app-container">
        <el-select v-model="page.sex" placeholder="性别" clearable @change="fetchData" style="width: 80px;">
            <el-option v-for="item in sex" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="page.loginType" placeholder="登录类型" clearable @change="fetchData"
            style="width:110px;margin: 0 20px;">
            <el-option v-for="item in loginType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="page.status" placeholder="状态" clearable @change="fetchData" style="width:110px;">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-input v-model="page.username" placeholder="请输入用户名" style="width: 200px;margin-left: 20px;" clearable></el-input>
        <el-button icon="el-icon-search" circle style="margin: 0 10px 0 20px;" @click="search"></el-button>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row
            style="margin-top: 20px;">
            <el-table-column label="头像" width="70" align="center">
                <template slot-scope="scope">
                    <el-avatar shape="square" :src="avatarTransform(scope.row.avatar)"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="用户名" width="130" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column label="性别" width="50" align="center">
                <template slot-scope="scope">
                    {{ scope.row.sex | sexText }}
                </template>
            </el-table-column>
            <el-table-column label="邮箱" width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.email }}
                </template>
            </el-table-column>
            <el-table-column label="个人介绍" width="170" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.description }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="注册时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="登录类型" width="80" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.loginType | loginFilter">{{ scope.row.loginType | loginText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="95" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="openUpdatePasswordDialog(scope.row)">修改密码</el-button>
                    <el-button size="mini" type="success" @click="openUpdateStatusDialog(scope.$index, scope.row)">
                        登录管理
                    </el-button>
                    <el-button size="mini" type="info" @click="openProhibitionDialog(scope.row)">禁言</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
                :page-size="page.size" layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="修改密码" :visible.sync="updatePasswordDialog" width="30%">
            <el-form :model="passwordForm" label-position="right">
                <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input v-model="passwordForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updatePasswordDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitUpdatePassword">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="登录状态管理" :visible.sync="updateStatusDialog" width="30%">
            <el-form :model="statusForm" label-position="right">
                <el-form-item label="登录状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="statusForm.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">限制登录</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateStatusDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitUpdateStatus">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="禁言" :visible.sync="prohibitionDialog" width="30%">
            <el-form :model="prohibitionForm" label-position="right">
                <el-form-item label="所属板块分类" label-width="100px">
                    <el-cascader v-model="currentSmallTypeId" :options="blockClassIfyOptions" @change="handleChange"
                        style="width: 80%;" placeholder="请选择板块所属分类"></el-cascader>
                </el-form-item>
                <el-form-item label="选择禁言板块" label-width="100px">
                    <el-select v-model="prohibitionForm.blockId" filterable placeholder="请选择板块" style="width: 80%;">
                        <el-option v-for="item in blockOptions" :key="item.id" :label="item.blockName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="prohibitionDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitProhibition">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import { getBlockClassify } from '@/api/block'
import { getList, updatePassword, updateStatus, prohibit, deleteById } from "@/api/manage-user";
import { getAllBlockBySmallTypeId } from "@/api/manage-block";
import { processUrl } from "@/utils/ImageUtil";
export default {
    filters: {
        loginFilter(loginType) {
            const loginMap = {
                0: 'primary',
                1: 'success'
            }
            return loginMap[loginType]
        },
        loginText(loginType) {
            switch (loginType) {
                case 0:
                    return '密码';
                case 1:
                    return '微信';
            }
        },
        sexText(sex) {
            switch (sex) {
                case 0:
                    return '女';
                case 1:
                    return '男';
            }
        },
        statusFilter(status) {
            const statusMap = {
                0: 'success',
                1: 'danger'
            }
            return statusMap[status]
        },
        statusText(status) {
            switch (status) {
                case 0:
                    return '正常';
                case 1:
                    return '限制登录';
            }
        },
    },
    data() {
        return {
            list: null,
            listLoading: true,
            sex: [
                { value: '1', label: '男' },
                { value: '0', label: '女' }
            ],
            loginType: [
                { value: '1', label: '微信' },
                { value: '0', label: '密码' }
            ],
            status: [
                { value: '0', label: '正常' },
                { value: '1', label: '限制登录' }
            ],
            page: {
                currentPage: 1,
                size: 7,
                sex: '',
                loginType: '',
                status: '',
                username: null
            },
            total: null,
            formLabelWidth: '70px',
            updatePasswordDialog: false,
            passwordForm: {
                id: null,
                password: null
            },
            updateStatusDialog: false,
            statusForm: {
                id: null,
                status: 0
            },
            statusIndex: 0,
            prohibitionDialog: false,
            prohibitionForm: {
                userId: null,
                blockId: null
            },
            blockClassIfyOptions: [],
            blockOptions: [],
            currentSmallTypeId: null
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
        openUpdatePasswordDialog(row) {
            this.passwordForm.id = row.id
            this.passwordForm.password = null
            this.updatePasswordDialog = true
        },
        submitUpdatePassword() {
            this.updatePasswordDialog = false
            updatePassword(this.passwordForm).then(response => {
                this.$message({ message: response.data, type: 'success' });
            })
        },
        openUpdateStatusDialog(index, row) {
            this.statusForm.id = row.id
            this.statusForm.status = row.status
            this.statusIndex = index
            this.updateStatusDialog = true
        },
        submitUpdateStatus() {
            this.updateStatusDialog = false
            updateStatus(this.statusForm).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list[this.statusIndex].status = this.statusForm.status
            })
        },
        getAllBlockClassify() {
            // 检查 localStorage 中是否已存在 blockClassify
            const blockClassify = localStorage.getItem("blockClassify");
            if (!blockClassify) {
                getBlockClassify().then(response => {
                    localStorage.setItem("blockClassify", JSON.stringify(response.data));
                });
            }
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
        // 选中子节点后的操作
        handleChange(value) {
            this.currentSmallTypeId = value[1]
            getAllBlockBySmallTypeId(value[1]).then(response => {
                this.blockOptions = response.data
                this.prohibitionForm.blockId = null
            })
        },
        openProhibitionDialog(row) {
            this.prohibitionDialog = true
            this.prohibitionForm.userId = row.id
            this.currentSmallTypeId = null
            this.prohibitionForm.blockId = null
            this.blockClassIfyOptions = this.formatData(JSON.parse(localStorage.getItem("blockClassify")))
        },
        submitProhibition() {
            if (this.currentSmallTypeId == null) {
                this.$message({ message: '请选择板块所属分类', type: 'warning' });
                return
            }
            if (this.prohibitionForm.blockId == null) {
                this.$message({ message: '请选择板块', type: 'warning' });
                return
            }
            prohibit(this.prohibitionForm).then(response => {
                this.$message({ message: response.data, type: 'success' });
            })
            this.prohibitionDialog = false
        },
        handleDelete(index, row) {
            deleteById(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list.splice(index, 1)
                this.total = this.total - 1
            })
        },
        avatarTransform(url) {
            return processUrl(url)
        }
    }
}
</script>