<template>
    <div class="app-container">
        <block-classify @bigTypeChange="handleBigTypeChange" @smallTypeChange="handleSmallTypeChange"></block-classify>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="申请时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户" width="80" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column label="大板块" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.bigTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="小板块" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.smallTypeName }}
                </template>
            </el-table-column>
            <el-table-column label="板块名称" width="110" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.blockName }}
                </template>
            </el-table-column>
            <el-table-column label="申请理由" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.reason }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="210">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="allow(scope.$index, scope.row)">通过</el-button>
                    <el-button size="mini" type="primary" @click="reject(scope.$index, scope.row)">驳回</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
                :page-size="page.size" layout="total, prev, pager, next" :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>
  
<script>
import { getList, allow, reject, deleteById } from '@/api/application-master'
import BlockClassify from "@/components/BlockClassify";

export default {
    components: { 'block-classify': BlockClassify },
    filters: {
        statusFilter(status) {
            const statusMap = {
                0: 'info',
                1: 'success',
                2: 'warning'
            }
            return statusMap[status]
        },
        statusText(status) {
            switch (status) {
                case 0:
                    return '未审核';
                case 1:
                    return '通过';
                case 2:
                    return '驳回';
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
                total: 0
            },
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
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
                this.page.total = Number(response.data.total)
            })
        },
        allow(index, row) {
            allow(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list[index].status = 1
            })

        },
        reject(index, row) {
            reject(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list[index].status = 2
            })
        },
        handleDelete(index, row) {
            deleteById(row.id).then(response => {
                this.$message({ message: response.data, type: 'success' });
                this.list.splice(index, 1)
                this.total = this.total - 1
            })

        }
    }
}
</script>
  