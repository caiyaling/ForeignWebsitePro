<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import AccountDetailSidebar from './components/AccountDetailSidebar.vue'
import AccountBreadcrumb from './components/AccountBreadcrumb.vue'
import UserInfoCard from './components/UserInfoCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import AccountFansChart from './components/AccountFansChart.vue'
import {
  getAccountDetail,
  getAccountOperationPage,
  getFansCountList,
  getPostBehaviorPage,
  getBoostBehaviorPage,
  getAppealPage,
  getUpdateTimeList,
  downloadAccountBehaviorAttachment,
  getMimeType
} from '@/api/account'

const route = useRoute()

// 获取 accountCode - 确保在路由准备好后再获取
const accountCode = computed(() => {
  const code = route.query.accountCode || route.query.accountId || ''
  console.log('accountCode computed - route.query:', route.query, 'result:', code)
  return code
})

// 用户信息 - 直接使用接口字段名
const userInfo = ref({
  platformName: '',
  accountId: '',
  tags: '',
  fansCount: null,
  friendsCount: null,
  groupCount: null,
  groupAvgCount: null,
  historyPostCount: null,
  validFansRatio: '',
  groupValidUserRatio: '',
  userNickname: '',
  accountInfoCompleteness: '',
  gender: '',
  nation: '',
  school: '',
  education: '',
  region: '',
  maritalStatus: '',
  industry: '',
  occupation: '',
  hobbies: '',
  religion: '',
  registerRegion: '',
  registerTime: '',
  linkUrl: '',
  bindEmail: ''
})

// 账号运维信息表格列
const opsColumns = [
  { prop: 'loginMethod', label: '登录方式', minWidth: 126 },
  { prop: 'loginPassword', label: '登录密码', minWidth: 126 },
  { prop: 'bindPhone', label: '绑定手机号', minWidth: 126 },
  { prop: 'phoneRegion', label: '手机号归属地', minWidth: 126 },
  { prop: 'bindEmail', label: '绑定邮箱', minWidth: 126,type: 'overflow'  },
  { prop: 'networkIp', label: '网络IP', minWidth: 126 },
  { prop: 'systemTimezone', label: '系统时区', minWidth: 126 },
  { prop: 'browserLanguage', label: '浏览器语言', minWidth: 126 },
  { prop: 'userAgent', label: 'User Agent', minWidth: 200, type: 'overflow' },
  { prop: 'latestStatus', label: '最新状态', minWidth: 126 },
  { prop: 'checkDate', label: '检测日期', minWidth: 126 },
  { prop: 'invalidDate', label: '失效日期', minWidth: 126 },
  { prop: 'remark', label: '备注', minWidth: 150, type: 'overflow' }
]

// 发帖行为记录表格列
const behaviorColumns = [
  { prop: 'statisticsEndDate', label: '更新时间', minWidth: 140, sortable: true },
  { prop: 'postTime', label: '发帖时间', minWidth: 200, sortable: true },
  { prop: 'isHotPost', label: '是否爆款', minWidth: 100, type: 'isHot' },
  { prop: 'postLink', label: '发帖链接', minWidth: 180, type: 'overflow' },
  { prop: 'postReadCount', label: '贴文阅读量', minWidth: 126, sortable: true },
  { prop: 'postLikeCount', label: '贴文点赞量', minWidth: 126, sortable: true },
  { prop: 'postCommentCount', label: '贴文评论量', minWidth: 126, sortable: true },
  { prop: 'postForwardCount', label: '贴文转发量', minWidth: 126, sortable: true },
  { prop: 'attachedText', label: '附带文案', minWidth: 200, type: 'overflow' },
  { prop: 'attachments', label: '附件编号', minWidth: 120, type: 'attachment' },
  { prop: 'isTaskDispatch', label: '是否派发任务', minWidth: 126 },
  { prop: 'pointPosition', label: '点位', minWidth: 100 },
  { prop: 'remark', label: '备注', minWidth: 150, type: 'overflow' }
]

// 助推烘托行为表格列
const boostColumns = [
  { prop: 'statisticsEndDate', label: '更新时间', minWidth: 140, sortable: true },
  { prop: 'browseCount', label: '浏览量', minWidth: 120, sortable: true },
  { prop: 'likeCount', label: '点赞量', minWidth: 120, sortable: true },
  { prop: 'commentCount', label: '评论量', minWidth: 120, sortable: true },
  { prop: 'forwardCount', label: '转发量', minWidth: 120, sortable: true }
]


// 申诉/替换记录表格列
const appealColumns = [
  { prop: 'accountBannedTime', label: '账号被封时间', minWidth: 160 },
  { prop: 'accountRecoveryTime', label: '账号恢复时间', minWidth: 160 },
  { prop: 'accountReplaceTime', label: '账号替换时间', minWidth: 160 },
  { prop: 'replacedAccountId', label: '替换后账号ID', minWidth: 140 },
  { prop: 'banReason', label: '账号封禁原因', minWidth: 180, type: 'overflow' }
]

// 表格数据
const opsData = ref([])
const behaviorData = ref([])
const boostData = ref([])
const appealData = ref([])
const fansData = ref(null)

// 更新时间选项
const updateTimeOptions = ref([])

// 分页 - 每个表格独立分页
const opsPagination = ref({ pageSize: 10, currentPage: 1, total: 0 })
const postBehaviorPagination = ref({ pageSize: 10, currentPage: 1, total: 0 })
const boostPagination = ref({ pageSize: 10, currentPage: 1, total: 0 })
const appealPagination = ref({ pageSize: 10, currentPage: 1, total: 0 })

// 筛选条件
const postBehaviorFilter = ref({
  updateTime: '',
  isHotPost: ''
})
const postBehaviorSelectValue = ref('')
const postBehaviorSelectValue2 = ref('')

const boostFilter = ref({
  updateTime: ''
})
const boostSelectValue = ref('')

const fansDateRange = ref([])

// 加载状态
const loading = ref({
  detail: false,
  ops: false,
  fans: false,
  post: false,
  boost: false,
  appeal: false
})

// 获取虚拟人设信息
const fetchAccountDetail = async () => {
  if (!accountCode.value) return
  loading.value.detail = true
  try {
    const res = await getAccountDetail(accountCode.value)
    if (res.code === 200 && res.data) {
      // 直接使用接口返回的数据，不做映射
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('获取账号详情失败:', error)
  } finally {
    loading.value.detail = false
  }
}

// 获取账号运维信息
const fetchOpsData = async () => {
  if (!accountCode.value) return
  loading.value.ops = true
  try {
    const res = await getAccountOperationPage({
      accountCode: accountCode.value,
      pageNum: opsPagination.value.currentPage,
      pageSize: opsPagination.value.pageSize
    })
    if (res.code === 200 && res.data) {
      opsData.value = res.data.records || []
      opsPagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取账号运维信息失败:', error)
  } finally {
    loading.value.ops = false
  }
}

// 获取粉丝数据
const fetchFansData = async () => {
  if (!accountCode.value) {
    console.log('fetchFansData: accountCode 为空，跳过请求')
    return
  }
  loading.value.fans = true
  try {
    const params = { accountCode: accountCode.value }
    if (fansDateRange.value && fansDateRange.value.length === 2) {
      params.startTime = fansDateRange.value[0]
      params.endTime = fansDateRange.value[1]
    }
    console.log('fetchFansData: 请求参数', params)
    const res = await getFansCountList(params)
    console.log('粉丝数据接口完整响应:', res)
    console.log('粉丝数据 res.code:', res?.code)
    console.log('粉丝数据 res.data:', res?.data)

    if (res && res.code === 200) {
      if (res.data) {
        console.log('粉丝数据 res.data:', JSON.stringify(res.data))
        // API 可能返回 xaxis 或 xAxis，需要兼容处理
        const xAxisData = res.data.xAxis || res.data.xaxis || []
        const seriesData = res.data.series || []
        console.log('处理后 xAxis:', xAxisData)
        console.log('处理后 series:', seriesData)
        // 统一转换为 xAxis 格式
        fansData.value = {
          xAxis: xAxisData,
          series: seriesData
        }
      } else {
        console.log('粉丝数据 res.data 为空')
        fansData.value = null
      }
    } else {
      console.log('粉丝数据接口返回非200或无数据, code:', res?.code, 'message:', res?.message)
      fansData.value = null
    }
  } catch (error) {
    console.error('获取粉丝数据失败:', error)
    console.error('错误详情:', error?.response?.data || error?.message)
    fansData.value = null
  } finally {
    loading.value.fans = false
  }
}

// 获取发帖行为记录
const fetchPostBehavior = async () => {
  if (!accountCode.value) return
  loading.value.post = true
  try {
    const params = {
      accountCode: accountCode.value,
      pageNum: postBehaviorPagination.value.currentPage,
      pageSize: postBehaviorPagination.value.pageSize
    }
    if (postBehaviorFilter.value.updateTime) {
      params.updateTime = postBehaviorFilter.value.updateTime
    }
    if (postBehaviorFilter.value.isHotPost) {
      params.isHotPost = postBehaviorFilter.value.isHotPost
    }
    const res = await getPostBehaviorPage(params)
    console.log('发帖行为记录接口返回:', res)
    if (res.code === 200 && res.data) {
      behaviorData.value = res.data.records || []
      console.log('发帖行为记录数据:', behaviorData.value)
      // 打印每条记录的 attachments 字段
      behaviorData.value.forEach((record, index) => {
        console.log(`记录${index} attachments:`, record.attachments)
      })
      postBehaviorPagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取发帖行为记录失败:', error)
  } finally {
    loading.value.post = false
  }
}

// 获取助推烘托记录
const fetchBoostData = async () => {
  if (!accountCode.value) return
  loading.value.boost = true
  try {
    const params = {
      accountCode: accountCode.value,
      pageNum: boostPagination.value.currentPage,
      pageSize: boostPagination.value.pageSize
    }
    if (boostFilter.value.updateTime) {
      params.updateTime = boostFilter.value.updateTime
    }
    const res = await getBoostBehaviorPage(params)
    if (res.code === 200 && res.data) {
      boostData.value = res.data.records || []
      boostPagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取助推烘托记录失败:', error)
  } finally {
    loading.value.boost = false
  }
}

// 获取申诉/替换记录
const fetchAppealData = async () => {
  if (!accountCode.value) return
  loading.value.appeal = true
  try {
    const params = {
      accountCode: accountCode.value,
      pageNum: appealPagination.value.currentPage,
      pageSize: appealPagination.value.pageSize
    }
    const res = await getAppealPage(params)
    if (res.code === 200 && res.data) {
      appealData.value = res.data.records || []
      appealPagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取申诉/替换记录失败:', error)
  } finally {
    loading.value.appeal = false
  }
}

// 获取更新时间列表
const fetchUpdateTimeList = async () => {
  try {
    const res = await getUpdateTimeList()
    if (res.code === 200 && res.data) {
      // 转换为下拉选项格式
      updateTimeOptions.value = [
        { label: '全部', value: '' },
        ...res.data.map(item => ({
          label: item,
          value: item
        }))
      ]
    }
  } catch (error) {
    console.error('获取更新时间列表失败:', error)
  }
}

// 初始化数据
const initPageData = () => {
  if (accountCode.value) {
    console.log('initPageData - accountCode:', accountCode.value)
    fetchAccountDetail()
    fetchOpsData()
    fetchFansData()
    fetchPostBehavior()
    fetchBoostData()
    fetchAppealData()
    fetchUpdateTimeList()
  }
}

// 监听 accountCode 变化（用于从其他页面跳转过来时重新加载数据）
watch(accountCode, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    console.log('watch accountCode changed:', newVal)
    initPageData()
  }
})

// 组件挂载时加载数据（支持直接打开 URL）
onMounted(() => {
  console.log('onMounted - route.query:', route.query)
  console.log('onMounted - accountCode:', accountCode.value)
  // 使用 nextTick 确保 DOM 和路由都已准备好
  initPageData()
})

// 账号粉丝图表数据 - 直接使用接口返回的 ECharts 格式数据
const fansChartData = computed(() => {
  console.log('fansChartData 计算 - fansData:', fansData.value)
  // 如果没有数据，返回空结构
  if (!fansData.value || !fansData.value.xAxis?.length || !fansData.value.series?.length) {
    console.log('fansChartData: 返回空数据')
    return { xAxis: [], series: [] }
  }

  // 接口直接返回 { xAxis: [], series: [] } 格式，添加颜色
  const colorMap = {
    '当前粉丝数': '#165DFF',
    '新增粉丝数': '#14C9C9',
    '累计新增粉丝数': '#F7BA1E'
  }

  const result = {
    xAxis: fansData.value.xAxis,
    series: (fansData.value.series || []).map(item => ({
      name: item.name,
      data: item.data,
      color: colorMap[item.name] || '#165DFF'
    }))
  }
  console.log('fansChartData: 返回有效数据', result)
  return result
})

// 根据来源和账号类型计算可见区块
const showAccountOps = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 电子邮箱不显示账号运维信息
  if (from.includes('/email')) return false

  return true
})

const showAccountFansChart = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 社交平台-贴靠发声账号显示粉丝图表，采集账号不显示
  if (from.includes('/social') && accountType !== '采集') return true
  return false
})

const showPostBehavior = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 只有社交平台-贴靠发声账号显示
  if (from.includes('/social') && accountType !== '采集') return true
  return false
})

const showBoostRecord = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 只有社交平台-贴靠发声账号显示
  if (from.includes('/social') && accountType !== '采集') return true
  return false
})

const showAppealRecord = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 社交平台-贴靠发声账号、即时通讯、博客论坛显示
  if (from.includes('/social') && accountType !== '采集') return true
  if (from.includes('/instant-messaging')) return true
  if (from.includes('/blog-forum')) return true
  return false
})

// 发帖行为记录筛选条件变化 - 更新时间
const handlePostBehaviorFilterChange = (val) => {
  const value = val || ''
  postBehaviorSelectValue.value = value
  postBehaviorFilter.value.updateTime = value
  postBehaviorPagination.value.currentPage = 1
  fetchPostBehavior()
}

// 发帖行为记录筛选条件变化 - 是否爆款
const handlePostBehaviorFilter2Change = (val) => {
  const value = val || ''
  postBehaviorSelectValue2.value = value
  postBehaviorFilter.value.isHotPost = value
  postBehaviorPagination.value.currentPage = 1
  fetchPostBehavior()
}

// 助推烘托记录筛选条件变化
const handleBoostFilterChange = (val) => {
  const value = val || ''
  boostSelectValue.value = value
  boostFilter.value.updateTime = value
  boostPagination.value.currentPage = 1
  fetchBoostData()
}

// 账号运维信息分页变化
const handleOpsPageChange = ({ page, pageSize }) => {
  opsPagination.value.currentPage = page
  opsPagination.value.pageSize = pageSize
  fetchOpsData()
}

// 发帖行为记录分页变化
const handlePostBehaviorPageChange = ({ page, pageSize }) => {
  postBehaviorPagination.value.currentPage = page
  postBehaviorPagination.value.pageSize = pageSize
  fetchPostBehavior()
}

// 助推烘托记录分页变化
const handleBoostPageChange = ({ page, pageSize }) => {
  boostPagination.value.currentPage = page
  boostPagination.value.pageSize = pageSize
  fetchBoostData()
}

// 申诉/替换记录分页变化
const handleAppealPageChange = ({ page, pageSize }) => {
  appealPagination.value.currentPage = page
  appealPagination.value.pageSize = pageSize
  fetchAppealData()
}

// 账号粉丝情况日期范围变化
const handleFansDateChange = (val) => {
  fansDateRange.value = val
  fetchFansData()
}

// 处理详情点击
const handleDetail = (row) => {
  console.log('查看详情:', row)
  // 详情页内部不需要跳转
}

// 处理附件点击 - 下载附件并在新窗口预览
const handleAttachmentClick = async (attachment) => {
  if (!attachment || !attachment.id) {
    console.error('附件信息无效:', attachment)
    return
  }

  try {
    const res = await downloadAccountBehaviorAttachment(attachment.id)
    console.log('附件下载响应:', res, '类型:', res?.type)

    // 检查是否返回了错误信息（有些后端在错误时返回 JSON）
    if (res && res.type === 'application/json') {
      // 可能是错误响应，尝试解析
      const text = await res.text()
      try {
        const errorData = JSON.parse(text)
        console.error('服务器返回错误:', errorData)
        alert(errorData.message || '下载失败')
        return
      } catch (e) {
        // 不是 JSON，继续处理
      }
    }

    // 根据文件名获取 MIME 类型
    const mimeType = getMimeType(attachment.fileName)
    // 创建带类型的 Blob
    const blob = new Blob([res], { type: mimeType })
    const url = window.URL.createObjectURL(blob)

    // 图片、PDF、文本等可以直接预览，其他类型下载
    const previewTypes = ['image/', 'application/pdf', 'text/']
    const canPreview = previewTypes.some(type => mimeType.startsWith(type))

    if (canPreview) {
      window.open(url, '_blank')
    } else {
      // 不可预览的文件直接下载
      const link = document.createElement('a')
      link.href = url
      link.download = attachment.fileName || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('下载附件失败:', error)
  }
}
</script>

<template>
  <div class="account-detail-page">
    <global-header />

    <div class="page-shell">
      <account-detail-sidebar />

      <main class="page-main">
        <!-- 面包屑导航 -->
        <account-breadcrumb />

        <!-- 虚拟人设信息 - 用户信息卡片 -->
        <div id="virtual-persona" class="section-anchor">
          <user-info-card title="虚拟人设信息" :user-info="userInfo" />
        </div>

        <!-- 账号运维信息表格 -->
        <div v-if="showAccountOps" id="account-ops" class="section-anchor">
          <data-table
            title="账号运维信息"
            detail-mode
            :columns="opsColumns"
            :table-data="opsData"
            :page-size="opsPagination.pageSize"
            :current-page="opsPagination.currentPage"
            :total="opsPagination.total"
            :max-height="200"
            @page-change="handleOpsPageChange"
            @detail="handleDetail"
            @attachment-click="handleAttachmentClick"
          />
        </div>

        <!-- 账号粉丝情况图表 -->
        <div v-if="showAccountFansChart" id="account-fans-chart" class="section-anchor">
          <account-fans-chart
            title="账号粉丝情况"
            :chart-data="fansChartData"
            @date-change="handleFansDateChange"
          />
        </div>

        <!-- 发帖行为记录表格 -->
        <div v-if="showPostBehavior" id="post-behavior" class="section-anchor">
          <data-table
            title="发帖行为记录"
            detail-mode
            :columns="behaviorColumns"
            :table-data="behaviorData"
            :page-size="postBehaviorPagination.pageSize"
            :current-page="postBehaviorPagination.currentPage"
            :total="postBehaviorPagination.total"
            :max-height="500"
            show-select-filter
            :select-options="updateTimeOptions"
            select-placeholder="请选择"
            select-label="更新时间"
            :select-value="postBehaviorSelectValue"
            show-select-filter2
            :select-options2="[
              { label: '全部', value: '' },
              { label: '是', value: '1' },
              { label: '否', value: '0' }
            ]"
            select-placeholder2="请选择"
            select-label2="是否爆款"
            :select-value2="postBehaviorSelectValue2"
            @page-change="handlePostBehaviorPageChange"
            @update:select-value="handlePostBehaviorFilterChange"
            @update:select-value2="handlePostBehaviorFilter2Change"
            @detail="handleDetail"
            @attachment-click="handleAttachmentClick"
          />
        </div>

        <!-- 助推烘托行为表格 -->
        <div v-if="showBoostRecord" id="boost-record" class="section-anchor">
          <data-table
            title="助推烘托记录"
            detail-mode
            :columns="boostColumns"
            :table-data="boostData"
            :page-size="boostPagination.pageSize"
            :current-page="boostPagination.currentPage"
            :total="boostPagination.total"
            :max-height="500"
            show-select-filter
            :select-options="updateTimeOptions"
            select-placeholder="请选择"
            select-label="更新时间"
            :select-value="boostSelectValue"
            @page-change="handleBoostPageChange"
            @update:select-value="handleBoostFilterChange"
            @detail="handleDetail"
            @attachment-click="handleAttachmentClick"
          />
        </div>

        <!-- 申诉/替换记录表格 -->
        <div v-if="showAppealRecord" id="appeal-record" class="section-anchor">
          <data-table
            title="申诉/替换记录"
            detail-mode
            :columns="appealColumns"
            :table-data="appealData"
            :page-size="appealPagination.pageSize"
            :current-page="appealPagination.currentPage"
            :total="appealPagination.total"
            :max-height="500"
            @page-change="handleAppealPageChange"
            @detail="handleDetail"
            @attachment-click="handleAttachmentClick"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-detail-page {
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
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
