<template>
    <div class="app-container">
        <block-classify @bigTypeChange="handleBigTypeChange" @smallTypeChange="handleSmallTypeChange"
            style="float: left;"></block-classify>
        <el-input v-model="page.title" placeholder="请输入帖子标题" style="margin-left: 20px;width: 200px;" clearable></el-input>
        <el-button icon="el-icon-search" circle style="margin: 0 10px 0 20px;" @click="search"></el-button>
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
            <el-table-column label="标题" width="300" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="toPostIndex(scope.row)">跳往</el-button>
                    <el-button size="mini" type="success" @click="prohibition(scope.row)">
                        禁言
                    </el-button>
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
import { getBlockClassify } from '@/api/block'
import BlockClassify from "@/components/BlockClassify";
import { getList, deleteById } from '@/api/manage-post'
import { prohibit } from "@/api/manage-user";
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
                title: null
            },
            total: null,
            options: [],
            formLabelWidth: '80px',
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
            window.open("http://www.think-tank.cn/PostIndex/" + row.blockId + '/' + row.id, "_blank")
        },
        prohibition(row) {
            const data = { blockId: row.blockId, userId: row.userId }
            prohibit(data).then(response => {
                this.$message({ message: response.data, type: 'success' });
            })
        },
        handleDelete(index, row) {
            deleteById(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list.splice(index, 1)
                this.total = this.total - 1
            })
        },
    }
}
</script>
