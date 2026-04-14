<script setup>
import { ref, computed, onMounted } from 'vue'
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
  getUpdateTimeList
} from '@/api/account'

const route = useRoute()

// 获取 accountCode
const accountCode = computed(() => route.query.accountCode || route.query.accountId || '')

// 用户信息
const userInfo = ref({
  avatar: '',
  userId: '',
  userIdTag: '',
  statusTags: [],
  userName: '',
  completeness: 0,
  gender: '',
  ethnicity: '',
  school: '',
  education: '',
  location: '',
  maritalStatus: '',
  industry: '',
  occupation: '',
  hobbies: '',
  religion: '',
  registerRegion: '',
  registerTime: '',
  linkUrl: '',
  bindEmail: '',
  historyPostCount: ''
})

// 账号运维信息表格列
const opsColumns = [
  { prop: 'loginMethod', label: '登录方式', minWidth: 126 },
  { prop: 'loginPassword', label: '登录密码', minWidth: 126 },
  { prop: 'bindPhone', label: '绑定手机号', minWidth: 126 },
  { prop: 'phoneRegion', label: '手机号归属地', minWidth: 126 },
  { prop: 'bindEmail', label: '绑定邮箱', minWidth: 126 },
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
  { prop: 'postTime', label: '发帖时间', minWidth: 140, sortable: true },
  { prop: 'isHotPost', label: '是否爆款', minWidth: 100, type: 'isHot' },
  { prop: 'postLink', label: '发帖链接', minWidth: 180, type: 'overflow' },
  { prop: 'postReadCount', label: '贴文阅读量', minWidth: 126, sortable: true },
  { prop: 'postLikeCount', label: '贴文点赞量', minWidth: 126, sortable: true },
  { prop: 'postCommentCount', label: '贴文评论量', minWidth: 126, sortable: true },
  { prop: 'postForwardCount', label: '贴文转发量', minWidth: 126, sortable: true },
  { prop: 'attachedText', label: '附带文案', minWidth: 200, type: 'overflow' },
  { prop: 'attachmentCode', label: '附件编号', minWidth: 120 },
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
const fansData = ref([])

// 更新时间选项
const updateTimeOptions = ref([])

// 分页
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)

// 筛选条件
const postBehaviorFilter = ref({
  startTime: '',
  endTime: '',
  isHotPost: ''
})
const boostFilter = ref({
  startTime: '',
  endTime: ''
})
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
      const data = res.data
      // 构建状态标签
      const statusTags = []
      if (data.fansCount) statusTags.push({ label: `粉丝 ${data.fansCount}`, type: 'success' })
      if (data.friendCount) statusTags.push({ label: `好友 ${data.friendCount}`, type: 'danger' })
      if (data.groupOwnerCount) statusTags.push({ label: `群主 ${data.groupOwnerCount}`, type: 'primary' })
      if (data.groupAvgMemberCount) statusTags.push({ label: `群平均人数 ${data.groupAvgMemberCount}`, type: 'warning' })
      if (data.historyPostCount) statusTags.push({ label: `历史发言数 ${data.historyPostCount}`, type: 'success' })
      if (data.validFansRatio) statusTags.push({ label: `有效粉丝占比 ${data.validFansRatio}`, type: 'danger' })
      if (data.groupOwnerValidUserRatio) statusTags.push({ label: `群主有效用户占比 ${data.groupOwnerValidUserRatio}`, type: 'primary' })

      userInfo.value = {
        avatar: data.avatar || '',
        userId: data.accountId || accountCode.value,
        userIdTag: data.accountPositioning || '',
        statusTags,
        userName: data.userNickname || data.accountCode || '',
        completeness: data.accountInfoCompleteness || 0,
        gender: data.gender || '',
        ethnicity: data.ethnicity || '',
        school: data.school || '',
        education: data.education || '',
        location: data.location || '',
        maritalStatus: data.maritalStatus || '',
        industry: data.industry || '',
        occupation: data.occupation || '',
        hobbies: data.hobbies || '',
        religion: data.religion || '',
        registerRegion: data.registerRegion || '',
        registerTime: data.registerTime || '',
        linkUrl: data.linkUrl || '',
        bindEmail: data.bindEmail || '',
        historyPostCount: data.historyPostCount || ''
      }
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
      pageNum: 1,
      pageSize: 100
    })
    if (res.code === 200 && res.data) {
      opsData.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取账号运维信息失败:', error)
  } finally {
    loading.value.ops = false
  }
}

// 获取粉丝数据
const fetchFansData = async () => {
  if (!accountCode.value) return
  loading.value.fans = true
  try {
    const params = { accountCode: accountCode.value }
    if (fansDateRange.value && fansDateRange.value.length === 2) {
      params.startDate = fansDateRange.value[0]
      params.endDate = fansDateRange.value[1]
    }
    const res = await getFansCountList(params)
    if (res.code === 200 && res.data) {
      fansData.value = res.data || []
    }
  } catch (error) {
    console.error('获取粉丝数据失败:', error)
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
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    if (postBehaviorFilter.value.startTime) {
      params.startTime = postBehaviorFilter.value.startTime
    }
    if (postBehaviorFilter.value.endTime) {
      params.endTime = postBehaviorFilter.value.endTime
    }
    if (postBehaviorFilter.value.isHotPost) {
      params.isHotPost = postBehaviorFilter.value.isHotPost
    }
    const res = await getPostBehaviorPage(params)
    if (res.code === 200 && res.data) {
      behaviorData.value = res.data.records || []
      total.value = res.data.total || 0
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
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    if (boostFilter.value.startTime) {
      params.startTime = boostFilter.value.startTime
    }
    if (boostFilter.value.endTime) {
      params.endTime = boostFilter.value.endTime
    }
    const res = await getBoostBehaviorPage(params)
    if (res.code === 200 && res.data) {
      boostData.value = res.data.records || []
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
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const res = await getAppealPage(params)
    if (res.code === 200 && res.data) {
      appealData.value = res.data.records || []
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
onMounted(() => {
  fetchAccountDetail()
  fetchOpsData()
  fetchFansData()
  fetchPostBehavior()
  fetchBoostData()
  fetchAppealData()
  fetchUpdateTimeList()
})

// 根据来源和账号类型计算可见区块
const showAccountOps = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 电子邮箱不显示账号运维信息
  if (from === '/email') return false

  return true
})

const showAccountFansChart = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 只有社交平台-贴靠发声账号显示
  if (from === '/social' && accountType !== '采集') return true
  return false
})

const showPostBehavior = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 只有社交平台-贴靠发声账号显示
  if (from === '/social' && accountType !== '采集') return true
  return false
})

const showBoostRecord = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 只有社交平台-贴靠发声账号显示
  if (from === '/social' && accountType !== '采集') return true
  return false
})

const showAppealRecord = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 社交平台-贴靠发声账号、即时通讯、博客论坛显示
  if (from === '/social' && accountType !== '采集') return true
  if (from === '/instant-messaging') return true
  if (from === '/blog-forum') return true
  return false
})

// 发帖行为记录筛选条件变化 - 更新时间
const handlePostBehaviorFilterChange = (val) => {
  postBehaviorFilter.value.startTime = val
  postBehaviorFilter.value.endTime = val
  currentPage.value = 1
  fetchPostBehavior()
}

// 发帖行为记录筛选条件变化 - 是否爆款
const handlePostBehaviorFilter2Change = (val) => {
  postBehaviorFilter.value.isHotPost = val
  currentPage.value = 1
  fetchPostBehavior()
}

// 助推烘托记录筛选条件变化
const handleBoostFilterChange = (val) => {
  boostFilter.value.startTime = val
  boostFilter.value.endTime = val
  currentPage.value = 1
  fetchBoostData()
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

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
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
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            :max-height="200"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
            @detail="handleDetail"
            @attachment-click="handleAttachmentClick"
          />
        </div>

        <!-- 账号粉丝情况图表 -->
        <div v-if="showAccountFansChart" id="account-fans-chart" class="section-anchor">
          <account-fans-chart title="账号粉丝情况" @date-change="handleFansDateChange" />
        </div>

        <!-- 发帖行为记录表格 -->
        <div v-if="showPostBehavior" id="post-behavior" class="section-anchor">
          <data-table
            title="发帖行为记录"
            detail-mode
            :columns="behaviorColumns"
            :table-data="behaviorData"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            :max-height="300"
            show-select-filter
            :select-options="updateTimeOptions"
            select-placeholder="更新时间"
            show-select-filter2
            :select-options2="[
              { label: '全部', value: '' },
              { label: '是', value: 'yes' },
              { label: '否', value: 'no' }
            ]"
            select-placeholder2="是否爆款"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
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
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            :max-height="300"
            show-select-filter
            :select-options="updateTimeOptions"
            select-placeholder="更新时间"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
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
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            :max-height="300"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
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
