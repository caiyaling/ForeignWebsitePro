<script setup>
import { ref } from 'vue'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import SummaryCards from '@/pages/NetworkWarfareResourse/components/SummaryCards.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'

// 即时通讯表格列配置
const tableColumns = [
  { prop: 'accountType', label: '账号类型', width: 100 },
  { prop: 'isSampled', label: '是否抽检', width: 80, align: 'center' },
  { prop: 'sampleResult', label: '抽检结果', width: 80, align: 'center' },
  { prop: 'platform', label: '平台名称', width: 120 },
  { prop: 'accountNo', label: '账号编号', width: 100 },
  { prop: 'version', label: '账号版本号', width: 100 },
  { prop: 'location', label: '账号定位', width: 100 },
  { prop: 'nickname', label: '用户昵称', width: 120 },
  { prop: 'accountId', label: '账号ID', width: 120 },
  { prop: 'url', label: '链接URL', width: 100 },
  { prop: 'region', label: '注册地区', width: 100 },
  { prop: 'registeredAt', label: '注册时间', width: 120 },
  { prop: 'fansCount', label: '粉丝数量', width: 100 },
  { prop: 'friendsCount', label: '好友数量', width: 100 },
  { prop: 'groupsCount', label: '群组数量', width: 100 },
  { prop: 'integrity', label: '账号信息完善度', width: 130, type: 'progress' },
  { prop: 'delivery', label: '交付方', width: 100 },
  { prop: 'latestStatus', label: '最新状态', width: 100, type: 'status' },
  { prop: 'updatedAt', label: '更新时间', width: 120 },
  { prop: 'action', label: '操作', width: 120, type: 'action' }
]

const platformOptions = ['Telegram', 'WhatsApp', 'Signal', 'Line', 'Skype', 'Teams']

// 即时通讯卡片数据
const cards = [
  {
    name: 'telegram',
    total: '12,584',
    icon: '/figma/im-telegram.svg',
    variant: 'warm',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' }
    ]
  },
  {
    name: 'line',
    total: '12,584',
    icon: '/figma/im-line.svg',
    variant: 'warm',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' },
      { label: '发声（高）', value: '2343' },
      { label: '发声（中）', value: '2343' }
    ]
  },
  {
    name: 'Signal',
    total: '12,584',
    icon: '/figma/im-signal.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'skype',
    total: '12,584',
    icon: '/figma/im-skype.svg',
    variant: 'cool',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Teams',
    total: '12,584',
    icon: '/figma/im-teams.svg',
    variant: 'cool',
    stats: [{ label: '贴靠', value: '2343' }]
  }
]

const filters = ref({
  keyword: '',
  accountType: '',
  platform: '',
  latestStatus: '',
  isSampled: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(9900)

const tableData = ref([
  { id: 1, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'Telegram', accountNo: '-', version: 'h3332', location: 'A类', nickname: '王湖', accountId: '-', url: '-', region: '美国', registeredAt: '2024.03.01', fansCount: '-', friendsCount: '65', groupsCount: '65', integrity: 50, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 2, accountType: '声（高）', isSampled: '是', sampleResult: '-', platform: 'WhatsApp', accountNo: '-', version: 'h3333', location: 'A类', nickname: 'user2', accountId: '-', url: '-', region: '美国', registeredAt: '2024.03.01', fansCount: '-', friendsCount: '128', groupsCount: '32', integrity: 60, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 3, accountType: '声（中）', isSampled: '是', sampleResult: '-', platform: 'Signal', accountNo: '-', version: 'h3334', location: 'A类', nickname: 'user3', accountId: '-', url: '-', region: '美国', registeredAt: '2024.03.01', fansCount: '-', friendsCount: '88', groupsCount: '45', integrity: 75, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 4, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'Line', accountNo: '-', version: 'h3335', location: 'A类', nickname: 'user4', accountId: '-', url: '-', region: '美国', registeredAt: '2024.03.01', fansCount: '-', friendsCount: '256', groupsCount: '18', integrity: 80, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 5, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'Skype', accountNo: '-', version: 'h3336', location: 'A类', nickname: 'user5', accountId: '-', url: '-', region: '美国', registeredAt: '2024.03.01', fansCount: '-', friendsCount: '156', groupsCount: '28', integrity: 90, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' }
])

const handleSearch = () => {
  console.log('搜索:', filters.value)
}
</script>

<template>
  <div class="instant-messaging-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用SummaryCards组件 -->
        <summary-cards :cards="cards" />

        <data-table
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :platform-options="platformOptions"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @update:page-size="val => pageSize = val"
          @update:current-page="val => currentPage = val"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.instant-messaging-page {
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
