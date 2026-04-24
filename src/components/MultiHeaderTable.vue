<script setup>
/**
 * @description 多级表头表格组件
 * @date 2024-04-24
 */
import { computed } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 是否显示复选框
  showSelection: {
    type: Boolean,
    default: false
  },
  // 是否显示序号
  showIndex: {
    type: Boolean,
    default: false
  },
  // 表格高度
  height: {
    type: [Number, String],
    default: 600
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 分页 - 当前页
  currentPage: {
    type: Number,
    default: 1
  },
  // 分页 - 每页条数
  pageSize: {
    type: Number,
    default: 10
  },
  // 分页 - 总条数
  total: {
    type: Number,
    default: 0
  },
  // 分页 - 可选每页条数
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'page-change',
  'page-size-change',
  'selection-change',
  'row-click'
])

// 计算序号
const getIndex = (index) => {
  return (props.currentPage - 1) * props.pageSize + index + 1
}

// 处理分页变化
const handlePageChange = (page) => {
  emit('page-change', page)
}

const handlePageSizeChange = (size) => {
  emit('page-size-change', size)
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 渲染列
const renderColumn = (column) => {
  // 如果有子列，渲染多级表头
  if (column.children && column.children.length > 0) {
    return `
      <el-table-column
        label="${column.label}"
        align="${column.align || 'center'}"
      >
        ${column.children.map(child => renderColumn(child)).join('')}
      </el-table-column>
    `
  }

  // 渲染普通列
  const width = column.width ? `width="${column.width}"` : ''
  const minWidth = column.minWidth ? `min-width="${column.minWidth}"` : ''
  const align = column.align ? `align="${column.align}"` : ''
  const fixed = column.fixed ? `fixed="${column.fixed}"` : ''
  const showOverflowTooltip = column.showOverflowTooltip ? 'show-overflow-tooltip' : ''

  return `
    <el-table-column
      prop="${column.prop || ''}"
      label="${column.label}"
      ${width}
      ${minWidth}
      ${align}
      ${fixed}
      ${showOverflowTooltip}
    />
  `
}
</script>

<template>
  <div class="multi-header-table-container">
    <!-- 表格 -->
    <div class="table-wrapper">
      <el-table
        :data="data"
        :height="height"
        v-loading="loading"
        border
        stripe
        class="multi-header-table"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框列 -->
        <el-table-column
          v-if="showSelection"
          type="selection"
          width="38"
          align="center"
        />

        <!-- 序号列 -->
        <el-table-column
          v-if="showIndex"
          label="序号"
          width="60"
          align="center"
          :index="getIndex"
          type="index"
        />

        <!-- 动态列渲染 -->
        <template v-for="(column, index) in columns" :key="index">
          <!-- 多级表头 -->
          <el-table-column
            v-if="column.children && column.children.length > 0"
            :label="column.label"
            :align="column.align || 'center'"
          >
            <template v-for="(child, childIndex) in column.children" :key="childIndex">
              <el-table-column
                v-if="child.children && child.children.length > 0"
                :label="child.label"
                :align="child.align || 'center'"
              >
                <el-table-column
                  v-for="(grandChild, grandChildIndex) in child.children"
                  :key="grandChildIndex"
                  :prop="grandChild.prop"
                  :label="grandChild.label"
                  :width="grandChild.width"
                  :align="grandChild.align"
                  :fixed="grandChild.fixed"
                  :show-overflow-tooltip="grandChild.showOverflowTooltip"
                >
                  <template v-if="grandChild.slot" #default="scope">
                    <slot :name="grandChild.slot" :row="scope.row" :$index="scope.$index" />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-else
                :prop="child.prop"
                :label="child.label"
                :width="child.width"
                :align="child.align"
                :fixed="child.fixed"
                :show-overflow-tooltip="child.showOverflowTooltip"
              >
                <template v-if="child.slot" #default="scope">
                  <slot :name="child.slot" :row="scope.row" :$index="scope.$index" />
                </template>
              </el-table-column>
            </template>
          </el-table-column>

          <!-- 普通列 -->
          <el-table-column
            v-else
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :align="column.align"
            :fixed="column.fixed"
            :show-overflow-tooltip="column.showOverflowTooltip"
          >
            <template v-if="column.slot" #default="scope">
              <slot :name="column.slot" :row="scope.row" :$index="scope.$index" />
            </template>
          </el-table-column>
        </template>

        <!-- 默认插槽 - 用于自定义操作列等 -->
        <slot name="append-columns" />
      </el-table>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-bar">
      <span class="total-text">共{{ total }}条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="sizes, prev, pager, next"
        background
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-header-table-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.multi-header-table {
  width: 100%;
}

:deep(.el-table__header) {
  th {
    background: #f5f7fa !important;
    color: #909399 !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    border-bottom: 1px solid #ebeef5 !important;
    padding: 8px 12px !important;
  }

  .el-table__cell.el-table__column--group {
    background: #e6e8eb !important;
    border-bottom: 1px solid #e4e7ed !important;
  }
}

:deep(.el-table__body) {
  td {
    color: #303133;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    height: 51px;
    padding: 0 12px;
  }
}

:deep(.el-table__row:hover > td) {
  background: #f5f7fa !important;
}

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
  color: rgba(0, 0, 0, 0.6);
}

:deep(.el-pagination) {
  display: flex;
  align-items: center;
}

:deep(.el-pagination__total) {
  display: none;
}

:deep(.el-pagination button),
:deep(.el-pagination .el-pager li) {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 14px;
  color: #606266;
  background: #f5f7fa;
  border: none;
  margin: 0 4px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #0060ff;
  color: #fff;
}
</style>
