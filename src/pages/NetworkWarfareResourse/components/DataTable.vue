<script setup>
/**
 * @description 数据表格组件
 * @date 2024-04-09
 */
import SearchBar from './SearchBar.vue'
import DeviceSearchBar from './DeviceSearchBar.vue'
import DetailSearchBar from './DetailSearchBar.vue'
import TableContent from './TableContent.vue'

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
  // 表格最大高度（用于滚动，传null或0表示自适应容器高度）
  maxHeight: {
    type: Number,
    default: null
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
  // 设备模式 - 是否显示所属项目筛选器
  showProjectFilter: {
    type: Boolean,
    default: true
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
  },
  // 设备模式 - 第二个下拉筛选器的key
  brandFilterKey: {
    type: String,
    default: 'brand'
  },
  // 设备模式 - 是否显示第三个下拉筛选器
  showThirdFilter: {
    type: Boolean,
    default: false
  },
  // 设备模式 - 第三个下拉筛选器的placeholder
  thirdFilterPlaceholder: {
    type: String,
    default: '请选择'
  },
  // 设备模式 - 第三个下拉筛选器的选项
  thirdFilterOptions: {
    type: Array,
    default: () => []
  },
  // 设备模式 - 第三个下拉筛选器的key
  thirdFilterKey: {
    type: String,
    default: 'thirdFilter'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 自定义筛选器配置（用于设备模式）
  // 格式: [{ key: 'accountType', placeholder: '账号类型', options: ['采集', '发声'] }]
  customFilters: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters', 'search', 'update:pageSize', 'update:currentPage', 'pageChange', 'update:selectValue', 'update:selectValue2', 'update:thirdFilter', 'delete', 'detail', 'attachment-click', 'batchImport', 'batchExport'])

const handleSearch = () => {
  emit('search')
}

const handlePageSizeChange = (val) => {
  emit('update:pageSize', val)
  emit('pageChange', { page: props.currentPage, pageSize: val })
}

const handleCurrentPageChange = (val) => {
  emit('update:currentPage', val)
  emit('pageChange', { page: val, pageSize: props.pageSize })
}

const handlePageChange = (val) => {
  emit('pageChange', val)
}

// 批量导入
const handleBatchImport = () => {
  emit('batchImport')
}

// 批量导出
const handleBatchExport = () => {
  emit('batchExport')
}

// 点击删除
const handleDelete = (row) => {
  emit('delete', row)
}

// 点击详情
const handleDetail = (row) => {
  emit('detail', row)
}

// 点击附件
const handleAttachmentClick = (url) => {
  emit('attachment-click', url)
}
</script>

<template>
  <section class="table-panel" ref="tablePanelRef">
    <!-- 详情模式标题栏 -->
    <detail-search-bar
      v-if="detailMode"
      :title="title"
      :show-select-filter="showSelectFilter"
      :select-options="selectOptions"
      :select-placeholder="selectPlaceholder"
      :select-value="selectValue"
      :show-select-filter2="showSelectFilter2"
      :select-options2="selectOptions2"
      :select-placeholder2="selectPlaceholder2"
      :select-value2="selectValue2"
      :show-date-picker="showDatePicker"
      @update:select-value="val => emit('update:selectValue', val)"
      @update:select-value2="val => emit('update:selectValue2', val)"
    />

    <!-- 列表模式搜索栏 -->
    <div v-if="!detailMode && !hideSearchBar && !deviceMode" class="search-bar-wrapper">
      <search-bar
        :title="title"
        :filters="filters"
        :platform-options="platformOptions"
        :account-type-options="accountTypeOptions"
        :latest-status-options="latestStatusOptions"
        :show-sampled-filter="showSampledFilter"
        :show-status-filter="showStatusFilter"
        @update:filters="val => emit('update:filters', val)"
        @search="handleSearch"
      />
    </div>

    <!-- 设备模式搜索栏 -->
    <div v-if="deviceMode" class="search-bar-wrapper">
      <device-search-bar
        :title="title"
        :filters="filters"
        :search-placeholder="searchPlaceholder"
        :project-options="projectOptions"
        :show-project-filter="showProjectFilter"
        :brand-options="brandOptions"
        :show-brand-filter="showBrandFilter"
        :brand-placeholder="brandPlaceholder"
        :brand-filter-key="brandFilterKey"
        :show-third-filter="showThirdFilter"
        :third-filter-placeholder="thirdFilterPlaceholder"
        :third-filter-options="thirdFilterOptions"
        :third-filter-key="thirdFilterKey"
        :show-action-buttons="showActionButtons"
        :import-button-text="importButtonText"
        :export-button-text="exportButtonText"
        :custom-filters="customFilters"
        @update:filters="val => emit('update:filters', val)"
        @search="handleSearch"
        @batch-import="handleBatchImport"
        @batch-export="handleBatchExport"
      />
    </div>

    <!-- 表格内容（含分页） -->
    <table-content
      :table-data="tableData"
      :columns="columns"
      :max-height="maxHeight"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :loading="loading"
      @delete="handleDelete"
      @detail="handleDetail"
      @attachment-click="handleAttachmentClick"
      @update:page-size="handlePageSizeChange"
      @update:current-page="handleCurrentPageChange"
      @page-change="handlePageChange"
    />
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
</style>
