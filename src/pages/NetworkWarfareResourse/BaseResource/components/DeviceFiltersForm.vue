<script setup>
/**
 * @description 专用设备筛选表单组件
 * @date 2024-04-09
 */
import { ElInput, ElSelect, ElOption, ElButton } from 'element-plus'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      keyword: '',
      project: '',
      brand: ''
    })
  }
})

const emit = defineEmits(['update:filters', 'search'])

// 所属项目选项
const projectOptions = ['项目A', '项目B', '项目C']

// 品牌选项
const brandOptions = ['苹果', '三星', '谷歌', '红米', 'Vivo', 'Oppo']

const updateFilter = (key, value) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

const handleSearch = () => {
  emit('search')
}

const handleBatchImport = () => {
  console.log('批量导入')
}

const handleBatchExport = () => {
  console.log('批量导出')
}
</script>

<template>
  <div class="device-filters-form">
    <!-- 搜索输入框 -->
    <div class="search-input-wrapper">
      <div class="search-prefix">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="4.5" stroke="#606266" stroke-width="1.5"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="#606266" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <el-input
        :model-value="filters.keyword"
        placeholder="关键词：编号"
        class="search-input"
        clearable
        @update:model-value="val => updateFilter('keyword', val)"
      />
    </div>

    <!-- 所属项目 -->
    <el-select
      :model-value="filters.project"
      placeholder="所属项目"
      class="filter-select"
      clearable
      @update:model-value="val => updateFilter('project', val)"
    >
      <el-option
        v-for="item in projectOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

    <!-- 选择品牌 -->
    <el-select
      :model-value="filters.brand"
      placeholder="选择品牌"
      class="filter-select"
      clearable
      @update:model-value="val => updateFilter('brand', val)"
    >
      <el-option
        v-for="item in brandOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

    <!-- 搜索按钮 -->
    <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>

    <!-- 占位空间 -->
    <div class="spacer"></div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button class="outline-btn" @click="handleBatchImport">批量导入</el-button>
      <el-button class="outline-btn" @click="handleBatchExport">批量导出</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-filters-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 398px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.search-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-right: none;
  border-radius: 4px 0 0 4px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 0 4px 4px 0;
  height: 32px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  padding: 0 8px;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0048FF inset;
}

.search-input :deep(.el-input__inner) {
  height: 22px;
  font-size: 13px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 13px;
}

.filter-select {
  flex: 1;
  min-width: 0;
  max-width: 248px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 0 8px;
  height: 32px;
  background: #fff;
}

.filter-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.filter-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0048FF inset;
}

.filter-select :deep(.el-input__inner) {
  height: 22px;
  font-size: 14px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.filter-select :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 14px;
}

.search-btn {
  height: 32px;
  padding: 0 16px;
  background: #0048FF;
  border-color: #0048FF;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  flex-shrink: 0;
}

.search-btn:hover,
.search-btn:focus {
  background: #3370ff;
  border-color: #3370ff;
}

.spacer {
  flex: 1;
  min-width: 280px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.outline-btn {
  height: 32px;
  padding: 0 16px;
  background: #ecf5ff;
  border: 1px solid #0048FF;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #0048FF;
}

.outline-btn:hover,
.outline-btn:focus {
  background: #d9ecff;
  border-color: #0048FF;
  color: #0048FF;
}
</style>
