<template>
    <div class="block-classify">
        <el-select v-model="bigTypeSelect" placeholder="选择板块大分类" clearable @change="handleBigTypeChange" filterable>
            <el-option v-for="item in bigType" :key="item.id" :label="item.bigTypeName" :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="smallTypeSelect" placeholder="选择板块小分类" clearable style="margin-left: 20px;"
            @change="handleSmallTypeChange" filterable>
            <el-option v-for="item in smallType" :key="item.id" :label="item.smallTypeName" :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { getBigTypeList, getSmallTypeList } from "@/api/block";

export default {
    name: 'BlockClassify',
    data() {
        return {
            bigType: [],
            smallType: [],
            bigTypeSelect: '',
            smallTypeSelect: ''
        }
    },
    methods: {
        handleBigTypeChange() {
            this.$emit('bigTypeChange', this.bigTypeSelect);
        },
        handleSmallTypeChange() {
            this.$emit('smallTypeChange', this.smallTypeSelect);
        },
        async getBigType() {
            if (!localStorage.getItem("bigTypeList")) {
                let response = await getBigTypeList()
                if (response.status == 200) {
                    localStorage.setItem("bigTypeList", JSON.stringify(response.data))
                }
            }
            this.bigType = JSON.parse(localStorage.getItem("bigTypeList"))
        },
        async getSmallType() {
            if (!localStorage.getItem("smallTypeList")) {
                let response = await getSmallTypeList()
                if (response.status == 200) {
                    localStorage.setItem("smallTypeList", JSON.stringify(response.data))
                }
            }
            this.smallType = JSON.parse(localStorage.getItem("smallTypeList"))
        }
    },
    mounted() {
        this.getBigType()
        this.getSmallType()
    }
}
</script>