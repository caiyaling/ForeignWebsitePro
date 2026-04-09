<script setup>
import { ref, reactive } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Sidebar from './components/Sidebar.vue'
import SummaryCards from './components/SummaryCards.vue'
import DataTable from './components/DataTable.vue'

// 博客论坛表格列配置
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
  { prop: 'integrity', label: '账号信息完善度', width: 130, type: 'progress' },
  { prop: 'delivery', label: '交付方', width: 100 },
  { prop: 'latestStatus', label: '最新状态', width: 100, type: 'status' },
  { prop: 'updatedAt', label: '更新时间', width: 120 },
  { prop: 'action', label: '操作', width: 120, type: 'action' }
]

const platformOptions = ['PPT', 'Dcard', 'Pixnet']

const cards = [
  {
    name: 'PPT',
    total: '12,584',
    icon: '/figma/blog-ppt.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Dcard',
    total: '12,584',
    icon: '/figma/blog-dcard.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Pixnet',
    total: '12,584',
    icon: '/figma/blog-pixnet.svg',
    variant: 'warm',
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
  { id: 1, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'PPT', accountNo: 'BF001', version: 'v1.0', location: 'A类', nickname: 'user1', accountId: 'PPT12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 50, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 2, accountType: '发声（高）', isSampled: '是', sampleResult: '-', platform: 'Dcard', accountNo: 'BF002', version: 'v1.0', location: 'A类', nickname: 'user2', accountId: 'DC12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 60, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 3, accountType: '发声（中）', isSampled: '是', sampleResult: '-', platform: 'Pixnet', accountNo: 'BF003', version: 'v1.0', location: 'A类', nickname: 'user3', accountId: 'PX12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 75, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 4, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'PPT', accountNo: 'BF004', version: 'v2.0', location: 'B类', nickname: 'user4', accountId: 'PPT67890', url: '-', region: '台湾', registeredAt: '2024.02.15', integrity: 80, delivery: 'team2', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 5, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'Dcard', accountNo: 'BF005', version: 'v1.5', location: 'A类', nickname: 'user5', accountId: 'DC67890', url: '-', region: '台湾', registeredAt: '2024.02.20', integrity: 90, delivery: 'team2', latestStatus: '正常', updatedAt: '2024.03.03' }
])

const handleSearch = () => {
  console.log('搜索:', filters.value)
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
