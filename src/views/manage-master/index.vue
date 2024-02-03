<template>
    <div class="app-container">
        <block-classify @bigTypeChange="handleBigTypeChange" @smallTypeChange="handleSmallTypeChange"
            style="float: left;"></block-classify>
        <el-select v-model="page.roleId" placeholder="选择角色" style="margin: 0 20px;" clearable @change="fetchData">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-input v-model="page.username" placeholder="请输入用户名称" style="width: 200px;" clearable></el-input>
        <el-button icon="el-icon-search" circle style="margin: 0 10px 0 20px;" @click="search"></el-button>
        <el-dialog title="角色管理" :visible.sync="dialogVisible" width="30%">
            <el-radio-group v-model="roleForm.roleId">
                <el-radio label="102">板主</el-radio>
                <el-radio label="103">小板主</el-radio>
                <el-radio label="0">普通用户</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRoleForm">确 定</el-button>
            </span>
        </el-dialog>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column label="大板块" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.bigTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="小板块" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.smallTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="板块名称" width="250" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.blockName }}
                </template>
            </el-table-column>
            <el-table-column label="用户" width="220" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column label="角色" width="100" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag :type="scope.row.roleId | roleFilter">{{ scope.row.roleId | roleText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="openRoleDialog(scope.row)">角色管理</el-button>
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
import { getBlockClassify } from '@/api/block'
import BlockClassify from "@/components/BlockClassify";
import { getList, updateRole } from '@/api/manage-master'
import { prohibit } from "@/api/manage-user";
export default {
    components: { 'block-classify': BlockClassify },
    filters: {
        roleFilter(roleId) {
            const roleMap = {
                '102': 'primary',
                '103': 'success'
            }
            return roleMap[roleId]
        },
        roleText(roleId) {
            switch (roleId) {
                case '102':
                    return '板主';
                case '103':
                    return '小板主';
            }
        }
    },
    data() {
        return {
            list: null,
            listLoading: true,
            page: {
                currentPage: 1,
                size: 7,
                bigTypeId: null,
                smallTypeId: null,
                roleId: '',
                username: null
            },
            total: null,
            options: [
                { value: '102', label: '板主' },
                { value: '103', label: '小板主' }
            ],
            formLabelWidth: '80px',
            dialogVisible: false,
            roleForm: {
                userId: null,
                blockId: null,
                roleId: null
            }
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
        toPostIndex(row) {
            window.open("http://localhost:8585/PostIndex/" + row.blockId + '/' + row.id, "_blank")
        },
        prohibition(row) {
            const data = { blockId: row.blockId, userId: row.userId }
            prohibit(data).then(response => {
                this.$message({ message: response.data, type: 'success' });
            })
        },
        openRoleDialog(row) {
            this.dialogVisible = true
            this.roleForm.userId = row.id
            this.roleForm.blockId = row.blockId
            this.roleForm.roleId = row.roleId
        },
        submitRoleForm() {
            this.dialogVisible = false
            updateRole(this.roleForm).then(response => {
                this.$message({ message: response.data, type: 'success' });
            })
            setTimeout(() => {
                location.reload()
            }, 700);
        }
    }
}
</script>
