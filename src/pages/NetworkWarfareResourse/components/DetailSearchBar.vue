<script setup>
/**
 * @description 详情页面搜索栏组件
 * @date 2024-04-13
 */
import { ElSelect, ElOption, ElDatePicker } from 'element-plus'

const props = defineProps({
  // 表格标题
  title: {
    type: String,
    default: '台账'
  },
  // 第一个下拉筛选器配置
  showSelectFilter: {
    type: Boolean,
    default: false
  },
  selectOptions: {
    type: Array,
    default: () => []
  },
  selectPlaceholder: {
    type: String,
    default: '请选择'
  },
  selectValue: {
    type: String,
    default: ''
  },
  // 第二个下拉筛选器配置
  showSelectFilter2: {
    type: Boolean,
    default: false
  },
  selectOptions2: {
    type: Array,
    default: () => []
  },
  selectPlaceholder2: {
    type: String,
    default: '请选择'
  },
  selectValue2: {
    type: String,
    default: ''
  },
  // 日期选择器
  showDatePicker: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectValue', 'update:selectValue2'])

// 第一个下拉筛选器变化
const handleSelectChange = (val) => {
  emit('update:selectValue', val)
}

// 第二个下拉筛选器变化
const handleSelectChange2 = (val) => {
  emit('update:selectValue2', val)
}
</script>

<template>
  <div class="detail-header">
    <div class="header-left">
      <div class="title-spacer"></div>
      <span class="table-title">{{ title }}</span>
    </div>
    <div class="header-right">
      <div v-if="showSelectFilter" class="filter-item">
        <span class="filter-label">{{ selectPlaceholder }}</span>
        <el-select
          :model-value="selectValue"
          placeholder="请选择"
          size="small"
          class="filter-select"
          @update:model-value="handleSelectChange"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="showSelectFilter2" class="filter-item">
        <span class="filter-label">{{ selectPlaceholder2 }}</span>
        <el-select
          :model-value="selectValue2"
          placeholder="请选择"
          size="small"
          class="filter-select"
          @update:model-value="handleSelectChange2"
        >
          <el-option
            v-for="item in selectOptions2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-date-picker
        v-if="showDatePicker"
        type="daterange"
        size="small"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 280px"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-spacer {
  width: 4px;
  height: 20px;
  background: #0048FF;
  border-radius: 2px;
}

.table-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  width: 64px;
  font-size: 14px;
  color: #303133;
  font-family: var(--el-font-family, 'Inter', 'Microsoft YaHei', sans-serif);
  white-space: nowrap;
}

.filter-select {
  width: 324px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #DCDFE6 inset;
  padding: 0 8px;
  height: 32px;
  background: #fff;
}

.filter-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #C0C4CC inset;
}

.filter-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF inset;
}

.filter-select :deep(.el-input__inner) {
  font-size: 14px;
  color: #303133;
  font-family: var(--el-font-family, 'Inter', 'Microsoft YaHei', sans-serif);
}
</style>
