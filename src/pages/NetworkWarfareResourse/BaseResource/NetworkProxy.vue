<script setup>
/**
 * @description 网络代理页面
 * @date 2024-04-09
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import ResourceCard from '@/pages/NetworkWarfareResourse/components/ResourceCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import {
  getStaticProxyStats,
  getDynamicProxyStats,
  getNetworkProxyPage,
  getNetworkProxyAccountTypeList,
  getNetworkProxyIpTypeList,
  deleteNetworkProxy,
  importNetworkProxy,
  downloadNetworkProxyTemplate,
  exportNetworkProxy
} from '@/api/networkProxy'
import { getAssetUrl } from '@/utils/assets'

const router = useRouter()

// 格式化数字（添加千分位）
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 卡片数据
const cards = ref([
  {
    name: '静态代理',
    total: '0',
    type: 'progress',
    icon: getAssetUrl('/figma/network-proxy-static.svg'),
    description: '加载中...',
    progressItems: []
  },
  {
    name: '动态代理',
    total: '0',
    type: 'chart',
    icon: getAssetUrl('/figma/network-proxy-dynamic.svg'),
    description: '加载中...',
    chart: {
      outerData: [],
      innerData: [],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '待分配', color: '#165dff' }
      ]
    }
  }
])

// 获取静态代理统计数据
const fetchStaticProxyStats = async () => {
  try {
    const res = await getStaticProxyStats()
    if (res.code === 200 && res.data) {
      const data = res.data

      // 构建 progressItems
      const progressItems = data.map(item => ({
        label: item.label,
        total: item.total || 0,
        used: item.use || 0
      }))

      // 取第一项的 total 作为总数（接口返回的第一项是总计）
      const totalCount = data[0]?.total || 0

      cards.value[0] = {
        name: '静态代理',
        total: formatNumber(totalCount) + '个',
        type: 'progress',
        icon: getAssetUrl('/figma/network-proxy-static.svg'),
        description: `覆盖${data.length}个国家/地区`,
        progressItems
      }
    }
  } catch (error) {
    console.error('获取静态代理统计失败:', error)
  }
}

// 获取动态代理统计数据
const fetchDynamicProxyStats = async () => {
  try {
    const res = await getDynamicProxyStats()
    if (res.code === 200 && res.data) {
      const data = res.data[0] // 取第一条数据作为总体统计
      if (data) {
        const total = data.total || 0
        const used = data.use || 0
        const unused = total - used

        cards.value[1] = {
          name: '动态代理',
          total: formatNumber(total) + '个',
          type: 'chart',
          icon: getAssetUrl('/figma/network-proxy-dynamic.svg'),
          description: 'IP出口覆盖多个国家/地区',
          chart: {
            outerData: [
              { value: used, name: '已使用', color: '#f77234' },
              { value: unused, name: '待分配', color: '#165dff' }
            ],
            innerData: [
              { value: used, name: '已使用', color: '#f77234' },
              { value: unused, name: '待分配', color: '#165dff' }
            ],
            legends: [
              { label: '已使用', color: '#f77234' },
              { label: '待分配', color: '#165dff' }
            ]
          }
        }
      }
    }
  } catch (error) {
    console.error('获取动态代理统计失败:', error)
  }
}

// 表格列配置
const tableColumns = [
  { prop: 'proxyCode', label: '资源编码', minWidth: 120 },
  { prop: 'accountType', label: '账号类型', minWidth: 150 },
  { prop: 'ipAddress', label: 'IP地址', minWidth: 120 },
  { prop: 'ipType', label: 'IP类型', minWidth: 100 },
  { prop: 'protocolType', label: '协议类型', minWidth: 120 },
  { prop: 'exitRegion', label: '出口地区', minWidth: 150 },
  { prop: 'latestStatus', label: '最新状态', minWidth: 100, type: 'status' },
  { prop: 'checkTime', label: '检测日期', minWidth: 120 },
  { prop: 'expireTime', label: '失效日期', minWidth: 120 },
  { prop: 'resourceSource', label: '资源来源', minWidth: 120 },
  { prop: 'resourceSourceType', label: '资源来源类型', minWidth: 120 },
  { prop: 'deliveryParty', label: '交付方', minWidth: 200 },
  { prop: 'deliveryTime', label: '交付日期', minWidth: 120 },
  { prop: 'responsibilityUnit', label: '责任单位', minWidth: 120 },
  { prop: 'responsibilityPerson', label: '责任人', minWidth: 80 },
  { prop: 'remark', label: '备注', minWidth: 200, type: 'overflow' },
  { prop: 'updateTime', label: '更新时间', minWidth: 120 },
  { prop: 'status', label: '状态', minWidth: 100, type: 'status' },
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
  accountType: '',
  ipType: '',
  status: ''
})

// 账号类型选项
const accountTypeOptions = ref([])

// IP类型选项
const ipTypeOptions = ref([])

// 状态选项（固定值）
const statusOptions = ['已使用', '待分配']

// 获取账号类型列表
const fetchAccountTypeList = async () => {
  try {
    const res = await getNetworkProxyAccountTypeList()
    if (res.code === 200 && res.data) {
      accountTypeOptions.value = res.data
    }
  } catch (error) {
    console.error('获取账号类型列表失败:', error)
  }
}

// 获取IP类型列表
const fetchIpTypeList = async () => {
  try {
    const res = await getNetworkProxyIpTypeList()
    if (res.code === 200 && res.data) {
      ipTypeOptions.value = res.data
    }
  } catch (error) {
    console.error('获取IP类型列表失败:', error)
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      accountType: filters.value.accountType || undefined,
      ipType: filters.value.ipType || undefined,
      status: filters.value.status || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getNetworkProxyPage(params)
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
  fetchStaticProxyStats()
  fetchDynamicProxyStats()
  fetchAccountTypeList()
  fetchIpTypeList()
  fetchTableData()
})

// 处理搜索
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
    const res = await importNetworkProxy(formData)
    if (res.code === 200) {
      // 检查是否有错误列表
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('网络代理台账导入成功')
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
    const blob = await downloadNetworkProxyTemplate()

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '网络代理台账导入模板.xlsx'
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
      accountType: filters.value.accountType || undefined,
      ipType: filters.value.ipType || undefined,
      status: filters.value.status || undefined
    }

    const blob = await exportNetworkProxy(params)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '网络代理台账.xlsx'
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
      await deleteNetworkProxy(row.id)
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
  // 网络代理页面暂无详情页，可根据需要添加
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="network-proxy-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用ResourceCard组件 - 禁用选中交互 -->
        <resource-card
          :cards="cards"
          :disable-select="true"
        />

        <!-- 数据表格 - 设备模式 -->
        <data-table
          title="网络代理台账"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :loading="loading"
          :custom-filters="[
            { key: 'accountType', placeholder: '账号类型', options: accountTypeOptions },
            { key: 'ipType', placeholder: 'IP类型', options: ipTypeOptions },
            { key: 'status', placeholder: '状态', options: statusOptions }
          ]"
          search-placeholder="关键词：编号，IP地址"
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
.network-proxy-page {
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
