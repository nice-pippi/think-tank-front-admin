<template>
    <div class="app-container">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="举报时间" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="margin-right: 10px;" />
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属帖子" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column label="举报类型" width="80" align="center">
                <template slot-scope="scope">
                    {{ scope.row.reportTypeId | reasonText }}
                </template>
            </el-table-column>
            <el-table-column label="举报理由" width="250" align="center">
                <template slot-scope="scope">
                    {{ scope.row.reason }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态" width="80" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="280">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="look(scope.row.postId)">查看</el-button>
                    <el-button size="mini" type="info" @click="prohibit(scope.$index, scope.row)">禁言</el-button>
                    <el-button size="mini" type="success" @click="reject(scope.$index, scope.row)">驳回</el-button>
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
import { getList, prohibit, reject, deleteById } from '@/api/report-post'
import router from '@/router';

export default {
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
        },
        reasonText(reason) {
            switch (reason) {
                case 1:
                    return '色情低俗';
                case 2:
                    return '垃圾广告';
                case 3:
                    return '辱骂攻击';
                case 4:
                    return '违法犯罪';
                case 5:
                    return '政治相关';
                case 6:
                    return '少儿不宜';
                case 7:
                    return '侵权犯罪';
                case 8:
                    return '其它原因';

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
            },
            total: null
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
                this.total = Number(response.data.total)
            })
        },
        look(postId) {
            window.open('http://localhost:8585/PostIndex/' + postId)
        },
        prohibit(index, row) {
            prohibit(row.id).then(response => {
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