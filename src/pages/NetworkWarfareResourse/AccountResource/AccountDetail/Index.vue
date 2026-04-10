<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import AccountDetailSidebar from './components/AccountDetailSidebar.vue'
import AccountBreadcrumb from './components/AccountBreadcrumb.vue'
import UserInfoCard from './components/UserInfoCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import AccountFansChart from './components/AccountFansChart.vue'

const route = useRoute()

// 用户信息
const userInfo = ref({
  avatar: '',
  userId: route.query.accountId || '413658198866930 (王YY)',
  userIdTag: '黑胶大人',
  statusTags: [
    { label: '粉丝 51', type: 'success' },
    { label: '好友 51', type: 'danger' },
    { label: '群主 51', type: 'primary' },
    { label: '群平均人数 51', type: 'warning' },
    { label: '历史发言数 51', type: 'success' },
    { label: '有效粉丝占比 20%', type: 'danger' },
    { label: '群主有效用户占比 20%', type: 'primary' }
  ],
  userName: '624344@yahoho.com',
  completeness: 50,
  gender: '男',
  ethnicity: '汉',
  school: '清华大学',
  education: '本科',
  location: '普吉岛',
  maritalStatus: '已婚',
  industry: '市场营销 / 商务 / 管理行业',
  occupation: '教师',
  hobbies: '唱歌、跳舞',
  religion: '佛教',
  registerRegion: '台湾',
  registerTime: '2024-09-09',
  linkUrl: 'http://127.0.0.1:32767',
  bindEmail: 'user001@gmail.com',
  historyPostCount: '51'
})

// 账号运维信息表格列
const opsColumns = [
  { prop: 'loginMethod', label: '登录方式', minWidth: 126 },
  { prop: 'loginPassword', label: '登录密码', minWidth: 126 },
  { prop: 'bindPhone', label: '绑定手机号', minWidth: 126 },
  { prop: 'phoneLocation', label: '手机号归属地', minWidth: 126 },
  { prop: 'bindEmail', label: '绑定邮箱', minWidth: 126 },
  { prop: 'networkIP', label: '网络IP', minWidth: 126 },
  { prop: 'systemTimezone', label: '系统时区', minWidth: 126 },
  { prop: 'browserLanguage', label: '浏览器语言', minWidth: 126 },
  { prop: 'userAgent', label: 'User Agent', minWidth: 126 },
  { prop: 'latestStatus', label: '最新状态', minWidth: 126 },
  { prop: 'checkDate', label: '检测日期', minWidth: 126 },
  { prop: 'expiryDate', label: '失效日期', minWidth: 126 },
  { prop: 'remark', label: '备注', minWidth: 126 }
]

// 发帖行为记录表格列
const behaviorColumns = [
  { prop: 'updateTime', label: '更新时间', minWidth: 126, sortable: true },
  { prop: 'postTime', label: '发帖时间', minWidth: 126, sortable: true },
  { prop: 'isHot', label: '是否爆款', minWidth: 100, type: 'isHot' },
  { prop: 'postUrl', label: '发帖链接', minWidth: 160 },
  { prop: 'readCount', label: '贴文阅读量', minWidth: 126, sortable: true },
  { prop: 'likeCount', label: '贴文点赞量', minWidth: 126, sortable: true },
  { prop: 'commentCount', label: '贴文评论量', minWidth: 126, sortable: true },
  { prop: 'shareCount', label: '贴文转发量', minWidth: 126, sortable: true },
  { prop: 'textContent', label: '附带文案', minWidth: 200, type: 'overflow' },
  { prop: 'attachmentId', label: '附件编号', minWidth: 180, type: 'attachment' },
  { prop: 'hasTask', label: '是否派发任务', minWidth: 126 },
  { prop: 'location', label: '点位', minWidth: 100 },
  { prop: 'remark', label: '备注', minWidth: 126 }
]

// 助推烘托行为表格列
const boostColumns = [
  { prop: 'updateTime', label: '更新时间', minWidth: 160, sortable: true },
  { prop: 'viewCount', label: '浏览量', minWidth: 120, sortable: true },
  { prop: 'likeCount', label: '点赞量', minWidth: 120, sortable: true },
  { prop: 'commentCount', label: '评论量', minWidth: 120, sortable: true },
  { prop: 'shareCount', label: '转发量', minWidth: 120, sortable: true }
]


// 申诉/替换记录表格列
const appealColumns = [
  { prop: 'bannedTime', label: '账号被封时间', minWidth: 160 },
  { prop: 'appealTime', label: '申诉时间', minWidth: 160 },
  { prop: 'likeCount', label: '点赞量', minWidth: 120, sortable: true },
  { prop: 'commentCount', label: '评论量', minWidth: 120, sortable: true },
  { prop: 'shareCount', label: '转发量', minWidth: 120, sortable: true }
]

// 表格数据
const opsData = ref([
  {
    id: 1,
    loginMethod: '手机号+密码',
    loginPassword: 'Facebook',
    bindPhone: '13330221',
    phoneLocation: 'h2533',
    bindEmail: 'h25@gmali',
    networkIP: '-',
    systemTimezone: '-',
    browserLanguage: '-',
    userAgent: '-',
    latestStatus: '存活',
    checkDate: '2025.10.11',
    expiryDate: '2025.10.11',
    remark: '-'
  }
])

const behaviorData = ref([
  {
    id: 1,
    updateTime: '2024.03.15',
    postTime: '2024.03.15 10:30:00',
    isHot: '是',
    postUrl: 'https://fb.com/post/1',
    readCount: 1500,
    likeCount: 120,
    commentCount: 25,
    shareCount: 15,
    textContent: '这是一条测试帖子的内容摘要，可能会比较长需要显示省略号',
    attachmentId: [
      { name: '附件1.pdf', url: 'https://example.com/file1.pdf' },
      { name: '附件2.png', url: 'https://example.com/file2.png' }
    ],
    hasTask: '是',
    location: '北京',
    remark: '正常发帖'
  },
  {
    id: 2,
    updateTime: '2024.03.14',
    postTime: '2024.03.14 15:20:00',
    isHot: '否',
    postUrl: 'https://ig.com/post/2',
    readCount: 890,
    likeCount: 89,
    commentCount: 12,
    shareCount: 8,
    textContent: '分享今日生活点滴...',
    attachmentId: [
      { name: '图片.jpg', url: 'https://example.com/image.jpg' }
    ],
    hasTask: '否',
    location: '上海',
    remark: '正常发帖'
  }
])

const boostData = ref([
  { id: 1, updateTime: '2026.01.20', viewCount: 1979, likeCount: 121, commentCount: 22, shareCount: 333 },
  { id: 2, updateTime: '2026.01.19', viewCount: 2345, likeCount: 89, commentCount: 15, shareCount: 256 },
  { id: 3, updateTime: '2026.01.18', viewCount: 1876, likeCount: 156, commentCount: 31, shareCount: 412 }
])

const appealData = ref([
  { id: 1, bannedTime: '2026.01.20', appealTime: '2026.01.20', likeCount: 1979, commentCount: 121, shareCount: 333 },
  { id: 2, bannedTime: '2026.01.19', appealTime: '2026.01.19', likeCount: 2345, commentCount: 89, shareCount: 256 },
  { id: 3, bannedTime: '2026.01.18', appealTime: '2026.01.18', likeCount: 1876, commentCount: 156, shareCount: 412 },
  { id: 4, bannedTime: '2026.01.17', appealTime: '2026.01.17', likeCount: 2100, commentCount: 98, shareCount: 180 },
  { id: 5, bannedTime: '2026.01.16', appealTime: '2026.01.16', likeCount: 1567, commentCount: 201, shareCount: 289 },
  { id: 6, bannedTime: '2026.01.15', appealTime: '2026.01.15', likeCount: 1890, commentCount: 145, shareCount: 367 },
  { id: 7, bannedTime: '2026.01.14', appealTime: '2026.01.14', likeCount: 2234, commentCount: 178, shareCount: 421 },
  { id: 8, bannedTime: '2026.01.13', appealTime: '2026.01.13', likeCount: 1756, commentCount: 112, shareCount: 298 },
  { id: 9, bannedTime: '2026.01.12', appealTime: '2026.01.12', likeCount: 2012, commentCount: 167, shareCount: 356 },
  { id: 10, bannedTime: '2026.01.11', appealTime: '2026.01.11', likeCount: 1654, commentCount: 134, shareCount: 278 }
])


// 分页
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(100)

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
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
          />
        </div>

        <!-- 账号粉丝情况图表 -->
        <div v-if="showAccountFansChart" id="account-fans-chart" class="section-anchor">
          <account-fans-chart title="账号粉丝情况" />
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
            show-select-filter
            :select-options="[
              { label: '全部', value: '' },
              { label: '2024.03.15', value: '2024.03.15' },
              { label: '2024.03.14', value: '2024.03.14' },
              { label: '2024.03.13', value: '2024.03.13' }
            ]"
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
            show-select-filter
            :select-options="[
              { label: '全部', value: '' },
              { label: '2026.01.20', value: '2026.01.20' },
              { label: '2026.01.19', value: '2026.01.19' },
              { label: '2026.01.18', value: '2026.01.18' }
            ]"
            select-placeholder="更新时间"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
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
            show-select-filter
            :select-options="[
              { label: '全部', value: '' },
              { label: '2026.01.20', value: '2026.01.20' },
              { label: '2026.01.19', value: '2026.01.19' },
              { label: '2026.01.18', value: '2026.01.18' }
            ]"
            select-placeholder="更新时间"
            @update:page-size="val => pageSize = val"
            @update:current-page="val => currentPage = val"
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
