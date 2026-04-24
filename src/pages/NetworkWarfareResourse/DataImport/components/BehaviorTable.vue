<script setup>
/**
 * @description 账号行为记录表格组件
 * @date 2024-04-24
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElSelect, ElOption, ElButton, ElInput, ElDatePicker, ElTableColumn } from 'element-plus'
import MultiHeaderTable from '@/components/MultiHeaderTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import { getPostBehaviorPage, getPlatforms, getUpdateTimeList } from '@/api/account'
import { downloadBehaviorTemplate, importBehaviorData } from '@/api/dataImport'

const router = useRouter()

// 筛选条件
const filters = ref({
  keyword: '',
  platformName: '',
  updateTime: '',
  isHotPost: '',
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref([])

// 下拉选项
const platformOptions = ref([])
const updateTimeOptions = ref([])

// 表格数据
const tableData = ref([])
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)

// 表格高度
const tableHeight = ref(600)

// 批量导入弹框
const showImportDialog = ref(false)
const importing = ref(false)

// 导入错误弹框
const showErrorDialog = ref(false)
const errorList = ref([])

// 表格列配置
const columns = ref([
  { prop: 'accountCode', label: '账号编号', width: 120, showOverflowTooltip: true },
  { prop: 'platformName', label: '平台名称', width: 100 },
  { prop: 'userNickname', label: '用户昵称', width: 120, showOverflowTooltip: true },
  { prop: 'accountId', label: '账号ID', width: 120, showOverflowTooltip: true },
  { prop: 'updateTime', label: '统计结束时间', width: 120 },
  {
    label: '发帖信息',
    align: 'center',
    children: [
      { prop: 'postTitle', label: '贴文标题', width: 180, showOverflowTooltip: true },
      { prop: 'postContent', label: '贴文内容', width: 200, showOverflowTooltip: true },
      { prop: 'postUrl', label: '贴文链接', width: 150, showOverflowTooltip: true },
      { prop: 'postTime', label: '发帖时间', width: 120 },
      { prop: 'isHotPost', label: '是否爆款', width: 80, align: 'center' }
    ]
  },
  {
    label: '互动数据',
    align: 'center',
    children: [
      { prop: 'readCount', label: '浏览量', width: 100 },
      { prop: 'likeCount', label: '点赞量', width: 100 },
      { prop: 'commentCount', label: '评论量', width: 100 },
      { prop: 'forwardCount', label: '转发量', width: 100 },
      { prop: 'shareCount', label: '分享量', width: 100 },
      { prop: 'collectCount', label: '收藏量', width: 100 }
    ]
  }
])

// 获取平台选项
const fetchPlatformOptions = async () => {
  try {
    const res = await getPlatforms()
    if (res.code === 200 && res.data) {
      platformOptions.value = res.data
    }
  } catch (error) {
    console.error('获取平台选项失败:', error)
  }
}

// 获取更新时间列表
const fetchUpdateTimeList = async () => {
  try {
    const res = await getUpdateTimeList()
    if (res.code === 200 && res.data) {
      updateTimeOptions.value = res.data
    }
  } catch (error) {
    console.error('获取更新时间列表失败:', error)
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      platformName: filters.value.platformName || undefined,
      updateTime: filters.value.updateTime || undefined,
      isHotPost: filters.value.isHotPost || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getPostBehaviorPage(params)
    if (res.code === 200 && res.data) {
      tableData.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取行为记录表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 处理日期变化
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    filters.value.startDate = val[0]
    filters.value.endDate = val[1]
  } else {
    filters.value.startDate = ''
    filters.value.endDate = ''
  }
}

// 处理批量导入 - 打开弹框
const handleBatchImport = () => {
  showImportDialog.value = true
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const res = await downloadBehaviorTemplate()
    const blob = res instanceof Blob ? res : new Blob([res])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '账号行为记录导入模板.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板下载失败')
  }
}

// 确定导入
const handleImportConfirm = async (files) => {
  if (!files || files.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    const rawFile = files[0].raw || files[0]
    formData.append('file', rawFile)

    const res = await importBehaviorData(formData)

    if (res.code === 200) {
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('导入成功')
        showImportDialog.value = false
        fetchTableData()
      }
    } else {
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
      } else {
        ElMessage.error(res.message || '导入失败')
      }
    }
  } catch (error) {
    console.error('导入失败:', error)
    if (error.response?.data?.errorList && error.response.data.errorList.length > 0) {
      errorList.value = error.response.data.errorList
      showErrorDialog.value = true
    } else {
      ElMessage.error('导入失败')
    }
  } finally {
    importing.value = false
  }
}

// 处理批量导出
const handleBatchExport = () => {
  ElMessage.info('批量导出功能')
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchTableData()
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

// 查看详情
const handleDetail = (row) => {
  const routeData = router.resolve({
    path: '/network-warfare-resource/account-detail',
    query: {
      accountCode: row.accountCode,
      from: router.currentRoute.value.path,
      tab: 'behavior'
    }
  })
  window.open(routeData.href, '_blank')
}

// 初始化数据
const init = () => {
  fetchPlatformOptions()
  fetchUpdateTimeList()
  fetchTableData()
}

// 暴露初始化方法供父组件调用
defineExpose({
  init
})

onMounted(() => {
  // 不在 mounted 时初始化，由父组件控制
})
</script>

<template>
  <div class="behavior-table-panel">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <!-- 关键词搜索 -->
      <div class="search-input-wrapper">
        <div class="search-prefix">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#606266" stroke-width="1.5"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="#606266" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <el-input
          v-model="filters.keyword"
          placeholder="关键词：账号编号，账号ID，用户昵称"
          class="search-input"
          clearable
        />
      </div>

      <!-- 下拉筛选 -->
      <div class="filter-selects">
        <el-select
          v-model="filters.platformName"
          placeholder="平台名称"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in platformOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="filters.updateTime"
          placeholder="统计结束时间"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in updateTimeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="filters.isHotPost"
          placeholder="是否爆款"
          class="filter-select"
          clearable
        >
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>

        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="To"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
          @change="handleDateChange"
        />
      </div>

      <!-- 搜索按钮 -->
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button class="action-btn" @click="handleBatchImport">批量导入</el-button>
        <el-button class="action-btn" @click="handleBatchExport">批量导出</el-button>
      </div>
    </div>

    <!-- 多级表头表格 -->
    <multi-header-table
      :data="tableData"
      :columns="columns"
      :height="tableHeight"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      show-selection
      show-index
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <!-- 操作列 -->
      <template #append-columns>
        <el-table-column label="操作" width="60" align="center" fixed="right">
          <template #default="{ row }">
            <span class="action-link" @click="handleDetail(row)">详情</span>
          </template>
        </el-table-column>
      </template>
    </multi-header-table>

    <!-- 批量导入弹框 -->
    <batch-import-dialog
      v-model="showImportDialog"
      title="账号行为记录批量导入"
      accept=".zip"
      upload-text="点击上传ZIP文件"
      :single-file="true"
      @download-template="handleDownloadTemplate"
      @confirm="handleImportConfirm"
    />

    <!-- 导入错误弹框 -->
    <import-error-dialog
      v-model="showErrorDialog"
      :error-list="errorList"
    />
  </div>
</template>

<style lang="scss" scoped>
.behavior-table-panel {
  flex: 1;
  min-height: 0;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-bottom: 16px;
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

.search-input :deep(.el-input__inner) {
  font-size: 13px;
  color: #303133;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 13px;
}

.filter-selects {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.filter-select {
  width: 280px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  height: 32px;
}

.filter-select :deep(.el-input__inner) {
  font-size: 14px;
  color: #303133;
}

.filter-select :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
}

.date-picker {
  width: 280px;
}

.date-picker :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  height: 32px;
}

.search-btn {
  height: 32px;
  padding: 0 16px;
  background: #0048ff;
  border-color: #0048ff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  background: #ecf5ff;
  border-color: #0048ff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #0048ff;
}

.action-link {
  font-size: 14px;
  color: #0048ff;
  cursor: pointer;

  &:hover {
    color: #3370ff;
  }
}
</style>