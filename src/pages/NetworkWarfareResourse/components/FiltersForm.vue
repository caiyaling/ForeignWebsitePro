<script setup>
/**
 * @description 筛选表单组件
 * @author Claude
 * @date 2026-04-08
 */
import { ElInput, ElSelect, ElOption, ElButton } from 'element-plus'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      keyword: '',
      accountType: '',
      platform: '',
      latestStatus: '',
      isSampled: ''
    })
  },
  platformOptions: {
    type: Array,
    default: () => []
  },
  accountTypeOptions: {
    type: Array,
    default: () => []
  },
  latestStatusOptions: {
    type: Array,
    default: () => ['正常', '异常']
  },
  showSampledFilter: {
    type: Boolean,
    default: true
  },
  showStatusFilter: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '关键词，账号ID，用户昵称'
  }
})

const emit = defineEmits(['update:filters', 'search'])

const isSampledOptions = ['是', '否']

const updateFilter = (key, value) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

const handleSearch = () => {
  emit('search')
}
</script>

<template>
  <div class="filters-form">
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
        :placeholder="searchPlaceholder"
        class="search-input"
        clearable
        @update:model-value="val => updateFilter('keyword', val)"
      />
    </div>

    <!-- 下拉筛选区域 -->
    <div class="select-filters">
      <el-select
        :model-value="filters.accountType"
        placeholder="账号类型"
        class="filter-select"
        clearable
        @update:model-value="val => updateFilter('accountType', val)"
      >
        <el-option
          v-for="item in props.accountTypeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        :model-value="filters.platform"
        placeholder="平台名称"
        class="filter-select"
        clearable
        @update:model-value="val => updateFilter('platform', val)"
      >
        <el-option
          v-for="item in platformOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        v-if="showStatusFilter"
        :model-value="filters.latestStatus"
        placeholder="最新状态"
        class="filter-select"
        clearable
        @update:model-value="val => updateFilter('latestStatus', val)"
      >
        <el-option
          v-for="item in props.latestStatusOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        v-if="showSampledFilter"
        :model-value="filters.isSampled"
        placeholder="是否抽检"
        class="filter-select"
        clearable
        @update:model-value="val => updateFilter('isSampled', val)"
      >
        <el-option
          v-for="item in isSampledOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>

    <!-- 搜索按钮 -->
    <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
  </div>
</template>

<style lang="scss" scoped>
.filters-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 319px;
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

.select-filters {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
  min-width: 0;
}

.filter-select {
  flex: 1;
  min-width: 0;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 0 8px;
  height: 32px;
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
  color: #303133;
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
</style>
