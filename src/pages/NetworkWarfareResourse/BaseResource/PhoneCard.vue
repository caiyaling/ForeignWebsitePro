<script setup>
/**
 * @description 手机卡号页面
 * @date 2024-04-09
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import PhoneCardPanel from './components/PhoneCardPanel.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import {
  getSimCardLocationStats,
  getSimCardTypeStats,
  getSimCardPage,
  getSimCardProjectList,
  deleteSimCard,
  importSimCard,
  downloadSimCardTemplate,
  exportSimCard
} from '@/api/simCard'

const router = useRouter()

// 格式化数字（添加千分位）
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 卡片数据
const cards = ref([
  {
    name: '归属地',
    stats: []
  },
  {
    name: '卡号类型',
    stats: []
  }
])

// 获取归属地统计数据
const fetchLocationStats = async () => {
  try {
    const res = await getSimCardLocationStats()
    if (res.code === 200 && res.data) {
      cards.value[0] = {
        name: '归属地',
        stats: res.data.map(item => ({
          label: item.label,
          value: formatNumber(item.value)
        }))
      }
    }
  } catch (error) {
    console.error('获取归属地统计失败:', error)
  }
}

// 获取卡号类型统计数据
const fetchTypeStats = async () => {
  try {
    const res = await getSimCardTypeStats()
    if (res.code === 200 && res.data) {
      cards.value[1] = {
        name: '卡号类型',
        stats: res.data.map(item => ({
          label: item.label,
          value: formatNumber(item.value)
        }))
      }
    }
  } catch (error) {
    console.error('获取卡号类型统计失败:', error)
  }
}

// 表格列配置
const tableColumns = [
  { prop: 'cardCode', label: '编号', minWidth: 120 },
  { prop: 'deliveryParty', label: '交付方', minWidth: 100 },
  { prop: 'assetCategory', label: '资产类别', minWidth: 100 },
  { prop: 'cardSerialNumber', label: '手机卡序列号', minWidth: 250 },
  { prop: 'phoneNumber', label: '手机号', minWidth: 120 },
  { prop: 'projectCode', label: '所属项目', minWidth: 120 },
  { prop: 'equipmentCode', label: '所属装备', minWidth: 120 },
  { prop: 'brandModel', label: '品牌型号', minWidth: 120 },
  { prop: 'specParams', label: '规格参数', minWidth: 160, type: 'overflow' },
  { prop: 'remark', label: '备注', minWidth: 120, type: 'overflow' },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 表格数据
const tableData = ref([])
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)
const loading = ref(false)

// 筛选条件
const filters = ref({
  keyword: '',
  project: ''
})

// 所属项目选项
const projectOptions = ref([])

// 获取项目列表
const fetchProjectList = async () => {
  try {
    const res = await getSimCardProjectList()
    if (res.code === 200 && res.data) {
      projectOptions.value = res.data
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      projectCode: filters.value.project || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getSimCardPage(params)
    if (res.code === 200 && res.data) {
      tableData.value = res.data.records || []
      total.value = res.data.total || 0
      currentPage.value = res.data.current || 1
      pageSize.value = res.data.size || 10
    }
  } catch (error) {
    console.error('获取表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化数据
onMounted(() => {
  fetchLocationStats()
  fetchTypeStats()
  fetchProjectList()
  fetchTableData()
})

// 处理分页变化事件
const onPageChange = ({ page, pageSize: size }) => {
  currentPage.value = page
  pageSize.value = size
  fetchTableData()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 批量导入弹框
const showBatchImportDialog = ref(false)

// 导入错误弹框
const showErrorDialog = ref(false)
const errorList = ref([])

// 批量导入
const handleBatchImport = () => {
  showBatchImportDialog.value = true
}

// 确认导入
const handleImportConfirm = async (files) => {
  if (!files || files.length === 0) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  const formData = new FormData()
  formData.append('file', files[0])

  try {
    const res = await importSimCard(formData)
    if (res.code === 200) {
      // 检查是否有错误列表
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('手机卡号台账导入成功')
        fetchTableData()
        showBatchImportDialog.value = false
      }
    } else {
      // 接口返回错误，检查是否有错误列表
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
      } else {
        ElMessage.error(res.message || '导入失败')
      }
    }
  } catch (error) {
    console.error('导入失败:', error)
    // 检查错误响应中是否有错误列表
    if (error.response?.data?.errorList && error.response.data.errorList.length > 0) {
      errorList.value = error.response.data.errorList
      showErrorDialog.value = true
    } else {
      ElMessage.error('导入失败')
    }
  }
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const blob = await downloadSimCardTemplate()

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '手机卡号台账导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage.error('下载模板失败')
  }
}

// 批量导出
const handleBatchExport = async () => {
  try {
    const params = {
      exportType: 1, // 按当前查询条件导出
      keyword: filters.value.keyword || undefined,
      projectCode: filters.value.project || undefined
    }

    const blob = await exportSimCard(params)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '手机卡号台账.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteSimCard(row.id)
      const index = tableData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        tableData.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 处理详情点击
const handleDetail = (row) => {
  console.log('查看详情:', row)
  // 手机卡号页面暂无详情页，可根据需要添加
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="phone-card-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 手机卡号卡片 -->
        <phone-card-panel :cards="cards" />

        <!-- 数据表格 -->
        <data-table
          title="手机卡号台账"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :project-options="projectOptions"
          :show-brand-filter="false"
          :loading="loading"
          search-placeholder="关键词：资产编号，手机卡序列号，手机号"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @page-change="onPageChange"
          @delete="handleDelete"
          @detail="handleDetail"
          @attachment-click="handleAttachmentClick"
          @batch-import="handleBatchImport"
          @batch-export="handleBatchExport"
        />
      </main>
    </div>

    <!-- 批量导入弹框 -->
    <batch-import-dialog
      v-model="showBatchImportDialog"
      title="批量导入"
      :single-file="true"
      @confirm="handleImportConfirm"
      @download-template="handleDownloadTemplate"
    />

    <!-- 导入错误弹框 -->
    <import-error-dialog
      v-model="showErrorDialog"
      :error-list="errorList"
    />
  </div>
</template>

<style lang="scss" scoped>
.phone-card-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #efefef;
}

.page-shell {
  display: flex;
  flex: 1;
  min-height: 0;
}

.page-main {
  flex: 1;
  min-width: 0;
  padding: 12px 10px 12px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
