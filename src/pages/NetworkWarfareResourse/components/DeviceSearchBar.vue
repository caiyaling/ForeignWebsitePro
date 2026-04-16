<script setup>
/**
 * @description 设备资源搜索栏组件
 * @date 2024-04-13
 */
import { computed } from 'vue'
import { ElInput, ElSelect, ElOption, ElButton, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  // 表格标题
  title: {
    type: String,
    default: '台账'
  },
  // 筛选条件
  filters: {
    type: Object,
    default: () => ({
      keyword: '',
      project: '',
      brand: ''
    })
  },
  // 搜索框placeholder
  searchPlaceholder: {
    type: String,
    default: '关键词：编号'
  },
  // 所属项目选项
  projectOptions: {
    type: Array,
    default: () => []
  },
  // 是否显示所属项目筛选器
  showProjectFilter: {
    type: Boolean,
    default: true
  },
  // 品牌选项
  brandOptions: {
    type: Array,
    default: () => []
  },
  // 是否显示品牌筛选器
  showBrandFilter: {
    type: Boolean,
    default: true
  },
  // 品牌筛选器的placeholder
  brandPlaceholder: {
    type: String,
    default: '选择品牌'
  },
  // 品牌筛选器对应的key
  brandFilterKey: {
    type: String,
    default: 'brand'
  },
  // 是否显示第三个筛选器
  showThirdFilter: {
    type: Boolean,
    default: false
  },
  // 第三个筛选器的placeholder
  thirdFilterPlaceholder: {
    type: String,
    default: '请选择'
  },
  // 第三个筛选器的选项
  thirdFilterOptions: {
    type: Array,
    default: () => []
  },
  // 第三个筛选器对应的key
  thirdFilterKey: {
    type: String,
    default: 'thirdFilter'
  },
  // 是否显示操作按钮
  showActionButtons: {
    type: Boolean,
    default: true
  },
  // 导入按钮文字
  importButtonText: {
    type: String,
    default: '批量导入'
  },
  // 导出按钮文字
  exportButtonText: {
    type: String,
    default: '批量导出'
  },
  // 自定义筛选器配置（优先级高于默认筛选器）
  // 格式: [{ key: 'accountType', placeholder: '账号类型', options: ['采集', '发声'] }]
  customFilters: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters', 'search', 'batchImport', 'batchExport'])

// 计算筛选器数量
const filterCount = computed(() => {
  if (props.customFilters.length > 0) {
    return props.customFilters.length
  }
  let count = 0
  if (props.showProjectFilter) count++
  if (props.showBrandFilter) count++
  if (props.showThirdFilter) count++
  return count
})

// 根据筛选器数量计算宽度
const filterSelectWidth = computed(() => {
  // 根据设计稿：1个筛选框513px，2个筛选框各248px
  if (filterCount.value === 1) {
    return '513px'
  } else if (filterCount.value >= 2) {
    return '248px'
  }
  return '248px'
})

// 更新筛选条件
const updateFilter = (key, value) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

// 搜索
const handleSearch = () => {
  emit('search')
}

// 批量导入
const handleBatchImport = () => {
  emit('batchImport')
}

// 批量导出
const handleBatchExport = () => {
  emit('batchExport')
}
</script>

<template>
  <div class="device-search-bar">
    <!-- 标题区域 -->
    <div class="title-spacer"></div>
    <span class="table-title">{{ title }}</span>

    <!-- 筛选区域 -->
    <div class="filters">
      <!-- 搜索输入框 -->
      <div class="search-input-wrapper">
        <div class="search-prefix">
          <el-icon :size="14"><Search /></el-icon>
        </div>
        <el-input
          :model-value="filters.keyword"
          :placeholder="searchPlaceholder"
          clearable
          class="search-input"
          @update:model-value="val => updateFilter('keyword', val)"
        />
      </div>

      <!-- 下拉筛选器 -->
      <el-select
        v-if="customFilters.length > 0"
        v-for="filter in customFilters"
        :key="filter.key"
        :model-value="filters[filter.key]"
        :placeholder="filter.placeholder"
        clearable
        class="filter-select"
        :style="{ width: filterSelectWidth }"
        @update:model-value="val => updateFilter(filter.key, val)"
      >
        <el-option
          v-for="item in filter.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <!-- 默认筛选器 -->
      <template v-else>
        <!-- 所属项目 -->
        <el-select
          v-if="showProjectFilter"
          :model-value="filters.project"
          placeholder="所属项目"
          clearable
          class="filter-select"
          :style="{ width: filterSelectWidth }"
          @update:model-value="val => updateFilter('project', val)"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <!-- 品牌/第二筛选器 -->
        <el-select
          v-if="showBrandFilter"
          :model-value="filters[brandFilterKey]"
          :placeholder="brandPlaceholder"
          clearable
          class="filter-select"
          :style="{ width: filterSelectWidth }"
          @update:model-value="val => updateFilter(brandFilterKey, val)"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <!-- 第三筛选器 -->
        <el-select
          v-if="showThirdFilter"
          :model-value="filters[thirdFilterKey]"
          :placeholder="thirdFilterPlaceholder"
          clearable
          class="filter-select"
          :style="{ width: filterSelectWidth }"
          @update:model-value="val => updateFilter(thirdFilterKey, val)"
        >
          <el-option
            v-for="item in thirdFilterOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </template>

      <!-- 搜索按钮 -->
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>

      <!-- 占位区域 -->
      <div class="filter-spacer"></div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="showActionButtons" class="action-buttons">
      <el-button class="outline-btn" @click="handleBatchImport">{{ importButtonText }}</el-button>
      <el-button class="outline-btn" @click="handleBatchExport">{{ exportButtonText }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-spacer {
  width: 4px;
  height: 20px;
  background: #0048FF;
  border-radius: 2px;
  flex-shrink: 0;
}

.table-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
  flex-shrink: 0;
  width: 135px;
}

.filters {
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
  color: #606266;
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
  flex-shrink: 0;
}

.filter-spacer {
  width: 280px;
  height: 32px;
  flex-shrink: 0;
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
  color: #a8abb2;
  font-size: 14px;
}

.search-btn {
  height: 32px;
  min-width: 60px;
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

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.outline-btn {
  height: 32px;
  min-width: 88px;
  padding: 0 16px;
  background: #ecf5ff;
  border: 1px solid #0048ff;
  border-radius: 4px;
  color: #0048ff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.outline-btn:hover {
  background: #d9ecff;
  border-color: #3370ff;
  color: #3370ff;
}
</style>
