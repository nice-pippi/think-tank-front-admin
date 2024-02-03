<template>
    <div class="app-container">
        <el-button type="primary" size="medium" style="margin-bottom: 15px;" @click="openBlockBigTypeDialog">
            新增大分类
        </el-button>
        <el-button type="success" size="medium" style="margin-bottom: 15px;" @click="openBlockSmallTypeDialog">
            新增小分类
        </el-button>
        <el-dialog title="新增大分类" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="blockBigTypeForm">
                <el-form-item label="大分类名称" :label-width="formLabelWidth">
                    <el-input v-model="blockBigTypeForm.bigTypeName" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBlockBigTypeDialog">取 消</el-button>
                <el-button type="primary" @click="submitAddBlockBigType">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增小分类" :visible.sync="dialogFormVisible2" width="500px">
            <el-form :model="blockSmallTypeForm">
                <el-form-item label="所属大分类" :label-width="formLabelWidth">
                    <el-select v-model="blockSmallTypeForm.bigTypeId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.id" :label="item.bigTypeName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小分类名称" :label-width="formLabelWidth">
                    <el-input v-model="blockSmallTypeForm.smallTypeName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBlockSmallTypeDialog">取 消</el-button>
                <el-button type="primary" @click="submitAddBlockSmallType">确 定</el-button>
            </div>
        </el-dialog>
        <el-tree :data="treeData" :props="treeProps" show-checkbox node-key="id" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">
                        删除
                    </el-button>
                </span>
            </span>
        </el-tree>
    </div>
</template>
  
<script>
import { addBlockBigType, addBlockSmallType, deleteBlockBigType, deleteBlockSmallType } from "@/api/manage-blockclassify";
import { getBlockClassify } from "@/api/block";
export default {
    data() {
        return {
            treeData: [],
            treeProps: {
                children: 'subCategories',
                label: 'name',
            },
            dialogFormVisible: false,
            dialogFormVisible2: false,
            formLabelWidth: '90px',
            blockBigTypeForm: {
                bigTypeName: ''
            },
            blockSmallTypeForm: {
                bigTypeId: '',
                smallTypeName: ''
            },
            options: []
        }
    },
    created() {
        this.getAllBlockClassify()
    },
    methods: {
        getAllBlockClassify() {
            // 检查 localStorage 中是否已存在 blockClassify
            const blockClassify = localStorage.getItem("blockClassify");
            if (blockClassify) {
                let data = JSON.parse(blockClassify)
                data.forEach(category => {
                    category.name = category.bigTypeName;
                    delete category.bigTypeName;
                    category.subCategories.forEach(subCategory => {
                        subCategory.name = subCategory.smallTypeName;
                        delete subCategory.smallTypeName;
                    });
                });
                this.treeData = data;
            } else {
                getBlockClassify().then(response => {
                    localStorage.setItem("blockClassify", JSON.stringify(response.data));
                    let data = response.data;
                    data.forEach(category => {
                        category.name = category.bigTypeName;
                        delete category.bigTypeName;
                        category.subCategories.forEach(subCategory => {
                            subCategory.name = subCategory.smallTypeName;
                            delete subCategory.smallTypeName;
                        });
                    });
                    this.treeData = data;
                });
            }

        },
        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.subCategories || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            if (node.level == 1) {
                deleteBlockBigType(data.id).then(response => {
                    this.$message({ message: response.data, type: 'success' });
                    localStorage.removeItem('blockClassify')
                    setTimeout(() => {
                        location.reload()
                    }, 700);
                })
                return
            }
            if (node.level == 2) {
                deleteBlockSmallType(data.id).then(response => {
                    this.$message({ message: response.data, type: 'success' });
                    localStorage.removeItem('blockClassify')
                    setTimeout(() => {
                        location.reload()
                    }, 700);
                })
                return
            }
        },
        openBlockBigTypeDialog() {
            this.dialogFormVisible = true
        },
        closeBlockBigTypeDialog() {
            this.dialogFormVisible = false
            this.blockBigTypeForm.bigTypeName = ''
        },
        openBlockSmallTypeDialog() {
            this.dialogFormVisible2 = true
            const data = JSON.parse(localStorage.getItem("blockClassify"))
            this.options = data
        },
        closeBlockSmallTypeDialog() {
            this.dialogFormVisible2 = false
            this.blockSmallTypeForm.bigTypeId = ''
            this.blockSmallTypeForm.smallTypeName = ''
        },
        // 选中子节点后的操作
        handleChange(value) {
            this.blockSmallTypeForm.bigTypeId = value[0]
            console.log(this.blockSmallTypeForm);
        },
        submitAddBlockBigType() {
            addBlockBigType(this.blockBigTypeForm).then(response => {
                this.closeBlockBigTypeDialog();
                this.$message({ message: '新增成功', type: 'success' });
                localStorage.removeItem('blockClassify')
                localStorage.removeItem('bigTypeList')
                setTimeout(() => {
                    location.reload()
                }, 500);
            });
        },
        submitAddBlockSmallType() {
            addBlockSmallType(this.blockSmallTypeForm).then(response => {
                this.closeBlockSmallTypeDialog()
                this.$message({ message: '新增成功', type: 'success' });
                localStorage.removeItem('blockClassify')
                localStorage.removeItem('smallTypeList')
                setTimeout(() => {
                    location.reload()
                }, 500);
            });
        }
    }
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>