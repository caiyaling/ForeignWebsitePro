<script setup>
/**
 * @description 电信资源页面
 * @date 2024-04-10
 */
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import ResourceCard from '@/pages/NetworkWarfareResourse/components/ResourceCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import {
  getSmsStatistics,
  getSmsPage,
  deleteSms,
  exportSms,
  importSms,
  downloadSmsTemplate
} from '@/api/sms'
import {
  getVoiceStatistics,
  getVoicePage,
  deleteVoice,
  exportVoice,
  importVoice,
  downloadVoiceTemplate
} from '@/api/voice'
import { getAssetUrl } from '@/utils/assets'

// 当前选中的卡片索引
const activeCardIndex = ref(0)

// 格式化数字（添加千分位）
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 卡片数据
const cards = ref([
  {
    name: '短信',
    total: '加载中...',
    type: 'chart',
    icon: getAssetUrl('/figma/telecomm-sms.svg'),
    chart: {
      outerData: [],
      innerData: [],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '剩余额度', color: '#165dff' }
      ]
    }
  },
  {
    name: '语音',
    total: '加载中...',
    type: 'chart',
    icon: getAssetUrl('/figma/telecomm-voice.svg'),
    chart: {
      outerData: [],
      innerData: [],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '剩余额度', color: '#165dff' }
      ]
    }
  }
])

// 获取短信统计数据
const fetchSmsStatistics = async () => {
  try {
    const res = await getSmsStatistics()
    if (res.code === 200 && res.data) {
      const used = res.data.find(item => item.label === '已使用')?.value || 0
      const remaining = res.data.find(item => item.label === '剩余额度')?.value || 0
      const total = used + remaining

      cards.value[0] = {
        name: '短信',
        total: `${formatNumber(used)}/${formatNumber(total)}次`,
        type: 'chart',
        icon: getAssetUrl('/figma/telecomm-sms.svg'),
        chart: {
          outerData: [
            { value: used, name: '已使用', color: '#f77234' },
            { value: remaining, name: '剩余额度', color: '#165dff' }
          ],
          innerData: [
            { value: used, name: '已使用', color: '#f77234' },
            { value: remaining, name: '剩余额度', color: '#165dff' }
          ],
          legends: [
            { label: '已使用', color: '#f77234' },
            { label: '剩余额度', color: '#165dff' }
          ]
        }
      }
    }
  } catch (error) {
    console.error('获取短信统计失败:', error)
  }
}

// 获取语音统计数据
const fetchVoiceStatistics = async () => {
  try {
    const res = await getVoiceStatistics()
    if (res.code === 200 && res.data) {
      const used = res.data.find(item => item.label === '已使用')?.value || 0
      const remaining = res.data.find(item => item.label === '剩余额度')?.value || 0
      const total = used + remaining

      cards.value[1] = {
        name: '语音',
        total: `${formatNumber(used)}/${formatNumber(total)}次`,
        type: 'chart',
        icon: getAssetUrl('/figma/telecomm-voice.svg'),
        chart: {
          outerData: [
            { value: used, name: '已使用', color: '#f77234' },
            { value: remaining, name: '剩余额度', color: '#165dff' }
          ],
          innerData: [
            { value: used, name: '已使用', color: '#f77234' },
            { value: remaining, name: '剩余额度', color: '#165dff' }
          ],
          legends: [
            { label: '已使用', color: '#f77234' },
            { label: '剩余额度', color: '#165dff' }
          ]
        }
      }
    }
  } catch (error) {
    console.error('获取语音统计失败:', error)
  }
}

// 短信表格列配置
const smsColumns = [
  { prop: 'taskId', label: '任务ID', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'sendType', label: '发送类型', minWidth: 100 },
  { prop: 'sendResult', label: '发送结果', minWidth: 100 },
  { prop: 'deliveryTime', label: '送达时间', minWidth: 120 },
  { prop: 'receiveNumber', label: '接收号码', minWidth: 140 },
  { prop: 'smsContent', label: '短信内容', minWidth: 220, type: 'overflow' },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 语音表格列配置
const voiceColumns = [
  { prop: 'taskId', label: '任务ID', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'callerNumber', label: '主叫号码', minWidth: 120 },
  { prop: 'calledNumber', label: '被叫号码', minWidth: 120 },
  { prop: 'startTime', label: '开始时间', minWidth: 120 },
  { prop: 'duration', label: '通话时长(秒)', minWidth: 120 },
  { prop: 'callStatus', label: '通话状态', minWidth: 100 },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 根据选中卡片动态计算表格标题
const tableTitle = computed(() => {
  return activeCardIndex.value === 0 ? '短信台账' : '语音台账'
})

// 根据选中卡片动态计算表格列配置
const tableColumns = computed(() => {
  return activeCardIndex.value === 0 ? smsColumns : voiceColumns
})

// 短信表格数据
const smsData = ref([])
const smsTotal = ref(0)
const smsCurrentPage = ref(1)
const smsPageSize = ref(10)

// 语音表格数据
const voiceData = ref([])
const voiceTotal = ref(0)
const voiceCurrentPage = ref(1)
const voicePageSize = ref(10)

// 加载状态
const loading = ref(false)

// 根据选中卡片动态计算表格数据
const tableData = computed(() => {
  return activeCardIndex.value === 0 ? smsData.value : voiceData.value
})

const pageSize = computed({
  get: () => activeCardIndex.value === 0 ? smsPageSize.value : voicePageSize.value,
  set: (val) => {
    if (activeCardIndex.value === 0) {
      smsPageSize.value = val
    } else {
      voicePageSize.value = val
    }
  }
})

const currentPage = computed({
  get: () => activeCardIndex.value === 0 ? smsCurrentPage.value : voiceCurrentPage.value,
  set: (val) => {
    if (activeCardIndex.value === 0) {
      smsCurrentPage.value = val
    } else {
      voiceCurrentPage.value = val
    }
  }
})

const total = computed(() => {
  return activeCardIndex.value === 0 ? smsTotal.value : voiceTotal.value
})

const filters = ref({
  keyword: ''
})

// 获取短信表格数据
const fetchSmsData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      pageNum: smsCurrentPage.value,
      pageSize: smsPageSize.value
    }

    const res = await getSmsPage(params)
    if (res.code === 200 && res.data) {
      smsData.value = res.data.records || []
      smsTotal.value = res.data.total || 0
      smsCurrentPage.value = res.data.current || 1
      smsPageSize.value = res.data.size || 10
    }
  } catch (error) {
    console.error('获取短信表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取语音表格数据
const fetchVoiceData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      pageNum: voiceCurrentPage.value,
      pageSize: voicePageSize.value
    }

    const res = await getVoicePage(params)
    if (res.code === 200 && res.data) {
      voiceData.value = res.data.records || []
      voiceTotal.value = res.data.total || 0
      voiceCurrentPage.value = res.data.current || 1
      voicePageSize.value = res.data.size || 10
    }
  } catch (error) {
    console.error('获取语音表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化数据
onMounted(() => {
  fetchSmsStatistics()
  fetchVoiceStatistics()
  fetchSmsData()
})

// 监听卡片切换，加载对应数据
watch(activeCardIndex, (newIndex) => {
  if (newIndex === 0 && smsData.value.length === 0) {
    fetchSmsData()
  } else if (newIndex === 1 && voiceData.value.length === 0) {
    fetchVoiceData()
  }
})

const handleSearch = () => {
  if (activeCardIndex.value === 0) {
    smsCurrentPage.value = 1
    fetchSmsData()
  } else {
    voiceCurrentPage.value = 1
    fetchVoiceData()
  }
}

// 处理分页变化事件
const onPageChange = ({ page, pageSize: size }) => {
  if (activeCardIndex.value === 0) {
    smsCurrentPage.value = page
    smsPageSize.value = size
    fetchSmsData()
  } else {
    voiceCurrentPage.value = page
    voicePageSize.value = size
    fetchVoiceData()
  }
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
  // Element Plus Upload 组件返回的文件对象，需要通过 .raw 获取原始 File 对象
  const rawFile = files[0].raw || files[0]
  formData.append('file', rawFile)

  try {
    if (activeCardIndex.value === 0) {
      const res = await importSms(formData)
      if (res.code === 200) {
        // 检查是否有错误列表
        if (res.data?.errorList && res.data.errorList.length > 0) {
          errorList.value = res.data.errorList
          showErrorDialog.value = true
          ElMessage.warning('部分数据导入失败')
        } else {
          ElMessage.success('短信台账导入成功')
          fetchSmsData()
          // 刷新卡片统计数据
          fetchSmsStatistics()
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
    } else {
      const res = await importVoice(formData)
      if (res.code === 200) {
        // 检查是否有错误列表
        if (res.data?.errorList && res.data.errorList.length > 0) {
          errorList.value = res.data.errorList
          showErrorDialog.value = true
          ElMessage.warning('部分数据导入失败')
        } else {
          ElMessage.success('语音台账导入成功')
          fetchVoiceData()
          // 刷新卡片统计数据
          fetchVoiceStatistics()
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
    let blob
    if (activeCardIndex.value === 0) {
      blob = await downloadSmsTemplate()
    } else {
      blob = await downloadVoiceTemplate()
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = activeCardIndex.value === 0 ? '短信台账导入模板.xlsx' : '语音台账导入模板.xlsx'
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
    let blob
    const params = {
      exportType: 1, // 按当前查询条件导出
      keyword: filters.value.keyword || undefined
    }

    if (activeCardIndex.value === 0) {
      blob = await exportSms(params)
    } else {
      blob = await exportVoice(params)
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = activeCardIndex.value === 0 ? '短信台账.xlsx' : '语音台账.xlsx'
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
      if (activeCardIndex.value === 0) {
        await deleteSms(row.id)
        const index = smsData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          smsData.value.splice(index, 1)
        }
        // 刷新卡片统计数据
        fetchSmsStatistics()
      } else {
        await deleteVoice(row.id)
        const index = voiceData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          voiceData.value.splice(index, 1)
        }
        // 刷新卡片统计数据
        fetchVoiceStatistics()
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
  // 电信资源页面暂无详情页，可根据需要添加
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="telecomm-resource-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用ResourceCard组件 -->
        <resource-card
          :cards="cards"
          v-model:active-index="activeCardIndex"
        />

        <!-- 数据表格 - 设备模式 -->
        <data-table
          :title="tableTitle"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :show-project-filter="false"
          :show-brand-filter="false"
          :loading="loading"
          :search-placeholder="activeCardIndex === 0 ? '关键词：任务ID、接收号码' : '关键词：主叫号码、被叫号码'"
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
.telecomm-resource-page {
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
