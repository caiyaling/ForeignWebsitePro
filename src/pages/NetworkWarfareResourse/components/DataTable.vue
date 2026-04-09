<script setup>
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElTag, ElProgress, ElPagination, ElSelect, ElOption, ElDatePicker, ElTooltip, ElInput, ElButton, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import SearchBar from './SearchBar.vue'

const router = useRouter()

// 打开附件预览
const openAttachment = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const props = defineProps({
  title: {
    type: String,
    default: '账号台账'
  },
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
  tableData: {
    type: Array,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 100
  },
  currentPage: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  columns: {
    type: Array,
    default: () => []
  },
  platformOptions: {
    type: Array,
    default: () => ['Facebook', 'Instagram', 'Twitter']
  },
  showSampledFilter: {
    type: Boolean,
    default: true
  },
  showStatusFilter: {
    type: Boolean,
    default: true
  },
  // 详情模式：隐藏搜索栏，显示标题栏
  detailMode: {
    type: Boolean,
    default: false
  },
  // 详情模式下拉筛选器配置
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
  },
  // 表格最大高度（用于滚动，默认400px）
  maxHeight: {
    type: Number,
    default: 400
  },
  // 是否隐藏默认搜索栏
  hideSearchBar: {
    type: Boolean,
    default: false
  },
  // 设备模式：显示设备页面的搜索栏
  deviceMode: {
    type: Boolean,
    default: false
  },
  // 设备模式 - 所属项目选项
  projectOptions: {
    type: Array,
    default: () => []
  },
  // 设备模式 - 品牌选项
  brandOptions: {
    type: Array,
    default: () => []
  },
  // 设备模式 - 是否显示操作按钮
  showActionButtons: {
    type: Boolean,
    default: true
  },
  // 设备模式 - 导入按钮文字
  importButtonText: {
    type: String,
    default: '批量导入'
  },
  // 设备模式 - 导出按钮文字
  exportButtonText: {
    type: String,
    default: '批量导出'
  },
  // 设备模式 - 搜索框placeholder
  searchPlaceholder: {
    type: String,
    default: '关键词：编号'
  },
  // 设备模式 - 是否显示第二个下拉筛选器（品牌）
  showBrandFilter: {
    type: Boolean,
    default: true
  },
  // 设备模式 - 第二个下拉筛选器的placeholder
  brandPlaceholder: {
    type: String,
    default: '选择品牌'
  }
})

const emit = defineEmits(['update:filters', 'search', 'update:pageSize', 'update:currentPage', 'update:selectValue', 'update:selectValue2', 'delete', 'batchImport', 'batchExport'])

const handleSearch = () => {
  emit('search')
}

const handlePageSizeChange = (val) => {
  emit('update:pageSize', val)
}

const handleCurrentPageChange = (val) => {
  emit('update:currentPage', val)
}

const handleSelectChange = (val) => {
  emit('update:selectValue', val)
}

const handleSelectChange2 = (val) => {
  emit('update:selectValue2', val)
}

// 设备模式筛选器更新
const updateDeviceFilter = (key, value) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

// 批量导入
const handleBatchImport = () => {
  emit('batchImport')
}

// 批量导出
const handleBatchExport = () => {
  emit('batchExport')
}

// 点击详情跳转到账号详情页
const handleDetailClick = (row) => {
  router.push({
    path: '/account-detail',
    query: {
      accountId: row.accountId || row.id,
      from: router.currentRoute.value.path,
      accountType: row.accountType || ''
    }
  })
}

// 点击删除
const handleDeleteClick = (row) => {
  emit('delete', row)
}

// 获取申诉结果样式类名
const getResultClass = (result) => {
  const classMap = {
    '通过': 'result-pass',
    '驳回': 'result-reject',
    '待定': 'result-pending'
  }
  return classMap[result] || ''
}
</script>

<template>
  <section class="table-panel" ref="tablePanelRef">
    <!-- 详情模式标题栏 -->
    <div v-if="detailMode" class="detail-header">
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

    <!-- 列表模式搜索栏 -->
    <div v-if="!detailMode && !hideSearchBar && !deviceMode" class="search-bar-wrapper">
      <search-bar
        :title="title"
        :filters="filters"
        :platform-options="platformOptions"
        :show-sampled-filter="showSampledFilter"
        :show-status-filter="showStatusFilter"
        @update:filters="val => emit('update:filters', val)"
        @search="handleSearch"
      />
    </div>

    <!-- 设备模式搜索栏 -->
    <div v-if="deviceMode" class="search-bar-wrapper">
      <div class="device-search-bar">
        <div class="title-spacer"></div>
        <span class="table-title">{{ title }}</span>
        <div class="filters">
          <div class="search-input-wrapper">
            <div class="search-prefix">
              <el-icon :size="14"><Search /></el-icon>
            </div>
            <el-input
              :model-value="filters.keyword"
              :placeholder="searchPlaceholder"
              clearable
              class="search-input"
              @update:model-value="val => updateDeviceFilter('keyword', val)"
            />
          </div>
          <el-select
            :model-value="filters.project"
            placeholder="所属项目"
            clearable
            class="filter-select"
            @update:model-value="val => updateDeviceFilter('project', val)"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            v-if="showBrandFilter"
            :model-value="filters.brand"
            :placeholder="brandPlaceholder"
            clearable
            class="filter-select"
            @update:model-value="val => updateDeviceFilter('brand', val)"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
          <div class="table-header-spacer"></div>
        </div>
        <div v-if="showActionButtons" class="action-buttons">
          <el-button class="outline-btn" @click="handleBatchImport">{{ importButtonText }}</el-button>
          <el-button class="outline-btn" @click="handleBatchExport">{{ exportButtonText }}</el-button>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <el-table
        :data="tableData"
        stripe
        class="data-table"
        :max-height="maxHeight"
      >
      <el-table-column type="index" label="序号" width="60" align="center" />

      <template v-for="col in columns" :key="col.prop">
        <!-- 进度条列 -->
        <el-table-column
          v-if="col.type === 'progress'"
          :label="col.label"
          :width="col.width"
        >
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress :percentage="row[col.prop]" :stroke-width="6" :show-text="false" color="#0048FF" />
              <span class="progress-text">{{ row[col.prop] }}%</span>
            </div>
          </template>
        </el-table-column>

        <!-- 状态标签列 -->
        <el-table-column
          v-else-if="col.type === 'status'"
          :label="col.label"
          :width="col.width"
        >
          <template #default="{ row }">
            <el-tag :type="row[col.prop] === '正常' ? 'success' : 'danger'" size="small">
              {{ row[col.prop] }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 申诉状态列 -->
        <el-table-column
          v-else-if="col.type === 'appealStatus'"
          :label="col.label"
          :min-width="col.minWidth"
          :sortable="col.sortable"
        >
          <template #default="{ row }">
            <el-tag
              :type="row[col.prop] === '已完成' ? 'success' : 'warning'"
              size="small"
            >
              {{ row[col.prop] }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 申诉结果列 -->
        <el-table-column
          v-else-if="col.type === 'appealResult'"
          :label="col.label"
          :min-width="col.minWidth"
          :sortable="col.sortable"
        >
          <template #default="{ row }">
            <span :class="['appeal-result', getResultClass(row[col.prop])]">
              {{ row[col.prop] }}
            </span>
          </template>
        </el-table-column>

        <!-- 是否爆款列 -->
        <el-table-column
          v-else-if="col.type === 'isHot'"
          :label="col.label"
          :width="col.width"
          :sortable="col.sortable"
        >
          <template #default="{ row }">
            <span :class="['hot-text', { 'is-hot': row[col.prop] === '是' }]">
              {{ row[col.prop] }}
            </span>
          </template>
        </el-table-column>

        <!-- 文本溢出tooltip列 -->
        <el-table-column
          v-else-if="col.type === 'overflow'"
          :label="col.label"
          :width="col.width"
          :sortable="col.sortable"
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row[col.prop]"
              placement="top"
              :disabled="!row[col.prop] || row[col.prop].length <= 10"
            >
              <span class="overflow-text">{{ row[col.prop] }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 附件编号列 -->
        <el-table-column
          v-else-if="col.type === 'attachment'"
          :label="col.label"
          :width="col.width"
          :sortable="col.sortable"
        >
          <template #default="{ row }">
            <div class="attachment-list">
              <template v-if="Array.isArray(row[col.prop])">
                <span
                  v-for="(file, index) in row[col.prop]"
                  :key="index"
                  class="attachment-link"
                  @click="openAttachment(file.url)"
                >
                  {{ file.name }}
                </span>
              </template>
              <span v-else class="attachment-link" @click="openAttachment(row[col.prop + 'Url'])">
                {{ row[col.prop] }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-else-if="col.type === 'action'"
          :label="col.label"
          :width="col.width"
          fixed="right"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <span v-if="col.actionType === 'delete'" class="action-btn delete-btn" @click="handleDeleteClick(row)">删除</span>
              <span v-else class="action-btn" @click="handleDetailClick(row)">详情</span>
            </div>
          </template>
        </el-table-column>

        <!-- 普通文本列（支持排序） -->
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :align="col.align"
          :sortable="col.sortable"
        />
      </template>
    </el-table>
    </div>

    <div class="pagination-bar">
      <span class="total-text">共{{ total }}条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next"
        background
        @update:current-page="handleCurrentPageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.table-panel {
  flex: 1;
  min-height: 0;
  padding: 20px 20px 16px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-bar-wrapper {
  flex-shrink: 0;
  margin-bottom: 16px;
}

/* 设备模式搜索栏样式 */
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

.device-search-bar .table-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
  flex-shrink: 0;
  width: 135px;
}

.device-search-bar .filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.device-search-bar .search-input-wrapper {
  display: flex;
  align-items: center;
  width: 398px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.device-search-bar .search-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 32px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-right: none;
  border-radius: 4px 0 0 4px;
  flex-shrink: 0;
  color: #606266;
}

.device-search-bar .search-input {
  flex: 1;
  min-width: 0;
}

.device-search-bar .search-input :deep(.el-input__wrapper) {
  border-radius: 0 4px 4px 0;
  height: 32px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  padding: 0 8px;
}

.device-search-bar .search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.device-search-bar .search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0048FF inset;
}

.device-search-bar .search-input :deep(.el-input__inner) {
  height: 22px;
  font-size: 13px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.device-search-bar .search-input :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 13px;
}

.device-search-bar .filter-select {
  flex: 1;
  min-width: 0;
  max-width: 248px;
}

.device-search-bar .filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 0 8px;
  height: 32px;
}

.device-search-bar .filter-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.device-search-bar .filter-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0048FF inset;
}

.device-search-bar .filter-select :deep(.el-input__inner) {
  height: 22px;
  font-size: 14px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.device-search-bar .filter-select :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 14px;
}

.device-search-bar .search-btn {
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

.device-search-bar .search-btn:hover,
.device-search-bar .search-btn:focus {
  background: #3370ff;
  border-color: #3370ff;
}

.device-search-bar .table-header-spacer {
  width: 280px;
  flex-shrink: 0;
}

.device-search-bar .action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.device-search-bar .outline-btn {
  height: 32px;
  padding: 0 16px;
  background: #ecf5ff;
  border: 1px solid #0048ff;
  border-radius: 4px;
  color: #0048ff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.device-search-bar .outline-btn:hover {
  background: #d9ecff;
  border-color: #3370ff;
  color: #3370ff;
}

/* 详情模式标题栏样式 */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.detail-header .header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-header .title-spacer {
  width: 4px;
  height: 20px;
  background: #0048FF;
  border-radius: 2px;
}

.detail-header .table-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.detail-header .header-right {
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

.table-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 表格样式 */
.data-table {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #EBEEF5;
}

:deep(.el-table__header th) {
  background: #F5F7FA !important;
  color: #909399 !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif !important;
  border-bottom: 1px solid #EBEEF5 !important;
  height: 44px !important;
  padding: 8px 12px !important;
  box-sizing: border-box !important;
}

:deep(.el-table__header th .cell) {
  padding: 0 !important;
  line-height: 28px !important;
}

:deep(.el-table__body td) {
  color: #303133;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  border-bottom: 1px solid #EBEEF5;
  height: 51px;
  padding: 0 12px;
  box-sizing: border-box;
}

:deep(.el-table__body td .cell) {
  padding: 0;
  line-height: 51px;
}

:deep(.el-table__body .el-table__row:hover > td) {
  background: #F5F7FA;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.progress-cell :deep(.el-progress) {
  flex: 1;
}

.progress-cell :deep(.el-progress-bar) {
  width: 100%;
}

.progress-cell :deep(.el-progress-bar__outer) {
  background: #EBEDF0;
  border-radius: 20px;
}

.progress-cell :deep(.el-progress-bar__inner) {
  border-radius: 20px;
  background: #0048FF !important;
}

.progress-text {
  font-size: 12px;
  color: #606266;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  min-width: 32px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  cursor: pointer;
  color: #0048FF;
}

.action-btn:hover {
  opacity: 0.8;
}

.delete-btn {
  color: #F53F3F;
}

/* 是否爆款样式 */
.hot-text {
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #303133;

  &.is-hot {
    color: #F53F3F;
  }
}

/* 文本溢出样式 */
.overflow-text {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #303133;
}

/* 申诉结果样式 */
.appeal-result {
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;

  &.result-pass {
    color: #00B42A;
  }

  &.result-reject {
    color: #F53F3F;
  }

  &.result-pending {
    color: #86909C;
  }
}

/* 附件列表样式 */
.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-link {
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #165DFF;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #4080FF;
  }

  &:not(:last-child)::after {
    content: '、';
    color: #165DFF;
  }
}

/* 分页样式 */
.pagination-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 16px;
}

.total-text {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  margin-right: 16px;
}

:deep(.el-pagination) {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.el-pagination__total) {
  display: none;
}

:deep(.el-pagination__sizes) {
  margin: 0;
  display: flex;
  align-items: center;
}

:deep(.el-pagination .el-select) {
  margin: 0;
}

:deep(.el-pagination .el-select .el-input) {
  width: 80px;
  height: 32px;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper) {
  border-radius: 2px;
  box-shadow: none;
  border: 1px solid #DCDFE6;
  padding: 0 8px 0 12px;
  height: 32px;
  background: #fff;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper:hover) {
  border-color: #DCDFE6;
}

:deep(.el-pagination .el-select .el-input .el-input__inner) {
  color: #606266;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  text-align: left;
}

:deep(.el-pagination button),
:deep(.el-pagination .el-pager li) {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #606266;
  background: #F5F7FA;
  border: none;
  margin: 0 4px;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #0060FF;
  background: #F5F7FA;
}

:deep(.el-pagination .el-pager li.is-active),
:deep(.el-pagination .el-pager li.is-active:hover) {
  background: #0060FF;
  color: #FFFFFF;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: #F5F7FA;
  border-radius: 2px;
  color: #606266;
  min-width: 32px;
  height: 32px;
  padding: 0;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  background: #F5F7FA;
  color: #0060FF;
}

:deep(.el-pagination .el-pager li.is-disabled) {
  color: #C0C4CC;
  background: #F5F7FA;
}

:deep(.el-pagination .el-icon) {
  color: #606266;
}

:deep(.el-pagination .el-select__caret) {
  color: #606266;
}

:deep(.el-select-dropdown__item) {
  font-size: 14px;
  color: #606266;
}

:deep(.el-select-dropdown__item.is-selected) {
  color: #0060FF;
  font-weight: 700;
}
</style>
