<script setup>
/**
 * @description 表格内容组件（包含表格和分页）
 * @date 2024-04-13
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElTable, ElTableColumn, ElTag, ElProgress, ElTooltip, ElButton, ElPagination } from 'element-plus'

// 表格容器引用
const tableWrapperRef = ref(null)
// 表格高度（动态计算）
const tableHeight = ref(null)

const props = defineProps({
  // 表格数据
  tableData: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 表格最大高度（用于滚动，传null或0表示自适应容器高度）
  maxHeight: {
    type: Number,
    default: null
  },
  // 当前页码
  currentPage: {
    type: Number,
    default: 1
  },
  // 每页条数
  pageSize: {
    type: Number,
    default: 10
  },
  // 总条数
  total: {
    type: Number,
    default: 0
  },
  // 可选的每页条数
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'detail', 'attachment-click', 'update:pageSize', 'update:currentPage', 'pageChange'])

// 点击详情
const handleDetailClick = (row) => {
  emit('detail', row)
}

// 点击删除
const handleDeleteClick = (row) => {
  emit('delete', row)
}

// 点击附件
const handleAttachmentClick = (url) => {
  emit('attachment-click', url)
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

// 分页相关
const handlePageSizeChange = (val) => {
  emit('update:pageSize', val)
  emit('pageChange', { page: props.currentPage, pageSize: val })
}

const handleCurrentPageChange = (val) => {
  emit('update:currentPage', val)
  emit('pageChange', { page: val, pageSize: props.pageSize })
}

// ResizeObserver 实例
let resizeObserver = null

// 更新表格高度
const updateTableHeight = () => {
  if (!tableWrapperRef.value) return

  // 如果传入了固定的 maxHeight，使用固定值
  if (props.maxHeight && props.maxHeight > 0) {
    tableHeight.value = props.maxHeight
    return
  }

  // 否则动态计算高度
  const wrapperHeight = tableWrapperRef.value.clientHeight
  if (wrapperHeight > 0) {
    tableHeight.value = wrapperHeight
  }
}

// 组件挂载后初始化 ResizeObserver
onMounted(() => {
  nextTick(() => {
    updateTableHeight()

    if (tableWrapperRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateTableHeight()
      })
      resizeObserver.observe(tableWrapperRef.value)
    }
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div class="table-container">
    <!-- 表格区域 -->
    <div class="table-wrapper" ref="tableWrapperRef">
      <el-table
        :data="tableData"
        stripe
        class="data-table"
        :height="tableHeight"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="60" align="center" />

        <template v-for="col in columns" :key="col.prop">
          <!-- 进度条列 -->
          <el-table-column
            v-if="col.type === 'progress'"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
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
            :min-width="col.minWidth"
          >
            <template #default="{ row }">
              <el-button
                v-if="row[col.prop]"
                :type="row[col.prop] === '已使用' ? 'danger' : 'primary'"
                plain
                size="small"
                class="status-btn"
              >
                {{ row[col.prop] }}
              </el-button>
              <span v-else></span>
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
            :min-width="col.minWidth"
            :sortable="col.sortable"
          >
            <template #default="{ row }">
              <span :class="['hot-text', { 'is-hot': row[col.prop] === '是' }]">
                {{ row[col.prop] }}
              </span>
            </template>
          </el-table-column>

          <!-- 文本溢出tooltip列（支持多行） -->
          <el-table-column
            v-else-if="col.type === 'overflow'"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :sortable="col.sortable"
          >
            <template #default="{ row }">
              <el-tooltip
                :content="row[col.prop]"
                placement="top"
                :disabled="!row[col.prop]"
              >
                <span class="multi-line-text">{{ row[col.prop] }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <!-- 附件编号列 -->
          <el-table-column
            v-else-if="col.type === 'attachment'"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :sortable="col.sortable"
          >
            <template #default="{ row }">
              <div class="attachment-list">
                <template v-if="Array.isArray(row[col.prop]) && row[col.prop].length > 0">
                  <span
                    v-for="(file, index) in row[col.prop]"
                    :key="index"
                    class="attachment-link"
                    @click="handleAttachmentClick(file)"
                  >
                    {{ file.fileName || file.name }}
                  </span>
                </template>
                <template v-else-if="row[col.prop]">
                  <span class="attachment-link" @click="handleAttachmentClick(row[col.prop])">
                    {{ row[col.prop].fileName || row[col.prop] }}
                  </span>
                </template>
                <span v-else style="color: #999;">暂无附件</span>
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

    <!-- 分页栏 -->
    <div class="pagination-bar">
      <span class="total-text">共{{ total }}条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="sizes, prev, pager, next"
        background
        @update:current-page="handleCurrentPageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  border: 1px solid #EBEEF5;
}

// Element Plus 表格横向滚动条样式
:deep(.el-table__body-wrapper),
:deep(.el-table__header-wrapper) {
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4px;

    &:hover {
      background: #909399;
    }
  }
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
  line-height: 22px;
  display: flex;
  align-items: center;
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

/* 文本溢出样式（支持两行） */
.multi-line-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 22px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #303133;
  word-break: break-all;
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

/* 状态按钮样式 */
.status-btn {
  height: 32px;
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

/* 已使用状态 - danger */
.status-btn.el-button--danger.is-plain {
  background: #fef0f0;
  border: 1px solid #f56c6c;
  color: #f56c6c;
}

.status-btn.el-button--danger.is-plain:hover,
.status-btn.el-button--danger.is-plain:focus {
  background: #fde2e2;
  border-color: #f78989;
  color: #f78989;
}

/* 剩余额度状态 - primary */
.status-btn.el-button--primary.is-plain {
  background: #ecf5ff;
  border: 1px solid #0060ff;
  color: #0060ff;
}

.status-btn.el-button--primary.is-plain:hover,
.status-btn.el-button--primary.is-plain:focus {
  background: #d9ecff;
  border-color: #3370ff;
  color: #3370ff;
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
