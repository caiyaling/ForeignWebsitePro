<script setup>
/**
 * @description 专用设备页面
 * @date 2024-04-09
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
  getCloudPhoneUsageStats,
  getPhysicalPhoneUsageStats,
  getCloudPhoneBrandList,
  getCloudPhoneProjectList,
  getPhysicalPhoneBrandList,
  getPhysicalPhoneProjectList,
  getCloudPhonePage,
  getPhysicalPhonePage,
  deleteCloudPhone,
  deletePhysicalPhone,
  importCloudPhone,
  downloadCloudPhoneTemplate,
  exportCloudPhone,
  importPhysicalPhone,
  downloadPhysicalPhoneTemplate,
  exportPhysicalPhone
} from '@/api/device'

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
    name: '云手机',
    total: '0',
    type: 'chart',
    icon: '/figma/device-cloud-phone.svg',
    chart: {
      outerData: [
        { value: 0, name: '已使用', color: '#f77234' },
        { value: 0, name: '待分配', color: '#165dff' }
      ],
      innerData: [
        { value: 0, name: '已使用', color: '#f77234' },
        { value: 0, name: '待分配', color: '#165dff' }
      ],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '待分配', color: '#165dff' }
      ]
    }
  },
  {
    name: '实体手机',
    total: '0/0台',
    type: 'stats',
    icon: '/figma/device-physical-phone.svg',
    stats: []
  }
])

// 获取云手机卡片数据
const fetchCloudPhoneStats = async () => {
  try {
    const res = await getCloudPhoneUsageStats()
    if (res.code === 200 && res.data) {
      const { usedQuantity = 0, availableQuantity = 0 } = res.data
      const total = usedQuantity + availableQuantity

      // 更新卡片数据
      cards.value[0] = {
        name: '云手机',
        total: `${formatNumber(usedQuantity)}/${formatNumber(total)}台`,
        type: 'chart',
        icon: '/figma/device-cloud-phone.svg',
        chart: {
          outerData: [
            { value: usedQuantity, name: '已使用', color: '#f77234' },
            { value: availableQuantity, name: '待分配', color: '#165dff' }
          ],
          innerData: [
            { value: usedQuantity, name: '已使用', color: '#f77234' },
            { value: availableQuantity, name: '待分配', color: '#165dff' }
          ],
          legends: [
            { label: '已使用', color: '#f77234' },
            { label: '待分配', color: '#165dff' }
          ]
        }
      }
    }
  } catch (error) {
    console.error('获取云手机统计数据失败:', error)
  }
}

// 获取实体手机卡片数据
const fetchPhysicalPhoneStats = async () => {
  try {
    const res = await getPhysicalPhoneUsageStats()
    if (res.code === 200 && res.data) {
      const { brandStatisticsList = [] } = res.data

      // 计算总数
      const totalUsed = brandStatisticsList.reduce((sum, item) => sum + (item.usedQuantity || 0), 0)
      const totalAvailable = brandStatisticsList.reduce((sum, item) => sum + (item.availableQuantity || 0), 0)

      // 构建品牌统计列表（格式：已使用/总计）
      const stats = brandStatisticsList.map(item => {
        const used = item.usedQuantity || 0
        const total = used + (item.availableQuantity || 0)
        return {
          label: item.brand || '未知',
          value: `${formatNumber(used)}/${formatNumber(total)}`
        }
      })

      // 更新卡片数据
      cards.value[1] = {
        name: '实体手机',
        total: `${formatNumber(totalUsed)}/${formatNumber(totalUsed + totalAvailable)}台`,
        type: 'stats',
        icon: '/figma/device-physical-phone.svg',
        stats
      }
    }
  } catch (error) {
    console.error('获取实体手机统计数据失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchCloudPhoneStats()
  fetchPhysicalPhoneStats()
  fetchFilterOptions()
  fetchTableData()
})

// 云手机表格列配置
const cloudPhoneColumns = [
  { prop: 'phoneCode', label: '编号', minWidth: 120 },
  { prop: 'usagePurpose', label: '用途', minWidth: 100 },
  { prop: 'projectCode', label: '所属项目', minWidth: 140 },
  { prop: 'deliveryParty', label: '交付方', minWidth: 100 },
  { prop: 'model', label: '型号', minWidth: 140 },
  { prop: 'brand', label: '品牌', minWidth: 100 },
  { prop: 'configuration', label: '配置', minWidth: 200, type: 'overflow' },
  { prop: 'operatingSystem', label: '操作系统', minWidth: 100 },
  { prop: 'quantity', label: '数量', minWidth: 80 },
  { prop: 'usedQuantity', label: '已使用数量', minWidth: 100 },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 实体手机表格列配置
const physicalPhoneColumns = [
  { prop: 'phoneCode', label: '编号', minWidth: 120 },
  { prop: 'usagePurpose', label: '用途', minWidth: 100 },
  { prop: 'deliveryParty', label: '交付方', minWidth: 100 },
  { prop: 'projectCode', label: '所属项目', minWidth: 140 },
  { prop: 'model', label: '资产名称', minWidth: 140 },
  { prop: 'brand', label: '品牌', minWidth: 100 },
  { prop: 'serialNumber', label: '序列号', minWidth: 160 },
  { prop: 'model', label: '型号/规格/版本', minWidth: 140 },
  { prop: 'configuration', label: '基本配置', minWidth: 200, type: 'overflow' },
  { prop: 'unit', label: '单位', minWidth: 80 },
  { prop: 'quantity', label: '数量', minWidth: 80 },
  { prop: 'usedQuantity', label: '已使用数量', minWidth: 100 },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 根据选中卡片动态计算表格标题
const tableTitle = computed(() => {
  return activeCardIndex.value === 0 ? '云手机台账' : '实体手机台账'
})

// 根据选中卡片动态计算表格列配置
const tableColumns = computed(() => {
  return activeCardIndex.value === 0 ? cloudPhoneColumns : physicalPhoneColumns
})

// 云手机表格数据
const cloudPhoneData = ref([])

// 实体手机表格数据
const physicalPhoneData = ref([])

// 根据选中卡片动态计算表格数据
const tableData = computed(() => {
  return activeCardIndex.value === 0 ? cloudPhoneData.value : physicalPhoneData.value
})

const filters = ref({
  keyword: '',
  project: '',
  brand: ''
})

const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)
const loading = ref(false)

// 所属项目选项
const projectOptions = ref([])

// 品牌选项
const brandOptions = ref([])

// 获取下拉筛选选项
const fetchFilterOptions = async () => {
  try {
    if (activeCardIndex.value === 0) {
      // 云手机筛选选项
      const [projectRes, brandRes] = await Promise.all([
        getCloudPhoneProjectList(),
        getCloudPhoneBrandList()
      ])
      if (projectRes.code === 200 && projectRes.data) {
        projectOptions.value = projectRes.data
      }
      if (brandRes.code === 200 && brandRes.data) {
        brandOptions.value = brandRes.data
      }
    } else {
      // 实体手机筛选选项
      const [projectRes, brandRes] = await Promise.all([
        getPhysicalPhoneProjectList(),
        getPhysicalPhoneBrandList()
      ])
      if (projectRes.code === 200 && projectRes.data) {
        projectOptions.value = projectRes.data
      }
      if (brandRes.code === 200 && brandRes.data) {
        brandOptions.value = brandRes.data
      }
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      projectCode: filters.value.project || undefined,
      brand: filters.value.brand || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    if (activeCardIndex.value === 0) {
      // 云手机表格数据
      const res = await getCloudPhonePage(params)
      if (res.code === 200 && res.data) {
        cloudPhoneData.value = res.data.records || []
        total.value = res.data.total || 0
        currentPage.value = res.data.current || 1
        pageSize.value = res.data.size || 10
      }
    } else {
      // 实体手机表格数据
      const res = await getPhysicalPhonePage(params)
      if (res.code === 200 && res.data) {
        physicalPhoneData.value = res.data.records || []
        total.value = res.data.total || 0
        currentPage.value = res.data.current || 1
        pageSize.value = res.data.size || 10
      }
    }
  } catch (error) {
    console.error('获取表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听卡片切换，重新加载数据
watch(activeCardIndex, () => {
  // 重置筛选条件
  filters.value = {
    keyword: '',
    project: '',
    brand: ''
  }
  currentPage.value = 1
  // 重新获取数据
  fetchFilterOptions()
  fetchTableData()
})

const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 处理分页变化事件
const onPageChange = ({ page, pageSize: size }) => {
  currentPage.value = page
  pageSize.value = size
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
  // Element Plus Upload 组件返回的文件对象，需要通过 .raw 获取原始 File 对象
  const rawFile = files[0].raw || files[0]
  formData.append('file', rawFile)

  try {
    if (activeCardIndex.value === 0) {
      const res = await importCloudPhone(formData)
      if (res.code === 200) {
        // 检查是否有错误列表
        if (res.data?.errorList && res.data.errorList.length > 0) {
          errorList.value = res.data.errorList
          showErrorDialog.value = true
          ElMessage.warning('部分数据导入失败')
        } else {
          ElMessage.success('云手机台账导入成功')
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
    } else {
      const res = await importPhysicalPhone(formData)
      if (res.code === 200) {
        // 检查是否有错误列表
        if (res.data?.errorList && res.data.errorList.length > 0) {
          errorList.value = res.data.errorList
          showErrorDialog.value = true
          ElMessage.warning('部分数据导入失败')
        } else {
          ElMessage.success('实体手机台账导入成功')
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
      blob = await downloadCloudPhoneTemplate()
    } else {
      blob = await downloadPhysicalPhoneTemplate()
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = activeCardIndex.value === 0 ? '云手机台账导入模板.xlsx' : '实体手机台账导入模板.xlsx'
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
      keyword: filters.value.keyword || undefined,
      projectCode: filters.value.project || undefined,
      brand: filters.value.brand || undefined
    }

    if (activeCardIndex.value === 0) {
      blob = await exportCloudPhone(params)
    } else {
      blob = await exportPhysicalPhone(params)
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = activeCardIndex.value === 0 ? '云手机台账.xlsx' : '实体手机台账.xlsx'
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
        // 删除云手机台账
        await deleteCloudPhone(row.id)
        const index = cloudPhoneData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          cloudPhoneData.value.splice(index, 1)
        }
      } else {
        // 删除实体手机台账
        await deletePhysicalPhone(row.id)
        const index = physicalPhoneData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          physicalPhoneData.value.splice(index, 1)
        }
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
  // 专用设备页面暂无详情页，可根据需要添加
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="special-device-page">
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
          :project-options="projectOptions"
          :brand-options="brandOptions"
          :loading="loading"
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
.special-device-page {
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
