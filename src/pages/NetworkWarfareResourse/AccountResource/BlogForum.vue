<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import SummaryCards from '@/pages/NetworkWarfareResourse/components/SummaryCards.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import { getAccountTypeStats, getPlatforms, getAccountTypes, getStatuses, getAccountPage } from '@/api/account'

const router = useRouter()

// 平台配置映射
const platformConfig = {
  'PTT': { icon: '/figma/blog-ptt.svg', variant: 'warm' },
  'PPT': { icon: '/figma/blog-ppt.svg', variant: 'warm' },
  'Dcard': { icon: '/figma/blog-dcard.svg', variant: 'warm' },
  'Pixnet': { icon: '/figma/blog-pixnet.svg', variant: 'warm' }
}

// 格式化数字（添加千分位）
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 卡片数据
const cards = ref([])

// 获取卡片数据
const fetchCardsData = async () => {
  try {
    const res = await getAccountTypeStats(3) // 3 = 论坛社区
    if (res.code === 200 && res.data) {
      cards.value = res.data.map(item => {
        const config = platformConfig[item.platformName] || { icon: '', variant: 'warm' }
        const stats = item.accountTypeStats.map(stat => ({
          label: stat.accountType,
          value: formatNumber(stat.count)
        }))
        const total = item.accountTypeStats.reduce((sum, stat) => sum + stat.count, 0)

        return {
          name: item.platformName,
          total: formatNumber(total),
          icon: config.icon,
          variant: config.variant,
          stats
        }
      })
    }
  } catch (error) {
    console.error('获取账号类型统计失败:', error)
  }
}

onMounted(() => {
  fetchCardsData()
  fetchFilterOptions()
  fetchTableData()
})

// 博客论坛表格列配置
const tableColumns = [
  { prop: 'accountType', label: '账号类型', width: 100 },
  { prop: 'isSampled', label: '是否抽检', width: 80, align: 'center' },
  { prop: 'sampleResult', label: '抽检结果', width: 80, align: 'center' },
  { prop: 'platformName', label: '平台名称', width: 120 },
  { prop: 'accountCode', label: '账号编号', width: 120 },
  { prop: 'accountVersion', label: '账号版本号', width: 100 },
  { prop: 'accountPositioning', label: '账号定位', minWidth: 120, type: 'overflow' },
  { prop: 'userNickname', label: '用户昵称', minWidth: 120, type: 'overflow' },
  { prop: 'accountId', label: '账号ID', width: 150 },
  { prop: 'linkUrl', label: '链接URL', minWidth: 200, type: 'overflow' },
  { prop: 'registerRegion', label: '注册地区', width: 100 },
  { prop: 'registerTime', label: '注册时间', width: 120 },
  { prop: 'historyPostCount', label: '历史发言数量', width: 110 },
  { prop: 'accountInfoCompleteness', label: '账号完善度', width: 130, type: 'progress' },
  { prop: 'deliveryParty', label: '交付方', width: 200 },
  { prop: 'latestStatus', label: '最新状态', width: 100, type: 'status' },
  { prop: 'statisticsEndDate', label: '更新时间', width: 120 },
  { prop: 'action', label: '操作', width: 80, type: 'action' }
]

// 下拉筛选选项
const platformOptions = ref([])
const accountTypeOptions = ref([])
const latestStatusOptions = ref([])

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
  platform: '',
  latestStatus: '',
  isSampled: ''
})

// 获取下拉筛选选项
const fetchFilterOptions = async () => {
  try {
    const [platformsRes, typesRes, statusesRes] = await Promise.all([
      getPlatforms(),
      getAccountTypes(),
      getStatuses()
    ])

    if (platformsRes.code === 200 && platformsRes.data) {
      platformOptions.value = platformsRes.data
    }
    if (typesRes.code === 200 && typesRes.data) {
      accountTypeOptions.value = typesRes.data
    }
    if (statusesRes.code === 200 && statusesRes.data) {
      latestStatusOptions.value = statusesRes.data
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
      resourceType: 3, // 3 = 论坛社区
      keyword: filters.value.keyword || undefined,
      accountType: filters.value.accountType || undefined,
      platformName: filters.value.platform || undefined,
      latestStatus: filters.value.latestStatus || undefined,
      isSampled: filters.value.isSampled || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getAccountPage(params)
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

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 处理分页变化
const onPageChange = ({ page, pageSize: size }) => {
  currentPage.value = page
  pageSize.value = size
  fetchTableData()
}

// 处理详情点击 - 新页面打开账号详情页
const handleDetail = (row) => {
  const routeData = router.resolve({
    path: '/network-warfare-resource/account-detail',
    query: {
      accountCode: row.accountCode,
      from: router.currentRoute.value.path,
      accountType: row.accountType || ''
    }
  })
  window.open(routeData.href, '_blank')
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="blog-forum-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用SummaryCards组件 -->
        <summary-cards :cards="cards" />

        <!-- 使用DataTable组件 -->
        <data-table
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :platform-options="platformOptions"
          :account-type-options="accountTypeOptions"
          :latest-status-options="latestStatusOptions"
          search-placeholder="关键词:账号编号、账号ID、用户昵称"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @page-change="onPageChange"
          @detail="handleDetail"
          @attachment-click="handleAttachmentClick"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-forum-page {
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
